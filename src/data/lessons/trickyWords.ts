/**
 * Tricky Words Chapters — Interspersed micro-drill chapters
 * ──────────────────────────────────────────────────────────
 * Tricky Words 1: Lessons 127–137
 * Tricky Words 2: Lessons 234–244
 * Tricky Words 3: Lessons 347–357
 */

import type { LessonDef } from './types';
import { generateTrickyWordsChapter } from './generators';

export function createTrickyWords1(): LessonDef[] {
  const lessons = generateTrickyWordsChapter({
    startId: 127,
    chapterId: 'tricky-words-1',
    wordPairs: [
      { words: ['there', 'their', 'they\'re'], tip: '"There" is a place. "Their" shows ownership. "They\'re" = they are.' },
      { words: ['to', 'too', 'two'], tip: '"To" is a direction. "Too" means also or excessive. "Two" is the number 2.' },
      { words: ['your', 'you\'re'], tip: '"Your" shows ownership. "You\'re" = you are. Try replacing with "you are" to check.' },
      { words: ['its', 'it\'s'], tip: '"Its" shows ownership (the dog wagged its tail). "It\'s" = it is or it has.' },
      { words: ['affect', 'effect'], tip: '"Affect" is usually a verb (to affect). "Effect" is usually a noun (the effect).' },
    ],
  });
  const trimmed = lessons.slice(0, 11);
  return trimmed.map((l, i) => ({ ...l, id: 127 + i }));
}

export function createTrickyWords2(): LessonDef[] {
  const lessons = generateTrickyWordsChapter({
    startId: 234,
    chapterId: 'tricky-words-2',
    wordPairs: [
      { words: ['lose', 'loose', 'loss'], tip: '"Lose" means to misplace. "Loose" means not tight. "Loss" is the result of losing.' },
      { words: ['then', 'than'], tip: '"Then" is about time (first this, then that). "Than" is for comparison (bigger than).' },
      { words: ['accept', 'except'], tip: '"Accept" means to receive. "Except" means to exclude or leave out.' },
      { words: ['weather', 'whether'], tip: '"Weather" is rain, sun, snow. "Whether" introduces a choice or condition.' },
      { words: ['scene', 'seen'], tip: '"Scene" is a view or part of a play. "Seen" is past participle of "see".' },
    ],
  });
  const trimmed = lessons.slice(0, 11);
  return trimmed.map((l, i) => ({ ...l, id: 234 + i }));
}

export function createTrickyWords3(): LessonDef[] {
  const lessons = generateTrickyWordsChapter({
    startId: 347,
    chapterId: 'tricky-words-3',
    wordPairs: [
      { words: ['achieve', 'believe'], tip: 'Both follow "i before e" but after different consonants. Practice the -ieve ending.' },
      { words: ['principal', 'principle'], tip: '"Principal" is a person (school principal) or main. "Principle" is a rule or belief.' },
      { words: ['stationary', 'stationery'], tip: '"Stationary" means not moving. "Stationery" is paper and writing supplies (e for envelope).' },
      { words: ['complement', 'compliment'], tip: '"Complement" completes something. "Compliment" is praise or flattery.' },
      { words: ['council', 'counsel'], tip: '"Council" is a group of advisors. "Counsel" means advice or to give advice.' },
    ],
  });
  const trimmed = lessons.slice(0, 11);
  return trimmed.map((l, i) => ({ ...l, id: 347 + i }));
}
