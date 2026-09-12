import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Users,
  LogIn,
  ArrowLeft,
  Trophy,
  Check,
  Edit3,
  X,
} from 'lucide-react';
import { Mascot } from '../Mascot';
import { soundEngine } from '../../utils/audio';
import { useI18n } from '../../context/I18nContext';

interface Props {
  playerName: string;
  playerEmoji: string;
  onSaveProfile: (name: string, emoji: string) => void;
  onQuickMatch: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onBackToHub: () => void;
  initialCode?: string;
  errorMessage?: string | null;
}

const AVATAR_OPTIONS = ['🐂', '⚡', '🔥', '🚀', '🎯', '🏎️', '🐯', '🦅', '👑', '🥊'];

export const PracticeGroundMenu: React.FC<Props> = ({
  playerName,
  playerEmoji,
  onSaveProfile,
  onQuickMatch,
  onCreateRoom,
  onJoinRoom,
  onBackToHub,
  initialCode = '',
  errorMessage,
}) => {
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState<string>(playerName);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(playerEmoji);
  const [roomCodeInput, setRoomCodeInput] = useState<string>(initialCode);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 240, damping: 22 },
    },
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundEngine.playPop();
    const clean = nameInput.trim() || 'Typist-101';
    onSaveProfile(clean, selectedEmoji);
    setIsEditingProfile(false);
  };

  const handleQuickMatch = () => {
    soundEngine.playPop();
    const clean = nameInput.trim() || 'Typist-101';
    onSaveProfile(clean, selectedEmoji);
    onQuickMatch();
  };

  const handleCreateRoom = () => {
    soundEngine.playPop();
    const clean = nameInput.trim() || 'Typist-101';
    onSaveProfile(clean, selectedEmoji);
    onCreateRoom();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    soundEngine.playPop();
    const clean = nameInput.trim() || 'Typist-101';
    onSaveProfile(clean, selectedEmoji);
    onJoinRoom(roomCodeInput.trim().toUpperCase());
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center select-none">
      {/* ─── TOP BAR: Navigation, Racer Passport, and Live Online Pill ─── */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-wrap items-center justify-between gap-3 mb-4"
      >
        {/* Left: Back to Arcade Hub */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onBackToHub();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-md backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('multiplayer.backToArcade')}</span>
        </button>

        {/* Right Group: Racer Passport Pill & Live Online Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Racer Passport Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundEngine.playPop();
              setIsEditingProfile(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border-2 border-indigo-400 dark:border-indigo-500 shadow-md backdrop-blur-md text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer"
            title={t('multiplayer.editProfileDesc')}
          >
            <span className="text-base">{playerEmoji}</span>
            <span className="max-w-[120px] truncate">{playerName}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase flex items-center gap-1">
              <Edit3 className="w-2.5 h-2.5" />
              {t('multiplayer.editProfile')}
            </span>
          </motion.button>

          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
            <span>{t('multiplayer.onlineBadge')}</span>
          </div>
        </div>
      </motion.div>

      {/* ─── COMPACT HERO SECTION: Title & Competitive Energy ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-6"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-2">
          <Mascot mood="happy" size="lg" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-400/50 text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-wider mb-2.5 shadow-sm"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('multiplayer.heroBadge')}</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none"
        >
          {t('multiplayer.heroTitle')}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-2 font-bold leading-relaxed"
        >
          {t('multiplayer.heroSubtitle')}
        </motion.p>
      </motion.div>

      {/* Error Toast in Menu */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-3 mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200 text-xs font-black text-center shadow-lg"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* ─── 3-CARD ARENA GRID (Exact Arcade Games Benchmark Layout) ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* ─── CARD 1: QUICK MATCH (INSTANT ACTION) ─── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-4 border-emerald-400 dark:border-emerald-500/80 shadow-2xl bg-gradient-to-b from-emerald-500/10 via-white/95 dark:via-slate-900/95 to-emerald-500/5 dark:to-slate-900/95 backdrop-blur-md"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {t('multiplayer.quickMatchBadge')}
              </span>
              <span className="text-2xl">⚡</span>
            </div>

            {/* Visual Game Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-5xl drop-shadow-md mb-1 animate-bounce">🏎️💨</span>
                <span className="text-white font-black text-xs tracking-wider uppercase drop-shadow">
                  {t('multiplayer.speedway')}
                </span>
                <span className="text-[10px] font-bold text-emerald-100/90 mt-0.5">
                  {t('multiplayer.instantMatchmaking')}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('multiplayer.quickMatchTitle')}
            </h3>
            <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
              {t('multiplayer.quickMatchFocus')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              {t('multiplayer.quickMatchDesc')}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-300 dark:border-emerald-700">
                {t('multiplayer.qmFeat1')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-extrabold text-[11px] border border-teal-300 dark:border-teal-700">
                {t('multiplayer.qmFeat2')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-extrabold text-[11px] border border-cyan-300 dark:border-cyan-700">
                {t('multiplayer.qmFeat3')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-300 dark:border-indigo-700">
                {t('multiplayer.qmFeat4')}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleQuickMatch}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{t('multiplayer.findOpponent')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ─── CARD 2: CREATE PRIVATE ROOM ─── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-4 border-cyan-400 dark:border-cyan-500/80 shadow-2xl bg-gradient-to-b from-cyan-500/10 via-white/95 dark:via-slate-900/95 to-indigo-950/10 dark:to-slate-900/95 backdrop-blur-md"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {t('multiplayer.hostMatchBadge')}
              </span>
              <span className="text-2xl">🎮</span>
            </div>

            {/* Visual Game Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-950 to-indigo-950 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5 border border-cyan-500/30">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl drop-shadow mb-1 animate-pulse">👑🏆</span>
                <span className="text-cyan-300 font-black text-xs tracking-wider uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                  {t('multiplayer.privateArena')}
                </span>
                <span className="text-[10px] font-bold text-cyan-400/90 mt-0.5">
                  {t('multiplayer.customCodeInvite')}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('multiplayer.createRoomTitle')}
            </h3>
            <p className="text-xs font-black text-cyan-700 dark:text-cyan-300 mt-0.5">
              {t('multiplayer.createRoomFocus')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              {t('multiplayer.createRoomDesc')}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-extrabold text-[11px] border border-cyan-300 dark:border-cyan-700">
                {t('multiplayer.crFeat1')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-300 dark:border-indigo-700">
                {t('multiplayer.crFeat2')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold text-[11px] border border-blue-300 dark:border-blue-700">
                {t('multiplayer.crFeat3')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-300 dark:border-amber-700">
                {t('multiplayer.crFeat4')}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base shadow-lg shadow-cyan-500/30 border-b-4 border-cyan-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>{t('multiplayer.createRoomBtn')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ─── CARD 3: JOIN WITH ROOM CODE (DIRECT ACCESS) ─── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border-4 border-purple-400 dark:border-purple-500/80 shadow-2xl bg-gradient-to-b from-purple-500/10 via-white/95 dark:via-slate-900/95 to-purple-500/5 dark:to-slate-900/95 backdrop-blur-md"
        >
          {/* Top highlight glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                {t('multiplayer.directEntryBadge')}
              </span>
              <span className="text-2xl">🔑</span>
            </div>

            {/* Visual Game Banner */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden shadow-inner mb-5 border border-purple-500/30">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:12px_12px]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl drop-shadow mb-1 animate-pulse">🎟️📟</span>
                <span className="text-purple-300 font-black text-xs tracking-wider uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  {t('multiplayer.enterRoomCode')}
                </span>
                <span className="text-[10px] font-bold text-purple-400/80 mt-0.5">
                  {t('multiplayer.joinFriendArena')}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('multiplayer.joinCodeTitle')}
            </h3>
            <p className="text-xs font-black text-purple-800 dark:text-purple-300 mt-0.5">
              {t('multiplayer.joinCodeFocus')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-2.5 leading-relaxed">
              {t('multiplayer.joinCodeDesc')}
            </p>

            {/* Embedded Room Code Input Box */}
            <form onSubmit={handleJoin} className="mt-4">
              <input
                type="text"
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder={t('multiplayer.enterRoomCode')}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border-2 border-purple-300 dark:border-purple-700 font-mono font-black text-base tracking-widest text-center text-slate-900 dark:text-white uppercase placeholder:text-slate-400 focus:outline-none focus:border-purple-500 shadow-inner"
              />
            </form>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleJoin}
              disabled={!roomCodeInput.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 text-white font-black text-base shadow-lg shadow-purple-500/30 border-b-4 border-purple-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{t('multiplayer.joinMatchBtn')}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── RACER PROFILE MODAL (Non-intrusive popup) ─── */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border-4 border-indigo-400 dark:border-indigo-500 shadow-2xl relative"
            >
              <button
                onClick={() => setIsEditingProfile(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                  {selectedEmoji}
                </span>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {t('multiplayer.editProfileTitle')}
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {t('multiplayer.editProfileDesc')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 block mb-1.5">
                    {t('multiplayer.racerNickname')}:
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Typist-101"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                    {t('multiplayer.chooseAvatar')}:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`h-12 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? 'bg-indigo-500 text-white shadow-md scale-110'
                            : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md border-b-4 border-emerald-700 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('multiplayer.saveProfile')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm cursor-pointer"
                  >
                    {t('feedback.done')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
