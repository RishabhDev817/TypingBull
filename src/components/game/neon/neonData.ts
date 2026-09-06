export interface WordObstacle {
  id: string;
  word: string;
  lane: number; // 0, 1, 2, or 3
  progress: number; // 0 (horizon) to 1 (player baseline)
  typedLength: number;
  isTargeted: boolean;
  speed: number; // progress per second
  points: number;
  isTurboWord?: boolean;
}

export interface LaserBeam {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  decay: number;
}

export const LANES_COUNT = 4;

export const MULTIPLIER_TIERS = [
  { threshold: 0, mult: 1, label: 'x1' },
  { threshold: 10, mult: 2, label: 'x2' },
  { threshold: 20, mult: 4, label: 'x4' },
  { threshold: 30, mult: 8, label: 'x8 TURBO' },
];

export const BASE_SPAWN_INTERVAL_MS = 2200; // time between spawns at 1x
export const MIN_SPAWN_INTERVAL_MS = 1000;
export const BASE_WORD_SPEED = 0.15; // progress per second (takes ~6.5s to reach bottom)
export const MAX_WORD_SPEED = 0.36; // at high combo and time

export const STANDARD_WORDS = [
  // Fast 3-4 letter words
  'glow', 'grid', 'byte', 'flux', 'sync', 'neon', 'warp', 'code', 'beam', 'dash',
  'volt', 'wave', 'race', 'burn', 'fast', 'push', 'core', 'zoom', 'drab', 'fuel',
  // Punchy 5-letter cyberpunk words
  'pulse', 'laser', 'drift', 'cyber', 'shift', 'boost', 'sonic', 'matrix', 'spark',
  'nexus', 'hyper', 'relay', 'glitch', 'synth', 'retro', 'quark', 'flare', 'orbit',
  'flash', 'turbo', 'blade', 'radar', 'drive', 'light', 'shock', 'surge', 'speed',
  // Energetic 6-letter words
  'vector', 'plasma', 'binary', 'rocket', 'photon', 'future', 'stream', 'tracer',
  'signal', 'switch', 'beacon', 'engine', 'runner', 'torque', 'apex', 'vortex'
];

export const TURBO_WORDS = [
  'overdrive', 'hyperspace', 'cybernetic', 'supercharge', 'accelerator',
  'subroutine', 'velocity', 'afterburner', 'mainframe', 'superconduct',
  'synesthesia', 'tachyon', 'ultraviolet', 'megastructure', 'wavelength',
  'singularity', 'nanosecond', 'interstellar', 'electromagnetic', 'hyperdrive'
];

import { getLocalizedNeonWord } from '../../../data/gameWordsI18n';
import type { SupportedLocale } from '../../../i18n/ui';

export function getRandomWord(isTurbo: boolean, lang?: SupportedLocale): string {
  if (lang && lang !== 'en') {
    return getLocalizedNeonWord(isTurbo, lang);
  }
  if (isTurbo && Math.random() < 0.65) {
    return TURBO_WORDS[Math.floor(Math.random() * TURBO_WORDS.length)];
  }
  return STANDARD_WORDS[Math.floor(Math.random() * STANDARD_WORDS.length)];
}

export function getMultiplier(streak: number): number {
  if (streak >= 30) return 8;
  if (streak >= 20) return 4;
  if (streak >= 10) return 2;
  return 1;
}

export const LANE_COLORS = [
  { border: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', name: 'Cyan' },     // Lane 0
  { border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', name: 'Blue' },     // Lane 1
  { border: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', name: 'Pink' },     // Lane 2
  { border: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', name: 'Purple' },   // Lane 3
];
