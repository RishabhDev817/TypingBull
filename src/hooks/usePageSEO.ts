import { useEffect } from 'react';
import type { SupportedLocale } from '../i18n/ui';
import { getLocalizedFaqData } from '../i18n/faqData';

export interface LocalizedSEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  locale: string;
}

export const SEO_DATA_BY_LANG: Record<SupportedLocale, LocalizedSEOMetadata> = {
  en: {
    title: 'TypingBull — Free Gamified Typing Tutor | Online Typing Test WPM & Real-Time Multiplayer Races',
    description:
      'TypingBull is the ultimate free gamified typing tutor and real-time multiplayer typing speedway. Learn touch typing online with arcade games, live multiplayer races, AI typing coach analytics, and fast keyboard speed drills.',
    keywords:
      'Free Gamified Typing Tutor, online typing test wpm, learn touch typing online, multiplayer typing race, real-time typing competition, practice ground typing speedway, ai typing coach, typing practice for kids, fast keyboard speed drills, coding typing test',
    ogTitle: 'TypingBull — Free Gamified Typing Tutor & Multiplayer Typing Races',
    ogDescription:
      'Master touch typing online with our free gamified typing tutor. Compete in real-time multiplayer typing races, play arcade games, and boost keyboard speed with AI analytics.',
    locale: 'en_US',
  },
  es: {
    title: 'TypingBull — Tutor de Mecanografía Gamificado Gratis | Carreras Multijugador y Test WPM Online',
    description:
      'Aprende con TypingBull, el tutor de mecanografía gamificado gratis líder. Carreras de mecanografía multijugador en tiempo real, prueba de mecanografía online, aprender mecanografía gratis y test de velocidad WPM.',
    keywords:
      'Tutor de Mecanografía Gamificado Gratis, carreras de mecanografía multijugador, prueba de mecanografía online, aprender mecanografía gratis, test de velocidad de mecanografía wpm, práctica de teclado',
    ogTitle: 'TypingBull — Tutor de Mecanografía Gamificado Gratis y Carreras Multijugador',
    ogDescription:
      'Mejora tu velocidad con nuestro tutor de mecanografía gamificado gratis. Compite en carreras multijugador en tiempo real, haz tests de velocidad WPM y juega al arcade.',
    locale: 'es_ES',
  },
  fr: {
    title: 'TypingBull — Tuteur de Dactylographie Ludique Gratuit | Courses Multijoueur et Test de Vitesse',
    description:
      'Découvrez TypingBull, votre tuteur de dactylographie ludique gratuit. Courses de dactylo multijoueur en temps réel, test de dactylographie en ligne, apprendre la dactylo azerty et jeux de frappe au clavier.',
    keywords:
      'Tuteur de Dactylographie Ludique Gratuit, course de frappe multijoueur, test de dactylographie en ligne, apprendre la dactylo azerty, test de vitesse de frappe, jeux de frappe au clavier',
    ogTitle: 'TypingBull — Tuteur de Dactylographie Ludique et Courses Multijoueur',
    ogDescription:
      'Apprenez la dactylo azerty avec notre tuteur de dactylographie ludique gratuit. Défiez vos amis dans des courses de frappe multijoueur en direct et boostez votre vitesse.',
    locale: 'fr_FR',
  },
  de: {
    title: 'TypingBull — Kostenloser Gamifizierter Schreibtrainer | Mehrspieler-Tipprennen & Tipptest Online',
    description:
      'Lerne das Zehnfingersystem mit TypingBull, dem kostenlosen gamifizierten Schreibtrainer. Trete in Echtzeit-Mehrspieler-Tipprennen an, mache den Tipptest online kostenlos und übe Tastatur tippen mit Arcade-Games.',
    keywords:
      'Kostenloser Gamifizierter Schreibtrainer, mehrspieler tipprennen, tipptest online kostenlos, zehnfingersystem lernen, schreibtrainer qwertz, tastatur tippen üben',
    ogTitle: 'TypingBull — Kostenloser Gamifizierter Schreibtrainer & Mehrspieler-Rennen',
    ogDescription:
      'Zehnfingersystem lernen mit dem kostenlosen Schreibtrainer. Tritt in Echtzeit-Mehrspieler-Tipprennen an, teste deine WPM und übe Tastatur tippen.',
    locale: 'de_DE',
  },
  pt: {
    title: 'TypingBull — Tutor de Digitação Gamificado Grátis | Corridas Multijogador e Teste WPM',
    description:
      'Domine o teclado com o TypingBull, seu tutor de digitação gamificado grátis. Corridas de digitação multijogador em tempo real no Practice Ground, teste de digitação grátis e treino de velocidade.',
    keywords:
      'Tutor de Digitação Gamificado Grátis, corrida de digitação multijogador, teste de digitação grátis, praticar digitação online, aula de digitação para iniciantes, acelerar velocidade de digitação',
    ogTitle: 'TypingBull — Tutor de Digitação Gamificado Grátis e Corridas Multijogador',
    ogDescription:
      'Pratique digitação online com corridas multijogador em tempo real e jogos arcade divertidos. Acelere sua velocidade de digitação e compita com amigos.',
    locale: 'pt_BR',
  },
  it: {
    title: 'TypingBull — Tutor di Dattilografia Gamificato Gratuito | Gare Multigiocatore e Test Tastiera',
    description:
      'Impara a digitare veloce con TypingBull, il tutor di dattilografia gamificato gratuito. Gare di dattilografia multigiocatore in tempo reale nel Practice Ground, test online e allenamento tastiera con IA.',
    keywords:
      'Tutor di Dattilografia Gamificato Gratuito, gare di dattilografia multigiocatore, test di dattilografia online, corso di dattilografia gratis, imparare a digitare veloce, allenamento tastiera',
    ogTitle: 'TypingBull — Tutor di Dattilografia Gamificato e Gare Multigiocatore',
    ogDescription:
      'Corso di dattilografia gratis e gare multigiocatore in tempo reale. Sfida altri dattilografi, misura le tue WPM e impara a digitare veloce.',
    locale: 'it_IT',
  },
  ja: {
    title: 'TypingBull — 無料のゲーム化されたタイピングチューター | リアルタイム対戦レース＆タイピング練習',
    description:
      'TypingBullは無料のゲーム化されたタイピングチューターです。Practice Groundのリアルタイムマルチプレイヤー対戦レース、タイピング練習 無料、タイピングスピードテスト、ブラインドタッチ練習で楽しく上達。',
    keywords:
      '無料のゲーム化されたタイピングチューター, タイピング 対戦 レース, タイピング練習 無料, タイピングスピードテスト, ブラインドタッチ 練習, ローマ字 タイピング ゲーム',
    ogTitle: 'TypingBull — 無料タイピングチューター＆リアルタイムマルチ対戦',
    ogDescription:
      '無料のゲーム化されたタイピングチューターで白熱のマルチプレイヤーレースに挑戦！タイピングスピードテストやAIコーチでブラインドタッチ上達。',
    locale: 'ja_JP',
  },
  ko: {
    title: 'TypingBull — 무료 게임형 타자 연습 튜터 | 실시간 멀티플레이어 타자 레이스 & WPM 검정',
    description:
      'TypingBull은 최고의 무료 게임형 타자 연습 튜터입니다. Practice Ground 실시간 멀티플레이어 타자 레이스, 무료 타자 연습, 온라인 한글 타자 테스트, 타자 속도 검정 wpm으로 속도를 극대화하세요.',
    keywords:
      '무료 게임형 타자 연습 튜터, 멀티플레이어 타자 레이스, 실시간 타자 대결, 무료 타자 연습, 온라인 한글 타자 테스트, 타자 속도 검정 wpm',
    ogTitle: 'TypingBull — 무료 게임형 타자 연습 튜터 & 멀티플레이어 타자 레이스',
    ogDescription:
      '무료 게임형 타자 연습 튜터로 실시간 멀티플레이어 타자 레이스에 도전하고 WPM 속도 검정과 AI 코칭을 경험해보세요.',
    locale: 'ko_KR',
  },
  hi: {
    title: 'TypingBull — मुफ्त गेमिफाइड टाइपिंग ट्यूटर | रीयल-टाइम मल्टीप्लेयर टाइपिंग रेस & WPM टेस्ट',
    description:
      'TypingBull सर्वश्रेष्ठ मुफ्त गेमिफाइड टाइपिंग ट्यूटर है। Practice Ground रीयल-टाइम मल्टीप्लेयर टाइपिंग रेस, ऑनलाइन टाइपिंग टेस्ट, टाइपिंग स्पीड टेस्ट हिंदी और AI ट्यूटर का आनंद लें।',
    keywords:
      'मुफ्त गेमिफाइड टाइपिंग ट्यूटर, मल्टीप्लेयर टाइपिंग रेस, ऑनलाइन टाइपिंग टेस्ट, टाइपिंग स्पीड टेस्ट हिंदी, कीबोर्ड टाइपिंग प्रैक्टिस, फ्री टच टाइपिंग',
    ogTitle: 'TypingBull — मुफ्त गेमिफाइड टाइपिंग ट्यूटर & मल्टीप्लेयर रेस',
    ogDescription:
      'मुफ्त गेमिफाइड टाइपिंग ट्यूटर के साथ रीयल-टाइम मल्टीप्लेयर टाइपिंग रेस में मुकाबला करें और ऑनलाइन टाइपिंग टेस्ट में अपनी गति बढ़ाएं।',
    locale: 'hi_IN',
  },
};

export const HREFLANG_CONFIG: { lang: string; href: string }[] = [
  { lang: 'x-default', href: 'https://typingbull.com/' },
  { lang: 'en', href: 'https://typingbull.com/' },
  { lang: 'en-US', href: 'https://typingbull.com/' },
  { lang: 'en-GB', href: 'https://typingbull.com/' },
  { lang: 'es', href: 'https://typingbull.com/es/' },
  { lang: 'es-ES', href: 'https://typingbull.com/es/' },
  { lang: 'es-MX', href: 'https://typingbull.com/es/' },
  { lang: 'fr', href: 'https://typingbull.com/fr/' },
  { lang: 'fr-FR', href: 'https://typingbull.com/fr/' },
  { lang: 'de', href: 'https://typingbull.com/de/' },
  { lang: 'de-DE', href: 'https://typingbull.com/de/' },
  { lang: 'pt', href: 'https://typingbull.com/pt/' },
  { lang: 'pt-BR', href: 'https://typingbull.com/pt/' },
  { lang: 'it', href: 'https://typingbull.com/it/' },
  { lang: 'it-IT', href: 'https://typingbull.com/it/' },
  { lang: 'ja', href: 'https://typingbull.com/ja/' },
  { lang: 'ja-JP', href: 'https://typingbull.com/ja/' },
  { lang: 'ko', href: 'https://typingbull.com/ko/' },
  { lang: 'ko-KR', href: 'https://typingbull.com/ko/' },
  { lang: 'hi', href: 'https://typingbull.com/hi/' },
  { lang: 'hi-IN', href: 'https://typingbull.com/hi/' },
];

export interface PageSEOOptions {
  lang?: SupportedLocale;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
  includeFaqSchema?: boolean;
}

const PRODUCTION_DOMAIN = 'https://typingbull.com';

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
export function buildCanonicalUrl(path: string, lang: SupportedLocale = 'en'): string {
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

  if (lang === 'en' || pureSubpath === '/') {
    return `${PRODUCTION_DOMAIN}${pureSubpath}`;
  }

  return `${PRODUCTION_DOMAIN}/${lang}${pureSubpath}`;
}

/**
 * Custom React hook to dynamically update document title, description,
 * keywords, Open Graph, Twitter metadata, canonical link, hreflang tags,
 * and robots directives according to active route and locale.
 */
export function usePageSEO(optionsOrLang: SupportedLocale | PageSEOOptions = 'en'): void {
  const options: PageSEOOptions =
    typeof optionsOrLang === 'string' ? { lang: optionsOrLang } : optionsOrLang;

  const lang: SupportedLocale = options.lang || 'en';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const currentPath =
      options.canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const searchParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    // Check if this is an ephemeral/private state (e.g. room codes) or explicitly marked noindex
    const hasRoomCode = searchParams.has('code') || searchParams.has('room');
    const isNoIndex = Boolean(options.noindex || hasRoomCode);

    const baseSEO = SEO_DATA_BY_LANG[lang] || SEO_DATA_BY_LANG.en;
    const title = options.title || baseSEO.title;
    const description = options.description || baseSEO.description;
    const ogTitle = options.ogTitle || options.title || baseSEO.ogTitle;
    const ogDescription = options.ogDescription || options.description || baseSEO.ogDescription;
    const ogImage = options.ogImage || `${PRODUCTION_DOMAIN}/assets/og-image.png`;

    // 1. Page Title
    document.title = title;

    // Helper to safely upsert meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (options.keywords) {
      setMetaTag('name', 'keywords', options.keywords);
    } else {
      // Remove any keyword tag to prevent spam flags unless specifically provided
      const existingKw = document.querySelector('meta[name="keywords"]');
      if (existingKw) existingKw.remove();
    }

    // 3. Robots Meta Tag (Enforce noindex on temporary rooms or designated pages)
    if (isNoIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // 4. Canonical URL
    const canonicalUrl = buildCanonicalUrl(currentPath, lang);
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Open Graph Tags
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'TypingBull');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDescription);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:locale', baseSEO.locale);

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@typingbull');
    setMetaTag('name', 'twitter:title', ogTitle);
    setMetaTag('name', 'twitter:description', ogDescription);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. HTML lang attribute
    document.documentElement.lang = lang;

    // 8. Dynamic Hreflang Alternates mapped to this specific subpage
    if (!isNoIndex) {
      const locales: { langCode: string; hreflang: string }[] = [
        { langCode: 'en', hreflang: 'x-default' },
        { langCode: 'en', hreflang: 'en' },
        { langCode: 'en', hreflang: 'en-US' },
        { langCode: 'en', hreflang: 'en-GB' },
        { langCode: 'es', hreflang: 'es' },
        { langCode: 'es', hreflang: 'es-ES' },
        { langCode: 'es', hreflang: 'es-MX' },
        { langCode: 'fr', hreflang: 'fr' },
        { langCode: 'fr', hreflang: 'fr-FR' },
        { langCode: 'de', hreflang: 'de' },
        { langCode: 'de', hreflang: 'de-DE' },
        { langCode: 'pt', hreflang: 'pt' },
        { langCode: 'pt', hreflang: 'pt-BR' },
        { langCode: 'it', hreflang: 'it' },
        { langCode: 'it', hreflang: 'it-IT' },
        { langCode: 'ja', hreflang: 'ja' },
        { langCode: 'ja', hreflang: 'ja-JP' },
        { langCode: 'ko', hreflang: 'ko' },
        { langCode: 'ko', hreflang: 'ko-KR' },
        { langCode: 'hi', hreflang: 'hi' },
        { langCode: 'hi', hreflang: 'hi-IN' },
      ];

      locales.forEach(({ langCode, hreflang }) => {
        let link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'alternate');
          link.setAttribute('hreflang', hreflang);
          document.head.appendChild(link);
        }
        link.setAttribute('href', buildCanonicalUrl(currentPath, langCode as SupportedLocale));
      });
    }

    // 9. FAQ Schema (FAQPage JSON-LD) — strictly Homepage only
    const isHomepage = normalizeCanonicalPath(currentPath) === '/';
    const shouldIncludeFaq = options.includeFaqSchema ?? isHomepage;

    let faqScript = document.getElementById('faq-schema-jsonld') as HTMLScriptElement | null;
    if (shouldIncludeFaq && !isNoIndex) {
      const localizedFaqItems = getLocalizedFaqData(lang);
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: localizedFaqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.id = 'faq-schema-jsonld';
        faqScript.type = 'application/ld+json';
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqSchema, null, 2);
    } else if (faqScript) {
      faqScript.remove();
    }
  }, [
    lang,
    options.canonicalPath,
    options.title,
    options.description,
    options.ogTitle,
    options.ogDescription,
    options.ogImage,
    options.noindex,
    options.includeFaqSchema,
    options.keywords,
  ]);
}

export default usePageSEO;
