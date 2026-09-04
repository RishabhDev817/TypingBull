/**
 * useTypingEngine — React hook wrapper for the core TypingEngine.
 * Provides reactive state for live metrics and handles session lifecycle.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { TypingEngine, type LiveMetrics, type SessionResult } from '../engine/typingEngine';
import { saveSession } from '../engine/sessionStore';

interface UseTypingEngineOptions {
  mode: string;
  modeDetail: string;
  content?: string;
  onComplete?: (result: SessionResult) => void;
  autoSave?: boolean; // default true
}

interface UseTypingEngineReturn {
  /** Record a keystroke (call on every keypress) */
  recordKeystroke: (key: string, expected: string, isBackspace?: boolean) => void;
  /** Get current live metrics */
  metrics: LiveMetrics;
  /** Mark the session as complete */
  completeSession: () => SessionResult | null;
  /** Reset the engine for a new session */
  reset: () => void;
  /** Whether the engine has started (first keystroke) */
  isStarted: boolean;
  /** Whether the session is complete */
  isCompleted: boolean;
  /** Current streak count */
  streak: number;
  /** Max streak count */
  maxStreak: number;
  /** Force a metrics refresh */
  refreshMetrics: () => void;
}

const DEFAULT_METRICS: LiveMetrics = {
  wpm: 0,
  accuracy: 100,
  correctChars: 0,
  totalChars: 0,
  streak: 0,
  maxStreak: 0,
  backspaceCount: 0,
  elapsedMs: 0,
};

export function useTypingEngine(options: UseTypingEngineOptions): UseTypingEngineReturn {
  const { mode, modeDetail, content = '', onComplete, autoSave = true } = options;

  const engineRef = useRef<TypingEngine>(new TypingEngine(mode, modeDetail, content));
  const [metrics, setMetrics] = useState<LiveMetrics>(DEFAULT_METRICS);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start periodic metrics updates when typing begins
  const startMetricsPolling = useCallback(() => {
    if (metricsIntervalRef.current) return;
    metricsIntervalRef.current = setInterval(() => {
      const engine = engineRef.current;
      if (engine.isStarted() && !engine.isCompleted()) {
        setMetrics(engine.getLiveMetrics());
      }
    }, 250); // Update 4x per second for smooth UI
  }, []);

  const stopMetricsPolling = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopMetricsPolling();
  }, [stopMetricsPolling]);

  const recordKeystroke = useCallback((key: string, expected: string, isBackspace: boolean = false) => {
    const engine = engineRef.current;
    if (engine.isCompleted()) return;

    const wasStarted = engine.isStarted();
    engine.recordKeystroke(key, expected, isBackspace);

    if (!wasStarted && engine.isStarted()) {
      setIsStarted(true);
      startMetricsPolling();
    }

    // Update metrics immediately for responsiveness
    setMetrics(engine.getLiveMetrics());
  }, [startMetricsPolling]);

  const completeSession = useCallback((): SessionResult | null => {
    const engine = engineRef.current;
    if (engine.isCompleted() || !engine.isStarted()) return null;

    const result = engine.complete();
    setIsCompleted(true);
    setMetrics(engine.getLiveMetrics());
    stopMetricsPolling();

    if (autoSave) {
      saveSession(result);
    }

    onComplete?.(result);
    return result;
  }, [autoSave, onComplete, stopMetricsPolling]);

  const reset = useCallback(() => {
    stopMetricsPolling();
    engineRef.current = new TypingEngine(mode, modeDetail, content);
    setMetrics(DEFAULT_METRICS);
    setIsStarted(false);
    setIsCompleted(false);
  }, [mode, modeDetail, content, stopMetricsPolling]);

  const refreshMetrics = useCallback(() => {
    setMetrics(engineRef.current.getLiveMetrics());
  }, []);

  return {
    recordKeystroke,
    metrics,
    completeSession,
    reset,
    isStarted,
    isCompleted,
    streak: metrics.streak,
    maxStreak: metrics.maxStreak,
    refreshMetrics,
  };
}
