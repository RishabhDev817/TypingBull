import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Gamepad2, Keyboard, Info } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', color: '#2196F3' },
  { to: '/guidelines', icon: Info, label: 'Guide', color: '#9C27B0' },
  { to: '/learn', icon: BookOpen, label: 'Learn', color: '#4CAF50' },
  { to: '/play', icon: Gamepad2, label: 'Play', color: '#FF4081' },
  { to: '/practice', icon: Keyboard, label: 'Practice', color: '#FF9800' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-hairline"
      style={{
        background: 'var(--color-sidebar-bg)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => soundEngine.playPop()}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all"
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.85 }}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                    isActive ? 'shadow-md' : ''
                  }`}
                  style={isActive ? { background: `${color}25` } : {}}
                >
                  <Icon className="w-5 h-5" style={{ color: isActive ? color : 'var(--color-mute)' }} />
                </div>
                <span
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: isActive ? color : 'var(--color-mute)' }}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavDot"
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
