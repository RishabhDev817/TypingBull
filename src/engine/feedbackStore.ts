/**
 * Feedback Store & Type Definitions for TypingBull
 * Handles client-side persistence, background metadata extraction, and voting data structures.
 */

import { getSessions, getStreakData, getTotalStars, getCompletedLessonCount } from './sessionStore';

export type FeedbackType = 'feature_request' | 'bug_report' | 'improvement' | 'general';
export type FeedbackPriority = 'nice_to_have' | 'really_help' | 'need_this';
export type FeedbackStatus = 'submitted' | 'under_review' | 'planned' | 'in_development' | 'completed' | 'declined';

export interface UserTypingMetadata {
  currentWpm: number;
  accuracy: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  userLevel: string;
  totalStars: number;
  completedLessons: number;
  pageUrl: string;
  userAgent: string;
  timestamp: string;
}

export interface FeedbackSubmission {
  id: string;
  userId?: string;
  feedbackType: FeedbackType;
  message: string;
  useCase: string[];
  priority: FeedbackPriority;
  rating?: number | null;
  ratingComment?: string;
  email?: string;
  createdAt: string;
  status: FeedbackStatus;
  votes: number;
  metadata: UserTypingMetadata;
}

const STORAGE_KEY = 'typingbull_user_feedbacks';

/**
 * Extracts available typing context automatically from sessionStore.
 */
export function getTypingMetadata(): UserTypingMetadata {
  const sessions = getSessions();
  const streak = getStreakData();
  const totalStars = getTotalStars();
  const completedLessons = getCompletedLessonCount();

  const lastSession = sessions.length > 0 ? sessions[0] : null;
  const currentWpm = lastSession?.wpm ?? 0;
  const accuracy = lastSession?.accuracy ?? 0;

  // Derive user level from lessons and stars
  let userLevel = 'Beginner Typist';
  if (totalStars >= 60 || currentWpm >= 70) {
    userLevel = 'Elite Typist';
  } else if (totalStars >= 30 || currentWpm >= 50) {
    userLevel = 'Pro Typist';
  } else if (totalStars >= 10 || currentWpm >= 35) {
    userLevel = 'Intermediate Typist';
  }

  return {
    currentWpm,
    accuracy,
    totalSessions: streak.totalSessions || sessions.length,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    userLevel,
    totalStars,
    completedLessons,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Saves a submitted feedback locally so data is preserved even if offline.
 */
export function saveLocalFeedback(feedback: FeedbackSubmission): void {
  try {
    const existing = getLocalFeedbacks();
    existing.unshift(feedback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.warn('[FeedbackStore] Failed to save local feedback:', err);
  }
}

/**
 * Retrieves past feedback submissions from localStorage.
 */
export function getLocalFeedbacks(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FeedbackSubmission[];
  } catch {
    return [];
  }
}
