import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../../utils/audio';

interface Props {
  startAt: number;
  textTitle: string;
  onCountdownComplete?: () => void;
}

export const PracticeGroundCountdown: React.FC<Props> = ({
  startAt,
  textTitle,
  onCountdownComplete,
}) => {
  const [displayNumber, setDisplayNumber] = useState<number | string>(3);
  const [lastSoundNumber, setLastSoundNumber] = useState<number | string | null>(null);

  useEffect(() => {
    let animFrame: number;

    const tick = () => {
      const now = Date.now();
      const diffMs = startAt - now;

      if (diffMs <= 0) {
        setDisplayNumber('GO!');
        if (lastSoundNumber !== 'GO!') {
          soundEngine.playLevelUnlock();
          setLastSoundNumber('GO!');
        }
        if (diffMs <= -700 && onCountdownComplete) {
          onCountdownComplete();
        }
      } else {
        const secondsRemaining = Math.ceil(diffMs / 1000);
        setDisplayNumber(secondsRemaining);

        if (secondsRemaining !== lastSoundNumber && secondsRemaining <= 3) {
          soundEngine.playClick();
          setLastSoundNumber(secondsRemaining);
        }
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [startAt, lastSoundNumber, onCountdownComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none">
      {/* Passage Teaser Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-center"
      >
        <span className="text-xs font-black uppercase text-slate-300 block tracking-wider">
          Upcoming Passage
        </span>
        <span className="text-lg font-black text-white">"{textTitle}"</span>
      </motion.div>

      {/* Synchronized Big Countdown Display */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={String(displayNumber)}
          initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 1.8, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`font-black tracking-tight text-center drop-shadow-[0_0_30px_rgba(16,185,129,0.7)] ${
            displayNumber === 'GO!'
              ? 'text-7xl sm:text-9xl text-emerald-400'
              : 'text-8xl sm:text-9xl text-white font-mono'
          }`}
        >
          {displayNumber}
        </motion.div>
      </AnimatePresence>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-300"
      >
        Synchronizing with Racers...
      </motion.span>
    </div>
  );
};
