import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useClassroomSocket } from '../hooks/useClassroomSocket';
import { usePageSEO } from '../hooks/usePageSEO';
import { ClassroomLandingPage } from './ClassroomLandingPage';
import { ClassroomEntry } from '../components/classroom/ClassroomEntry';
import { TeacherClassroomLobby } from '../components/classroom/TeacherClassroomLobby';
import { StudentClassroomLobby } from '../components/classroom/StudentClassroomLobby';
import { ClassroomCountdown } from '../components/classroom/ClassroomCountdown';
import { ClassroomTypingArea } from '../components/classroom/ClassroomTypingArea';
import { ClassroomGameArea } from '../components/classroom/ClassroomGameArea';
import { TeacherLiveMonitoring } from '../components/classroom/TeacherLiveMonitoring';
import { StudentClassroomResults } from '../components/classroom/StudentClassroomResults';
import { TeacherClassroomResults } from '../components/classroom/TeacherClassroomResults';
import { ClassroomReconnectBanner } from '../components/classroom/ClassroomReconnectBanner';
import { ClassroomTargetSelectorModal } from '../components/classroom/ClassroomTargetSelectorModal';
import { PASSAGE_OPTIONS, CLASSROOM_GAMES } from '../components/classroom/TeacherClassroomLobby';
import { getLessonById, type LessonDef } from '../data/lessonData';
import type { ClassroomAssignment } from '../types/classroom';

export const ClassroomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const codeParam = (searchParams.get('code') || '').toUpperCase();
  const isCreateRoute = location.pathname.includes('/create') || searchParams.get('action') === 'create';
  const isJoinRoute = location.pathname.includes('/join') || searchParams.get('action') === 'join' || Boolean(codeParam);

  const {
    status,
    role,
    room,
    myStudentId,
    studentName,
    teacherToken,
    sessionStartAt,
    sessionEndAt,
    sessionResults,
    notifications,
    createClassroom,
    joinClassroom,
    setReady,
    updateSettings,
    startSession,
    sendProgress,
    finishSession,
    endClassroom,
    leaveClassroom,
    resetToEntry,
  } = useClassroomSocket(codeParam);

  const isInActiveRoom = Boolean(room && role && room.status !== 'ENDED');
  const isTeacherAuthorized = role === 'teacher' && Boolean(teacherToken);
  const isPrivateSession = Boolean(codeParam || isCreateRoute || isJoinRoute || isInActiveRoom || room);

  usePageSEO({
    canonicalPath: '/classroom/',
    title: 'TypingBull Classroom — Real-Time Typing Lab for Schools & Computer Labs',
    description:
      'Zero-login real-time typing lab for teachers and students. Create custom passages, synchronized typing drills, and live progress monitoring with zero student accounts.',
    noindex: isPrivateSession,
  });

  // View mode: 'landing' (default) vs 'entry' (interactive join/create form)
  const [viewMode, setViewMode] = useState<'landing' | 'entry'>(() => {
    return isCreateRoute || isJoinRoute ? 'entry' : 'landing';
  });

  const [entryTab, setEntryTab] = useState<'student' | 'teacher'>(() => {
    return isCreateRoute ? 'teacher' : 'student';
  });

  const [showResultsAssignModal, setShowResultsAssignModal] = useState(false);

  // Sync if URL query or path changes
  useEffect(() => {
    if (codeParam || isCreateRoute || isJoinRoute) {
      setViewMode('entry');
      if (isCreateRoute) {
        setEntryTab('teacher');
      } else {
        setEntryTab('student');
      }
    }
  }, [codeParam, isCreateRoute, isJoinRoute]);

  // Teacher Next Round handler
  const handleTeacherNextRound = () => {
    if (room) {
      updateSettings({ passageId: room.settings.passageId });
    }
  };

  const handleAssignCurriculumLessonFromResults = (
    lesson: LessonDef,
    chapterTitle: string,
    customDurationSeconds?: number
  ) => {
    if (!room) return;
    const companion = !lesson.content ? getLessonById(lesson.id + 1) : undefined;
    const drillContent = lesson.content || companion?.content || 'ff jj fj jf ff jj fj jf';
    const durationSec = customDurationSeconds || room.settings.durationSeconds || 300;
    const assignmentTitle = `Step ${lesson.id}: ${lesson.title} (${chapterTitle})`;
    const newAssignment: ClassroomAssignment = {
      assignmentId: `assign-${lesson.id}-${Date.now()}`,
      lessonId: lesson.id,
      title: assignmentTitle,
      chapterTitle,
      chapterId: lesson.chapterId,
      description: lesson.description,
      order: 1,
      assignedAt: Date.now(),
      targetKeys: lesson.targetKeys || [],
      passingAccuracy: lesson.passingAccuracy || 80,
      targetText: drillContent,
      durationSeconds: durationSec,
    };

    updateSettings({
      session_type: 'curriculum',
      activityType: 'lesson',
      lesson_id: lesson.id,
      lessonId: `learn-${lesson.id}`,
      passageId: `learn-lesson-${lesson.id}`,
      passageTitle: assignmentTitle,
      targetText: drillContent,
      assignmentCategory: 'learn-curriculum',
      targetKeys: lesson.targetKeys || [],
      durationSeconds: durationSec,
      assignmentId: newAssignment.assignmentId,
      activeAssignmentId: newAssignment.assignmentId,
      assignedAt: Date.now(),
      assignments: [newAssignment],
    });
    setShowResultsAssignModal(false);
  };

  const handleAssignMultipleAssignmentsFromResults = (
    assignments: ClassroomAssignment[],
    customDurationSeconds?: number
  ) => {
    if (!room || !assignments.length) return;
    const first = assignments[0];
    const companion = getLessonById(first.lessonId + 1);
    const drillContent = first.targetText || companion?.content || 'ff jj fj jf ff jj fj jf';
    const durationSec = customDurationSeconds || first.durationSeconds || room.settings.durationSeconds || 300;

    const preparedAssignments = assignments.map((a, idx) => ({
      ...a,
      order: idx + 1,
      durationSeconds: customDurationSeconds || a.durationSeconds || durationSec,
    }));

    updateSettings({
      session_type: 'curriculum',
      activityType: 'lesson',
      lesson_id: first.lessonId,
      lessonId: `learn-${first.lessonId}`,
      passageId: `learn-lesson-${first.lessonId}`,
      passageTitle: first.title,
      targetText: drillContent,
      assignmentCategory: 'learn-curriculum',
      targetKeys: first.targetKeys || [],
      durationSeconds: durationSec,
      assignmentId: first.assignmentId,
      activeAssignmentId: first.assignmentId,
      assignedAt: Date.now(),
      assignments: preparedAssignments,
    });
    setShowResultsAssignModal(false);
  };

  const handleAssignPassageFromResults = (passage: any, customDurationSeconds?: number) => {
    if (!room) return;
    updateSettings({
      session_type: 'passage',
      activityType: 'practice',
      lesson_id: undefined,
      lessonId: undefined,
      passageId: passage.id,
      passageTitle: passage.title,
      targetText: passage.text,
      assignmentCategory: 'passage',
      targetKeys: [],
      ...(customDurationSeconds ? { durationSeconds: customDurationSeconds } : {}),
    });
    setShowResultsAssignModal(false);
  };

  const handleAssignGameFromResults = (game: any) => {
    if (!room) return;
    updateSettings({
      session_type: 'game',
      activityType: 'game',
      gameId: game.gameId,
      passageId: game.id,
      passageTitle: game.title,
      targetText: `Classroom Arcade Challenge: ${game.title}`,
      assignmentCategory: 'game',
      durationSeconds: game.duration,
      targetKeys: [],
    });
    setShowResultsAssignModal(false);
  };

  const handleCreateClassroomClick = () => {
    setEntryTab('teacher');
    setViewMode('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinClassroomClick = () => {
    setEntryTab('student');
    setViewMode('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setViewMode('landing');
    if (location.pathname !== '/classroom') {
      navigate('/classroom');
    }
  };

  const handleReturnHome = () => {
    resetToEntry();
    setViewMode('landing');
    navigate('/classroom');
  };

  const handleSwitchToStudentView = () => {
    sessionStorage.removeItem('typingbull_cr_role');
    sessionStorage.removeItem('typingbull_cr_teacher_token');
    sessionStorage.removeItem('typingbull_cr_room_code');
    leaveClassroom();
    setEntryTab('student');
    setViewMode('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[calc(100vh-2rem)] flex flex-col justify-center relative py-2 sm:py-4 px-2 sm:px-4 lg:px-6">
      {/* Floating Reconnect Banner */}
      <ClassroomReconnectBanner status={status} />

      {/* Floating Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`px-4 py-2 rounded-2xl text-xs font-black shadow-lg border pointer-events-auto ${
              n.type === 'error'
                ? 'bg-rose-500 text-white border-rose-600'
                : n.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : n.type === 'warning'
                ? 'bg-amber-500 text-slate-950 border-amber-600'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {n.message}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── CASE 1: ROOM HAS ENDED ─── */}
        {room && room.status === 'ENDED' && (
          <motion.div
            key="room-ended"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-4">
              🏫
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Classroom Session Ended
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              The teacher has closed this classroom session. All temporary session memory has been cleared.
            </p>
            <button
              type="button"
              onClick={handleReturnHome}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-black text-sm hover:bg-primary-dark transition cursor-pointer shadow-lg shadow-primary/25"
            >
              Return to Classroom Home
            </button>
          </motion.div>
        )}

        {/* ─── CASE 2: NOT IN A ROOM -> SHOW LANDING PAGE OR ENTRY FORM ─── */}
        {!isInActiveRoom && (!room || room.status !== 'ENDED') && (
          <div className="w-full relative">
            <ClassroomLandingPage
              onCreateClassroom={handleCreateClassroomClick}
              onJoinClassroom={handleJoinClassroomClick}
            />

            <AnimatePresence>
              {viewMode === 'entry' && (
                <ClassroomEntry
                  initialCode={codeParam}
                  initialTab={entryTab}
                  onCreateClassroom={createClassroom}
                  onJoinClassroom={joinClassroom}
                  isLoading={status === 'CONNECTING'}
                  onBackToLanding={handleBackToLanding}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ─── CASE 3: TEACHER ACTIVE IN ROOM ─── */}
        {isInActiveRoom && isTeacherAuthorized && room && (
          <motion.div
            key="teacher-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {room.status === 'WAITING' && (
              <TeacherClassroomLobby
                room={room}
                onUpdateSettings={updateSettings}
                onStartSession={startSession}
                onEndClassroom={endClassroom}
                onSwitchToStudentView={handleSwitchToStudentView}
              />
            )}

            {room.status === 'STARTING' && sessionStartAt && (
              <>
                <TeacherClassroomLobby
                  room={room}
                  onUpdateSettings={updateSettings}
                  onStartSession={startSession}
                  onEndClassroom={endClassroom}
                />
                <ClassroomCountdown sessionStartAt={sessionStartAt} />
              </>
            )}

            {room.status === 'ACTIVE' && sessionEndAt && (
              <TeacherLiveMonitoring
                room={room}
                sessionEndAt={sessionEndAt}
                onEndClassroom={endClassroom}
              />
            )}

            {room.status === 'FINISHED' && sessionResults && (
              <>
                <TeacherClassroomResults
                  results={sessionResults}
                  room={room}
                  onNextRound={handleTeacherNextRound}
                  onEndClassroom={endClassroom}
                  onOpenAssignModal={() => setShowResultsAssignModal(true)}
                  onActivateAssignment={(assignment) => {
                    updateSettings({
                      session_type: 'curriculum',
                      activityType: 'lesson',
                      lesson_id: assignment.lessonId,
                      lessonId: `learn-${assignment.lessonId}`,
                      passageId: `learn-lesson-${assignment.lessonId}`,
                      passageTitle: assignment.title,
                      targetText: assignment.targetText || 'ff jj fj jf ff jj fj jf',
                      assignmentCategory: 'learn-curriculum',
                      targetKeys: assignment.targetKeys || [],
                      durationSeconds: assignment.durationSeconds || room.settings.durationSeconds || 300,
                      assignmentId: assignment.assignmentId,
                      activeAssignmentId: assignment.assignmentId,
                      assignedAt: Date.now(),
                    });
                  }}
                />

                <ClassroomTargetSelectorModal
                  isOpen={showResultsAssignModal}
                  onClose={() => setShowResultsAssignModal(false)}
                  currentSettings={room.settings}
                  passages={PASSAGE_OPTIONS}
                  games={CLASSROOM_GAMES}
                  onAssignCurriculumLesson={handleAssignCurriculumLessonFromResults}
                  onAssignMultipleAssignments={handleAssignMultipleAssignmentsFromResults}
                  onAssignPassage={handleAssignPassageFromResults}
                  onAssignGame={handleAssignGameFromResults}
                />
              </>
            )}
          </motion.div>
        )}

        {/* ─── CASE 4: STUDENT ACTIVE IN ROOM ─── */}
        {isInActiveRoom && role === 'student' && room && (
          <motion.div
            key="student-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {room.status === 'WAITING' && (
              <StudentClassroomLobby
                room={room}
                myStudentId={myStudentId}
                studentName={studentName || 'Student'}
                onToggleReady={setReady}
                onLeaveClassroom={leaveClassroom}
                onProgressUpdate={sendProgress}
                onFinish={finishSession}
              />
            )}

            {room.status === 'STARTING' && sessionStartAt && (
              <>
                <StudentClassroomLobby
                  room={room}
                  myStudentId={myStudentId}
                  studentName={studentName || 'Student'}
                  onToggleReady={setReady}
                  onLeaveClassroom={leaveClassroom}
                  onProgressUpdate={sendProgress}
                  onFinish={finishSession}
                />
                <ClassroomCountdown sessionStartAt={sessionStartAt} />
              </>
            )}

            {room.status === 'ACTIVE' && sessionStartAt && sessionEndAt && (
              room.settings.activityType === 'game' ? (
                <ClassroomGameArea
                  room={room}
                  sessionStartAt={sessionStartAt}
                  sessionEndAt={sessionEndAt}
                  onProgressUpdate={sendProgress}
                  onFinish={finishSession}
                />
              ) : (
                <ClassroomTypingArea
                  targetText={room.settings.targetText}
                  passageTitle={room.settings.passageTitle}
                  sessionStartAt={sessionStartAt}
                  sessionEndAt={sessionEndAt}
                  session_type={room.settings.session_type}
                  lesson_id={room.settings.lesson_id}
                  assignmentId={room.settings.assignmentId}
                  targetKeys={room.settings.targetKeys}
                  assignmentCategory={room.settings.assignmentCategory}
                  onProgressUpdate={sendProgress}
                  onFinish={finishSession}
                />
              )
            )}

            {room.status === 'FINISHED' && sessionResults && (
              <StudentClassroomResults
                results={sessionResults}
                myStudentId={myStudentId}
                studentName={studentName || 'Student'}
                onLeaveClassroom={leaveClassroom}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassroomPage;
