import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Gamepad2, Keyboard, Info, Sparkles, School, Timer, MoreHorizontal, MessageSquareHeart } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';
import { stripLocaleFromPathname } from '../../i18n/utils';
import { useFeedback } from '../../context/FeedbackContext';

export const BottomNav: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const normalizedCurrentPath = stripLocaleFromPathname(location.pathname);
  const [moreOpen, setMoreOpen] = useState(false);
  const { openFeedback } = useFeedback();

  // Five primary destinations fit a phone without truncated labels; the rest live under "More".
  const primary = [
    { to: '/', icon: LayoutDashboard, label: t('nav.home'), color: '#2196F3' },
    { to: '/learn', icon: BookOpen, label: t('nav.learn'), color: '#4CAF50' },
    { to: '/play', icon: Gamepad2, label: t('nav.play'), color: '#FF4081' },
    { to: '/typing-test', icon: Timer, label: t('nav.typingTestShort'), color: '#10B981' },
  ];
  const more = [
    { to: '/practice', icon: Keyboard, label: t('nav.practice'), color: '#FF9800' },
    { to: '/guidelines', icon: Info, label: t('nav.guidelines'), color: '#9C27B0' },
    { to: '/classroom', icon: School, label: t('nav.classroom') || 'Classroom', color: '#3B82F6' },
    { to: '/roadmap', icon: Sparkles, label: t('nav.roadmap'), color: '#06B6D4' },
  ];
  const isActive = (to: string) => {
    if (to === '/') return normalizedCurrentPath === '/';
    // The speed-benchmark page belongs to the Test section
    if (to === '/typing-test') return normalizedCurrentPath.startsWith('/typing-test') || normalizedCurrentPath.startsWith('/average-typing-speed');
    return normalizedCurrentPath.startsWith(to);
  };
  const moreActive = more.some((m) => isActive(m.to));

  // Escape closes the menu (links close it themselves on click)
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  const itemClass = 'flex-1 min-w-0 min-h-14 flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-2xl transition-all';
  const icon = (Icon: React.ElementType, color: string, active: boolean) => (
    <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${active ? 'shadow-md' : ''}`} style={active ? { background: `${color}25` } : {}}>
      <Icon className="w-5 h-5" style={{ color: active ? color : 'var(--color-mute)' }} aria-hidden="true" />
    </div>
  );
  const labelEl = (text: string, color: string, active: boolean) => (
    <span className="w-full truncate text-center text-xs leading-tight font-bold mt-0.5" style={{ color: active ? color : 'var(--color-mute)' }}>{text}</span>
  );

  return (
    <>
      {moreOpen && (
        <>
          <button type="button" aria-label="Close menu" className="lg:hidden fixed inset-0 z-40 cursor-default" onClick={() => setMoreOpen(false)} />
          <div
            id="bottom-nav-more"
            role="menu"
            className="lg:hidden fixed z-50 left-3 right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] rounded-2xl border-2 border-hairline p-2 grid grid-cols-2 gap-1 shadow-xl"
            style={{ background: 'var(--color-sidebar-bg)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)' }}
          >
            {more.map(({ to, icon: Icon, label, color }) => (
              <NavLink
                key={to}
                to={to}
                role="menuitem"
                onClick={() => { soundEngine.playPop(); setMoreOpen(false); }}
                className="flex items-center gap-3 min-h-12 px-3 rounded-xl text-sm font-bold text-ink hover:bg-black/5 dark:hover:bg-white/10"
              >
                <Icon className="w-5 h-5 shrink-0" style={{ color }} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => { soundEngine.playPop(); setMoreOpen(false); openFeedback('feature_request', 'bottom_nav'); }}
              className="col-span-2 flex items-center gap-3 min-h-12 px-3 rounded-xl text-sm font-bold text-ink hover:bg-black/5 dark:hover:bg-white/10 text-left"
            >
              <MessageSquareHeart className="w-5 h-5 shrink-0 text-purple-500" aria-hidden="true" />
              {t('nav.feedback') || 'Feedback & Review'}
            </button>
          </div>
        </>
      )}
      <nav
        aria-label="Main"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-hairline"
        style={{ background: 'var(--color-sidebar-bg)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)' }}
      >
        <div className="flex items-stretch px-1 pb-[env(safe-area-inset-bottom,0px)]">
          {primary.map(({ to, icon: Icon, label, color }) => {
            const active = isActive(to);
            return (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => { soundEngine.playPop(); setMoreOpen(false); }} className={itemClass}>
                <motion.div className="flex flex-col items-center w-full min-w-0" whileTap={{ scale: 0.85 }} tabIndex={-1}>
                  {icon(Icon, color, active)}
                  {labelEl(label, color, active)}
                  {active && <motion.div layoutId="bottomNavDot" className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: color }} />}
                </motion.div>
              </NavLink>
            );
          })}
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls="bottom-nav-more"
            onClick={() => { soundEngine.playPop(); setMoreOpen((v) => !v); }}
            className={itemClass}
          >
            <motion.div className="flex flex-col items-center w-full min-w-0" whileTap={{ scale: 0.85 }} tabIndex={-1}>
              {icon(MoreHorizontal, '#7C3AED', moreActive || moreOpen)}
              {labelEl(t('nav.more'), '#7C3AED', moreActive || moreOpen)}
              {moreActive && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: '#7C3AED' }} />}
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
