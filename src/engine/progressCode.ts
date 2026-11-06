/**
 * Progress code: export a learner's progress as a single text code (or file) and restore it on
 * another device or browser. No account or server is involved: the code is the data.
 *
 * Format: "TB2.<base64url(gzip(json))>.<checksum>" (or "TB1.<base64url(json)>.<checksum>" when the
 * browser can't compress). The checksum catches typos and truncated copies. On restore, the data is
 * validated and clamped; only known storage keys are ever written.
 */
import { PROGRESS_KEYS } from './sessionStore.ts';

const NEON_HIGH_SCORE_KEY = 'typingbull_neon_velocity_highscore';
const MAX_CODE_CHARS = 2_000_000;

export interface ProgressData {
  sessions: unknown[];
  lessons: Array<{ lessonId: number; completed: boolean; bestAccuracy: number; bestWpm: number; starsEarned: number; attempts: number }>;
  streak: { currentStreak: number; lastActiveDate: string; longestStreak: number; totalSessions: number } | null;
  weakKeys: { errors: Record<string, number>; totals: Record<string, number>; bigramErrors: Record<string, number>; bigramTotals: Record<string, number> } | null;
  highScore: number | null;
  skipAhead: boolean;
  neonHighScore: number | null;
}

export interface ProgressSnapshot {
  v: 1;
  createdAt: string;
  data: ProgressData;
}

export interface ProgressSummary {
  lessonsCompleted: number;
  stars: number;
  sessions: number;
  streak: number;
}

export class ProgressCodeError extends Error {}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// ─── Helpers ───────────────────────────────────────────────────────

const clamp = (n: unknown, min: number, max: number): number => {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
  return Math.min(max, Math.max(min, v));
};
const int = (n: unknown, min: number, max: number): number => Math.round(clamp(n, min, max));
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function readJson(storage: StorageLike, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** FNV-1a, 32 bit, as 8 hex characters. Not security: it only detects damaged codes. */
export function checksum(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  // A damaged code makes the stream fail; the error is reported when reading, so don't let these
  // write/close promises raise a second, unhandled rejection.
  writer.write(bytes as unknown as BufferSource).catch(() => {});
  writer.close().catch(() => {});
  return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}

// ─── Snapshot: read, validate, apply ───────────────────────────────

export function buildSnapshot(storage: StorageLike = localStorage, now: Date = new Date()): ProgressSnapshot {
  return validateSnapshot({
    v: 1,
    createdAt: now.toISOString(),
    data: {
      sessions: readJson(storage, PROGRESS_KEYS.sessions),
      lessons: readJson(storage, PROGRESS_KEYS.lessons),
      streak: readJson(storage, PROGRESS_KEYS.streak),
      weakKeys: readJson(storage, PROGRESS_KEYS.weakKeys),
      highScore: Number(storage.getItem(PROGRESS_KEYS.highScore)) || null,
      skipAhead: storage.getItem(PROGRESS_KEYS.skipAhead) === '1',
      neonHighScore: Number(storage.getItem(NEON_HIGH_SCORE_KEY)) || null,
    },
  });
}

function cleanCounts(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!isObj(v)) return out;
  for (const [k, n] of Object.entries(v).slice(0, 3000)) {
    if (k.length <= 4 && typeof n === 'number' && Number.isFinite(n)) out[k] = int(n, 0, 1e9);
  }
  return out;
}

const cleanText = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');

function cleanSession(s: Record<string, unknown>): Record<string, unknown> {
  const windows = Array.isArray(s.wpmWindows) ? s.wpmWindows.slice(0, 200) : [];
  const avgPause: Record<string, number> = {};
  if (isObj(s.avgPausePerKey)) {
    for (const [k, n] of Object.entries(s.avgPausePerKey).slice(0, 3000)) {
      if (k.length <= 4 && typeof n === 'number' && Number.isFinite(n)) avgPause[k] = clamp(n, 0, 1e7);
    }
  }
  return {
    id: cleanText(s.id, 80) || `restored-${Math.round(clamp(s.startTime, 0, 1e15))}`,
    mode: cleanText(s.mode, 20) || 'practice',
    modeDetail: cleanText(s.modeDetail, 80),
    startTime: clamp(s.startTime, 0, 1e15),
    endTime: clamp(s.endTime, 0, 1e15),
    durationMs: clamp(s.durationMs, 0, 1e9),
    totalKeystrokes: int(s.totalKeystrokes, 0, 1e7),
    correctKeystrokes: int(s.correctKeystrokes, 0, 1e7),
    incorrectKeystrokes: int(s.incorrectKeystrokes, 0, 1e7),
    backspaceCount: int(s.backspaceCount, 0, 1e7),
    wpm: clamp(s.wpm, 0, 500),
    accuracy: clamp(s.accuracy, 0, 100),
    perKeyErrors: cleanCounts(s.perKeyErrors),
    perKeyTotal: cleanCounts(s.perKeyTotal),
    bigramErrors: cleanCounts(s.bigramErrors),
    bigramTotal: cleanCounts(s.bigramTotal),
    pauseCount: int(s.pauseCount, 0, 1e7),
    avgPausePerKey: avgPause,
    starsEarned: int(s.starsEarned, 0, 3),
    content: cleanText(s.content, 3000),
    wpmWindows: windows
      .filter(isObj)
      .map((w, i) => ({ windowIndex: int(w.windowIndex ?? i, 0, 10000), wpm: clamp(w.wpm, 0, 500), correctChars: int(w.correctChars, 0, 1e6) })),
  };
}

/** Turns untrusted data into a safe snapshot, dropping anything unknown or out of range. */
export function validateSnapshot(input: unknown): ProgressSnapshot {
  if (!isObj(input) || input.v !== 1 || !isObj(input.data)) {
    throw new ProgressCodeError('This code is not a TypingBull progress code.');
  }
  const d = input.data;

  const lessonsIn = Array.isArray(d.lessons) ? d.lessons.slice(0, 800) : [];
  const seen = new Set<number>();
  const lessons: ProgressData['lessons'] = [];
  for (const l of lessonsIn) {
    if (!isObj(l)) continue;
    const lessonId = int(l.lessonId, 0, 5000);
    if (lessonId < 1 || seen.has(lessonId)) continue;
    seen.add(lessonId);
    lessons.push({
      lessonId,
      completed: l.completed === true,
      bestAccuracy: clamp(l.bestAccuracy, 0, 100),
      bestWpm: clamp(l.bestWpm, 0, 500),
      starsEarned: int(l.starsEarned, 0, 3),
      attempts: int(l.attempts, 0, 100000),
    });
  }

  // Sessions are rebuilt field by field into the exact shape the app expects, so a hand-edited or
  // damaged code can never crash a screen (e.g. the weak-key panel reads every per-key map).
  const sessions = (Array.isArray(d.sessions) ? d.sessions : [])
    .filter((s): s is Record<string, unknown> => isObj(s) && typeof s.wpm === 'number' && typeof s.accuracy === 'number' && typeof s.startTime === 'number' && typeof s.modeDetail === 'string')
    .slice(0, 20)
    .map((s) => cleanSession(s));

  let streak: ProgressData['streak'] = null;
  if (isObj(d.streak)) {
    const date = typeof d.streak.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.streak.lastActiveDate) ? d.streak.lastActiveDate : '';
    streak = {
      currentStreak: int(d.streak.currentStreak, 0, 100000),
      lastActiveDate: date,
      longestStreak: int(d.streak.longestStreak, 0, 100000),
      totalSessions: int(d.streak.totalSessions, 0, 10_000_000),
    };
  }

  let weakKeys: ProgressData['weakKeys'] = null;
  if (isObj(d.weakKeys)) {
    weakKeys = {
      errors: cleanCounts(d.weakKeys.errors),
      totals: cleanCounts(d.weakKeys.totals),
      bigramErrors: cleanCounts(d.weakKeys.bigramErrors),
      bigramTotals: cleanCounts(d.weakKeys.bigramTotals),
    };
  }

  return {
    v: 1,
    createdAt: typeof input.createdAt === 'string' ? input.createdAt.slice(0, 40) : new Date(0).toISOString(),
    data: {
      sessions,
      lessons,
      streak,
      weakKeys,
      highScore: typeof d.highScore === 'number' && d.highScore > 0 ? clamp(d.highScore, 0, 500) : null,
      skipAhead: d.skipAhead === true,
      neonHighScore: typeof d.neonHighScore === 'number' && d.neonHighScore > 0 ? int(d.neonHighScore, 0, 1e8) : null,
    },
  };
}

export function summarize(snapshot: ProgressSnapshot): ProgressSummary {
  const done = snapshot.data.lessons.filter((l) => l.completed);
  return {
    lessonsCompleted: done.length,
    stars: snapshot.data.lessons.reduce((sum, l) => sum + l.starsEarned, 0),
    sessions: snapshot.data.streak?.totalSessions ?? snapshot.data.sessions.length,
    streak: snapshot.data.streak?.currentStreak ?? 0,
  };
}

/** Replaces this device's progress with the snapshot. Only known keys are written. */
export function applySnapshot(snapshot: ProgressSnapshot, storage: StorageLike = localStorage): void {
  const safe = validateSnapshot(snapshot);
  const set = (key: string, value: unknown) => storage.setItem(key, JSON.stringify(value));
  set(PROGRESS_KEYS.sessions, safe.data.sessions);
  set(PROGRESS_KEYS.lessons, safe.data.lessons);
  if (safe.data.streak) set(PROGRESS_KEYS.streak, safe.data.streak); else storage.removeItem(PROGRESS_KEYS.streak);
  if (safe.data.weakKeys) set(PROGRESS_KEYS.weakKeys, safe.data.weakKeys); else storage.removeItem(PROGRESS_KEYS.weakKeys);
  if (safe.data.highScore) storage.setItem(PROGRESS_KEYS.highScore, String(safe.data.highScore)); else storage.removeItem(PROGRESS_KEYS.highScore);
  if (safe.data.skipAhead) storage.setItem(PROGRESS_KEYS.skipAhead, '1'); else storage.removeItem(PROGRESS_KEYS.skipAhead);
  if (safe.data.neonHighScore) storage.setItem(NEON_HIGH_SCORE_KEY, String(safe.data.neonHighScore)); else storage.removeItem(NEON_HIGH_SCORE_KEY);
}

// ─── Code: encode and decode ───────────────────────────────────────

export async function encodeProgress(snapshot: ProgressSnapshot): Promise<string> {
  const json = JSON.stringify(snapshot);
  const raw = new TextEncoder().encode(json);
  if (typeof CompressionStream === 'function') {
    const payload = toBase64Url(await pipe(raw, new CompressionStream('gzip')));
    return `TB2.${payload}.${checksum(payload)}`;
  }
  const payload = toBase64Url(raw);
  return `TB1.${payload}.${checksum(payload)}`;
}

export async function decodeProgress(code: string): Promise<ProgressSnapshot> {
  const text = code.replace(/\s+/g, '');
  if (text.length > MAX_CODE_CHARS) throw new ProgressCodeError('This code is too large to be a TypingBull progress code.');
  const match = /^(TB1|TB2)\.([A-Za-z0-9_-]+)\.([0-9a-f]{8})$/.exec(text);
  if (!match) {
    if (/^TB[12]\./.test(text)) throw new ProgressCodeError('This code looks damaged or incomplete. Copy the whole code again from the original device.');
    throw new ProgressCodeError('This does not look like a TypingBull progress code. Copy the whole code, including the TB2. at the start.');
  }
  const [, kind, payload, sum] = match;
  if (checksum(payload) !== sum) throw new ProgressCodeError('This code looks damaged or incomplete. Copy it again from the original device.');
  let bytes: Uint8Array;
  try {
    bytes = fromBase64Url(payload);
    if (kind === 'TB2') {
      if (typeof DecompressionStream !== 'function') throw new ProgressCodeError('This browser is too old to open this code. Try an up-to-date browser.');
      bytes = await pipe(bytes, new DecompressionStream('gzip'));
    }
  } catch (err) {
    if (err instanceof ProgressCodeError) throw err;
    throw new ProgressCodeError('This code could not be read. Copy it again from the original device.');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new ProgressCodeError('This code could not be read. Copy it again from the original device.');
  }
  return validateSnapshot(parsed);
}
