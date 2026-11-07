import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { RotateCcw, Timer, Target, Zap, Share2, ArrowRight } from 'lucide-react';
import { Mascot } from './Mascot';
import { SpeedGauge } from './SpeedGauge';
import { STANDARD_WORDS, getRandomWords } from '../utils/words';
import { PASTE_GUARD_PROPS, isBulkInsert } from '../utils/typingGuard';
import { calcAccuracy, calcWpm, bandForWpm } from '../seo/typingStats';
import { getSessions, getStreakData, saveSession } from '../engine/sessionStore';

// The share dialog (image card, X / WhatsApp / LinkedIn, download) loads only when someone opens it
const ShareScoreModal = lazy(() => import('./social/ShareScoreModal').then((m) => ({ default: m.ShareScoreModal })));

/** Counts up to `target` over `ms`, or jumps straight there when the visitor prefers reduced motion. */
function useCountUp(target: number | null, ms = 900): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || target === 0) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return target === null ? 0 : value;
}

const DURATIONS = [
  { seconds: 30, label: '30 sec' },
  { seconds: 60, label: '1 min' },
  { seconds: 180, label: '3 min' },
  { seconds: 300, label: '5 min' },
] as const;

export type Phase = 'idle' | 'running' | 'done';

interface Result {
  wpm: number;
  accuracy: number;
  correctChars: number;
  mistakes: number;
  seconds: number;
  /** WPM of the previous typing test on this device, if any. */
  lastWpm: number | null;
  /** Best earlier WPM on this device, if any. */
  bestWpm: number | null;
  streak: number;
  /** Keys missed most often, worst first (letters only, at most three). */
  missedKeys: string[];
}

/** Random common words; with `keys`, only words that contain at least one of those keys (for a key drill). */
const makeText = (words = 120, keys: string[] = []) => {
  const pool = keys.length ? STANDARD_WORDS.filter((w) => keys.some((k) => w.includes(k))) : STANDARD_WORDS;
  return getRandomWords(pool.length >= 12 ? pool : STANDARD_WORDS, words).join(' ') + ' ';
};

/** A self-contained timed typing test. Net WPM = correct characters / 5 per minute. */
export const TypingTest: React.FC<{ onPhaseChange?: (phase: Phase) => void }> = ({ onPhaseChange }) => {
  const [duration, setDuration] = useState<number>(60);
  const [text, setText] = useState<string>(() => makeText());
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState<number>(60);
  // null until enough time has passed for a meaningful number (early WPM spikes are noise)
  const [liveWpm, setLiveWpm] = useState<number | null>(null);
  const [liveAcc, setLiveAcc] = useState(100);
  const [result, setResult] = useState<Result | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [focusKeys, setFocusKeys] = useState<string[]>([]);
  const [isTouch] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches);
  const errorsRef = useRef<Record<string, number>>({});
  const totalsRef = useRef<Record<string, number>>({});
  const doneAtRef = useRef(0);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef(0);
  const keystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const typedRef = useRef('');
  const textRef = useRef(text);
  // Mirror state into refs for the timer callbacks (updated after each render)
  useEffect(() => {
    textRef.current = text;
    typedRef.current = typed;
  }, [text, typed]);

  const netCorrect = useCallback((t: string, target: string) => {
    let c = 0;
    for (let i = 0; i < t.length; i++) if (t[i] === target[i]) c++;
    return c;
  }, []);

  // Desktop keyboards start typing straight away; on touch screens a tap opens the keyboard instead.
  useEffect(() => {
    if (window.matchMedia?.('(pointer: fine)').matches) inputRef.current?.focus();
  }, []);

  const finish = useCallback(() => {
    const target = textRef.current;
    const t = typedRef.current;
    const elapsed = Math.min(Date.now() - startRef.current, duration * 1000);
    const correct = netCorrect(t, target);
    const total = keystrokesRef.current;

    let lastWpm: number | null = null;
    let bestWpm: number | null = null;
    try {
      const earlier = getSessions().filter((s) => s.modeDetail?.startsWith('typing-test'));
      if (earlier.length) {
        lastWpm = earlier[0].wpm;
        bestWpm = Math.max(...earlier.map((s) => s.wpm));
      }
    } catch {
      /* storage unavailable */
    }

    const wpm = calcWpm(correct, elapsed);
    const accuracy = calcAccuracy(correctKeystrokesRef.current, total);
    const mistakes = total - correctKeystrokesRef.current;
    const missedKeys = Object.entries(errorsRef.current)
      .filter(([k, n]) => n > 0 && /^[a-z]$/i.test(k))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k.toLowerCase());
    let streak = 0;
    try {
      saveSession({
        id: `typing-test_${startRef.current}`,
        mode: 'practice',
        modeDetail: `typing-test-${duration}s`,
        startTime: startRef.current,
        endTime: startRef.current + elapsed,
        durationMs: elapsed,
        totalKeystrokes: Math.max(1, total),
        correctKeystrokes: correctKeystrokesRef.current,
        incorrectKeystrokes: mistakes,
        backspaceCount: 0,
        wpm,
        accuracy,
        perKeyErrors: { ...errorsRef.current },
        perKeyTotal: { ...totalsRef.current },
        bigramErrors: {},
        bigramTotal: {},
        pauseCount: 0,
        avgPausePerKey: {},
        starsEarned: 0,
        content: '',
        wpmWindows: [],
      });
      streak = getStreakData().currentStreak;
    } catch {
      /* storage may be unavailable (private mode); the on-screen result still works */
    }
    setResult({ wpm, accuracy, correctChars: correct, mistakes, seconds: Math.round(elapsed / 1000), lastWpm, bestWpm, streak, missedKeys });
    setPhase('done');
  }, [duration, netCorrect]);

  // Countdown
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setRemaining(Math.max(0, duration - Math.floor(elapsed / 1000)));
      setLiveWpm(elapsed >= 5000 ? calcWpm(netCorrect(typedRef.current, textRef.current), elapsed) : null);
      setLiveAcc(calcAccuracy(correctKeystrokesRef.current, keystrokesRef.current));
      if (elapsed >= duration * 1000) finish();
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, duration, finish, netCorrect]);

  // Keep the active line on the second row so the next words stay readable
  useEffect(() => {
    const box = boxRef.current;
    const el = activeRef.current;
    if (box && el) box.scrollTop = Math.max(0, el.offsetTop - 40);
  }, [typed]);

  const reset = useCallback((seconds = duration, keys: string[] = []) => {
    setDuration(seconds);
    setFocusKeys(keys);
    errorsRef.current = {};
    totalsRef.current = {};
    setText(makeText(120, keys));
    setTyped('');
    setPhase('idle');
    setRemaining(seconds);
    setLiveWpm(null);
    setLiveAcc(100);
    setResult(null);
    setShareOpen(false);
    keystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [duration]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase === 'done') return;
    const next = e.target.value;
    if (isBulkInsert(typed, next)) return;
    if (phase === 'idle' && next.length > 0) {
      startRef.current = Date.now();
      setPhase('running');
    }
    if (next.length === typed.length + 1) {
      keystrokesRef.current += 1;
      const expected = text[next.length - 1];
      totalsRef.current[expected] = (totalsRef.current[expected] ?? 0) + 1;
      if (next[next.length - 1] === expected) correctKeystrokesRef.current += 1;
      else errorsRef.current[expected] = (errorsRef.current[expected] ?? 0) + 1;
    }
    setTyped(next);
    // Keep an endless supply of words ahead of the cursor
    if (next.length > text.length - 150) setText((t) => t + makeText(60, focusKeys));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      reset(duration, focusKeys);
    }
  };

  // Enter on the result screen starts another test (short delay so a stray key at the buzzer does not skip the result)
  useEffect(() => {
    if (phase !== 'done') return;
    doneAtRef.current = Date.now();
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== 'Enter' || Date.now() - doneAtRef.current < 700) return;
      if (t && (t.closest('a, button, input, textarea, [role=dialog]'))) return;
      e.preventDefault();
      reset(duration, focusKeys);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, reset, duration, focusKeys]);

  const shownWpm = useCountUp(phase === 'done' && result ? result.wpm : null);
  const chars = useMemo(() => text.split(''), [text]);
  const band = result ? bandForWpm(result.wpm) : null;
  const lowAccuracy = result !== null && result.accuracy < 50;
  const shaky = result !== null && result.accuracy >= 50 && result.accuracy < 85;
  const resultTitle = band ? (shaky ? 'Accuracy first' : band.title) : '';
  const canShare = result !== null && result.wpm > 0 && !lowAccuracy;

  let progressNote = '';
  if (result) {
    if (result.bestWpm === null) progressNote = 'Your first result is saved on this device. Test again later to watch it climb.';
    else if (result.wpm > result.bestWpm) progressNote = `New personal best! That is ${result.wpm - result.bestWpm} WPM faster than before.`;
    else if (result.lastWpm !== null && result.wpm > result.lastWpm) progressNote = `${result.wpm - result.lastWpm} WPM faster than your last test.`;
    else if (result.lastWpm !== null) progressNote = `Your best is ${result.bestWpm} WPM. Want to beat it?`;
  }

  return (
    <>
    <section aria-label="Typing speed test" className="card-game card-static card-halo-purple p-5 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Test length" className="flex flex-nowrap gap-1.5 sm:gap-2 overflow-x-auto">
          {DURATIONS.map((d) => (
            <button
              key={d.seconds}
              type="button"
              disabled={phase === 'running'}
              onClick={() => reset(d.seconds)}
              aria-pressed={duration === d.seconds}
              className={`min-h-11 px-3 sm:px-4 shrink-0 rounded-full text-sm font-black border transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
                duration === d.seconds
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-600/70 hover:border-purple-500'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        {phase !== 'done' && (
          <div className="flex items-center gap-4 text-sm font-black text-slate-800 dark:text-slate-100">
            <span className="inline-flex items-center gap-1.5"><Timer className="w-4 h-4 text-purple-500" aria-hidden="true" />{remaining}s</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />{liveWpm === null ? '--' : liveWpm} WPM</span>
            <span className="inline-flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-500" aria-hidden="true" />{liveAcc}%</span>
          </div>
        )}
      </div>

      {phase !== 'done' && (
        <div
          className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 p-4 sm:p-5 cursor-text focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-shadow"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            ref={boxRef}
            id="typing-test-text"
            className="relative h-[6.75rem] overflow-hidden font-mono text-lg sm:text-xl leading-9 text-slate-600 dark:text-slate-300 select-none break-words"
          >
            {chars.map((ch, i) => {
              const isActive = i === typed.length;
              let cls = '';
              if (i < typed.length) {
                cls = typed[i] === ch
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'font-black text-white bg-rose-600/80 rounded underline decoration-wavy decoration-rose-200';
              } else if (isActive) cls = 'bg-purple-500/25 rounded text-slate-900 dark:text-white';
              return (
                <span key={i} ref={isActive ? activeRef : undefined} className={cls}>
                  {ch}
                </span>
              );
            })}
          </div>
          <label className="sr-only" htmlFor="typing-test-input">
            Type the words shown above. Press Escape to restart.
          </label>
          <input
            id="typing-test-input"
            ref={inputRef}
            value={typed}
            onChange={onChange}
            onKeyDown={onKeyDown}
            aria-describedby="typing-test-text"
            {...PASTE_GUARD_PROPS}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
          />
          <p className="mt-3 min-h-[2.75rem] text-sm font-bold text-slate-600 dark:text-slate-300">
            {focusKeys.length > 0 && phase === 'idle'
              ? `Key drill: ${focusKeys.map((k) => k.toUpperCase()).join(', ')}. Pick a length above to go back to normal words.`
              : phase === 'idle'
              ? isTouch
                ? 'Tap the box, then start typing. The timer starts on your first key.'
                : 'Start typing to begin. The timer starts on your first key.'
              : isTouch
              ? 'Tap Restart to start over.'
              : 'Esc restarts the test.'}
          </p>
        </div>
      )}

      {phase === 'done' && result && band && (
        <div role="status" aria-live="polite" className="space-y-6">
          <p className="sr-only">
            Time is up. You typed {result.wpm} words per minute with {result.accuracy} percent accuracy. {band.title}.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
            <div className="shrink-0"><Mascot mood={band.mood} size="md" /></div>
            <div className="text-center sm:text-left space-y-1.5 min-w-0">
              <h2 aria-hidden="true" className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none tabular-nums">
                {shownWpm}<span className="text-xl sm:text-2xl ml-2 text-slate-500 dark:text-slate-300">WPM</span>
              </h2>
              <p className="text-lg font-black text-purple-700 dark:text-purple-300">{resultTitle}</p>
              <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 max-w-md">
                {lowAccuracy
                  ? 'That one did not go to plan, and that is fine. Try again slowly and aim for correct keys, not speed.'
                  : shaky
                  ? 'You have the speed. Slow down a little: accurate typing turns into fast typing.'
                  : band.encourage}
              </p>
              {progressNote && (
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">{progressNote}</p>
              )}
            </div>
          </div>

          {/* Actions sit right under the number so they stay above the fold on phones */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <Link
              to="/learn"
              className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-base font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              Learn to type faster, free <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <div className={`grid gap-3 ${canShare ? 'grid-cols-2' : 'grid-cols-1'} sm:flex`}>
              {canShare && (
                <button
                  type="button"
                  aria-label="Share result"
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-full border border-slate-300 dark:border-slate-600 text-sm font-black whitespace-nowrap text-slate-800 dark:text-slate-100 hover:border-purple-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                >
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  Share
                </button>
              )}
              <button
                type="button"
                onClick={() => reset(duration, focusKeys)}
                className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-black whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          </div>
          <p className="hidden sm:block text-xs font-bold text-slate-500 dark:text-slate-400 -mt-3">Press Enter to try again.</p>

          <SpeedGauge wpm={result.wpm} />

          <div className="flex flex-row flex-wrap items-center justify-center sm:justify-start gap-3">
            <Orb halo="card-halo-green" label="Accuracy" value={`${result.accuracy}%`} />
            <Orb halo="card-halo-blue" label="Correct" value={`${result.correctChars}`} />
            <Orb halo="card-halo-pink" label={result.mistakes === 1 ? 'Mistake' : 'Mistakes'} value={`${result.mistakes}`} />
          </div>

          {result.missedKeys.length > 0 && (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Keys to practise:{' '}
                {result.missedKeys.map((k) => (
                  <kbd key={k} className="mx-0.5 inline-block min-w-7 px-2 py-0.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center font-mono font-black">
                    {k.toUpperCase()}
                  </kbd>
                ))}
              </p>
              <button
                type="button"
                onClick={() => reset(duration, result.missedKeys)}
                className="inline-flex items-center justify-center min-h-11 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-black whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              >
                Drill these keys
              </button>
            </div>
          )}

          {result.accuracy < 95 && result.accuracy >= 50 && (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Accuracy under 95%: fixing mistakes costs more time than typing carefully.
            </p>
          )}

          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Saved on this device.
            {result.wpm > 0 && (
              <>
                {' '}
                <Link to="/average-typing-speed" className="font-black text-purple-700 dark:text-purple-300 underline underline-offset-2">
                  See how {result.wpm} WPM compares
                </Link>
              </>
            )}
          </p>
        </div>
      )}

      {phase !== 'done' && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset(duration, focusKeys)}
            className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Restart
          </button>
        </div>
      )}
    </section>
    {shareOpen && result && band &&
      createPortal(
        <Suspense fallback={null}>
          <ShareScoreModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            wpm={result.wpm}
            accuracy={result.accuracy}
            modeName={`${duration}s typing test`}
            rankTitle={band.title}
          />
        </Suspense>,
        document.body,
      )}
    </>
  );
};

const Orb: React.FC<{ label: string; value: string; halo: string; icon?: React.ReactNode }> = ({ label, value, halo, icon }) => (
  <div
    style={{ borderRadius: '50%' }}
    className={`w-24 h-24 card-game ${halo} flex flex-col items-center justify-center p-1.5 text-center shrink-0 shadow-md`}
  >
    <span className="text-2xl font-black text-ink leading-none">{value}</span>
    <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-extrabold text-body leading-none">
      {icon}{label}
    </span>
  </div>
);

export default TypingTest;
