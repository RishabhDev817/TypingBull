/**
 * Content Generators — Utilities to auto-generate typing drill content
 * ────────────────────────────────────────────────────────────────────
 * These produce practice strings from key sets, avoiding the need to
 * hand-write hundreds of drill strings.
 */

import type { LessonDef, LessonType } from './types';

// ─── Seeded pseudo-random for reproducible drills ────────────────

let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}
function resetSeed(s: number) { _seed = s; }

function shuffle<T>(arr: T[], seed: number): T[] {
  resetSeed(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ─── Drill string generators ────────────────────────────────────

/** Generate a simple pair drill: "ff jj fj jf ff jj fj jf ..." */
export function generatePairDrill(a: string, b: string, length = 80): string {
  const combos = [
    `${a}${a}`, `${b}${b}`,
    `${a}${b}`, `${b}${a}`,
    `${a}${a}${b}`, `${b}${b}${a}`,
    `${a}${b}${a}`, `${b}${a}${b}`,
    `${a}${b}${a}${b}`, `${b}${a}${b}${a}`,
  ];
  const parts: string[] = [];
  let totalLen = 0;
  let i = 0;
  while (totalLen < length) {
    parts.push(combos[i % combos.length]);
    totalLen += combos[i % combos.length].length + 1;
    i++;
  }
  return parts.join(' ').slice(0, length).trim();
}

/** Generate a mixed review drill from a set of keys */
export function generateMixedDrill(keys: string[], length = 100, seed = 1): string {
  resetSeed(seed);
  const parts: string[] = [];
  let totalLen = 0;
  while (totalLen < length) {
    const groupLen = 2 + Math.floor(seededRandom() * 4); // 2-5 chars
    let group = '';
    for (let g = 0; g < groupLen; g++) {
      group += keys[Math.floor(seededRandom() * keys.length)];
    }
    parts.push(group);
    totalLen += group.length + 1;
  }
  return parts.join(' ').slice(0, length).trim();
}

/** Generate word-based drill from a word list */
export function generateWordDrill(words: string[], length = 120, seed = 1): string {
  const shuffled = shuffle(words, seed);
  const parts: string[] = [];
  let totalLen = 0;
  let i = 0;
  while (totalLen < length) {
    parts.push(shuffled[i % shuffled.length]);
    totalLen += shuffled[i % shuffled.length].length + 1;
    i++;
  }
  return parts.join(' ').slice(0, length).trim();
}

/** Common English words typeable with home row keys only */
export const HOME_ROW_WORDS = [
  'ash', 'lad', 'has', 'dad', 'lag', 'sag', 'gal', 'jag', 'gas', 'ask',
  'flask', 'gash', 'lash', 'dash', 'hall', 'fall', 'shall', 'glad', 'fads',
  'salad', 'flags', 'flash', 'glass', 'half', 'all', 'adds', 'skull', 'sad',
];

/** Common English words using all letters */
export const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us',
];

// ─── Lesson factory helpers ──────────────────────────────────────

interface LessonTemplate {
  id: number;
  title: string;
  description: string;
  type: LessonType;
  targetKeys: string[];
  content: string;
  icon: string;
  chapterId: string;
  passingAccuracy?: number;
  starThresholds?: [number, number, number];
  wpmGoal?: number;
  tipContent?: string;
  fingerGuide?: string;
}

export function makeLessonDef(t: LessonTemplate): LessonDef {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    type: t.type,
    targetKeys: t.targetKeys,
    content: t.content,
    icon: t.icon,
    chapterId: t.chapterId,
    passingAccuracy: t.passingAccuracy ?? (t.type === 'introduction' || t.type === 'tip' ? 0 : 85),
    starThresholds: t.starThresholds ?? [85, 92, 97],
    wpmGoal: t.wpmGoal,
    tipContent: t.tipContent,
    fingerGuide: t.fingerGuide,
  };
}

// ─── Chapter generators ──────────────────────────────────────────

export interface KeyPairSpec {
  keys: [string, string];
  name: string;
  finger: string;       // e.g. 'Index', 'Middle'
  hand: 'L' | 'R' | 'Both';
}

/**
 * Generate a key-pair introduction chapter.
 * For each pair: Introduction → Practice → Review cycle.
 * Plus Play sessions and comprehensive reviews at the end.
 */
export function generateKeyPairChapter(config: {
  startId: number;
  chapterId: string;
  pairs: KeyPairSpec[];
  extras?: LessonTemplate[];  // Additional lessons (space bar, tips, etc.)
  reviewIcon?: string;
  playIcon?: string;
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;
  const allKeys: string[] = [];

  for (const pair of config.pairs) {
    const [a, b] = pair.keys;
    allKeys.push(a, b);

    // Introduction
    lessons.push(makeLessonDef({
      id: id++,
      title: `Introducing ${a.toUpperCase()} & ${b.toUpperCase()}`,
      description: `Meet the ${pair.finger.toLowerCase()} finger keys: ${a.toUpperCase()} on the left, ${b.toUpperCase()} on the right. Place your fingers and get familiar.`,
      type: 'introduction',
      targetKeys: [a, b],
      content: '',
      icon: '🔤',
      chapterId: config.chapterId,
      tipContent: `Place your ${pair.finger.toLowerCase()} fingers on ${a.toUpperCase()} and ${b.toUpperCase()}. These are your ${pair.name} keys.`,
    }));

    // Practice
    lessons.push(makeLessonDef({
      id: id++,
      title: `Practice ${a.toUpperCase()} & ${b.toUpperCase()}`,
      description: `Drill the ${a.toUpperCase()} & ${b.toUpperCase()} pair until your fingers find them automatically.`,
      type: 'practice',
      targetKeys: [a, b],
      content: generatePairDrill(a, b, 90),
      icon: '🎯',
      chapterId: config.chapterId,
    }));

    // Review (includes all keys learned so far)
    lessons.push(makeLessonDef({
      id: id++,
      title: `Review: ${allKeys.map(k => k.toUpperCase()).join(' ')}`,
      description: `Mix all keys learned so far: ${allKeys.map(k => k.toUpperCase()).join(', ')}. Keep your fingers on the home row.`,
      type: 'review',
      targetKeys: [...allKeys],
      content: generateMixedDrill([...allKeys], 100, id),
      icon: config.reviewIcon ?? '🔄',
      chapterId: config.chapterId,
    }));
  }

  // Insert extras (e.g. space bar lesson, tips) if provided
  if (config.extras) {
    for (const extra of config.extras) {
      lessons.push(makeLessonDef({ ...extra, id: id++ }));
    }
  }

  // Play session
  lessons.push(makeLessonDef({
    id: id++,
    title: `Play: ${config.chapterId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Dash`,
    description: `Gamified speed drill! Type as fast as you can using all keys from this chapter.`,
    type: 'play',
    targetKeys: [...allKeys],
    content: generateMixedDrill([...allKeys], 120, id),
    icon: config.playIcon ?? '🎮',
    chapterId: config.chapterId,
  }));

  // Final comprehensive review
  lessons.push(makeLessonDef({
    id: id++,
    title: `Chapter Review`,
    description: `Final review of all keys in this chapter. Show what you've learned!`,
    type: 'review',
    targetKeys: [...allKeys],
    content: generateMixedDrill([...allKeys], 130, id + 100),
    icon: '⭐',
    chapterId: config.chapterId,
    passingAccuracy: 88,
    starThresholds: [88, 94, 98],
  }));

  // Chapter test
  lessons.push(makeLessonDef({
    id: id++,
    title: `Chapter Test`,
    description: `Prove your mastery of this chapter. Hit the accuracy target to advance!`,
    type: 'test',
    targetKeys: [...allKeys],
    content: generateMixedDrill([...allKeys], 140, id + 200),
    icon: '🏆',
    chapterId: config.chapterId,
    passingAccuracy: 90,
    starThresholds: [90, 95, 98],
  }));

  return lessons;
}

/**
 * Generate a speed/paragraph typing chapter.
 * Each topic becomes a paragraph lesson, interspersed with warm-up drills.
 */
export function generateSpeedChapter(config: {
  startId: number;
  chapterId: string;
  wpmGoal: number;
  topics: { title: string; content: string; icon?: string }[];
  habits?: { title: string; tip: string }[];
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;

  // Opening warm-up
  lessons.push(makeLessonDef({
    id: id++,
    title: `Warm-Up Drill`,
    description: `Loosen up your fingers before pushing for ${config.wpmGoal} WPM.`,
    type: 'practice',
    targetKeys: [],
    content: generateWordDrill(COMMON_WORDS, 100, id),
    icon: '🔥',
    chapterId: config.chapterId,
    wpmGoal: config.wpmGoal,
  }));

  // Habit/tip lessons interspersed
  if (config.habits) {
    for (const habit of config.habits) {
      lessons.push(makeLessonDef({
        id: id++,
        title: habit.title,
        description: habit.tip,
        type: 'tip',
        targetKeys: [],
        content: '',
        icon: '💡',
        chapterId: config.chapterId,
        tipContent: habit.tip,
      }));
    }
  }

  // Topic paragraphs
  for (const topic of config.topics) {
    lessons.push(makeLessonDef({
      id: id++,
      title: topic.title,
      description: `Type this passage about "${topic.title}" aiming for ${config.wpmGoal} WPM.`,
      type: 'paragraph',
      targetKeys: [],
      content: topic.content,
      icon: topic.icon ?? '📖',
      chapterId: config.chapterId,
      wpmGoal: config.wpmGoal,
      passingAccuracy: Math.min(90, 80 + Math.floor(config.wpmGoal / 10)),
      starThresholds: [
        Math.min(90, 80 + Math.floor(config.wpmGoal / 10)),
        Math.min(95, 85 + Math.floor(config.wpmGoal / 10)),
        Math.min(99, 90 + Math.floor(config.wpmGoal / 10)),
      ],
    }));

    // Practice drill between paragraphs
    lessons.push(makeLessonDef({
      id: id++,
      title: `Speed Drill`,
      description: `Quick mixed word drill to build rhythm.`,
      type: 'practice',
      targetKeys: [],
      content: generateWordDrill(COMMON_WORDS, 100, id),
      icon: '⚡',
      chapterId: config.chapterId,
      wpmGoal: config.wpmGoal,
    }));
  }

  // Chapter speed test
  lessons.push(makeLessonDef({
    id: id++,
    title: `Speed Test — ${config.wpmGoal} WPM`,
    description: `Final assessment. Reach ${config.wpmGoal} WPM with high accuracy!`,
    type: 'test',
    targetKeys: [],
    content: generateWordDrill(COMMON_WORDS, 160, id + 500),
    icon: '🏁',
    chapterId: config.chapterId,
    wpmGoal: config.wpmGoal,
    passingAccuracy: Math.min(92, 82 + Math.floor(config.wpmGoal / 10)),
    starThresholds: [
      Math.min(92, 82 + Math.floor(config.wpmGoal / 10)),
      Math.min(96, 87 + Math.floor(config.wpmGoal / 10)),
      Math.min(99, 92 + Math.floor(config.wpmGoal / 10)),
    ],
  }));

  return lessons;
}

/**
 * Generate a tricky words drill chapter.
 */
export function generateTrickyWordsChapter(config: {
  startId: number;
  chapterId: string;
  wordPairs: { words: string[]; tip: string }[];
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;

  for (const pair of config.wordPairs) {
    // Tip about the word set
    lessons.push(makeLessonDef({
      id: id++,
      title: `Tricky: ${pair.words.join(' / ')}`,
      description: pair.tip,
      type: 'tip',
      targetKeys: [],
      content: '',
      icon: '🧠',
      chapterId: config.chapterId,
      tipContent: pair.tip,
    }));

    // Drill the words
    lessons.push(makeLessonDef({
      id: id++,
      title: `Drill: ${pair.words.join(' & ')}`,
      description: `Type these commonly confused words until they feel natural.`,
      type: 'practice',
      targetKeys: [],
      content: generateWordDrill(pair.words.flatMap(w => [w, w, w]), 110, id),
      icon: '🎯',
      chapterId: config.chapterId,
    }));
  }

  // Chapter review
  const allWords = config.wordPairs.flatMap(p => p.words);
  lessons.push(makeLessonDef({
    id: id++,
    title: `Tricky Words Review`,
    description: `Mixed drill of all tricky words from this chapter.`,
    type: 'review',
    targetKeys: [],
    content: generateWordDrill(allWords, 130, id + 300),
    icon: '⭐',
    chapterId: config.chapterId,
    passingAccuracy: 90,
    starThresholds: [90, 95, 98],
  }));

  return lessons;
}

/**
 * Generate a common patterns drill chapter.
 */
export function generatePatternsChapter(config: {
  startId: number;
  chapterId: string;
  patterns: { pattern: string; words: string[] }[];
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;

  for (const p of config.patterns) {
    // Intro to the pattern
    lessons.push(makeLessonDef({
      id: id++,
      title: `Pattern: "${p.pattern}"`,
      description: `Practice the common letter combination "${p.pattern}" in real words.`,
      type: 'introduction',
      targetKeys: p.pattern.split(''),
      content: '',
      icon: '🧩',
      chapterId: config.chapterId,
      tipContent: `The pattern "${p.pattern}" appears in words like: ${p.words.slice(0, 5).join(', ')}`,
    }));

    // Drill the words
    lessons.push(makeLessonDef({
      id: id++,
      title: `Drill: "${p.pattern}" Words`,
      description: `Type words containing the "${p.pattern}" pattern.`,
      type: 'practice',
      targetKeys: p.pattern.split(''),
      content: generateWordDrill(p.words, 110, id),
      icon: '⚡',
      chapterId: config.chapterId,
    }));
  }

  // Chapter review
  const allWords = config.patterns.flatMap(p => p.words);
  lessons.push(makeLessonDef({
    id: id++,
    title: `Patterns Review`,
    description: `Mixed drill of all patterns from this chapter.`,
    type: 'review',
    targetKeys: [],
    content: generateWordDrill(allWords, 140, id + 400),
    icon: '⭐',
    chapterId: config.chapterId,
    passingAccuracy: 88,
    starThresholds: [88, 94, 98],
  }));

  return lessons;
}

/**
 * Generate shift key chapter for a set of key pairs.
 */
export function generateShiftKeyChapter(config: {
  startId: number;
  chapterId: string;
  pairs: { lower: string; upper: string; finger: string }[];
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;
  const allKeys: string[] = [];

  for (const pair of config.pairs) {
    allKeys.push(pair.lower, pair.upper);

    // Travel lesson — how to hold shift + press key
    lessons.push(makeLessonDef({
      id: id++,
      title: `Travel: Capital ${pair.upper}`,
      description: `Learn the finger travel to press Shift + ${pair.lower.toUpperCase()}. Opposite hand holds Shift.`,
      type: 'travel',
      targetKeys: [pair.lower, pair.upper],
      content: '',
      icon: '🚂',
      chapterId: config.chapterId,
      fingerGuide: pair.finger,
      tipContent: `To type ${pair.upper}, hold Shift with your opposite hand and press ${pair.lower.toUpperCase()} with your ${pair.finger.toLowerCase()} finger.`,
    }));

    // Practice capital letters
    const drill = Array.from({ length: 15 }, (_, i) =>
      i % 3 === 0 ? pair.upper : i % 3 === 1 ? pair.lower : `${pair.upper}${pair.lower}`
    ).join(' ');
    lessons.push(makeLessonDef({
      id: id++,
      title: `Practice Capital ${pair.upper} & ${pair.lower}`,
      description: `Drill mixing lowercase ${pair.lower} and uppercase ${pair.upper}.`,
      type: 'practice',
      targetKeys: [pair.lower, pair.upper],
      content: drill.slice(0, 100),
      icon: '🎯',
      chapterId: config.chapterId,
    }));
  }

  // Mixed review
  lessons.push(makeLessonDef({
    id: id++,
    title: `Shift Key Review`,
    description: `Mixed drill of all capitalized letters from this chapter.`,
    type: 'review',
    targetKeys: [...allKeys],
    content: generateMixedDrill(allKeys, 130, id + 100),
    icon: '⭐',
    chapterId: config.chapterId,
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  // Chapter test
  lessons.push(makeLessonDef({
    id: id++,
    title: `Shift Key Test`,
    description: `Show your mastery of capitalization!`,
    type: 'test',
    targetKeys: [...allKeys],
    content: generateMixedDrill(allKeys, 140, id + 200),
    icon: '🏆',
    chapterId: config.chapterId,
    passingAccuracy: 88,
    starThresholds: [88, 94, 98],
  }));

  return lessons;
}

/**
 * Generate a number/symbol chapter for pairs of characters.
 */
export function generateSymbolChapter(config: {
  startId: number;
  chapterId: string;
  pairs: { keys: [string, string]; name: string; finger: string }[];
  isSymbol?: boolean; // If true, these require Shift
}): LessonDef[] {
  const lessons: LessonDef[] = [];
  let id = config.startId;
  const allKeys: string[] = [];

  for (const pair of config.pairs) {
    const [a, b] = pair.keys;
    allKeys.push(a, b);

    // Travel lesson
    lessons.push(makeLessonDef({
      id: id++,
      title: `Travel: ${pair.name}`,
      description: `Learn the finger reach for ${a} and ${b}. ${config.isSymbol ? 'Hold Shift and reach up.' : 'Reach up from home row.'}`,
      type: 'travel',
      targetKeys: [a, b],
      content: '',
      icon: '🚂',
      chapterId: config.chapterId,
      fingerGuide: pair.finger,
      tipContent: `${pair.name}: reach your ${pair.finger.toLowerCase()} finger up to find ${a} and ${b}.`,
    }));

    // Introduction
    lessons.push(makeLessonDef({
      id: id++,
      title: `Introducing ${a} & ${b}`,
      description: `Meet the ${pair.name} pair.`,
      type: 'introduction',
      targetKeys: [a, b],
      content: '',
      icon: '🔤',
      chapterId: config.chapterId,
    }));

    // Practice drill
    lessons.push(makeLessonDef({
      id: id++,
      title: `Practice ${a} & ${b}`,
      description: `Drill the ${a} and ${b} keys.`,
      type: 'practice',
      targetKeys: [a, b],
      content: generatePairDrill(a, b, 90),
      icon: '🎯',
      chapterId: config.chapterId,
    }));

    // Review with all keys so far
    if (allKeys.length > 2) {
      lessons.push(makeLessonDef({
        id: id++,
        title: `Review: ${allKeys.join(' ')}`,
        description: `Mix all ${config.isSymbol ? 'symbols' : 'numbers'} learned so far.`,
        type: 'review',
        targetKeys: [...allKeys],
        content: generateMixedDrill([...allKeys], 100, id),
        icon: '🔄',
        chapterId: config.chapterId,
      }));
    }
  }

  // Play session
  lessons.push(makeLessonDef({
    id: id++,
    title: `${config.isSymbol ? 'Symbol' : 'Number'} Dash`,
    description: `Speed drill with all ${config.isSymbol ? 'symbols' : 'numbers'} from this chapter!`,
    type: 'play',
    targetKeys: [...allKeys],
    content: generateMixedDrill([...allKeys], 120, id + 100),
    icon: '🎮',
    chapterId: config.chapterId,
  }));

  // Chapter test
  lessons.push(makeLessonDef({
    id: id++,
    title: `Chapter Test`,
    description: `Prove your mastery of ${config.isSymbol ? 'symbols' : 'numbers'}!`,
    type: 'test',
    targetKeys: [...allKeys],
    content: generateMixedDrill([...allKeys], 140, id + 200),
    icon: '🏆',
    chapterId: config.chapterId,
    passingAccuracy: 88,
    starThresholds: [88, 94, 98],
  }));

  return lessons;
}
