/**
 * shareUtils.ts — Social sharing utilities for TypingBull.
 *
 * Provides:
 *  - Wordle-style emoji block text generator
 *  - URL-encoded share intents for X (Twitter), WhatsApp, and LinkedIn
 *  - Mobile vs. desktop Web Share API detection
 *  - Clipboard copy & file download helpers
 */

export interface ScoreShareData {
  wpm: number;
  accuracy: number;
  streak?: number;
  modeName?: string;
}

/**
 * Generates a Wordle-style text share representation:
 *
 * 🐂 TypingBull Speed Test
 * ⚡ 78 WPM
 * 🎯 98% Accuracy
 * 🟩🟩🟩🟩🟩🟩⬛
 * Can you beat me? typingbull.com
 */
export function generateWordleScoreText(data: ScoreShareData): string {
  const { wpm, accuracy } = data;
  const totalBlocks = 7;

  // Block calculation: blend accuracy and speed performance
  // Accuracy weight: 70%, Speed weight: 30% (capped at 90 WPM for max tier)
  const speedRatio = Math.min(1, Math.max(0, wpm / 90));
  const accuracyRatio = Math.min(1, Math.max(0, accuracy / 100));
  const compositeScore = accuracyRatio * 0.65 + speedRatio * 0.35;
  const filledBlocks = Math.max(1, Math.min(totalBlocks, Math.round(compositeScore * totalBlocks)));

  // Pick emoji tiles based on performance
  let tileEmoji = '🟩';
  if (compositeScore < 0.5) {
    tileEmoji = '🟧';
  } else if (compositeScore < 0.75) {
    tileEmoji = '🟨';
  }

  const emojiBar = tileEmoji.repeat(filledBlocks) + '⬛'.repeat(totalBlocks - filledBlocks);

  const lines = [
    '🐂 TypingBull Speed Test',
    `⚡ ${Math.round(wpm)} WPM`,
    `🎯 ${typeof accuracy === 'number' ? accuracy.toFixed(accuracy % 1 === 0 ? 0 : 1) : accuracy}% Accuracy`,
    emojiBar,
    'Can you beat me? typingbull.com',
  ];

  return lines.join('\n');
}

/**
 * Generates an X (Twitter) intent URL with prefilled text and viral hashtags.
 */
export function generateTwitterShareUrl(text: string): string {
  const baseUrl = 'https://twitter.com/intent/tweet';
  const hashtags = 'TypingBull,100DaysOfCode,TouchTyping';
  return `${baseUrl}?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
}

/**
 * Generates a WhatsApp API intent URL with prefilled text.
 */
export function generateWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Deep link to LinkedIn feed share modal with prefilled text.
 */
export function generateLinkedInShareUrl(text?: string): string {
  if (text) {
    return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
  }
  return 'https://www.linkedin.com/feed/?shareActive=true';
}

/**
 * Detects if the current client is on a mobile device (iOS or Android).
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Checks if the browser supports sharing File objects via the Native Web Share API.
 */
export function canShareFiles(files: File[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }
  if (typeof navigator.canShare === 'function') {
    try {
      return navigator.canShare({ files });
    } catch {
      return false;
    }
  }
  return isMobileDevice();
}

/**
 * Copies plain text to the user's system clipboard with robust fallbacks.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API write failed, falling back to execCommand:', err);
    }
  }

  // Fallback for older browsers / iframe contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}

/**
 * Triggers a file download in the browser for a given Blob.
 */
export function triggerFileDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
