import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundEngine } from '../../utils/audio';

interface FloatingControlsProps {
  className?: string;
  showLabel?: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  className = 'fixed top-4 right-4 lg:top-5 lg:right-5 z-50 flex flex-col items-center gap-3.5',
  showLabel = false,
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

  return (
    <div className={className}>
      {/* 1. Sound Mute Toggle */}
      <button
        onClick={toggleMute}
        className="w-11 h-11 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.3)] cursor-pointer flex items-center justify-center shrink-0"
        title={muted ? "Unmute sounds" : "Mute sounds"}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-rose-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-emerald-400" />
        )}
      </button>

      {/* 2. Theme Mode Switcher */}
      <button
        onClick={cycleTheme}
        className="w-11 h-11 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.3)] cursor-pointer flex items-center justify-center shrink-0"
        title={`Theme: ${mode.toUpperCase()} mode (Click to switch Day/Night/Auto)`}
        aria-label={`Toggle Theme Mode (Current: ${mode})`}
      >
        {mode === 'day' && <Sun className="w-5 h-5 text-amber-400" />}
        {mode === 'night' && <Moon className="w-5 h-5 text-indigo-300" />}
        {mode === 'auto' && <Clock className="w-5 h-5 text-sky-400" />}
      </button>

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
