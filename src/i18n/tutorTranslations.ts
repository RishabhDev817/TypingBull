import type { SupportedLocale } from './ui';

export interface RegionTranslation {
  label: string;
  replayLabel: string;
}

export const TUTOR_REGIONS_I18N: Record<SupportedLocale, Record<string, RegionTranslation>> = {
  en: {
    'top-row-outer': { label: 'Top Row Outer Keys', replayLabel: 'Top Row Reaches' },
    'top-row-inner': { label: 'Top Row Inner Keys', replayLabel: 'Top Row Core' },
    'home-row-pinkies': { label: 'Home Row Pinky Keys', replayLabel: 'Home Row Pinkies' },
    'home-row-ring': { label: 'Home Row Ring Fingers', replayLabel: 'Home Row Ring' },
    'home-row-middle': { label: 'Home Row Middle Fingers', replayLabel: 'Home Row Middle' },
    'home-row-index': { label: 'Home Row Index Fingers', replayLabel: 'Home Row Index' },
    'bottom-row': { label: 'Bottom Row Keys', replayLabel: 'Bottom Row' },
    'number-row': { label: 'Number Row', replayLabel: 'Number Row' },
  },
  es: {
    'top-row-outer': { label: 'Teclas Exteriores de la Fila Superior', replayLabel: 'Alcances de Fila Superior' },
    'top-row-inner': { label: 'Teclas Interiores de la Fila Superior', replayLabel: 'Fila Superior Central' },
    'home-row-pinkies': { label: 'Teclas del Meñique de la Fila Base', replayLabel: 'Meñiques de Fila Base' },
    'home-row-ring': { label: 'Teclas del Anular de la Fila Base', replayLabel: 'Anulares de Fila Base' },
    'home-row-middle': { label: 'Teclas del Dedo Medio de la Fila Base', replayLabel: 'Dedos Medios de Fila Base' },
    'home-row-index': { label: 'Teclas del Índice de la Fila Base', replayLabel: 'Índices de Fila Base' },
    'bottom-row': { label: 'Teclas de la Fila Inferior', replayLabel: 'Fila Inferior' },
    'number-row': { label: 'Fila de Números', replayLabel: 'Fila de Números' },
  },
  ja: {
    'top-row-outer': { label: '上段の外側キー', replayLabel: '上段のストレッチ' },
    'top-row-inner': { label: '上段の内側キー', replayLabel: '上段の中心' },
    'home-row-pinkies': { label: 'ホームポジションの小指キー', replayLabel: '小指の練習' },
    'home-row-ring': { label: 'ホームポジションの薬指キー', replayLabel: '薬指の練習' },
    'home-row-middle': { label: 'ホームポジションの中指キー', replayLabel: '中指の練習' },
    'home-row-index': { label: 'ホームポジションの人差し指キー', replayLabel: '人差し指の練習' },
    'bottom-row': { label: '下段のキー', replayLabel: '下段の練習' },
    'number-row': { label: '数字キー列', replayLabel: '数字キー列' },
  },
  fr: {
    'top-row-outer': { label: 'Touches Extérieures du Rang Supérieur', replayLabel: 'Extensions Rang Supérieur' },
    'top-row-inner': { label: 'Touches Intérieures du Rang Supérieur', replayLabel: 'Centre Rang Supérieur' },
    'home-row-pinkies': { label: 'Touches de l’Auriculaire du Rang de Base', replayLabel: 'Auriculaires Rang de Base' },
    'home-row-ring': { label: 'Touches de l’Annulaire du Rang de Base', replayLabel: 'Annulaires Rang de Base' },
    'home-row-middle': { label: 'Touches du Majeur du Rang de Base', replayLabel: 'Majeurs Rang de Base' },
    'home-row-index': { label: 'Touches de l’Index du Rang de Base', replayLabel: 'Index Rang de Base' },
    'bottom-row': { label: 'Touches du Rang Inférieur', replayLabel: 'Rang Inférieur' },
    'number-row': { label: 'Rangée des Chiffres', replayLabel: 'Rangée des Chiffres' },
  },
  de: {
    'top-row-outer': { label: 'Äußere Tasten der oberen Reihe', replayLabel: 'Reichweite obere Reihe' },
    'top-row-inner': { label: 'Innere Tasten der oberen Reihe', replayLabel: 'Zentrum obere Reihe' },
    'home-row-pinkies': { label: 'Grundreihen-Tasten für den kleinen Finger', replayLabel: 'Kleiner Finger Grundreihe' },
    'home-row-ring': { label: 'Grundreihen-Tasten für den Ringfinger', replayLabel: 'Ringfinger Grundreihe' },
    'home-row-middle': { label: 'Grundreihen-Tasten für den Mittelfinger', replayLabel: 'Mittelfinger Grundreihe' },
    'home-row-index': { label: 'Grundreihen-Tasten für den Zeigefinger', replayLabel: 'Zeigefinger Grundreihe' },
    'bottom-row': { label: 'Tasten der unteren Reihe', replayLabel: 'Untere Reihe' },
    'number-row': { label: 'Zahlenreihe', replayLabel: 'Zahlenreihe' },
  },
  pt: {
    'top-row-outer': { label: 'Teclas Externas da Fileira Superior', replayLabel: 'Alcances da Fileira Superior' },
    'top-row-inner': { label: 'Teclas Internas da Fileira Superior', replayLabel: 'Centro da Fileira Superior' },
    'home-row-pinkies': { label: 'Teclas do Mindinho da Fileira Base', replayLabel: 'Mindinhos da Fileira Base' },
    'home-row-ring': { label: 'Teclas do Anelar da Fileira Base', replayLabel: 'Anelares da Fileira Base' },
    'home-row-middle': { label: 'Teclas do Dedo Médio da Fileira Base', replayLabel: 'Dedos Médios da Fileira Base' },
    'home-row-index': { label: 'Teclas do Indicador da Fileira Base', replayLabel: 'Indicadores da Fileira Base' },
    'bottom-row': { label: 'Teclas da Fileira Inferior', replayLabel: 'Fileira Inferior' },
    'number-row': { label: 'Fileira de Números', replayLabel: 'Fileira de Números' },
  },
  ko: {
    'top-row-outer': { label: '상단 열 바깥쪽 키', replayLabel: '상단 열 연습' },
    'top-row-inner': { label: '상단 열 안쪽 키', replayLabel: '상단 열 중심' },
    'home-row-pinkies': { label: '홈 열 새끼손가락 키', replayLabel: '새끼손가락 연습' },
    'home-row-ring': { label: '홈 열 약지손가락 키', replayLabel: '약지손가락 연습' },
    'home-row-middle': { label: '홈 열 중지손가락 키', replayLabel: '중지손가락 연습' },
    'home-row-index': { label: '홈 열 검지손가락 키', replayLabel: '검지손가락 연습' },
    'bottom-row': { label: '하단 열 키', replayLabel: '하단 열 연습' },
    'number-row': { label: '숫자 열', replayLabel: '숫자 열' },
  },
  it: {
    'top-row-outer': { label: 'Tasti Esterni della Fila Superiore', replayLabel: 'Estensioni Fila Superiore' },
    'top-row-inner': { label: 'Tasti Interni della Fila Superiore', replayLabel: 'Centro Fila Superiore' },
    'home-row-pinkies': { label: 'Tasti del Mignolo della Fila Base', replayLabel: 'Mignoli Fila Base' },
    'home-row-ring': { label: 'Tasti dell’Anulare della Fila Base', replayLabel: 'Anulari Fila Base' },
    'home-row-middle': { label: 'Tasti del Medio della Fila Base', replayLabel: 'Medi Fila Base' },
    'home-row-index': { label: 'Tasti dell’Indice della Fila Base', replayLabel: 'Indici Fila Base' },
    'bottom-row': { label: 'Tasti della Fila Inferiore', replayLabel: 'Fila Inferiore' },
    'number-row': { label: 'Fila dei Numeri', replayLabel: 'Fila dei Numeri' },
  },
  hi: {
    'top-row-outer': { label: 'ऊपरी पंक्ति की बाहरी कुंजियाँ', replayLabel: 'ऊपरी पंक्ति अभ्यास' },
    'top-row-inner': { label: 'ऊपरी पंक्ति की आंतरिक कुंजियाँ', replayLabel: 'ऊपरी पंक्ति केंद्र' },
    'home-row-pinkies': { label: 'होम पंक्ति की कनिष्ठिका कुंजियाँ', replayLabel: 'कनिष्ठिका उंगली अभ्यास' },
    'home-row-ring': { label: 'होम पंक्ति की अनामिका कुंजियाँ', replayLabel: 'अनामिका उंगली अभ्यास' },
    'home-row-middle': { label: 'होम पंक्ति की मध्यमा कुंजियाँ', replayLabel: 'मध्यमा उंगली अभ्यास' },
    'home-row-index': { label: 'होम पंक्ति की तर्जनी कुंजियाँ', replayLabel: 'तर्जनी उंगली अभ्यास' },
    'bottom-row': { label: 'निचली पंक्ति की कुंजियाँ', replayLabel: 'निचली पंक्ति' },
    'number-row': { label: 'संख्या पंक्ति', replayLabel: 'संख्या पंक्ति' },
  },
};

export const TUTOR_FINGER_NAMES: Record<SupportedLocale, Record<string, string>> = {
  en: {
    a: 'left pinky', s: 'left ring', d: 'left middle', f: 'left index', g: 'left index',
    h: 'right index', j: 'right index', k: 'right middle', l: 'right ring', ';': 'right pinky',
    q: 'left pinky', w: 'left ring', e: 'left middle', r: 'left index', t: 'left index',
    y: 'right index', u: 'right index', i: 'right middle', o: 'right ring', p: 'right pinky',
    z: 'left pinky', x: 'left ring', c: 'left middle', v: 'left index', b: 'left index',
    n: 'right index', m: 'right index',
  },
  es: {
    a: 'meñique izquierdo', s: 'anular izquierdo', d: 'medio izquierdo', f: 'índice izquierdo', g: 'índice izquierdo',
    h: 'índice derecho', j: 'índice derecho', k: 'medio derecho', l: 'anular derecho', ';': 'meñique derecho', ñ: 'meñique derecho',
    q: 'meñique izquierdo', w: 'anular izquierdo', e: 'medio izquierdo', r: 'índice izquierdo', t: 'índice izquierdo',
    y: 'índice derecho', u: 'índice derecho', i: 'medio derecho', o: 'anular derecho', p: 'meñique derecho',
    z: 'meñique izquierdo', x: 'anular izquierdo', c: 'medio izquierdo', v: 'índice izquierdo', b: 'índice izquierdo',
    n: 'índice derecho', m: 'índice derecho',
  },
  ja: {
    a: '左小指', s: '左薬指', d: '左中指', f: '左人差し指', g: '左人差し指',
    h: '右人差し指', j: '右人差し指', k: '右中指', l: '右薬指', ';': '右小指',
    q: '左小指', w: '左薬指', e: '左中指', r: '左人差し指', t: '左人差し指',
    y: '右人差し指', u: '右人差し指', i: '右中指', o: '右薬指', p: '右小指',
    z: '左小指', x: '左薬指', c: '左中指', v: '左人差し指', b: '左人差し指',
    n: '右人差し指', m: '右人差し指',
  },
  fr: {
    a: 'auriculaire gauche', s: 'annulaire gauche', d: 'majeur gauche', f: 'index gauche', g: 'index gauche',
    h: 'index droit', j: 'index droit', k: 'majeur droit', l: 'annulaire droit', ';': 'auriculaire droit',
    q: 'auriculaire gauche', w: 'annulaire gauche', e: 'majeur gauche', r: 'index gauche', t: 'index gauche',
    y: 'index droit', u: 'index droit', i: 'majeur droit', o: 'annulaire droit', p: 'auriculaire droit',
    z: 'auriculaire gauche', x: 'annulaire gauche', c: 'majeur gauche', v: 'index gauche', b: 'index gauche',
    n: 'index droit', m: 'index droit',
  },
  de: {
    a: 'linker kleiner Finger', s: 'linker Ringfinger', d: 'linker Mittelfinger', f: 'linker Zeigefinger', g: 'linker Zeigefinger',
    h: 'rechter Zeigefinger', j: 'rechter Zeigefinger', k: 'rechter Mittelfinger', l: 'rechter Ringfinger', ';': 'rechter kleiner Finger',
    q: 'linker kleiner Finger', w: 'linker Ringfinger', e: 'linker Mittelfinger', r: 'linker Zeigefinger', t: 'linker Zeigefinger',
    y: 'rechter Zeigefinger', u: 'rechter Zeigefinger', i: 'rechter Mittelfinger', o: 'rechter Ringfinger', p: 'rechter kleiner Finger',
    z: 'linker kleiner Finger', x: 'linker Ringfinger', c: 'linker Mittelfinger', v: 'linker Zeigefinger', b: 'linker Zeigefinger',
    n: 'rechter Zeigefinger', m: 'rechter Zeigefinger',
  },
  pt: {
    a: 'mindinho esquerdo', s: 'anelar esquerdo', d: 'médio esquerdo', f: 'indicador esquerdo', g: 'indicador esquerdo',
    h: 'indicador direito', j: 'indicador direito', k: 'médio direito', l: 'anelar direito', ';': 'mindinho direito',
    q: 'mindinho esquerdo', w: 'anelar esquerdo', e: 'médio esquerdo', r: 'indicador esquerdo', t: 'indicador esquerdo',
    y: 'indicador direito', u: 'indicador direito', i: 'médio direito', o: 'anelar direito', p: 'mindinho direito',
    z: 'mindinho esquerdo', x: 'anelar esquerdo', c: 'médio esquerdo', v: 'indicador esquerdo', b: 'indicador esquerdo',
    n: 'indicador direito', m: 'indicador direito',
  },
  ko: {
    a: '왼손 새끼', s: '왼손 약지', d: '왼손 중지', f: '왼손 검지', g: '왼손 검지',
    h: '오른손 검지', j: '오른손 검지', k: '오른손 중지', l: '오른손 약지', ';': '오른손 새끼',
    q: '왼손 새끼', w: '왼손 약지', e: '왼손 중지', r: '왼손 검지', t: '왼손 검지',
    y: '오른손 검지', u: '오른손 검지', i: '오른손 중지', o: '오른손 약지', p: '오른손 새끼',
    z: '왼손 새끼', x: '왼손 약지', c: '왼손 중지', v: '왼손 검지', b: '왼손 검지',
    n: '오른손 검지', m: '오른손 검지',
  },
  it: {
    a: 'mignolo sinistro', s: 'anulare sinistro', d: 'medio sinistro', f: 'indice sinistro', g: 'indice sinistro',
    h: 'indice destro', j: 'indice destro', k: 'medio destro', l: 'anulare destro', ';': 'mignolo destro',
    q: 'mignolo sinistro', w: 'anulare sinistro', e: 'medio sinistro', r: 'indice sinistro', t: 'indice sinistro',
    y: 'indice destro', u: 'indice destro', i: 'medio destro', o: 'anulare destro', p: 'mignolo destro',
    z: 'mignolo sinistro', x: 'anulare sinistro', c: 'medio sinistro', v: 'indice sinistro', b: 'indice sinistro',
    n: 'indice destro', m: 'indice destro',
  },
  hi: {
    a: 'बाईं कनिष्ठिका', s: 'बाईं अनामिका', d: 'बाईं मध्यमा', f: 'बाईं तर्जनी', g: 'बाईं तर्जनी',
    h: 'दाईं तर्जनी', j: 'दाईं तर्जनी', k: 'दाईं मध्यमा', l: 'दाईं अनामिका', ';': 'दाईं कनिष्ठिका',
    q: 'बाईं कनिष्ठिका', w: 'बाईं अनामिका', e: 'बाईं मध्यमा', r: 'बाईं तर्जनी', t: 'बाईं तर्जनी',
    y: 'दाईं तर्जनी', u: 'दाईं तर्जनी', i: 'दाईं मध्यमा', o: 'दाईं अनामिका', p: 'दाईं कनिष्ठिका',
    z: 'बाईं कनिष्ठिका', x: 'बाईं अनामिका', c: 'बाईं मध्यमा', v: 'बाईं तर्जनी', b: 'बाईं तर्जनी',
    n: 'दाईं तर्जनी', m: 'दाईं तर्जनी',
  },
};

export function getLocalizedRecommendation(
  regionLabel: string,
  replayLabel: string,
  severity: string,
  lang: SupportedLocale = 'en'
): string {
  if (lang === 'es') {
    const sev = severity === 'high' ? 'bastantes dificultades con' : severity === 'medium' ? 'algunos tropiezos con' : 'pequeños fallos en';
    return `Estás teniendo ${sev} ${regionLabel}. Repite las prácticas de "${replayLabel}" para desarrollar memoria muscular en estas teclas.`;
  }
  if (lang === 'ja') {
    return `${regionLabel} でのミスが目立ちます。「${replayLabel}」のドリルを復習して、指の筋肉記憶を鍛えましょう。`;
  }
  if (lang === 'fr') {
    const sev = severity === 'high' ? 'des difficultés notables sur' : severity === 'medium' ? 'quelques hésitations sur' : 'de légères erreurs sur';
    return `Vous rencontrez ${sev} ${regionLabel}. Rejouez les exercices de « ${replayLabel} » pour renforcer votre mémoire musculaire.`;
  }
  if (lang === 'de') {
    return `Du hast noch Schwierigkeiten mit ${regionLabel}. Wiederhole die Übungen zu „${replayLabel}“, um dein Muskelgedächtnis zu stärken.`;
  }
  if (lang === 'pt') {
    return `Você está tendo dificuldades com ${regionLabel}. Repita os treinos de "${replayLabel}" para desenvolver memória muscular.`;
  }
  if (lang === 'ko') {
    return `${regionLabel}에서 실수가 발생하고 있습니다. "${replayLabel}" 연습을 반복하여 손가락 근육 기억을 다져보세요.`;
  }
  if (lang === 'it') {
    return `Stai riscontrando difficoltà con ${regionLabel}. Riprova gli esercizi "${replayLabel}" per rafforzare la memoria muscolare.`;
  }
  if (lang === 'hi') {
    return `आपको ${regionLabel} में कठिनाई हो रही है। इन कुंजियों की मांसपेशियों की स्मृति बनाने के लिए "${replayLabel}" अभ्यास दोहराएं।`;
  }
  const severityText = severity === 'high' ? 'significantly struggling with' : severity === 'medium' ? 'having some trouble with' : 'slightly underperforming on';
  return `You're ${severityText} the ${regionLabel}. Replay the "${replayLabel}" drills to build muscle memory for these keys.`;
}

export function getLocalizedStaminaMessage(
  dropOffPercent: number,
  isShort: boolean,
  lang: SupportedLocale = 'en'
): { verdict: 'strong' | 'moderate' | 'weak'; message: string } {
  if (isShort) {
    const shortMessages: Record<SupportedLocale, string> = {
      en: 'Session was too short to measure stamina. Keep it up!',
      es: 'La sesión fue muy corta para medir la resistencia. ¡Sigue así!',
      ja: 'セッションが短いため持久力は測定されませんでした。この調子で続けましょう！',
      fr: 'Session trop courte pour mesurer l’endurance. Continuez ainsi !',
      de: 'Sitzung war zu kurz, um die Ausdauer zu messen. Weiter so!',
      pt: 'A sessão foi muito curta para medir a resistência. Continue assim!',
      ko: '지구력을 측정하기에는 세션이 너무 짧았습니다. 계속 힘내세요!',
      it: 'Sessione troppo breve per misurare la resistenza. Continua così!',
      hi: 'सहनशक्ति मापने के लिए सत्र बहुत छोटा था। ऐसे ही जारी रखें!',
    };
    return { verdict: 'strong', message: shortMessages[lang] || shortMessages.en };
  }

  if (dropOffPercent <= 10) {
    const strongMessages: Record<SupportedLocale, string> = {
      en: 'Your typing speed stayed consistent throughout — impressive stamina! 💪',
      es: 'Tu velocidad de escritura se mantuvo constante durante toda la sesión — ¡impresionante resistencia! 💪',
      ja: 'タイピング速度が最後まで安定していました — 素晴らしい持久力です！ 💪',
      fr: 'Votre vitesse de frappe est restée constante du début à la fin — endurance impressionnante ! 💪',
      de: 'Deine Tippgeschwindigkeit blieb durchgehend konstant — beeindruckende Ausdauer! 💪',
      pt: 'Sua velocidade de digitação permaneceu constante o tempo todo — resistência impressionante! 💪',
      ko: '타이핑 속도가 끝까지 일정하게 유지되었습니다 — 인상적인 지구력입니다! 💪',
      it: 'La tua velocità di digitazione è rimasta costante per tutta la sessione — resistenza impressionante! 💪',
      hi: 'आपकी टाइपिंग की गति पूरे समय स्थिर रही — प्रभावशाली सहनशक्ति! 💪',
    };
    return { verdict: 'strong', message: strongMessages[lang] || strongMessages.en };
  }

  if (dropOffPercent <= 25) {
    const modMessages: Record<SupportedLocale, string> = {
      en: `Your speed dipped ${dropOffPercent}% toward the end. Try taking micro-breaks between paragraphs to sustain your pace.`,
      es: `Tu velocidad disminuyó un ${dropOffPercent}% hacia el final. Prueba hacer micropausas entre párrafos para mantener tu ritmo.`,
      ja: `終盤で速度が ${dropOffPercent}% 低下しました。ペースを維持するために段落間で短い休憩を挟んでみてください。`,
      fr: `Votre vitesse a baissé de ${dropOffPercent} % vers la fin. Prenez de courtes micro-pauses entre les paragraphes pour maintenir votre allure.`,
      de: `Deine Geschwindigkeit fiel gegen Ende um ${dropOffPercent}% ab. Mache kurze Pausen zwischen Absätzen, um dein Tempo zu halten.`,
      pt: `Sua velocidade caiu ${dropOffPercent}% perto do final. Tente fazer micropausas entre parágrafos para sustentar seu ritmo.`,
      ko: `마지막에 속도가 ${dropOffPercent}% 감소했습니다. 속도를 유지하려면 문단 사이에 아주 잠깐의 휴식을 취해보세요.`,
      it: `La tua velocità è diminuita del ${dropOffPercent}% verso la fine. Prova a fare micro-pause tra i paragrafi per mantenere il ritmo.`,
      hi: `अन्त में आपकी गति ${dropOffPercent}% कम हो गई। अपनी गति बनाए रखने के लिए पैराग्राफ के बीच में छोटे ब्रेक लें।`,
    };
    return { verdict: 'moderate', message: modMessages[lang] || modMessages.en };
  }

  const weakMessages: Record<SupportedLocale, string> = {
    en: `Your speed dropped ${dropOffPercent}% from peak to finish. Practice with longer passages and focus on maintaining a steady rhythm.`,
    es: `Tu velocidad cayó un ${dropOffPercent}% desde el pico hasta el final. Practica con textos más largos y concéntrate en mantener un ritmo constante.`,
    ja: `最高速度から終盤にかけて ${dropOffPercent}% 低下しました。長めのテキストで安定したリズムを保つ練習をしましょう。`,
    fr: `Votre vitesse a chuté de ${dropOffPercent} % entre le sommet et la fin. Entraînez-vous sur des textes plus longs en gardant un tempo régulier.`,
    de: `Deine Geschwindigkeit fiel vom Höchstwert bis zum Ende um ${dropOffPercent}% ab. Übe mit längeren Texten und achte auf einen gleichmäßigen Rhythmus.`,
    pt: `Sua velocidade caiu ${dropOffPercent}% do pico até o final. Pratique com textos mais longos focando em manter um ritmo constante.`,
    ko: `최고 속도에서 끝까지 ${dropOffPercent}% 속도가 떨어졌습니다. 긴 지문으로 일정한 리듬을 유지하는 연습을 해보세요.`,
    it: `La tua velocità è scesa del ${dropOffPercent}% dal picco alla fine. Esercitati con testi più lunghi concentrandoti su un ritmo costante.`,
    hi: `आपकी गति चरम से अंत तक ${dropOffPercent}% गिर गई। लंबे पाठों के साथ अभ्यास करें और एक स्थिर लय बनाए रखने पर ध्यान दें।`,
  };
  return { verdict: 'weak', message: weakMessages[lang] || weakMessages.en };
}

export function getLocalizedMascotMessage(
  flawCount: number,
  topFlaw: { label: string; keys: string[]; errorRate: number } | null,
  staminaVerdict: 'strong' | 'moderate' | 'weak',
  staminaMessage: string,
  grade: 'excellent' | 'good' | 'needs-work' | 'struggling',
  accuracy: number,
  wpm: number,
  lang: SupportedLocale = 'en'
): string {
  const greetings: Record<SupportedLocale, string[]> = {
    en: ['Hey champ! 🐂', 'Howdy, typist! 🤠', "Let's see how you did! 📊", 'Bully here with your report! 🐂'],
    es: ['¡Hola campeón! 🐂', '¡Hola, mecanógrafo! 🤠', '¡Veamos cómo te fue! 📊', '¡Aquí tu reporte con Bully! 🐂'],
    ja: ['お疲れ様！ 🐂', 'やあ、タイピスト！ 🤠', '結果を見てみましょう！ 📊', 'Bullyからの分析レポートです！ 🐂'],
    fr: ['Salut champion ! 🐂', 'Bonjour typiste ! 🤠', 'Voyons voir vos résultats ! 📊', 'Voici votre rapport d’analyse ! 🐂'],
    de: ['Hallo Champion! 🐂', 'Moin Typist! 🤠', 'Schauen wir uns dein Ergebnis an! 📊', 'Hier ist dein Analysebericht! 🐂'],
    pt: ['Olá campeão! 🐂', 'E aí, digitador! 🤠', 'Vamos ver o seu desempenho! 📊', 'Aqui está o seu relatório! 🐂'],
    ko: ['안녕, 챔피언! 🐂', '안녕하세요, 타자왕님! 🤠', '결과를 한번 볼까요! 📊', 'Bully의 분석 리포트입니다! 🐂'],
    it: ['Ciao campione! 🐂', 'Ehi dattilografo! 🤠', 'Vediamo come è andata! 📊', 'Ecco il tuo report con Bully! 🐂'],
    hi: ['नमस्ते चैंपियन! 🐂', 'अरे टाइपिस्ट दोस्त! 🤠', 'आइए देखें आपका प्रदर्शन कैसा रहा! 📊', 'बुलबॉट आपकी रिपोर्ट के साथ तैयार है! 🐂'],
  };

  const greetingList = greetings[lang] || greetings.en;
  const greeting = greetingList[Math.floor(Math.random() * greetingList.length)];

  if (grade === 'excellent') {
    if (lang === 'es') return `${greeting} ¡Trabajo increíble — ${accuracy}% de precisión a ${wpm} WPM! Escribes como un profesional. ¡Sigue superando tus límites!`;
    if (lang === 'ja') return `${greeting} 驚異的なタイピングです — 精度 ${accuracy}%、速度 ${wpm} WPM！プロのような腕前です。その調子で加速していきましょう！`;
    if (lang === 'fr') return `${greeting} Travail remarquable — ${accuracy} % de précision à ${wpm} WPM ! Vous tapez comme un pro. Continuez à repousser vos limites !`;
    if (lang === 'de') return `${greeting} Fantastische Leistung — ${accuracy}% Genauigkeit bei ${wpm} WPM! Du tippst wie ein Profi. Mach weiter so!`;
    if (lang === 'pt') return `${greeting} Trabalho incrível — ${accuracy}% de precisão a ${wpm} WPM! Você digita como um profissional. Continue acelerando!`;
    if (lang === 'ko') return `${greeting} 놀라운 실력입니다 — ${accuracy}% 정확도에 ${wpm} WPM! 전문가처럼 타이핑하고 계시네요. 계속 전진하세요!`;
    if (lang === 'it') return `${greeting} Lavoro straordinario — ${accuracy}% di precisione a ${wpm} WPM! Digiti come un professionista. Continua così!`;
    if (lang === 'hi') return `${greeting} अविश्वसनीय प्रदर्शन — ${wpm} WPM पर ${accuracy}% सटीकता! आप एक पेशेवर की तरह टाइप कर रहे हैं। गति बढ़ाते रहें!`;
    return `${greeting} Incredible work — ${accuracy}% accuracy at ${wpm} WPM! You're typing like a pro. Keep pushing those speed limits!`;
  }

  const parts: string[] = [greeting];

  if (topFlaw) {
    const keyList = topFlaw.keys.slice(0, 4).map(k => k.toUpperCase()).join(', ');
    const errPct = Math.round(topFlaw.errorRate * 100);
    if (lang === 'es') {
      parts.push(`He notado que tienes dificultades con ${topFlaw.label} — las teclas [${keyList}] tuvieron un ${errPct}% de error.`);
      if (flawCount > 1) parts.push(`Además de ${flawCount - 1} área(s) más para mejorar.`);
    } else if (lang === 'ja') {
      parts.push(`${topFlaw.label} に改善の余地があります — キー [${keyList}] のエラー率は ${errPct}% でした。`);
      if (flawCount > 1) parts.push(`他にも ${flawCount - 1} 箇所の練習ポイントがあります。`);
    } else if (lang === 'fr') {
      parts.push(`J'ai remarqué des difficultés sur ${topFlaw.label} — les touches [${keyList}] affichent ${errPct} % d'erreur.`);
      if (flawCount > 1) parts.push(`Plus ${flawCount - 1} autre(s) zone(s) à travailler.`);
    } else if (lang === 'de') {
      parts.push(`Ich habe bemerkt, dass du bei ${topFlaw.label} Schwierigkeiten hast — die Tasten [${keyList}] hatten ${errPct}% Fehler.`);
      if (flawCount > 1) parts.push(`Plus ${flawCount - 1} weitere(r) Bereich(e) zum Verbessern.`);
    } else if (lang === 'pt') {
      parts.push(`Notei que você está tendo dificuldades com ${topFlaw.label} — as teclas [${keyList}] tiveram ${errPct}% de erro.`);
      if (flawCount > 1) parts.push(`Além de mais ${flawCount - 1} área(s) para melhorar.`);
    } else if (lang === 'ko') {
      parts.push(`${topFlaw.label}에서 어려움을 겪고 계신 것 같아요 — 키 [${keyList}]의 오타율이 ${errPct}%였습니다.`);
      if (flawCount > 1) parts.push(`추가로 연습할 영역이 ${flawCount - 1}곳 더 있습니다.`);
    } else if (lang === 'it') {
      parts.push(`Ho notato qualche difficoltà con ${topFlaw.label} — i tasti [${keyList}] hanno registrato il ${errPct}% di errori.`);
      if (flawCount > 1) parts.push(`Inoltre ci sono altre ${flawCount - 1} aree da perfezionare.`);
    } else if (lang === 'hi') {
      parts.push(`मैंने देखा कि आपको ${topFlaw.label} में कठिनाई हो रही है — कुंजियों [${keyList}] पर ${errPct}% त्रुटि दर थी।`);
      if (flawCount > 1) parts.push(`सुधार के लिए ${flawCount - 1} और क्षेत्र भी हैं।`);
    } else {
      parts.push(`I noticed you're struggling with the ${topFlaw.label} — keys ${keyList} had a ${errPct}% error rate.`);
      if (flawCount > 1) parts.push(`Plus ${flawCount - 1} more area${flawCount > 2 ? 's' : ''} to work on.`);
    }
  }

  if (staminaVerdict === 'weak') {
    parts.push(staminaMessage);
  } else if (!topFlaw) {
    if (lang === 'es') parts.push(`${accuracy}% de precisión a ${wpm} WPM — ¡sesión muy sólida! Un par de repeticiones más y serás imparable.`);
    else if (lang === 'ja') parts.push(`精度 ${accuracy}%、速度 ${wpm} WPM — 安定した素晴らしいセッションです！この調子で続けましょう。`);
    else if (lang === 'fr') parts.push(`${accuracy} % de précision à ${wpm} WPM — session très solide ! Encore quelques séries et vous serez inarrêtable.`);
    else if (lang === 'de') parts.push(`${accuracy}% Genauigkeit bei ${wpm} WPM — solide Sitzung! Noch ein paar Durchgänge und du bist unschlagbar.`);
    else if (lang === 'pt') parts.push(`${accuracy}% de precisão a ${wpm} WPM — sessão muito sólida! Mais alguns treinos e você será imparável.`);
    else if (lang === 'ko') parts.push(`${accuracy}% 정확도에 ${wpm} WPM — 아주 안정적인 세션이었습니다! 몇 번만 더 연습하면 최고가 될 거예요.`);
    else if (lang === 'it') parts.push(`${accuracy}% di precisione a ${wpm} WPM — sessione solida! Ancora un po' di pratica e sarai inarrestabile.`);
    else if (lang === 'hi') parts.push(`${wpm} WPM पर ${accuracy}% सटीकता — बहुत ठोस सत्र! कुछ और अभ्यासों के बाद आप सर्वश्रेष्ठ होंगे।`);
    else parts.push(`${accuracy}% accuracy at ${wpm} WPM — solid session! A few more reps and you'll be unstoppable.`);
  }

  if (topFlaw) {
    if (lang === 'es') parts.push('¡Pulsa los botones de repetición abajo para entrenar tus puntos débiles! 🚀');
    else if (lang === 'ja') parts.push('下のやり直しボタンを押して、苦手な箇所を集中的に練習しましょう！ 🚀');
    else if (lang === 'fr') parts.push('Cliquez sur les boutons ci-dessous pour travailler vos points faibles ! 🚀');
    else if (lang === 'de') parts.push('Tippe unten auf Wiederholen, um deine Schwachstellen zu trainieren! 🚀');
    else if (lang === 'pt') parts.push('Toque nos botões de repetição abaixo para treinar seus pontos fracos! 🚀');
    else if (lang === 'ko') parts.push('취약한 부분을 다시 연습하려면 아래의 다시 하기 버튼을 누르세요! 🚀');
    else if (lang === 'it') parts.push('Tocca i pulsanti sotto per esercitarti sui tuoi punti deboli! 🚀');
    else if (lang === 'hi') parts.push('अपनी कमजोरियों को सुधारने के लिए नीचे दिए गए पुनः प्रयास बटन दबाएं! 🚀');
    else parts.push('Hit the replay buttons below to drill your weak spots! 🚀');
  }

  return parts.join(' ');
}

export interface TutorUIStrings {
  title: string;
  sessionAnalysis: string;
  lifetimeOverview: string;
  tabs: {
    analytics: string;
    chat: string;
  };
  wpmVsTarget: string;
  targetReached: string;
  identifiedWeaknesses: string;
  noFlaws: string;
  weakKeyHeatmap: string;
  heatmapLegend: {
    noErrors: string;
    low: string;
    medium: string;
    high: string;
  };
  typingStamina: string;
  gotIt: string;
  replayLesson: string;
  errSuffix: string;
  grades: {
    excellent: string;
    good: string;
    needsWork: string;
    struggling: string;
  };
  severities: {
    high: string;
    medium: string;
    low: string;
  };
  staminaVerdicts: {
    strong: string;
    moderate: string;
    weak: string;
  };
}

export const TUTOR_UI_STRINGS: Record<SupportedLocale, TutorUIStrings> = {
  en: {
    title: 'AI Typing Tutor',
    sessionAnalysis: 'Session Analysis',
    lifetimeOverview: 'Lifetime Overview',
    tabs: { analytics: 'Analytics', chat: 'Chat Tutor' },
    wpmVsTarget: 'Average WPM vs Target',
    targetReached: 'Target reached! Time to level up.',
    identifiedWeaknesses: 'Identified Weaknesses',
    noFlaws: 'No major weaknesses detected — great job!',
    weakKeyHeatmap: 'Weak Key Heatmap',
    heatmapLegend: { noErrors: 'No Errors', low: 'Low', medium: 'Medium', high: 'High' },
    typingStamina: 'Typing Stamina',
    gotIt: 'Got It 👍',
    replayLesson: 'Replay Lesson',
    errSuffix: 'err',
    grades: { excellent: 'Excellent', good: 'Good', needsWork: 'Needs Work', struggling: 'Keep Trying' },
    severities: { high: 'High', medium: 'Medium', low: 'Low' },
    staminaVerdicts: { strong: 'Strong', moderate: 'Moderate', weak: 'Weak' },
  },
  es: {
    title: 'Tutor de Mecanografía con IA',
    sessionAnalysis: 'Análisis de la Sesión',
    lifetimeOverview: 'Resumen Histórico',
    tabs: { analytics: 'Estadísticas', chat: 'Chat con Tutor' },
    wpmVsTarget: 'PPM Promedio vs Objetivo',
    targetReached: '¡Objetivo alcanzado! Es hora de subir de nivel.',
    identifiedWeaknesses: 'Puntos a Mejorar',
    noFlaws: 'No se detectaron debilidades importantes — ¡excelente trabajo!',
    weakKeyHeatmap: 'Mapa de Calor de Teclas Débiles',
    heatmapLegend: { noErrors: 'Sin errores', low: 'Bajo', medium: 'Medio', high: 'Alto' },
    typingStamina: 'Resistencia al Escribir',
    gotIt: '¡Entendido! 👍',
    replayLesson: 'Repetir Lección',
    errSuffix: 'error',
    grades: { excellent: 'Excelente', good: 'Bueno', needsWork: 'Por Mejorar', struggling: 'Sigue Intentando' },
    severities: { high: 'Alto', medium: 'Medio', low: 'Bajo' },
    staminaVerdicts: { strong: 'Fuerte', moderate: 'Moderada', weak: 'Débil' },
  },
  ja: {
    title: 'AIタイピングチューター',
    sessionAnalysis: 'セッション分析',
    lifetimeOverview: '総合履歴サマリー',
    tabs: { analytics: 'アナリティクス', chat: 'チャットチューター' },
    wpmVsTarget: '平均WPMと目標速度',
    targetReached: '目標達成！次のレベルへ挑戦しましょう。',
    identifiedWeaknesses: '検出された弱点',
    noFlaws: '大きな弱点は見つかりませんでした — 素晴らしい！',
    weakKeyHeatmap: '弱点キー・ヒートマップ',
    heatmapLegend: { noErrors: 'ミスなし', low: '低', medium: '中', high: '高' },
    typingStamina: 'タイピング持久力',
    gotIt: '了解 👍',
    replayLesson: 'レッスンを復習',
    errSuffix: '誤打率',
    grades: { excellent: '完璧', good: '良好', needsWork: '要練習', struggling: 'ファイト' },
    severities: { high: '高', medium: '中', low: '低' },
    staminaVerdicts: { strong: '安定', moderate: '普通', weak: '低下' },
  },
  fr: {
    title: 'Tuteur de Frappe IA',
    sessionAnalysis: 'Analyse de Session',
    lifetimeOverview: 'Vue d’Ensemble Globale',
    tabs: { analytics: 'Analytique', chat: 'Tuteur par Chat' },
    wpmVsTarget: 'MPM Moyen vs Objectif',
    targetReached: 'Objectif atteint ! Prêt pour le niveau supérieur.',
    identifiedWeaknesses: 'Faiblesses Détectées',
    noFlaws: 'Aucune faiblesse majeure détectée — excellent travail !',
    weakKeyHeatmap: 'Carte Thermique des Touches',
    heatmapLegend: { noErrors: 'Sans erreur', low: 'Faible', medium: 'Moyen', high: 'Élevé' },
    typingStamina: 'Endurance de Frappe',
    gotIt: 'Compris 👍',
    replayLesson: 'Rejouer la Leçon',
    errSuffix: 'err',
    grades: { excellent: 'Excellent', good: 'Bien', needsWork: 'À Perfectionner', struggling: 'Accrochez-vous' },
    severities: { high: 'Élevé', medium: 'Moyen', low: 'Faible' },
    staminaVerdicts: { strong: 'Solide', moderate: 'Moyenne', weak: 'Faible' },
  },
  de: {
    title: 'KI-Tipp-Tutor',
    sessionAnalysis: 'Sitzungsanalyse',
    lifetimeOverview: 'Gesamtübersicht',
    tabs: { analytics: 'Analytik', chat: 'Chat-Tutor' },
    wpmVsTarget: 'Durchschnittliche WPM vs Ziel',
    targetReached: 'Ziel erreicht! Zeit für das nächste Level.',
    identifiedWeaknesses: 'Erkannte Schwachstellen',
    noFlaws: 'Keine wesentlichen Schwachstellen erkannt — tolle Arbeit!',
    weakKeyHeatmap: 'Heatmap der Tasten',
    heatmapLegend: { noErrors: 'Keine Fehler', low: 'Niedrig', medium: 'Mittel', high: 'Hoch' },
    typingStamina: 'Tipp-Ausdauer',
    gotIt: 'Verstanden 👍',
    replayLesson: 'Lektion wiederholen',
    errSuffix: 'Fehler',
    grades: { excellent: 'Hervorragend', good: 'Gut', needsWork: 'Übungsbedarf', struggling: 'Dranbleiben' },
    severities: { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' },
    staminaVerdicts: { strong: 'Stark', moderate: 'Mäßig', weak: 'Schwach' },
  },
  pt: {
    title: 'Tutor de Digitação IA',
    sessionAnalysis: 'Análise da Sessão',
    lifetimeOverview: 'Visão Geral Histórica',
    tabs: { analytics: 'Métricas', chat: 'Chat com Tutor' },
    wpmVsTarget: 'PPM Médio vs Meta',
    targetReached: 'Meta alcançada! Hora de subir de nível.',
    identifiedWeaknesses: 'Pontos Fracos Detectados',
    noFlaws: 'Nenhum ponto fraco relevante detectado — ótimo trabalho!',
    weakKeyHeatmap: 'Mapa de Calor das Teclas',
    heatmapLegend: { noErrors: 'Sem erros', low: 'Baixo', medium: 'Médio', high: 'Alto' },
    typingStamina: 'Resistência de Digitação',
    gotIt: 'Entendido 👍',
    replayLesson: 'Repetir Lição',
    errSuffix: 'erro',
    grades: { excellent: 'Excelente', good: 'Bom', needsWork: 'Praticar Mais', struggling: 'Continue Tentando' },
    severities: { high: 'Alto', medium: 'Médio', low: 'Baixo' },
    staminaVerdicts: { strong: 'Forte', moderate: 'Moderada', weak: 'Fraca' },
  },
  ko: {
    title: 'AI 타자 튜터',
    sessionAnalysis: '세션 분석',
    lifetimeOverview: '전체 통계 요약',
    tabs: { analytics: '분석 리포트', chat: '채팅 튜터' },
    wpmVsTarget: '평균 타수(WPM) vs 목표',
    targetReached: '목표 도달! 다음 단계로 레벨업하세요.',
    identifiedWeaknesses: '감지된 취약점',
    noFlaws: '취약점이 발견되지 않았습니다 — 훌륭합니다!',
    weakKeyHeatmap: '취약 키 히트맵',
    heatmapLegend: { noErrors: '오타 없음', low: '낮음', medium: '중간', high: '높음' },
    typingStamina: '타이핑 지구력',
    gotIt: '확인 👍',
    replayLesson: '레슨 다시 하기',
    errSuffix: '오타율',
    grades: { excellent: '완벽', good: '좋음', needsWork: '연습 필요', struggling: '힘내세요' },
    severities: { high: '높음', medium: '보통', low: '낮음' },
    staminaVerdicts: { strong: '강함', moderate: '보통', weak: '저하' },
  },
  it: {
    title: 'Tutor di Dattilografia IA',
    sessionAnalysis: 'Analisi della Sessione',
    lifetimeOverview: 'Panoramica Storica',
    tabs: { analytics: 'Statistiche', chat: 'Chat con Tutor' },
    wpmVsTarget: 'PPM Medi vs Obiettivo',
    targetReached: 'Obiettivo raggiunto! Ora si passa al livello successivo.',
    identifiedWeaknesses: 'Punti Deboli Rilevati',
    noFlaws: 'Nessun punto debole significativo rilevato — ottimo lavoro!',
    weakKeyHeatmap: 'Mappa Termica dei Tasti',
    heatmapLegend: { noErrors: 'Nessun errore', low: 'Basso', medium: 'Medio', high: 'Alto' },
    typingStamina: 'Resistenza di Digitazione',
    gotIt: 'Ricevuto 👍',
    replayLesson: 'Rifai la Lezione',
    errSuffix: 'err',
    grades: { excellent: 'Eccellente', good: 'Buono', needsWork: 'Da Migliorare', struggling: 'Non Mollare' },
    severities: { high: 'Alto', medium: 'Medio', low: 'Basso' },
    staminaVerdicts: { strong: 'Forte', moderate: 'Moderata', weak: 'Bassa' },
  },
  hi: {
    title: 'AI टाइपिंग ट्यूटर',
    sessionAnalysis: 'सत्र विश्लेषण',
    lifetimeOverview: 'समग्र प्रदर्शन सारांश',
    tabs: { analytics: 'एनालिटिक्स', chat: 'चैट ट्यूटर' },
    wpmVsTarget: 'औसत WPM बनाम लक्ष्य',
    targetReached: 'लक्ष्य हासिल हुआ! अब अगले स्तर पर जाने का समय है।',
    identifiedWeaknesses: 'पहचानी गई कमजोरियां',
    noFlaws: 'कोई बड़ी कमजोरी नहीं मिली — शानदार काम!',
    weakKeyHeatmap: 'कमजोर कुंजी हीटमैप',
    heatmapLegend: { noErrors: 'कोई त्रुटि नहीं', low: 'कम', medium: 'मध्यम', high: 'अधिक' },
    typingStamina: 'टाइपिंग सहनशक्ति',
    gotIt: 'समझ गया 👍',
    replayLesson: 'पाठ दोहराएं',
    errSuffix: 'त्रुटि',
    grades: { excellent: 'उत्कृष्ट', good: 'अच्छा', needsWork: 'अभ्यास चाहिए', struggling: 'प्रयास जारी रखें' },
    severities: { high: 'उच्च', medium: 'मध्यम', low: 'कम' },
    staminaVerdicts: { strong: 'मजबूत', moderate: 'मध्यम', weak: 'कमजोर' },
  },
};

export interface ChatUIStrings {
  welcome: string;
  quickPrompts: string[];
  placeholder: string;
  suggestions: string;
  thinking: string;
  fallbackError: string;
  openLesson: string;
}

export const CHAT_I18N: Record<SupportedLocale, ChatUIStrings> = {
  en: {
    welcome: "Hello! I'm BullBot, your personal AI typing coach 🐂⚡ Ask me anything about finger placement, speed strategies, or your recent stats!",
    quickPrompts: [
      'How do I type numbers faster?',
      'Why am I struggling with my weak keys?',
      'How do I break past 60 WPM?',
      'What is the correct finger posture?',
    ],
    placeholder: "Ask BullBot anything (e.g. 'Analyze my weak keys', 'How to hit 80 WPM?')...",
    suggestions: 'Suggestions:',
    thinking: 'BullBot is thinking',
    fallbackError: "Oops, my circuits crossed. Let's try that again!",
    openLesson: 'Open',
  },
  es: {
    welcome: "¡Hola! Soy BullBot, tu entrenador personal de mecanografía con IA 🐂⚡ ¡Pregúntame lo que quieras sobre colocación de dedos, velocidad o tus estadísticas!",
    quickPrompts: [
      '¿Cómo escribo números más rápido?',
      '¿Por qué me cuesta con mis teclas débiles?',
      '¿Cómo supero los 60 WPM?',
      '¿Cuál es la postura correcta de los dedos?',
    ],
    placeholder: 'Pregúntale a BullBot (ej. "Analiza mis fallos", "¿Cómo llego a 80 PPM?")...',
    suggestions: 'Sugerencias:',
    thinking: 'BullBot está pensando',
    fallbackError: '¡Ups, se cruzaron mis cables! Intentémoslo de nuevo.',
    openLesson: 'Abrir',
  },
  ja: {
    welcome: 'こんにちは！AIタイピングコーチのBullBotです 🐂⚡ 指の配置、スピードアップのコツ、最近の統計など、何でも聞いてください！',
    quickPrompts: [
      '数字をもっと速く打つには？',
      '苦手なキーを克服するには？',
      '60 WPMを超えるには？',
      '正しい指のホームポジションは？',
    ],
    placeholder: 'BullBotに質問 (例: 「弱点を教えて」「80 WPMを目指すコツは？」)...',
    suggestions: 'おすすめの質問:',
    thinking: 'BullBotが思考中',
    fallbackError: 'おっと、通信エラーが発生しました。もう一度お試しください！',
    openLesson: '開く',
  },
  fr: {
    welcome: 'Bonjour ! Je suis BullBot, votre coach de frappe personnel par IA 🐂⚡ Posez-moi des questions sur le positionnement des doigts, la vitesse ou vos statistiques !',
    quickPrompts: [
      'Comment taper les chiffres plus vite ?',
      'Pourquoi ai-je du mal avec mes touches faibles ?',
      'Comment dépasser 60 MPM ?',
      'Quelle est la bonne posture des doigts ?',
    ],
    placeholder: 'Demandez à BullBot (ex. "Analyse mes points faibles", "Comment atteindre 80 MPM ?")...',
    suggestions: 'Suggestions :',
    thinking: 'BullBot réfléchit',
    fallbackError: 'Oups, un petit faux contact. Réessayons !',
    openLesson: 'Ouvrir',
  },
  de: {
    welcome: 'Hallo! Ich bin BullBot, dein persönlicher KI-Tipp-Coach 🐂⚡ Frag mich alles über Fingerplatzierung, Tempo-Strategien oder deine aktuellen Statistiken!',
    quickPrompts: [
      'Wie tippe ich Zahlen schneller?',
      'Warum habe ich Probleme mit meinen Schwachstellen?',
      'Wie knacke ich 60 WPM?',
      'Was ist die richtige Fingerhaltung?',
    ],
    placeholder: 'Frag BullBot (z.B. „Analysiere meine Fehler“, „Wie erreiche ich 80 WPM?“)...',
    suggestions: 'Vorschläge:',
    thinking: 'BullBot denkt nach',
    fallbackError: 'Hoppla, ein kleiner Kurzschluss. Lass es uns noch einmal versuchen!',
    openLesson: 'Öffnen',
  },
  pt: {
    welcome: 'Olá! Sou o BullBot, seu treinador de digitação por IA 🐂⚡ Pergunte-me qualquer coisa sobre posicionamento dos dedos, velocidade ou estatísticas!',
    quickPrompts: [
      'Como digitar números mais rápido?',
      'Por que tenho dificuldade com teclas fracas?',
      'Como ultrapassar 60 WPM?',
      'Qual é a postura correta dos dedos?',
    ],
    placeholder: 'Pergunte ao BullBot (ex.: "Analise meus erros", "Como bater 80 PPM?")...',
    suggestions: 'Sugestões:',
    thinking: 'BullBot está pensando',
    fallbackError: 'Ops, meus circuitos se cruzaram. Vamos tentar de novo!',
    openLesson: 'Abrir',
  },
  ko: {
    welcome: '안녕하세요! 여러분의 전담 AI 타자 코치 BullBot입니다 🐂⚡ 손가락 위치, 속도 향상 전략, 최근 통계에 대해 무엇이든 물어보세요!',
    quickPrompts: [
      '숫자를 더 빠르게 치려면 어떻게 해야 하나요?',
      '취약한 키를 어떻게 극복하나요?',
      '60 WPM을 넘기려면 어떻게 해야 하나요?',
      '올바른 손가락 자세는 무엇인가요?',
    ],
    placeholder: 'BullBot에게 물어보세요 (예: "취약 키 분석해줘", "80 WPM 달성 방법")...',
    suggestions: '추천 질문:',
    thinking: 'BullBot이 생각 중입니다',
    fallbackError: '앗, 회로에 잠시 문제가 생겼어요. 다시 시도해 주세요!',
    openLesson: '열기',
  },
  it: {
    welcome: 'Ciao! Sono BullBot, il tuo coach personale di dattilografia basato su IA 🐂⚡ Chiedimi qualsiasi cosa su postura delle dita, velocità o statistiche!',
    quickPrompts: [
      'Come digitare i numeri più velocemente?',
      'Perché ho difficoltà con i tasti deboli?',
      'Come superare i 60 WPM?',
      'Qual è la postura corretta delle dita?',
    ],
    placeholder: 'Chiedi a BullBot (es. "Analizza i miei tasti deboli", "Come arrivare a 80 PPM?")...',
    suggestions: 'Suggerimenti:',
    thinking: 'BullBot sta pensando',
    fallbackError: 'Ops, c’è stato un intoppo nei circuiti. Riprova tra poco!',
    openLesson: 'Apri',
  },
  hi: {
    welcome: 'नमस्ते! मैं बुलबॉट हूँ, आपका व्यक्तिगत AI टाइपिंग कोच 🐂⚡ उंगलियों की स्थिति, गति की रणनीति या अपने हालिया आंकड़ों के बारे में कुछ भी पूछें!',
    quickPrompts: [
      'संख्याओं को और तेजी से कैसे टाइप करें?',
      'कमजोर कुंजियों में सुधार कैसे करें?',
      '60 WPM से आगे कैसे बढ़ें?',
      'उंगलियों की सही मुद्रा क्या है?',
    ],
    placeholder: 'बुलबॉट से कुछ भी पूछें (उदा. "मेरी कमजोर कुंजियाँ बताओ", "80 WPM कैसे पहुंचे?")...',
    suggestions: 'सुझाव:',
    thinking: 'बुलबॉट सोच रहा है',
    fallbackError: 'ओह, कुछ तकनीकी समस्या आई। आइए फिर से प्रयास करें!',
    openLesson: 'खोलें',
  },
};

export const FLOATING_BOT_I18N: Record<SupportedLocale, { tipTitle: string; tipBody: string; tutorLabel: string }> = {
  en: {
    tipTitle: 'BullBot Tip',
    tipBody: 'Want to check your weak keys and stamina? Tap me anytime! 🐂',
    tutorLabel: 'Tutor',
  },
  es: {
    tipTitle: 'Consejo de BullBot',
    tipBody: '¿Quieres revisar tus teclas débiles y resistencia? ¡Tócame cuando quieras! 🐂',
    tutorLabel: 'Tutor',
  },
  ja: {
    tipTitle: 'BullBotのアドバイス',
    tipBody: '苦手キーや持久力をチェックしたいですか？いつでもタップしてください！ 🐂',
    tutorLabel: 'チューター',
  },
  fr: {
    tipTitle: 'Conseil de BullBot',
    tipBody: 'Envie de vérifier vos touches faibles et votre endurance ? Touchez-moi à tout moment ! 🐂',
    tutorLabel: 'Tuteur',
  },
  de: {
    tipTitle: 'BullBot Tipp',
    tipBody: 'Möchtest du deine Fehlertasten und Ausdauer prüfen? Tippe mich jederzeit an! 🐂',
    tutorLabel: 'Tutor',
  },
  pt: {
    tipTitle: 'Dica do BullBot',
    tipBody: 'Quer conferir suas teclas fracas e resistência? Toque em mim quando quiser! 🐂',
    tutorLabel: 'Tutor',
  },
  ko: {
    tipTitle: 'BullBot 팁',
    tipBody: '취약한 키와 타이핑 지구력을 확인하고 싶으신가요? 언제든 저를 눌러보세요! 🐂',
    tutorLabel: '튜터',
  },
  it: {
    tipTitle: 'Consiglio di BullBot',
    tipBody: 'Vuoi controllare i tuoi tasti deboli e la resistenza? Tocca qui quando vuoi! 🐂',
    tutorLabel: 'Tutor',
  },
  hi: {
    tipTitle: 'बुलबॉट टिप',
    tipBody: 'क्या आप अपनी कमजोर कुंजियों और सहनशक्ति की जांच करना चाहते हैं? मुझे कभी भी टैप करें! 🐂',
    tutorLabel: 'ट्यूटर',
  },
};

export const WEAK_KEY_UI_I18N: Record<SupportedLocale, { title: string; trickyCombos: string; startMission: string }> = {
  en: {
    title: '🎯 Weak-Key Analysis',
    trickyCombos: 'Tricky Combos',
    startMission: '🚀 Start {min}-min Mission',
  },
  es: {
    title: '🎯 Análisis de Teclas Débiles',
    trickyCombos: 'Combinaciones Difíciles',
    startMission: '🚀 Iniciar Misión de {min} min',
  },
  ja: {
    title: '🎯 苦手キー分析',
    trickyCombos: '苦手な組み合わせ',
    startMission: '🚀 {min}分間ミッションを開始',
  },
  fr: {
    title: '🎯 Analyse des Touches Faibles',
    trickyCombos: 'Combinaisons Délicates',
    startMission: '🚀 Lancer Mission ({min} min)',
  },
  de: {
    title: '🎯 Schwachstellen-Analyse',
    trickyCombos: 'Schwierige Kombinationen',
    startMission: '🚀 {min}-Min. Mission starten',
  },
  pt: {
    title: '🎯 Análise de Teclas Fracas',
    trickyCombos: 'Combinações Difíceis',
    startMission: '🚀 Iniciar Missão de {min} min',
  },
  ko: {
    title: '🎯 취약 키 분석',
    trickyCombos: '어려운 조합',
    startMission: '🚀 {min}분 미션 시작하기',
  },
  it: {
    title: '🎯 Analisi Tasti Deboli',
    trickyCombos: 'Combinazioni Ostiche',
    startMission: '🚀 Avvia Missione da {min} min',
  },
  hi: {
    title: '🎯 कमजोर-कुंजी विश्लेषण',
    trickyCombos: 'कठिन संयोजन',
    startMission: '🚀 {min}-मिनट का मिशन शुरू करें',
  },
};

export function getLocalizedWeakKeyMessage(
  data: {
    significantWeakKeys: { key: string; errorRate: number }[];
    significantBigrams: { bigram: string; errorRate: number }[];
    hesitationKeys: { key: string; avgDelayMs: number }[];
    hasSessions: boolean;
  },
  lang: SupportedLocale = 'en'
): string {
  const { significantWeakKeys, significantBigrams, hesitationKeys, hasSessions } = data;

  if (significantWeakKeys.length > 0) {
    const keyList = significantWeakKeys.map((k) => k.key.toUpperCase()).join(', ');
    const fingerDict = TUTOR_FINGER_NAMES[lang] || TUTOR_FINGER_NAMES.en;
    const fingerSet = new Set(significantWeakKeys.map((k) => fingerDict[k.key] || 'unknown').filter(Boolean));
    const fingers = Array.from(fingerSet).join(' & ');
    const duration = Math.max(3, significantWeakKeys.length);

    if (lang === 'es') {
      return `Tus dedos (${fingers}) necesitan práctica. Las teclas [${keyList}] tienen altas tasas de error. Prueba la misión de ${duration} minutos antes de tu próxima lección.`;
    }
    if (lang === 'ja') {
      return `【${fingers}】に練習が必要です。キー [${keyList}] のミスが多くなっています。次のレッスンの前に ${duration}分間のミッションに挑戦してみましょう。`;
    }
    if (lang === 'fr') {
      return `Vos doigts (${fingers}) ont besoin d'entraînement. Les touches [${keyList}] ont des taux d'erreur élevés. Essayez la mission de ${duration} minutes avant la prochaine leçon.`;
    }
    if (lang === 'de') {
      return `Deine Finger (${fingers}) brauchen Übung. Die Tasten [${keyList}] haben hohe Fehlerraten. Starte die ${duration}-Minuten-Mission vor deiner nächsten Lektion.`;
    }
    if (lang === 'pt') {
      return `Seus dedos (${fingers}) precisam de treino. As teclas [${keyList}] estão com altas taxas de erro. Tente a missão de ${duration} minutos antes da próxima lição.`;
    }
    if (lang === 'ko') {
      return `손가락 [${fingers}] 연습이 필요합니다. 키 [${keyList}]의 오타율이 높습니다. 다음 레슨 전 ${duration}분 미션에 도전해 보세요.`;
    }
    if (lang === 'it') {
      return `Le tue dita (${fingers}) richiedono esercizio. I tasti [${keyList}] hanno molti errori. Prova la missione di ${duration} minuti prima della prossima lezione.`;
    }
    if (lang === 'hi') {
      return `आपकी (${fingers}) उंगलियों को अभ्यास की आवश्यकता है। कुंजियों [${keyList}] पर त्रुटि दर अधिक है। अपने अगले पाठ से पहले ${duration}-मिनट का मिशन आज़माएं।`;
    }
    return `Your ${fingers} finger${fingerSet.size > 1 ? 's' : ''} need${fingerSet.size === 1 ? 's' : ''} practice. Keys ${keyList} have high error rates. Try the ${duration}-minute ${keyList} mission before your next lesson.`;
  }

  if (significantBigrams.length > 0) {
    const bigramList = significantBigrams.map((b) => `"${b.bigram}"`).join(', ');
    if (lang === 'es') return `Las combinaciones de letras ${bigramList} te están haciendo tropezar. Practica estas transiciones para mejorar tu fluidez.`;
    if (lang === 'ja') return `キーの組み合わせ ${bigramList} でミスが発生しています。この移行を練習してスムーズなタイピングを目指しましょう。`;
    if (lang === 'fr') return `Les combinaisons de lettres ${bigramList} vous font trébucher. Pratiquez ces transitions pour améliorer votre fluidité.`;
    if (lang === 'de') return `Die Buchstabenkombinationen ${bigramList} bereiten dir Schwierigkeiten. Übe diese Übergänge für einen besseren Schreibfluss.`;
    if (lang === 'pt') return `As combinações de letras ${bigramList} estão atrapalhando sua velocidade. Pratique essas transições para melhorar o ritmo.`;
    if (lang === 'ko') return `글자 조합 ${bigramList}에서 오타가 자주 발생합니다. 매끄러운 타이핑을 위해 이 전환 연습을 해보세요.`;
    if (lang === 'it') return `Le combinazioni di lettere ${bigramList} ti mettono in difficoltà. Esercitati su queste transizioni per migliorare la fluidità.`;
    if (lang === 'hi') return `अक्षर संयोजन ${bigramList} में कठिनाई आ रही है। प्रवाह बेहतर बनाने के लिए इन संयोजनों का अभ्यास करें।`;
    return `Letter combinations ${bigramList} are tripping you up. Practice these transitions to improve your flow.`;
  }

  if (hesitationKeys.length > 0) {
    const keyList = hesitationKeys.slice(0, 3).map((k) => k.key.toUpperCase()).join(', ');
    if (lang === 'es') return `Dudas antes de presionar [${keyList}]. Los ejercicios de memoria muscular para estas teclas te ayudarán a ganar confianza.`;
    if (lang === 'ja') return `キー [${keyList}] を押す前にためらいが見られます。筋肉記憶ドリルで自信をつけましょう。`;
    if (lang === 'fr') return `Vous hésitez avant d'appuyer sur [${keyList}]. Des exercices de mémoire musculaire pour ces touches vous aideront à gagner en confiance.`;
    if (lang === 'de') return `Du zögerst vor dem Drücken von [${keyList}]. Muskelgedächtnis-Übungen für diese Tasten stärken deine Sicherheit.`;
    if (lang === 'pt') return `Você hesita antes de pressionar [${keyList}]. Treinos de memória muscular para essas teclas ajudarão a ganhar confiança.`;
    if (lang === 'ko') return `키 [${keyList}]를 누르기 전에 망설임이 감지됩니다. 근육 기억 연습을 통해 자신감을 키워보세요.`;
    if (lang === 'it') return `Esiti prima di premere [${keyList}]. Gli esercizi di memoria muscolare per questi tasti ti daranno sicurezza.`;
    if (lang === 'hi') return `आप [${keyList}] दबाने से पहले झिझकते हैं। इन कुंजियों के मांसपेशी स्मृति अभ्यास से आत्मविश्वास बढ़ेगा।`;
    return `You hesitate before pressing ${keyList}. Muscle memory drills for these keys will help build confidence.`;
  }

  if (hasSessions) {
    if (lang === 'es') return '¡Muy bien! No se detectaron debilidades importantes. Sigue practicando para mantener tu precisión.';
    if (lang === 'ja') return '順調です！目立った弱点は検出されませんでした。正確性を維持するために練習を続けましょう。';
    if (lang === 'fr') return 'Tout va bien ! Aucune faiblesse majeure détectée. Continuez à pratiquer pour maintenir votre précision.';
    if (lang === 'de') return 'Sieht gut aus! Keine größeren Schwachstellen erkannt. Übe weiter, um deine Genauigkeit zu halten.';
    if (lang === 'pt') return 'Tudo ótimo! Nenhum ponto fraco importante detectado. Continue praticando para manter sua precisão.';
    if (lang === 'ko') return '좋습니다! 두드러진 취약점이 발견되지 않았습니다. 정확도를 유지하기 위해 꾸준히 연습하세요.';
    if (lang === 'it') return 'Ottimo lavoro! Nessun punto debole evidente. Continua a esercitarti per mantenere la precisione.';
    if (lang === 'hi') return 'बहुत बढ़िया! कोई बड़ी कमजोरी नहीं मिली। अपनी सटीकता बनाए रखने के लिए अभ्यास जारी रखें।';
    return 'Looking good! No major weak spots detected. Keep practicing to maintain your accuracy.';
  }

  if (lang === 'es') return 'Completa algunas sesiones de mecanografía para recibir recomendaciones personalizadas.';
  if (lang === 'ja') return 'パーソナライズされたアドバイスを受けるには、いくつかのタイピングセッションを完了してください。';
  if (lang === 'fr') return 'Complétez quelques sessions de frappe pour recevoir des recommandations personnalisées.';
  if (lang === 'de') return 'Schließe einige Tipp-Sitzungen ab, um personalisierte Empfehlungen zu erhalten.';
  if (lang === 'pt') return 'Complete algumas sessões de digitação para receber recomendações personalizadas.';
  if (lang === 'ko') return '맞춤형 추천을 받으려면 몇 번의 타이핑 세션을 완료해 보세요.';
  if (lang === 'it') return 'Completa alcune sessioni di digitazione per ricevere raccomandazioni personalizzate.';
  if (lang === 'hi') return 'व्यक्तिगत सुझाव प्राप्त करने के लिए कुछ टाइपिंग सत्र पूरे करें।';
  return 'Complete a few typing sessions to receive personalized recommendations.';
}
