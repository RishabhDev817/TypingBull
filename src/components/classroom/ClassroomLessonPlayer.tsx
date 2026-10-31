import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Star,
  Compass,
  GraduationCap,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import type { LessonDef } from '../../data/lessonData';
import { getLessonById, TOTAL_LESSONS } from '../../data/lessonData';
import { getChapterByLessonId } from '../../data/curriculum';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { KeyboardDiagram } from '../keyboard/KeyboardDiagram';
import { soundEngine } from '../../utils/audio';
import { Mascot } from '../Mascot';
import type { MascotMood } from '../Mascot';
import type { StudentProgressUpdate, StudentFinishPayload, ClassroomAssignment } from '../../types/classroom';

interface Props {
  lesson: LessonDef;
  teacherName: string;
  assignments?: ClassroomAssignment[];
  onProgressUpdate: (update: StudentProgressUpdate, lessonId?: number, assignmentId?: string) => void;
  onFinish: (payload: StudentFinishPayload, lessonId?: number, assignmentId?: string) => void;
  onClose: () => void;
  onSelectNextLesson?: (nextLesson: LessonDef) => void;
}

type LessonState = 'ready' | 'typing' | 'completed';

export const ClassroomLessonPlayer: React.FC<Props> = ({
  lesson: initialLesson,
  teacherName,
  assignments = [],
  onProgressUpdate,
  onFinish,
  onClose,
  onSelectNextLesson,
}) => {
  const [currentLesson, setCurrentLesson] = useState<LessonDef>(initialLesson);

  useEffect(() => {
    setCurrentLesson(initialLesson);
  }, [initialLesson]);

  const currentAssignmentIndex = useMemo(() => {
    if (!assignments || assignments.length === 0) return -1;
    return assignments.findIndex((a) => a.lessonId === currentLesson.id);
  }, [assignments, currentLesson.id]);

  const currentAssignment = currentAssignmentIndex >= 0 ? assignments[currentAssignmentIndex] : null;

  const nextAssignment = useMemo(() => {
    if (!assignments || currentAssignmentIndex === -1 || currentAssignmentIndex >= assignments.length - 1) {
      return null;
    }
    return assignments[currentAssignmentIndex + 1];
  }, [assignments, currentAssignmentIndex]);

  const chapter = getChapterByLessonId(currentLesson.id);
  const isReadingLesson =
    currentLesson.type === 'introduction' ||
    currentLesson.type === 'tip' ||
    (currentLesson.type === 'travel' && !currentLesson.content);

  const [lessonState, setLessonState] = useState<LessonState>('ready');
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  const content = currentLesson.content || '';
  const totalChars = content.length;

  const engine = useTypingEngine({
    mode: 'lesson',
    modeDetail: `classroom-lesson-${currentLesson.id}`,
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
  }, [focusInput, lessonState, currentLesson.id]);

  useEffect(() => {
    if (lessonState === 'typing' && charIndex < content.length) {
      setActiveKey(content[charIndex]);
    } else {
      setActiveKey('');
    }
  }, [charIndex, content, lessonState]);

  const getMascotMood = (): MascotMood => {
    if (lessonState === 'completed') {
      return engine.metrics.accuracy >= currentLesson.passingAccuracy ? 'cheering' : 'sad';
    }
    if (consecutiveErrors >= 3) return 'sad';
    if (engine.streak >= 10) return 'happy';
    if (lessonState === 'typing') return 'typing';
    return 'idle';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lessonState === 'completed' || isReadingLesson) return;
    if (lessonState === 'ready') setLessonState('typing');
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    e.preventDefault();

    if (e.key === 'Backspace') {
      engine.recordKeystroke('Backspace', '', true);
      if (charIndex > 0) {
        const prevIndex = charIndex - 1;
        setCharIndex(prevIndex);
        const newErrors = new Set(errors);
        newErrors.delete(prevIndex);
        setErrors(newErrors);
      }
      return;
    }

    const expected = content[charIndex];
    if (!expected) return;
    engine.recordKeystroke(e.key, expected);

    const isMatch = e.key === expected;
    if (isMatch) {
      soundEngine.playClick(e.key === ' ');
      setConsecutiveErrors(0);
    } else {
      soundEngine.playError();
      const newErrors = new Set(errors);
      newErrors.add(charIndex);
      setErrors(newErrors);
      setConsecutiveErrors((prev) => prev + 1);
    }

    const nextIndex = charIndex + 1;
    setCharIndex(nextIndex);

    // Compute progress & real-time telemetry
    const progress = Math.min(1, nextIndex / Math.max(1, totalChars));
    const currentCorrect = Math.max(0, nextIndex - (errors.size + (isMatch ? 0 : 1)));
    const liveWpm = engine.metrics.wpm;
    const liveAccuracy = engine.metrics.accuracy;

    onProgressUpdate(
      {
        progress,
        wpm: liveWpm,
        accuracy: liveAccuracy,
        correctChars: currentCorrect,
        incorrectChars: errors.size + (isMatch ? 0 : 1),
        totalChars: nextIndex,
      },
      currentLesson.id,
      currentAssignment?.assignmentId
    );

    // Check completion
    if (nextIndex >= content.length) {
      const result = engine.completeSession();
      const finalWpm = result?.wpm ?? liveWpm;
      const finalAcc = result?.accuracy ?? liveAccuracy;

      soundEngine.playVictory();
      setLessonState('completed');

      onFinish(
        {
          wpm: finalWpm,
          accuracy: finalAcc,
          correctChars: currentCorrect,
          incorrectChars: errors.size,
          totalChars: content.length,
          timeSpentSec: Math.max(1, Math.round((result?.durationMs ?? engine.metrics.elapsedMs) / 1000)),
        },
        currentLesson.id,
        currentAssignment?.assignmentId
      );
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
    onProgressUpdate(
      {
        progress: 1,
        wpm: 20,
        accuracy: 100,
        correctChars: 20,
        incorrectChars: 0,
        totalChars: 20,
      },
      currentLesson.id,
      currentAssignment?.assignmentId
    );
    onFinish(
      {
        wpm: 20,
        accuracy: 100,
        correctChars: 20,
        incorrectChars: 0,
        totalChars: 20,
        timeSpentSec: 10,
      },
      currentLesson.id,
      currentAssignment?.assignmentId
    );

    // Auto-advance to next assignment if available, or next sequential drill
    if (nextAssignment) {
      const nextL = getLessonById(nextAssignment.lessonId);
      if (nextL) {
        setCurrentLesson(nextL);
        engine.reset();
        setCharIndex(0);
        setErrors(new Set());
        setLessonState('ready');
        onSelectNextLesson?.(nextL);
        return;
      }
    }

    const nextLesson = getLessonById(currentLesson.id + 1);
    if (nextLesson && nextLesson.content) {
      setCurrentLesson(nextLesson);
      engine.reset();
      setCharIndex(0);
      setErrors(new Set());
      setLessonState('ready');
      onSelectNextLesson?.(nextLesson);
    } else {
      setLessonState('completed');
    }
  };

  const handleProceedToNextLesson = () => {
    if (!nextAssignment) return;
    const nextLesson = getLessonById(nextAssignment.lessonId);
    if (!nextLesson) return;
    soundEngine.playPop();
    setCurrentLesson(nextLesson);
    engine.reset();
    setCharIndex(0);
    setErrors(new Set());
    setConsecutiveErrors(0);
    setLessonState('ready');
    onSelectNextLesson?.(nextLesson);
    setTimeout(focusInput, 50);
  };

  const progressPercent = Math.min(100, Math.round((charIndex / Math.max(1, totalChars)) * 100));
  const passed = engine.metrics.accuracy >= currentLesson.passingAccuracy;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 select-none">
      {/* ─── CLASSROOM CONTEXT TOP BAR ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Return to classroom lobby"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Classroom Lobby</span>
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                Classroom Assignment
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Step {currentLesson.id} of {TOTAL_LESSONS} • {chapter?.title || 'Learn Curriculum'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Assigned by your teacher, <strong className="text-slate-700 dark:text-slate-200">{teacherName}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {currentLesson.targetKeys && currentLesson.targetKeys.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400">Target Keys:</span>
              {currentLesson.targetKeys.map((k) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-black border border-blue-200 dark:border-blue-800 shadow-xs"
                >
                  {k === ' ' ? 'Space' : k.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {!isReadingLesson && (
            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              title="Restart Drill"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Heading Card */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black mb-2 text-slate-700 dark:text-slate-300">
          <span>{currentLesson.icon}</span>
          <span className="uppercase tracking-wider text-[10px] text-primary">{currentLesson.type}</span>
          <span>•</span>
          <span>Passing Accuracy: {currentLesson.passingAccuracy}%</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {currentLesson.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium mt-1">
          {currentLesson.description}
        </p>
      </div>

      {/* ─── CASE A: READING / INTRODUCTION LESSON ─── */}
      {isReadingLesson ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
        >
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
              {currentLesson.icon}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-blue-900 dark:text-blue-200 mb-1">
                {currentLesson.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentLesson.tipContent || currentLesson.description}
              </p>
            </div>
          </div>

          {currentLesson.fingerGuide && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-xs font-bold">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                Assigned Finger Rest Position:{' '}
                <strong className="text-slate-900 dark:text-white">{currentLesson.fingerGuide}</strong>
              </span>
            </div>
          )}

          {currentLesson.targetKeys && currentLesson.targetKeys.length > 0 && (
            <div className="card-game p-4 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-xl">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 text-center">
                Target Coordinates
              </div>
              <KeyboardDiagram
                highlightKeys={currentLesson.targetKeys}
                activeKey=""
                compact={false}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400">
              Review tactile anchor points before starting typing drill.
            </span>

            <button
              type="button"
              onClick={handleCompleteReadingLesson}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs sm:text-sm shadow-lg shadow-primary/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <span>Got It! Start Practice Drill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* ─── CASE B: TYPING DRILL LESSON ─── */
        <div className="space-y-4">
          {/* Top HUD Metrics Bar */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">WPM</span>
                <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                  {engine.metrics.wpm}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Accuracy</span>
                <span
                  className={`font-mono text-base font-black ${
                    engine.metrics.accuracy >= currentLesson.passingAccuracy
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-500'
                  }`}
                >
                  {engine.metrics.accuracy.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block">Progress</span>
                <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Typing Canvas Card */}
          <div
            onClick={focusInput}
            className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl min-h-[160px] cursor-text select-none"
          >
            {/* Hidden Input for physical keystrokes */}
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

            {/* Click to Focus Overlay */}
            {!isFocused && lessonState !== 'completed' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 rounded-3xl text-white">
                <Mascot mood="idle" size="sm" />
                <p className="text-sm font-extrabold">Click here to start typing!</p>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Press any key to begin the assigned curriculum drill.
                </p>
              </div>
            )}

            {/* Characters Display */}
            <div className="font-mono text-xl sm:text-2xl font-bold leading-relaxed tracking-wide select-none">
              {content.split('').map((char, idx) => {
                  const isTyped = idx < charIndex;
                  const isCurrent = idx === charIndex;
                  const hasError = errors.has(idx);

                  let charClass = 'text-slate-500 dark:text-slate-300 font-medium';
                  if (isTyped) {
                    if (hasError) {
                      charClass = 'text-white bg-rose-600 dark:bg-rose-600 rounded px-0.5 font-bold';
                    } else {
                      charClass = 'text-emerald-600 dark:text-emerald-400 font-bold';
                    }
                  } else if (isCurrent) {
                    charClass = isFocused
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 rounded px-0.5 font-black ring-1 ring-blue-500/40'
                      : 'text-slate-800 dark:text-white font-bold underline decoration-blue-500';
                  }

                  return (
                    <span
                      key={idx}
                      className={`relative transition-colors duration-75 ${charClass}`}
                    >
                      {isCurrent && isFocused && (
                        <motion.span
                          className="absolute -left-[1px] top-[2px] bottom-[2px] w-[2.5px] rounded-full bg-blue-500"
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

          {/* Interactive Virtual Keyboard (Matched 1:1 with Learn Section) */}
          <div className="card-game p-4 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-xl">
            <KeyboardDiagram
              highlightKeys={currentLesson.targetKeys || []}
              activeKey={activeKey}
              errorKeys={Array.from(errors).map((i) => content[i]).filter(Boolean)}
              compact={false}
            />
          </div>
        </div>
      )}

      {/* Completion Modal */}
      <AnimatePresence>
        {lessonState === 'completed' && !isReadingLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-8 max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4"
            >
              <Mascot mood={getMascotMood()} size="lg" className="mx-auto" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Classroom Assignment Complete</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {passed ? '🎉 Assignment Completed!' : '💪 Keep Practicing!'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {passed
                  ? `Great work! Your progress has been submitted to ${teacherName}.`
                  : `You need ${currentLesson.passingAccuracy}% accuracy to pass. You achieved ${engine.metrics.accuracy.toFixed(1)}%.`}
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-3 py-2">
                {[1, 2, 3].map((s) => {
                  let earned = false;
                  if (s === 1 && engine.metrics.accuracy >= currentLesson.starThresholds[0]) earned = true;
                  if (s === 2 && engine.metrics.accuracy >= currentLesson.starThresholds[1]) earned = true;
                  if (s === 3 && engine.metrics.accuracy >= currentLesson.starThresholds[2]) earned = true;

                  return (
                    <motion.div
                      key={s}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: s * 0.1 }}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          earned
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">WPM</span>
                  <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-400">
                    {engine.metrics.wpm}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Accuracy</span>
                  <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {engine.metrics.accuracy.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {nextAssignment && passed && (
                  <button
                    type="button"
                    onClick={handleProceedToNextLesson}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-500/25 cursor-pointer transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Next Lesson: {nextAssignment.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm shadow-md shadow-primary/20 cursor-pointer transition active:scale-95"
                >
                  Return to Classroom Tasks
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer transition"
                >
                  Practice This Lesson Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
