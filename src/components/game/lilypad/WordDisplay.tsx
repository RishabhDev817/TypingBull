import React from 'react';
import { motion } from 'framer-motion';

interface WordDisplayProps {
  targetWord: string;
  typedInput: string;
  isError: boolean;
  isActive: boolean;
  wordCategory?: string;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  targetWord,
  typedInput,
  isError,
  isActive,
}) => {
  if (!targetWord) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: isActive ? -12 : 0,
        scale: isActive ? 1.08 : 0.95,
        x: isError ? [0, -6, 6, -4, 4, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        x: { duration: 0.35 },
      }}
      className={`relative z-20 flex flex-col items-center justify-center pointer-events-none select-none`}
    >
      {/* Target Word Bubble Container */}
      <div
        className={`px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md border-3 flex items-center gap-1.5 transition-all duration-200 ${
          isError
            ? 'bg-rose-500/90 border-rose-300 text-white shadow-rose-500/30'
            : isActive
            ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-400 dark:border-emerald-500 shadow-emerald-500/25'
            : 'bg-white/70 dark:bg-slate-800/70 border-slate-300 dark:border-slate-600 opacity-70'
        }`}
      >
        {/* Letters rendering */}
        <div className="flex items-center tracking-widest font-mono text-2xl md:text-3xl font-extrabold uppercase">
          {targetWord.split('').map((char, index) => {
            const isTyped = index < typedInput.length;
            const isCurrent = index === typedInput.length;
            const isCorrect = isTyped && typedInput[index].toLowerCase() === char.toLowerCase();

            return (
              <span key={index} className="relative inline-flex flex-col items-center mx-[1.5px]">
                {/* Character */}
                <span
                  className={`transition-all duration-150 ${
                    isError && isTyped
                      ? 'text-white'
                      : isCorrect
                      ? 'text-emerald-500 dark:text-emerald-400 scale-110 drop-shadow-[0_1px_4px_rgba(16,185,129,0.4)]'
                      : isCurrent && isActive
                      ? 'text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400 decoration-3 underline-offset-4 animate-pulse'
                      : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  {char}
                </span>

                {/* Animated Caret indicator below next letter to type */}
                {isCurrent && isActive && !isError && (
                  <motion.span
                    layoutId="letter-caret"
                    className="absolute -bottom-1 w-2.5 h-1 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Little downward pointer tail for speech bubble */}
      <div
        className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-0.5 ${
          isError
            ? 'border-t-rose-500'
            : isActive
            ? 'border-t-emerald-400 dark:border-t-emerald-500'
            : 'border-t-slate-300 dark:border-t-slate-600'
        }`}
      />
    </motion.div>
  );
};
