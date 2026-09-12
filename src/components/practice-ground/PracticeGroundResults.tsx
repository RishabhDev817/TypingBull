import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';
import type { RaceRankingItem } from '../../types/multiplayer.ts';
import { Mascot } from '../Mascot';
import { ConfettiFireworks } from '../game/ConfettiFireworks';
import { soundEngine } from '../../utils/audio';
import { getHighScore, setHighScore } from '../../engine/sessionStore';

interface Props {
  rankings: RaceRankingItem[];
  myPlayerId: string;
  myProgress?: {
    wpm: number;
    accuracy: number;
    finished: boolean;
  };
  playerName?: string;
  playerEmoji?: string;
  durationSeconds?: number;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const PracticeGroundResults: React.FC<Props> = ({
  rankings,
  myPlayerId,
  myProgress,
  playerName,
  playerEmoji,
  durationSeconds = 60,
  onPlayAgain,
  onReturnToMenu,
}) => {
  const rawRankings = Array.isArray(rankings) ? rankings : [];

  let myResult = rawRankings.find((r) => r.playerId === myPlayerId);

  // If not found in rankings (e.g. race timeout, disconnect, or delay), synthesize a resilient result
  if (!myResult) {
    myResult = {
      playerId: myPlayerId || 'player-me',
      name: playerName || 'You',
      avatarEmoji: playerEmoji || '🐂',
      rank: rawRankings.length > 0 ? rawRankings.length + 1 : 1,
      wpm: myProgress?.wpm ?? 0,
      accuracy: myProgress?.accuracy ?? 100,
      finished: myProgress?.finished ?? true,
      durationSeconds,
    };
  }

  // Ensure effectiveRankings contains at least myResult so leaderboard is never blank
  const effectiveRankings = rawRankings.some((r) => r.playerId === myResult.playerId)
    ? [...rawRankings]
    : [...rawRankings, myResult];

  effectiveRankings.sort((a, b) => a.rank - b.rank);

  const isWinner = myResult.rank === 1;

  const [isNewPersonalBest] = useState<boolean>(() => {
    if (myResult && myResult.wpm > 0) {
      const currentHigh = getHighScore();
      if (myResult.wpm > currentHigh) {
        setHighScore(myResult.wpm);
        return true;
      }
    }
    return false;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex flex-col items-center select-none">
      {/* Confetti if player is 1st */}
      <ConfettiFireworks active={isWinner} />

      {/* Header Banner */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <Mascot mood={isWinner ? 'cheering' : 'happy'} size="md" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-400 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Race Completed</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {isWinner ? '🏆 Victory! Great Run!' : '🏁 Race Leaderboard'}
        </h1>

        {isNewPersonalBest && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Personal Best: {myResult?.wpm} WPM!</span>
          </div>
        )}
      </div>

      {/* Current Player Highlights Card */}
      {myResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg p-5 rounded-3xl bg-gradient-to-b from-indigo-500/15 via-white dark:via-slate-900 to-slate-100/50 dark:to-slate-900 border-4 border-indigo-400 dark:border-indigo-500 shadow-xl mb-6 flex flex-col items-center"
        >
          <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2">
            Your Race Performance
          </span>

          <div className="grid grid-cols-3 gap-3 w-full text-center">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Rank</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                #{myResult.rank}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Speed</span>
              <span className="text-2xl font-black text-amber-500">
                {myResult.wpm} <span className="text-xs font-bold">WPM</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-emerald-500">
                {myResult.accuracy}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table List */}
      <div className="w-full max-w-2xl mb-8 flex flex-col gap-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">
          Final Rankings
        </span>

        {effectiveRankings.map((item) => {
          const isMe = item.playerId === myResult.playerId || item.playerId === myPlayerId;
          const medal =
            item.rank === 1
              ? '🥇'
              : item.rank === 2
              ? '🥈'
              : item.rank === 3
              ? '🥉'
              : `#${item.rank}`;

          return (
            <motion.div
              key={item.playerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                isMe
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 shadow-md scale-[1.01]'
                  : item.rank === 1
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Left: Medal, Avatar, Name */}
              <div className="flex items-center gap-3">
                <span className="text-2xl w-8 text-center font-black">{medal}</span>
                <span className="text-2xl">{item.avatarEmoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
                      {item.name}
                    </span>
                    {isMe && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-black uppercase">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.finished ? `${item.durationSeconds}s duration` : 'Did not finish'}
                  </span>
                </div>
              </div>

              {/* Right: WPM & Accuracy */}
              <div className="flex items-center gap-3 sm:gap-5 font-mono font-black text-sm sm:text-base">
                <div className="text-right">
                  <span className="text-amber-500 block leading-tight">{item.wpm} WPM</span>
                  <span className="text-[10px] text-slate-400">Speed</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-500 block leading-tight">{item.accuracy}%</span>
                  <span className="text-[10px] text-slate-400">Accuracy</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons: Rematch & Return */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playPop();
            onPlayAgain();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-base shadow-xl shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again (Rematch)</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playPop();
            onReturnToMenu();
          }}
          className="px-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-base border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Return to Practice Ground</span>
        </motion.button>
      </div>
    </div>
  );
};
