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
  /** Character counts after server-side bounding (store these, not the raw client values). */
  validatedCorrectChars: number;
  validatedIncorrectChars: number;
  validatedTotalChars: number;
  isCompleted: boolean;
  reason?: string;
}

/** Characters a fast human can burst before the rate cap applies (a short word typed instantly). */
const BURST_ALLOWANCE_CHARS = 10;

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

    const truncated = clean.slice(0, 20);

    // Screen for severe profanity / hate speech / slurs
    const normalized = truncated
      .toLowerCase()
      .replace(/[@4]/g, 'a')
      .replace(/[$5]/g, 's')
      .replace(/[1!|]/g, 'i')
      .replace(/[0]/g, 'o')
      .replace(/[3]/g, 'e')
      .replace(/[^a-z]/g, '')
      .replace(/(.)\1{2,}/g, '$1$1');

    const blockedWords = ['nigger', 'nigga', 'faggot', 'fag', 'kike', 'chink', 'spic', 'cunt', 'whore', 'slut', 'retard', 'hitler', 'nazi', 'pedophile', 'pedo', 'dickhead', 'motherfucker', 'asshole', 'bitch', 'fuck', 'shit', 'penis', 'vagina', 'dildo', 'cock', 'pussy'];
    if (blockedWords.some((word) => normalized.includes(word))) {
      return `Typist-${Math.floor(100 + Math.random() * 900)}`;
    }

    return truncated;
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
    let boundedCorrect = Math.min(Math.max(0, Math.floor(correctChars) || 0), textLength);
    let boundedIncorrect = Math.max(0, Math.floor(incorrectChars) || 0);

    // 2. Anti-cheat from the very first update (no grace window): nobody can have typed more
    // characters than MAX_WPM_LIMIT allows for the time elapsed, plus a small burst allowance.
    // Typos count too, so a client can't "finish" by padding incorrectChars.
    const maxCharsPerSecond = (MULTIPLAYER_CONSTANTS.MAX_WPM_LIMIT * 5) / 60;
    const maxTypedByNow = Math.ceil(maxCharsPerSecond * (elapsedMs / 1000)) + BURST_ALLOWANCE_CHARS;
    let rateExceeded = false;
    if (boundedCorrect + boundedIncorrect > maxTypedByNow) {
      rateExceeded = true;
      boundedCorrect = Math.min(boundedCorrect, maxTypedByNow);
      boundedIncorrect = Math.max(0, Math.min(boundedIncorrect, maxTypedByNow - boundedCorrect));
    }
    const boundedTotal = Math.min(
      Math.max(Math.floor(totalChars) || 0, boundedCorrect + boundedIncorrect),
      maxTypedByNow
    );

    // 3. Canonical TypingBull WPM formula: (correctChars / 5) / elapsedMinutes, never above the human limit
    const calculatedWpm = elapsedMinutes > 0
      ? Math.min(MULTIPLAYER_CONSTANTS.MAX_WPM_LIMIT, Math.round((boundedCorrect / 5) / elapsedMinutes))
      : 0;

    // 4. Canonical TypingBull Accuracy formula (0-100%, 1 decimal place):
    const accuracyBase = Math.max(boundedTotal, boundedCorrect + boundedIncorrect);
    const calculatedAccuracy = accuracyBase > 0
      ? Math.round((boundedCorrect / accuracyBase) * 1000) / 10
      : 100;

    // 5. Progress percentage (0 - 100)
    const calculatedProgress = Math.min(100, Math.round((boundedCorrect / textLength) * 100));

    if (rateExceeded) {
      return {
        isValid: false,
        validatedWpm: calculatedWpm,
        validatedAccuracy: calculatedAccuracy,
        validatedProgress: calculatedProgress,
        validatedCorrectChars: boundedCorrect,
        validatedIncorrectChars: boundedIncorrect,
        validatedTotalChars: boundedTotal,
        isCompleted: false,
        reason: 'Typing speed exceeds human feasibility threshold.',
      };
    }

    // 6. Completion validation: the full passage must have been typed (typos allowed),
    // within the human rate limit already enforced above.
    const hasTypedFullPassage = boundedCorrect + boundedIncorrect >= textLength;
    const isActuallyCompleted = Boolean(clientCompleted && hasTypedFullPassage);

    return {
      isValid: true,
      validatedWpm: calculatedWpm,
      validatedAccuracy: calculatedAccuracy,
      validatedProgress: calculatedProgress,
      validatedCorrectChars: boundedCorrect,
      validatedIncorrectChars: boundedIncorrect,
      validatedTotalChars: boundedTotal,
      isCompleted: isActuallyCompleted,
    };
  }
}
