import React, { useState } from 'react';
import { Trophy, Zap, Target, RotateCcw, LogOut, CheckCircle2 } from 'lucide-react';
import type { ClassroomResultsView } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { ClassroomEndModal } from './ClassroomEndModal';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  results: ClassroomResultsView;
  onNextRound: () => void;
  onEndClassroom: () => void;
}

export const TeacherClassroomResults: React.FC<Props> = ({
  results,
  onNextRound,
  onEndClassroom,
}) => {
  const [showEndModal, setShowEndModal] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <Mascot mood="cheering" size="xs" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Session Results
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                Completed
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Exercise: {results.passageTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNextRound}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-primary/25"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Next Exercise</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Classroom</span>
          </button>
        </div>
      </div>

      {/* Class Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Class Average Speed
          </span>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.classAverageWpm} WPM
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Class Average Accuracy
          </span>
          <div className="flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.classAverageAccuracy}%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Completion Rate
          </span>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.completedCount} / {results.totalStudents}
            </span>
          </div>
        </div>
      </div>

      {/* Ranked Class Results Leaderboard */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Student Leaderboard
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Ordered by speed & completion
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[440px] overflow-y-auto">
          {results.results.map((student, idx) => {
            return (
              <div
                key={student.playerId}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-950'
                      : idx === 2
                      ? 'bg-amber-700/60 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {student.rank}
                  </div>
                  <StudentAvatarBadge avatar={student.avatarEmoji} size="sm" />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {student.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {student.finished ? `Completed in ${student.timeSpentSec}s` : 'Partial'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Speed
                    </span>
                    <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">
                      {student.wpm} WPM
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Accuracy
                    </span>
                    <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                      {student.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ClassroomEndModal
        isOpen={showEndModal}
        onCancel={() => setShowEndModal(false)}
        onConfirm={() => {
          setShowEndModal(false);
          onEndClassroom();
        }}
      />
    </div>
  );
};
