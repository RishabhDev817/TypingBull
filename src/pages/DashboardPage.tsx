import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, BookOpen, ArrowRight, Trophy, TrendingUp, Save, School, Timer, Gamepad2, Keyboard, Bot } from 'lucide-react';
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
} from '../components/patterns/CardWatermarks';
import { TypingFAQ } from '../components/TypingFAQ';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { FloatingControls } from '../components/navigation/FloatingControls';
import { useI18n } from '../context/I18nContext';
import { HomeSEOContent } from '../components/HomeSEOContent';
import { usePageSEO } from '../hooks/usePageSEO';
import { drillableKeys } from '../engine/keyLabels';
import { ProgressBackup } from '../components/ProgressBackup';

const FIRST_TEST_CTA: Record<string, string> = {
  en: 'Take a 60-second test',
  es: 'Haz una prueba de 60 s',
  ja: '60秒テストに挑戦',
  fr: 'Faire un test de 60 s',
  de: '60-Sekunden-Test starten',
  pt: 'Fazer um teste de 60 s',
  ko: '60초 테스트 시작',
  it: 'Fai un test di 60 s',
  hi: '60 सेकंड का टेस्ट दें',
};

type Copy = Record<string, string>;
const START_LESSON: Copy = {
  en: 'Start Lesson 1', es: 'Empezar la lección 1', ja: 'レッスン1を始める', fr: 'Commencer la leçon 1', de: 'Lektion 1 starten',
  pt: 'Começar a lição 1', ko: '레슨 1 시작', it: 'Inizia la lezione 1', hi: 'पाठ 1 शुरू करें',
};
const START_HINT: Copy = {
  en: 'About 3 minutes. No sign-up needed.', es: 'Unos 3 minutos. Sin registro.', ja: '約3分。登録は不要です。', fr: 'Environ 3 minutes. Sans inscription.',
  de: 'Etwa 3 Minuten. Ohne Anmeldung.', pt: 'Cerca de 3 minutos. Sem cadastro.', ko: '약 3분. 가입이 필요 없습니다.', it: 'Circa 3 minuti. Senza registrazione.',
  hi: 'लगभग 3 मिनट। साइन-अप की ज़रूरत नहीं।',
};
const CONTINUE_LESSON: Copy = {
  en: 'Continue where you left off', es: 'Continúa donde lo dejaste', ja: '続きから再開', fr: 'Reprendre là où vous en étiez', de: 'Dort weitermachen, wo du warst',
  pt: 'Continue de onde parou', ko: '이어서 학습하기', it: 'Riprendi da dove eri rimasto', hi: 'जहाँ छोड़ा था वहीं से जारी रखें',
};
const CLASSROOM_CARD: Record<string, { title: string; body: string; create: string; join: string }> = {
  en: { title: 'Teaching a class?', body: 'Run a live typing lesson or race with a 6-character code. Students need no account.', create: 'Create a classroom', join: 'Join with a code' },
  es: { title: '¿Das clase?', body: 'Dirige una lección o carrera en vivo con un código de 6 caracteres. Los alumnos no necesitan cuenta.', create: 'Crear un aula', join: 'Unirse con un código' },
  ja: { title: '授業で使いますか？', body: '6文字のコードでライブのタイピング授業やレースを開始。生徒のアカウントは不要です。', create: 'クラスを作成', join: 'コードで参加' },
  fr: { title: 'Vous enseignez ?', body: 'Lancez une leçon ou une course en direct avec un code à 6 caractères. Les élèves n’ont pas besoin de compte.', create: 'Créer une classe', join: 'Rejoindre avec un code' },
  de: { title: 'Du unterrichtest?', body: 'Starte eine Live-Lektion oder ein Rennen mit einem 6-stelligen Code. Schüler brauchen kein Konto.', create: 'Klasse erstellen', join: 'Mit Code beitreten' },
  pt: { title: 'Você ensina uma turma?', body: 'Inicie uma aula ou corrida ao vivo com um código de 6 caracteres. Os alunos não precisam de conta.', create: 'Criar uma sala', join: 'Entrar com um código' },
  ko: { title: '수업에 사용하시나요?', body: '6자리 코드로 실시간 타자 수업이나 레이스를 시작하세요. 학생 계정이 필요 없습니다.', create: '교실 만들기', join: '코드로 참여' },
  it: { title: 'Insegni a una classe?', body: 'Avvia una lezione o una gara dal vivo con un codice di 6 caratteri. Gli studenti non hanno bisogno di un account.', create: 'Crea una classe', join: 'Entra con un codice' },
  hi: { title: 'क्या आप कक्षा पढ़ाते हैं?', body: '6 अक्षरों के कोड से लाइव टाइपिंग पाठ या रेस शुरू करें। छात्रों को खाता नहीं चाहिए।', create: 'क्लासरूम बनाएँ', join: 'कोड से जुड़ें' },
};

export const DashboardPage: React.FC = () => {
  const { currentLang, t } = useI18n();
  usePageSEO(currentLang);
  const navigate = useNavigate();
  const sessions = getSessions();
  const streak = getStreakData();
  const totalStars = getTotalStars();
  const completedLessons = getCompletedLessonCount();
  const recentSessions = sessions.slice(0, 4);
  // Panels that need history only appear once there is some, so a first visit is not a wall of empty boxes
  const hasHistory = sessions.length > 0;
  const showWeakKeys = sessions.length >= 5;
  const [tutorOpen, setTutorOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const nextLesson = LESSONS.find(l => isLessonUnlocked(l.id) && !sessions.some(s => s.modeDetail === `lesson-${l.id}` && s.accuracy >= l.passingAccuracy));
  const isNewLearner = completedLessons === 0 && sessions.length === 0;
  const lang = currentLang in START_LESSON ? currentLang : 'en';
  const heroTarget = nextLesson ? `/learn/${nextLesson.id}` : '/learn';
  const classroomCopy = CLASSROOM_CARD[currentLang] || CLASSROOM_CARD.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15, staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 26 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
    >

      {/* Glassmorphism wrapper for dashboard content */}
      <div className="glass-panel rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-[calc(100vh-8rem)] min-h-[calc(100dvh-8rem)]">
        {/* Dashboard Main 2-Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-stretch flex-1">
          {/* Left Primary Content Area (Hero + Quick Actions + Analytics Row) */}
          <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
            {/* 1. Hero / Welcome Banner */}
            <motion.div
              variants={itemVariants}
              className="card-game card-halo-orange relative p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3.5 min-w-0"
            >
              <div className="flex items-center gap-4 z-10 min-w-0">
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
              {/* The one primary action: start (new learners) or continue (returning learners) */}
              <div className="z-10 flex flex-col items-stretch sm:items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => { soundEngine.playPop(); navigate(heroTarget); }}
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-base font-black text-balance leading-tight shadow-lg cursor-pointer hover:brightness-110 active:scale-[0.98] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  {isNewLearner ? START_LESSON[lang] : CONTINUE_LESSON[lang]}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <span className="text-xs text-body font-semibold text-center sm:text-right">
                  {isNewLearner
                    ? START_HINT[lang]
                    : nextLesson ? `${t('dash.station')} ${nextLesson.id}: ${nextLesson.title}` : t('dash.allDone')}
                </span>
              </div>
              <WelcomeBannerIllustration className="hidden 2xl:flex" />
            </motion.div>

            {/* 2. Quick Actions (4 Cards) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 mb-3.5 items-stretch"
            >
              {/* Typing Test Card (the hero button already covers "continue learning") */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); navigate('/typing-test'); }}
                className="card-game card-halo-green relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-badge-bg-emerald)', border: '1px solid var(--color-badge-border-emerald)' }}
                aria-hidden="true"
                ><Timer className="w-[18px] h-[18px] text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-ink leading-tight">{t('nav.typingTest')}</h3>
                  <p className="text-xs text-body font-semibold leading-snug mt-0.5">{t('dash.freeTypingTest')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
              </motion.button>

              {/* Play Multiplayer Card with Floating Cloud Notification */}
              <div className="relative h-full flex flex-col">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { soundEngine.playPop(); navigate('/play'); }}
                  className="card-game card-halo-pink relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full w-full"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-badge-bg-pink)', border: '1px solid var(--color-badge-border-pink)' }}
                  aria-hidden="true"
                  ><Gamepad2 className="w-[18px] h-[18px] text-highlight-pink" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-ink leading-tight">{t('dash.playGame')}</h3>
                      <span className="px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-full bg-emerald-500 text-slate-950 dark:text-slate-950 leading-none">
                        LIVE
                      </span>
                      <span className="px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white leading-none">
                        NEW
                      </span>
                    </div>
                    <p className="text-xs text-body font-semibold leading-snug mt-0.5">Race real typists live</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-highlight-pink shrink-0" />
                </motion.button>
              </div>

              {/* Quick Practice Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); navigate('/practice'); }}
                className="card-game card-halo-orange relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
                aria-hidden="true"
                ><Keyboard className="w-[18px] h-[18px] text-orange" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-ink leading-tight">{t('dash.quickPractice')}</h3>
                  <p className="text-xs text-body font-semibold leading-snug mt-0.5">{t('dash.timedLevels')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-orange shrink-0" />
              </motion.button>

              {/* AI Tutor Card */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { soundEngine.playPop(); setTutorOpen(true); }}
                className="card-game card-halo-purple relative flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer h-full"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
                aria-hidden="true"
                ><Bot className="w-[18px] h-[18px] text-violet" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-ink leading-tight">{t('dash.aiTutor')}</h3>
                  <p className="text-xs text-body font-semibold leading-snug mt-0.5">{t('dash.diagnoseWeak')}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-violet shrink-0" />
              </motion.button>
            </motion.div>

            {/* 3. Bottom Analytics Row: Recent Sessions (Left) & Weak-Key Analysis (Right) */}
            <div className={`grid grid-cols-1 ${showWeakKeys ? 'md:grid-cols-2' : ''} gap-4 sm:gap-6 items-stretch flex-1 min-h-[240px] mb-3.5`}>
              {/* Recent Sessions Card */}
              <motion.div variants={itemVariants} className="card-game card-halo-gold p-4 sm:p-5 flex flex-col justify-between h-full flex-1 min-h-[220px]">
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-2 mb-2 shrink-0">
                    <Trophy className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-extrabold text-ink">{t('dash.recentSessions')}</h3>
                  </div>

                  {recentSessions.length > 0 ? (
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[140px]">
                      {recentSessions.map((session, i) => (
                        <div key={session.id || i} className="flex items-center justify-between py-1.5 border-b border-hairline/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center bg-canvas-soft-2 rounded-lg text-xs shrink-0">
                              {session.mode === 'lesson' ? '📖' : session.mode === 'game' ? '🎮' : '⌨️'}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-ink block truncate">{session.modeDetail}</span>
                              <span className="text-[11px] text-body font-semibold block leading-none">
                                {new Date(session.startTime).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-xs font-extrabold text-primary block leading-none">{session.wpm} WPM</span>
                            <span className="text-[11px] text-body font-bold block leading-tight mt-0.5">{session.accuracy.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4 text-center">
                      <p className="text-sm text-body font-semibold">
                        {t('dash.noSessions')}
                      </p>
                      <button
                        type="button"
                        onClick={() => { soundEngine.playPop(); navigate('/practice'); }}
                        className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm font-black shadow-lg cursor-pointer hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {FIRST_TEST_CTA[currentLang] || FIRST_TEST_CTA.en}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weak Key Panel: only once there is enough history to say something useful */}
              {showWeakKeys && (
              <motion.div variants={itemVariants} className="h-full flex-1 flex flex-col">
                <WeakKeyPanel
                  onStartMission={(content, targetKeys, allWeakKeys) => {
                    // The mission opens the typing test as a key drill for the weak letters; punctuation-only
                    // weak spots go to Practice, whose passages contain punctuation.
                    void content;
                    const letters = drillableKeys([...targetKeys, ...allWeakKeys]);
                    if (letters.length > 0) navigate('/typing-test', { state: { drillKeys: letters, seconds: 180 } });
                    else navigate('/practice');
                  }}
                />
              </motion.div>
              )}
            </div>

            {/* 2b. Classroom: the feature teachers come for */}
            <motion.div
              variants={itemVariants}
              className="card-game card-halo-blue relative px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-badge-bg-blue)', border: '1px solid var(--color-badge-border-blue)' }}
                  aria-hidden="true"
                >
                  <School className="w-5 h-5 text-sky-blue" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold text-ink leading-tight">{classroomCopy.title}</h2>
                  <p className="text-xs text-body font-semibold leading-snug mt-0.5">{classroomCopy.body}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { soundEngine.playPop(); navigate('/classroom/create'); }}
                  className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full bg-sky-500 text-slate-950 text-sm font-black cursor-pointer hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  <School className="w-4 h-4" /> {classroomCopy.create}
                </button>
                <button
                  type="button"
                  onClick={() => { soundEngine.playPop(); navigate('/classroom/join'); }}
                  className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full border border-hairline-strong text-ink text-sm font-extrabold cursor-pointer hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  {classroomCopy.join}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar: Clean Stat Overview Rail */}
          <motion.div variants={itemVariants} className="w-full xl:w-48 shrink-0 flex flex-col items-center pt-0 pb-1 self-stretch justify-between relative z-30">
            {/* Glassmorphic Utility Pill in column header flow */}
            <div className="mb-4 flex justify-center relative z-[100]">
              <FloatingControls showLabel={false} showLanguageSwitcher={true} />
            </div>

            {hasHistory ? (
              <>
            {/* Unified Stat Overview Header Label */}
            <div className="text-center text-[13px] font-black text-direct uppercase tracking-widest mt-1 mb-3.5">
              {t('dash.statOverview')}
            </div>

            <div className="flex flex-row flex-wrap xl:flex-col items-center justify-around w-full gap-3 flex-1 relative z-10">
              {/* 1. Streak Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-24 h-24 card-game card-halo-orange flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
                >
                  <StreakIllustration />
                </div>
                <span className="text-[10.5px] font-extrabold text-orange uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <Flame className="w-2.5 h-2.5 text-orange" /> {t('dash.streak')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{streak.currentStreak}</span>
                  <span className="text-[11px] text-body font-bold">day{streak.currentStreak !== 1 ? 's' : ''}</span>
                </div>
              </motion.div>

              {/* 2. Stars Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-24 h-24 card-game card-halo-gold flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-yellow)', border: '1px solid var(--color-badge-border-yellow)' }}
                >
                  <StarsIllustration />
                </div>
                <span className="text-[10.5px] font-extrabold text-warning-deep uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <Star className="w-2.5 h-2.5 text-warning fill-warning" /> {t('dash.stars')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{totalStars}</span>
                  {totalStars > 0 && <span className="text-[11px] text-body font-bold">/ {LESSONS.length * 3}</span>}
                </div>
              </motion.div>

              {/* 3. Lessons Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-24 h-24 card-game card-halo-purple flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-purple)', border: '1px solid var(--color-badge-border-purple)' }}
                >
                  <LessonsIllustration />
                </div>
                <span className="text-[10.5px] font-extrabold text-violet uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <BookOpen className="w-2.5 h-2.5 text-violet" /> {t('dash.lessons')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{completedLessons}</span>
                  {completedLessons > 0 && <span className="text-[11px] text-body font-bold">/ {LESSONS.length}</span>}
                </div>
              </motion.div>

              {/* 4. Sessions Circle Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: '50%' }}
                className="w-24 h-24 card-game card-halo-blue flex flex-col items-center justify-center p-1.5 text-center overflow-hidden shrink-0 shadow-md"
              >
                <div className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center overflow-hidden mb-0.5"
                  style={{ background: 'var(--color-badge-bg-blue)', border: '1px solid var(--color-badge-border-blue)' }}
                >
                  <SessionsIllustration />
                </div>
                <span className="text-[10.5px] font-extrabold text-sky-blue uppercase tracking-wider flex items-center gap-0.5 leading-none mb-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-sky-blue" /> {t('dash.sessions')}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-extrabold text-ink leading-none">{streak.totalSessions}</span>
                  <span className="text-[11px] text-body font-bold">total</span>
                </div>
              </motion.div>
            </div>
              </>
            ) : (
              <p className="text-center text-xs font-bold text-body px-2 mt-2 flex-1">
                Your streak, stars and lessons will show up here after your first session.
              </p>
            )}

            <button
              type="button"
              onClick={() => { soundEngine.playPop(); setBackupOpen(true); }}
              className="mt-4 xl:mb-16 min-h-11 px-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-hairline text-[12px] font-extrabold text-body hover:text-ink hover:bg-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              title="Save your progress as a code, or restore it on this device"
            >
              <Save className="w-3.5 h-3.5" /> Save / restore progress
            </button>
          </motion.div>
        </div>
      </div>

      {/* ─── High-Value SEO Content: Free Gamified Typing Tutor ─── */}
      <motion.div variants={itemVariants} className="mt-12 max-w-6xl mx-auto w-full">
        <HomeSEOContent />
      </motion.div>

      {/* ─── SEO-Optimized FAQ Section ─── */}
      <motion.div variants={itemVariants} className="mt-10 max-w-6xl mx-auto w-full">
        <TypingFAQ />
      </motion.div>

      {/* ─── Site Footer with Legal & Company Links ─── */}
      <motion.div variants={itemVariants} className="mt-14 max-w-6xl mx-auto w-full">
        <SiteFooter />
      </motion.div>

      <ProgressBackup open={backupOpen} onClose={() => setBackupOpen(false)} />

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
