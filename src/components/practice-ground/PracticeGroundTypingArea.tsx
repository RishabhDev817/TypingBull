import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Target } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';

interface Props {
  targetText: string;
  textTitle: string;
  raceStartAt: number;
  durationSeconds: number;
  isFinished: boolean;
  onProgressUpdate: (
    correctChars: number,
    incorrectChars: number,
    totalChars: number,
    wpm: number,
    accuracy: number,
    completed: boolean
  ) => void;
  onLocalFinish: () => void;
}

export const PracticeGroundTypingArea: React.FC<Props> = ({
  targetText,
  textTitle,
  raceStartAt,
  durationSeconds,
  isFinished,
  onProgressUpdate,
  onLocalFinish,
}) => {
  const { t } = useI18n();
  const [userInput, setUserInput] = useState<string>('');
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(durationSeconds);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Time ticker
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - raceStartAt) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);
      setTimeRemaining(remaining);
    }, 500);

    return () => clearInterval(timer);
  }, [raceStartAt, durationSeconds, isFinished]);

  // Keep hidden input focused continuously
  useEffect(() => {
    hiddenInputRef.current?.focus();
    const handleWindowClick = () => hiddenInputRef.current?.focus();
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  // Auto-scroll caret into view
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const charEl = activeCharRef.current;
      const charTop = charEl.offsetTop;
      const containerHeight = container.clientHeight;
      const currentScroll = container.scrollTop;

      if (charTop > currentScroll + containerHeight - 70 || charTop < currentScroll + 20) {
        container.scrollTo({
          top: Math.max(0, charTop - containerHeight / 3),
          behavior: 'smooth',
        });
      }
    }
  }, [userInput.length]);

  // Input change handler (100% instantaneous local execution)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;

    const newTotalKeystrokes = totalKeystrokes + 1;
    setTotalKeystrokes(newTotalKeystrokes);

    let newMistakesCount = mistakesCount;

    // Check newly typed character
    if (value.length > userInput.length) {
      const newChar = value.slice(-1);
      const expected = targetText[value.length - 1];

      if (newChar === expected) {
        soundEngine.playClick(newChar === ' ');
      } else {
        soundEngine.playError();
        newMistakesCount = mistakesCount + 1;
        setMistakesCount(newMistakesCount);
      }
    }

    setUserInput(value);

    // Calculate accuracy and WPM
    const correctCount = Math.max(0, value.length - newMistakesCount);
    const accuracy =
      value.length === 0 ? 100 : Math.max(0, Math.round((correctCount / value.length) * 100));

    const elapsedSeconds = Math.max(0.5, (Date.now() - raceStartAt) / 1000);
    const wordsTyped = correctCount / 5;
    const wpm = Math.max(0, Math.round((wordsTyped / elapsedSeconds) * 60));

    const isCompleted = value.length >= targetText.length;

    onProgressUpdate(
      correctCount,
      newMistakesCount,
      value.length,
      wpm,
      accuracy,
      isCompleted
    );

    if (isCompleted) {
      soundEngine.playLevelUnlock();
      onLocalFinish();
    }
  };

  // Local display metrics
  const currentAccuracy =
    userInput.length === 0
      ? 100
      : Math.max(0, Math.round(((userInput.length - mistakesCount) / userInput.length) * 100));

  const elapsedSeconds = Math.max(0.5, (Date.now() - raceStartAt) / 1000);
  const correctKeystrokes = Math.max(0, userInput.length - mistakesCount);
  const currentWpm = Math.max(
    0,
    Math.round((correctKeystrokes / 5 / (elapsedSeconds / 60)))
  );

  const isTimeCritical = timeRemaining <= 10;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      onClick={() => hiddenInputRef.current?.focus()}
      className="w-full relative min-h-[420px] p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-4 border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col justify-between cursor-text overflow-hidden"
    >
      {/* Hidden local input */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        className="absolute opacity-0 pointer-events-none -top-40"
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Top Header Bar: Passage Title & Gauges */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-black">
            {t('multiplayer.passageBadge')}
          </span>
          <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300">
            "{textTitle}"
          </span>
        </div>

        {/* Live Gauges Pills */}
        <div className="flex items-center gap-3 font-mono font-black text-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <Zap className="w-3.5 h-3.5" />
            <span>{currentWpm} WPM</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <Target className="w-3.5 h-3.5" />
            <span>{currentAccuracy}%</span>
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border ${
              isTimeCritical
                ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-400 text-rose-600 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Monospace High-Contrast Text Display */}
      <div
        ref={textContainerRef}
        className="flex-1 overflow-y-auto max-h-[340px] pr-2 font-mono text-base sm:text-lg md:text-xl leading-relaxed md:leading-loose tracking-wide select-none whitespace-pre-wrap"
      >
        {targetText.split('').map((char, index) => {
          const isTyped = index < userInput.length;
          const isCurrent = index === userInput.length;
          const isCorrect = isTyped && userInput[index] === char;
          const isMistake = isTyped && !isCorrect;

          return (
            <span
              key={index}
              ref={isCurrent ? activeCharRef : null}
              className={`relative transition-colors duration-75 ${
                isCorrect
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : isMistake
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 rounded px-0.5 underline decoration-rose-500 decoration-2 font-bold'
                  : isCurrent
                  ? 'text-indigo-600 dark:text-indigo-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 opacity-75'
              }`}
            >
              {/* Pulsing Caret */}
              {isCurrent && !isFinished && (
                <motion.span
                  layoutId="race-caret"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
              )}
              {char}
            </span>
          );
        })}
      </div>

      {/* Finished Overlay / Status Hint */}
      {isFinished ? (
        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
          <span>{t('multiplayer.completedWaiting')}</span>
          <span>{userInput.length}/{targetText.length} {t('multiplayer.charsLabel')}</span>
        </div>
      ) : (
        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>{t('multiplayer.typingTip')}</span>
          <span>{userInput.length}/{targetText.length} {t('multiplayer.charsLabel')}</span>
        </div>
      )}
    </div>
  );
};
