import type { SupportedLocale } from '../i18n/ui';

export interface LocalizedNounPools {
  3: string[];
  4: string[];
  5: string[];
  6: string[];
}

export const LILYPAD_WORDS_BY_LANG: Record<SupportedLocale, LocalizedNounPools> = {
  en: {
    3: [
      'cat', 'fan', 'dog', 'sun', 'pen', 'cup', 'fox', 'bat', 'hat', 'bee',
      'pig', 'bus', 'box', 'sea', 'sky', 'jam', 'pie', 'owl', 'cow', 'nut',
      'ant', 'egg', 'toy', 'log', 'map', 'bed', 'car', 'bag', 'pot', 'key',
      'ice', 'cap', 'hen', 'gem', 'jar', 'pin', 'net', 'eye', 'arm'
    ],
    4: [
      'frog', 'pond', 'fish', 'tree', 'duck', 'bird', 'star', 'moon', 'leaf', 'lily',
      'boat', 'rain', 'snow', 'wind', 'hill', 'cave', 'rock', 'seed', 'rose', 'bear',
      'deer', 'wolf', 'lion', 'seal', 'swan', 'nest', 'lamp', 'book', 'door', 'bell',
      'ship', 'wave', 'sand', 'clay', 'corn', 'pear', 'plum', 'fern', 'moss', 'root'
    ],
    5: [
      'lotus', 'plant', 'water', 'stone', 'cloud', 'river', 'grass', 'bloom', 'petal', 'creek',
      'tiger', 'zebra', 'otter', 'koala', 'panda', 'robin', 'eagle', 'crane', 'heron', 'trout',
      'apple', 'berry', 'peach', 'grape', 'lemon', 'melon', 'acorn', 'tulip', 'daisy', 'maple',
      'beach', 'ocean', 'cliff', 'flame', 'spark', 'frost', 'storm', 'breez', 'ember', 'pearl'
    ],
    6: [
      'forest', 'spring', 'stream', 'meadow', 'branch', 'flower', 'valley', 'pebble', 'canopy', 'timber',
      'turtle', 'rabbit', 'beaver', 'badger', 'monkey', 'parrot', 'falcon', 'spider', 'beetle', 'walrus',
      'cherry', 'orange', 'banana', 'papaya', 'walnut', 'clover', 'willow', 'bamboo', 'spruce', 'cactus',
      'bridge', 'castle', 'island', 'summit', 'temple', 'harbor', 'beacon', 'shield', 'helmet', 'silver'
    ],
  },
  es: {
    3: [
      'sol', 'mar', 'pan', 'pez', 'luz', 'voz', 'rey', 'gas', 'bus', 'pie',
      'ojo', 'cal', 'oro', 'rio', 'sal', 'ala', 'ola', 'red', 'sur', 'paz',
      'uva', 'uno', 'dos', 'tos', 'eco', 'fin', 'ano', 'bar', 'via', 'cal'
    ],
    4: [
      'gato', 'luna', 'flor', 'pato', 'rosa', 'nube', 'lago', 'rana', 'agua', 'vela',
      'tren', 'casa', 'lobo', 'león', 'pino', 'boca', 'mano', 'cero', 'azul', 'arco',
      'caja', 'taza', 'miel', 'pera', 'nuez', 'hoja', 'roca', 'foco', 'pico', 'isla'
    ],
    5: [
      'playa', 'tigre', 'perro', 'barco', 'arbol', 'fuego', 'cielo', 'monte', 'torre', 'llave',
      'libro', 'verde', 'campo', 'reloj', 'pluma', 'fruta', 'dulce', 'nieve', 'viento', 'zorro',
      'brazo', 'carta', 'huevo', 'madre', 'padre', 'queso', 'raton', 'suelo', 'truco', 'valle'
    ],
    6: [
      'camino', 'puente', 'bosque', 'conejo', 'delfin', 'pajaro', 'dragon', 'espejo', 'flecha', 'fuente',
      'hierba', 'laguna', 'manzana', 'musica', 'planeta', 'sendero', 'sombra', 'teatro', 'verano', 'viento',
      'castillo', 'corona', 'estrella', 'jardin', 'paloma', 'tesoro', 'trueno', 'volcan', 'zapato', 'amigos'
    ],
  },
  ja: {
    3: [
      'inu', 'neko', 'ame', 'umi', 'ki', 'hi', 'te', 'me', 'ha', 'wa',
      'mori', 'kawa', 'yama', 'sora', 'hana', 'kaze', 'tori', 'hachi', 'kame', 'shika'
    ],
    4: [
      'tora', 'kuma', 'saru', 'ushi', 'uma', 'tako', 'kani', 'hisa', 'mizu', 'ishi',
      'tsuki', 'kumo', 'nami', 'hune', 'yuki', 'hono', 'mura', 'machi', 'ie', 'mado'
    ],
    5: [
      'sakura', 'hikari', 'densha', 'tsubasa', 'hoshi', 'kaigan', 'ringo', 'ichigo', 'suika', 'mikan',
      'chouchou', 'suzume', 'hotaru', 'inazuma', 'arashi', 'asagao', 'momiji', 'takenoko', 'sumire', 'himawari'
    ],
    6: [
      'tsubame', 'kawasemi', 'kirin', 'rakuda', 'kujira', 'iruka', 'shinkansen', 'hikouki', 'hashi', 'kodomo',
      'tomodachi', 'ongaku', 'kazoku', 'asahi', 'yuuhi', 'kagami', 'shinrin', 'mizumi', 'tanuki', 'kitsune'
    ],
  },
  fr: {
    3: [
      'mer', 'feu', 'mot', 'sac', 'lac', 'ami', 'pin', 'bus', 'mur', 'the',
      'cou', 'oie', 'eau', 'bol', 'rat', 'fer', 'sol', 'vue', 'air', 'roi'
    ],
    4: [
      'chat', 'lune', 'pont', 'vent', 'bois', 'gare', 'rose', 'pain', 'nuit', 'lion',
      'bleu', 'vert', 'main', 'pied', 'doux', 'bras', 'dent', 'peur', 'tour', 'parc'
    ],
    5: [
      'plage', 'arbre', 'livre', 'tigre', 'chien', 'avion', 'pomme', 'herbe', 'nuage', 'fleuve',
      'flamme', 'perle', 'glace', 'neige', 'fleur', 'pluie', 'bruit', 'table', 'porte', 'foret'
    ],
    6: [
      'jardin', 'fleuve', 'chemin', 'oiseau', 'cheval', 'bateau', 'soleil', 'vallee', 'source', 'etoile',
      'cerise', 'orange', 'banane', 'faucon', 'canard', 'miroir', 'chateau', 'nature', 'nuages', 'pierre'
    ],
  },
  de: {
    3: [
      'see', 'eis', 'tag', 'rot', 'tee', 'hut', 'rad', 'tor', 'kuh', 'bus',
      'wal', 'mut', 'ton', 'arm', 'uhr', 'bad', 'bar', 'ast', 'gas', 'hai'
    ],
    4: [
      'mond', 'baum', 'haus', 'buch', 'berg', 'wolf', 'rose', 'wind', 'boot', 'frosch',
      'ente', 'vogel', 'gras', 'sand', 'korn', 'nest', 'burg', 'turm', 'park', 'brot'
    ],
    5: [
      'blume', 'tiger', 'stadt', 'apfel', 'fluss', 'nacht', 'perle', 'insel', 'regen', 'feuer',
      'licht', 'sonne', 'wald', 'blatt', 'fisch', 'pferd', 'katze', 'feder', 'adler', 'stern'
    ],
    6: [
      'sommer', 'winter', 'strand', 'garten', 'sterne', 'bruecke', 'kirsche', 'orange', 'rakete', 'silber',
      'quelle', 'wolken', 'bergsee', 'spiegel', 'palast', 'zauber', 'falke', 'schwan', 'hirsch', 'wasser'
    ],
  },
  pt: {
    3: [
      'sol', 'mar', 'lua', 'pao', 'ceu', 'luz', 'rio', 'sal', 'rei', 'mel',
      'paz', 'som', 'asa', 'uva', 'cor', 'voz', 'dia', 'dor', 'mae', 'pai'
    ],
    4: [
      'gato', 'pato', 'lago', 'sapo', 'trem', 'cafe', 'rosa', 'onda', 'bola', 'lobo',
      'leao', 'pino', 'boca', 'mao', 'ouro', 'doce', 'fogo', 'mata', 'ilha', 'casa'
    ],
    5: [
      'praia', 'tigre', 'folha', 'navio', 'pedra', 'livro', 'maca', 'nuvem', 'arvore', 'vento',
      'chuva', 'campo', 'peixe', 'bravo', 'nobre', 'verde', 'porta', 'chapa', 'terra', 'fonte'
    ],
    6: [
      'jardim', 'bosque', 'ponte', 'coelho', 'cavalo', 'estrela', 'castelo', 'floresta', 'passaro', 'origem',
      'espelho', 'flecha', 'laranja', 'banana', 'cereja', 'trovao', 'planeta', 'caminho', 'verao', 'abrigo'
    ],
  },
  ko: {
    3: [
      'dal', 'san', 'mul', 'hae', 'bit', 'nun', 'sul', 'som', 'gil', 'bam',
      'son', 'bal', 'ip', 'nun', 'kko', 'bae', 'bap', 'mal', 'sop', 'sup'
    ],
    4: [
      'bada', 'namu', 'gure', 'nami', 'suri', 'byul', 'gang', 'kkot', 'nubi', 'nabi',
      'saja', 'gomi', 'hagi', 'yeo', 'dora', 'pada', 'hodo', 'gogi', 'nara', 'dari'
    ],
    5: [
      'haneul', 'sarang', 'baram', 'norul', 'gureum', 'dallim', 'byeol', 'maeum', 'yeoreum', 'gaeul',
      'bomnal', 'kkotip', 'solmul', 'daram', 'kkotki', 'badae', 'sonnim', 'mulgyul', 'chingu', 'miso'
    ],
    6: [
      'sonagi', 'eunhasu', 'mujigae', 'chorok', 'pureun', 'duremi', 'parang', 'kkumnamu', 'kkotbat', 'darae',
      'boram', 'sorae', 'barami', 'sarang', 'hanul', 'sesang', 'gureumi', 'byulbit', 'haetsal', 'mulbori'
    ],
  },
  it: {
    3: [
      'sol', 'mar', 'via', 'bar', 'bus', 'oro', 'ape', 'eco', 'uva', 'tre',
      'due', 'uno', 'ora', 'ala', 'dio', 'fil', 'gas', 'qui', 'poi', 'sci'
    ],
    4: [
      'luna', 'cane', 'nave', 'rosa', 'lago', 'pane', 'treno', 'mela', 'mare', 'luce',
      'onda', 'sole', 'topo', 'lupo', 'rana', 'muro', 'fico', 'pera', 'orto', 'casa'
    ],
    5: [
      'tigre', 'libro', 'fiume', 'notte', 'campo', 'vento', 'pesce', 'porta', 'monte', 'sasso',
      'bosco', 'perla', 'nuvola', 'fuoco', 'pietra', 'falco', 'volpe', 'viola', 'prato', 'torre'
    ],
    6: [
      'stella', 'ponte', 'angelo', 'castello', 'freccia', 'giardino', 'strada', 'foresta', 'albero', 'delfino',
      'palude', 'musica', 'spada', 'fonte', 'foglia', 'farfalla', 'uccello', 'ciliegia', 'limone', 'pianeta'
    ],
  },
  hi: {
    3: [
      'aam', 'fal', 'jal', 'ped', 'pal', 'kal', 'tan', 'man', 'dhan', 'van',
      'sur', 'din', 'rat', 'ghar', 'mor', 'sher', 'bagh', 'saan', 'teer', 'naam'
    ],
    4: [
      'hawa', 'nadi', 'tara', 'pani', 'dost', 'hath', 'fool', 'baat', 'geet', 'khel',
      'desh', 'shaan', 'jaan', 'prem', 'megh', 'dhup', 'baal', 'kalam', 'shahar', 'mitti'
    ],
    5: [
      'suraj', 'chand', 'kitab', 'kisan', 'chiriya', 'gulab', 'badal', 'sagar', 'dharti', 'pahar',
      'kamal', 'patta', 'tarang', 'pratap', 'shakti', 'mandir', 'bhavan', 'khushi', 'jeevan', 'suhani'
    ],
    6: [
      'pustak', 'dharati', 'sunder', 'chahat', 'jyoti', 'pariwar', 'sapna', 'lehar', 'koyal', 'suraksha',
      'bharat', 'himalay', 'prakriti', 'anand', 'vishwas', 'vijay', 'gagan', 'roshni', 'khushbu', 'samudra'
    ],
  },
};

export const NEON_WORDS_BY_LANG: Record<SupportedLocale, { standard: string[]; turbo: string[] }> = {
  en: {
    standard: [
      'glow', 'grid', 'byte', 'flux', 'sync', 'neon', 'warp', 'code', 'beam', 'dash',
      'volt', 'wave', 'race', 'burn', 'fast', 'push', 'core', 'zoom', 'fuel',
      'pulse', 'laser', 'drift', 'cyber', 'shift', 'boost', 'sonic', 'matrix', 'spark',
      'nexus', 'hyper', 'relay', 'glitch', 'synth', 'retro', 'quark', 'flare', 'orbit',
      'flash', 'turbo', 'blade', 'radar', 'drive', 'light', 'shock', 'surge', 'speed',
      'vector', 'plasma', 'binary', 'rocket', 'photon', 'future', 'stream', 'tracer',
      'signal', 'switch', 'beacon', 'engine', 'runner', 'torque', 'apex', 'vortex'
    ],
    turbo: [
      'overdrive', 'hyperspace', 'cybernetic', 'supercharge', 'accelerator',
      'subroutine', 'velocity', 'afterburner', 'mainframe', 'superconduct',
      'synesthesia', 'tachyon', 'ultraviolet', 'megastructure', 'wavelength',
      'singularity', 'nanosecond', 'interstellar', 'electromagnetic', 'hyperdrive'
    ],
  },
  es: {
    standard: [
      'onda', 'foco', 'chip', 'rayo', 'turbo', 'red', 'dato', 'bit', 'nexo', 'pulso',
      'laser', 'ciber', 'salto', 'matriz', 'chispa', 'pista', 'motor', 'vector', 'plasma',
      'futuro', 'senal', 'vortice', 'luces', 'hiper', 'flujo', 'solar', 'radar', 'impulso',
      'nucleo', 'codigo', 'rele', 'veloz', 'astro', 'flash', 'sombra', 'orbita', 'brillo'
    ],
    turbo: [
      'velocidad', 'cibernetica', 'hiperespacio', 'sobrecarga', 'acelerador',
      'procesador', 'sideral', 'ultravioleta', 'frecuencia', 'singularidad',
      'electrico', 'nanosegundo', 'interestelar', 'electromagnetico', 'propulsion'
    ],
  },
  ja: {
    standard: [
      'hikari', 'denpa', 'kodo', 'mira', 'saiba', 'ryu', 'shingo', 'reza', 'nettu', 'pasu',
      'denki', 'kuroku', 'kosoku', 'habu', 'shiruko', 'baito', 'orubitto', 'pawa', 'doramu',
      'enerugi', 'purazuma', 'rekodo', 'sain', 'tenso', 'supido', 'kirameki', 'kasoku', 'kairo'
    ],
    turbo: [
      'chousokudo', 'choukuukan', 'denshinou', 'kasokuki', 'shingurari',
      'denshijouhou', 'uchuusen', 'hikarinohado', 'choudenji', 'kyuukyoku'
    ],
  },
  fr: {
    standard: [
      'onde', 'flux', 'code', 'bit', 'lueur', 'laser', 'cyber', 'saut', 'matrice', 'eclair',
      'relais', 'radar', 'pulse', 'moteur', 'signal', 'vecteur', 'plasma', 'futur', 'vortex',
      'noyau', 'turbo', 'lumiere', 'fusil', 'sonique', 'espace', 'orbite', 'vitesse', 'rayon'
    ],
    turbo: [
      'hyperespace', 'cybernetique', 'accelerateur', 'ordinateur', 'supraconducteur',
      'ultraviolet', 'interstellaire', 'longueuronde', 'singularite', 'propulsion'
    ],
  },
  de: {
    standard: [
      'blitz', 'netz', 'code', 'puls', 'byte', 'flux', 'neon', 'laser', 'cyber', 'matrix',
      'funke', 'relais', 'schub', 'radar', 'motor', 'signal', 'vektor', 'plasma', 'zukunft',
      'wirbel', 'strahl', 'flamme', 'welle', 'turbo', 'tempo', 'schall', 'antrieb', 'leiter'
    ],
    turbo: [
      'hyperspace', 'kybernetik', 'beschleuniger', 'supraleiter', 'hauptrechner',
      'ultraviolett', 'interstellar', 'singularitaet', 'lichtgeschwindigkeit', 'elektromagnet'
    ],
  },
  pt: {
    standard: [
      'onda', 'pulso', 'rede', 'chip', 'raio', 'turbo', 'dado', 'bit', 'nexo', 'laser',
      'ciber', 'matriz', 'faisca', 'motor', 'vetor', 'plasma', 'futuro', 'sinal', 'vertice',
      'foco', 'veloz', 'nucleo', 'fluxo', 'radar', 'salto', 'trilha', 'orbita', 'brilho'
    ],
    turbo: [
      'velocidade', 'cibernetico', 'hiperespaco', 'acelerador', 'supercondutor',
      'ultravioleta', 'interestelar', 'singularidade', 'nanosegundo', 'propulsao'
    ],
  },
  ko: {
    standard: [
      'bit', 'mang', 'code', 'pulse', 'laser', 'cyber', 'nexus', 'matrix', 'sinho', 'engine',
      'vector', 'plasma', 'mirae', 'vortex', 'sokdo', 'gwang', 'pado', 'turbo', 'judo',
      'gwangseon', 'chulryeok', 'hoero', 'junpa', 'orbit', 'binnaneun', 'gasok', 'beonchi'
    ],
    turbo: [
      'chochosok', 'chogonggan', 'cybernetics', 'gasokgi', 'chododoche',
      'chouju', 'sungyul', 'singular', 'nanosecond', 'jeonjagi'
    ],
  },
  it: {
    standard: [
      'onda', 'rete', 'chip', 'raggio', 'turbo', 'bit', 'nesso', 'impulso', 'laser', 'cyber',
      'matrice', 'scintilla', 'motore', 'vettore', 'plasma', 'futuro', 'segnale', 'vortice',
      'nucleo', 'luce', 'flusso', 'radar', 'salto', 'scatto', 'orbita', 'bagliore', 'corsa'
    ],
    turbo: [
      'velocita', 'cibernetico', 'iperspazio', 'acceleratore', 'superconduttore',
      'ultravioletto', 'interstellare', 'singolarita', 'nanosecondo', 'propulsione'
    ],
  },
  hi: {
    standard: [
      'tarang', 'bijli', 'gati', 'kiran', 'chakra', 'taar', 'shakti', 'prahar', 'lehar', 'yantra',
      'sanchar', 'veg', 'sanket', 'tejas', 'dhara', 'jyoti', 'kendr', 'surya', 'chamak',
      'pravah', 'drishti', 'chakra', 'agni', 'sparsh', 'prerana', 'antariksh', 'shunyo'
    ],
    turbo: [
      'mahashakti', 'antariksh', 'atigati', 'chamatkar', 'teevratam',
      'mahaurja', 'alokik', 'paravigyan', 'vidyutpravah', 'shaktishali'
    ],
  },
};

export function getLocalizedLilypadWords(level: number, count: number, lang: SupportedLocale = 'en'): string[] {
  const pools = LILYPAD_WORDS_BY_LANG[lang] || LILYPAD_WORDS_BY_LANG.en;
  let pool: string[] = [];

  if (level === 1) {
    pool = pools[3];
  } else if (level === 2) {
    pool = [...pools[3], ...pools[4]];
  } else if (level === 3) {
    pool = pools[4];
  } else if (level === 4) {
    pool = pools[5];
  } else {
    pool = pools[6];
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }
  // Repeat if pool smaller than requested count
  const result: string[] = [...shuffled];
  while (result.length < count) {
    const more = [...pool].sort(() => 0.5 - Math.random());
    result.push(...more.slice(0, count - result.length));
  }
  return result;
}

export function getLocalizedNeonWord(isTurbo: boolean, lang: SupportedLocale = 'en'): string {
  const dict = NEON_WORDS_BY_LANG[lang] || NEON_WORDS_BY_LANG.en;
  if (isTurbo && Math.random() < 0.65) {
    return dict.turbo[Math.floor(Math.random() * dict.turbo.length)];
  }
  return dict.standard[Math.floor(Math.random() * dict.standard.length)];
}
