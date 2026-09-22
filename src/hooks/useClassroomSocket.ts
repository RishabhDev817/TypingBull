/**
 * Real-Time WebSocket Hook for TypingBull Classroom
 * Manages socket connection, room state, automatic reconnect, session token restoration,
 * and throttled student telemetry streaming.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ClassroomRoomView,
  ClassroomRole,
  SocketStatus,
  ClassroomSettings,
  ClassroomResultsView,
  ClientMessage,
  ServerMessage,
  StudentProgressUpdate,
  StudentFinishPayload,
} from '../types/classroom.ts';

const SESSION_TOKEN_KEY = 'typingbull_cr_session_token';
const ROOM_CODE_KEY = 'typingbull_cr_room_code';
const ROLE_KEY = 'typingbull_cr_role';
const TEACHER_TOKEN_KEY = 'typingbull_cr_teacher_token';
const STUDENT_NAME_KEY = 'typingbull_cr_student_name';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function useClassroomSocket(initialRoomCode?: string) {
  const [status, setStatus] = useState<SocketStatus>('CONNECTING');
  const [role, setRole] = useState<ClassroomRole | null>(() => {
    return (sessionStorage.getItem(ROLE_KEY) as ClassroomRole) || null;
  });
  const [roomCode, setRoomCode] = useState<string>(() => {
    return initialRoomCode || sessionStorage.getItem(ROOM_CODE_KEY) || '';
  });
  const [room, setRoom] = useState<ClassroomRoomView | null>(null);
  const [myStudentId, setMyStudentId] = useState<string>('');
  const [teacherToken, setTeacherToken] = useState<string>(() => {
    return sessionStorage.getItem(TEACHER_TOKEN_KEY) || '';
  });
  const [studentName, setStudentName] = useState<string>(() => {
    return sessionStorage.getItem(STUDENT_NAME_KEY) || '';
  });
  const [countdownStartAt, setCountdownStartAt] = useState<number | null>(null);
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(null);
  const [sessionEndAt, setSessionEndAt] = useState<number | null>(null);
  const [sessionResults, setSessionResults] = useState<ClassroomResultsView | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Throttled progress buffer
  const lastProgressSentRef = useRef<number>(0);
  const pendingProgressRef = useRef<StudentProgressUpdate | null>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNotification = useCallback((type: ToastNotification['type'], message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [...prev.slice(-2), { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const getWsUrl = useCallback(() => {
    const envUrl = import.meta.env.VITE_CLASSROOM_WS_URL;
    if (envUrl) return envUrl;

    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.');

    if (!isLocal) {
      // In production, can use dedicated classroom websocket route or worker
      return `wss://${window.location.host}/classroom-ws`;
    }

    const isHttps = window.location.protocol === 'https:';
    const protocol = isHttps ? 'wss://' : 'ws://';
    return `${protocol}${window.location.host}/classroom-ws`;
  }, []);

  const sendJson = useCallback((msg: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // Server message dispatcher
  const handleServerMessage = useCallback(
    (msg: ServerMessage) => {
      switch (msg.type) {
        case 'CONNECTED': {
          sessionStorage.setItem(SESSION_TOKEN_KEY, msg.payload.sessionToken);
          // Try auto-reconnect if session details exist
          const savedCode = sessionStorage.getItem(ROOM_CODE_KEY);
          const savedRole = sessionStorage.getItem(ROLE_KEY) as ClassroomRole;
          if (savedCode && savedRole) {
            sendJson({
              type: 'RECONNECT',
              payload: {
                sessionToken: msg.payload.sessionToken,
                code: savedCode,
                role: savedRole,
              },
            });
          }
          break;
        }

        case 'CLASSROOM_CREATED': {
          const { code, teacherToken: tToken, room: roomView } = msg.payload;
          setRole('teacher');
          setRoomCode(code);
          setTeacherToken(tToken);
          setRoom(roomView);
          setErrorMessage(null);

          sessionStorage.setItem(ROOM_CODE_KEY, code);
          sessionStorage.setItem(ROLE_KEY, 'teacher');
          sessionStorage.setItem(TEACHER_TOKEN_KEY, tToken);
          addNotification('success', `Classroom ${code} created!`);
          break;
        }

        case 'CLASSROOM_JOINED': {
          const { studentId, room: roomView } = msg.payload;
          setRole('student');
          setMyStudentId(studentId);
          setRoom(roomView);
          setRoomCode(roomView.code);
          setErrorMessage(null);

          sessionStorage.setItem(ROOM_CODE_KEY, roomView.code);
          sessionStorage.setItem(ROLE_KEY, 'student');
          addNotification('success', `Joined Classroom ${roomView.code}!`);
          break;
        }

        case 'ROOM_UPDATED': {
          setRoom(msg.payload.room);
          break;
        }

        case 'STUDENT_LIST_UPDATED': {
          setRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              students: msg.payload.students,
              studentCount: msg.payload.studentCount,
              readyCount: msg.payload.readyCount,
            };
          });
          break;
        }

        case 'SESSION_START_SCHEDULED': {
          const { countdownStartAt: cStart, sessionStartAt: sStart, sessionEndAt: sEnd, settings } = msg.payload;
          setCountdownStartAt(cStart);
          setSessionStartAt(sStart);
          setSessionEndAt(sEnd);
          setSessionResults(null);
          setRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status: 'STARTING',
              settings,
              countdownStartAt: cStart,
              sessionStartAt: sStart,
              sessionEndAt: sEnd,
            };
          });
          break;
        }

        case 'SESSION_STARTED': {
          setRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status: 'ACTIVE',
              sessionStartAt: msg.payload.sessionStartAt,
              sessionEndAt: msg.payload.sessionEndAt,
            };
          });
          break;
        }

        case 'STUDENT_PROGRESS_BROADCAST': {
          const { studentId, progress, wpm, accuracy, finished } = msg.payload;
          setRoom((prev) => {
            if (!prev) return null;
            const updatedStudents = prev.students.map((s) => {
              if (s.id === studentId) {
                return {
                  ...s,
                  progress,
                  wpm,
                  accuracy,
                  status: finished ? ('FINISHED' as const) : s.status,
                };
              }
              return s;
            });
            return { ...prev, students: updatedStudents };
          });
          break;
        }

        case 'STUDENT_FINISHED_BROADCAST': {
          const { studentName: name, rank, wpm } = msg.payload;
          addNotification('info', `🏁 ${name} finished! (${wpm} WPM • Rank #${rank})`);
          break;
        }

        case 'SESSION_FINISHED': {
          setSessionResults(msg.payload.results);
          setRoom((prev) => {
            if (!prev) return null;
            return { ...prev, status: 'FINISHED' };
          });
          break;
        }

        case 'CLASSROOM_ENDED': {
          setRoom((prev) => {
            if (!prev) return null;
            return { ...prev, status: 'ENDED' };
          });
          addNotification('warning', msg.payload.reason || 'Classroom session has ended.');
          break;
        }

        case 'RECONNECT_SUCCESS': {
          const { role: restoredRole, studentId, room: roomView } = msg.payload;
          setRole(restoredRole);
          setRoom(roomView);
          setRoomCode(roomView.code);
          if (studentId) setMyStudentId(studentId);
          setErrorMessage(null);
          addNotification('success', 'Classroom session restored!');
          break;
        }

        case 'ERROR': {
          setErrorMessage(msg.payload.message);
          addNotification('error', msg.payload.message);
          break;
        }

        case 'PONG':
          break;
      }
    },
    [addNotification, sendJson]
  );

  // Connect function
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

        // Start ping heartbeat
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING', payload: { timestamp: Date.now() } }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          handleServerMessage(msg);
        } catch (e) {
          console.error('[ClassroomClient] Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        setStatus('DISCONNECTED');
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

        // Auto-reconnect up to 6 times
        if (reconnectAttemptsRef.current < 6) {
          const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
          reconnectAttemptsRef.current++;
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = () => {
        setStatus('ERROR');
      };
    } catch {
      setStatus('ERROR');
    }
  }, [getWsUrl, handleServerMessage]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  // Actions
  const createClassroom = useCallback(
    (teacherDisplayName?: string) => {
      sendJson({
        type: 'CREATE_CLASSROOM',
        payload: { teacherName: teacherDisplayName || 'Teacher' },
      });
    },
    [sendJson]
  );

  const joinClassroom = useCallback(
    (code: string, name: string, avatarEmoji = '🐂') => {
      setStudentName(name);
      sessionStorage.setItem(STUDENT_NAME_KEY, name);
      sendJson({
        type: 'JOIN_CLASSROOM',
        payload: {
          code: code.toUpperCase().trim(),
          studentName: name,
          avatarEmoji,
        },
      });
    },
    [sendJson]
  );

  const setReady = useCallback(
    (isReady: boolean) => {
      sendJson({
        type: 'STUDENT_READY',
        payload: { isReady },
      });
    },
    [sendJson]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<ClassroomSettings>) => {
      if (!teacherToken) return;
      sendJson({
        type: 'UPDATE_SETTINGS',
        payload: { teacherToken, settings: newSettings },
      });
    },
    [sendJson, teacherToken]
  );

  const startSession = useCallback(() => {
    if (!teacherToken) return;
    sendJson({
      type: 'START_SESSION',
      payload: { teacherToken },
    });
  }, [sendJson, teacherToken]);

  // Throttled progress sending (5-8 updates per second max)
  const sendProgress = useCallback(
    (progress: StudentProgressUpdate) => {
      const now = Date.now();
      pendingProgressRef.current = progress;

      if (now - lastProgressSentRef.current >= 150) {
        lastProgressSentRef.current = now;
        sendJson({
          type: 'STUDENT_PROGRESS',
          payload: progress,
        });
        pendingProgressRef.current = null;
      } else if (!throttleTimerRef.current) {
        throttleTimerRef.current = setTimeout(() => {
          throttleTimerRef.current = null;
          if (pendingProgressRef.current) {
            lastProgressSentRef.current = Date.now();
            sendJson({
              type: 'STUDENT_PROGRESS',
              payload: pendingProgressRef.current,
            });
            pendingProgressRef.current = null;
          }
        }, 150);
      }
    },
    [sendJson]
  );

  const finishSession = useCallback(
    (payload: StudentFinishPayload) => {
      sendJson({
        type: 'STUDENT_FINISH',
        payload,
      });
    },
    [sendJson]
  );

  const endClassroom = useCallback(() => {
    if (!teacherToken) return;
    sendJson({
      type: 'END_CLASSROOM',
      payload: { teacherToken },
    });
  }, [sendJson, teacherToken]);

  const leaveClassroom = useCallback(() => {
    sendJson({ type: 'LEAVE_CLASSROOM' });
    sessionStorage.removeItem(ROOM_CODE_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(TEACHER_TOKEN_KEY);
    setRole(null);
    setRoom(null);
    setRoomCode('');
    setTeacherToken('');
    setSessionResults(null);
    setCountdownStartAt(null);
    setSessionStartAt(null);
    setSessionEndAt(null);
  }, [sendJson]);

  const resetToEntry = useCallback(() => {
    leaveClassroom();
  }, [leaveClassroom]);

  return {
    status,
    role,
    roomCode,
    room,
    myStudentId,
    studentName,
    teacherToken,
    countdownStartAt,
    sessionStartAt,
    sessionEndAt,
    sessionResults,
    errorMessage,
    notifications,
    createClassroom,
    joinClassroom,
    setReady,
    updateSettings,
    startSession,
    sendProgress,
    finishSession,
    endClassroom,
    leaveClassroom,
    resetToEntry,
  };
}
