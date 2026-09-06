import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Gamepad2, Keyboard, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Mascot } from '../Mascot';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed: externalCollapsed, onToggle }) => {
  const { t } = useI18n();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('nav.home'), color: '#2196F3' },
    { to: '/guidelines', icon: Info, label: t('nav.guidelines'), color: '#9C27B0' },
    { to: '/learn', icon: BookOpen, label: t('nav.learn'), color: '#4CAF50' },
    { to: '/play', icon: Gamepad2, label: t('nav.play'), color: '#FF4081' },
    { to: '/practice', icon: Keyboard, label: t('nav.practice'), color: '#FF9800' },
  ];

  const toggleSidebar = () => {
    soundEngine.playPop();
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 hidden lg:flex flex-col w-64 shrink-0 h-screen transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? '-translate-x-full !w-0 !px-0 overflow-hidden' : 'translate-x-0'
      }`}
      style={{
        background: 'var(--color-sidebar-bg)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRight: '1px solid var(--color-sidebar-border)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* Toggle Button attached to right edge */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-4 z-50 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Logo with mascot */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline/50">
        <Mascot mood="happy" size="xs" />
        <div className="flex flex-col">
          <h1 className="font-extrabold text-base tracking-tight leading-none text-ink">
            Typing<span className="text-primary">Bull</span>
          </h1>
          <span className="text-[10px] text-body font-bold uppercase tracking-widest leading-none mt-0.5">
            typing coach
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => soundEngine.playPop()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-body hover:text-ink hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: `linear-gradient(135deg, ${color}, ${color}dd)`, boxShadow: `0 4px 12px ${color}40` }
                : {}
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 6, scale: 1.02 }}
                whileTap={{ scale: 0.93, rotate: -1 }}
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-200"
                  style={{ color: isActive ? 'white' : 'var(--color-mute)' }}
                />
                <span className={isActive ? 'text-white' : 'text-body font-bold'}>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
