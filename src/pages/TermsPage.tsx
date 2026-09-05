import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileCheck, Shield, CheckCircle, Mail } from 'lucide-react';
import { SiteFooter } from '../components/navigation/SiteFooter';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-8 pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/25 dark:border-blue-400/25 text-blue-600 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Platform Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
              Last Updated: September 5, 2026 • Version 2.0
            </p>
          </div>

          {/* Key Guidelines Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Free Usage</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Free access granted for personal typing development, schools, coding bootcamps, and home educators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Fair Gameplay</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Automated macro typing scripts or artificial score manipulation undermine the educational community.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Safety & Ergonomics</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Take regular wrist breaks and practice healthy posture. Listen to your body and avoid repetitive strain.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Legal Sections */}
          <div className="p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using <strong>TypingBull</strong> (including our website, curriculum modules, games such as <em>Lilypad Leap</em> and <em>Neon Velocity</em>, and the <em>BullBot</em> AI chat coach), you agree to be bound by these Terms & Conditions. If you do not agree to all terms, please refrain from using the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                2. Educational License & Permitted Use
              </h2>
              <p>
                TypingBull grants you a non-exclusive, non-transferable, revocable license to access and practice touch typing for personal, educational, and classroom purposes. Teachers, schools, and coding academies are expressly welcome to integrate TypingBull into curricula at no cost.
              </p>
              <p>
                You may not sublicense, sell, copy, mirror, or commercially exploit any software binaries, audio assets, or custom game code without our prior written consent.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                3. Intellectual Property Rights
              </h2>
              <p>
                All original software, game designs, visual illustrations, character mascots (including BullBot and Lilypad animations), audio compositions, and lesson structures are the proprietary property of TypingBull and are protected by applicable intellectual property laws.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                4. User Conduct & Integrity
              </h2>
              <p>
                To maintain a fair, motivating environment for all typists, you agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Deploy automated keystroke bots, scrapers, or browser spoofing extensions to fake WPM records.</li>
                <li>Attempt to reverse-engineer, decompile, or tamper with the client-side typing engine.</li>
                <li>Interfere with server infrastructure or attempt unauthorized access to backend API endpoints.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                5. AI Tutor & Ergonomic Advice Disclaimer
              </h2>
              <p>
                The AI Typing Tutor ("BullBot") provides automated insights, training recommendations, and encouragement powered by generative language models. This guidance is intended strictly for educational self-improvement. It does not constitute medical advice for repetitive strain injuries (RSI) or physical ergonomics. Typists experiencing hand or wrist pain should seek advice from a licensed medical professional.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                6. Disclaimer of Warranties
              </h2>
              <p>
                TypingBull is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee that the service will be entirely uninterrupted, bug-free, or compatible with every browser environment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                7. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, TypingBull and its contributors shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of or inability to use our services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                8. Contact Information
              </h2>
              <p>
                For questions concerning these Terms & Conditions or institutional licensing inquiries, please reach out to:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 font-mono text-xs">
                Email: <strong>legal@typingbull.com</strong>
              </div>
            </section>

          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TermsPage;
