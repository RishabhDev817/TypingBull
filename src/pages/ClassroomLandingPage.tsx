import { TOTAL_LESSONS } from '../data/lessons/index';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Monitor,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
  Zap,
  Share2,
  KeyRound,
  PlayCircle,
  Trophy,
  Play,
  Flame,
  School,
  X,
  Volume2,
  VolumeX,
  Pause,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { soundEngine } from '../utils/audio';
import { LESSONS } from '../data/lessonData';
import { useI18n } from '../context/I18nContext';
import { CLASSROOM_LANDING_A } from '../i18n/classroomLandingAI18n';
import { CLASSROOM_LANDING_B } from '../i18n/classroomLandingBI18n';
import { CLASSROOM_SESSION, LESSON_TYPE_KEYS } from '../i18n/classroomSessionI18n';
import { fill } from '../i18n/classroomEntryI18n';

interface Props {
  onCreateClassroom: () => void;
  onJoinClassroom: () => void;
}

export const ClassroomLandingPage: React.FC<Props> = ({
  onCreateClassroom,
  onJoinClassroom,
}) => {
  const { currentLang } = useI18n();
  const la = CLASSROOM_LANDING_A[currentLang] ?? CLASSROOM_LANDING_A.en;
  const lb = CLASSROOM_LANDING_B[currentLang] ?? CLASSROOM_LANDING_B.en;
  const ss = CLASSROOM_SESSION[currentLang] ?? CLASSROOM_SESSION.en;
  // FAQ accordion state
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set(['faq-1']));

  // Interactive 3-Step Guide Tabs in Hero Showcase (1, 2, or 3)
  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3>(1);

  // Interactive 60-Second Video Tutorial Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [tutorialTab, setTutorialTab] = useState<'recording' | 'interactive'>('recording');

  // Interactive Video Player Simulator state
  const [videoPlayState, setVideoPlayState] = useState<{
    isPlaying: boolean;
    currentChapter: 1 | 2 | 3 | 4;
    progress: number;
    isMuted: boolean;
  }>({
    isPlaying: true,
    currentChapter: 1,
    progress: 15,
    isMuted: false,
  });

  // Ticking progress for video simulation modal
  useEffect(() => {
    if (!isVideoModalOpen || !videoPlayState.isPlaying) return;
    const interval = setInterval(() => {
      setVideoPlayState((prev) => {
        const nextProgress = (prev.progress + 1.2) % 100;
        let chapter: 1 | 2 | 3 | 4 = 1;
        if (nextProgress < 25) chapter = 1;
        else if (nextProgress < 50) chapter = 2;
        else if (nextProgress < 80) chapter = 3;
        else chapter = 4;
        return {
          ...prev,
          progress: nextProgress,
          currentChapter: chapter,
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isVideoModalOpen, videoPlayState.isPlaying]);

  const toggleFaq = (id: string) => {
    soundEngine.playPop();
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreate = () => {
    soundEngine.playPop();
    onCreateClassroom();
  };

  const handleJoin = () => {
    soundEngine.playPop();
    onJoinClassroom();
  };

  const handleOpenVideoGuide = () => {
    soundEngine.playPop();
    setVideoPlayState((prev) => ({ ...prev, isPlaying: true, progress: 12, currentChapter: 1 }));
    setIsVideoModalOpen(true);
  };

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `faq-${n}`,
    question: lb[`faq${n}q` as keyof typeof lb],
    answer: lb[`faq${n}a` as keyof typeof lb],
  }));

  return (
    <div className="w-full min-h-screen py-3 sm:py-4 px-3 sm:px-6 lg:px-8 select-none flex flex-col">
      {/* ─── 1. FULL-SCREEN IMMERSIVE CANVAS HERO CONTAINER ─── */}
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center relative mb-14 sm:mb-20">
        {/* Main Classroom Card Container: Expands to full viewport width & height */}
        <div className="w-full flex-1 flex flex-col justify-center my-auto py-2 sm:py-3">
          <section className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl flex flex-col justify-center">
            {/* Animated Ambient Gradient Glows (Brand Hues: Warm Amber/Orange, Mint Green, Electric Sky Blue) */}
            <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/25 via-orange-500/20 to-transparent dark:from-amber-500/20 dark:via-orange-600/15 blur-3xl pointer-events-none -z-10 animate-pulse" />
            <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-500/20 to-transparent dark:from-emerald-500/20 dark:via-teal-600/15 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-24 left-1/3 w-[32rem] h-80 rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-500/20 to-transparent dark:from-sky-500/20 dark:via-blue-600/15 blur-3xl pointer-events-none -z-10" />

            {/* Tactile Watermark SVG Background Pattern */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] dark:opacity-[0.07] z-0"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern id="classroom-hero-pattern" width="90" height="90" patternUnits="userSpaceOnUse">
                  <rect x="12" y="10" width="24" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M19 17h10 M19 22h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="24" cy="27" r="1" fill="currentColor" />
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                  <circle cx="45" cy="45" r="1" fill="currentColor" />
                  <rect x="52" y="48" width="28" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M66 66v5 M60 71h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M22 62 l14 -7 l14 7 l-14 7 z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M26 64 v8 c0 3 4.5 5 10 5 s10 -2 10 -5 v-8" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="68" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M66 24h4 M68 12v-2 M76 18h2 M60 18h-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#classroom-hero-pattern)" />
            </svg>

            {/* 2-Column Responsive Content Grid */}
            <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* ─── LEFT COLUMN: HIGH-IMPACT TYPOGRAPHY & ACTIONS ─── */}
              <div className="xl:col-span-6 2xl:col-span-7 flex flex-col items-start text-left">
                {/* Micro-Pill Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-teal-500/15 border border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
                  <span className="text-amber-500">⚡</span>
                  <span>{la.pill}</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                {/* Main Headline (Multi-stop gradient text) */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold tracking-tight leading-[1.12] mb-4 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 bg-clip-text text-transparent">
                  {la.h1}
                </h1>

                {/* Sub-Heading & Feature Copy */}
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-semibold leading-relaxed mb-8 max-w-2xl">
                  {la.heroSub}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  {/* Primary Action: Create a Classroom */}
                  <button
                    type="button"
                    id="hero-create-classroom-btn"
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/30 rounded-2xl py-4 px-7 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 text-base cursor-pointer"
                  >
                    <School className="w-5 h-5" />
                    <span>{la.createBtn}</span>
                  </button>

                  {/* Secondary Action: Join via Room Code */}
                  <button
                    type="button"
                    id="hero-join-classroom-btn"
                    onClick={handleJoin}
                    className="border-2 border-orange-400/80 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold rounded-2xl py-4 px-7 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 text-base cursor-pointer backdrop-blur-md"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>{la.joinBtn}</span>
                  </button>
                </div>

                {/* Feature Checkmarks at Bottom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{la.check1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{la.check2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{la.check3}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{la.check4}</span>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT COLUMN: INTERACTIVE VIDEO TUTORIAL & QUICK-START CARD ─── */}
              <div className="xl:col-span-6 2xl:col-span-5 flex flex-col justify-center w-full">
                <div className="w-full rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xl relative backdrop-blur-xl">
                  {/* Floating Micro-Badge Toast Pill */}
                  <div className="absolute -top-3.5 right-6 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[11px] shadow-lg shadow-orange-500/25 border border-white/20">
                    <Flame className="w-3.5 h-3.5 text-amber-100 animate-bounce" />
                    <span>{la.freeBadge}</span>
                  </div>

                  {/* Video Player Interface Mockup */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200/80 dark:border-slate-700/80 bg-slate-950 shadow-xl group mb-5">
                    {/* Top Bar Badges on Player */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>{la.tutorialPreview}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 text-[11px] font-mono font-bold shadow-sm">
                        <span>⏱️ 1:15 Mins</span>
                      </span>
                    </div>

                    {/* Stylized Animated Thumbnail Screen (Changes with activeStepTab) */}
                    <div className="w-full aspect-[16/9] relative flex items-center justify-center overflow-hidden bg-slate-900">
                      {/* Background Ambient Radial Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950" />
                      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl" />
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-500/20 blur-2xl" />

                      {/* Scene 1: Step 1 Mockup */}
                      {activeStepTab === 1 && (
                        <motion.div
                          key="step1-preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 pt-12 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/80">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🏫</span>
                              <div>
                                <div className="text-[11px] font-black text-white">Lab Room 102</div>
                                <div className="text-[10.5px] text-slate-400">Teacher: Mrs. Harper</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10.5px] font-black text-emerald-400 uppercase">1-Click Room</div>
                              <div className="font-mono text-sm font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                                TB-4821
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center my-auto">
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                              <span className="text-base block mb-0.5">🐂</span>
                              <span className="text-[11px] font-extrabold text-white block truncate">Alex M.</span>
                              <span className="text-[10.5px] font-bold text-emerald-400">Connected ✓</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                              <span className="text-base block mb-0.5">🐼</span>
                              <span className="text-[11px] font-extrabold text-white block truncate">Maya S.</span>
                              <span className="text-[10.5px] font-bold text-emerald-400">Connected ✓</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                              <span className="text-base block mb-0.5">🦊</span>
                              <span className="text-[11px] font-extrabold text-white block truncate">Liam T.</span>
                              <span className="text-[10.5px] font-bold text-emerald-400">Connected ✓</span>
                            </div>
                          </div>

                          <div className="text-center text-[11px] text-slate-400 font-semibold bg-slate-900/60 py-1 rounded-lg">
                            Teachers launch room • Students join with 6-letter code
                          </div>
                        </motion.div>
                      )}

                      {/* Scene 2: Step 2 Mockup */}
                      {activeStepTab === 2 && (
                        <motion.div
                          key="step2-preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 pt-12 flex flex-col justify-between"
                        >
                          <div className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📚</span>
                              <div>
                                <div className="text-[11px] font-black text-white">Morning in the Valley</div>
                                <div className="text-[10.5px] text-teal-300">Curriculum Grade 6 • 120 Words</div>
                              </div>
                            </div>
                            <span className="text-[10.5px] font-black uppercase px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700">
                              Selected Drill
                            </span>
                          </div>

                          <div className="space-y-1.5 my-auto bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[10.5px] font-mono text-slate-300 leading-relaxed">
                            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded">The early mist curled</span>
                            {' '}over the golden hills as students tuned their fingers...
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span>🎯 Target: 35+ WPM</span>
                            <span className="text-amber-400 font-bold">⚡ Zero-Error Challenge</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Scene 3: Step 3 Mockup */}
                      {activeStepTab === 3 && (
                        <motion.div
                          key="step3-preview"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-4 pt-12 flex flex-col justify-between"
                        >
                          <div className="space-y-2 my-auto">
                            {/* Racer 1 */}
                            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                              <span className="text-sm">🐂</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-[11px] font-black text-white mb-1">
                                  <span>Alex M. (Lead)</span>
                                  <span className="text-emerald-400 font-mono">52 WPM • 99%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full w-[88%]" />
                                </div>
                              </div>
                            </div>

                            {/* Racer 2 */}
                            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                              <span className="text-sm">🐼</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-[11px] font-black text-white mb-1">
                                  <span>Maya S.</span>
                                  <span className="text-sky-400 font-mono">46 WPM • 98%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-sky-400 to-blue-300 rounded-full w-[76%]" />
                                </div>
                              </div>
                            </div>

                            {/* Racer 3 */}
                            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                              <span className="text-sm">🦊</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-[11px] font-black text-white mb-1">
                                  <span>Liam T.</span>
                                  <span className="text-amber-400 font-mono">44 WPM • 100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-[72%]" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold bg-slate-900/80 px-3 py-1 rounded-lg">
                            <span>● Live Race Telemetry</span>
                            <span className="text-amber-300">🏆 Real-time Podium Sync</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Central Frosted "Watch 60s Guide" Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/25 backdrop-blur-[2px] group-hover:bg-black/15 transition-all">
                        <button
                          type="button"
                          onClick={handleOpenVideoGuide}
                          className="group/btn flex flex-col items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/25 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/20 text-white shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          aria-label={la.watchAttr}
                        >
                          <div className="relative">
                            <span className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 group-hover/btn:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="text-xs font-black tracking-wide text-white drop-shadow-md">
                            {la.watch}
                          </span>
                        </button>
                      </div>

                      {/* Bottom Player Bar Mockup */}
                      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-950/90 to-transparent flex items-center px-4 justify-between text-slate-400 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          <span>0:42 / 1:15</span>
                        </div>
                        <div className="h-1 flex-1 mx-4 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[55%]" />
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive 3-Step Guide Tabs */}
                  <div className="space-y-2">
                    {/* Tab 1 */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setActiveStepTab(1);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        activeStepTab === 1
                          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/80 dark:border-teal-400/80 shadow-sm'
                          : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          activeStepTab === 1
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        01
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 dark:text-white mb-0.5 flex items-center justify-between">
                          <span>{la.step1Title}</span>
                          {activeStepTab === 1 && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{la.activePreview}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium">
                          {la.spinUp}
                        </p>
                      </div>
                    </button>

                    {/* Tab 2 */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setActiveStepTab(2);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        activeStepTab === 2
                          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/80 dark:border-teal-400/80 shadow-sm'
                          : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          activeStepTab === 2
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        02
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 dark:text-white mb-0.5 flex items-center justify-between">
                          <span>{la.step2Title}</span>
                          {activeStepTab === 2 && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{la.activePreview}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium">
                          {la.step2Body}
                        </p>
                      </div>
                    </button>

                    {/* Tab 3 */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setActiveStepTab(3);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        activeStepTab === 3
                          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/80 dark:border-teal-400/80 shadow-sm'
                          : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          activeStepTab === 3
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        03
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 dark:text-white mb-0.5 flex items-center justify-between">
                          <span>{la.step3Title}</span>
                          {activeStepTab === 3 && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{la.activePreview}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium">
                          {la.step3Body}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Centered Animated Scroll Indicator */}
        <a
          href="#what-is-classroom"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('what-is-classroom')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer py-2 mt-auto"
          aria-label={la.scrollAttr}
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">
            {la.explore}
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white/85 dark:bg-slate-800/85 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </a>
      </div>

      {/* ─── INTERACTIVE 60S TUTORIAL VIDEO WALKTHROUGH MODAL ─── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col text-white relative"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      {la.videoTitle}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {la.videoBody}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Segmented View Mode */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setTutorialTab('recording')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        tutorialTab === 'recording'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {la.screenRec}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTutorialTab('interactive')}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        tutorialTab === 'interactive'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {la.simulator}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View 1: High-Definition Screen Recording Video Player */}
              {tutorialTab === 'recording' && (
                <div className="relative aspect-[16/9] w-full bg-black flex flex-col justify-center items-center overflow-hidden">
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster="/videos/student_lobby_ready_poster.png"
                    className="w-full h-full object-contain"
                  >
                    <source src="/videos/typingbull_classroom_tutorial.mp4" type="video/mp4" />
                    <source src="/videos/typingbull_classroom_tutorial.webm" type="video/webm" />
                    {la.noVideo}
                  </video>
                </div>
              )}

              {/* View 2: Interactive Video Player Canvas Screen */}
              {tutorialTab === 'interactive' && (
                <div className="relative aspect-[16/9] w-full bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
                {/* Stage 1: Room Generation */}
                {videoPlayState.currentChapter === 1 && (
                  <div className="my-auto flex flex-col items-center text-center space-y-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black uppercase">
                      {la.ch1}
                    </span>
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl max-w-md w-full">
                      <div className="text-xs text-slate-400 mb-1 font-bold">{la.codeReady}</div>
                      <div className="font-mono text-3xl font-black text-amber-400 tracking-widest my-1">
                        TB-9482
                      </div>
                      <p className="text-xs text-slate-300 mt-2">
                        {la.ch1Body}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Alex, Maya, Liam & Zoe connected...</span>
                    </div>
                  </div>
                )}

                {/* Stage 2: Lesson & Passage Selection */}
                {videoPlayState.currentChapter === 2 && (
                  <div className="my-auto flex flex-col items-center text-center space-y-4">
                    <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase">
                      {la.ch2}
                    </span>
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl max-w-md w-full text-left">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-white">Morning in the Valley</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[11px] font-bold">
                          Ready
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full mb-3" />
                      <div className="text-center font-mono text-3xl font-black text-emerald-400">
                        3... 2... 1... START!
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {la.countdownNote}
                    </p>
                  </div>
                )}

                {/* Stage 3: Live Race Track */}
                {videoPlayState.currentChapter === 3 && (
                  <div className="my-auto w-full max-w-xl mx-auto space-y-3">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {la.raceTelemetry}
                      </span>
                      <span className="font-mono text-slate-400">Time Left: 0:38s</span>
                    </div>

                    {[
                      { name: 'Alex M.', avatar: '🐂', wpm: 54, progress: 85, color: 'from-emerald-400 to-teal-300' },
                      { name: 'Maya S.', avatar: '🐼', wpm: 48, progress: 78, color: 'from-sky-400 to-blue-300' },
                      { name: 'Liam T.', avatar: '🦊', wpm: 45, progress: 72, color: 'from-amber-400 to-orange-400' },
                      { name: 'Zoe K.', avatar: '🚀', wpm: 41, progress: 68, color: 'from-purple-400 to-pink-300' },
                    ].map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                        <span className="text-base">{st.avatar}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-[11px] font-bold text-white mb-1">
                            <span>{st.name}</span>
                            <span className="font-mono text-emerald-400 font-black">{st.wpm} WPM</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${st.color} rounded-full`} style={{ width: `${st.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stage 4: Results & Leaderboard */}
                {videoPlayState.currentChapter === 4 && (
                  <div className="my-auto flex flex-col items-center text-center space-y-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase">
                      {la.ch4}
                    </span>
                    <div className="text-3xl">🏆</div>
                    <h4 className="text-lg font-black text-white">{la.raceComplete}</h4>
                    <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="text-[11px] text-slate-400 font-bold">{la.firstPlace}</div>
                        <div className="text-xs font-black text-amber-400">Alex M. (54 WPM)</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="text-[11px] text-slate-400 font-bold">{la.classAvg}</div>
                        <div className="text-xs font-black text-emerald-400">47 WPM</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="text-[11px] text-slate-400 font-bold">{la.accuracy}</div>
                        <div className="text-xs font-black text-teal-400">98.6%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Controls Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoPlayState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                    >
                      {videoPlayState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoPlayState((prev) => ({ ...prev, progress: 0, currentChapter: 1 }))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                      title={la.replayAttr}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-[11px]">
                      {Math.floor((videoPlayState.progress / 100) * 75)}s / 75s
                    </span>
                  </div>

                  {/* Scrubber Bar */}
                  <div
                    className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setVideoPlayState((prev) => ({ ...prev, progress: clickPos * 100 }));
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${videoPlayState.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoPlayState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                    >
                      {videoPlayState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

              {/* Modal Action CTA */}
              <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <a
                    href="/videos/typingbull_classroom_tutorial.mp4"
                    download="typingbull_classroom_tutorial.mp4"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 shadow-xs"
                    title={la.dlMp4Attr}
                  >
                    <span>⬇️</span>
                    <span>{la.dlMp4}</span>
                  </a>
                  <a
                    href="/videos/typingbull_classroom_tutorial.webm"
                    download="typingbull_classroom_tutorial.webm"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 shadow-xs"
                    title={la.dlWebmAttr}
                  >
                    <span>⬇️</span>
                    <span>{la.dlWebm}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVideoModalOpen(false);
                      handleCreate();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-md transition"
                  >
                    {la.startNow}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsVideoModalOpen(false);
                      handleJoin();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black cursor-pointer transition"
                  >
                    {la.joinCode}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DETAILED CLASSROOM SECTIONS (Generous Centered Layout) ─── */}
      <div className="max-w-7xl mx-auto w-full">
      {/* ─── 2. WHAT IS CLASSROOM? (Simplified, Warm & Welcoming) ─── */}
      <section
        id="what-is-classroom"
        className="scroll-mt-8 relative rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Conversational Headline & Value Proposition (65%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-3.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{la.overviewTag}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3.5 leading-snug">
              {la.whatIs}
            </h2>

            <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed mb-4 font-medium">
              {la.whatIsP1}
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              {la.whatIsP2}
            </p>
          </div>

          {/* Right: Pastel Mint Feature Spotlight Badge (35%) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/50 dark:from-emerald-950/60 dark:via-slate-900/80 dark:to-teal-950/40 border-2 border-emerald-200/80 dark:border-emerald-800/70 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  🚀
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-3">
                  {la.zeroSetup}
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <span className="text-base leading-none">⚡</span>
                    <span><strong>{la.noAccounts}</strong> {la.noAccountsRest}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-base leading-none">🌐</span>
                    <span><strong>{la.browserBased}</strong> {la.browserRest}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-base leading-none">⏱️</span>
                    <span><strong>{la.ready30}</strong> {la.ready30Rest}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3.5 border-t border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <span>{la.freeAll}</span>
                <span className="font-mono font-black">{la.readyToType}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. CLASSROOM CAPABILITIES (Unified Container, Guaranteed Contrast) ─── */}
      <section className="relative rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-violet-400/15 dark:bg-violet-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-orange-400/15 dark:bg-orange-500/10 blur-3xl pointer-events-none -z-10" />

        {/* Section Header with Guaranteed Contrast */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-300 dark:border-violet-800 text-violet-800 dark:text-violet-300 text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>{la.capTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {la.capTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {la.capBody}
          </p>
        </div>

        {/* De-Nested 2-Column Pastel Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Structured Lessons (Lavender Theme) */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-violet-50/95 to-purple-50/80 dark:from-violet-950/50 dark:to-purple-950/30 border-2 border-violet-200/80 dark:border-violet-800/60 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/15 dark:bg-violet-400/20 border border-violet-300 dark:border-violet-700 flex items-center justify-center text-xl shadow-xs">
                    <GraduationCap className="w-5 h-5 text-violet-700 dark:text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{la.structured}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{la.structuredSub}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-violet-200/80 dark:bg-violet-900/80 text-violet-900 dark:text-violet-200 border border-violet-300/80 dark:border-violet-700">
                  {la.stepByStep}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-5">
                {la.structuredBody}
              </p>

              {/* Interactive Visual Progress Ribbon (De-Nested!) */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-violet-200/80 dark:border-violet-800/60 shadow-xs mb-5">
                <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white mb-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                    Lesson 01 — Home Row Basics
                  </span>
                  <span className="text-violet-700 dark:text-violet-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/60">
                    {la.passWpm}
                  </span>
                </div>
                {/* Visual Ribbon Flow */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <div className="py-2 px-1 rounded-xl bg-violet-100/90 dark:bg-violet-900/60 text-violet-900 dark:text-violet-200 border border-violet-300/60 dark:border-violet-700">
                    {la.stepLearn}
                  </div>
                  <div className="py-2 px-1 rounded-xl bg-violet-100/90 dark:bg-violet-900/60 text-violet-900 dark:text-violet-200 border border-violet-300/60 dark:border-violet-700">
                    {la.stepPractice}
                  </div>
                  <div className="py-2 px-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{la.stepPass}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-violet-200/80 dark:border-violet-800/60 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300 text-[11px] font-bold">
                {la.tactileBumps}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-[11px] font-bold">
                {la.coreLessons}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300 text-[11px] font-bold">
                {la.muscleMemory}
              </span>
            </div>
          </div>

          {/* Card 2: Interactive Activities (Warm Peach/Coral Theme) */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-orange-50/95 to-amber-50/80 dark:from-orange-950/50 dark:to-amber-950/30 border-2 border-orange-200/80 dark:border-orange-800/60 shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/15 dark:bg-orange-400/20 border border-orange-300 dark:border-orange-700 flex items-center justify-center text-xl shadow-xs">
                    <Zap className="w-5 h-5 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{la.activities}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{la.activitiesSub}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-orange-200/80 dark:bg-orange-900/80 text-orange-900 dark:text-orange-200 border border-orange-300/80 dark:border-orange-700">
                  {la.pacing}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-5">
                {la.pacingBody}
              </p>

              {/* Clean Stat Bar with Speed Gauge (De-Nested!) */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-orange-200/80 dark:border-orange-800/60 shadow-xs mb-5">
                <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                    {la.sprintTitle}
                  </span>
                  <span className="text-orange-700 dark:text-orange-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/60">
                    {la.drill60}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full bg-orange-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-[85%] rounded-full shadow-xs" />
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-slate-500 dark:text-slate-400">
                    <span>{la.target22}</span>
                    <span className="text-orange-600 dark:text-orange-400">{la.goal994}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-orange-200/80 dark:border-orange-800/60 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-[11px] font-bold">
                {la.zeroErrDrills}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                {la.metronomeRhythm}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-[11px] font-bold">
                {la.cadenceFocus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW TO CONNECT (Two-Track Visual Roadmap) ─── */}
      <section className="relative rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-12 right-1/4 w-80 h-80 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />

        {/* Section Header with Guaranteed Contrast */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{la.connTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {la.connTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {la.connBody}
          </p>
        </div>

        {/* TRACK 1: TEACHER SIDE (Steps 1 – 3, Soft Sky Blue Palette) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-sky-50/90 to-blue-50/60 dark:from-sky-950/40 dark:to-blue-950/30 border-2 border-sky-200/80 dark:border-sky-800/60 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-sky-200/80 dark:border-sky-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/15 dark:bg-sky-400/20 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-xl shadow-xs">
                👨‍🏫
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{la.teacherTrack}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-sky-200/80 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200">
                    {la.steps13}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{la.teacherTrackSub}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 shadow-sm cursor-pointer transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{la.createClassroomMock}</span>
            </button>
          </div>

          {/* 3 Connected Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Step 01 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    01
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {la.teacherAction}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{la.clickCreate}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.selectCreate.split('{name}').flatMap((part, i, arr) =>
                    i < arr.length - 1
                      ? [part, <strong key={i} className="text-slate-900 dark:text-white">{la.createClassroomMock}</strong>]
                      : [part]
                  )}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.instantNoLogin}
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    02
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {la.instantCode}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <span>{la.codeGenerated}</span>
                </h4>
                <div className="my-2 inline-block px-3 py-1 rounded-xl bg-sky-100 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200 font-mono font-bold tracking-widest text-xs shadow-xs">
                  TB-4821
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.codeGenBody}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.identifies}
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    03
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {la.zeroFriction}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{la.shareBoard}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.shareBoardBody}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.noEmail}
              </div>
            </div>
          </div>
        </div>

        {/* TRACK 2: STUDENT SIDE (Steps 4 – 6, Warm Mint/Emerald Palette) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-50/90 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-200/80 dark:border-emerald-800/60 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-emerald-200/80 dark:border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-xl shadow-xs">
                🎒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{la.studentTrack}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                    {la.steps46}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{la.studentTrackSub}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleJoin}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 shadow-sm cursor-pointer transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{la.joinClassroomMock}</span>
            </button>
          </div>

          {/* 3 Connected Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Step 04 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    04
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {la.studentAction}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{la.enterCodeName}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.studentsSelect.split('{name}').flatMap((part, i, arr) =>
                    i < arr.length - 1
                      ? [part, <strong key={i} className="text-slate-900 dark:text-white">{la.joinClassroomMock}</strong>]
                      : [part]
                  )}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.connectedLobby}
              </div>
            </div>

            {/* Step 05 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    05
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {la.instantSync}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{la.countdown321}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.countdownBody}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.sameSecond}
              </div>
            </div>

            {/* Step 06 */}
            <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    06
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {la.realTime}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{la.livePractice}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {la.livePracticeBody}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                {la.sharedCelebr}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. LESSONS MUST BE PROMINENT (Learn Together Workflow) ─── */}
      <section className="card-game card-halo-purple p-6 sm:p-8 lg:p-10 rounded-3xl mb-8 sm:mb-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {lb.learnTag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mt-1">
            {lb.learnTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-2 leading-relaxed">
            {lb.learnBody}
          </p>
        </div>

        {/* 3-Step Simple Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-black mb-3">
                1
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">
                {lb.tChooses}
              </h3>
              <p className="text-xs text-mute font-medium leading-relaxed">
                {fill(la.browseLessons, { n: TOTAL_LESSONS })}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {lb.oneSource}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black mb-3">
                2
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">
                {lb.studentsJoin}
              </h3>
              <p className="text-xs text-mute font-medium leading-relaxed">
                {lb.studentsJoinBody}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {lb.zeroLogin}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-black mb-3">
                3
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">
                {lb.everyonePractices}
              </h3>
              <p className="text-xs text-mute font-medium leading-relaxed">
                {lb.everyoneBody}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-purple-600 dark:text-purple-400">
              {lb.liveProgress}
            </div>
          </div>
        </div>

        {/* Visual Learning Path Preview from Canonical Learn Lessons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {LESSONS.slice(0, 4).map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                    {fill(la.stepWord, { id: lesson.id })}
                  </span>
                  <span className="text-[11px] font-bold text-mute uppercase">{LESSON_TYPE_KEYS[lesson.type] ? ss[LESSON_TYPE_KEYS[lesson.type]] : lesson.type}</span>
                </div>
                <h4 className="text-sm font-extrabold text-ink mb-1 flex items-center gap-1.5">
                  <span>{lesson.icon}</span>
                  <span className="truncate">{lesson.title}</span>
                </h4>
                <p className="text-[11px] text-body font-medium leading-relaxed line-clamp-2">
                  {lesson.description}
                </p>
                {lesson.targetKeys.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {lesson.targetKeys.map((k) => (
                      <span
                        key={k}
                        className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        {k === ' ' ? 'Space' : k.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-primary flex items-center justify-between">
                <span>{fill(la.passAcc, { n: lesson.passingAccuracy })}</span>
                <span className="text-slate-400 font-mono">Home Row</span>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown of What Lessons Contain */}
        <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40">
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-3">
            {lb.includes}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">📖</span>
              <span className="text-xs font-extrabold text-ink block">{lb.concept}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.conceptSub}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">🖐️</span>
              <span className="text-xs font-extrabold text-ink block">{lb.fingerGuide}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.fingerSub}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">🎯</span>
              <span className="text-xs font-extrabold text-ink block">{lb.example}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.exampleSub}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">⚡</span>
              <span className="text-xs font-extrabold text-ink block">{lb.guidedDrills}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.guidedSub}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">⌨️</span>
              <span className="text-xs font-extrabold text-ink block">{lb.repetition}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.repetitionSub}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800">
              <span className="text-base block mb-1">📊</span>
              <span className="text-xs font-extrabold text-ink block">{lb.liveMastery}</span>
              <span className="text-[11px] text-mute font-semibold">{lb.masterySub}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. DIFFERENTIATE CONTENT TYPES ─── */}
      <section className="mb-8 sm:mb-12">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {lb.contentTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {lb.contentTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-1">
            {lb.contentBody}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lessons */}
          <div className="card-game p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📚</div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase mb-1.5">
                {la.badgeLearn}
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">{lb.lessons}</h3>
              <p className="text-xs text-body font-medium leading-relaxed">
                {lb.lessonsBody}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-mute">
              {lb.lessonsSub}
            </div>
          </div>

          {/* Activities */}
          <div className="card-game p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[11px] font-black uppercase mb-1.5">
                {la.badgePractice}
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">{lb.activitiesCard}</h3>
              <p className="text-xs text-body font-medium leading-relaxed">
                {lb.activitiesBody}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-mute">
              {lb.activitiesSub}
            </div>
          </div>

          {/* Passages */}
          <div className="card-game p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">⌨️</div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase mb-1.5">
                {la.badgeType}
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">{lb.passages}</h3>
              <p className="text-xs text-body font-medium leading-relaxed">
                {lb.passagesBody}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-mute">
              {lb.passagesSub}
            </div>
          </div>

          {/* Live Sessions */}
          <div className="card-game p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase mb-1.5">
                {la.badgeTogether}
              </div>
              <h3 className="text-base font-extrabold text-ink mb-1">{lb.liveSessions}</h3>
              <p className="text-xs text-body font-medium leading-relaxed">
                {lb.liveSessionsBody}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-mute">
              {lb.liveSessionsSub}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. LIVE CLASSROOM VISUAL PREVIEW ─── */}
      <section className="glass-panel p-6 sm:p-8 lg:p-10 rounded-3xl mb-8 sm:mb-12">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {lb.monTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {lb.monTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-1">
            {lb.monBody}
          </p>
        </div>

        {/* Miniature Classroom Session UI */}
        <div className="max-w-2xl mx-auto card-game p-5 sm:p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-ink">{lb.classroomWord}</span>
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700">
                TB-4821
              </span>
            </div>

            <div className="text-xs font-bold text-mute">
              {la.lessonColon.split('{title}').flatMap((part, i, arr) =>
                    i < arr.length - 1
                      ? [part, <span key={i} className="font-extrabold text-ink">Home Row Basics</span>]
                      : [part]
                  )}
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {lb.sessionReady}
            </span>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="text-[11px] font-black text-mute uppercase tracking-wider">
              {lb.studentsConnectedLbl}
            </div>

            {[
              { name: 'Student 1 (Alex)', avatar: '🐂', wpm: '42 WPM', progress: 85, color: 'bg-primary' },
              { name: 'Student 2 (Maya)', avatar: '🐼', wpm: '38 WPM', progress: 78, color: 'bg-primary' },
              { name: 'Student 3 (Liam)', avatar: '🦊', wpm: '45 WPM', progress: 92, color: 'bg-primary' },
              { name: 'Student 4 (Zoe)', avatar: '🚀', wpm: '39 WPM', progress: 80, color: 'bg-primary' },
            ].map((student, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3"
              >
                <span className="text-base">{student.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-extrabold text-ink mb-1">
                    <span>{student.name}</span>
                    <span className="font-mono text-primary">{student.wpm}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`${student.color} h-full rounded-full`} style={{ width: `${student.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[11px] font-semibold text-mute">
            {lb.monCaption}
          </div>
        </div>
      </section>

      {/* ─── 9. MADE FOR THE COMPUTER LAB ─── */}
      <section className="card-game card-halo-blue p-6 sm:p-8 lg:p-10 rounded-3xl mb-8 sm:mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {lb.labTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {lb.labTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-1">
            {lb.labBody}
          </p>
        </div>

        {/* Visual Lab Diagram: Teacher -> Code -> Student Computers */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mb-8">
          {/* Teacher Station */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xl flex items-center justify-center mx-auto mb-2">
              🖥️
            </div>
            <div className="text-xs font-extrabold text-ink">{lb.teacherHost}</div>
            <div className="text-[11px] text-mute font-semibold mt-0.5">{lb.hostSub}</div>
          </div>

          <div className="text-primary font-black text-lg rotate-90 md:rotate-0">
            →
          </div>

          {/* Classroom Code */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-dashed border-emerald-400 dark:border-emerald-700 text-center flex-1 w-full">
            <div className="text-[11px] font-black uppercase text-emerald-800 dark:text-emerald-300">{lb.roomCode}</div>
            <div className="font-mono text-xl font-black text-primary my-0.5">TB-4821</div>
            <div className="text-[10.5px] text-mute font-semibold">{lb.roomCodeSub}</div>
          </div>

          <div className="text-primary font-black text-lg rotate-90 md:rotate-0">
            →
          </div>

          {/* Student Computers */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center flex-1 w-full">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-xl flex items-center justify-center mx-auto mb-2">
              💻
            </div>
            <div className="text-xs font-extrabold text-ink">{lb.studentComputers}</div>
            <div className="text-[11px] text-mute font-semibold mt-0.5">{lb.studentSub}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <Monitor className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-extrabold text-ink">{lb.chromebooks}</div>
            <div className="text-[10.5px] text-mute font-semibold mt-0.5">{lb.chromeSub}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-extrabold text-ink">{lb.zeroLoginFriction}</div>
            <div className="text-[10.5px] text-mute font-semibold mt-0.5">{lb.noForgotten}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-extrabold text-ink">{lb.instantReset}</div>
            <div className="text-[10.5px] text-mute font-semibold mt-0.5">{lb.cleanSweep}</div>
          </div>
        </div>
      </section>

      {/* ─── 10. REQUIREMENTS (Based on Actual Implementation) ─── */}
      <section className="mb-8 sm:mb-12">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {lb.reqTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {lb.reqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-1">
            {lb.reqBody}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Requirements */}
          <div className="card-game p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">👨‍🏫</span>
              <h3 className="text-base font-extrabold text-ink">{lb.teacherReq}</h3>
            </div>
            <ul className="space-y-2 text-xs font-medium text-body">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.t1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.t2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.t3}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.t4}</span>
              </li>
            </ul>
          </div>

          {/* Student Requirements */}
          <div className="card-game p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">🎒</span>
              <h3 className="text-base font-extrabold text-ink">{lb.studentReq}</h3>
            </div>
            <ul className="space-y-2 text-xs font-medium text-body">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.s1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.s2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.s3}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{lb.s4}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 11. FAQ ACCORDION (TypingBull Component Style) ─── */}
      <section className="glass-panel p-6 sm:p-8 lg:p-10 rounded-3xl mb-8 sm:mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lb.faqTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {lb.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-mute font-semibold mt-1">
            {lb.faqBody}
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq) => {
            const isOpen = openFaqIds.has(faq.id);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 overflow-hidden backdrop-blur-md ${
                  isOpen
                    ? 'bg-white/95 dark:bg-slate-800/95 border-2 border-purple-400 dark:border-purple-500 shadow-md'
                    : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-extrabold text-sm sm:text-base text-ink leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm font-medium text-body leading-relaxed border-t border-slate-100 dark:border-slate-700/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 12. FINAL CTA ─── */}
      <section className="card-game card-halo-orange p-6 sm:p-8 lg:p-10 rounded-3xl text-center">
        <div className="max-w-xl mx-auto">
          <div className="mb-3 flex justify-center">
            <Mascot mood="cheering" size="md" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight mb-2">
            {lb.ctaTitle}
          </h2>

          <p className="text-xs sm:text-sm text-body font-semibold mb-6 max-w-md mx-auto leading-relaxed">
            {lb.ctaBody}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCreate}
              className="btn-chunky btn-chunky-green text-sm sm:text-base cursor-pointer shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{la.createBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleJoin}
              className="card-game px-6 py-3.5 rounded-2xl flex items-center gap-2 text-ink font-extrabold text-sm sm:text-base border border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary transition cursor-pointer shadow-sm"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>{lb.ctaJoin}</span>
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
