import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Download, RefreshCw, Save, Upload, X } from 'lucide-react';
import {
  applySnapshot, buildSnapshot, decodeProgress, encodeProgress, ProgressCodeError, summarize,
  type ProgressSnapshot, type ProgressSummary,
} from '../engine/progressCode';
import { soundEngine } from '../utils/audio';

interface ProgressBackupProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'save' | 'restore';

const describe = (s: ProgressSummary) =>
  `${s.lessonsCompleted} lesson${s.lessonsCompleted === 1 ? '' : 's'} completed · ${s.stars} star${s.stars === 1 ? '' : 's'} · ${s.sessions} session${s.sessions === 1 ? '' : 's'} · ${s.streak}-day streak`;

/**
 * Save and restore progress with a text code (or a file). There are no accounts: the code is the data,
 * so a learner can move to another device or browser, or keep a backup.
 * The dialog body mounts only while open, so every opening starts from fresh state.
 */
export const ProgressBackup: React.FC<ProgressBackupProps> = ({ open, onClose }) => (
  <AnimatePresence>{open && <BackupDialog onClose={onClose} />}</AnimatePresence>
);

const BackupDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<Tab>('save');
  const [code, setCode] = useState('');
  const snapshot = useMemo(() => buildSnapshot(), []);
  const mine: ProgressSummary = useMemo(() => summarize(snapshot), [snapshot]);
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState<{ snapshot: ProgressSnapshot; summary: ProgressSummary } | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  // Build this device's code when the dialog opens.
  useEffect(() => {
    let alive = true;
    encodeProgress(snapshot).then((c) => { if (alive) setCode(c); }).catch(() => { if (alive) setError('Could not create a code in this browser.'); });
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => { alive = false; window.clearTimeout(t); };
  }, [snapshot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const empty = mine.lessonsCompleted === 0 && mine.sessions === 0 && mine.stars === 0;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      codeRef.current?.select(); // Clipboard blocked: select the text so Ctrl/Cmd+C works.
      return;
    }
    soundEngine.playPop();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const download = () => {
    const blob = new Blob([`${code}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typingbull-progress-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const check = async (text: string) => {
    setError(''); setPending(null);
    if (!text.trim()) { setError('Paste your progress code first.'); return; }
    try {
      const snapshot = await decodeProgress(text);
      setPending({ snapshot, summary: summarize(snapshot) });
    } catch (err) {
      setError(err instanceof ProgressCodeError ? err.message : 'This code could not be read.');
    }
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_000_000) { setError('That file is too large to be a progress code.'); return; }
    file.text().then((text) => { setInput(text.trim()); void check(text); }).catch(() => setError('That file could not be read.'));
  };

  const restore = () => {
    if (!pending) return;
    try {
      applySnapshot(pending.snapshot);
    } catch {
      setError('Could not save to this browser. Check that storage is not blocked.');
      return;
    }
    soundEngine.playStarEarn();
    setDone(true);
    window.setTimeout(() => window.location.reload(), 900);
  };

  const tabBtn = (id: Tab, label: string, Icon: typeof Save) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => { setTab(id); setError(''); }}
      className={`flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-extrabold cursor-pointer transition-colors ${tab === id ? 'bg-primary text-white' : 'text-body hover:bg-white/10'}`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
        <motion.div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="progress-backup-title"
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-3xl border border-hairline p-5 sm:p-6 shadow-2xl"
            style={{ background: 'var(--color-canvas)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="progress-backup-title" className="text-lg font-extrabold text-ink">Save or restore your progress</h2>
                <p className="text-sm text-body font-semibold mt-1">No account needed. Your progress code is your backup, and works on any device.</p>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="shrink-0 w-11 h-11 -mr-2 -mt-2 inline-flex items-center justify-center rounded-full text-body hover:bg-white/10 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div role="tablist" className="mt-4 flex gap-2 p-1 rounded-2xl border border-hairline">
              {tabBtn('save', 'Save', Save)}
              {tabBtn('restore', 'Restore', Upload)}
            </div>

            {tab === 'save' && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-bold text-ink">{empty ? 'Nothing to save yet. Finish a lesson or a practice test first.' : describe(mine)}</p>
                {!empty && (
                  <>
                    <label htmlFor="progress-code-out" className="sr-only">Your progress code</label>
                    <textarea
                      id="progress-code-out" ref={codeRef} readOnly value={code} rows={4}
                      onFocus={(e) => e.currentTarget.select()}
                      className="w-full rounded-xl border border-hairline bg-black/20 p-3 text-xs font-mono text-ink break-all resize-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={copy} disabled={!code} className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm font-black cursor-pointer disabled:opacity-50">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy code'}
                      </button>
                      <button type="button" onClick={download} disabled={!code} className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full border border-hairline text-ink text-sm font-extrabold cursor-pointer hover:bg-white/10 disabled:opacity-50">
                        <Download className="w-4 h-4" /> Download file
                      </button>
                    </div>
                    <p className="text-xs text-body font-semibold">Keep this code somewhere safe, like a note or an email to yourself. Anyone with the code can load your progress.</p>
                  </>
                )}
              </div>
            )}

            {tab === 'restore' && (
              <div className="mt-4 space-y-3">
                <label htmlFor="progress-code-in" className="text-sm font-bold text-ink block">Paste your progress code</label>
                <textarea
                  id="progress-code-in" value={input} rows={4}
                  onChange={(e) => { setInput(e.target.value); setPending(null); setError(''); }}
                  placeholder="TB2...."
                  spellCheck={false} autoComplete="off" autoCapitalize="off"
                  className="w-full rounded-xl border border-hairline bg-black/20 p-3 text-xs font-mono text-ink break-all resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => check(input)} className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm font-black cursor-pointer">
                    <RefreshCw className="w-4 h-4" /> Check code
                  </button>
                  <label className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full border border-hairline text-ink text-sm font-extrabold cursor-pointer hover:bg-white/10">
                    <Upload className="w-4 h-4" /> Choose file
                    <input type="file" accept=".txt,text/plain" className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
                  </label>
                </div>

                {pending && !done && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-2" role="status">
                    <p className="text-sm font-extrabold text-ink">Code is valid</p>
                    <p className="text-sm text-body font-semibold">{describe(pending.summary)}</p>
                    {!empty && (
                      <p className="text-xs font-bold text-amber-500">This replaces the progress on this device ({describe(mine)}). Save a code first if you want to keep it.</p>
                    )}
                    <button type="button" onClick={restore} className="min-h-11 px-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-black cursor-pointer">
                      <Check className="w-4 h-4" /> Replace progress on this device
                    </button>
                  </div>
                )}
                {done && <p className="text-sm font-extrabold text-emerald-500" role="status">Progress restored. Reloading…</p>}
              </div>
            )}

            {error && <p role="alert" className="mt-3 text-sm font-bold text-rose-500">{error}</p>}
          </motion.div>
        </motion.div>
  );
};

export default ProgressBackup;
