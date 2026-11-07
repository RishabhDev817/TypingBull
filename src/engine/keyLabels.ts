/** Small, dependency-free helpers for showing keys (letters and punctuation) in the weak-key advice. */

/** Punctuation keys share a finger with a letter key in the same position on the keyboard. */
const SAME_FINGER_AS: Record<string, string> = {
  ',': 'k',
  '.': 'l',
  ';': ';',
  "'": ';',
  '/': ';',
  '-': ';',
  '?': ';',
  '!': 'a',
};

/** The letter key whose finger names should be used for `key`, or null when it has no known finger. */
export function fingerSourceKey(key: string): string | null {
  if (/^[a-z]$/i.test(key)) return key.toLowerCase();
  return SAME_FINGER_AS[key] ?? null;
}

/** How a key reads in a sentence: letters in capitals, punctuation inside quotes so “,” cannot look like list punctuation. */
export function keyForSentence(key: string): string {
  return /^[a-z]$/i.test(key) ? key.toUpperCase() : `“${key}”`;
}

/** Keys worth drilling in the typing test (letters only, lower case, in order, no repeats, at most `max`). */
export function drillableKeys(keys: string[], max = 4): string[] {
  const out: string[] = [];
  for (const k of keys) {
    const l = k.toLowerCase();
    if (/^[a-z]$/.test(l) && !out.includes(l)) out.push(l);
    if (out.length >= max) break;
  }
  return out;
}
