import React from 'react';
import { Volume2, VolumeX, Code, TrendingUp, Globe, Timer } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  mode: 'standard' | 'developer' | 'wall-street';
  setMode: (mode: 'standard' | 'developer' | 'wall-street') => void;
  timeLimit: number;
  setTimeLimit: (time: number) => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
  soundMuted,
  setSoundMuted,
  onReset,
}) => {
  const toggleMute = () => {
    const nextMute = !soundMuted;
    setSoundMuted(nextMute);
    soundEngine.setMute(nextMute);
    // Play a brief click to confirm unmute
    if (!nextMute) {
      setTimeout(() => soundEngine.playClick(), 50);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-hairline bg-canvas/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
      {/* Brand logo block */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onReset}>
        <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-sm overflow-hidden shadow-sm">
          {/* Stylized geometric horns for the bull */}
          <div className="absolute top-2 w-4 h-1.5 border-t-2 border-x-2 border-on-primary rounded-t-full rotate-180"></div>
          <span className="text-on-primary font-mono text-xs font-bold mt-1">TB</span>
        </div>
        <div className="flex flex-col">
          <h1 className="font-sans text-sm font-semibold tracking-tight leading-none m-0 text-ink">
            Typing<span className="text-success">Bull</span>
          </h1>
          <span className="font-mono text-[10px] text-mute uppercase tracking-widest leading-none">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Center Settings & Tabs */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Word Mode selection */}
        <div className="flex bg-canvas-soft-2 p-0.5 rounded-pill-sm border border-hairline">
          <button
            onClick={() => { setMode('standard'); onReset(); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill-sm text-xs font-medium transition-all ${
              mode === 'standard'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Standard
          </button>
          <button
            onClick={() => { setMode('developer'); onReset(); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill-sm text-xs font-medium transition-all ${
              mode === 'developer'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Developer
          </button>
          <button
            onClick={() => { setMode('wall-street'); onReset(); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill-sm text-xs font-medium transition-all ${
              mode === 'wall-street'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Wall Street
          </button>
        </div>

        {/* Timer selection */}
        <div className="flex items-center gap-2 bg-canvas-soft-2 p-0.5 rounded-pill-sm border border-hairline">
          <div className="pl-3 pr-1 text-mute">
            <Timer className="w-3.5 h-3.5" />
          </div>
          {[15, 30, 60].map((t) => (
            <button
              key={t}
              onClick={() => { setTimeLimit(t); onReset(); }}
              className={`px-3 py-1.5 rounded-pill-sm text-xs font-medium transition-all ${
                timeLimit === t
                  ? 'bg-canvas text-ink shadow-sm'
                  : 'text-body hover:text-ink'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Sound toggle button */}
        <button
          onClick={toggleMute}
          title={soundMuted ? 'Unmute keypress sounds' : 'Mute keypress sounds'}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-hairline bg-canvas text-ink hover:bg-canvas-soft transition-all active:scale-95"
        >
          {soundMuted ? (
            <VolumeX className="w-4 h-4 text-error" />
          ) : (
            <Volume2 className="w-4 h-4 text-success" />
          )}
        </button>

        {/* Quick mobile dropdown toggler or details indicator */}
        <div className="flex lg:hidden bg-canvas-soft-2 p-0.5 rounded-pill-sm border border-hairline">
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as any); onReset(); }}
            className="bg-transparent text-xs font-medium px-2 py-1 text-ink focus:outline-none"
          >
            <option value="standard">Standard</option>
            <option value="developer">Developer</option>
            <option value="wall-street">Wall Street</option>
          </select>
          <select
            value={timeLimit}
            onChange={(e) => { setTimeLimit(Number(e.target.value)); onReset(); }}
            className="bg-transparent text-xs font-medium px-2 py-1 text-ink focus:outline-none border-l border-hairline"
          >
            <option value="15">15s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
          </select>
        </div>
      </div>
    </header>
  );
};
