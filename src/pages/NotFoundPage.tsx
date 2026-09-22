import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Gamepad2 } from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { usePageSEO } from '../hooks/usePageSEO';
import { soundEngine } from '../utils/audio';

export const NotFoundPage: React.FC = () => {
  usePageSEO({
    title: '404 — Page Not Found | TypingBull',
    description: "The page you're looking for doesn't exist or has moved. Return to TypingBull to practice touch-typing.",
    noindex: true,
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent">
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-6 max-w-lg"
        >
          {/* Mascot */}
          <div className="flex justify-center">
            <div className="p-4 rounded-3xl bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/15 dark:border-slate-700/50 shadow-2xl">
              <Mascot mood="thinking" size="lg" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 text-xs font-black uppercase tracking-wider">
            <span>Error 404</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Oops! The page you’re looking for doesn’t exist, has been relocated, or the link may have been entered incorrectly.
          </p>

          {/* Action Links */}
          <div className="pt-4 flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              onClick={() => soundEngine.playPop()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:from-pink-400 hover:to-purple-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/learn"
              onClick={() => soundEngine.playPop()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum</span>
            </Link>

            <Link
              to="/practice-ground"
              onClick={() => soundEngine.playPop()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Practice Ground</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFoundPage;
