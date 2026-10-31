import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  School,
  CheckCircle2,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Target,
  Gamepad2,
  Keyboard,
  Sparkles,
} from 'lucide-react';
import type { ClassroomRoomView, StudentProgressUpdate, StudentFinishPayload } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { getLessonById, getLessonsForChapter, type LessonDef } from '../../data/lessonData';
import { CHAPTERS, getChapterByLessonId } from '../../data/curriculum';
import { ClassroomLessonPlayer } from './ClassroomLessonPlayer';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  room: ClassroomRoomView;
  myStudentId: string;
  studentName: string;
  onToggleReady: (isReady: boolean) => void;
  onLeaveClassroom: () => void;
  onProgressUpdate?: (update: StudentProgressUpdate, lessonId?: number, assignmentId?: string) => void;
  onFinish?: (payload: StudentFinishPayload, lessonId?: number, assignmentId?: string) => void;
}

type StudentTab = 'lobby' | 'lessons' | 'classmates';

export const StudentClassroomLobby: React.FC<Props> = ({
  room,
  myStudentId,
  studentName,
  onToggleReady,
  onLeaveClassroom,
  onProgressUpdate,
  onFinish,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('lobby');
  const [selectedLesson, setSelectedLesson] = useState<LessonDef | null>(null);

  const me = room.students.find((s) => s.id === myStudentId);
  const isReady = me?.isReady ?? false;
  const myEmoji = me?.avatarEmoji ?? '🐂';

  // Resolve assigned curriculum lesson if present
  const assignedLesson = useMemo(() => {
    if (room.settings.lesson_id !== undefined && room.settings.lesson_id !== null) {
      return getLessonById(Number(room.settings.lesson_id));
    }
    if (room.settings.session_type === 'curriculum') {
      // If numeric lesson ID is in lessonId string (e.g. "learn-2")
      const match = String(room.settings.lessonId || '').match(/\d+/);
      if (match) {
        return getLessonById(Number(match[0]));
      }
    }
    return undefined;
  }, [room.settings.lesson_id, room.settings.lessonId, room.settings.session_type]);

  const assignedChapter = useMemo(() => {
    return assignedLesson ? getChapterByLessonId(assignedLesson.id) : undefined;
  }, [assignedLesson]);

  // Lessons tab: selected chapter
  const [browsingChapterId, setBrowsingChapterId] = useState<string>(() => {
    return assignedChapter?.id || 'home-row';
  });

  const browsingChapter = useMemo(() => {
    return CHAPTERS.find((c) => c.id === browsingChapterId) || CHAPTERS[0];
  }, [browsingChapterId]);

  const chapterLessons = useMemo(() => {
    return getLessonsForChapter(browsingChapter.id);
  }, [browsingChapter.id]);

  if (selectedLesson) {
    return (
      <ClassroomLessonPlayer
        lesson={selectedLesson}
        teacherName={room.teacherName}
        assignments={room.settings.assignments || []}
        onProgressUpdate={(update, lessonId, aId) => {
          onProgressUpdate?.(update, lessonId, aId);
        }}
        onFinish={(payload, lessonId, aId) => {
          onFinish?.(payload, lessonId, aId);
        }}
        onSelectNextLesson={(nextL) => setSelectedLesson(nextL)}
        onClose={() => setSelectedLesson(null)}
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
          <span>Curriculum</span>
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

      {/* ─── TAB 1: LOBBY & PROMINENT ASSIGNED LESSON ─── */}
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

          {/* Teacher's Note / Daily Tip Banner */}
          {room.settings.teacherNote && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-2.5 shadow-xs">
              <span className="text-lg leading-none shrink-0 mt-0.5">📌</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Note from {room.teacherName}:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                  &ldquo;{room.settings.teacherNote}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* ─── MULTI-ASSIGNMENT CLASSROOM TASKS PROGRESSION ─── */}
          {(room.settings.assignments && room.settings.assignments.length > 0) ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border-2 border-blue-400/50 dark:border-blue-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm shadow-blue-500/20">
                    Classroom Tasks ({(me?.completedLessonIds || []).filter((id) => room.settings.assignments?.some((a) => a.lessonId === id)).length}/{room.settings.assignments.length} Completed)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Assigned by {room.teacherName}
                </span>
              </div>

              {/* Progress Bar */}
              {(() => {
                const completedIds = me?.completedLessonIds || [];
                const total = room.settings.assignments.length;
                const completed = room.settings.assignments.filter((a) => completedIds.includes(a.lessonId)).length;
                const pct = Math.round((completed / Math.max(1, total)) * 100);
                return (
                  <div className="w-full h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                );
              })()}

              {/* All Completed Celebration Notice */}
              {room.settings.assignments.every((a) => (me?.completedLessonIds || []).includes(a.lessonId)) && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-1">
                  <div className="text-sm font-black text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                    <span>🎉 All Assigned Lessons Completed!</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Awesome job! You can practice any lesson again while waiting for your teacher to assign the next step.
                  </p>
                </div>
              )}

              {/* Ordered Tasks List */}
              <div className="space-y-2.5">
                {room.settings.assignments.map((assignment, idx) => {
                  const completedIds = me?.completedLessonIds || [];
                  const isCompleted = completedIds.includes(assignment.lessonId);
                  const isAvailable =
                    isCompleted ||
                    idx === 0 ||
                    completedIds.includes(room.settings.assignments![idx - 1].lessonId);
                  const isNext = !isCompleted && isAvailable;
                  const isLocked = !isAvailable;

                  return (
                    <div
                      key={assignment.assignmentId || assignment.lessonId}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : isNext
                          ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                              ✓
                            </span>
                          ) : isNext ? (
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono font-bold animate-pulse">
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono">
                              🔒
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                              {idx + 1}. {assignment.title}
                            </span>
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                                ✅ Completed
                              </span>
                            )}
                            {isNext && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px] uppercase animate-pulse">
                                ▶ Available
                              </span>
                            )}
                            {isLocked && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-[10px]">
                                🔒 Complete previous lesson first
                              </span>
                            )}
                          </div>

                          {assignment.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                              {assignment.description}
                            </p>
                          )}

                          {assignment.targetKeys && assignment.targetKeys.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] font-bold text-slate-400">Keys:</span>
                              {assignment.targetKeys.map((k) => (
                                <span
                                  key={k}
                                  className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 font-mono text-[10px] font-bold text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700"
                                >
                                  {k === ' ' ? 'Space' : k.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="self-end sm:self-center shrink-0">
                        {isCompleted ? (
                          <button
                            type="button"
                            onClick={() => {
                              const l = getLessonById(assignment.lessonId);
                              if (l) setSelectedLesson(l);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                          >
                            Practice Again
                          </button>
                        ) : isNext ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              const l = getLessonById(assignment.lessonId);
                              if (l) setSelectedLesson(l);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span>Start Lesson</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
                          >
                            Locked 🔒
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : assignedLesson ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border-2 border-blue-400/50 dark:border-blue-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm shadow-blue-500/20">
                    Today&apos;s Classroom Lesson
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Step {assignedLesson.id} • {assignedChapter?.title || 'Learn Curriculum'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Assigned by {room.teacherName}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{assignedLesson.icon}</span>
                  <span>{assignedLesson.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                  {assignedLesson.description}
                </p>
              </div>

              {assignedLesson.targetKeys && assignedLesson.targetKeys.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Focus Keys:
                  </span>
                  {assignedLesson.targetKeys.map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-black border border-blue-300 dark:border-blue-700 shadow-xs"
                    >
                      {k === ' ' ? 'Space' : k.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Passing Accuracy: {assignedLesson.passingAccuracy}%</span>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedLesson(assignedLesson)}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Start Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            /* Fallback Activity Preview (Passages / Games) */
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Assigned Activity
                </span>
                {room.settings.activityType === 'game' ? (
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[9px] font-black uppercase flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3" />
                    <span>Arcade Game Challenge</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[9px] font-black uppercase flex items-center gap-1">
                    <Keyboard className="w-3 h-3" />
                    <span>Practice Passage</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {room.settings.passageTitle}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {room.settings.activityType === 'game'
                      ? 'Synchronous classroom multiplayer game challenge'
                      : 'Everyone types the same synchronized text'}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-primary px-2.5 py-1 rounded-full bg-primary/10">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{room.settings.durationSeconds}s</span>
                </div>
              </div>
            </div>
          )}

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
              <span>{isReady ? "YOU'RE READY! (Click to cancel)" : "I'M READY FOR SESSION"}</span>
            </motion.button>

            <p className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-3">
              {isReady
                ? 'Great job! Wait for your teacher to initiate the countdown or practice above.'
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

      {/* ─── TAB 2: CURRICULUM PROGRESSION BROWSER ─── */}
      {activeTab === 'lessons' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-4"
        >
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              Follow the Learn curriculum progression. Practice any lesson to sharpen your keys!
            </span>
          </div>

          {/* Chapter Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CHAPTERS.map((ch) => {
              const isSelected = browsingChapterId === ch.id;
              const hasAssigned = assignedChapter?.id === ch.id;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setBrowsingChapterId(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{ch.icon}</span>
                  <span>{ch.title}</span>
                  {hasAssigned && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Lessons List with Progression Markers */}
          <div className="space-y-3">
            {chapterLessons.map((lesson) => {
              const isCurrentAssignment = assignedLesson?.id === lesson.id;
              const isPrevious = assignedLesson ? lesson.id < assignedLesson.id : false;

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border-2 transition shadow-sm flex items-center justify-between gap-3 ${
                    isCurrentAssignment
                      ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Progression Marker */}
                    <div className="shrink-0">
                      {isCurrentAssignment ? (
                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
                          →
                        </span>
                      ) : isPrevious ? (
                        <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center">
                          ✓
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
                          ○
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-black">
                          Step {lesson.id}
                        </span>
                        {isCurrentAssignment && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                            Teacher Assignment
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {lesson.type}
                        </span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {lesson.title}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                      isCurrentAssignment
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isCurrentAssignment ? 'Start Lesson' : 'Practice'}
                  </button>
                </div>
              );
            })}
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
              {room.readyCount} / {room.studentCount} Ready
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[360px] overflow-y-auto">
            {room.students.map((student) => {
              const isMe = student.id === myStudentId;

              return (
                <div
                  key={student.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <StudentAvatarBadge avatar={student.avatarEmoji} size="sm" />
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {isMe && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {student.isReady ? 'Ready for Session' : 'Warming Up'}
                      </span>
                    </div>
                  </div>

                  <div>
                    {student.isReady ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase">
                        <span>Waiting</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
