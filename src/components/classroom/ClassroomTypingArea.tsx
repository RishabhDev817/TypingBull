import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Target, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import type { StudentProgressUpdate, StudentFinishPayload } from '../../types/classroom';

interface Props {
  targetText: string;
  passageTitle: string;
  sessionStartAt: number;
  sessionEndAt: number;
  onProgressUpdate: (update: StudentProgressUpdate) => void;
  onFinish: (payload: StudentFinishPayload) => void;
}

export const ClassroomTypingArea: React.FC<Props> = ({
  targetText,
  passageTitle,
  sessionStartAt,
  sessionEndAt,
  onProgressUpdate,
  onFinish,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(() => {
    return Math.max(0, Math.ceil((sessionEndAt - Date.now()) / 1000));
  });
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const isFinishedRef = useRef<boolean>(false);

  const safeTargetText = targetText || 'The morning sun rose gently over the emerald hills.';
  const totalChars = safeTargetText.length;

  // Keep hidden input focused continuously
  useEffect(() => {
    hiddenInputRef.current?.focus();
    const handleGlobalClick = () => {
      if (!isFinishedRef.current) {
        hiddenInputRef.current?.focus();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Synchronized clock countdown based on sessionEndAt
  useEffect(() => {
    if (isFinished) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((sessionEndAt - now) / 1000));
      setTimeRemainingSec(remaining);

      if (remaining <= 0 && !isFinishedRef.current) {
        handleComplete();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sessionEndAt, isFinished]);

  // Auto-scroll caret into comfortable view
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const charEl = activeCharRef.current;
      const charTop = charEl.offsetTop;
      const containerHeight = container.clientHeight;
      const currentScroll = container.scrollTop;

      if (charTop > currentScroll + containerHeight - 80 || charTop < currentScroll + 20) {
        container.scrollTo({
          top: Math.max(0, charTop - containerHeight / 3),
          behavior: 'smooth',
        });
      }
    }
  }, [userInput.length]);

  // Complete handler
  const handleComplete = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    const now = Date.now();
    const effectiveStart = sessionStartAt > 0 ? sessionStartAt : now - 1000;
    const elapsedMinutes = Math.max(1, now - effectiveStart) / 60000;
    const typedLen = userInput.length;
    const correctChars = Math.max(0, typedLen - mistakesCount);
    const finalWpm = Math.round((correctChars / 5) / elapsedMinutes);
    const finalAccuracy = totalKeystrokes > 0
      ? Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 1000) / 10
      : 100;
    const timeSpentSec = Math.max(1, Math.round((now - effectiveStart) / 1000));

    soundEngine.playVictory();

    onFinish({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      correctChars,
      incorrectChars: mistakesCount,
      totalChars: typedLen,
      timeSpentSec,
    });
  }, [userInput.length, mistakesCount, sessionStartAt, totalKeystrokes, onFinish]);

  // Instant local keypress handler (zero latency)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinishedRef.current) return;
    const value = e.target.value;

    const newTotalKeystrokes = totalKeystrokes + 1;
    setTotalKeystrokes(newTotalKeystrokes);

    let newMistakesCount = mistakesCount;

    if (value.length > userInput.length) {
      const charIndex = value.length - 1;
      const typedChar = value[charIndex];
      const expectedChar = safeTargetText[charIndex];

      if (typedChar === expectedChar) {
        soundEngine.playClick(typedChar === ' ');
      } else {
        newMistakesCount += 1;
        setMistakesCount(newMistakesCount);
        soundEngine.playError();
      }
    }

    setUserInput(value);

    // Calculate live telemetry
    const now = Date.now();
    const effectiveStart = sessionStartAt > 0 ? sessionStartAt : now - 500;
    const elapsedMinutes = Math.max(0.01, (now - effectiveStart) / 60000);
    const typedLen = value.length;
    const correctChars = Math.max(0, typedLen - newMistakesCount);
    const liveWpm = Math.round((correctChars / 5) / elapsedMinutes);
    const liveAccuracy = newTotalKeystrokes > 0
      ? Math.round(((newTotalKeystrokes - newMistakesCount) / newTotalKeystrokes) * 1000) / 10
      : 100;
    const progress = Math.min(1, typedLen / totalChars);

    // Dispatch throttled progress
    onProgressUpdate({
      progress,
      wpm: liveWpm,
      accuracy: liveAccuracy,
      correctChars,
      incorrectChars: newMistakesCount,
      totalChars: typedLen,
    });

    // If reached end of text
    if (value.length >= totalChars) {
      handleComplete();
    }
  };

  // Live HUD metrics
  const now = Date.now();
  const elapsedMinutes = Math.max(0.01, (now - sessionStartAt) / 60000);
  const typedLen = userInput.length;
  const correctChars = Math.max(0, typedLen - mistakesCount);
  const liveWpm = Math.round((correctChars / 5) / elapsedMinutes);
  const liveAccuracy = totalKeystrokes > 0
    ? Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 1000) / 10
    : 100;
  const progressPercent = Math.min(100, Math.round((typedLen / totalChars) * 100));

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 select-none">
      {/* Hidden input for capturing physical keystrokes */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="opacity-0 absolute -top-9999 left-0 pointer-events-none"
      />

      {/* Top HUD Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Classroom Exercise
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {passageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Live WPM */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                WPM
              </span>
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                {liveWpm}
              </span>
            </div>
          </div>

          {/* Live Accuracy */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Accuracy
              </span>
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                {liveAccuracy}%
              </span>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              timeRemainingSec < 30
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 animate-pulse'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Time Left
              </span>
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                {formatTimer(timeRemainingSec)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-4 p-0.5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Typing Text Box */}
      <div
        ref={textContainerRef}
        onClick={() => hiddenInputRef.current?.focus()}
        className="w-full h-64 sm:h-72 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto cursor-text relative font-mono text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide text-left"
      >
        {safeTargetText.split('').map((char, index) => {
          const isTyped = index < userInput.length;
          const isCurrent = index === userInput.length;
          const isCorrect = isTyped && userInput[index] === char;
          const isIncorrect = isTyped && userInput[index] !== char;

          let colorClass = 'text-slate-400 dark:text-slate-600';
          if (isCorrect) {
            colorClass = 'text-emerald-600 dark:text-emerald-400 font-bold';
          } else if (isIncorrect) {
            colorClass = 'text-rose-600 bg-rose-100 dark:bg-rose-950/80 rounded underline';
          }

          return (
            <span
              key={index}
              ref={isCurrent ? activeCharRef : null}
              className={`relative transition-colors ${colorClass} ${
                isCurrent
                  ? 'bg-blue-200/60 dark:bg-blue-900/60 border-b-4 border-blue-500 rounded-sm'
                  : ''
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Early Finished Overlay / Notice */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Activity Completed!</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            🏁 You Finished! ({liveWpm} WPM • {liveAccuracy}%)
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Waiting for remaining classmates or session timer to conclude. Your final score is saved.
          </p>
        </motion.div>
      )}
    </div>
  );
};
