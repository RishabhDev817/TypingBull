import type { SupportedLocale } from '../i18n/ui';

export interface SEOSection {
  heading: string;
  badge?: string;
  paragraphs: string[];
}

export interface HomeSEOData {
  mainTitle: string;
  subTitle: string;
  badge: string;
  quickStats: { label: string; value: string; desc: string }[];
  sections: SEOSection[];
}

export const HOME_SEO_DATA: Record<SupportedLocale, HomeSEOData> = {
  en: {
    mainTitle: 'Free Gamified Typing Tutor: Next-Generation Keyboard Mastery with TypingBull',
    subTitle: 'The complete interactive typing platform engineered for speed, accuracy, ergonomic muscle memory, and developer fluency.',
    badge: '⚡ Free Gamified Typing Tutor',
    quickStats: [
      { label: 'Platform Tier', value: '100% Free', desc: 'Unlimited lessons & arcade modes' },
      { label: 'Telemetry Precision', value: '1 ms', desc: 'Per-key latency & error tracking' },
      { label: 'Speed Benchmark', value: '80+ WPM', desc: 'Average user target achievement' },
      { label: 'Global Layouts', value: '9 Standards', desc: 'QWERTY, AZERTY, QWERTZ, JIS & more' },
    ],
    sections: [
      {
        badge: 'Neuroscience & Motor Learning',
        heading: 'Why Gamification Transforms How You Learn Touch Typing Online',
        paragraphs: [
          'Typing is no longer merely a clerical skill—it is the primary conduit through which human thought translates into digital action. Whether you are a student preparing research reports, a software engineer architecting systems, a creative writer drafting stories, or a young learner discovering the keyboard, typing speed and precision directly govern your cognitive bandwidth. TypingBull was engineered from the ground up as a premier free gamified typing tutor designed to replace monotonous repetition with captivating game mechanics, neuroscience-backed motor learning principles, and modern AI intelligence.',
          'Traditional typing instruction has historically suffered from high abandonment rates. Monotonous strings of disconnected letters fail to maintain learner motivation over the weeks required to solidify muscle memory. TypingBull solves this fundamental obstacle through deep gamification. Rather than typing into blank text boxes, learners embark on interactive journeys that engage sensory anticipation, reward consistency, and trigger healthy dopamine feedback loops. By transforming abstract finger drills into immersive spatial challenges, TypingBull empowers learners of all skill levels to learn touch typing online naturally and sustainably.',
        ],
      },
      {
        badge: 'Intelligent Telemetry',
        heading: 'Real-Time Keystroke Analytics & Your Personal AI Typing Coach',
        paragraphs: [
          'At the core of TypingBull lies BullBot, an advanced ai typing coach that functions as your dedicated personal mentor. Unlike conventional typing tests that merely output aggregate words-per-minute and total errors, our diagnostic engine evaluates keystrokes at the individual millisecond level. BullBot monitors keypress hesitation latencies, finger transition bottlenecks, inter-key flight times, and fatigue drop-offs across extended typing sessions.',
          'Through dynamic Weak-Key Heatmaps, the platform visually illustrates where your muscle memory falters, highlighting high-error keys in vibrant amber and red glows across an interactive keyboard model. When BullBot detects repeated confusion—such as outer pinky reaches on top-row keys or hesitation on home-row index transitions—it automatically synthesizes targeted mini-missions to reinforce those precise neural pathways. This surgical diagnostics approach ensures that you never waste time practicing keys you have already mastered, dramatically accelerating your progression toward effortless, unconscious keyboard mastery.',
        ],
      },
      {
        badge: 'Velocity & Rhythm Cadence',
        heading: 'High-Precision Online Typing Test WPM & Fast Keyboard Speed Drills',
        paragraphs: [
          'Speed without accuracy is counterproductive, but accuracy without velocity hampers modern digital throughput. TypingBull bridges this gap through high-velocity online typing test wpm evaluations and targeted fast keyboard speed drills. Our engine measures both Gross WPM (raw typing speed) and Net WPM (penalizing uncorrected mistakes), providing an uncompromising benchmark of genuine productivity.',
          'Practice arenas challenge typists with adaptive countdown timers tailored to passage complexity. If the clock runs out before the passage is cleanly completed, the system enforces a tactical restart penalty. This gentle time pressure trains psychological composure, simulating the rigorous conditions of timed academic examinations, real-time closed captioning, medical transcription, and fast-paced workplace collaboration. By systematically training rhythm, cadence, and consistent burst velocity, users routinely break through stubborn 40 WPM, 60 WPM, and 80+ WPM plateaus within weeks of guided training.',
        ],
      },
      {
        badge: 'All Ages & Skill Levels',
        heading: 'Engaging Arcade Adventures & Safe Typing Practice for Kids',
        paragraphs: [
          'TypingBull integrates two distinctive arcade game modes tailored to diverse developmental stages. Lilypad Leap serves as an accessible, visually delightful playground ideal for typing practice for kids and beginners. Players type curated, high-frequency vocabulary words to guide an animated character across serene pond environments, accompanied by authentic nature soundscapes and gentle spatial water physics.',
          'For intermediate and advanced typists seeking adrenaline-fueled workouts, Neon Velocity delivers a high-octane synthwave retro-arcade speedrun. In Neon Velocity, cyber-themed obstacles cascade down multi-lane digital highways at escalating velocities. Players must destroy descending words before shields are breached, building high-multiplier combo streaks (2x, 4x, 8x) that demand rapid peripheral vision and flawless burst cadences. Together, these complementary game modes ensure that learners of every age group find their ideal equilibrium between low-stress foundational skill acquisition and high-intensity reflex conditioning.',
        ],
      },
      {
        badge: 'Engineering & Developer Workflows',
        heading: 'Technical Syntax Mastery: The Dedicated Coding Typing Test',
        paragraphs: [
          'Modern programming demands an entirely different set of typing mechanics than ordinary prose. Software development relies heavily on non-alphanumeric punctuation, nested brackets, parentheses, curly braces, colons, semicolons, arithmetic operators, and mixed camelCase or snake_case identifiers. TypingBull incorporates a dedicated coding typing test suite calibrated specifically for engineers, computer science students, and technical professionals.',
          'Typists drill authentic syntax passages across Python, JavaScript, TypeScript, C++, HTML/CSS, and SQL. By conditioning your fingers to effortlessly execute awkward punctuation reaches—such as transitioning smoothly from square brackets to quotation marks without looking down—TypingBull eliminates typing as a cognitive bottleneck during software engineering. Developers can keep their mental focus entirely on problem-solving, architectural design, and algorithmic reasoning, rather than stumbling over typos or hunting for uncommon symbol keys in their text editors.',
        ],
      },
      {
        badge: 'Ergonomics & Global Standards',
        heading: 'Ergonomic Principles, Spatial Muscle Memory, & Multilingual Architecture',
        paragraphs: [
          'True keyboard fluency is rooted in physical ergonomics and spatial motor coordination. TypingBull instills proper posture principles from your very first session. Learners are guided to utilize tactile home row index bumps (F and J) as physical anchors, ensuring their hands consistently return to baseline without glancing down. By distributing keypress workloads evenly across all ten fingers according to natural anatomical reach zones, TypingBull mitigates repetitive strain injury (RSI) risks and hand fatigue.',
          'Furthermore, recognizing that modern communication is global, TypingBull features full multilingual architecture supporting international keyboard layouts including standard US QWERTY, Spanish ISO with Ñ, French AZERTY, German QWERTZ, Japanese JIS Kana, and Indian InScript. No matter your native language or regional keyboard standard, TypingBull provides a tailored, accessible, and 100% free gamified typing tutor designed to elevate your typing speed, confidence, and digital expression.',
        ],
      },
    ],
  },
  es: {
    mainTitle: 'Tutor de Mecanografía Gamificado Gratis: Domina el Teclado con TypingBull',
    subTitle: 'La plataforma interactiva definitiva para aprender mecanografía gratis, mejorar tu velocidad y dominar el teclado.',
    badge: '⚡ Tutor de Mecanografía Gamificado Gratis',
    quickStats: [
      { label: 'Acceso Total', value: '100% Gratis', desc: 'Lecciones ilimitadas y modos arcade' },
      { label: 'Precisión Telemetría', value: '1 ms', desc: 'Análisis de latencia por tecla' },
      { label: 'Meta de Velocidad', value: '80+ PPM', desc: 'Objetivo de velocidad promedio' },
      { label: 'Diseño de Teclado', value: 'Español ISO', desc: 'Compatibilidad nativa con tecla Ñ' },
    ],
    sections: [
      {
        badge: 'Aprendizaje Dinámico',
        heading: 'Por Qué la Gamificación Transforma Cómo Aprender Mecanografía Gratis',
        paragraphs: [
          'Escribir a máquina ya no es una simple tarea rutinaria: es el canal principal a través del cual transformamos ideas en resultados tangibles en la era digital. TypingBull fue diseñado desde su origen como un tutor de mecanografía gamificado gratis de última generación para sustituir las prácticas mecánicas aburridas por retos estimulantes y aprendizaje neurocognitivo.',
          'Aprender mecanografía gratis suele fracasar cuando los métodos tradicionales fuerzan a escribir secuencias repetitivas de letras sin sentido. En TypingBull, cada pulsación tiene consecuencias interactivas directas en pantalla, ofreciendo una experiencia divertida y efectiva tanto para niños como para adultos que desean perfeccionar su práctica de teclado.',
        ],
      },
      {
        badge: 'Telemetría y Diagnóstico IA',
        heading: 'Telemetría en Tiempo Real y Tu Entrenador Personal BullBot',
        paragraphs: [
          'El corazón de TypingBull cuenta con BullBot, un coach inteligente que realiza diagnósticos de pulsaciones al milisegundo. Analiza vacilaciones en los dedos, fatiga en sesiones largas y transiciones complejas entre teclas contiguas.',
          'Gracias al mapa de calor visual, puedes identificar de un vistazo las teclas que generan fallos recurrentes. BullBot genera misiones personalizadas para trabajar esos puntos exactos, asegurando que tu tiempo de práctica de teclado sea siempre productivo y focalizado.',
        ],
      },
      {
        badge: 'Velocidad y Ritmo',
        heading: 'Prueba de Mecanografía Online y Test de Velocidad de Mecanografía WPM',
        paragraphs: [
          'La velocidad sin precisión carece de utilidad, pero la precisión sin agilidad limita tu productividad diaria. Por ello, nuestra prueba de mecanografía online combina pruebas de alta cadencia con un riguroso test de velocidad de mecanografía wpm que descuenta errores no corregidos.',
          'Los ejercicios temporizados introducen desafíos dinámicos contra el cronómetro. Si el temporizador llega a cero antes de concluir el texto, el sistema reinicia el nivel, fomentando la concentración bajo presión y preparándote para exámenes, redacción profesional y trabajo exigente.',
        ],
      },
      {
        badge: 'Juegos Arcade',
        heading: 'Aventuras Arcade y Práctica de Teclado Divertida para Todas las Edades',
        paragraphs: [
          'TypingBull incorpora modos de juego diseñados para cada nivel de habilidad. Salto en el Nenúfar (Lilypad Leap) es ideal para principiantes y jóvenes aprendices, guiando una rana sobre nenúfares mediante vocabulario progresivo y agradables sonidos de agua.',
          'Para quienes buscan adrenalina y velocidad extrema, Neon Velocity ofrece carreras retro synthwave donde debes destruir palabras que caen en múltiples carriles cibernéticos. Ambos modos convierten la práctica de teclado en un pasatiempo emocionante.',
        ],
      },
      {
        badge: 'Programadores y Desarrolladores',
        heading: 'Módulos Especiales para Desarrolladores y Código',
        paragraphs: [
          'Escribir código de software requiere una destreza mecánica muy distinta a redactar párrafos comunes. Llaves {}, corchetes [], operadores y variables camelCase suelen ralentizar la velocidad de los desarrolladores.',
          'TypingBull incluye pruebas especializadas de código en Python, JavaScript, C++, HTML y SQL. Esto permite a los programadores concentrarse en la lógica y la arquitectura de sus sistemas sin tropezar continuamente con símbolos o errores tipográficos en su editor.',
        ],
      },
      {
        badge: 'Ergonomía',
        heading: 'Ergonomía, Memoria Muscular y Distribución de Teclado en Español',
        paragraphs: [
          'La verdadera mecanografía al tacto se fundamenta en la memoria espacial y la postura correcta. Con relieves táctiles en las teclas F y J como anclajes físicos, tus manos siempre regresan a la posición de reposo sin necesidad de mirar el teclado.',
          'TypingBull se adapta a teclados en español ISO con la tecla Ñ y caracteres acentuados. Nuestro tutor de mecanografía gamificado gratis te acompaña paso a paso para que alcances un rendimiento sobresaliente con comodidad y soltura.',
        ],
      },
    ],
  },
  fr: {
    mainTitle: 'Tuteur de Dactylographie Ludique Gratuit: Maîtrisez le Clavier avec TypingBull',
    subTitle: 'La plateforme complète pour apprendre la dactylo azerty, réussir votre test de vitesse de frappe et progresser avec plaisir.',
    badge: '⚡ Tuteur de Dactylographie Ludique Gratuit',
    quickStats: [
      { label: 'Accès', value: '100% Gratuit', desc: 'Modules et arcades illimités' },
      { label: 'Précision', value: '1 ms', desc: 'Analyse télémétrique par touche' },
      { label: 'Vitesse Cible', value: '80+ MPM', desc: 'Objectif de fluidité professionnelle' },
      { label: 'Disposition', value: 'AZERTY', desc: 'Adaptation complète au français' },
    ],
    sections: [
      {
        badge: 'Pédagogie et Jeu',
        heading: 'Pourquoi Choisir un Tuteur de Dactylographie Ludique Gratuit',
        paragraphs: [
          'La frappe au clavier est la compétence fondamentale du XXIe siècle. TypingBull a été conçu comme un tuteur de dactylographie ludique gratuit afin de transformer l’entraînement traditionnel en une expérience captivante et stimulante.',
          'Plutôt que d’aligner des lettres rébarbatives, vous progressez à travers des mondes interactifs où chaque frappe produit un résultat visible. C’est la méthode idéale pour apprendre la dactylo azerty tout en s’amusant avec des jeux de frappe au clavier.',
        ],
      },
      {
        badge: 'Coaching IA',
        heading: 'Diagnostic Intelligent et Télémétrie en Temps Réel',
        paragraphs: [
          'Notre coach BullBot examine votre cadence à la milliseconde près. Il identifie les hésitations, les touches à fort taux d’erreur et la baisse d’endurance au fil des sessions prolongées.',
          'Grâce à la carte thermique interactive, vous visualisez immédiatement les faiblesses de votre mémoire musculaire. Des exercices ciblés vous permettent de progresser deux fois plus vite.',
        ],
      },
      {
        badge: 'Vitesse et Précision',
        heading: 'Test de Dactylographie en Ligne et Test de Vitesse de Frappe',
        paragraphs: [
          'Notre test de dactylographie en ligne mesure rigoureusement vos mots par minute bruts et nets. Les épreuves chronométrées stimulent la concentration nécessaire pour les examens et le milieu professionnel.',
          'En vous entraînant régulièrement sur notre test de vitesse de frappe, vous franchissez sans peine les paliers de 40, 60 et 80+ MPM avec une précision irréprochable.',
        ],
      },
      {
        badge: 'Modes Jeux Arcade',
        heading: 'Jeux de Frappe au Clavier Captivants pour Tous les Niveaux',
        paragraphs: [
          'Avec Lilypad Leap, les plus jeunes et les débutants guident une grenouille bondissante sur des nénuphars en tapant des mots apaisants dans un décor naturel.',
          'Pour les adeptes de sensations fortes, Neon Velocity plonge le joueur dans un univers cyberpunk synthwave où des obstacles numériques descendent à grande vitesse. Ces jeux de frappe au clavier stimulent les réflexes périphériques.',
        ],
      },
      {
        badge: 'Dév & Syntaxe',
        heading: 'Entraînement au Code pour Développeurs et Étudiants',
        paragraphs: [
          'La programmation exige la maîtrise de symboles souvent délicats : crochets, accolades, points-virgules et opérateurs arithmétiques.',
          'TypingBull propose des modules de syntaxe informatique (Python, JavaScript, C++, HTML) pour que la frappe ne soit plus jamais un frein à votre créativité logicielle.',
        ],
      },
      {
        badge: 'Ergonomie',
        heading: 'Posture, Repères Tactiles et Clavier AZERTY Français',
        paragraphs: [
          'Les repères tactiles sur les touches F et J guident vos doigts naturellement sans quitter l’écran des yeux. La charge est répartie équitablement entre les dix doigts pour éviter les tensions musculaires.',
          'TypingBull intègre parfaitement les accents et caractères spécifiques de la disposition AZERTY. Profitez dès aujourd’hui de notre tuteur de dactylographie ludique gratuit pour libérer votre plein potentiel.',
        ],
      },
    ],
  },
  de: {
    mainTitle: 'Kostenloser Gamifizierter Schreibtrainer: Zehnfingersystem Meistern mit TypingBull',
    subTitle: 'Die moderne interaktive Plattform für effektive Tipptests, QWERTZ-Schreibtraining und fehlerfreies Zehnfingersystem.',
    badge: '⚡ Kostenloser Gamifizierter Schreibtrainer',
    quickStats: [
      { label: 'Zugang', value: '100% Gratis', desc: 'Alle Lektionen & Arcade-Spiele' },
      { label: 'Messung', value: '1 ms', desc: 'Präzise Tasten-Latenz-Analyse' },
      { label: 'Zieltempo', value: '80+ WPM', desc: 'Erreichbare Profi-Geschwindigkeit' },
      { label: 'Tastaturlayout', value: 'QWERTZ', desc: 'Vollständige deutsche Umlaute' },
    ],
    sections: [
      {
        badge: 'Lernmethodik',
        heading: 'Warum ein Kostenloser Gamifizierter Schreibtrainer Begeistert',
        paragraphs: [
          'Tippen ist das wichtigste Werkzeug für Beruf, Studium und Freizeit. TypingBull wurde als moderner kostenloser gamifizierter Schreibtrainer konzipiert, um monotone Wiederholungen durch spannende Spielwelten zu ersetzen.',
          'Wer das Zehnfingersystem lernen möchte, verliert bei herkömmlichen Übungsseiten schnell die Motivation. Durch spielerische Level und Echtzeit-Belohnungen macht das Tastatur tippen üben jeden Tag aufs Neue Spaß.',
        ],
      },
      {
        badge: 'KI-Analyse',
        heading: 'Echtzeit-Telemetrie und Dein Persönlicher KI-Tutor BullBot',
        paragraphs: [
          'BullBot analysiert deine Anschläge auf die Millisekunde genau. Er erkennt Zögern vor schwierigen Tasten und zeigt dir über Heatmaps, wo deine Finger noch unsicher greifen.',
          'Gezielte Kurz-Drills trainieren exakt jene Buchstabenkombinationen, die dir Probleme bereiten, sodass du ohne Umwege maximale Genauigkeit erreichst.',
        ],
      },
      {
        badge: 'Tempo & Präzision',
        heading: 'Tipptest Online Kostenlos und Gezielte Geschwindigkeits-Drills',
        paragraphs: [
          'Absolviere deinen tipptest online kostenlos und ermittle deine echten WPM-Werte mit Fehlerabzug. Die Zeitlimits fordern dich heraus und bereiten dich ideal auf Schreibarbeiten unter Druck vor.',
          'Mit systematischem Rhythmustraining überwindest du typische Geschwindigkeitsbarrieren und erreichst mühelos 60 bis 80+ WPM.',
        ],
      },
      {
        badge: 'Spielewelten',
        heading: 'Abwechslungsreiche Arcade-Modi für Groß und Klein',
        paragraphs: [
          'Lilypad Leap führt Anfänger und Kinder spielerisch an die Tastatur heran, indem sie einen Frosch über Seerosen steuern.',
          'In Neon Velocity weichst du herabsausenden Cyber-Wörtern im Synthwave-Design aus. Beide Modi sorgen für ein intensives Reflex- und Schreibtraining.',
        ],
      },
      {
        badge: 'Programmierer',
        heading: 'Coding-Tipptests für Entwickler und Informatiker',
        paragraphs: [
          'Entwickler tippen viele Sonderzeichen wie geschweifte Klammern, Semikolons und Operatoren. TypingBull bietet spezifische Code-Übungen für Python, JavaScript, C++ und SQL.',
          'Dadurch tippst du Programmiercode flüssig, ohne den Blick vom Bildschirm zu wenden.',
        ],
      },
      {
        badge: 'Ergonomie',
        heading: 'Ergonomie, Fühlwarzen und das Deutsche QWERTZ-Layout',
        paragraphs: [
          'Die Erhebungen auf F und J dienen als taktile Anker für die Grundstellung. Das schont Sehnen und beugt Überlastungen vor.',
          'Mit nativer Unterstützung für das Schreibtrainer QWERTZ Layout und deutsche Umlaute bietet TypingBull beste Voraussetzungen für dauerhaften Schreiberfolg.',
        ],
      },
    ],
  },
  pt: {
    mainTitle: 'Tutor de Digitação Gamificado Grátis: Acelere sua Velocidade com TypingBull',
    subTitle: 'A melhor ferramenta para praticar digitação online, realizar teste de digitação grátis e dominar o teclado.',
    badge: '⚡ Tutor de Digitação Gamificado Grátis',
    quickStats: [
      { label: 'Gratuito', value: '100% Grátis', desc: 'Acesso completo a todas as fases' },
      { label: 'Telemetria', value: '1 ms', desc: 'Diagnóstico de erro em tempo real' },
      { label: 'Meta', value: '80+ PPM', desc: 'Velocidade profissional alcançável' },
      { label: 'Layout', value: 'ABNT2', desc: 'Compatibilidade com Ç e acentos' },
    ],
    sections: [
      {
        badge: 'Gamificação',
        heading: 'Por Que Usar um Tutor de Digitação Gamificado Grátis',
        paragraphs: [
          'Digitar com rapidez e precisão economiza horas de trabalho todos os dias. O TypingBull é um tutor de digitação gamificado grátis criado para transformar treinos tediosos em uma jornada interativa e dinâmica.',
          'Nossa aula de digitação para iniciantes ensina o posicionamento correto dos dedos desde o primeiro minuto, incentivando quem deseja praticar digitação online de forma consistente.',
        ],
      },
      {
        badge: 'Coach IA',
        heading: 'Diagnósticos em Tempo Real com BullBot',
        paragraphs: [
          'O BullBot analisa cada tecla pressionada, medindo pausas e teclas fracas. O mapa de calor visual indica com precisão onde seus dedos hesitam.',
          'Com treinos automatizados nas teclas mais difíceis, você corrige vícios posturais e acelera velocidade de digitação rapidamente.',
        ],
      },
      {
        badge: 'Avaliação de Velocidade',
        heading: 'Teste de Digitação Grátis e Medição Precisa de PPM',
        paragraphs: [
          'Faça o teste de digitação grátis do TypingBull para calcular suas Palavras Por Minuto brutas e líquidas com penalidade de erro.',
          'Os desafios cronometrados desenvolvem o foco sob pressão, ideal para concursos, redações e produtividade corporativa.',
        ],
      },
      {
        badge: 'Jogos de Arcade',
        heading: 'Jogos Divertidos de Digitação para Crianças e Adultos',
        paragraphs: [
          'No Lilypad Leap, guie um sapinho saltando sobre vitórias-régias digitando palavras calmas da natureza.',
          'No Neon Velocity, sinta a adrenalina das pistas cibernéticas destruindo obstáculos no estilo synthwave. Diversão garantida para todas as idades.',
        ],
      },
      {
        badge: 'Programação',
        heading: 'Digitação de Código para Desenvolvedores',
        paragraphs: [
          'A programação envolve chaves, colchetes e variáveis em camelCase. O TypingBull possui testes com código real em Python, JavaScript, C++ e SQL.',
          'Digitar símbolos sem olhar para o teclado garante mais foco na lógica dos seus projetos.',
        ],
      },
      {
        badge: 'Ergonomia',
        heading: 'Ergonomia, Posição Base e Teclado em Português',
        paragraphs: [
          'As saliências táteis nas teclas F e J servem de guia para posicionar os dedos sem tirar os olhos do monitor.',
          'Com total suporte ao teclado em português com tecla Ç e acentuação completa, o TypingBull é o tutor de digitação gamificado grátis ideal para sua evolução.',
        ],
      },
    ],
  },
  it: {
    mainTitle: 'Tutor di Dattilografia Gamificato Gratuito: Impara con TypingBull',
    subTitle: 'Il corso di dattilografia gratis più innovativo per imparare a digitare veloce e padroneggiare la tastiera.',
    badge: '⚡ Tutor di Dattilografia Gamificato Gratuito',
    quickStats: [
      { label: 'Accesso', value: '100% Gratis', desc: 'Tutti i moduli e giochi arcade' },
      { label: 'Precisione', value: '1 ms', desc: 'Telemetria in tempo reale' },
      { label: 'Velocità Cibo', value: '80+ PPM', desc: 'Traguardo di dattilografia professionale' },
      { label: 'Layout', value: 'Italiano', desc: 'Supporto per lettere accentate' },
    ],
    sections: [
      {
        badge: 'Didattica Ludica',
        heading: 'I Vantaggi di un Tutor di Dattilografia Gamificato Gratuito',
        paragraphs: [
          'Saper digitare a dieci dita alla cieca è essenziale per studio e lavoro. TypingBull è un tutor di dattilografia gamificato gratuito studiato per rendere ogni sessione coinvolgente e stimolante.',
          'Segui il nostro corso di dattilografia gratis: le dinamiche di gioco incoraggiano chiunque desideri imparare a digitare veloce con continuità e risultati duraturi.',
        ],
      },
      {
        badge: 'Tutor IA',
        heading: 'Analisi delle Pulsazioni e Telemetria con BullBot',
        paragraphs: [
          'Il nostro tutor BullBot esamina latenze e tasti critici al millisecondo. La mappa termica evidenzia esattamente dove la memoria muscolare ha bisogno di rinforzo.',
          'Gli esercizi mirati eliminano le incertezze sulle dita più deboli, velocizzando i progressi senza sforzi inutili.',
        ],
      },
      {
        badge: 'Test e Metriche',
        heading: 'Test di Dattilografia Online e Allenamento Tastiera Efficace',
        paragraphs: [
          'Mettiti alla prova con il nostro test di dattilografia online per calcolare parole al minuto e precisione effettiva.',
          'L’allenamento tastiera con timer a scalare abitua la mente a mantenere lucidità e ritmo anche in situazioni di scadenza e stress lavorativo.',
        ],
      },
      {
        badge: 'Arcade',
        heading: 'Giochi di Dattilografia per Grandi e Piccoli',
        paragraphs: [
          'In Lilypad Leap, guida una simpatica rana sulle ninfee digitando parole del vocabolario quotidiano in un’atmosfera rilassante.',
          'Con Neon Velocity, affronta piste synthwave ad alta velocità distruggendo parole cibernetiche prima che colpiscano lo scudo.',
        ],
      },
      {
        badge: 'Sviluppatori',
        heading: 'Test di Dattilografia Specializzato per Programmatori',
        paragraphs: [
          'La scrittura di codice richiede simboli complessi come parentesi graffe, punti e virgola e operatori logici.',
          'TypingBull include moduli di sintassi per Python, JavaScript, C++ e SQL, migliorando la fluidità di scrittura nei tuoi editor di codice.',
        ],
      },
      {
        badge: 'Ergonomia',
        heading: 'Postura, Indicatori Tattili e Layout Italiano',
        paragraphs: [
          'I rilievi tattili sulle lettere F e J fungono da ancore fisiche per riposizionare le mani senza guardare i tasti.',
          'Grazie al pieno supporto per la tastiera italiana e le lettere accentate, il nostro tutor di dattilografia gamificato gratuito è la soluzione perfetta per eccellere.',
        ],
      },
    ],
  },
  ja: {
    mainTitle: '無料のゲーム化されたタイピングチューター: TypingBullでブラインドタッチを極める',
    subTitle: 'AIコーチ、アーケードゲーム、プログラミング練習を統合した革新的なオンラインタイピング学習プラットフォーム。',
    badge: '⚡ 無料のゲーム化されたタイピングチューター',
    quickStats: [
      { label: '利用料金', value: '完全無料', desc: '全レッスン＆ゲーム無制限' },
      { label: '測定精度', value: '1ミリ秒', desc: 'キーごとの遅延・誤打追跡' },
      { label: '目標速度', value: '80+ WPM', desc: 'プロフェッショナル到達指標' },
      { label: 'キー配列', value: 'JIS / 日本語', desc: 'ローマ字・かな入力対応' },
    ],
    sections: [
      {
        badge: 'ゲーミフィケーション',
        heading: '無料のゲーム化されたタイピングチューターが効果的な理由',
        paragraphs: [
          'タイピングは思考をデジタルな形へと変換する現代社会の基本スキルです。TypingBullは、単調な反復練習を排し、脳科学に基づくゲーミフィケーションを取り入れた無料のゲーム化されたタイピングチューターです。',
          '画面上のキャラクターの動きや報酬ループにより、子どもから大人まで飽きずにタイピング練習 無料で継続できます。楽しく遊びながらブラインドタッチ 練習を行えるのが最大の特徴です。',
        ],
      },
      {
        badge: 'AI診断',
        heading: 'AIタイピングコーチBullBotとヒートマップ分析',
        paragraphs: [
          'TypingBullの頭脳であるBullBotは、打鍵の速度や迷いをミリ秒単位で検知します。小指の届きにくいキーや指の移行ミスを自動特定します。',
          '視覚的なヒートマップで苦手キーが一目でわかり、個別の復習ミッションで無駄なく弱点を克服できます。',
        ],
      },
      {
        badge: '速度検定',
        heading: 'タイピングスピードテストと短時間集中ドリル',
        paragraphs: [
          'タイピングスピードテストでは、正確なWPM（分速単語数）と正確性を厳格に測定します。時間制限付きのドリルは、仕事や試験で役立つ集中力を養います。',
          '規則正しい打鍵リズムを身につけることで、40、60、80 WPMの壁をスムーズに突破できます。',
        ],
      },
      {
        badge: 'アーケード',
        heading: '多彩なローマ字 タイピング ゲームで反射神経を鍛える',
        paragraphs: [
          '「Lilypad Leap」では、のどかな池でカエルをジャンプさせながら、無理のない語彙で楽しく入力練習ができます。',
          '「Neon Velocity」では、サイバー空間で迫り来る単語を撃破するハイスピードなローマ字 タイピング ゲームを体験できます。',
        ],
      },
      {
        badge: 'エンジニア向け',
        heading: 'プログラミング言語のコーディングタイピング演習',
        paragraphs: [
          'プログラミングでは、中括弧 {} や角括弧 []、セミコロン、camelCase などの記号入力が頻出します。',
          'Python、JavaScript、C++、SQL などの構文ドリルにより、コード記述時のタイピング遅延を解消し、思考をダイレクトにエディタへ反映できます。',
        ],
      },
      {
        badge: 'エルゴノミクス',
        heading: '正しい姿勢、ホームポジション、日本語JIS配列対応',
        paragraphs: [
          'FとJキーの突起を手がかりに、キーボードを見ずに打つブラインドタッチ 練習を初期レッスンから徹底サポート。',
          '日本語JIS配列およびローマ字入力に完全対応した無料のゲーム化されたタイピングチューターで、快適な高速タイピングを実現しましょう。',
        ],
      },
    ],
  },
  ko: {
    mainTitle: '무료 게임형 타자 연습 튜터: TypingBull로 완성하는 한글·영문 타자 실력',
    subTitle: 'AI 코칭, 박진감 넘치는 아케이드 게임, 프로그래머 전용 코딩 테스트를 지원하는 종합 타자 플랫폼.',
    badge: '⚡ 무료 게임형 타자 연습 튜터',
    quickStats: [
      { label: '이용 요금', value: '100% 무료', desc: '모든 강의 및 게임 모드 무제한' },
      { label: '데이터 정밀도', value: '1 ms', desc: '키별 반응 지연시간 추적' },
      { label: '목표 타수', value: '400+ 타', desc: '안정적인 실무 타자 속도 달성' },
      { label: '자판 규격', value: '두벌식 / 영문', desc: '한글 및 영문 표준 완벽 대응' },
    ],
    sections: [
      {
        badge: '게임 기반 학습',
        heading: '무료 게임형 타자 연습 튜터가 학습 효과를 높이는 이유',
        paragraphs: [
          '컴퓨터 타자는 생각을 디지털 언어로 변환하는 핵심 능력입니다. TypingBull은 지루한 반복 학습을 탈피하고 재미있는 게임 요소를 결합한 무료 게임형 타자 연습 튜터입니다.',
          '무료 타자 연습을 찾는 초보자부터 직장인까지, 보상과 레벨업 시스템을 통해 매일 즐겁게 타자 연습 게임을 즐기며 올바른 자리잡기 습관을 완성할 수 있습니다.',
        ],
      },
      {
        badge: '인공지능 코칭',
        heading: '실시간 키스트로크 분석과 맞춤형 AI 코치 BullBot',
        paragraphs: [
          'BullBot AI 코치는 사용자의 타자 속도와 오타 발생 패턴을 실시간 밀리초 단위로 분석합니다. 특히 취약한 손가락 위치나 연속 오타를 정확하게 진단합니다.',
          '약점 키 히트맵을 통해 실수 빈도가 높은 글쇠를 즉시 시각화하고, 전용 미니 훈련을 제공하여 학습 시간을 대폭 단축해 줍니다.',
        ],
      },
      {
        badge: '타속 검정',
        heading: '온라인 한글 타자 테스트 및 타자 속도 검정 WPM',
        paragraphs: [
          '온라인 한글 타자 테스트를 통해 현재 타수와 분당 단어수(WPM), 순수 정확도를 정밀하게 측정할 수 있습니다.',
          '타이머 기반의 긴장감 넘치는 도전 과제는 업무 환경이나 타자 검정 시험에서도 흔들림 없는 타자 실력을 길러줍니다.',
        ],
      },
      {
        badge: '아케이드 모드',
        heading: '남녀노소 누구나 즐기는 재미있는 타자 연습 게임',
        paragraphs: [
          '릴리패드 리프(Lilypad Leap)는 연못 위를 뛰는 개구리를 조작하며 자연스럽게 단어를 익히는 힐링 게임입니다.',
          '네온 벨로시티(Neon Velocity)는 빠른 속도로 질주하며 단어를 격파하는 신스웨이브 아케이드 게임으로 반사신경과 타속을 극대화합니다.',
        ],
      },
      {
        badge: '개발자 코딩',
        heading: '프로그래머와 엔지니어를 위한 특화 코딩 타자 테스트',
        paragraphs: [
          '코딩에서는 중괄호 {}, 대괄호 [], 세미콜론, 카멜케이스 식별자 등 특수문자 입력이 빈번합니다.',
          'Python, JavaScript, C++, SQL 등 실제 프로그래밍 언어의 구문을 직접 타이핑 훈련하여 개발 생산성을 크게 끌어올립니다.',
        ],
      },
      {
        badge: '인체공학',
        heading: '바른 자세와 한글 두벌식 키보드 배열 최적화',
        paragraphs: [
          '기본 자리 F와 J 글쇠의 돌기를 중심으로 열 손가락을 고르게 사용하여 손목 부담과 피로를 방지합니다.',
          '한글 표준 자판에 최적화된 무료 게임형 타자 연습 튜터 TypingBull과 함께 빠르고 정확한 타이핑을 경험해 보세요.',
        ],
      },
    ],
  },
  hi: {
    mainTitle: 'मुफ्त गेमिफाइड टाइपिंग ट्यूटर: TypingBull के साथ कीबोर्ड पर महारत हासिल करें',
    subTitle: 'गति, सटीकता, एर्गोनॉमिक मांसपेशियों की स्मृति और तेज़ टाइपिंग के लिए संपूर्ण इंटरैक्टिव टूल।',
    badge: '⚡ मुफ्त गेमिफाइड टाइपिंग ट्यूटर',
    quickStats: [
      { label: 'उपलब्धता', value: '100% मुफ्त', desc: 'सभी स्तर और आर्केड गेम असीमित' },
      { label: 'सटीक माप', value: '1 ms', desc: 'प्रत्येक कुंजी की विलंबता ट्रैकिंग' },
      { label: 'गति लक्ष्य', value: '80+ WPM', desc: 'व्यावसायिक टाइपिंग गति बेंचमार्क' },
      { label: 'कीबोर्ड सपोर्ट', value: 'हिंदी व अंग्रेज़ी', desc: 'इनस्क्रिप्ट व QWERTY मानक' },
    ],
    sections: [
      {
        badge: 'गेमिफाइड लर्निंग',
        heading: 'मुफ्त गेमिफाइड टाइपिंग ट्यूटर क्यों है सबसे असरदार',
        paragraphs: [
          'आज के डिजिटल युग में कंप्यूटर पर तेज़ टाइपिंग करना एक आवश्यक हुनर बन चुका है। TypingBull एक आधुनिक मुफ्त गेमिफाइड टाइपिंग ट्यूटर है, जो उबाऊ अभ्यास को रोमांचक खेलों में बदल देता है।',
          'पारंपरिक तरीकों में छात्र जल्दी थक जाते हैं। हमारे प्लेटफॉर्म पर हर कीस्ट्रोक का तुरंत परिणाम दिखता है, जिससे बच्चों और बड़ों दोनों के लिए कीबोर्ड टाइपिंग प्रैक्टिस मजेदार और स्वाभाविक बन जाती है।',
        ],
      },
      {
        badge: 'AI कोच',
        heading: 'रीयल-टाइम कीस्ट्रोक एनालिटिक्स और आपका AI टाइपिंग कोच',
        paragraphs: [
          'बुलबॉट (BullBot) आपका निजी AI कोच है जो आपकी टाइपिंग का मिलीसेकंड स्तर पर विश्लेषण करता है। यह उन कुंजियों को पहचानता है जहाँ आपकी उंगलियाँ झिझकती हैं।',
          'इंटरैक्टिव हीटमैप की मदद से आप अपनी गलतियों को सीधे स्क्रीन पर देख सकते हैं और बुलबॉट के विशेष अभ्यास से कमज़ोरियों को तुरंत दूर कर सकते हैं।',
        ],
      },
      {
        badge: 'गति परीक्षण',
        heading: 'ऑनलाइन टाइपिंग टेस्ट और टाइपिंग स्पीड टेस्ट हिंदी',
        paragraphs: [
          'अपनी गति और सटीकता को मापने के लिए हमारा ऑनलाइन टाइपिंग टेस्ट दें। यह टेस्ट शुद्ध गति (Net WPM) की सही गणना करता है।',
          'टाइमर वाले सत्र आपको प्रतियोगी परीक्षाओं और कार्यालय के समयबद्ध कार्यों के लिए पूरी तरह तैयार करते हैं।',
        ],
      },
      {
        badge: 'आर्केड गेम्स',
        heading: 'मजेदार आर्केड गेम्स और बच्चों के लिए सुरक्षित अभ्यास',
        paragraphs: [
          'लिलीपैड लीप (Lilypad Leap) खेल में मेंढक को तैरते पत्तों पर कुदाते हुए शांत वातावरण में आसान शब्द टाइप करना सिखाया जाता है।',
          'नियॉन वेलोसिटी (Neon Velocity) तेज़ गति वाले साइबर स्पेस में नीचे गिरते शब्दों को नष्ट करने की रोमांचक चुनौती देता है।',
        ],
      },
      {
        badge: 'कोडिंग टेस्ट',
        heading: 'डेवलपर्स के लिए विशेष कोडिंग टाइपिंग टेस्ट',
        paragraphs: [
          'प्रोग्रामिंग में ब्रैकेट {}, कोष्ठक [], अर्धविराम और गणितीय प्रतीकों का उपयोग बहुत अधिक होता है।',
          'TypingBull में Python, JavaScript, C++ और SQL जैसे सिंटैक्स के लिए समर्पित टेस्ट उपलब्ध हैं, जिससे सॉफ्टवेयर इंजीनियर कीबोर्ड देखे बिना तेज़ी से कोड लिख सकें।',
        ],
      },
      {
        badge: 'एर्गोनॉमिक्स',
        heading: 'सही मुद्रा, होम रो एंकर और फ्री टच टाइपिंग की शक्ति',
        paragraphs: [
          'F और J कुंजियों पर बने उभार आपकी उंगलियों को बिना देखे सही स्थान पर रखने में मदद करते हैं। दसों उंगलियों का संतुलित उपयोग हाथ के दर्द को रोकता है।',
          'हिंदी इनस्क्रिप्ट और रेमिंगटन कीबोर्ड लेआउट के पूर्ण समर्थन के साथ मुफ्त गेमिफाइड टाइपिंग ट्यूटर TypingBull आपकी गति को नई ऊंचाइयों पर ले जाता है।',
        ],
      },
    ],
  },
};
