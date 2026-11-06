import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Timer, Target, Zap } from 'lucide-react';
import { STANDARD_WORDS, getRandomWords } from '../utils/words';
import { PASTE_GUARD_PROPS, isBulkInsert } from '../utils/typingGuard';
import { calcAccuracy, calcWpm, bandForWpm } from '../seo/typingStats';
import { saveSession } from '../engine/sessionStore';

const DURATIONS = [
  { seconds: 30, label: '30 sec' },
  { seconds: 60, label: '1 min' },
  { seconds: 180, label: '3 min' },
  { seconds: 300, label: '5 min' },
] as const;

type Phase = 'idle' | 'running' | 'done';

interface Result {
  wpm: number;
  accuracy: number;
  correctChars: number;
  mistakes: number;
  seconds: number;
}

const makeText = (words = 120) => getRandomWords(STANDARD_WORDS, words).join(' ') + ' ';

/** A self-contained timed typing test. Net WPM = correct characters / 5 per minute. */
export const TypingTest: React.FC = () => {
  const [duration, setDuration] = useState<number>(60);
  const [text, setText] = useState<string>(() => makeText());
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState<number>(60);
  const [liveWpm, setLiveWpm] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

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

  const finish = useCallback(() => {
    const target = textRef.current;
    const t = typedRef.current;
    const elapsed = Math.min(Date.now() - startRef.current, duration * 1000);
    const correct = netCorrect(t, target);
    const total = keystrokesRef.current;
    const res: Result = {
      wpm: calcWpm(correct, elapsed),
      accuracy: calcAccuracy(correctKeystrokesRef.current, total),
      correctChars: correct,
      mistakes: total - correctKeystrokesRef.current,
      seconds: Math.round(elapsed / 1000),
    };
    setResult(res);
    setPhase('done');
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
        incorrectKeystrokes: res.mistakes,
        backspaceCount: 0,
        wpm: res.wpm,
        accuracy: res.accuracy,
        perKeyErrors: {},
        perKeyTotal: {},
        bigramErrors: {},
        bigramTotal: {},
        pauseCount: 0,
        avgPausePerKey: {},
        starsEarned: 0,
        content: '',
        wpmWindows: [],
      });
    } catch {
      /* storage may be unavailable (private mode); the on-screen result still works */
    }
  }, [duration, netCorrect]);

  // Countdown
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, duration - Math.floor(elapsed / 1000));
      setRemaining(left);
      setLiveWpm(calcWpm(netCorrect(typedRef.current, textRef.current), elapsed));
      if (elapsed >= duration * 1000) finish();
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, duration, finish, netCorrect]);

  // Keep the active character in view
  useEffect(() => {
    const box = boxRef.current;
    const el = activeRef.current;
    if (box && el) box.scrollTop = Math.max(0, el.offsetTop - 36);
  }, [typed]);

  const reset = useCallback((seconds = duration) => {
    setDuration(seconds);
    setText(makeText());
    setTyped('');
    setPhase('idle');
    setRemaining(seconds);
    setLiveWpm(0);
    setResult(null);
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
      if (next[next.length - 1] === text[next.length - 1]) correctKeystrokesRef.current += 1;
    }
    setTyped(next);
    // Keep an endless supply of words ahead of the cursor
    if (next.length > text.length - 150) setText((t) => t + makeText(60));
  };

  const chars = useMemo(() => text.split(''), [text]);
  const band = result ? bandForWpm(result.wpm) : null;

  return (
    <section aria-label="Typing speed test" className="card-frosted-standard p-5 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Test length" className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.seconds}
              type="button"
              disabled={phase === 'running'}
              onClick={() => reset(d.seconds)}
              aria-pressed={duration === d.seconds}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition-colors disabled:opacity-50 ${
                duration === d.seconds
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-600/70 hover:border-purple-500'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm font-black text-slate-800 dark:text-slate-100" aria-live="off">
          <span className="inline-flex items-center gap-1.5"><Timer className="w-4 h-4 text-purple-500" />{remaining}s</span>
          <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" />{liveWpm} WPM</span>
        </div>
      </div>

      {phase !== 'done' && (
        <div
          className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 p-4 sm:p-5 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            ref={boxRef}
            className="h-[7.5rem] overflow-hidden font-mono text-lg sm:text-xl leading-9 text-slate-500 dark:text-slate-400 select-none break-words"
            aria-hidden="true"
          >
            {chars.map((ch, i) => {
              const isActive = i === typed.length;
              let cls = '';
              if (i < typed.length) cls = typed[i] === ch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 bg-rose-500/15 rounded';
              else if (isActive) cls = 'bg-purple-500/25 rounded text-slate-900 dark:text-white';
              return (
                <span key={i} ref={isActive ? activeRef : undefined} className={cls}>
                  {ch}
                </span>
              );
            })}
          </div>
          <label className="sr-only" htmlFor="typing-test-input">Type the text shown above</label>
          <input
            id="typing-test-input"
            ref={inputRef}
            value={typed}
            onChange={onChange}
            {...PASTE_GUARD_PROPS}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
            placeholder="Start typing"
          />
          {phase === 'idle' && (
            <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
              Click the box and start typing. The timer starts on your first key.
            </p>
          )}
        </div>
      )}

      {phase === 'done' && result && band && (
        <div className="space-y-5" role="status">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Stat label="Speed" value={`${result.wpm}`} unit="WPM" />
            <Stat label="Accuracy" value={`${result.accuracy}`} unit="%" />
            <Stat label="Correct characters" value={`${result.correctChars}`} />
            <Stat label="Mistakes" value={`${result.mistakes}`} />
          </div>
          <div className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 flex gap-3">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-300 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              <strong>{band.label}.</strong> {band.blurb}{' '}
              {result.accuracy < 95 && 'Your accuracy is below 95%: slow down slightly, since fixing mistakes costs more time than typing carefully.'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {phase === 'done' ? 'Try again' : 'Restart'}
        </button>
      </div>
    </section>
  );
};

const Stat: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
  <div className="rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 p-4">
    <div className="text-3xl font-black text-slate-900 dark:text-white">
      {value}
      {unit && <span className="text-sm ml-1 text-slate-500 dark:text-slate-400">{unit}</span>}
    </div>
    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">{label}</div>
  </div>
);

export default TypingTest;
