import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { Mascot } from './Mascot';
import { soundEngine } from '../utils/audio';
import type { TutorReport } from '../engine/tutorDiagnostics';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  recommendationLink?: {
    lessonId: number;
    label: string;
  };
}

interface AITutorChatProps {
  report: TutorReport | null;
  onNavigateToLesson?: (lessonId: number) => void;
}

const QUICK_PROMPTS = [
  'How do I type numbers faster?',
  'Why am I struggling with my weak keys?',
  'How do I break past 60 WPM?',
  'What is the correct finger posture?',
];

export const AITutorChat: React.FC<AITutorChatProps> = ({
  report,
  onNavigateToLesson,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content:
        "Hello! I'm your AI Typing Tutor. Ask me anything about finger placement, speed strategies, or your recent stats!",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
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

  // Intelligent Contextual Response Generator
  const generateMockAIResponse = (userPrompt: string): { content: string; lessonLink?: { lessonId: number; label: string } } => {
    const p = userPrompt.toLowerCase();

    // 1. Number row questions
    if (p.includes('number') || p.includes('digit') || p.includes('123')) {
      return {
        content:
          "To type numbers faster without looking down, use your home row as anchor points! Left Pinky reaches for 1, Left Ring for 2, Left Middle for 3, Left Index for 4 & 5. Right Index hits 6 & 7, Right Middle 8, Right Ring 9, and Right Pinky 0. Practice keeping your wrists steady rather than shifting your whole hand!",
        lessonLink: { lessonId: 245, label: 'Number Row Drills' },
      };
    }

    // 2. Weak key questions
    if (p.includes('weak') || p.includes('flaw') || p.includes('struggle') || p.includes('error') || p.includes('stat')) {
      if (report && report.flaws.length > 0) {
        const topFlaw = report.flaws[0];
        return {
          content: `Looking at your diagnostic data, your primary weak spot is ${topFlaw.label} with a ${Math.round(topFlaw.errorRate * 100)}% miss rate on keys [${topFlaw.keys.join(', ').toUpperCase()}]. ${topFlaw.recommendation}`,
          lessonLink: topFlaw.replayLessonStart
            ? { lessonId: topFlaw.replayLessonStart, label: `Replay: ${topFlaw.replayLabel}` }
            : undefined,
        };
      }
      return {
        content:
          "Your current accuracy looks solid! To eliminate lingering weak keys, try slowing down by just 5 WPM to focus purely on 100% precision. Accuracy builds muscle memory, which creates effortless speed later.",
      };
    }

    // 3. Speed / WPM questions
    if (p.includes('fast') || p.includes('speed') || p.includes('wpm') || p.includes('stamina')) {
      return {
        content:
          "Speed isn't about frantic finger sprinting — it's about rhythmic cadence! Consistent, uninterrupted typing at 50 WPM beats typing at 80 WPM with frequent backspaces. Focus on reading 1 to 2 words ahead of what your fingers are currently striking.",
      };
    }

    // 4. Posture and ergonomics
    if (p.includes('posture') || p.includes('finger') || p.includes('hand') || p.includes('wrist') || p.includes('pain')) {
      return {
        content:
          "Keep your wrists hovering slightly above the keyboard or desk — never rest your wrists heavily while typing! Curve your fingers naturally as if holding a tennis ball, and strike keys with the fleshy pads of your fingertips.",
      };
    }

    // 5. Pinky finger questions
    if (p.includes('pinky') || p.includes('pinkie') || p.includes('q') || p.includes('p') || p.includes('shift')) {
      return {
        content:
          "Pinkies are naturally the weakest fingers because they share tendons with the ring fingers. Strengthen them by pivoting lightly at the wrist when reaching for Q, P, or Shift rather than stretching the finger alone.",
        lessonLink: { lessonId: 24, label: 'Top Row Reaches' },
      };
    }

    // Fallback response
    return {
      content:
        `Great question! Consistent daily 15-minute practice sessions are 3x more effective than one long weekly marathon. Keep your eyes locked on the screen, trust your tactile muscle memory, and let the rhythm carry you! 🐂✨`,
    };
  };

  // Send message handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputValue).trim();
    if (!textToSend || isTyping) return;

    soundEngine.playPop();

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulated Generative AI API Call with 1.5s delay
    setTimeout(() => {
      const { content, lessonLink } = generateMockAIResponse(textToSend);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: Date.now(),
        recommendationLink: lessonLink,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      soundEngine.playStarEarn();
    }, 1500);
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
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>BullBot</span>
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
                    <span>Open {msg.recommendationLink.label}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* ─── Animated Typing Indicator ──────────────────────── */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-start gap-2.5"
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-600/50 flex items-center justify-center shadow-xs">
                  <Mascot mood="thinking" size="xs" />
                </div>
              </div>
              <div className="bg-white/85 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/70 p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1.5">BullBot is thinking</span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-purple-500"
                />
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                />
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-pink-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Suggestion Chips ───────────────────────────── */}
      <div className="pt-2 pb-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-slate-200/70 dark:border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          Suggestions:
        </span>
        {QUICK_PROMPTS.map((prompt) => (
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
            placeholder="Ask BullBot a question (e.g. 'How do I type numbers faster?')..."
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
