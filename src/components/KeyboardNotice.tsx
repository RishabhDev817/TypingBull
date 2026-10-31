import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const KEY = 'tb_kb_notice_dismissed';

const COPY: Record<string, string> = {
  en: 'Typing practice works best with a physical keyboard.',
  es: 'La práctica funciona mejor con un teclado físico.',
  ja: 'タイピング練習は物理キーボードがおすすめです。',
  fr: "L'entraînement fonctionne mieux avec un clavier physique.",
  de: 'Tippen übst du am besten mit einer echten Tastatur.',
  pt: 'A prática funciona melhor com um teclado físico.',
  ko: '타자 연습은 물리 키보드에서 가장 잘 작동합니다.',
  it: "L'allenamento funziona meglio con una tastiera fisica.",
  hi: 'टाइपिंग अभ्यास फिज़िकल कीबोर्ड पर सबसे अच्छा काम करता है।',
};

const isDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

/** Shown only on touch-first devices, where typing drills are hard to do on a screen keyboard. */
export const KeyboardNotice: React.FC = () => {
  const { currentLang } = useI18n();
  const [hidden, setHidden] = useState(
    () => isDismissed() || typeof window === 'undefined' || !window.matchMedia('(pointer: coarse)').matches,
  );
  if (hidden) return null;

  return (
    <div
      role="note"
      className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-2.5 text-sm font-bold text-amber-900 dark:text-amber-200"
    >
      <Keyboard className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{COPY[currentLang] || COPY.en}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(KEY, '1');
          } catch {
            /* ignore */
          }
        }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-black/10 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default KeyboardNotice;
