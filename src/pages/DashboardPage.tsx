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
import { FloatingControls } from '../components/navigation/FloatingControls';
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

export const DashboardPage: React.FC = () => {
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
      className="max-w-6xl mx-auto px-4 py-6 md:py-8"
    >
      {/* Glassmorphism wrapper for dashboard content */}
      <div className="glass-panel rounded-3xl p-5 md:p-7">
      {/* Dashboard Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Primary Content Area (Hero + Quick Actions + Analytics Row) */}
        <div className="flex-1 min-w-0 w-full flex flex-col">
          {/* 1. Hero / Welcome Banner */}
          <motion.div
            variants={itemVariants}
            className="card-game card-halo-orange relative p-6 flex items-center justify-between gap-5"
            style={{ marginBottom: '40px' }}
          >
            <div className="flex items-center gap-5 z-10">
              <Mascot mood={streak.currentStreak > 0 ? 'happy' : 'idle'} size="lg" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                  Hey there, typist! 👋
                </h1>
                <p className="text-body text-sm mt-1 font-semibold">
                  {streak.currentStreak > 0
                    ? `🔥 ${streak.currentStreak}-day streak! Keep it going!`
                    : 'Ready to build those typing muscles? Let\'s go!'}
                </p>
                <div className="mt-3">
                  <CoinCounter />
                </div>
              </div>
            </div>
            <WelcomeBannerIllustration className="hidden sm:flex" />
          </motion.div>

          {/* Quick Actions (3 Cards) */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            style={{ marginBottom: '32px' }}
          >
            {/* Continue Learning Card */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundEngine.playPop(); navigate(nextLesson ? `/learn/${nextLesson.id}` : '/learn'); }}
              className="card-game card-halo-green relative flex items-center gap-3 p-5 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-badge-bg-emerald)', border: '1px solid var(--color-badge-border-emerald)' }}
              >📚</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-ink">Continue Learning</h3>
                <p className="text-[10px] text-body font-semibold truncate">
                  {nextLesson ? `Station ${nextLesson.id}: ${nextLesson.title}` : 'All done! 🎉'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              {/* Watermark illustration */}
              <div className="absolute -bottom-2 -right-2 w-14 h-14 opacity-[0.12] pointer-events-none">
                <ContinueLearningIllustration />
              </div>
            </motion.button>

            {/* Play Game Card */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundEngine.playPop(); navigate('/play'); }}
              className="card-game card-halo-pink relative flex items-center gap-3 p-5 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-badge-bg-pink)', border: '1px solid var(--color-badge-border-pink)' }}
              >🚀</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-ink">Play Game</h3>
                <p className="text-[10px] text-body font-semibold truncate">Stellar Dash runner</p>
              </div>
              <ArrowRight className="w-4 h-4 text-highlight-pink shrink-0" />
              {/* Watermark illustration */}
              <div className="absolute -bottom-2 -right-2 w-14 h-14 opacity-[0.12] pointer-events-none">
                <PlayGameIllustration />
              </div>
            </motion.button>

            {/* Quick Practice Card */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundEngine.playPop(); navigate('/practice'); }}
              className="card-game card-halo-orange relative flex items-center gap-3 p-5 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
              >⌨️</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-ink">Quick Practice</h3>
                <p className="text-[10px] text-body font-semibold truncate">Free typing speed test</p>
              </div>
              <ArrowRight className="w-4 h-4 text-orange shrink-0" />
              {/* Watermark illustration */}
              <div className="absolute -bottom-2 -right-2 w-14 h-14 opacity-[0.12] pointer-events-none">
                <QuickPracticeIllustration />
              </div>
            </motion.button>

            {/* AI Tutor Card */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundEngine.playPop(); setTutorOpen(true); }}
              className="card-game card-halo-purple relative flex items-center gap-3 p-5 text-left cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
              >🤖</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-ink">AI Tutor</h3>
                <p className="text-[10px] text-body font-semibold truncate">Diagnose weak spots</p>
              </div>
              <Brain className="w-4 h-4 text-violet shrink-0" />
            </motion.button>
          </motion.div>

          {/* Bottom Analytics Row: Recent Sessions (Left) & Weak-Key Analysis (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Recent Sessions Card */}
            <motion.div variants={itemVariants} className="card-game card-halo-gold p-5 pb-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-warning" />
                  <h3 className="text-sm font-extrabold text-ink">Recent Sessions</h3>
                </div>

                {recentSessions.length > 0 ? (
                  <div className="space-y-2">
                    {recentSessions.map((session, i) => (
                      <div key={session.id || i} className="flex items-center justify-between py-2 border-b border-hairline/50 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 flex items-center justify-center bg-canvas-soft-2 rounded-xl text-xs">
                            {session.mode === 'lesson' ? '📖' : session.mode === 'game' ? '🎮' : '⌨️'}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-ink">{session.modeDetail}</span>
                            <span className="text-[10px] text-mute font-semibold block">
                              {new Date(session.startTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-primary">{session.wpm} WPM</span>
                          <span className="text-[10px] text-body font-bold block">{session.accuracy.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-body font-semibold">
                      No sessions yet. Start a lesson to see your stats!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Weak Key Panel */}
            <motion.div variants={itemVariants}>
              <WeakKeyPanel
                onStartMission={(content, targetKeys) => {
                  navigate('/practice', { state: { missionContent: content, missionKeys: targetKeys } });
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar: Aligned Header Block (Sound -> Theme -> STAT OVERVIEW) + 4 Compact Stat Circles */}
        <motion.div variants={itemVariants} className="w-full lg:w-36 shrink-0 flex flex-col items-center pt-0 pb-1 self-stretch">
          {/* Desktop Header Block: Sound + Theme in a compact top-bar row → STAT OVERVIEW Label */}
          <div className="hidden lg:flex flex-col items-center gap-2 mb-2">
            <FloatingControls className="flex flex-row items-center gap-3" showLabel={false} />
            <div className="text-center text-[11px] font-extrabold text-direct uppercase tracking-wider">
              Stat Overview
            </div>
          </div>

          {/* Mobile Fallback Label (< lg) */}
          <div className="lg:hidden text-center text-[11px] font-extrabold text-direct uppercase tracking-wider mb-2">
            Stat Overview
          </div>

          <div className="flex flex-col items-center w-full gap-2.5 flex-1">
            {/* 1. Streak Circle Card */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '50%' }}
              className="w-26 h-26 card-game card-halo-orange flex flex-col items-center justify-center p-2 text-center overflow-hidden shrink-0 shadow-md relative"
            >
              <div className="w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
              >
                <StreakIllustration />
              </div>
              <span className="text-[9px] font-extrabold text-orange uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                <Flame className="w-2.5 h-2.5 text-orange" /> Streak
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-ink leading-none">{streak.currentStreak}</span>
                <span className="text-[9px] text-body font-bold">day{streak.currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>

            {/* 2. Stars Circle Card */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '50%' }}
              className="w-26 h-26 card-game card-halo-gold flex flex-col items-center justify-center p-2 text-center overflow-hidden shrink-0 shadow-md relative"
            >
              <div className="w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                style={{ background: 'var(--color-badge-bg-yellow)', border: '1px solid var(--color-badge-border-yellow)' }}
              >
                <StarsIllustration />
              </div>
              <span className="text-[9px] font-extrabold text-warning-deep uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                <Star className="w-2.5 h-2.5 text-warning fill-warning" /> Stars
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-ink leading-none">{totalStars}</span>
                <span className="text-[9px] text-body font-bold">/ {LESSONS.length * 3}</span>
              </div>
            </motion.div>

            {/* 3. Lessons Circle Card */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '50%' }}
              className="w-26 h-26 card-game card-halo-purple flex flex-col items-center justify-center p-2 text-center overflow-hidden shrink-0 shadow-md relative"
            >
              <div className="w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
              >
                <LessonsIllustration />
              </div>
              <span className="text-[9px] font-extrabold text-violet uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                <BookOpen className="w-2.5 h-2.5 text-violet" /> Lessons
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-ink leading-none">{completedLessons}</span>
                <span className="text-[9px] text-body font-bold">/ {LESSONS.length}</span>
              </div>
            </motion.div>

            {/* 4. Sessions Circle Card */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '50%' }}
              className="w-26 h-26 card-game card-halo-blue flex flex-col items-center justify-center p-2 text-center overflow-hidden shrink-0 shadow-lg relative"
            >
              <div className="w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                style={{ background: 'var(--color-badge-bg-blue)', border: '1px solid var(--color-badge-border-blue)' }}
              >
                <SessionsIllustration />
              </div>
              <span className="text-[9px] font-extrabold text-sky-blue uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                <TrendingUp className="w-2.5 h-2.5 text-sky-blue" /> Sessions
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-ink leading-none">{streak.totalSessions}</span>
                <span className="text-[9px] text-body font-bold">total</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>

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
