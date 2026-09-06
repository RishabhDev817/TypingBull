import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Zap, Code2, Trophy } from 'lucide-react';
import { Mascot } from '../Mascot';
import { useI18n } from '../../context/I18nContext';

interface GameHubMenuProps {
  onSelectKidsGame: (level?: number) => void;
  onSelectNeonVelocity?: () => void;
}

export const GameHubMenu: React.FC<GameHubMenuProps> = ({ onSelectKidsGame, onSelectNeonVelocity }) => {
  const { t } = useI18n();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 220, damping: 20 },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-8 flex flex-col items-center">
      {/* Hero Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-8"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-3">
          <Mascot mood="happy" size="lg" />
        </motion.div>

        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>{t('game.hub.title')}</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          {t('game.hub.title')}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-2 font-bold leading-relaxed"
        >
          {t('game.hub.subtitle')}
        </motion.p>
      </motion.div>

      {/* 3 Difficulty Tiers Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* ─── CARD 1: KIDS (UNLOCKED) ─── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-4 border-emerald-400 dark:border-emerald-500/80 shadow-2xl bg-gradient-to-b from-emerald-500/10 via-white dark:via-slate-900 to-emerald-500/5 dark:to-slate-900"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Kids • Beginner
              </span>
              <span className="text-2xl">🪷</span>
            </div>

            {/* Game Visual Icon / Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5">
              {/* Lake pattern backdrop */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-5xl drop-shadow-md mb-1 animate-bounce">🐸</span>
                <span className="text-white font-black text-xs tracking-wider uppercase drop-shadow">
                  Lotus Lake Adventure
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('game.lilypad.title')}
            </h3>
            <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
              {t('game.lilypad.focus')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              {t('game.lilypad.desc')}
            </p>

            {/* Level Pills */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-300 dark:border-emerald-700">
                Lvl 1: 3-Letter (10 Leaves)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-extrabold text-[11px] border border-teal-300 dark:border-teal-700">
                Lvl 2: 3-4 Letter (12 Leaves)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-extrabold text-[11px] border border-cyan-300 dark:border-cyan-700">
                Lvl 3: 4-Letter (13 Leaves)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-300 dark:border-indigo-700">
                Lvl 4: 5-Letter (14 Leaves)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 font-extrabold text-[11px] border border-pink-300 dark:border-pink-700">
                Lvl 5: 6-Letter (15 Leaves)
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectKidsGame(1)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('game.lilypad.play')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ─── CARD 2: TEENS (UNLOCKED: NEON VELOCITY) ─── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-4 border-cyan-400 dark:border-cyan-500/80 shadow-2xl bg-gradient-to-b from-cyan-500/10 via-white dark:via-slate-900 to-indigo-950/20 dark:to-slate-900"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Teens • Intermediate
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-500 dark:text-amber-300 text-[10px] font-black uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Arena
              </span>
            </div>

            {/* Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-950 to-indigo-950 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5 border border-cyan-500/30 group">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl drop-shadow mb-1 animate-pulse">⚡🏎️</span>
                <span className="text-cyan-300 font-black text-xs tracking-wider uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                  Neon Velocity
                </span>
                <span className="text-[10px] font-bold text-cyan-400/90 mt-1">
                  Synthwave Gauntlet
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{t('game.neon.title')}</span>
            </h3>
            <p className="text-xs font-black text-cyan-700 dark:text-cyan-300 mt-0.5">
              {t('game.neon.focus')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              {t('game.neon.desc')}
            </p>

            {/* Features pills */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-extrabold text-[11px] border border-cyan-300 dark:border-cyan-700">
                4-Lane Track
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-300 dark:border-indigo-700">
                x1, x2, x4, x8 Combos
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-300 dark:border-amber-700">
                Turbo Overdrive
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-extrabold text-[11px] border border-rose-300 dark:border-rose-700">
                Shield Defense
              </span>
            </div>
          </div>

          {/* Active Launch Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSelectNeonVelocity}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base shadow-lg shadow-cyan-500/30 border-b-4 border-cyan-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{t('game.neon.play')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ─── CARD 3: ADULTS (COMING SOON / LOCKED) ─── */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-2 border-slate-300 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm opacity-90 shadow-xl"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-black text-xs uppercase tracking-wider border border-purple-300 dark:border-purple-800 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Adults • Hard
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            </div>

            {/* Teaser Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5 border border-purple-500/20">
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl drop-shadow mb-1">💻📟</span>
                <span className="text-purple-300 font-black text-xs tracking-wider uppercase">
                  Terminal Overdrive
                </span>
                <span className="text-[10px] font-bold text-purple-400/80 mt-1">
                  Code & Complex Formatting
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Terminal Overdrive</span>
            </h3>
            <p className="text-xs font-black text-purple-800 dark:text-purple-300 mt-0.5">
              Focus: Syntax, Symbols & Formatting
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              Master real-world developer syntax, JSON payloads, regex tokens, camelCase structures, and punctuation sequences under time pressure.
            </p>

            {/* Teaser features */}
            <div className="space-y-1.5 mt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">▹</span>
                <span>TypeScript, Python & SQL snippets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">▹</span>
                <span>Symbol accuracy & bracket matching</span>
              </div>
            </div>
          </div>

          {/* Locked Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              disabled
              className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-300 dark:border-slate-700"
            >
              <Lock className="w-4 h-4" />
              <span>Coming Soon in Next Update</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
