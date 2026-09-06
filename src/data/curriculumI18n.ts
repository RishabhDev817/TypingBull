/**
 * Curriculum & Lesson Localization Helper
 * Supported Locales: en, es, ja, fr, de, pt, ko, it, hi
 */

import type { Chapter } from './lessons/types';
import type { LessonDef } from './lessonData';
import type { SupportedLocale } from '../i18n/ui';

export interface LocalizedChapterInfo {
  title: string;
  description: string;
}

export const CHAPTER_I18N: Record<string, Record<string, LocalizedChapterInfo>> = {
  'home-row': {
    en: { title: 'Home Row', description: 'F & J, D & K, S & L, A & ;, G & H, Space Bar' },
    es: { title: 'Fila Guía', description: 'F y J, D y K, S y L, A y Ñ, G y H, Barra espaciadora' },
    ja: { title: 'ホームポジション', description: 'FとJ、DとK、SとL、Aと;、GとH、スペースバー' },
    fr: { title: 'Ligne de Base', description: 'F & J, D & K, S & L, Q & M, G & H, Barre d’espace' },
    de: { title: 'Grundreihe', description: 'F & J, D & K, S & L, A & Ö, G & H, Leertaste' },
    pt: { title: 'Linha Base', description: 'F e J, D e K, S e L, A e Ç, G e H, Barra de espaço' },
    ko: { title: '기본 자리 (Home Row)', description: 'F와 J, D와 K, S와 L, A와 ;, G와 H, 스페이스바' },
    it: { title: 'Riga Base', description: 'F & J, D & K, S & L, A & ò, G & H, Barra spaziatrice' },
    hi: { title: 'होम पंक्ति', description: 'F और J, D और K, S और L, A और ;, G और H, स्पेस बार' },
  },
  'top-row': {
    en: { title: 'Top Row', description: 'R & U, E & I, W & O, Q & Y, P & T' },
    es: { title: 'Fila Superior', description: 'R y U, E e I, W y O, Q e Y, P y T' },
    ja: { title: '上段キー', description: 'RとU、EとI、WとO、QとY、PとT' },
    fr: { title: 'Rangée Supérieure', description: 'R & U, E & I, Z & O, A & Y, P & T' },
    de: { title: 'Oberreihe', description: 'R & U, E & I, W & O, Q & Z, P & T' },
    pt: { title: 'Linha Superior', description: 'R e U, E e I, W e O, Q e Y, P e T' },
    ko: { title: '상단 열', description: 'R과 U, E와 I, W와 O, Q와 Y, P와 T' },
    it: { title: 'Riga Superiore', description: 'R & U, E & I, W & O, Q & Y, P & T' },
    hi: { title: 'ऊपरी पंक्ति', description: 'R और U, E और I, W और O, Q और Y, P और T' },
  },
  'bottom-row': {
    en: { title: 'Bottom Row', description: 'V & M, C & Comma, X & Period, Z & Slash, B & N' },
    es: { title: 'Fila Inferior', description: 'V y M, C y Coma, X y Punto, Z y Barra, B y N' },
    ja: { title: '下段キー', description: 'VとM、Cとカンマ、Xとピリオド、Zとスラッシュ、BとN' },
    fr: { title: 'Rangée Inférieure', description: 'V & M, C & Virgule, X & Point, W & Slash, B & N' },
    de: { title: 'Unterreihe', description: 'V & M, C & Komma, X & Punkt, Y & Schrägstrich, B & N' },
    pt: { title: 'Linha Inferior', description: 'V e M, C e Vírgula, X e Ponto, Z e Barra, B e N' },
    ko: { title: '하단 열', description: 'V와 M, C와 쉼표, X와 마침표, Z와 슬래시, B와 N' },
    it: { title: 'Riga Inferiore', description: 'V & M, C & Virgola, X & Punto, Z & Slash, B & N' },
    hi: { title: 'निचली पंक्ति', description: 'V और M, C और अल्पविराम, X और पूर्णविराम, B और N' },
  },
  'basic-1': {
    en: { title: 'Basic Level 1', description: 'Habit building: Posture, screen discipline, muscle memory' },
    es: { title: 'Nivel Básico 1', description: 'Formación de hábitos: Postura, vista en pantalla, memoria muscular' },
    ja: { title: '初級レベル 1', description: '習慣形成: 正しい姿勢、画面凝視、筋肉記憶' },
    fr: { title: 'Niveau Élémentaire 1', description: 'Bonnes habitudes : Posture, regard écran, mémoire musculaire' },
    de: { title: 'Grundstufe 1', description: 'Gewohnheiten aufbauen: Haltung, Bildschirmfokus, Muskelgedächtnis' },
    pt: { title: 'Nível Básico 1', description: 'Criação de hábitos: Postura, foco na tela, memória muscular' },
    ko: { title: '기초 레벨 1', description: '습관 형성: 자세, 화면 집중, 근육 기억 훈련' },
    it: { title: 'Livello Base 1', description: 'Costruzione abitudini: Postura, schermo, memoria muscolare' },
    hi: { title: 'बुनियादी स्तर 1', description: 'आदतों का निर्माण: मुद्रा, स्क्रीन पर ध्यान, मांसपेशी स्मृति' },
  },
  'shift-key': {
    en: { title: 'Shift Keys & Capitalization', description: 'Opposite-hand Shift execution and uppercase control' },
    es: { title: 'Teclas Shift y Mayúsculas', description: 'Control de Shift con la mano opuesta y mayúsculas fluidas' },
    ja: { title: 'Shiftキーと大文字', description: '逆の手のShiftキー打鍵と大文字タイピングの習得' },
    fr: { title: 'Touches Majuscule (Shift)', description: 'Exécution Shift main opposée et lettres majuscules' },
    de: { title: 'Umschalttaste (Shift)', description: 'Gegenhand-Shift-Bedienung und Großschreibung' },
    pt: { title: 'Teclas Shift e Maiúsculas', description: 'Execução de Shift com mão oposta e letras maiúsculas' },
    ko: { title: 'Shift 키 및 대문자', description: '반대 손 Shift 조작 및 대문자 입력 마스터' },
    it: { title: 'Tasto Shift e Maiuscole', description: 'Uso dello Shift a mano opposta e lettere maiuscole' },
    hi: { title: 'Shift कुंजी और बड़े अक्षर', description: 'विपरीत हाथ से Shift का उपयोग और सुचारू टाइपिंग' },
  },
  'numbers': {
    en: { title: 'Number Row & Digits', description: 'Top numeric reach without breaking typing flow' },
    es: { title: 'Fila de Números', description: 'Alcance numérico superior manteniendo el ritmo de escritura' },
    ja: { title: '数字キー列', description: 'リズムを崩さずに最上段の数字キーを正確に打鍵' },
    fr: { title: 'Rangée des Chiffres', description: 'Atteinte des chiffres supérieurs sans casser le rythme' },
    de: { title: 'Zahlenreihe', description: 'Obere Zahlenanschläge ohne Unterbrechung des Tippflusses' },
    pt: { title: 'Linha dos Números', description: 'Alcance numérico superior mantendo a cadência' },
    ko: { title: '숫자 열 및 자릿수', description: '타이핑 흐름을 유지하며 상단 숫자 열 도달' },
    it: { title: 'Fila Numerica', description: 'Raggiungere i numeri superiori senza spezzare il ritmo' },
    hi: { title: 'संख्यात्मक पंक्ति', description: 'बिना गति रोके शीर्ष पंक्ति के अंकों तक पहुंच' },
  },
  'symbols': {
    en: { title: 'Symbols & Punctuation', description: 'Brackets, quotes, semicolons, and coding symbols' },
    es: { title: 'Símbolos y Puntuación', description: 'Corchetes, comillas, punto y coma y sintaxis de programación' },
    ja: { title: '記号と句読点', description: 'ブラケット、クォート、セミコロン、プログラミング記号' },
    fr: { title: 'Symboles & Ponctuation', description: 'Crochets, guillemets, point-virgule et syntaxe de code' },
    de: { title: 'Symbole & Satzzeichen', description: 'Klammern, Anführungszeichen, Semikolons und Code-Zeichen' },
    pt: { title: 'Símbolos e Pontuação', description: 'Colchetes, aspas, ponto e vírgula e símbolos de código' },
    ko: { title: '특수 기호 및 문장부호', description: '괄호, 따옴표, 세미콜론 및 코딩 기호' },
    it: { title: 'Simboli e Punteggiatura', description: 'Parentesi, virgolette, punti e virgola e codice' },
    hi: { title: 'प्रतीक और विराम चिह्न', description: 'कोष्ठक, उद्धरण चिह्न, सेमीकोलन और विशेष चिह्न' },
  },
};

/**
 * Returns localized chapter details for display in ChapterSelector and TrainMap
 */
export function getLocalizedChapter(chapter: Chapter, lang: SupportedLocale): Chapter {
  const chData = CHAPTER_I18N[chapter.id]?.[lang] || CHAPTER_I18N[chapter.id]?.['en'];
  if (!chData) return chapter;
  return {
    ...chapter,
    title: chData.title,
    description: chData.description,
  };
}

/**
 * Common finger name translations
 */
export const FINGER_TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  en: { Index: 'Index Finger', Middle: 'Middle Finger', Ring: 'Ring Finger', Pinky: 'Pinky Finger', Thumbs: 'Thumb' },
  es: { Index: 'Dedo Índice', Middle: 'Dedo Medio', Ring: 'Dedo Anular', Pinky: 'Dedo Meñique', Thumbs: 'Pulgar' },
  ja: { Index: '人差し指', Middle: '中指', Ring: '薬指', Pinky: '小指', Thumbs: '親指' },
  fr: { Index: 'Index', Middle: 'Majeur', Ring: 'Annulaire', Pinky: 'Auriculaire', Thumbs: 'Pouce' },
  de: { Index: 'Zeigefinger', Middle: 'Mittelfinger', Ring: 'Ringfinger', Pinky: 'Kleiner Finger', Thumbs: 'Daumen' },
  pt: { Index: 'Dedo Indicador', Middle: 'Dedo Médio', Ring: 'Dedo Anular', Pinky: 'Dedo Mínimo', Thumbs: 'Polegar' },
  ko: { Index: '검지', Middle: '중지', Ring: '약지', Pinky: '새끼손가락', Thumbs: '엄지' },
  it: { Index: 'Indice', Middle: 'Medio', Ring: 'Anulare', Pinky: 'Mignolo', Thumbs: 'Pollice' },
  hi: { Index: 'तर्जनी (Index)', Middle: 'मध्यमा (Middle)', Ring: 'अनामिका (Ring)', Pinky: 'कनिष्ठिका (Pinky)', Thumbs: 'अंगूठा' },
};

/**
 * Localizes lesson title, description, and tips for the Lesson Player
 */
export function getLocalizedLesson(lesson: LessonDef, lang: SupportedLocale): LessonDef {
  if (lang === 'en') return lesson;

  let title = lesson.title;
  let description = lesson.description;
  let tipContent = lesson.tipContent;
  let fingerGuide = lesson.fingerGuide;

  if (fingerGuide && FINGER_TRANSLATIONS[lang]?.[fingerGuide]) {
    fingerGuide = FINGER_TRANSLATIONS[lang][fingerGuide];
  }

  // Common title translations
  if (title.startsWith('Introducing ')) {
    const keys = title.replace('Introducing ', '');
    const prefix: Record<SupportedLocale, string> = {
      en: 'Introducing ',
      es: 'Presentación de ',
      ja: 'キーの紹介: ',
      fr: 'Découverte de ',
      de: 'Einführung in ',
      pt: 'Apresentando ',
      ko: '키 도입: ',
      it: 'Introduzione a ',
      hi: 'परिचय: ',
    };
    title = `${prefix[lang] || prefix.en}${keys}`;
  } else if (title.startsWith('Practice ')) {
    const keys = title.replace('Practice ', '');
    const prefix: Record<SupportedLocale, string> = {
      en: 'Practice ',
      es: 'Práctica de ',
      ja: '練習: ',
      fr: 'Pratique de ',
      de: 'Übung: ',
      pt: 'Prática de ',
      ko: '연습: ',
      it: 'Pratica di ',
      hi: 'अभ्यास: ',
    };
    title = `${prefix[lang] || prefix.en}${keys}`;
  } else if (title.startsWith('Review ')) {
    const keys = title.replace('Review ', '');
    const prefix: Record<SupportedLocale, string> = {
      en: 'Review ',
      es: 'Repaso de ',
      ja: '復習: ',
      fr: 'Révision de ',
      de: 'Wiederholung: ',
      pt: 'Revisão de ',
      ko: '복습: ',
      it: 'Ripasso di ',
      hi: 'पुनरावृत्ति: ',
    };
    title = `${prefix[lang] || prefix.en}${keys}`;
  }

  // Specific common descriptions
  if (description.includes('Place your')) {
    const guideMap: Record<SupportedLocale, string> = {
      en: description,
      es: 'Coloca los dedos sobre las teclas correspondientes como se muestra en el diagrama guía.',
      ja: 'ガイド図に従って、指定された指をキーの上に正しく配置してください。',
      fr: 'Positionnez vos doigts sur les touches indiquées comme affiché sur le schéma.',
      de: 'Platziere deine Finger genau auf den im Diagramm hervorgehobenen Tasten.',
      pt: 'Posicione seus dedos sobre as teclas correspondentes conforme exibido no guia.',
      ko: '화면의 키보드 가이드에 따라 지정된 손가락을 해당 키에 올리세요.',
      it: 'Posiziona le dita sui tasti indicati seguendo il diagramma guida.',
      hi: 'दिशानिर्देश के अनुसार अपनी उंगलियों को निर्दिष्ट कुंजियों पर रखें।',
    };
    if (guideMap[lang]) description = guideMap[lang];
    if (tipContent) tipContent = guideMap[lang];
  }

  return {
    ...lesson,
    title,
    description,
    tipContent,
    fingerGuide,
  };
}
