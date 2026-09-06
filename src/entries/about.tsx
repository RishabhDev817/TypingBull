import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nProvider } from '../context/I18nContext';
import { AboutPage } from '../pages/AboutPage';
import { FloatingControls } from '../components/navigation/FloatingControls';
import { FloatingBot } from '../components/navigation/FloatingBot';
import { LivingBackground } from '../components/LivingBackground';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <div className="min-h-screen flex font-sans relative overflow-x-hidden">
            <LivingBackground />
            <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-50 pointer-events-auto">
              <FloatingControls
                className="flex flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg"
                showLabel={false}
                showLanguageSwitcher={true}
              />
            </div>
            <main className="flex-1 flex flex-col min-h-screen relative z-10 pb-24 lg:pb-24">
              <AboutPage />
            </main>
            <FloatingBot />
          </div>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>
);
