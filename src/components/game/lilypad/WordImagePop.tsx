import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { getWordVisual } from './lilypadData';

interface WordImagePopProps {
  word: string;
}

export const WordImagePop: React.FC<WordImagePopProps> = ({ word }) => {
  const visual = getWordVisual(word);

  return (
    <motion.div
      initial={{ scale: 0, y: 15, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -10, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 18,
        mass: 0.8,
      }}
      className="relative z-50 flex flex-col items-center pointer-events-none select-none drop-shadow-2xl"
    >
      {/* Visual Reinforcement Card */}
      <div
        className="relative px-3.5 py-2 rounded-2xl shadow-2xl border-3 flex items-center gap-2.5 backdrop-blur-md"
        style={{
          backgroundColor: visual.bg,
          borderColor: visual.border,
        }}
      >
        {/* Floating Sparkle Particles */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-950 p-1 rounded-full shadow-md border border-white"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </motion.div>

        {/* Big Unambiguous Visual Illustration/Emoji */}
        <span className="text-3xl sm:text-4xl drop-shadow-md animate-bounce">
          {visual.emoji}
        </span>

        {/* Word Text & Green Checkmark */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
              {visual.label}
            </span>
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-800 tracking-widest uppercase">
            PERFECT!
          </span>
        </div>
      </div>

      {/* Speech Bubble Arrow pointing to the lilypad */}
      <div
        className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] -mt-0.5 drop-shadow-sm"
        style={{ borderTopColor: visual.border }}
      />
    </motion.div>
  );
};
