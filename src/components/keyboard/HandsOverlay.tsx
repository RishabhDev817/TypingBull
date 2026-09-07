import React from 'react';
import { FINGER_COLORS } from './KeyboardDiagram';

export interface HandsOverlayProps {
  /** Index of currently hovered finger (0-7: fingers, 8: thumbs) */
  hoveredFingerIdx?: number | null;
  /** Index of currently active finger from keyboard input */
  activeFingerIdx?: number | null;
  /** Overall opacity of the hands overlay (default: 0.72) */
  opacity?: number;
  /** Whether the hands overlay is visible */
  visible?: boolean;
}

interface FingerBeacon {
  idx: number;
  hand: 'left' | 'right';
  name: string;
  homeKey: string;
  tipX: number;
  tipY: number;
}

// Exact Key Centers on Home Row (Row 2, y: 120) and Space Bar (Row 4, y: 216)
const FINGER_BEACONS: FingerBeacon[] = [
  // ── LEFT HAND (Pinky on A, Ring on S, Middle on D, Index on F, Thumb on Space) ──
  { idx: 0, hand: 'left', name: 'Pinky', homeKey: 'A', tipX: 107.75, tipY: 120 },
  { idx: 1, hand: 'left', name: 'Ring', homeKey: 'S', tipX: 156.75, tipY: 120 },
  { idx: 2, hand: 'left', name: 'Middle', homeKey: 'D', tipX: 205.75, tipY: 120 },
  { idx: 3, hand: 'left', name: 'Index', homeKey: 'F', tipX: 254.75, tipY: 120 },
  { idx: 8, hand: 'left', name: 'Thumb', homeKey: 'Space', tipX: 228, tipY: 216 },

  // ── RIGHT HAND (Index on J, Middle on K, Ring on L, Pinky on ;, Thumb on Space) ──
  { idx: 4, hand: 'right', name: 'Index', homeKey: 'J', tipX: 401.75, tipY: 120 },
  { idx: 5, hand: 'right', name: 'Middle', homeKey: 'K', tipX: 450.75, tipY: 120 },
  { idx: 6, hand: 'right', name: 'Ring', homeKey: 'L', tipX: 499.75, tipY: 120 },
  { idx: 7, hand: 'right', name: 'Pinky', homeKey: ';', tipX: 548.75, tipY: 120 },
  { idx: 8, hand: 'right', name: 'Thumb', homeKey: 'Space', tipX: 428, tipY: 216 },
];

export const HandsOverlay: React.FC<HandsOverlayProps> = ({
  hoveredFingerIdx = null,
  activeFingerIdx = null,
  opacity = 0.72,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <g
      className="keyboard-realistic-hands-overlay transition-opacity duration-300 select-none"
      style={{
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Drop shadow for 3D elevation above keycaps */}
        <filter id="hand-realistic-depth" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.45)" />
        </filter>

        {/* Dynamic finger glow filters */}
        {Object.keys(FINGER_COLORS).map((idx) => (
          <filter key={`glow-filter-${idx}`} id={`finger-glow-${idx}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        ))}
      </defs>

      {/* ─── 3D REALISTIC HAND ASSETS LAYER ─── */}
      <g
        className="hands-3d-render-group"
        style={{
          opacity,
          mixBlendMode: 'screen',
          filter: 'url(#hand-realistic-depth) contrast(1.08) brightness(1.04)',
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Left Hand: High-fidelity 3D human hand asset with natural resting curvature */}
        <image
          href="/assets/left_hand_realistic.webp"
          width="1024"
          height="1024"
          transform="translate(49.5, 44.4) rotate(2.5) scale(0.32, 0.30)"
          className="left-hand-image"
          preserveAspectRatio="none"
        />

        {/* Right Hand: High-fidelity 3D human hand asset with natural resting curvature */}
        <image
          href="/assets/right_hand_realistic.webp"
          width="1024"
          height="1024"
          transform="translate(271.0, 66.8) rotate(-5) scale(0.34, 0.30)"
          className="right-hand-image"
          preserveAspectRatio="none"
        />
      </g>

      {/* ─── SECONDARY SOFT-LIGHT TINT LAYER (Enhances skin definition and prevents washout) ─── */}
      <g
        className="hands-3d-contrast-group"
        style={{
          opacity: opacity * 0.45,
          mixBlendMode: 'overlay',
          transition: 'opacity 0.25s ease',
        }}
      >
        <image
          href="/assets/left_hand_realistic.webp"
          width="1024"
          height="1024"
          transform="translate(49.5, 44.4) rotate(2.5) scale(0.32, 0.30)"
          preserveAspectRatio="none"
        />
        <image
          href="/assets/right_hand_realistic.webp"
          width="1024"
          height="1024"
          transform="translate(271.0, 66.8) rotate(-5) scale(0.34, 0.30)"
          preserveAspectRatio="none"
        />
      </g>

      {/* ─── INTERACTIVE FINGERTIP BEACONS & RESTING ANCHORS ─── */}
      <g className="hands-beacons-layer">
        {FINGER_BEACONS.map((beacon, i) => {
          const isHovered = hoveredFingerIdx === beacon.idx;
          const isActive = activeFingerIdx === beacon.idx;
          const isHighlighted = isHovered || isActive;
          const color = FINGER_COLORS[beacon.idx];

          return (
            <g
              key={`beacon-${beacon.hand}-${beacon.idx}-${i}`}
              className="finger-beacon-point transition-all duration-200"
            >
              {/* Outer pulsing animated beacon halo when highlighted */}
              {isHighlighted && (
                <g>
                  <circle
                    cx={beacon.tipX}
                    cy={beacon.tipY}
                    r={22}
                    fill={`${color}30`}
                    stroke={color}
                    strokeWidth={2}
                    style={{
                      filter: `drop-shadow(0 0 12px ${color})`,
                    }}
                  >
                    <animate
                      attributeName="r"
                      values="16;26;16"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      values="1;0.3;1"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Soft radial glow on the key surface */}
                  <circle
                    cx={beacon.tipX}
                    cy={beacon.tipY}
                    r={16}
                    fill={color}
                    fillOpacity={0.25}
                  />
                </g>
              )}

              {/* Dead-center resting alignment ring over keycap center */}
              <circle
                cx={beacon.tipX}
                cy={beacon.tipY}
                r={isHighlighted ? 12 : 9}
                fill="none"
                stroke={isHighlighted ? color : 'rgba(255, 255, 255, 0.55)'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={isHighlighted ? 'none' : '2.5 2'}
                className="transition-all duration-200"
                style={{
                  filter: isHighlighted
                    ? `drop-shadow(0 0 8px ${color})`
                    : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
                }}
              />

              {/* Exact center resting dot */}
              <circle
                cx={beacon.tipX}
                cy={beacon.tipY}
                r={isHighlighted ? 3.5 : 2}
                fill={isHighlighted ? '#ffffff' : 'rgba(255, 255, 255, 0.90)'}
                stroke={isHighlighted ? color : 'rgba(0, 0, 0, 0.4)'}
                strokeWidth={0.75}
              />

              {/* Home key letter pill on hover */}
              {isHighlighted && (
                <g
                  transform={`translate(${beacon.tipX}, ${beacon.tipY - 24})`}
                  style={{
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
                  }}
                >
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="18"
                    rx="9"
                    fill="#0f172a"
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="900"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {beacon.homeKey}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default HandsOverlay;
