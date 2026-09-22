/**
 * Safe, robust moderation layer for user-generated display names.
 * Applies XSS sanitization, character filtering, length enforcement,
 * and reasonable profanity/slur screening.
 */

// Normalized blocklist of severe abusive terms, hate speech, and slurs
const RESTRICTED_TERMS: string[] = [
  'nigger',
  'nigga',
  'faggot',
  'fag',
  'kike',
  'chink',
  'spic',
  'cunt',
  'whore',
  'slut',
  'retard',
  'hitler',
  'nazi',
  'swastika',
  'pedophile',
  'pedo',
  'porn',
  'porno',
  'dickhead',
  'motherfucker',
  'asshole',
  'bitch',
  'bastard',
  'fuck',
  'shit',
  'penis',
  'vagina',
  'dildo',
  'cock',
  'pussy',
];

/**
 * Normalizes text to detect obfuscated / leetspeak profanities
 * e.g., "b!tch" -> "bitch", "f.u.c.k" -> "fuck", "n1gga" -> "nigga"
 */
function normalizeForScreening(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[$5]/g, 's')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[3]/g, 'e')
    .replace(/[8]/g, 'b')
    .replace(/[+]/g, 't')
    .replace(/[^a-z]/g, '') // strip all non-alphabetics
    .replace(/(.)\1{2,}/g, '$1$1'); // collapse excessive character repeats (e.g. "fuuuck" -> "fuuck")
}

/**
 * Checks whether a normalized string contains any term from the restricted list.
 */
export function containsRestrictedContent(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const normalized = normalizeForScreening(name);

  for (const term of RESTRICTED_TERMS) {
    if (normalized.includes(term)) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitizes and moderates user-generated display names.
 * Fails safely by returning a friendly fallback (e.g. "Typist-482" or "Student-120")
 * if input is empty, invalid, or violates moderation rules.
 */
export function sanitizeAndModerateName(
  rawName: string | undefined | null,
  fallbackPrefix: 'Typist' | 'Student' | 'Racer' | 'Teacher' = 'Typist'
): string {
  const fallback = `${fallbackPrefix}-${Math.floor(100 + Math.random() * 900)}`;

  if (!rawName || typeof rawName !== 'string') {
    return fallback;
  }

  // 1. Strip HTML tags and control characters
  const stripped = rawName.replace(/<[^>]*>/g, '');
  const clean = Array.from(stripped)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('')
    .trim();

  // 2. Enforce length boundaries (2 to 20 characters)
  if (clean.length < 2) {
    return fallback;
  }
  const truncated = clean.slice(0, 20);

  // 3. Profanity & slur moderation
  if (containsRestrictedContent(truncated)) {
    return fallback;
  }

  return truncated;
}
