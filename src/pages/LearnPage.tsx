import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Train, BookOpen, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { LESSONS } from '../data/lessonData';
import { CHAPTERS, getChapterById, getChapterByLessonId } from '../data/curriculum';
import { getTotalStars, getCompletedLessonCount, getLessonProgress } from '../engine/sessionStore';
import { TrainMap } from '../components/TrainMap';
import { ChapterSelector } from '../components/ChapterSelector';
import { Mascot } from '../components/Mascot';
import { CoinCounter } from '../components/CoinCounter';
import { FloatingControls } from '../components/navigation/FloatingControls';
import { useI18n } from '../context/I18nContext';

export const LearnPage: React.FC = () => {
  const { t } = useI18n();
  const totalStars = getTotalStars();
  const completedCount = getCompletedLessonCount();

  // Find the active chapter based on the user's current unfinished unlocked lesson
  const initialChapterId = useMemo(() => {
    const progressList = getLessonProgress();
    for (const lesson of LESSONS) {
      const p = progressList.find(item => item.lessonId === lesson.id);
      if (!p?.completed) {
        const ch = getChapterByLessonId(lesson.id);
        if (ch) return ch.id;
        break;
      }
    }
    return 'home-row';
  }, []);

  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);

  const selectedChapter = useMemo(() => getChapterById(selectedChapterId) || CHAPTERS[0], [selectedChapterId]);

  const mascotMood = completedCount >= LESSONS.length
    ? ('cheering' as const)
    : completedCount > 0
    ? ('happy' as const)
    : ('idle' as const);

  return (
    <div className="w-full flex-1 flex flex-col min-h-screen relative p-3 md:p-5 lg:p-6 text-white">
      {/* Floating HUD Header Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="w-full rounded-3xl p-4 md:p-5 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/85 backdrop-blur-2xl border border-sky-400/25 ring-1 ring-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_24px_rgba(56,189,248,0.1)]"
      >
        {/* Left: Mascot & Journey Title */}
        <div className="flex items-center gap-3.5">
          <Mascot mood={mascotMood} size="sm" className="shrink-0 drop-shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight flex items-center gap-2 text-white">
                {t('learn.title')}
              </h1>
            </div>
            <p className="text-xs md:text-sm font-bold mt-0.5 text-slate-300">
              {completedCount >= LESSONS.length
                ? t('learn.allMastered')
                : `${t('learn.exploring')} ${selectedChapter.icon} ${selectedChapter.title} (${selectedChapter.lessonRange[0]}–${selectedChapter.lessonRange[1]})`}
            </p>
          </div>
        </div>

        {/* Right: Real-time Stats, Progress Meter & Header Controls */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Chapters Drawer Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-sky-400/40 bg-sky-500/20 text-sky-300 text-xs font-extrabold hover:bg-sky-500/30 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('learn.chapters')}</span>
          </button>

          {/* Station Count Chip */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-2 font-extrabold text-xs md:text-sm shadow-sm bg-emerald-500/20 border-emerald-400/50 text-emerald-300">
            <Train className="w-4 h-4 text-emerald-400" />
            <span>{completedCount}/{LESSONS.length} {t('learn.lessonsCount')}</span>
          </div>

          {/* Stars Chip */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border-2 font-extrabold text-xs md:text-sm shadow-sm bg-amber-500/20 border-amber-400/50 text-amber-300">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{totalStars}/{LESSONS.length * 3} {t('learn.starsCount')}</span>
          </div>

          {/* Coin Counter Pill Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border-2 font-extrabold text-xs md:text-sm shadow-sm bg-yellow-500/20 border-yellow-400/50 text-yellow-300">
            <CoinCounter compact />
          </div>

          {/* Quick Progress Bar with High-Visibility Lightened Track */}
          <div className="w-full md:w-32 lg:w-40 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-extrabold text-slate-300">
              <span>{t('learn.curriculum')}</span>
              <span>{Math.round((completedCount / LESSONS.length) * 100)}%</span>
            </div>
            <div
              className="h-3 w-full rounded-full overflow-hidden p-0.5 shadow-inner border border-white/20 ring-1 ring-sky-400/30"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 shadow-sm"
              />
            </div>
          </div>

          {/* Dedicated Header Controls Container: Sound & Mode Toggle Buttons */}
          <div className="flex flex-row items-center gap-3 shrink-0 pl-1 md:border-l md:border-white/20">
            <FloatingControls className="flex flex-row items-center gap-3" showLabel={false} />
          </div>
        </div>
      </motion.div>

      {/* Main Two-Panel Layout (Left Collapsible Chapter Selector + Right Train Map) */}
      <div className="w-full flex-1 flex min-h-0 relative">
        {/* Left: Collapsible Chapter Selector Drawer / Sidebar */}
        <AnimatePresence initial={false}>
          {isCurriculumOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0, marginRight: 0 }}
              animate={{
                width: 320,
                opacity: 1,
                marginRight: 16,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              exit={{
                width: 0,
                opacity: 0,
                marginRight: 0,
                transition: { duration: 0.25, ease: 'easeInOut' }
              }}
              className={`
                fixed lg:static inset-y-0 left-0 z-40 lg:z-auto shrink-0 p-4 rounded-3xl
                bg-slate-900/95 lg:bg-slate-900/80 backdrop-blur-2xl border border-sky-400/20 shadow-2xl
                flex flex-col overflow-hidden
                ${mobileDrawerOpen ? 'translate-x-0 !w-80 !opacity-100 !mr-0' : '-translate-x-full lg:translate-x-0'}
              `}
              style={{ height: 'calc(100vh - 160px)' }}
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 shrink-0 min-w-[270px]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
                    Curriculum Map
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  {/* Collapse chevron button on desktop */}
                  <button
                    onClick={() => setIsCurriculumOpen(false)}
                    className="hidden lg:flex items-center justify-center p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Collapse Curriculum Sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {/* Close button on mobile */}
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="lg:hidden text-xs text-slate-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden min-w-[270px]">
                <ChapterSelector
                  selectedChapterId={selectedChapterId}
                  onSelectChapter={(chId) => {
                    setSelectedChapterId(chId);
                    setMobileDrawerOpen(false);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Docked Expand Button for Desktop when sidebar is minimized */}
        {!isCurriculumOpen && (
          <motion.button
            initial={{ opacity: 0, x: -15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCurriculumOpen(true)}
            className="hidden lg:flex absolute left-3 top-3 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-sky-400/40 shadow-2xl backdrop-blur-md cursor-pointer transition-all"
            title="Expand Curriculum Map"
          >
            <ChevronRight className="w-4 h-4 text-sky-400" />
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span className="text-xs font-black text-slate-200">Curriculum Map</span>
          </motion.button>
        )}

        {/* Right: Selected Chapter Train Map Canvas (Expands to 100% when sidebar is minimized) */}
        <motion.div
          key={selectedChapterId}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 min-w-0 flex flex-col h-full bg-[#0F1A36] rounded-3xl overflow-hidden transition-all duration-300"
        >
          <TrainMap
            chapterId={selectedChapterId}
            className="flex-1 w-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LearnPage;
