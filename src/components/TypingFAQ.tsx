import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search, Sparkles, Gamepad2, Brain, BookOpen, Keyboard } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useI18n } from '../context/I18nContext';
import {
  type FAQCategoryKey,
  type LocalizedFAQItem,
  FAQ_DATA_BY_LANG,
  getLocalizedFaqData,
  getLocalizedFaqCategories,
  getLocalizedFaqUi,
} from '../i18n/faqData';

export type FAQCategory = FAQCategoryKey;
export type FAQItem = LocalizedFAQItem;
export const FAQ_DATA: FAQItem[] = FAQ_DATA_BY_LANG.en;

const CATEGORIES: { key: FAQCategoryKey; icon: React.FC<{ className?: string }> }[] = [
  { key: 'All', icon: Sparkles },
  { key: 'Games', icon: Gamepad2 },
  { key: 'AI Tutor', icon: Brain },
  { key: 'Curriculum', icon: BookOpen },
  { key: 'General Typing', icon: Keyboard },
];

const CATEGORY_COLORS: Record<Exclude<FAQCategoryKey, 'All'>, { bg: string; text: string; border: string }> = {
  Games: {
    bg: 'bg-pink-500/10 dark:bg-pink-400/10',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/25 dark:border-pink-400/25',
  },
  'AI Tutor': {
    bg: 'bg-purple-500/10 dark:bg-purple-400/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/25 dark:border-purple-400/25',
  },
  Curriculum: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/25 dark:border-emerald-400/25',
  },
  'General Typing': {
    bg: 'bg-blue-500/10 dark:bg-blue-400/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/25 dark:border-blue-400/25',
  },
};

interface TypingFAQProps {
  className?: string;
}

export const TypingFAQ: React.FC<TypingFAQProps> = ({ className = '' }) => {
  const { t, currentLang } = useI18n();
  const faqItems = getLocalizedFaqData(currentLang);
  const categoryLabels = getLocalizedFaqCategories(currentLang);
  const faqUi = getLocalizedFaqUi(currentLang);

  const [activeCategory, setActiveCategory] = useState<FAQCategoryKey>('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-1']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    soundEngine.playPop();
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section
      aria-labelledby="faq-section-title"
      className={`w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl transition-all ${className}`}
    >
      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/25 dark:border-purple-400/25 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{faqUi.badge}</span>
        </div>
        <h2
          id="faq-section-title"
          className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          {t('dash.faqTitle')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold mt-2 leading-relaxed">
          {t('dash.faqSubtitle')}
        </p>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="space-y-4 mb-8">
        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={faqUi.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500/70 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {faqUi.clear}
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {CATEGORIES.map(({ key, icon: Icon }) => {
            const isActive = activeCategory === key;
            const count =
              key === 'All'
                ? faqItems.length
                : faqItems.filter((i) => i.category === key).length;

            return (
              <button
                key={key}
                onClick={() => {
                  soundEngine.playPop();
                  setActiveCategory(key);
                }}
                className={`relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/70 hover:bg-white dark:hover:bg-slate-800'
                }`}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgb(147, 51, 234), rgb(99, 102, 241))',
                        boxShadow: '0 4px 14px rgba(147, 51, 234, 0.35)',
                      }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{categoryLabels[key]}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ Accordion List ── */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {faqUi.noResults.replace('{query}', searchQuery)}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-2 text-xs font-black text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              {faqUi.resetFilters}
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = openIds.has(item.id);
            const catColors = CATEGORY_COLORS[item.category];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl transition-all duration-300 overflow-hidden backdrop-blur-md ${
                  isOpen
                    ? 'bg-white/95 dark:bg-slate-800/95 border-2 border-purple-500/50 dark:border-purple-400/50 shadow-[0_4px_25px_rgba(168,85,247,0.12)]'
                    : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400/40 dark:hover:border-purple-500/40 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-xs'
                }`}
              >
                {/* Question Trigger Button */}
                <button
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${catColors.bg} ${catColors.text} ${catColors.border}`}
                    >
                      {categoryLabels[item.category]}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="shrink-0 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default TypingFAQ;
