import type { SupportedLocale } from './ui';

export type FAQCategoryKey = 'All' | 'Multiplayer' | 'Games' | 'AI Tutor' | 'Curriculum' | 'General Typing';

export interface LocalizedFAQItem {
  id: string;
  category: Exclude<FAQCategoryKey, 'All'>;
  question: string;
  answer: string;
}

export interface FAQLocalUi {
  badge: string;
  searchPlaceholder: string;
  clear: string;
  noResults: string;
  resetFilters: string;
}

export const FAQ_CATEGORY_LABELS: Record<SupportedLocale, Record<FAQCategoryKey, string>> = {
  en: {
    All: 'All',
    Multiplayer: 'Multiplayer Races',
    Games: 'Games',
    'AI Tutor': 'AI Tutor',
    Curriculum: 'Curriculum',
    'General Typing': 'General Typing',
  },
  es: {
    All: 'Todos',
    Multiplayer: 'Carreras Multijugador',
    Games: 'Juegos',
    'AI Tutor': 'Tutor IA',
    Curriculum: 'Currículo',
    'General Typing': 'Mecanografía General',
  },
  fr: {
    All: 'Tous',
    Multiplayer: 'Courses Multijoueur',
    Games: 'Jeux',
    'AI Tutor': 'Tuteur IA',
    Curriculum: 'Programme',
    'General Typing': 'Dactylographie Générale',
  },
  de: {
    All: 'Alle',
    Multiplayer: 'Mehrspieler-Rennen',
    Games: 'Spiele',
    'AI Tutor': 'KI-Tutor',
    Curriculum: 'Lehrplan',
    'General Typing': 'Allgemeines Tippen',
  },
  pt: {
    All: 'Todos',
    Multiplayer: 'Corridas Multijogador',
    Games: 'Jogos',
    'AI Tutor': 'Tutor IA',
    Curriculum: 'Currículo',
    'General Typing': 'Digitação Geral',
  },
  it: {
    All: 'Tutti',
    Multiplayer: 'Gare Multigiocatore',
    Games: 'Giochi',
    'AI Tutor': 'Tutor IA',
    Curriculum: 'Percorso',
    'General Typing': 'Dattilografia Generale',
  },
  ja: {
    All: 'すべて',
    Multiplayer: 'マルチプレイヤーレース',
    Games: 'ゲーム',
    'AI Tutor': 'AIチューター',
    Curriculum: 'カリキュラム',
    'General Typing': 'タイピング全般',
  },
  ko: {
    All: '전체',
    Multiplayer: '멀티플레이어 레이스',
    Games: '게임',
    'AI Tutor': 'AI 튜터',
    Curriculum: '커리큘럼',
    'General Typing': '일반 타자',
  },
  hi: {
    All: 'सभी',
    Multiplayer: 'मल्टीप्लेयर रेस',
    Games: 'गेम्स',
    'AI Tutor': 'AI ट्यूटर',
    Curriculum: 'पाठ्यक्रम',
    'General Typing': 'सामान्य टाइपिंग',
  },
};

export const FAQ_UI_LABELS: Record<SupportedLocale, FAQLocalUi> = {
  en: {
    badge: 'Answers & Knowledge Base',
    searchPlaceholder: "Search questions (e.g., 'WPM', 'Lilypad', 'Heatmap')...",
    clear: 'Clear',
    noResults: 'No questions found matching "{query}".',
    resetFilters: 'Reset filters',
  },
  es: {
    badge: 'Respuestas y Base de Conocimiento',
    searchPlaceholder: "Buscar preguntas (ej. 'PPM', 'Lilypad', 'Mapa de calor')...",
    clear: 'Borrar',
    noResults: 'No se encontraron preguntas que coincidan con "{query}".',
    resetFilters: 'Restablecer filtros',
  },
  fr: {
    badge: 'Réponses & Base de Connaissances',
    searchPlaceholder: "Rechercher des questions (ex. 'MPM', 'Lilypad', 'Carte thermique')...",
    clear: 'Effacer',
    noResults: 'Aucune question trouvée pour "{query}".',
    resetFilters: 'Réinitialiser les filtres',
  },
  de: {
    badge: 'Antworten & Wissensdatenbank',
    searchPlaceholder: "Fragen durchsuchen (z. B. 'WPM', 'Lilypad', 'Heatmap')...",
    clear: 'Löschen',
    noResults: 'Keine Fragen gefunden für "{query}".',
    resetFilters: 'Filter zurücksetzen',
  },
  pt: {
    badge: 'Respostas e Base de Conhecimento',
    searchPlaceholder: "Buscar perguntas (ex.: 'PPM', 'Lilypad', 'Mapa de calor')...",
    clear: 'Limpar',
    noResults: 'Nenhuma pergunta encontrada para "{query}".',
    resetFilters: 'Redefinir filtros',
  },
  it: {
    badge: 'Risposte & Guida Pratica',
    searchPlaceholder: "Cerca domande (es. 'PPM', 'Lilypad', 'Mappa termica')...",
    clear: 'Cancella',
    noResults: 'Nessuna domanda trovata per "{query}".',
    resetFilters: 'Reimposta filtri',
  },
  ja: {
    badge: '回答とナレッジベース',
    searchPlaceholder: "質問を検索 (例: 'WPM', 'Lilypad', 'ヒートマップ')...",
    clear: 'クリア',
    noResults: '"{query}" に一致する質問は見つかりませんでした。',
    resetFilters: 'フィルターをリセット',
  },
  ko: {
    badge: '답변 및 지식 베이스',
    searchPlaceholder: "질문 검색 (예: '타수/WPM', 'Lilypad', '히트맵')...",
    clear: '지우기',
    noResults: '"{query}" 와(과) 일치하는 질문을 찾을 수 없습니다.',
    resetFilters: '필터 초기화',
  },
  hi: {
    badge: 'उत्तर और ज्ञान केंद्र',
    searchPlaceholder: "प्रश्न खोजें (उदा. 'WPM', 'Lilypad', 'हीटमैप')...",
    clear: 'हटाएं',
    noResults: '"{query}" से मेल खाता कोई प्रश्न नहीं मिला।',
    resetFilters: 'फ़िल्टर रीसेट करें',
  },
};

export const FAQ_DATA_BY_LANG: Record<SupportedLocale, LocalizedFAQItem[]> = {
  en: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'What is TypingBull?',
      answer:
        'TypingBull is an interactive, multi-tier typing platform built for all ages. It combines structured learning paths like The Great Typing Railway, gamified arcade modes like Lilypad Leap and Neon Velocity, and an intelligent AI coach (BullBot) with real-time keystroke analytics.',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "How does 'The Great Typing Railway' curriculum work?",
      answer:
        'The Great Typing Railway is our structured curriculum map. It guides learners step-by-step from fundamental Home Row finger placement up through Top Row reaches, Bottom Row navigation, shift keys, numbers, and advanced fluency.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "What is 'Lilypad Leap' and who is it designed for?",
      answer:
        'Lilypad Leap is a beginner-friendly typing game designed for kids and early learners. Players type words to guide an animated frog across lilypads with realistic jump physics, peaceful ambient water audio, and progressive vocabulary.',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "What is 'Neon Velocity' mode?",
      answer:
        'Neon Velocity is an intermediate-to-advanced arcade speed-run mode featuring a retro synthwave aesthetic. Players defend their shield against descending words across multiple highway lanes, building combo multipliers (x1, x2, x4, x8) and testing burst typing cadence.',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'How does the AI Typing Tutor (BullBot) diagnose my weaknesses?',
      answer:
        "BullBot analyzes your keystroke error map, typing cadence, and stamina drops in real time. It identifies specific finger reach mistakes (such as confusing 'E' and 'R' or struggling with pinky keys) and recommends targeted replay lessons.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'What is the Weak-Key Heatmap?',
      answer:
        'The Weak-Key Heatmap is an interactive visual keyboard in your profile and AI report that highlights your most frequently missed keys in amber and red, showing you exactly where muscle memory breaks down.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'Why do practice levels restart if the countdown timer hits zero?',
      answer:
        'The Practice Arena uses dynamic countdown timers scaled to passage length. The strict restart penalty trains stamina and accuracy under time pressure, simulating real-world exams and professional writing demands.',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'Does TypingBull offer code and developer syntax practice?',
      answer:
        'Yes. Beyond essays and fables, TypingBull includes specialized developer modules drilling syntax, brackets, semicolons, camelCase variables, and keywords across languages like C++, Python, JavaScript, and SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'Does TypingBull support different international keyboard layouts?',
      answer:
        'Yes. In addition to standard US QWERTY, TypingBull supports regional keyboard layouts including French AZERTY, German QWERTZ, and Indian typing layouts (such as InScript and Remington) with dynamic on-screen key remapping.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'Can I customize the game audio and background sound effects?',
      answer:
        'Yes. TypingBull features realistic ambient audio—including peaceful water soundscapes in nature levels and synthwave soundscapes in arcade modes—with full mute toggles in the header.',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'How is WPM (Words Per Minute) calculated?',
      answer:
        'Standard WPM is calculated by taking total characters typed divided by 5, then dividing by elapsed minutes. Net WPM subtracts uncorrected errors to reflect true typing productivity.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'What is a good typing speed benchmark?',
      answer:
        'Average typing speed is approximately 40 WPM. Professional targets range between 55 and 70 WPM, while competitive typists and software engineers often achieve 80 to 110+ WPM with over 98% accuracy.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'How does touch typing work?',
      answer:
        'Touch typing relies on spatial muscle memory without looking down at the keyboard. Fingers anchor on the home row (ASDF and JKL;) with tactile bumps on F and J guiding hand repositioning.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'How much daily practice is recommended to build speed?',
      answer:
        'Consistent daily sessions of 15 to 20 minutes produce better muscle memory and lower fatigue than infrequent, marathon practice sessions.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'Is TypingBull free to use?',
      answer:
        'Yes. All curriculum levels, arcade game modes, custom practice arenas, and AI performance reports are completely free to access.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'How does real-time multiplayer racing work in Practice Ground?',
      answer:
        'Practice Ground lets you compete in head-to-head typing races on a visual live speedway. All racers receive the exact same passage and start simultaneously following a synchronized 3-2-1 countdown. As you type, real-time progress bars show your speed and lane position relative to rivals, ending with an instant podium and stats report.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'What is Quick Match and how do challenger bots work?',
      answer:
        'Quick Match instantly pairs you with online typists. If no human opponent is queuing within a few seconds, an arena challenger bot (such as CyberBull, SpeedyFalcon, or NeonCheetah) automatically joins the race with natural human-like typing cadence and variable WPM, ensuring you never wait around in empty lobbies.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'Can I create private rooms to race against friends or classmates?',
      answer:
        'Yes! You can create custom private rooms with a unique 5-letter room code. Room hosts can customize max player capacity and race duration, invite friends via direct link or code, ready up together in the pre-race lobby, and launch custom multiplayer tournaments.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'How does TypingBull prevent cheating and ensure fair race rankings?',
      answer:
        'Our dedicated multiplayer server validates keystrokes, character timestamps, and completion rates authoritatively. Anti-paste protection prevents copy-paste exploits, and speeds are calculated using canonical Net WPM formulas, ensuring completely fair leaderboards and certified personal bests.',
    },
  ],

  es: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: '¿Qué es TypingBull?',
      answer:
        'TypingBull es una plataforma interactiva de mecanografía diseñada para todas las edades. Combina planes de aprendizaje estructurados como The Great Typing Railway, modos arcade gamificados como Lilypad Leap y Neon Velocity, y un tutor inteligente con IA (BullBot) con análisis de pulsaciones en tiempo real.',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "¿Cómo funciona el plan 'The Great Typing Railway'?",
      answer:
        'The Great Typing Railway es nuestro mapa curricular estructurado. Guía a los estudiantes paso a paso desde la colocación básica de dedos en la Fila Guía (Home Row) hasta la fila superior, la inferior, teclas Shift, números y fluidez avanzada.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "¿Qué es 'Lilypad Leap' y para quién está diseñado?",
      answer:
        'Lilypad Leap es un juego de mecanografía ideal para principiantes y niños. Los jugadores escriben palabras para guiar a una rana animada saltando nenúfares con física realista, sonidos acuáticos relajantes y vocabulario progresivo.',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "¿Qué es el modo 'Neon Velocity'?",
      answer:
        'Neon Velocity es un modo arcade de velocidad media y avanzada con estética retro synthwave. Los jugadores protegen su escudo frente a palabras que caen en múltiples carriles, acumulando multiplicadores de combo (x1, x2, x4, x8) y afinando el ritmo.',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: '¿Cómo diagnostica mis debilidades el Tutor IA (BullBot)?',
      answer:
        "BullBot evalúa tu mapa de errores, ritmo de tecleo y caídas de resistencia en tiempo real. Detecta fallos de alcance con los dedos (como confundir 'E' y 'R' o dificultad con el meñique) y recomienda lecciones específicas de repaso.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: '¿Qué es el Mapa de Calor de Teclas Débiles?',
      answer:
        'Es un teclado visual interactivo disponible en tu perfil e informe de IA que destaca en ámbar y rojo las teclas con más errores, señalando dónde falla tu memoria muscular.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: '¿Por qué se reinician los niveles si la cuenta atrás llega a cero?',
      answer:
        'La Arena de Práctica utiliza temporizadores dinámicos según la longitud del texto. Esta penalización entrena la resistencia y la precisión bajo presión, simulando pruebas y exigencias laborales reales.',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: '¿TypingBull ofrece práctica de código y sintaxis para programadores?',
      answer:
        'Sí. Además de ensayos y textos clásicos, TypingBull cuenta con módulos para desarrolladores que entrenan sintaxis, llaves, punto y coma, variables camelCase y palabras clave en C++, Python, JavaScript y SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: '¿TypingBull es compatible con diferentes distribuciones de teclado internacionales?',
      answer:
        'Sí. Además de US QWERTY estándar, TypingBull admite distribuciones como AZERTY francés, QWERTZ alemán y teclados de la India (como InScript y Remington) con remapeo dinámico en pantalla.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: '¿Puedo personalizar el audio y los efectos de sonido de los juegos?',
      answer:
        'Sí. TypingBull incluye paisajes sonoros realistas —desde agua relajante en niveles naturales hasta synthwave en modos arcade— con controles de silencio en la cabecera.',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: '¿Cómo se calcula el PPM (Palabras Por Minuto / WPM)?',
      answer:
        'El cálculo estándar de PPM toma los caracteres totales tecleados divididos por 5, y luego por los minutos transcurridos. El PPM neto descuenta los errores no corregidos para reflejar tu productividad real.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: '¿Cuál es una buena velocidad de mecanografía de referencia?',
      answer:
        'La media se sitúa en torno a 40 PPM. El objetivo profesional ronda entre 55 y 70 PPM, mientras que mecanógrafos de competición e ingenieros suelen alcanzar entre 80 y 110+ PPM con más del 98% de precisión.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: '¿Cómo funciona la mecanografía al tacto (touch typing)?',
      answer:
        'La mecanografía al tacto se basa en la memoria muscular espacial sin mirar el teclado. Los dedos reposan en la fila guía (ASDF y JKLÑ) y las marcas táctiles en F y J orientan las manos.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: '¿Cuánto tiempo de práctica diaria se recomienda para ganar velocidad?',
      answer:
        'Sesiones constantes de 15 a 20 minutos diarios desarrollan una memoria muscular superior y menor fatiga que sesiones esporádicas y maratonianas.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: '¿TypingBull es gratis?',
      answer:
        'Sí. Todos los niveles curriculares, modos de juego arcade, arenas de práctica personalizadas e informes de IA son 100% gratuitos.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: '¿Cómo funcionan las carreras multijugador en tiempo real en Practice Ground?',
      answer:
        'Practice Ground te permite competir en carreras de mecanografía en vivo en una pista de velocidad interactiva. Todos los corredores reciben el mismo texto y arrancan simultáneamente tras una cuenta regresiva 3-2-1. Las barras de progreso muestran tu posición y PPM en tiempo real frente a tus rivales hasta el podio final.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: '¿Qué es Partida Rápida y cómo funcionan los bots retadores?',
      answer:
        'Partida Rápida (Quick Match) te empareja al instante con mecanógrafos en línea. Si no hay rivales humanos en cola tras unos segundos, un bot retador de la arena (como CyberBull o SpeedyFalcon) se une automáticamente con cadencia de escritura realista para que nunca te quedes esperando.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: '¿Puedo crear salas privadas para competir con amigos o compañeros de clase?',
      answer:
        '¡Sí! Puedes crear salas privadas personalizadas con un código de 5 letras. El anfitrión puede configurar el límite de jugadores y la duración, compartir el enlace con amigos, prepararse en la sala de espera y disputar torneos privados.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: '¿Cómo evita TypingBull las trampas en las carreras multijugador?',
      answer:
        'Nuestro servidor multijugador valida cada pulsación, marcas de tiempo y ritmo de escritura de forma autoritativa. El sistema bloquea acciones de copiar y pegar y calcula la velocidad neta real en PPM para garantizar clasificaciones 100% justas y limpias.',
    },
  ],

  fr: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: "Qu'est-ce que TypingBull ?",
      answer:
        "TypingBull est une plateforme interactive d'apprentissage du clavier pour tous les âges. Elle associe un parcours structuré (The Great Typing Railway), des jeux d'arcade captivants comme Lilypad Leap et Neon Velocity, et un tuteur intelligent par IA (BullBot) avec analyse de frappe en temps réel.",
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "Comment fonctionne le programme 'The Great Typing Railway' ?",
      answer:
        "The Great Typing Railway est notre cursus progressif. Il guide l'apprenant étape par étape depuis le placement de base sur la rangée de repos jusqu'aux rangées supérieure et inférieure, touches Majuscule, chiffres et perfectionnement de la vitesse.",
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "Qu'est-ce que 'Lilypad Leap' et à qui s'adresse-t-il ?",
      answer:
        "Lilypad Leap est un jeu de dactylographie parfait pour les débutants et les enfants. Vous tapez des mots pour faire sauter une grenouille d'un nénuphar à l'autre avec une physique réaliste, une ambiance aquatique apaisante et un vocabulaire progressif.",
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "En quoi consiste le mode 'Neon Velocity' ?",
      answer:
        "Neon Velocity est un mode de vitesse arcade intermédiaire et avancé à l'ambiance rétro synthwave. Défendez votre bouclier contre les mots défilant sur plusieurs voies tout en accumulant des multiplicateurs de combo (x1, x2, x4, x8).",
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: "Comment le tuteur IA (BullBot) diagnostique-t-il mes faiblesses ?",
      answer:
        "BullBot analyse en temps réel vos erreurs de touches, votre régularité et vos baisses d'endurance. Il repère les confusions de doigts spécifiques et vous propose des leçons de révision ciblées.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'Qu’est-ce que la carte thermique des touches faibles ?',
      answer:
        "C'est un clavier visuel interactif dans votre profil et votre rapport IA qui surligne en orange et en rouge les touches les plus fréquemment manquées, révélant où votre mémoire musculaire hésite.",
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'Pourquoi les exercices redémarrent-ils si le compte à rebours expire ?',
      answer:
        "L'arène d'entraînement intègre des chronomètres calibrés sur la longueur du texte. Cette exigence développe la maîtrise et la précision sous pression, comme lors d'examens ou de concours officiels.",
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'TypingBull propose-t-il des exercices de code pour développeurs ?',
      answer:
        'Oui. Au-delà des textes littéraires, TypingBull comprend des modules dédiés aux développeurs ciblant la syntaxe, les accolades, points-virgules, camelCase et mots-clés en C++, Python, JavaScript et SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'TypingBull supporte-t-il les claviers internationaux (AZERTY, QWERTZ) ?',
      answer:
        "Oui. Outre le QWERTY américain, TypingBull prend en charge l'AZERTY français, le QWERTZ allemand ainsi que des dispositions indiennes avec réagencement visuel dynamique à l'écran.",
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'Puis-je régler le son et la musique des jeux ?',
      answer:
        "Absolument. TypingBull propose des ambiances sonores soignées (sons d'eau apaisants ou rythmes synthwave rétro) avec un bouton de coupure du son accessible directement dans l'en-tête.",
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'Comment sont calculés les MPM (Mots Par Minute / WPM) ?',
      answer:
        'Le calcul standard divise le nombre total de caractères saisis par 5, puis par le temps en minutes. Le MPM net déduit les fautes non corrigées pour refléter la vitesse productive réelle.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'Quelle est une bonne vitesse de frappe de référence ?',
      answer:
        'La moyenne se situe autour de 40 MPM. Un bon niveau professionnel atteint 55 à 70 MPM, tandis que les dactylographes experts et ingénieurs atteignent souvent 80 à 110+ MPM avec plus de 98% de précision.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'Comment fonctionne la frappe à dix doigts à l’aveugle ?',
      answer:
        'La dactylographie à dix doigts repose sur la mémoire musculaire sans regarder ses touches. Les doigts restent positionnés sur la rangée de repos (QSDF et JKLM) avec les repères tactiles sur F et J.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'Combien de temps faut-il pratiquer chaque jour pour progresser ?',
      answer:
        'Une pratique quotidienne régulière de 15 à 20 minutes est nettement plus efficace pour la mémoire motrice et moins fatigante que de longues sessions occasionnelles.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'TypingBull est-il gratuit ?',
      answer:
        "Oui. Tous les cours du cursus, les jeux d'arcade, l'arène de pratique et les rapports d'analyse IA sont 100% gratuits.",
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Comment fonctionnent les courses multijoueur en direct sur Practice Ground ?',
      answer:
        "Practice Ground vous permet de participer à des duels de frappe en temps réel sur un circuit visuel interactif. Tous les pilotes reçoivent le même extrait et partent ensemble après un compte à rebours 3-2-1. Votre progression et vos MPM sont affichés en direct face à vos adversaires jusqu'au podium final.",
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: "Qu'est-ce que la Partie Rapide et comment fonctionnent les bots arène ?",
      answer:
        "La Partie Rapide vous connecte instantanément à des adversaires en ligne. Si aucun joueur n'est disponible après quelques secondes, un bot challenger (comme CyberBull ou SpeedyFalcon) rejoint automatiquement la course avec une cadence de frappe humaine réaliste pour éviter toute attente.",
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'Puis-je créer des salons privés pour défier mes amis ou mes camarades ?',
      answer:
        "Oui ! Vous pouvez créer des salons privés avec un code à 5 lettres. L'hôte peut configurer le nombre de participants et la durée, inviter des amis via un lien direct, se préparer dans le salon d'attente et lancer des tournois personnalisés.",
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: "Comment TypingBull garantit-il l'équité et empêche-t-il la triche en course ?",
      answer:
        "Notre serveur multijoueur dédié certifie chaque frappe et horodatage de manière autoritaire. La protection anti-collage empêche la triche et les calculs de MPM nets garantissent des classements rigoureusement fiables et authentiques.",
    },
  ],

  de: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'Was ist TypingBull?',
      answer:
        'TypingBull ist eine interaktive Tipp-Lernplattform für alle Altersgruppen. Sie kombiniert strukturierte Lernpfade (The Great Typing Railway), Arcade-Spiele wie Lilypad Leap und Neon Velocity sowie einen intelligenten KI-Tutor (BullBot) mit Echtzeit-Tastaturanalysen.',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "Wie funktioniert der Lehrplan 'The Great Typing Railway'?",
      answer:
        'The Great Typing Railway ist unsere modulare Lernreise. Sie führt Schritt für Schritt von der Grundstellung der Finger (Heimatzeile) über die Ober- und Unterreihe bis hin zu Umschalttasten, Ziffern und maximaler Geschwindigkeit.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "Was ist 'Lilypad Leap' und für wen ist es gedacht?",
      answer:
        'Lilypad Leap ist ein kinderfreundliches Tippspiel für Einsteiger. Spieler tippen Wörter, um einen animierten Frosch über Seerosenblätter hüpfen zu lassen – inklusive realistischer Physik, beruhigenden Naturklängen und steigendem Wortschatz.',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "Was ist der 'Neon Velocity'-Modus?",
      answer:
        'Neon Velocity ist ein rasanter Arcade-Modus für Fortgeschrittene im Synthwave-Retro-Look. Schütze dein Schild vor herabgleitenden Wörtern auf mehreren Spuren, baue Multiplikatoren (x1, x2, x4, x8) auf und teste deinen Tipp-Rhythmus.',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'Wie analysiert der KI-Tutor (BullBot) meine Schwächen?',
      answer:
        "BullBot überwacht Tastenfehler, Taktung und Ausdauer in Echtzeit. Er erkennt systematische Greiffehler (wie das Verwechseln von 'E' und 'R' oder Unsicherheiten beim kleinen Finger) und empfiehlt gezielte Übungslektionen.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'Was ist die Schwachstellen-Heatmap?',
      answer:
        'Die Heatmap ist eine interaktive Tastaturansicht in deinem Profil und KI-Report. Sie hebt häufig verfehlte Tasten in Orange und Rot hervor und zeigt exakt, wo das Muskelgedächtnis noch trainiert werden muss.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'Warum starten Übungen neu, wenn der Countdown abläuft?',
      answer:
        'In der Übungs-Arena passen sich Countdown-Timer der Textlänge an. Der Neustart trainiert Konzentration und Präzision unter Zeitdruck – ideal für Prüfungen und professionelle Arbeitsanforderungen.',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'Bietet TypingBull auch Code- und Programmierübungen an?',
      answer:
        'Ja. Neben klassischen Texten enthält TypingBull spezialisierte Entwicklermodule für Syntax, Klammern, Semikolons, camelCase und Schlüsselwörter in Sprachen wie C++, Python, JavaScript und SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'Unterstützt TypingBull verschiedene internationale Tastaturlayouts?',
      answer:
        'Ja. Neben dem US-QWERTY-Layout unterstützt TypingBull deutsches QWERTZ, französisches AZERTY und indische Tastaturlayouts mit dynamischer Bildschirm-Tastenbelegung.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'Kann ich Spiel-Audio und Soundeffekte anpassen?',
      answer:
        'Ja. TypingBull bietet atmosphärische Klangwelten – von entspannenden Wasserklängen bis hin zu packendem Synthwave-Sound – mit Stummschaltfunktion direkt in der Kopfzeile.',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'Wie werden WPM (Wörter pro Minute) berechnet?',
      answer:
        'Standard-WPM wird berechnet, indem die Gesamtanzahl der getippten Zeichen durch 5 und dann durch die verstrichenen Minuten geteilt wird. Netto-WPM zieht unkorrigierte Fehler ab.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'Was gilt als gute Tippgeschwindigkeit?',
      answer:
        'Der Durchschnitt liegt bei etwa 40 WPM. Gute Bürokräfte erreichen 55 bis 70 WPM, während erfahrene Programmierer und Schnellschreiber 80 bis 110+ WPM bei über 98 % Genauigkeit schaffen.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'Wie funktioniert das Zehnfingersystem (Touch Typing)?',
      answer:
        'Das Zehnfingersystem basiert auf reinem Muskelgedächtnis ohne Blickkontakt zur Tastatur. Die Hände verankern sich auf der Grundreihe (ASDF und JKLÖ); Erhebungen auf F und J erleichtern die Orientierung.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'Wie viel tägliche Übungszeit ist für messbaren Fortschritt optimal?',
      answer:
        'Regelmäßige tägliche Einheiten von 15 bis 20 Minuten erzielen nachhaltigere Lernerfolge und geringere Ermüdung als seltene Marathon-Sitzungen.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'Ist TypingBull kostenlos nutzbar?',
      answer:
        'Ja. Sämtliche Lehrplanstufen, Spiele, Übungs-Arenen und KI-Analysen stehen dauerhaft kostenlos zur Verfügung.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Wie funktionieren die Echtzeit-Mehrspieler-Rennen im Practice Ground?',
      answer:
        'Im Practice Ground treten Sie in Live-Tippwettrennen auf einer dynamischen Rennstrecke gegeneinander an. Alle Teilnehmer tippen denselben Text und starten zeitgleich nach einem 3-2-1-Countdown. Fortschrittsbalken und WPM-Werte zeigen Ihre Position live bis zum Siegerpodest.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'Was ist das Schnelle Spiel und wie funktionieren die Arena-Bots?',
      answer:
        'Das Schnelle Spiel verbindet Sie sofort mit Online-Tippern. Sollte nach wenigen Sekunden kein menschlicher Gegner in der Warteschlange sein, tritt automatisch ein Arena-Challenger-Bot (z. B. CyberBull oder SpeedyFalcon) mit natürlicher Tippkadenz bei, sodass Sie nie warten müssen.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'Kann ich private Räume erstellen, um gegen Freunde oder Mitschüler anzutreten?',
      answer:
        'Ja! Erstellen Sie individuelle Privaträume mit einem 5-stelligen Raumcode. Der Host kann Teilnehmerlimits und Rundenzeiten anpassen, Freunde per Link einladen und private Tippturniere starten.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'Wie verhindert TypingBull Betrug und manipuliertes Tippen?',
      answer:
        'Unser dedizierter Mehrspieler-Server validiert alle Tastenanschläge und Zeitstempel serverseitig. Einfügeschutz verhindert Copy-Paste-Tricks und die Netto-WPM-Berechnung sichert faire und verlässliche Ranglisten.',
    },
  ],

  pt: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'O que é o TypingBull?',
      answer:
        'O TypingBull é uma plataforma interativa de digitação projetada para todas as idades. Ele combina currículo estruturado (The Great Typing Railway), modos arcade como Lilypad Leap e Neon Velocity e um instrutor com IA (BullBot) com telemetria de digitação em tempo real.',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "Como funciona o currículo 'The Great Typing Railway'?",
      answer:
        'The Great Typing Railway é nosso mapa de aprendizado. Ele guia o aluno passo a passo da Linha Base (Home Row) até as linhas superior e inferior, teclas Shift, números e velocidade avançada.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "O que é o 'Lilypad Leap' e para quem é indicado?",
      answer:
        'Lilypad Leap é um jogo de digitação ideal para iniciantes e crianças. Os jogadores digitam palavras para guiar um sapinho animado saltando sobre vitórias-régias com física suave, sons relaxantes e vocabulário progressivo.',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "Como funciona o modo 'Neon Velocity'?",
      answer:
        'Neon Velocity é um jogo de velocidade arcade intermediário e avançado no estilo synthwave retrô. Proteja seu escudo contra palavras caindo em várias pistas e alcance multiplicadores de combo (x1, x2, x4, x8).',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'Como o Tutor com IA (BullBot) diagnostica minhas dificuldades?',
      answer:
        "O BullBot analisa seus erros de digitação, ritmo e perda de consistência em tempo real. Ele detecta confusões de dedos (como trocar 'E' por 'R') e prescreve lições de reforço sob medida.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'O que é o Mapa de Calor de Teclas Fracas?',
      answer:
        'É um teclado visual interativo no seu perfil e relatório de IA que destaca em tons de âmbar e vermelho as teclas com maior incidência de erro, mostrando onde a memória muscular hesita.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'Por que os níveis reiniciam quando o cronômetro zera?',
      answer:
        'A Arena de Prática usa contagem regressiva proporcional ao tamanho do texto. Essa penalidade treina foco e precisão sob pressão de tempo, simulando provas e exigências profissionais.',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'O TypingBull tem módulos de digitação de código para programadores?',
      answer:
        'Sim. Além de textos comuns, o TypingBull traz treinos específicos para desenvolvedores com sintaxe, colchetes, ponto e vírgula, nomes camelCase e comandos em C++, Python, JavaScript e SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'O TypingBull suporta layouts de teclado internacionais?',
      answer:
        'Sim. Além do padrão US QWERTY e ABNT, suporta AZERTY francês, QWERTZ alemão e teclados indianos com remapeamento dinâmico visual na tela.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'Posso configurar os efeitos sonoros e músicas dos jogos?',
      answer:
        'Sim. O TypingBull conta com trilhas sonoras imersivas (sons relaxantes de água ou batidas synthwave arcade) com botão rápido de silenciamento no cabeçalho.',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'Como o PPM (Palavras Por Minuto / WPM) é calculado?',
      answer:
        'A métrica padrão calcula o total de caracteres digitados dividido por 5 e depois pelo tempo em minutos. O PPM líquido desconta erros não corrigidos para medir a produtividade real.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'Qual é uma boa velocidade de digitação de referência?',
      answer:
        'A média geral fica em torno de 40 PPM. Profissionais costumam alcançar entre 55 e 70 PPM, enquanto especialistas e desenvolvedores rápidos chegam a 80–110+ PPM com mais de 98% de precisão.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'Como funciona a digitação às cegas (Touch Typing)?',
      answer:
        'A digitação às cegas baseia-se na memória muscular sem olhar para o teclado. Os dedos ficam ancorados na linha base (ASDF e JKLÇ), usando as marcas táteis no F e J para manter a orientação.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'Quanto tempo diário de treino é ideal para ganhar velocidade?',
      answer:
        'Treinar de 15 a 20 minutos todos os dias constrói reflexos motores mais fortes e reduz a fadiga em comparação com sessões longas e esporádicas.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'O TypingBull é totalmente gratuito?',
      answer:
        'Sim. Todas as fases do currículo, jogos, arenas de treino e diagnósticos com IA são totalmente gratuitos.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Como funcionam as corridas multijogador em tempo real no Practice Ground?',
      answer:
        'As corridas multijogador colocam você contra outros digitadores em uma pista dinâmica ao vivo. Todos os participantes digitam o mesmo trecho simultaneamente após uma contagem 3-2-1. Barras de progresso e velocímetro WPM em tempo real mostram sua posição até o pódio.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'O que é a Partida Rápida e como funcionam os bots desafiantes?',
      answer:
        'A Partida Rápida conecta você imediatamente com corredores online. Se não houver concorrentes humanos na fila em poucos segundos, um bot desafiante da arena (como CyberBull ou SpeedyFalcon) entra na corrida com ritmo humano natural para que você nunca fique esperando.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'Posso criar salas privadas para correr contra amigos ou colegas de turma?',
      answer:
        'Sim! Crie salas privadas personalizadas com um código de sala de 5 dígitos. O anfitrião pode configurar o limite de jogadores, tempo de partida, convidar amigos com link direto e organizar torneios de digitação.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'Como o TypingBull garante corridas justas e sem trapaças?',
      answer:
        'Nosso servidor multijogador dedicado valida todas as teclas digitadas e carimbos de data/hora no lado do servidor. O bloqueio contra colagem impede cópias e a métrica de WPM líquido garante pontuações justas e confiáveis nas tabelas de classificação.',
    },
  ],

  it: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: "Che cos'è TypingBull?",
      answer:
        "TypingBull è una piattaforma interattiva di dattilografia progettata per tutte le età. Unisce percorsi didattici strutturati (The Great Typing Railway), giochi arcade coinvolgenti come Lilypad Leap e Neon Velocity, e un tutor intelligente con IA (BullBot) con analisi della digitazione in tempo reale.",
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "Come funziona il percorso 'The Great Typing Railway'?",
      answer:
        'The Great Typing Railway è il nostro piano di studi guidato. Accompagna lo studente passo dopo passo dalla posizione base delle dita (riga centrale) fino alle righe superiore e inferiore, tasti Maiusc, numeri e fluidità professionale.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "Cos'è 'Lilypad Leap' e a chi è dedicato?",
      answer:
        "Lilypad Leap è un gioco di digitazione per principianti e ragazzi. Si digitano parole per far saltare una simpatica rana sulle ninfee, con fisica realistica, suoni d'acqua rilassanti e vocabolario progressivo.",
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "Come funziona la modalità 'Neon Velocity'?",
      answer:
        'Neon Velocity è una modalità arcade di velocità con estetica retro synthwave. Difendi il tuo scudo digitando parole in arrivo su più corsie, accumulando moltiplicatori combo (x1, x2, x4, x8).',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'Come individua le mie debolezze il Tutor IA (BullBot)?',
      answer:
        "BullBot analizza errori, cadenza di battitura e cali di concentrazione in tempo reale. Rileva imprecisioni specifiche di allungamento delle dita (come scambiare 'E' con 'R') e suggerisce sessioni mirate.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'Che cos’è la Mappa Termica dei Tasti Deboli?',
      answer:
        'È una tastiera visiva interattiva nel profilo e report IA che evidenzia in arancione e rosso i tasti più spesso sbagliati, mostrando dove la memoria muscolare ha bisogno di rinforzo.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'Perché gli esercizi si riavviano se il timer scade?',
      answer:
        "L'Arena di Esercitazione adotta timer calibrati sulla lunghezza del brano. Questa ripartenza allena la concentrazione e la precisione sotto pressione, simulando prove ed esami di dattilografia.",
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'TypingBull include esercizi di codice e sintassi per sviluppatori?',
      answer:
        'Sì. Oltre a testi letterari, TypingBull include moduli per programmatori incentrati su sintassi, parentesi graffe, punti e virgola, variabili camelCase e comandi in C++, Python, JavaScript e SQL.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'TypingBull supporta layout di tastiera internazionali?',
      answer:
        'Sì. Oltre al layout US QWERTY standard, TypingBull supporta tastiere AZERTY francesi, QWERTZ tedesche e layout indiani con rimappatura visiva automatica a schermo.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'È possibile personalizzare audio e suoni di sottofondo?',
      answer:
        "Sì. TypingBull offre soundscape realistici (dall'acqua rilassante nei livelli natura fino ai ritmi synthwave arcade) con pratico pulsante di muto nell'intestazione.",
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'Come vengono calcolate le PPM (Parole Per Minuto / WPM)?',
      answer:
        'Lo standard divide i caratteri digitati per 5 e poi per i minuti trascorsi. Le PPM nette sottraggono gli errori non corretti per mostrare la produttività reale.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'Qual è una buona velocità di battitura?',
      answer:
        'La media si attesta intorno a 40 PPM. Gli standard lavorativi variano tra 55 e 70 PPM, mentre dattilografi esperti e programmatori veloci superano spesso 80–110+ PPM con oltre il 98% di precisione.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'Come funziona la dattilografia cieca (Touch Typing)?',
      answer:
        'La dattilografia cieca fa leva sulla memoria muscolare senza guardare la tastiera. Le dita riposano sulla riga base (ASDF e JKL;) e i rilievi tattili su F e J aiutano il riposizionamento istantaneo.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'Quanto esercizio quotidiano è consigliato per fare progressi?',
      answer:
        'Sessioni quotidiane di 15–20 minuti sviluppano riflessi più stabili e riducono l’affaticamento rispetto a sessioni maratona saltuarie.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'TypingBull è gratuito?',
      answer:
        'Sì. Tutti i livelli didattici, i giochi, le arene di allenamento e i report IA sono completamente gratuiti.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Come funzionano le gare multigiocatore in tempo reale nel Practice Ground?',
      answer:
        'Le gare multigiocatore ti mettono alla prova contro altri dattilografi su una pista dinamica in tempo reale. Tutti i piloti digitano lo stesso brano contemporaneamente dopo un conto alla rovescia 3-2-1. Barre di avanzamento e tachimetro WPM live mostrano la tua posizione fino al podio.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'Cosa è la Partita Rapida e come funzionano i bot sfidanti?',
      answer:
        'La Partita Rapida ti collega all’istante con altri dattilografi online. Se nessun concorrente umano è in coda entro pochi secondi, un bot sfidante dell’arena (come CyberBull o SpeedyFalcon) scende in pista con ritmo naturale per non farti mai aspettare.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'Posso creare stanze private per sfidare amici o compagni di classe?',
      answer:
        'Sì! Crea stanze private personalizzate con un codice a 5 caratteri. Il creatore della stanza può impostare il numero massimo di giocatori, durata della sessione, condividere il link d’invito e organizzare gare personalizzate.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'In che modo TypingBull garantisce competizioni leali e senza trucchi?',
      answer:
        'Il nostro server multigiocatore dedicato convalida ogni pressione dei tasti e timestamp lato server. La protezione anti-incolla impedisce scorciatoie di copia-incolla e il calcolo delle WPM nette garantisce classifiche pulite e sicure.',
    },
  ],

  ja: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'TypingBullとはどのようなサービスですか？',
      answer:
        'TypingBullは、全年齢を対象とした無料のインタラクティブ・タイピング学習プラットフォームです。体系的な学習コース「The Great Typing Railway」、ゲーム感覚で遊べる「Lilypad Leap」や「Neon Velocity」、リアルタイム打鍵解析を行うインテリジェントAIコーチ（BullBot）を融合しています。',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: 'カリキュラム「The Great Typing Railway」はどのように進みますか？',
      answer:
        'ホームポジション（ASDF・JKL;）の基礎からスタートし、上段・下段キー、シフトキー、数字入力、そして長文入力のスピード養成まで、段階的にステップアップできる構造化カリキュラムです。',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: '「Lilypad Leap」はどのようなゲームで、誰向けですか？',
      answer:
        'Lilypad Leapは、子どもやタイピング初心者向けの楽しいタイピングゲームです。入力した単語に応じて可愛いカエルが蓮の葉をジャンプし、心地よい水音の環境音と段階的な語彙で楽しく基礎を学べます。',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: '「Neon Velocity」モードとはどのようなゲームですか？',
      answer:
        'レトロなシンセウェーブ音楽とビジュアルが特徴の中〜上級者向けスピードラン・アーケードモードです。複数のハイウェイレーンから迫る単語を素早くタイピングしてシールドを守り、コンボ倍率（x1、x2、x4、x8）を競います。',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'AIタイピングコーチ（BullBot）はどのように弱点を分析しますか？',
      answer:
        'BullBotは打鍵エラーの傾向、タイピングのリズム、疲労による速度低下をリアルタイムで追跡します。「EとRの混同」や「小指キーの入力遅延」など具体的な癖を特定し、最適な復習レッスンを提案します。',
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: '苦手キーヒートマップ（Weak-Key Heatmap）とは何ですか？',
      answer:
        'プロフィールやAIレポートで確認できるインタラクティブなキーボード図です。ミスタッチが多いキーがオレンジや赤のヒートマップで可視化され、筋肉の記憶が乱れやすい箇所が一目で分かります。',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: '練習レベルで制限時間がゼロになると最初からやり直すのはなぜですか？',
      answer:
        '制限時間付きのプラクティスアリーナは、文章の長さに応じたタイマーを採用しています。適度なプレッシャーの中で正確性と持久力を養うことで、実際の試験や仕事の現場で役立つ実戦的なタイピング力を育成します。',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'プログラミングやコード構文のタイピング練習はできますか？',
      answer:
        'はい。エッセイや童話だけでなく、C++、Python、JavaScript、SQLなどの記号・波括弧・セミコロン・キャメルケース変数名・予約語に特化した開発者向けモジュールを完備しています。',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: '海外や各種キーボード配列に対応していますか？',
      answer:
        '標準のUS QWERTYに加え、フランスのAZERTY、ドイツのQWERTZ、インドの各言語配列（InScriptなど）に対応しており、画面上のキー配置も自動的に切り替わります。',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'ゲーム内のサウンドやBGMは調整・ミュートできますか？',
      answer:
        'はい。穏やかな水音からシンセウェーブのアーケードサウンドまでリアルな音響を備えており、画面上部のヘッダーからいつでもワンクリックでミュート可能です。',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'WPM（Words Per Minute）はどのように算出されますか？',
      answer:
        '一般的な基準として「総入力文字数 ÷ 5 ÷ 経過分数」で計算されます。純WPM（Net WPM）は未修正のエラー数を差し引いて、真の入力生産性を反映します。',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'タイピング速度の目安はどれくらいですか？',
      answer:
        '一般的な平均速度はおよそ40 WPMです。業務で快適なレベルは55〜70 WPM、エンジニアやプロの競技タイピストは98%以上の精度を保ちながら80〜110+ WPMに達します。',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'ブラインドタッチ（タッチタイピング）のコツは何ですか？',
      answer:
        '手元を見ずに空間の筋肉記憶で入力する技術です。FとJキーにある突起を基準にホームポジション（ASDF・JKL;）に指を置き、それぞれの指の担当キーを反復練習します。',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: '上達のために推奨される1日の練習時間は？',
      answer:
        '週末にまとめて長時間練習するよりも、毎日15〜20分間集中してタイピングする方が、筋肉記憶の定着と疲労防止の面で圧倒的に効果的です。',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'TypingBullは完全に無料で利用できますか？',
      answer:
        'はい。すべての学習コース、アーケードゲームモード、カスタム練習アリーナ、AI診断レポートは完全無料でご利用いただけます。',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Practice Groundのリアルタイムマルチプレイヤーレースはどのように動作しますか？',
      answer:
        'マルチプレイヤーレースでは、リアルタイムのレーストラック上で世界中のタイピストと対戦できます。3-2-1のカウントダウン後、全員が同じ課題文を一斉に入力開始します。進行バーやライブWPMメーターで相手との差がリアルタイムに表示され、白熱したゴール争いが楽しめます。',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'クイックマッチとアリーナボットはどのような仕組みですか？',
      answer:
        'クイックマッチをクリックすると、即座にオンライン対戦キューに参加します。待機列に人間プレイヤーがいない場合でも、数秒以内に人間らしい自然な入力リズムを持つアリーナボット（CyberBullやSpeedyFalconなど）が参戦するため、待ち時間なしでいつでもレースが始められます。',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: '友達やクラスメイトと競うためのプライベートルームを作成できますか？',
      answer:
        'はい！5桁の専用ルームコードを使ってカスタムプライベートルームを作成できます。ホストは最大参加人数や制限時間を設定し、招待リンクを共有してクラスや友達同士でタイピング大会を開催できます。',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'TypingBullは不正行為の防止や公正な順位判定をどのように行っていますか？',
      answer:
        '専用のマルチプレイヤーサーバーが各キーストロークとタイムスタンプをサーバー側で厳密に検証します。貼り付け（ペースト）防止保護により不正なコピー入力を遮断し、純WPM計算によって公平で改ざんのないリーダーボードを実現しています。',
    },
  ],

  ko: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'TypingBull은 어떤 서비스인가요?',
      answer:
        'TypingBull은 전 연령대를 위한 무료 인터랙티브 타자 학습 플랫폼입니다. 체계적인 커리큘럼(The Great Typing Railway), 아케이드 게임(Lilypad Leap, Neon Velocity), 그리고 실시간 타건 분석을 제공하는 지능형 AI 코치(BullBot)를 결합했습니다.',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "'The Great Typing Railway' 커리큘럼은 어떻게 진행되나요?",
      answer:
        '기본 자리(홈 로우) 손가락 배치부터 시작하여 상단열, 하단열, 시프트 키, 숫자 키, 그리고 고급 타자 속도 숙달까지 단계별로 완주할 수 있도록 설계된 체계적인 로드맵입니다.',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "'Lilypad Leap'은 어떤 게임이며 누구에게 적합한가요?",
      answer:
        'Lilypad Leap은 타자 입문자와 어린이를 위한 타자 게임입니다. 단어를 타이핑하여 연잎 위를 뛰는 개구리를 조작하며 부드러운 수면 효과음과 단계별 어휘를 통해 재미있게 타자를 익힙니다.',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "'Neon Velocity' 모드는 무엇인가요?",
      answer:
        '레트로 신스웨이브 감성의 중·고급용 스피드런 아케이드 모드입니다. 여러 차선에서 내려오는 단어를 빠르게 타이핑하여 실드를 방어하고 콤보 배수(x1, x2, x4, x8)를 쌓아 최고 기록을 갱신합니다.',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'AI 튜터(BullBot)는 어떻게 나의 약점을 진단하나요?',
      answer:
        "BullBot은 실시간으로 오타 발생 패턴, 타건 리듬, 피로도에 따른 속도 저하를 분석합니다. 특정 손가락의 뻗음 실수('E'와 'R' 혼동이나 새끼손가락 입력 지연)를 정밀하게 찾아내어 맞춤 복습 레슨을 추천합니다.",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: '취약 키 히트맵(Weak-Key Heatmap)이란 무엇인가요?',
      answer:
        '프로필과 AI 리포트에서 확인할 수 있는 시각적 키보드 맵입니다. 자주 틀리는 키를 주황색과 빨간색으로 시각화하여 근육 기억이 불안정한 위치를 한눈에 파악할 수 있습니다.',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: '카운트다운 타이머가 0이 되면 레벨이 처음부터 다시 시작되는 이유는 무엇인가요?',
      answer:
        '연습 아레나는 텍스트 길이에 비례한 카운트다운 타이머를 적용합니다. 제한 시간 내에 완주하는 훈련을 통해 실전 시험이나 업무 환경에서 요구되는 정확성과 지구력을 키울 수 있습니다.',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: '개발자 및 코딩 문법 타자 연습도 가능한가요?',
      answer:
        '네. 일반 문장 외에도 C++, Python, JavaScript, SQL 등 주요 프로그래밍 언어의 괄호, 세미콜론, camelCase 변수명, 예약어 타이핑 전용 개발자 모듈을 제공합니다.',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: '다양한 국제 키보드 자판 배열을 지원하나요?',
      answer:
        '표준 US QWERTY 자판 외에도 프랑스 AZERTY, 독일 QWERTZ, 인도어 자판(InScript 등)을 지원하며 화면 키보드가 선택한 배열에 맞춰 동적으로 전환됩니다.',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: '게임 효과음과 배경 음악을 조절할 수 있나요?',
      answer:
        '네. 평화로운 자연 물소리부터 흥겨운 신스웨이브 사운드까지 고품질 음향을 제공하며, 상단 헤더의 음소거 토글을 통해 언제든 손쉽게 켜고 끌 수 있습니다.',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'WPM(분당 타수/단어수)은 어떻게 계산되나요?',
      answer:
        '표준 WPM은 총 입력 문자 수를 5로 나눈 뒤 경과 분으로 나누어 계산합니다. 순 WPM(Net WPM)은 미교정 오타를 차감하여 실질적인 타자 생산성을 측정합니다.',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: '좋은 타자 속도의 기준은 어느 정도인가요?',
      answer:
        '일반적인 평균 속도는 약 40 WPM입니다. 전문 사무 기준은 55~70 WPM이며, 숙련된 엔지니어나 전문 타피스트는 98% 이상의 정확도로 80~110+ WPM을 기록합니다.',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: '자리익힘(터치 타이핑)의 핵심 원리는 무엇인가요?',
      answer:
        '키보드를 보지 않고 손가락의 위치 감각과 근육 기억으로 타이핑하는 기법입니다. F와 J 키의 돌기를 기준으로 기본 자리(ASDF, JKL;)에 손을 정렬하여 연습합니다.',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: '속도 향상을 위해 권장되는 하루 연습 시간은 얼마인가요?',
      answer:
        '가끔씩 오랜 시간 연습하는 것보다 하루 15~20분씩 꾸준히 연습하는 것이 근육 기억 형성과 피로 방지 면에서 훨씬 효과적입니다.',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'TypingBull은 무료로 이용할 수 있나요?',
      answer:
        '네. 모든 학습 커리큘럼, 아케이드 게임 모드, 커스텀 연습실, AI 분석 리포트까지 100% 완전 무료입니다.',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Practice Ground의 실시간 멀티플레이어 타자 레이스는 어떻게 진행되나요?',
      answer:
        '멀티플레이어 레이스는 역동적인 스피드웨이 트랙에서 실시간으로 다른 타자들과 대결하는 모드입니다. 3-2-1 카운트다운 후 모든 참가자가 동일한 텍스트를 동시에 타이핑하기 시작하며, 실시간 진행 바와 WPM 속도계를 통해 결승선까지의 순위를 즉시 확인할 수 있습니다.',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: '빠른 매칭(Quick Match)과 아레나 봇은 어떻게 작동하나요?',
      answer:
        '빠른 매칭을 선택하면 즉시 온라인 대기열에 진입합니다. 몇 초 내에 사람 참가자가 매칭되지 않으면 인간적인 타이핑 리듬을 가진 아레나 챌린저 봇(CyberBull, SpeedyFalcon 등)이 자동 출전하여 대기 시간 없이 즉시 레이스를 즐길 수 있습니다.',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: '친구들이나 학급 동료들과 대결할 비공개 방을 만들 수 있나요?',
      answer:
        '네! 5자리 룸 코드를 발급받아 비공개 맞춤형 룸을 만들 수 있습니다. 방장은 참가 인원 수와 경기 제한 시간을 설정할 수 있으며, 초대 링크를 전송하여 친구나 학급 단위의 타자 토너먼트를 주최할 수 있습니다.',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: '부정 행위 방지와 공정한 순위 판정은 어떻게 이루어지나요?',
      answer:
        '전용 멀티플레이어 서버가 모든 키 입력 스트로크와 타임스탬프를 서버 측에서 직접 검증합니다. 텍스트 붙여넣기(Ctrl+V) 차단 시스템과 순 WPM 계산 방식을 통해 매크로 및 치팅 없는 공정하고 신뢰할 수 있는 리더보드를 보장합니다.',
    },
  ],

  hi: [
    {
      id: 'faq-1',
      category: 'Curriculum',
      question: 'TypingBull क्या है?',
      answer:
        'TypingBull सभी उम्र के शिक्षार्थियों के लिए बनाया गया एक निःशुल्क इंटरैक्टिव टाइपिंग प्लेटफॉर्म है। इसमें The Great Typing Railway जैसे संरचित पाठ्यक्रम, Lilypad Leap और Neon Velocity जैसे मजेदार आर्केड गेम्स और रीयल-टाइम टाइपिंग विश्लेषण देने वाला AI कोच (BullBot) शामिल है।',
    },
    {
      id: 'faq-2',
      category: 'Curriculum',
      question: "'The Great Typing Railway' पाठ्यक्रम कैसे काम करता है?",
      answer:
        'यह हमारा संरचित सीखने का मार्ग है। यह शिक्षार्थी को होम रो (ASDF और JKL;) की बुनियादी उंगली स्थिति से लेकर ऊपरी और निचली पंक्तियों, शिफ्ट कुंजियों, संख्याओं और उन्नत गति तक चरण-दर-चरण प्रशिक्षित करता है।',
    },
    {
      id: 'faq-3',
      category: 'Games',
      question: "'Lilypad Leap' क्या है और यह किसके लिए उपयोगी है?",
      answer:
        'Lilypad Leap शुरुआती शिक्षार्थियों और बच्चों के लिए एक आकर्षक टाइपिंग गेम है। खिलाड़ी शब्द टाइप करके एक मेंढक को लिली पैड पर छलांग लगवाते हैं, जिसमें सुखद जल ध्वनि और सरल से कठिन शब्दावली शामिल है।',
    },
    {
      id: 'faq-4',
      category: 'Games',
      question: "'Neon Velocity' मोड क्या है?",
      answer:
        'Neon Velocity मध्यम और उन्नत स्तर के टाइपिस्टों के लिए एक रेट्रो सिंथवेव आर्केड गेम है। कई लेन पर नीचे आते शब्दों को तेजी से टाइप करके ढाल की रक्षा करें और कॉम्बो मल्टीप्लायर (x1, x2, x4, x8) हासिल करें।',
    },
    {
      id: 'faq-5',
      category: 'AI Tutor',
      question: 'AI टाइपिंग ट्यूटर (BullBot) मेरी कमजोरियों की पहचान कैसे करता है?',
      answer:
        "BullBot आपकी टाइपिंग गलतियों, गति और एकाग्रता में गिरावट का रीयल-टाइम विश्लेषण करता है। यह विशेष उंगलियों की गलतियों (जैसे 'E' और 'R' में भ्रम) को पहचानकर लक्षित अभ्यास पाठों की सिफारिश करता है।",
    },
    {
      id: 'faq-6',
      category: 'AI Tutor',
      question: 'कमजोर कुंजी हीटमैप (Weak-Key Heatmap) क्या है?',
      answer:
        'यह आपकी प्रोफ़ाइल और AI रिपोर्ट में एक इंटरैक्टिव कीबोर्ड दृश्य है, जो सबसे ज्यादा गलत टाइप होने वाली कुंजियों को नारंगी और लाल रंग में दिखाता है ताकि आप समझ सकें कि सुधार कहाँ जरूरी है।',
    },
    {
      id: 'faq-7',
      category: 'Curriculum',
      question: 'समय समाप्त होने पर अभ्यास स्तर दोबारा शुरू क्यों होता है?',
      answer:
        'अभ्यास अखाड़ा पाठ की लंबाई के अनुसार टाइमर सेट करता है। यह सख्त नियम समय के दबाव में सटीकता और एकाग्रता का निर्माण करता है, जो वास्तविक परीक्षा और कार्यालय की जरूरतों के अनुकूल है।',
    },
    {
      id: 'faq-8',
      category: 'Curriculum',
      question: 'क्या TypingBull कोडिंग और डेवलपर सिंटैक्स टाइपिंग अभ्यास प्रदान करता है?',
      answer:
        'हाँ। सामान्य निबंधों के अलावा, TypingBull में C++, Python, JavaScript और SQL जैसी भाषाओं के सिंटैक्स, ब्रैकेट्स, सेमीकोलन और कीवर्ड्स पर केंद्रित विशेष कोडिंग मॉड्यूल शामिल हैं।',
    },
    {
      id: 'faq-9',
      category: 'Curriculum',
      question: 'क्या TypingBull विभिन्न अंतरराष्ट्रीय कीबोर्ड लेआउट का समर्थन करता है?',
      answer:
        'हाँ। मानक US QWERTY के साथ, TypingBull फ्रेंच AZERTY, जर्मन QWERTZ और भारतीय टाइपिंग लेआउट (जैसे InScript व Remington) का गतिशील ऑन-स्क्रीन कीबोर्ड के साथ समर्थन करता है।',
    },
    {
      id: 'faq-10',
      category: 'Games',
      question: 'क्या मैं गेम ऑडियो और ध्वनि प्रभाव को म्यूट या कस्टमाइज़ कर सकता हूँ?',
      answer:
        'हाँ। TypingBull में शांत जल तरंगों से लेकर सिंथवेव धुन तक उच्च गुणवत्ता वाला ऑडियो है, जिसे हेडर में दिए गए म्यूट बटन से आसानी से चालू या बंद किया जा सकता है।',
    },
    {
      id: 'faq-11',
      category: 'General Typing',
      question: 'WPM (शब्द प्रति मिनट) की गणना कैसे की जाती है?',
      answer:
        'मानक WPM की गणना कुल टाइप किए गए अक्षरों को 5 से विभाजित करके और फिर बीते मिनटों से विभाजित करके की जाती है। नेट WPM सच्ची उत्पादकता दर्शाने के लिए अशुद्धियों को घटाता है।',
    },
    {
      id: 'faq-12',
      category: 'General Typing',
      question: 'एक अच्छी टाइपिंग गति का बेंचमार्क क्या है?',
      answer:
        'औसत टाइपिंग गति लगभग 40 WPM होती है। पेशेवर लक्ष्य 55 से 70 WPM के बीच होता है, जबकि कुशल प्रोग्रामर और टाइपिस्ट 98% से अधिक सटीकता के साथ 80 से 110+ WPM हासिल करते हैं।',
    },
    {
      id: 'faq-13',
      category: 'General Typing',
      question: 'टच टाइपिंग (Touch Typing) कैसे काम करती है?',
      answer:
        'टच टाइपिंग बिना कीबोर्ड को देखे उंगलियों की मांसपेशी स्मृति पर निर्भर करती है। उंगलियाँ होम रो (ASDF और JKL;) पर टिकी होती हैं और F व J पर उभरे हुए निशान हाथों की सही स्थिति बनाए रखते हैं।',
    },
    {
      id: 'faq-14',
      category: 'General Typing',
      question: 'गति बढ़ाने के लिए प्रतिदिन कितना अभ्यास करने की सलाह दी जाती है?',
      answer:
        'कभी-कभार लंबे समय तक अभ्यास करने की तुलना में प्रतिदिन 15 से 20 मिनट का नियमित अभ्यास बेहतर परिणाम देता है और थकान भी कम करता है।',
    },
    {
      id: 'faq-15',
      category: 'General Typing',
      question: 'क्या TypingBull का उपयोग पूरी तरह से मुफ़्त है?',
      answer:
        'हाँ। सभी पाठ्यक्रम स्तर, आर्केड गेम मोड, अभ्यास अखाड़ा और AI प्रदर्शन रिपोर्ट 100% पूरी तरह से मुफ़्त हैं।',
    },
    {
      id: 'faq-16',
      category: 'Multiplayer',
      question: 'Practice Ground में रीयल-टाइम मल्टीप्लेयर टाइपिंग रेस कैसे काम करती है?',
      answer:
        'मल्टीप्लेयर रेस आपको लाइव स्पीडवे ट्रैक पर अन्य टाइपिस्टों के खिलाफ मुकाबला करने का मौका देती है। 3-2-1 काउंटडाउन के बाद सभी प्रतिभागी एक साथ समान पैराग्राफ टाइप करना शुरू करते हैं। रीयल-टाइम प्रोग्रेस बार और WPM स्पीडोमीटर पोडियम तक आपकी लाइव स्थिति दिखाते हैं।',
    },
    {
      id: 'faq-17',
      category: 'Multiplayer',
      question: 'त्वरित मैच (Quick Match) क्या है और चैलेंजर बॉट कैसे काम करते हैं?',
      answer:
        'त्वरित मैच आपको तुरंत ऑनलाइन खिलाड़ियों से जोड़ता है। यदि कुछ सेकंड के भीतर कोई अन्य खिलाड़ी कतार में नहीं होता है, तो स्वाभाविक मानव टाइपिंग गति वाले एरीना चैलेंजर बॉट (जैसे CyberBull या SpeedyFalcon) तुरंत शामिल हो जाते हैं ताकि आपको कभी इंतजार न करना पड़े।',
    },
    {
      id: 'faq-18',
      category: 'Multiplayer',
      question: 'क्या मैं दोस्तों या सहपाठियों के साथ खेलने के लिए प्राइवेट रूम बना सकता हूँ?',
      answer:
        'हाँ! 5-अंकों के रूम कोड के साथ कस्टम प्राइवेट रूम बनाएं। रूम होस्ट अधिकतम खिलाड़ियों की संख्या और समय सीमा निर्धारित कर सकता है, डायरेक्ट इनवाइट लिंक साझा कर सकता है और दोस्तों के बीच निजी टाइपिंग टूर्नामेंट आयोजित कर सकता है।',
    },
    {
      id: 'faq-19',
      category: 'Multiplayer',
      question: 'TypingBull चीटिंग को कैसे रोकता है और निष्पक्ष रैंकिंग कैसे सुनिश्चित करता है?',
      answer:
        'हमारा समर्पित मल्टीप्लेयर सर्वर सभी कीस्ट्रोक्स और टाइमस्टैम्प को सर्वर साइड पर सत्यापित करता है। पेस्ट-प्रोटेक्शन कॉपी-पेस्ट ट्रिक्स को रोकता है और नेट डब्ल्यूपीएम गणना लीडरबोर्ड पर निष्पक्ष और सटीक परिणाम सुनिश्चित करती है।',
    },
  ],
};

export function getLocalizedFaqData(lang: SupportedLocale): LocalizedFAQItem[] {
  return FAQ_DATA_BY_LANG[lang] || FAQ_DATA_BY_LANG.en;
}

export function getLocalizedFaqCategories(lang: SupportedLocale): Record<FAQCategoryKey, string> {
  return FAQ_CATEGORY_LABELS[lang] || FAQ_CATEGORY_LABELS.en;
}

export function getLocalizedFaqUi(lang: SupportedLocale): FAQLocalUi {
  return FAQ_UI_LABELS[lang] || FAQ_UI_LABELS.en;
}
