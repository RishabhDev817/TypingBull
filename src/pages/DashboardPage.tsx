import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, BookOpen, ArrowRight, Trophy, TrendingUp, Brain } from 'lucide-react';
import { getSessions, getStreakData, getTotalStars, getCompletedLessonCount } from '../engine/sessionStore';
import { LESSONS } from '../data/lessonData';
import { WeakKeyPanel } from '../components/WeakKeyPanel';
import { isLessonUnlocked } from '../engine/sessionStore';
import { Mascot } from '../components/Mascot';
import { CoinCounter } from '../components/CoinCounter';
import { soundEngine } from '../utils/audio';
import { AITutorReport } from '../components/AITutorReport';
import {
  WelcomeBannerIllustration,
  StreakIllustration,
  StarsIllustration,
  LessonsIllustration,
  SessionsIllustration,
  ContinueLearningIllustration,
  PlayGameIllustration,
  QuickPracticeIllustration,
} from '../components/patterns/CardWatermarks';
import { TypingFAQ } from '../components/TypingFAQ';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { useI18n } from '../context/I18nContext';
import { HomeSEOContent } from '../components/HomeSEOContent';
import { usePageSEO } from '../hooks/usePageSEO';

export const DashboardPage: React.FC = () => {
  const { currentLang, t } = useI18n();
  usePageSEO(currentLang);
  const navigate = useNavigate();
  const sessions = getSessions();
  const streak = getStreakData();
  const totalStars = getTotalStars();
  const completedLessons = getCompletedLessonCount();
  const recentSessions = sessions.slice(0, 4);
  const [tutorOpen, setTutorOpen] = useState(false);

  const nextLesson = LESSONS.find(l => isLessonUnlocked(l.id) && !sessions.some(s => s.modeDetail === `lesson-${l.id}` && s.accuracy >= l.passingAccuracy));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 12 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-3 sm:px-4 py-3 md:py-4 flex flex-col"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            TypingBull Coach
          </span>
        </div>
      </div>

      {/* Glassmorphism wrapper for dashboard content */}
      <div className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-5">
        {/* Dashboard Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch">
          {/* Left Primary Content Area (Hero + Quick Actions + Analytics Row) */}
          <div className="flex-1 min-w-0 w-full flex flex-col">
            {/* 1. Hero / Welcome Banner */}
            <motion.div
              variants={itemVariants}
              className="card-game card-halo-orange relative p-4 sm:p-5 flex items-center justify-between gap-4 mb-3.5"
            >
              <div className="flex items-center gap-4 z-10">
                <Mascot mood={streak.currentStreak > 0 ? 'happy' : 'idle'} size="md" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                    {t('dash.hey')}
                  </h1>
                  <p className="text-body text-xs sm:text-sm mt-0.5 font-semibold">
                    {streak.currentStreak > 0
                      ? t('dash.streakActive', { n: streak.currentStreak })
                      : t('dash.streakZero')}
                  </p>
                  <div className="mt-2">
                    <CoinCounter />
                  </div>
                </div>
              </div>
              <WelcomeBannerIllustration className="hidden sm:flex" />
            </motion.div>

            {/* 2. Quick Actions (4 Cards) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5 items-stretch"
            >
              {/* Continue Learning Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); navigate(nextLesson ? `/learn/${nextLesson.id}` : '/learn'); }}
                className="card-game card-halo-green relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: 'var(--color-badge-bg-emerald)', border: '1px solid var(--color-badge-border-emerald)' }}
                >📚</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-extrabold text-ink leading-tight">{t('dash.continueLearning')}</h3>
                  <p className="text-[10.5px] text-body font-semibold leading-tight mt-0.5">
                    {nextLesson ? `${t('dash.station')} ${nextLesson.id}: ${nextLesson.title}` : t('dash.allDone')}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                {/* Watermark illustration */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-[0.08] pointer-events-none">
                  <ContinueLearningIllustration />
                </div>
              </motion.button>

              {/* Play Game Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); navigate('/play'); }}
                className="card-game card-halo-pink relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: 'var(--color-badge-bg-pink)', border: '1px solid var(--color-badge-border-pink)' }}
                >🚀</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-extrabold text-ink leading-tight">{t('dash.playGame')}</h3>
                  <p className="text-[10.5px] text-body font-semibold leading-tight mt-0.5">{t('dash.stellarDash')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-highlight-pink shrink-0" />
                {/* Watermark illustration */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-[0.08] pointer-events-none">
                  <PlayGameIllustration />
                </div>
              </motion.button>

              {/* Quick Practice Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); navigate('/practice'); }}
                className="card-game card-halo-orange relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
                >⌨️</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-extrabold text-ink leading-tight">{t('dash.quickPractice')}</h3>
                  <p className="text-[10.5px] text-body font-semibold leading-tight mt-0.5">{t('dash.freeTypingTest')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-orange shrink-0" />
                {/* Watermark illustration */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-[0.08] pointer-events-none">
                  <QuickPracticeIllustration />
                </div>
              </motion.button>

              {/* AI Tutor Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); setTutorOpen(true); }}
                className="card-game card-halo-purple relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
                >🤖</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-extrabold text-ink leading-tight">{t('dash.aiTutor')}</h3>
                  <p className="text-[10.5px] text-body font-semibold leading-tight mt-0.5">{t('dash.diagnoseWeak')}</p>
                </div>
                <Brain className="w-3.5 h-3.5 text-violet shrink-0" />
              </motion.button>
            </motion.div>

            {/* 3. Bottom Analytics Row: Recent Sessions (Left) & Weak-Key Analysis (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch flex-1">
              {/* Recent Sessions Card */}
              <motion.div variants={itemVariants} className="card-game card-halo-gold p-4 pb-4 flex flex-col justify-between h-full min-h-[210px]">
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-2 mb-2 shrink-0">
                    <Trophy className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-extrabold text-ink">{t('dash.recentSessions')}</h3>
                  </div>

                  {recentSessions.length > 0 ? (
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[175px]">
                      {recentSessions.map((session, i) => (
                        <div key={session.id || i} className="flex items-center justify-between py-1.5 border-b border-hairline/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center bg-canvas-soft-2 rounded-lg text-xs shrink-0">
                              {session.mode === 'lesson' ? '📖' : session.mode === 'game' ? '🎮' : '⌨️'}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-ink block truncate">{session.modeDetail}</span>
                              <span className="text-[10px] text-mute font-semibold block leading-none">
                                {new Date(session.startTime).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-xs font-extrabold text-primary block leading-none">{session.wpm} WPM</span>
                            <span className="text-[10px] text-body font-bold block leading-tight mt-0.5">{session.accuracy.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <p className="text-xs text-body font-semibold">
                        {t('dash.noSessions')}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weak Key Panel */}
              <motion.div variants={itemVariants} className="h-full flex flex-col">
                <WeakKeyPanel
                  onStartMission={(content, targetKeys) => {
                    navigate('/practice', { state: { missionContent: content, missionKeys: targetKeys } });
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar: Clean Stat Overview Rail */}
          <motion.div variants={itemVariants} className="w-full lg:w-32 shrink-0 flex flex-col items-center pt-0 pb-1 self-stretch">
            {/* Unified Stat Overview Header Label */}
            <div className="text-center text-[11px] font-extrabold text-direct uppercase tracking-wider mb-2.5">
              {t('dash.statOverview')}
            </div>

            <div className="flex flex-col items-center w-full gap-2 flex-1">
              {/* 1. Streak Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-22 h-22 card-game card-halo-orange flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md relative"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
                >
                  <StreakIllustration />
                </div>
                <span className="text-[8.5px] font-extrabold text-orange uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <Flame className="w-2.5 h-2.5 text-orange" /> {t('dash.streak')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{streak.currentStreak}</span>
                  <span className="text-[8.5px] text-body font-bold">day{streak.currentStreak !== 1 ? 's' : ''}</span>
                </div>
              </motion.div>

              {/* 2. Stars Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-22 h-22 card-game card-halo-gold flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md relative"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-yellow)', border: '1px solid var(--color-badge-border-yellow)' }}
                >
                  <StarsIllustration />
                </div>
                <span className="text-[8.5px] font-extrabold text-warning-deep uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <Star className="w-2.5 h-2.5 text-warning fill-warning" /> {t('dash.stars')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{totalStars}</span>
                  <span className="text-[8.5px] text-body font-bold">/ {LESSONS.length * 3}</span>
                </div>
              </motion.div>

              {/* 3. Lessons Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-22 h-22 card-game card-halo-purple flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md relative"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
                >
                  <LessonsIllustration />
                </div>
                <span className="text-[8.5px] font-extrabold text-violet uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <BookOpen className="w-2.5 h-2.5 text-violet" /> {t('dash.lessons')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{completedLessons}</span>
                  <span className="text-[8.5px] text-body font-bold">/ {LESSONS.length}</span>
                </div>
              </motion.div>

              {/* 4. Sessions Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-22 h-22 card-game card-halo-blue flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md relative"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-blue)', border: '1px solid var(--color-badge-border-blue)' }}
                >
                  <SessionsIllustration />
                </div>
                <span className="text-[8.5px] font-extrabold text-sky-blue uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-sky-blue" /> {t('dash.sessions')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{streak.totalSessions}</span>
                  <span className="text-[8.5px] text-body font-bold">total</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── High-Value SEO Content: Free Gamified Typing Tutor ─── */}
      <motion.div variants={itemVariants} className="mt-8">
        <HomeSEOContent />
      </motion.div>

      {/* ─── SEO-Optimized FAQ Section ─── */}
      <motion.div variants={itemVariants} className="mt-8">
        <TypingFAQ />
      </motion.div>

      {/* ─── Site Footer with Legal & Company Links ─── */}
      <motion.div variants={itemVariants} className="mt-12">
        <SiteFooter />
      </motion.div>

      {/* AI Tutor Report Modal (Lifetime Analysis) */}
      <AITutorReport
        sessionResult={null}
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        targetWpm={40}
        showReplayButtons={true}
      />
    </motion.div>
  );
};

export default DashboardPage;
