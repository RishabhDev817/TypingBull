/**
 * More Symbols Chapter — Lessons 389–418
 * ───────────────────────────────────────
 * Remaining peripheral symbols: ~&`, '&", -&=, _&+, [&], {&}, \&|, <&>
 */

import type { LessonDef } from './types';
import { generateSymbolChapter } from './generators';

export function createMoreSymbolsLessons(): LessonDef[] {
  const lessons = generateSymbolChapter({
    startId: 389,
    chapterId: 'more-symbols',
    pairs: [
      { keys: ['~', '`'], name: 'Tilde & Backtick', finger: 'L-Pinky' },
      { keys: ["'", '"'], name: 'Apostrophe & Quote', finger: 'R-Pinky' },
      { keys: ['-', '='], name: 'Hyphen & Equals', finger: 'R-Pinky' },
      { keys: ['_', '+'], name: 'Underscore & Plus', finger: 'R-Pinky' },
      { keys: ['[', ']'], name: 'Square Brackets', finger: 'R-Pinky' },
      { keys: ['{', '}'], name: 'Curly Braces', finger: 'R-Pinky' },
      { keys: ['\\', '|'], name: 'Backslash & Pipe', finger: 'R-Pinky' },
      { keys: ['<', '>'], name: 'Angle Brackets', finger: 'Ring/Middle' },
    ],
    isSymbol: true,
  });

  const trimmed = lessons.slice(0, 30);
  return trimmed.map((l, i) => ({ ...l, id: 389 + i }));
}
