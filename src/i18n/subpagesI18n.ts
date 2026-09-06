import type { SupportedLocale } from './ui';

export interface AboutI18n {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  btnStart: string;
  btnGames: string;
  mascotBadge: string;
  mascotTitle: string;
  mascotDesc: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  principlesTitle: string;
  p1Title: string;
  p1Desc: string;
  p2Title: string;
  p2Desc: string;
  p3Title: string;
  p3Desc: string;
}

export interface ContactI18n {
  badge: string;
  title: string;
  subtitle: string;
  directTitle: string;
  supportLabel: string;
  feedbackLabel: string;
  privacyLabel: string;
  responseTime: string;
  globalNote: string;
  faqTitle: string;
  faqDesc: string;
  faqLink: string;
  formTitle: string;
  formDesc: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  categoryLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  btnSend: string;
  btnSending: string;
  successTitle: string;
  successDesc: string;
  btnSendAnother: string;
}

export interface PrivacyI18n {
  badge: string;
  title: string;
  updated: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  s1Title: string;
  s1Content: string;
  s2Title: string;
  s2Content: string;
  s3Title: string;
  s3Content: string;
  s4Title: string;
  s4Content: string;
}

export interface TermsI18n {
  badge: string;
  title: string;
  updated: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  s1Title: string;
  s1Content: string;
  s2Title: string;
  s2Content: string;
  s3Title: string;
  s3Content: string;
  s4Title: string;
  s4Content: string;
}

export interface SubpagesTranslation {
  about: AboutI18n;
  contact: ContactI18n;
  privacy: PrivacyI18n;
  terms: TermsI18n;
}

export const SUBPAGES_I18N: Record<SupportedLocale, SubpagesTranslation> = {
  en: {
    about: {
      badge: 'Our Story & Mission',
      heroTitle: "Mastering the Keyboard Shouldn't Feel Like Homework.",
      heroSubtitle:
        'TypingBull was created to reinvent touch typing education: blending structured cognitive progression, arcade velocity gaming, and generative AI diagnostics into a 100% free, joyful experience.',
      btnStart: 'Start Learning Free',
      btnGames: 'Play Games',
      mascotBadge: 'Meet BullBot 🐂',
      mascotTitle: 'Your Enthusiastic, Data-Driven Typing Companion',
      mascotDesc:
        "BullBot isn't just an avatar. Behind the scenes, BullBot monitors your raw keystroke timing, identifies hesitation patterns on specific fingers, generates Weak-Key Heatmaps, and provides tailored drill recommendations in natural conversation.",
      pillarsTitle: 'How TypingBull Reinvents Learning',
      pillarsSubtitle: 'Built from the ground up on modern cognitive science and interactive feedback loops.',
      pillar1Title: 'The Great Typing Railway',
      pillar1Desc:
        'A structured railroad progression that introduces one finger coordinate at a time. Starting with Home Row anchors (F & J bumps), through top row reach extensions, bottom row curls, shift coordination, and code brackets.',
      pillar2Title: 'Gamified Velocity Modes',
      pillar2Desc:
        'From the serene water physics and progressive vocabulary of Lilypad Leap to the high-cadence highway lanes of Neon Velocity, our arcade modes replace rote memorization with flow-state gameplay.',
      pillar3Title: 'Deep Keystroke Diagnostics',
      pillar3Desc:
        'Every keypress records millisecond timings, pause gaps, and error frequencies. Our diagnostics isolate whether a slow WPM stems from pinky reaching or fatigue drop-off, giving typists precision insights.',
      pillar4Title: 'Global & Multilingual Layouts',
      pillar4Desc:
        'Touch typing is universal. TypingBull supports standard US QWERTY, French AZERTY, German QWERTZ, and Indian regional typing layouts with dynamic on-screen key remapping.',
      principlesTitle: 'Our Core Principles',
      p1Title: '100% Free Forever',
      p1Desc:
        'We believe touch typing is a fundamental 21st-century literacy. All lessons, diagnostics, and games are free without paywalls.',
      p2Title: 'Privacy By Design',
      p2Desc:
        'Keystroke telemetry is stored locally in your browser session store. We do not track or sell personal identifying typing data.',
      p3Title: 'Ergonomics First',
      p3Desc:
        'Speed means nothing without proper wrist health and fluid mechanics. We emphasize relaxed posture over reckless key-mashing.',
    },
    contact: {
      badge: "We'd Love To Hear From You",
      title: 'Contact & Support',
      subtitle:
        'Have feedback, discovered a bug, or want to bring TypingBull to your classroom? Drop us a note below!',
      directTitle: 'Direct Inquiries',
      supportLabel: 'Support & Help',
      feedbackLabel: 'Feedback & Ideas',
      privacyLabel: 'Privacy & Legal',
      responseTime: 'Response Time: Typically within 24–48 hours',
      globalNote: 'Distributed globally with ❤️ for learners everywhere',
      faqTitle: 'Looking for quick answers?',
      faqDesc: 'Check out our complete 15-question Knowledge Base covering WPM calculation, weak keys, and gameplay tips.',
      faqLink: 'Browse FAQs →',
      formTitle: 'Send a Message',
      formDesc: "Fill out the form below and our team will get back to you as soon as possible.",
      nameLabel: 'Your Name',
      namePlaceholder: 'Alex Typist',
      emailLabel: 'Email Address',
      emailPlaceholder: 'alex@example.com',
      categoryLabel: 'Inquiry Category',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us how we can help or share your ideas...',
      btnSend: 'Send Message',
      btnSending: 'Sending...',
      successTitle: 'Message Sent! 🚀',
      successDesc: "Thanks for reaching out. We've received your note and will get back to you shortly.",
      btnSendAnother: 'Send Another Message',
    },
    privacy: {
      badge: 'Privacy & Trust',
      title: 'Privacy Policy',
      updated: 'Last Updated: September 5, 2026 • Version 2.0',
      card1Title: 'Local-First Storage',
      card1Desc: 'Your raw keystroke data and lesson completions reside securely inside your browser localStorage.',
      card2Title: 'Zero Data Selling',
      card2Desc: 'We never monetize, rent, or trade your practice telemetry or contact info to data brokers.',
      card3Title: 'COPPA Compliant',
      card3Desc: 'We do not collect personally identifiable information from students or children under 13.',
      s1Title: '1. Information We Collect',
      s1Content:
        'TypingBull is engineered as a privacy-first web application. We collect non-identifiable telemetry (such as anonymous WPM rates, accuracy percentages, and finger hesitation latencies) stored locally on your device to power your Weak-Key Heatmap and AI Tutor reports.',
      s2Title: '2. Local Storage Architecture',
      s2Content:
        'All your streak data, completed railway stations, and arcade high scores are persisted within your browser’s localStorage API. You maintain total sovereignty over your typing data and can clear it at any time.',
      s3Title: '3. Third-Party Services & Analytics',
      s3Content:
        'We do not load third-party ad networks or surveillance trackers. Any network requests are strictly limited to core static asset delivery and secure form processing.',
      s4Title: '4. Contact & Inquiries',
      s4Content:
        'If you have questions regarding this Privacy Policy or wish to request data deletion, please contact privacy@typingbull.com.',
    },
    terms: {
      badge: 'Platform Terms',
      title: 'Terms & Conditions',
      updated: 'Last Updated: September 5, 2026 • Version 2.0',
      card1Title: 'Free Usage',
      card1Desc: 'Free access granted for personal typing development, schools, coding bootcamps, and home educators.',
      card2Title: 'Fair Gameplay',
      card2Desc: 'Automated macro typing scripts or artificial score manipulation undermine the educational community.',
      card3Title: 'Educational License',
      card3Desc: 'Classrooms and educational institutions are welcome to integrate TypingBull without licensing fees.',
      s1Title: '1. Acceptance of Terms',
      s1Content:
        'By accessing or using TypingBull, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, please refrain from using the service.',
      s2Title: '2. Educational Purpose & Proper Use',
      s2Content:
        'TypingBull is provided free of charge for touch typing education, practice, and skill assessment. Users agree not to reverse-engineer, deploy automated keystroke bots, or disrupt platform services for other typists.',
      s3Title: '3. Intellectual Property',
      s3Content:
        'All original interactive visual elements, game mechanics, curriculum station designs, sound effects, and mascot artwork are the exclusive intellectual property of TypingBull.',
      s4Title: '4. Disclaimer of Warranties',
      s4Content:
        'TypingBull is provided on an "as is" and "as available" basis without warranties of any kind. While we strive for 100% uptime, we are not liable for uninterrupted service delivery.',
    },
  },
  es: {
    about: {
      badge: 'Nuestra Historia y Misión',
      heroTitle: 'Dominar el Teclado No Debería Sentirse Como Tarea Escolar.',
      heroSubtitle:
        'TypingBull fue creado para reinventar la enseñanza de mecanografía: combinando progresión cognitiva estructurada, juegos arcade de velocidad y diagnósticos con IA generativa en una experiencia 100% gratuita y divertida.',
      btnStart: 'Empezar a Aprender Gratis',
      btnGames: 'Jugar Juegos',
      mascotBadge: 'Conoce a BullBot 🐂',
      mascotTitle: 'Tu Compañero Entusiasta Guiado por Datos',
      mascotDesc:
        'BullBot no es solo un avatar. Detrás de escena, analiza la cadencia de cada tecla, detecta patrones de titubeo en dedos específicos, genera mapas de calor de teclas débiles y ofrece recomendaciones personalizadas.',
      pillarsTitle: 'Cómo TypingBull Reinventa el Aprendizaje',
      pillarsSubtitle: 'Diseñado desde cero con ciencia cognitiva moderna y ciclos de retroalimentación interactivos.',
      pillar1Title: 'El Gran Ferrocarril de Mecanografía',
      pillar1Desc:
        'Una ruta ferroviaria estructurada que introduce una coordenada digital a la vez. Desde los anclajes de la fila guía (relieves F y J) hasta extensiones superiores, fila inferior y símbolos de programación.',
      pillar2Title: 'Modos de Velocidad Gamificados',
      pillar2Desc:
        'Desde la relajante física acuática de Salto en el Nenúfar hasta la adrenalina retro de Neon Velocity, nuestros juegos arcade sustituyen la memorización tediosa por estados de concentración óptima.',
      pillar3Title: 'Diagnóstico Profundo de Pulsaciones',
      pillar3Desc:
        'Cada pulsación registra milisegundos, pausas e índices de error. Nuestro diagnóstico identifica si la lentitud proviene del meñique o del cansancio muscular.',
      pillar4Title: 'Distribuciones Globales y Multilingües',
      pillar4Desc:
        'La mecanografía es universal. TypingBull soporta QWERTY estándar, AZERTY francés, QWERTZ alemán y distribuciones regionales con mapeo visual dinámico.',
      principlesTitle: 'Nuestros Principios Fundamentales',
      p1Title: '100% Gratis Para Siempre',
      p1Desc:
        'Creemos que la mecanografía al tacto es una habilidad esencial del siglo XXI. Todas las lecciones y juegos son accesibles sin muros de pago.',
      p2Title: 'Privacidad Por Diseño',
      p2Desc:
        'La telemetría de pulsaciones se almacena localmente en tu navegador. Jamás rastreamos ni vendemos datos personales de escritura.',
      p3Title: 'Ergonomía Primero',
      p3Desc:
        'La velocidad no vale nada sin salud en las muñecas. Fomentamos una postura relajada y natural antes que el tecleo agresivo.',
    },
    contact: {
      badge: 'Nos Encantaría Saber de Ti',
      title: 'Contacto y Soporte',
      subtitle:
        '¿Tienes sugerencias, encontraste un error o deseas incorporar TypingBull a tu escuela? ¡Escríbenos!',
      directTitle: 'Consultas Directas',
      supportLabel: 'Soporte y Ayuda',
      feedbackLabel: 'Sugerencias e Ideas',
      privacyLabel: 'Privacidad y Legal',
      responseTime: 'Tiempo de respuesta: Habitualmente en 24–48 horas',
      globalNote: 'Distribuido globalmente con ❤️ para estudiantes de todo el mundo',
      faqTitle: '¿Buscas respuestas rápidas?',
      faqDesc: 'Consulta nuestra base de conocimiento de 15 preguntas sobre cálculo de PPM, teclas débiles y consejos.',
      faqLink: 'Explorar Preguntas Frecuentes →',
      formTitle: 'Envía un Mensaje',
      formDesc: 'Completa el formulario y nuestro equipo te responderá lo antes posible.',
      nameLabel: 'Tu Nombre',
      namePlaceholder: 'Carlos Mecanógrafo',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'carlos@ejemplo.com',
      categoryLabel: 'Categoría de Consulta',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Cuéntanos cómo podemos ayudarte o comparte tus ideas...',
      btnSend: 'Enviar Mensaje',
      btnSending: 'Enviando...',
      successTitle: '¡Mensaje Enviado! 🚀',
      successDesc: 'Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos a la brevedad.',
      btnSendAnother: 'Enviar Otro Mensaje',
    },
    privacy: {
      badge: 'Privacidad y Confianza',
      title: 'Política de Privacidad',
      updated: 'Última actualización: 5 de septiembre de 2026 • Versión 2.0',
      card1Title: 'Almacenamiento Local',
      card1Desc: 'Tus pulsaciones y lecciones completadas se almacenan de forma segura en el almacenamiento local de tu navegador.',
      card2Title: 'Cero Venta de Datos',
      card2Desc: 'Nunca monetizamos, alquilamos ni transferimos tu información de práctica a terceros.',
      card3Title: 'Cumplimiento COPPA',
      card3Desc: 'No recopilamos información de identificación personal de estudiantes o menores de 13 años.',
      s1Title: '1. Información que Recopilamos',
      s1Content:
        'TypingBull es una aplicación diseñada con privacidad desde el origen. Registramos telemetría no identificable (PPM anónimas, porcentajes de precisión y latencias) para generar tus informes de BullBot y mapas de calor.',
      s2Title: '2. Arquitectura de Almacenamiento Local',
      s2Content:
        'Tu racha, estaciones ferroviarias y récords se guardan en el localStorage de tu dispositivo. Tienes control total y puedes borrarlos cuando desees.',
      s3Title: '3. Servicios de Terceros',
      s3Content:
        'No cargamos redes publicitarias ni rastreadores invasivos. Cualquier solicitud se limita a servir archivos estáticos seguros.',
      s4Title: '4. Contacto de Privacidad',
      s4Content:
        'Si tienes dudas sobre esta política o deseas solicitar eliminación de datos, escribe a privacy@typingbull.com.',
    },
    terms: {
      badge: 'Términos de la Plataforma',
      title: 'Términos y Condiciones',
      updated: 'Última actualización: 5 de septiembre de 2026 • Versión 2.0',
      card1Title: 'Uso Gratuito',
      card1Desc: 'Acceso libre para desarrollo personal, centros educativos, campamentos de código y docentes.',
      card2Title: 'Juego Limpio',
      card2Desc: 'El uso de bots automatizados o scripts de manipulación de puntajes daña la comunidad educativa.',
      card3Title: 'Licencia Educativa',
      card3Desc: 'Escuelas e instituciones pueden implementar TypingBull sin costo de licencia alguno.',
      s1Title: '1. Aceptación de los Términos',
      s1Content:
        'Al utilizar TypingBull, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, te pedimos abstenerte de usar el servicio.',
      s2Title: '2. Propósito Educativo',
      s2Content:
        'TypingBull se proporciona gratuitamente para el aprendizaje y práctica de mecanografía. Se prohíbe la ingeniería inversa y el uso de bots que perturben el servicio.',
      s3Title: '3. Propiedad Intelectual',
      s3Content:
        'Los gráficos interactivos, mecánicas de juego, lecciones, efectos de audio e ilustraciones del buey son propiedad intelectual exclusiva de TypingBull.',
      s4Title: '4. Exención de Garantías',
      s4Content:
        'El servicio se brinda "tal cual" y según disponibilidad, sin garantías explícitas de funcionamiento ininterrumpido.',
    },
  },
  fr: {
    about: {
      badge: 'Notre Histoire & Mission',
      heroTitle: 'Maîtriser le Clavier Ne Devrait Pas Être Une Corvée.',
      heroSubtitle:
        'TypingBull réinvente l’apprentissage de la dactylographie : alliance d’une progression cognitive structurée, de jeux d’arcade dynamiques et de diagnostics IA dans une expérience 100% gratuite.',
      btnStart: 'Commencer Gratuitement',
      btnGames: 'Jouer aux Jeux',
      mascotBadge: 'Découvrez BullBot 🐂',
      mascotTitle: 'Votre Compagnon de Frappe Intelligent',
      mascotDesc:
        'BullBot surveille votre cadence, identifie les hésitations sur chaque doigt et génère des cartes thermiques de touches faibles avec des recommandations ciblées.',
      pillarsTitle: 'Comment TypingBull Réinvente l’Apprentissage',
      pillarsSubtitle: 'Conçu sur les fondements des sciences cognitives et des boucles de rétroaction interactives.',
      pillar1Title: 'Le Grand Chemin de Fer Dactylo',
      pillar1Desc:
        'Une progression pas à pas qui introduit un doigt à la fois, de la rangée de base (repères F et J) aux extensions supérieures et symboles de programmation.',
      pillar2Title: 'Modes de Vitesse Ludiques',
      pillar2Desc:
        'De la sérénité aquatique de Lilypad Leap aux autoroutes rythmées de Neon Velocity, nos modes arcade remplacent l’ennui par un flux captivant.',
      pillar3Title: 'Diagnostics Précis des Frappes',
      pillar3Desc:
        'Chaque touche enregistre sa latence en millisecondes pour déterminer si la perte de vitesse vient de l’auriculaire ou de la fatigue.',
      pillar4Title: 'Dispositions Internationales',
      pillar4Desc:
        'TypingBull prend en charge AZERTY français, QWERTY standard, QWERTZ allemand et les claviers régionaux avec disposition dynamique.',
      principlesTitle: 'Nos Principes Fondamentaux',
      p1Title: '100% Gratuit Pour Toujours',
      p1Desc:
        'La dactylographie est une compétence clé du 21e siècle. Tous nos cours et jeux sont accessibles sans abonnement ni barrière payante.',
      p2Title: 'Respect de la Vie Privée',
      p2Desc:
        'Vos données de frappe restent stockées localement dans votre navigateur. Nous ne vendons aucune donnée personnelle.',
      p3Title: 'Ergonomie Avant Tout',
      p3Desc:
        'La vitesse sans confort n’a pas de sens. Nous privilégions une posture détendue des poignets plutôt qu’un martèlement précipité.',
    },
    contact: {
      badge: 'Nous Sommes à Votre Écoute',
      title: 'Contact & Support',
      subtitle:
        'Une suggestion, un problème technique ou un projet pour votre classe ? Envoyez-nous un message !',
      directTitle: 'Demandes Directes',
      supportLabel: 'Support & Assistance',
      feedbackLabel: 'Idées & Retours',
      privacyLabel: 'Confidentialité & Légal',
      responseTime: 'Délai de réponse : Généralement sous 24 à 48 heures',
      globalNote: 'Distribué avec ❤️ pour tous les apprenants dans le monde',
      faqTitle: 'Une question fréquente ?',
      faqDesc: 'Consultez notre FAQ complète de 15 questions sur le calcul des MPM, les touches faibles et les astuces.',
      faqLink: 'Voir les FAQ →',
      formTitle: 'Envoyer un Message',
      formDesc: 'Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement.',
      nameLabel: 'Votre Nom',
      namePlaceholder: 'Camille Dactylo',
      emailLabel: 'Adresse E-mail',
      emailPlaceholder: 'camille@exemple.fr',
      categoryLabel: 'Catégorie de la Demande',
      messageLabel: 'Message',
      messagePlaceholder: 'Expliquez-nous comment nous pouvons vous aider...',
      btnSend: 'Envoyer le Message',
      btnSending: 'Envoi en cours...',
      successTitle: 'Message Envoyé ! 🚀',
      successDesc: 'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.',
      btnSendAnother: 'Envoyer un Autre Message',
    },
    privacy: {
      badge: 'Confidentialité & Sécurité',
      title: 'Politique de Confidentialité',
      updated: 'Dernière mise à jour : 5 septembre 2026 • Version 2.0',
      card1Title: 'Stockage Local Prioritaire',
      card1Desc: 'Vos frappes et votre historique sont conservés localement dans le stockage de votre navigateur.',
      card2Title: 'Zéro Vente de Données',
      card2Desc: 'Nous ne vendons ni ne louons vos informations ou vos résultats d’entraînement à quiconque.',
      card3Title: 'Conformité pour les Jeunes',
      card3Desc: 'Aucune donnée d’identification n’est exigée des enfants ou des élèves de moins de 13 ans.',
      s1Title: '1. Informations Recueillies',
      s1Content:
        'TypingBull est conçu avec un haut niveau de confidentialité. Les statistiques de frappe anonymes restent sur votre machine.',
      s2Title: '2. Fonctionnement du Stockage Local',
      s2Content:
        'Vos séries quotidiennes et vos succès sont enregistrés via l’API localStorage. Vous pouvez les effacer à tout moment.',
      s3Title: '3. Services Tiers',
      s3Content:
        'Nous n’utilisons aucun réseau publicitaire ni traceur invasif.',
      s4Title: '4. Nous Contacter',
      s4Content:
        'Pour toute question relative à vos données, contactez privacy@typingbull.com.',
    },
    terms: {
      badge: 'Conditions d’Utilisation',
      title: 'Conditions Générales',
      updated: 'Dernière mise à jour : 5 septembre 2026 • Version 2.0',
      card1Title: 'Accès Libre',
      card1Desc: 'Usage gratuit pour la pratique personnelle, les écoles et les formations.',
      card2Title: 'Jeu Équitable',
      card2Desc: 'Les scripts automatisés ou faux scores nuisent à la communauté d’apprentissage.',
      card3Title: 'Licence Scolaire',
      card3Desc: 'Les établissements scolaires peuvent déployer TypingBull librement sans frais.',
      s1Title: '1. Acceptation des Conditions',
      s1Content:
        'L’utilisation de TypingBull implique votre adhésion complète aux présentes conditions.',
      s2Title: '2. Usage Pédagogique',
      s2Content:
        'La plateforme est réservée à l’apprentissage bienveillant et régulier de la dactylo.',
      s3Title: '3. Propriété Intellectuelle',
      s3Content:
        'Les visuels, les niveaux et la mascotte sont protégés par le droit d’auteur de TypingBull.',
      s4Title: '4. Limitation de Responsabilité',
      s4Content:
        'Le service est fourni en l’état sans garantie d’accès ininterrompu.',
    },
  },
  de: {
    about: {
      badge: 'Unsere Mission & Geschichte',
      heroTitle: 'Tippen Lernen Muss Nicht Wie Hausaufgaben Sein.',
      heroSubtitle:
        'TypingBull verbindet strukturierte kognitive Übungen, rasante Arcade-Spiele und KI-Diagnostik zu einem 100% kostenlosen Lernerlebnis.',
      btnStart: 'Kostenlos Lernen',
      btnGames: 'Spiele Spielen',
      mascotBadge: 'Triff BullBot 🐂',
      mascotTitle: 'Dein Datenbasierter Schreibtrainer',
      mascotDesc:
        'BullBot analysiert Millisekunden-Intervalle, deckt Schwachstellen an bestimmten Fingern auf und liefert personalisierte Übungen.',
      pillarsTitle: 'Wie TypingBull das Lernen Neu Erfindet',
      pillarsSubtitle: 'Entwickelt auf Basis moderner Kognitionswissenschaft und direktem Feedback.',
      pillar1Title: 'Die Große Tipp-Eisenbahn',
      pillar1Desc:
        'Schrittweise Progression von der Grundreihe (Tastpunkte F & J) über Ober- und Unterreihe bis hin zu Programmiersymbolen.',
      pillar2Title: 'Gamifizierte Geschwindigkeits-Modi',
      pillar2Desc:
        'Von der Ruhe in Lilypad Leap bis zur Synthwave-Action in Neon Velocity: Spiele bringen dich in den echten Flow-Zustand.',
      pillar3Title: 'Präzise Tasten-Diagnostik',
      pillar3Desc:
        'Jeder Tastenanschlag wird gemessen, um festzustellen, ob Tempoverluste am kleinen Finger oder an Ermüdung liegen.',
      pillar4Title: 'Globale Tastaturlayouts',
      pillar4Desc:
        'Volle Unterstützung für Deutsches QWERTZ, US-QWERTY, Französisches AZERTY und regionale Eingaben.',
      principlesTitle: 'Unsere Grundsätze',
      p1Title: '100% Für Immer Kostenlos',
      p1Desc:
        'Zehnfingersystem ist eine fundamentale Kernkompetenz. Alle Lektionen sind ohne Bezahlschranken verfügbar.',
      p2Title: 'Datenschutz Durch Design',
      p2Desc:
        'Tastaturdaten verbleiben sicher in deinem lokalen Browser-Speicher. Wir verkaufen keine Daten.',
      p3Title: 'Ergonomie Zuerst',
      p3Desc:
        'Geschwindigkeit zählt nur mit gesunden Handgelenken. Wir schulen entspannte Handhaltung.',
    },
    contact: {
      badge: 'Wir Freuen Uns Auf Deine Nachricht',
      title: 'Kontakt & Support',
      subtitle:
        'Hast du Feedback, einen Fehler entdeckt oder möchtest du TypingBull an deiner Schule einsetzen? Schreib uns!',
      directTitle: 'Direkte Anfragen',
      supportLabel: 'Hilfe & Support',
      feedbackLabel: 'Feedback & Ideen',
      privacyLabel: 'Datenschutz & Recht',
      responseTime: 'Antwortzeit: In der Regel binnen 24–48 Stunden',
      globalNote: 'Mit ❤️ für Lernende auf der ganzen Welt entwickelt',
      faqTitle: 'Schnelle Antworten gesucht?',
      faqDesc: 'Lies unsere 15-teilige Wissensdatenbank zu WPM-Berechnung, Fehlern und Spieletipps.',
      faqLink: 'Zu den FAQs →',
      formTitle: 'Nachricht Senden',
      formDesc: 'Fülle das Formular aus und unser Team meldet sich schnellstmöglich bei dir.',
      nameLabel: 'Dein Name',
      namePlaceholder: 'Max Schreiber',
      emailLabel: 'E-Mail-Adresse',
      emailPlaceholder: 'max@beispiel.de',
      categoryLabel: 'Kategorie',
      messageLabel: 'Nachricht',
      messagePlaceholder: 'Wie können wir dir helfen? Teile deine Gedanken mit uns...',
      btnSend: 'Nachricht Absenden',
      btnSending: 'Wird gesendet...',
      successTitle: 'Nachricht Gesendet! 🚀',
      successDesc: 'Vielen Dank für deine Nachricht. Wir melden uns in Kürze bei dir.',
      btnSendAnother: 'Weitere Nachricht Senden',
    },
    privacy: {
      badge: 'Datenschutz & Vertrauen',
      title: 'Datenschutzerklärung',
      updated: 'Stand: 5. September 2026 • Version 2.0',
      card1Title: 'Lokaler Speicher',
      card1Desc: 'Deine Tastaturanschläge und Lektionen werden sicher im localStorage deines Browsers gespeichert.',
      card2Title: 'Kein Datenverkauf',
      card2Desc: 'Wir verkaufen, vermieten oder teilen deine Lerndaten unter keinen Umständen mit Werbenetzwerken.',
      card3Title: 'Jugendschutz',
      card3Desc: 'Wir erfassen keine personenbezogenen Daten von Schülern oder Kindern unter 13 Jahren.',
      s1Title: '1. Erfasste Daten',
      s1Content:
        'TypingBull arbeitet mit lokalem Datenschutz. Leistungsstatistiken verbleiben direkt auf deinem Endgerät.',
      s2Title: '2. Lokale Speicherung',
      s2Content:
        'Deine Serien und Highscores verbleiben im Browser. Du hast die volle Hoheit und kannst sie jederzeit löschen.',
      s3Title: '3. Drittanbieter',
      s3Content:
        'Wir binden keine invasiven Tracking-Dienste oder Werbenetzwerke ein.',
      s4Title: '4. Kontakt',
      s4Content:
        'Bei Fragen zum Datenschutz wende dich bitte an privacy@typingbull.com.',
    },
    terms: {
      badge: 'Nutzungsbedingungen',
      title: 'Allgemeine Bedingungen',
      updated: 'Stand: 5. September 2026 • Version 2.0',
      card1Title: 'Freie Nutzung',
      card1Desc: 'Kostenlose Nutzung für Privatanwender, Schulen, Universitäten und Coding-Bootcamps.',
      card2Title: 'Faires Tippen',
      card2Desc: 'Automatisierte Bots oder gefälschte Highscores schaden der Lerngemeinschaft.',
      card3Title: 'Schullizenz',
      card3Desc: 'Schulklassen können TypingBull ohne jegliche Lizenzgebühren dauerhaft nutzen.',
      s1Title: '1. Geltungsbereich',
      s1Content:
        'Mit der Nutzung von TypingBull stimmst du diesen Bedingungen verbindlich zu.',
      s2Title: '2. Bildungszweck',
      s2Content:
        'Die Plattform dient dem fairen und nachhaltigen Erlernen des Zehnfingersystems.',
      s3Title: '3. Geistiges Eigentum',
      s3Content:
        'Alle Grafiken, Level-Designs, Soundeffekte und Maskottchen sind geistiges Eigentum von TypingBull.',
      s4Title: '4. Haftungsausschluss',
      s4Content:
        'Die Bereitstellung erfolgt ohne Gewähr für ständige und ununterbrochene Verfügbarkeit.',
    },
  },
  pt: {
    about: {
      badge: 'Nossa História & Missão',
      heroTitle: 'Dominar o Teclado Não Deve Parecer Uma Lição Chata.',
      heroSubtitle:
        'TypingBull foi criado para reinventar o ensino de digitação: combinando progressão cognitiva estruturada, jogos arcade velozes e diagnósticos de IA em uma experiência 100% gratuita.',
      btnStart: 'Começar a Aprender Grátis',
      btnGames: 'Jogar Agora',
      mascotBadge: 'Conheça o BullBot 🐂',
      mascotTitle: 'Seu Treinador de Digitação Guiado por Dados',
      mascotDesc:
        'O BullBot monitora intervalos de milissegundos, identifica dedos com hesitação e recomenda treinos personalizados para acelerar seu ritmo.',
      pillarsTitle: 'Como o TypingBull Reinventa o Aprendizado',
      pillarsSubtitle: 'Construído com base na neurociência moderna e ciclos interativos de retorno.',
      pillar1Title: 'A Grande Ferrovia de Digitação',
      pillar1Desc:
        'Progressão ferroviária que apresenta uma tecla por vez: linha base (saliências F e J), linha superior, linha inferior e símbolos de código.',
      pillar2Title: 'Modos Arcade com Velocidade',
      pillar2Desc:
        'Da física suave de Lilypad Leap ao asfalto dinâmico de Neon Velocity, os jogos tornam a prática agradável e natural.',
      pillar3Title: 'Diagnóstico Profundo de Toques',
      pillar3Desc:
        'Mapeamos se a queda de PPM vem do dedo mindinho ou do cansaço físico após minutos de digitação.',
      pillar4Title: 'Layouts Globais e Regionais',
      pillar4Desc:
        'Suporte completo a QWERTY ABNT2, AZERTY, QWERTZ e leiautes internacionais com teclado visual dinâmico.',
      principlesTitle: 'Nossos Princípios Fundamentais',
      p1Title: '100% Grátis Para Sempre',
      p1Desc:
        'A digitação ao toque é essencial no século XXI. Todas as lições e jogos são abertos sem custos.',
      p2Title: 'Privacidade Por Padrão',
      p2Desc:
        'Seus toques ficam armazenados com segurança no seu navegador. Não vendemos dados de ninguém.',
      p3Title: 'Ergonomia em Primeiro Lugar',
      p3Desc:
        'Velocidade sem saúde nos pulsos não tem valor. Ensinamos postura relaxada e movimentos conscientes.',
    },
    contact: {
      badge: 'Adoraríamos Falar Com Você',
      title: 'Contato & Suporte',
      subtitle:
        'Tem sugestões, encontrou um bug ou quer levar o TypingBull para sua escola? Mande uma mensagem!',
      directTitle: 'Canais Diretos',
      supportLabel: 'Suporte & Ajuda',
      feedbackLabel: 'Sugestões & Ideias',
      privacyLabel: 'Privacidade & Legal',
      responseTime: 'Tempo de resposta: Geralmente entre 24 e 48 horas',
      globalNote: 'Distribuído com ❤️ para alunos em todos os cantos do mundo',
      faqTitle: 'Procurando respostas rápidas?',
      faqDesc: 'Acesse nossa central de ajuda com 15 tópicos sobre cálculo de PPM, teclas fracas e dicas de jogos.',
      faqLink: 'Ver Perguntas Frequentes →',
      formTitle: 'Envie uma Mensagem',
      formDesc: 'Preencha o formulário e nosso time retornará o mais rápido possível.',
      nameLabel: 'Seu Nome',
      namePlaceholder: 'Lucas Digitador',
      emailLabel: 'E-mail',
      emailPlaceholder: 'lucas@exemplo.com.br',
      categoryLabel: 'Categoria',
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Como podemos ajudar você? Conte para nós...',
      btnSend: 'Enviar Mensagem',
      btnSending: 'Enviando...',
      successTitle: 'Mensagem Enviada! 🚀',
      successDesc: 'Obrigado por entrar em contato. Responderemos o quanto antes.',
      btnSendAnother: 'Enviar Outra Mensagem',
    },
    privacy: {
      badge: 'Privacidade & Confiança',
      title: 'Política de Privacidade',
      updated: 'Última atualização: 5 de setembro de 2026 • Versão 2.0',
      card1Title: 'Armazenamento Local',
      card1Desc: 'Suas métricas e conquistas são salvas com segurança no armazenamento local do navegador.',
      card2Title: 'Zero Venda de Dados',
      card2Desc: 'Nunca vendemos nem repassamos suas informações a redes publicitárias.',
      card3Title: 'Proteção a Menores',
      card3Desc: 'Não coletamos dados de identificação de estudantes ou menores de 13 anos.',
      s1Title: '1. Informações Coletadas',
      s1Content:
        'O TypingBull opera com privacidade total. As velocidades e mapas de calor ficam no seu próprio dispositivo.',
      s2Title: '2. Funcionamento Local',
      s2Content:
        'Tudo é guardado no localStorage do seu navegador e você pode apagar seus dados quando quiser.',
      s3Title: '3. Parceiros e Rastreamento',
      s3Content:
        'Não utilizamos rastreadores de vigilância nem anúncios invasivos.',
      s4Title: '4. Fale Conosco',
      s4Content:
        'Para dúvidas sobre privacidade, envie um e-mail para privacy@typingbull.com.',
    },
    terms: {
      badge: 'Termos da Plataforma',
      title: 'Termos e Condições',
      updated: 'Última atualização: 5 de setembro de 2026 • Versão 2.0',
      card1Title: 'Uso Gratuito',
      card1Desc: 'Livre para uso individual, colégios, cursos e educadores domésticos.',
      card2Title: 'Jogo Limpo',
      card2Desc: 'Scripts de digitação automatizada ou manipulação de placar prejudicam a comunidade.',
      card3Title: 'Licença Escolar',
      card3Desc: 'Instituições de ensino podem adotar o TypingBull gratuitamente sem taxas.',
      s1Title: '1. Aceitação dos Termos',
      s1Content:
        'Ao navegar no TypingBull, você concorda com estes Termos e Condições.',
      s2Title: '2. Finalidade Educativa',
      s2Content:
        'O serviço é dedicado ao aperfeiçoamento da habilidade de digitação.',
      s3Title: '3. Propriedade Intelectual',
      s3Content:
        'Todos os gráficos, personagens e sons pertencem exclusivamente ao TypingBull.',
      s4Title: '4. Isenção de Garantias',
      s4Content:
        'O serviço é oferecido "como está", sem garantia de disponibilidade ininterrupta.',
    },
  },
  it: {
    about: {
      badge: 'La Nostra Storia & Missione',
      heroTitle: 'Imparare a Digitare Non Deve Sembrare Un Compito Noioso.',
      heroSubtitle:
        'TypingBull reinventa la dattilografia unendo progressione didattica, giochi arcade ritmati e diagnosi IA in un percorso 100% gratuito.',
      btnStart: 'Inizia Gratis',
      btnGames: 'Gioca ai Giochi',
      mascotBadge: 'Incontra BullBot 🐂',
      mascotTitle: 'Il Tuo Tutor Dattilo Guidato dai Dati',
      mascotDesc:
        'BullBot analizza la cadenza di ogni tasto, individua le esitazioni delle dita e fornisce consigli precisi per superare i blocchi.',
      pillarsTitle: 'Come TypingBull Rivoluziona l’Apprendimento',
      pillarsSubtitle: 'Creato con la moderna scienza cognitiva e cicli di feedback immediato.',
      pillar1Title: 'La Grande Ferrovia Dattilo',
      pillar1Desc:
        'Una ferrovia che introduce un tasto per volta: riga base (tasti F e J), riga superiore, inferiore e simboli.',
      pillar2Title: 'Modalità Arcade Veloci',
      pillar2Desc:
        'Da Lilypad Leap alle autostrade synthwave di Neon Velocity, i giochi rendono l’esercizio coinvolgente.',
      pillar3Title: 'Diagnostica Approfondita',
      pillar3Desc:
        'Calcoliamo le pause in millisecondi per capire se il rallentamento dipende dal mignolo o dalla fatica.',
      pillar4Title: 'Layout Internazionali',
      pillar4Desc:
        'Supporto per QWERTY italiano, AZERTY, QWERTZ e tastiere regionali con layout visivo dinamico.',
      principlesTitle: 'I Nostri Valori',
      p1Title: '100% Gratis Per Sempre',
      p1Desc:
        'La dattilografia è un’abilità essenziale. Tutte le lezioni sono libere da abbonamenti o pagamenti.',
      p2Title: 'Privacy Fin dall’Origine',
      p2Desc:
        'I dati di digitazione restano nella memoria locale del tuo browser. Nessun dato viene venduto.',
      p3Title: 'Ergonomia al Primo Posto',
      p3Desc:
        'La velocità non ha senso senza benessere per polsi e dita. Insegniamo movimenti morbidi e rilassati.',
    },
    contact: {
      badge: 'Siamo Felici di Ascoltarti',
      title: 'Contatto & Supporto',
      subtitle:
        'Hai un suggerimento, un problema da segnalare o vuoi usare TypingBull a scuola? Scrivici!',
      directTitle: 'Canali Diretti',
      supportLabel: 'Supporto & Assistenza',
      feedbackLabel: 'Idee & Suggerimenti',
      privacyLabel: 'Privacy & Note Legali',
      responseTime: 'Tempo di risposta: Solitamente entro 24–48 ore',
      globalNote: 'Creato con ❤️ per studenti e appassionati in tutto il mondo',
      faqTitle: 'Cerchi risposte immediate?',
      faqDesc: 'Consulta la nostra guida con 15 domande su calcolo PPM, tasti deboli e consigli.',
      faqLink: 'Vai alle FAQ →',
      formTitle: 'Invia un Messaggio',
      formDesc: 'Compila il modulo e ti risponderemo il prima possibile.',
      nameLabel: 'Il Tuo Nome',
      namePlaceholder: 'Marco Dattilografo',
      emailLabel: 'Indirizzo E-mail',
      emailPlaceholder: 'marco@esempio.it',
      categoryLabel: 'Categoria',
      messageLabel: 'Messaggio',
      messagePlaceholder: 'Scrivici come possiamo aiutarti o condividi le tue idee...',
      btnSend: 'Invia Messaggio',
      btnSending: 'Invio in corso...',
      successTitle: 'Messaggio Inviato! 🚀',
      successDesc: 'Grazie per averci scritto. Ti risponderemo presto.',
      btnSendAnother: 'Invia un Altro Messaggio',
    },
    privacy: {
      badge: 'Privacy & Fiducia',
      title: 'Informativa sulla Privacy',
      updated: 'Aggiornato: 5 settembre 2026 • Versione 2.0',
      card1Title: 'Archiviazione Locale',
      card1Desc: 'I tuoi progressi e le statistiche sono memorizzati al sicuro nel localStorage del tuo dispositivo.',
      card2Title: 'Nessuna Vendita di Dati',
      card2Desc: 'Non condividiamo né monetizziamo i tuoi dati di digitazione con agenzie pubblicitarie.',
      card3Title: 'Tutela dei Minori',
      card3Desc: 'Non richiediamo informazioni identificative a studenti o minori di 13 anni.',
      s1Title: '1. Dati Raccolti',
      s1Content:
        'TypingBull tutela la privacy. I dati delle pulsazioni servono unicamente a creare la tua mappa di calore locale.',
      s2Title: '2. Memoria Locale',
      s2Content:
        'Tutti i punteggi restano nel tuo browser e possono essere azzerati quando preferisci.',
      s3Title: '3. Servizi di Terze Parti',
      s3Content:
        'Non usiamo tracker invadenti o circuiti di banner pubblicitari.',
      s4Title: '4. Contatti Privacy',
      s4Content:
        'Per informazioni sui dati, scrivi a privacy@typingbull.com.',
    },
    terms: {
      badge: 'Condizioni del Servizio',
      title: 'Termini e Condizioni',
      updated: 'Aggiornato: 5 settembre 2026 • Versione 2.0',
      card1Title: 'Uso Libero',
      card1Desc: 'Accesso gratuito per studio personale, scuole, università e docenti.',
      card2Title: 'Gioco Corretto',
      card2Desc: 'Script di battitura automatica o trucchi falsano la graduatoria della community.',
      card3Title: 'Licenza per Scuole',
      card3Desc: 'Istituti scolastici possono adottare TypingBull senza sostenere costi di licenza.',
      s1Title: '1. Accettazione dei Termini',
      s1Content:
        'L’uso di TypingBull comporta l’accettazione integrale di queste condizioni.',
      s2Title: '2. Scopo Educativo',
      s2Content:
        'La piattaforma è dedicata all’apprendimento sereno ed efficace della dattilografia.',
      s3Title: '3. Proprietà Intellettuale',
      s3Content:
        'La grafica, i personaggi, le tracce e i suoni sono proprietà esclusiva di TypingBull.',
      s4Title: '4. Limitazione di Responsabilità',
      s4Content:
        'Il servizio è fornito "così com’è" senza garanzia di funzionamento ininterrotto.',
    },
  },
  ja: {
    about: {
      badge: '私たちのストーリー＆ミッション',
      heroTitle: 'タイピングの習得は、退屈な宿題であってはならない。',
      heroSubtitle:
        'TypingBullはタイピング教育を革新するために誕生しました。体系的な認知ステップ、爽快なアーケードゲーム、そして生成AIによる分析を融合した完全無料の学習体験を提供します。',
      btnStart: '無料で学び始める',
      btnGames: 'ゲームで遊ぶ',
      mascotBadge: 'BullBot（ブルボット）紹介 🐂',
      mascotTitle: 'データで伴走する心強いタイピングパートナー',
      mascotDesc:
        'BullBotはただのマスコットではありません。キー打鍵ごとのミリ秒単位の速度や指の迷いを分析し、苦手キーのヒートマップと的確な練習ドリルを提示します。',
      pillarsTitle: 'TypingBullが学習を革新する方法',
      pillarsSubtitle: '認知科学とリアルタイムフィードバックの力で、無理なく自然にブラインドタッチを習得。',
      pillar1Title: 'タイピング・レイルウェイ（鉄道マップ）',
      pillar1Desc:
        'ホームポジション（FとJの突起）から始め、上段・下段、記号へと1本ずつ確実に指の配置を広げる安心カリキュラム。',
      pillar2Title: 'ゲーム感覚のスピードモード',
      pillar2Desc:
        'カエルが跳ねる「Lilypad Leap」から、サイバーなハイウェイを疾走する「Neon Velocity」まで、楽しみながらフロー状態へ導きます。',
      pillar3Title: 'ミリ秒単位の打鍵診断',
      pillar3Desc:
        '小指の届きにくさや長文でのスタミナ低下など、速度が落ちる真の原因を的確に解き明かします。',
      pillar4Title: '世界中のキーボード配列に対応',
      pillar4Desc:
        '日本語JIS配列やUS QWERTY、フランスAZERTY、ドイツQWERTZなど、多彩なレイアウトを視覚的にサポート。',
      principlesTitle: '私たちが大切にするコア原則',
      p1Title: '永久に完全無料',
      p1Desc:
        'タッチタイピングは現代の必須リテラシーです。すべてのレッスンやゲームを有料の壁なしで提供します。',
      p2Title: 'プライバシー最優先設計',
      p2Desc:
        '打鍵データはお使いのブラウザ内にローカル保存されます。個人データを収集・販売することは一切ありません。',
      p3Title: '人間工学と手首の健康',
      p3Desc:
        '無理な連打よりもリラックスした姿勢を推奨。手首を傷めず長く快適に打てる正しいフォームを育てます。',
    },
    contact: {
      badge: 'ご意見をお聞かせください',
      title: 'お問い合わせ＆サポート',
      subtitle:
        'フィードバック、バグの報告、学校や教育機関での導入相談など、お気軽にお問い合わせください。',
      directTitle: '直接のお問い合わせ窓口',
      supportLabel: 'サポート＆ヘルプ',
      feedbackLabel: 'ご意見＆アイデア',
      privacyLabel: 'プライバシー＆法務',
      responseTime: '回答目安：通常24〜48時間以内',
      globalNote: '世界中のタイピング学習者のために愛を込めて運営中 ❤️',
      faqTitle: 'よくある質問をお探しですか？',
      faqDesc: 'WPM計算式や苦手キー克服法、ゲームのコツをまとめた15のFAQをご覧ください。',
      faqLink: 'よくある質問を見る →',
      formTitle: 'メッセージを送る',
      formDesc: '以下のフォームにご入力の上、送信してください。担当者より折り返しご連絡いたします。',
      nameLabel: 'お名前',
      namePlaceholder: 'タイピング 太郎',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'taro@example.jp',
      categoryLabel: 'お問い合わせ項目',
      messageLabel: 'お問い合わせ内容',
      messagePlaceholder: 'ご相談内容やアイデアをご自由にお書きください...',
      btnSend: 'メッセージを送信',
      btnSending: '送信中...',
      successTitle: '送信完了しました！ 🚀',
      successDesc: 'お問い合わせありがとうございます。内容を確認次第、速やかにご返信いたします。',
      btnSendAnother: '別のメッセージを送る',
    },
    privacy: {
      badge: 'プライバシーと信頼',
      title: 'プライバシーポリシー',
      updated: '最終更新日: 2026年9月5日 • バージョン 2.0',
      card1Title: 'ローカル保存方式',
      card1Desc: 'タイピング履歴や進捗データは、お使いの端末ブラウザ内（localStorage）に安全に保存されます。',
      card2Title: 'データ売買ゼロ',
      card2Desc: '学習データやお問い合わせ情報を外部の広告ネットワークや仲買業者に提供・販売することはありません。',
      card3Title: '青少年の保護',
      card3Desc: '13歳未満のお子様や児童生徒から個人を特定可能な情報を収集することはありません。',
      s1Title: '1. 取得する情報について',
      s1Content:
        'TypingBullはプライバシーを最優先に設計されています。匿名の打鍵速度や苦手キー分析は端末内で処理されます。',
      s2Title: '2. ローカルストレージの運用',
      s2Content:
        '連続記録やスコアはお客様の端末に保存され、ブラウザのデータ消去機能によりいつでもリセット可能です。',
      s3Title: '3. 外部トラッカーの不使用',
      s3Content:
        '侵略的な行動追跡や広告表示のためのサードパーティトラッカーは採用しておりません。',
      s4Title: '4. お問い合わせ先',
      s4Content:
        'プライバシーに関するご質問は privacy@typingbull.com までご連絡ください。',
    },
    terms: {
      badge: '利用規約',
      title: 'プラットフォーム利用規約',
      updated: '最終更新日: 2026年9月5日 • バージョン 2.0',
      card1Title: '自由な利用',
      card1Desc: '個人の練習、小中高大学の授業、プログラミングスクールでの利用を歓迎します。',
      card2Title: '公平なプレイ',
      card2Desc: 'マクロや自動化ボットによるスコア操作は、公平なコミュニティのために禁止されています。',
      card3Title: '教育機関向け無償提供',
      card3Desc: '学校や教育団体は追加のライセンス費用なしで無償導入いただけます。',
      s1Title: '1. 規約への同意',
      s1Content:
        'TypingBullをご利用いただくことで、本規約に同意したものとみなされます。',
      s2Title: '2. 教育目的の適切な利用',
      s2Content:
        '本サービスは健全なタイピングスキル向上のために提供されています。サーバー妨害行為等は固く禁止します。',
      s3Title: '3. 知的財産権',
      s3Content:
        'サイト上のイラスト、キャラクター、ゲームシステム、音声はTypingBullの著作物です。',
      s4Title: '4. 免責事項',
      s4Content:
        '本サービスは現状有姿で提供され、中断のない継続的運用を保証するものではありません。',
    },
  },
  ko: {
    about: {
      badge: '우리의 이야기와 사명',
      heroTitle: '키보드 연습은 지루한 숙제가 되어서는 안 됩니다.',
      heroSubtitle:
        'TypingBull은 체계적인 두뇌 인지 훈련, 속도감 넘치는 아케이드 게임, 생성형 AI 분석을 결합하여 100% 무료로 즐겁게 배우는 타자 교육을 제공합니다.',
      btnStart: '무료로 학습 시작하기',
      btnGames: '게임 플레이',
      mascotBadge: '불봇(BullBot)을 만나보세요 🐂',
      mascotTitle: '데이터로 함께 달리는 든든한 타자 코치',
      mascotDesc:
        'BullBot은 단순한 캐릭터가 아닙니다. 키 입력 간격과 특정 손가락의 머뭇거림을 진단하여 취약 키 히트맵과 맞춤형 연습 처방을 제공합니다.',
      pillarsTitle: 'TypingBull이 타자 학습을 혁신하는 방법',
      pillarsSubtitle: '현대 인지과학과 즉각적인 피드백 루프를 기반으로 설계되었습니다.',
      pillar1Title: '타이핑 철도 여정 (Railway)',
      pillar1Desc:
        '홈 로우 자리(F, J 돌기)부터 윗줄, 아랫줄, 숫자, 특수 기호까지 손가락 좌표를 하나씩 완성해 나가는 체계적인 로드맵.',
      pillar2Title: '게임형 속도 향상 모드',
      pillar2Desc:
        '연못을 건너는 Lilypad Leap부터 사이버 고속도로를 질주하는 Neon Velocity까지, 지루한 반복을 몰입감으로 바꿉니다.',
      pillar3Title: '밀리초 단위 타건 정밀 분석',
      pillar3Desc:
        '새끼손가락의 도달 속도와 장시간 타이핑 시 피로도 저하를 정밀 감지하여 원인을 정확히 찾아냅니다.',
      pillar4Title: '글로벌 키보드 배열 지원',
      pillar4Desc:
        '한국어 2벌식, 영문 QWERTY, 프랑스 AZERTY, 독일 QWERTZ 등 다양한 자판 레이아웃을 지원합니다.',
      principlesTitle: '우리의 핵심 원칙',
      p1Title: '언제나 100% 무료',
      p1Desc:
        '타이핑은 21세기 디지털 시대의 기본 소양입니다. 모든 강의와 게임은 유료 결제 없이 완전 개방됩니다.',
      p2Title: '철저한 프라이버시 보호',
      p2Desc:
        '타건 데이터는 사용자의 브라우저 로컬 저장소에만 보관됩니다. 어떠한 개인정보도 외부에 판매하지 않습니다.',
      p3Title: '손목 건강과 인체공학 우선',
      p3Desc:
        '속도보다 중요한 것은 올바른 자세입니다. 손목에 무리가 가지 않는 부드럽고 릴랙스한 타건을 지향합니다.',
    },
    contact: {
      badge: '여러분의 의견을 환영합니다',
      title: '문의 및 고객지원',
      subtitle:
        '피드백, 버그 제보, 학교 및 교육 기관 도입 문의 등 무엇이든 편하게 남겨주세요!',
      directTitle: '직접 문의 안내',
      supportLabel: '지원 및 도움말',
      feedbackLabel: '피드백 및 아이디어',
      privacyLabel: '개인정보 및 법무',
      responseTime: '응답 시간: 보통 24~48시간 이내 회신',
      globalNote: '전 세계 학습자들을 위해 진심을 담아 서비스합니다 ❤️',
      faqTitle: '빠른 답변이 필요하신가요?',
      faqDesc: 'WPM 계산법, 취약 키 극복 팁, 게임 공략이 담긴 15가지 자주 묻는 질문을 확인하세요.',
      faqLink: '자주 묻는 질문 보기 →',
      formTitle: '메시지 보내기',
      formDesc: '아래 양식을 작성해 주시면 담당 팀에서 확인 후 빠르게 답변드리겠습니다.',
      nameLabel: '이름',
      namePlaceholder: '김타자',
      emailLabel: '이메일 주소',
      emailPlaceholder: 'taja@example.kr',
      categoryLabel: '문의 유형',
      messageLabel: '문의 내용',
      messagePlaceholder: '도움이 필요한 내용이나 의견을 자유롭게 적어주세요...',
      btnSend: '메시지 전송',
      btnSending: '전송 중...',
      successTitle: '메시지가 전송되었습니다! 🚀',
      successDesc: '문의해 주셔서 감사합니다. 내용을 검토한 후 빠르게 회신해 드리겠습니다.',
      btnSendAnother: '다른 메시지 작성하기',
    },
    privacy: {
      badge: '개인정보 및 신뢰',
      title: '개인정보 처리방침',
      updated: '최종 수정일: 2026년 9월 5일 • 버전 2.0',
      card1Title: '로컬 우선 저장',
      card1Desc: '사용자의 타건 데이터와 학습 진도는 브라우저 localStorage에 안전하게 보관됩니다.',
      card2Title: '데이터 판매 제로',
      card2Desc: '타자 연습 기록이나 연락처를 광고 기업 등에 절대 제공하거나 판매하지 않습니다.',
      card3Title: '어린이 보호 준수',
      card3Desc: '13세 미만 아동이나 학생의 개인 식별 정보를 수집하지 않습니다.',
      s1Title: '1. 수집하는 정보',
      s1Content:
        'TypingBull은 프라이버시를 최우선으로 합니다. WPM 통계와 히트맵은 사용자 기기 내에서만 처리됩니다.',
      s2Title: '2. 로컬 스토리지 보관',
      s2Content:
        '학습 스트릭과 획득 점수는 브라우저에 저장되며, 사용자가 원할 때 언제든지 직접 삭제할 수 있습니다.',
      s3Title: '3. 외부 트래커 배제',
      s3Content:
        '광고 목적의 악성 트래커나 사용자 감시 스크립트를 사용하지 않습니다.',
      s4Title: '4. 문의하기',
      s4Content:
        '개인정보 관련 문의는 privacy@typingbull.com으로 메일을 보내주시기 바랍니다.',
    },
    terms: {
      badge: '이용약관',
      title: '서비스 이용약관',
      updated: '최종 수정일: 2026년 9월 5일 • 버전 2.0',
      card1Title: '자유로운 이용',
      card1Desc: '개인 연습, 학교 수업, 코딩 부트캠프에서 무료로 활용하실 수 있습니다.',
      card2Title: '공정한 연습',
      card2Desc: '매크로나 자동화 봇을 통한 점수 조작은 커뮤니티 신뢰를 위해 금지됩니다.',
      card3Title: '교육기관 무상 라이선스',
      card3Desc: '학교와 교육 단체는 별도 라이선스 비용 없이 무상으로 도입 가능합니다.',
      s1Title: '1. 약관의 동의',
      s1Content:
        'TypingBull을 이용함으로써 본 이용약관의 모든 조항에 동의하는 것으로 간주됩니다.',
      s2Title: '2. 교육적 목적과 올바른 이용',
      s2Content:
        '본 플랫폼은 타자 실력 증진을 위한 공간입니다. 서비스 방해 행위는 제한될 수 있습니다.',
      s3Title: '3. 지식재산권',
      s3Content:
        '사이트 내 디자인, 게임 엔진, 캐릭터, 음향은 TypingBull의 고유 자산입니다.',
      s4Title: '4. 책임의 한계',
      s4Content:
        '본 서비스는 있는 그대로 제공되며 시스템 무중단 운영을 보증하지는 않습니다.',
    },
  },
  hi: {
    about: {
      badge: 'हमारी कहानी और मिशन',
      heroTitle: 'टाइपिंग सीखना उबाऊ होमवर्क जैसा नहीं लगना चाहिए।',
      heroSubtitle:
        'TypingBull को टच टाइपिंग शिक्षा को नया रूप देने के लिए बनाया गया है: संरचित सीखने के चरण, आर्केड स्पीड गेम्स और AI विश्लेषण का एक 100% मुफ्त, आनंदमय अनुभव।',
      btnStart: 'मुफ्त सीखना शुरू करें',
      btnGames: 'गेम्स खेलें',
      mascotBadge: 'मिलिए बुलबॉट (BullBot) से 🐂',
      mascotTitle: 'आपका उत्साही, डेटा-संचालित टाइपिंग साथी',
      mascotDesc:
        'बुलबॉट केवल एक शुभंकर नहीं है। यह आपकी कीस्ट्रोक गति की निगरानी करता है, कमजोर उंगलियों की पहचान करता है और बातचीत में उपयोगी सुझाव देता है।',
      pillarsTitle: 'TypingBull सीखने के तरीके को कैसे बदलता है',
      pillarsSubtitle: 'आधुनिक संज्ञानात्मक विज्ञान और इंटरैक्टिव फीडबैक लूप्स पर आधारित।',
      pillar1Title: 'द ग्रेट टाइपिंग रेलवे',
      pillar1Desc:
        'एक चरणबद्ध रेलवे मार्ग जो एक समय में एक उंगली का समन्वय सिखाता है: होम रो से लेकर टॉप रो, बॉटम रो और कोडिंग प्रतीकों तक।',
      pillar2Title: 'गेमिफाइड स्पीड मोड्स',
      pillar2Desc:
        'लिलीपैड लीप के शांत वातावरण से लेकर नियॉन वेलोसिटी के साइबर ट्रैक तक, हमारे गेम्स अभ्यास को मजेदार बनाते हैं।',
      pillar3Title: 'गहरा कीस्ट्रोक विश्लेषण',
      pillar3Desc:
        'हर की-प्रेस मिलीसेकंड समय को रिकॉर्ड करता है, जिससे पता चलता है कि गति छोटी उंगली के कारण धीमी है या थकान के कारण।',
      pillar4Title: 'वैश्विक और भारतीय लेआउट्स',
      pillar4Desc:
        'TypingBull भारतीय टाइपिंग लेआउट्स (इनस्क्रिप्ट और रेमिंगटन) के साथ-साथ QWERTY और अंतरराष्ट्रीय कीबोर्ड्स को सपोर्ट करता है।',
      principlesTitle: 'हमारे मूल सिद्धांत',
      p1Title: 'हमेशा के लिए 100% मुफ्त',
      p1Desc:
        'हमारा मानना है कि टाइपिंग 21वीं सदी का एक मौलिक कौशल है। सभी पाठ और गेम्स बिना किसी शुल्क के उपलब्ध हैं।',
      p2Title: 'गोपनीयता प्राथमिकता',
      p2Desc:
        'आपकी टाइपिंग जानकारी आपके ब्राउज़र में सुरक्षित रहती है। हम निजी डेटा कभी नहीं बेचते हैं।',
      p3Title: 'आराम और सही मुद्रा',
      p3Desc:
        'कलाई के स्वास्थ्य के बिना गति का कोई मूल्य नहीं है। हम तनावमुक्त मुद्रा और सुरक्षित टाइपिंग पर जोर देते हैं।',
    },
    contact: {
      badge: 'हम आपसे जुड़ना चाहते हैं',
      title: 'संपर्क और सहायता',
      subtitle:
        'क्या आपके पास कोई सुझाव है, बग मिला है या अपने स्कूल में TypingBull शुरू करना चाहते हैं? हमें लिखें!',
      directTitle: 'सीधे संपर्क सूत्र',
      supportLabel: 'सहायता और सपोर्ट',
      feedbackLabel: 'सुझाव और विचार',
      privacyLabel: 'गोपनीयता और कानूनी',
      responseTime: 'जवाब का समय: आमतौर पर 24–48 घंटे के भीतर',
      globalNote: 'दुनिया भर के सभी शिक्षार्थियों के लिए प्रेम से निर्मित ❤️',
      faqTitle: 'त्वरित उत्तर खोज रहे हैं?',
      faqDesc: 'WPM गणना, कमजोर कीज़ और गेम युक्तियों पर हमारी 15-प्रश्नों वाली ज्ञान मार्गदर्शिका देखें।',
      faqLink: 'अक्सर पूछे जाने वाले प्रश्न देखें →',
      formTitle: 'संदेश भेजें',
      formDesc: 'नीचे दिया गया फॉर्म भरें और हमारी टीम आपसे जल्द से जल्द संपर्क करेगी।',
      nameLabel: 'आपका नाम',
      namePlaceholder: 'राहुल टाइपिस्ट',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'rahul@example.in',
      categoryLabel: 'पूछताछ की श्रेणी',
      messageLabel: 'संदेश',
      messagePlaceholder: 'बताएं कि हम आपकी क्या मदद कर सकते हैं...',
      btnSend: 'संदेश भेजें',
      btnSending: 'भेजा जा रहा है...',
      successTitle: 'संदेश सफलतापूर्वक भेजा गया! 🚀',
      successDesc: 'संपर्क करने के लिए धन्यवाद। हमें आपका संदेश मिल गया है और हम जल्द ही जवाब देंगे।',
      btnSendAnother: 'दूसरा संदेश भेजें',
    },
    privacy: {
      badge: 'गोपनीयता और विश्वास',
      title: 'गोपनीयता नीति',
      updated: 'अंतिम अपडेट: 5 सितंबर, 2026 • संस्करण 2.0',
      card1Title: 'लोकल-फर्स्ट स्टोरेज',
      card1Desc: 'आपका टाइपिंग अभ्यास डेटा आपके ब्राउज़र के localStorage में पूरी तरह सुरक्षित रहता है।',
      card2Title: 'डेटा बिक्री शून्य',
      card2Desc: 'हम आपकी टाइपिंग जानकारी या संपर्क विवरण को किसी तीसरे पक्ष को कभी नहीं बेचते।',
      card3Title: 'छात्रों की सुरक्षा',
      card3Desc: 'हम 13 वर्ष से कम आयु के बच्चों या छात्रों से व्यक्तिगत पहचान योग्य जानकारी नहीं मांगते।',
      s1Title: '1. हमारे द्वारा एकत्रित जानकारी',
      s1Content:
        'TypingBull पूरी तरह से गोपनीयता का सम्मान करता है। विश्लेषण और हीटमैप आपके अपने डिवाइस पर ही तैयार होते हैं।',
      s2Title: '2. स्थानीय भंडारण की व्यवस्था',
      s2Content:
        'आपके स्ट्रीक और स्कोर आपके डिवाइस पर रहते हैं और आप जब चाहें इन्हें हटा सकते हैं।',
      s3Title: '3. बाहरी ट्रैकर्स का अभाव',
      s3Content:
        'हम किसी भी विज्ञापन नेटवर्क या जासूसी ट्रैकर्स का इस्तेमाल नहीं करते हैं।',
      s4Title: '4. संपर्क करें',
      s4Content:
        'गोपनीयता से जुड़े किसी भी सवाल के लिए कृपया privacy@typingbull.com पर लिखें।',
    },
    terms: {
      badge: 'सेवा की शर्तें',
      title: 'नियम और शर्तें',
      updated: 'अंतिम अपडेट: 5 सितंबर, 2026 • संस्करण 2.0',
      card1Title: 'निःशुल्क उपयोग',
      card1Desc: 'व्यक्तिगत अभ्यास, स्कूलों और कोडिंग बूटकैंप के लिए मुफ्त उपयोग की अनुमति है।',
      card2Title: 'ईमानदार टाइपिंग',
      card2Desc: 'स्वचालित बॉट्स या स्कोर में छेड़छाड़ समुदाय के नियमों के खिलाफ है।',
      card3Title: 'विद्यालयों के लिए छूट',
      card3Desc: 'स्कूल और शिक्षण संस्थान बिना किसी लाइसेंस शुल्क के TypingBull का उपयोग कर सकते हैं।',
      s1Title: '1. शर्तों की स्वीकृति',
      s1Content:
        'TypingBull का उपयोग करके आप इन सभी नियमों और शर्तों से सहमत होते हैं।',
      s2Title: '2. शैक्षिक उद्देश्य',
      s2Content:
        'यह मंच निष्पक्ष रूप से कीबोर्ड सीखने के लिए प्रदान किया गया है।',
      s3Title: '3. बौद्धिक संपदा',
      s3Content:
        'वेबसाइट के ग्राफिक्स, ध्वनियाँ, स्तर और शुभंकर TypingBull की विशेष संपत्ति हैं।',
      s4Title: '4. दायित्व की सीमा',
      s4Content:
        'यह सेवा "जैसी है" वैसी ही प्रदान की जाती है, बिना किसी निरंतर उपलब्धता की गारंटी के।',
    },
  },
};
