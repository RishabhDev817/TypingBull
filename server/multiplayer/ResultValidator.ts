/**
 * Anti-Cheat & Canonical Result Validation for Practice Ground
 * Reuses TypingBull's exact canonical WPM and accuracy formulas.
 */

import { MULTIPLAYER_CONSTANTS } from './types.ts';

export interface ProgressValidationResult {
  isValid: boolean;
  validatedWpm: number;
  validatedAccuracy: number;
  validatedProgress: number;
  isCompleted: boolean;
  reason?: string;
}

export class ResultValidator {
  /**
   * Sanitizes user input display names to prevent XSS, HTML injection, or layout breakage.
   */
  static sanitizeDisplayName(rawName: string | undefined): string {
    if (!rawName || typeof rawName !== 'string') {
      return `Typist-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Strip HTML tags and non-printable control characters
    const stripped = rawName.replace(/<[^>]*>/g, '');
    const clean = Array.from(stripped)
      .filter((c) => {
        const code = c.charCodeAt(0);
        return code >= 32 && code !== 127;
      })
      .join('')
      .trim();

    // Enforce 2 - 20 character length bounds
    if (clean.length < 2) {
      return `Typist-${Math.floor(100 + Math.random() * 900)}`;
    }

    return clean.slice(0, 20);
  }

  /**
   * Validates a player's real-time progress update against canonical race time and text length.
   */
  static validateProgress(
    raceText: string,
    raceStartAt: number,
    correctChars: number,
    incorrectChars: number,
    totalChars: number,
    clientCompleted: boolean,
    now: number = Date.now()
  ): ProgressValidationResult {
    const elapsedMs = Math.max(100, now - raceStartAt);
    const elapsedMinutes = elapsedMs / 60000;
    const textLength = raceText.length;

    // 1. Bound check: correct chars cannot exceed race text length
    const boundedCorrect = Math.min(Math.max(0, correctChars), textLength);
    const boundedIncorrect = Math.max(0, incorrectChars);
    const calculatedTotal = Math.max(totalChars, boundedCorrect + boundedIncorrect);

    // 2. Canonical TypingBull WPM formula:
    // (correctChars / 5) / elapsedMinutes
    const calculatedWpm = elapsedMinutes > 0
      ? Math.round((boundedCorrect / 5) / elapsedMinutes)
      : 0;

    // 3. Canonical TypingBull Accuracy formula (0-100%, 1 decimal place):
    const calculatedAccuracy = calculatedTotal > 0
      ? Math.round((boundedCorrect / calculatedTotal) * 1000) / 10
      : 100;

    // 4. Progress percentage (0 - 100)
    const calculatedProgress = Math.min(100, Math.round((boundedCorrect / textLength) * 100));

    // 5. Anti-cheat check: Impossible typing speeds (> MAX_WPM_LIMIT e.g. 260 WPM)
    // Allow small burst grace period in first 3 seconds (e.g. typing 1 word fast)
    if (elapsedMs > 3000 && calculatedWpm > MULTIPLAYER_CONSTANTS.MAX_WPM_LIMIT) {
      return {
        isValid: false,
        validatedWpm: MULTIPLAYER_CONSTANTS.MAX_WPM_LIMIT,
        validatedAccuracy: calculatedAccuracy,
        validatedProgress: calculatedProgress,
        isCompleted: false,
        reason: 'Typing speed exceeds human feasibility threshold.',
      };
    }

    // 6. Completion validation: client can only complete if all correct chars match text length
    const isActuallyCompleted = clientCompleted && boundedCorrect >= textLength;

    return {
      isValid: true,
      validatedWpm: calculatedWpm,
      validatedAccuracy: calculatedAccuracy,
      validatedProgress: calculatedProgress,
      isCompleted: isActuallyCompleted,
    };
  }
}
