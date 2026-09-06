import { useEffect } from 'react';
import type { SupportedLocale } from '../i18n/ui';

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
    title: 'TypingBull — Free Gamified Typing Tutor | Online Typing Test WPM & AI Coach',
    description:
      'TypingBull is the ultimate free gamified typing tutor. Learn touch typing online with arcade games, AI typing coach analytics, typing practice for kids, fast keyboard speed drills, and coding typing tests.',
    keywords:
      'Free Gamified Typing Tutor, online typing test wpm, learn touch typing online, ai typing coach, typing practice for kids, fast keyboard speed drills, coding typing test',
    ogTitle: 'TypingBull — Free Gamified Typing Tutor | Online Typing Test WPM',
    ogDescription:
      'Master touch typing online with our free gamified typing tutor. Play arcade typing games, get real-time AI typing coach analytics, and drill fast keyboard speed.',
    locale: 'en_US',
  },
  es: {
    title: 'TypingBull — Tutor de Mecanografía Gamificado Gratis | Test WPM Online',
    description:
      'Aprende con TypingBull, el tutor de mecanografía gamificado gratis líder. Prueba de mecanografía online, aprender mecanografía gratis, test de velocidad de mecanografía wpm y práctica de teclado.',
    keywords:
      'Tutor de Mecanografía Gamificado Gratis, prueba de mecanografía online, aprender mecanografía gratis, test de velocidad de mecanografía wpm, práctica de teclado',
    ogTitle: 'TypingBull — Tutor de Mecanografía Gamificado Gratis',
    ogDescription:
      'Mejora tu velocidad con nuestro tutor de mecanografía gamificado gratis. Prueba de mecanografía online y práctica de teclado con juegos arcade.',
    locale: 'es_ES',
  },
  fr: {
    title: 'TypingBull — Tuteur de Dactylographie Ludique Gratuit | Test de Vitesse',
    description:
      'Découvrez TypingBull, votre tuteur de dactylographie ludique gratuit. Test de dactylographie en ligne, apprendre la dactylo azerty, test de vitesse de frappe et jeux de frappe au clavier.',
    keywords:
      'Tuteur de Dactylographie Ludique Gratuit, test de dactylographie en ligne, apprendre la dactylo azerty, test de vitesse de frappe, jeux de frappe au clavier',
    ogTitle: 'TypingBull — Tuteur de Dactylographie Ludique Gratuit',
    ogDescription:
      'Apprenez la dactylo azerty avec notre tuteur de dactylographie ludique gratuit. Test de vitesse de frappe et jeux au clavier captivants.',
    locale: 'fr_FR',
  },
  de: {
    title: 'TypingBull — Kostenloser Gamifizierter Schreibtrainer | Tipptest Online',
    description:
      'Lerne das Zehnfingersystem mit TypingBull, dem kostenlosen gamifizierten Schreibtrainer. Tipptest online kostenlos, Zehnfingersystem lernen, Schreibtrainer QWERTZ und Tastatur tippen üben.',
    keywords:
      'Kostenloser Gamifizierter Schreibtrainer, tipptest online kostenlos, zehnfingersystem lernen, schreibtrainer qwertz, tastatur tippen üben',
    ogTitle: 'TypingBull — Kostenloser Gamifizierter Schreibtrainer',
    ogDescription:
      'Zehnfingersystem lernen mit dem kostenlosen gamifizierten Schreibtrainer. Mache den Tipptest online kostenlos und übe Tastatur tippen mit Arcade-Games.',
    locale: 'de_DE',
  },
  pt: {
    title: 'TypingBull — Tutor de Digitação Gamificado Grátis | Teste WPM Online',
    description:
      'Domine o teclado com o TypingBull, seu tutor de digitação gamificado grátis. Teste de digitação grátis, praticar digitação online, aula de digitação para iniciantes e acelerar velocidade de digitação.',
    keywords:
      'Tutor de Digitação Gamificado Grátis, teste de digitação grátis, praticar digitação online, aula de digitação para iniciantes, acelerar velocidade de digitação',
    ogTitle: 'TypingBull — Tutor de Digitação Gamificado Grátis',
    ogDescription:
      'Pratique digitação online com jogos arcade divertidos. Tutor de digitação gamificado grátis para acelerar velocidade de digitação.',
    locale: 'pt_BR',
  },
  it: {
    title: 'TypingBull — Tutor di Dattilografia Gamificato Gratuito | Allenamento Tastiera',
    description:
      'Impara a digitare veloce con TypingBull, il tutor di dattilografia gamificato gratuito. Test di dattilografia online, corso di dattilografia gratis, imparare a digitare veloce e allenamento tastiera.',
    keywords:
      'Tutor di Dattilografia Gamificato Gratuito, test di dattilografia online, corso di dattilografia gratis, imparare a digitare veloce, allenamento tastiera',
    ogTitle: 'TypingBull — Tutor di Dattilografia Gamificato Gratuito',
    ogDescription:
      'Corso di dattilografia gratis e test online con giochi arcade. Impara a digitare veloce con il tutor di dattilografia gamificato gratuito.',
    locale: 'it_IT',
  },
  ja: {
    title: 'TypingBull — 無料のゲーム化されたタイピングチューター | タイピング練習 無料',
    description:
      'TypingBullは無料のゲーム化されたタイピングチューターです。タイピング練習 無料、タイピングスピードテスト、ブラインドタッチ 練習、ローマ字 タイピング ゲームで楽しく上達。',
    keywords:
      '無料のゲーム化されたタイピングチューター, タイピング練習 無料, タイピングスピードテスト, ブラインドタッチ 練習, ローマ字 タイピング ゲーム',
    ogTitle: 'TypingBull — 無料のゲーム化されたタイピングチューター',
    ogDescription:
      '無料のゲーム化されたタイピングチューターでブラインドタッチ練習！タイピングスピードテストやローマ字タイピングゲームを体験。',
    locale: 'ja_JP',
  },
  ko: {
    title: 'TypingBull — 무료 게임형 타자 연습 튜터 | 온라인 한글 타자 테스트',
    description:
      'TypingBull은 최고의 무료 게임형 타자 연습 튜터입니다. 무료 타자 연습, 온라인 한글 타자 테스트, 타자 속도 검정 wpm, 타자 연습 게임으로 타자 속도를 극대화하세요.',
    keywords:
      '무료 게임형 타자 연습 튜터, 무료 타자 연습, 온라인 한글 타자 테스트, 타자 속도 검정 wpm, 타자 연습 게임',
    ogTitle: 'TypingBull — 무료 게임형 타자 연습 튜터',
    ogDescription:
      '무료 게임형 타자 연습 튜터로 타자 속도 검정 wpm을 테스트하고 재미있는 게임과 함께 타자 실력을 키워보세요.',
    locale: 'ko_KR',
  },
  hi: {
    title: 'TypingBull — मुफ्त गेमिफाइड टाइपिंग ट्यूटर | ऑनलाइन टाइपिंग टेस्ट WPM',
    description:
      'TypingBull सर्वश्रेष्ठ मुफ्त गेमिफाइड टाइपिंग ट्यूटर है। ऑनलाइन टाइपिंग टेस्ट, टाइपिंग स्पीड टेस्ट हिंदी, कीबोर्ड टाइपिंग प्रैक्टिस और फ्री टच टाइपिंग का आनंद लें।',
    keywords:
      'मुफ्त गेमिफाइड टाइपिंग ट्यूटर, ऑनलाइन टाइपिंग टेस्ट, टाइपिंग स्पीड टेस्ट हिंदी, कीबोर्ड टाइपिंग प्रैक्टिस, फ्री टच टाइपिंग',
    ogTitle: 'TypingBull — मुफ्त गेमिफाइड टाइपिंग ट्यूटर',
    ogDescription:
      'मुफ्त गेमिफाइड टाइपिंग ट्यूटर के साथ ऑनलाइन टाइपिंग टेस्ट और टाइपिंग स्पीड टेस्ट हिंदी का अभ्यास करें और तेजी से टाइप करना सीखें।',
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

/**
 * Custom React hook to dynamically update document title, description,
 * keywords, Open Graph, Twitter metadata, canonical link, and hreflang tags
 * according to active locale.
 */
export function usePageSEO(lang: SupportedLocale): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const seo = SEO_DATA_BY_LANG[lang] || SEO_DATA_BY_LANG.en;

    // 1. Page Title
    document.title = seo.title;

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
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'keywords', seo.keywords);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', seo.ogTitle);
    setMetaTag('property', 'og:description', seo.ogDescription);
    setMetaTag('property', 'og:locale', seo.locale);

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:title', seo.ogTitle);
    setMetaTag('name', 'twitter:description', seo.ogDescription);

    // 5. HTML lang attribute
    document.documentElement.lang = lang;

    // 6. Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', lang === 'en' ? 'https://typingbull.com/' : `https://typingbull.com/${lang}/`);

    // 7. Dynamic Hreflang Alternates for each language
    HREFLANG_CONFIG.forEach(({ lang: hLang, href }) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${hLang}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hLang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    });
  }, [lang]);
}

export default usePageSEO;
