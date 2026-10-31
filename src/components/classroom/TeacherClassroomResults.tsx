import React, { useState } from 'react';
import { Trophy, Zap, Target, RotateCcw, LogOut, CheckCircle2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import type { ClassroomResultsView, ClassroomRoomView, ClassroomAssignment } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { ClassroomEndModal } from './ClassroomEndModal';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  results: ClassroomResultsView;
  room?: ClassroomRoomView;
  onNextRound: () => void;
  onEndClassroom: () => void;
  onOpenAssignModal?: () => void;
  onActivateAssignment?: (assignment: ClassroomAssignment) => void;
}

export const TeacherClassroomResults: React.FC<Props> = ({
  results,
  room,
  onNextRound,
  onEndClassroom,
  onOpenAssignModal,
  onActivateAssignment,
}) => {
  const [showEndModal, setShowEndModal] = useState(false);

  const currentAssignmentIndex = room?.settings.assignments?.findIndex(
    (a) => a.assignmentId === room.settings.assignmentId || a.lessonId === room.settings.lesson_id
  ) ?? -1;

  const nextAssignment =
    currentAssignmentIndex >= 0 && room?.settings.assignments && currentAssignmentIndex + 1 < room.settings.assignments.length
      ? room.settings.assignments[currentAssignmentIndex + 1]
      : undefined;

  // Derive supportive insights from real classroom data
  const studentsNeedingPractice = results.results.filter((s) => s.accuracy < 85 && s.finished);
  const topPerformers = results.results.filter((s) => s.accuracy >= 95 && s.finished);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <Mascot mood="cheering" size="xs" />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Lesson Complete 🎉
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                {results.completedCount}/{results.totalStudents} Completed
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
              Activity: <strong className="text-slate-900 dark:text-white">{results.passageTitle}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {onOpenAssignModal && (
            <button
              type="button"
              id="top-assign-next-lesson-btn"
              onClick={onOpenAssignModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Next Lesson</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNextRound}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Lobby</span>
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

      {/* Teacher Next Lesson Control Banner (Prominent Action) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-teal-500/10 border-2 border-blue-400/50 dark:border-blue-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Next Lesson Recommendation
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{results.passageTitle}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              ✓ {results.completedCount}/{results.totalStudents} students completed
            </span>
          </h3>
          {nextAssignment ? (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Next Queued Lesson: <strong className="text-blue-600 dark:text-blue-400">{nextAssignment.title}</strong>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              All currently assigned lessons have concluded. You can select the next lesson from the curriculum below.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {nextAssignment && onActivateAssignment && (
            <button
              type="button"
              id="activate-next-queued-lesson-btn"
              onClick={() => onActivateAssignment(nextAssignment)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Activate Next: Step {nextAssignment.lessonId}</span>
            </button>
          )}

          {onOpenAssignModal && (
            <button
              type="button"
              id="action-assign-next-lesson-btn"
              onClick={onOpenAssignModal}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-600/25 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Next Lesson</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Class Average Speed
          </span>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.classAverageWpm} WPM
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Class Average Accuracy
          </span>
          <div className="flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.classAverageAccuracy}%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Classroom Completion
          </span>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              {results.completedCount} / {results.totalStudents}
            </span>
          </div>
        </div>
      </div>

      {/* ─── TEACHER CLASSROOM INSIGHTS & PRACTICE RECOMMENDATIONS ─── */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Classroom Learning Insights &amp; Pedagogical Feedback</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Supportive Practice Needs */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Needs More Practice:</span>
            </div>
            {studentsNeedingPractice.length > 0 ? (
              <div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  The following learners had accuracy under 85% and would benefit from extra home row anchor drills:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {studentsNeedingPractice.map((s) => (
                    <span
                      key={s.playerId}
                      className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-semibold text-[11px]"
                    >
                      {s.avatarEmoji} {s.name} ({s.accuracy}%)
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                🎉 Wonderful! All students met or exceeded the 85% accuracy benchmark.
              </p>
            )}
          </div>

          {/* High Precision Commendations */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-500" />
              <span>High Precision Commendations:</span>
            </div>
            {topPerformers.length > 0 ? (
              <div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {topPerformers.length} student{topPerformers.length === 1 ? '' : 's'} achieved 95%+ precision:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topPerformers.slice(0, 5).map((s) => (
                    <span
                      key={s.playerId}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]"
                    >
                      {s.avatarEmoji} {s.name} ({s.wpm} WPM • {s.accuracy}%)
                    </span>
                  ))}
                  {topPerformers.length > 5 && (
                    <span className="text-[11px] font-bold text-slate-500 self-center">
                      +{topPerformers.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Encourage students to focus on relaxed shoulders and rhythm over raw speed.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ranked Class Results Leaderboard */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Student Leaderboard &amp; Results
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {results.results.length} Students Ranked
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
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {student.rank}
                  </div>
                  <StudentAvatarBadge avatar={student.avatarEmoji} size="sm" />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {student.name}
                    </span>
                    <span className="text-[11px] font-semibold">
                      {student.finished ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ Completed ({student.timeSpentSec}s)
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          ⏱ Time Expired ({student.wpm} WPM)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Speed
                    </span>
                    <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">
                      {student.wpm} WPM
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
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
