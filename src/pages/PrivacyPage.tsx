import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle2, Mail, FileText } from 'lucide-react';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { useI18n } from '../context/I18nContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { SUBPAGES_I18N } from '../i18n/subpagesI18n';

export const PrivacyPage: React.FC = () => {
  const { currentLang } = useI18n();
  usePageSEO(currentLang);

  const t = SUBPAGES_I18N[currentLang]?.privacy || SUBPAGES_I18N.en.privacy;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-8 pb-24 w-full">
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
              <span>{t.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
              {t.updated}
            </p>
          </div>

          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">{t.card1Title}</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {t.card1Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">{t.card2Title}</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {t.card2Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white">{t.card3Title}</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {t.card3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Legal Content */}
          <div className="p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-md space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                {t.s1Title}
              </h2>
              <p>{t.s1Content}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                {t.s2Title}
              </h2>
              <p>{t.s2Content}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                {t.s3Title}
              </h2>
              <p>{t.s3Content}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                {t.s4Title}
              </h2>
              <p>{t.s4Content}</p>
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
