/**
 * Lesson Type & Curriculum Type Definitions
 * ─────────────────────────────────────────
 * Supports 685 lessons organized into Sections → Chapters → Lessons.
 */

/** Distinct lesson interaction types — each renders differently in the UI. */
export type LessonType =
  | 'introduction'  // Read-only info screen with key placement visuals
  | 'practice'      // Standard key drill (type the given string)
  | 'review'        // Mixed review of previously learned keys
  | 'play'          // Gamified drill (speed challenge, combo mode)
  | 'travel'        // Finger-travel visualization + focused drill
  | 'paragraph'     // Full sentence/paragraph typing for speed
  | 'tip'           // Ergonomic, motivational, or history content (read & continue)
  | 'test';         // Timed assessment with WPM + accuracy gate

/** A single lesson in the curriculum. */
export interface LessonDef {
  id: number;
  title: string;
  description: string;
  type: LessonType;
  targetKeys: string[];         // Keys this lesson focuses on
  content: string;              // The text to type (empty for 'introduction'/'tip')
  passingAccuracy: number;      // Minimum accuracy to pass (0–100)
  starThresholds: [number, number, number]; // [1★, 2★, 3★] accuracy
  icon: string;                 // Emoji icon
  chapterId: string;            // Parent chapter ID
  wpmGoal?: number;             // Target WPM (for 'test' / speed lessons)
  tipContent?: string;          // Rich tip text (for 'introduction' / 'tip')
  fingerGuide?: string;         // e.g. 'L-Index', 'R-Pinky' (for 'travel')
}

/** A chapter groups a contiguous range of lessons under a thematic banner. */
export interface Chapter {
  id: string;
  title: string;
  icon: string;
  description: string;
  sectionId: string;
  lessonRange: [number, number]; // [startId, endId] inclusive
  color: string;                 // Theme accent color (hex)
  wpmGoal?: number;              // Target WPM for this chapter (if speed-focused)
  order: number;                 // Global display order (0-indexed)
}

/** A section is the top-level curriculum grouping (e.g. "Core Keyboard Geography"). */
export interface Section {
  id: string;
  title: string;
  icon: string;
  description: string;
  chapterIds: string[];          // Ordered chapter IDs in this section
}
