/**
 * Classroom Real-Time WebSocket Server
 * Handles WebSocket lifecycle, message routing, session authorization, and synchronized broadcasts.
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'node:http';
import {
  type ClientMessage,
  type ServerMessage,
} from './types.ts';
import { ClassroomManager } from './ClassroomManager.ts';
import { ClassroomCleanupManager } from './ClassroomCleanupManager.ts';

export interface ClassroomServerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server?: HttpServer | any;
  port?: number;
  path?: string;
}

interface SocketMeta {
  sessionToken: string;
  playerId: string;
  code?: string;
  role?: 'teacher' | 'student';
}

export class ClassroomServer {
  private wss: WebSocketServer;
  public manager: ClassroomManager;
  public cleanupManager: ClassroomCleanupManager;

  // Socket metadata map
  private socketMeta = new Map<WebSocket, SocketMeta>();
  // Room code -> Set of active WebSockets
  private roomSockets = new Map<string, Set<WebSocket>>();
  // Session timers for auto-ending when time runs out
  private sessionTimers = new Map<string, NodeJS.Timeout>();

  constructor(options: ClassroomServerOptions = {}) {
    this.manager = new ClassroomManager();
    this.cleanupManager = new ClassroomCleanupManager(this.manager);

    const wsPath = options.path || '/classroom-ws';

    if (options.server) {
      this.wss = new WebSocketServer({ noServer: true });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.server.on('upgrade', (request: any, socket: any, head: any) => {
        try {
          const host = request.headers.host || 'localhost';
          const pathname = new URL(request.url || '', `http://${host}`).pathname;
          if (pathname === wsPath) {
            this.wss.handleUpgrade(request, socket, head, (ws) => {
              this.wss.emit('connection', ws, request);
            });
          }
        } catch {
          // Ignore non-matching upgrades
        }
      });
    } else {
      this.wss = new WebSocketServer({
        port: options.port || 3002,
        path: wsPath,
      });
    }

    this.setupListeners();
    this.cleanupManager.start();

    console.log(`[ClassroomServer] WebSocket Server initialized on path: ${wsPath}`);
  }

  private setupListeners(): void {
    this.wss.on('connection', (socket: WebSocket) => {
      const sessionToken = `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const playerId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      this.socketMeta.set(socket, { sessionToken, playerId });

      // Send initial handshake
      this.send(socket, {
        type: 'CONNECTED',
        payload: { sessionToken },
      });

      socket.on('message', (data: Buffer | string) => {
        try {
          const raw = typeof data === 'string' ? data : data.toString();
          const message: ClientMessage = JSON.parse(raw);
          this.handleMessage(socket, message);
        } catch (err) {
          console.error('[ClassroomServer] Malformed message received:', err);
          this.send(socket, {
            type: 'ERROR',
            payload: { code: 'MALFORMED_MESSAGE', message: 'Unable to parse JSON payload.' },
          });
        }
      });

      socket.on('close', () => {
        this.handleDisconnect(socket);
      });

      socket.on('error', (err) => {
        console.warn('[ClassroomServer] Socket error:', err.message);
        this.handleDisconnect(socket);
      });
    });
  }

  private send(socket: WebSocket, message: ServerMessage): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  private broadcastToRoom(code: string, message: ServerMessage): void {
    const sockets = this.roomSockets.get(code.toUpperCase());
    if (!sockets) return;
    const data = JSON.stringify(message);
    for (const ws of sockets) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    }
  }

  private registerSocketToRoom(code: string, socket: WebSocket): void {
    const normalized = code.toUpperCase();
    if (!this.roomSockets.has(normalized)) {
      this.roomSockets.set(normalized, new Set());
    }
    this.roomSockets.get(normalized)!.add(socket);
  }

  private unregisterSocketFromRoom(code: string, socket: WebSocket): void {
    const normalized = code.toUpperCase();
    const set = this.roomSockets.get(normalized);
    if (set) {
      set.delete(socket);
      if (set.size === 0) {
        this.roomSockets.delete(normalized);
      }
    }
  }

  private handleMessage(socket: WebSocket, msg: ClientMessage): void {
    const meta = this.socketMeta.get(socket);
    if (!meta) return;

    switch (msg.type) {
      case 'CREATE_CLASSROOM': {
        const teacherToken = `tt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const room = this.manager.createRoom(meta.playerId, teacherToken, msg.payload.teacherName);

        meta.code = room.code;
        meta.role = 'teacher';
        this.registerSocketToRoom(room.code, socket);

        this.send(socket, {
          type: 'CLASSROOM_CREATED',
          payload: {
            code: room.code,
            teacherToken,
            room: this.manager.toRoomView(room),
          },
        });
        break;
      }

      case 'JOIN_CLASSROOM': {
        const { code, studentName, avatarEmoji, sessionToken } = msg.payload;
        const effectiveSessionToken = sessionToken || meta.sessionToken;
        const result = this.manager.joinRoom(
          code,
          meta.playerId,
          effectiveSessionToken,
          studentName,
          avatarEmoji
        );

        if ('error' in result) {
          this.send(socket, {
            type: 'ERROR',
            payload: result.error,
          });
          return;
        }

        const { room, student } = result;
        meta.code = room.code;
        meta.role = 'student';
        meta.sessionToken = effectiveSessionToken;
        this.registerSocketToRoom(room.code, socket);

        // Notify joining student
        this.send(socket, {
          type: 'CLASSROOM_JOINED',
          payload: {
            studentId: student.id,
            sessionToken: effectiveSessionToken,
            room: this.manager.toRoomView(room),
          },
        });

        // Broadcast updated student roster to whole room
        const roomView = this.manager.toRoomView(room);
        this.broadcastToRoom(room.code, {
          type: 'STUDENT_LIST_UPDATED',
          payload: {
            students: roomView.students,
            studentCount: roomView.studentCount,
            readyCount: roomView.readyCount,
          },
        });
        break;
      }

      case 'STUDENT_READY': {
        if (!meta.code) return;
        const room = this.manager.setStudentReady(meta.code, meta.playerId, Boolean(msg.payload.isReady));
        if (room) {
          const roomView = this.manager.toRoomView(room);
          this.broadcastToRoom(room.code, {
            type: 'STUDENT_LIST_UPDATED',
            payload: {
              students: roomView.students,
              studentCount: roomView.studentCount,
              readyCount: roomView.readyCount,
            },
          });
        }
        break;
      }

      case 'UPDATE_SETTINGS': {
        if (!meta.code) return;
        const room = this.manager.updateSettings(meta.code, msg.payload.teacherToken, msg.payload.settings);
        if (room) {
          this.broadcastToRoom(room.code, {
            type: 'ROOM_UPDATED',
            payload: { room: this.manager.toRoomView(room) },
          });
        }
        break;
      }

      case 'START_SESSION': {
        if (!meta.code) return;
        const result = this.manager.startSession(meta.code, msg.payload.teacherToken);
        if ('error' in result) {
          this.send(socket, {
            type: 'ERROR',
            payload: result.error,
          });
          return;
        }

        const { room, countdownStartAt, sessionStartAt, sessionEndAt } = result;

        // Broadcast synchronized start schedule to everyone
        this.broadcastToRoom(room.code, {
          type: 'SESSION_START_SCHEDULED',
          payload: {
            countdownStartAt,
            sessionStartAt,
            sessionEndAt,
            settings: room.settings,
          },
        });

        // Set timer for when countdown completes
        const countdownDelay = Math.max(0, sessionStartAt - Date.now());
        setTimeout(() => {
          if (room.status === 'STARTING') {
            room.status = 'ACTIVE';
            this.broadcastToRoom(room.code, {
              type: 'SESSION_STARTED',
              payload: { sessionStartAt, sessionEndAt },
            });
          }
        }, countdownDelay);

        // Schedule auto-finish when duration expires
        const sessionTotalDelay = Math.max(0, sessionEndAt - Date.now());
        if (this.sessionTimers.has(room.code)) {
          clearTimeout(this.sessionTimers.get(room.code)!);
        }

        const timer = setTimeout(() => {
          this.handleSessionTimeout(room.code);
        }, sessionTotalDelay);

        this.sessionTimers.set(room.code, timer);
        break;
      }

      case 'STUDENT_PROGRESS': {
        if (!meta.code) return;
        const result = this.manager.updateStudentProgress(meta.code, meta.playerId, msg.payload);
        if (result) {
          this.broadcastToRoom(result.room.code, {
            type: 'STUDENT_PROGRESS_BROADCAST',
            payload: {
              studentId: result.student.id,
              progress: result.student.progress,
              wpm: result.student.wpm,
              accuracy: result.student.accuracy,
              finished: result.student.status === 'FINISHED',
            },
          });
        }
        break;
      }

      case 'STUDENT_FINISH': {
        if (!meta.code) return;
        const result = this.manager.finishStudent(meta.code, meta.playerId, msg.payload);
        if (result) {
          const { room, student, allFinished, results } = result;

          this.broadcastToRoom(room.code, {
            type: 'STUDENT_FINISHED_BROADCAST',
            payload: {
              studentId: student.id,
              studentName: student.name,
              rank: student.rank || 1,
              wpm: student.wpm,
              accuracy: student.accuracy,
            },
          });

          if (allFinished && results) {
            // Cancel timeout timer
            if (this.sessionTimers.has(room.code)) {
              clearTimeout(this.sessionTimers.get(room.code)!);
              this.sessionTimers.delete(room.code);
            }
            this.broadcastToRoom(room.code, {
              type: 'SESSION_FINISHED',
              payload: { results },
            });
          }
        }
        break;
      }

      case 'END_CLASSROOM': {
        if (!meta.code) return;
        const ended = this.manager.endRoom(meta.code, msg.payload.teacherToken);
        if (ended) {
          if (this.sessionTimers.has(meta.code)) {
            clearTimeout(this.sessionTimers.get(meta.code)!);
            this.sessionTimers.delete(meta.code);
          }
          this.broadcastToRoom(meta.code, {
            type: 'CLASSROOM_ENDED',
            payload: { reason: 'The teacher ended the classroom session.' },
          });
        }
        break;
      }

      case 'RECONNECT': {
        const { code, sessionToken, role } = msg.payload;
        const room = this.manager.getRoom(code);
        if (!room) {
          this.send(socket, {
            type: 'ERROR',
            payload: { code: 'ROOM_NOT_FOUND', message: 'Classroom not found or expired.' },
          });
          return;
        }

        meta.code = room.code;
        meta.role = role;
        meta.sessionToken = sessionToken;
        this.registerSocketToRoom(room.code, socket);

        if (role === 'teacher') {
          room.teacherId = meta.playerId;
          room.teacherDisconnectedAt = undefined;
          this.send(socket, {
            type: 'RECONNECT_SUCCESS',
            payload: { role: 'teacher', room: this.manager.toRoomView(room) },
          });
        } else {
          // Find student by token
          const student = Object.values(room.students).find((s) => s.sessionToken === sessionToken);
          if (student) {
            student.id = meta.playerId;
            student.disconnectedAt = undefined;
            if (student.status === 'DISCONNECTED') {
              student.status = student.isReady ? 'READY' : 'NOT_READY';
            }
            this.send(socket, {
              type: 'RECONNECT_SUCCESS',
              payload: {
                role: 'student',
                studentId: student.id,
                room: this.manager.toRoomView(room),
              },
            });
          } else {
            // New join
            this.send(socket, {
              type: 'ERROR',
              payload: { code: 'STUDENT_EXPIRED', message: 'Session expired, please rejoin.' },
            });
            return;
          }
        }

        this.broadcastToRoom(room.code, {
          type: 'ROOM_UPDATED',
          payload: { room: this.manager.toRoomView(room) },
        });
        break;
      }

      case 'LEAVE_CLASSROOM': {
        if (meta.code) {
          this.unregisterSocketFromRoom(meta.code, socket);
          const room = this.manager.getRoom(meta.code);
          if (room && meta.role === 'student') {
            delete room.students[meta.playerId];
            this.broadcastToRoom(room.code, {
              type: 'STUDENT_LIST_UPDATED',
              payload: {
                students: this.manager.toRoomView(room).students,
                studentCount: Object.keys(room.students).length,
                readyCount: Object.values(room.students).filter((s) => s.isReady).length,
              },
            });
          }
          meta.code = undefined;
        }
        break;
      }

      case 'PING': {
        this.send(socket, {
          type: 'PONG',
          payload: { timestamp: msg.payload?.timestamp || Date.now() },
        });
        break;
      }
    }
  }

  private handleSessionTimeout(code: string): void {
    const room = this.manager.getRoom(code);
    if (!room || room.status === 'FINISHED' || room.status === 'ENDED') return;

    room.status = 'FINISHED';
    const results = this.manager.calculateResults(room);
    this.broadcastToRoom(code, {
      type: 'SESSION_FINISHED',
      payload: { results },
    });
  }

  private handleDisconnect(socket: WebSocket): void {
    const meta = this.socketMeta.get(socket);
    if (!meta || !meta.code) {
      this.socketMeta.delete(socket);
      return;
    }

    this.unregisterSocketFromRoom(meta.code, socket);
    const room = this.manager.getRoom(meta.code);

    if (room) {
      if (meta.role === 'teacher') {
        room.teacherDisconnectedAt = Date.now();
        this.broadcastToRoom(room.code, {
          type: 'ROOM_UPDATED',
          payload: { room: this.manager.toRoomView(room) },
        });
      } else if (meta.role === 'student') {
        const student = room.students[meta.playerId];
        if (student) {
          student.status = 'DISCONNECTED';
          student.disconnectedAt = Date.now();
          this.broadcastToRoom(room.code, {
            type: 'STUDENT_LIST_UPDATED',
            payload: {
              students: this.manager.toRoomView(room).students,
              studentCount: Object.keys(room.students).length,
              readyCount: Object.values(room.students).filter((s) => s.isReady).length,
            },
          });
        }
      }
    }

    this.socketMeta.delete(socket);
  }
}
