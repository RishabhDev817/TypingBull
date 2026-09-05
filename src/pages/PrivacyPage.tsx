import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle2, Mail, FileText } from 'lucide-react';
import { SiteFooter } from '../components/navigation/SiteFooter';

export const PrivacyPage: React.FC = () => {
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/25 dark:border-emerald-400/25 text-emerald-600 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy & Trust</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
              Last Updated: September 5, 2026 • Effective Date: January 1, 2026
            </p>
          </div>

          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Local-First Storage</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Your raw keystroke data and lesson completions reside securely inside your browser localStorage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Zero Data Selling</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  We never monetize, rent, or trade your practice telemetry or contact info to data brokers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">COPPA & GDPR Ready</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Kid-safe educational compliance ensuring safe touch typing instruction for students of all ages.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Legal Content */}
          <div className="p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>TypingBull</strong> ("we", "our", or "us"). We are committed to protecting the privacy of everyone who uses our typing tutorials, arcade gaming modes (such as <em>Lilypad Leap</em> and <em>Neon Velocity</em>), and AI diagnostic tools. This Privacy Policy outlines what information we collect, how it is used, and how you maintain total control over your typing practice history.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                2. Information We Collect
              </h2>
              <p>
                TypingBull operates under a <strong>privacy-first, local-storage architecture</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong>Keystroke Telemetry & Analytics:</strong> Timing intervals, characters per minute, error maps, and WPM stamina calculations are calculated locally within your web browser. This telemetry is stored in your device's <code>localStorage</code> to render your dashboard charts, streak counters, and star badges.
                </li>
                <li>
                  <strong>BullBot AI Coach Context:</strong> When you voluntarily interact with BullBot in the Chat Tutor interface, your conversation prompt along with aggregated diagnostic summaries (e.g., current WPM, target WPM, accuracy, weak finger zones) are securely transmitted to our backend API to communicate with Google Gemini. No personal identifying information is attached to these requests.
                </li>
                <li>
                  <strong>Technical & Server Logs:</strong> Like all standard web servers, our hosting infrastructure may temporarily log routine technical headers (e.g., IP addresses, browser user-agents) exclusively for security monitoring, fraud prevention, and uptime diagnostics.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                3. Children's Online Privacy Protection (COPPA Compliance)
              </h2>
              <p>
                We recognize the importance of safeguarding children's privacy. TypingBull modes such as <em>Lilypad Leap</em> and <em>The Great Typing Railway</em> are widely enjoyed by school students and early typists under the age of 13.
              </p>
              <p>
                We do <strong>not</strong> require children to register accounts or submit names, physical addresses, telephone numbers, or email addresses. All gameplay progress is stored locally on the student's browser device.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                4. Cookies & Local Storage
              </h2>
              <p>
                TypingBull uses HTML5 <code>localStorage</code> and lightweight session cookies solely to preserve essential platform functionality:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Remembering unlocked lesson progress and earned stars.</li>
                <li>Persisting dark/light color mode preferences.</li>
                <li>Remembering sound effect mute/unmute states.</li>
                <li>Maintaining daily practice streak calculations.</li>
              </ul>
              <p className="mt-2">
                You can clear this data at any moment by clicking "Clear Browsing Data" or clearing <code>localStorage</code> in your browser developer tools.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                5. Third-Party Service Providers
              </h2>
              <p>We work with trusted third-party providers to deliver our services:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong>Google Gemini API:</strong> Powers generative typing feedback in BullBot. Communication is protected via HTTPS and server-side authentication.
                </li>
                <li>
                  <strong>Google Fonts:</strong> Serves accessible typography (Nunito & JetBrains Mono) with cached font delivery.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                6. Your Rights (GDPR & CCPA)
              </h2>
              <p>
                Depending on your location, you hold statutory rights regarding your data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Right to Access:</strong> You can view all saved session scores on your Profile and Dashboard.</li>
                <li><strong>Right to Erasure:</strong> You can wipe all local storage anytime with no residual server copies.</li>
                <li><strong>Right to Non-Discrimination:</strong> TypingBull provides identical 100% free access to all learners regardless of data choices.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                7. Contact Us Regarding Privacy
              </h2>
              <p>
                If you have questions, inquiries, or privacy concerns regarding this Privacy Policy, please email our data protection team:
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 font-mono text-xs">
                Email: <strong>privacy@typingbull.com</strong>
              </div>
            </section>

          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PrivacyPage;
