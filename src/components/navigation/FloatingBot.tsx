import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Mascot } from '../Mascot';
import { AITutorReport } from '../AITutorReport';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';
import { FLOATING_BOT_I18N } from '../../i18n/tutorTranslations';

/** Routes where the user is actively typing: the bot must never cover the text, stats or game area. */
const FOCUS_ROUTES = /^\/(practice|play|practice-ground|classroom|learn\/)/;
const TIP_SEEN_KEY = 'tb_bot_tip_seen';

const hasSeenTip = () => {
  try {
    return localStorage.getItem(TIP_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

export const FloatingBot: React.FC = () => {
  const { currentLang } = useI18n();
  const { pathname } = useLocation();
  const isFocusRoute = FOCUS_ROUTES.test(pathname);
  const botUi = FLOATING_BOT_I18N[currentLang] || FLOATING_BOT_I18N.en;

  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasDismissedBubble, setHasDismissedBubble] = useState(hasSeenTip);

  const markTipSeen = () => {
    setHasDismissedBubble(true);
    try {
      localStorage.setItem(TIP_SEEN_KEY, '1');
    } catch {
      /* storage unavailable: the tip simply shows again next visit */
    }
  };

  // Greet once per browser, never on typing screens, then auto-hide
  useEffect(() => {
    if (isFocusRoute || hasDismissedBubble) {
      setShowBubble(false);
      return;
    }
    const timer = setTimeout(() => setShowBubble(true), 2000);
    const hideTimer = setTimeout(() => {
      setShowBubble(false);
      markTipSeen();
    }, 8500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [hasDismissedBubble, isFocusRoute]);

  const handleOpen = () => {
    soundEngine.playPop();
    setShowBubble(false);
    markTipSeen();
    setIsOpen(true);
  };

  return (
    <>
      <div className={`fixed right-3 lg:bottom-[16px] lg:right-[20px] z-40 flex flex-col items-end pointer-events-none ${isFocusRoute ? 'bottom-[88px]' : 'bottom-20'}`}>
        {/* Friendly speech greeting bubble */}
        <AnimatePresence>
          {showBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto hidden sm:block mb-2.5 max-w-[220px] p-3 rounded-2xl shadow-xl border text-xs font-bold leading-snug relative bg-white/90 dark:bg-slate-900/90 border-slate-200/90 dark:border-purple-500/30 text-slate-800 dark:text-slate-100 backdrop-blur-md"
              style={{
                boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 0 16px rgba(168, 85, 247, 0.12)',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                  markTipSeen();
                }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full after:absolute after:-inset-3 after:content-['']  bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-300 dark:border-white/20 text-[11px] shadow-xs cursor-pointer"
                aria-label="Dismiss message"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{botUi.tipTitle}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                {botUi.tipBody}
              </p>

              {/* Speech triangle pointing down to bot */}
              <div
                className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-white/90 dark:bg-slate-900/90 border-r border-b border-slate-200/90 dark:border-purple-500/30"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Small Floating Bot Icon / Pill */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleOpen}
          className={`pointer-events-auto group relative flex items-center gap-2.5 pl-2 ${isFocusRoute ? 'pr-2 opacity-60 sm:opacity-70 hover:opacity-100 focus-visible:opacity-100' : 'pr-2 sm:pr-3.5'} py-1.5 rounded-full shadow-xl transition-all cursor-pointer select-none bg-white/85 dark:bg-slate-900/85 border-2 border-white dark:border-slate-700/80 backdrop-blur-xl hover:border-purple-400 dark:hover:border-purple-500/60`}
          style={{
            boxShadow: '0 10px 28px -4px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.04), 0 0 16px rgba(168, 85, 247, 0.15)',
          }}
          title="Open BullBot — AI Typing Tutor & Analytics"
          aria-label="Open BullBot AI Tutor"
        >
          {/* Subtle Hover Aura Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/15 via-pink-400/15 to-amber-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Bot Avatar */}
          <div className="relative shrink-0">
            <Mascot mood="idle" size="xs" />

            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-1 ring-emerald-500/50 shadow-xs">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </div>

          {/* Bot Name & Subtitle */}
          <div className={`flex-col items-start pr-0.5 ${isFocusRoute ? 'hidden' : 'hidden sm:flex'}`}>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                BullBot
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xs">
                AI
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 leading-tight mt-0.5">
              {botUi.tutorLabel}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Global AI Tutor Report Modal */}
      <AITutorReport
        sessionResult={null}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetWpm={40}
        showReplayButtons={true}
      />
    </>
  );
};

export default FloatingBot;
