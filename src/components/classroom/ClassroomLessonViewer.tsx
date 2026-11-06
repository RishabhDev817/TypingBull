import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  Target,
  GraduationCap,
} from 'lucide-react';
import type { ClassroomLesson } from '../../data/classroom/classroomLessons';
import { soundEngine } from '../../utils/audio';
import { PASTE_GUARD_PROPS, isBulkInsert } from '../../utils/typingGuard';
import { useI18n } from '../../context/I18nContext';
import { CLASSROOM_PICKER } from '../../i18n/classroomPickerI18n';
import { fill } from '../../i18n/classroomEntryI18n';
import { CLASSROOM_TEACHER } from '../../i18n/classroomTeacherI18n';

interface Props {
  lesson: ClassroomLesson;
  onBack: () => void;
  isTeacher?: boolean;
  onAssignToClassroom?: (text: string, title: string, category?: string, lessonId?: string) => void;
}

type Step = 'overview' | 'concept' | 'guided' | 'exercise' | 'completed';

export const ClassroomLessonViewer: React.FC<Props> = ({
  lesson,
  onBack,
  isTeacher = false,
  onAssignToClassroom,
}) => {
  const { currentLang } = useI18n();
  const pp = CLASSROOM_PICKER[currentLang] ?? CLASSROOM_PICKER.en;
  const tt = CLASSROOM_TEACHER[currentLang] ?? CLASSROOM_TEACHER.en;
  const [currentStep, setCurrentStep] = useState<Step>('overview');
  const [guidedIndex, setGuidedIndex] = useState<number>(0);

  // Exercise typing state
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isExerciseDone, setIsExerciseDone] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const targetText = lesson.typingExercise.targetText;

  // Auto-focus input when on exercise step
  useEffect(() => {
    if (currentStep === 'exercise' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  // Compute live WPM and Accuracy
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Reject paste / bulk inserts: only real keystrokes count.
    if (isBulkInsert(userInput, val)) return;
    if (isExerciseDone) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(val);
    soundEngine.playClick(val[val.length - 1] === ' ');

    // Check accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correct++;
      }
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Live WPM
    const timeElapsedSec = Math.max(1, (Date.now() - (startTime || Date.now())) / 1000);
    const words = correct / 5;
    const currentWpm = Math.round((words / timeElapsedSec) * 60);
    setWpm(currentWpm);

    // Check completion
    if (val.length >= targetText.length) {
      setIsExerciseDone(true);
      soundEngine.playLessonComplete();
    }
  };

  const resetExercise = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsExerciseDone(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const stepsList: { key: Step; label: string }[] = [
    { key: 'overview', label: pp.stepObjective },
    { key: 'concept', label: pp.stepFinger },
    { key: 'guided', label: pp.stepGuided },
    { key: 'exercise', label: pp.stepDrill },
    { key: 'completed', label: pp.stepSummary },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title={pp.backCatalogTitle}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider">
                {fill(pp.lessonNum, { n: lesson.lessonNumber })}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lesson.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Teacher Session Target Assignment Button */}
        {isTeacher && onAssignToClassroom && (
          <button
            type="button"
            onClick={() => {
              onAssignToClassroom(lesson.typingExercise.targetText, `Lesson ${lesson.lessonNumber}: ${lesson.shortTitle}`);
              soundEngine.playVictory();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{pp.setSession}</span>
          </button>
        )}
      </div>

      {/* Step Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200 dark:border-slate-700 overflow-x-auto">
        {stepsList.map((st) => {
          const isActive = currentStep === st.key;
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => setCurrentStep(st.key)}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap text-center ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>

      {/* Main Lesson Body */}
      <AnimatePresence mode="wait">
        {/* ─── STEP 1: OVERVIEW & LEARNING OBJECTIVE ─── */}
        {currentStep === 'overview' && (
          <motion.div
            key="step-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Target className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {pp.learningObjective}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                {lesson.learningObjective}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                {lesson.explanation}
              </p>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-0.5">
                    {pp.proTip}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {lesson.example.tip}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep('concept')}
                className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition cursor-pointer flex items-center gap-2"
              >
                <span>{pp.continueFinger}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: CONCEPT & FINGER GUIDE ─── */}
        {currentStep === 'concept' && (
          <motion.div
            key="step-concept"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {pp.ergonomic}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
                {lesson.typingConcept.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                {lesson.typingConcept.description}
              </p>

              {/* Finger Assignment Grid */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  {pp.fingerAlloc}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lesson.typingConcept.fingerGuide.map((fg, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center"
                    >
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {fg.finger}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
                        {fg.keys.map((k) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 font-mono text-xs font-black text-primary dark:text-blue-300 border border-slate-200 dark:border-slate-600 shadow-xs"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Highlights Demonstration */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-sm sm:text-base flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    {pp.visualExample}
                  </span>
                  <span className="font-bold text-emerald-400">{lesson.example.demonstration}</span>
                </div>
                <div className="text-2xl">⌨️</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep('overview')}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{pp.back}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('guided')}
                className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition cursor-pointer flex items-center gap-2"
              >
                <span>{pp.startGuided}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: GUIDED PRACTICE ─── */}
        {currentStep === 'guided' && (
          <motion.div
            key="step-guided"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {fill(pp.drillOf, { i: guidedIndex + 1, n: lesson.guidedPractice.length })}
                  </span>
                </div>

                <div className="flex gap-1">
                  {lesson.guidedPractice.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === guidedIndex ? 'bg-indigo-600 w-6' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Current Drill Card */}
              {lesson.guidedPractice[guidedIndex] && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {lesson.guidedPractice[guidedIndex].prompt}
                  </h3>

                  <div className="p-6 rounded-2xl bg-slate-950 text-white font-mono text-xl sm:text-2xl tracking-wider text-center border border-slate-800 shadow-inner">
                    {lesson.guidedPractice[guidedIndex].pattern}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {pp.focusKeys}
                    </span>
                    <div className="flex gap-1.5">
                      {lesson.guidedPractice[guidedIndex].focusKeys.map((k) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-black border border-indigo-200 dark:border-indigo-800"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isTeacher && onAssignToClassroom && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/60 dark:bg-indigo-950/30 p-3.5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                          {pp.teachPattern}
                        </span>
                      </div>
                      <button
                        type="button"
                        id={`assign-drill-btn-${guidedIndex}`}
                        onClick={() => {
                          onAssignToClassroom(
                            lesson.guidedPractice[guidedIndex].pattern,
                            `Lesson ${lesson.lessonNumber} Drill: ${lesson.guidedPractice[guidedIndex].prompt}`,
                            'homerow',
                            lesson.id
                          );
                          soundEngine.playVictory();
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>{pp.assignDrill}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  if (guidedIndex > 0) {
                    setGuidedIndex(guidedIndex - 1);
                  } else {
                    setCurrentStep('concept');
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{pp.prevDrill}</span>
              </button>

              {guidedIndex < lesson.guidedPractice.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setGuidedIndex(guidedIndex + 1)}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2"
                >
                  <span>{pp.nextDrill}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep('exercise')}
                  className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition cursor-pointer flex items-center gap-2"
                >
                  <span>{pp.advance}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── STEP 4: INTERACTIVE EXERCISE DRILL ─── */}
        {currentStep === 'exercise' && (
          <motion.div
            key="step-exercise"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lesson.typingExercise.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lesson.typingExercise.instructions}
                  </p>
                </div>

                {/* Live Performance HUD */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                      {pp.speed}
                    </span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                      {fill(tt.wpmValue, { n: wpm })}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                      {pp.accuracy}
                    </span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {accuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Character Display with Real-Time Feedback */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 font-mono text-lg sm:text-xl leading-relaxed cursor-text mb-4 min-h-[140px] flex flex-wrap items-center content-start"
              >
                {targetText.split('').map((char, i) => {
                  let colorClass = 'text-slate-400 dark:text-slate-500';
                  let bgClass = '';

                  if (i < userInput.length) {
                    if (userInput[i] === char) {
                      colorClass = 'text-emerald-600 dark:text-emerald-400 font-bold';
                    } else {
                      colorClass = 'text-rose-600 dark:text-rose-400 font-black';
                      bgClass = 'bg-rose-100 dark:bg-rose-950/60 rounded px-0.5';
                    }
                  } else if (i === userInput.length) {
                    bgClass = 'bg-primary/20 dark:bg-primary/40 rounded border-b-2 border-primary';
                    colorClass = 'text-slate-900 dark:text-white font-bold';
                  }

                  return (
                    <span key={i} className={`${colorClass} ${bgClass} transition-colors`}>
                      {char === ' ' ? ' ' : char}
                    </span>
                  );
                })}
              </div>

              {/* Hidden/Active Input */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                {...PASTE_GUARD_PROPS}
                onChange={handleInputChange}
                disabled={isExerciseDone}
                placeholder={isExerciseDone ? pp.exComplete : pp.typeAbove}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-hidden font-mono text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4"
              />

              {/* Completion Banner inside Drill */}
              {isExerciseDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                        {pp.exCompleted}
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {fill(pp.speedAcc, { wpm, acc: accuracy })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetExercise}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 cursor-pointer hover:bg-emerald-50 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{pp.tryAgain}</span>
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep('guided')}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{pp.back}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('completed')}
                className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition cursor-pointer flex items-center gap-2"
              >
                <span>{pp.viewSummary}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 5: LESSON SUMMARY & PASSAGE ─── */}
        {currentStep === 'completed' && (
          <motion.div
            key="step-completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-3xl mx-auto mb-4 text-emerald-600">
                <Trophy className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                {fill(pp.lessonCompleteTitle, { n: lesson.lessonNumber })}
              </h3>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                {pp.reviewed.split('{title}').flatMap((part, i, arr) =>
                  i < arr.length - 1
                    ? [part, <strong key={i} className="text-slate-900 dark:text-white">{lesson.title}</strong>]
                    : [part]
                )}
              </p>

              {/* Connected Passage Option */}
              {lesson.passage && (
                <div className="text-left p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      {fill(pp.recPassage, { title: lesson.passage.title })}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {fill(pp.passTarget, { n: lesson.passage.targetWpm })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium italic leading-relaxed">
                    "{lesson.passage.text}"
                  </p>
                  {isTeacher && onAssignToClassroom && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onAssignToClassroom(
                            lesson.passage!.text,
                            `Lesson ${lesson.lessonNumber} Passage: ${lesson.passage!.title}`,
                            'passage',
                            lesson.id
                          );
                          soundEngine.playVictory();
                        }}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>{pp.assignPassage}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition cursor-pointer"
                >
                  {pp.returnCatalog}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('exercise');
                    resetExercise();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{pp.repeat}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
