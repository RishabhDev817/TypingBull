/**
 * AITutorReport — Glassmorphic modal presenting AI-driven typing diagnostics.
 *
 * Features:
 *   - Mascot avatar with conversational feedback
 *   - Flaw cards with severity badges and curriculum replay buttons
 *   - SVG keyboard heatmap (weak keys glow red/amber)
 *   - WPM stamina bar chart (30-second windows)
 *   - WPM progress bar (current vs. target)
 *   - Overall grade badge
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, RotateCcw, TrendingUp, AlertTriangle,
  CheckCircle2, Sparkles, Brain, Zap, BarChart3,
} from 'lucide-react';
import { Mascot } from './Mascot';
import { AITutorChat } from './AITutorChat';
import { soundEngine } from '../utils/audio';
import type { SessionResult } from '../engine/typingEngine';
import {
  generateSessionReport,
  generateLifetimeReport,
  type TutorReport,
  type FlawDiagnosis,
} from '../engine/tutorDiagnostics';

// ─── Props ─────────────────────────────────────────────────────────

interface AITutorReportProps {
  /** A single session result to analyze. If null, uses lifetime stats. */
  sessionResult?: SessionResult | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Target WPM for progress bar */
  targetWpm?: number;
  /** Whether to show replay lesson buttons */
  showReplayButtons?: boolean;
}

// ─── Heatmap Keyboard Layout (simplified for the mini heatmap) ────

interface HeatmapKey {
  key: string;
  label: string;
  x: number;
  y: number;
  w: number;
}

const HEATMAP_ROWS: HeatmapKey[][] = [
  // Row 0: Number row
  [
    { key: '`', label: '`', x: 0, y: 0, w: 1 },
    { key: '1', label: '1', x: 1, y: 0, w: 1 },
    { key: '2', label: '2', x: 2, y: 0, w: 1 },
    { key: '3', label: '3', x: 3, y: 0, w: 1 },
    { key: '4', label: '4', x: 4, y: 0, w: 1 },
    { key: '5', label: '5', x: 5, y: 0, w: 1 },
    { key: '6', label: '6', x: 6, y: 0, w: 1 },
    { key: '7', label: '7', x: 7, y: 0, w: 1 },
    { key: '8', label: '8', x: 8, y: 0, w: 1 },
    { key: '9', label: '9', x: 9, y: 0, w: 1 },
    { key: '0', label: '0', x: 10, y: 0, w: 1 },
    { key: '-', label: '-', x: 11, y: 0, w: 1 },
    { key: '=', label: '=', x: 12, y: 0, w: 1 },
  ],
  // Row 1: QWERTY
  [
    { key: 'q', label: 'Q', x: 1.5, y: 1, w: 1 },
    { key: 'w', label: 'W', x: 2.5, y: 1, w: 1 },
    { key: 'e', label: 'E', x: 3.5, y: 1, w: 1 },
    { key: 'r', label: 'R', x: 4.5, y: 1, w: 1 },
    { key: 't', label: 'T', x: 5.5, y: 1, w: 1 },
    { key: 'y', label: 'Y', x: 6.5, y: 1, w: 1 },
    { key: 'u', label: 'U', x: 7.5, y: 1, w: 1 },
    { key: 'i', label: 'I', x: 8.5, y: 1, w: 1 },
    { key: 'o', label: 'O', x: 9.5, y: 1, w: 1 },
    { key: 'p', label: 'P', x: 10.5, y: 1, w: 1 },
    { key: '[', label: '[', x: 11.5, y: 1, w: 1 },
    { key: ']', label: ']', x: 12.5, y: 1, w: 1 },
  ],
  // Row 2: Home ASDF
  [
    { key: 'a', label: 'A', x: 1.75, y: 2, w: 1 },
    { key: 's', label: 'S', x: 2.75, y: 2, w: 1 },
    { key: 'd', label: 'D', x: 3.75, y: 2, w: 1 },
    { key: 'f', label: 'F', x: 4.75, y: 2, w: 1 },
    { key: 'g', label: 'G', x: 5.75, y: 2, w: 1 },
    { key: 'h', label: 'H', x: 6.75, y: 2, w: 1 },
    { key: 'j', label: 'J', x: 7.75, y: 2, w: 1 },
    { key: 'k', label: 'K', x: 8.75, y: 2, w: 1 },
    { key: 'l', label: 'L', x: 9.75, y: 2, w: 1 },
    { key: ';', label: ';', x: 10.75, y: 2, w: 1 },
    { key: "'", label: "'", x: 11.75, y: 2, w: 1 },
  ],
  // Row 3: ZXCV
  [
    { key: 'z', label: 'Z', x: 2.25, y: 3, w: 1 },
    { key: 'x', label: 'X', x: 3.25, y: 3, w: 1 },
    { key: 'c', label: 'C', x: 4.25, y: 3, w: 1 },
    { key: 'v', label: 'V', x: 5.25, y: 3, w: 1 },
    { key: 'b', label: 'B', x: 6.25, y: 3, w: 1 },
    { key: 'n', label: 'N', x: 7.25, y: 3, w: 1 },
    { key: 'm', label: 'M', x: 8.25, y: 3, w: 1 },
    { key: ',', label: ',', x: 9.25, y: 3, w: 1 },
    { key: '.', label: '.', x: 10.25, y: 3, w: 1 },
    { key: '/', label: '/', x: 11.25, y: 3, w: 1 },
  ],
  // Row 4: Spacebar
  [
    { key: ' ', label: 'SPACEBAR', x: 3.75, y: 4, w: 6.5 },
  ],
];

// ─── Helpers ───────────────────────────────────────────────────────

function getHeatColor(errorRate: number): string {
  if (errorRate <= 0) return 'rgba(241, 245, 249, 0.95)'; // crisp light slate
  if (errorRate < 0.1) return 'rgba(250, 204, 21, 0.45)'; // light amber
  if (errorRate < 0.2) return 'rgba(251, 146, 60, 0.65)'; // orange
  if (errorRate < 0.35) return 'rgba(239, 68, 68, 0.75)'; // red
  return 'rgba(220, 38, 38, 0.9)'; // deep red
}

function getHeatGlow(errorRate: number): string {
  if (errorRate < 0.1) return 'none';
  if (errorRate < 0.2) return '0 0 8px rgba(251, 146, 60, 0.5)';
  if (errorRate < 0.35) return '0 0 12px rgba(239, 68, 68, 0.6)';
  return '0 0 18px rgba(220, 38, 38, 0.7)';
}

const GRADE_CONFIG = {
  'excellent': { label: 'Excellent', emoji: '✨', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)' },
  'good': { label: 'Good', emoji: '👍', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  'needs-work': { label: 'Needs Work', emoji: '💪', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  'struggling': { label: 'Keep Trying', emoji: '🔧', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
};

const SEVERITY_CONFIG = {
  'high': { label: 'High', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)' },
  'medium': { label: 'Medium', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
  'low': { label: 'Low', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.35)' },
};

const STAMINA_COLORS = {
  'strong': '#22C55E',
  'moderate': '#F59E0B',
  'weak': '#EF4444',
};

// ─── Component ─────────────────────────────────────────────────────

export const AITutorReport: React.FC<AITutorReportProps> = ({
  sessionResult,
  isOpen,
  onClose,
  targetWpm = 40,
  showReplayButtons = true,
}) => {
  const navigate = useNavigate();
  const [report, setReport] = useState<TutorReport | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'chat'>('analytics');

  // Generate report
  useEffect(() => {
    if (!isOpen) return;
    const r = sessionResult
      ? generateSessionReport(sessionResult, targetWpm)
      : generateLifetimeReport(targetWpm);
    setReport(r);
    setTypewriterText('');
    setActiveTab('analytics');
  }, [isOpen, sessionResult, targetWpm]);

  // Typewriter effect for mascot message
  useEffect(() => {
    if (!report || !isOpen) return;
    const msg = report.mascotMessage;
    let idx = 0;
    setTypewriterText('');

    const interval = setInterval(() => {
      idx++;
      setTypewriterText(msg.slice(0, idx));
      if (idx >= msg.length) clearInterval(interval);
    }, 18);

    return () => clearInterval(interval);
  }, [report, isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!report) return null;

  const gradeInfo = GRADE_CONFIG[report.grade];

  // ─── Heatmap sub-component ─────────────────────────────────
  // ─── Heatmap sub-component ─────────────────────────────────
  const renderHeatmap = () => {
    const UNIT = 30;
    const GAP = 3;
    const STEP = UNIT + GAP;
    const svgWidth = 14 * STEP + UNIT;
    const svgHeight = 5 * STEP + 14;

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[500px] overflow-visible"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.06))' }}
      >
        {HEATMAP_ROWS.flatMap((row) =>
          row.map((k) => {
            const errorRate = report.keyHeatmap[k.key] || 0;
            const fill = getHeatColor(errorRate);
            const px = k.x * STEP;
            const py = k.y * STEP;
            const kw = k.w * STEP - GAP;
            const kh = UNIT;
            const hasError = errorRate > 0.05;

            return (
              <g key={k.key}>
                {/* Key shadow */}
                <rect
                  x={px + 0.5}
                  y={py + 1.5}
                  width={kw}
                  height={kh}
                  rx={5}
                  fill="rgba(0,0,0,0.07)"
                />
                {/* Key body */}
                <rect
                  x={px}
                  y={py}
                  width={kw}
                  height={kh}
                  rx={5}
                  fill={fill}
                  stroke={hasError ? 'rgba(239, 68, 68, 0.85)' : 'rgba(203, 213, 225, 0.85)'}
                  strokeWidth={hasError ? 1.5 : 1}
                />
                {/* Key label */}
                <text
                  x={px + kw / 2}
                  y={py + kh / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hasError ? '#FFFFFF' : '#334155'}
                  fontSize={hasError ? 11 : 10}
                  fontWeight={hasError ? 800 : 700}
                  fontFamily="var(--font-sans)"
                >
                  {k.label}
                </text>
                {/* Error rate label for significant errors */}
                {errorRate >= 0.1 && (
                  <text
                    x={px + kw / 2}
                    y={py + kh - 3.5}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.95)"
                    fontSize={7.5}
                    fontWeight={800}
                    fontFamily="var(--font-sans)"
                  >
                    {Math.round(errorRate * 100)}%
                  </text>
                )}
                {/* Pulsing glow for high error keys */}
                {errorRate >= 0.25 && (
                  <rect
                    x={px - 2}
                    y={py - 2}
                    width={kw + 4}
                    height={kh + 4}
                    rx={7}
                    fill="none"
                    stroke="rgba(239, 68, 68, 0.5)"
                    strokeWidth={1.5}
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })
        )}
      </svg>
    );
  };

  // ─── Stamina bar chart ─────────────────────────────────────
  const renderStaminaChart = () => {
    const windows = report.stamina.wpmWindows;
    if (windows.length < 2) return null;

    const maxWpm = Math.max(...windows.map(w => w.wpm), 1);
    const chartWidth = 280;
    const chartHeight = 100;
    const barGap = 4;
    const barWidth = Math.min(32, (chartWidth - barGap * (windows.length - 1)) / windows.length);
    const totalBarsWidth = windows.length * barWidth + (windows.length - 1) * barGap;
    const startX = (chartWidth - totalBarsWidth) / 2;

    const peakIdx = windows.reduce((best, w, i) => w.wpm > windows[best].wpm ? i : best, 0);
    const minIdx = windows.reduce((worst, w, i) => w.wpm < windows[worst].wpm ? i : worst, 0);

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full max-w-[300px]">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <line
            key={pct}
            x1={0}
            y1={chartHeight * (1 - pct)}
            x2={chartWidth}
            y2={chartHeight * (1 - pct)}
            stroke="rgba(148, 163, 184, 0.15)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Bars */}
        {windows.map((w, i) => {
          const barH = Math.max(4, (w.wpm / maxWpm) * chartHeight);
          const x = startX + i * (barWidth + barGap);
          const y = chartHeight - barH;

          let barColor = 'rgba(59, 130, 246, 0.7)';
          if (i === peakIdx) barColor = 'rgba(34, 197, 94, 0.85)';
          else if (i === minIdx) barColor = 'rgba(239, 68, 68, 0.75)';

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={3}
                fill={barColor}
              />
              {/* WPM label on bar */}
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fill="rgba(226, 232, 240, 0.8)"
                fontSize={8}
                fontWeight={700}
                fontFamily="var(--font-sans)"
              >
                {w.wpm}
              </text>
              {/* Window label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 14}
                textAnchor="middle"
                fill="rgba(148, 163, 184, 0.5)"
                fontSize={7}
                fontWeight={600}
                fontFamily="var(--font-sans)"
              >
                {(w.windowIndex + 1) * 30}s
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ─── Flaw card sub-component ───────────────────────────────
  const renderFlawCard = (flaw: FlawDiagnosis) => {
    const sevInfo = SEVERITY_CONFIG[flaw.severity];

    return (
      <motion.div
        key={flaw.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 rounded-2xl border backdrop-blur-md bg-white/80 dark:bg-slate-800/70 shadow-xs"
        style={{
          borderColor: sevInfo.border,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{ background: sevInfo.bg, color: sevInfo.color, border: `1px solid ${sevInfo.border}` }}
            >
              {sevInfo.label}
            </span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{flaw.label}</span>
          </div>
          <span className="text-xs font-black" style={{ color: sevInfo.color }}>
            {Math.round(flaw.errorRate * 100)}% err
          </span>
        </div>

        {/* Affected key caps */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {flaw.keys.map(k => (
            <span
              key={k}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[11px] font-black text-white shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${sevInfo.color}, ${sevInfo.color}CC)`,
                border: `1px solid ${sevInfo.color}`,
                boxShadow: getHeatGlow(flaw.errorRate),
              }}
            >
              {k.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Error rate bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-3 bg-slate-200/80 dark:bg-slate-700/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(flaw.errorRate * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${sevInfo.color}88, ${sevInfo.color})` }}
          />
        </div>

        {/* Recommendation text */}
        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mb-3">
          {flaw.recommendation}
        </p>

        {/* Replay button */}
        {showReplayButtons && flaw.replayLessonStart && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playPop();
              onClose();
              navigate(`/learn/${flaw.replayLessonStart}`);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            style={{
              background: `linear-gradient(135deg, ${sevInfo.color}, ${sevInfo.color}DD)`,
              boxShadow: `0 4px 14px ${sevInfo.color}35`,
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            🔄 Replay Lesson: {flaw.replayLabel}
          </motion.button>
        )}
      </motion.div>
    );
  };

  // ─── Main Render ───────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 border-2 border-white/90 dark:border-slate-700/80 backdrop-blur-2xl"
            style={{
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.18), 0 0 35px rgba(168, 85, 247, 0.12)',
            }}
          >
            {/* Scrollable content with subtle gray scrollbar and generous bottom padding */}
            <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8 pb-14 md:pb-16 tutor-scrollbar">

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 text-slate-500 hover:text-slate-900 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer shadow-xs"
                aria-label="Close AI Tutor Report"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ─── Header ────────────────────────────────── */}
              <div className="flex items-center gap-4 mb-5">
                <Mascot mood="thinking" size="md" />
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    AI Typing Tutor
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                    {sessionResult ? 'Session Analysis' : 'Lifetime Overview'}
                  </p>
                </div>

                {/* Grade badge */}
                <div className="ml-auto">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 shadow-xs"
                    style={{
                      background: gradeInfo.bg,
                      color: gradeInfo.color,
                      border: `1.5px solid ${gradeInfo.border}`,
                    }}
                  >
                    {gradeInfo.emoji} {gradeInfo.label}
                  </span>
                </div>
              </div>

              {/* ─── Tab Navigation Bar ─────────────────────── */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 mb-5">
                <button
                  onClick={() => { soundEngine.playPop(); setActiveTab('analytics'); }}
                  className={`relative flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'analytics' && (
                    <motion.div
                      layoutId="tutorActiveTab"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 shadow-xs"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>📊</span>
                    <span>Analytics</span>
                  </span>
                </button>

                <button
                  onClick={() => { soundEngine.playPop(); setActiveTab('chat'); }}
                  className={`relative flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'chat'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'chat' && (
                    <motion.div
                      layoutId="tutorActiveTab"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700 shadow-xs"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>💬</span>
                    <span>Chat Tutor</span>
                  </span>
                </button>
              </div>

              {/* ─── Tab 1: Analytics Content ───────────────── */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* ─── Mascot Chat Bubble ─────────────────────── */}
                  <div
                    className="relative p-4 rounded-2xl mb-6 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 border border-purple-400/30 dark:border-purple-500/30"
                  >
                    {/* Speech triangle */}
                    <div
                      className="absolute -top-2 left-16 w-4 h-4 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-purple-400/30 dark:border-purple-500/30"
                    />
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed min-h-[40px]">
                  {typewriterText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block w-[2px] h-[14px] bg-purple-500 ml-0.5 align-middle"
                  />
                </p>
              </div>

              {/* ─── WPM Progress Bar ──────────────────────── */}
              <div
                className="p-4 rounded-2xl mb-5 bg-white/75 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                    Average WPM vs Target
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {report.averageWpm} <span className="text-slate-500 dark:text-slate-400">/ {report.targetWpm} WPM</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-700/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((report.averageWpm / report.targetWpm) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: report.averageWpm >= report.targetWpm
                        ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                        : report.averageWpm >= report.targetWpm * 0.7
                          ? 'linear-gradient(90deg, #3B82F6, #2563EB)'
                          : 'linear-gradient(90deg, #F59E0B, #D97706)',
                    }}
                  />
                </div>
                {report.averageWpm >= report.targetWpm && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Target reached! Time to level up.</span>
                  </div>
                )}
              </div>

              {/* ─── Flaws Section ─────────────────────────── */}
              {report.flaws.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Identified Weaknesses ({report.flaws.length})
                  </h3>
                  <div className="space-y-3">
                    {report.flaws.map(renderFlawCard)}
                  </div>
                </div>
              )}

              {report.flaws.length === 0 && (
                <div
                  className="p-4 rounded-2xl mb-5 text-center bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-600/40"
                >
                  <Sparkles className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">No major weaknesses detected — great job!</p>
                </div>
              )}

              {/* ─── Weak Key Heatmap ──────────────────────── */}
              <div className="mb-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Weak Key Heatmap
                </h3>
                <div
                  className="p-4 md:p-5 rounded-2xl flex justify-center bg-white/75 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs overflow-visible"
                >
                  {renderHeatmap()}
                </div>
                {/* Heatmap legend */}
                <div className="flex items-center justify-center gap-4 mt-2.5">
                  {[
                    { label: 'No Errors', color: 'rgba(241, 245, 249, 0.95)', border: '1px solid rgba(203, 213, 225, 0.9)' },
                    { label: 'Low', color: 'rgba(250, 204, 21, 0.45)', border: '1px solid rgba(250, 204, 21, 0.6)' },
                    { label: 'Medium', color: 'rgba(251, 146, 60, 0.65)', border: '1px solid rgba(251, 146, 60, 0.8)' },
                    { label: 'High', color: 'rgba(239, 68, 68, 0.75)', border: '1px solid rgba(239, 68, 68, 0.9)' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded shadow-2xs" style={{ background: l.color, border: l.border }} />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Stamina Section ───────────────────────── */}
              {report.stamina.wpmWindows.length >= 2 && (
                <div className="mb-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
                    Typing Stamina
                    <span
                      className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                      style={{
                        color: STAMINA_COLORS[report.stamina.verdict],
                        background: `${STAMINA_COLORS[report.stamina.verdict]}20`,
                        border: `1px solid ${STAMINA_COLORS[report.stamina.verdict]}40`,
                      }}
                    >
                      {report.stamina.verdict} {report.stamina.dropOffPercent > 0 && `(-${report.stamina.dropOffPercent}%)`}
                    </span>
                  </h3>

                  <div
                    className="p-4 rounded-2xl bg-white/75 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs"
                  >
                    <div className="flex justify-center mb-3">
                      {renderStaminaChart()}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold text-center leading-relaxed">
                      {report.stamina.message}
                    </p>
                  </div>
                </div>
              )}

              {/* ─── Bottom close action ───────────────────── */}
              <div className="flex justify-center pt-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    soundEngine.playPop();
                    onClose();
                  }}
                  className="px-9 py-3 rounded-2xl text-sm font-black text-white cursor-pointer bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all"
                >
                  Got It 👍
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── Tab 2: Chat Tutor Content ─────────────────── */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <AITutorChat
                report={report}
                sessionResult={sessionResult}
                onNavigateToLesson={(lessonId) => {
                  onClose();
                  navigate(`/learn/${lessonId}`);
                }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AITutorReport;
