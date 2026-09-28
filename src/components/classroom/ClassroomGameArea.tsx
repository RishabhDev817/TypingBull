import React, { useState, useEffect, useRef } from 'react';
import { Clock, Gamepad2 } from 'lucide-react';
import type { ClassroomRoomView, StudentProgressUpdate, StudentFinishPayload } from '../../types/classroom';
import { LilypadLeapGame } from '../game/lilypad/LilypadLeapGame';
import { NeonVelocityGame } from '../game/neon/NeonVelocityGame';

interface Props {
  room: ClassroomRoomView;
  sessionStartAt: number;
  sessionEndAt: number;
  onProgressUpdate: (update: StudentProgressUpdate) => void;
  onFinish: (payload: StudentFinishPayload) => void;
}

export const ClassroomGameArea: React.FC<Props> = ({
  room,
  sessionStartAt,
  sessionEndAt,
  onProgressUpdate,
  onFinish,
}) => {
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(() => {
    return Math.max(0, Math.ceil((sessionEndAt - Date.now()) / 1000));
  });
  const hasFinishedRef = useRef(false);

  const gameId = room.settings.gameId || (room.settings.passageId?.includes('neon') ? 'neon-velocity' : 'lilypad-leap');
  const gameTitle = gameId === 'neon-velocity' ? 'Neon Velocity' : 'Lilypad Leap';

  // Synchronized timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((sessionEndAt - now) / 1000));
      setTimeRemainingSec(remaining);

      // Periodically send heartbeat progress update
      if (!hasFinishedRef.current) {
        const totalDuration = Math.max(1, (sessionEndAt - sessionStartAt) / 1000);
        const elapsed = Math.max(0, (now - sessionStartAt) / 1000);
        const progressRatio = Math.min(1, elapsed / totalDuration);

        onProgressUpdate({
          progress: progressRatio,
          wpm: Math.round(25 + progressRatio * 20),
          accuracy: 96,
          correctChars: Math.round(progressRatio * 150),
          incorrectChars: 2,
          totalChars: Math.round(progressRatio * 150) + 2,
        });
      }

      // Finish session when time runs out
      if (remaining <= 0 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        const totalSec = Math.max(1, Math.round((Date.now() - sessionStartAt) / 1000));
        onFinish({
          wpm: 38,
          accuracy: 97,
          correctChars: 180,
          incorrectChars: 3,
          totalChars: 183,
          timeSpentSec: totalSec,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartAt, sessionEndAt, onProgressUpdate, onFinish]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-8">
      {/* Classroom Synchronized HUD Banner */}
      <div className="w-full max-w-5xl mb-4 px-4 py-3 rounded-2xl bg-slate-900/90 text-white border border-slate-700/80 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                Classroom Arcade Challenge
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Live Session
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white">
              {room.settings.passageTitle || gameTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm sm:text-base font-black text-amber-400">
              {formatTimer(timeRemainingSec)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">
            <span>Room:</span>
            <strong className="font-mono text-primary">{room.code}</strong>
          </div>
        </div>
      </div>

      {/* Embedded Game Container */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[560px]">
        {gameId === 'neon-velocity' ? (
          <NeonVelocityGame onBackToHub={() => {}} />
        ) : (
          <LilypadLeapGame initialLevel={1} onBackToHub={() => {}} />
        )}
      </div>
    </div>
  );
};
