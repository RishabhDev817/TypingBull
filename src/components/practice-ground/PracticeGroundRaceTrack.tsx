import React from 'react';
import { Flag, Trophy } from 'lucide-react';
import type { Player } from '../../types/multiplayer.ts';
import type { OpponentProgress } from '../../hooks/usePracticeGroundSocket';
import { useI18n } from '../../context/I18nContext';

interface Props {
  players: Player[];
  myPlayerId: string;
  opponentsProgress: Record<string, OpponentProgress>;
  myProgress: {
    progress: number;
    wpm: number;
    accuracy: number;
    finished: boolean;
  };
}

export const PracticeGroundRaceTrack: React.FC<Props> = ({
  players,
  myPlayerId,
  opponentsProgress,
  myProgress,
}) => {
  const { t } = useI18n();

  return (
    <div className="w-full p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700/80 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('multiplayer.liveTrack')}</span>
        </span>
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <Flag className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('multiplayer.finishLine')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {players.map((player) => {
          const isMe = player.id === myPlayerId;
          const opp = opponentsProgress[player.id];

          const progress = isMe ? myProgress.progress : opp ? opp.progress : player.progress || 0;
          const wpm = isMe ? myProgress.wpm : opp ? opp.wpm : player.wpm || 0;
          const accuracy = isMe ? myProgress.accuracy : opp ? opp.accuracy : player.accuracy || 100;
          const isFinished = isMe ? myProgress.finished : player.status === 'FINISHED';

          return (
            <div
              key={player.id}
              className={`p-2.5 rounded-2xl border transition-all ${
                isMe
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-755'
              }`}
            >
              {/* Header Info: Avatar, Name, Stats */}
              <div className="flex items-center justify-between text-xs mb-1.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{player.avatarEmoji}</span>
                  <span className="font-black text-slate-800 dark:text-slate-100 truncate max-w-[120px] sm:max-w-[200px]">
                    {player.name}
                  </span>
                  {isMe && (
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase">
                      {t('multiplayer.you')}
                    </span>
                  )}
                  {isFinished && (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400 text-[10px] font-black flex items-center gap-1">
                      {t('multiplayer.finishedStatus')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono font-black text-xs">
                  <span className="text-amber-500">{wpm} WPM</span>
                  <span className="text-emerald-500">{accuracy}%</span>
                  <span className="text-slate-700 dark:text-slate-300 w-10 text-right">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* Progress Track & Animated Runner */}
              <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 rounded-full ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-r from-indigo-400 to-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
