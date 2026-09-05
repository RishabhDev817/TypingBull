import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, BookOpen, Gamepad2 } from 'lucide-react';
import { Mascot } from '../Mascot';
import { soundEngine } from '../../utils/audio';

export const SiteFooter: React.FC = () => {
  const onLinkClick = () => {
    soundEngine.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-16 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Col 1 & 2: Brand overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              onClick={onLinkClick}
              className="inline-flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Mascot mood="happy" size="xs" />
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none block">
                  Typing<span className="text-purple-600 dark:text-purple-400">Bull</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">
                  Smart Typing Coach
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              Empowering learners worldwide through gamified cognitive touch typing. Featuring The Great Typing Railway, Lilypad Leap, Neon Velocity, and BullBot real-time keystroke diagnostics.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free & Open Access Education</span>
            </div>
          </div>

          {/* Col 3: Curriculum & Games */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-pink-500" />
              <span>Modes & Play</span>
            </h3>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link
                  to="/learn"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  The Great Typing Railway
                </Link>
              </li>
              <li>
                <Link
                  to="/play"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Lilypad Leap (Kids Mode)
                </Link>
              </li>
              <li>
                <Link
                  to="/play"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Neon Velocity (Arcade)
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Timed Practice Arena
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Finger Placement Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Diagnostics */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a
                  href="/#faq-section-title"
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  FAQ & Knowledge Base
                </a>
              </li>
              <li>
                <a
                  href="/#faq-section-title"
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  WPM Speed Benchmarks
                </a>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Ergonomics & Posture
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                >
                  Developer Syntax Drills
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal (Key SEO Routes) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>Company & Legal</span>
            </h3>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link
                  to="/about"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  onClick={onLinkClick}
                  className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} TypingBull. All rights reserved. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for typists of all ages.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/privacy" onClick={onLinkClick} className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" onClick={onLinkClick} className="hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link to="/about" onClick={onLinkClick} className="hover:underline">
              About
            </Link>
            <span>•</span>
            <Link to="/contact" onClick={onLinkClick} className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
