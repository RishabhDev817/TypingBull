import React from 'react';
import { Compass, Target, Clock, Sparkles, BookOpen } from 'lucide-react';

export const LearnGuideSection: React.FC = () => {
  return (
    <section className="w-full mt-10 space-y-8 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/25 dark:border-sky-400/25 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum & Methodology Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          How The Great Typing Railway Builds Touch-Typing Mastery
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Touch-typing is not an innate talent — it is a physical and neurological skill developed through tactile anchoring, spatial habituation, and muscle memory.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: Biomechanics */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            1. Home-Row Tactile Anchoring
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Touch-typing fundamentally relies on finger tactile receptors rather than visual glances. The F and J keys on standard keyboards feature subtle tactile ridges. By resting index fingers on these anchors, your left hand (A-S-D-F) and right hand (J-K-L-;) establish spatial coordinates for every key reach.
          </p>
        </div>

        {/* Pillar 2: Progressive Reach */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            2. Structured Coordinate Progression
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Rather than overwhelming learners with all 26 letters simultaneously, our Railway curriculum introduces one finger extension at a time. Learners habituate home-row anchors first, then master upward reaches (E, R, U, I), downward curls (C, V, M, N), shift keys, and finally developer symbols and numerals.
          </p>
        </div>

        {/* Pillar 3: Accuracy First */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            3. Accuracy Precedes Velocity
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            A common beginner pitfall is attempting to type fast before muscle memory solidifies. Typing fast with 85% accuracy creates neurological confusion and ingrains stutter pauses. Maintaining a calm 96%+ accuracy standard allows finger pathways to automate, naturally producing high sustained WPM.
          </p>
        </div>

        {/* Pillar 4: Daily Cadence */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            4. Recommended Practice Routine
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Cognitive motor learning consolidates during rest periods. Practicing 15 minutes daily yields substantially greater results than one 2-hour cram session per week. Maintain an upright posture, keep wrists suspended slightly above the desk, and avoid looking down at the keyboard.
          </p>
        </div>
      </div>
    </section>
  );
};
