import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Play,
  Clock,
  Users,
  LogOut,
  Sparkles,
  QrCode,
  Share2,
  FileText,
  Target,
  GraduationCap,
} from 'lucide-react';
import type { ClassroomRoomView, ClassroomSettings } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { ClassroomEndModal } from './ClassroomEndModal';
import { CLASSROOM_LESSONS, type ClassroomLesson } from '../../data/classroom/classroomLessons';
import { ClassroomLessonViewer } from './ClassroomLessonViewer';
import { StudentAvatarBadge } from './StudentAvatar';

interface Props {
  room: ClassroomRoomView;
  onUpdateSettings: (settings: Partial<ClassroomSettings>) => void;
  onStartSession: () => void;
  onEndClassroom: () => void;
  onSwitchToStudentView?: () => void;
}

const PASSAGE_OPTIONS = [
  {
    id: 'passage-fable-morning',
    title: 'Morning in the Valley',
    category: 'Gentle Storytelling',
    wpm: '30 WPM',
    text: 'The morning sun rose gently over the emerald hills, painting the river with strokes of liquid gold. In the meadow below, a young deer paused by the edge of the crystal spring, listening to the melodic songs of early robins. Every pine needle glistened with dew, and a quiet breeze carried the sweet scent of wild honeysuckle through the tranquil forest trail.',
  },
  {
    id: 'passage-orchard-path',
    title: 'The Orchard Path',
    category: 'Flow & Cadence',
    wpm: '32 WPM',
    text: 'Along the winding stone wall of the old orchard, sweet apples hung heavy on mossy boughs. Thomas carried a willow basket in his left hand, whistling a cheerful melody as autumn leaves danced around his boots. The afternoon air was crisp and refreshing, promising warm cider and crackling hearth fires as twilight approached.',
  },
  {
    id: 'passage-clockmaker',
    title: 'The Clockmaker of Prague',
    category: 'Narrative Detail',
    wpm: '35 WPM',
    text: 'Deep within the cobbled alleys of the old city, Master Jan examined the intricate bronze escapement with a brass magnifying loupe. Each delicate tooth required millimeter precision, cut by hand with fine jeweler saws. The gentle ticking of forty antique pendulum clocks formed a soothing rhythm that had filled the vaulted workshop for over four decades.',
  },
  {
    id: 'passage-ocean-tides',
    title: 'Voyage Beyond the Reef',
    category: 'Dynamic Essay',
    wpm: '40 WPM',
    text: 'As the caravel pushed past the outer breakwater, towering sapphire swells lifted the wooden hull with majestic power. Captain Alverez adjusted the brass sextant toward the northern star, plotting a course across uncharted waters. Sea spray misted the canvas sails, and soaring albatrosses heralded the vast and limitless ocean ahead.',
  },
];

const CLASSROOM_ACTIVITIES = [
  {
    id: 'act-accuracy-sprint',
    title: 'Zero-Error Accuracy Sprint',
    description: 'Focus solely on finger precision. Every typo costs tempo and disrupts flow.',
    badge: 'Accuracy Focus',
    text: 'Precision creates true speed. Keep your fingers lightly curved over the home row tactile bumps. Breathe calmly and let the rhythm guide your keystrokes without looking down at the keyboard.',
    duration: 60,
  },
  {
    id: 'act-rhythm-marathon',
    title: 'Metronomic Cadence Marathon',
    description: '3 minutes of sustained, unbroken typing cadence to develop typing endurance.',
    badge: 'Endurance',
    text: 'Steady typing rhythm allows continuous flow. When you eliminate pauses between words, your typing speed naturally accelerates. Maintain relaxed shoulders and straight wrists throughout the session.',
    duration: 180,
  },
  {
    id: 'act-home-row-gauntlet',
    title: 'Home Row Anchor Gauntlet',
    description: 'Intense coordination drill challenging left and right hand home row keys.',
    badge: 'Home Row Drill',
    text: 'asdf jkl; asdf jkl; all fall as a flash flads a lad. a sad lad asks dad for a fresh salad as a flask falls. glad lads ask dad for salads.',
    duration: 60,
  },
];

const DURATION_OPTIONS = [
  { label: '1 Min', seconds: 60 },
  { label: '3 Mins', seconds: 180 },
  { label: '5 Mins', seconds: 300 },
];

type TeacherTab = 'overview' | 'lessons' | 'activities' | 'passages' | 'students';

export const TeacherClassroomLobby: React.FC<Props> = ({
  room,
  onUpdateSettings,
  onStartSession,
  onEndClassroom,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [selectedLesson, setSelectedLesson] = useState<ClassroomLesson | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const joinUrl = `${window.location.origin}/classroom?code=${room.code}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAssignLessonToClassroom = (text: string, title: string) => {
    onUpdateSettings({
      passageId: `lesson-custom-${Date.now()}`,
      passageTitle: title,
      targetText: text,
    });
    setSelectedLesson(null);
    setActiveTab('overview');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    joinUrl
  )}`;

  const canStart = room.studentCount >= room.settings.minStudents;

  // If a lesson is being viewed in full interactive mode
  if (selectedLesson) {
    return (
      <ClassroomLessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        isTeacher={true}
        onAssignToClassroom={handleAssignLessonToClassroom}
      />
    );
  }

  const tabs: { key: TeacherTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: Target },
    { key: 'lessons', label: 'Lessons (6)', icon: GraduationCap },
    { key: 'activities', label: 'Activities', icon: Sparkles },
    { key: 'passages', label: 'Passages', icon: FileText },
    { key: 'students', label: `Students (${room.studentCount})`, icon: Users },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 select-none">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Mascot mood="happy" size="xs" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Teacher Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase">
                Active Room
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Host: {room.teacherName} • Code: <strong className="font-mono text-primary">{room.code}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToStudentView && (
            <button
              type="button"
              id="switch-student-view-btn"
              onClick={onSwitchToStudentView}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Switch to student join modal"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Student Join View</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Classroom Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200 dark:border-slate-700 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              id={`teacher-tab-${key}`}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: OVERVIEW DASHBOARD ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: CODE HERO & QUICK INFO */}
          <div className="lg:col-span-5 space-y-6">
            {/* Class Code Hero Card */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-primary text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-blue-200">
                  Classroom Join Code
                </span>
                <div className="my-2 py-3 px-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 inline-block">
                  <span id="classroom-invite-code-display" className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-white drop-shadow-sm">
                    {room.code}
                  </span>
                </div>

                <p className="text-xs font-semibold text-blue-100 max-w-xs mx-auto">
                  Direct students to <strong className="text-white underline">typingbull.com/classroom</strong> and enter this code.
                </p>

                {/* Copy Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="py-2.5 px-3 rounded-xl bg-white text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-50 transition cursor-pointer shadow-sm"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-xl bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/30 border border-white/30 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Join Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Assignment Preview Card */}
            <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Session Target
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('lessons')}
                  className="text-xs font-black text-primary hover:underline cursor-pointer"
                >
                  Change Target
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-4">
                <div className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {room.settings.passageTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                  "{room.settings.targetText}"
                </div>
              </div>

              {/* Duration Selector */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Duration:</span>
                </div>

                <div className="flex gap-1.5">
                  {DURATION_OPTIONS.map((dur) => {
                    const isSelected = room.settings.durationSeconds === dur.seconds;
                    return (
                      <button
                        key={dur.seconds}
                        type="button"
                        onClick={() => onUpdateSettings({ durationSeconds: dur.seconds })}
                        className={`py-1 px-2.5 rounded-lg text-xs font-black transition cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200'
                        }`}
                      >
                        {dur.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STUDENT ROSTER & START ACTION */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg min-h-[380px] flex flex-col">
              {/* Header with Counters */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Students Connected
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black">
                    {room.studentCount} / {room.settings.maxStudents}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                    Ready: {room.readyCount}
                  </span>
                </div>
              </div>

              {/* Students List */}
              {room.studentCount === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-3 animate-pulse">
                    👥
                  </div>
                  <div className="font-extrabold text-sm text-slate-700 dark:text-slate-300">
                    Waiting for students to enter the room code...
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Write <span className="font-mono font-bold text-primary">{room.code}</span> on the whiteboard. Student screens will connect here instantly.
                  </p>
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[340px] pr-1">
                  {room.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <StudentAvatarBadge avatar={student.avatarEmoji} size="sm" />
                        <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                          {student.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                          student.isReady
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            student.isReady ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{student.isReady ? 'Ready' : 'Waiting'}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Master Start Action Banner */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Synchronized Classroom Start</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {canStart
                    ? 'All connected students will begin countdown together.'
                    : 'Wait for at least 1 student to connect.'}
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={canStart ? { scale: 1.04 } : {}}
                whileTap={canStart ? { scale: 0.96 } : {}}
                onClick={onStartSession}
                disabled={!canStart}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                  canStart
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-600/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START SESSION</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: LESSONS CATALOG ─── */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Classroom Lesson Curriculum
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Structured lessons designed for computer labs. View complete finger positions or set directly as the active classroom target.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black shrink-0 self-start sm:self-center">
              6 Core Lessons
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CLASSROOM_LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between hover:border-primary/50 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-black">
                      Lesson {lesson.lessonNumber}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {lesson.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white mb-1.5 line-clamp-1">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 transition cursor-pointer text-center"
                  >
                    View Lesson
                  </button>

                  <button
                    type="button"
                    id={`assign-lesson-${lesson.id}`}
                    onClick={() => handleAssignLessonToClassroom(lesson.typingExercise.targetText, `Lesson ${lesson.lessonNumber}: ${lesson.shortTitle}`)}
                    className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-dark transition cursor-pointer shrink-0"
                    title="Assign to active classroom session"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: ACTIVITIES ─── */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Classroom Activities
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Engaging group challenges calibrated for synchronous lab sprints. Select an activity to update the session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLASSROOM_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase mb-3 inline-block">
                    {act.badge}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {act.duration}s Drill
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSettings({
                        passageId: act.id,
                        passageTitle: act.title,
                        targetText: act.text,
                        durationSeconds: act.duration,
                      });
                      setActiveTab('overview');
                    }}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    Select Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: PASSAGES ─── */}
      {activeTab === 'passages' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Typing Passages
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Curated narrative literature excerpts with calibrated benchmark WPM targets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PASSAGE_OPTIONS.map((passage) => {
              const isSelected = room.settings.passageId === passage.id;
              return (
                <div
                  key={passage.id}
                  className={`p-6 rounded-3xl border-2 transition shadow-md flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase text-primary">
                        {passage.category}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {passage.wpm}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                      {passage.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic line-clamp-3 mb-4">
                      "{passage.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateSettings({
                          passageId: passage.id,
                          passageTitle: passage.title,
                          targetText: passage.text,
                        });
                        setActiveTab('overview');
                      }}
                      className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      {isSelected ? 'Currently Selected' : 'Choose This Passage'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 5: EXPANDED STUDENTS ROSTER ─── */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Classroom Roster
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Live connection status of all students in room {room.code}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black">
                {room.studentCount} Total
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                {room.readyCount} Ready
              </span>
            </div>
          </div>

          {room.studentCount === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-center text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-3">
                🏫
              </div>
              <h4 className="text-base font-black text-slate-700 dark:text-slate-200 mb-1">
                No students connected yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Share classroom code <strong className="font-mono text-primary">{room.code}</strong> with your students to view them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {room.students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <StudentAvatarBadge avatar={student.avatarEmoji} size="md" />
                    <div>
                      <div className="font-black text-sm text-slate-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        ID: {student.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      student.isReady
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {student.isReady ? 'Ready' : 'Waiting'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Classroom QR Code
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
              Scan with a tablet or mobile camera to join instantly
            </p>

            <div className="w-48 h-48 mx-auto p-2 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-inner mb-4">
              <img
                src={qrImageUrl}
                alt={`QR code for classroom ${room.code}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="font-mono text-2xl font-black text-primary tracking-widest mb-4">
              {room.code}
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* End Classroom Confirmation Modal */}
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
