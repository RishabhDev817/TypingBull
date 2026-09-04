/**
 * Weak-Key Analyzer — rules-based analysis of typing weaknesses.
 */

import { getWeakKeys, getWeakBigrams, getSessions } from './sessionStore';

export interface WeakKeyRecommendation {
  weakKeys: { key: string; errorRate: number }[];
  weakBigrams: { bigram: string; errorRate: number }[];
  hesitationKeys: { key: string; avgDelayMs: number }[];
  message: string;
  mission: {
    content: string;
    durationMinutes: number;
    targetKeys: string[];
  } | null;
}

// ─── Finger-to-key map for generating drills ──────────────────────

const FINGER_NAMES: Record<string, string> = {
  'a': 'left pinky',
  's': 'left ring',
  'd': 'left middle',
  'f': 'left index',
  'g': 'left index',
  'h': 'right index',
  'j': 'right index',
  'k': 'right middle',
  'l': 'right ring',
  ';': 'right pinky',
  'q': 'left pinky',
  'w': 'left ring',
  'e': 'left middle',
  'r': 'left index',
  't': 'left index',
  'y': 'right index',
  'u': 'right index',
  'i': 'right middle',
  'o': 'right ring',
  'p': 'right pinky',
  'z': 'left pinky',
  'x': 'left ring',
  'c': 'left middle',
  'v': 'left index',
  'b': 'left index',
  'n': 'right index',
  'm': 'right index',
};

/**
 * Generate drill content focusing on specific weak keys.
 */
function generateDrillContent(weakKeys: string[]): string {
  if (weakKeys.length === 0) return '';

  const drillPatterns: string[] = [];

  // Pattern 1: Repeat each weak key with surrounding home-row keys
  for (const key of weakKeys) {
    const repeat = `${key}${key} ${key}${key}${key} `;
    drillPatterns.push(repeat.repeat(3).trim());
  }

  // Pattern 2: Alternate between weak keys
  if (weakKeys.length >= 2) {
    const alternating = weakKeys.map((k, i) => {
      const next = weakKeys[(i + 1) % weakKeys.length];
      return `${k}${next} ${next}${k}`;
    }).join(' ');
    drillPatterns.push(alternating);
  }

  // Pattern 3: Mix weak keys with common home-row keys
  const homeRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  for (const key of weakKeys) {
    const mixed = homeRow
      .filter(h => h !== key)
      .slice(0, 4)
      .map(h => `${h}${key}${h}`)
      .join(' ');
    drillPatterns.push(mixed);
  }

  // Pattern 4: Simple words containing weak keys
  const wordBank: Record<string, string[]> = {
    'a': ['ash', 'add', 'all', 'ask', 'and'],
    's': ['sad', 'sat', 'sag', 'sal', 'shall'],
    'd': ['dad', 'dads', 'dash', 'glad', 'add'],
    'f': ['fall', 'flag', 'flash', 'half', 'gaff'],
    'g': ['gag', 'gas', 'gash', 'glad', 'flag'],
    'h': ['had', 'has', 'hash', 'hall', 'half'],
    'j': ['jag', 'jab', 'jags', 'jaff', 'jass'],
    'k': ['kale', 'keg', 'kelp', 'lake', 'flask'],
    'l': ['lad', 'lag', 'lash', 'lass', 'fall'],
    'r': ['rad', 'rag', 'rash', 'drag', 'grass'],
    't': ['tag', 'tall', 'task', 'that', 'fast'],
    'e': ['egg', 'else', 'edge', 'feed', 'feel'],
    'i': ['ill', 'fill', 'fish', 'figs', 'kiss'],
    'o': ['odd', 'off', 'old', 'fold', 'gold'],
    'u': ['ugh', 'dull', 'full', 'gull', 'hull'],
    'n': ['nag', 'nap', 'nag', 'land', 'hand'],
    'm': ['mad', 'map', 'mask', 'mash', 'slam'],
  };

  for (const key of weakKeys) {
    const words = wordBank[key] || [];
    if (words.length > 0) {
      drillPatterns.push(words.join(' '));
    }
  }

  return drillPatterns.join(' ');
}

/**
 * Analyze recent sessions and lifetime stats to produce a recommendation.
 */
export function analyzeWeakKeys(): WeakKeyRecommendation {
  const weakKeys = getWeakKeys(5);
  const weakBigrams = getWeakBigrams(5);
  const sessions = getSessions();

  // Compute hesitation keys from recent sessions
  const hesitationKeys: { key: string; avgDelayMs: number }[] = [];
  const recentSessions = sessions.slice(0, 5);

  if (recentSessions.length > 0) {
    const keyDelays: Record<string, number[]> = {};

    for (const session of recentSessions) {
      for (const [key, avgDelay] of Object.entries(session.avgPausePerKey)) {
        if (!keyDelays[key]) keyDelays[key] = [];
        keyDelays[key].push(avgDelay);
      }
    }

    for (const [key, delays] of Object.entries(keyDelays)) {
      const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
      if (avgDelay > 1500) { // > 1.5s average delay
        hesitationKeys.push({ key, avgDelayMs: Math.round(avgDelay) });
      }
    }

    hesitationKeys.sort((a, b) => b.avgDelayMs - a.avgDelayMs);
  }

  // Generate human-readable message
  let message = '';
  const significantWeakKeys = weakKeys.filter(k => k.errorRate > 0.15);
  const significantBigrams = weakBigrams.filter(b => b.errorRate > 0.2);

  if (significantWeakKeys.length > 0) {
    const keyList = significantWeakKeys.map(k => k.key.toUpperCase()).join(', ');
    const fingerSet = new Set(significantWeakKeys.map(k => FINGER_NAMES[k.key] || 'unknown').filter(Boolean));
    const fingers = Array.from(fingerSet).join(' and ');

    message = `Your ${fingers} finger${fingerSet.size > 1 ? 's' : ''} need${fingerSet.size === 1 ? 's' : ''} practice. Keys ${keyList} have high error rates. `;
    message += `Try the ${Math.max(3, significantWeakKeys.length)}-minute ${keyList} mission before your next lesson.`;
  } else if (significantBigrams.length > 0) {
    const bigramList = significantBigrams.map(b => `"${b.bigram}"`).join(', ');
    message = `Letter combinations ${bigramList} are tripping you up. Practice these transitions to improve your flow.`;
  } else if (hesitationKeys.length > 0) {
    const keyList = hesitationKeys.slice(0, 3).map(k => k.key.toUpperCase()).join(', ');
    message = `You hesitate before pressing ${keyList}. Muscle memory drills for these keys will help build confidence.`;
  } else if (sessions.length > 0) {
    message = 'Looking good! No major weak spots detected. Keep practicing to maintain your accuracy.';
  } else {
    message = 'Complete a few typing sessions to receive personalized recommendations.';
  }

  // Generate mission if there are weak keys
  let mission: WeakKeyRecommendation['mission'] = null;
  const targetKeys = significantWeakKeys.map(k => k.key);

  if (targetKeys.length > 0) {
    mission = {
      content: generateDrillContent(targetKeys),
      durationMinutes: Math.max(3, targetKeys.length),
      targetKeys,
    };
  }

  return {
    weakKeys: weakKeys.map(k => ({ key: k.key, errorRate: Math.round(k.errorRate * 100) / 100 })),
    weakBigrams: weakBigrams.map(b => ({ bigram: b.bigram, errorRate: Math.round(b.errorRate * 100) / 100 })),
    hesitationKeys,
    message,
    mission,
  };
}
