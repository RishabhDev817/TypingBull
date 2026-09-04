/**
 * Curriculum Registry — Sections & Chapters
 * ──────────────────────────────────────────
 * Defines the 5 sections and 25 chapters that make up
 * the TypingBull 685-lesson curriculum.
 */

import type { Chapter, Section } from './lessons/types';

// ─── Sections ────────────────────────────────────────────────────

export const SECTIONS: Section[] = [
  {
    id: 'core-keyboard',
    title: 'Core Keyboard Geography',
    icon: '⌨️',
    description: 'Learn finger placement and build muscle memory for every key.',
    chapterIds: ['home-row', 'top-row', 'bottom-row'],
  },
  {
    id: 'basic-fluency',
    title: 'Basic Fluency & Habit Building',
    icon: '📈',
    description: 'Build baseline speed while developing proper typing habits.',
    chapterIds: ['basic-1', 'basic-2', 'basic-3'],
  },
  {
    id: 'specialized-mechanics',
    title: 'Specialized Mechanics',
    icon: '⚙️',
    description: 'Master Shift, numbers, and symbols — the outer edges of the keyboard.',
    chapterIds: ['shift-key', 'numbers', 'symbols', 'more-symbols'],
  },
  {
    id: 'micro-drills',
    title: 'Micro-Drills',
    icon: '🧩',
    description: 'Sharpen specific skills with tricky words and common patterns.',
    chapterIds: [
      'tricky-words-1', 'common-patterns-1',
      'tricky-words-2', 'common-patterns-2',
      'tricky-words-3', 'common-patterns-3',
    ],
  },
  {
    id: 'advanced-speed',
    title: 'Advanced Speed Building',
    icon: '🚀',
    description: 'Push to professional typing speeds with thematic paragraphs.',
    chapterIds: [
      'advanced-1', 'advanced-2', 'advanced-3',
      'advanced-4', 'advanced-5', 'advanced-6',
      'advanced-7', 'advanced-8', 'advanced-9',
    ],
  },
];

// ─── Chapters ────────────────────────────────────────────────────
// Ordered by lesson-ID curriculum sequence (the order a student encounters them).

export const CHAPTERS: Chapter[] = [
  // ── Section 1: Core Keyboard Geography ─────────────────────
  {
    id: 'home-row',
    title: 'Home Row',
    icon: '🏠',
    description: 'F & J, D & K, S & L, A & ;, G & H, Space Bar',
    sectionId: 'core-keyboard',
    lessonRange: [1, 23],
    color: '#22C55E',
    order: 0,
  },
  {
    id: 'top-row',
    title: 'Top Row',
    icon: '⬆️',
    description: 'R & U, E & I, W & O, Q & Y, P & T',
    sectionId: 'core-keyboard',
    lessonRange: [24, 51],
    color: '#3B82F6',
    order: 1,
  },
  {
    id: 'bottom-row',
    title: 'Bottom Row',
    icon: '⬇️',
    description: 'V & M, C & Comma, X & Period, Z & Slash, B & N, Tab',
    sectionId: 'core-keyboard',
    lessonRange: [52, 88],
    color: '#8B5CF6',
    order: 2,
  },

  // ── Section 2: Basic Fluency (interleaved with micro-drills) ──
  {
    id: 'basic-1',
    title: 'Basic Level 1',
    icon: '🐣',
    description: 'Build habits: posture, screen, muscle training',
    sectionId: 'basic-fluency',
    lessonRange: [89, 126],
    color: '#F59E0B',
    wpmGoal: 21,
    order: 3,
  },

  // ── Section 4: Micro-Drills (interspersed) ─────────────────
  {
    id: 'tricky-words-1',
    title: 'Tricky Words 1',
    icon: '🧠',
    description: 'there/their, to/too/two, your/you\'re',
    sectionId: 'micro-drills',
    lessonRange: [127, 137],
    color: '#EC4899',
    order: 4,
  },

  // ── Section 3: Specialized Mechanics ───────────────────────
  {
    id: 'shift-key',
    title: 'Shift Key',
    icon: '⬆️',
    description: 'Capitalization with Shift for every letter',
    sectionId: 'specialized-mechanics',
    lessonRange: [138, 191],
    color: '#EF4444',
    order: 5,
  },

  {
    id: 'common-patterns-1',
    title: 'Common Patterns 1',
    icon: '🧩',
    description: 'the, ing, tion, est, ment',
    sectionId: 'micro-drills',
    lessonRange: [192, 202],
    color: '#06B6D4',
    order: 6,
  },

  {
    id: 'basic-2',
    title: 'Basic Level 2',
    icon: '🐥',
    description: 'Vasco da Gama, Solar System, Photosynthesis',
    sectionId: 'basic-fluency',
    lessonRange: [203, 233],
    color: '#F59E0B',
    wpmGoal: 30,
    order: 7,
  },

  {
    id: 'tricky-words-2',
    title: 'Tricky Words 2',
    icon: '🧠',
    description: 'lose/loose, then/than, weather/whether',
    sectionId: 'micro-drills',
    lessonRange: [234, 244],
    color: '#EC4899',
    order: 8,
  },

  {
    id: 'numbers',
    title: 'Numbers',
    icon: '🔢',
    description: 'Number row: 4&7, 3&8, 2&9, 1&0, 5&6',
    sectionId: 'specialized-mechanics',
    lessonRange: [245, 274],
    color: '#EF4444',
    order: 9,
  },

  {
    id: 'common-patterns-2',
    title: 'Common Patterns 2',
    icon: '🧩',
    description: 'eal, ate, own, ill, ight',
    sectionId: 'micro-drills',
    lessonRange: [275, 285],
    color: '#06B6D4',
    order: 10,
  },

  {
    id: 'basic-3',
    title: 'Basic Level 3',
    icon: '🐔',
    description: 'Earthquake, Newton\'s Laws, Tornadoes',
    sectionId: 'basic-fluency',
    lessonRange: [286, 316],
    color: '#F59E0B',
    wpmGoal: 30,
    order: 11,
  },

  {
    id: 'symbols',
    title: 'Symbols',
    icon: '💲',
    description: '$&, #*, @(, !), %^',
    sectionId: 'specialized-mechanics',
    lessonRange: [317, 346],
    color: '#EF4444',
    order: 12,
  },

  {
    id: 'tricky-words-3',
    title: 'Tricky Words 3',
    icon: '🧠',
    description: 'achieve/believe, principal/principle, stationary/stationery',
    sectionId: 'micro-drills',
    lessonRange: [347, 357],
    color: '#EC4899',
    order: 13,
  },

  // ── Section 5: Advanced Speed Building ─────────────────────
  {
    id: 'advanced-1',
    title: 'Advanced Level 1',
    icon: '🏃',
    description: 'Driverless Cars, Scandinavia, Metabolism',
    sectionId: 'advanced-speed',
    lessonRange: [358, 388],
    color: '#A855F7',
    wpmGoal: 45,
    order: 14,
  },

  {
    id: 'more-symbols',
    title: 'More Symbols',
    icon: '🔣',
    description: '~`, \'"", -=, _+, [], {}, \\|, <>',
    sectionId: 'specialized-mechanics',
    lessonRange: [389, 418],
    color: '#EF4444',
    order: 15,
  },

  {
    id: 'common-patterns-3',
    title: 'Common Patterns 3',
    icon: '🧩',
    description: 'ous, able, ness, ful, less',
    sectionId: 'micro-drills',
    lessonRange: [419, 428],
    color: '#06B6D4',
    order: 16,
  },

  {
    id: 'advanced-2',
    title: 'Advanced Level 2',
    icon: '🏃‍♂️',
    description: 'Great Depression, Carbon Dioxide, Muhammad Ali',
    sectionId: 'advanced-speed',
    lessonRange: [429, 458],
    color: '#A855F7',
    wpmGoal: 50,
    order: 17,
  },

  {
    id: 'advanced-3',
    title: 'Advanced Level 3',
    icon: '🚴',
    description: 'Robots, Black Hole, Marie Curie',
    sectionId: 'advanced-speed',
    lessonRange: [459, 488],
    color: '#A855F7',
    wpmGoal: 55,
    order: 18,
  },

  {
    id: 'advanced-4',
    title: 'Advanced Level 4',
    icon: '🏎️',
    description: 'Amelia Earhart, U.S. Constitution, Romeo and Juliet',
    sectionId: 'advanced-speed',
    lessonRange: [489, 518],
    color: '#A855F7',
    wpmGoal: 60,
    order: 19,
  },

  {
    id: 'advanced-5',
    title: 'Advanced Level 5',
    icon: '🛩️',
    description: 'Oliver Twist, Static Electricity, Michael Jordan',
    sectionId: 'advanced-speed',
    lessonRange: [519, 548],
    color: '#A855F7',
    wpmGoal: 63,
    order: 20,
  },

  {
    id: 'advanced-6',
    title: 'Advanced Level 6',
    icon: '🚀',
    description: 'Milky Way, J.K. Rowling, Copernicus',
    sectionId: 'advanced-speed',
    lessonRange: [549, 578],
    color: '#A855F7',
    wpmGoal: 66,
    order: 21,
  },

  {
    id: 'advanced-7',
    title: 'Advanced Level 7',
    icon: '✈️',
    description: 'NASA, Steve Jobs, Don Quixote',
    sectionId: 'advanced-speed',
    lessonRange: [579, 608],
    color: '#A855F7',
    wpmGoal: 69,
    order: 22,
  },

  {
    id: 'advanced-8',
    title: 'Advanced Level 8',
    icon: '🛸',
    description: 'Judicial Branch, Plagiarism, Wind Power',
    sectionId: 'advanced-speed',
    lessonRange: [609, 638],
    color: '#A855F7',
    wpmGoal: 72,
    order: 23,
  },

  {
    id: 'advanced-9',
    title: 'Advanced Level 9',
    icon: '🏆',
    description: 'Smart Phones, Virtual Reality, Mariana Trench & Final Lesson',
    sectionId: 'advanced-speed',
    lessonRange: [639, 685],
    color: '#F59E0B',
    wpmGoal: 75,
    order: 24,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id);
}

export function getChapterByLessonId(lessonId: number): Chapter | undefined {
  return CHAPTERS.find(c => lessonId >= c.lessonRange[0] && lessonId <= c.lessonRange[1]);
}

export function getSectionById(id: string): Section | undefined {
  return SECTIONS.find(s => s.id === id);
}

/** Get chapters in curriculum order (by the `order` field). */
export function getChaptersInOrder(): Chapter[] {
  return [...CHAPTERS].sort((a, b) => a.order - b.order);
}

/** Get all chapters belonging to a section. */
export function getChaptersForSection(sectionId: string): Chapter[] {
  const section = getSectionById(sectionId);
  if (!section) return [];
  return section.chapterIds.map(id => CHAPTERS.find(c => c.id === id)).filter(Boolean) as Chapter[];
}
