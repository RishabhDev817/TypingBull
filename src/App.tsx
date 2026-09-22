import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { FloatingBot } from './components/navigation/FloatingBot';
import { stripLocaleFromPathname } from './i18n/utils';

// Route-level code-splitting to eliminate monolithic bundle
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const LessonView = lazy(() => import('./pages/LessonView'));
const PlayPage = lazy(() => import('./pages/PlayPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LivingBackground = lazy(() => import('./components/LivingBackground'));

function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const normalizedPathname = stripLocaleFromPathname(location.pathname);
  const normalizedLocation = { ...location, pathname: normalizedPathname };

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={normalizedLocation} key={normalizedPathname}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/guide" element={<Navigate to="/guidelines" replace />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:lessonId" element={<LessonView />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/play/practice-ground" element={<Navigate to="/practice-ground" replace />} />
          <Route path="/practice-ground" element={<PlayPage />} />
          <Route path="/multiplayer" element={<Navigate to="/practice-ground" replace />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/classroom" element={<ClassroomPage />} />
          <Route path="/classroom/create" element={<ClassroomPage />} />
          <Route path="/classroom/join" element={<ClassroomPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/coming-soon" element={<Navigate to="/roadmap" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const normalizedPathname = stripLocaleFromPathname(location.pathname);
  const isLearn = normalizedPathname.startsWith('/learn');

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
        className={`flex-1 min-w-0 flex flex-col min-h-screen relative z-10 pb-24 lg:pb-24 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarCollapsed
            ? 'w-full max-w-full px-6 lg:px-12 scale-[1.015] origin-top lg:ml-0'
            : 'w-auto lg:ml-64'
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
        <FeedbackProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </FeedbackProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
