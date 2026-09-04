/**
 * Bottom Row Chapter — Lessons 52–88
 * ───────────────────────────────────
 * V&M, C&Comma, X&Period, Z&Slash, B&N, Tab + Travel lessons + QWERTY history
 */

import type { LessonDef } from './types';
import {
  generateKeyPairChapter,
  makeLessonDef,
  generateMixedDrill,
  generateWordDrill,
  COMMON_WORDS,
} from './generators';

const BOTTOM_ROW_WORDS = [
  'move', 'come', 'time', 'name', 'live', 'give', 'same', 'some',
  'home', 'game', 'make', 'take', 'have', 'become', 'welcome', 'vine',
  'mine', 'zone', 'bone', 'cone', 'done', 'gone', 'none', 'tone',
  'next', 'text', 'mix', 'fix', 'six', 'box', 'fox', 'van', 'ban', 'man',
];

export function createBottomRowLessons(): LessonDef[] {
  const base = generateKeyPairChapter({
    startId: 52,
    chapterId: 'bottom-row',
    pairs: [
      { keys: ['v', 'm'], name: 'Index Bottom Keys', finger: 'Index', hand: 'Both' },
      { keys: ['c', ','], name: 'Middle Bottom Keys', finger: 'Middle', hand: 'Both' },
      { keys: ['x', '.'], name: 'Ring Bottom Keys', finger: 'Ring', hand: 'Both' },
      { keys: ['z', '/'], name: 'Pinky Bottom Keys', finger: 'Pinky', hand: 'Both' },
      { keys: ['b', 'n'], name: 'Center Bottom Keys', finger: 'Index', hand: 'Both' },
    ],
    extras: [
      // Travel lessons
      {
        id: 0, title: 'Travel: Right Index Finger',
        description: 'Learn how your right index finger moves from J down to M and N.',
        type: 'travel' as const, targetKeys: ['j', 'm', 'n'],
        content: '', icon: '🚂', chapterId: 'bottom-row',
        fingerGuide: 'R-Index',
        tipContent: 'Your right index finger starts on J. Curl it down and slightly left for M, or down and right for N. Always return to J.',
      },
      {
        id: 0, title: 'Travel: Left Index Finger',
        description: 'Learn how your left index finger moves from F down to V and B.',
        type: 'travel' as const, targetKeys: ['f', 'v', 'b'],
        content: '', icon: '🚂', chapterId: 'bottom-row',
        fingerGuide: 'L-Index',
        tipContent: 'Your left index finger starts on F. Curl it down for V, or down and right for B. Always return to F.',
      },
      {
        id: 0, title: 'Travel: Left Pinky Finger',
        description: 'Learn how your left pinky reaches from A down to Z.',
        type: 'travel' as const, targetKeys: ['a', 'z'],
        content: '', icon: '🚂', chapterId: 'bottom-row',
        fingerGuide: 'L-Pinky',
        tipContent: 'Your left pinky starts on A. Drop it straight down to find Z. It is a big stretch — take your time!',
      },
      // Tab key
      {
        id: 0, title: 'The Tab Key',
        description: 'Tab is above Caps Lock, pressed with your left pinky. It indents text and moves between fields.',
        type: 'introduction' as const, targetKeys: ['Tab'],
        content: '', icon: '↹', chapterId: 'bottom-row',
        tipContent: 'The Tab key is to the left of Q. Press it with your left pinky. It creates an indent in text and moves you to the next field in forms.',
      },
      // History of QWERTY
      {
        id: 0, title: 'History of QWERTY',
        description: 'Did you know the QWERTY layout was designed in 1873? Learn why the keys are arranged this way.',
        type: 'tip' as const, targetKeys: [],
        content: '', icon: '📜', chapterId: 'bottom-row',
        tipContent: 'The QWERTY keyboard layout was designed by Christopher Latham Sholes in 1873 for the Remington typewriter. It was arranged to prevent mechanical typewriter arms from jamming by separating commonly used letter pairs. Despite being designed for a problem that no longer exists, QWERTY remains the standard layout worldwide!',
      },
      // Active break reminder
      {
        id: 0, title: 'Take an Active Break!',
        description: 'You have been typing for a while. Stand up, stretch your wrists, and roll your shoulders.',
        type: 'tip' as const, targetKeys: [],
        content: '', icon: '🧘',  chapterId: 'bottom-row',
        tipContent: 'Every 20-30 minutes, take a short break: (1) Stand up and stretch. (2) Roll your wrists in circles. (3) Squeeze and release your hands. (4) Roll your shoulders forward and backward. Your hands will thank you!',
      },
    ],
  });

  const bottomKeys = ['v', 'm', 'c', ',', 'x', '.', 'z', '/', 'b', 'n'];
  const allKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'r', 'u', 'e', 'i', 'w', 'o', 'q', 'y', 'p', 't', ...bottomKeys];
  const extra: LessonDef[] = [];
  let nextId = base[base.length - 1].id + 1;

  // Bottom row words
  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Bottom Row Words',
    description: 'Real words mixing all three rows.',
    type: 'paragraph',
    targetKeys: allKeys,
    content: generateWordDrill(BOTTOM_ROW_WORDS, 130, 1111),
    icon: '📝',
    chapterId: 'bottom-row',
  }));

  // Full keyboard mix
  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Full Keyboard Mix',
    description: 'All three rows combined! You now know every letter key.',
    type: 'review',
    targetKeys: allKeys,
    content: generateWordDrill([...BOTTOM_ROW_WORDS, ...COMMON_WORDS.slice(0, 30)], 140, 2222),
    icon: '🔄',
    chapterId: 'bottom-row',
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  // Pad to 37 lessons (52-88)
  while (base.length + extra.length < 37) {
    extra.push(makeLessonDef({
      id: nextId++,
      title: `Full Keyboard Drill ${extra.length}`,
      description: 'Practice all letter keys across all three rows.',
      type: 'practice',
      targetKeys: allKeys,
      content: generateMixedDrill(bottomKeys, 120, nextId * 7),
      icon: '⌨️',
      chapterId: 'bottom-row',
    }));
  }

  const all = [...base, ...extra].slice(0, 37);
  return all.map((l, i) => ({ ...l, id: 52 + i }));
}
