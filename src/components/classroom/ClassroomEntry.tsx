import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  X,
  Check,
  Zap,
} from 'lucide-react';
import { STUDENT_AVATARS } from '../../data/classroom/studentAvatars';
import { soundEngine } from '../../utils/audio';
import { sanitizeAndModerateName } from '../../utils/nameModeration';

interface Props {
  initialCode?: string;
  initialTab?: 'student' | 'teacher';
  onCreateClassroom: (teacherName?: string) => void;
  onJoinClassroom: (code: string, studentName: string, avatarEmoji?: string) => void;
  isLoading?: boolean;
  onBackToLanding?: () => void;
}

export const ClassroomEntry: React.FC<Props> = ({
  initialCode = '',
  initialTab = 'student',
  onCreateClassroom,
  onJoinClassroom,
  isLoading = false,
  onBackToLanding,
}) => {
  const [tab, setTab] = useState<'student' | 'teacher'>(
    initialTab || (initialCode ? 'student' : 'student')
  );
  const [code, setCode] = useState<string>(initialCode.toUpperCase());
  const [studentName, setStudentName] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('Teacher');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(STUDENT_AVATARS[0].id);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBackToLanding) {
        onBackToLanding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToLanding]);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const cleanCode = code.trim().toUpperCase();
    const cleanName = studentName.trim();

    if (!cleanCode || cleanCode.length < 4) {
      setValidationError('Please enter a valid 6-character classroom code.');
      soundEngine.playError?.();
      return;
    }
    if (!cleanName) {
      setValidationError('Please enter your name or nickname.');
      soundEngine.playError?.();
      return;
    }

    soundEngine.playPop();
    const moderatedName = sanitizeAndModerateName(cleanName, 'Student');
    // Binds avatar ID solely to the student's custom display name
    onJoinClassroom(cleanCode, moderatedName, selectedAvatarId);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop();
    const moderatedTeacher = sanitizeAndModerateName(teacherName.trim() || 'Teacher', 'Teacher');
    onCreateClassroom(moderatedTeacher);
  };

  const handleAvatarSelect = (avatarId: string) => {
    soundEngine.playPop();
    setSelectedAvatarId(avatarId);
  };

  return (
    <div
      className="fixed inset-0 lg:left-64 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/65 backdrop-blur-xl overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onBackToLanding) {
          onBackToLanding();
        }
      }}
    >
      {/* ─── EXPANSIVE WIDESCREEN COMMAND CENTER CARD (CENTERED IN MAIN CANVAS) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-4xl xl:max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-white/50 dark:border-slate-800/80 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.35)] relative flex flex-col mx-auto my-auto select-none"
      >
        {/* Soft Radial Ambient Corner Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tl from-indigo-600/25 via-purple-600/15 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Mechanical Keyboard Keycap Watermark Wireframe */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] dark:opacity-[0.06] z-0"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="keyboard-keycap-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="8" y="8" width="28" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M16 16h12 M16 22h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="44" y="8" width="28" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <rect x="8" y="44" width="28" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <rect x="44" y="44" width="28" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
              <circle cx="40" cy="40" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#keyboard-keycap-pattern)" />
        </svg>

        {/* Frosted Top-Right Close Button (✕) */}
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            aria-label="Close modal"
            className="absolute top-4 sm:top-5 right-4 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ─── TWO-COLUMN SPLIT ARCHITECTURE (EQUAL INTERNAL PADDING) ─── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-7 md:p-8 items-start">
          {/* ─── LEFT COLUMN (40% width / 5 Cols): Lab Perks & Live Context ─── */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 p-1 sm:p-2">
            <div>
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-teal-500/15 to-amber-500/15 border border-teal-500/30 dark:border-teal-400/30 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs backdrop-blur-md">
                <span className="text-amber-500">⚡</span>
                <span>REAL-TIME CLASSROOM ARENA</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.15] mb-3 bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 bg-clip-text text-transparent">
                Level Up Your Typing, Together
              </h2>

              {/* Informational Copy (>= 16px font scale) */}
              <p className="text-base text-slate-700 dark:text-slate-200 font-semibold leading-relaxed mb-4">
                Built from the ground up for school computer labs, coding clubs, and live student typing battles. No student sign-ups, no passwords, zero friction — enter your name, pick your avatar, and race in real time.
              </p>
            </div>

            {/* Feature Cards (Frosted Micro-Cards) */}
            <div className="space-y-2.5">
              {/* Card 1 */}
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-400/30 flex items-center justify-center shrink-0 text-sm">
                  🚀
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    6-Letter Quick Access
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                    Instant teacher-generated room codes. No emails or child personal data stored.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 text-sm">
                  🏁
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    Synchronized Multi-Track
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                    Real-time speedometers, live lane racing, and dynamic WPM leaderboards.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0 text-sm">
                  🧹
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                    Clean Ephemeral Sessions
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                    All student session data clears automatically once the period ends.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Trust Badge */}
            <div className="pt-1 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>FERPA & COPPA friendly • 100% in-memory lab sessions</span>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (60% width / 7 Cols): Interactive Join / Host Engine ─── */}
          <div className="lg:col-span-7 flex flex-col space-y-4 p-1 sm:p-2">
            {/* Segmented Role Toggle Bar */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setTab('student');
                  setValidationError(null);
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tab === 'student'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/80 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-base sm:text-lg">🎓</span>
                <span>Join as Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setTab('teacher');
                  setValidationError(null);
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tab === 'teacher'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200/80 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-base sm:text-lg">👨‍🏫</span>
                <span>Teacher / Host Mode</span>
              </button>
            </div>

            {/* Validation Error Toast */}
            {validationError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold text-center">
                {validationError}
              </div>
            )}

            {/* ─── TAB 1: JOIN AS STUDENT VIEW ─── */}
            {tab === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {/* Classroom Invite Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Classroom Invite Code
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">6 characters</span>
                  </div>
                  <input
                    type="text"
                    id="student-classroom-code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TB-4821"
                    maxLength={8}
                    autoFocus={!initialCode}
                    className="w-full font-mono text-xl sm:text-2xl font-bold tracking-[0.3em] uppercase text-center py-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Ask your teacher for the 6-character room code.
                  </p>
                </div>

                {/* Display Name Input (>=16px font size) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Your Name or Nickname
                  </label>
                  <input
                    type="text"
                    id="student-name-input"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g., Alex, Priya, Marcus, Maya..."
                    maxLength={24}
                    className="w-full text-base py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition"
                  />
                </div>

                {/* ─── "Choose your Avatar" Section (Pure Circular Avatar Icons, No Names) ─── */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Choose your Avatar
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Avatar Selected</span>
                    </span>
                  </div>

                  {/* 12 Circular Avatar Buttons (6x2 Grid, Clean & Proportional) */}
                  <div className="grid grid-cols-6 gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 justify-items-center">
                    {STUDENT_AVATARS.map((avatar) => {
                      const isSelected = selectedAvatarId === avatar.id;
                      return (
                        <button
                          key={avatar.id}
                          id={`avatar-select-${avatar.id}`}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar.id)}
                          aria-label={`Select avatar ${avatar.id}`}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 transition-all duration-200 cursor-pointer relative flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'ring-4 ring-indigo-500/40 border-2 border-indigo-600 dark:border-amber-400 bg-indigo-50 dark:bg-indigo-950/60 scale-105 shadow-md'
                              : 'border-2 border-slate-200/80 dark:border-slate-700/70 bg-white/90 dark:bg-slate-800/90 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 shadow-xs'
                          }`}
                        >
                          {/* Active Glowing Checkmark Badge */}
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs z-10">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}

                          {/* Circular Avatar Portrait */}
                          <div
                            className={`w-full h-full rounded-full bg-gradient-to-br ${avatar.bgColor} overflow-hidden flex items-center justify-center`}
                          >
                            <img
                              src={avatar.avatarUrl}
                              alt="Student Avatar"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button */}
                <motion.button
                  type="submit"
                  id="enter-classroom-arena-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full py-3.5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/30 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>Enter Classroom Arena</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            )}

            {/* ─── TAB 2: TEACHER / HOST MODE VIEW ─── */}
            {tab === 'teacher' && (
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                {/* Teacher Display Name Input (>= 16px font size) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Teacher or Room Host Name
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g., Mrs. Harper, Prof. Roy, Computer Lab 2..."
                    maxLength={32}
                    className="w-full text-base py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    This name will appear on student monitors when they connect.
                  </p>
                </div>

                {/* Session Configuration & Features Preview Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-base font-bold">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <span>Host Controls Ready</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    Instantly generates an active 6-letter room code. You can start synchronized countdowns, select custom text drills, and view real-time student WPM metrics as they type.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30">
                      ✓ Instant Code Generation
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30">
                      ✓ Live Student Telemetry
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30">
                      ✓ Automatic Reset
                    </span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <motion.button
                  type="submit"
                  id="teacher-create-submit-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full py-3.5 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/30 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create Live Classroom & Show Code</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
