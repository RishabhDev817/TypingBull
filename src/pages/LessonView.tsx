import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, RotateCcw, Star, CheckCircle2,
  BookOpen, Sparkles, Trophy, Lightbulb, Compass, Zap, Brain
} from 'lucide-react';
import { getLessonById, LESSONS } from '../data/lessonData';
import { getChapterByLessonId } from '../data/curriculum';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { saveLessonProgress, getLessonProgressById } from '../engine/sessionStore';
import { KeyboardDiagram } from '../components/keyboard/KeyboardDiagram';
import { soundEngine } from '../utils/audio';
import { Mascot } from '../components/Mascot';
import type { MascotMood } from '../components/Mascot';
import { AITutorReport } from '../components/AITutorReport';
import type { SessionResult } from '../engine/typingEngine';
import { useI18n } from '../context/I18nContext';
import { getLocalizedLesson, getLocalizedChapter } from '../data/curriculumI18n';

type LessonState = 'ready' | 'typing' | 'completed';

export const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { t, currentLang } = useI18n();
  const rawLesson = getLessonById(Number(lessonId));
  const rawChapter = rawLesson ? getChapterByLessonId(rawLesson.id) : undefined;
  const lesson = rawLesson ? getLocalizedLesson(rawLesson, currentLang) : undefined;
  const chapter = rawChapter ? getLocalizedChapter(rawChapter, currentLang) : undefined;

  const isReadingLesson = lesson?.type === 'introduction' || lesson?.type === 'tip' || (lesson?.type === 'travel' && !lesson.content);

  const [lessonState, setLessonState] = useState<LessonState>('ready');
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [lastSessionResult, setLastSessionResult] = useState<SessionResult | null>(null);

  const content = lesson?.content || '';

  const engine = useTypingEngine({
    mode: 'lesson',
    modeDetail: `lesson-${lessonId}`,
    content,
    autoSave: true,
  });

  const focusInput = useCallback(() => {
    if (!isReadingLesson) {
      hiddenInputRef.current?.focus();
      setIsFocused(true);
    }
  }, [isReadingLesson]);

  useEffect(() => {
    focusInput();
  }, [focusInput, lessonState]);

  useEffect(() => {
    if (lessonState === 'typing' && charIndex < content.length) {
      setActiveKey(content[charIndex]);
    } else {
      setActiveKey('');
    }
  }, [charIndex, content, lessonState]);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-white">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-300">Lesson not found.</p>
          <button
            onClick={() => navigate('/learn')}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  // Mascot mood based on typing state
  const getMascotMood = (): MascotMood => {
    if (lessonState === 'completed') return engine.metrics.accuracy >= lesson.passingAccuracy ? 'cheering' : 'sad';
    if (consecutiveErrors >= 3) return 'sad';
    if (engine.streak >= 10) return 'happy';
    if (lessonState === 'typing') return 'typing';
    return 'idle';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lessonState === 'completed' || isReadingLesson) return;
    if (lessonState === 'ready') setLessonState('typing');
    if (e.key === 'Escape') { navigate('/learn'); return; }
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    e.preventDefault();

    if (e.key === 'Backspace') {
      engine.recordKeystroke('Backspace', '', true);
      if (charIndex > 0) {
        setCharIndex(charIndex - 1);
        const newErrors = new Set(errors);
        newErrors.delete(charIndex - 1);
        setErrors(newErrors);
      }
      return;
    }

    const expected = content[charIndex];
    if (!expected) return;
    engine.recordKeystroke(e.key, expected);

    if (e.key === expected) {
      soundEngine.playClick(e.key === ' ');
      setConsecutiveErrors(0);
    } else {
      soundEngine.playError();
      const newErrors = new Set(errors);
      newErrors.add(charIndex);
      setErrors(newErrors);
      setConsecutiveErrors(prev => prev + 1);
    }

    const nextIndex = charIndex + 1;
    setCharIndex(nextIndex);

    if (nextIndex >= content.length) {
      const result = engine.completeSession();
      if (result) {
        let starsEarned = 0;
        if (result.accuracy >= lesson.starThresholds[0]) starsEarned = 1;
        if (result.accuracy >= lesson.starThresholds[1]) starsEarned = 2;
        if (result.accuracy >= lesson.starThresholds[2]) starsEarned = 3;
        saveLessonProgress({
          lessonId: lesson.id,
          completed: result.accuracy >= lesson.passingAccuracy,
          bestAccuracy: result.accuracy,
          bestWpm: result.wpm,
          starsEarned,
          attempts: 1,
        });
        soundEngine.playVictory();

        // Store session result for AI Tutor
        setLastSessionResult(result);

        // Auto-open AI Tutor on fail
        if (result.accuracy < lesson.passingAccuracy) {
          setTimeout(() => setTutorOpen(true), 600);
        }
      }
      setLessonState('completed');
    }
  };

  const handleRestart = () => {
    soundEngine.playPop();
    engine.reset();
    setCharIndex(0);
    setErrors(new Set());
    setConsecutiveErrors(0);
    setLessonState('ready');
    setTimeout(focusInput, 50);
  };

  const handleCompleteReadingLesson = () => {
    soundEngine.playVictory();
    saveLessonProgress({
      lessonId: lesson.id,
      completed: true,
      bestAccuracy: 100,
      bestWpm: lesson.wpmGoal || 20,
      starsEarned: 3,
      attempts: 1,
    });
    if (hasNextLesson) {
      navigate(`/learn/${nextLessonId}`);
    } else {
      navigate('/learn');
    }
  };

  const passed = engine.metrics.accuracy >= lesson.passingAccuracy;
  const nextLessonId = lesson.id + 1;
  const hasNextLesson = LESSONS.some(l => l.id === nextLessonId);

  let displayStars = 0;
  if (engine.metrics.accuracy >= lesson.starThresholds[0]) displayStars = 1;
  if (engine.metrics.accuracy >= lesson.starThresholds[1]) displayStars = 2;
  if (engine.metrics.accuracy >= lesson.starThresholds[2]) displayStars = 3;

  // Type badge styling
  const getTypeBadge = () => {
    switch (lesson.type) {
      case 'introduction':
        return { label: t('lesson.introduction'), icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-sky-500/20 text-sky-300 border-sky-400/40' };
      case 'tip':
        return { label: t('lesson.introduction'), icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      case 'travel':
        return { label: t('lesson.fingerTravel'), icon: <Compass className="w-3.5 h-3.5" />, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' };
      case 'play':
        return { label: t('lesson.gamifiedPlay'), icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      case 'paragraph':
        return { label: t('lesson.thematicParagraph'), icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
      case 'test':
        return { label: t('lesson.speedAssessment'), icon: <Trophy className="w-3.5 h-3.5" />, color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' };
      default:
        return { label: t('lesson.skillDrill'), icon: <Zap className="w-3.5 h-3.5" />, color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
    }
  };

  const badge = getTypeBadge();
  const existingProgress = getLessonProgressById(lesson.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-5 text-slate-100">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundEngine.playPop(); navigate('/learn'); }}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-bold transition-all bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-md cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('lesson.backToMap')}
        </motion.button>

        <div className="flex items-center gap-3">
          <Mascot mood={getMascotMood()} size="xs" />
          <div className="text-right">
            <span className="text-xs font-extrabold text-white block">
              {t('lesson.lessonNum', { n: lesson.id })} <span className="text-slate-400 font-normal">/ {LESSONS.length}</span>
            </span>
            {chapter && (
              <span className="text-[10px] font-bold text-sky-300 block">
                {chapter.icon} {chapter.title}
              </span>
            )}
          </div>

          {!isReadingLesson && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-bold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t('lesson.restart')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Lesson header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-extrabold mb-2 backdrop-blur-md shadow-sm" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
          {lesson.wpmGoal && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold">
              {t('lesson.goal', { wpm: lesson.wpmGoal })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{lesson.icon}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{lesson.title}</h2>
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium mt-1">
          {lesson.description}
        </p>
      </div>

      {/* ─── SPECIAL VIEW: READING / TIP / TRAVEL INFO LESSON ────────── */}
      {isReadingLesson ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-game p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-sky-400/30 backdrop-blur-2xl shadow-2xl flex flex-col gap-6"
        >
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-sky-950/40 border border-sky-400/20">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shrink-0">
              {lesson.icon}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-sky-200 mb-1">
                {lesson.title}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {lesson.tipContent || lesson.description}
              </p>
            </div>
          </div>

          {lesson.fingerGuide && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-950/40 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>{t('lesson.assignedFinger')} <strong className="text-white">{lesson.fingerGuide}</strong></span>
            </div>
          )}

          {lesson.targetKeys.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 text-center">
                {t('lesson.targetCoordinates')}
              </div>
              <KeyboardDiagram
                highlightKeys={lesson.targetKeys}
                activeKey=""
                compact
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-xs text-slate-400">
              {existingProgress?.completed ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> {t('lesson.completedStars')}
                </span>
              ) : (
                <span>{t('lesson.readGuideline')}</span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCompleteReadingLesson}
              className="btn-chunky btn-chunky-green text-sm px-6 py-3 flex items-center gap-2 cursor-pointer"
            >
              <span>{hasNextLesson ? t('lesson.gotIt') : t('lesson.finishChapter')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* ─── LIVE METRICS FOR TYPING LESSONS ───────────────────────── */}
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {[
              { label: 'WPM', value: engine.metrics.wpm, color: '#38BDF8' },
              {
                label: 'Accuracy',
                value: `${engine.metrics.accuracy.toFixed(1)}%`,
                color: engine.metrics.accuracy >= lesson.passingAccuracy ? '#4ADE80' : '#F87171',
              },
              {
                label: 'Progress',
                value: `${Math.round((charIndex / Math.max(1, content.length)) * 100)}%`,
                color: '#FBBF24',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center bg-slate-900/60 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md min-w-[90px]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color }}>{label}</span>
                <span className="text-xl font-black text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Typing area */}
          <div
            onClick={focusInput}
            className="relative card-game p-6 md:p-8 font-mono min-h-[160px] cursor-text select-none rounded-3xl bg-slate-900/90 border border-sky-400/25 shadow-2xl backdrop-blur-2xl"
          >
            <input
              ref={hiddenInputRef}
              type="text"
              onKeyDown={handleKeyDown}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              className="absolute opacity-0 pointer-events-none"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            {/* Focus overlay */}
            {!isFocused && lessonState !== 'completed' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20 rounded-3xl">
                <Mascot mood="idle" size="sm" />
                <p className="text-sm font-extrabold text-white">Click here to start typing!</p>
                <p className="text-xs text-slate-400 font-semibold">Press Esc anytime to return to the map</p>
              </div>
            )}

            {/* Content text display */}
            <div className="text-base md:text-lg leading-loose select-none font-mono">
              <div className="flex flex-wrap gap-y-1">
                {content.split('').map((char, idx) => {
                  let textColor = '#64748B';
                  let bgClass = '';

                  if (idx < charIndex) {
                    if (errors.has(idx)) {
                      textColor = '#F87171';
                      bgClass = 'bg-rose-500/20 rounded px-0.5';
                    } else {
                      textColor = '#4ADE80';
                    }
                  } else if (idx === charIndex) {
                    textColor = '#F8FAFC';
                  }

                  return (
                    <span
                      key={idx}
                      className={`relative transition-colors duration-75 ${bgClass}`}
                      style={{ color: textColor }}
                    >
                      {idx === charIndex && isFocused && (
                        <motion.span
                          className="absolute -left-[1px] top-[2px] bottom-[2px] w-[2.5px] rounded-full bg-emerald-400"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                      )}
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyboard diagram */}
          {lesson.targetKeys && lesson.targetKeys.length > 0 && (
            <div className="card-game p-4 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-xl">
              <KeyboardDiagram
                highlightKeys={lesson.targetKeys}
                activeKey={activeKey}
                errorKeys={Array.from(errors).map(i => content[i]).filter(Boolean)}
                compact
              />
            </div>
          )}
        </>
      )}

      {/* Completion overlay for typed lessons */}
      <AnimatePresence>
        {lessonState === 'completed' && !isReadingLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 140 }}
              className="card-game p-8 max-w-md w-full text-center relative bg-slate-900 border border-sky-400/30 rounded-3xl shadow-2xl text-white"
            >
              <Mascot mood={passed ? 'cheering' : 'sad'} size="lg" className="mx-auto mb-3" />

              <h2 className="text-2xl font-black text-white mb-1">
                {passed ? `🎉 ${t('lesson.completedStars')}` : `💪 ${t('practice.practice')}`}
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                {passed
                  ? (currentLang === 'es' ? '¡Excelente digitación! Sigue con ese ritmo.' :
                     currentLang === 'ja' ? '素晴らしいタイピングです！その調子で続けましょう。' :
                     currentLang === 'fr' ? 'Superbe frappe ! Gardez le rythme.' :
                     currentLang === 'de' ? 'Hervorragendes Tippen! Weiter so.' :
                     currentLang === 'pt' ? 'Ótima digitação! Mantenha o ritmo.' :
                     currentLang === 'ko' ? '훌륭한 타이핑입니다! 계속 힘내세요.' :
                     currentLang === 'it' ? 'Ottima digitazione! Continua così.' :
                     currentLang === 'hi' ? 'शानदार टाइपिंग! इसी गति को बनाए रखें।' :
                     'Great typing! Keep up the momentum.')
                  : (currentLang === 'es' ? `Necesitas ${lesson.passingAccuracy}% de precisión para aprobar. Obtuviste ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'ja' ? `合格には精度 ${lesson.passingAccuracy}% が必要です。結果: ${engine.metrics.accuracy.toFixed(1)}%` :
                     currentLang === 'fr' ? `Vous avez besoin de ${lesson.passingAccuracy}% de précision pour réussir. Obtenu : ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'de' ? `Sie benötigen ${lesson.passingAccuracy}% Genauigkeit. Erreicht: ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'pt' ? `Você precisa de ${lesson.passingAccuracy}% de precisão para passar. Conseguiu ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'ko' ? `통과하려면 ${lesson.passingAccuracy}% 정확도가 필요합니다. 달성: ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'it' ? `Serve il ${lesson.passingAccuracy}% di precisione per superare. Ottenuto: ${engine.metrics.accuracy.toFixed(1)}%.` :
                     currentLang === 'hi' ? `पास होने के लिए ${lesson.passingAccuracy}% सटीकता चाहिए। आपने प्राप्त किया ${engine.metrics.accuracy.toFixed(1)}%।` :
                     `You need ${lesson.passingAccuracy}% accuracy to pass. You got ${engine.metrics.accuracy.toFixed(1)}%.`)}
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-5">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: s * 0.15, type: 'spring', stiffness: 200 }}
                  >
                    <Star
                      className={`w-10 h-10 ${s <= displayStars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                      style={s <= displayStars ? { filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.6))' } : {}}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: t('lesson.speed'), value: `${engine.metrics.wpm} WPM`, color: '#38BDF8' },
                  { label: t('lesson.accuracy'), value: `${engine.metrics.accuracy.toFixed(1)}%`, color: '#4ADE80' },
                  { label: t('lesson.streak'), value: engine.maxStreak, color: '#FBBF24' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-2xl bg-slate-800/80 border border-white/10">
                    <span className="text-[10px] font-extrabold uppercase block" style={{ color }}>{label}</span>
                    <span className="text-lg font-black text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* AI Tutor Report Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { soundEngine.playPop(); setTutorOpen(true); }}
                className="w-full mb-3 py-2.5 rounded-2xl text-xs font-black text-purple-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))',
                  border: '1.5px solid rgba(139, 92, 246, 0.35)',
                }}
              >
                <Brain className="w-3.5 h-3.5" />
                📊 {t('lesson.aiReport')}
              </motion.button>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleRestart}
                  className="flex-1 btn-chunky btn-chunky-orange text-sm py-3 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" /> {t('lesson.replay')}
                </motion.button>
                {passed && hasNextLesson ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      soundEngine.playPop();
                      navigate(`/learn/${nextLessonId}`);
                      setLessonState('ready');
                      setCharIndex(0);
                      setErrors(new Set());
                      setConsecutiveErrors(0);
                    }}
                    className="flex-1 btn-chunky btn-chunky-green text-sm py-3 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{t('lesson.nextLesson')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => { soundEngine.playPop(); navigate('/learn'); }}
                    className="flex-1 btn-chunky btn-chunky-blue text-sm py-3 cursor-pointer"
                  >
                    {t('lesson.backToMap')} 🗺️
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tutor Report Modal */}
      <AITutorReport
        sessionResult={lastSessionResult}
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        targetWpm={lesson.wpmGoal || chapter?.wpmGoal || 30}
        showReplayButtons={true}
      />
    </div>
  );
};

export default LessonView;
