import React from 'react';
import { Gauge, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

export const PracticeGuideSection: React.FC = () => {
  return (
    <section className="w-full mt-10 space-y-8 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/25 dark:border-purple-400/25 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          <span>Typing Diagnostics & Metrics Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Understanding Your Typing Practice Benchmarks
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          TypingBull tests measure more than raw speed. Here is how professional typists, schools, and coding teams evaluate real typing proficiency.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: WPM Formula */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
            <Gauge className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Words Per Minute (WPM)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Standardized typing tests calculate WPM by dividing total correct keystrokes by 5 (the standardized word unit) and normalizing for elapsed minutes. <strong>Gross WPM</strong> measures all raw keypresses, while <strong>Net WPM</strong> accounts for uncorrected typing errors.
          </p>
        </div>

        {/* Metric 2: Accuracy */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Accuracy & Rhythm Consistency
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            In office and software development work, accuracy is far more valuable than raw bursts of speed. An error requires backspacing and breaks concentration. Typing at a steady 65 WPM with 99% accuracy produces higher real-world output than 90 WPM with frequent typos.
          </p>
        </div>

        {/* Metric 3: Interpreting Results */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Target Industry Benchmarks
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Average casual typists achieve 38–42 WPM. Professional writers and administrative specialists aim for 65–75 WPM. Programmers and high-speed competitive typists routinely exceed 90+ WPM with specialized symbol reach agility.
          </p>
        </div>
      </div>
    </section>
  );
};
