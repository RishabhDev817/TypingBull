/**
 * TypingBull Classroom Lesson System
 * Reusable, extensible curriculum data structure designed for computer labs and classroom environments.
 */

export interface GuidedDrill {
  prompt: string;
  pattern: string;
  focusKeys: string[];
}

export interface ClassroomLesson {
  id: string;
  lessonNumber: string; // e.g. "01"
  title: string;
  shortTitle: string;
  category: string;
  badge: string;
  description: string;
  learningObjective: string;
  explanation: string;
  typingConcept: {
    title: string;
    description: string;
    keyHighlights: string[];
    fingerGuide: { finger: string; hand: 'left' | 'right'; keys: string[] }[];
  };
  example: {
    demonstration: string;
    tip: string;
  };
  guidedPractice: GuidedDrill[];
  typingExercise: {
    title: string;
    instructions: string;
    targetText: string;
    targetWpm: number;
    minimumAccuracy: number;
  };
  passage?: {
    title: string;
    category: string;
    text: string;
    targetWpm: number;
  };
}

export const CLASSROOM_LESSONS: ClassroomLesson[] = [
  {
    id: 'lesson-01-home-row',
    lessonNumber: '01',
    title: 'Home Row Foundations & Tactile Anchors',
    shortTitle: 'Home Row Basics',
    category: 'Foundations',
    badge: 'Core Essential',
    description: 'Learn the primary rest positions for your fingers and discover the tactile orientation bumps on F and J.',
    learningObjective: 'Anchor both hands firmly on the home row without looking down, mastering A, S, D, F and J, K, L, ; keys.',
    explanation:
      'The home row is the central horizontal line of letters where your fingers naturally rest between keystrokes. Keeping your fingers curved lightly above these anchor keys allows rapid, strain-free travel to every other key on the keyboard.',
    typingConcept: {
      title: 'Tactile Orientation Bumps (F & J)',
      description:
        'Virtually every modern keyboard has tiny raised ridges on the F and J keys. Your left index finger rests on F, and your right index finger rests on J. Use these bumps to recalibrate your hand position blindly at any moment.',
      keyHighlights: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
      fingerGuide: [
        { finger: 'Left Pinky', hand: 'left', keys: ['A'] },
        { finger: 'Left Ring', hand: 'left', keys: ['S'] },
        { finger: 'Left Middle', hand: 'left', keys: ['D'] },
        { finger: 'Left Index', hand: 'left', keys: ['F'] },
        { finger: 'Right Index', hand: 'right', keys: ['J'] },
        { finger: 'Right Middle', hand: 'right', keys: ['K'] },
        { finger: 'Right Ring', hand: 'right', keys: ['L'] },
        { finger: 'Right Pinky', hand: 'right', keys: [';'] },
      ],
    },
    example: {
      demonstration: 'fff jjj fff jjj asdf jkl; a s d f j k l ;',
      tip: 'Never look down at the keyboard. Trust the physical bumps beneath your index fingers.',
    },
    guidedPractice: [
      {
        prompt: 'Anchor index fingers on tactile ridges and alternate strokes',
        pattern: 'fff jjj fjf jfj fff jjj ff jj',
        focusKeys: ['F', 'J'],
      },
      {
        prompt: 'Extend left hand pinky through index in rhythmic succession',
        pattern: 'asdf asdf fdsa fdsa a s d f',
        focusKeys: ['A', 'S', 'D', 'F'],
      },
      {
        prompt: 'Extend right hand index through pinky smoothly',
        pattern: 'jkl; jkl; ;lkj ;lkj j k l ;',
        focusKeys: ['J', 'K', 'L', ';'],
      },
      {
        prompt: 'Full Home Row coordination with natural thumbs on spacebar',
        pattern: 'asdf jkl; asdf jkl; fall flask glad salad',
        focusKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
      },
    ],
    typingExercise: {
      title: 'Home Row Cadence Drill',
      instructions: 'Keep palms slightly elevated above the desk. Type with steady, even rhythm without looking down.',
      targetText: 'a sad lad had a flask. all fall as a flash flads a lad. a glad lad asks dad for a salad as a flask falls.',
      targetWpm: 22,
      minimumAccuracy: 92,
    },
    passage: {
      title: 'The Silent Meadow Path',
      category: 'Guided Narrative',
      text: 'A glad lad had a calm day at the lake. All glad folks ask dad for a small salad and a fresh glass. Soft fall winds pass as dusk falls.',
      targetWpm: 25,
    },
  },
  {
    id: 'lesson-02-top-row',
    lessonNumber: '02',
    title: 'Top Row Reach & Upper Keys',
    shortTitle: 'Top Row Reach',
    category: 'Finger Mobility',
    badge: 'Essential Reach',
    description: 'Master upward reaches to E, R, T, U, I, and O while returning fingers immediately to home row anchors.',
    learningObjective: 'Reach up from the home row to strike upper vowels and consonants accurately without moving wrist position.',
    explanation:
      'Reaching to the top row requires curving your fingers forward from the home row knuckle joints. The most crucial rule is spring-back: strike the target key cleanly and immediately return to home row.',
    typingConcept: {
      title: 'Spring-Back Mobility',
      description:
        'Do not hover your hand over the top row. Each finger extends up, taps its assigned key, and springs back to rest lightly on its home row guide.',
      keyHighlights: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      fingerGuide: [
        { finger: 'Left Middle', hand: 'left', keys: ['E'] },
        { finger: 'Left Index', hand: 'left', keys: ['R', 'T'] },
        { finger: 'Right Index', hand: 'right', keys: ['Y', 'U'] },
        { finger: 'Right Middle', hand: 'right', keys: ['I'] },
        { finger: 'Right Ring', hand: 'right', keys: ['O'] },
      ],
    },
    example: {
      demonstration: 'ded frf ftf juj kik lol',
      tip: 'Only the reaching finger moves. Keep the other three fingers anchored on their home keys.',
    },
    guidedPractice: [
      {
        prompt: 'Left hand index and middle finger upward reach and recoil',
        pattern: 'ded frf ded frf red tree feed reed',
        focusKeys: ['E', 'R', 'D', 'F'],
      },
      {
        prompt: 'Right hand index and middle finger upper reach',
        pattern: 'juj kik juj kik out pour quiet kite',
        focusKeys: ['U', 'I', 'J', 'K'],
      },
      {
        prompt: 'Top row vowels and common English syllables',
        pattern: 'tie row top wire roof true proud floor',
        focusKeys: ['E', 'R', 'T', 'U', 'I', 'O'],
      },
    ],
    typingExercise: {
      title: 'Top Row Flow Exercise',
      instructions: 'Maintain a steady tempo. Ensure fingers snap back to home row after every upward strike.',
      targetText: 'the wild fox leaps over the tall oak fence. write great letters with proud power and pure quiet focus.',
      targetWpm: 28,
      minimumAccuracy: 92,
    },
    passage: {
      title: 'Morning in the Valley',
      category: 'Gentle Storytelling',
      text: 'The morning sun rose gently over the emerald hills, painting the river with strokes of liquid gold. In the meadow below, a young deer paused by the edge of the crystal spring.',
      targetWpm: 30,
    },
  },
  {
    id: 'lesson-03-bottom-row',
    lessonNumber: '03',
    title: 'Bottom Row Precision & Downward Angles',
    shortTitle: 'Bottom Row Precision',
    category: 'Flexion & Control',
    badge: 'Precision Angle',
    description: 'Learn curl movements to reach Z, X, C, V, B, N, and M with controlled finger flexion.',
    learningObjective: 'Curl fingers cleanly downward beneath the home row without resting palms heavily on the desk surface.',
    explanation:
      'Reaching the bottom row requires finger curl rather than sliding your whole arm backward. Keep your wrists straight and slightly floating so your fingers have freedom to flex comfortably.',
    typingConcept: {
      title: 'Controlled Knuckle Flexion',
      description:
        'Bend the first knuckle downward while keeping the wrist stationary. Avoid resting your palm flat on the table, as this restricts downward range of motion.',
      keyHighlights: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      fingerGuide: [
        { finger: 'Left Ring', hand: 'left', keys: ['X'] },
        { finger: 'Left Middle', hand: 'left', keys: ['C'] },
        { finger: 'Left Index', hand: 'left', keys: ['V', 'B'] },
        { finger: 'Right Index', hand: 'right', keys: ['N', 'M'] },
      ],
    },
    example: {
      demonstration: 'fbf fvf dcd sxs jnj jmj',
      tip: 'Floating wrists provide the natural clearance needed for downward finger curls.',
    },
    guidedPractice: [
      {
        prompt: 'Left index and middle curl drills',
        pattern: 'fvf dcd fvf dcd cab cave civic calm',
        focusKeys: ['V', 'C', 'F', 'D'],
      },
      {
        prompt: 'Right index curl drills for N and M',
        pattern: 'jnj jmj jnj jmj man men moon mint',
        focusKeys: ['N', 'M', 'J'],
      },
      {
        prompt: 'Full bottom row cross-coordination',
        pattern: 'back calm vine zinc move zoom next comb',
        focusKeys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      },
    ],
    typingExercise: {
      title: 'Bottom Row Dexterity Drill',
      instructions: 'Keep light touch on the key caps. Focus on zero hesitation when curling downward.',
      targetText: 'six brave men came back from the deep cave. many calm rivers carve stone canyons under dark winter moons.',
      targetWpm: 26,
      minimumAccuracy: 93,
    },
    passage: {
      title: 'The Orchard Path',
      category: 'Flow & Cadence',
      text: 'Along the winding stone wall of the old orchard, sweet apples hung heavy on mossy boughs. Thomas carried a willow basket in his left hand, whistling a cheerful melody.',
      targetWpm: 32,
    },
  },
  {
    id: 'lesson-04-shift-key',
    lessonNumber: '04',
    title: 'Shift Key Coordination & Capitalization',
    shortTitle: 'Shift & Capitals',
    category: 'Two-Hand Sync',
    badge: 'Bimanual Sync',
    description: 'Master opposite-hand shift key discipline for effortless, accurate capitalization.',
    learningObjective: 'Use the opposite pinky to hold Shift while striking a letter with the other hand, maintaining unbroken cadence.',
    explanation:
      'The golden rule of typing capitals: Always use the Shift key opposite the striking hand. When typing a capital letter with your left hand, hold Right Shift. When typing a capital letter with your right hand, hold Left Shift.',
    typingConcept: {
      title: 'Opposite-Hand Shift Rule',
      description:
        'Using the same hand for Shift and the letter twists your wrist into awkward, slow angles. Opposite-hand shifting keeps both wrists straight and neutral.',
      keyHighlights: ['Shift (Left)', 'Shift (Right)'],
      fingerGuide: [
        { finger: 'Left Pinky', hand: 'left', keys: ['Left Shift (for right hand letters)'] },
        { finger: 'Right Pinky', hand: 'right', keys: ['Right Shift (for left hand letters)'] },
      ],
    },
    example: {
      demonstration: 'Right Shift + F = F | Left Shift + J = J',
      tip: 'Press and hold Shift first, tap the letter, then release Shift together.',
    },
    guidedPractice: [
      {
        prompt: 'Capital letters for left hand (hold Right Shift)',
        pattern: 'France Spain Denver Texas Boston Atlanta',
        focusKeys: ['Shift', 'F', 'S', 'D', 'T', 'B', 'A'],
      },
      {
        prompt: 'Capital letters for right hand (hold Left Shift)',
        pattern: 'Japan London Kyoto Norway Munich Paris',
        focusKeys: ['Shift', 'J', 'L', 'K', 'N', 'M', 'P'],
      },
      {
        prompt: 'Sentence capitalization and proper nouns',
        pattern: 'Monday Tuesday Wednesday Thursday Friday',
        focusKeys: ['Shift'],
      },
    ],
    typingExercise: {
      title: 'Capitalization Velocity Exercise',
      instructions: 'Focus on fluid two-hand synchronization without pausing when a capital letter appears.',
      targetText: 'Dr. Alice Morgan arrived in Rome on Tuesday. She visited the Pantheon and the Colosseum before traveling to Naples.',
      targetWpm: 30,
      minimumAccuracy: 94,
    },
    passage: {
      title: 'The Clockmaker of Prague',
      category: 'Narrative Detail',
      text: 'Deep within the cobbled alleys of the old city, Master Jan examined the intricate bronze escapement with a brass magnifying loupe. Each delicate tooth required millimeter precision.',
      targetWpm: 35,
    },
  },
  {
    id: 'lesson-05-numbers-punctuation',
    lessonNumber: '05',
    title: 'Number Row Precision & Punctuation',
    shortTitle: 'Numbers & Punctuation',
    category: 'Extended Geometry',
    badge: 'Full Keyboard',
    description: 'Extend finger reach to numbers 1 through 0 and common punctuation marks without leaving home row.',
    learningObjective: 'Confidently type numerical data and punctuation without looking down or breaking cadence.',
    explanation:
      'The number row is two rows above home position. Practicing consistent finger allocation for numbers 1 to 0 prevents awkward hunting and peck habits when entering dates, statistics, and prices.',
    typingConcept: {
      title: 'Number Allocation Columns',
      description:
        'Left pinky takes 1, ring takes 2, middle takes 3, index takes 4 and 5. Right index takes 6 and 7, middle takes 8, ring takes 9, and pinky takes 0, minus, and equals.',
      keyHighlights: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '!', '?'],
      fingerGuide: [
        { finger: 'Left Hand (1-5)', hand: 'left', keys: ['1', '2', '3', '4', '5'] },
        { finger: 'Right Hand (6-0)', hand: 'right', keys: ['6', '7', '8', '9', '0'] },
        { finger: 'Punctuation', hand: 'right', keys: [',', '.', '/', ';', "'"] },
      ],
    },
    example: {
      demonstration: '123 456 7890 2026 $500 100% 3.1415',
      tip: 'Do not lift your entire forearm. Arc fingers from the second joint.',
    },
    guidedPractice: [
      {
        prompt: 'Left hand number column drills',
        pattern: '12 34 54 23 15 142 531 245',
        focusKeys: ['1', '2', '3', '4', '5'],
      },
      {
        prompt: 'Right hand number column drills',
        pattern: '67 89 90 78 80 678 908 7890',
        focusKeys: ['6', '7', '8', '9', '0'],
      },
      {
        prompt: 'Mixed dates, numbers, and punctuation',
        pattern: 'May 14, 2026: 42 items at $19.99 each!',
        focusKeys: ['Numbers', 'Punctuation'],
      },
    ],
    typingExercise: {
      title: 'Technical Typing Assessment',
      instructions: 'Accuracy takes absolute priority over speed when dealing with numbers and punctuation.',
      targetText: 'In 2026, over 75% of classroom students improved typing speed from 24 wpm to 48 wpm in just 12 weeks of guided drills.',
      targetWpm: 28,
      minimumAccuracy: 95,
    },
    passage: {
      title: 'Voyage Beyond the Reef',
      category: 'Dynamic Essay',
      text: 'As the caravel pushed past the outer breakwater, towering sapphire swells lifted the wooden hull with majestic power. Captain Alverez adjusted the brass sextant toward the northern star.',
      targetWpm: 40,
    },
  },
  {
    id: 'lesson-06-rhythm-cadence',
    lessonNumber: '06',
    title: 'Rhythm, Flow & Sustained Cadence',
    shortTitle: 'Rhythm & Cadence',
    category: 'Endurance & Fluency',
    badge: 'Mastery',
    description: 'Transform isolated keystrokes into fluid word bursts and continuous, relaxed typing momentum.',
    learningObjective: 'Maintain a steady, metronomic cadence where rhythm dictates speed, eliminating burst-and-pause habits.',
    explanation:
      'Elite typists do not burst fast on easy words and stumble to a halt on difficult words. They maintain a calm, steady rhythm like a metronome. Smooth rhythm creates relaxed muscles, which naturally produces world-class speed.',
    typingConcept: {
      title: 'The Metronome Effect',
      description:
        'Hear the tap-tap-tap of your keys like a musical beat. Read one to two words ahead of your fingers so your mind prepares the finger movements in advance.',
      keyHighlights: ['Fluency', 'Look Ahead', 'Muscle Relaxation'],
      fingerGuide: [
        { finger: 'Full Hands', hand: 'left', keys: ['Floating wrists', 'Loose shoulders'] },
        { finger: 'Full Hands', hand: 'right', keys: ['Steady breathing', 'Look ahead'] },
      ],
    },
    example: {
      demonstration: 'smooth steady even rhythm creates sustained speed with effortless comfort',
      tip: 'Read two words ahead while your fingers execute the current word.',
    },
    guidedPractice: [
      {
        prompt: 'Even metronomic rhythm on balanced words',
        pattern: 'time over year work hand line sound great place',
        focusKeys: ['Flow', 'Balance'],
      },
      {
        prompt: 'Compound sentence sustained cadence',
        pattern: 'keep typing smoothly without pausing between letters or words',
        focusKeys: ['Continuity'],
      },
      {
        prompt: 'Longer paragraph flow without hesitation',
        pattern: 'practice daily with good posture and calm concentration',
        focusKeys: ['Endurance'],
      },
    ],
    typingExercise: {
      title: 'Fluency & Cadence Challenge',
      instructions: 'Strive for continuous keystrokes. Treat mistakes gently—never stop typing or hammer backspace aggressively.',
      targetText: 'The secret to rapid typing is not frantic effort but relaxed consistency. When your hands move with gentle confidence, high speed and total accuracy happen naturally.',
      targetWpm: 36,
      minimumAccuracy: 95,
    },
    passage: {
      title: 'The Art of the Typewriter',
      category: 'Fluency Essay',
      text: 'Every keystroke resonates with intentional purpose. Through daily repetition, the mechanical barrier of the keyboard dissolves into pure thought translated instantly onto the glass display.',
      targetWpm: 42,
    },
  },
];
