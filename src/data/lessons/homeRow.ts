/**
 * Home Row Chapter — Lessons 1–23
 * ────────────────────────────────
 * F&J → D&K → S&L → A&; → G&H, Space Bar, Reviews, Play
 */

import type { LessonDef } from './types';
import {
  generateKeyPairChapter,
  makeLessonDef,
  generateMixedDrill,
  generateWordDrill,
  HOME_ROW_WORDS,
} from './generators';

export function createHomeRowLessons(): LessonDef[] {
  const base = generateKeyPairChapter({
    startId: 1,
    chapterId: 'home-row',
    pairs: [
      { keys: ['f', 'j'], name: 'Index Home Keys', finger: 'Index', hand: 'Both' },
      { keys: ['d', 'k'], name: 'Middle Finger Keys', finger: 'Middle', hand: 'Both' },
      { keys: ['s', 'l'], name: 'Ring Finger Keys', finger: 'Ring', hand: 'Both' },
      { keys: ['a', ';'], name: 'Pinky Keys', finger: 'Pinky', hand: 'Both' },
      { keys: ['g', 'h'], name: 'Center Reach Keys', finger: 'Index', hand: 'Both' },
    ],
    extras: [
      {
        id: 0, // Will be overwritten
        title: 'The Space Bar',
        description: 'Your thumbs handle the space bar. Practice adding spaces between key groups.',
        type: 'practice',
        targetKeys: ['f', 'j', 'd', 'k', ' '],
        content: 'ff jj dd kk fj dk fd jk fj dk fd jk ff jj dd kk fj dk fj dk',
        icon: '👍',
        chapterId: 'home-row',
      },
    ],
  });

  // Pad/adjust to exactly 23 lessons
  const homeRowKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  const extra: LessonDef[] = [];
  let nextId = base[base.length - 1].id + 1;

  // Home Row Words
  if (base.length < 21) {
    extra.push(makeLessonDef({
      id: nextId++,
      title: 'Home Row Words',
      description: 'Real words using only home-row keys! Your fingers are starting to spell.',
      type: 'paragraph',
      targetKeys: homeRowKeys,
      content: generateWordDrill(HOME_ROW_WORDS, 130, 777),
      icon: '📝',
      chapterId: 'home-row',
      passingAccuracy: 88,
      starThresholds: [88, 94, 98],
    }));
  }

  // Home Row Sentences
  if (base.length + extra.length < 22) {
    extra.push(makeLessonDef({
      id: nextId++,
      title: 'Home Row Sentences',
      description: 'Short phrases using only home-row letters. Feel the flow of real typing.',
      type: 'paragraph',
      targetKeys: homeRowKeys,
      content: 'a lad has a flask; a gal shall dash; dad shall fall; a sad lad had a gash; flash a flag; a glad gal shall ask dad; all lads shall dash;',
      icon: '💬',
      chapterId: 'home-row',
      passingAccuracy: 88,
      starThresholds: [88, 94, 98],
    }));
  }

  // Fill remaining slots to reach 23
  while (base.length + extra.length < 23) {
    extra.push(makeLessonDef({
      id: nextId++,
      title: `Home Row Drill ${extra.length}`,
      description: 'Extra practice with all home row keys.',
      type: 'review',
      targetKeys: homeRowKeys,
      content: generateMixedDrill(homeRowKeys, 120, nextId * 3),
      icon: '⌨️',
      chapterId: 'home-row',
    }));
  }

  const all = [...base, ...extra].slice(0, 23);
  // Re-number IDs sequentially 1–23
  return all.map((l, i) => ({ ...l, id: i + 1 }));
}
