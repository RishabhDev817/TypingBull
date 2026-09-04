/**
 * Numbers Chapter — Lessons 245–274
 * ──────────────────────────────────
 * Number row pairs: 4&7, 3&8, 2&9, 1&0, 5&6
 */

import type { LessonDef } from './types';
import { generateSymbolChapter } from './generators';

export function createNumbersLessons(): LessonDef[] {
  const lessons = generateSymbolChapter({
    startId: 245,
    chapterId: 'numbers',
    pairs: [
      { keys: ['4', '7'], name: 'Index Number Keys', finger: 'Index' },
      { keys: ['3', '8'], name: 'Middle Number Keys', finger: 'Middle' },
      { keys: ['2', '9'], name: 'Ring Number Keys', finger: 'Ring' },
      { keys: ['1', '0'], name: 'Pinky Number Keys', finger: 'Pinky' },
      { keys: ['5', '6'], name: 'Center Number Keys', finger: 'Index' },
    ],
  });

  const trimmed = lessons.slice(0, 30);
  return trimmed.map((l, i) => ({ ...l, id: 245 + i }));
}
