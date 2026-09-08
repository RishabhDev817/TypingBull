import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Users, Trophy, Code2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { soundEngine } from '../utils/audio';

export interface RoadmapCardData {
  id: string;
  iconEmoji: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  tagKey: string;
  status: 'inDev' | 'comingSoon';
  glowColor: 'cyan' | 'purple' | 'amber' | 'emerald';
}

const ROADMAP_ITEMS: RoadmapCardData[] = [
  {
    id: 'arcade-arenas',
    iconEmoji: '🕹️',
    iconComponent: Gamepad2,
    titleKey: 'roadmap.card1.title',
    descKey: 'roadmap.card1.desc',
    tagKey: 'roadmap.card1.tag',
    status: 'inDev',
    glowColor: 'cyan',
  },
  {
    id: 'multiplayer-racing',
    iconEmoji: '🏁',
    iconComponent: Users,
    titleKey: 'roadmap.card2.title',
    descKey: 'roadmap.card2.desc',
    tagKey: 'roadmap.card2.tag',
    status: 'comingSoon',
    glowColor: 'purple',
  },
  {
    id: 'global-leaderboards',
    iconEmoji: '🏆',
    iconComponent: Trophy,
    titleKey: 'roadmap.card3.title',
    descKey: 'roadmap.card3.desc',
    tagKey: 'roadmap.card3.tag',
    status: 'inDev',
    glowColor: 'amber',
  },
  {
    id: 'developer-proving-ground',
    iconEmoji: '💻',
    iconComponent: Code2,
    titleKey: 'roadmap.card4.title',
    descKey: 'roadmap.card4.desc',
    tagKey: 'roadmap.card4.tag',
    status: 'comingSoon',
    glowColor: 'emerald',
  },
];

interface ProductRoadmapProps {
  className?: string;
}

export const ProductRoadmap: React.FC<ProductRoadmapProps> = ({ className = '' }) => {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="roadmap-section-title"
      className={`relative w-full max-w-6xl mx-auto rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl transition-all overflow-hidden ${className}`}
    >
      {/* Background Decorative Ambient Aura Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-3xl pointer-events-none" />

      {/* ── Section Header (Styled consistently with H2 dashboard headers) ── */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/25 dark:border-cyan-400/25 text-cyan-600 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>{t('roadmap.badge')}</span>
        </div>

        <h2
          id="roadmap-section-title"
          className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          {t('roadmap.title')}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold mt-2 leading-relaxed">
          {t('roadmap.subtitle')}
        </p>
      </div>

      {/* ── Responsive CSS Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 items-stretch">
        {ROADMAP_ITEMS.map((item) => {
          const IconComp = item.iconComponent;
          const isInDev = item.status === 'inDev';

          return (
            <motion.article
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onMouseEnter={() => {
                soundEngine.playPop();
              }}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl md:rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-lg hover:shadow-2xl hover:brightness-105 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle dynamic glow ring on hover based on card category */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  item.glowColor === 'cyan'
                    ? 'bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent border border-cyan-400/30 rounded-2xl md:rounded-3xl'
                    : item.glowColor === 'purple'
                    ? 'bg-gradient-to-b from-purple-500/10 via-transparent to-transparent border border-purple-400/30 rounded-2xl md:rounded-3xl'
                    : item.glowColor === 'amber'
                    ? 'bg-gradient-to-b from-amber-500/10 via-transparent to-transparent border border-amber-400/30 rounded-2xl md:rounded-3xl'
                    : 'bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent border border-emerald-400/30 rounded-2xl md:rounded-3xl'
                }`}
              />

              {/* Card Top Row: Emoji / Icon on Left, Status Pill Badge on Right */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  {/* Icon with glossy badge backdrop */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border transition-transform duration-300 group-hover:scale-110 ${
                      item.glowColor === 'cyan'
                        ? 'bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-400/30 text-cyan-600 dark:text-cyan-300'
                        : item.glowColor === 'purple'
                        ? 'bg-purple-500/15 dark:bg-purple-500/20 border-purple-400/30 text-purple-600 dark:text-purple-300'
                        : item.glowColor === 'amber'
                        ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-400/30 text-amber-600 dark:text-amber-300'
                        : 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-400/30 text-emerald-600 dark:text-emerald-300'
                    }`}
                  >
                    <span role="img" aria-label={t(item.titleKey)} className="leading-none">
                      {item.iconEmoji}
                    </span>
                  </div>

                  {/* Status Pill Badge (Soft Purple or Neon Cyan accent) */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-2xs border ${
                      isInDev
                        ? 'bg-cyan-500/15 dark:bg-cyan-400/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
                        : 'bg-purple-500/15 dark:bg-purple-400/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isInDev ? 'bg-cyan-500 dark:bg-cyan-400 animate-pulse' : 'bg-purple-500 dark:bg-purple-400'
                      }`}
                    />
                    <span>
                      {isInDev ? t('roadmap.status.inDev') : t('roadmap.status.comingSoon')}
                    </span>
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {t(item.titleKey)}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>

              {/* Card Footer: Highlight Tag */}
              <div className="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <IconComp className="w-3.5 h-3.5 opacity-70" />
                  <span>{t(item.tagKey)}</span>
                </span>
                <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Teaser
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductRoadmap;
