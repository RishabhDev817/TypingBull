import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Share2,
  Crown,
  Play,
  LogOut,
  Sparkles,
  Users,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import type { Room } from '../../types/multiplayer.ts';
import { soundEngine } from '../../utils/audio';

interface Props {
  room: Room;
  myPlayerId: string;
  onToggleReady: () => void;
  onStartRace: () => void;
  onLeaveRoom: () => void;
}

export const PracticeGroundLobby: React.FC<Props> = ({
  room,
  myPlayerId,
  onToggleReady,
  onStartRace,
  onLeaveRoom,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const players = Object.values(room.players);
  const myPlayer = room.players[myPlayerId];
  const isHost = room.hostId === myPlayerId;
  const connectedPlayers = players.filter((p) => p.status !== 'DISCONNECTED');
  const allReady = connectedPlayers.length > 0 && connectedPlayers.every((p) => p.ready || p.isHost);

  const handleCopyCode = async () => {
    try {
      soundEngine.playPop();
      await navigator.clipboard.writeText(room.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      soundEngine.playPop();
      const origin = window.location.origin;
      const inviteUrl = `${origin}/play/practice-ground?room=${room.id}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex flex-col items-center select-none">
      {/* Top Bar: Room Code & Leave Room */}
      <div className="w-full flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => {
            soundEngine.playPop();
            onLeaveRoom();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-700/80 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-300 shadow-sm cursor-pointer transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Leave Room</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-100/90 dark:bg-indigo-950/80 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-300 text-xs font-black uppercase flex items-center gap-1.5 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>Racers {connectedPlayers.length}/{room.settings.maxPlayers}</span>
          </span>
        </div>
      </div>

      {/* Main Room Pass Display Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-4 border-indigo-400 dark:border-indigo-500/80 shadow-2xl shadow-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-5 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30 text-white border-2 border-white/20">
            🎟️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Arena Match Pass
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Private Room
              </span>
            </div>
            <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-slate-900 dark:text-white">
              {room.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyCode}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-black text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 border-b-4 transition-all cursor-pointer shadow-sm"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black border-2 border-indigo-600 border-b-4 border-b-indigo-800 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-200" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Invite'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Roster of Racers Grid - Strict 4-Column CSS Grid */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Racers at Starting Line
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-black border border-indigo-300 dark:border-indigo-800">
              {connectedPlayers.length} / {room.settings.maxPlayers}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {allReady ? 'All racers ready to launch!' : 'Waiting for racers to ready up'}
          </span>
        </div>

        {/* Strict CSS Grid: 1 col on mobile, 2 on small tablet, rigid 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full auto-rows-fr">
          {players.map((player) => {
            const isMe = player.id === myPlayerId;
            const isPlayerHost = player.id === room.hostId;
            const isDisconnected = player.status === 'DISCONNECTED';

            return (
              <motion.div
                key={player.id}
                layout
                className={`relative p-4 rounded-2xl flex flex-col justify-between transition-all duration-200 min-h-[165px] ${
                  isMe
                    ? 'bg-white/95 dark:bg-slate-900/95 border-2 border-emerald-400 dark:border-emerald-500 ring-4 ring-emerald-400/25 dark:ring-emerald-500/25 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-[1.02] z-10 backdrop-blur-2xl'
                    : isDisconnected
                    ? 'bg-slate-900/80 dark:bg-slate-950/80 border border-dashed border-slate-400/30 opacity-60 backdrop-blur-xl'
                    : 'bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-lg backdrop-blur-2xl'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-black/5 dark:border-white/10">
                      {player.avatarEmoji}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isPlayerHost && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 border border-amber-400/80 text-[10px] font-black uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                          <Crown className="w-3 h-3 fill-current text-amber-500" />
                          Host
                        </span>
                      )}
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase shadow-sm tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900 dark:text-white truncate">
                      {player.name}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                  {isDisconnected ? (
                    <span className="text-[11px] font-black text-amber-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Reconnecting...
                    </span>
                  ) : player.ready || isPlayerHost ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-400 text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Ready to Race
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase">
                      Waiting...
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Gamified Futuristic Open Slots with high-opacity frosted glass */}
          {Array.from({ length: Math.max(0, (room.settings.maxPlayers || 4) - players.length) }).map((_, idx) => (
            <motion.button
              key={`open-slot-${idx}`}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="group relative p-4 rounded-2xl border-2 border-dashed border-indigo-300/80 dark:border-indigo-500/40 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[165px] shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/15"
              title="Click to copy invite link"
            >
              {/* Corner HUD reticles */}
              <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-400/70 group-hover:border-indigo-600 transition-colors" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-400/70 group-hover:border-indigo-600 transition-colors" />
              <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-400/70 group-hover:border-indigo-600 transition-colors" />
              <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-400/70 group-hover:border-indigo-600 transition-colors" />

              {/* Pulsing Icon Frame */}
              <div className="w-12 h-12 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/90 dark:bg-indigo-950/60 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-all">
                <UserPlus className="w-5 h-5" />
              </div>

              {/* Pulsing Invite Prompt */}
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide group-hover:text-indigo-800 dark:group-hover:text-indigo-200 flex items-center gap-1">
                <span>+ Invite Player</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                {copiedLink ? 'Link Copied! 📋' : 'Click to Copy Invite'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Controls Bar */}
      <motion.div
        layout
        className="w-full max-w-md p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-4 border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col items-center gap-3"
      >
        {isHost ? (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundEngine.playPop();
                onStartRace();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center justify-center gap-2 cursor-pointer transition-transform"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Launch Match 🚀</span>
            </motion.button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
              {connectedPlayers.length < 2
                ? 'Invite friends or start solo practice!'
                : allReady
                ? 'All players are ready! Click Launch Match.'
                : 'Waiting for other players to ready up...'}
            </span>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundEngine.playPop();
                onToggleReady();
              }}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl border-b-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                myPlayer?.ready
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/30'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>{myPlayer?.ready ? 'Cancel Ready' : 'Ready Up! 🚀'}</span>
            </motion.button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
              {myPlayer?.ready
                ? 'You are ready! Waiting for the host to launch.'
                : 'Press Ready Up when you are prepared to race!'}
            </span>
          </>
        )}
      </motion.div>
    </div>
  );
};
