/**
 * Shift Key Chapter — Lessons 138–191
 * ────────────────────────────────────
 * Capital letters: re-teaches every key pair with Shift.
 * Travel lessons for finger coordination.
 */

import type { LessonDef } from './types';
import { generateShiftKeyChapter, makeLessonDef } from './generators';

export function createShiftKeyLessons(): LessonDef[] {
  const lessons = generateShiftKeyChapter({
    startId: 138,
    chapterId: 'shift-key',
    pairs: [
      // Home row capitals
      { lower: 'f', upper: 'F', finger: 'L-Index' },
      { lower: 'j', upper: 'J', finger: 'R-Index' },
      { lower: 'd', upper: 'D', finger: 'L-Middle' },
      { lower: 'k', upper: 'K', finger: 'R-Middle' },
      { lower: 's', upper: 'S', finger: 'L-Ring' },
      { lower: 'l', upper: 'L', finger: 'R-Ring' },
      { lower: 'a', upper: 'A', finger: 'L-Pinky' },
      { lower: 'g', upper: 'G', finger: 'L-Index' },
      { lower: 'h', upper: 'H', finger: 'R-Index' },
      // Top row capitals
      { lower: 'r', upper: 'R', finger: 'L-Index' },
      { lower: 'u', upper: 'U', finger: 'R-Index' },
      { lower: 'e', upper: 'E', finger: 'L-Middle' },
      { lower: 'i', upper: 'I', finger: 'R-Middle' },
      { lower: 'w', upper: 'W', finger: 'L-Ring' },
      { lower: 'o', upper: 'O', finger: 'R-Ring' },
      { lower: 'q', upper: 'Q', finger: 'L-Pinky' },
      { lower: 't', upper: 'T', finger: 'L-Index' },
      { lower: 'p', upper: 'P', finger: 'R-Pinky' },
      { lower: 'y', upper: 'Y', finger: 'R-Index' },
      // Bottom row capitals
      { lower: 'v', upper: 'V', finger: 'L-Index' },
      { lower: 'n', upper: 'N', finger: 'R-Index' },
      { lower: 'b', upper: 'B', finger: 'L-Index' },
      { lower: 'm', upper: 'M', finger: 'R-Index' },
      { lower: 'c', upper: 'C', finger: 'L-Middle' },
      { lower: 'x', upper: 'X', finger: 'L-Ring' },
      { lower: 'z', upper: 'Z', finger: 'L-Pinky' },
    ],
  });

  // Insert Shift Key introduction at the start
  const intro: LessonDef = makeLessonDef({
    id: 138,
    title: 'Introducing the Shift Key',
    description: 'The Shift key makes letters UPPERCASE. Press Shift with the opposite hand from the letter you are typing.',
    type: 'introduction',
    targetKeys: ['Shift'],
    content: '',
    icon: '⬆️',
    chapterId: 'shift-key',
    tipContent: 'There are two Shift keys — one on each side of the keyboard. Rule: always press Shift with the OPPOSITE hand from the letter key. Left letter → Right Shift. Right letter → Left Shift. This keeps your hands balanced.',
  });

  // Capitalized sentences practice
  const extra: LessonDef[] = [];
  let nextId = lessons[lessons.length - 1].id + 1;

  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Capitalized Names',
    description: 'Practice typing proper nouns with capital letters.',
    type: 'paragraph',
    targetKeys: [],
    content: 'John went to Paris with Sarah. They visited the Eiffel Tower and the Louvre Museum. David and Emma joined them for dinner at a French restaurant on the Seine River.',
    icon: '📝',
    chapterId: 'shift-key',
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  extra.push(makeLessonDef({
    id: nextId++,
    title: 'Sentence Starters',
    description: 'Every sentence starts with a capital letter. Practice the rhythm.',
    type: 'paragraph',
    targetKeys: [],
    content: 'The sun was bright. She walked to school. He ate lunch quickly. We played games outside. They read books together. I love learning new things. You can do anything. It was a great day.',
    icon: '💬',
    chapterId: 'shift-key',
    passingAccuracy: 85,
    starThresholds: [85, 92, 97],
  }));

  const all = [intro, ...lessons.slice(1), ...extra];
  // Ensure exactly 54 lessons (138-191)
  const trimmed = all.slice(0, 54);
  return trimmed.map((l, i) => ({ ...l, id: 138 + i }));
}
