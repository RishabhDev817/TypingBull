/** Canonical URL helpers. Pure functions with no app imports so they can be unit-tested. */

export const PRODUCTION_DOMAIN = 'https://typingbull.com';

/**
 * Normalizes a pathname into a consistent canonical path with a trailing slash.
 */
export function normalizeCanonicalPath(rawPath: string): string {
  // Strip query and hash
  const clean = rawPath.split('?')[0].split('#')[0].trim();
  if (!clean || clean === '/') return '/';
  return clean.endsWith('/') ? clean : `${clean}/`;
}

/**
 * Builds the canonical URL for a given path and optional locale.
 */
export function buildCanonicalUrl(path: string, lang: string = 'en'): string {
  const normalized = normalizeCanonicalPath(path);
  if (normalized === '/') {
    return lang === 'en' ? `${PRODUCTION_DOMAIN}/` : `${PRODUCTION_DOMAIN}/${lang}/`;
  }

  // Check if path already starts with a locale
  const segments = normalized.split('/').filter(Boolean);
  const supportedLocales: string[] = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'hi'];

  let pureSubpath = normalized;
  if (segments.length > 0 && supportedLocales.includes(segments[0])) {
    pureSubpath = '/' + segments.slice(1).join('/') + (segments.length > 1 ? '/' : '');
  }

  // A locale-only path (e.g. "/es/") is that language's home page, not the English one.
  if (pureSubpath === '/') {
    return lang === 'en' ? `${PRODUCTION_DOMAIN}/` : `${PRODUCTION_DOMAIN}/${lang}/`;
  }
  if (lang === 'en') {
    return `${PRODUCTION_DOMAIN}${pureSubpath}`;
  }

  return `${PRODUCTION_DOMAIN}/${lang}${pureSubpath}`;
}
