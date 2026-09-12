/**
 * Curated, verified passages for Practice Ground multiplayer races.
 * Balanced lengths (around 200 - 450 characters) designed for 45 to 60 second races.
 */

export interface MultiplayerPassage {
  id: string;
  title: string;
  category: 'Tech & Future' | 'Mindset & Growth' | 'Science & Cosmos' | 'Classic Literature';
  text: string;
}

export const MULTIPLAYER_PASSAGES: MultiplayerPassage[] = [
  {
    id: 'passage-1',
    title: 'The Nature of Code',
    category: 'Tech & Future',
    text: 'Code is poetry written with logic and intent. Every function breathes life into silicon, transforming abstract human thoughts into tangible digital experiences that span across the globe in milliseconds.',
  },
  {
    id: 'passage-2',
    title: 'Velocity and Precision',
    category: 'Mindset & Growth',
    text: 'Speed is meaningless without accuracy. True mastery comes from calmness, rhythmic finger movement, and trusting the muscle memory developed through thousands of deliberate keystrokes.',
  },
  {
    id: 'passage-3',
    title: 'Wonders of the Cosmos',
    category: 'Science & Cosmos',
    text: 'Across billions of light years, silent stars ignite and fade in cosmic balance. We are explorers made of stardust, using keyboards and screens to decipher the grand equations of the universe.',
  },
  {
    id: 'passage-4',
    title: 'The Digital Frontier',
    category: 'Tech & Future',
    text: 'Technology connects humanity across oceans and mountain peaks. Ideas shared in an instant spark revolutions of learning, creativity, and boundless innovation for future generations.',
  },
  {
    id: 'passage-5',
    title: 'The Ocean Depth',
    category: 'Science & Cosmos',
    text: 'Beneath the rolling ocean waves lies an alien realm of bioluminescent marvels and silent currents. In the deep abyss, life thrives in pitch darkness with quiet grace and enduring patience.',
  },
  {
    id: 'passage-6',
    title: 'The Art of Continuous Focus',
    category: 'Mindset & Growth',
    text: 'Focus is not a gift bestowed upon a lucky few, but a muscle strengthened day by day. When distractions fade and fingers dance with purpose, effortless flow takes flight.',
  },
  {
    id: 'passage-7',
    title: 'The Mountain Trail',
    category: 'Classic Literature',
    text: 'Step by step the narrow trail climbed toward the windblown summit. Above the timberline, the morning sky opened into an endless expanse of crisp alpine blue and quiet resolve.',
  },
  {
    id: 'passage-8',
    title: 'Symphony of Keys',
    category: 'Tech & Future',
    text: 'A rhythmic staccato fills the room as fingertips strike mechanical switches. Each keystroke weaves logic, creating software that empowers curious minds across the world.',
  },
];

/**
 * Returns a random passage from the pool.
 */
export function getRandomRacePassage(): MultiplayerPassage {
  const index = Math.floor(Math.random() * MULTIPLAYER_PASSAGES.length);
  return MULTIPLAYER_PASSAGES[index];
}
