import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'auto' | 'day' | 'night';
export type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  activeTheme: ActiveTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tb_theme_mode');
    return (saved as ThemeMode) || 'night';
  });

  const getAutoTheme = (): ActiveTheme => {
    const hour = new Date().getHours();
    // Night is between 7:30 PM (19.5) and 6:00 AM
    return hour < 6 || hour >= 19 ? 'dark' : 'light';
  };

  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(() => {
    if (mode === 'day') return 'light';
    if (mode === 'night') return 'dark';
    return getAutoTheme();
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('tb_theme_mode', newMode);
  };

  const toggleTheme = () => {
    if (activeTheme === 'light') {
      setMode('night');
    } else {
      setMode('day');
    }
  };

  useEffect(() => {
    const updateActiveTheme = () => {
      let nextActive: ActiveTheme = 'light';
      if (mode === 'day') {
        nextActive = 'light';
      } else if (mode === 'night') {
        nextActive = 'dark';
      } else {
        nextActive = getAutoTheme();
      }

      setActiveTheme(nextActive);
      document.documentElement.setAttribute('data-theme', nextActive);
      if (nextActive === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateActiveTheme();

    // Check every minute if in auto mode
    const interval = setInterval(() => {
      if (mode === 'auto') {
        updateActiveTheme();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
