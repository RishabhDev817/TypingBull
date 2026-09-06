import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundEngine } from '../../utils/audio';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface FloatingControlsProps {
  className?: string;
  showLabel?: boolean;
  showLanguageSwitcher?: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  className = 'flex items-center gap-2',
  showLabel = false,
  showLanguageSwitcher = true,
}) => {
  const [muted, setMuted] = useState(soundEngine.muted);
  const { mode, setMode } = useTheme();

  const toggleMute = () => {
    const nextMuted = !soundEngine.muted;
    soundEngine.setMute(nextMuted);
    setMuted(nextMuted);
  };

  const cycleTheme = () => {
    soundEngine.playPop();
    if (mode === 'auto') setMode('day');
    else if (mode === 'day') setMode('night');
    else setMode('auto');
  };

  const hasPosition = /\b(fixed|absolute|sticky|relative|static)\b/.test(className);
  const basePosition = hasPosition ? '' : 'relative';

  return (
    <div className={`${basePosition} z-50 flex items-center gap-2 ${className}`.trim()}>
      {/* 1. Sound Toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className="h-10 w-10 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.15)] cursor-pointer flex items-center justify-center shrink-0"
        title={muted ? "Unmute sounds" : "Mute sounds"}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? (
          <VolumeX className="w-4.5 h-4.5 text-rose-400" />
        ) : (
          <Volume2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400" />
        )}
      </button>

      {/* 2. Timer / Zen Toggle */}
      <button
        type="button"
        onClick={cycleTheme}
        className="h-10 w-10 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.15)] cursor-pointer flex items-center justify-center shrink-0"
        title={`Theme / Zen: ${mode.toUpperCase()} mode (Click to switch Day/Night/Auto)`}
        aria-label={`Toggle Theme Mode (Current: ${mode})`}
      >
        {mode === 'day' && <Sun className="w-4.5 h-4.5 text-amber-400" />}
        {mode === 'night' && <Moon className="w-4.5 h-4.5 text-indigo-300" />}
        {mode === 'auto' && <Clock className="w-4.5 h-4.5 text-sky-400" />}
      </button>

      {/* 3. Language Selector ⌄ (Only on home dashboard) */}
      {showLanguageSwitcher && <LanguageSwitcher variant="compact" />}

      {/* 4. Stat Overview Label (Bottom - when embedded in header block) */}
      {showLabel && (
        <div className="text-center text-[11px] font-extrabold text-direct uppercase tracking-wider">
          Stat Overview
        </div>
      )}
    </div>
  );
};

export default FloatingControls;
