import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LANGUAGES,
  DEFAULT_LOCALE,
  LOCALES,
  type SupportedLocale,
  type TranslationKey,
} from '../i18n/ui';
import { useTranslations, getLangFromUrl, getLocalizedPathname } from '../i18n/utils';

interface I18nContextType {
  currentLang: SupportedLocale;
  setLanguage: (lang: SupportedLocale) => void;
  t: (key: TranslationKey | string, vars?: Record<string, string | number>) => string;
  languages: typeof LANGUAGES;
}

const I18nContext = createContext<I18nContextType>({
  currentLang: DEFAULT_LOCALE,
  setLanguage: () => {},
  t: (key) => typeof key === 'string' ? key : '',
  languages: LANGUAGES,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined') {
      // 1. Check URL path
      const urlLang = getLangFromUrl(window.location.pathname);
      if (urlLang !== DEFAULT_LOCALE) return urlLang;

      // 2. Check saved storage
      const saved = localStorage.getItem('typingbull_locale') as SupportedLocale;
      if (saved && LOCALES.includes(saved)) return saved;

      // 3. Check browser navigator
      const navLang = navigator.language?.split('-')[0] as SupportedLocale;
      if (navLang && LOCALES.includes(navLang)) return navLang;
    }
    return DEFAULT_LOCALE;
  });

  const t = useTranslations(currentLang);

  const setLanguage = (newLang: SupportedLocale) => {
    if (!LOCALES.includes(newLang)) return;
    setCurrentLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('typingbull_locale', newLang);

      // Also update html lang attribute
      document.documentElement.lang = newLang;

      // Smoothly update browser URL without destructive full page reload
      const currentPath = window.location.pathname;
      const targetPath = getLocalizedPathname(currentPath, newLang);
      if (currentPath !== targetPath) {
        const fullNewPath = `${targetPath}${window.location.search}${window.location.hash}`;
        window.history.replaceState(null, '', fullNewPath);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  // Sync state when user navigates using browser back / forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const urlLang = getLangFromUrl(window.location.pathname);
      if (urlLang && urlLang !== currentLang) {
        setCurrentLang(urlLang);
        document.documentElement.lang = urlLang;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLang]);

  return (
    <I18nContext.Provider value={{ currentLang, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
