import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle, MapPin, Clock } from 'lucide-react';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { soundEngine } from '../utils/audio';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Feedback & Suggestions',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    soundEngine.playPop();
    setIsSubmitting(true);

    // Simulate sending contact form message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundEngine.playStarEarn();
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/25 dark:border-pink-400/25 text-pink-600 dark:text-pink-300 text-xs font-black uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>We'd Love To Hear From You</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Contact & Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
              Have feedback, discovered a bug, or want to bring TypingBull to your classroom? Drop us a note below!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-4">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Direct Inquiries
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-0.5">
                      Support & Help
                    </span>
                    <a
                      href="mailto:support@typingbull.com"
                      className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 transition-colors"
                    >
                      support@typingbull.com
                    </a>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 block mb-0.5">
                      Feedback & Ideas
                    </span>
                    <a
                      href="mailto:feedback@typingbull.com"
                      className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-pink-600 transition-colors"
                    >
                      feedback@typingbull.com
                    </a>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      Privacy & Legal
                    </span>
                    <a
                      href="mailto:privacy@typingbull.com"
                      className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition-colors"
                    >
                      privacy@typingbull.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours & Response Times */}
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Response Time: Typically within 24–48 hours</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Distributed globally with ❤️ for learners everywhere</span>
                </div>
              </div>

              {/* FAQ banner */}
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black">
                  <HelpCircle className="w-4 h-4" />
                  <span>Looking for quick answers?</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Check out our complete 15-question Knowledge Base covering WPM calculation, weak keys, and gameplay tips.
                </p>
                <a
                  href="/#faq-section-title"
                  className="inline-flex items-center gap-1 font-black text-purple-600 dark:text-purple-400 hover:underline pt-1"
                >
                  <span>Browse FAQs &rarr;</span>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-md">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        Message Sent! 🚀
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out, <strong>{formData.name}</strong>! Our typing team has received your note and will get back to you shortly.
                      </p>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', category: 'Feedback & Suggestions', message: '' });
                        }}
                        className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-purple-600 hover:bg-purple-500 transition-all cursor-pointer shadow-md"
                      >
                        Send Another Note
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="border-b border-slate-200/80 dark:border-slate-700/80 pb-3 mb-4">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          Send Us a Message
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                          Fill in your details and we'll reply directly to your email inbox.
                        </p>
                      </div>

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Alex Smith"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@example.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Category selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                          Topic / Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                          <option value="Feedback & Suggestions">💡 Feedback & Feature Suggestions</option>
                          <option value="Bug Report">🐛 Bug Report or Technical Issue</option>
                          <option value="Curriculum & Lessons">📚 Lesson / Practice Content Request</option>
                          <option value="School & Classroom">🏫 Classroom / School Deployment</option>
                          <option value="General Question">❓ General Inquiry</option>
                        </select>
                      </div>

                      {/* Message textarea */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                          Your Message *
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us what's on your mind..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                      </div>

                      {/* Submit button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>Sending message...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ContactPage;
