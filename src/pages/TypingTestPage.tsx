import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SceneBanner } from '../components/SceneBanner';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { usePageSEO } from '../hooks/usePageSEO';
import { useI18n } from '../context/I18nContext';
import { ROUTE_META } from '../seo/routeMeta';
import { TYPING_TEST_FAQ } from '../seo/pageFaqs';

const TypingTest = lazy(() => import('../components/TypingTest'));

export const TypingTestPage: React.FC = () => {
  const { currentLang } = useI18n();
  const [showingResult, setShowingResult] = useState(false);
  usePageSEO({
    lang: currentLang,
    canonicalPath: ROUTE_META.typingTest.path,
    title: ROUTE_META.typingTest.title,
    description: ROUTE_META.typingTest.description,
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-8 pb-24 w-full space-y-10">
        <SceneBanner title="Free typing test" mood="typing" hideMascot={showingResult}>
          Check your typing speed in words per minute (WPM) and your accuracy.
          <span className="hidden sm:inline"> Pick a length, type the words, and see your result the moment the timer ends.</span>
        </SceneBanner>

        <Suspense fallback={<div className="card-game card-static h-72 animate-pulse" aria-hidden="true" />}>
          <TypingTest onPhaseChange={(p) => setShowingResult(p === 'done')} />
        </Suspense>

        <section className="card-game card-static p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">How the typing test works</h2>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
            You get a stream of common English words. The timer starts on your first keystroke and stops when time is up.
            Your speed is the number of correct characters divided by five, per minute, so a mistake you leave in the text
            lowers your score. Accuracy is the share of your key presses that were correct. Pasting is blocked, so the
            number reflects your real typing.
          </p>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
            Not sure what your score means? See the{' '}
            <Link to="/average-typing-speed" className="text-purple-600 dark:text-purple-300 underline underline-offset-2">
              average typing speed by level
            </Link>{' '}
            to compare yourself with other typists and with common job requirements.
          </p>
        </section>

        <section className="card-game card-static p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Tips for a better score</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
            <li>Rest your fingers on the home row (ASDF and JKL;) and let each finger own its keys.</li>
            <li>Look at the words, not at the keyboard.</li>
            <li>Aim for 95% accuracy or higher first. Speed follows once errors stop interrupting your rhythm.</li>
            <li>Keep a steady pace rather than bursts and pauses.</li>
            <li>Take the test at the same time each day and compare your trend, not a single run.</li>
          </ul>
        </section>

        <section aria-labelledby="faq-heading" className="space-y-4">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Typing test questions
          </h2>
          <div className="space-y-3">
            {TYPING_TEST_FAQ.map((f) => (
              <details key={f.question} className="card-game card-static p-5 group">
                <summary className="cursor-pointer font-black text-slate-900 dark:text-white text-sm sm:text-base">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm sm:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="card-game card-static p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Want to get faster?</h2>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Learn touch typing step by step, free.
            </p>
          </div>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black transition-colors"
          >
            Start the course <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TypingTestPage;
