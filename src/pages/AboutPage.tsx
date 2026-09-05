import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Gamepad2,
  Brain,
  BookOpen,
  Award,
  Heart,
  Globe2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { soundEngine } from '../utils/audio';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 14 } },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-12 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* ── Hero Section ── */}
          <motion.div
            variants={itemVariants}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/25 dark:border-purple-400/25 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story & Mission</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Mastering the Keyboard Shouldn't Feel Like Homework.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
              TypingBull was created to reinvent touch typing education: blending structured cognitive progression, arcade velocity gaming, and generative AI diagnostics into a 100% free, joyful experience.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundEngine.playPop();
                  navigate('/learn');
                }}
                className="px-6 py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 cursor-pointer flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundEngine.playPop();
                  navigate('/play');
                }}
                className="px-6 py-3 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-pink-500" />
                <span>Play Games</span>
              </motion.button>
            </div>
          </motion.div>

          {/* ── Mascot Showcase Banner ── */}
          <motion.div
            variants={itemVariants}
            className="card-frosted-standard p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 dark:bg-slate-800/90 border-2 border-purple-300 dark:border-purple-600 flex items-center justify-center shadow-lg">
                <Mascot mood="happy" size="lg" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                Meet BullBot 🐂
              </div>
              <h2 className="card-title text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                Your Enthusiastic, Data-Driven Typing Companion
              </h2>
              <p className="card-desc text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                BullBot isn't just an avatar. Behind the scenes, BullBot monitors your raw keystroke timing, identifies hesitation patterns on specific fingers, generates Weak-Key Heatmaps, and provides tailored drill recommendations in natural conversation.
              </p>
            </div>
          </motion.div>

          {/* ── Four Pillars Grid ── */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                How TypingBull Reinvents Learning
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-1">
                Built from the ground up on modern cognitive science and interactive feedback loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pillar 1 */}
              <div className="card-frosted-standard p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="card-title text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                  The Great Typing Railway
                </h3>
                <p className="card-desc text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  A structured railroad progression that introduces one finger coordinate at a time. Starting with Home Row anchors (F & J bumps), through top row reach extensions, bottom row curls, shift coordination, and code brackets.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="card-frosted-standard p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="card-title text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                  Gamified Velocity Modes
                </h3>
                <p className="card-desc text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  From the serene water physics and progressive vocabulary of <em>Lilypad Leap</em> to the high-cadence highway lanes of <em>Neon Velocity</em>, our arcade modes replace rote memorization with flow-state gameplay.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="card-frosted-standard p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="card-title text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                  Deep Keystroke Diagnostics
                </h3>
                <p className="card-desc text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  Every keypress records millisecond timings, pause gaps, and error frequencies. Our diagnostics isolate whether a slow WPM stems from pinky reaching or fatigue drop-off, giving typists precision insights.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="card-frosted-standard p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="card-title text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                  Global & Multilingual Layouts
                </h3>
                <p className="card-desc text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  Touch typing is universal. TypingBull supports standard US QWERTY, French AZERTY, German QWERTZ, and Indian regional typing layouts (InScript & Remington) with dynamic on-screen key remapping.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Key Values ── */}
          <motion.div
            variants={itemVariants}
            className="card-frosted-standard p-8"
          >
            <h2 className="card-title text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] mb-6 text-center">
              Our Core Principles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="card-title font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-base">100% Free Forever</h3>
                <p className="card-desc text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  We believe touch typing is a fundamental 21st-century literacy. All lessons, diagnostics, and games are free without paywalls.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="card-title font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-base">Privacy By Design</h3>
                <p className="card-desc text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  Keystroke telemetry is stored locally in your browser session store. We do not track or sell personal identifying typing data.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="card-title font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-base">Ergonomics First</h3>
                <p className="card-desc text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed opacity-100">
                  Speed means nothing without proper wrist health and fluid mechanics. We emphasize relaxed posture over reckless key-mashing.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AboutPage;
