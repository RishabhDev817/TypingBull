import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowRight, AlertTriangle, BookOpen, Clock, Brain } from 'lucide-react';
import { Mascot } from '../components/Mascot';
import { PRACTICE_LEVELS, calculateAllocatedTime, type PracticeLevel, type PracticePassage } from '../data/practiceLevels';
import { soundEngine } from '../utils/audio';
import { ConfettiFireworks } from '../components/game/ConfettiFireworks';
import { FloatingControls } from '../components/navigation/FloatingControls';
import { AITutorReport } from '../components/AITutorReport';
import type { SessionResult, WpmWindow } from '../engine/typingEngine';
import { saveSession } from '../engine/sessionStore';

type PracticeStatus = 'idle' | 'typing' | 'completed' | 'failed';

export const PracticePage: React.FC = () => {
  // Level & Passage State (12 Levels)
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(1);
  const [passageIndex, setPassageIndex] = useState<number>(0);
  const [tierFilter, setTierFilter] = useState<'all' | 'story' | 'stamina-essay'>('all');

  const currentLevel: PracticeLevel = useMemo(() => {
    return PRACTICE_LEVELS.find((l) => l.level === currentLevelNum) || PRACTICE_LEVELS[0];
  }, [currentLevelNum]);

  const currentPassage: PracticePassage = useMemo(() => {
    return currentLevel.passages[passageIndex] || currentLevel.passages[0];
  }, [currentLevel, passageIndex]);

  // Dynamic Allocated Time: Math.ceil(((Total Characters / 5) / Target WPM) * 60)
  const initialTimeLimit = useMemo(() => {
    return calculateAllocatedTime(currentPassage.text, currentLevel.targetWPM);
  }, [currentPassage.text, currentLevel.targetWPM]);

  // Typing & Timer State
  const [gameStatus, setGameStatus] = useState<PracticeStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeLimit);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [showFailPenalty, setShowFailPenalty] = useState<boolean>(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [practiceSessionResult, setPracticeSessionResult] = useState<SessionResult | null>(null);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Per-key error tracking and stamina windows
  const errorMapRef = useRef<Record<string, number>>({});
  const totalsMapRef = useRef<Record<string, number>>({});
  const wpmWindowsRef = useRef<WpmWindow[]>([]);
  const currentWindowIndexRef = useRef<number>(0);
  const currentWindowCorrectCharsRef = useRef<number>(0);

  const targetText = currentPassage.text;

  // Helper to construct a SessionResult from current practice progress
  const buildSessionResult = useCallback((isFailed: boolean) => {
    const endTs = Date.now();
    const startTs = startTime || endTs;
    const elapsed = Math.max(1, endTs - startTs);
    const durationMin = elapsed / 60000;
    const typedLen = userInput.length;
    const correctChars = Math.max(0, typedLen - mistakesCount);
    const sessionWpm = durationMin > 0 ? Math.round((correctChars / 5) / durationMin) : 0;
    const sessionAccuracy = totalKeystrokes > 0
      ? Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 1000) / 10
      : 100;

    // Finalize open window for stamina
    const windows = [...wpmWindowsRef.current];
    const lastWindowStartMs = currentWindowIndexRef.current * 30000;
    const lastWindowDurMin = Math.max(1, elapsed - lastWindowStartMs) / 60000;
    windows.push({
      windowIndex: currentWindowIndexRef.current,
      wpm: lastWindowDurMin > 0 ? Math.round((currentWindowCorrectCharsRef.current / 5) / lastWindowDurMin) : 0,
      correctChars: currentWindowCorrectCharsRef.current,
    });

    const result: SessionResult = {
      id: `practice_${startTs}_${Math.random().toString(36).slice(2, 7)}`,
      mode: 'practice',
      modeDetail: `practice-lvl${currentLevelNum}`,
      startTime: startTs,
      endTime: endTs,
      durationMs: elapsed,
      totalKeystrokes: Math.max(1, totalKeystrokes),
      correctKeystrokes: correctChars,
      incorrectKeystrokes: mistakesCount,
      backspaceCount: 0,
      wpm: sessionWpm,
      accuracy: isFailed ? Math.min(sessionAccuracy, 75) : sessionAccuracy,
      perKeyErrors: { ...errorMapRef.current },
      perKeyTotal: { ...totalsMapRef.current },
      bigramErrors: {},
      bigramTotal: {},
      pauseCount: 0,
      avgPausePerKey: {},
      starsEarned: isFailed ? 0 : sessionAccuracy >= 98 ? 3 : sessionAccuracy >= 95 ? 2 : sessionAccuracy >= 90 ? 1 : 0,
      content: targetText,
      wpmWindows: windows,
    };

    saveSession(result);
    return result;
  }, [startTime, userInput.length, mistakesCount, totalKeystrokes, currentLevelNum, targetText]);

  // Initialize or Reset Level
  const initLevel = useCallback((levelNum?: number, pIdx?: number, isPenalty = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const nextLvlNum = levelNum !== undefined ? levelNum : currentLevelNum;
    const nextLvl = PRACTICE_LEVELS.find((l) => l.level === nextLvlNum) || PRACTICE_LEVELS[0];
    const nextPIdx = pIdx !== undefined ? pIdx : passageIndex;
    const nextPassage = nextLvl.passages[nextPIdx] || nextLvl.passages[0];
    const calculatedTime = calculateAllocatedTime(nextPassage.text, nextLvl.targetWPM);

    if (levelNum !== undefined) setCurrentLevelNum(levelNum);
    if (pIdx !== undefined) setPassageIndex(nextPIdx);

    setUserInput('');
    setGameStatus('idle');
    setTimeRemaining(calculatedTime);
    setStartTime(null);
    setEndTime(null);
    setMistakesCount(0);
    setTotalKeystrokes(0);

    // Reset tracking refs
    errorMapRef.current = {};
    totalsMapRef.current = {};
    wpmWindowsRef.current = [];
    currentWindowIndexRef.current = 0;
    currentWindowCorrectCharsRef.current = 0;

    if (isPenalty) {
      setShowFailPenalty(true);
      soundEngine.playError();
      setTimeout(() => setShowFailPenalty(false), 2600);
    } else {
      setShowFailPenalty(false);
    }

    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 60);
  }, [currentLevelNum, passageIndex]);

  // Switch level
  const handleSelectLevel = (lvlNum: number) => {
    soundEngine.playPop();
    initLevel(lvlNum, 0);
  };

  // Switch passage
  const handleSelectPassage = (idx: number) => {
    soundEngine.playPop();
    initLevel(currentLevelNum, idx);
  };

  // Re-sync on passage/level change
  useEffect(() => {
    initLevel(currentLevelNum, passageIndex);
  }, [currentLevelNum, passageIndex, initLevel]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Auto-scroll to keep active caret in view (essential for 20-30 line essays!)
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const charEl = activeCharRef.current;
      const charTop = charEl.offsetTop;
      const containerHeight = container.clientHeight;
      const currentScroll = container.scrollTop;

      if (charTop > currentScroll + containerHeight - 90 || charTop < currentScroll + 40) {
        container.scrollTo({
          top: Math.max(0, charTop - containerHeight / 3),
          behavior: 'smooth',
        });
      }
    }
  }, [userInput.length]);

  // Countdown Timer with Strict Penalty Reset & AI Tutor trigger on fail
  const startTimer = useCallback(() => {
    if (gameStatus !== 'idle') return;

    setGameStatus('typing');
    const startTs = Date.now();
    setStartTime(startTs);

    const totalSeconds = initialTimeLimit;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTs) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      setTimeRemaining(remaining);

      // 30-second WPM stamina window tracking
      const windowIdx = Math.floor(elapsed / 30);
      while (currentWindowIndexRef.current < windowIdx) {
        wpmWindowsRef.current.push({
          windowIndex: currentWindowIndexRef.current,
          wpm: Math.round((currentWindowCorrectCharsRef.current / 5) / 0.5),
          correctChars: currentWindowCorrectCharsRef.current,
        });
        currentWindowIndexRef.current++;
        currentWindowCorrectCharsRef.current = 0;
      }

      // STRICT FAIL STATE: If time hits 00:00 before 100% completion -> Trigger AI Tutor Diagnostic!
      if (remaining === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setGameStatus('failed');

        // Create fail session result and trigger AI Tutor
        const failResult = buildSessionResult(true);
        setPracticeSessionResult(failResult);
        setTimeout(() => setTutorOpen(true), 500);

        initLevel(undefined, undefined, true);
      }
    }, 1000);
  }, [gameStatus, initialTimeLimit, initLevel, buildSessionResult]);

  // Keystroke Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameStatus === 'completed') return;

    if (e.key === 'Escape') {
      initLevel();
      return;
    }

    // Start timer on first keystroke
    if (gameStatus === 'idle' && e.key.length === 1) {
      startTimer();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus === 'completed') return;
    const value = e.target.value;

    if (gameStatus === 'idle' && value.length > 0) {
      startTimer();
    }

    setTotalKeystrokes((prev) => prev + 1);

    // If typing new character
    if (value.length > userInput.length) {
      const newChar = value.slice(-1);
      const expected = targetText[value.length - 1];
      const lowerExp = expected?.toLowerCase();

      if (lowerExp) {
        totalsMapRef.current[lowerExp] = (totalsMapRef.current[lowerExp] || 0) + 1;
      }

      if (newChar === expected) {
        soundEngine.playClick(newChar === ' ');
        currentWindowCorrectCharsRef.current++;
      } else {
        soundEngine.playError();
        setMistakesCount((prev) => prev + 1);
        if (lowerExp) {
          errorMapRef.current[lowerExp] = (errorMapRef.current[lowerExp] || 0) + 1;
        }
      }
    }

    setUserInput(value);

    // Check 100% Completion Victory Condition
    if (value.length === targetText.length) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setEndTime(Date.now());
      setGameStatus('completed');
      soundEngine.playVictory();

      // Save successful practice session result
      const victoryResult = buildSessionResult(false);
      setPracticeSessionResult(victoryResult);
    }
  };

  // Performance calculations
  const totalSecondsElapsed = startTime
    ? Math.max(1, ((endTime || Date.now()) - startTime) / 1000)
    : 1;
  const currentWpm = Math.round((userInput.length / 5) / (totalSecondsElapsed / 60)) || 0;
  const accuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 100))
    : 100;

  const timeProgressPercent = (timeRemaining / initialTimeLimit) * 100;
  const isTimeCritical = timeRemaining <= 10 && gameStatus === 'typing';

  // Format MM:SS for multi-minute long stamina essays
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filtered levels based on category
  const filteredLevels = useMemo(() => {
    if (tierFilter === 'all') return PRACTICE_LEVELS;
    return PRACTICE_LEVELS.filter((l) => l.type === tierFilter);
  }, [tierFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 md:py-8 flex flex-col items-center select-none">
      {/* Confetti on Completion */}
      <ConfettiFireworks active={gameStatus === 'completed'} />

      {/* ─── Top Navigation Header with Right-Aligned Controls ─── */}
      <div className="w-full flex items-center justify-between gap-4 mb-4 max-w-full">
        {/* Left: Practice Section Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            ⌨️ Practice Arena
          </span>
        </div>

        {/* Right-aligned Flex Container with Sufficient Padding-Right to prevent viewport clipping */}
        <div className="flex flex-row items-center justify-end gap-3 pr-4 sm:pr-6 max-w-full">
          <FloatingControls
            className="flex flex-row items-center gap-3"
            showLabel={false}
          />
        </div>
      </div>

      {/* ─── Top Level Selection Header ─── */}
      <div className="w-full flex flex-col gap-3 mb-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl">{currentLevel.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentLevel.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                currentLevel.type === 'stamina-essay'
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-400'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400'
              }`}>
                {currentLevel.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              {currentLevel.description} • Target: <span className="text-emerald-700 dark:text-emerald-400 font-black">{currentLevel.targetWPM} WPM</span>
            </p>
          </div>

          {/* Category Filter Pills (Stories vs Stamina Essays) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-black">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                tierFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => setTierFilter('story')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                tierFilter === 'story'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              📖 Stories (1-6)
            </button>
            <button
              onClick={() => setTierFilter('stamina-essay')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                tierFilter === 'stamina-essay'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🏛️ Stamina (7-12)
            </button>
          </div>
        </div>

        {/* 12 Distinct Level Selector Tabs */}
        <div className="w-full overflow-x-auto py-1.5 custom-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {filteredLevels.map((lvl) => {
              const isActive = lvl.level === currentLevelNum;
              return (
                <motion.button
                  key={lvl.level}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectLevel(lvl.level)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 ${
                    isActive
                      ? lvl.type === 'stamina-essay'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/25'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span>{lvl.icon}</span>
                  <span>Lvl {lvl.level}</span>
                  {lvl.type === 'stamina-essay' && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}>
                      Stamina
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Passage Selector & Reset Bar */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-4 px-1">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Passage:</span>
          </span>
          {currentLevel.passages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleSelectPassage(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                idx === passageIndex
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        <button
          onClick={() => initLevel()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 hover:border-emerald-400 shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Level (ESC)</span>
        </button>
      </div>

      {/* ─── Main Screen-Filling Arena with Docked Side Clock UI ─── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
        {/* ─── Main Expanded Writing Canvas (3 Columns) ─── */}
        <div
          onClick={() => hiddenInputRef.current?.focus()}
          className="lg:col-span-3 relative min-h-[480px] md:min-h-[540px] p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-4 border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col justify-between cursor-text overflow-hidden"
        >
          {/* Hidden Typing Input */}
          <input
            ref={hiddenInputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 pointer-events-none -top-40"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Time's Up Fail State Alert Overlay */}
          <AnimatePresence>
            {showFailPenalty && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-40 bg-rose-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="p-3.5 bg-rose-500 rounded-full text-white shadow-xl mb-3 animate-bounce">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ⏱️ Time's Up! Level Reset
                </h3>
                <p className="text-sm font-bold text-rose-200 max-w-md mt-1 mb-4">
                  You must finish 100% of the text within the allocated time limit. The clock has reset—try again!
                </p>
                <div className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black">
                  Press any key to restart typing immediately!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Victory Overlay */}
          <AnimatePresence>
            {gameStatus === 'completed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-gradient-to-b from-emerald-950/90 via-slate-900/95 to-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="flex justify-center mb-1">
                  <Mascot mood="cheering" size="md" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  🎉 Level Challenge Completed!
                </h3>
                <p className="text-sm font-bold text-emerald-300 max-w-md mt-1 mb-4">
                  You beat the clock with {formatTime(timeRemaining)} remaining!
                </p>

                {/* Score Pills */}
                <div className="grid grid-cols-3 gap-3 my-3 w-full max-w-md">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-300 block">Speed</span>
                    <span className="text-xl font-black text-amber-400">{currentWpm} WPM</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-300 block">Accuracy</span>
                    <span className="text-xl font-black text-emerald-400">{accuracy}%</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[10px] uppercase font-black text-slate-300 block">Time Left</span>
                    <span className="text-xl font-black text-sky-400">{formatTime(timeRemaining)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => { soundEngine.playPop(); setTutorOpen(true); }}
                    className="px-5 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-black text-sm border border-purple-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    <span>AI Report</span>
                  </button>
                  {currentLevelNum < PRACTICE_LEVELS.length && (
                    <button
                      onClick={() => handleSelectLevel(currentLevelNum + 1)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                    >
                      <span>Next Level ({currentLevelNum + 1})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => initLevel()}
                    className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm border border-white/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Header Info */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                {currentPassage.category}
              </span>
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                "{currentPassage.title}"
              </span>
            </div>

            <div className="text-xs font-black text-slate-500 dark:text-slate-400">
              {userInput.length} / {targetText.length} chars
            </div>
          </div>

          {/* Main Interactive High-Contrast Text Display (Expanded for 20-30 line essays!) */}
          <div
            ref={textContainerRef}
            className="flex-1 overflow-y-auto max-h-[420px] md:max-h-[480px] pr-3 custom-scrollbar font-mono text-base sm:text-lg md:text-xl leading-relaxed md:leading-loose tracking-wide select-none whitespace-pre-wrap"
          >
            {targetText.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCurrent = index === userInput.length;
              const isCorrect = isTyped && userInput[index] === char;
              const isMistake = isTyped && !isCorrect;

              return (
                <span
                  key={index}
                  ref={isCurrent ? activeCharRef : null}
                  className={`relative transition-colors duration-75 ${
                    isCorrect
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : isMistake
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 rounded px-0.5 underline decoration-rose-500 decoration-2 font-bold'
                      : isCurrent
                      ? 'text-indigo-600 dark:text-indigo-300 font-black'
                      : 'text-slate-400 dark:text-slate-400 opacity-75'
                  }`}
                >
                  {/* Pulsing Caret Cursor */}
                  {isCurrent && gameStatus !== 'completed' && (
                    <motion.span
                      layoutId="practice-caret"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    />
                  )}
                  {char}
                </span>
              );
            })}
          </div>

          {/* Bottom Typing Status Hint */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>
              {gameStatus === 'idle' ? '⌨️ Press any key to begin typing and start the timer...' : '⚡ Keep typing smoothly without pausing!'}
            </span>
            <span>Esc to Restart</span>
          </div>
        </div>

        {/* ─── Prominent Docked Side Clock UI Panel (1 Column) ─── */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Main Countdown Timer Clock Box */}
          <motion.div
            animate={isTimeCritical ? { scale: [1, 1.03, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className={`p-5 rounded-3xl backdrop-blur-md border-4 shadow-2xl flex flex-col items-center justify-center text-center transition-colors duration-300 ${
              isTimeCritical
                ? 'bg-rose-500/15 border-rose-500 shadow-rose-500/30'
                : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-500 animate-spin' : 'text-slate-400'}`} />
              <span className={`text-xs font-black uppercase tracking-wider ${isTimeCritical ? 'text-rose-500' : 'text-slate-400'}`}>
                {isTimeCritical ? '⚠️ TIME CRITICAL' : 'COUNTDOWN TIMER'}
              </span>
            </div>

            {/* Big Digital Countdown Clock Display (Handles MM:SS perfectly!) */}
            <div
              className={`text-4xl sm:text-5xl font-mono font-black tracking-tight my-1 ${
                isTimeCritical
                  ? 'text-rose-500 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatTime(timeRemaining)}
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-3 mb-1">
              <div
                className={`h-full transition-all duration-300 ${
                  isTimeCritical
                    ? 'bg-rose-500'
                    : timeProgressPercent > 50
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.max(0, timeProgressPercent)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1">
              Allocated: {formatTime(initialTimeLimit)} ({initialTimeLimit}s)
            </span>
          </motion.div>

          {/* Live Speed & Accuracy Gauges */}
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Live Speed</span>
              <span className="text-xl font-black text-amber-500">
                {currentWpm} <span className="text-xs font-bold text-slate-400">WPM</span>
              </span>
            </div>
            <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Accuracy</span>
              <span className="text-xl font-black text-emerald-500">
                {accuracy}%
              </span>
            </div>
            <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Mistakes</span>
              <span className={`text-xl font-black ${mistakesCount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                {mistakesCount}
              </span>
            </div>
          </div>

          {/* Strict Penalty Warning Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-start gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="font-extrabold">Strict Rule:</strong> If the countdown hits 00:00 before 100% completion, the level instantly resets to the start!
            </span>
          </div>
        </div>
      </div>

      {/* AI Tutor Report Modal */}
      <AITutorReport
        sessionResult={practiceSessionResult}
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        targetWpm={currentLevel.targetWPM}
        showReplayButtons={true}
      />
    </div>
  );
};

export default PracticePage;
