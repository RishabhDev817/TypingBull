import { useRef, useState, useCallback, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, Copy, Loader2, Sparkles } from 'lucide-react';
import { toBlob } from 'html-to-image';
import { SocialScoreCard } from './SocialScoreCard';
import {
  generateWordleScoreText,
  generateTwitterShareUrl,
  generateWhatsAppShareUrl,
  generateLinkedInShareUrl,
  copyTextToClipboard,
  triggerFileDownload,
  type ScoreShareData,
} from '../../utils/shareUtils';
import { soundEngine } from '../../utils/audio';

export interface ShareScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  wpm: number;
  accuracy: number;
  streak?: number;
  modeName?: string;
  rankTitle?: string;
}

// ─── Branded SVG Icons ──────────────────────────────────────────────

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const XIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.85-.38-4.09-1.1l-.29-.17-3.12.82.83-3.04-.19-.3a8.216 8.216 0 0 1-1.26-4.45c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06s-1.05-.39-2-1.23c-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 1.71.74 2.38.81 3.23.68.52-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);

export const ShareScoreModal: FC<ShareScoreModalProps> = ({
  isOpen,
  onClose,
  wpm,
  accuracy,
  streak,
  modeName,
  rankTitle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  }, []);

  const shareData: ScoreShareData = {
    wpm,
    accuracy,
    streak,
    modeName,
  };

  const wordleText = generateWordleScoreText(shareData);

  /**
   * Waits for all custom web fonts to be fully loaded and rendered
   * before triggering canvas snapshot, preventing miscalculated text dimensions.
   */
  const waitForDocumentFonts = async () => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await document.fonts.ready;
      } catch (err) {
        console.warn('document.fonts.ready warning:', err);
      }
    }
    // Brief layout settle delay
    await new Promise((resolve) => setTimeout(resolve, 50));
  };

  /**
   * Generates a high-quality PNG blob from the card DOM element.
   */
  const generatePngBlob = async (): Promise<Blob | null> => {
    const el = cardRef.current;
    if (!el) return null;

    try {
      // 4. Await Font Loading
      await waitForDocumentFonts();

      // 5. Optimize the Canvas Configuration
      // Lock exact capture dimensions to the element's actual scroll dimensions
      const captureWidth = el.scrollWidth || 460;
      const captureHeight = el.scrollHeight || 460;
      const pixelRatio = 3; // High-resolution 3x export scale

      const blob = await toBlob(el, {
        width: captureWidth,
        height: captureHeight,
        canvasWidth: captureWidth * pixelRatio,
        canvasHeight: captureHeight * pixelRatio,
        pixelRatio,
        cacheBust: true,
        includeQueryParams: true,
        backgroundColor: '#0B0F19', // Hardcoded exact dark background
      });
      return blob;
    } catch (err) {
      console.error('Failed to generate PNG blob:', err);
      return null;
    }
  };

  /**
   * Handles "Download Image" action.
   */
  const handleDownloadImage = async () => {
    soundEngine.playPop();
    setIsGenerating('download');
    try {
      const blob = await generatePngBlob();
      if (blob) {
        triggerFileDownload(blob, `typingbull-${Math.round(wpm)}wpm.png`);
        showToast('🎉 Social card image downloaded successfully!');
      } else {
        showToast('⚠️ Could not generate image. Please try again.');
      }
    } finally {
      setIsGenerating(null);
    }
  };

  /**
   * Universal Image + Text Social Share Engine
   * Handles: WhatsApp, X (Twitter), Instagram, and LinkedIn.
   *
   * Mobile (iOS/Android):
   *   Uses navigator.share with the File object and text caption to open
   *   the OS native share sheet, allowing direct sharing into the app.
   *
   * Desktop (macOS/Windows/Linux):
   *   Downloads the high-resolution score card PNG, copies the formatted
   *   Wordle-style emoji text to clipboard, shows a platform-specific toast,
   *   and seamlessly opens the platform's composer in a new tab.
   */
  const handleSocialShare = async (platform: 'WhatsApp' | 'X' | 'Instagram' | 'LinkedIn') => {
    soundEngine.playPop();
    setIsGenerating(platform);

    const shareText = generateWordleScoreText(shareData);

    // Resolve target platform URL
    let targetUrl = '';
    if (platform === 'X') {
      targetUrl = generateTwitterShareUrl(shareText);
    } else if (platform === 'WhatsApp') {
      targetUrl = generateWhatsAppShareUrl(shareText);
    } else if (platform === 'LinkedIn') {
      targetUrl = generateLinkedInShareUrl(shareText);
    } else if (platform === 'Instagram') {
      targetUrl = 'https://www.instagram.com/';
    }

    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ─── CRITICAL: Open target window synchronously in the user click event ───
    // Modern browsers silently block window.open() if executed after an async await.
    // Opening it synchronously right here guarantees immediate redirection without popup blocking!
    if (!isMobile || platform !== 'Instagram') {
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }

    try {
      // 1. Copy Wordle text to clipboard immediately
      await copyTextToClipboard(shareText);

      // 2. Generate high-resolution PNG image blob
      const blob = await generatePngBlob();
      const fileName = `typingbull-${Math.round(wpm)}wpm.png`;

      if (blob) {
        const imageFile = new File([blob], fileName, { type: 'image/png' });

        // On mobile Instagram, launch native share sheet with file so user can post image to story/feed
        if (isMobile && platform === 'Instagram' && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
          try {
            await navigator.share({
              title: 'TypingBull Score',
              text: shareText,
              files: [imageFile],
            });
            showToast('🚀 Shared successfully to Instagram!');
            return;
          } catch (shareErr: any) {
            if (shareErr.name !== 'AbortError') {
              window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
            }
            return;
          }
        }

        // Automatic download of image to local machine
        triggerFileDownload(blob, fileName);
      }

      showToast(`✨ Redirecting to ${platform}! Image saved & text copied to clipboard.`);
    } catch (err) {
      console.error('Social share error:', err);
      showToast(`Redirecting to ${platform}...`);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-slate-900/90 border border-slate-700/70 p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col items-center my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                <span>Viral Score Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Share Your Typing Mastery 🚀
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Export an ultra-high-res glassmorphic social card and viral Wordle-style score text.
              </p>
            </div>

            {/* Social Card Preview Container */}
            <div className="w-full flex justify-center mb-6 overflow-hidden rounded-3xl p-1 bg-gradient-to-b from-white/10 to-transparent">
              <div className="transform scale-[0.85] sm:scale-100 origin-center transition-transform">
                <SocialScoreCard
                  ref={cardRef}
                  wpm={wpm}
                  accuracy={accuracy}
                  streak={streak}
                  modeName={modeName}
                  rankTitle={rankTitle}
                />
              </div>
            </div>

            {/* Action Buttons Grid (5 Branded Buttons) */}
            <div className="w-full flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Share to LinkedIn */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={Boolean(isGenerating)}
                  onClick={() => handleSocialShare('LinkedIn')}
                  className="relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-white font-extrabold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
                    boxShadow: '0 4px 14px rgba(10, 102, 194, 0.4)',
                  }}
                >
                  {isGenerating === 'LinkedIn' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <LinkedInIcon />
                  )}
                  <span>Share to LinkedIn</span>
                </motion.button>

                {/* 2. Share to Instagram */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={Boolean(isGenerating)}
                  onClick={() => handleSocialShare('Instagram')}
                  className="relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-white font-extrabold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
                  style={{
                    background:
                      'linear-gradient(45deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
                    boxShadow: '0 4px 14px rgba(253, 29, 29, 0.35)',
                  }}
                >
                  {isGenerating === 'Instagram' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <InstagramIcon />
                  )}
                  <span>Share to Instagram</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 3. Share to X (Twitter) */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={Boolean(isGenerating)}
                  onClick={() => handleSocialShare('X')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-white font-extrabold text-sm bg-black hover:bg-slate-950 border border-white/20 transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isGenerating === 'X' ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <XIcon />
                  )}
                  <span>Share to X</span>
                </motion.button>

                {/* 4. Share to WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={Boolean(isGenerating)}
                  onClick={() => handleSocialShare('WhatsApp')}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-white font-extrabold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  {isGenerating === 'WhatsApp' ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <WhatsAppIcon />
                  )}
                  <span>Share to WhatsApp</span>
                </motion.button>
              </div>

              {/* 5. Download Image Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={Boolean(isGenerating)}
                onClick={handleDownloadImage}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-slate-200 hover:text-white font-extrabold text-sm bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-lg transition-all shadow-sm cursor-pointer disabled:opacity-60 mt-1"
              >
                {isGenerating === 'download' ? (
                  <Loader2 size={18} className="animate-spin text-emerald-400" />
                ) : (
                  <Download size={18} className="text-emerald-400" />
                )}
                <span>Download High-Res Card (PNG)</span>
              </motion.button>

              {/* Quick Copy Wordle Text Utility */}
              <button
                onClick={async () => {
                  soundEngine.playPop();
                  await copyTextToClipboard(wordleText);
                  showToast('📋 Wordle-style score text copied to clipboard!');
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 pt-1 cursor-pointer"
              >
                <Copy size={12} />
                <span>Copy Wordle Text to Clipboard</span>
              </button>
            </div>

            {/* Live Floating Toast Notification */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="mt-4 w-full p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-3 text-left backdrop-blur-lg"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-200">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                  </div>
                  <button
                    onClick={() => setToastMessage(null)}
                    className="text-slate-400 hover:text-white cursor-pointer text-xs p-1"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
