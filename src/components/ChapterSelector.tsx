/**
 * ChapterSelector — Vertical chapter picker for the Learn page.
 * Shows all 25 chapters grouped by section with progress bars.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { SECTIONS, getChaptersInOrder } from '../data/curriculum';
import type { Chapter } from '../data/lessons/types';
import { getChapterProgress, isChapterUnlocked } from '../engine/sessionStore';
import { useI18n } from '../context/I18nContext';
import { getLocalizedChapter } from '../data/curriculumI18n';

interface ChapterSelectorProps {
  selectedChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  selectedChapterId,
  onSelectChapter,
}) => {
  const { currentLang } = useI18n();
  const orderedChapters = getChaptersInOrder();

  // Group chapters by section for display
  const sectionGroups = SECTIONS.map(section => ({
    section,
    chapters: orderedChapters.filter(c => c.sectionId === section.id),
  }));

  return (
    <div className="chapter-selector h-full overflow-y-auto pr-1 custom-scrollbar">
      {sectionGroups.map(({ section, chapters }) => (
        <div key={section.id} className="mb-4">
          {/* Section Header */}
          <div className="flex items-center gap-2 px-3 py-2 mb-1.5">
            <span className="text-base">{section.icon}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {section.title}
            </span>
          </div>

          {/* Chapter Cards */}
          <div className="flex flex-col gap-1">
            {chapters.map(chapter => (
              <ChapterCard
                key={chapter.id}
                chapter={getLocalizedChapter(chapter, currentLang)}
                isSelected={chapter.id === selectedChapterId}
                onSelect={() => onSelectChapter(chapter.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ChapterCardProps {
  chapter: Chapter;
  isSelected: boolean;
  onSelect: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, isSelected, onSelect }) => {
  const { t } = useI18n();
  const unlocked = isChapterUnlocked(chapter.lessonRange[0]);
  const progress = getChapterProgress(chapter.lessonRange[0], chapter.lessonRange[1]);
  const isComplete = progress.completed === progress.total;

  return (
    <motion.button
      whileHover={unlocked ? { scale: 1.02, x: 4 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={unlocked ? onSelect : undefined}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group
        ${isSelected
          ? 'bg-white/10 border border-white/20 shadow-lg shadow-sky-500/10'
          : unlocked
          ? 'hover:bg-white/5 border border-transparent'
          : 'opacity-50 cursor-not-allowed border border-transparent'
        }
      `}
      disabled={!unlocked}
    >
      {/* Icon / Lock */}
      <div
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 transition-colors
          ${isComplete
            ? 'bg-emerald-500/20 text-emerald-400'
            : isSelected
            ? 'bg-white/10'
            : 'bg-white/5'
          }
        `}
        style={!isComplete && unlocked ? { backgroundColor: `${chapter.color}15` } : {}}
      >
        {!unlocked ? (
          <Lock className="w-4 h-4 text-slate-500" />
        ) : isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <span>{chapter.icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
            {chapter.title}
          </span>
          {chapter.wpmGoal && unlocked && (
            <span className="text-[9px] font-bold text-sky-400/70 shrink-0">
              {chapter.wpmGoal} WPM
            </span>
          )}
        </div>

        {/* Progress bar */}
        {unlocked && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress.percent}%`,
                  backgroundColor: isComplete ? '#22C55E' : chapter.color,
                }}
              />
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-2.5 h-2.5 text-amber-400/60 fill-amber-400/60" />
              <span className="text-[9px] font-bold text-slate-400">
                {progress.stars}
              </span>
            </div>
          </div>
        )}

        {/* Lesson count */}
        <span className="text-[9px] text-slate-500 mt-0.5 block">
          {progress.completed}/{progress.total} {t('learn.lessonsCount').toLowerCase()}
        </span>
      </div>

      {/* Arrow indicator */}
      {isSelected && unlocked && (
        <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
      )}
    </motion.button>
  );
};

export default ChapterSelector;
