import React, { useState } from 'react';

/**
 * Finger assignment colors — 8 fingers + 2 thumbs.
 * Left hand: pinky(0), ring(1), middle(2), index(3)
 * Right hand: index(4), middle(5), ring(6), pinky(7)
 * Thumbs: 8 (space bar)
 */
export const FINGER_COLORS: Record<number, string> = {
  0: '#f87171', // left pinky — Pastel Red/Pink
  1: '#fb923c', // left ring — Pastel Orange
  2: '#facc15', // left middle — Pastel Yellow
  3: '#4ade80', // left index — Pastel Green
  4: '#22d3ee', // right index — Pastel Cyan / Light Blue
  5: '#60a5fa', // right middle — Pastel Blue
  6: '#a78bfa', // right ring — Pastel Purple
  7: '#f472b6', // right pinky — Pastel Magenta
  8: '#94a3b8', // thumbs — space bar
};

export const FINGER_LABELS: Record<number, string> = {
  0: 'Left Pinky',
  1: 'Left Ring',
  2: 'Left Middle',
  3: 'Left Index',
  4: 'Right Index',
  5: 'Right Middle',
  6: 'Right Ring',
  7: 'Right Pinky',
  8: 'Thumbs',
};

export const FINGER_SYMBOLS: Record<number, { symbol: string; name: string; patternLabel: string }> = {
  0: { symbol: '▲', name: 'Triangle Up', patternLabel: 'Diagonal Lines ↗' },
  1: { symbol: '●', name: 'Circle', patternLabel: 'Polka Dots' },
  2: { symbol: '■', name: 'Square', patternLabel: 'Grid Mesh' },
  3: { symbol: '★', name: 'Star', patternLabel: 'Vertical Stripes' },
  4: { symbol: '✦', name: 'Diamond', patternLabel: 'Horizontal Stripes' },
  5: { symbol: '⬟', name: 'Pentagon', patternLabel: 'Diamond Mesh' },
  6: { symbol: '◈', name: 'Rhombus', patternLabel: 'Diagonal Lines ↖' },
  7: { symbol: '◉', name: 'Bullseye', patternLabel: 'Concentric Rings' },
  8: { symbol: '—', name: 'Bar', patternLabel: 'Solid Wave' },
};

interface KeyDef {
  key: string;
  label?: string;
  finger: number;
  width?: number; // width in units (1 unit = KEY_UNIT)
  x: number;
  y: number;
  isModifier?: boolean;
}

// Key dimensions
const KEY_SIZE = 44;
const KEY_GAP = 5;
const KEY_UNIT = KEY_SIZE + KEY_GAP; // 49px

// ─── Realistic ANSI Staggered Keyboard Layout ─────────────────────
// Total row width = 15.0 KEY_UNIT for all rows

const KEYBOARD_LAYOUT: KeyDef[] = [
  // ── Row 0: Number row (Total: 15.0u) ──
  { key: '`', finger: 0, x: 0, y: 0, width: 1 },
  { key: '1', finger: 0, x: 1, y: 0, width: 1 },
  { key: '2', finger: 1, x: 2, y: 0, width: 1 },
  { key: '3', finger: 2, x: 3, y: 0, width: 1 },
  { key: '4', finger: 3, x: 4, y: 0, width: 1 },
  { key: '5', finger: 3, x: 5, y: 0, width: 1 },
  { key: '6', finger: 4, x: 6, y: 0, width: 1 },
  { key: '7', finger: 4, x: 7, y: 0, width: 1 },
  { key: '8', finger: 5, x: 8, y: 0, width: 1 },
  { key: '9', finger: 6, x: 9, y: 0, width: 1 },
  { key: '0', finger: 7, x: 10, y: 0, width: 1 },
  { key: '-', finger: 7, x: 11, y: 0, width: 1 },
  { key: '=', finger: 7, x: 12, y: 0, width: 1 },
  { key: 'backspace', label: 'Backspace ⌫', finger: 7, x: 13, y: 0, width: 2, isModifier: true },

  // ── Row 1: Top QWERTY row (Tab 1.5u offset -> Q at x:1.5) (Total: 15.0u) ──
  { key: 'tab', label: 'Tab ⇥', finger: 0, x: 0, y: 1, width: 1.5, isModifier: true },
  { key: 'q', finger: 0, x: 1.5, y: 1, width: 1 },
  { key: 'w', finger: 1, x: 2.5, y: 1, width: 1 },
  { key: 'e', finger: 2, x: 3.5, y: 1, width: 1 },
  { key: 'r', finger: 3, x: 4.5, y: 1, width: 1 },
  { key: 't', finger: 3, x: 5.5, y: 1, width: 1 },
  { key: 'y', finger: 4, x: 6.5, y: 1, width: 1 },
  { key: 'u', finger: 4, x: 7.5, y: 1, width: 1 },
  { key: 'i', finger: 5, x: 8.5, y: 1, width: 1 },
  { key: 'o', finger: 6, x: 9.5, y: 1, width: 1 },
  { key: 'p', finger: 7, x: 10.5, y: 1, width: 1 },
  { key: '[', finger: 7, x: 11.5, y: 1, width: 1 },
  { key: ']', finger: 7, x: 12.5, y: 1, width: 1 },
  { key: '\\', label: '\\ |', finger: 7, x: 13.5, y: 1, width: 1.5 },

  // ── Row 2: Home ASDF row (Caps 1.75u offset -> A at x:1.75) (Total: 15.0u) ──
  { key: 'capslock', label: 'Caps Lock', finger: 0, x: 0, y: 2, width: 1.75, isModifier: true },
  { key: 'a', finger: 0, x: 1.75, y: 2, width: 1 },
  { key: 's', finger: 1, x: 2.75, y: 2, width: 1 },
  { key: 'd', finger: 2, x: 3.75, y: 2, width: 1 },
  { key: 'f', finger: 3, x: 4.75, y: 2, width: 1 },
  { key: 'g', finger: 3, x: 5.75, y: 2, width: 1 },
  { key: 'h', finger: 4, x: 6.75, y: 2, width: 1 },
  { key: 'j', finger: 4, x: 7.75, y: 2, width: 1 },
  { key: 'k', finger: 5, x: 8.75, y: 2, width: 1 },
  { key: 'l', finger: 6, x: 9.75, y: 2, width: 1 },
  { key: ';', finger: 7, x: 10.75, y: 2, width: 1 },
  { key: "'", finger: 7, x: 11.75, y: 2, width: 1 },
  { key: 'enter', label: 'Enter ↵', finger: 7, x: 12.75, y: 2, width: 2.25, isModifier: true },

  // ── Row 3: Bottom ZXCV row (Left Shift 2.25u offset -> Z at x:2.25) (Total: 15.0u) ──
  { key: 'shift', label: 'Shift ⇧', finger: 0, x: 0, y: 3, width: 2.25, isModifier: true },
  { key: 'z', finger: 0, x: 2.25, y: 3, width: 1 },
  { key: 'x', finger: 1, x: 3.25, y: 3, width: 1 },
  { key: 'c', finger: 2, x: 4.25, y: 3, width: 1 },
  { key: 'v', finger: 3, x: 5.25, y: 3, width: 1 },
  { key: 'b', finger: 3, x: 6.25, y: 3, width: 1 },
  { key: 'n', finger: 4, x: 7.25, y: 3, width: 1 },
  { key: 'm', finger: 4, x: 8.25, y: 3, width: 1 },
  { key: ',', finger: 5, x: 9.25, y: 3, width: 1 },
  { key: '.', finger: 6, x: 10.25, y: 3, width: 1 },
  { key: '/', finger: 7, x: 11.25, y: 3, width: 1 },
  { key: 'shift_right', label: 'Shift ⇧', finger: 7, x: 12.25, y: 3, width: 2.75, isModifier: true },

  // ── Row 4: Space Bar & Modifiers row (Total: 15.0u) ──
  { key: 'ctrl_left', label: 'Ctrl', finger: 0, x: 0, y: 4, width: 1.25, isModifier: true },
  { key: 'meta_left', label: '⌘', finger: 0, x: 1.25, y: 4, width: 1.25, isModifier: true },
  { key: 'alt_left', label: 'Alt', finger: 0, x: 2.5, y: 4, width: 1.25, isModifier: true },
  { key: ' ', label: 'SPACE (THUMBS)', finger: 8, x: 3.75, y: 4, width: 6.25 },
  { key: 'alt_right', label: 'Alt', finger: 7, x: 10.0, y: 4, width: 1.25, isModifier: true },
  { key: 'meta_right', label: '⌘', finger: 7, x: 11.25, y: 4, width: 1.25, isModifier: true },
  { key: 'menu', label: '☰', finger: 7, x: 12.5, y: 4, width: 1.25, isModifier: true },
  { key: 'ctrl_right', label: 'Ctrl', finger: 7, x: 13.75, y: 4, width: 1.25, isModifier: true },
];

// ─── Finger-to-key map (exported for use by Learn mode) ──────────

export const FINGER_KEY_MAP: Record<number, string[]> = {};
KEYBOARD_LAYOUT.forEach(k => {
  if (k.isModifier) return; // Only map actual typing target keys
  if (!FINGER_KEY_MAP[k.finger]) FINGER_KEY_MAP[k.finger] = [];
  FINGER_KEY_MAP[k.finger].push(k.key);
});

// ─── Key lookup by key character ─────────────────────────────────

export function getFingerForKey(key: string): number {
  const found = KEYBOARD_LAYOUT.find(k => k.key === key.toLowerCase());
  return found ? found.finger : -1;
}

// ─── Component ────────────────────────────────────────────────────

interface KeyboardDiagramProps {
  /** Keys to visually highlight (e.g., the current lesson's target keys) */
  highlightKeys?: string[];
  /** The currently active key being typed */
  activeKey?: string;
  /** Keys that have errors — shown with a red indicator */
  errorKeys?: string[];
  /** Compact mode for inline use in lessons */
  compact?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Optional hover callback */
  onKeyHover?: (key: string | null, fingerIdx?: number) => void;
  /** Show subtle tactile pattern overlays on keys (Colorblind aid) */
  showPatterns?: boolean;
  /** Show tactile geometric symbols (▲, ●, ■, ★) on keycaps */
  showSymbols?: boolean;
  /** Show resting touch anchors on home row keys */
  showHandShadows?: boolean;
}

export const KeyboardDiagram: React.FC<KeyboardDiagramProps> = ({
  highlightKeys = [],
  activeKey = '',
  errorKeys = [],
  compact = false,
  className = '',
  onKeyHover,
  showPatterns = true,
  showSymbols = false,
  showHandShadows = true,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const highlightSet = new Set(highlightKeys.map(k => k.toLowerCase()));
  const errorSet = new Set(errorKeys.map(k => k.toLowerCase()));
  const activeKeyLower = activeKey.toLowerCase();

  const svgWidth = 15 * KEY_UNIT;
  const numRows = compact ? 4 : 5;
  const svgHeight = numRows * KEY_UNIT + 10;

  const visibleKeys = compact
    ? KEYBOARD_LAYOUT.filter(k => k.y < 4)
    : KEYBOARD_LAYOUT;

  return (
    <div className={`keyboard-diagram-wrapper relative ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-w-3xl mx-auto drop-shadow-md select-none overflow-visible"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <defs>
          {/* 3D Key Gradients */}
          {Object.entries(FINGER_COLORS).map(([idx, color]) => (
            <linearGradient key={`grad-${idx}`} id={`key-grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.75" />
            </linearGradient>
          ))}
          {/* Dark key gradient */}
          <linearGradient id="dark-key-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2d36" />
            <stop offset="100%" stopColor="#181a20" />
          </linearGradient>
          {/* Modifier key gradient */}
          <linearGradient id="modifier-key-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22252e" />
            <stop offset="100%" stopColor="#14161c" />
          </linearGradient>

          {/* ─── Tactile SVG Patterns for Colorblind Friendliness ─── */}
          {/* 0: Left Pinky (Diagonal ↗) */}
          <pattern id="finger-pattern-0" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />
          </pattern>
          {/* 1: Left Ring (Polka Dots) */}
          <pattern id="finger-pattern-1" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.5)" />
          </pattern>
          {/* 2: Left Middle (Grid Mesh) */}
          <pattern id="finger-pattern-2" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,0 h8 M0,0 v8" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
          </pattern>
          {/* 3: Left Index (Vertical Stripes) */}
          <pattern id="finger-pattern-3" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
          </pattern>
          {/* 4: Right Index (Horizontal Stripes) */}
          <pattern id="finger-pattern-4" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
          </pattern>
          {/* 5: Right Middle (Diamond Mesh) */}
          <pattern id="finger-pattern-5" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M4,0 L8,4 L4,8 L0,4 Z" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
          </pattern>
          {/* 6: Right Ring (Diagonal ↖) */}
          <pattern id="finger-pattern-6" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2,6 l4,4 M0,0 l8,8 M6,-2 l4,4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />
          </pattern>
          {/* 7: Right Pinky (Concentric Rings & Dots) */}
          <pattern id="finger-pattern-7" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.2" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
            <circle cx="4" cy="4" r="0.8" fill="rgba(255,255,255,0.55)" />
          </pattern>
          {/* 8: Space / Thumbs (Wave) */}
          <pattern id="finger-pattern-8" width="12" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,3 Q3,0 6,3 T12,3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          </pattern>

          {/* ─── Hand Shadow Translucent Gradients & Filters ─── */}
          <linearGradient id="hand-shadow-left-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(30, 41, 59, 0.28)" />
            <stop offset="40%" stopColor="rgba(30, 41, 59, 0.15)" />
            <stop offset="75%" stopColor="rgba(30, 41, 59, 0.08)" />
            <stop offset="100%" stopColor="rgba(30, 41, 59, 0.02)" />
          </linearGradient>

          <linearGradient id="hand-shadow-right-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(30, 41, 59, 0.28)" />
            <stop offset="40%" stopColor="rgba(30, 41, 59, 0.15)" />
            <stop offset="75%" stopColor="rgba(30, 41, 59, 0.08)" />
            <stop offset="100%" stopColor="rgba(30, 41, 59, 0.02)" />
          </linearGradient>

          <filter id="hand-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* ─── Premium Glassmorphic / Holographic Hand Shaders ─── */}
          <linearGradient id="glass-hand-fill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(241, 245, 249, 0.10)" />
            <stop offset="40%" stopColor="rgba(241, 245, 249, 0.22)" />
            <stop offset="75%" stopColor="rgba(255, 255, 255, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)" />
          </linearGradient>

          <linearGradient id="glass-rim-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.90)" />
            <stop offset="50%" stopColor="rgba(148, 163, 184, 0.50)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.75)" />
          </linearGradient>

          <filter id="glass-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render keys */}
        {visibleKeys.map((keyDef) => {
          const keyWidthUnits = keyDef.width || 1;
          const keyWidthPx = keyWidthUnits * KEY_UNIT - KEY_GAP;
          const px = keyDef.x * KEY_UNIT;
          const py = keyDef.y * KEY_UNIT;
          const isActive =
            keyDef.key === activeKeyLower ||
            (keyDef.key === 'shift_right' && activeKeyLower === 'shift') ||
            (keyDef.key === 'ctrl_left' && activeKeyLower === 'control') ||
            (keyDef.key === 'ctrl_right' && activeKeyLower === 'control') ||
            (keyDef.key === 'alt_left' && activeKeyLower === 'alt') ||
            (keyDef.key === 'alt_right' && activeKeyLower === 'alt') ||
            (keyDef.key === 'meta_left' && activeKeyLower === 'meta') ||
            (keyDef.key === 'meta_right' && activeKeyLower === 'meta');

          const isHighlighted = highlightSet.has(keyDef.key);
          const isError = errorSet.has(keyDef.key);
          const isHovered = hoveredKey === keyDef.key;
          const fingerColor = FINGER_COLORS[keyDef.finger];

          // Home row bumps on F and J
          const isHomeKey = keyDef.key === 'f' || keyDef.key === 'j';

          let fillColor = keyDef.isModifier ? 'url(#modifier-key-grad)' : 'url(#dark-key-grad)';
          let strokeColor = keyDef.isModifier ? '#333742' : '#383b45';
          let textColor = keyDef.isModifier ? '#6b7280' : '#94a3b8';
          let fillOpacity = 1;
          let filterEffect = 'none';

          if (isActive) {
            fillColor = `url(#key-grad-${keyDef.finger})`;
            strokeColor = '#ffffff';
            textColor = '#ffffff';
            fillOpacity = 1;
            filterEffect = `drop-shadow(0 0 16px ${fingerColor}) drop-shadow(0 4px 6px rgba(0,0,0,0.4))`;
          } else if (isError) {
            fillColor = '#7f1d1d';
            strokeColor = '#ef4444';
            textColor = '#fca5a5';
            filterEffect = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))';
          } else if (isHighlighted) {
            fillColor = `url(#key-grad-${keyDef.finger})`;
            strokeColor = fingerColor;
            textColor = '#ffffff';
            fillOpacity = 0.9;
            filterEffect = `drop-shadow(0 2px 8px ${fingerColor}80)`;
          }

          // Font size adjustments for labels vs single characters
          const labelText = keyDef.label || keyDef.key.toUpperCase();
          const isLongLabel = labelText.length > 2;
          const fontSize = isLongLabel ? 10 : 13;

          return (
            <g
              key={`${keyDef.key}-${keyDef.x}-${keyDef.y}`}
              className="keyboard-key-interactive"
              onMouseEnter={() => {
                setHoveredKey(keyDef.key);
                onKeyHover?.(keyDef.key, keyDef.finger);
              }}
              onMouseLeave={() => {
                setHoveredKey(null);
                onKeyHover?.(null);
              }}
              style={
                {
                  '--key-glow-color': fingerColor,
                } as React.CSSProperties
              }
            >
              {/* Key base 3D shadow */}
              <rect
                x={px + 2}
                y={py + 4}
                width={keyWidthPx - 4}
                height={KEY_SIZE - 4}
                rx={8}
                ry={8}
                fill="rgba(0, 0, 0, 0.45)"
              />

              {/* Keycap top */}
              <rect
                className="key-rect"
                x={px + 2}
                y={py + 2}
                width={keyWidthPx - 4}
                height={KEY_SIZE - 4}
                rx={8}
                ry={8}
                fill={fillColor}
                fillOpacity={fillOpacity}
                stroke={strokeColor}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{
                  filter: filterEffect,
                }}
              />

              {/* Subtle Tactile Pattern Overlay for Colorblind Distinction */}
              {showPatterns && !keyDef.isModifier && (isHighlighted || isActive || isHovered) && (
                <rect
                  x={px + 2}
                  y={py + 2}
                  width={keyWidthPx - 4}
                  height={KEY_SIZE - 4}
                  rx={8}
                  ry={8}
                  fill={`url(#finger-pattern-${keyDef.finger})`}
                  opacity={isActive ? 0.45 : isHighlighted ? 0.35 : 0.25}
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Subtle top specular highlight */}
              <rect
                x={px + 5}
                y={py + 3.5}
                width={Math.max(keyWidthPx - 10, 4)}
                height={2}
                rx={1}
                fill="rgba(255, 255, 255, 0.40)"
                style={{ pointerEvents: 'none' }}
              />

              {/* Tactile Geometric Symbol Badge (Colorblind aid) */}
              {(showSymbols || isHovered) && !keyDef.isModifier && FINGER_SYMBOLS[keyDef.finger] && (
                <text
                  x={px + keyWidthPx - 7}
                  y={py + 9}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill={isActive || isHighlighted ? '#ffffff' : fingerColor}
                  fontSize={8}
                  fontWeight={800}
                  opacity={isHovered ? 1 : 0.85}
                  style={{
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
                  }}
                >
                  {FINGER_SYMBOLS[keyDef.finger].symbol}
                </text>
              )}

              {/* Key Label Text */}
              <text
                x={px + keyWidthPx / 2}
                y={py + KEY_SIZE / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={fontSize}
                fontWeight={isActive || isHighlighted || isHovered ? 700 : keyDef.isModifier ? 500 : 600}
                letterSpacing={keyDef.key === ' ' ? 2 : 0}
                style={{
                  pointerEvents: 'none',
                  textShadow: isActive || isHighlighted ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                }}
              >
                {labelText}
              </text>

              {/* Home row indicator tactile bumps (F and J) */}
              {isHomeKey && (
                <rect
                  x={px + keyWidthPx / 2 - 5}
                  y={py + KEY_SIZE - 9}
                  width={10}
                  height={2.5}
                  rx={1.2}
                  fill={isActive ? '#ffffff' : '#94a3b8'}
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 3px #ffffff)' : 'none',
                  }}
                />
              )}
            </g>
          );
        })}

        {/* ─── Touch Beacons for Home Row Resting Posture ─── */}
        {showHandShadows && !compact && (
          <g className="keyboard-touch-beacons-layer" style={{ pointerEvents: 'none' }}>
            {/* Left Hand Touch Beacons (A, S, D, F, Space) */}
            {[
              { finger: 0, x: 107.75, y: 120, label: 'A' },
              { finger: 1, x: 156.75, y: 120, label: 'S' },
              { finger: 2, x: 205.75, y: 120, label: 'D' },
              { finger: 3, x: 254.75, y: 120, label: 'F' },
              { finger: 8, x: 228, y: 216, label: 'Thumb' },
            ].map(({ finger, x, y }) => {
              const color = FINGER_COLORS[finger];
              const isFingerActive = activeKeyLower === ' ' ? finger === 8 : getFingerForKey(activeKeyLower) === finger;
              const isFingerHovered = hoveredKey ? (hoveredKey === ' ' ? finger === 8 : getFingerForKey(hoveredKey) === finger) : false;

              return (
                <g key={`left-finger-beacon-${finger}`}>
                  {/* Outer Pulsing Aura on Active/Hover */}
                  {(isFingerActive || isFingerHovered) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={18}
                      fill={`${color}30`}
                      stroke={color}
                      strokeWidth={2}
                      style={{
                        transition: 'all 0.2s ease',
                        filter: `drop-shadow(0 0 10px ${color})`,
                      }}
                    />
                  )}
                  {/* Resting Anchor Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isFingerActive || isFingerHovered ? 4 : 2.5}
                    fill={isFingerActive || isFingerHovered ? color : 'rgba(255, 255, 255, 0.75)'}
                    stroke="rgba(0, 0, 0, 0.25)"
                    strokeWidth={0.5}
                  />
                </g>
              );
            })}

            {/* Right Hand Touch Beacons (J, K, L, ;, Space) */}
            {[
              { finger: 4, x: 401.75, y: 120, label: 'J' },
              { finger: 5, x: 450.75, y: 120, label: 'K' },
              { finger: 6, x: 499.75, y: 120, label: 'L' },
              { finger: 7, x: 548.75, y: 120, label: ';' },
              { finger: 8, x: 428, y: 216, label: 'Thumb' },
            ].map(({ finger, x, y }) => {
              const color = FINGER_COLORS[finger];
              const isFingerActive = activeKeyLower === ' ' ? finger === 8 : getFingerForKey(activeKeyLower) === finger;
              const isFingerHovered = hoveredKey ? (hoveredKey === ' ' ? finger === 8 : getFingerForKey(hoveredKey) === finger) : false;

              return (
                <g key={`right-finger-beacon-${finger}`}>
                  {/* Outer Pulsing Aura on Active/Hover */}
                  {(isFingerActive || isFingerHovered) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={18}
                      fill={`${color}30`}
                      stroke={color}
                      strokeWidth={2}
                      style={{
                        transition: 'all 0.2s ease',
                        filter: `drop-shadow(0 0 10px ${color})`,
                      }}
                    />
                  )}
                  {/* Resting Anchor Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isFingerActive || isFingerHovered ? 4 : 2.5}
                    fill={isFingerActive || isFingerHovered ? color : 'rgba(255, 255, 255, 0.75)'}
                    stroke="rgba(0, 0, 0, 0.25)"
                    strokeWidth={0.5}
                  />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};

export default KeyboardDiagram;
