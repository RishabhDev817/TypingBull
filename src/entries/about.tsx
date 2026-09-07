import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nProvider } from '../context/I18nContext';
import { AboutPage } from '../pages/AboutPage';
import { FloatingBot } from '../components/navigation/FloatingBot';
import { LivingBackground } from '../components/LivingBackground';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <div className="min-h-screen flex font-sans relative overflow-x-hidden">
            <LivingBackground />
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
