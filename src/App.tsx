import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { LearnPage } from './pages/LearnPage';
import { LessonView } from './pages/LessonView';
import { PlayPage } from './pages/PlayPage';
import { PracticePage } from './pages/PracticePage';
import { ThemeProvider } from './context/ThemeContext';
import { FloatingControls } from './components/navigation/FloatingControls';
import { FloatingBot } from './components/navigation/FloatingBot';
import { LivingBackground } from './components/LivingBackground';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:lessonId" element={<LessonView />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/practice" element={<PracticePage />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isLearn = location.pathname.startsWith('/learn');
  const isPractice = location.pathname.startsWith('/practice');
  const isPlay = location.pathname.startsWith('/play');

  // Toggle body class for route-specific background styling
  useEffect(() => {
    if (isLearn) {
      document.body.classList.add('route-learn-active');
    } else {
      document.body.classList.remove('route-learn-active');
    }
    return () => {
      document.body.classList.remove('route-learn-active');
    };
  }, [isLearn]);

  return (
    <div
      data-route={isLearn ? 'learn' : undefined}
      className={`min-h-screen flex font-sans relative overflow-x-hidden ${
        isLearn ? 'night-mountains-theme' : ''
      }`}
    >
      {/* 3D Living Background Canvas (omitted on /learn to guarantee pure night theme) */}
      {!isLearn && <LivingBackground />}

      {/* Floating Theme & Sound Controls */}
      <FloatingControls
        className={`fixed top-4 right-4 z-50 flex flex-col items-center gap-3.5 ${
          isDashboard || isLearn || isPractice || isPlay ? 'hidden' : 'lg:top-5 lg:right-5'
        }`}
      />

      {/* Desktop Sidebar with Slide Toggle */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Floating Expand Button when Sidebar is Collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-5 left-5 z-50 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Expand Sidebar"
          aria-label="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Main content area */}
      <main
        className={`flex-1 flex flex-col min-h-screen relative z-10 pb-16 lg:pb-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarCollapsed ? 'w-full max-w-full px-6 lg:px-12 scale-[1.015] origin-top' : 'w-auto'
        }`}
      >
        <AnimatedRoutes />
      </main>

      {/* Floating AI Tutor Bot (BullBot) */}
      <FloatingBot />

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
