import React from 'react';
import { motion } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'cheering' | 'sad' | 'thinking' | 'typing';
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg';

interface MascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  className?: string;
}

const SIZE_MAP: Record<MascotSize, number> = {
  xs: 40,
  sm: 60,
  md: 90,
  lg: 140,
};

/**
 * Bully the Bull — an original, round, friendly mascot character.
 * High-quality SVG with smooth breathing, blinking, and ear twitch animations.
 */
export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
}) => {
  const px = SIZE_MAP[size];

  // Body breathing / bobbing animation
  const bodyVariants: Record<MascotMood, object> = {
    idle: {
      y: [0, -5, 0],
      scaleY: [1, 1.02, 1],
      scaleX: [1, 0.99, 1],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -8, 0],
      rotate: [0, 4, -4, 0],
      transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
    },
    cheering: {
      y: [0, -14, 0],
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
    },
    sad: {
      y: [0, 3, 0],
      rotate: [0, -2, 0],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [0, -6, 0, 6, 0],
      transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
    },
    typing: {
      y: [0, -3, 0],
      transition: { repeat: Infinity, duration: 0.35, ease: 'easeInOut' },
    },
  };

  // Blinking animation wrapper for eyes
  const blinkAnimation = {
    scaleY: [1, 1, 1, 0.1, 1, 1, 1, 1, 1],
    transition: {
      repeat: Infinity,
      duration: 4,
      times: [0, 0.45, 0.48, 0.5, 0.52, 0.55, 0.9, 0.95, 1],
    },
  };

  // Ear twitch animation
  const leftEarTwitch = {
    rotate: [0, 0, -8, 4, 0, 0],
    transition: { repeat: Infinity, duration: 5, times: [0, 0.6, 0.64, 0.68, 0.72, 1] },
  };

  const rightEarTwitch = {
    rotate: [0, 0, 8, -4, 0, 0],
    transition: { repeat: Infinity, duration: 5, times: [0, 0.62, 0.66, 0.7, 0.74, 1] },
  };

  // Eye expression based on mood
  const getEyes = () => {
    switch (mood) {
      case 'happy':
      case 'cheering':
        // Expressive happy eyes with highlights
        return (
          <>
            <path d="M34 43 Q39 36 44 43" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M52 43 Q57 36 62 43" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
        // Droopy sad eyes with tear animation
        return (
          <motion.g animate={blinkAnimation} style={{ transformOrigin: '48px 43px' }}>
            <ellipse cx="38" cy="43" rx="4.5" ry="5.5" fill="#1F2937" />
            <ellipse cx="58" cy="43" rx="4.5" ry="5.5" fill="#1F2937" />
            <ellipse cx="39" cy="41.5" rx="1.8" ry="2.2" fill="white" />
            <ellipse cx="59" cy="41.5" rx="1.8" ry="2.2" fill="white" />
            <motion.circle
              cx="42" cy="50" r="2.5" fill="#3B82F6"
              animate={{ y: [0, 10], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeIn' }}
            />
          </motion.g>
        );
      case 'thinking':
        return (
          <motion.g animate={blinkAnimation} style={{ transformOrigin: '48px 43px' }}>
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#1F2937" />
            <ellipse cx="58" cy="42" rx="5" ry="6" fill="#1F2937" />
            <ellipse cx="40" cy="40.5" rx="2" ry="2.5" fill="white" />
            <ellipse cx="60" cy="40.5" rx="2" ry="2.5" fill="white" />
          </motion.g>
        );
      default:
        // Normal shiny anime eyes with double catchlights
        return (
          <motion.g animate={blinkAnimation} style={{ transformOrigin: '48px 43px' }}>
            {/* Left Eye */}
            <ellipse cx="37" cy="43" rx="5.5" ry="6.5" fill="#1E293B" />
            <circle cx="35.5" cy="40.5" r="2.2" fill="white" />
            <circle cx="39" cy="44.5" r="1.1" fill="white" />

            {/* Right Eye */}
            <ellipse cx="59" cy="43" rx="5.5" ry="6.5" fill="#1E293B" />
            <circle cx="57.5" cy="40.5" r="2.2" fill="white" />
            <circle cx="61" cy="44.5" r="1.1" fill="white" />
          </motion.g>
        );
    }
  };

  // Mouth expression
  const getMouth = () => {
    switch (mood) {
      case 'happy':
      case 'cheering':
        return (
          <g>
            <path d="M39 54 Q48 64 57 54 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
            <path d="M43 57 Q48 54 53 57" fill="#FCA5A5" />
          </g>
        );
      case 'sad':
        return <path d="M40 58 Q48 52 56 58" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 'thinking':
        return <circle cx="52" cy="56" r="3.5" fill="#1E293B" />;
      default:
        return <path d="M41 55 Q48 60 55 55" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={bodyVariants[mood] as any}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width={px} height={px}>
        {/* Horns with gold cel-shading */}
        <path d="M28 28 Q20 12 30 15 Q36 18 32 28 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
        <path d="M27 24 Q23 15 29 17 Z" fill="#FCD34D" />

        <path d="M68 28 Q76 12 66 15 Q60 18 64 28 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
        <path d="M69 24 Q73 15 67 17 Z" fill="#FCD34D" />

        {/* Ears with animated twitches */}
        <motion.g animate={leftEarTwitch} style={{ transformOrigin: '24px 38px' }}>
          <ellipse cx="23" cy="38" rx="8.5" ry="6.5" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
          <ellipse cx="23" cy="38" rx="5" ry="3.5" fill="#F97316" />
        </motion.g>

        <motion.g animate={rightEarTwitch} style={{ transformOrigin: '73px 38px' }}>
          <ellipse cx="73" cy="38" rx="8.5" ry="6.5" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
          <ellipse cx="73" cy="38" rx="5" ry="3.5" fill="#F97316" />
        </motion.g>

        {/* Main Round Head */}
        <circle cx="48" cy="48" r="27" fill="#C2410C" stroke="#7C2D12" strokeWidth="2.5" />
        {/* Head highlight cap */}
        <path d="M 28 36 A 24 24 0 0 1 68 36 A 27 27 0 0 0 28 36 Z" fill="#EA580C" />

        {/* Face lighter area */}
        <ellipse cx="48" cy="52" rx="19" ry="15.5" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />

        {/* Snout */}
        <ellipse cx="48" cy="53" rx="13" ry="8.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.5" />

        {/* Nostrils */}
        <ellipse cx="43.5" cy="52" rx="2.5" ry="2" fill="#7C2D12" />
        <ellipse cx="52.5" cy="52" rx="2.5" ry="2" fill="#7C2D12" />

        {/* Rosy Cheeks */}
        <circle cx="29" cy="50" r="4.5" fill="#F87171" opacity="0.6" />
        <circle cx="67" cy="50" r="4.5" fill="#F87171" opacity="0.6" />

        {/* Eyes */}
        {getEyes()}

        {/* Eyebrows for mood */}
        {mood === 'sad' && (
          <>
            <line x1="32" y1="35" x2="41" y2="33" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="55" y1="33" x2="64" y2="35" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
        {mood === 'cheering' && (
          <>
            <line x1="32" y1="33" x2="41" y2="35" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="55" y1="35" x2="64" y2="33" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        {getMouth()}

        {/* Gold Nose Ring with specular glint */}
        <circle cx="48" cy="57" r="3.5" stroke="#F59E0B" strokeWidth="2" fill="none" />
        <circle cx="46.5" cy="55.5" r="0.8" fill="white" />

        {/* Cheering Sparkles */}
        {mood === 'cheering' && (
          <>
            <motion.text
              x="8" y="20" fontSize="14"
              animate={{ opacity: [0, 1, 0], y: [-5, -18], scale: [0.5, 1.3] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
            >✨</motion.text>
            <motion.text
              x="74" y="18" fontSize="12"
              animate={{ opacity: [0, 1, 0], y: [-3, -14], scale: [0.5, 1.1] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
            >⭐</motion.text>
            <motion.text
              x="76" y="65" fontSize="10"
              animate={{ opacity: [0, 1, 0], y: [0, -12], scale: [0.5, 1.1] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: 0.5 }}
            >🎉</motion.text>
          </>
        )}

        {/* Thinking bubble */}
        {mood === 'thinking' && (
          <>
            <circle cx="82" cy="12" r="2.5" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="90" cy="4" r="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="90" y="7" fontSize="7" textAnchor="middle" fontWeight="bold" fill="#334155">?</text>
          </>
        )}
      </svg>
    </motion.div>
  );
};

export default Mascot;
