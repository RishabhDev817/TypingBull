import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, ArrowLeft } from 'lucide-react';
import type { ClassroomResultsView } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { ConfettiFireworks } from '../game/ConfettiFireworks';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  results: ClassroomResultsView;
  myStudentId: string;
  studentName: string;
  onLeaveClassroom: () => void;
}

export const StudentClassroomResults: React.FC<Props> = ({
  results,
  myStudentId,
  studentName,
  onLeaveClassroom,
}) => {
  const myResult = results.results.find((r) => r.playerId === myStudentId);
  const myRank = myResult?.rank || 1;
  const isTopThree = myRank <= 3;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 select-none flex flex-col items-center">
      <ConfettiFireworks active={isTopThree} />

      {/* Mascot Celebration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center mb-6"
      >
        <div className="mb-2">
          <Mascot mood={isTopThree ? 'cheering' : 'happy'} size="md" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Session Finished!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <StudentAvatarBadge avatar={myResult?.avatarEmoji} size="md" />
          <span>Great Job, {studentName}!</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Here is your classroom performance summary.
        </p>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
      >
        {/* Big Rank Pill */}
        <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-200 dark:border-indigo-900">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
            Classroom Standing
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-primary mt-1">
            Rank #{myRank}
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Out of {results.totalStudents} classmates
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Speed</span>
            </div>
            <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {myResult?.wpm || 0}
            </div>
            <span className="text-[11px] font-bold text-slate-400">Words Per Minute</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider mb-1">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Accuracy</span>
            </div>
            <div className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {myResult?.accuracy || 100}%
            </div>
            <span className="text-[11px] font-bold text-slate-400">Keystroke Precision</span>
          </div>
        </div>

        {/* Class Average Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>Classroom Average:</span>
          <span className="font-mono font-black text-slate-900 dark:text-white">
            {results.classAverageWpm} WPM • {results.classAverageAccuracy}% Acc
          </span>
        </div>

        {/* Return Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onLeaveClassroom}
            className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to TypingBull</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
