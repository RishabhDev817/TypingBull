import { Howl } from 'howler';

/**
 * Utility to write a string directly into a DataView for WAV headers.
 */
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Generates a base64 WAV Data URI of a synthesized sound.
 * This guarantees offline operation and zero network loading latency.
 */
function createWavDataUri(
  sampleRate: number,
  generateSamples: (t: number, index: number) => number,
  durationSeconds: number
): string {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + numSamples * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = raw PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * channelCount * bytesPerSample)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channelCount * bytesPerSample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, numSamples * 2, true);

  // Write PCM data
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generateSamples(t, i)));
    // Convert float [-1, 1] to signed 16-bit integer [-32768, 32767]
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Convert array buffer to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

// ─── Sound Definitions ─────────────────────────────────────────────

// 1. Mechanical switch click sound (crisp, fast decay)
const clickSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-120 * t);
  const noise = (Math.random() - 0.5) * 0.45;
  const tone = Math.sin(2 * Math.PI * 950 * t) * 0.55;
  return env * (noise + tone);
}, 0.05);

// 2. Spacebar key clack sound (slightly deeper and longer)
const clackSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-70 * t);
  const noise = (Math.random() - 0.5) * 0.5;
  const tone = Math.sin(2 * Math.PI * 380 * t) * 0.5;
  return env * (noise + tone);
}, 0.09);

// 3. Gentle "boing" mistake sound (soft and playful, never harsh)
const errorSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-18 * t);
  const pitch = 280 + 120 * Math.exp(-15 * t); // descending pitch for "boing"
  const tone = Math.sin(2 * Math.PI * pitch * t) * 0.35;
  const overtone = Math.sin(2 * Math.PI * pitch * 2.5 * t) * 0.1;
  return env * (tone + overtone);
}, 0.15);

// 4. Streak milestone achievement (uplifting charging sound)
const streakSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-6 * t);
  const pitch = 450 + 550 * Math.min(1, t * 4);
  const tone1 = Math.sin(2 * Math.PI * pitch * t) * 0.45;
  const tone2 = Math.sin(2 * Math.PI * pitch * 1.5 * t) * 0.25;
  return env * (tone1 + tone2);
}, 0.35);

// 5. Completion/Victory chime (glorious chord sequence with tremolo)
const victorySound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-2.2 * t);
  const fC = 261.63; // C4
  const fE = 329.63; // E4
  const fG = 392.00; // G4
  const fC5 = 523.25; // C5
  const tone1 = Math.sin(2 * Math.PI * fC * t);
  const tone2 = Math.sin(2 * Math.PI * fE * t);
  const tone3 = Math.sin(2 * Math.PI * fG * t);
  const tone4 = Math.sin(2 * Math.PI * fC5 * t);
  const tremolo = 0.82 + 0.18 * Math.sin(2 * Math.PI * 10 * t);
  return env * tremolo * (tone1 * 0.2 + tone2 * 0.2 + tone3 * 0.2 + tone4 * 0.3);
}, 1.5);

// 6. Lesson complete — ascending arpeggio
const lessonCompleteSound = createWavDataUri(22050, (t) => {
  const noteFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
  const noteIdx = Math.min(3, Math.floor(t * 8));
  const noteTime = t - noteIdx * 0.125;
  const env = Math.exp(-8 * noteTime);
  const freq = noteFreqs[noteIdx];
  return env * Math.sin(2 * Math.PI * freq * t) * 0.4;
}, 0.6);

// 7. Level unlock — bright chime
const levelUnlockSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-4 * t);
  const sweep = 800 + 400 * Math.min(1, t * 5);
  const tone = Math.sin(2 * Math.PI * sweep * t) * 0.5;
  const shimmer = Math.sin(2 * Math.PI * sweep * 2 * t) * 0.15;
  return env * (tone + shimmer);
}, 0.4);

// 8. Star earn — sparkle sound
const starEarnSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-12 * t);
  const freq = 2000 + 1000 * Math.sin(t * 30);
  return env * Math.sin(2 * Math.PI * freq * t) * 0.3;
}, 0.2);

// 9. Game jump — whoosh
const gameJumpSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-10 * t);
  const freq = 200 + 800 * Math.min(1, t * 8);
  const noise = (Math.random() - 0.5) * 0.2;
  return env * (Math.sin(2 * Math.PI * freq * t) * 0.3 + noise);
}, 0.25);

// 10. Game fall — descending tone
const gameFallSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-3 * t);
  const freq = 600 - 400 * Math.min(1, t * 2);
  return env * Math.sin(2 * Math.PI * freq * t) * 0.4;
}, 0.5);

// 11. Game over — dramatic chord
const gameOverSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-1.5 * t);
  const f1 = 130.81; // C3
  const f2 = 155.56; // Eb3
  const f3 = 196.00; // G3
  const tone = Math.sin(2 * Math.PI * f1 * t) * 0.3
    + Math.sin(2 * Math.PI * f2 * t) * 0.25
    + Math.sin(2 * Math.PI * f3 * t) * 0.2;
  return env * tone;
}, 1.0);

// 12. Soft hover/pop sound
const hoverPopSound = createWavDataUri(22050, (t) => {
  const env = Math.exp(-95 * t);
  const freq = 450 + 150 * Math.sin(t * 12);
  return env * Math.sin(2 * Math.PI * freq * t) * 0.25;
}, 0.04);

// 13. Cricket night ambience
const cricketAmbience = createWavDataUri(11025, (t) => {
  const cycle = t % 1.6;
  if (cycle > 0.45) return 0;
  const pulseTime = (cycle * 12) % 1;
  const env = Math.sin(Math.PI * pulseTime) * Math.exp(-2.5 * pulseTime);
  const freq = 3800 + Math.sin(t * 80) * 120;
  return env * Math.sin(2 * Math.PI * freq * t) * 0.015;
}, 3.2);

// 14. Birds chirping day ambience
const birdsAmbience = createWavDataUri(11025, (t) => {
  const cycle = t % 4.0;
  if (cycle > 0.9) return 0;
  const env = Math.sin(Math.PI * (cycle / 0.9)) * Math.exp(-1.5 * cycle);
  const freq = 2200 + 1800 * Math.sin(cycle * 8) + 800 * cycle;
  return env * Math.sin(2 * Math.PI * freq * t) * 0.015;
}, 4.0);

// ─── Howler Players ────────────────────────────────────────────────

export const soundEngine = {
  click: new Howl({ src: [clickSound], format: ['wav'], volume: 0.65 }),
  clack: new Howl({ src: [clackSound], format: ['wav'], volume: 0.65 }),
  error: new Howl({ src: [errorSound], format: ['wav'], volume: 0.55 }),
  streak: new Howl({ src: [streakSound], format: ['wav'], volume: 0.6 }),
  victory: new Howl({ src: [victorySound], format: ['wav'], volume: 0.75 }),
  lessonComplete: new Howl({ src: [lessonCompleteSound], format: ['wav'], volume: 0.65 }),
  levelUnlock: new Howl({ src: [levelUnlockSound], format: ['wav'], volume: 0.6 }),
  starEarn: new Howl({ src: [starEarnSound], format: ['wav'], volume: 0.5 }),
  gameJump: new Howl({ src: [gameJumpSound], format: ['wav'], volume: 0.5 }),
  gameFall: new Howl({ src: [gameFallSound], format: ['wav'], volume: 0.55 }),
  gameOver: new Howl({ src: [gameOverSound], format: ['wav'], volume: 0.65 }),
  hoverPop: new Howl({ src: [hoverPopSound], format: ['wav'], volume: 0.4 }),
  birds: new Howl({ src: [birdsAmbience], format: ['wav'], volume: 0.15, loop: true }),
  crickets: new Howl({ src: [cricketAmbience], format: ['wav'], volume: 0.15, loop: true }),
  
  muted: false,

  setMute(isMuted: boolean) {
    this.muted = isMuted;
    Howler.mute(isMuted);
  },

  playClick(isSpace = false) {
    if (this.muted) return;
    if (isSpace) {
      this.clack.play();
    } else {
      this.click.play();
    }
  },

  playError() {
    if (this.muted) return;
    this.error.play();
  },

  playStreak() {
    if (this.muted) return;
    this.streak.play();
  },

  playVictory() {
    if (this.muted) return;
    this.victory.play();
  },

  playLessonComplete() {
    if (this.muted) return;
    this.lessonComplete.play();
  },

  playLevelUnlock() {
    if (this.muted) return;
    this.levelUnlock.play();
  },

  playStarEarn() {
    if (this.muted) return;
    this.starEarn.play();
  },

  playGameJump() {
    if (this.muted) return;
    this.gameJump.play();
  },

  playGameFall() {
    if (this.muted) return;
    this.gameFall.play();
  },

  playGameOver() {
    if (this.muted) return;
    this.gameOver.play();
  },

  playPop() {
    if (this.muted) return;
    this.hoverPop.play();
  },

  playAmbience(timeOfDay: 'sunrise' | 'day' | 'sunset' | 'night') {
    if (this.muted) return;
    this.stopAmbience();
    if (timeOfDay === 'night') {
      this.crickets.play();
    } else {
      this.birds.play();
    }
  },

  stopAmbience() {
    this.birds.stop();
    this.crickets.stop();
  }
};
