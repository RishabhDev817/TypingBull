/**
 * Curated, verified passages for Practice Ground multiplayer races.
 * Balanced lengths (around 180 - 320 characters) designed for 45 to 60 second races.
 * Fully localized across all 9 supported TypingBull languages:
 * en, es, ja, fr, de, pt, ko, it, hi
 */

export interface MultiplayerPassage {
  id: string;
  title: string;
  category: 'Tech & Future' | 'Mindset & Growth' | 'Science & Cosmos' | 'Classic Literature';
  text: string;
}

export const MULTIPLAYER_PASSAGES_BY_LANG: Record<string, MultiplayerPassage[]> = {
  en: [
    {
      id: 'en-mp-1',
      title: 'The Nature of Code',
      category: 'Tech & Future',
      text: 'Code is poetry written with logic and intent. Every function breathes life into silicon, transforming abstract human thoughts into tangible digital experiences that span across the globe in milliseconds.',
    },
    {
      id: 'en-mp-2',
      title: 'Velocity and Precision',
      category: 'Mindset & Growth',
      text: 'Speed is meaningless without accuracy. True mastery comes from calmness, rhythmic finger movement, and trusting the muscle memory developed through thousands of deliberate keystrokes.',
    },
    {
      id: 'en-mp-3',
      title: 'Wonders of the Cosmos',
      category: 'Science & Cosmos',
      text: 'Across billions of light years, silent stars ignite and fade in cosmic balance. We are explorers made of stardust, using keyboards and screens to decipher the grand equations of the universe.',
    },
    {
      id: 'en-mp-4',
      title: 'The Art of Continuous Focus',
      category: 'Mindset & Growth',
      text: 'Focus is not a gift bestowed upon a lucky few, but a muscle strengthened day by day. When distractions fade and fingers dance with purpose, effortless flow takes flight.',
    },
  ],

  es: [
    {
      id: 'es-mp-1',
      title: 'El Valle de la Mañana',
      category: 'Classic Literature',
      text: 'El sol de la mañana se elevaba suavemente sobre las colinas esmeralda, pintando el río con trazos de oro líquido. En el prado de abajo, un joven ciervo se detuvo al borde del manantial cristalino, escuchando las canciones de los primeros petirrojos.',
    },
    {
      id: 'es-mp-2',
      title: 'El Arte de la Precisión',
      category: 'Mindset & Growth',
      text: 'La velocidad carece de sentido sin precisión. La verdadera maestría nace de la calma, el ritmo constante de los dedos y la confianza en la memoria muscular forjada a través de miles de pulsaciones conscientes.',
    },
    {
      id: 'es-mp-3',
      title: 'La Frontera Digital',
      category: 'Tech & Future',
      text: 'La tecnología une a la humanidad a través de océanos y cordilleras. Las ideas compartidas al instante impulsan revoluciones de aprendizaje, creatividad y progreso sin fronteras para las nuevas generaciones.',
    },
    {
      id: 'es-mp-4',
      title: 'Misterios del Cosmos',
      category: 'Science & Cosmos',
      text: 'A través de miles de millones de años luz, las estrellas silenciosas brillan en un cosmos infinito. Somos exploradores hechos de polvo estelar que descifran los enigmas del universo con curiosidad.',
    },
  ],

  ja: [
    {
      id: 'ja-mp-1',
      title: 'Asahi no Komichi (Morning Path)',
      category: 'Classic Literature',
      text: 'Asahi ga midori no oka wo yasashiku terashi, kawa wo sunehre kogane-iro ni somete ikimasu. Kusahara de wa kamoshika ga suzuyaka na izumi no hotori de ashi wo tome, toritachi no utagoe ni mimi wo katamukemashita.',
    },
    {
      id: 'ja-mp-2',
      title: 'Speed to Seikakusa (Velocity & Precision)',
      category: 'Mindset & Growth',
      text: 'Speed wa seikakusa nashi de wa imi ga arimasen. Hontou no tatsujin wa, ochitsuki to yubisaki no rizumu, soshite kasaneta renshuu ni yotte migakareta kin\'niku kioku wo shinjiru koto kara umaremasu.',
    },
    {
      id: 'ja-mp-3',
      title: 'Digital no Mirai (Digital Future)',
      category: 'Tech & Future',
      text: 'Technology wa umi ya yama wo koete hitobito wo tsunagimasu. Shunkan de kyouyuu sareru aidea wa, atarashii jidai no tame no manabi to souzou-ryoku, soshite kagayaku inobeeshon wo umidasu no desu.',
    },
    {
      id: 'ja-mp-4',
      title: 'Uchuu no Shinpi (Cosmic Wonder)',
      category: 'Science & Cosmos',
      text: 'Oku kounen no kanata de, shizuka na hoshizora ga mugen no balance de kagayaite imasu. Watashitachi wa hoshi no kakera de dekita tanken-ka de ari, subete no kotae wo tankyuu shite imasu.',
    },
  ],

  fr: [
    {
      id: 'fr-mp-1',
      title: 'La Vallée des Murmures',
      category: 'Classic Literature',
      text: "Le soleil du matin se levait doucement sur les collines d'émeraude, peignant la rivière de reflets d'or liquide. Dans la prairie, un jeune faon s'arrêta au bord de la source limpide, écoutant le chant mélodieux des premiers merles.",
    },
    {
      id: 'fr-mp-2',
      title: 'Vitesse et Clarté',
      category: 'Mindset & Growth',
      text: 'La vitesse est vaine sans la précision. La véritable maîtrise naît du calme intérieur, du mouvement rythmé des doigts et d’une confiance absolue dans les réflexes acquis par des milliers de frappes.',
    },
    {
      id: 'fr-mp-3',
      title: 'L’Aube Numérique',
      category: 'Tech & Future',
      text: 'La technologie relie les peuples à travers les océans et les sommets. Les idées partagées en un battement de cil éveillent l’apprentissage, la créativité et une soif inépuisable d’innovation.',
    },
    {
      id: 'fr-mp-4',
      title: 'L’Océan Stellaire',
      category: 'Science & Cosmos',
      text: 'À travers des milliards d’années-lumière, les étoiles dansent en équilibre cosmique. Nous sommes des voyageurs faits de poussière d’étoiles, contemplant l’immensité avec émerveillement.',
    },
  ],

  de: [
    {
      id: 'de-mp-1',
      title: 'Morgenglanz im Tal',
      category: 'Classic Literature',
      text: 'Die Morgensonne stieg sanft über den smaragdgrünen Hügeln auf und malte den Fluss mit Strichen aus flüssigem Gold. Auf der Waldwiese hielt ein junges Reh inne und lauschte den klaren Gesängen der ersten Vögel.',
    },
    {
      id: 'de-mp-2',
      title: 'Präzision und Rhythmus',
      category: 'Mindset & Growth',
      text: 'Geschwindigkeit verliert ihren Wert ohne Genauigkeit. Wahre Meisterschaft erwächst aus innerer Ruhe, gleichmäßigem Tastenanschlag und dem Vertrauen in die im Training geschärfte Muskelreflexion.',
    },
    {
      id: 'de-mp-3',
      title: 'Die Digitale Brücke',
      category: 'Tech & Future',
      text: 'Technologie verbindet Menschen über Ozeane und Kontinente hinweg. In Sekundenschnelle geteilte Gedanken entfachen Funken der Bildung, Schöpferkraft und dauerhaften technologischen Zukunft.',
    },
    {
      id: 'de-mp-4',
      title: 'Das Kosmische Konzert',
      category: 'Science & Cosmos',
      text: 'Über Milliarden Lichtjahre hinweg erleuchten Sterne das stille Universum. Wir sind Erkunder aus Sternenstaub, die mit Wissensdrang die zeitlosen Geheimnisse der Schöpfung entschlüsseln.',
    },
  ],

  pt: [
    {
      id: 'pt-mp-1',
      title: 'O Vale Dourado',
      category: 'Classic Literature',
      text: 'O sol da manhã erguia-se suavemente sobre as colinas cor de esmeralda, pintando o rio com traços de ouro líquido. No prado abaixo, um jovem cervo parou junto à nascente cristalina, escutando o canto dos primeiros pássaros.',
    },
    {
      id: 'pt-mp-2',
      title: 'Velocidade e Concentração',
      category: 'Mindset & Growth',
      text: 'A rapidez perde o sentido sem precisão. O verdadeiro domínio surge da serenidade, do movimento cadenciado dos dedos e da confiança na memória muscular desenvolvida com dedicação consciente.',
    },
    {
      id: 'pt-mp-3',
      title: 'A Fronteira Digital',
      category: 'Tech & Future',
      text: 'A tecnologia conecta a humanidade sobre mares e montanhas. Ideias compartilhadas num instante inspiram revoluções no aprendizado, na criatividade e na inovação para as futuras gerações.',
    },
    {
      id: 'pt-mp-4',
      title: 'Luzes do Infinito',
      category: 'Science & Cosmos',
      text: 'Através de bilhões de anos-luz, estrelas silenciosas brilham num equilíbrio cósmico perfeito. Somos exploradores feitos de poeira estelar, decifrando as belezas do universo.',
    },
  ],

  ko: [
    {
      id: 'ko-mp-1',
      title: 'Achim Haessal (Morning Sunlight)',
      category: 'Classic Literature',
      text: 'Achim haessal-i chorokbit eondeok-eul ttatteuthage bichugo, gangmul-eun hwanggeumbit-euro muldeul-eogamnida. Pureun pulbat-eseo eorin saseum-i saemmul gaunde meomchwoseo saedeul-ui noraereul deuleossseumnida.',
    },
    {
      id: 'ko-mp-2',
      title: 'Sokdo wa Jeonghwakdo (Speed & Accuracy)',
      category: 'Mindset & Growth',
      text: 'Jeonghwakdo eomneun sokdo-neun uimi-ga eopseumnida. Jinjeonghan suknryeon-eun chimchakham-gwa son-kkeut-ui rideumgam, geurigo kkeuteomneun yeonseup-eul tonghae hwangnip-doen geunyukgieok-eseo bimrot-doemnida.',
    },
    {
      id: 'ko-mp-3',
      title: 'Digital Hyeoksin (Digital Innovation)',
      category: 'Tech & Future',
      text: 'Gisul-eun bada-wa san-eul neomeo inryu-reul hana-ro yeon-gyeol-hamnida. Sunsikgan-e gong-yudoe-neun aidee-eo-neun baeum-gwa chang-ui-seong, geurigo mirae-reul hyanghan kkeuteomneun baljeon-eul mandeul-eo naemnida.',
    },
    {
      id: 'ko-mp-4',
      title: 'Uju-ui Gyeong-i (Cosmic Wonder)',
      category: 'Science & Cosmos',
      text: 'Su-baek-eok gwangnyeon-eul geolchyeo goyohan byeoldeul-i uju-ui gyunhyeong sog-eseo banjjag-imnida. Uri-neun byeol-ui meonji-ro mandeul-eo-jin tamheom-ga-imyeo uju-reul baewogamnida.',
    },
  ],

  it: [
    {
      id: 'it-mp-1',
      title: 'L’Alba sulla Collina',
      category: 'Classic Literature',
      text: 'Il sole del mattino sorgeva dolcemente sulle colline di smeraldo, dipingendo il fiume con pennellate d’oro liquido. Nel prato sottostante, un giovane cervo sostava vicino alla sorgente, ascoltando i primi pettirossi.',
    },
    {
      id: 'it-mp-2',
      title: 'Cadenza e Precisione',
      category: 'Mindset & Growth',
      text: 'La velocità non ha valore senza accuratezza. La vera maestria sboccia dalla calma interiore, dal movimento ritmico delle dita e dalla memoria muscolare affinata in migliaia di battute attente.',
    },
    {
      id: 'it-mp-3',
      title: 'Orizzonte Digitale',
      category: 'Tech & Future',
      text: 'La tecnologia unisce l’umanità oltre oceani e vette innevate. Idee scambiate in una frazione di secondo accendono la passione per la conoscenza, l’arte e l’innovazione futura.',
    },
    {
      id: 'it-mp-4',
      title: 'Meraviglia delle Stelle',
      category: 'Science & Cosmos',
      text: 'Attraverso miliardi di anni luce, le stelle brillano in un silenzioso equilibrio celeste. Siamo viaggiatori fatti di polvere di stelle, affascinati dal mistero infinito del cosmo.',
    },
  ],

  hi: [
    {
      id: 'hi-mp-1',
      title: 'Subah Ki Roshni (Morning Light)',
      category: 'Classic Literature',
      text: 'Subah ka suraj hari-bhari pahadiyon par dhire-dhire chamak raha tha, nadi ko sunehre rang me rangte hue. Neeche maidan me ek chhota hiran saaf paani ke jharne ke paas ruka aur chidiyon ke madhur geet sunne laga.',
    },
    {
      id: 'hi-mp-2',
      title: 'Raftaar Aur Satikta (Speed & Accuracy)',
      category: 'Mindset & Growth',
      text: 'Bina satikta ke tezi ka koi arth nahi hota. Asli nipunata shanti, ungliyon ke laiybaddh sanchalan aur lagatar abhyas se vikasit manspeshiyon ki smriti par vishwas karne se aati hai.',
    },
    {
      id: 'hi-mp-3',
      title: 'Digital Kranti (Digital Revolution)',
      category: 'Tech & Future',
      text: 'Technology samandar aur pahadon ke paar manavta ko aapas me jodti hai. Palak jhapakte hi saajha kiye gaye vichar seekhne, rachnatmakta aur aane wali peedhi ke liye aavishkar ki raah kholte hain.',
    },
    {
      id: 'hi-mp-4',
      title: 'Brahmand Ke Rahasya (Cosmic Secrets)',
      category: 'Science & Cosmos',
      text: 'Arabon prakash varsh door, anant sitare brahmandiya santulan me chamak rahe hain. Hum sitaron ki dhool se bane khoji hain jo gyan ki roshni se is sansar ke rahasyon ko samajhte hain.',
    },
  ],
};

// Backward-compatible alias for the default English pool
export const MULTIPLAYER_PASSAGES: MultiplayerPassage[] = MULTIPLAYER_PASSAGES_BY_LANG.en;

/**
 * Returns a random passage from the pool for the requested language.
 * Falls back to English if the language is not recognized or has no passages.
 */
export function getRandomRacePassage(lang: string = 'en'): MultiplayerPassage {
  const normalizedLang = (lang || 'en').toLowerCase().slice(0, 2);
  const pool = MULTIPLAYER_PASSAGES_BY_LANG[normalizedLang] || MULTIPLAYER_PASSAGES_BY_LANG.en;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
