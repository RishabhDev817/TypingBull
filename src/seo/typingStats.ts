/** Pure typing-speed maths and benchmark data shared by the typing test and the benchmark page. */

/** Standard WPM: one "word" is five characters. */
export function calcWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return Math.round(correctChars / 5 / (elapsedMs / 60000));
}

/** Accuracy as a percentage with one decimal, 100 when nothing has been typed. */
export function calcAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10;
}

export interface SpeedBand {
  id: string;
  label: string;
  /** Friendlier name shown on the result screen. */
  title: string;
  /** Mascot mood for the result screen. */
  mood: 'happy' | 'cheering';
  /** Inclusive lower bound in WPM. */
  min: number;
  /** Exclusive upper bound (Infinity for the last band). */
  max: number;
  blurb: string;
}

/** Typical bands. Ranges are rules of thumb drawn from widely cited typing studies, not exact cut-offs. */
export const SPEED_BANDS: SpeedBand[] = [
  { id: 'beginner', label: 'Beginner', title: 'Warming up', mood: 'happy', min: 0, max: 25, blurb: 'Hunting for keys, usually looking at the keyboard. Touch typing practice will lift this quickly.' },
  { id: 'below', label: 'Below average', title: 'Finding your rhythm', mood: 'happy', min: 25, max: 38, blurb: 'Comfortable with most keys but still slowed by hesitations and corrections.' },
  { id: 'average', label: 'Average', title: 'Right on track', mood: 'happy', min: 38, max: 55, blurb: 'Typical for adults who type every day. Fine for most office work.' },
  { id: 'good', label: 'Above average', title: 'Sharp fingers', mood: 'cheering', min: 55, max: 75, blurb: 'Meets the usual target for administrative and professional roles.' },
  { id: 'fast', label: 'Fast', title: 'Speedy', mood: 'cheering', min: 75, max: 100, blurb: 'Strong touch typist. Typing no longer limits how fast you can write.' },
  { id: 'expert', label: 'Expert', title: 'Lightning fast', mood: 'cheering', min: 100, max: Infinity, blurb: 'Competitive territory. Few people sustain this speed with high accuracy.' },
];

export function bandForWpm(wpm: number): SpeedBand {
  return SPEED_BANDS.find((b) => wpm >= b.min && wpm < b.max) ?? SPEED_BANDS[SPEED_BANDS.length - 1];
}

/** Typical WPM expectations by purpose. Indicative only: employers set their own tests. */
export const TARGETS_BY_PURPOSE: { purpose: string; wpm: string; note: string }[] = [
  { purpose: 'Casual everyday use', wpm: '30–40', note: 'Messaging, browsing, short emails.' },
  { purpose: 'Students', wpm: '35–50', note: 'Essays and note-taking without slowing down thinking.' },
  { purpose: 'Office and administrative work', wpm: '45–65', note: 'Many job ads ask for around 50 WPM.' },
  { purpose: 'Data entry', wpm: '60–80', note: 'Accuracy of 97%+ is usually required as well.' },
  { purpose: 'Transcription and court reporting', wpm: '80–120+', note: 'Specialist roles, often with their own certification.' },
  { purpose: 'Programmers', wpm: '40–70', note: 'Speed matters less than accuracy on symbols and brackets.' },
];
