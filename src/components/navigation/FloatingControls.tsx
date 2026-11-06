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
  className = '',
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

  const SKY_LABELS = {
    day: { title: 'Sky: Day (click for Night)', aria: 'Sky mode: Day. Switch to Night' },
    night: { title: 'Sky: Night (click for Live sky that follows your clock)', aria: 'Sky mode: Night. Switch to Live sky' },
    auto: { title: 'Sky: Live, follows your clock (click for Day)', aria: 'Sky mode: Live, follows your clock. Switch to Day' },
  } as const;

  return (
    <div
      className={`relative z-[100] inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm ${className}`.trim()}
    >
      {/* 1. Sound Toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className="h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 rounded-full bg-transparent hover:bg-white/25 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
        title={muted ? 'Unmute sounds' : 'Mute sounds'}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {muted ? (
          <VolumeX className="w-4 h-4 text-rose-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        )}
      </button>

      {/* 2. Timer / Zen Toggle */}
      <button
        type="button"
        onClick={cycleTheme}
        className="h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 rounded-full bg-transparent hover:bg-white/25 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
        title={SKY_LABELS[mode].title}
        aria-label={SKY_LABELS[mode].aria}
      >
        {mode === 'day' && <Sun className="w-4 h-4 text-amber-500" />}
        {mode === 'night' && <Moon className="w-4 h-4 text-indigo-400" />}
        {mode === 'auto' && <Clock className="w-4 h-4 text-sky-400" />}
      </button>

      {/* 3. Language Selector ⌄ */}
      {showLanguageSwitcher && <LanguageSwitcher variant="transparent" />}

      {/* 4. Stat Overview Label (optional) */}
      {showLabel && (
        <div className="text-center text-[11px] font-extrabold text-direct uppercase tracking-wider">
          Stat Overview
        </div>
      )}
    </div>
  );
};

export default FloatingControls;
