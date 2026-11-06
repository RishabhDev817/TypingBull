/**
 * Tiny event channel between the typing screens and the living background.
 * Typing screens call emitKeystroke(correct) when they judge a key; the background listens for
 * 'tb:keystroke' and turns it into fireflies (correct) or a gust of wind (mistake).
 * It does nothing when nobody listens (phones, reduced motion, pages without the background).
 */
export const KEYSTROKE_EVENT = 'tb:keystroke';

export interface KeystrokeDetail {
  correct: boolean;
  /** Consecutive correct keystrokes, 0 right after a mistake. */
  streak: number;
}

let streak = 0;

export function emitKeystroke(correct: boolean): void {
  if (typeof window === 'undefined') return;
  streak = correct ? streak + 1 : 0;
  window.dispatchEvent(new CustomEvent<KeystrokeDetail>(KEYSTROKE_EVENT, { detail: { correct, streak } }));
}

/** Call when a new test or lesson starts so a streak from earlier doesn't carry over. */
export function resetKeystrokeStreak(): void {
  streak = 0;
}
