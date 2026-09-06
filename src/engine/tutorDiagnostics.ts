/**
 * AI Tutor Diagnostics — Analyzes typing stats and produces actionable reports.
 *
 * Works in two modes:
 *   1. Single-session analysis (from a just-completed SessionResult)
 *   2. Lifetime aggregate analysis (from sessionStore's lifetime stats)
 */

import type { SessionResult, WpmWindow } from './typingEngine';
import { getLifetimeKeyStats, getSessions, getWeakKeys } from './sessionStore';
import { CHAPTERS } from '../data/curriculum';
import type { SupportedLocale } from '../i18n/ui';
import {
  TUTOR_REGIONS_I18N,
  getLocalizedRecommendation,
  getLocalizedStaminaMessage,
  getLocalizedMascotMessage,
} from '../i18n/tutorTranslations';

// ─── Types ─────────────────────────────────────────────────────────

export interface FlawDiagnosis {
  id: string;
  label: string;
  keys: string[];
  errorRate: number;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  replayChapterId?: string;
  replayLessonStart?: number;
  replayLabel: string;
}

export interface StaminaAnalysis {
  wpmWindows: WpmWindow[];
  dropOffPercent: number;
  verdict: 'strong' | 'moderate' | 'weak';
  message: string;
}

export interface TutorReport {
  flaws: FlawDiagnosis[];
  stamina: StaminaAnalysis;
  keyHeatmap: Record<string, number>;
  averageWpm: number;
  targetWpm: number;
  mascotMessage: string;
  grade: 'excellent' | 'good' | 'needs-work' | 'struggling';
}

// ─── Keyboard Region → Flaw Mapping ────────────────────────────────

interface RegionDef {
  id: string;
  label: string;
  keys: string[];
  chapterId: string;
  replayLabel: string;
}

const KEYBOARD_REGIONS: RegionDef[] = [
  {
    id: 'top-row-outer',
    label: 'Top Row Outer Keys',
    keys: ['q', 'w', 'o', 'p'],
    chapterId: 'top-row',
    replayLabel: 'Top Row Reaches',
  },
  {
    id: 'top-row-inner',
    label: 'Top Row Inner Keys',
    keys: ['e', 'r', 't', 'y', 'u', 'i'],
    chapterId: 'top-row',
    replayLabel: 'Top Row Core',
  },
  {
    id: 'home-row-pinkies',
    label: 'Home Row Pinky Keys',
    keys: ['a', ';'],
    chapterId: 'home-row',
    replayLabel: 'Home Row Pinkies',
  },
  {
    id: 'home-row-ring',
    label: 'Home Row Ring Fingers',
    keys: ['s', 'l'],
    chapterId: 'home-row',
    replayLabel: 'Home Row Ring',
  },
  {
    id: 'home-row-middle',
    label: 'Home Row Middle Fingers',
    keys: ['d', 'k'],
    chapterId: 'home-row',
    replayLabel: 'Home Row Middle',
  },
  {
    id: 'home-row-index',
    label: 'Home Row Index Fingers',
    keys: ['f', 'j', 'g', 'h'],
    chapterId: 'home-row',
    replayLabel: 'Home Row Index',
  },
  {
    id: 'bottom-row',
    label: 'Bottom Row Keys',
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    chapterId: 'bottom-row',
    replayLabel: 'Bottom Row',
  },
  {
    id: 'number-row',
    label: 'Number Row',
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    chapterId: 'numbers',
    replayLabel: 'Number Row',
  },
];

// ─── Core Analysis ─────────────────────────────────────────────────

function computeRegionErrorRate(
  regionKeys: string[],
  errors: Record<string, number>,
  totals: Record<string, number>,
): number {
  let totalErrors = 0;
  let totalHits = 0;
  for (const key of regionKeys) {
    totalErrors += errors[key] || 0;
    totalHits += totals[key] || 0;
  }
  return totalHits > 0 ? totalErrors / totalHits : 0;
}

function getSeverity(errorRate: number): 'low' | 'medium' | 'high' {
  if (errorRate > 0.3) return 'high';
  if (errorRate > 0.15) return 'medium';
  return 'low';
}

function analyzeFlaws(
  errors: Record<string, number>,
  totals: Record<string, number>,
  lang: SupportedLocale = 'en',
): FlawDiagnosis[] {
  const flaws: FlawDiagnosis[] = [];

  for (const region of KEYBOARD_REGIONS) {
    // Only consider regions where the user has typed at least some of the keys
    const hasData = region.keys.some(k => (totals[k] || 0) >= 3);
    if (!hasData) continue;

    const errorRate = computeRegionErrorRate(region.keys, errors, totals);
    if (errorRate < 0.08) continue; // Below 8% — not a significant flaw

    const severity = getSeverity(errorRate);
    const chapter = CHAPTERS.find(c => c.id === region.chapterId);

    const regionI18n = TUTOR_REGIONS_I18N[lang]?.[region.id] || {
      label: region.label,
      replayLabel: region.replayLabel,
    };

    flaws.push({
      id: region.id,
      label: regionI18n.label,
      keys: region.keys.filter(k => (totals[k] || 0) >= 1),
      errorRate: Math.round(errorRate * 100) / 100,
      severity,
      recommendation: getLocalizedRecommendation(regionI18n.label, regionI18n.replayLabel, severity, lang),
      replayChapterId: region.chapterId,
      replayLessonStart: chapter?.lessonRange[0],
      replayLabel: regionI18n.replayLabel,
    });
  }

  // Sort by severity (high first), then by error rate
  const severityOrder = { high: 0, medium: 1, low: 2 };
  flaws.sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return b.errorRate - a.errorRate;
  });

  return flaws;
}

// ─── Stamina Analysis ──────────────────────────────────────────────

function analyzeStamina(wpmWindows: WpmWindow[], lang: SupportedLocale = 'en'): StaminaAnalysis {
  if (wpmWindows.length < 2) {
    const staminaRes = getLocalizedStaminaMessage(0, true, lang);
    return {
      wpmWindows,
      dropOffPercent: 0,
      verdict: staminaRes.verdict,
      message: staminaRes.message,
    };
  }

  // Peak = best of first two windows
  const peakWpm = Math.max(wpmWindows[0].wpm, wpmWindows.length > 1 ? wpmWindows[1].wpm : 0);

  // Tail = average of last two windows
  const lastTwo = wpmWindows.slice(-2);
  const tailWpm = lastTwo.reduce((sum, w) => sum + w.wpm, 0) / lastTwo.length;

  const dropOffPercent = peakWpm > 0
    ? Math.round(((peakWpm - tailWpm) / peakWpm) * 100)
    : 0;

  const staminaRes = getLocalizedStaminaMessage(dropOffPercent, false, lang);

  return {
    wpmWindows,
    dropOffPercent,
    verdict: staminaRes.verdict,
    message: staminaRes.message,
  };
}

// ─── Key Heatmap ───────────────────────────────────────────────────

function buildKeyHeatmap(
  errors: Record<string, number>,
  totals: Record<string, number>,
): Record<string, number> {
  const heatmap: Record<string, number> = {};
  for (const [key, total] of Object.entries(totals)) {
    if (total < 1) continue;
    const errorCount = errors[key] || 0;
    heatmap[key] = Math.round((errorCount / total) * 100) / 100;
  }
  return heatmap;
}

// ─── Grade Calculation ─────────────────────────────────────────────

function calculateGrade(
  accuracy: number,
  flawCount: number,
  staminaVerdict: string,
): TutorReport['grade'] {
  if (accuracy >= 97 && flawCount === 0 && staminaVerdict === 'strong') return 'excellent';
  if (accuracy >= 92 && flawCount <= 1) return 'good';
  if (accuracy >= 80) return 'needs-work';
  return 'struggling';
}

// ─── Mascot Message Generator ──────────────────────────────────────

function generateMascotMessage(
  flaws: FlawDiagnosis[],
  stamina: StaminaAnalysis,
  grade: TutorReport['grade'],
  accuracy: number,
  wpm: number,
  lang: SupportedLocale = 'en',
): string {
  const topFlaw = flaws.length > 0 ? flaws[0] : null;
  return getLocalizedMascotMessage(
    flaws.length,
    topFlaw ? { label: topFlaw.label, keys: topFlaw.keys, errorRate: topFlaw.errorRate } : null,
    stamina.verdict,
    stamina.message,
    grade,
    accuracy,
    wpm,
    lang,
  );
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Generate a tutor report from a single session result.
 */
export function generateSessionReport(
  session: SessionResult,
  targetWpm: number = 40,
  lang: SupportedLocale = 'en',
): TutorReport {
  const flaws = analyzeFlaws(session.perKeyErrors, session.perKeyTotal, lang);
  const stamina = analyzeStamina(session.wpmWindows, lang);
  const keyHeatmap = buildKeyHeatmap(session.perKeyErrors, session.perKeyTotal);
  const grade = calculateGrade(session.accuracy, flaws.length, stamina.verdict);
  const mascotMessage = generateMascotMessage(flaws, stamina, grade, session.accuracy, session.wpm, lang);

  return {
    flaws,
    stamina,
    keyHeatmap,
    averageWpm: session.wpm,
    targetWpm,
    mascotMessage,
    grade,
  };
}

/**
 * Generate a tutor report from aggregated lifetime stats.
 * Used on the Dashboard for an overall health check.
 */
export function generateLifetimeReport(
  targetWpm: number = 40,
  lang: SupportedLocale = 'en',
): TutorReport {
  const stats = getLifetimeKeyStats();
  const sessions = getSessions();

  // Calculate average WPM from recent sessions
  const recentSessions = sessions.slice(0, 10);
  const averageWpm = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length)
    : 0;

  // Aggregate WPM windows from recent sessions for stamina
  const allWindows: WpmWindow[] = [];
  for (const session of recentSessions) {
    if (session.wpmWindows) {
      for (const w of session.wpmWindows) {
        allWindows.push(w);
      }
    }
  }

  // Average per window index across sessions
  const windowMap = new Map<number, { totalWpm: number; count: number }>();
  for (const w of allWindows) {
    const existing = windowMap.get(w.windowIndex) || { totalWpm: 0, count: 0 };
    existing.totalWpm += w.wpm;
    existing.count++;
    windowMap.set(w.windowIndex, existing);
  }
  const averagedWindows: WpmWindow[] = Array.from(windowMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([idx, data]) => ({
      windowIndex: idx,
      wpm: Math.round(data.totalWpm / data.count),
      correctChars: 0,
    }));

  const flaws = analyzeFlaws(stats.errors, stats.totals, lang);
  const stamina = analyzeStamina(averagedWindows, lang);
  const keyHeatmap = buildKeyHeatmap(stats.errors, stats.totals);

  // Calculate average accuracy from recent sessions
  const avgAccuracy = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length * 10) / 10
    : 100;

  const grade = calculateGrade(avgAccuracy, flaws.length, stamina.verdict);
  const mascotMessage = generateMascotMessage(flaws, stamina, grade, avgAccuracy, averageWpm, lang);

  // If there's weak key data, also get the top weak keys and compute target WPM
  const weakKeys = getWeakKeys(5);
  // Use the weak keys to supplement heatmap data
  for (const wk of weakKeys) {
    if (!(wk.key in keyHeatmap)) {
      keyHeatmap[wk.key] = wk.errorRate;
    }
  }

  return {
    flaws,
    stamina,
    keyHeatmap,
    averageWpm,
    targetWpm,
    mascotMessage,
    grade,
  };
}
