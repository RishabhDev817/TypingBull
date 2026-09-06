export interface LevelConfig {
  level: number;
  tierName: string;
  title: string;
  subtitle: string;
  badge: string;
  leafCount: number; // Total lilypads (start + words + Lotus Flower finish)
  wordLengthDescription: string;
  jumpDuration: number; // ms
  color: string;
}

export interface Waypoint {
  x: number; // Percentage (0 - 100)
  y: number; // Percentage (0 - 100)
  rotation: number; // Degrees
}

export interface WordVisual {
  emoji: string;
  label: string;
  bg: string;
  border: string;
}

// ─── Visual Reinforcement Dictionary: Word to Visual Mapping ──────

export const WORD_VISUAL_MAP: Record<string, WordVisual> = {
  // 3-Letter Nouns
  cat: { emoji: '🐱', label: 'Cat', bg: '#FEF3C7', border: '#F59E0B' },
  fan: { emoji: '🪭', label: 'Fan', bg: '#E0F2FE', border: '#0284C7' },
  dog: { emoji: '🐶', label: 'Dog', bg: '#FFEDD5', border: '#EA580C' },
  sun: { emoji: '☀️', label: 'Sun', bg: '#FEF9C3', border: '#EAB308' },
  pen: { emoji: '🖊️', label: 'Pen', bg: '#EDE9FE', border: '#8B5CF6' },
  cup: { emoji: '☕', label: 'Cup', bg: '#FEE2E2', border: '#EF4444' },
  fox: { emoji: '🦊', label: 'Fox', bg: '#FFEDD5', border: '#F97316' },
  bat: { emoji: '🦇', label: 'Bat', bg: '#F3E8FF', border: '#A855F7' },
  hat: { emoji: '🎩', label: 'Hat', bg: '#E0E7FF', border: '#6366F1' },
  bee: { emoji: '🐝', label: 'Bee', bg: '#FEF08A', border: '#CA8A04' },
  pig: { emoji: '🐷', label: 'Pig', bg: '#FCE7F3', border: '#EC4899' },
  bus: { emoji: '🚌', label: 'Bus', bg: '#FEF08A', border: '#EAB308' },
  box: { emoji: '📦', label: 'Box', bg: '#FED7AA', border: '#D97706' },
  sea: { emoji: '🌊', label: 'Sea', bg: '#BAE6FD', border: '#0284C7' },
  sky: { emoji: '☁️', label: 'Sky', bg: '#E0F2FE', border: '#38BDF8' },
  jam: { emoji: '🍓', label: 'Jam', bg: '#FFE4E6', border: '#E11D48' },
  pie: { emoji: '🥧', label: 'Pie', bg: '#FFEDD5', border: '#D97706' },
  owl: { emoji: '🦉', label: 'Owl', bg: '#F5D0FE', border: '#C026D3' },
  cow: { emoji: '🐮', label: 'Cow', bg: '#F1F5F9', border: '#64748B' },
  nut: { emoji: '🥜', label: 'Nut', bg: '#FEF3C7', border: '#B45309' },
  ant: { emoji: '🐜', label: 'Ant', bg: '#FEE2E2', border: '#DC2626' },
  egg: { emoji: '🥚', label: 'Egg', bg: '#FEF9C3', border: '#F59E0B' },
  toy: { emoji: '🧸', label: 'Toy', bg: '#FCE7F3', border: '#DB2777' },
  log: { emoji: '🪵', label: 'Log', bg: '#E2E8F0', border: '#78350F' },
  map: { emoji: '🗺️', label: 'Map', bg: '#FEF3C7', border: '#D97706' },
  bed: { emoji: '🛏️', label: 'Bed', bg: '#E0E7FF', border: '#4F46E5' },
  car: { emoji: '🚗', label: 'Car', bg: '#FEE2E2', border: '#EF4444' },
  bag: { emoji: '🎒', label: 'Bag', bg: '#DCFCE7', border: '#16A34A' },
  pot: { emoji: '🪴', label: 'Pot', bg: '#D1FAE5', border: '#059669' },
  key: { emoji: '🔑', label: 'Key', bg: '#FEF9C3', border: '#EAB308' },
  ice: { emoji: '🧊', label: 'Ice', bg: '#E0F2FE', border: '#0284C7' },
  cap: { emoji: '🧢', label: 'Cap', bg: '#DBEAFE', border: '#2563EB' },
  hen: { emoji: '🐔', label: 'Hen', bg: '#FEF2F2', border: '#EF4444' },
  gem: { emoji: '💎', label: 'Gem', bg: '#E0F2FE', border: '#06B6D4' },
  jar: { emoji: '🫙', label: 'Jar', bg: '#F1F5F9', border: '#94A3B8' },
  pin: { emoji: '📍', label: 'Pin', bg: '#FEE2E2', border: '#DC2626' },
  net: { emoji: '🥅', label: 'Net', bg: '#E2E8F0', border: '#64748B' },
  eye: { emoji: '👁️', label: 'Eye', bg: '#DBEAFE', border: '#3B82F6' },
  arm: { emoji: '💪', label: 'Arm', bg: '#FFEDD5', border: '#F97316' },

  // 4-Letter Nouns
  frog: { emoji: '🐸', label: 'Frog', bg: '#DCFCE7', border: '#16A34A' },
  pond: { emoji: '🪷', label: 'Pond', bg: '#E0F2FE', border: '#0284C7' },
  fish: { emoji: '🐟', label: 'Fish', bg: '#BAE6FD', border: '#0284C7' },
  tree: { emoji: '🌳', label: 'Tree', bg: '#DCFCE7', border: '#15803D' },
  duck: { emoji: '🦆', label: 'Duck', bg: '#FEF9C3', border: '#EAB308' },
  bird: { emoji: '🐦', label: 'Bird', bg: '#E0F2FE', border: '#0284C7' },
  star: { emoji: '⭐', label: 'Star', bg: '#FEF08A', border: '#EAB308' },
  moon: { emoji: '🌙', label: 'Moon', bg: '#FEF9C3', border: '#F59E0B' },
  leaf: { emoji: '🍃', label: 'Leaf', bg: '#DCFCE7', border: '#16A34A' },
  lily: { emoji: '🌸', label: 'Lily', bg: '#FCE7F3', border: '#EC4899' },
  boat: { emoji: '⛵', label: 'Boat', bg: '#E0F2FE', border: '#0284C7' },
  rain: { emoji: '🌧️', label: 'Rain', bg: '#BAE6FD', border: '#0284C7' },
  snow: { emoji: '❄️', label: 'Snow', bg: '#E0F2FE', border: '#38BDF8' },
  wind: { emoji: '💨', label: 'Wind', bg: '#F1F5F9', border: '#94A3B8' },
  hill: { emoji: '⛰️', label: 'Hill', bg: '#D1FAE5', border: '#059669' },
  cave: { emoji: '🪨', label: 'Cave', bg: '#E2E8F0', border: '#475569' },
  rock: { emoji: '🪨', label: 'Rock', bg: '#E2E8F0', border: '#64748B' },
  seed: { emoji: '🌱', label: 'Seed', bg: '#DCFCE7', border: '#16A34A' },
  rose: { emoji: '🌹', label: 'Rose', bg: '#FFE4E6', border: '#E11D48' },
  bear: { emoji: '🐻', label: 'Bear', bg: '#FEF3C7', border: '#92400E' },
  deer: { emoji: '🦌', label: 'Deer', bg: '#FFEDD5', border: '#D97706' },
  wolf: { emoji: '🐺', label: 'Wolf', bg: '#F1F5F9', border: '#475569' },
  lion: { emoji: '🦁', label: 'Lion', bg: '#FEF08A', border: '#D97706' },
  seal: { emoji: '🦭', label: 'Seal', bg: '#E0F2FE', border: '#0284C7' },
  swan: { emoji: '🦢', label: 'Swan', bg: '#FFFFFF', border: '#CBD5E1' },
  nest: { emoji: '🪹', label: 'Nest', bg: '#FEF3C7', border: '#B45309' },
  lamp: { emoji: '💡', label: 'Lamp', bg: '#FEF9C3', border: '#EAB308' },
  book: { emoji: '📖', label: 'Book', bg: '#DBEAFE', border: '#2563EB' },
  door: { emoji: '🚪', label: 'Door', bg: '#FEF3C7', border: '#92400E' },
  bell: { emoji: '🔔', label: 'Bell', bg: '#FEF08A', border: '#EAB308' },
  drum: { emoji: '🥁', label: 'Drum', bg: '#FEE2E2', border: '#EF4444' },
  kite: { emoji: '🪁', label: 'Kite', bg: '#FCE7F3', border: '#EC4899' },
  ship: { emoji: '🚢', label: 'Ship', bg: '#DBEAFE', border: '#1D4ED8' },
  ring: { emoji: '💍', label: 'Ring', bg: '#E0F2FE', border: '#06B6D4' },
  gold: { emoji: '🪙', label: 'Gold', bg: '#FEF08A', border: '#EAB308' },
  park: { emoji: '🏞️', label: 'Park', bg: '#DCFCE7', border: '#16A34A' },
  wave: { emoji: '🌊', label: 'Wave', bg: '#BAE6FD', border: '#0284C7' },
  sand: { emoji: '🏖️', label: 'Sand', bg: '#FEF3C7', border: '#D97706' },
  fern: { emoji: '🌿', label: 'Fern', bg: '#DCFCE7', border: '#16A34A' },
  pine: { emoji: '🌲', label: 'Pine', bg: '#D1FAE5', border: '#047857' },
  lake: { emoji: '🛶', label: 'Lake', bg: '#E0F2FE', border: '#0284C7' },

  // 5-Letter Nouns
  apple: { emoji: '🍎', label: 'Apple', bg: '#FEE2E2', border: '#EF4444' },
  table: { emoji: '🪵', label: 'Table', bg: '#FEF3C7', border: '#92400E' },
  water: { emoji: '💧', label: 'Water', bg: '#E0F2FE', border: '#0284C7' },
  cloud: { emoji: '☁️', label: 'Cloud', bg: '#F1F5F9', border: '#94A3B8' },
  plant: { emoji: '🪴', label: 'Plant', bg: '#DCFCE7', border: '#16A34A' },
  grass: { emoji: '🌱', label: 'Grass', bg: '#DCFCE7', border: '#16A34A' },
  river: { emoji: '🌊', label: 'River', bg: '#BAE6FD', border: '#0284C7' },
  house: { emoji: '🏠', label: 'House', bg: '#FEF3C7', border: '#D97706' },
  train: { emoji: '🚂', label: 'Train', bg: '#DBEAFE', border: '#2563EB' },
  bread: { emoji: '🍞', label: 'Bread', bg: '#FEF3C7', border: '#D97706' },
  clock: { emoji: '⏰', label: 'Clock', bg: '#FEE2E2', border: '#EF4444' },
  sweet: { emoji: '🍬', label: 'Sweet', bg: '#FCE7F3', border: '#EC4899' },
  beach: { emoji: '🏖️', label: 'Beach', bg: '#FEF3C7', border: '#D97706' },
  tiger: { emoji: '🐯', label: 'Tiger', bg: '#FFEDD5', border: '#EA580C' },
  puppy: { emoji: '🐶', label: 'Puppy', bg: '#FEF3C7', border: '#F59E0B' },
  ocean: { emoji: '🌊', label: 'Ocean', bg: '#BAE6FD', border: '#0284C7' },
  candy: { emoji: '🍭', label: 'Candy', bg: '#FCE7F3', border: '#DB2777' },
  music: { emoji: '🎵', label: 'Music', bg: '#EDE9FE', border: '#8B5CF6' },
  flame: { emoji: '🔥', label: 'Flame', bg: '#FEE2E2', border: '#F97316' },
  stone: { emoji: '🪨', label: 'Stone', bg: '#E2E8F0', border: '#64748B' },
  space: { emoji: '🌌', label: 'Space', bg: '#312E81', border: '#6366F1' },
  earth: { emoji: '🌍', label: 'Earth', bg: '#DCFCE7', border: '#16A34A' },
  zebra: { emoji: '🦓', label: 'Zebra', bg: '#F1F5F9', border: '#334155' },
  horse: { emoji: '🐴', label: 'Horse', bg: '#FEF3C7', border: '#92400E' },
  sheep: { emoji: '🐑', label: 'Sheep', bg: '#F8FAFC', border: '#94A3B8' },
  koala: { emoji: '🐨', label: 'Koala', bg: '#E2E8F0', border: '#64748B' },
  panda: { emoji: '🐼', label: 'Panda', bg: '#F8FAFC', border: '#0F172A' },
  otter: { emoji: '🦦', label: 'Otter', bg: '#FEF3C7', border: '#B45309' },
  whale: { emoji: '🐋', label: 'Whale', bg: '#DBEAFE', border: '#1D4ED8' },
  shark: { emoji: '🦈', label: 'Shark', bg: '#E0F2FE', border: '#0284C7' },
  eagle: { emoji: '🦅', label: 'Eagle', bg: '#FEF3C7', border: '#78350F' },
  robin: { emoji: '🐦', label: 'Robin', bg: '#FEE2E2', border: '#EF4444' },
  tulip: { emoji: '🌷', label: 'Tulip', bg: '#FFE4E6', border: '#E11D48' },
  daisy: { emoji: '🌼', label: 'Daisy', bg: '#FEF9C3', border: '#EAB308' },
  fruit: { emoji: '🍓', label: 'Fruit', bg: '#FEE2E2', border: '#EF4444' },
  lemon: { emoji: '🍋', label: 'Lemon', bg: '#FEF9C3', border: '#EAB308' },
  melon: { emoji: '🍈', label: 'Melon', bg: '#DCFCE7', border: '#16A34A' },
  berry: { emoji: '🫐', label: 'Berry', bg: '#DBEAFE', border: '#3B82F6' },
  peach: { emoji: '🍑', label: 'Peach', bg: '#FFE4E6', border: '#F43F5E' },
  grape: { emoji: '🍇', label: 'Grape', bg: '#F3E8FF', border: '#9333EA' },
  chair: { emoji: '🪑', label: 'Chair', bg: '#FEF3C7', border: '#92400E' },
  spoon: { emoji: '🥄', label: 'Spoon', bg: '#E2E8F0', border: '#94A3B8' },
  plate: { emoji: '🍽️', label: 'Plate', bg: '#FFFFFF', border: '#CBD5E1' },
  brush: { emoji: '🖌️', label: 'Brush', bg: '#EDE9FE', border: '#8B5CF6' },
  crown: { emoji: '👑', label: 'Crown', bg: '#FEF08A', border: '#EAB308' },

  // 6-Letter Nouns
  flower: { emoji: '🌸', label: 'Flower', bg: '#FCE7F3', border: '#EC4899' },
  garden: { emoji: '🌻', label: 'Garden', bg: '#DCFCE7', border: '#16A34A' },
  turtle: { emoji: '🐢', label: 'Turtle', bg: '#DCFCE7', border: '#15803D' },
  rabbit: { emoji: '🐰', label: 'Rabbit', bg: '#FCE7F3', border: '#EC4899' },
  forest: { emoji: '🌲', label: 'Forest', bg: '#D1FAE5', border: '#047857' },
  planet: { emoji: '🪐', label: 'Planet', bg: '#EDE9FE', border: '#7C3AED' },
  summer: { emoji: '☀️', label: 'Summer', bg: '#FEF08A', border: '#EAB308' },
  yellow: { emoji: '💛', label: 'Yellow', bg: '#FEF9C3', border: '#EAB308' },
  bridge: { emoji: '🌉', label: 'Bridge', bg: '#DBEAFE', border: '#2563EB' },
  castle: { emoji: '🏰', label: 'Castle', bg: '#EDE9FE', border: '#8B5CF6' },
  island: { emoji: '🏝️', label: 'Island', bg: '#FEF3C7', border: '#059669' },
  stream: { emoji: '🏞️', label: 'Stream', bg: '#BAE6FD', border: '#0284C7' },
  butter: { emoji: '🧈', label: 'Butter', bg: '#FEF9C3', border: '#F59E0B' },
  nature: { emoji: '🌿', label: 'Nature', bg: '#DCFCE7', border: '#16A34A' },
  school: { emoji: '🏫', label: 'School', bg: '#DBEAFE', border: '#2563EB' },
  window: { emoji: '🪟', label: 'Window', bg: '#E0F2FE', border: '#0284C7' },
  pencil: { emoji: '✏️', label: 'Pencil', bg: '#FEF08A', border: '#EAB308' },
  monkey: { emoji: '🐒', label: 'Monkey', bg: '#FEF3C7', border: '#92400E' },
  dragon: { emoji: '🐲', label: 'Dragon', bg: '#DCFCE7', border: '#16A34A' },
  cookie: { emoji: '🍪', label: 'Cookie', bg: '#FEF3C7', border: '#D97706' },
  basket: { emoji: '🧺', label: 'Basket', bg: '#FEF3C7', border: '#B45309' },
  rocket: { emoji: '🚀', label: 'Rocket', bg: '#DBEAFE', border: '#EF4444' },
  kitten: { emoji: '🐱', label: 'Kitten', bg: '#FCE7F3', border: '#EC4899' },
  bubble: { emoji: '🫧', label: 'Bubble', bg: '#E0F2FE', border: '#38BDF8' },
  valley: { emoji: '🏞️', label: 'Valley', bg: '#D1FAE5', border: '#059669' },
  meadow: { emoji: '🌾', label: 'Meadow', bg: '#DCFCE7', border: '#16A34A' },
  breeze: { emoji: '🍃', label: 'Breeze', bg: '#E0F2FE', border: '#0284C7' },
  canyon: { emoji: '🏜️', label: 'Canyon', bg: '#FFEDD5', border: '#EA580C' },
  jungle: { emoji: '🌴', label: 'Jungle', bg: '#DCFCE7', border: '#15803D' },
  parrot: { emoji: '🦜', label: 'Parrot', bg: '#FEE2E2', border: '#16A34A' },
  falcon: { emoji: '🦅', label: 'Falcon', bg: '#FEF3C7', border: '#78350F' },
  spider: { emoji: '🕷️', label: 'Spider', bg: '#F1F5F9', border: '#334155' },
  beetle: { emoji: '🪲', label: 'Beetle', bg: '#DCFCE7', border: '#059669' },
  walrus: { emoji: '🦭', label: 'Walrus', bg: '#E0F2FE', border: '#0284C7' },
  cherry: { emoji: '🍒', label: 'Cherry', bg: '#FFE4E6', border: '#E11D48' },
  orange: { emoji: '🍊', label: 'Orange', bg: '#FFEDD5', border: '#F97316' },
  banana: { emoji: '🍌', label: 'Banana', bg: '#FEF08A', border: '#EAB308' },
  candle: { emoji: '🕯️', label: 'Candle', bg: '#FEF9C3', border: '#F59E0B' },
  shield: { emoji: '🛡️', label: 'Shield', bg: '#DBEAFE', border: '#2563EB' },
  helmet: { emoji: '⛑️', label: 'Helmet', bg: '#FEE2E2', border: '#EF4444' },
  silver: { emoji: '🥈', label: 'Silver', bg: '#F1F5F9', border: '#94A3B8' },
  beacon: { emoji: '🚨', label: 'Beacon', bg: '#FEE2E2', border: '#DC2626' },
  harbor: { emoji: '⚓', label: 'Harbor', bg: '#E0F2FE', border: '#0284C7' },
};

/**
 * Returns visual badge data for a given word
 */
export function getWordVisual(word: string): WordVisual {
  const lower = word.toLowerCase();
  if (WORD_VISUAL_MAP[lower]) {
    return WORD_VISUAL_MAP[lower];
  }
  return {
    emoji: '⭐',
    label: word.charAt(0).toUpperCase() + word.slice(1),
    bg: '#FEF3C7',
    border: '#F59E0B',
  };
}

// ─── 5 Distinct Scaled Levels Configuration ────────────────────────

export const LILYPAD_LEVELS: LevelConfig[] = [
  {
    level: 1,
    tierName: 'Level 1: Tadpole Shallows',
    title: 'Level 1: Tadpole Shallows',
    subtitle: '3-letter nouns (cat, fan, dog, sun)',
    badge: '3 Letters • 10 Leaves',
    leafCount: 10, // Start + 8 words + Lotus Flower finish
    wordLengthDescription: '3-letter nouns',
    jumpDuration: 620,
    color: '#10B981',
  },
  {
    level: 2,
    tierName: 'Level 2: Sunny Shallows',
    title: 'Level 2: Sunny Shallows',
    subtitle: '3 to 4-letter nouns (sun, bird, frog, leaf)',
    badge: '3-4 Letters • 12 Leaves',
    leafCount: 12, // Start + 10 words + Lotus Flower finish
    wordLengthDescription: '3-4 letter nouns',
    jumpDuration: 570,
    color: '#06B6D4',
  },
  {
    level: 3,
    tierName: 'Level 3: Whispering Woods',
    title: 'Level 3: Whispering Woods',
    subtitle: '4-letter nouns (tree, book, fish, star)',
    badge: '4 Letters • 13 Leaves',
    leafCount: 13, // Start + 11 words + Lotus Flower finish
    wordLengthDescription: '4-letter nouns',
    jumpDuration: 520,
    color: '#3B82F6',
  },
  {
    level: 4,
    tierName: 'Level 4: Lotus Lagoon',
    title: 'Level 4: Lotus Lagoon',
    subtitle: '5-letter nouns (apple, water, house, tiger)',
    badge: '5 Letters • 14 Leaves',
    leafCount: 14, // Start + 12 words + Lotus Flower finish
    wordLengthDescription: '5-letter nouns',
    jumpDuration: 480,
    color: '#8B5CF6',
  },
  {
    level: 5,
    tierName: 'Level 5: Master Sanctuary',
    title: 'Level 5: Master Sanctuary',
    subtitle: '6-letter nouns (pencil, monkey, castle, turtle)',
    badge: '6 Letters • 15 Leaves',
    leafCount: 15, // Start + 13 words + Lotus Flower finish
    wordLengthDescription: '6-letter nouns',
    jumpDuration: 440,
    color: '#EC4899',
  },
];

// ─── Word Dictionary by Length Pool ────────────────────────────────

export const NOUN_POOLS: Record<number, string[]> = {
  3: [
    'cat', 'fan', 'dog', 'sun', 'pen', 'cup', 'fox', 'bat', 'hat', 'bee',
    'pig', 'bus', 'box', 'sea', 'sky', 'jam', 'pie', 'owl', 'cow', 'nut',
    'ant', 'egg', 'toy', 'log', 'map', 'bed', 'car', 'bag', 'pot', 'key',
    'ice', 'cap', 'hen', 'gem', 'jar', 'pin', 'net', 'eye', 'arm'
  ],
  4: [
    'frog', 'pond', 'fish', 'tree', 'duck', 'bird', 'star', 'moon', 'leaf',
    'lily', 'boat', 'rain', 'snow', 'wind', 'hill', 'cave', 'rock', 'seed',
    'rose', 'bear', 'deer', 'wolf', 'lion', 'seal', 'swan', 'nest', 'lamp',
    'book', 'door', 'bell', 'drum', 'kite', 'ship', 'ring', 'gold', 'park',
    'wave', 'sand', 'fern', 'pine', 'lake'
  ],
  5: [
    'apple', 'table', 'water', 'cloud', 'plant', 'grass', 'river', 'house',
    'train', 'bread', 'clock', 'sweet', 'beach', 'tiger', 'puppy', 'ocean',
    'candy', 'music', 'flame', 'stone', 'space', 'earth', 'zebra', 'horse',
    'sheep', 'koala', 'panda', 'otter', 'whale', 'shark', 'eagle', 'robin',
    'tulip', 'daisy', 'fruit', 'lemon', 'melon', 'berry', 'peach', 'grape',
    'chair', 'spoon', 'plate', 'brush', 'crown'
  ],
  6: [
    'pencil', 'monkey', 'flower', 'garden', 'turtle', 'rabbit', 'forest',
    'planet', 'summer', 'yellow', 'bridge', 'castle', 'island', 'stream',
    'butter', 'nature', 'school', 'window', 'dragon', 'cookie', 'basket',
    'rocket', 'kitten', 'bubble', 'valley', 'meadow', 'breeze', 'canyon',
    'jungle', 'parrot', 'falcon', 'spider', 'beetle', 'walrus', 'cherry',
    'orange', 'banana', 'candle', 'shield', 'helmet', 'silver', 'beacon', 'harbor'
  ],
};

// ─── Global Strict No-Repetition Session Word Tracker ──────────────

const sessionUsedWords = new Set<string>();

import { getLocalizedLilypadWords } from '../../../data/gameWordsI18n';
import type { SupportedLocale } from '../../../i18n/ui';

export function resetSessionUsedWords(): void {
  sessionUsedWords.clear();
}

/**
 * Retrieves a list of unique nouns for the specific level with STRICT NO REPETITION.
 */
export function getLevelWordsNoRepeat(level: number, count: number, lang?: SupportedLocale): string[] {
  if (lang && lang !== 'en') {
    return getLocalizedLilypadWords(level, count, lang);
  }

  let pool: string[] = [];

  if (level === 1) {
    pool = NOUN_POOLS[3];
  } else if (level === 2) {
    // 3 to 4-letter nouns (interleaved)
    pool = [...NOUN_POOLS[3], ...NOUN_POOLS[4]];
  } else if (level === 3) {
    pool = NOUN_POOLS[4];
  } else if (level === 4) {
    pool = NOUN_POOLS[5];
  } else {
    pool = NOUN_POOLS[6];
  }

  // Filter out words already used in this session
  const available = pool.filter((w) => !sessionUsedWords.has(w.toLowerCase()));

  let selected: string[] = [];

  if (available.length >= count) {
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    selected = shuffled.slice(0, count);
  } else {
    // If available is less than count, take all available and recycle unused
    const shuffledAvailable = [...available].sort(() => 0.5 - Math.random());
    selected = [...shuffledAvailable];

    // Clear words of this pool from session cache
    pool.forEach((w) => sessionUsedWords.delete(w.toLowerCase()));

    const needed = count - selected.length;
    const recycled = pool
      .filter((w) => !selected.includes(w))
      .sort(() => 0.5 - Math.random())
      .slice(0, needed);

    selected = [...selected, ...recycled];
  }

  // Register in session
  selected.forEach((w) => sessionUsedWords.add(w.toLowerCase()));

  return selected;
}

// ─── Dynamic 2D Zigzag Serpentine Waypoint Generator ───────────────

/**
 * Generates an organic 2D serpentine/zigzag track of coordinates (x%, y%)
 * across 4 horizontal tiers spanning the lake canvas for 10 to 15 leaves.
 */
export function generateZigzagWaypoints(leafCount: number): Waypoint[] {
  const waypoints: Waypoint[] = [];
  const rows = 4; // 4 serpentine horizontal tiers
  const leavesPerRow = Math.ceil(leafCount / rows);

  for (let i = 0; i < leafCount; i++) {
    const rowIndex = Math.floor(i / leavesPerRow); // 0 (bottom), 1 (mid-low), 2 (mid-high), 3 (top)
    const colIndex = i % leavesPerRow;
    const isEvenRow = rowIndex % 2 === 0;

    // Row Y coordinates: bottom (Row 0) -> top (Row 3)
    const rowYPercent = 82 - rowIndex * 22; // Row 0: 82%, Row 1: 60%, Row 2: 38%, Row 3: 16%

    // Normalized X coordinate across row
    const colFraction = leavesPerRow > 1 ? colIndex / (leavesPerRow - 1) : 0.5;
    const colXPercent = isEvenRow
      ? 12 + colFraction * 76 // Left to Right
      : 88 - colFraction * 76; // Right to Left (serpentine bend)

    // Subtle natural organic offsets
    const organicXOffset = Math.sin(i * 1.9) * 2.0;
    const organicYOffset = Math.cos(i * 2.3) * 2.5;

    const rotation = (i % 2 === 0 ? 1 : -1) * (5 + (i % 3) * 3);

    waypoints.push({
      x: Math.max(8, Math.min(92, colXPercent + organicXOffset)),
      y: Math.max(10, Math.min(90, rowYPercent + organicYOffset)),
      rotation,
    });
  }

  return waypoints;
}
