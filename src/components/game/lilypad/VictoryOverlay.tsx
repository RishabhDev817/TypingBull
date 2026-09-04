import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, RotateCcw, ArrowRight, Home, Sparkles, Zap, Brain } from 'lucide-react';
import { Mascot } from '../../Mascot';
import { ConfettiFireworks } from '../ConfettiFireworks';

interface VictoryOverlayProps {
  level: number;
  maxLevel: number;
  score: number;
  wpm: number;
  accuracy: number;
  timeSeconds: number;
  wordsCount: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onBackToHub: () => void;
  onViewAiReport?: () => void;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  level,
  maxLevel,
  wpm,
  accuracy,
  timeSeconds,
  wordsCount,
  onNextLevel,
  onPlayAgain,
  onBackToHub,
  onViewAiReport,
}) => {
  const [autoProgressSeconds, setAutoProgressSeconds] = useState<number>(3.5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const starCount = accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : 1;
  const hasNextLevel = level < maxLevel;

  // Automated progression timer countdown
  useEffect(() => {
    if (!hasNextLevel || isPaused) return;

    const interval = 50; // ms
    const timer = setInterval(() => {
      setAutoProgressSeconds((prev) => {
        const next = prev - interval / 1000;
        if (next <= 0) {
          clearInterval(timer);
          onNextLevel();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [hasNextLevel, isPaused, onNextLevel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      {/* Full screen celebratory canvas fireworks & confetti */}
      <ConfettiFireworks active={true} />

      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        onMouseEnter={() => setIsPaused(true)}
        className="relative w-full max-w-lg bg-gradient-to-b from-pink-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border-4 border-amber-300 dark:border-pink-500/80 shadow-2xl p-6 sm:p-8 text-center overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Cheering Mascot */}
        <div className="flex justify-center mb-1">
          <Mascot mood="cheering" size="lg" />
        </div>

        {/* Massive Animated HURRAY! Lotus Banner */}
        <motion.div
          initial={{ scale: 0.5, rotate: -8 }}
          animate={{ scale: [0.5, 1.25, 1], rotate: [0, -3, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-block px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-amber-400 shadow-xl border-2 border-white mb-2"
        >
          <span className="text-3xl sm:text-4xl font-black text-amber-950 tracking-wider flex items-center gap-2 drop-shadow-sm">
            <span>🌸</span> HURRAY! <span>🐸🎉</span>
          </span>
        </motion.div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
          Lotus Blossom Reached!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold mb-3">
          Level {level} Complete! You conquered the zigzag trail across the lake!
        </p>

        {/* 3-Star Rating Animation */}
        <div className="flex justify-center gap-3 my-3">
          {[1, 2, 3].map((s) => {
            const isEarned = s <= starCount;
            return (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.25 + s * 0.18,
                  type: 'spring',
                  stiffness: 250,
                  damping: 12,
                }}
                className="relative"
              >
                <div
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 ${
                    isEarned
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-500 shadow-lg shadow-amber-400/30'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${isEarned ? 'fill-amber-400 text-amber-500' : ''}`} />
                </div>
                {isEarned && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: s * 0.2 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-4 gap-2 my-4 bg-white/85 dark:bg-slate-800/85 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Words</span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {wordsCount}
            </span>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Accuracy</span>
            <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
              {accuracy.toFixed(0)}%
            </span>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Speed</span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
              {wpm} <span className="text-[10px] font-bold text-slate-400">WPM</span>
            </span>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Time</span>
            <span className="text-base sm:text-lg font-black text-pink-600 dark:text-pink-400">
              {timeSeconds.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Auto Next Level Countdown Indicator */}
        {hasNextLevel && (
          <div className="mb-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Auto-advancing to Level {level + 1}...</span>
              </span>
              <span>{Math.ceil(autoProgressSeconds)}s</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-pink-500 transition-all ease-linear"
                style={{ width: `${(autoProgressSeconds / 3.5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasNextLevel ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Level ({level + 1})</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgain}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 border-b-4 border-amber-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-sm border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHub}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-sm border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Hub</span>
          </motion.button>

          {onViewAiReport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPaused(true);
                onViewAiReport();
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 dark:hover:bg-purple-800/60 text-purple-800 dark:text-purple-200 font-extrabold text-sm border-2 border-purple-300 dark:border-purple-600 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>AI Report</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
