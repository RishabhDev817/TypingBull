import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { LotusLakeCanvas } from './LotusLakeCanvas';
import { LilypadTrack } from './LilypadTrack';
import { FrogCharacter } from './FrogCharacter';
import { VictoryOverlay } from './VictoryOverlay';
import {
  LILYPAD_LEVELS,
  getLevelWordsNoRepeat,
  generateZigzagWaypoints,
  type LevelConfig,
  type Waypoint,
} from './lilypadData';
import { lilypadAudio } from './lilypadAudio';
import { soundEngine } from '../../../utils/audio';
import { AITutorReport } from '../../AITutorReport';
import type { SessionResult } from '../../../engine/typingEngine';
import { saveSession } from '../../../engine/sessionStore';

interface LilypadLeapGameProps {
  initialLevel?: number;
  onBackToHub: () => void;
}

export const LilypadLeapGame: React.FC<LilypadLeapGameProps> = ({
  initialLevel = 1,
  onBackToHub,
}) => {
  const [level, setLevel] = useState<number>(initialLevel);
  const currentConfig: LevelConfig = useMemo(() => {
    return LILYPAD_LEVELS.find((l) => l.level === level) || LILYPAD_LEVELS[0];
  }, [level]);

  // Generate 2D serpentine/zigzag path waypoints for current level (10 - 15 leaves)
  const waypoints: Waypoint[] = useMemo(() => {
    return generateZigzagWaypoints(currentConfig.leafCount);
  }, [currentConfig.leafCount]);

  // Game state
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [currentPadIndex, setCurrentPadIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  // Visual Reinforcement Image Pop-up State
  const [activePopWord, setActivePopWord] = useState<string | null>(null);
  const [activePopPadIndex, setActivePopPadIndex] = useState<number | null>(null);

  // Frog 2D Animation & Physics State
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpPhase, setJumpPhase] = useState<'idle' | 'takeoff' | 'apex' | 'landing'>('idle');
  const [flightAngle, setFlightAngle] = useState<number>(0);
  const [frogPos, setFrogPos] = useState<{ x: number; y: number }>(() => waypoints[0] || { x: 12, y: 82 });
  const [landingRippleIndex, setLandingRippleIndex] = useState<number | null>(null);

  // Performance metrics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.muted);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState<boolean>(false);
  const [tutorOpen, setTutorOpen] = useState<boolean>(false);
  const [gameSessionResult, setGameSessionResult] = useState<SessionResult | null>(null);

  const errorMapRef = useRef<Record<string, number>>({});
  const totalsMapRef = useRef<Record<string, number>>({});

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Target word is for reaching the NEXT waypoint
  const targetWord = wordsList[currentPadIndex] || '';

  // Initialize or restart level with strict no-repetition word fetching
  const initGame = useCallback(
    (lvl: number) => {
      const cfg = LILYPAD_LEVELS.find((l) => l.level === lvl) || LILYPAD_LEVELS[0];
      const newWaypoints = generateZigzagWaypoints(cfg.leafCount);
      const wordCount = cfg.leafCount - 1; // Words needed to reach Lotus Flower finale
      const newWords = getLevelWordsNoRepeat(lvl, wordCount);

      setLevel(lvl);
      setWordsList(newWords);
      setCurrentPadIndex(0);
      setTypedInput('');
      setIsError(false);
      setActivePopWord(null);
      setActivePopPadIndex(null);
      setIsJumping(false);
      setJumpPhase('idle');
      setFlightAngle(0);
      setLandingRippleIndex(null);
      setIsVictory(false);
      setStartTime(null);
      setEndTime(null);
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      errorMapRef.current = {};
      totalsMapRef.current = {};

      if (newWaypoints.length > 0) {
        setFrogPos({ x: newWaypoints[0].x, y: newWaypoints[0].y });
      }

      // Start soothing ambient water sounds
      lilypadAudio.startAmbient();

      // Focus typing input
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 60);
    },
    []
  );

  useEffect(() => {
    initGame(initialLevel);
    return () => {
      lilypadAudio.stopAmbient();
    };
  }, [initialLevel, initGame]);

  // Execute Anti-Gravity 2D Parabolic Jump Animation between Zigzag Waypoints
  const executeJump = useCallback(
    (nextPadIndex: number, completedWord: string) => {
      if (nextPadIndex >= waypoints.length) return;

      const currentWp = waypoints[currentPadIndex];
      const nextWp = waypoints[nextPadIndex];
      const isFinalLotusLeap = nextPadIndex === waypoints.length - 1;

      // ─── 1. Trigger Instant Educational Image Pop-up directly above destination leaf! ───
      setActivePopWord(completedWord);
      setActivePopPadIndex(nextPadIndex);

      // Calculate trajectory angle
      const dx = nextWp.x - currentWp.x;
      const dy = nextWp.y - currentWp.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      setFlightAngle(angle);
      setIsJumping(true);
      setJumpPhase('takeoff');
      lilypadAudio.playJumpRibbit();

      const jumpDuration = currentConfig.jumpDuration;

      // Move frog X & Y towards destination waypoint
      setFrogPos({ x: nextWp.x, y: nextWp.y });

      // Phase 1: Fast Takeoff (0 - 15% of duration)
      setTimeout(() => {
        setJumpPhase('apex');
      }, jumpDuration * 0.15);

      // Phase 2: Anti-Gravity Floating Hang-Time at Apex (15% - 70% of duration)
      setTimeout(() => {
        setJumpPhase('landing');
      }, jumpDuration * 0.72);

      // Phase 3: Snappy Drop & Landing on Leaf (72% - 100%)
      setTimeout(() => {
        setCurrentPadIndex(nextPadIndex);
        setTypedInput('');
        setIsJumping(false);
        setJumpPhase('landing');
        setLandingRippleIndex(nextPadIndex);
        lilypadAudio.playSplash();

        // Check if Grand Blooming Lotus Flower is reached!
        if (isFinalLotusLeap) {
          const now = Date.now();
          setEndTime(now);

          const duration = Math.max(1, now - (startTime || now));
          const totalLetters = wordsList.join('').length;
          const totalMin = duration / 60000;
          const gameWpm = totalMin > 0 ? Math.round((totalLetters / 5) / totalMin) : 0;
          const gameAcc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

          const gameResult: SessionResult = {
            id: `game_${now}_${Math.random().toString(36).slice(2, 7)}`,
            mode: 'game',
            modeDetail: `lilypad-level-${level}`,
            startTime: startTime || now,
            endTime: now,
            durationMs: duration,
            totalKeystrokes: totalKeystrokes + 1,
            correctKeystrokes: correctKeystrokes + 1,
            incorrectKeystrokes: Math.max(0, totalKeystrokes - correctKeystrokes),
            backspaceCount: 0,
            wpm: gameWpm,
            accuracy: gameAcc,
            perKeyErrors: { ...errorMapRef.current },
            perKeyTotal: { ...totalsMapRef.current },
            bigramErrors: {},
            bigramTotal: {},
            pauseCount: 0,
            avgPausePerKey: {},
            starsEarned: gameAcc >= 95 ? 3 : gameAcc >= 80 ? 2 : 1,
            content: wordsList.join(' '),
            wpmWindows: [],
          };

          saveSession(gameResult);
          setGameSessionResult(gameResult);

          setTimeout(() => {
            setIsVictory(true);
            lilypadAudio.playHurrayVictory();
          }, 400);
        }

        // Keep the educational image visible during flight, then fade out smoothly for next word
        setTimeout(() => {
          setActivePopWord(null);
          setActivePopPadIndex(null);
          setJumpPhase('idle');
          setLandingRippleIndex(null);
        }, 320);
      }, jumpDuration);
    },
    [waypoints, currentPadIndex, currentConfig.jumpDuration, startTime, wordsList, totalKeystrokes, correctKeystrokes, level]
  );

  // Keystroke input logic
  const handleCharInput = useCallback(
    (char: string) => {
      if (isJumping || isVictory || !targetWord) return;

      // Start timer on first keystroke and ensure ambient audio is playing
      if (!startTime) {
        setStartTime(Date.now());
        lilypadAudio.startAmbient();
      }

      setTotalKeystrokes((prev) => prev + 1);

      const nextExpectedIndex = typedInput.length;
      const expectedChar = targetWord[nextExpectedIndex];

      if (!expectedChar) return;

      const lowerExp = expectedChar.toLowerCase();
      totalsMapRef.current[lowerExp] = (totalsMapRef.current[lowerExp] || 0) + 1;

      if (char.toLowerCase() === expectedChar.toLowerCase()) {
        // Correct character typed
        const updatedTyped = typedInput + char;
        setTypedInput(updatedTyped);
        setCorrectKeystrokes((prev) => prev + 1);
        setIsError(false);
        lilypadAudio.playKeyClick();

        // If entire word successfully completed
        if (updatedTyped.length === targetWord.length) {
          executeJump(currentPadIndex + 1, targetWord);
        }
      } else {
        // Mistype
        setIsError(true);
        errorMapRef.current[lowerExp] = (errorMapRef.current[lowerExp] || 0) + 1;
        lilypadAudio.playKeyError();
        setTimeout(() => setIsError(false), 380);
      }
    },
    [isJumping, isVictory, targetWord, startTime, typedInput, currentPadIndex, executeJump]
  );

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Escape') {
        lilypadAudio.stopAmbient();
        onBackToHub();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        setTypedInput((prev) => prev.slice(0, -1));
        setIsError(false);
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        handleCharInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCharInput, onBackToHub]);

  // Toggle browser native fullscreen
  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsNativeFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsNativeFullscreen(false)).catch(() => {});
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMute(nextMute);
    if (nextMute) {
      lilypadAudio.stopAmbient();
    } else {
      lilypadAudio.startAmbient();
    }
  };

  // Metrics
  const totalSeconds = startTime && endTime ? Math.max(1, (endTime - startTime) / 1000) : 10;
  const wpm = totalSeconds > 0 ? Math.round((correctKeystrokes / 5) / (totalSeconds / 60)) : 0;
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  // Anti-Gravity Apex Jump Height (Lift above water in parabolic arc)
  const arcPeakY = -45;

  return (
    <div
      onClick={() => hiddenInputRef.current?.focus()}
      className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col justify-between p-2 sm:p-4 select-none overflow-hidden"
    >
      {/* Hidden input for mobile virtual keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none -top-40"
        autoFocus
        onChange={(e) => {
          const val = e.target.value;
          if (val.length > 0) {
            handleCharInput(val[val.length - 1]);
            e.target.value = '';
          }
        }}
      />

      {/* ─── Top Fullscreen Header Controls Bar ─── */}
      <div className="relative z-30 flex items-center justify-between px-3 py-1.5 sm:py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/60 shadow-lg">
        {/* Left: Hub Navigation & 5 Levels Selector */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              lilypadAudio.stopAmbient();
              onBackToHub();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 text-xs font-black shadow-sm hover:border-emerald-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Hub (ESC)</span>
          </motion.button>

          {/* Level Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs font-black text-emerald-800 dark:text-emerald-300">
            <span>🪷</span>
            <select
              value={level}
              onChange={(e) => initGame(Number(e.target.value))}
              className="bg-transparent font-black cursor-pointer outline-none text-emerald-800 dark:text-emerald-300"
            >
              {LILYPAD_LEVELS.map((lvl) => (
                <option key={lvl.level} value={lvl.level} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                  Lvl {lvl.level}: {lvl.title.split(':')[1] || lvl.title} ({lvl.leafCount} Leaves)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Mission Subtitle */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {currentConfig.title}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {currentConfig.badge}
          </span>
        </div>

        {/* Right: Progress & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right mr-1">
            <span className="text-[9px] font-black uppercase text-slate-400 block leading-tight">
              Progress
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
              {currentPadIndex + 1} / {currentConfig.leafCount}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleMute}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 shadow-sm cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 shadow-sm cursor-pointer"
            title={isNativeFullscreen ? 'Exit Browser Fullscreen' : 'Enter Browser Fullscreen'}
          >
            {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => initGame(level)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 shadow-sm cursor-pointer"
            title="Restart Level"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* ─── Main Lotus Lake Full-Screen Canvas & Zigzag Stage ─── */}
      <div className="relative flex-1 w-full my-1.5 sm:my-2 rounded-3xl overflow-hidden border-4 border-emerald-400/80 dark:border-emerald-600/60 shadow-2xl bg-slate-950">
        {/* Serene Lake Canvas Background */}
        <LotusLakeCanvas />

        {/* First Keystroke Start Guide Hint */}
        {!startTime && currentPadIndex === 0 && typedInput.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black text-xs sm:text-sm shadow-xl border-2 border-white animate-bounce pointer-events-none flex items-center gap-2"
          >
            <span>⌨️</span>
            <span>Type the word above the glowing leaf to jump across the zigzag lake!</span>
          </motion.div>
        )}

        {/* 2D Zigzag Lilypad Serpentine Track Layer with WordImagePop */}
        <LilypadTrack
          waypoints={waypoints}
          currentPadIndex={currentPadIndex}
          targetWord={targetWord}
          typedInput={typedInput}
          isError={isError}
          landingRippleIndex={landingRippleIndex}
          activePopWord={activePopWord}
          activePopPadIndex={activePopPadIndex}
        />

        {/* ─── Cute Frog Positioned Strictly on Active Lilypad with Anti-Gravity Hop ─── */}
        <div
          className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${frogPos.x}%`,
            top: `${frogPos.y}%`,
            transition: isJumping
              ? `left ${currentConfig.jumpDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1), top ${currentConfig.jumpDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
              : 'none',
          }}
        >
          <motion.div
            animate={{
              y: isJumping ? [0, arcPeakY, 0] : [0, -3, 0],
              scale: isJumping ? [1, 1.15, 1] : 1,
            }}
            transition={
              isJumping
                ? {
                    duration: currentConfig.jumpDuration / 1000,
                    times: [0, 0.5, 1],
                    ease: ['easeOut', 'easeIn'],
                  }
                : {
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                  }
            }
          >
            <FrogCharacter
              isJumping={isJumping}
              jumpPhase={jumpPhase}
              flightAngle={flightAngle}
              isHappy={isVictory || typedInput.length === targetWord.length}
              isError={isError}
              size={62}
            />
          </motion.div>
        </div>
      </div>

      {/* ─── Bottom Status & Metrics Bar ─── */}
      <div className="relative z-30 flex items-center justify-between px-4 py-1.5 sm:py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-extrabold">💡 Visual Learning:</span>
          <span>Watch the picture pop up as you finish typing each word!</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Accuracy: <span className="text-emerald-600 dark:text-emerald-400 font-black">{accuracy}%</span></span>
          <span>Speed: <span className="text-amber-600 dark:text-amber-400 font-black">{wpm} WPM</span></span>
          <span className="hidden sm:inline">Leaves: <span className="text-indigo-600 dark:text-indigo-400 font-black">{currentPadIndex}/{currentConfig.leafCount - 1}</span></span>
        </div>
      </div>

      {/* ─── Victory "HURRAY!" Celebration Modal with Auto-Transition ─── */}
      <AnimatePresence>
        {isVictory && (
          <VictoryOverlay
            level={level}
            maxLevel={LILYPAD_LEVELS.length}
            score={correctKeystrokes * 25}
            wpm={wpm}
            accuracy={accuracy}
            timeSeconds={totalSeconds}
            wordsCount={currentConfig.leafCount - 1}
            onNextLevel={() => initGame(level + 1)}
            onPlayAgain={() => initGame(level)}
            onBackToHub={() => {
              lilypadAudio.stopAmbient();
              onBackToHub();
            }}
            onViewAiReport={() => setTutorOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* AI Tutor Report Modal */}
      <AITutorReport
        sessionResult={gameSessionResult}
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        targetWpm={25}
        showReplayButtons={true}
      />
    </div>
  );
};
