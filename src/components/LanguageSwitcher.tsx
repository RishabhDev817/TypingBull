import React, { useState, useRef, useEffect } from 'react';
import {
  LANGUAGES,
  LOCALES,
  type SupportedLocale,
  DEFAULT_LOCALE,
} from '../i18n/ui';
import { getLocalizedPathname } from '../i18n/utils';
import { useI18n } from '../context/I18nContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  /** Optional override for the current language */
  currentLang?: SupportedLocale;
  /** Optional custom CSS class for positioning */
  className?: string;
  /** Variant: 'compact' (Option A: Flag + 2-letter code 🇺🇸 EN ⌄) or 'full' (Option B) */
  variant?: 'compact' | 'full';
  /** Dropdown open direction */
  placement?: 'top' | 'bottom';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang: propLang,
  className = '',
  variant = 'compact',
  placement = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use i18n context if available, fallback to local state
  const i18n = useI18n();
  const activeLang = propLang || i18n?.currentLang || DEFAULT_LOCALE;

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Navigate dynamically or update state
  const handleSelectLanguage = (targetLocale: SupportedLocale) => {
    if (targetLocale === activeLang) {
      setIsOpen(false);
      return;
    }

    if (i18n?.setLanguage) {
      i18n.setLanguage(targetLocale);
    }

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;

      // Check if we are running in an Astro multi-page route environment (/es, /ja, etc.)
      const isSubpathLocale = LOCALES.some(
        (l) => l !== DEFAULT_LOCALE && currentPath.startsWith(`/${l}`)
      );

      if (isSubpathLocale) {
        const newPath = getLocalizedPathname(currentPath, targetLocale);
        window.location.href = `${newPath}${currentSearch}${currentHash}`;
      }
    }

    setIsOpen(false);
  };

  const currentMeta = LANGUAGES[activeLang] || LANGUAGES[DEFAULT_LOCALE];

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left select-none z-50 ${className}`}
    >
      {/* Option A (Compact Pill): Flag + 2-letter code (e.g., 🇺🇸 EN ⌄) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="h-10 px-3.5 rounded-full flex items-center gap-2
                   bg-white/80 dark:bg-slate-900/80
                   hover:bg-white dark:hover:bg-slate-800
                   backdrop-blur-xl border border-slate-200/80 dark:border-white/20
                   text-slate-800 dark:text-slate-100 text-xs font-bold
                   shadow-[0_4px_16px_rgba(0,0,0,0.06)]
                   hover:shadow-[0_6px_20px_rgba(59,130,246,0.15)]
                   hover:scale-105 active:scale-95
                   transition-all duration-200 outline-none cursor-pointer"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {currentMeta.flag}
        </span>

        {variant === 'full' ? (
          <span className="tracking-tight text-slate-700 dark:text-slate-200">
            {currentMeta.name} ({activeLang.toUpperCase()})
          </span>
        ) : (
          <span className="uppercase text-xs font-black tracking-wide text-slate-700 dark:text-slate-200">
            {activeLang}
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-500' : ''
          }`}
        />
      </button>

      {/* Glassmorphic Dropdown Menu - Aligned Right & High Z-Index */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className={`absolute right-0 ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } w-56 origin-top-right rounded-2xl
                     bg-white/95 dark:bg-slate-900/95
                     backdrop-blur-2xl border border-slate-200 dark:border-slate-700/80
                     shadow-[0_16px_40px_rgba(0,0,0,0.22)]
                     p-2 z-[9999] animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-blue-500" />
              Language ({LOCALES.length})
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
            {LOCALES.map((locale) => {
              const langMeta = LANGUAGES[locale];
              const isSelected = locale === activeLang;

              return (
                <button
                  key={locale}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(locale)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none" aria-hidden="true">
                      {langMeta.flag}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-tight">
                        {langMeta.nativeName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {langMeta.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
