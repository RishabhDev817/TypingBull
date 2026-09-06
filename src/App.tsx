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
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isLearn = location.pathname.startsWith('/learn');

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

      {/* Persistent Top-Right Utility Cluster Across All Routes */}
      <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-50 pointer-events-auto">
        <FloatingControls
          className="flex flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg"
          showLabel={false}
          showLanguageSwitcher={true}
        />
      </div>

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

      {/* Main content area with pb-24 for BullBot clearance */}
      <main
        className={`flex-1 flex flex-col min-h-screen relative z-10 pb-24 lg:pb-24 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
      <I18nProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
