import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Gamepad2, Keyboard, Info, Sparkles, School, Timer } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';
import { stripLocaleFromPathname } from '../../i18n/utils';

export const BottomNav: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const normalizedCurrentPath = stripLocaleFromPathname(location.pathname);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('nav.home'), color: '#2196F3' },
    { to: '/guidelines', icon: Info, label: t('nav.guidelines'), color: '#9C27B0' },
    { to: '/learn', icon: BookOpen, label: t('nav.learn'), color: '#4CAF50' },
    { to: '/play', icon: Gamepad2, label: t('nav.play'), color: '#FF4081' },
    { to: '/practice', icon: Keyboard, label: t('nav.practice'), color: '#FF9800' },
    { to: '/typing-test', icon: Timer, label: t('nav.typingTestShort'), color: '#10B981' },
    { to: '/classroom', icon: School, label: t('nav.classroom') || 'Classroom', color: '#3B82F6' },
    { to: '/roadmap', icon: Sparkles, label: t('nav.roadmap'), color: '#06B6D4' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-hairline"
      style={{
        background: 'var(--color-sidebar-bg)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      }}
    >
      <div className="flex items-stretch h-16 px-1 pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map(({ to, icon: Icon, label, color }) => {
          const isItemActive = to === '/' ? normalizedCurrentPath === '/' : normalizedCurrentPath.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => soundEngine.playPop()}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-2xl transition-all"
            >
              <motion.div
                className="flex flex-col items-center w-full min-w-0"
                whileTap={{ scale: 0.85 }}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                    isItemActive ? 'shadow-md' : ''
                  }`}
                  style={isItemActive ? { background: `${color}25` } : {}}
                >
                  <Icon className="w-5 h-5" style={{ color: isItemActive ? color : 'var(--color-mute)' }} />
                </div>
                <span
                  className="w-full truncate text-center text-[10px] leading-tight font-bold mt-0.5"
                  style={{ color: isItemActive ? color : 'var(--color-mute)' }}
                >
                  {label}
                </span>
                {isItemActive && (
                  <motion.div
                    layoutId="bottomNavDot"
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
