import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, Lightbulb, Bot } from 'lucide-react';
import { Mascot } from './Mascot';
import { soundEngine } from '../utils/audio';
import { useI18n } from '../context/I18nContext';
import { CHAT_I18N } from '../i18n/tutorTranslations';
import type { TutorReport } from '../engine/tutorDiagnostics';
import type { SessionResult } from '../engine/typingEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  recommendationLink?: {
    lessonId: number;
    label: string;
  };
}

/** Gemini API chat history format */
export interface GeminiHistoryMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface UserStatsPayload {
  currentWPM?: number;
  targetWPM?: number;
  accuracy?: number;
  grade?: string;
  errorMap?: Record<string, number>;
  flaws?: Array<{
    id: string;
    label: string;
    keys: string[];
    errorRate: number;
    severity: string;
    recommendation: string;
  }>;
  stamina?: {
    dropOffPercent: number;
    verdict: string;
    message: string;
  };
}

interface AITutorChatProps {
  report: TutorReport | null;
  sessionResult?: SessionResult | null;
  onNavigateToLesson?: (lessonId: number) => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  report,
  sessionResult,
  onNavigateToLesson,
}) => {
  const { currentLang } = useI18n();
  const chatUi = CHAT_I18N[currentLang] || CHAT_I18N.en;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_msg',
      role: 'model',
      content: (CHAT_I18N[currentLang] || CHAT_I18N.en).welcome,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update welcome message if language switches before user sends messages
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome_msg') {
        return [{
          ...prev[0],
          content: chatUi.welcome,
        }];
      }
      return prev;
    });
  }, [currentLang, chatUi.welcome]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat whenever messages or typing state updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /** Build live user typing statistics context payload for Gemini */
  const buildUserStatsPayload = (): UserStatsPayload | undefined => {
    if (!report && !sessionResult) return undefined;

    return {
      currentWPM: report?.averageWpm ?? sessionResult?.wpm,
      targetWPM: report?.targetWpm,
      accuracy: sessionResult?.accuracy ?? (report ? 100 : undefined),
      grade: report?.grade,
      errorMap: report?.keyHeatmap ?? sessionResult?.perKeyErrors,
      flaws: report?.flaws.map((f) => ({
        id: f.id,
        label: f.label,
        keys: f.keys,
        errorRate: f.errorRate,
        severity: f.severity,
        recommendation: f.recommendation,
      })),
      stamina: report?.stamina
        ? {
            dropOffPercent: report.stamina.dropOffPercent,
            verdict: report.stamina.verdict,
            message: report.stamina.message,
          }
        : undefined,
    };
  };

  /** Format conversation history into Gemini standard structure */
  const formatHistoryForGemini = (
    chatMessages: ChatMessage[]
  ): GeminiHistoryMessage[] => {
    const formatted = chatMessages.map((msg) => ({
      role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: msg.content }],
    }));

    // Gemini requires chat history to start with a user message
    let startIdx = 0;
    while (startIdx < formatted.length && formatted[startIdx].role !== 'user') {
      startIdx++;
    }
    return formatted.slice(startIdx);
  };

  // Send message handler using real Google Gemini API
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputValue).trim();
    if (!textToSend || isTyping) return;

    soundEngine.playPop();

    // 1. Add user message to UI state
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsTyping(true);

    // 2. Prepare Gemini payload with chat history and user typing stats
    const chatHistory = formatHistoryForGemini(newHistory);
    const userData = buildUserStatsPayload();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory,
          userData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || data.text;

      if (!replyContent || typeof replyContent !== 'string') {
        throw new Error('INVALID_RESPONSE');
      }

      // Check if message recommends a specific replay lesson from flaws
      let matchedLesson: { lessonId: number; label: string } | undefined;
      if (report && report.flaws.length > 0) {
        const topFlaw = report.flaws[0];
        if (
          topFlaw.replayLessonStart &&
          replyContent.toLowerCase().includes(topFlaw.label.toLowerCase())
        ) {
          matchedLesson = {
            lessonId: topFlaw.replayLessonStart,
            label: `${chatUi.openLesson}: ${topFlaw.replayLabel}`,
          };
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: Date.now(),
        recommendationLink: matchedLesson,
      };

      setMessages((prev) => [...prev, aiMsg]);
      soundEngine.playStarEarn();
    } catch (err) {
      console.error('[BullBot API Connection Error]:', err);

      // Fallback message strictly required by specifications
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: 'model',
        content: chatUi.fallbackError,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[460px] sm:h-[480px]">
      {/* ─── Scrollable Message History Area ───────────────────── */}
      <div className="flex-1 overflow-y-auto tutor-scrollbar pr-1 space-y-3.5 pb-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Mascot Avatar (only on assistant messages) */}
              {!isUser && (
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-600/50 flex items-center justify-center shadow-xs">
                    <Mascot mood="idle" size="xs" />
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white/85 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/70 text-slate-800 dark:text-slate-100 rounded-tl-xs backdrop-blur-md'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>BullBot</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-1 py-0.2 rounded bg-purple-100/60 dark:bg-purple-950/40">
                      Gemini 1.5 Flash
                    </span>
                  </div>
                )}

                <p className="font-medium whitespace-pre-wrap">{msg.content}</p>

                {/* Optional Lesson Recommendation deep-link card */}
                {msg.recommendationLink && onNavigateToLesson && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigateToLesson(msg.recommendationLink!.lessonId)}
                    className="mt-2.5 w-full px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{msg.recommendationLink.label}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* ─── Animated Pulsing Typing Bubble Indicator ──────────────── */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              className="flex items-start gap-2.5"
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-600/50 flex items-center justify-center shadow-xs animate-pulse">
                  <Mascot mood="thinking" size="xs" />
                </div>
              </div>
              <div className="bg-white/85 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/70 p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2 backdrop-blur-md">
                <Bot className="w-3.5 h-3.5 text-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{chatUi.thinking}</span>
                <div className="flex items-center gap-1 ml-1">
                  <motion.span
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-purple-500"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full bg-pink-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Suggestion Chips ───────────────────────────── */}
      <div className="pt-2 pb-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-slate-200/70 dark:border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          {chatUi.suggestions}
        </span>
        {chatUi.quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            disabled={isTyping}
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/70 hover:bg-purple-50 dark:bg-slate-800/70 dark:hover:bg-purple-950/40 border border-slate-200/90 dark:border-slate-700/70 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 transition-all cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ─── Input Area Docked At Bottom ─────────────────────── */}
      <div className="pt-1">
        <div className="p-2 pl-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border-2 border-slate-200/90 dark:border-slate-700/80 shadow-sm flex items-center gap-2 focus-within:border-purple-500/70 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder={chatUi.placeholder}
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm cursor-pointer transition-all shrink-0"
            title="Send Message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AITutorChat;
