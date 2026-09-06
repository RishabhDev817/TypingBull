import {
  ui,
  DEFAULT_LOCALE,
  LOCALES,
  type SupportedLocale,
  type TranslationKey,
} from './ui';

/**
 * Returns a translation helper scoped to the specified language.
 * Automatically falls back to English (DEFAULT_LOCALE) if key is missing.
 */
export function useTranslations(lang: SupportedLocale = DEFAULT_LOCALE) {
  return function t(key: TranslationKey | string, vars?: Record<string, string | number>): string {
    const localeDict = ui[lang] as Record<string, string> | undefined;
    const defaultDict = ui[DEFAULT_LOCALE] as Record<string, string>;

    let text = (localeDict && key in localeDict && localeDict[key]) || defaultDict[key as TranslationKey] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };
}

/**
 * Extracts active locale from a URL or pathname.
 * Root '/' or unrecognized prefixes return the default 'en'.
 */
export function getLangFromUrl(url: URL | string): SupportedLocale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0] as SupportedLocale;

  if (potentialLocale && LOCALES.includes(potentialLocale)) {
    return potentialLocale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Strips any locale prefix from a pathname.
 * e.g., '/fr/practice' -> '/practice'
 *       '/ja' -> '/'
 *       '/practice' -> '/practice'
 */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0] as SupportedLocale)) {
    segments.shift();
  }
  const clean = '/' + segments.join('/');
  // Preserve trailing slash if original had one and clean isn't root
  return clean === '' ? '/' : clean;
}

/**
 * Generates the localized path for a given target locale.
 * Default locale ('en') sits cleanly at root without prefix.
 * Non-default locales are prefixed with '/<locale>'.
 *
 * e.g. on '/practice':
 *   target 'fr' -> '/fr/practice'
 *   target 'en' -> '/practice'
 * e.g. on '/ja/practice':
 *   target 'de' -> '/de/practice'
 *   target 'en' -> '/practice'
 */
export function getLocalizedPathname(
  pathname: string,
  targetLocale: SupportedLocale
): string {
  const cleanPath = stripLocaleFromPathname(pathname);

  if (targetLocale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  // If root page, return '/fr/' or '/fr'
  if (cleanPath === '/') {
    return `/${targetLocale}`;
  }

  return `/${targetLocale}${cleanPath}`;
}

export interface HreflangEntry {
  locale: string;
  href: string;
}

/**
 * Generates an array of hreflang tags including the critical 'x-default' tag.
 * Automatically aligns with Astro's routing (English at root, others at subpaths).
 */
export function generateHreflangLinks(
  currentPathname: string,
  siteUrl = 'https://typingbull.com'
): HreflangEntry[] {
  const cleanPath = stripLocaleFromPathname(currentPathname);
  const base = siteUrl.replace(/\/+$/, '');

  const links: HreflangEntry[] = [];

  // 1. Specific locale alternates
  for (const locale of LOCALES) {
    let localizedPath = cleanPath;
    if (locale !== DEFAULT_LOCALE) {
      localizedPath = cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
    }
    const fullHref = `${base}${localizedPath === '/' ? '/' : localizedPath}`;
    links.push({
      locale,
      href: fullHref,
    });
  }

  // 2. x-default points to default locale (English root)
  const defaultPath = cleanPath === '/' ? '/' : cleanPath;
  links.push({
    locale: 'x-default',
    href: `${base}${defaultPath}`,
  });

  return links;
}
