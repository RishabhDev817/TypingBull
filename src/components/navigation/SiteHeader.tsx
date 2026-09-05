import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Gamepad2,
  BookOpen,
  Keyboard,
  Info,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Mascot } from '../Mascot';
import { useTheme } from '../../context/ThemeContext';
import { soundEngine } from '../../utils/audio';

interface SiteHeaderProps {
  className?: string;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ className = '' }) => {
  const { activeTheme, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState(() => soundEngine.muted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    soundEngine.playPop();
    const nextMute = !isMuted;
    soundEngine.setMute(nextMute);
    setIsMuted(nextMute);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/play', label: 'Play', icon: Gamepad2 },
    { to: '/practice', label: 'Practice', icon: Keyboard },
    { to: '/guidelines', label: 'Guide', icon: Info },
    { to: '/about', label: 'About', icon: Users },
    { to: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => soundEngine.playPop()}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <Mascot mood="happy" size="xs" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none">
              Typing<span className="text-purple-600 dark:text-purple-400">Bull</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mt-0.5">
              Typing Coach
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => soundEngine.playPop()}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls (Theme, Sound, Mobile Menu) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
            className="p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-transform active:scale-90"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              soundEngine.playPop();
              toggleTheme();
            }}
            aria-label="Toggle dark/light theme"
            title="Toggle theme"
            className="p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-amber-500 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-transform active:scale-90"
          >
            {activeTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => {
                    soundEngine.playPop();
                    setMobileMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
