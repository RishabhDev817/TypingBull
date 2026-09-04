import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FINGER_COLORS, FINGER_LABELS, FINGER_SYMBOLS } from './KeyboardDiagram';

interface FingerGuideProps {
  /** Highlight specific finger indices */
  activeFingers?: number[];
  /** Optional active/hovered key from outside */
  hoveredFingerIdx?: number | null;
  className?: string;
}

interface FingerConfig {
  idx: number;
  name: string;
  hand: 'left' | 'right';
  homeKey: string;
  keys: string;
  cx: number;
  cy: number;
  glowPath: string;
}

const FINGER_CONFIGS: FingerConfig[] = [
  {
    idx: 0,
    name: 'Pinky',
    hand: 'left',
    homeKey: 'A',
    keys: 'A Q Z 1',
    cx: 304,
    cy: 268,
    glowPath: 'M 285,380 Q 285,270 304,258 Q 325,270 325,380 Z',
  },
  {
    idx: 1,
    name: 'Ring',
    hand: 'left',
    homeKey: 'S',
    keys: 'S W X 2',
    cx: 420,
    cy: 202,
    glowPath: 'M 398,350 Q 398,206 420,192 Q 442,206 442,350 Z',
  },
  {
    idx: 2,
    name: 'Middle',
    hand: 'left',
    homeKey: 'D',
    keys: 'D E C 3',
    cx: 480,
    cy: 172,
    glowPath: 'M 458,340 Q 458,176 480,162 Q 504,176 502,340 Z',
  },
  {
    idx: 3,
    name: 'Index',
    hand: 'left',
    homeKey: 'F',
    keys: 'F R T V B G 4 5',
    cx: 562,
    cy: 145,
    glowPath: 'M 538,330 Q 542,150 562,136 Q 586,150 580,330 Z',
  },
  {
    idx: 4,
    name: 'Index',
    hand: 'right',
    homeKey: 'J',
    keys: 'J Y U N M H 6 7',
    cx: 812,
    cy: 174,
    glowPath: 'M 792,330 Q 792,180 812,166 Q 836,180 832,330 Z',
  },
  {
    idx: 5,
    name: 'Middle',
    hand: 'right',
    homeKey: 'K',
    keys: 'K I , 8',
    cx: 896,
    cy: 160,
    glowPath: 'M 874,340 Q 874,166 896,150 Q 918,166 918,340 Z',
  },
  {
    idx: 6,
    name: 'Ring',
    hand: 'right',
    homeKey: 'L',
    keys: 'L O . 9',
    cx: 978,
    cy: 188,
    glowPath: 'M 956,350 Q 958,196 978,178 Q 1002,196 996,350 Z',
  },
  {
    idx: 7,
    name: 'Pinky',
    hand: 'right',
    homeKey: ';',
    keys: '; P / 0 - = [ ]',
    cx: 1064,
    cy: 248,
    glowPath: 'M 1044,380 Q 1044,256 1064,238 Q 1086,256 1082,380 Z',
  },
];

export const FingerGuide: React.FC<FingerGuideProps> = ({
  activeFingers = [0, 1, 2, 3, 4, 5, 6, 7],
  hoveredFingerIdx = null,
  className = '',
}) => {
  const [internalHoverIdx, setInternalHoverIdx] = useState<number | null>(null);
  const activeSet = new Set(activeFingers);

  const currentHoveredIdx = hoveredFingerIdx !== null ? hoveredFingerIdx : internalHoverIdx;

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* 3D Realistic Hands Stage */}
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-inner border border-hairline bg-canvas">
        {/* Soft Ambient Vignette / Studio Lighting */}
        <div className="relative w-full aspect-[1376/768]">
          {/* Base Realistic Hands 3D Render Image */}
          <img
            src="/assets/realistic_typing_hands.jpg"
            alt="Realistic 3D Human Hands in typing position"
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="eager"
          />

          {/* Realistic Ambient Lighting Tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

          {/* SVG Glow Overlay & Interactive Fingertip Beacons */}
          <svg
            viewBox="0 0 1376 768"
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}
          >
            <defs>
              {/* Radial glow filters & gradients for each finger */}
              {FINGER_CONFIGS.map((finger) => {
                const color = FINGER_COLORS[finger.idx];
                return (
                  <React.Fragment key={`defs-${finger.idx}`}>
                    <radialGradient
                      id={`finger-radial-${finger.idx}`}
                      cx="50%"
                      cy="30%"
                      r="65%"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                      <stop offset="50%" stopColor={color} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                    <radialGradient
                      id={`beacon-glow-${finger.idx}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity="1" />
                      <stop offset="60%" stopColor={color} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                  </React.Fragment>
                );
              })}
            </defs>

            {/* Hand Headers */}
            <text
              x="430"
              y="720"
              textAnchor="middle"
              fill="rgba(50, 50, 50, 0.7)"
              fontSize="20"
              fontWeight="800"
              letterSpacing="2"
              className="select-none uppercase font-mono"
            >
              Left Hand
            </text>
            <text
              x="946"
              y="720"
              textAnchor="middle"
              fill="rgba(50, 50, 50, 0.7)"
              fontSize="20"
              fontWeight="800"
              letterSpacing="2"
              className="select-none uppercase font-mono"
            >
              Right Hand
            </text>

            {/* Render Glowing Tint Overlays on Each Finger */}
            {FINGER_CONFIGS.map((finger) => {
              const color = FINGER_COLORS[finger.idx];
              const isActive = activeSet.has(finger.idx);
              const isHovered = currentHoveredIdx === finger.idx;

              return (
                <g
                  key={finger.idx}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setInternalHoverIdx(finger.idx)}
                  onMouseLeave={() => setInternalHoverIdx(null)}
                >
                  {/* Finger Shaft Glowing Overlay Tint */}
                  <path
                    d={finger.glowPath}
                    fill={`url(#finger-radial-${finger.idx})`}
                    opacity={isHovered ? 0.95 : isActive ? 0.65 : 0.25}
                    style={{
                      transition: 'all 0.3s ease',
                      filter: isHovered
                        ? `drop-shadow(0 0 16px ${color})`
                        : isActive
                        ? `drop-shadow(0 0 8px ${color}80)`
                        : 'none',
                    }}
                  />

                  {/* Pulsing Outer Halo Ring on Active/Hovered Finger */}
                  {(isActive || isHovered) && (
                    <circle
                      cx={finger.cx}
                      cy={finger.cy}
                      r={isHovered ? 26 : 20}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered ? 3 : 2}
                      strokeDasharray="4 3"
                      opacity={isHovered ? 1 : 0.8}
                      style={{
                        transformOrigin: `${finger.cx}px ${finger.cy}px`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`0 ${finger.cx} ${finger.cy}`}
                        to={`360 ${finger.cx} ${finger.cy}`}
                        dur={isHovered ? '4s' : '8s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Fingertip Glowing Beacon Disc */}
                  <circle
                    cx={finger.cx}
                    cy={finger.cy}
                    r={isHovered ? 16 : 13}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : isActive ? 0.85 : 0.5}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{
                      transition: 'all 0.3s ease',
                      filter: isHovered
                        ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 4px 8px rgba(0,0,0,0.4))`
                        : `drop-shadow(0 0 8px ${color}90)`,
                    }}
                  />

                  {/* Fingertip Home Row Key Badge */}
                  <text
                    x={finger.cx}
                    y={finger.cy + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={isHovered ? '14' : '12'}
                    fontWeight="900"
                    style={{
                      pointerEvents: 'none',
                      fontFamily: "'JetBrains Mono', monospace",
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {finger.homeKey}
                  </text>

                  {/* Floating Finger Name & Key Tooltip on Hover */}
                  {isHovered && (
                    <g
                      style={{
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {/* Tooltip background card */}
                      <rect
                        x={finger.cx - 65}
                        y={finger.cy - 75}
                        width="130"
                        height="48"
                        rx="12"
                        fill="rgba(15, 23, 42, 0.92)"
                        stroke={color}
                        strokeWidth="2"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
                        }}
                      />
                      {/* Tooltip Title & Symbol */}
                      <text
                        x={finger.cx}
                        y={finger.cy - 56}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="800"
                      >
                        {FINGER_SYMBOLS[finger.idx]?.symbol} {FINGER_LABELS[finger.idx]}
                      </text>
                      {/* Tooltip Keys */}
                      <text
                        x={finger.cx}
                        y={finger.cy - 40}
                        textAnchor="middle"
                        fill={color}
                        fontSize="10"
                        fontWeight="700"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {finger.keys}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Interactive Finger Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-3xl">
        {FINGER_CONFIGS.map((finger) => {
          const color = FINGER_COLORS[finger.idx];
          const isHovered = currentHoveredIdx === finger.idx;

          return (
            <motion.div
              key={finger.idx}
              whileHover={{ scale: 1.04, y: -2 }}
              onMouseEnter={() => setInternalHoverIdx(finger.idx)}
              onMouseLeave={() => setInternalHoverIdx(null)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: isHovered ? `${color}25` : `${color}12`,
                border: isHovered ? `2px solid ${color}` : `1.5px solid ${color}40`,
                boxShadow: isHovered ? `0 8px 16px -2px ${color}35` : 'none',
              }}
            >
              <div
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}`,
                }}
              >
                {finger.homeKey}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate leading-tight flex items-center gap-1">
                  <span>{FINGER_LABELS[finger.idx]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({FINGER_SYMBOLS[finger.idx]?.symbol})</span>
                </div>
                <div className="text-[10px] font-mono text-body font-semibold truncate mt-0.5">
                  {finger.keys}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FingerGuide;
