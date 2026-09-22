import React from 'react';
import { Gamepad2, Zap, Trophy } from 'lucide-react';

export const PlayGuideSection: React.FC = () => {
  return (
    <section className="w-full mt-10 space-y-8 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/25 dark:border-pink-400/25 text-pink-600 dark:text-pink-300 text-xs font-black uppercase tracking-wider">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Arcade Modes & Skill Development</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          How Typing Games Bridge Drills and Automaticity
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          While structured drills teach where fingers go, fast-paced arcade games train the subconscious mind to react instantly to visual stimuli without cognitive hesitation.
        </p>
      </div>

      {/* 3 Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lilypad Leap */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            🐸
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Lilypad Leap (Kids & Beginners)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Designed for elementary students and foundational typists. Words drift across gentle pond currents, training single-word visual parsing and keystroke confidence without the punitive pressure of rapid countdown clocks.
          </p>
        </div>

        {/* Neon Velocity */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Neon Velocity (Cadence & Rhythm)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            A high-energy arcade highway where words descend across dynamic traffic lanes. Players must maintain a consistent typing rhythm and prioritize targets based on distance, developing flow-state typing under time constraint.
          </p>
        </div>

        {/* Practice Ground */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Practice Ground (Live Multiplayer)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Synchronous head-to-head racing against live typists or cadence bots. Racing develops mental composure, teaches typists to resist glancing at opponent progress, and builds stamina over full-length literary passages.
          </p>
        </div>
      </div>
    </section>
  );
};
