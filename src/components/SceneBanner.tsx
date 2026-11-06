import React from 'react';
import { Mascot, type MascotMood } from './Mascot';

interface SceneBannerProps {
  title: string;
  children: React.ReactNode;
  mood?: MascotMood;
  /** Hide the mascot (for example while a result screen shows its own). */
  hideMascot?: boolean;
}

/**
 * Page header set in the same night-time railway world as the Learn map:
 * stars, two ridgelines and a rail line, with the bull standing beside the track.
 * Always a dark scene, so the text on it is fixed light and does not depend on the site theme.
 */
export const SceneBanner: React.FC<SceneBannerProps> = ({ title, children, mood = 'happy', hideMascot = false }) => (
  <header className="relative isolate overflow-hidden rounded-3xl border border-white/10 shadow-xl">
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 -z-10 w-full h-full"
      viewBox="0 0 800 240"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F1A36" />
          <stop offset="60%" stopColor="#1E294B" />
          <stop offset="100%" stopColor="#4A3F73" />
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill="url(#scene-sky)" />
      {/* stars */}
      {[[60, 30], [150, 70], [240, 22], [330, 55], [430, 28], [520, 66], [610, 20], [700, 48], [760, 90], [95, 110], [385, 100]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#E2E8F0" opacity={i % 2 ? 0.5 : 0.8} />
      ))}
      {/* far ridge with a snow cap */}
      <path d="M0 190 L90 130 L170 170 L270 100 L370 165 L470 120 L580 175 L690 110 L800 160 L800 240 L0 240 Z" fill="#26325A" />
      {/* moon, clear of the text column */}
      <circle cx="735" cy="42" r="15" fill="#E2E8F0" opacity="0.9" />
      <circle cx="741" cy="38" r="13" fill="#1E294B" opacity="0.55" />
      {/* near ridge */}
      <path d="M0 215 L120 175 L240 205 L360 170 L500 210 L640 178 L800 212 L800 240 L0 240 Z" fill="#17213F" />
      {/* rail line */}
      <path d="M0 222 Q200 206 400 218 T800 214" stroke="#94A3B8" strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M0 232 Q200 216 400 228 T800 224" stroke="#94A3B8" strokeWidth="3" fill="none" opacity="0.8" />
      <path
        d="M0 227 Q200 211 400 223 T800 219"
        stroke="#64748B"
        strokeWidth="9"
        strokeDasharray="2 14"
        fill="none"
        opacity="0.9"
      />
    </svg>

    <div className={`relative px-5 py-6 sm:px-8 sm:py-9 space-y-2 ${hideMascot ? '' : 'sm:pr-52'}`}>
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white text-balance">{title}</h1>
      <p className="text-base sm:text-lg font-semibold text-slate-200 max-w-2xl">{children}</p>
    </div>

    {!hideMascot && (
      <div className="hidden sm:block absolute right-8 bottom-3">
        <Mascot mood={mood} size="lg" />
      </div>
    )}
  </header>
);

export default SceneBanner;
