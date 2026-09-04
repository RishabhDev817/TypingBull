/**
 * Symbols Chapter — Lessons 317–346
 * ──────────────────────────────────
 * Basic Shift+Number symbols: $&, #&*, @&(, !&), %&^
 */

import type { LessonDef } from './types';
import { generateSymbolChapter } from './generators';

export function createSymbolsLessons(): LessonDef[] {
  const lessons = generateSymbolChapter({
    startId: 317,
    chapterId: 'symbols',
    pairs: [
      { keys: ['$', '&'], name: 'Dollar & Ampersand', finger: 'Index' },
      { keys: ['#', '*'], name: 'Hash & Asterisk', finger: 'Middle' },
      { keys: ['@', '('], name: 'At & Open Paren', finger: 'Ring' },
      { keys: ['!', ')'], name: 'Exclamation & Close Paren', finger: 'Pinky' },
      { keys: ['%', '^'], name: 'Percent & Caret', finger: 'Index' },
    ],
    isSymbol: true,
  });

  const trimmed = lessons.slice(0, 30);
  return trimmed.map((l, i) => ({ ...l, id: 317 + i }));
}
