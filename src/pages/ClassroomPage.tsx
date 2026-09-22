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
import { TeacherLiveMonitoring } from '../components/classroom/TeacherLiveMonitoring';
import { StudentClassroomResults } from '../components/classroom/StudentClassroomResults';
import { TeacherClassroomResults } from '../components/classroom/TeacherClassroomResults';
import { ClassroomReconnectBanner } from '../components/classroom/ClassroomReconnectBanner';

export const ClassroomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const codeParam = (searchParams.get('code') || '').toUpperCase();
  const isCreateRoute = location.pathname.includes('/create') || searchParams.get('action') === 'create';
  const isJoinRoute = location.pathname.includes('/join') || searchParams.get('action') === 'join' || Boolean(codeParam);

  const isPrivateSession = Boolean(codeParam || isCreateRoute || isJoinRoute);
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

  const {
    status,
    role,
    room,
    myStudentId,
    studentName,
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

  // Teacher Next Round handler
  const handleTeacherNextRound = () => {
    if (room) {
      updateSettings({ passageId: room.settings.passageId });
    }
  };

  const isInActiveRoom = Boolean(room && role && room.status !== 'ENDED');

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
        {isInActiveRoom && role === 'teacher' && room && (
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
              <TeacherClassroomResults
                results={sessionResults}
                onNextRound={handleTeacherNextRound}
                onEndClassroom={endClassroom}
              />
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
                />
                <ClassroomCountdown sessionStartAt={sessionStartAt} />
              </>
            )}

            {room.status === 'ACTIVE' && sessionStartAt && sessionEndAt && (
              <ClassroomTypingArea
                targetText={room.settings.targetText}
                passageTitle={room.settings.passageTitle}
                sessionStartAt={sessionStartAt}
                sessionEndAt={sessionEndAt}
                onProgressUpdate={sendProgress}
                onFinish={finishSession}
              />
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
