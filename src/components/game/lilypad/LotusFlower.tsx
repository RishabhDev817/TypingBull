import React from 'react';
import { motion } from 'framer-motion';

interface LotusFlowerProps {
  isTarget: boolean;
  isReached: boolean;
  hasRipple: boolean;
}

export const LotusFlower: React.FC<LotusFlowerProps> = ({
  isTarget,
  isReached,
  hasRipple,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      {/* Floating Grand Finale Header Badge */}
      <motion.div
        animate={{ y: [0, -5, 0], scale: isTarget ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="absolute -top-14 z-30 flex flex-col items-center"
      >
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-amber-400 text-amber-950 font-black text-xs shadow-xl border-2 border-white flex items-center gap-1.5 drop-shadow-md">
          <span className="text-sm">🌸</span>
          <span className="tracking-wider uppercase">LOTUS FINALE</span>
          <span className="text-sm">✨</span>
        </div>
      </motion.div>

      {/* Pulsing Water Shimmer Aura under the Lotus Flower */}
      <motion.div
        animate={{
          scale: isReached ? [1.2, 1.6, 1.2] : isTarget ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isReached ? [0.8, 1, 0.8] : [0.4, 0.7, 0.4],
        }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute -inset-6 rounded-full bg-gradient-to-r from-pink-500/40 via-amber-400/40 to-pink-500/40 blur-xl pointer-events-none"
      />

      {/* Ripple Wave upon Frog Landing */}
      {hasRipple && (
        <motion.div
          initial={{ scale: 0.6, opacity: 1 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-3 border-amber-200/90 pointer-events-none"
        />
      )}

      {/* Majestic SVG Lotus Flower with Grand Petals & Glowing Stamen */}
      <motion.svg
        viewBox="0 0 140 110"
        className="w-24 h-20 sm:w-28 sm:h-22 md:w-32 md:h-24 drop-shadow-[0_8px_16px_rgba(219,39,119,0.45)] overflow-visible"
        animate={{
          rotate: [0, 2, -2, 0],
          scale: isReached ? 1.15 : isTarget ? 1.08 : 1,
        }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        <defs>
          {/* Base Emerald Lilypad Pad Gradient */}
          <radialGradient id="lotusPadBase" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Outer Petals Gradient */}
          <linearGradient id="outerPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DB2777" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FDF2F8" />
          </linearGradient>

          {/* Inner Petals Gradient */}
          <linearGradient id="innerPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="60%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#FFF1F2" />
          </linearGradient>

          {/* Golden Pistil Core Gradient */}
          <radialGradient id="goldenPistil" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>

        {/* Supporting Foundation Pad */}
        <ellipse
          cx="70"
          cy="75"
          rx="58"
          ry="28"
          fill="url(#lotusPadBase)"
          stroke="#047857"
          strokeWidth="2.5"
        />

        {/* Foundation Pad Veins */}
        <path d="M 70 75 Q 35 60 20 65" stroke="#065F46" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 70 75 Q 105 60 120 65" stroke="#065F46" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 70 75 Q 70 95 70 102" stroke="#065F46" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* ─── Layer 1: Outermost Broad Pink Petals ─── */}
        <g stroke="#BE185D" strokeWidth="1.5">
          {/* Far Left Petal */}
          <path d="M 70 65 C 40 65 15 50 22 35 C 32 25 55 45 70 65 Z" fill="url(#outerPetalGrad)" />
          {/* Far Right Petal */}
          <path d="M 70 65 C 100 65 125 50 118 35 C 108 25 85 45 70 65 Z" fill="url(#outerPetalGrad)" />
          {/* Bottom Left Petal */}
          <path d="M 70 68 C 45 78 30 68 35 55 C 45 45 62 58 70 68 Z" fill="url(#outerPetalGrad)" />
          {/* Bottom Right Petal */}
          <path d="M 70 68 C 95 78 110 68 105 55 C 95 45 78 58 70 68 Z" fill="url(#outerPetalGrad)" />
        </g>

        {/* ─── Layer 2: Mid Blooming Petals ─── */}
        <g stroke="#9F1239" strokeWidth="1.8">
          {/* Left Mid Petal */}
          <path d="M 70 62 C 45 52 35 30 48 20 C 58 15 65 42 70 62 Z" fill="url(#innerPetalGrad)" />
          {/* Right Mid Petal */}
          <path d="M 70 62 C 95 52 105 30 92 20 C 82 15 75 42 70 62 Z" fill="url(#innerPetalGrad)" />
          {/* Top Center Grand Petal */}
          <path d="M 70 62 C 55 40 55 12 70 5 C 85 12 85 40 70 62 Z" fill="url(#innerPetalGrad)" />
        </g>

        {/* ─── Layer 3: Central Golden Pistil Core & Radiating Stamen ─── */}
        <ellipse cx="70" cy="58" rx="16" ry="12" fill="url(#goldenPistil)" stroke="#B45309" strokeWidth="1.5" />

        {/* Glowing Gold Pollen Dots */}
        {[
          { cx: 64, cy: 54 }, { cx: 70, cy: 52 }, { cx: 76, cy: 54 },
          { cx: 62, cy: 60 }, { cx: 68, cy: 60 }, { cx: 74, cy: 60 }, { cx: 78, cy: 58 }
        ].map((dot, di) => (
          <circle key={di} cx={dot.cx} cy={dot.cy} r="1.8" fill="#78350F" />
        ))}

        {/* Floating Sparkles & Light Crystals */}
        <circle cx="70" cy="5" r="3" fill="#FFFFFF" opacity="0.9" />
        <circle cx="48" cy="20" r="2.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="92" cy="20" r="2.2" fill="#FFFFFF" opacity="0.8" />
      </motion.svg>
    </div>
  );
};
