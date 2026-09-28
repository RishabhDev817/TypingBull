import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  FileText,
  Gamepad2,
  Search,
  Check,
  GraduationCap,
} from 'lucide-react';
import { CHAPTERS } from '../../data/curriculum';
import { getLessonsForChapter, type LessonDef } from '../../data/lessonData';
import type { ClassroomSettings } from '../../types/classroom';

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
  onAssignCurriculumLesson: (lesson: LessonDef, chapterTitle: string) => void;
  onAssignPassage: (passage: PassageOption) => void;
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
  onAssignPassage,
  onAssignGame,
}) => {
  const [activeCategory, setActiveCategory] = useState<ModalCategory>('curriculum');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('home-row');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPassageCategory, setSelectedPassageCategory] = useState<string>('all');

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-black uppercase tracking-wider">
                  Target Assignment Selector
                </span>
                <span className="text-xs text-slate-400">• Real-Time Broadcast</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Assign Classroom Activity
              </h3>
            </div>

            <button
              type="button"
              id="close-target-selector-modal"
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Category Switcher (Curriculum vs Passages vs Games) */}
          <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                id="target-modal-cat-curriculum"
                onClick={() => {
                  setActiveCategory('curriculum');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
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
                onClick={() => {
                  setActiveCategory('passages');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
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
                onClick={() => {
                  setActiveCategory('games');
                  setSearchQuery('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
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
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* ─── SECTION 1: LEARN CURRICULUM ─── */}
            {activeCategory === 'curriculum' && (
              <div className="space-y-6">
                {/* Curriculum Info Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Solo "Learn" Core Curriculum (1:1 Interactive Drills)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Assigning a step-by-step module broadcasts <code>session_type: 'curriculum'</code> and loads the full interactive virtual keyboard with target finger guides for all students.
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
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Chapter Selectors (Solo Map Categories) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Curriculum Categories ({CHAPTERS.length} Chapters)
                    </span>
                    <span className="text-xs text-slate-400">
                      Active: <strong className="text-blue-600 dark:text-blue-400">{currentChapter.title}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {CHAPTERS.map((ch) => {
                      const isSelected = ch.id === selectedChapterId;
                      return (
                        <button
                          key={ch.id}
                          id={`modal-chapter-${ch.id}`}
                          type="button"
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
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            {ch.lessonRange[0]}–{ch.lessonRange[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step-by-Step Lessons Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{currentChapter.icon}</span>
                      <span>{currentChapter.title} Steps</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({filteredCurriculumLessons.length} available)
                      </span>
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredCurriculumLessons.map((lesson) => {
                      const isCurrentlyActive =
                        (currentSettings.session_type === 'curriculum' ||
                          currentSettings.assignmentCategory === 'learn-curriculum') &&
                        (String(currentSettings.lesson_id) === String(lesson.id) ||
                          currentSettings.lessonId === `learn-${lesson.id}`);

                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 transition shadow-sm flex flex-col justify-between ${
                            isCurrentlyActive
                              ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-black">
                                Step {lesson.id}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                                {lesson.type}
                              </span>
                            </div>

                            <h6 className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1">
                              {lesson.title}
                            </h6>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-2.5">
                              {lesson.description}
                            </p>

                            {/* Target Keys Pills */}
                            {lesson.targetKeys.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap mb-2.5">
                                <span className="text-[10px] font-bold text-slate-400">Target:</span>
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

                            {/* Drill Content Excerpt */}
                            {lesson.content && (
                              <div className="p-2 rounded-xl bg-slate-950 text-white font-mono text-xs text-center truncate mb-3 border border-slate-800">
                                {lesson.content}
                              </div>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-400">
                              Pass: {lesson.passingAccuracy || 90}%
                            </span>

                            <button
                              type="button"
                              id={`modal-assign-step-${lesson.id}`}
                              onClick={() => {
                                onAssignCurriculumLesson(lesson, currentChapter.title);
                                onClose();
                              }}
                              className={`py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                                isCurrentlyActive
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isCurrentlyActive ? 'Assigned' : 'Assign Step'}</span>
                            </button>
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

                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search passages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPassages.map((passage) => {
                    const isSelected =
                      currentSettings.session_type === 'passage' &&
                      currentSettings.passageId === passage.id;

                    return (
                      <div
                        key={passage.id}
                        className={`p-5 rounded-2xl border-2 transition shadow-sm flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                              {passage.category}
                            </span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {passage.wpm}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
                            {passage.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic line-clamp-3 mb-4">
                            "{passage.text}"
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            type="button"
                            id={`modal-assign-passage-${passage.id}`}
                            onClick={() => {
                              onAssignPassage(passage);
                              onClose();
                            }}
                            className={`py-2 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Currently Assigned' : 'Assign Passage'}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {games.map((game) => {
                    const isSelected =
                      currentSettings.session_type === 'game' &&
                      currentSettings.gameId === game.gameId;

                    return (
                      <div
                        key={game.id}
                        className={`p-6 rounded-3xl border-2 transition shadow-lg flex flex-col justify-between bg-white dark:bg-slate-900 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-purple-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-purple-400/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase">
                              {game.badge}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
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

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Current Active Target:{' '}
              <strong className="text-slate-900 dark:text-white">
                {currentSettings.passageTitle}
              </strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
