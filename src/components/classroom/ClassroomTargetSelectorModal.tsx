import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  FileText,
  Gamepad2,
  Search,
  Check,
  GraduationCap,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ListOrdered,
  MessageSquare,
} from 'lucide-react';
import { CHAPTERS } from '../../data/curriculum';
import { getLessonsForChapter, getLessonById, type LessonDef } from '../../data/lessonData';
import type { ClassroomSettings, ClassroomAssignment } from '../../types/classroom';
import { DurationSelector } from './DurationSelector';

export interface PassageOption {
  id: string;
  title: string;
  category: string;
  wpm: string;
  text: string;
}

export interface GameOption {
  id: string;
  gameId: 'lilypad-leap' | 'neon-velocity';
  title: string;
  category: string;
  badge: string;
  description: string;
  focus: string;
  duration: number;
  gradient?: string;
  borderColor?: string;
  badgeColor?: string;
  tags?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: ClassroomSettings;
  passages: PassageOption[];
  games: GameOption[];
  onAssignCurriculumLesson: (lesson: LessonDef, chapterTitle: string, customDurationSeconds?: number) => void;
  onAddAssignment?: (lesson: LessonDef, chapterTitle: string, customDurationSeconds?: number) => void;
  onAssignMultipleAssignments?: (
    assignments: ClassroomAssignment[],
    customDurationSeconds?: number,
    teacherNote?: string
  ) => void;
  onAssignPassage: (passage: PassageOption, customDurationSeconds?: number) => void;
  onAssignGame: (game: any) => void;
}

type ModalCategory = 'curriculum' | 'passages' | 'games';

export const ClassroomTargetSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSettings,
  passages,
  games,
  onAssignCurriculumLesson,
  onAddAssignment,
  onAssignMultipleAssignments,
  onAssignPassage,
  onAssignGame,
}) => {
  const [activeCategory, setActiveCategory] = useState<ModalCategory>('curriculum');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('home-row');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPassageCategory, setSelectedPassageCategory] = useState<string>('all');
  const [assignDurationSeconds, setAssignDurationSeconds] = useState<number>(() => currentSettings.durationSeconds || 300);
  const [teacherNote, setTeacherNote] = useState<string>(() => currentSettings.teacherNote || '');
  const [showQueueDrawer, setShowQueueDrawer] = useState<boolean>(false);

  // Maintain local queue initialized from current settings
  const [queuedAssignments, setQueuedAssignments] = useState<ClassroomAssignment[]>(() => {
    return currentSettings.assignments || [];
  });

  const [replacementConfirmation, setReplacementConfirmation] = useState<{
    lesson: LessonDef;
    chapterTitle: string;
  } | null>(null);

  useEffect(() => {
    if (currentSettings.durationSeconds) {
      setAssignDurationSeconds(currentSettings.durationSeconds);
    }
    if (currentSettings.assignments) {
      setQueuedAssignments(currentSettings.assignments);
    }
    if (currentSettings.teacherNote) {
      setTeacherNote(currentSettings.teacherNote);
    }
  }, [currentSettings.durationSeconds, currentSettings.assignments, currentSettings.teacherNote]);

  // Determine current progression and recommended next lesson
  const currentAssignedId = useMemo(() => {
    if (currentSettings.lesson_id) return Number(currentSettings.lesson_id);
    if (currentSettings.assignments && currentSettings.assignments.length > 0) {
      return currentSettings.assignments[currentSettings.assignments.length - 1].lessonId;
    }
    return 0;
  }, [currentSettings.lesson_id, currentSettings.assignments]);

  const recommendedNextLesson = useMemo(() => {
    const nextId = currentAssignedId > 0 ? currentAssignedId + 1 : 1;
    return getLessonById(nextId) || getLessonById(1);
  }, [currentAssignedId]);

  const recommendedNextChapter = useMemo(() => {
    if (!recommendedNextLesson) return CHAPTERS[0];
    return CHAPTERS.find((c) => c.id === recommendedNextLesson.chapterId) || CHAPTERS[0];
  }, [recommendedNextLesson]);

  // Filter lessons for selected chapter
  const currentChapter = useMemo(
    () => CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0],
    [selectedChapterId]
  );

  const chapterLessons = useMemo(
    () => getLessonsForChapter(currentChapter.id),
    [currentChapter.id]
  );

  const filteredCurriculumLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chapterLessons;

    return chapterLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        String(l.id) === q ||
        l.targetKeys.some((k) => k.toLowerCase().includes(q))
    );
  }, [chapterLessons, searchQuery]);

  // Queue manipulation handlers (keep modal open so teacher can queue multiple lessons at once)
  const handleToggleQueueLesson = (lesson: LessonDef, chapterTitle: string) => {
    const existingIndex = queuedAssignments.findIndex((a) => a.lessonId === lesson.id);
    if (existingIndex !== -1) {
      // Remove
      setQueuedAssignments((prev) => prev.filter((a) => a.lessonId !== lesson.id).map((a, i) => ({ ...a, order: i + 1 })));
    } else {
      // Add
      const companion = !lesson.content ? getLessonById(lesson.id + 1) : undefined;
      const drillContent = lesson.content || companion?.content || 'ff jj fj jf ff jj fj jf';
      const newAssignment: ClassroomAssignment = {
        assignmentId: `assign-${lesson.id}-${Date.now()}`,
        lessonId: lesson.id,
        title: `Step ${lesson.id}: ${lesson.title}`,
        chapterTitle,
        chapterId: lesson.chapterId,
        description: lesson.description,
        order: queuedAssignments.length + 1,
        assignedAt: Date.now(),
        targetKeys: lesson.targetKeys || [],
        passingAccuracy: lesson.passingAccuracy || 80,
        targetText: drillContent,
        durationSeconds: assignDurationSeconds,
      };
      setQueuedAssignments((prev) => [...prev, newAssignment]);
    }
  };

  const handleReorderQueued = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= queuedAssignments.length) return;
    const list = [...queuedAssignments];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setQueuedAssignments(list.map((a, i) => ({ ...a, order: i + 1 })));
  };

  const handleRemoveQueued = (lessonId: number) => {
    setQueuedAssignments((prev) => prev.filter((a) => a.lessonId !== lessonId).map((a, i) => ({ ...a, order: i + 1 })));
  };

  // Immediate single lesson assignment handler
  const handleInitiateCurriculumAssign = (lesson: LessonDef, chapterTitle: string) => {
    const hasActiveAssignment = Boolean(currentSettings.passageTitle);
    const isDifferent =
      String(currentSettings.lesson_id) !== String(lesson.id) &&
      currentSettings.lessonId !== `learn-${lesson.id}`;

    if (hasActiveAssignment && isDifferent) {
      setReplacementConfirmation({ lesson, chapterTitle });
    } else {
      onAssignCurriculumLesson(lesson, chapterTitle, assignDurationSeconds);
      onClose();
    }
  };

  // Commit the complete queued lessons batch
  const handleConfirmBatchAssignment = () => {
    if (queuedAssignments.length === 0) return;

    if (onAssignMultipleAssignments) {
      onAssignMultipleAssignments(queuedAssignments, assignDurationSeconds, teacherNote.trim());
    } else if (onAddAssignment) {
      // Fallback
      const first = queuedAssignments[0];
      const lesson = getLessonById(first.lessonId);
      if (lesson) {
        onAssignCurriculumLesson(lesson, first.chapterTitle || 'Curriculum', assignDurationSeconds);
      }
    }
    onClose();
  };

  // Filter passages
  const filteredPassages = useMemo(() => {
    let list = passages;
    if (selectedPassageCategory !== 'all') {
      list = list.filter((p) => p.category === selectedPassageCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q)
      );
    }
    return list;
  }, [passages, selectedPassageCategory, searchQuery]);

  const passageCategories = useMemo(() => {
    const cats = Array.from(new Set(passages.map((p) => p.category)));
    return ['all', ...cats];
  }, [passages]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-black uppercase tracking-wider">
                  Lesson & Target Selector
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• Multi-Lesson Queue Enabled</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Assign Classroom Activity
              </h3>
            </div>

            <button
              type="button"
              id="close-target-selector-modal"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Category Switcher (Curriculum vs Passages vs Games) */}
          <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80" role="tablist">
              <button
                type="button"
                id="target-modal-cat-curriculum"
                role="tab"
                aria-selected={activeCategory === 'curriculum'}
                onClick={() => {
                  setActiveCategory('curriculum');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'curriculum'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn Curriculum</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    activeCategory === 'curriculum'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  685 Steps
                </span>
              </button>

              <button
                type="button"
                id="target-modal-cat-passages"
                role="tab"
                aria-selected={activeCategory === 'passages'}
                onClick={() => {
                  setActiveCategory('passages');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'passages'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Practice Passages</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    activeCategory === 'passages'
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  Standard
                </span>
              </button>

              <button
                type="button"
                id="target-modal-cat-games"
                role="tab"
                aria-selected={activeCategory === 'games'}
                onClick={() => {
                  setActiveCategory('games');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeCategory === 'games'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Arcade Games</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    activeCategory === 'games'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  2 Games
                </span>
              </button>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* ─── SECTION 1: LEARN CURRICULUM ─── */}
            {activeCategory === 'curriculum' && (
              <div className="space-y-5">
                {/* Search & Guidance Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Learn Curriculum (685 Steps)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Click &ldquo;+ Add to Queue&rdquo; on any lesson to build a multi-lesson sequence for your class.
                      </p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search steps, keys (e.g. F, J)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Recommended Next Lesson Featured Card */}
                {recommendedNextLesson && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-400/60 dark:border-emerald-500/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Recommended Next Lesson</span>
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {recommendedNextChapter?.icon} {recommendedNextChapter?.title}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                        Step {recommendedNextLesson.id}: {recommendedNextLesson.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                        {recommendedNextLesson.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        id="assign-recommended-next-lesson-btn"
                        onClick={() => {
                          handleToggleQueueLesson(recommendedNextLesson, recommendedNextChapter?.title || 'Curriculum');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {queuedAssignments.some((a) => a.lessonId === recommendedNextLesson.id)
                            ? 'In Queue (Click to Remove)'
                            : '+ Add Step to Queue'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Chapter Selectors */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Curriculum Categories ({CHAPTERS.length} Chapters)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Active: <strong className="text-blue-600 dark:text-blue-400">{currentChapter.title}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
                    {CHAPTERS.map((ch) => {
                      const isSelected = ch.id === selectedChapterId;
                      return (
                        <button
                          key={ch.id}
                          id={`modal-chapter-${ch.id}`}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                            setSearchQuery('');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                          }`}
                        >
                          <span>{ch.icon}</span>
                          <span>{ch.title}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {ch.lessonRange[0]}–{ch.lessonRange[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step-by-Step Lessons Grid with Queue Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{currentChapter.icon}</span>
                      <span>{currentChapter.title} Steps</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        ({filteredCurriculumLessons.length} available)
                      </span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredCurriculumLessons.map((lesson) => {
                      const queueIndex = queuedAssignments.findIndex((a) => a.lessonId === lesson.id);
                      const isQueued = queueIndex !== -1;
                      const isCurrentlyActive =
                        (currentSettings.session_type === 'curriculum' ||
                          currentSettings.assignmentCategory === 'learn-curriculum') &&
                        (String(currentSettings.lesson_id) === String(lesson.id) ||
                          currentSettings.lessonId === `learn-${lesson.id}`);

                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 transition shadow-xs flex flex-col justify-between ${
                            isQueued
                              ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                              : isCurrentlyActive
                              ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-black">
                                Step {lesson.id}
                              </span>

                              {/* Status Tag */}
                              <div>
                                {isQueued ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                                    ✓ Queued (#{queueIndex + 1})
                                  </span>
                                ) : isCurrentlyActive ? (
                                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase">
                                    → Active
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                                    {lesson.type}
                                  </span>
                                )}
                              </div>
                            </div>

                            <h6 className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1">
                              {lesson.title}
                            </h6>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 mb-2.5">
                              {lesson.description}
                            </p>

                            {/* Target Keys */}
                            {lesson.targetKeys && lesson.targetKeys.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap mb-2.5">
                                <span className="text-[10px] font-bold text-slate-400">Keys:</span>
                                {lesson.targetKeys.map((k) => (
                                  <span
                                    key={k}
                                    className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 font-mono text-[10px] font-black text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                  >
                                    {k === ' ' ? 'Space' : k.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Content Excerpt */}
                            {lesson.content && (
                              <div className="p-2 rounded-xl bg-slate-950 text-white font-mono text-xs text-center truncate mb-3 border border-slate-800">
                                {lesson.content}
                              </div>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              Pass: {lesson.passingAccuracy || 90}%
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isQueued ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQueued(lesson.id)}
                                  className="py-1 px-2.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  id={`modal-queue-step-${lesson.id}`}
                                  onClick={() => handleToggleQueueLesson(lesson, currentChapter.title)}
                                  className="py-1 px-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Queue</span>
                                </button>
                              )}

                              <button
                                type="button"
                                id={`modal-assign-step-${lesson.id}`}
                                onClick={() => handleInitiateCurriculumAssign(lesson, currentChapter.title)}
                                className="py-1 px-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                                title="Assign and start this single lesson right away"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Assign Now</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── SECTION 2: PRACTICE PASSAGES ─── */}
            {activeCategory === 'passages' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {passageCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedPassageCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition cursor-pointer shrink-0 ${
                          selectedPassageCategory === cat
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search passages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPassages.map((passage) => {
                    const isSelected = currentSettings.passageId === passage.id;
                    return (
                      <div
                        key={passage.id}
                        className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 transition shadow-xs flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-amber-400/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                              {passage.category}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              Target: {passage.wpm}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
                            {passage.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-serif leading-relaxed line-clamp-4 mb-4">
                            &ldquo;{passage.text}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">
                            {passage.text.length} characters
                          </span>
                          <button
                            type="button"
                            id={`modal-assign-passage-${passage.id}`}
                            onClick={() => {
                              onAssignPassage(passage, assignDurationSeconds);
                              onClose();
                            }}
                            className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Currently Assigned' : 'Assign to Classroom'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── SECTION 3: ARCADE GAMES ─── */}
            {activeCategory === 'games' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map((game) => {
                    const isSelected = currentSettings.gameId === game.gameId;
                    return (
                      <div
                        key={game.id}
                        className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition shadow-md flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-purple-400/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black uppercase">
                              {game.badge}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {game.duration}s Challenge
                            </span>
                          </div>

                          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                            {game.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                            {game.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {game.focus}
                          </span>

                          <button
                            type="button"
                            id={`modal-assign-game-${game.id}`}
                            onClick={() => {
                              onAssignGame(game);
                              onClose();
                            }}
                            className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'
                            }`}
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Currently Assigned' : 'Assign to Classroom'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── STICKY BOTTOM QUEUE & CONFIGURATION BAR ─── */}
          <div className="border-t-2 border-slate-200 dark:border-slate-800 p-4 sm:p-5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0 space-y-3">
            {/* Multi-lesson Queue Summary */}
            {queuedAssignments.length > 0 && (
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Assignment Queue ({queuedAssignments.length} Lessons Selected):
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQueueDrawer((prev) => !prev)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{showQueueDrawer ? 'Hide Details' : 'Reorder / View Details'}</span>
                    {showQueueDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Queue Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {queuedAssignments.map((assignment, idx) => (
                    <span
                      key={assignment.assignmentId || assignment.lessonId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold"
                    >
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">#{idx + 1}</span>
                      <span>{assignment.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQueued(assignment.lessonId)}
                        aria-label={`Remove ${assignment.title}`}
                        className="ml-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Expandable Reordering Drawer */}
                {showQueueDrawer && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 max-h-36 overflow-y-auto">
                    {queuedAssignments.map((a, idx) => (
                      <div
                        key={a.assignmentId || a.lessonId}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate mr-2">
                          #{idx + 1}. {a.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleReorderQueued(idx, 'up')}
                            aria-label="Move lesson up"
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === queuedAssignments.length - 1}
                            onClick={() => handleReorderQueued(idx, 'down')}
                            aria-label="Move lesson down"
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveQueued(a.lessonId)}
                            aria-label="Delete lesson from queue"
                            className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-500 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Duration Selector & Teacher Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <DurationSelector
                  label="Session Duration"
                  durationSeconds={assignDurationSeconds}
                  onChange={setAssignDurationSeconds}
                />
              </div>

              {/* Optional Teacher Note Input */}
              <div>
                <label htmlFor="modal-teacher-note-input" className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Teacher Note / Daily Focus (Optional):</span>
                </label>
                <input
                  id="modal-teacher-note-input"
                  type="text"
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="e.g. Focus on F and J tactile bumps..."
                  maxLength={100}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {queuedAssignments.length > 0
                  ? `${queuedAssignments.length} lessons ready to assign in order.`
                  : 'Select lessons above or pick a passage/game.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>

                {queuedAssignments.length > 0 && (
                  <button
                    type="button"
                    id="confirm-batch-assign-btn"
                    onClick={handleConfirmBatchAssignment}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Assign ({queuedAssignments.length} Lessons)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Replacement Confirmation Dialog */}
          <AnimatePresence>
            {replacementConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Replace Classroom Assignment?
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-left text-xs font-semibold space-y-2 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">
                        Current assignment:
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold block truncate">
                        {currentSettings.passageTitle}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">
                        Replace with:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-black block">
                        Step {replacementConfirmation.lesson.id}: {replacementConfirmation.lesson.title} ({replacementConfirmation.chapterTitle})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    This lesson will be assigned to all students in this classroom.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReplacementConfirmation(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onAssignCurriculumLesson(
                          replacementConfirmation.lesson,
                          replacementConfirmation.chapterTitle,
                          assignDurationSeconds
                        );
                        setReplacementConfirmation(null);
                        onClose();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/25 transition cursor-pointer"
                    >
                      Confirm &amp; Assign
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
