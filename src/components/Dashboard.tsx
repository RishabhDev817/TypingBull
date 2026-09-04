import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, Flame, Keyboard, Percent } from 'lucide-react';

interface DashboardProps {
  wpm: number;
  accuracy: number;
  maxStreak: number;
  totalTyped: number;
  timeLimit: number;
  wpmHistory: number[]; // WPM values recorded second by second
  onRestart: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  wpm,
  accuracy,
  maxStreak,
  totalTyped,
  timeLimit,
  wpmHistory,
  onRestart,
}) => {
  // Generate SVG path for the chart
  const generateChartPath = (width: number, height: number) => {
    if (wpmHistory.length < 2) return { linePath: '', areaPath: '' };

    const maxWpm = Math.max(...wpmHistory, 40); // default upper boundary
    const points = wpmHistory.map((val, idx) => {
      const x = (idx / (wpmHistory.length - 1)) * width;
      // Invert Y coordinate so 0 is at bottom
      const y = height - (val / maxWpm) * (height - 30) - 15;
      return { x, y };
    });

    const linePath = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return { linePath, areaPath };
  };

  const chartWidth = 500;
  const chartHeight = 150;
  const { linePath, areaPath } = generateChartPath(chartWidth, chartHeight);

  // Stagger animation helpers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl flex flex-col items-center gap-8 px-4"
    >
      {/* Header Greeting Banner */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-display-lg text-ink tracking-tight font-semibold">
          Typing test completed.
        </h2>
        <p className="text-body text-sm mt-1">
          Review your typing speed and accuracy performance chart below.
        </p>
      </motion.div>

      {/* Grid statistics container */}
      <motion.div
        variants={itemVariants}
        className="w-full grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* WPM Card */}
        <div className="bg-canvas border border-hairline p-5 rounded-lg flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-mute mb-2">
            <span className="text-[11px] uppercase tracking-wider font-mono">Speed</span>
            <Keyboard className="w-4 h-4 text-success" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-display-lg text-success font-semibold tracking-tight">
              {Math.round(wpm)}
            </span>
            <span className="text-xs text-mute font-mono">WPM</span>
          </div>
          {/* Faint indicator background graphic */}
          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-success/5 border border-success/10" />
        </div>

        {/* Accuracy Card */}
        <div className="bg-canvas border border-hairline p-5 rounded-lg flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-mute mb-2">
            <span className="text-[11px] uppercase tracking-wider font-mono">Accuracy</span>
            <Percent className="w-4 h-4 text-violet" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-display-lg text-ink font-semibold tracking-tight">
              {accuracy.toFixed(1)}
            </span>
            <span className="text-xs text-mute font-mono">%</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-violet/5 border border-violet/10" />
        </div>

        {/* Max Streak Card */}
        <div className="bg-canvas border border-hairline p-5 rounded-lg flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-mute mb-2">
            <span className="text-[11px] uppercase tracking-wider font-mono">Max Streak</span>
            <Flame className="w-4 h-4 text-warning" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-display-lg text-ink font-semibold tracking-tight">
              {maxStreak}
            </span>
            <span className="text-xs text-mute font-mono">chars</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-warning/5 border border-warning/10" />
        </div>

        {/* Total Characters Card */}
        <div className="bg-canvas border border-hairline p-5 rounded-lg flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-mute mb-2">
            <span className="text-[11px] uppercase tracking-wider font-mono">Total Typed</span>
            <CheckCircle className="w-4 h-4 text-mute" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-display-lg text-ink font-semibold tracking-tight">
              {totalTyped}
            </span>
            <span className="text-xs text-mute font-mono">keys</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-mute/5 border border-mute/10" />
        </div>
      </motion.div>

      {/* Custom Plotting Chart Container */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-canvas border border-hairline p-5 md:p-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 border-b border-hairline pb-3">
          <span className="text-xs font-mono font-medium text-ink uppercase tracking-wider">
            Realtime Speed Progression
          </span>
          <span className="text-[11px] font-sans text-mute">
            Duration: {timeLimit}s test
          </span>
        </div>

        {wpmHistory.length >= 2 ? (
          <div className="relative w-full h-[150px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Vercel inspired mesh-color gradient for chart */}
                <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#007cf0" />
                  <stop offset="50%" stopColor="#7928ca" />
                  <stop offset="100%" stopColor="#ff0080" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7928ca" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#7928ca" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="35" x2={chartWidth} y2="35" stroke="#f0f0f0" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2={chartWidth} y2="75" stroke="#f0f0f0" strokeDasharray="3,3" />
              <line x1="0" y1="115" x2={chartWidth} y2="115" stroke="#f0f0f0" strokeDasharray="3,3" />

              {/* Shaded area */}
              <path d={areaPath} fill="url(#areaGrad)" />

              {/* Plot line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#chartGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points dots */}
              {wpmHistory.map((val, idx) => {
                const x = (idx / (wpmHistory.length - 1)) * chartWidth;
                const maxW = Math.max(...wpmHistory, 40);
                const y = chartHeight - (val / maxW) * (chartHeight - 30) - 15;

                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="3.5"
                    className="fill-canvas stroke-[2px] stroke-primary hover:r-5 cursor-pointer transition-all"
                  />
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="w-full h-[150px] flex items-center justify-center text-mute text-xs font-mono">
            No graph details available (test aborted early).
          </div>
        )}
      </motion.div>

      {/* Reset/CTA area */}
      <motion.div variants={itemVariants} className="mt-2">
        <button
          onClick={onRestart}
          className="group flex items-center gap-2 bg-primary text-on-primary hover:bg-ink px-8 h-12 rounded-pill font-sans font-medium text-sm transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Retake Test
        </button>
      </motion.div>
    </motion.div>
  );
};
