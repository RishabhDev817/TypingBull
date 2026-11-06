import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applySnapshot, buildSnapshot, checksum, decodeProgress, encodeProgress, ProgressCodeError, summarize, validateSnapshot,
} from '../src/engine/progressCode.ts';

/** Minimal in-memory localStorage. */
function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    dump: () => Object.fromEntries(map),
  };
}

const lessons = Array.from({ length: 120 }, (_, i) => ({
  lessonId: i + 1, completed: i < 100, bestAccuracy: 96.5, bestWpm: 42, starsEarned: (i % 3) + 1, attempts: 2,
}));
const session = { id: 's1', mode: 'practice', modeDetail: 'practice-lvl1', startTime: 1_700_000_000_000, endTime: 1_700_000_060_000, wpm: 41, accuracy: 97.2, content: 'The morning sun' };
const fullStorage = () => fakeStorage({
  typingbull_lessons: JSON.stringify(lessons),
  typingbull_sessions: JSON.stringify([session]),
  typingbull_streak: JSON.stringify({ currentStreak: 5, lastActiveDate: '2026-11-05', longestStreak: 9, totalSessions: 33 }),
  typingbull_weakkeys: JSON.stringify({ errors: { q: 4 }, totals: { q: 20 }, bigramErrors: { th: 1 }, bigramTotals: { th: 9 } }),
  typing_bull_high_score: '61',
  typingbull_skip_ahead: '1',
  typingbull_neon_velocity_highscore: '4200',
  unrelated_key: 'must never be exported',
});

test('round trip: export then import restores the same progress', async () => {
  const code = await encodeProgress(buildSnapshot(fullStorage()));
  assert.match(code, /^TB[12]\.[A-Za-z0-9_-]+\.[0-9a-f]{8}$/);
  const target = fakeStorage();
  applySnapshot(await decodeProgress(code), target);
  const out = target.dump();
  assert.equal(JSON.parse(out.typingbull_lessons).length, 120);
  assert.equal(JSON.parse(out.typingbull_streak).currentStreak, 5);
  assert.equal(out.typing_bull_high_score, '61');
  assert.equal(out.typingbull_skip_ahead, '1');
  assert.equal(out.typingbull_neon_velocity_highscore, '4200');
  assert.equal(JSON.parse(out.typingbull_sessions)[0].wpm, 41);
});

test('the code is compact for a learner with 120 lessons', async () => {
  const code = await encodeProgress(buildSnapshot(fullStorage()));
  assert.ok(code.length < 8000, `code length ${code.length}`);
});

test('only progress keys are exported or written', async () => {
  const snapshot = buildSnapshot(fullStorage());
  assert.equal(JSON.stringify(snapshot).includes('must never be exported'), false);
  const target = fakeStorage({ unrelated_key: 'keep me' });
  applySnapshot(snapshot, target);
  assert.equal(target.dump().unrelated_key, 'keep me');
  assert.deepEqual(Object.keys(target.dump()).filter((k) => !k.startsWith('typing')), ['unrelated_key']);
});

test('summary counts lessons, stars, sessions and streak', () => {
  const s = summarize(buildSnapshot(fullStorage()));
  assert.equal(s.lessonsCompleted, 100);
  assert.equal(s.sessions, 33);
  assert.equal(s.streak, 5);
  assert.ok(s.stars > 100);
});

test('damaged, truncated or foreign codes are rejected with a clear error', async () => {
  const code = await encodeProgress(buildSnapshot(fullStorage()));
  await assert.rejects(() => decodeProgress(code.slice(0, -20)), ProgressCodeError);
  await assert.rejects(() => decodeProgress(code.replace('.', '.AA')), ProgressCodeError);
  await assert.rejects(() => decodeProgress('hello world'), ProgressCodeError);
  await assert.rejects(() => decodeProgress(''), ProgressCodeError);
  await assert.rejects(() => decodeProgress('TB2.' + 'A'.repeat(50) + '.' + checksum('A'.repeat(50))), ProgressCodeError);
});

test('whitespace and line breaks from copy and paste are ignored', async () => {
  const code = await encodeProgress(buildSnapshot(fullStorage()));
  const wrapped = code.replace(/(.{60})/g, '$1\n  ');
  const snapshot = await decodeProgress(wrapped);
  assert.equal(snapshot.data.lessons.length, 120);
});

test('hostile data is clamped and unknown fields are dropped', () => {
  const snapshot = validateSnapshot({
    v: 1,
    createdAt: 'x'.repeat(500),
    evil: '<script>',
    data: {
      lessons: [
        { lessonId: 1, completed: true, bestAccuracy: 9999, bestWpm: -5, starsEarned: 99, attempts: 1e12, extra: 'x' },
        { lessonId: 1, completed: true },
        { lessonId: -4 },
        'not an object',
      ],
      sessions: [{ wpm: 'fast', accuracy: 1, startTime: 1, modeDetail: 'x' }, session],
      streak: { currentStreak: 1e12, lastActiveDate: '<img onerror=x>', longestStreak: -1, totalSessions: 3 },
      weakKeys: { errors: { q: 1e99, toolongkey: 3 }, totals: 'bad' },
      highScore: 1e9,
      skipAhead: 'yes',
      neonHighScore: -3,
    },
  });
  assert.equal(snapshot.createdAt.length, 40);
  assert.equal(snapshot.data.lessons.length, 1);
  assert.deepEqual(snapshot.data.lessons[0], { lessonId: 1, completed: true, bestAccuracy: 100, bestWpm: 0, starsEarned: 3, attempts: 100000 });
  assert.equal(snapshot.data.sessions.length, 1);
  assert.equal(snapshot.data.streak!.lastActiveDate, '');
  assert.equal(snapshot.data.streak!.currentStreak, 100000);
  assert.deepEqual(Object.keys(snapshot.data.weakKeys!.errors), ['q']);
  assert.equal(snapshot.data.highScore, 500);
  assert.equal(snapshot.data.skipAhead, false);
  assert.equal(snapshot.data.neonHighScore, null);
});

test('an empty device exports a valid empty code', async () => {
  const code = await encodeProgress(buildSnapshot(fakeStorage()));
  const snapshot = await decodeProgress(code);
  assert.equal(snapshot.data.lessons.length, 0);
  assert.equal(summarize(snapshot).lessonsCompleted, 0);
});

test('validateSnapshot rejects non-objects and wrong versions', () => {
  assert.throws(() => validateSnapshot(null), ProgressCodeError);
  assert.throws(() => validateSnapshot({ v: 2, data: {} }), ProgressCodeError);
  assert.throws(() => validateSnapshot({ v: 1 }), ProgressCodeError);
});

test('a minimal or hostile session is rebuilt into the full shape the screens expect', () => {
  const snapshot = validateSnapshot({
    v: 1,
    data: { sessions: [{ wpm: 38, accuracy: 96.4, startTime: 1000, modeDetail: 'practice-lvl1', perKeyErrors: null, wpmWindows: 'nope', content: 'x'.repeat(9000), extra: '<script>' }] },
  });
  const s = snapshot.data.sessions[0] as Record<string, unknown>;
  for (const key of ['perKeyErrors', 'perKeyTotal', 'bigramErrors', 'bigramTotal', 'avgPausePerKey']) {
    assert.equal(typeof s[key], 'object', key);
    assert.notEqual(s[key], null, key);
  }
  assert.ok(Array.isArray(s.wpmWindows));
  assert.equal((s.content as string).length, 3000);
  assert.equal('extra' in s, false);
  assert.equal(typeof s.id, 'string');
  assert.equal(Object.entries(s.perKeyErrors as object).length, 0); // what analyzeWeakKeys iterates
});

test('a truncated TB2 code gets the damaged-code message, other text the not-a-code message', async () => {
  const code = await encodeProgress(buildSnapshot(fullStorage()));
  await assert.rejects(() => decodeProgress(code.slice(0, -4)), /damaged or incomplete/);
  await assert.rejects(() => decodeProgress('banana'), /does not look like/);
});
