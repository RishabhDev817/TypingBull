import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeGroundSocket } from '../../hooks/usePracticeGroundSocket';
import { PracticeGroundConnectionBanner } from './PracticeGroundConnectionBanner';
import { PracticeGroundMenu } from './PracticeGroundMenu';
import { PracticeGroundLobby } from './PracticeGroundLobby';
import { PracticeGroundCountdown } from './PracticeGroundCountdown';
import { PracticeGroundRaceTrack } from './PracticeGroundRaceTrack';
import { PracticeGroundTypingArea } from './PracticeGroundTypingArea';
import { PracticeGroundResults } from './PracticeGroundResults';
import { soundEngine } from '../../utils/audio';

interface Props {
  onBackToHub: () => void;
  initialRoomCode?: string;
}

export const PracticeGroundView: React.FC<Props> = ({
  onBackToHub,
  initialRoomCode,
}) => {
  const {
    status,
    phase,
    setPhase,
    room,
    myPlayerId,
    playerName,
    playerEmoji,
    savePlayerProfile,
    countdownStartAt,
    raceText,
    raceTextTitle,
    raceRankings,
    opponentsProgress,
    notifications,
    errorMessage,
    createRoom,
    joinRoom,
    findQuickMatch,
    cancelQuickMatch,
    toggleReady,
    startRace,
    sendProgress,
    requestRematch,
    leaveRoom,
  } = usePracticeGroundSocket(initialRoomCode);

  const [myProgress, setMyProgress] = useState<{
    progress: number;
    wpm: number;
    accuracy: number;
    finished: boolean;
  }>({
    progress: 0,
    wpm: 0,
    accuracy: 100,
    finished: false,
  });

  const handleProgressUpdate = (
    correctChars: number,
    incorrectChars: number,
    totalChars: number,
    wpm: number,
    accuracy: number,
    completed: boolean
  ) => {
    const textLen = raceText.length || 1;
    const progressPercent = Math.min(100, Math.round((correctChars / textLen) * 100));

    setMyProgress({
      progress: progressPercent,
      wpm,
      accuracy,
      finished: completed,
    });

    sendProgress(correctChars, incorrectChars, totalChars, wpm, accuracy, completed);
  };

  const handleLocalFinish = () => {
    setMyProgress((prev) => ({ ...prev, finished: true }));
  };

  const activeRoom = useMemo(() => {
    return (
      room || {
        id: 'RACE',
        hostId: myPlayerId,
        status: (phase === 'COUNTDOWN' ? 'COUNTDOWN' : 'RACING') as 'COUNTDOWN' | 'RACING',
        players: {
          [myPlayerId]: {
            id: myPlayerId,
            sessionToken: '',
            name: playerName || 'You',
            avatarEmoji: playerEmoji || '🐂',
            isHost: true,
            status: 'RACING' as const,
            ready: true,
            progress: 0,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            wpm: 0,
            accuracy: 100,
          },
        },
        settings: {
          maxPlayers: 2,
          durationSeconds: 60,
          language: 'english',
        },
        text: raceText || 'The speedway is ready for racing champions.',
        textTitle: raceTextTitle || 'Speed Speedway',
        createdAt: 0,
      }
    );
  }, [room, myPlayerId, phase, playerName, playerEmoji, raceText, raceTextTitle]);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center relative py-6">
      {/* Floating Status and Toast Notifications */}
      <PracticeGroundConnectionBanner
        status={status}
        notifications={notifications}
      />

      <AnimatePresence mode="wait">
        {/* PHASE 1: MENU */}
        {phase === 'MENU' && (
          <motion.div
            key="pg-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <PracticeGroundMenu
              playerName={playerName}
              playerEmoji={playerEmoji}
              onSaveProfile={savePlayerProfile}
              onQuickMatch={() => findQuickMatch()}
              onCreateRoom={() => createRoom()}
              onJoinRoom={(code) => joinRoom(code)}
              onBackToHub={onBackToHub}
              initialCode={initialRoomCode}
              errorMessage={errorMessage}
            />
          </motion.div>
        )}

        {/* PHASE 2: MATCHMAKING RADAR QUEUE */}
        {phase === 'QUEUE' && (
          <motion.div
            key="pg-queue"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-4 border-emerald-400 dark:border-emerald-500 shadow-2xl shadow-emerald-500/10 flex flex-col items-center text-center select-none"
          >
            {/* Radar Header */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Arena Radar Active</span>
            </div>

            {/* Concentric Radar Screen */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-slate-950/90 border-4 border-emerald-400/80 dark:border-emerald-500/80 flex items-center justify-center overflow-hidden shadow-inner shadow-emerald-950/80 mb-6">
              {/* Radar Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-emerald-500/20" />
                <div className="absolute h-full w-[1px] bg-emerald-500/20" />
              </div>

              {/* Concentric Circles */}
              <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-emerald-500/30" />
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-emerald-500/40" />
              <div className="absolute w-12 h-12 rounded-full border border-emerald-500/50" />

              {/* Rotating Radar Sweep */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.4) 360deg)',
                }}
              />

              {/* Simulated arena radar blips */}
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: 0.4 }}
                className="absolute top-10 right-14 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
              />
              <motion.div
                animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.9, 1.3, 0.9] }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 1.2 }}
                className="absolute bottom-12 left-12 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
              />

              {/* Center Arena Mascot */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 p-0.5 shadow-xl shadow-emerald-500/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                  {playerEmoji || '🐂'}
                </div>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Searching for Opponents...
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1 mb-6 max-w-xs">
              Matching your speed against live typists on the speedway.
            </p>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundEngine.playPop();
                  cancelQuickMatch();
                }}
                className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-black border-2 border-rose-200 dark:border-rose-900/60 shadow-md transition-all cursor-pointer"
              >
                Cancel Search
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: WAITING LOBBY */}
        {phase === 'LOBBY' && room && (
          <motion.div
            key="pg-lobby"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <PracticeGroundLobby
              room={room}
              myPlayerId={myPlayerId}
              onToggleReady={toggleReady}
              onStartRace={startRace}
              onLeaveRoom={leaveRoom}
            />
          </motion.div>
        )}

        {/* PHASE 4 & 5: LIVE RACING WITH COUNTDOWN OVERLAY */}
        {(phase === 'COUNTDOWN' || phase === 'RACING') && (
          <motion.div
            key="pg-racing"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-5xl mx-auto px-3 sm:px-6 flex flex-col gap-5 select-none relative"
          >
            {/* Real-time Multi-runner Track */}
            <PracticeGroundRaceTrack
              players={Object.values(activeRoom.players)}
              myPlayerId={myPlayerId}
              opponentsProgress={opponentsProgress}
              myProgress={myProgress}
            />

            {/* Zero-latency Interactive Typing Arena */}
            <PracticeGroundTypingArea
              targetText={raceText || activeRoom.text}
              textTitle={raceTextTitle || activeRoom.textTitle}
              raceStartAt={activeRoom.raceStartAt ?? countdownStartAt ?? 0}
              durationSeconds={activeRoom.settings.durationSeconds}
              isFinished={myProgress.finished}
              onProgressUpdate={handleProgressUpdate}
              onLocalFinish={handleLocalFinish}
            />

            {/* Synchronized Countdown Overlay */}
            {phase === 'COUNTDOWN' && countdownStartAt && (
              <PracticeGroundCountdown
                startAt={countdownStartAt}
                textTitle={raceTextTitle || activeRoom.textTitle}
                onCountdownComplete={() => {
                  setPhase('RACING');
                }}
              />
            )}
          </motion.div>
        )}

        {/* PHASE 6: FINAL RESULTS PODIUM */}
        {phase === 'RESULTS' && (
          <motion.div
            key="pg-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <PracticeGroundResults
              rankings={raceRankings}
              myPlayerId={myPlayerId}
              myProgress={myProgress}
              playerName={playerName}
              playerEmoji={playerEmoji}
              durationSeconds={room?.settings?.durationSeconds ?? 60}
              onPlayAgain={() => {
                setMyProgress({ progress: 0, wpm: 0, accuracy: 100, finished: false });
                requestRematch();
              }}
              onReturnToMenu={() => {
                setMyProgress({ progress: 0, wpm: 0, accuracy: 100, finished: false });
                leaveRoom();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
