/**
 * Core Typing Engine — the single source of truth for all typing analytics.
 * Instantiate per session. Every mode (Learn, Play, Practice) plugs into this.
 */

export interface Keystroke {
  key: string;           // The character the user typed
  expected: string;      // The character that was expected
  correct: boolean;      // Whether key === expected
  timestamp: number;     // Date.now() at the moment of keypress
  isBackspace: boolean;  // Whether this was a backspace
}

/** A 30-second WPM window for stamina analysis. */
export interface WpmWindow {
  windowIndex: number;   // 0-based index (0 = first 30s)
  wpm: number;           // WPM for this window
  correctChars: number;  // Correct chars typed in this window
}

export interface SessionResult {
  id: string;
  mode: string;                    // 'lesson' | 'practice' | 'game'
  modeDetail: string;              // e.g., 'lesson-3', 'developer-30s', 'stellar-dash'
  startTime: number;
  endTime: number;
  durationMs: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  backspaceCount: number;
  wpm: number;
  accuracy: number;                // 0–100
  perKeyErrors: Record<string, number>;    // { 'r': 5, 't': 3 }
  perKeyTotal: Record<string, number>;     // { 'r': 20, 't': 15 }
  bigramErrors: Record<string, number>;    // { 'th': 2, 'er': 1 }
  bigramTotal: Record<string, number>;
  pauseCount: number;              // Gaps > 2s between keystrokes
  avgPausePerKey: Record<string, number>;  // Average delay before each key
  starsEarned: number;             // 0-3 based on accuracy thresholds
  content: string;                 // What the user was typing
  wpmWindows: WpmWindow[];         // 30-second WPM buckets for stamina analysis
}

export interface LiveMetrics {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  streak: number;
  maxStreak: number;
  backspaceCount: number;
  elapsedMs: number;
}

const PAUSE_THRESHOLD_MS = 2000;
const WPM_WINDOW_MS = 30_000; // 30-second windows for stamina tracking

export class TypingEngine {
  private keystrokes: Keystroke[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private started: boolean = false;
  private completed: boolean = false;

  // Live counters
  private correctCount: number = 0;
  private incorrectCount: number = 0;
  private backspaceCount: number = 0;
  private pauseCount: number = 0;
  private currentStreak: number = 0;
  private maxStreak: number = 0;

  // Per-key tracking
  private perKeyErrors: Record<string, number> = {};
  private perKeyTotal: Record<string, number> = {};
  private perKeyTimestamps: Record<string, number[]> = {};

  // Bigram tracking
  private bigramErrors: Record<string, number> = {};
  private bigramTotal: Record<string, number> = {};
  private lastExpectedChar: string = '';

  // WPM window tracking (stamina)
  private currentWindowIndex: number = 0;
  private currentWindowCorrectChars: number = 0;
  private closedWindows: WpmWindow[] = [];

  // Mode metadata
  private mode: string;
  private modeDetail: string;
  private content: string;

  constructor(mode: string, modeDetail: string, content: string = '') {
    this.mode = mode;
    this.modeDetail = modeDetail;
    this.content = content;
  }

  /**
   * Record a keystroke. Call this for every keypress (including backspace).
   */
  recordKeystroke(key: string, expected: string, isBackspace: boolean = false): void {
    const now = Date.now();

    // Auto-start on first keystroke
    if (!this.started) {
      this.startTime = now;
      this.started = true;
    }

    if (this.completed) return;

    // ── WPM window tracking ──
    // Determine which 30-second window this keystroke belongs to
    const elapsedMs = now - this.startTime;
    const windowIndex = Math.floor(elapsedMs / WPM_WINDOW_MS);

    // Close any windows between the last tracked one and the current one
    while (this.currentWindowIndex < windowIndex) {
      const windowDurationMin = WPM_WINDOW_MS / 60000; // 0.5 min
      this.closedWindows.push({
        windowIndex: this.currentWindowIndex,
        wpm: Math.round((this.currentWindowCorrectChars / 5) / windowDurationMin),
        correctChars: this.currentWindowCorrectChars,
      });
      this.currentWindowIndex++;
      this.currentWindowCorrectChars = 0;
    }

    // Detect pauses
    if (this.keystrokes.length > 0) {
      const lastTimestamp = this.keystrokes[this.keystrokes.length - 1].timestamp;
      if (now - lastTimestamp > PAUSE_THRESHOLD_MS) {
        this.pauseCount++;
      }
    }

    if (isBackspace) {
      this.backspaceCount++;
      this.keystrokes.push({ key, expected: '', correct: false, timestamp: now, isBackspace: true });
      return;
    }

    const correct = key === expected;

    this.keystrokes.push({ key, expected, correct, timestamp: now, isBackspace: false });

    // Update counters
    if (correct) {
      this.correctCount++;
      this.currentWindowCorrectChars++;
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }
    } else {
      this.incorrectCount++;
      this.currentStreak = 0;
    }

    // Per-key tracking (track the expected key, not what was typed)
    const lowerExpected = expected.toLowerCase();
    if (lowerExpected && /^[a-z0-9;',./\[\]\\=\-`]$/.test(lowerExpected)) {
      this.perKeyTotal[lowerExpected] = (this.perKeyTotal[lowerExpected] || 0) + 1;
      if (!correct) {
        this.perKeyErrors[lowerExpected] = (this.perKeyErrors[lowerExpected] || 0) + 1;
      }

      // Track timing per key
      if (!this.perKeyTimestamps[lowerExpected]) {
        this.perKeyTimestamps[lowerExpected] = [];
      }
      if (this.keystrokes.length > 1) {
        const prevTimestamp = this.keystrokes[this.keystrokes.length - 2].timestamp;
        this.perKeyTimestamps[lowerExpected].push(now - prevTimestamp);
      }
    }

    // Bigram tracking
    if (this.lastExpectedChar && lowerExpected) {
      const bigram = this.lastExpectedChar + lowerExpected;
      if (bigram.length === 2) {
        this.bigramTotal[bigram] = (this.bigramTotal[bigram] || 0) + 1;
        if (!correct) {
          this.bigramErrors[bigram] = (this.bigramErrors[bigram] || 0) + 1;
        }
      }
    }
    this.lastExpectedChar = lowerExpected;
  }

  /**
   * Get live metrics for UI display
   */
  getLiveMetrics(): LiveMetrics {
    const now = Date.now();
    const elapsedMs = this.started ? now - this.startTime : 0;
    const elapsedMinutes = elapsedMs / 60000;
    const totalChars = this.correctCount + this.incorrectCount;

    return {
      wpm: elapsedMinutes > 0 ? Math.round((this.correctCount / 5) / elapsedMinutes) : 0,
      accuracy: totalChars > 0 ? Math.round((this.correctCount / totalChars) * 1000) / 10 : 100,
      correctChars: this.correctCount,
      totalChars,
      streak: this.currentStreak,
      maxStreak: this.maxStreak,
      backspaceCount: this.backspaceCount,
      elapsedMs,
    };
  }

  /**
   * Get current streak count
   */
  getStreak(): number {
    return this.currentStreak;
  }

  /**
   * Get max streak count
   */
  getMaxStreak(): number {
    return this.maxStreak;
  }

  /**
   * Mark the session as complete and freeze all metrics.
   */
  complete(): SessionResult {
    this.endTime = Date.now();
    this.completed = true;

    const durationMs = this.endTime - this.startTime;
    const durationMinutes = durationMs / 60000;
    const totalChars = this.correctCount + this.incorrectCount;
    const wpm = durationMinutes > 0 ? Math.round((this.correctCount / 5) / durationMinutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((this.correctCount / totalChars) * 1000) / 10 : 100;

    // Compute average pause per key
    const avgPausePerKey: Record<string, number> = {};
    for (const [key, times] of Object.entries(this.perKeyTimestamps)) {
      if (times.length > 0) {
        avgPausePerKey[key] = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      }
    }

    // Calculate stars
    let starsEarned = 0;
    if (accuracy >= 90) starsEarned = 1;
    if (accuracy >= 95) starsEarned = 2;
    if (accuracy >= 98) starsEarned = 3;

    // Finalize WPM windows — close the last open window
    const finalWindows = [...this.closedWindows];
    if (this.currentWindowCorrectChars > 0 || this.closedWindows.length > 0) {
      // Calculate duration of the last (partial) window
      const lastWindowStartMs = this.currentWindowIndex * WPM_WINDOW_MS;
      const lastWindowDurationMs = Math.max(1, durationMs - lastWindowStartMs);
      const lastWindowDurationMin = lastWindowDurationMs / 60000;
      finalWindows.push({
        windowIndex: this.currentWindowIndex,
        wpm: lastWindowDurationMin > 0
          ? Math.round((this.currentWindowCorrectChars / 5) / lastWindowDurationMin)
          : 0,
        correctChars: this.currentWindowCorrectChars,
      });
    }

    return {
      id: `session_${this.startTime}_${Math.random().toString(36).slice(2, 8)}`,
      mode: this.mode,
      modeDetail: this.modeDetail,
      startTime: this.startTime,
      endTime: this.endTime,
      durationMs,
      totalKeystrokes: this.keystrokes.length,
      correctKeystrokes: this.correctCount,
      incorrectKeystrokes: this.incorrectCount,
      backspaceCount: this.backspaceCount,
      wpm,
      accuracy,
      perKeyErrors: { ...this.perKeyErrors },
      perKeyTotal: { ...this.perKeyTotal },
      bigramErrors: { ...this.bigramErrors },
      bigramTotal: { ...this.bigramTotal },
      pauseCount: this.pauseCount,
      avgPausePerKey,
      starsEarned,
      content: this.content,
      wpmWindows: finalWindows,
    };
  }

  /**
   * Reset the engine for a new session with the same config.
   */
  reset(): void {
    this.keystrokes = [];
    this.startTime = 0;
    this.endTime = 0;
    this.started = false;
    this.completed = false;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.backspaceCount = 0;
    this.pauseCount = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.perKeyErrors = {};
    this.perKeyTotal = {};
    this.perKeyTimestamps = {};
    this.bigramErrors = {};
    this.bigramTotal = {};
    this.lastExpectedChar = '';
    this.currentWindowIndex = 0;
    this.currentWindowCorrectChars = 0;
    this.closedWindows = [];
  }

  /** Whether the engine has been started (first keystroke received) */
  isStarted(): boolean {
    return this.started;
  }

  /** Whether the session has been marked complete */
  isCompleted(): boolean {
    return this.completed;
  }
}
