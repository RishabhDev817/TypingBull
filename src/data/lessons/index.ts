/**
 * Lesson Index — Aggregates all chapter lesson arrays into a single LESSONS export.
 * Also re-exports types and curriculum helpers.
 */

export type { LessonDef, LessonType, Chapter, Section } from './types';

import type { LessonDef } from './types';
import { createHomeRowLessons } from './homeRow';
import { createTopRowLessons } from './topRow';
import { createBottomRowLessons } from './bottomRow';
import { createBasic1Lessons } from './basic1';
import { createTrickyWords1, createTrickyWords2, createTrickyWords3 } from './trickyWords';
import { createShiftKeyLessons } from './shiftKey';
import { createCommonPatterns1, createCommonPatterns2, createCommonPatterns3 } from './commonPatterns';
import { createBasic2Lessons } from './basic2';
import { createNumbersLessons } from './numbers';
import { createBasic3Lessons } from './basic3';
import { createSymbolsLessons } from './symbols';
import { createMoreSymbolsLessons } from './moreSymbols';
import {
  createAdvanced1, createAdvanced2, createAdvanced3,
  createAdvanced4, createAdvanced5, createAdvanced6,
  createAdvanced7, createAdvanced8, createAdvanced9,
} from './advanced';

// Build the full lesson array once at module load time.
// Sorted by lesson ID for efficient lookup.
function buildAllLessons(): LessonDef[] {
  const all: LessonDef[] = [
    ...createHomeRowLessons(),       // 1–23
    ...createTopRowLessons(),        // 24–51
    ...createBottomRowLessons(),     // 52–88
    ...createBasic1Lessons(),        // 89–126
    ...createTrickyWords1(),         // 127–137
    ...createShiftKeyLessons(),      // 138–191
    ...createCommonPatterns1(),      // 192–202
    ...createBasic2Lessons(),        // 203–233
    ...createTrickyWords2(),         // 234–244
    ...createNumbersLessons(),       // 245–274
    ...createCommonPatterns2(),      // 275–285
    ...createBasic3Lessons(),        // 286–316
    ...createSymbolsLessons(),       // 317–346
    ...createTrickyWords3(),         // 347–357
    ...createAdvanced1(),            // 358–388
    ...createMoreSymbolsLessons(),   // 389–418
    ...createCommonPatterns3(),      // 419–428
    ...createAdvanced2(),            // 429–458
    ...createAdvanced3(),            // 459–488
    ...createAdvanced4(),            // 489–518
    ...createAdvanced5(),            // 519–548
    ...createAdvanced6(),            // 549–578
    ...createAdvanced7(),            // 579–608
    ...createAdvanced8(),            // 609–638
    ...createAdvanced9(),            // 639–685
  ];
  return all.sort((a, b) => a.id - b.id);
}

/** The complete curriculum: all 685 lessons sorted by ID. */
export const LESSONS: LessonDef[] = buildAllLessons();

/** Look up a single lesson by its numeric ID. */
export function getLessonById(id: number): LessonDef | undefined {
  return LESSONS.find(l => l.id === id);
}

/** Get all lessons for a specific chapter. */
export function getLessonsForChapter(chapterId: string): LessonDef[] {
  return LESSONS.filter(l => l.chapterId === chapterId);
}

/** Total lesson count. */
export const TOTAL_LESSONS = LESSONS.length;
