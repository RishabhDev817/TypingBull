/**
 * Single source of truth for the SEO title/description of each indexable route.
 * Used by the pages (client-side, via usePageSEO) AND by scripts/prerender-seo.mjs,
 * which bakes the same values into static HTML so crawlers that do not run
 * JavaScript, and link-preview bots, see correct tags for every URL.
 *
 * Keep titles <= 60 characters and descriptions <= 160 so Google does not truncate.
 */
export interface RouteMeta {
  /** Canonical path, with trailing slash. */
  path: string;
  title: string;
  description: string;
  /** Short heading + intro used as crawlable fallback content. */
  h1: string;
  intro: string;
}

export const ROUTE_META = {
  learn: {
    path: '/learn/',
    title: 'Learn Touch Typing Free: Great Typing Railway | TypingBull',
    description:
      'Learn touch typing step by step with a free, game-style course: home row, upper row, shift, numbers and more. Earn stars and track your WPM as you go.',
    h1: 'Learn touch typing, one station at a time',
    intro:
      'The Great Typing Railway is a structured, free touch typing course. Start with the home row, then add upper and lower rows, shift, numbers and symbols, earning stars as your speed and accuracy grow.',
  },
  play: {
    path: '/play/',
    title: 'Free Typing Games for Kids & Adults | TypingBull Arcade',
    description:
      'Play free typing games online: Lilypad Leap for young typists and Neon Velocity for fast, high-speed flow. Build speed and accuracy while having fun.',
    h1: 'Typing games that make practice fun',
    intro:
      'Pick an arcade mode and type to play. Lilypad Leap is gentle and great for beginners; Neon Velocity rewards fast, accurate typing with a highway-speed rush.',
  },
  practiceGround: {
    path: '/practice-ground/',
    title: 'Multiplayer Typing Race — Race Live Players | TypingBull',
    description:
      'Race real players in live multiplayer typing races, or play a quick match against bots. Create a private room with a code to challenge friends or classmates.',
    h1: 'Practice Ground: live multiplayer typing races',
    intro:
      'Jump into Quick Match, or create a private room and share the 5-digit code. Everyone types the same passage after a 3-2-1 countdown, with live progress bars and WPM for each racer.',
  },
  practice: {
    path: '/practice/',
    title: 'Typing Speed Test & WPM Practice (Free) | TypingBull',
    description:
      'Take a free typing test and practise with timed drills across 12 difficulty levels. See your WPM and accuracy instantly, including code and prose passages.',
    h1: 'Typing speed practice and WPM test',
    intro:
      'Work through 12 difficulty tiers of timed passages, from fables to essays and code, and see words per minute and accuracy as you type.',
  },
  guidelines: {
    path: '/guidelines/',
    title: 'Touch Typing Guide: Finger Placement & Posture | TypingBull',
    description:
      'Learn correct touch typing technique: home row finger placement, posture and ergonomics, plus an interactive keyboard map of which finger types each key.',
    h1: 'Touch typing guide: finger placement and posture',
    intro:
      'Rest your fingers on the home row (ASDF and JKL;), feel the bumps on F and J, and let each finger own its keys. An interactive map shows the correct finger for every key.',
  },
} satisfies Record<string, RouteMeta>;
