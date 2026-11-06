import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { usePageSEO } from '../hooks/usePageSEO';
import { useI18n } from '../context/I18nContext';
import { ROUTE_META } from '../seo/routeMeta';
import { AVERAGE_SPEED_FAQ } from '../seo/pageFaqs';
import { SPEED_BANDS, TARGETS_BY_PURPOSE, bandForWpm } from '../seo/typingStats';

const rangeLabel = (min: number, max: number) => (Number.isFinite(max) ? `${min}–${max - 1}` : `${min}+`);

export const AverageTypingSpeedPage: React.FC = () => {
  const { currentLang } = useI18n();
  usePageSEO({
    lang: currentLang,
    canonicalPath: ROUTE_META.averageTypingSpeed.path,
    title: ROUTE_META.averageTypingSpeed.title,
    description: ROUTE_META.averageTypingSpeed.description,
  });

  const [value, setValue] = useState('');
  const wpm = Number.parseInt(value, 10);
  const band = Number.isFinite(wpm) && wpm >= 0 ? bandForWpm(wpm) : null;
  const next = band ? SPEED_BANDS[SPEED_BANDS.findIndex((b) => b.id === band.id) + 1] : undefined;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-8 pb-24 w-full space-y-10">
        <header className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left">
          <div className="shrink-0"><Mascot mood={band && band.min >= 55 ? 'cheering' : 'happy'} size="lg" /></div>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
              Average typing speed: what is a good WPM?
            </h1>
            <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 max-w-2xl">
              Most adults type around 40 words per minute. Professional jobs usually expect 50 to 70, and fast typists
              reach 80 or more. Here is how each speed compares, and what to aim for.
            </p>
          </div>
        </header>

        <section className="card-game card-static p-6 sm:p-8 space-y-4" aria-labelledby="check-heading">
          <h2 id="check-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Where does your speed fit?
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-black text-slate-800 dark:text-slate-100">
              Your WPM
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={300}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 45"
                className="block mt-1 w-32 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-base font-bold text-slate-900 dark:text-white"
              />
            </label>
            <Link
              to="/typing-test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black transition-colors"
            >
              Don't know it? Take the free test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {band && (
            <p role="status" className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <strong>{band.title}.</strong> {band.blurb}{next ? ` Next level: ${next.title}, from ${next.min} WPM (${next.min - wpm} more).` : ''}
            </p>
          )}
        </section>

        <section className="space-y-4" aria-labelledby="bands-heading">
          <h2 id="bands-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Typing speed levels
          </h2>
          <div className="card-game card-static overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Typing speed levels in words per minute</caption>
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th scope="col" className="p-4">Level</th>
                  <th scope="col" className="p-4">Words per minute</th>
                  <th scope="col" className="p-4">What it means</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-800 dark:text-slate-100">
                {SPEED_BANDS.map((b) => (
                  <tr key={b.id} aria-current={band?.id === b.id ? 'true' : undefined} className={`border-t border-slate-200/70 dark:border-slate-700/60 ${band?.id === b.id ? 'bg-purple-500/15' : ''}`}>
                    <th scope="row" className="p-4 font-black">{b.title}<span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{b.label}</span></th>
                    <td className="p-4 whitespace-nowrap">{rangeLabel(b.min, b.max)}</td>
                    <td className="p-4">{b.blurb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Ranges are rules of thumb based on commonly cited typing research, not exact cut-offs. Speeds are net WPM
            (correct characters divided by five, per minute).
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="jobs-heading">
          <h2 id="jobs-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            What typing speed do jobs ask for?
          </h2>
          <div className="card-game card-static overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Typical typing speed targets by purpose</caption>
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th scope="col" className="p-4">Purpose</th>
                  <th scope="col" className="p-4">Typical WPM</th>
                  <th scope="col" className="p-4">Note</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-slate-800 dark:text-slate-100">
                {TARGETS_BY_PURPOSE.map((r) => (
                  <tr key={r.purpose} className="border-t border-slate-200/70 dark:border-slate-700/60">
                    <th scope="row" className="p-4 font-black">{r.purpose}</th>
                    <td className="p-4 whitespace-nowrap">{r.wpm}</td>
                    <td className="p-4">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-game card-static p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">How to raise your typing speed</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200">
            <li>Learn proper finger placement. The <Link to="/guidelines" className="text-purple-600 dark:text-purple-300 underline underline-offset-2">touch typing guide</Link> shows which finger owns each key.</li>
            <li>Follow a structured course such as the <Link to="/learn" className="text-purple-600 dark:text-purple-300 underline underline-offset-2">Great Typing Railway</Link> instead of repeating random text.</li>
            <li>Practise accuracy first. Speed comes once mistakes stop breaking your rhythm.</li>
            <li>Practise 15 to 20 minutes daily rather than one long session a week.</li>
            <li>Re-take the <Link to="/typing-test" className="text-purple-600 dark:text-purple-300 underline underline-offset-2">typing test</Link> weekly and compare your trend.</li>
          </ol>
        </section>

        <section aria-labelledby="faq-heading" className="space-y-4">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Typing speed questions
          </h2>
          <div className="space-y-3">
            {AVERAGE_SPEED_FAQ.map((f) => (
              <details key={f.question} className="card-game card-static p-5">
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
      </main>
      <SiteFooter />
    </div>
  );
};

export default AverageTypingSpeedPage;
