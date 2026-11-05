import type React from 'react';

/**
 * Guards for every typing input: results must come from real keystrokes.
 * Pasting, dropping text, or any change that adds more than one character at once
 * (paste, autofill, scripted insert) is rejected, so WPM/accuracy can't be inflated
 * and every character is checked against the target text.
 */
const prevent = (e: React.SyntheticEvent) => e.preventDefault();

export const PASTE_GUARD_PROPS = {
  onPaste: prevent,
  onDrop: prevent,
  onDragOver: prevent,
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
} as const;

/** True when `next` adds more than one character to `prev` (paste or bulk insert). */
export function isBulkInsert(prev: string, next: string): boolean {
  return next.length - prev.length > 1;
}
