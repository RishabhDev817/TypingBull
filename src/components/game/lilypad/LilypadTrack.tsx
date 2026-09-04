import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordDisplay } from './WordDisplay';
import { WordImagePop } from './WordImagePop';
import { LotusFlower } from './LotusFlower';
import { type Waypoint } from './lilypadData';

interface LilypadTrackProps {
  waypoints: Waypoint[];
  currentPadIndex: number;
  targetWord: string;
  typedInput: string;
  isError: boolean;
  landingRippleIndex: number | null;
  activePopWord: string | null;
  activePopPadIndex: number | null;
}

export const LilypadTrack: React.FC<LilypadTrackProps> = ({
  waypoints,
  currentPadIndex,
  targetWord,
  typedInput,
  isError,
  landingRippleIndex,
  activePopWord,
  activePopPadIndex,
}) => {
  // Generate SVG path string connecting all waypoints in serpentine order
  let pathD = '';
  if (waypoints.length > 0) {
    pathD = `M ${waypoints[0].x} ${waypoints[0].y}`;
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      pathD += ` Q ${prev.x} ${midY}, ${midX} ${midY} T ${curr.x} ${curr.y}`;
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      {/* ─── SVG Serpentine Water Current Trail ─── */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="streamWaterGrad4Tier" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Outer Trail Glow */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Dashed Water Current */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#streamWaterGrad4Tier)"
          strokeWidth="1.2"
          strokeDasharray="2.5 3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* ─── Render All Waypoints (Lilypads & Lotus Finale) ─── */}
      {waypoints.map((wp, index) => {
        const isStart = index === 0;
        const isFinish = index === waypoints.length - 1;
        const isCurrent = index === currentPadIndex;
        const isNextTarget = index === currentPadIndex + 1;
        const isVisited = index < currentPadIndex;
        const hasRipple = landingRippleIndex === index;
        const hasPopImage = activePopPadIndex === index && activePopWord;

        return (
          <div
            key={index}
            id={`leaf-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300"
            style={{
              left: `${wp.x}%`,
              top: `${wp.y}%`,
              zIndex: hasPopImage ? 50 : isNextTarget ? 35 : isCurrent ? 30 : 20,
            }}
          >
            {/* ─── 1. Instant Visual Reinforcement: Image Pop-up on Word Completion ─── */}
            <AnimatePresence>
              {hasPopImage && (
                <div className="absolute -top-20 z-50 pointer-events-auto">
                  <WordImagePop word={activePopWord} />
                </div>
              )}
            </AnimatePresence>

            {/* ─── 2. Target Word Bubble displayed above the NEXT target destination leaf ─── */}
            {isNextTarget && !hasPopImage && (
              <div className="absolute -top-14 z-40 pointer-events-auto">
                <WordDisplay
                  targetWord={targetWord}
                  typedInput={typedInput}
                  isError={isError}
                  isActive={true}
                />
              </div>
            )}

            {/* Start Line Badge */}
            {isStart && currentPadIndex === 0 && (
              <div className="absolute -top-8 z-20">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-400 shadow-md">
                  START
                </span>
              </div>
            )}

            {/* If Final Destination: Render the Grand Blooming Lotus Flower! */}
            {isFinish ? (
              <LotusFlower
                isTarget={isNextTarget}
                isReached={isCurrent}
                hasRipple={hasRipple}
              />
            ) : (
              /* Standard Organic Floating Lilypad Leaf */
              <motion.div
                animate={{
                  y: [0, Math.sin(index * 1.5) * 3, 0],
                  rotate: [wp.rotation, wp.rotation + (index % 2 === 0 ? 2 : -2), wp.rotation],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + (index % 3) * 0.6,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center"
              >
                {/* Landing water splash rings */}
                {hasRipple && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 1 }}
                    animate={{ scale: 2.3, opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-white/90 pointer-events-none"
                  />
                )}

                {/* Water Glow Under Leaf */}
                <div
                  className={`absolute -inset-2 rounded-full blur-md transition-all duration-300 ${
                    isCurrent
                      ? 'bg-emerald-400/60 opacity-100 scale-110'
                      : isNextTarget
                      ? 'bg-amber-300/60 opacity-90 scale-105 animate-pulse'
                      : 'bg-emerald-700/20 opacity-40'
                  }`}
                />

                {/* SVG Lilypad Leaf */}
                <svg
                  viewBox="0 0 100 70"
                  className={`w-13 h-9 sm:w-16 sm:h-11 md:w-18 md:h-12 transition-transform duration-300 drop-shadow-md ${
                    isCurrent ? 'scale-110' : isNextTarget ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <defs>
                    <radialGradient id={`padGrad5L-${index}`} cx="45%" cy="40%" r="60%">
                      <stop
                        offset="0%"
                        stopColor={
                          isNextTarget
                            ? '#86EFAC'
                            : isVisited
                            ? '#34D399'
                            : '#22C55E'
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          isNextTarget
                            ? '#22C55E'
                            : isVisited
                            ? '#059669'
                            : '#15803D'
                        }
                      />
                    </radialGradient>
                  </defs>

                  {/* Leaf contour with V-cut */}
                  <path
                    d="M 50 35 L 75 10 C 95 25 95 55 75 65 C 50 75 20 70 10 50 C 0 30 20 5 45 8 Z"
                    fill={`url(#padGrad5L-${index})`}
                    stroke="#14532D"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Radiating leaf veins */}
                  <g stroke="#166534" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
                    <path d="M 50 35 Q 30 22 20 18" fill="none" />
                    <path d="M 50 35 Q 22 38 14 46" fill="none" />
                    <path d="M 50 35 Q 35 55 30 64" fill="none" />
                    <path d="M 50 35 Q 60 55 68 62" fill="none" />
                    <path d="M 50 35 Q 75 45 84 42" fill="none" />
                  </g>

                  {/* Dew Drop */}
                  <circle cx="42" cy="28" r="2.2" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="43" cy="27" r="0.9" fill="#FFFFFF" />

                  {/* Lotus bud on completed leaves */}
                  {isVisited && (
                    <circle cx="50" cy="35" r="3.5" fill="#F472B6" />
                  )}
                </svg>

                {/* Leaf Step Index Badge */}
                <div className="absolute -bottom-2 flex items-center justify-center">
                  <span
                    className={`text-[8px] font-black px-1.2 py-0.2 rounded-full shadow-sm ${
                      isVisited
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};
