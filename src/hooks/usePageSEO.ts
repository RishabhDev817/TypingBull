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

    // 8. Dynamic Localized FAQ Schema (FAQPage JSON-LD)
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

    let faqScript = document.getElementById('faq-schema-jsonld') as HTMLScriptElement | null;
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.id = 'faq-schema-jsonld';
      faqScript.type = 'application/ld+json';
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify(faqSchema, null, 2);
  }, [lang]);
}

export default usePageSEO;
