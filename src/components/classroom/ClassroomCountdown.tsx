import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../../utils/audio';

interface Props {
  sessionStartAt: number;
}

export const ClassroomCountdown: React.FC<Props> = ({ sessionStartAt }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return Math.max(0, Math.ceil((sessionStartAt - Date.now()) / 1000));
  });

  useEffect(() => {
    const checkTimer = () => {
      const now = Date.now();
      const diffMs = sessionStartAt - now;
      const secs = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsRemaining(secs);
    };

    checkTimer();
    const interval = setInterval(checkTimer, 100);
    return () => clearInterval(interval);
  }, [sessionStartAt]);

  useEffect(() => {
    if (secondsRemaining > 0) {
      soundEngine.playPop();
    } else {
      soundEngine.playVictory();
    }
  }, [secondsRemaining]);

  const displayLabel = secondsRemaining > 0 ? String(secondsRemaining) : 'GO!';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary-light border border-primary/40 font-black text-xs uppercase tracking-widest">
          Synchronized Classroom Start
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">Get Ready!</h2>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayLabel}
          initial={{ scale: 0.5, opacity: 0, y: 15 }}
          animate={{ scale: 1.1, opacity: 1, y: 0 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className={`font-black tracking-tight ${
            secondsRemaining === 0
              ? 'text-6xl sm:text-8xl md:text-9xl text-emerald-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.8)]'
              : 'text-7xl sm:text-9xl md:text-10xl text-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]'
          }`}
        >
          {displayLabel}
        </motion.div>
      </AnimatePresence>

      <p className="text-xs sm:text-sm font-bold text-slate-400 mt-8">
        Starting simultaneously on all student computers...
      </p>
    </div>
  );
};
