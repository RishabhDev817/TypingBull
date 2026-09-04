/**
 * Session Store — localStorage persistence for all TypingBull data.
 */

import type { SessionResult } from './typingEngine';

const KEYS = {
  sessions: 'typingbull_sessions',
  lessons: 'typingbull_lessons',
  streak: 'typingbull_streak',
  weakKeys: 'typingbull_weakkeys',
  highScore: 'typing_bull_high_score',
} as const;

const MAX_SESSIONS = 20;

// ─── Session History ───────────────────────────────────────────────

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  bestAccuracy: number;
  bestWpm: number;
  starsEarned: number;    // 0–3
  attempts: number;
}

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string; // ISO date string 'YYYY-MM-DD'
  longestStreak: number;
  totalSessions: number;
}

export interface LifetimeKeyStats {
  errors: Record<string, number>;    // cumulative per-key errors
  totals: Record<string, number>;    // cumulative per-key totals
  bigramErrors: Record<string, number>;
  bigramTotals: Record<string, number>;
}

// ─── Helpers ───────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Sessions ──────────────────────────────────────────────────────

export function getSessions(): SessionResult[] {
  return readJSON<SessionResult[]>(KEYS.sessions, []);
}

export function saveSession(result: SessionResult): void {
  const sessions = getSessions();
  sessions.unshift(result); // newest first
  if (sessions.length > MAX_SESSIONS) sessions.length = MAX_SESSIONS;
  writeJSON(KEYS.sessions, sessions);

  // Also update lifetime key stats
  updateLifetimeKeyStats(result);

  // Update streak
  updateStreak();

  // Update high score
  const currentHigh = getHighScore();
  if (result.wpm > currentHigh) {
    setHighScore(result.wpm);
  }
}

// ─── Lesson Progress ───────────────────────────────────────────────

export function getLessonProgress(): LessonProgress[] {
  return readJSON<LessonProgress[]>(KEYS.lessons, []);
}

export function getLessonProgressById(lessonId: number): LessonProgress | undefined {
  return getLessonProgress().find(l => l.lessonId === lessonId);
}

export function saveLessonProgress(progress: LessonProgress): void {
  const all = getLessonProgress();
  const idx = all.findIndex(l => l.lessonId === progress.lessonId);
  if (idx >= 0) {
    // Merge — keep best scores
    all[idx] = {
      ...all[idx],
      completed: progress.completed || all[idx].completed,
      bestAccuracy: Math.max(progress.bestAccuracy, all[idx].bestAccuracy),
      bestWpm: Math.max(progress.bestWpm, all[idx].bestWpm),
      starsEarned: Math.max(progress.starsEarned, all[idx].starsEarned),
      attempts: all[idx].attempts + 1,
    };
  } else {
    all.push({ ...progress, attempts: 1 });
  }
  writeJSON(KEYS.lessons, all);
}

export function isLessonUnlocked(lessonId: number): boolean {
  if (lessonId === 1) return true; // First lesson always unlocked

  // Check if the previous lesson (by ID) is completed
  // This works across chapter boundaries: the last lesson of chapter N
  // must be completed to unlock lesson 1 of chapter N+1
  const prev = getLessonProgressById(lessonId - 1);
  return prev?.completed === true;
}

export function getTotalStars(): number {
  return getLessonProgress().reduce((sum, l) => sum + l.starsEarned, 0);
}

export function getCompletedLessonCount(): number {
  return getLessonProgress().filter(l => l.completed).length;
}

/** Get progress for a specific chapter (by lesson range). */
export function getChapterProgress(startId: number, endId: number): {
  completed: number;
  total: number;
  stars: number;
  maxStars: number;
  percent: number;
} {
  const total = endId - startId + 1;
  const progress = getLessonProgress();
  let completed = 0;
  let stars = 0;
  for (let id = startId; id <= endId; id++) {
    const p = progress.find(l => l.lessonId === id);
    if (p?.completed) completed++;
    if (p) stars += p.starsEarned;
  }
  return {
    completed,
    total,
    stars,
    maxStars: total * 3,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/** Check if a chapter is unlocked (first lesson of its range is unlocked). */
export function isChapterUnlocked(startId: number): boolean {
  return isLessonUnlocked(startId);
}


// ─── Daily Streak ──────────────────────────────────────────────────

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreakData(): StreakData {
  return readJSON<StreakData>(KEYS.streak, {
    currentStreak: 0,
    lastActiveDate: '',
    longestStreak: 0,
    totalSessions: 0,
  });
}

function updateStreak(): void {
  const data = getStreakData();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  data.totalSessions++;

  if (data.lastActiveDate === today) {
    // Already tracked today — just update session count
  } else if (data.lastActiveDate === yesterday) {
    // Consecutive day
    data.currentStreak++;
  } else if (data.lastActiveDate === '') {
    // First ever session
    data.currentStreak = 1;
  } else {
    // Streak broken
    data.currentStreak = 1;
  }

  data.lastActiveDate = today;
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  writeJSON(KEYS.streak, data);
}

// ─── Lifetime Key Stats ────────────────────────────────────────────

export function getLifetimeKeyStats(): LifetimeKeyStats {
  return readJSON<LifetimeKeyStats>(KEYS.weakKeys, {
    errors: {},
    totals: {},
    bigramErrors: {},
    bigramTotals: {},
  });
}

function updateLifetimeKeyStats(result: SessionResult): void {
  const stats = getLifetimeKeyStats();

  // Merge per-key errors
  for (const [key, count] of Object.entries(result.perKeyErrors)) {
    stats.errors[key] = (stats.errors[key] || 0) + count;
  }
  for (const [key, count] of Object.entries(result.perKeyTotal)) {
    stats.totals[key] = (stats.totals[key] || 0) + count;
  }

  // Merge bigram errors
  for (const [bigram, count] of Object.entries(result.bigramErrors)) {
    stats.bigramErrors[bigram] = (stats.bigramErrors[bigram] || 0) + count;
  }
  for (const [bigram, count] of Object.entries(result.bigramTotal)) {
    stats.bigramTotals[bigram] = (stats.bigramTotals[bigram] || 0) + count;
  }

  writeJSON(KEYS.weakKeys, stats);
}

/**
 * Returns the top N keys sorted by error rate (errors / total).
 */
export function getWeakKeys(topN: number = 5): { key: string; errorRate: number; errors: number; total: number }[] {
  const stats = getLifetimeKeyStats();
  const entries: { key: string; errorRate: number; errors: number; total: number }[] = [];

  for (const [key, total] of Object.entries(stats.totals)) {
    if (total < 5) continue; // Need minimum sample size
    const errors = stats.errors[key] || 0;
    entries.push({ key, errorRate: errors / total, errors, total });
  }

  return entries.sort((a, b) => b.errorRate - a.errorRate).slice(0, topN);
}

/**
 * Returns the top N bigrams sorted by error rate.
 */
export function getWeakBigrams(topN: number = 5): { bigram: string; errorRate: number; errors: number; total: number }[] {
  const stats = getLifetimeKeyStats();
  const entries: { bigram: string; errorRate: number; errors: number; total: number }[] = [];

  for (const [bigram, total] of Object.entries(stats.bigramTotals)) {
    if (total < 3) continue;
    const errors = stats.bigramErrors[bigram] || 0;
    entries.push({ bigram, errorRate: errors / total, errors, total });
  }

  return entries.sort((a, b) => b.errorRate - a.errorRate).slice(0, topN);
}

// ─── High Score ────────────────────────────────────────────────────

export function getHighScore(): number {
  const raw = localStorage.getItem(KEYS.highScore);
  return raw ? Number(raw) : 0;
}

export function setHighScore(wpm: number): void {
  localStorage.setItem(KEYS.highScore, String(wpm));
}
