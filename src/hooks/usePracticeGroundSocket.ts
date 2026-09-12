/**
 * Real-Time WebSocket Hook for Practice Ground
 * Manages socket connection, auto-reconnect, token restoration, and throttled streaming.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Room,
  ClientMessage,
  ServerMessage,
  RaceRankingItem,
  RoomSettings,
} from '../types/multiplayer.ts';

export type PracticeGroundPhase =
  | 'MENU'
  | 'QUEUE'
  | 'LOBBY'
  | 'COUNTDOWN'
  | 'RACING'
  | 'RESULTS';

export type SocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'ERROR';

export interface OpponentProgress {
  playerId: string;
  progress: number;
  correctChars: number;
  wpm: number;
  accuracy: number;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const SESSION_STORAGE_KEY = 'typingbull_mp_session_token';
const SAVED_NAME_KEY = 'typingbull_player_name';
const SAVED_EMOJI_KEY = 'typingbull_player_emoji';

export function usePracticeGroundSocket(initialRoomCode?: string) {
  const [status, setStatus] = useState<SocketStatus>('CONNECTING');
  const [phase, setPhase] = useState<PracticeGroundPhase>('MENU');
  const [room, setRoom] = useState<Room | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [countdownStartAt, setCountdownStartAt] = useState<number | null>(null);
  const [raceText, setRaceText] = useState<string>('');
  const [raceTextTitle, setRaceTextTitle] = useState<string>('');
  const [raceRankings, setRaceRankings] = useState<RaceRankingItem[]>([]);
  const [opponentsProgress, setOpponentsProgress] = useState<Record<string, OpponentProgress>>({});
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User Profile
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem(SAVED_NAME_KEY) || `Typist-${Math.floor(100 + Math.random() * 900)}`;
  });
  const [playerEmoji, setPlayerEmoji] = useState<string>(() => {
    return localStorage.getItem(SAVED_EMOJI_KEY) || '🐂';
  });

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgressSentRef = useRef<number>(0);
  const pendingProgressRef = useRef<{
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    wpm: number;
    accuracy: number;
    completed: boolean;
  } | null>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNotification = useCallback((type: ToastNotification['type'], message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [...prev.slice(-3), { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const savePlayerProfile = (name: string, emoji: string) => {
    setPlayerName(name);
    setPlayerEmoji(emoji);
    localStorage.setItem(SAVED_NAME_KEY, name);
    localStorage.setItem(SAVED_EMOJI_KEY, emoji);
  };

  const getWsUrl = useCallback(() => {
    // Check environment variable first
    const envUrl = import.meta.env.VITE_MULTIPLAYER_WS_URL;
    if (envUrl) return envUrl;

    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.');

    if (!isLocal) {
      // Production Cloudflare Worker WebSocket server with Durable Objects
      return 'wss://typingbull-multiplayer.rishabhrajmahato.workers.dev/practice-ground-ws';
    }

    // Local dev server WebSocket path
    const isHttps = window.location.protocol === 'https:';
    const protocol = isHttps ? 'wss://' : 'ws://';
    return `${protocol}${window.location.host}/practice-ground-ws`;
  }, []);

  const sendJson = useCallback((msg: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const handleServerMessageRef = useRef<(msg: ServerMessage) => void>(() => {});
  const connectRef = useRef<() => void>(() => {});

  // Connect & message handling
  const connect = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus((prev) => (prev === 'DISCONNECTED' ? 'RECONNECTING' : 'CONNECTING'));
    const url = getWsUrl();

    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('CONNECTED');
        reconnectAttemptsRef.current = 0;
        setErrorMessage(null);

        // Check if we have an active session token to restore
        const savedToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (savedToken && initialRoomCode) {
          ws.send(
            JSON.stringify({
              type: 'JOIN_ROOM',
              payload: {
                roomCode: initialRoomCode,
                name: playerName,
                avatarEmoji: playerEmoji,
                sessionToken: savedToken,
              },
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          handleServerMessageRef.current(msg);
        } catch (err) {
          console.error('[Practice Ground Hook] Failed to parse message:', err);
        }
      };

      ws.onclose = () => {
        setStatus('DISCONNECTED');
        socketRef.current = null;

        // Auto-reconnect with exponential backoff (max 5 attempts)
        if (reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 8000);
          reconnectAttemptsRef.current++;
          reconnectTimerRef.current = setTimeout(() => {
            connectRef.current();
          }, delay);
        } else {
          setErrorMessage('Disconnected from server. Please refresh or retry.');
        }
      };

      ws.onerror = () => {
        setStatus('ERROR');
      };
    } catch {
      setStatus('ERROR');
    }
  }, [getWsUrl, initialRoomCode, playerName, playerEmoji]);

  const handleServerMessage = useCallback((msg: ServerMessage) => {
    switch (msg.type) {
      case 'CONNECTED': {
        sessionStorage.setItem(SESSION_STORAGE_KEY, msg.payload.sessionToken);
        setMyPlayerId(msg.payload.playerId);
        break;
      }

      case 'ROOM_CREATED':
      case 'ROOM_JOINED': {
        setRoom(msg.payload.room);
        setMyPlayerId(msg.payload.myPlayerId);
        setPhase('LOBBY');
        setErrorMessage(null);
        break;
      }

      case 'ROOM_UPDATED': {
        setRoom(msg.payload.room);
        if (msg.payload.room.status === 'LOBBY' && phase !== 'LOBBY') {
          setPhase('LOBBY');
        }
        break;
      }

      case 'MATCH_SEARCHING': {
        setPhase('QUEUE');
        break;
      }

      case 'MATCH_FOUND': {
        if (msg.payload.room) {
          setRoom(msg.payload.room);
        }
        setErrorMessage(null);
        break;
      }

      case 'RACE_COUNTDOWN': {
        setCountdownStartAt(msg.payload.startAt);
        setRaceText(msg.payload.text);
        setRaceTextTitle(msg.payload.textTitle);
        setOpponentsProgress({});
        setRaceRankings([]);
        setPhase('COUNTDOWN');
        break;
      }

      case 'RACE_STARTED': {
        setPhase('RACING');
        break;
      }

      case 'PLAYER_PROGRESS': {
        const { playerId, progress, correctChars, wpm, accuracy } = msg.payload;
        setOpponentsProgress((prev) => ({
          ...prev,
          [playerId]: { playerId, progress, correctChars, wpm, accuracy },
        }));
        break;
      }

      case 'PLAYER_FINISHED': {
        addNotification(
          'info',
          `🏁 ${msg.payload.name} finished in Rank #${msg.payload.rank} with ${msg.payload.wpm} WPM!`
        );
        break;
      }

      case 'RACE_FINISHED': {
        setRaceRankings(msg.payload.rankings);
        setPhase('RESULTS');
        break;
      }

      case 'REMATCH_ACCEPTED': {
        setRoom(msg.payload.room);
        setOpponentsProgress({});
        setRaceRankings([]);
        setPhase('LOBBY');
        addNotification('success', '🔄 Rematch accepted! Ready up for the next race.');
        break;
      }

      case 'HOST_CHANGED': {
        addNotification('info', `👑 ${msg.payload.newHostName} is now the room host.`);
        break;
      }

      case 'PLAYER_DISCONNECTED': {
        addNotification(
          'warning',
          `⚠️ ${msg.payload.name} disconnected (reconnect grace period active).`
        );
        break;
      }

      case 'PLAYER_RECONNECTED': {
        addNotification('success', `⚡ ${msg.payload.name} reconnected to the race!`);
        break;
      }

      case 'ERROR': {
        setErrorMessage(msg.payload.message);
        addNotification('error', msg.payload.message);
        break;
      }
    }
  }, [phase, addNotification]);

  useEffect(() => {
    connectRef.current = connect;
    handleServerMessageRef.current = handleServerMessage;
  }, [connect, handleServerMessage]);

  // Actions
  const createRoom = (name?: string, emoji?: string, settings?: Partial<RoomSettings>) => {
    const finalName = name || playerName;
    const finalEmoji = emoji || playerEmoji;
    savePlayerProfile(finalName, finalEmoji);

    sendJson({
      type: 'CREATE_ROOM',
      payload: { name: finalName, avatarEmoji: finalEmoji, settings },
    });
  };

  const joinRoom = (code: string, name?: string, emoji?: string) => {
    const finalName = name || playerName;
    const finalEmoji = emoji || playerEmoji;
    savePlayerProfile(finalName, finalEmoji);

    sendJson({
      type: 'JOIN_ROOM',
      payload: {
        roomCode: code.toUpperCase().trim(),
        name: finalName,
        avatarEmoji: finalEmoji,
      },
    });
  };

  const findQuickMatch = (name?: string, emoji?: string, language?: string) => {
    const finalName = name || playerName;
    const finalEmoji = emoji || playerEmoji;
    savePlayerProfile(finalName, finalEmoji);

    sendJson({
      type: 'FIND_MATCH',
      payload: { name: finalName, avatarEmoji: finalEmoji, language },
    });
  };

  const cancelQuickMatch = () => {
    sendJson({ type: 'CANCEL_MATCH' });
    setPhase('MENU');
  };

  const toggleReady = (ready?: boolean) => {
    sendJson({
      type: 'TOGGLE_READY',
      payload: { ready },
    });
  };

  const startRace = () => {
    sendJson({ type: 'START_RACE' });
  };

  const sendProgress = (
    correctChars: number,
    incorrectChars: number,
    totalChars: number,
    wpm: number,
    accuracy: number,
    completed = false
  ) => {
    const now = Date.now();
    const data = { correctChars, incorrectChars, totalChars, wpm, accuracy, completed };

    // If completed, transmit immediately without throttling
    if (completed) {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
      sendJson({ type: 'PROGRESS_UPDATE', payload: data });
      lastProgressSentRef.current = now;
      return;
    }

    // Throttle progress to 100ms (10 updates per second)
    const timeSinceLast = now - lastProgressSentRef.current;
    if (timeSinceLast >= 100) {
      sendJson({ type: 'PROGRESS_UPDATE', payload: data });
      lastProgressSentRef.current = now;
    } else {
      pendingProgressRef.current = data;
      if (!throttleTimerRef.current) {
        throttleTimerRef.current = setTimeout(() => {
          if (pendingProgressRef.current) {
            sendJson({ type: 'PROGRESS_UPDATE', payload: pendingProgressRef.current });
            lastProgressSentRef.current = Date.now();
            pendingProgressRef.current = null;
          }
          throttleTimerRef.current = null;
        }, 100 - timeSinceLast);
      }
    }
  };

  const requestRematch = () => {
    sendJson({ type: 'REQUEST_REMATCH' });
  };

  const leaveRoom = () => {
    sendJson({ type: 'LEAVE_ROOM' });
    setRoom(null);
    setPhase('MENU');
    setOpponentsProgress({});
    setRaceRankings([]);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // Lifecycle
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    status,
    phase,
    setPhase,
    room,
    myPlayerId,
    playerName,
    playerEmoji,
    savePlayerProfile,
    countdownStartAt,
    raceText,
    raceTextTitle,
    raceRankings,
    opponentsProgress,
    notifications,
    errorMessage,
    setErrorMessage,
    createRoom,
    joinRoom,
    findQuickMatch,
    cancelQuickMatch,
    toggleReady,
    startRace,
    sendProgress,
    requestRematch,
    leaveRoom,
  };
}
