/**
 * Common Patterns Chapters — Micro-drill chapters
 * ─────────────────────────────────────────────────
 * Common Patterns 1: Lessons 192–202
 * Common Patterns 2: Lessons 275–285
 * Common Patterns 3: Lessons 419–428
 */

import type { LessonDef } from './types';
import { generatePatternsChapter } from './generators';

export function createCommonPatterns1(): LessonDef[] {
  const lessons = generatePatternsChapter({
    startId: 192,
    chapterId: 'common-patterns-1',
    patterns: [
      { pattern: 'the', words: ['the', 'then', 'there', 'these', 'them', 'other', 'together', 'weather', 'whether'] },
      { pattern: 'ing', words: ['going', 'being', 'doing', 'making', 'having', 'coming', 'taking', 'living', 'working'] },
      { pattern: 'tion', words: ['action', 'nation', 'station', 'question', 'section', 'position', 'education', 'attention'] },
      { pattern: 'est', words: ['best', 'rest', 'test', 'west', 'nest', 'quest', 'fastest', 'biggest', 'smallest'] },
      { pattern: 'ment', words: ['moment', 'movement', 'government', 'statement', 'treatment', 'apartment', 'environment'] },
    ],
  });
  const trimmed = lessons.slice(0, 11);
  return trimmed.map((l, i) => ({ ...l, id: 192 + i }));
}

export function createCommonPatterns2(): LessonDef[] {
  const lessons = generatePatternsChapter({
    startId: 275,
    chapterId: 'common-patterns-2',
    patterns: [
      { pattern: 'eal', words: ['deal', 'real', 'heal', 'meal', 'seal', 'steal', 'reveal', 'ideal', 'appeal'] },
      { pattern: 'ate', words: ['late', 'rate', 'gate', 'state', 'create', 'debate', 'private', 'operate', 'climate'] },
      { pattern: 'own', words: ['own', 'down', 'town', 'brown', 'crown', 'grown', 'known', 'shown', 'thrown'] },
      { pattern: 'ill', words: ['will', 'fill', 'kill', 'still', 'skill', 'drill', 'thrill', 'fulfill', 'brilliant'] },
      { pattern: 'ight', words: ['light', 'night', 'right', 'fight', 'might', 'sight', 'tight', 'bright', 'flight'] },
    ],
  });
  const trimmed = lessons.slice(0, 11);
  return trimmed.map((l, i) => ({ ...l, id: 275 + i }));
}

export function createCommonPatterns3(): LessonDef[] {
  const lessons = generatePatternsChapter({
    startId: 419,
    chapterId: 'common-patterns-3',
    patterns: [
      { pattern: 'ous', words: ['famous', 'nervous', 'serious', 'curious', 'obvious', 'various', 'previous', 'enormous'] },
      { pattern: 'able', words: ['table', 'stable', 'capable', 'valuable', 'available', 'comfortable', 'remarkable'] },
      { pattern: 'ness', words: ['business', 'darkness', 'happiness', 'awareness', 'kindness', 'sadness', 'weakness'] },
      { pattern: 'ful', words: ['beautiful', 'wonderful', 'powerful', 'helpful', 'careful', 'grateful', 'successful'] },
      { pattern: 'less', words: ['endless', 'helpless', 'homeless', 'careless', 'wireless', 'useless', 'countless'] },
    ],
  });
  const trimmed = lessons.slice(0, 10);
  return trimmed.map((l, i) => ({ ...l, id: 419 + i }));
}
