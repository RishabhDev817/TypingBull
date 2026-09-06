import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Zap, ShieldCheck, Keyboard, Brain, Gamepad2, Code2, Globe2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { HOME_SEO_DATA } from '../data/homeSeoContentData';
import { SEO_DATA_BY_LANG } from '../hooks/usePageSEO';

export const HomeSEOContent: React.FC = () => {
  const { currentLang } = useI18n();
  const data = HOME_SEO_DATA[currentLang] || HOME_SEO_DATA.en;
  const seoMeta = SEO_DATA_BY_LANG[currentLang] || SEO_DATA_BY_LANG.en;

  const sectionIcons = [
    <Brain key="brain" className="w-4 h-4 text-purple-500" />,
    <Zap key="zap" className="w-4 h-4 text-amber-500" />,
    <Trophy key="trophy" className="w-4 h-4 text-emerald-500" />,
    <Gamepad2 key="gamepad" className="w-4 h-4 text-sky-500" />,
    <Code2 key="code" className="w-4 h-4 text-indigo-500" />,
    <Globe2 key="globe" className="w-4 h-4 text-rose-500" />,
  ];

  return (
    <article
      id="about-typingbull-seo"
      className="card-game relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 my-8 border-2 border-white/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl"
    >
      {/* Background Decorative Aura Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-3xl pointer-events-none" />

      {/* Header Section */}
      <header className="relative z-10 max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-400/30 text-purple-700 dark:text-purple-300 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{data.badge}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
          {data.mainTitle}
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
          {data.subTitle}
        </p>
      </header>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {data.quickStats.map((stat, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between"
          >
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white my-0.5">
              {stat.value}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Semantic Educational Topic Cards (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {data.sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/70 shadow-xs flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-600/50 transition-colors"
          >
            <div>
              {/* Section Tag */}
              {section.badge && (
                <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {sectionIcons[index % sectionIcons.length]}
                  <span>{section.badge}</span>
                </div>
              )}

              {/* Section H3 Title */}
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug mb-3">
                {section.heading}
              </h3>

              {/* Body Paragraphs */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Keyword Tags & Feature Pill Matrix Footer */}
      <footer className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Keywords:
          </span>
          {seoMeta.keywords.split(', ').slice(0, 6).map((kw, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
            >
              #{kw.toLowerCase()}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400">
          <Keyboard className="w-4 h-4 text-purple-500" />
          <span>TypingBull — 100% Free Browser-Based Engine</span>
        </div>
      </footer>
    </article>
  );
};

export default HomeSEOContent;
