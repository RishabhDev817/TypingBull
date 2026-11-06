import React from 'react';
import { SPEED_BANDS, bandForWpm } from '../seo/typingStats';

/** Scale shown on the gauge; anything above is pinned to the right edge. */
const SCALE_MAX = 120;

const SEGMENT_COLORS = ['bg-slate-400', 'bg-sky-500', 'bg-emerald-500', 'bg-lime-500', 'bg-amber-500', 'bg-orange-500'];

/** A horizontal bar of the six speed levels with a marker at the given WPM. */
export const SpeedGauge: React.FC<{ wpm: number; className?: string }> = ({ wpm, className = '' }) => {
  const band = bandForWpm(wpm);
  const markerPct = Math.min(100, Math.max(0, (wpm / SCALE_MAX) * 100));

  return (
    <div
      role="img"
      aria-label={`${wpm} words per minute: ${band.title}. Levels run from ${SPEED_BANDS[0].title} to ${SPEED_BANDS[SPEED_BANDS.length - 1].title}.`}
      className={`select-none ${className}`}
    >
      <div className="relative pt-7">
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-[left] duration-700 ease-out motion-reduce:transition-none"
          style={{ left: `${markerPct}%` }}
        >
          <span className="px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black whitespace-nowrap">
            {wpm} WPM
          </span>
          <span className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-slate-900 dark:border-t-white" />
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {SPEED_BANDS.map((b, i) => {
            const end = Number.isFinite(b.max) ? b.max : SCALE_MAX;
            const width = ((Math.min(end, SCALE_MAX) - b.min) / SCALE_MAX) * 100;
            return (
              <div
                key={b.id}
                style={{ width: `${width}%` }}
                className={`${SEGMENT_COLORS[i]} ${b.id === band.id ? 'opacity-100' : 'opacity-35'}`}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300" aria-hidden="true">
        <span>0</span>
        <span>{band.title}</span>
        <span>{SCALE_MAX}+ WPM</span>
      </div>
    </div>
  );
};

export default SpeedGauge;
