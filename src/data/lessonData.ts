/**
 * Lesson Data — Backward-compatible re-exports.
 * ──────────────────────────────────────────────
 * The canonical lesson data now lives in `./lessons/`.
 * This file re-exports the public API so existing consumers
 * (TrainMap, LearnPage, LessonView, DashboardPage) continue to work.
 */

export type { LessonDef, LessonType, Chapter, Section } from './lessons/index';
export { LESSONS, getLessonById, getLessonsForChapter, TOTAL_LESSONS } from './lessons/index';
