import React, { useState, useEffect } from 'react';
import { Clock, Plus, Minus } from 'lucide-react';

interface Props {
  durationSeconds: number;
  onChange: (seconds: number) => void;
  compact?: boolean;
  label?: string;
  disabled?: boolean;
}

export const DURATION_PRESETS = [
  { label: '1m', minutes: 1, seconds: 60 },
  { label: '2m', minutes: 2, seconds: 120 },
  { label: '3m', minutes: 3, seconds: 180 },
  { label: '5m', minutes: 5, seconds: 300 },
  { label: '10m', minutes: 10, seconds: 600 },
  { label: '15m', minutes: 15, seconds: 900 },
  { label: '20m', minutes: 20, seconds: 1200 },
  { label: '30m', minutes: 30, seconds: 1800 },
  { label: '45m', minutes: 45, seconds: 2700 },
  { label: '60m', minutes: 60, seconds: 3600 },
];

export const MIN_DURATION_MINUTES = 1;
export const MAX_DURATION_MINUTES = 120; // Up to 2 hours for computer lab periods

export const DurationSelector: React.FC<Props> = ({
  durationSeconds,
  onChange,
  compact = false,
  label = 'Duration',
  disabled = false,
}) => {
  const currentTotalMinutes = Math.max(1, Math.round(durationSeconds / 60));
  const currentHours = Math.floor(currentTotalMinutes / 60);
  const currentRemainingMins = currentTotalMinutes % 60;

  const [customMinutesInput, setCustomMinutesInput] = useState<string>(String(currentTotalMinutes));
  const [hoursInput, setHoursInput] = useState<string>(String(currentHours));
  const [minsInput, setMinsInput] = useState<string>(String(currentRemainingMins));
  const [mode, setMode] = useState<'minutes' | 'hours-minutes'>('minutes');

  useEffect(() => {
    const totalMins = Math.max(1, Math.round(durationSeconds / 60));
    setCustomMinutesInput(String(totalMins));
    setHoursInput(String(Math.floor(totalMins / 60)));
    setMinsInput(String(totalMins % 60));
  }, [durationSeconds]);

  const handleApplyMinutes = (raw: number) => {
    const clamped = Math.min(MAX_DURATION_MINUTES, Math.max(MIN_DURATION_MINUTES, Math.round(raw)));
    setCustomMinutesInput(String(clamped));
    setHoursInput(String(Math.floor(clamped / 60)));
    setMinsInput(String(clamped % 60));
    onChange(clamped * 60);
  };

  const handleApplyHoursAndMinutes = (h: number, m: number) => {
    const total = h * 60 + m;
    const clamped = Math.min(MAX_DURATION_MINUTES, Math.max(MIN_DURATION_MINUTES, total));
    setCustomMinutesInput(String(clamped));
    setHoursInput(String(Math.floor(clamped / 60)));
    setMinsInput(String(clamped % 60));
    onChange(clamped * 60);
  };

  const handleDirectMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomMinutesInput(val);
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= MIN_DURATION_MINUTES) {
        const clamped = Math.min(MAX_DURATION_MINUTES, num);
        setHoursInput(String(Math.floor(clamped / 60)));
        setMinsInput(String(clamped % 60));
        onChange(clamped * 60);
      }
    }
  };

  const handleDirectMinuteBlur = () => {
    const num = parseInt(customMinutesInput, 10);
    if (isNaN(num) || num < MIN_DURATION_MINUTES) {
      handleApplyMinutes(MIN_DURATION_MINUTES);
    } else {
      handleApplyMinutes(num);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setHoursInput(val);
    const h = parseInt(val, 10) || 0;
    const m = parseInt(minsInput, 10) || 0;
    handleApplyHoursAndMinutes(h, m);
  };

  const handleMinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setMinsInput(val);
    const h = parseInt(hoursInput, 10) || 0;
    const m = parseInt(val, 10) || 0;
    handleApplyHoursAndMinutes(h, m);
  };

  const handleStep = (delta: number) => {
    if (disabled) return;
    const current = parseInt(customMinutesInput, 10) || currentTotalMinutes;
    handleApplyMinutes(current + delta);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label htmlFor="compact-duration-input" className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{label}:</span>
        </label>

        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-0.5">
          <button
            type="button"
            disabled={disabled || currentTotalMinutes <= MIN_DURATION_MINUTES}
            onClick={() => handleStep(-1)}
            aria-label="Decrease duration by 1 minute"
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer transition"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            id="compact-duration-input"
            type="text"
            inputMode="numeric"
            value={customMinutesInput}
            onChange={handleDirectMinuteChange}
            onBlur={handleDirectMinuteBlur}
            disabled={disabled}
            aria-label="Duration in minutes"
            className="w-10 text-center font-mono text-xs font-black bg-transparent text-slate-900 dark:text-white outline-none"
          />

          <button
            type="button"
            disabled={disabled || currentTotalMinutes >= MAX_DURATION_MINUTES}
            onClick={() => handleStep(1)}
            aria-label="Increase duration by 1 minute"
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer transition"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">min</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="custom-duration-input" className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Active: <strong className="text-blue-600 dark:text-blue-400 font-mono font-black">{currentTotalMinutes} min</strong>{' '}
            {currentHours > 0 && <span className="text-slate-500 dark:text-slate-400 font-normal">({currentHours}h {currentRemainingMins}m)</span>}
          </span>
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'minutes' ? 'hours-minutes' : 'minutes'))}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {mode === 'minutes' ? 'Switch to H:M' : 'Switch to Mins'}
          </button>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Duration Presets">
        {DURATION_PRESETS.map((p) => {
          const isSelected = currentTotalMinutes === p.minutes;
          return (
            <button
              key={p.seconds}
              type="button"
              disabled={disabled}
              onClick={() => handleApplyMinutes(p.minutes)}
              aria-pressed={isSelected}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              } disabled:opacity-50`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Duration Stepper & Direct Inputs */}
      {mode === 'minutes' ? (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom Duration:</span>
          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-1 shadow-xs">
            <button
              type="button"
              disabled={disabled || currentTotalMinutes <= MIN_DURATION_MINUTES}
              onClick={() => handleStep(-1)}
              aria-label="Decrease duration by 1 minute"
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center px-2">
              <input
                type="text"
                inputMode="numeric"
                id="custom-duration-input"
                value={customMinutesInput}
                onChange={handleDirectMinuteChange}
                onBlur={handleDirectMinuteBlur}
                disabled={disabled}
                aria-label="Custom minutes duration"
                className="w-12 text-center font-mono text-sm font-black bg-transparent text-slate-900 dark:text-white outline-none"
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Minutes</span>
            </div>

            <button
              type="button"
              disabled={disabled || currentTotalMinutes >= MAX_DURATION_MINUTES}
              onClick={() => handleStep(1)}
              aria-label="Increase duration by 1 minute"
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(1 to 120 mins)</span>
        </div>
      ) : (
        /* Hours & Minutes Split Controls */
        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom Time:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 px-2 py-1">
              <label htmlFor="duration-hours-input" className="text-xs font-bold text-slate-500 mr-1.5">Hours:</label>
              <input
                id="duration-hours-input"
                type="text"
                inputMode="numeric"
                value={hoursInput}
                onChange={handleHoursChange}
                disabled={disabled}
                className="w-8 text-center font-mono text-xs font-black bg-transparent text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 px-2 py-1">
              <label htmlFor="duration-mins-input" className="text-xs font-bold text-slate-500 mr-1.5">Mins:</label>
              <input
                id="duration-mins-input"
                type="text"
                inputMode="numeric"
                value={minsInput}
                onChange={handleMinsChange}
                disabled={disabled}
                className="w-10 text-center font-mono text-xs font-black bg-transparent text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">= {currentTotalMinutes} total minutes</span>
        </div>
      )}
    </div>
  );
};
