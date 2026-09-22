import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  School,
  CheckCircle2,
  Clock,
  Users,
  ArrowLeft,
  GraduationCap,
  Target,
} from 'lucide-react';
import type { ClassroomRoomView } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { CLASSROOM_LESSONS, type ClassroomLesson } from '../../data/classroom/classroomLessons';
import { ClassroomLessonViewer } from './ClassroomLessonViewer';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  room: ClassroomRoomView;
  myStudentId: string;
  studentName: string;
  onToggleReady: (isReady: boolean) => void;
  onLeaveClassroom: () => void;
}

type StudentTab = 'lobby' | 'lessons' | 'classmates';

export const StudentClassroomLobby: React.FC<Props> = ({
  room,
  myStudentId,
  studentName,
  onToggleReady,
  onLeaveClassroom,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('lobby');
  const [selectedLesson, setSelectedLesson] = useState<ClassroomLesson | null>(null);

  const me = room.students.find((s) => s.id === myStudentId);
  const isReady = me?.isReady ?? false;
  const myEmoji = me?.avatarEmoji ?? '🐂';

  if (selectedLesson) {
    return (
      <ClassroomLessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        isTeacher={false}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 select-none flex flex-col items-center">
      {/* Friendly Mascot & Greeting */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center text-center mb-4"
      >
        <div className="mb-2">
          <Mascot mood={isReady ? 'cheering' : 'happy'} size="md" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
          <School className="w-3.5 h-3.5" />
          <span>Classroom Code: {room.code}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Welcome, {studentName}!</span>
          <StudentAvatarBadge avatar={myEmoji} size="sm" />
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Connected to {room.teacherName}'s classroom session.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="w-full grid grid-cols-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('lobby')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'lobby'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Lobby</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'lessons'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Lessons</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('classmates')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'classmates'
              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Classmates ({room.studentCount})</span>
        </button>
      </div>

      {/* ─── TAB 1: LOBBY & READY TOGGLE ─── */}
      {activeTab === 'lobby' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
        >
          {/* Status Indicators Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Teacher Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Teacher Connected
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Classmates
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {room.studentCount} in room
                </span>
              </div>
            </div>
          </div>

          {/* Activity Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Assigned Activity
            </span>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {room.settings.passageTitle}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Everyone types the same synchronized text
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-primary px-2.5 py-1 rounded-full bg-primary/10">
                <Clock className="w-3.5 h-3.5" />
                <span>{room.settings.durationSeconds}s</span>
              </div>
            </div>
          </div>

          {/* Ready Toggle Action */}
          <div className="pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleReady(!isReady)}
              className={`w-full py-4 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2.5 transition cursor-pointer ${
                isReady
                  ? 'bg-emerald-600 text-white shadow-emerald-600/25 border-b-4 border-emerald-800'
                  : 'bg-primary text-white shadow-primary/25 border-b-4 border-primary-dark hover:brightness-110'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isReady ? "YOU'RE READY! (Click to cancel)" : "I'M READY TO TYPE"}</span>
            </motion.button>

            <p className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-3">
              {isReady
                ? 'Great job! Wait for your teacher to initiate the countdown.'
                : 'Click the button above to let your teacher know you are ready.'}
            </p>
          </div>

          {/* Leave Room Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button
              type="button"
              onClick={onLeaveClassroom}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Leave this classroom</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 2: LESSONS BROWSER ─── */}
      {activeTab === 'lessons' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-3"
        >
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300">
            💡 Warm up your fingers with any lesson while waiting for the teacher to start the synchronized round!
          </div>

          <div className="space-y-3">
            {CLASSROOM_LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-black">
                      Lesson {lesson.lessonNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {lesson.category}
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {lesson.title}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLesson(lesson)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-dark transition cursor-pointer shrink-0"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── TAB 3: CLASSMATES LIST ─── */}
      {activeTab === 'classmates' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-3"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Students Connected ({room.studentCount})
            </span>
            <span className="text-xs font-black text-emerald-600">
              {room.readyCount} Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto">
            {room.students.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <StudentAvatarBadge avatar={st.avatarEmoji} size="xs" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                    {st.name} {st.id === myStudentId && '(You)'}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    st.isReady
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {st.isReady ? 'Ready' : 'Waiting'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
