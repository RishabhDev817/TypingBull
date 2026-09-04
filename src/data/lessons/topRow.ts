/**
 * Top Row Chapter — Lessons 24–51
 * ────────────────────────────────
 * R&U, E&I, W&O, Q&Y, P&T + ergonomic tips
 */

import type { LessonDef } from './types';
import {
  generateKeyPairChapter,
  makeLessonDef,
  generateWordDrill,
  COMMON_WORDS,
} from './generators';

const TOP_ROW_WORDS = [
  'true', 'your', 'were', 'there', 'other', 'write', 'power', 'point',
  'quite', 'quote', 'youth', 'tower', 'worth', 'worry', 'party', 'poetry',
  'outer', 'quiet', 'trout', 'type', 'ripe', 'port', 'wit', 'row', 'top',
  'tip', 'pour', 'tour', 'equip', 'wipe', 'riot', 'rope', 'pipe', 'pure',
];

export function createTopRowLessons(): LessonDef[] {
  const base = generateKeyPairChapter({
    startId: 24,
    chapterId: 'top-row',
    pairs: [
      { keys: ['r', 'u'], name: 'Inner Reach Keys', finger: 'Index', hand: 'Both' },
      { keys: ['e', 'i'], name: 'Middle Reach Keys', finger: 'Middle', hand: 'Both' },
      { keys: ['w', 'o'], name: 'Ring Reach Keys', finger: 'Ring', hand: 'Both' },
      { keys: ['q', 'y'], name: 'Outer Reach Keys', finger: 'Pinky/Index', hand: 'Both' },
      { keys: ['p', 't'], name: 'Cross-Hand Keys', finger: 'Pinky/Index', hand: 'Both' },
    ],
    extras: [
      {
        id: 0,
        title: 'Sit Straight, Be Healthy!',
        description: 'Good posture prevents strain and helps you type faster. Sit with your feet flat, back straight, and wrists floating above the keyboard.',
        type: 'tip' as const,
        targetKeys: [],
        content: '',
        icon: '🧘',
        chapterId: 'top-row',
        tipContent: 'Good posture prevents strain and helps you type faster. Sit with your feet flat on the floor, your back straight, and your wrists floating above the keyboard — never resting on the desk.',
      },
      {
        id: 0,
        title: 'Think Ideas, Not Fingers!',
        description: 'As your fingers learn the keys, start thinking about what you want to type — not where each key is.',
        type: 'tip' as const,
        targetKeys: [],
        content: '',
        icon: '💭',
        chapterId: 'top-row',
        tipContent: 'At this stage, your fingers should start moving automatically. Focus your mind on the words and ideas, not on finding each key. Trust your muscle memory!',
      },
    ],
  });

  const topRowKeys = ['r', 'u', 'e', 'i', 'w', 'o', 'q', 'y', 'p', 't'];
  const allKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ...topRowKeys];
  const extra: LessonDef[] = [];
  let nextId = base[base.length - 1].id + 1;

  // Top row words
  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Top Row Words',
    description: 'Real words mixing home row and top row keys.',
    type: 'paragraph',
    targetKeys: allKeys,
    content: generateWordDrill(TOP_ROW_WORDS, 130, 888),
    icon: '📝',
    chapterId: 'top-row',
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  // Full keyboard drill (home + top)
  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Home + Top Row Mix',
    description: 'Mix home row and top row keys for comprehensive practice.',
    type: 'review',
    targetKeys: allKeys,
    content: generateWordDrill([...TOP_ROW_WORDS, ...COMMON_WORDS.slice(0, 20)], 130, 999),
    icon: '🔄',
    chapterId: 'top-row',
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  const all = [...base, ...extra];
  // Ensure exactly lessons 24–51 (28 lessons)
  const trimmed = all.slice(0, 28);
  return trimmed.map((l, i) => ({ ...l, id: 24 + i }));
}
