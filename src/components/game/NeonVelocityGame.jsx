import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Zap,
  Shield,
  Trophy,
  Flame,
  Gauge,
  Sparkles,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import { neonAudio } from './neon/neonAudio';
import { Mascot } from '../Mascot';
import { AITutorReport } from '../AITutorReport';

const HIGH_SCORE_KEY = 'typingbull_neon_velocity_highscore';
const LANES_COUNT = 4;

const LANE_COLORS = [
  { border: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)', name: 'Cyan' },     // Lane 0
  { border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', name: 'Blue' },     // Lane 1
  { border: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', name: 'Pink' },     // Lane 2
  { border: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', name: 'Purple' },   // Lane 3
];

const STANDARD_WORDS = [
  'glow', 'grid', 'byte', 'flux', 'sync', 'neon', 'warp', 'code', 'beam', 'dash',
  'volt', 'wave', 'race', 'burn', 'fast', 'push', 'core', 'zoom', 'fuel', 'dart',
  'pulse', 'laser', 'drift', 'cyber', 'shift', 'boost', 'sonic', 'matrix', 'spark',
  'nexus', 'hyper', 'relay', 'glitch', 'synth', 'retro', 'quark', 'flare', 'orbit',
  'flash', 'turbo', 'blade', 'radar', 'drive', 'light', 'shock', 'surge', 'speed',
  'vector', 'plasma', 'binary', 'rocket', 'photon', 'future', 'stream', 'tracer',
  'signal', 'switch', 'beacon', 'engine', 'runner', 'torque', 'apex', 'vortex'
];

const TURBO_WORDS = [
  'overdrive', 'hyperspace', 'cybernetic', 'supercharge', 'accelerator',
  'subroutine', 'velocity', 'afterburner', 'mainframe', 'superconduct',
  'synesthesia', 'tachyon', 'ultraviolet', 'megastructure', 'wavelength',
  'singularity', 'nanosecond', 'interstellar', 'electromagnetic', 'hyperdrive'
];

function getRandomWord(isTurbo) {
  if (isTurbo && Math.random() < 0.65) {
    return TURBO_WORDS[Math.floor(Math.random() * TURBO_WORDS.length)];
  }
  return STANDARD_WORDS[Math.floor(Math.random() * STANDARD_WORDS.length)];
}

function getMultiplier(streak) {
  if (streak >= 30) return 8;
  if (streak >= 20) return 4;
  if (streak >= 10) return 2;
  return 1;
}

export const NeonVelocityGame = ({ onBackToHub }) => {
  const canvasRef = useRef(null);

  // High-level HUD state
  const [gameState, setGameState] = useState('countdown');
  const [countdown, setCountdown] = useState(3);
  const [shield, setShield] = useState(100);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isTurbo, setIsTurbo] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [peakWpm, setPeakWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsDestroyed, setWordsDestroyed] = useState(0);
  const [isMuted, setIsMuted] = useState(soundEngine.muted);
  const [isVictory, setIsVictory] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // High-performance mutable engine reference
  const engineRef = useRef({
    words: [],
    lasers: [],
    particles: [],
    speedLines: [],
    stars: [],
    citySkyline: [],
    lockedWordId: null,
    playerLaneX: 0.5,
    targetPlayerLaneX: 0.5,
    shieldVal: 100,
    scoreVal: 0,
    streakVal: 0,
    maxStreakVal: 0,
    multiplierVal: 1,
    wordsDestroyedVal: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    gameStartTime: 0,
    lastSpawnTime: 0,
    lastTime: 0,
    gridOffset: 0,
    screenShake: 0,
    redFlashAlpha: 0,
    animationFrameId: 0,
    isTurboActive: false,
    gameOverTriggered: false,
    laserCannonToggle: false,
  });

  const handleToggleMute = useCallback(() => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMute(nextMute);
    if (nextMute) {
      neonAudio.stopBgm();
    } else if (gameState === 'playing') {
      neonAudio.startBgm();
    }
  }, [isMuted, gameState]);

  // Restart / Reset Game
  const startNewGame = useCallback(() => {
    neonAudio.stopBgm();

    const engine = engineRef.current;
    engine.words = [];
    engine.lasers = [];
    engine.particles = [];
    engine.lockedWordId = null;
    engine.playerLaneX = 0.5;
    engine.targetPlayerLaneX = 0.5;
    engine.shieldVal = 100;
    engine.scoreVal = 0;
    engine.streakVal = 0;
    engine.maxStreakVal = 0;
    engine.multiplierVal = 1;
    engine.wordsDestroyedVal = 0;
    engine.totalKeystrokes = 0;
    engine.correctKeystrokes = 0;
    engine.gameStartTime = performance.now();
    engine.lastSpawnTime = performance.now();
    engine.lastTime = performance.now();
    engine.gridOffset = 0;
    engine.screenShake = 0;
    engine.redFlashAlpha = 0;
    engine.isTurboActive = false;
    engine.gameOverTriggered = false;

    engine.stars = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.28,
      size: 0.8 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.8,
    }));

    engine.citySkyline = Array.from({ length: 32 }, () => ({
      widthRatio: 0.03 + Math.random() * 0.04,
      heightRatio: 0.04 + Math.random() * 0.09,
      hasAntenna: Math.random() < 0.35,
      windowColor: Math.random() < 0.5 ? '#00f0ff' : '#ec4899',
    }));

    engine.speedLines = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      length: 25 + Math.random() * 50,
      speed: 0.9 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.45,
    }));

    setShield(100);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMultiplier(1);
    setIsTurbo(false);
    setWpm(0);
    setPeakWpm(0);
    setAccuracy(100);
    setWordsDestroyed(0);
    setIsNewHighScore(false);
    setIsVictory(false);
    setCountdown(3);
    setGameState('countdown');
  }, []);

  useEffect(() => {
    startNewGame();
    return () => {
      neonAudio.stopBgm();
    };
  }, [startNewGame]);

  useEffect(() => {
    if (gameState === 'playing' && !isMuted) {
      neonAudio.startBgm();
    } else {
      neonAudio.stopBgm();
    }
  }, [gameState, isMuted]);

  useEffect(() => {
    if (gameState !== 'countdown') return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 750);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
      engineRef.current.gameStartTime = performance.now();
      engineRef.current.lastSpawnTime = performance.now();
      engineRef.current.lastTime = performance.now();
      if (!isMuted) {
        neonAudio.startBgm();
      }
    }
  }, [countdown, gameState, isMuted]);

  const triggerGameOver = useCallback((forceVictory = false) => {
    const engine = engineRef.current;
    if (engine.gameOverTriggered) return;
    engine.gameOverTriggered = true;

    neonAudio.stopBgm();

    const finalScore = engine.scoreVal;
    let won = forceVictory || finalScore >= 1200;

    try {
      const saved = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
      if (finalScore > saved && finalScore > 0) {
        localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
        setHighScore(finalScore);
        setIsNewHighScore(true);
        won = true;
      }
    } catch {
      // Storage fallback
    }

    setIsVictory(won);
    if (won) {
      neonAudio.playVictoryCrescendo();
    } else {
      soundEngine.gameOver.play();
    }

    setGameState('gameover');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        setGameState('paused');
        return;
      }
      if (gameState !== 'playing') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      const char = e.key.toLowerCase();
      const engine = engineRef.current;
      engine.totalKeystrokes++;

      let activeWord = engine.words.find((w) => w.id === engine.lockedWordId);

      if (!activeWord) {
        const candidates = engine.words
          .filter((w) => w.typedLength === 0 && w.word[0].toLowerCase() === char)
          .sort((a, b) => b.progress - a.progress);

        if (candidates.length > 0) {
          activeWord = candidates[0];
          activeWord.isTargeted = true;
          engine.lockedWordId = activeWord.id;
          engine.targetPlayerLaneX = (activeWord.lane + 0.5) / LANES_COUNT;
        }
      }

      if (activeWord) {
        const expectedChar = activeWord.word[activeWord.typedLength].toLowerCase();

        if (char === expectedChar) {
          engine.correctKeystrokes++;
          activeWord.typedLength++;
          engine.streakVal++;
          if (engine.streakVal > engine.maxStreakVal) {
            engine.maxStreakVal = engine.streakVal;
          }

          const prevMultiplier = engine.multiplierVal;
          const nextMultiplier = getMultiplier(engine.streakVal);
          if (nextMultiplier > prevMultiplier) {
            engine.multiplierVal = nextMultiplier;
            if (nextMultiplier === 8) {
              engine.isTurboActive = true;
              setIsTurbo(true);
              neonAudio.playTurboActivated();
            } else {
              neonAudio.playComboUp(nextMultiplier);
            }
          }

          const pitch = 0.95 + Math.min(0.6, activeWord.typedLength * 0.12);
          neonAudio.playLaser(pitch);

          const canvas = canvasRef.current;
          if (canvas) {
            const laneCenterRatio = (activeWord.lane + 0.5) / LANES_COUNT;
            const vanishingX = canvas.width / 2;
            const vanishingY = canvas.height * 0.28;
            const playerY = canvas.height * 0.88;
            const bottomTrackWidth = Math.min(960, canvas.width * 0.94);
            const bottomTrackLeft = (canvas.width - bottomTrackWidth) / 2;

            const z = activeWord.progress;
            const topTrackWidth = bottomTrackWidth * 0.18;
            const topTrackLeft = vanishingX - topTrackWidth / 2;
            const currentTrackWidth = topTrackWidth + (bottomTrackWidth - topTrackWidth) * z;
            const currentTrackLeft = topTrackLeft + (bottomTrackLeft - topTrackLeft) * z;
            const targetX = currentTrackLeft + currentTrackWidth * laneCenterRatio;
            const targetY = vanishingY + (playerY - vanishingY) * z;

            const playerX = bottomTrackLeft + bottomTrackWidth * engine.playerLaneX;
            engine.laserCannonToggle = !engine.laserCannonToggle;
            const wingtipOffset = engine.laserCannonToggle ? -24 : 24;

            engine.lasers.push({
              id: Math.random().toString(),
              startX: playerX + wingtipOffset,
              startY: playerY - 20,
              targetX,
              targetY,
              progress: 0,
              color: LANE_COLORS[activeWord.lane].border,
            });

            for (let i = 0; i < 7; i++) {
              engine.particles.push({
                x: targetX,
                y: targetY,
                vx: (Math.random() - 0.5) * 220,
                vy: (Math.random() - 0.5) * 220,
                alpha: 1,
                size: 2 + Math.random() * 3,
                color: '#38bdf8',
                decay: 3.5,
              });
            }
          }

          if (activeWord.typedLength >= activeWord.word.length) {
            engine.wordsDestroyedVal++;
            const wordBonus = activeWord.points * engine.multiplierVal * (activeWord.isTurboWord ? 2.5 : 1);
            engine.scoreVal += Math.round(wordBonus);

            neonAudio.playWordDestroyed(activeWord.isTurboWord);

            const canvas = canvasRef.current;
            if (canvas) {
              const laneCenterRatio = (activeWord.lane + 0.5) / LANES_COUNT;
              const vanishingX = canvas.width / 2;
              const vanishingY = canvas.height * 0.28;
              const playerY = canvas.height * 0.88;
              const bottomTrackWidth = Math.min(960, canvas.width * 0.94);
              const bottomTrackLeft = (canvas.width - bottomTrackWidth) / 2;

              const z = activeWord.progress;
              const topTrackWidth = bottomTrackWidth * 0.18;
              const topTrackLeft = vanishingX - topTrackWidth / 2;
              const currentTrackWidth = topTrackWidth + (bottomTrackWidth - topTrackWidth) * z;
              const currentTrackLeft = topTrackLeft + (bottomTrackLeft - topTrackLeft) * z;
              const expX = currentTrackLeft + currentTrackWidth * laneCenterRatio;
              const expY = vanishingY + (playerY - vanishingY) * z;

              const particleColor = activeWord.isTurboWord ? '#fbbf24' : LANE_COLORS[activeWord.lane].border;
              for (let i = 0; i < 28; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 90 + Math.random() * 280;
                engine.particles.push({
                  x: expX,
                  y: expY,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  alpha: 1,
                  size: 3 + Math.random() * 4,
                  color: particleColor,
                  decay: 2.2,
                });
              }
            }

            engine.words = engine.words.filter((w) => w.id !== activeWord.id);
            engine.lockedWordId = null;
          }

          setScore(engine.scoreVal);
          setStreak(engine.streakVal);
          setMaxStreak(engine.maxStreakVal);
          setMultiplier(engine.multiplierVal);
          setWordsDestroyed(engine.wordsDestroyedVal);
        } else {
          neonAudio.playTypoZap();
          engine.streakVal = 0;
          engine.multiplierVal = 1;
          engine.isTurboActive = false;
          setIsTurbo(false);
          setMultiplier(1);
          setStreak(0);
          engine.screenShake = 6;
        }
      } else {
        neonAudio.playTypoZap();
        engine.streakVal = 0;
        engine.multiplierVal = 1;
        engine.isTurboActive = false;
        setIsTurbo(false);
        setMultiplier(1);
        setStreak(0);
      }

      const acc = engine.totalKeystrokes > 0
        ? Math.round((engine.correctKeystrokes / engine.totalKeystrokes) * 100)
        : 100;
      setAccuracy(acc);

      const elapsedMinutes = (performance.now() - engine.gameStartTime) / 60000;
      if (elapsedMinutes > 0.04) {
        const curWpm = Math.round((engine.correctKeystrokes / 5) / elapsedMinutes);
        setWpm(curWpm);
        setPeakWpm((prev) => Math.max(prev, curWpm));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (currentTime) => {
      if (!isRunning) return;

      const engine = engineRef.current;
      const dt = Math.min(0.08, (currentTime - engine.lastTime) / 1000);
      engine.lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // 1. SIMULATION
      if (gameState === 'playing') {
        const elapsedSec = (currentTime - engine.gameStartTime) / 1000;
        const timeFactor = Math.min(0.55, elapsedSec * 0.006);
        const multFactor = (engine.multiplierVal - 1) * 0.08;
        const speedScale = 1 + timeFactor + multFactor;

        const spawnInterval = Math.max(1000, 2200 / speedScale);
        if (currentTime - engine.lastSpawnTime > spawnInterval) {
          engine.lastSpawnTime = currentTime;

          const laneWordCounts = [0, 0, 0, 0];
          engine.words.forEach((w) => {
            if (w.lane >= 0 && w.lane < LANES_COUNT) laneWordCounts[w.lane]++;
          });
          const sortedLanes = [0, 1, 2, 3].sort((a, b) => laneWordCounts[a] - laneWordCounts[b]);
          const selectedLane = Math.random() < 0.7 ? sortedLanes[0] : sortedLanes[1];

          const isTurboSpawn = engine.isTurboActive;
          const wordText = getRandomWord(isTurboSpawn);

          engine.words.push({
            id: Math.random().toString(),
            word: wordText,
            lane: selectedLane,
            progress: 0,
            typedLength: 0,
            isTargeted: false,
            speed: Math.min(0.38, 0.15 * speedScale * (0.9 + Math.random() * 0.2)),
            points: wordText.length * 100,
            isTurboWord: isTurboSpawn && wordText.length >= 8,
          });
        }

        for (let i = engine.words.length - 1; i >= 0; i--) {
          const w = engine.words[i];
          w.progress += w.speed * dt;

          if (w.progress >= 1.0) {
            neonAudio.playDamage();
            engine.shieldVal = Math.max(0, engine.shieldVal - 20);
            engine.streakVal = 0;
            engine.multiplierVal = 1;
            engine.isTurboActive = false;
            setIsTurbo(false);
            setShield(engine.shieldVal);
            setStreak(0);
            setMultiplier(1);

            engine.screenShake = 18;
            engine.redFlashAlpha = 0.55;

            if (engine.lockedWordId === w.id) {
              engine.lockedWordId = null;
            }
            engine.words.splice(i, 1);

            if (engine.shieldVal <= 0) {
              triggerGameOver(false);
              break;
            }
          }
        }

        const lerpSpeed = 9.0 * dt;
        engine.playerLaneX += (engine.targetPlayerLaneX - engine.playerLaneX) * lerpSpeed;
      }

      if (engine.screenShake > 0) {
        engine.screenShake = Math.max(0, engine.screenShake - 45 * dt);
      }
      if (engine.redFlashAlpha > 0) {
        engine.redFlashAlpha = Math.max(0, engine.redFlashAlpha - 1.8 * dt);
      }

      // 2. RENDERING
      ctx.save();

      if (engine.screenShake > 0) {
        const sx = (Math.random() - 0.5) * engine.screenShake;
        const sy = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(sx, sy);
      }

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
      skyGrad.addColorStop(0, '#03020c');
      skyGrad.addColorStop(0.6, '#0f0826');
      skyGrad.addColorStop(1, '#240b36');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      const vanishingX = width / 2;
      const vanishingY = height * 0.28;
      const playerY = height * 0.88;
      const bottomTrackWidth = Math.min(960, width * 0.94);
      const bottomTrackLeft = (width - bottomTrackWidth) / 2;
      const topTrackWidth = bottomTrackWidth * 0.18;
      const topTrackLeft = vanishingX - topTrackWidth / 2;

      ctx.fillStyle = '#ffffff';
      engine.stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
      });
      ctx.globalAlpha = 1.0;

      // Sun
      const sunRadius = Math.min(width * 0.2, 125);
      const sunCenterY = vanishingY;

      ctx.save();
      ctx.beginPath();
      ctx.arc(vanishingX, sunCenterY, sunRadius, Math.PI, 0, false);
      ctx.closePath();
      ctx.clip();

      const sunGrad = ctx.createLinearGradient(0, sunCenterY - sunRadius, 0, sunCenterY);
      sunGrad.addColorStop(0, '#ff0055');
      sunGrad.addColorStop(0.5, '#ff5500');
      sunGrad.addColorStop(1, '#ffcc00');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(vanishingX - sunRadius, sunCenterY - sunRadius, sunRadius * 2, sunRadius);

      ctx.fillStyle = '#03020c';
      const stripeCount = 10;
      for (let s = 1; s <= stripeCount; s++) {
        const sy = sunCenterY - (sunRadius / stripeCount) * s * 0.88;
        const sh = 1.2 + s * 1.3;
        ctx.fillRect(vanishingX - sunRadius * 1.5, sy, sunRadius * 3, sh);
      }
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(vanishingX, sunCenterY, sunRadius, Math.PI, 0, false);
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 30;
      ctx.stroke();
      ctx.restore();

      // Skyline
      ctx.save();
      ctx.fillStyle = '#0a0618';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1;
      let skylineX = 0;
      ctx.beginPath();
      ctx.moveTo(0, vanishingY);
      engine.citySkyline.forEach((bldg) => {
        const bWidth = width * bldg.widthRatio;
        const bHeight = height * bldg.heightRatio;
        ctx.lineTo(skylineX, vanishingY - bHeight);
        ctx.lineTo(skylineX + bWidth, vanishingY - bHeight);
        skylineX += bWidth;
      });
      ctx.lineTo(width, vanishingY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Horizon line
      const horizonGrad = ctx.createLinearGradient(0, 0, width, 0);
      horizonGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      horizonGrad.addColorStop(0.5, '#00f0ff');
      horizonGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.strokeStyle = horizonGrad;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, vanishingY);
      ctx.lineTo(width, vanishingY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving Grid
      const scrollSpeed = engine.isTurboActive ? 3.6 : 1.8;
      engine.gridOffset = (engine.gridOffset + scrollSpeed * dt) % 1.0;

      ctx.strokeStyle = engine.isTurboActive ? 'rgba(236, 72, 153, 0.32)' : 'rgba(147, 51, 234, 0.22)';
      ctx.lineWidth = 1.2;
      const numHorizLines = 22;
      for (let i = 0; i < numHorizLines; i++) {
        const z = (i + engine.gridOffset) / numHorizLines;
        const y = vanishingY + (height - vanishingY) * Math.pow(z, 2.3);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const numVertLines = 28;
      for (let i = 0; i <= numVertLines; i++) {
        const bx = (width / numVertLines) * i;
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY);
        ctx.lineTo(bx, height);
        ctx.stroke();
      }

      // Highway
      ctx.beginPath();
      ctx.moveTo(topTrackLeft, vanishingY);
      ctx.lineTo(topTrackLeft + topTrackWidth, vanishingY);
      ctx.lineTo(bottomTrackLeft + bottomTrackWidth, height);
      ctx.lineTo(bottomTrackLeft, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(7, 10, 24, 0.94)';
      ctx.fill();

      // Guardrails
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(topTrackLeft, vanishingY);
      ctx.lineTo(bottomTrackLeft, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(topTrackLeft + topTrackWidth, vanishingY);
      ctx.lineTo(bottomTrackLeft + bottomTrackWidth, height);
      ctx.stroke();
      ctx.restore();

      // Lanes
      for (let laneIdx = 1; laneIdx < LANES_COUNT; laneIdx++) {
        const fraction = laneIdx / LANES_COUNT;
        const topX = topTrackLeft + topTrackWidth * fraction;
        const bottomX = bottomTrackLeft + bottomTrackWidth * fraction;

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([14, 10]);
        ctx.beginPath();
        ctx.moveTo(topX, vanishingY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Active lane glow & beam
      const activeWord = engine.words.find((w) => w.id === engine.lockedWordId);
      if (activeWord) {
        const lIdx = activeWord.lane;
        const leftFrac = lIdx / LANES_COUNT;
        const rightFrac = (lIdx + 1) / LANES_COUNT;

        const tl = topTrackLeft + topTrackWidth * leftFrac;
        const tr = topTrackLeft + topTrackWidth * rightFrac;
        const bl = bottomTrackLeft + bottomTrackWidth * leftFrac;
        const br = bottomTrackLeft + bottomTrackWidth * rightFrac;

        const laneGlowGrad = ctx.createLinearGradient(0, vanishingY, 0, height);
        laneGlowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
        laneGlowGrad.addColorStop(1, LANE_COLORS[lIdx].glow);

        ctx.fillStyle = laneGlowGrad;
        ctx.beginPath();
        ctx.moveTo(tl, vanishingY);
        ctx.lineTo(tr, vanishingY);
        ctx.lineTo(br, height);
        ctx.lineTo(bl, height);
        ctx.closePath();
        ctx.fill();

        const z = activeWord.progress;
        const cTrackW = topTrackWidth + (bottomTrackWidth - topTrackWidth) * z;
        const cTrackL = topTrackLeft + (bottomTrackLeft - topTrackLeft) * z;
        const targetX = cTrackL + cTrackW * ((activeWord.lane + 0.5) / LANES_COUNT);
        const targetY = vanishingY + (playerY - vanishingY) * z;
        const playerX = bottomTrackLeft + bottomTrackWidth * engine.playerLaneX;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(playerX, playerY - 30);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Speed lines
      if (engine.isTurboActive) {
        ctx.save();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
        ctx.lineWidth = 2;
        engine.speedLines.forEach((line) => {
          line.y += line.speed * dt * 2.4;
          if (line.y > 1) {
            line.y = 0;
            line.x = Math.random();
          }
          const lx = line.x * width;
          const ly = vanishingY + line.y * (height - vanishingY);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + (lx - vanishingX) * 0.12, ly + line.length);
          ctx.stroke();
        });
        ctx.restore();
      }

      // 3. DRAW WORDS
      const sortedWords = [...engine.words].sort((a, b) => a.progress - b.progress);

      sortedWords.forEach((obstacle) => {
        const z = obstacle.progress;
        const laneCenterRatio = (obstacle.lane + 0.5) / LANES_COUNT;

        const currentTrackWidth = topTrackWidth + (bottomTrackWidth - topTrackWidth) * z;
        const currentTrackLeft = topTrackLeft + (bottomTrackLeft - topTrackLeft) * z;
        const wordX = currentTrackLeft + currentTrackWidth * laneCenterRatio;
        const wordY = vanishingY + (playerY - vanishingY) * z;

        const scale = 0.45 + 0.75 * Math.pow(z, 1.2);
        const fontSize = Math.max(12, Math.round(22 * scale));

        ctx.save();
        ctx.translate(wordX, wordY);

        ctx.font = `900 ${fontSize}px "Outfit", "Inter", monospace`;
        const typedStr = obstacle.word.slice(0, obstacle.typedLength);
        const nextChar = obstacle.word[obstacle.typedLength] || '';
        const remainingStr = obstacle.word.slice(obstacle.typedLength + (nextChar ? 1 : 0));

        const fullWordWidth = ctx.measureText(obstacle.word.toUpperCase()).width;
        const boxPaddingX = 14 * scale;
        const boxPaddingY = 7 * scale;
        const boxWidth = fullWordWidth + boxPaddingX * 2;
        const boxHeight = fontSize + boxPaddingY * 2;

        ctx.beginPath();
        const radius = 6 * scale;
        ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, radius);

        const laneColor = LANE_COLORS[obstacle.lane];
        if (obstacle.isTargeted) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
          ctx.strokeStyle = obstacle.isTurboWord ? '#fbbf24' : '#00f5ff';
          ctx.lineWidth = 2.5 * scale;
          ctx.shadowColor = obstacle.isTurboWord ? '#fbbf24' : '#00f5ff';
          ctx.shadowBlur = 16 * scale;
        } else {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
          ctx.strokeStyle = obstacle.isTurboWord ? 'rgba(251, 191, 36, 0.6)' : laneColor.border;
          ctx.lineWidth = 1.5 * scale;
          ctx.shadowColor = laneColor.border;
          ctx.shadowBlur = 6 * scale;
        }
        ctx.fill();
        ctx.stroke();

        if (obstacle.isTurboWord) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = `800 ${Math.max(8, Math.round(9 * scale))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('⚡ TURBO 2X', 0, -boxHeight / 2 - 4 * scale);
        }

        if (obstacle.isTargeted) {
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 1.8 * scale;
          const reticleSize = 8 * scale;
          ctx.beginPath();
          ctx.moveTo(-boxWidth / 2 - reticleSize, -boxHeight / 2);
          ctx.lineTo(-boxWidth / 2 - reticleSize, -boxHeight / 2 - reticleSize);
          ctx.lineTo(-boxWidth / 2, -boxHeight / 2 - reticleSize);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(boxWidth / 2 + reticleSize, -boxHeight / 2);
          ctx.lineTo(boxWidth / 2 + reticleSize, -boxHeight / 2 - reticleSize);
          ctx.lineTo(boxWidth / 2, -boxHeight / 2 - reticleSize);
          ctx.stroke();
        }

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let currentDrawX = -fullWordWidth / 2;

        if (typedStr) {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10 * scale;
          ctx.fillText(typedStr.toUpperCase(), currentDrawX, 0);
          currentDrawX += ctx.measureText(typedStr.toUpperCase()).width;
        }

        if (nextChar) {
          const pulseAlpha = 0.7 + Math.sin(currentTime * 0.012) * 0.3;
          ctx.fillStyle = obstacle.isTargeted ? `rgba(255, 235, 59, ${pulseAlpha})` : '#f8fafc';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = obstacle.isTargeted ? 14 * scale : 4 * scale;
          ctx.fillText(nextChar.toUpperCase(), currentDrawX, 0);

          if (obstacle.isTargeted) {
            const charW = ctx.measureText(nextChar.toUpperCase()).width;
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(currentDrawX, boxHeight / 2 - 4 * scale, charW, 2.5 * scale);
          }
          currentDrawX += ctx.measureText(nextChar.toUpperCase()).width;
        }

        if (remainingStr) {
          ctx.fillStyle = '#94a3b8';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.fillText(remainingStr.toUpperCase(), currentDrawX, 0);
        }

        ctx.restore();
      });

      // 4. LASER BEAMS
      for (let i = engine.lasers.length - 1; i >= 0; i--) {
        const laser = engine.lasers[i];
        laser.progress += 7.5 * dt;

        ctx.save();
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = laser.color;
        ctx.shadowBlur = 18;

        const curLaserX = laser.startX + (laser.targetX - laser.startX) * Math.min(1, laser.progress);
        const curLaserY = laser.startY + (laser.targetY - laser.startY) * Math.min(1, laser.progress);

        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(curLaserX, curLaserY);
        ctx.stroke();
        ctx.restore();

        if (laser.progress >= 1.0) {
          engine.lasers.splice(i, 1);
        }
      }

      // 5. PARTICLES
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;

        if (p.alpha <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. PLAYER CYBER VEHICLE
      const playerX = bottomTrackLeft + bottomTrackWidth * engine.playerLaneX;
      const vehicleWidth = 78;
      const vehicleHeight = 46;

      ctx.save();
      ctx.translate(playerX, playerY);

      const laneOffset = (engine.targetPlayerLaneX - engine.playerLaneX);
      const bankAngle = Math.max(-0.25, Math.min(0.25, laneOffset * 1.5));
      ctx.rotate(bankAngle);

      const thrusterLength = engine.isTurboActive ? 42 + Math.random() * 25 : 22 + Math.random() * 15;
      const thrusterColor = engine.isTurboActive ? '#ec4899' : '#00f0ff';

      // Left Jet
      const jetGrad = ctx.createLinearGradient(0, 16, 0, 16 + thrusterLength);
      jetGrad.addColorStop(0, '#ffffff');
      jetGrad.addColorStop(0.3, thrusterColor);
      jetGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = jetGrad;
      ctx.beginPath();
      ctx.moveTo(-16, 14);
      ctx.lineTo(-8, 14);
      ctx.lineTo(-12, 14 + thrusterLength);
      ctx.closePath();
      ctx.fill();

      // Right Jet
      ctx.beginPath();
      ctx.moveTo(8, 14);
      ctx.lineTo(16, 14);
      ctx.lineTo(12, 14 + thrusterLength);
      ctx.closePath();
      ctx.fill();

      // Chassis
      ctx.shadowColor = engine.isTurboActive ? '#ec4899' : '#00f0ff';
      ctx.shadowBlur = engine.isTurboActive ? 28 : 16;

      ctx.beginPath();
      ctx.moveTo(0, -vehicleHeight / 2);
      ctx.lineTo(vehicleWidth / 2, vehicleHeight / 2 - 4);
      ctx.lineTo(vehicleWidth / 3, vehicleHeight / 2);
      ctx.lineTo(0, vehicleHeight / 2 - 8);
      ctx.lineTo(-vehicleWidth / 3, vehicleHeight / 2);
      ctx.lineTo(-vehicleWidth / 2, vehicleHeight / 2 - 4);
      ctx.closePath();

      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = engine.isTurboActive ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cannons
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-vehicleWidth / 2 - 2, vehicleHeight / 2 - 12, 4, 8);
      ctx.fillRect(vehicleWidth / 2 - 2, vehicleHeight / 2 - 12, 4, 8);

      // Cockpit
      ctx.beginPath();
      ctx.moveTo(0, -vehicleHeight / 4);
      ctx.lineTo(10, 4);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fillStyle = engine.isTurboActive ? '#fbbf24' : '#00f5ff';
      ctx.shadowColor = engine.isTurboActive ? '#fbbf24' : '#00f5ff';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Shield forcefield
      if (engine.shieldVal > 0) {
        ctx.strokeStyle = engine.shieldVal > 30 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(239, 68, 68, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, vehicleWidth * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      if (engine.redFlashAlpha > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${engine.redFlashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      engine.animationFrameId = requestAnimationFrame(loop);
    };

    engineRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      if (engineRef.current.animationFrameId) {
        cancelAnimationFrame(engineRef.current.animationFrameId);
      }
    };
  }, [gameState, triggerGameOver]);

  const getShieldColor = () => {
    if (shield > 60) return 'bg-cyan-400 text-cyan-400 border-cyan-400';
    if (shield > 30) return 'bg-amber-400 text-amber-400 border-amber-400';
    return 'bg-red-500 text-red-500 border-red-500 animate-pulse';
  };

  const getPerformanceRank = () => {
    if (wpm >= 65 && accuracy >= 95) return { rank: 'S', title: 'Cyber Overlord', color: 'text-amber-400 border-amber-400 bg-amber-400/15 shadow-amber-500/20' };
    if (wpm >= 50 && accuracy >= 90) return { rank: 'A', title: 'Vector Ace', color: 'text-cyan-400 border-cyan-400 bg-cyan-400/15 shadow-cyan-500/20' };
    if (wpm >= 35 && accuracy >= 80) return { rank: 'B', title: 'Neon Pilot', color: 'text-purple-400 border-purple-400 bg-purple-400/15 shadow-purple-500/20' };
    return { rank: 'C', title: 'Glitch Cadet', color: 'text-rose-400 border-rose-400 bg-rose-400/15 shadow-rose-500/20' };
  };

  const content = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] w-screen h-screen h-[100dvh] bg-[#03020c] overflow-hidden flex flex-col select-none font-sans"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 block cursor-crosshair"
      />

      {/* ─── TOP SYNTHWAVE HUD BAR ─── */}
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#03020c]/95 via-[#03020c]/50 to-transparent backdrop-blur-[2px]">
        {/* Left: Navigation & Audio Controls */}
        <div className="flex items-center gap-2.5">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3.5 py-2 rounded-xl bg-slate-900/85 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] flex items-center gap-1.5 text-xs font-black uppercase cursor-pointer active:scale-95"
              title="Return to Game Hub"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Hub</span>
            </button>
          )}

          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="p-2.5 rounded-xl bg-slate-900/85 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-black cursor-pointer active:scale-95"
              title="Pause Simulation"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-xl bg-slate-900/85 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-black cursor-pointer active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center: Enhanced Shield Progress Bar & Multiplier */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5 bg-slate-950/80 border border-cyan-500/40 px-3.5 py-2 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.15)] backdrop-blur-md">
            <Shield className={`w-4 h-4 ${getShieldColor().split(' ')[1]}`} />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-300 mb-1">
                <span>Shield</span>
                <span className={getShieldColor().split(' ')[1]}>{shield}%</span>
              </div>
              <div className="w-24 sm:w-36 h-2.5 rounded-full bg-white/15 border border-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.4)] overflow-hidden p-[1px]">
                <motion.div
                  className={`h-full rounded-full ${getShieldColor().split(' ')[0]} shadow-[0_0_8px_currentColor]`}
                  initial={false}
                  animate={{ width: `${shield}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

          <motion.div
            key={multiplier}
            initial={{ scale: 0.85 }}
            animate={{ scale: isTurbo ? [1, 1.08, 1] : 1 }}
            transition={{ repeat: isTurbo ? Infinity : 0, duration: 0.8 }}
            className={`px-3.5 py-2 rounded-2xl border font-black text-xs sm:text-sm tracking-wider flex items-center gap-2 shadow-lg ${
              isTurbo
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/30'
                : multiplier >= 4
                ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-pink-500/30'
                : multiplier >= 2
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/30'
                : 'bg-slate-900/85 border-slate-700 text-slate-300'
            }`}
          >
            <Flame className={`w-4 h-4 ${isTurbo ? 'text-amber-400 animate-bounce' : ''}`} />
            <span>{isTurbo ? 'TURBO x8' : `x${multiplier}`}</span>
          </motion.div>
        </div>

        {/* ─── 3. UNIFIED LIVE STATS HUD PANEL (TOP RIGHT) ─── */}
        <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/35 rounded-2xl px-4 py-2 shadow-[0_0_25px_rgba(0,240,255,0.18)] flex items-center gap-4">
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-black tracking-widest uppercase text-cyan-400/80">
              <span>Score</span>
              {highScore > 0 && (
                <span className="text-slate-400 font-bold">HI: {highScore.toLocaleString()}</span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight leading-none mt-0.5 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="w-[1px] h-8 bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <div className="text-xs font-black text-white leading-none">
                <span className="text-cyan-300 mr-0.5">{wpm}</span>
                <span className="text-[9px] uppercase text-cyan-400/80 font-bold">WPM</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <div className="text-xs font-black text-white leading-none">
                <span className="text-amber-300 mr-0.5">{streak}</span>
                <span className="text-[9px] uppercase text-amber-400/80 font-bold">STK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Turbo Mode Alert */}
      <AnimatePresence>
        {isTurbo && gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-pink-500/40 to-amber-500/30 border border-amber-400 text-amber-300 font-black text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>TURBO OVERDRIVE ACTIVE • 2X BONUS WORDS</span>
            <Sparkles className="w-4 h-4 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 5. RETRO-THEMED BULLBOT WIDGET (BOTTOM RIGHT) ─── */}
      <div className="fixed bottom-6 right-6 z-20 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (gameState === 'playing') setGameState('paused');
            setIsTutorOpen(true);
          }}
          className="relative group flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-2xl bg-slate-950/90 border-2 border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.5)] backdrop-blur-xl overflow-hidden cursor-pointer active:scale-95 transition-all select-none"
          title="Open BullBot AI Retro Copilot"
        >
          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.55)_50%)] [background-size:100%_4px] opacity-75 z-20" />

          {/* Cyan/Magenta Neon Aura */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Avatar with pixelated arcade filter */}
          <div
            className="relative shrink-0 z-10"
            style={{
              imageRendering: 'pixelated',
              filter: 'contrast(145%) saturate(130%) hue-rotate(-15deg)',
            }}
          >
            <Mascot mood="idle" size="xs" />
          </div>

          <div className="flex flex-col text-left z-10">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-pink-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>BULLBOT // COPILOT</span>
            </div>
            <span className="text-[9px] font-bold text-slate-300">
              {isTurbo ? 'BURST TARGETING READY' : 'AI ANALYTICS ONLINE'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {gameState === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-pink-500 to-amber-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
                {countdown > 0 ? countdown : 'ENGAGE!'}
              </div>
              <p className="text-cyan-300 font-bold text-sm tracking-widest uppercase mt-4">
                Type the first letter to lock on • Destroy words before impact
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {gameState === 'paused' && !isTutorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 pointer-events-auto"
          >
            <div className="max-w-md w-full bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Simulation Paused</h2>
              <p className="text-xs text-slate-400 font-semibold mb-6">
                Laser targeting is on standby.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Speed Gauntlet</span>
                </button>

                <button
                  onClick={startNewGame}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Session</span>
                </button>

                {onBackToHub && (
                  <button
                    onClick={onBackToHub}
                    className="w-full py-3 rounded-2xl bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Exit to Game Hub</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 1. RETRO END-GAME SCORECARD & CELEBRATION MODAL ─── */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 pointer-events-auto overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className={`max-w-lg w-full bg-gradient-to-b from-slate-900 to-[#0b0c1e] border-2 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden ${
                isVictory ? 'border-cyan-400 shadow-[0_0_60px_rgba(0,240,255,0.3)]' : 'border-rose-500/60 shadow-[0_0_60px_rgba(244,63,94,0.25)]'
              }`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isVictory ? 'bg-cyan-500/20' : 'bg-rose-500/15'}`} />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-md border"
                style={{
                  backgroundColor: isVictory ? 'rgba(0, 240, 255, 0.15)' : 'rgba(244, 63, 94, 0.2)',
                  borderColor: isVictory ? 'rgba(0, 240, 255, 0.5)' : 'rgba(244, 63, 94, 0.4)',
                  color: isVictory ? '#00f0ff' : '#fca5a5'
                }}
              >
                {isVictory ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>SYSTEM OVERRIDE SUCCESS // HURRAY!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>HULL BREACHED • SIMULATION TERMINATED</span>
                  </>
                )}
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                {isVictory ? 'Neural Gauntlet Overdrive' : 'Neon Velocity Results'}
              </h2>
              <p className="text-xs text-slate-400 font-semibold mb-6">
                {isVictory
                  ? 'Incredible reflex speed! The synthwave highway has been mastered.'
                  : 'Telemetry recorded. Re-calibrate and re-engage for higher burst WPM.'}
              </p>

              {/* Rank & Scorecard Banner */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg ${
                    getPerformanceRank().color
                  }`}
                >
                  <span className="text-2xl font-black leading-none">{getPerformanceRank().rank}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">RANK</span>
                </div>

                <div className="text-left">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <span>Total Score</span>
                    <span className="text-[10px] text-cyan-400 font-black">• {getPerformanceRank().title}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white tabular-nums drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                    {score.toLocaleString()}
                  </div>
                  {isNewHighScore && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 mt-0.5">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>NEW ALL-TIME RECORD!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Avg WPM</span>
                  <span className="text-xl font-black text-cyan-400 mt-1">{wpm}</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Peak Burst</span>
                  <span className="text-xl font-black text-pink-400 mt-1">{peakWpm}</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Accuracy</span>
                  <span className="text-xl font-black text-emerald-400 mt-1">{accuracy}%</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Max Streak</span>
                  <span className="text-xl font-black text-amber-400 mt-1">{maxStreak}</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-400 mb-6">
                Destroyed <span className="font-black text-white">{wordsDestroyed}</span> word obstacles at speed cadence.
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={startNewGame}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-Engage Highway</span>
                </button>

                {onBackToHub && (
                  <button
                    onClick={onBackToHub}
                    className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 cursor-pointer active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Arcade Hub</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tutor Diagnostic Modal */}
      <AITutorReport
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
};

export default NeonVelocityGame;
