import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, Sparkles, Send, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import {
  type FeedbackType,
  type FeedbackPriority,
  getTypingMetadata,
  saveLocalFeedback,
  type FeedbackSubmission,
} from '../../engine/feedbackStore';
import { Mascot } from '../Mascot';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: FeedbackType;
  contextTag?: string;
}

const FEEDBACK_TYPES: { id: FeedbackType; label: string; icon: string }[] = [
  { id: 'feature_request', label: 'Feature Request', icon: '💡' },
  { id: 'bug_report', label: 'Bug Report', icon: '🐛' },
  { id: 'improvement', label: 'Improvement', icon: '🎯' },
  { id: 'general', label: 'General Feedback', icon: '❤️' },
];

const USE_CASES = [
  'SSC / Government Exams',
  'RRB / Railway Exams',
  'Banking Exams',
  'College / Student',
  'Coding / Programming',
  'Improve Typing Speed',
  'Just for Fun',
  'Other',
];

const PRIORITIES: { id: FeedbackPriority; label: string; icon: string; border: string; bg: string }[] = [
  { id: 'nice_to_have', label: 'Nice to have', icon: '🟢', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  { id: 'really_help', label: 'Would really help', icon: '🟡', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { id: 'need_this', label: 'I really need this', icon: '🔴', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  initialType = 'feature_request',
  contextTag,
}) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(initialType);
  const [message, setMessage] = useState('');
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [priority, setPriority] = useState<FeedbackPriority>('really_help');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial type when opened
  useEffect(() => {
    if (isOpen) {
      setFeedbackType(initialType);
      setIsSuccess(false);
      setErrorMessage(null);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, initialType]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Track analytics event helper
  const trackAnalytics = (event: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', event, params);
    }
  };

  const handleTypeSelect = (type: FeedbackType) => {
    soundEngine.playPop();
    setFeedbackType(type);
    trackAnalytics('feedback_type_selected', { feedback_type: type });
  };

  const toggleUseCase = (useCase: string) => {
    soundEngine.playPop();
    setSelectedUseCases((prev) =>
      prev.includes(useCase) ? prev.filter((item) => item !== useCase) : [...prev, useCase]
    );
  };

  const handleRatingSelect = (stars: number) => {
    soundEngine.playPop();
    setRating(stars);
    trackAnalytics('rating_submitted', { stars });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setErrorMessage('Please enter your feedback or suggestion.');
      textareaRef.current?.focus();
      return;
    }

    if (trimmedMessage.length > 1000) {
      setErrorMessage('Feedback must be 1000 characters or fewer.');
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address or leave it blank.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const metadata = getTypingMetadata();
    if (contextTag) {
      (metadata as any).contextTag = contextTag;
    }

    const submission: FeedbackSubmission = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      feedbackType,
      message: trimmedMessage,
      useCase: selectedUseCases,
      priority,
      rating,
      ratingComment: ratingComment.trim() || undefined,
      email: trimmedEmail || undefined,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      votes: 0,
      metadata,
    };

    try {
      // 1. Send to serverless backend endpoint (/api/feedback)
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.warn('[Feedback API Response]:', errorData);
      }
    } catch (netErr) {
      console.warn('[Feedback Network Warning]: Failed to reach server, preserving locally:', netErr);
    }

    // 2. Always persist to localStorage so zero feedback is lost
    saveLocalFeedback(submission);

    // 3. Analytics
    trackAnalytics('feedback_submitted', {
      feedback_type: feedbackType,
      priority,
      rating: rating ?? undefined,
      has_email: !!trimmedEmail,
      use_case_count: selectedUseCases.length,
    });

    soundEngine.playStarEarn();
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    soundEngine.playPop();
    setMessage('');
    setSelectedUseCases([]);
    setEmail('');
    setRating(null);
    setRatingComment('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
          onClick={() => {
            if (!isSubmitting) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.94, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-gradient-to-b from-slate-50/70 to-transparent dark:from-slate-800/40">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  onClose();
                }}
                disabled={isSubmitting}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                title="Close modal"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-400/15 border border-purple-500/25 flex items-center justify-center shrink-0">
                  <Mascot mood={isSuccess ? 'cheering' : 'happy'} size="xs" />
                </div>
                <div>
                  <h2
                    id="feedback-title"
                    className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
                  >
                    Help Us Make TypingBull Better 💡
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Tell us what you love, what needs improvement, or what you'd like us to build next.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {isSuccess ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Thank you! 🐂❤️</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Your feedback helps us make TypingBull better.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      We read every single suggestion and prioritize future updates based directly on learner requests.
                    </p>
                  </div>
                  <button
                    onClick={handleResetAndClose}
                    className="mt-4 px-8 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Feedback Type Chips */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {FEEDBACK_TYPES.map(({ id, label, icon }) => {
                        const isSelected = feedbackType === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleTypeSelect(id)}
                            className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-purple-500/15 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <span className="text-base leading-none">{icon}</span>
                            <span className="truncate">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Main Feedback Question */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="feedback-message"
                        className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                      >
                        What would you like to see in TypingBull? <span className="text-rose-500">*</span>
                      </label>
                      <span
                        className={`text-[10px] font-bold ${
                          message.length > 900 ? 'text-amber-500' : 'text-slate-400'
                        }`}
                      >
                        {message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      id="feedback-message"
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                      placeholder="Tell us what you need, what is missing, or what would make TypingBull more useful for you..."
                      rows={4}
                      required
                      className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all resize-y min-h-[96px]"
                    />
                  </div>

                  {/* 3. User Context (What do you use TypingBull for?) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      What do you use TypingBull for?{' '}
                      <span className="text-[10px] lowercase text-slate-400 font-medium">(optional, multi-select)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {USE_CASES.map((useCase) => {
                        const isChecked = selectedUseCases.includes(useCase);
                        return (
                          <button
                            key={useCase}
                            type="button"
                            onClick={() => toggleUseCase(useCase)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-primary/15 border-primary text-primary dark:text-purple-300 shadow-2xs'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {isChecked ? '✓ ' : '+ '}
                            {useCase}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Feature Priority */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      How important is this to you?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PRIORITIES.map(({ id, label, icon, border, bg }) => {
                        const isSelected = priority === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              soundEngine.playPop();
                              setPriority(id);
                            }}
                            className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                              isSelected
                                ? `${bg} ${border} text-slate-900 dark:text-white shadow-2xs ring-1 ring-primary/40`
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <span>{icon}</span>
                            <span className="truncate">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Rating & Review Section (Optional) */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        How would you rate your experience with TypingBull?
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating !== null ? hoverRating : rating || 0) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingSelect(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 text-slate-300 dark:text-slate-600 hover:scale-125 transition-transform cursor-pointer"
                              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                size={18}
                                className={
                                  isFilled
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300 dark:text-slate-600'
                                }
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {rating !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-1"
                      >
                        <input
                          type="text"
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value.slice(0, 300))}
                          placeholder="What made you give this rating? (optional)"
                          className="w-full rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* 6. Email (Optional) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="feedback-email"
                      className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Email (optional)
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email if you'd like us to follow up"
                      className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold"
                    >
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button & Auto-context Note */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Sparkles size={12} className="text-purple-400" />
                      <span>Typing stats attached automatically</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-primary hover:bg-primary-hover active:scale-95 text-white font-black text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Send Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default FeedbackModal;
