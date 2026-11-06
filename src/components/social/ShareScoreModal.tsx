import { useEffect, useRef, useState, useCallback, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, Copy, Loader2, Share2 } from 'lucide-react';
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
  const handleSocialShare = async (platform: 'WhatsApp' | 'X' | 'LinkedIn') => {
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
    }

    // Open the target window synchronously inside the click: browsers block window.open after an await.
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    try {
      // 1. Copy Wordle text to clipboard immediately
      await copyTextToClipboard(shareText);

      // 2. Generate high-resolution PNG image blob
      const blob = await generatePngBlob();
      const fileName = `typingbull-${Math.round(wpm)}wpm.png`;

      if (blob) {
        // Automatic download of image to local machine
        triggerFileDownload(blob, fileName);
      }

      showToast(`Opening ${platform}. Your card was saved and the text copied, so you can attach and paste.`);
    } catch (err) {
      console.error('Social share error:', err);
      showToast(`Redirecting to ${platform}...`);
    } finally {
      setIsGenerating(null);
    }
  };

  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [cardH, setCardH] = useState(0);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Dialog behaviour: focus moves in, Tab stays inside, Escape closes, focus returns to the opener
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey, true);
      previous?.focus?.();
    };
  }, [isOpen, onClose]);

  // Scale the fixed-width (460px) card to whatever width the dialog has, so it never clips on phones
  useEffect(() => {
    if (!isOpen) return;
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      setScale(Math.min(1, stage.clientWidth / 460));
      setCardH(cardRef.current?.offsetHeight ?? 0);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    const t = window.setTimeout(update, 150);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [isOpen]);

  /** Main action: native share sheet with the card image where available, otherwise save the PNG. */
  const handlePrimary = async () => {
    soundEngine.playPop();
    setIsGenerating('primary');
    try {
      const blob = await generatePngBlob();
      const fileName = `typingbull-${Math.round(wpm)}wpm.png`;
      if (blob && canNativeShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        try {
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title: 'My TypingBull result', text: wordleText, files: [file] });
          } else {
            await navigator.share({ title: 'My TypingBull result', text: wordleText });
          }
          return;
        } catch (err) {
          if ((err as Error)?.name === 'AbortError') return;
        }
      }
      if (blob) {
        triggerFileDownload(blob, fileName);
        showToast('Card saved to your downloads.');
      } else {
        showToast('Could not make the image. Please try again.');
      }
    } finally {
      setIsGenerating(null);
    }
  };

  const secondary = 'flex items-center justify-center gap-2 min-h-11 px-3 rounded-2xl text-sm font-bold text-slate-100 border border-slate-600 hover:border-purple-400 hover:bg-white/5 transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-slate-900/95 border border-slate-700/70 p-4 sm:p-7 shadow-2xl flex flex-col items-center my-auto"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-purple-400"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="text-center mb-4 pr-6 pl-6">
              <h2 id="share-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Show your speed
              </h2>
              <p className="text-sm text-slate-300 mt-1 font-semibold">Save the card or send it to a friend.</p>
            </div>

            {/* Card preview, scaled to fit the dialog */}
            <div ref={stageRef} className="w-full mb-5 flex justify-center">
              <div style={{ width: 460 * scale, height: cardH ? cardH * scale : undefined }}>
                <div style={{ width: 460, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <button
                type="button"
                data-autofocus
                disabled={Boolean(isGenerating)}
                onClick={handlePrimary}
                className="w-full inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-base font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                {isGenerating === 'primary' ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : canNativeShare ? (
                  <Share2 size={18} aria-hidden="true" />
                ) : (
                  <Download size={18} aria-hidden="true" />
                )}
                {canNativeShare ? 'Share card' : 'Save card (PNG)'}
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  className={secondary}
                  onClick={async () => {
                    soundEngine.playPop();
                    const ok = await copyTextToClipboard(wordleText);
                    showToast(ok ? 'Score text copied.' : 'Could not copy. Select the text manually.');
                  }}
                >
                  <Copy size={16} aria-hidden="true" /> Copy text
                </button>
                <button type="button" disabled={Boolean(isGenerating)} onClick={() => handleSocialShare('WhatsApp')} className={secondary}>
                  {isGenerating === 'WhatsApp' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <WhatsAppIcon />} WhatsApp
                </button>
                <button type="button" disabled={Boolean(isGenerating)} onClick={() => handleSocialShare('X')} className={secondary}>
                  {isGenerating === 'X' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <XIcon />} X
                </button>
                <button type="button" disabled={Boolean(isGenerating)} onClick={() => handleSocialShare('LinkedIn')} className={secondary}>
                  {isGenerating === 'LinkedIn' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <LinkedInIcon />} LinkedIn
                </button>
              </div>
            </div>

            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mt-4 w-full p-3 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-100">
                    <Check size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>{toastMessage}</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss message"
                    onClick={() => setToastMessage(null)}
                    className="text-slate-300 hover:text-white cursor-pointer p-2"
                  >
                    <X size={14} aria-hidden="true" />
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
