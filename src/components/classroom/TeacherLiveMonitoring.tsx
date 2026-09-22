import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Zap, Target, CheckCircle2, LogOut } from 'lucide-react';
import type { ClassroomRoomView } from '../../types/classroom';
import { ClassroomEndModal } from './ClassroomEndModal';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  room: ClassroomRoomView;
  sessionEndAt: number;
  onEndClassroom: () => void;
}

export const TeacherLiveMonitoring: React.FC<Props> = ({
  room,
  sessionEndAt,
  onEndClassroom,
}) => {
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(() => {
    return Math.max(0, Math.ceil((sessionEndAt - Date.now()) / 1000));
  });
  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((sessionEndAt - now) / 1000));
      setTimeRemainingSec(remaining);
    }, 500);

    return () => clearInterval(timer);
  }, [sessionEndAt]);

  const students = room.students;
  const finishedCount = students.filter((s) => s.status === 'FINISHED').length;
  const totalStudents = students.length;

  // Calculate live class average WPM & accuracy
  const totalWpm = students.reduce((acc, s) => acc + s.wpm, 0);
  const avgWpm = totalStudents > 0 ? Math.round(totalWpm / totalStudents) : 0;
  const totalAcc = students.reduce((acc, s) => acc + s.accuracy, 0);
  const avgAcc = totalStudents > 0 ? Math.round((totalAcc / totalStudents) * 10) / 10 : 100;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Top Header & Emergency Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Classroom Session Active</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {room.settings.passageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-xl font-black">{formatTimer(timeRemainingSec)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Class Average WPM
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{avgWpm}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Class Average Acc
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Target className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{avgAcc}%</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Completed
          </span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {finishedCount} / {totalStudents}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Active Typists
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalStudents - finishedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Live Students Telemetry Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Student Telemetry
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Real-time live updates
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[460px] overflow-y-auto">
          {students.map((student) => {
            const isFinished = student.status === 'FINISHED';
            const progressPercent = Math.round(student.progress * 100);

            return (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
              >
                {/* Student Avatar & Name */}
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <StudentAvatarBadge avatar={student.avatarEmoji} size="sm" />
                  <div className="truncate">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate block">
                      {student.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isFinished ? '🏁 Completed' : 'Typing...'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Telemetry */}
                <div className="flex-1 sm:px-6">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    <span className="font-black text-blue-600 dark:text-blue-400">
                      {student.wpm} WPM
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {student.accuracy}%
                    </span>
                    <span className="text-slate-400">{progressPercent}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        isFinished
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 text-right sm:w-28">
                  {isFinished ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finished</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>Typing</span>
                    </span>
                  )}
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
