import React, { useState, useCallback } from 'react';
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
  Gamepad2,
  ChevronDown,
  ChevronUp,
  Keyboard,
  BookOpen,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import type { ClassroomRoomView, ClassroomSettings, ClassroomAssignment } from '../../types/classroom';
import { Mascot } from '../Mascot';
import { ClassroomEndModal } from './ClassroomEndModal';
import { ClassroomTargetSelectorModal } from './ClassroomTargetSelectorModal';
import { CLASSROOM_LESSONS, type ClassroomLesson } from '../../data/classroom/classroomLessons';
import { CHAPTERS } from '../../data/curriculum';
import { getLessonsForChapter, getLessonById, type LessonDef } from '../../data/lessonData';
import { ClassroomLessonViewer } from './ClassroomLessonViewer';
import { StudentAvatarBadge } from './StudentAvatar';
import { DurationSelector } from './DurationSelector';

interface Props {
  room: ClassroomRoomView;
  onUpdateSettings: (settings: Partial<ClassroomSettings>) => void;
  onStartSession: () => void;
  onEndClassroom: () => void;
  onSwitchToStudentView?: () => void;
}

export const PASSAGE_OPTIONS = [
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

export const CLASSROOM_ACTIVITIES = [
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

export const CLASSROOM_GAMES = [
  {
    id: 'game-lilypad-leap',
    gameId: 'lilypad-leap' as const,
    title: 'Lilypad Leap (Kids & Beginners)',
    badge: 'Kids & Beginners',
    category: 'Arcade Game',
    description: 'Help the frog leap across lilypads by typing words cleanly. Great for building confidence, letter recognition, and early keystroke rhythm in classroom labs.',
    focus: 'Beginner Word Flow & Accuracy',
    duration: 180,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    tags: ['Levels 1–5', 'Water Lilypad Track', 'Sound Effects', 'Zero Account Needed'],
  },
  {
    id: 'game-neon-velocity',
    gameId: 'neon-velocity' as const,
    title: 'Neon Velocity (Cyberpunk Flow)',
    badge: 'High Cadence',
    category: 'Racing Game',
    description: 'High-speed cyberpunk highway racer where typed words trigger laser strikes and nitro lane boosts. Exciting competitive arcade energy for classroom sprints.',
    focus: 'High-Velocity Cadence & Reflexes',
    duration: 180,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'border-purple-300 dark:border-purple-800',
    badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
    tags: ['Cyberpunk Highway', 'Combo Multipliers', 'Fast Reflexes', 'Nitro Boosts'],
  },
];

type TeacherTab = 'overview' | 'learn' | 'lessons' | 'games' | 'activities' | 'passages' | 'students';

export const TeacherClassroomLobby: React.FC<Props> = ({
  room,
  onUpdateSettings,
  onStartSession,
  onEndClassroom,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [selectedLesson, setSelectedLesson] = useState<ClassroomLesson | null>(null);
  const [expandedLessonDrillsId, setExpandedLessonDrillsId] = useState<string | null>(null);
  const [selectedCurriculumChapterId, setSelectedCurriculumChapterId] = useState<string>('home-row');
  const [curriculumSearchQuery, setCurriculumSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTargetSelectorModal, setShowTargetSelectorModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingTeacherNote, setEditingTeacherNote] = useState(false);
  const [teacherNoteInput, setTeacherNoteInput] = useState(room.settings.teacherNote || '');

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

  const handleAssignLessonToClassroom = useCallback((
    text: string,
    title: string,
    category: string = 'lesson',
    lessonId?: string
  ) => {
    onUpdateSettings({
      session_type: 'curriculum',
      activityType: 'lesson',
      passageId: lessonId || `lesson-custom-${Date.now()}`,
      passageTitle: title,
      targetText: text,
      assignmentCategory: category,
      lessonId,
    });
    setSelectedLesson(null);
    setActiveTab('overview');
  }, [onUpdateSettings]);

  const handleAssignLearnLesson = useCallback(
    (lesson: LessonDef, chapterTitle: string, customDurationSeconds?: number) => {
      const companion = !lesson.content ? getLessonById(lesson.id + 1) : undefined;
      const drillContent = lesson.content || companion?.content || 'ff jj fj jf ff jj fj jf';
      const durationSec = customDurationSeconds || room.settings.durationSeconds || 300;
      const previous = room.settings.previousAssignments || [];
      const updatedPrevious = room.settings.passageTitle
        ? [
            ...previous.filter((p) => p.title !== room.settings.passageTitle),
            {
              assignmentId: room.settings.assignmentId || `assign-${Date.now()}`,
              lessonId: room.settings.lesson_id || room.settings.passageId,
              title: room.settings.passageTitle,
              assignedAt: room.settings.assignedAt || Date.now(),
            },
          ].slice(-5)
        : previous;

      const assignmentTitle = `Step ${lesson.id}: ${lesson.title} (${chapterTitle})`;
      const newAssignment: ClassroomAssignment = {
        assignmentId: `assign-${lesson.id}-${Date.now()}`,
        lessonId: lesson.id,
        title: assignmentTitle,
        chapterTitle,
        chapterId: lesson.chapterId,
        description: lesson.description,
        order: (room.settings.assignments?.length || 0) + 1,
        assignedAt: Date.now(),
        targetKeys: lesson.targetKeys || [],
        passingAccuracy: lesson.passingAccuracy || 80,
        targetText: drillContent,
        durationSeconds: durationSec,
      };

      const existingAssignments = room.settings.assignments || [];
      const updatedAssignments = [...existingAssignments.filter((a) => a.lessonId !== lesson.id), newAssignment];

      onUpdateSettings({
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
        previousAssignments: updatedPrevious,
        assignments: updatedAssignments,
      });
      setActiveTab('overview');
    },
    [onUpdateSettings, room.settings]
  );

  const handleAddAssignment = useCallback(
    (lesson: LessonDef, chapterTitle: string, customDurationSeconds?: number) => {
      const existing = room.settings.assignments || [];
      const companion = !lesson.content ? getLessonById(lesson.id + 1) : undefined;
      const drillContent = lesson.content || companion?.content || 'ff jj fj jf ff jj fj jf';
      const durationSec = customDurationSeconds || room.settings.durationSeconds || 300;

      const newAssignment: ClassroomAssignment = {
        assignmentId: `assign-${lesson.id}-${Date.now()}`,
        lessonId: lesson.id,
        title: `Step ${lesson.id}: ${lesson.title} (${chapterTitle})`,
        chapterTitle,
        chapterId: lesson.chapterId,
        description: lesson.description,
        order: existing.length + 1,
        assignedAt: Date.now(),
        targetKeys: lesson.targetKeys || [],
        passingAccuracy: lesson.passingAccuracy || 80,
        targetText: drillContent,
        durationSeconds: durationSec,
      };

      const updated = [...existing, newAssignment];

      onUpdateSettings({
        assignments: updated,
        ...(existing.length === 0
          ? {
              session_type: 'curriculum',
              activityType: 'lesson',
              lesson_id: lesson.id,
              lessonId: `learn-${lesson.id}`,
              passageId: `learn-lesson-${lesson.id}`,
              passageTitle: newAssignment.title,
              targetText: drillContent,
              assignmentCategory: 'learn-curriculum',
              targetKeys: lesson.targetKeys || [],
              durationSeconds: durationSec,
              assignmentId: newAssignment.assignmentId,
              activeAssignmentId: newAssignment.assignmentId,
              assignedAt: newAssignment.assignedAt,
            }
          : {}),
      });
    },
    [onUpdateSettings, room.settings]
  );

  const handleActivateAssignment = useCallback(
    (assignment: ClassroomAssignment) => {
      const companion = getLessonById(assignment.lessonId + 1);
      const drillContent = assignment.targetText || companion?.content || 'ff jj fj jf ff jj fj jf';
      onUpdateSettings({
        session_type: 'curriculum',
        activityType: 'lesson',
        lesson_id: assignment.lessonId,
        lessonId: `learn-${assignment.lessonId}`,
        passageId: `learn-lesson-${assignment.lessonId}`,
        passageTitle: assignment.title,
        targetText: drillContent,
        assignmentCategory: 'learn-curriculum',
        targetKeys: assignment.targetKeys || [],
        durationSeconds: assignment.durationSeconds || room.settings.durationSeconds || 300,
        assignmentId: assignment.assignmentId,
        activeAssignmentId: assignment.assignmentId,
        assignedAt: Date.now(),
      });
    },
    [onUpdateSettings, room.settings]
  );

  const handleReorderAssignment = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const list = [...(room.settings.assignments || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      const reindexed = list.map((a, i) => ({ ...a, order: i + 1 }));
      onUpdateSettings({ assignments: reindexed });
    },
    [onUpdateSettings, room.settings.assignments]
  );

  const handleRemoveAssignment = useCallback(
    (assignmentId: string) => {
      const list = (room.settings.assignments || []).filter((a) => a.assignmentId !== assignmentId);
      const reindexed = list.map((a, i) => ({ ...a, order: i + 1 }));
      onUpdateSettings({ assignments: reindexed });
    },
    [onUpdateSettings, room.settings.assignments]
  );

  const handleAssignMultipleAssignments = useCallback(
    (assignments: ClassroomAssignment[], customDurationSeconds?: number) => {
      if (!assignments.length) return;
      const first = assignments[0];
      const companion = getLessonById(first.lessonId + 1);
      const drillContent = first.targetText || companion?.content || 'ff jj fj jf ff jj fj jf';
      const durationSec = customDurationSeconds || first.durationSeconds || room.settings.durationSeconds || 300;

      const preparedAssignments = assignments.map((a, idx) => ({
        ...a,
        order: idx + 1,
        durationSeconds: customDurationSeconds || a.durationSeconds || durationSec,
      }));

      onUpdateSettings({
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
      setShowTargetSelectorModal(false);
      setActiveTab('overview');
    },
    [onUpdateSettings, room.settings]
  );

  const handleAssignPassage = useCallback(
    (passage: (typeof PASSAGE_OPTIONS)[number], customDurationSeconds?: number) => {
      onUpdateSettings({
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
      setActiveTab('overview');
    },
    [onUpdateSettings]
  );

  const handleAssignGameToClassroom = useCallback((game: (typeof CLASSROOM_GAMES)[number]) => {
    onUpdateSettings({
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
    setActiveTab('overview');
  }, [onUpdateSettings]);

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
    { key: 'learn', label: 'Learn Curriculum (685)', icon: BookOpen },
    { key: 'lessons', label: 'Lab Lessons (6)', icon: GraduationCap },
    { key: 'games', label: 'Games (2)', icon: Gamepad2 },
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="teacher-open-target-modal-btn"
                      onClick={() => setShowTargetSelectorModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Change Target</span>
                    </button>
                  </div>
                </div>

                {/* Teacher's Daily Focus Note / Instruction */}
                {room.settings.teacherNote ? (
                  <div className="p-3.5 mb-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block mb-0.5 tracking-wider">
                        📢 Teacher's Daily Tip / Focus Note
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium italic break-words">
                        "{room.settings.teacherNote}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTeacherNoteInput(room.settings.teacherNote || '');
                        setEditingTeacherNote(true);
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-900 dark:text-amber-400 underline cursor-pointer shrink-0 ml-2"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="mb-3">
                    {editingTeacherNote ? (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2">
                        <label htmlFor="teacher-lobby-note-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Teacher's Daily Note or Focus Tip for Students:
                        </label>
                        <input
                          id="teacher-lobby-note-input"
                          type="text"
                          value={teacherNoteInput}
                          onChange={(e) => setTeacherNoteInput(e.target.value)}
                          placeholder="e.g., Focus on keeping fingers on the home row bumps and steady rhythm today!"
                          className="w-full text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTeacherNote(false)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateSettings({ teacherNote: teacherNoteInput.trim() });
                              setEditingTeacherNote(false);
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTeacherNoteInput('');
                          setEditingTeacherNote(true);
                        }}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer transition py-1"
                      >
                        <span>+ Add daily focus tip / instruction for students</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Active Target Banner */}
                <div className="p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Active Exercise
                    </span>
                    {room.settings.durationSeconds && (
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {Math.round(room.settings.durationSeconds / 60)} min limit
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {room.settings.passageTitle || 'No target selected'}
                  </h4>
                  {room.settings.targetText && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate mt-1">
                      "{room.settings.targetText}"
                    </p>
                  )}
                </div>

                {/* CLASSROOM LESSONS & PROGRESS AREA */}
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          Classroom Lessons
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                          {(room.settings.assignments || []).length} assigned • sequential student progression
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="teacher-add-lesson-btn"
                      onClick={() => setShowTargetSelectorModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Lesson</span>
                    </button>
                  </div>

                  {/* Ordered Assignments List */}
                  {room.settings.assignments && room.settings.assignments.length > 0 ? (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {room.settings.assignments.map((assignment, idx) => {
                        const isCurrentlyActive =
                          assignment.assignmentId === room.settings.assignmentId ||
                          assignment.assignmentId === room.settings.activeAssignmentId ||
                          (assignment.lessonId && assignment.lessonId === room.settings.lesson_id);
                        const totalStudents = room.students.length;
                        const completedStudents = room.students.filter((s) =>
                          s.completedLessonIds?.includes(assignment.lessonId)
                        );
                        const completedCount = completedStudents.length;
                        const inProgressStudents = room.students.filter(
                          (s) =>
                            !s.completedLessonIds?.includes(assignment.lessonId) &&
                            (s.progress > 0 ||
                              s.assignmentProgress?.[assignment.assignmentId]?.status === 'IN_PROGRESS' ||
                              s.assignmentProgress?.[`assign-${assignment.lessonId}`]?.status === 'IN_PROGRESS')
                        );
                        const notStartedStudents = room.students.filter(
                          (s) =>
                            !s.completedLessonIds?.includes(assignment.lessonId) &&
                            !inProgressStudents.some((ip) => ip.id === s.id)
                        );

                        const pct = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
                        const isExpanded = expandedTaskId === assignment.assignmentId;

                        return (
                          <div
                            key={assignment.assignmentId || assignment.lessonId}
                            className={`p-3.5 rounded-2xl transition border ${
                              isCurrentlyActive
                                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div
                                onClick={() =>
                                  setExpandedTaskId((prev) =>
                                    prev === assignment.assignmentId ? null : assignment.assignmentId
                                  )
                                }
                                className="cursor-pointer flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                                    #{idx + 1}
                                  </span>
                                  {isCurrentlyActive ? (
                                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                      <Play className="w-2.5 h-2.5 fill-current" /> Active
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActivateAssignment(assignment);
                                      }}
                                      className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase transition cursor-pointer"
                                      title="Make this the active assignment for the next round"
                                    >
                                      Activate
                                    </button>
                                  )}
                                  {assignment.durationSeconds && (
                                    <span className="text-[10px] font-mono text-slate-400">
                                      ⏱ {Math.round(assignment.durationSeconds / 60)}m
                                    </span>
                                  )}
                                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                    {assignment.title}
                                  </span>
                                </div>

                                {assignment.targetKeys && assignment.targetKeys.length > 0 && (
                                  <div className="flex items-center gap-1 mb-1.5">
                                    <span className="text-[10px] font-bold text-slate-400">Keys:</span>
                                    {assignment.targetKeys.map((k) => (
                                      <span
                                        key={k}
                                        className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                                      >
                                        {k === ' ' ? 'Space' : k.toUpperCase()}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Progress bar & Real Student Tally */}
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                    {completedCount}/{totalStudents} completed ({pct}%)
                                  </span>
                                </div>
                              </div>

                              {/* Reorder and Delete controls */}
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleReorderAssignment(idx, 'up')}
                                  title="Move task up"
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (room.settings.assignments?.length || 1) - 1}
                                  onClick={() => handleReorderAssignment(idx, 'down')}
                                  title="Move task down"
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAssignment(assignment.assignmentId)}
                                  title="Remove task"
                                  className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-500 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Expandable Individual Student Breakdown */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                                {completedStudents.length > 0 && (
                                  <div>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                                      ✓ Completed ({completedStudents.length}):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {completedStudents.map((s) => (
                                        <span
                                          key={s.id}
                                          className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1"
                                        >
                                          <span>{s.avatarEmoji}</span>
                                          <span>{s.name}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {inProgressStudents.length > 0 && (
                                  <div>
                                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                                      ⏳ In Progress ({inProgressStudents.length}):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {inProgressStudents.map((s) => (
                                        <span
                                          key={s.id}
                                          className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold text-[11px] flex items-center gap-1"
                                        >
                                          <span>{s.avatarEmoji}</span>
                                          <span>
                                            {s.name} ({Math.round(s.progress * 100)}%)
                                          </span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {notStartedStudents.length > 0 && (
                                  <div>
                                    <span className="font-bold text-slate-400 block mb-1">
                                      ○ Not Started ({notStartedStudents.length}):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {notStartedStudents.map((s) => (
                                        <span
                                          key={s.id}
                                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex items-center gap-1"
                                        >
                                          <span>{s.avatarEmoji}</span>
                                          <span>{s.name}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                      <p className="text-xs text-slate-500 font-semibold">
                        No multiple lessons assigned yet. Click "+ Add Lesson" to assign tasks from the Learn curriculum.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowTargetSelectorModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold transition hover:bg-blue-700 cursor-pointer"
                      >
                        + Assign First Lesson
                      </button>
                    </div>
                  )}

                  {/* All Tasks Completed Notice */}
                  {room.settings.assignments &&
                    room.settings.assignments.length > 0 &&
                    room.students.length > 0 &&
                    room.settings.assignments.every((a) =>
                      room.students.every((s) => s.completedLessonIds?.includes(a.lessonId))
                    ) && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                        <div className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                          All assigned lessons completed 🎉
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                          Every student has finished all current tasks. Assign the next lesson to continue!
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowTargetSelectorModal(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Assign Next Lesson</span>
                        </button>
                      </div>
                    )}
                </div>

                {/* Duration Selector */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Session Duration:</span>
                  </div>
                  <DurationSelector
                    durationSeconds={room.settings.durationSeconds || 300}
                    onChange={(sec) => onUpdateSettings({ durationSeconds: sec })}
                  />
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

      {/* ─── TAB: LEARN STEP-BY-STEP CURRICULUM (685 LESSONS) ─── */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900/40 via-blue-900/30 to-indigo-900/40 dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-900/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-6 h-6 text-sky-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  The Great Typing Railway — Step-by-Step Curriculum
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
                Assign any progressive lesson step from the Learn section directly to your classroom. Organized into 25 chapters covering home row foundations, upper row reaches, shift key synchronization, and speed drills.
              </p>
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={curriculumSearchQuery}
                onChange={(e) => setCurriculumSearchQuery(e.target.value)}
                placeholder="Search lessons or keys..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Chapter Selector Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CHAPTERS.map((ch) => {
              const isSelected = selectedCurriculumChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedCurriculumChapterId(ch.id);
                    setCurriculumSearchQuery('');
                  }}
                  className={`py-2 px-3.5 rounded-2xl text-xs font-black transition cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                  }`}
                >
                  <span className="text-base">{ch.icon}</span>
                  <span>{ch.title}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ch.lessonRange[0]}–{ch.lessonRange[1]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Chapter Details & Lessons Grid */}
          {(() => {
            const currentChapter =
              CHAPTERS.find((c) => c.id === selectedCurriculumChapterId) || CHAPTERS[0];
            const chapterLessons = getLessonsForChapter(currentChapter.id);
            const filteredLessons = curriculumSearchQuery.trim()
              ? chapterLessons.filter(
                  (l) =>
                    l.title.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
                    l.description.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
                    l.targetKeys.some((k) =>
                      k.toLowerCase().includes(curriculumSearchQuery.toLowerCase())
                    ) ||
                    String(l.id) === curriculumSearchQuery.trim()
                )
              : chapterLessons;

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentChapter.icon}</span>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {currentChapter.title} — Lessons {currentChapter.lessonRange[0]} to {currentChapter.lessonRange[1]}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {currentChapter.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {filteredLessons.length} {filteredLessons.length === 1 ? 'Step' : 'Steps'} available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLessons.map((lesson) => {
                    const isLessonActive =
                      room.settings.lessonId === `learn-${lesson.id}` ||
                      room.settings.passageId === `learn-lesson-${lesson.id}`;

                    return (
                      <div
                        key={lesson.id}
                        className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 transition shadow-md flex flex-col justify-between ${
                          isLessonActive
                            ? 'border-sky-500 bg-sky-50/20 dark:bg-sky-950/20 ring-2 ring-sky-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-sky-400/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-xs font-black">
                              Step {lesson.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                              {lesson.type}
                            </span>
                          </div>

                          <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1 line-clamp-1">
                            {lesson.title}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-3 leading-relaxed">
                            {lesson.description}
                          </p>

                          {/* Target Keys */}
                          {lesson.targetKeys.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mb-3">
                              <span className="text-[10px] font-bold text-slate-400">Focus Keys:</span>
                              {lesson.targetKeys.map((k) => (
                                <span
                                  key={k}
                                  className="px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 font-mono text-[10px] font-black text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                                >
                                  {k === ' ' ? 'Space' : k.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Content Snippet Preview */}
                          {lesson.content && (
                            <div className="p-2 rounded-xl bg-slate-950 text-white font-mono text-xs text-center truncate mb-4 border border-slate-800">
                              {lesson.content}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-400">
                            Passing: {lesson.passingAccuracy || 90}%
                          </span>

                          <button
                            type="button"
                            id={`assign-learn-step-${lesson.id}`}
                            onClick={() => handleAssignLearnLesson(lesson, currentChapter.title)}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                              isLessonActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isLessonActive ? 'Assigned' : 'Assign Step'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLASSROOM_LESSONS.map((lesson) => {
              const isDrillExpanded = expandedLessonDrillsId === lesson.id;
              const isSelected = room.settings.lessonId === lesson.id || room.settings.passageTitle.includes(lesson.shortTitle);

              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all shadow-lg flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
                  }`}
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-3 leading-relaxed">
                      {lesson.description}
                    </p>

                    {/* Key Highlights Pill */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      <span className="text-[10px] font-bold text-slate-400">Keys:</span>
                      {lesson.typingConcept.keyHighlights.slice(0, 6).map((k) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-black text-slate-700 dark:text-slate-300"
                        >
                          {k}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Homerow / Guided Drills Drawer */}
                    {isDrillExpanded && (
                      <div className="mb-4 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2.5 animate-fadeIn">
                        <div className="text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                          <span>Guided Homerow Drills</span>
                          <span className="text-[10px] font-bold text-indigo-500">Pick any drill</span>
                        </div>

                        {lesson.guidedPractice.map((drill, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 shadow-xs flex flex-col gap-1.5"
                          >
                            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                              {drill.prompt}
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950 text-white font-mono text-xs tracking-wider text-center overflow-x-auto truncate">
                              {drill.pattern}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex gap-1">
                                {drill.focusKeys.map((fk) => (
                                  <span
                                    key={fk}
                                    className="px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 font-mono text-[9px] font-black text-indigo-600 dark:text-indigo-400"
                                  >
                                    {fk}
                                  </span>
                                ))}
                              </div>
                              <button
                                type="button"
                                id={`assign-drill-${lesson.id}-${idx}`}
                                onClick={() =>
                                  handleAssignLessonToClassroom(
                                    drill.pattern,
                                    `Lesson ${lesson.lessonNumber} Drill ${idx + 1}: ${drill.prompt}`,
                                    'homerow',
                                    lesson.id
                                  )
                                }
                                className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black transition cursor-pointer"
                              >
                                Assign Drill
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
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
                        onClick={() =>
                          handleAssignLessonToClassroom(
                            lesson.typingExercise.targetText,
                            `Lesson ${lesson.lessonNumber}: ${lesson.shortTitle} (Exercise)`,
                            'lesson',
                            lesson.id
                          )
                        }
                        className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-dark transition cursor-pointer shrink-0"
                        title="Assign cadence exercise to classroom"
                      >
                        Assign Exercise
                      </button>
                    </div>

                    {/* Toggle Homerow / Guided Drills */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLessonDrillsId(isDrillExpanded ? null : lesson.id)
                      }
                      className="w-full py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-200/50 dark:border-indigo-800/50"
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      <span>
                        {isDrillExpanded
                          ? 'Hide Homerow Drills'
                          : `Practice Homerow Drills (${lesson.guidedPractice.length})`}
                      </span>
                      {isDrillExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: GAMES ARCADE ─── */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/30 dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/50 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Gamepad2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Typing Games Arcade — Classroom Edition
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
              Engage students with synchronized multiplayer arcade games. When you start the session, all connected student screens launch the chosen game with real-time class monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLASSROOM_GAMES.map((game) => {
              const isSelected =
                room.settings.activityType === 'game' && room.settings.gameId === game.gameId;
              return (
                <div
                  key={game.id}
                  className={`p-6 rounded-3xl border-2 transition shadow-xl flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/40 ring-2 ring-purple-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${game.badgeColor}`}>
                        {game.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {game.duration}s Session
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-2xl">
                        {game.gameId === 'lilypad-leap' ? '🐸' : '🏎️'}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">
                        {game.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {game.focus}
                    </span>

                    <button
                      type="button"
                      id={`assign-${game.id}`}
                      onClick={() => handleAssignGameToClassroom(game)}
                      className={`py-2.5 px-5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-600/25'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>{isSelected ? 'Currently Assigned' : 'Assign to Classroom'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* Target Assignment Selector Modal */}
      <ClassroomTargetSelectorModal
        isOpen={showTargetSelectorModal}
        onClose={() => setShowTargetSelectorModal(false)}
        currentSettings={room.settings}
        passages={PASSAGE_OPTIONS}
        games={CLASSROOM_GAMES}
        onAssignCurriculumLesson={handleAssignLearnLesson}
        onAddAssignment={handleAddAssignment}
        onAssignMultipleAssignments={handleAssignMultipleAssignments}
        onAssignPassage={handleAssignPassage}
        onAssignGame={handleAssignGameToClassroom}
      />
    </div>
  );
};
