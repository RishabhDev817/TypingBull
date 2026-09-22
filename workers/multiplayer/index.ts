/**
 * Cloudflare Worker with Durable Objects for TypingBull Practice Ground
 * Global real-time multiplayer WebSocket server with in-memory synchronization.
 */

import { DurableObject } from 'cloudflare:workers';
import {
  type ClientMessage,
  type Player,
  MULTIPLAYER_CONSTANTS,
} from '../../server/multiplayer/types.ts';
import { RoomManager } from '../../server/multiplayer/RoomManager.ts';
import { MatchmakingManager } from '../../server/multiplayer/MatchmakingManager.ts';
import { RaceManager } from '../../server/multiplayer/RaceManager.ts';
import { ConnectionManager, type UniversalWebSocket } from '../../server/multiplayer/ConnectionManager.ts';
import { CleanupManager } from '../../server/multiplayer/CleanupManager.ts';
import { ResultValidator } from '../../server/multiplayer/ResultValidator.ts';
import { ClassroomManager } from '../../server/classroom/ClassroomManager.ts';
import { ClassroomCleanupManager } from '../../server/classroom/ClassroomCleanupManager.ts';
import {
  type ClientMessage as ClassroomClientMessage,
  type ServerMessage as ClassroomServerMessage,
} from '../../server/classroom/types.ts';

export class MultiplayerArena extends DurableObject {
  public roomManager: RoomManager;
  public matchmakingManager: MatchmakingManager;
  public connectionManager: ConnectionManager;
  public cleanupManager: CleanupManager;
  private raceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private matchmakingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private botSimTimers: Map<string, ReturnType<typeof setInterval>> = new Map();

  // Classroom State
  public classroomManager: ClassroomManager;
  public classroomCleanupManager: ClassroomCleanupManager;
  private classroomSockets = new Map<
    UniversalWebSocket,
    { sessionToken: string; playerId: string; code?: string; role?: 'teacher' | 'student' }
  >();
  private classroomRoomSockets = new Map<string, Set<UniversalWebSocket>>();
  private classroomSessionTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(ctx: DurableObjectState, env: any) {
    super(ctx, env);
    this.roomManager = new RoomManager();
    this.matchmakingManager = new MatchmakingManager(this.roomManager);
    this.connectionManager = new ConnectionManager(this.roomManager);
    this.cleanupManager = new CleanupManager(this.roomManager, this.matchmakingManager);
    this.cleanupManager.start();

    this.classroomManager = new ClassroomManager();
    this.classroomCleanupManager = new ClassroomCleanupManager(this.classroomManager);
    this.classroomCleanupManager.start();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'typingbull-multiplayer-worker',
          rooms: this.roomManager.getRoomCount(),
          classroomRooms: this.classroomManager.getRoomCount(),
          connections: this.connectionManager.getConnectionCount(),
          classroomConnections: this.classroomSockets.size,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Stats check
    if (url.pathname === '/stats') {
      return new Response(
        JSON.stringify({
          rooms: this.roomManager.getRoomCount(),
          classroomRooms: this.classroomManager.getRoomCount(),
          connections: this.connectionManager.getConnectionCount(),
          queueSize: this.matchmakingManager.getQueueSize(),
          classroomConnections: this.classroomSockets.size,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // WebSocket Upgrade
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Accept WebSocket into Durable Object context
    this.ctx.acceptWebSocket(server);

    const isClassroom = url.pathname.includes('classroom');
    if (isClassroom) {
      const sessionToken = `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const playerId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const socket = server as unknown as UniversalWebSocket;
      this.classroomSockets.set(socket, { sessionToken, playerId });

      this.sendToClassroomSocket(socket, {
        type: 'CONNECTED',
        payload: { sessionToken },
      });
    } else {
      // Register connection and send initial handshake for practice ground
      const conn = this.connectionManager.registerConnection(server as unknown as UniversalWebSocket);

      this.connectionManager.sendToSocket(server as unknown as UniversalWebSocket, {
        type: 'CONNECTED',
        payload: {
          sessionToken: conn.sessionToken,
          playerId: conn.playerId,
        },
      });
    }

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const socket = ws as unknown as UniversalWebSocket;
    if (this.classroomSockets.has(socket)) {
      try {
        const raw = typeof message === 'string' ? message : new TextDecoder().decode(message);
        const msg: ClassroomClientMessage = JSON.parse(raw);
        this.handleClassroomMessage(socket, msg);
      } catch (err) {
        console.error('[Classroom Worker] Malformed message:', err);
        this.sendToClassroomSocket(socket, {
          type: 'ERROR',
          payload: { code: 'INVALID_PAYLOAD', message: 'Malformed message received.' },
        });
      }
      return;
    }

    try {
      const raw = typeof message === 'string' ? message : new TextDecoder().decode(message);
      const msg: ClientMessage = JSON.parse(raw);
      this.handleMessage(socket, msg);
    } catch (err) {
      console.error('[Practice Ground Worker] Malformed message:', err);
      this.connectionManager.sendToSocket(socket, {
        type: 'ERROR',
        payload: { code: 'INVALID_PAYLOAD', message: 'Malformed message received.' },
      });
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const socket = ws as unknown as UniversalWebSocket;
    if (this.classroomSockets.has(socket)) {
      this.handleClassroomDisconnect(socket);
      return;
    }
    this.handleDisconnect(socket);
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    const socket = ws as unknown as UniversalWebSocket;
    if (this.classroomSockets.has(socket)) {
      this.handleClassroomDisconnect(socket);
      return;
    }
    this.handleDisconnect(socket);
  }

  private handleDisconnect(socket: UniversalWebSocket): void {
    const conn = this.connectionManager.getConnection(socket);
    if (!conn) return;

    const mmTimer = this.matchmakingTimers.get(conn.playerId);
    if (mmTimer) {
      clearTimeout(mmTimer);
      this.matchmakingTimers.delete(conn.playerId);
    }

    this.matchmakingManager.removePlayer(conn.playerId);

    const { room, player, graceStarted, newHost } = this.connectionManager.handleDisconnect(
      socket,
      (roomCode, playerId) => {
        const r = this.roomManager.getRoom(roomCode);
        if (r && r.players[playerId]) {
          const { isEmpty } = this.roomManager.leaveRoom(roomCode, playerId);
          if (!isEmpty) {
            this.connectionManager.broadcastToRoom(r, {
              type: 'ROOM_UPDATED',
              payload: { room: r },
            });
          }
        }
      }
    );

    if (room && player && graceStarted) {
      if (newHost) {
        this.connectionManager.broadcastToRoom(room, {
          type: 'HOST_CHANGED',
          payload: { newHostId: newHost.id, newHostName: newHost.name },
        });
      }

      this.connectionManager.broadcastToRoom(room, {
        type: 'PLAYER_DISCONNECTED',
        payload: {
          playerId: player.id,
          name: player.name,
          graceRemainingSeconds: MULTIPLAYER_CONSTANTS.DISCONNECT_GRACE_PERIOD_MS / 1000,
        },
      });

      this.connectionManager.broadcastToRoom(room, {
        type: 'ROOM_UPDATED',
        payload: { room },
      });
    }
  }

  private handleMessage(socket: UniversalWebSocket, message: ClientMessage): void {
    const conn = this.connectionManager.getConnection(socket);
    if (!conn) return;

    switch (message.type) {
      case 'PING': {
        this.connectionManager.sendToSocket(socket, {
          type: 'PONG',
          payload: { timestamp: Date.now() },
        });
        break;
      }

      case 'CREATE_ROOM': {
        const cleanName = ResultValidator.sanitizeDisplayName(message.payload?.name);
        const emoji = message.payload?.avatarEmoji || '🐂';

        const hostPlayer: Player = {
          id: conn.playerId,
          sessionToken: conn.sessionToken,
          name: cleanName,
          avatarEmoji: emoji,
          isHost: true,
          status: 'NOT_READY',
          ready: false,
          progress: 0,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
          wpm: 0,
          accuracy: 100,
        };

        const room = this.roomManager.createRoom(
          hostPlayer,
          message.payload?.settings,
          false
        );
        conn.currentRoomCode = room.id;

        this.connectionManager.sendToSocket(socket, {
          type: 'ROOM_CREATED',
          payload: { room, myPlayerId: conn.playerId },
        });
        break;
      }

      case 'JOIN_ROOM': {
        const { roomCode, name, avatarEmoji, sessionToken } = message.payload;
        if (!roomCode) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'INVALID_CODE', message: 'Room code is required.' },
          });
          return;
        }

        if (sessionToken) {
          const restoreResult = this.connectionManager.restoreSession(socket, sessionToken);
          if (restoreResult.restored && restoreResult.room && restoreResult.player) {
            conn.currentRoomCode = restoreResult.room.id;
            conn.playerId = restoreResult.player.id;

            this.connectionManager.sendToSocket(socket, {
              type: 'ROOM_JOINED',
              payload: { room: restoreResult.room, myPlayerId: restoreResult.player.id },
            });

            this.connectionManager.broadcastToRoom(
              restoreResult.room,
              {
                type: 'PLAYER_RECONNECTED',
                payload: { playerId: restoreResult.player.id, name: restoreResult.player.name },
              },
              socket
            );

            this.connectionManager.broadcastToRoom(restoreResult.room, {
              type: 'ROOM_UPDATED',
              payload: { room: restoreResult.room },
            });
            return;
          }
        }

        const cleanName = ResultValidator.sanitizeDisplayName(name);
        const emoji = avatarEmoji || '⚡';

        const player: Player = {
          id: conn.playerId,
          sessionToken: conn.sessionToken,
          name: cleanName,
          avatarEmoji: emoji,
          isHost: false,
          status: 'NOT_READY',
          ready: false,
          progress: 0,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
          wpm: 0,
          accuracy: 100,
        };

        const joinResult = this.roomManager.joinRoom(roomCode, player);
        if (!joinResult.success || !joinResult.room) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'JOIN_FAILED', message: joinResult.error || 'Failed to join room.' },
          });
          return;
        }

        conn.currentRoomCode = joinResult.room.id;

        this.connectionManager.sendToSocket(socket, {
          type: 'ROOM_JOINED',
          payload: { room: joinResult.room, myPlayerId: conn.playerId },
        });

        this.connectionManager.broadcastToRoom(joinResult.room, {
          type: 'ROOM_UPDATED',
          payload: { room: joinResult.room },
        });
        break;
      }

      case 'LEAVE_ROOM': {
        if (!conn.currentRoomCode) return;
        const roomCode = conn.currentRoomCode;
        const { room, wasHost, isEmpty } = this.roomManager.leaveRoom(roomCode, conn.playerId);
        conn.currentRoomCode = undefined;

        if (!isEmpty && room) {
          if (wasHost && room.players[room.hostId]) {
            this.connectionManager.broadcastToRoom(room, {
              type: 'HOST_CHANGED',
              payload: { newHostId: room.hostId, newHostName: room.players[room.hostId].name },
            });
          }
          this.connectionManager.broadcastToRoom(room, {
            type: 'ROOM_UPDATED',
            payload: { room },
          });
        }
        break;
      }

      case 'FIND_MATCH': {
        const cleanName = ResultValidator.sanitizeDisplayName(message.payload?.name);
        const emoji = message.payload?.avatarEmoji || '🐂';
        const language = message.payload?.language || 'en';

        const player: Player = {
          id: conn.playerId,
          sessionToken: conn.sessionToken,
          name: cleanName,
          avatarEmoji: emoji,
          isHost: false,
          status: 'NOT_READY',
          ready: false,
          progress: 0,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
          wpm: 0,
          accuracy: 100,
        };

        const matchResult = this.matchmakingManager.findMatch(player, language);

        if (matchResult.status === 'MATCHED' && matchResult.roomCode) {
          const room = this.roomManager.getRoom(matchResult.roomCode);
          if (room) {
            this.startQuickMatchRace(room);
          }
        } else {
          this.connectionManager.sendToSocket(socket, {
            type: 'MATCH_SEARCHING',
            payload: { message: 'Searching for an opponent...' },
          });

          // Set 3.5s auto-challenger bot timer so the racer is never left stranded
          const existingMmTimer = this.matchmakingTimers.get(conn.playerId);
          if (existingMmTimer) clearTimeout(existingMmTimer);

          const mmTimer = setTimeout(() => {
            this.matchmakingTimers.delete(conn.playerId);
            const botMatch = this.matchmakingManager.matchQueuedPlayerWithBot(conn.playerId);
            if (botMatch) {
              const room = this.roomManager.getRoom(botMatch.roomCode);
              if (room) {
                this.startQuickMatchRace(room);
              }
            }
          }, 3500);

          this.matchmakingTimers.set(conn.playerId, mmTimer);
        }
        break;
      }

      case 'CANCEL_MATCH': {
        const mmTimer = this.matchmakingTimers.get(conn.playerId);
        if (mmTimer) {
          clearTimeout(mmTimer);
          this.matchmakingTimers.delete(conn.playerId);
        }
        this.matchmakingManager.removePlayer(conn.playerId);
        break;
      }

      case 'TOGGLE_READY': {
        if (!conn.currentRoomCode) return;
        const room = this.roomManager.getRoom(conn.currentRoomCode);
        if (!room || room.status !== 'LOBBY') return;

        const player = room.players[conn.playerId];
        if (!player) return;

        const newReady = message.payload?.ready !== undefined ? message.payload.ready : !player.ready;
        player.ready = newReady;
        player.status = newReady ? 'READY' : 'NOT_READY';

        this.connectionManager.broadcastToRoom(room, {
          type: 'ROOM_UPDATED',
          payload: { room },
        });
        break;
      }

      case 'START_RACE': {
        if (!conn.currentRoomCode) return;
        const room = this.roomManager.getRoom(conn.currentRoomCode);
        if (!room || room.status !== 'LOBBY') return;

        if (room.hostId !== conn.playerId) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'UNAUTHORIZED', message: 'Only the host can start the race.' },
          });
          return;
        }

        const activePlayers = Object.values(room.players).filter((p) => p.status !== 'DISCONNECTED');
        if (activePlayers.length < 1) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'NOT_ENOUGH_PLAYERS', message: 'Waiting for players to join.' },
          });
          return;
        }

        const countdownData = RaceManager.scheduleCountdown(room);

        this.connectionManager.broadcastToRoom(room, {
          type: 'RACE_COUNTDOWN',
          payload: countdownData,
        });

        const delayMs = Math.max(0, countdownData.startAt - Date.now());
        setTimeout(() => {
          if (room.status === 'COUNTDOWN') {
            RaceManager.startRace(room);
            this.connectionManager.broadcastToRoom(room, {
              type: 'RACE_STARTED',
              payload: {
                startAt: countdownData.startAt,
                durationSeconds: room.settings.durationSeconds,
              },
            });

            const durationMs = room.settings.durationSeconds * 1000;
            const existingTimer = this.raceTimers.get(room.id);
            if (existingTimer) clearTimeout(existingTimer);

            const timer = setTimeout(() => {
              if (room.status === 'RACING') {
                const rankings = RaceManager.finalizeRace(room);
                this.connectionManager.broadcastToRoom(room, {
                  type: 'RACE_FINISHED',
                  payload: { rankings, reason: 'timeout' },
                });
              }
              this.raceTimers.delete(room.id);
            }, durationMs);

            this.raceTimers.set(room.id, timer);
          }
        }, delayMs);

        break;
      }

      case 'PROGRESS_UPDATE': {
        if (!conn.currentRoomCode) return;
        const room = this.roomManager.getRoom(conn.currentRoomCode);
        if (!room || (room.status !== 'RACING' && room.status !== 'COUNTDOWN')) return;

        const progressResult = RaceManager.handlePlayerProgress(
          room,
          conn.playerId,
          message.payload
        );

        if (!progressResult.player) return;

        this.connectionManager.broadcastToRoom(
          room,
          {
            type: 'PLAYER_PROGRESS',
            payload: {
              playerId: conn.playerId,
              progress: progressResult.player.progress,
              correctChars: progressResult.player.correctChars,
              wpm: progressResult.player.wpm,
              accuracy: progressResult.player.accuracy,
            },
          },
          socket
        );

        if (progressResult.justFinished && progressResult.rankingItem) {
          this.connectionManager.broadcastToRoom(room, {
            type: 'PLAYER_FINISHED',
            payload: {
              playerId: conn.playerId,
              name: progressResult.player.name,
              rank: progressResult.rankingItem.rank,
              wpm: progressResult.rankingItem.wpm,
              accuracy: progressResult.rankingItem.accuracy,
              timeTakenSeconds: progressResult.rankingItem.durationSeconds,
            },
          });
        }

        if (progressResult.allFinished) {
          this.stopBotSimulation(room.id);
          const timer = this.raceTimers.get(room.id);
          if (timer) {
            clearTimeout(timer);
            this.raceTimers.delete(room.id);
          }

          const rankings = RaceManager.finalizeRace(room);
          this.connectionManager.broadcastToRoom(room, {
            type: 'RACE_FINISHED',
            payload: { rankings, reason: 'completed' },
          });
        }

        break;
      }

      case 'REQUEST_REMATCH': {
        if (!conn.currentRoomCode) return;
        const room = this.roomManager.getRoom(conn.currentRoomCode);
        if (!room || room.status !== 'FINISHED') return;

        this.stopBotSimulation(room.id);
        const resetRoom = this.roomManager.resetRoomForRematch(conn.currentRoomCode);
        if (resetRoom) {
          this.connectionManager.broadcastToRoom(resetRoom, {
            type: 'REMATCH_ACCEPTED',
            payload: { room: resetRoom },
          });
        }
        break;
      }
    }
  }

  private startQuickMatchRace(room: Room): void {
    // Ensure all players have currentRoomCode and ready status
    for (const p of Object.values(room.players)) {
      this.connectionManager.setRoomForPlayer(p.id, room.id);
      p.ready = true;
      p.status = 'READY';
      // Clear any pending matchmaking timers
      const mmTimer = this.matchmakingTimers.get(p.id);
      if (mmTimer) {
        clearTimeout(mmTimer);
        this.matchmakingTimers.delete(p.id);
      }
    }

    // Broadcast MATCH_FOUND and ROOM_UPDATED to all players in the room
    this.connectionManager.broadcastToRoom(room, {
      type: 'MATCH_FOUND',
      payload: { roomCode: room.id, room },
    });
    this.connectionManager.broadcastToRoom(room, {
      type: 'ROOM_UPDATED',
      payload: { room },
    });

    // Auto-schedule countdown after 1200ms
    setTimeout(() => {
      if (room.status !== 'LOBBY') return;
      const countdownData = RaceManager.scheduleCountdown(room);

      this.connectionManager.broadcastToRoom(room, {
        type: 'RACE_COUNTDOWN',
        payload: countdownData,
      });

      const delayMs = Math.max(0, countdownData.startAt - Date.now());
      setTimeout(() => {
        if (room.status === 'COUNTDOWN') {
          RaceManager.startRace(room);
          this.connectionManager.broadcastToRoom(room, {
            type: 'RACE_STARTED',
            payload: {
              startAt: countdownData.startAt,
              durationSeconds: room.settings.durationSeconds,
            },
          });

          // Start bot simulation if bot exists
          this.startBotSimulation(room);

          const durationMs = room.settings.durationSeconds * 1000;
          const existingTimer = this.raceTimers.get(room.id);
          if (existingTimer) clearTimeout(existingTimer);

          const timer = setTimeout(() => {
            if (room.status === 'RACING') {
              this.stopBotSimulation(room.id);
              const rankings = RaceManager.finalizeRace(room);
              this.connectionManager.broadcastToRoom(room, {
                type: 'RACE_FINISHED',
                payload: { rankings, reason: 'timeout' },
              });
            }
            this.raceTimers.delete(room.id);
          }, durationMs);

          this.raceTimers.set(room.id, timer);
        }
      }, delayMs);
    }, 1200);
  }

  private startBotSimulation(room: Room): void {
    const bots = Object.values(room.players).filter((p) => p.isBot);
    if (bots.length === 0) return;

    const botTimer = setInterval(() => {
      if (room.status !== 'RACING') {
        this.stopBotSimulation(room.id);
        return;
      }

      const raceStartAt = room.raceStartAt || Date.now();
      const textLen = room.text.length;

      // Check if human racers have finished; if so, accelerate bot to conclude swiftly
      const humans = Object.values(room.players).filter((p) => !p.isBot && p.status !== 'DISCONNECTED');
      const allHumansFinished = humans.length > 0 && humans.every((h) => h.status === 'FINISHED');

      for (const bot of bots) {
        if (bot.status === 'FINISHED') continue;

        const targetWpm = bot.targetWpm || 70;
        const charsStep = allHumansFinished
          ? Math.max(15, Math.ceil((textLen - bot.correctChars) / 3))
          : Math.max(2, Math.round(((targetWpm * 5) / 120) * (0.85 + Math.random() * 0.3)));

        bot.correctChars = Math.min(textLen, bot.correctChars + charsStep);
        bot.totalChars = bot.correctChars;
        bot.progress = Math.min(100, Math.round((bot.correctChars / textLen) * 100));

        const elapsedMinutes = Math.max(0.01, (Date.now() - raceStartAt) / 60000);
        bot.wpm = Math.round((bot.correctChars / 5) / elapsedMinutes);

        this.connectionManager.broadcastToRoom(room, {
          type: 'PLAYER_PROGRESS',
          payload: {
            playerId: bot.id,
            progress: bot.progress,
            correctChars: bot.correctChars,
            wpm: bot.wpm,
            accuracy: bot.accuracy,
          },
        });

        if (bot.correctChars >= textLen) {
          bot.status = 'FINISHED';
          bot.finishedAt = Date.now();
          const finishedCount = Object.values(room.players).filter((p) => p.status === 'FINISHED').length;
          bot.rank = finishedCount;

          const durationSeconds = Math.max(1, (bot.finishedAt - raceStartAt) / 1000);

          this.connectionManager.broadcastToRoom(room, {
            type: 'PLAYER_FINISHED',
            payload: {
              playerId: bot.id,
              name: bot.name,
              rank: bot.rank,
              wpm: bot.wpm,
              accuracy: bot.accuracy,
              timeTakenSeconds: Math.round(durationSeconds * 10) / 10,
            },
          });

          // Check if all participating players have finished (including reconnecting grace racers)
          const now = Date.now();
          const activePlayers = Object.values(room.players).filter((p) => {
            if (p.status !== 'DISCONNECTED') return true;
            if (p.disconnectedAt && (now - p.disconnectedAt) < MULTIPLAYER_CONSTANTS.DISCONNECT_GRACE_PERIOD_MS) {
              return true;
            }
            return false;
          });
          if (activePlayers.length > 0 && activePlayers.every((p) => p.status === 'FINISHED')) {
            this.stopBotSimulation(room.id);
            const raceTimer = this.raceTimers.get(room.id);
            if (raceTimer) {
              clearTimeout(raceTimer);
              this.raceTimers.delete(room.id);
            }
            const rankings = RaceManager.finalizeRace(room);
            this.connectionManager.broadcastToRoom(room, {
              type: 'RACE_FINISHED',
              payload: { rankings, reason: 'completed' },
            });
          }
        }
      }
    }, 500);

    this.botSimTimers.set(room.id, botTimer);
  }

  private stopBotSimulation(roomId: string): void {
    const timer = this.botSimTimers.get(roomId);
    if (timer) {
      clearInterval(timer);
      this.botSimTimers.delete(roomId);
    }
  }

  // ==========================================
  // Classroom Methods
  // ==========================================

  private sendToClassroomSocket(socket: UniversalWebSocket, message: ClassroomServerMessage): void {
    if (socket.readyState === 1 /* WebSocket.OPEN */) {
      socket.send(JSON.stringify(message));
    }
  }

  private broadcastToClassroomRoom(code: string, message: ClassroomServerMessage): void {
    const sockets = this.classroomRoomSockets.get(code.toUpperCase());
    if (!sockets) return;
    const data = JSON.stringify(message);
    for (const ws of sockets) {
      if (ws.readyState === 1 /* WebSocket.OPEN */) {
        ws.send(data);
      }
    }
  }

  private registerClassroomSocketToRoom(code: string, socket: UniversalWebSocket): void {
    const normalized = code.toUpperCase();
    if (!this.classroomRoomSockets.has(normalized)) {
      this.classroomRoomSockets.set(normalized, new Set());
    }
    this.classroomRoomSockets.get(normalized)!.add(socket);
  }

  private unregisterClassroomSocketFromRoom(code: string, socket: UniversalWebSocket): void {
    const normalized = code.toUpperCase();
    const set = this.classroomRoomSockets.get(normalized);
    if (set) {
      set.delete(socket);
      if (set.size === 0) {
        this.classroomRoomSockets.delete(normalized);
      }
    }
  }

  private handleClassroomMessage(socket: UniversalWebSocket, msg: ClassroomClientMessage): void {
    const meta = this.classroomSockets.get(socket);
    if (!meta) return;

    switch (msg.type) {
      case 'CREATE_CLASSROOM': {
        const teacherToken = `tt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const room = this.classroomManager.createRoom(meta.playerId, teacherToken, msg.payload.teacherName);

        meta.code = room.code;
        meta.role = 'teacher';
        this.registerClassroomSocketToRoom(room.code, socket);

        this.sendToClassroomSocket(socket, {
          type: 'CLASSROOM_CREATED',
          payload: {
            code: room.code,
            teacherToken,
            room: this.classroomManager.toRoomView(room),
          },
        });
        break;
      }

      case 'JOIN_CLASSROOM': {
        const { code, studentName, avatarEmoji, sessionToken } = msg.payload;
        const effectiveSessionToken = sessionToken || meta.sessionToken;
        const result = this.classroomManager.joinRoom(
          code,
          meta.playerId,
          effectiveSessionToken,
          studentName,
          avatarEmoji
        );

        if ('error' in result) {
          this.sendToClassroomSocket(socket, {
            type: 'ERROR',
            payload: result.error,
          });
          return;
        }

        const { room, student } = result;
        meta.code = room.code;
        meta.role = 'student';
        meta.sessionToken = effectiveSessionToken;
        this.registerClassroomSocketToRoom(room.code, socket);

        this.sendToClassroomSocket(socket, {
          type: 'CLASSROOM_JOINED',
          payload: {
            studentId: student.id,
            sessionToken: effectiveSessionToken,
            room: this.classroomManager.toRoomView(room),
          },
        });

        const roomView = this.classroomManager.toRoomView(room);
        this.broadcastToClassroomRoom(room.code, {
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
        const room = this.classroomManager.setStudentReady(meta.code, meta.playerId, Boolean(msg.payload.isReady));
        if (room) {
          const roomView = this.classroomManager.toRoomView(room);
          this.broadcastToClassroomRoom(room.code, {
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
        const room = this.classroomManager.updateSettings(meta.code, msg.payload.teacherToken, msg.payload.settings);
        if (room) {
          this.broadcastToClassroomRoom(room.code, {
            type: 'ROOM_UPDATED',
            payload: { room: this.classroomManager.toRoomView(room) },
          });
        }
        break;
      }

      case 'START_SESSION': {
        if (!meta.code) return;
        const result = this.classroomManager.startSession(meta.code, msg.payload.teacherToken);
        if ('error' in result) {
          this.sendToClassroomSocket(socket, {
            type: 'ERROR',
            payload: result.error,
          });
          return;
        }

        const { room, countdownStartAt, sessionStartAt, sessionEndAt } = result;

        this.broadcastToClassroomRoom(room.code, {
          type: 'SESSION_START_SCHEDULED',
          payload: {
            countdownStartAt,
            sessionStartAt,
            sessionEndAt,
            settings: room.settings,
          },
        });

        const countdownDelay = Math.max(0, sessionStartAt - Date.now());
        setTimeout(() => {
          if (room.status === 'STARTING') {
            room.status = 'ACTIVE';
            this.broadcastToClassroomRoom(room.code, {
              type: 'SESSION_STARTED',
              payload: { sessionStartAt, sessionEndAt },
            });
          }
        }, countdownDelay);

        const sessionTotalDelay = Math.max(0, sessionEndAt - Date.now());
        if (this.classroomSessionTimers.has(room.code)) {
          clearTimeout(this.classroomSessionTimers.get(room.code)!);
        }

        const timer = setTimeout(() => {
          this.handleClassroomSessionTimeout(room.code);
        }, sessionTotalDelay);

        this.classroomSessionTimers.set(room.code, timer);
        break;
      }

      case 'STUDENT_PROGRESS': {
        if (!meta.code) return;
        const result = this.classroomManager.updateStudentProgress(meta.code, meta.playerId, msg.payload);
        if (result) {
          this.broadcastToClassroomRoom(result.room.code, {
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
        const result = this.classroomManager.finishStudent(meta.code, meta.playerId, msg.payload);
        if (result) {
          const { room, student, allFinished, results } = result;

          this.broadcastToClassroomRoom(room.code, {
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
            if (this.classroomSessionTimers.has(room.code)) {
              clearTimeout(this.classroomSessionTimers.get(room.code)!);
              this.classroomSessionTimers.delete(room.code);
            }
            this.broadcastToClassroomRoom(room.code, {
              type: 'SESSION_FINISHED',
              payload: { results },
            });
          }
        }
        break;
      }

      case 'END_CLASSROOM': {
        if (!meta.code) return;
        const ended = this.classroomManager.endRoom(meta.code, msg.payload.teacherToken);
        if (ended) {
          if (this.classroomSessionTimers.has(meta.code)) {
            clearTimeout(this.classroomSessionTimers.get(meta.code)!);
            this.classroomSessionTimers.delete(meta.code);
          }
          this.broadcastToClassroomRoom(meta.code, {
            type: 'CLASSROOM_ENDED',
            payload: { reason: 'The teacher ended the classroom session.' },
          });
        }
        break;
      }

      case 'RECONNECT': {
        const { code, sessionToken, role } = msg.payload;
        const room = this.classroomManager.getRoom(code);
        if (!room) {
          this.sendToClassroomSocket(socket, {
            type: 'ERROR',
            payload: { code: 'ROOM_NOT_FOUND', message: 'Classroom not found or expired.' },
          });
          return;
        }

        meta.code = room.code;
        meta.role = role;
        meta.sessionToken = sessionToken;
        this.registerClassroomSocketToRoom(room.code, socket);

        if (role === 'teacher') {
          room.teacherId = meta.playerId;
          room.teacherDisconnectedAt = undefined;
          this.sendToClassroomSocket(socket, {
            type: 'RECONNECT_SUCCESS',
            payload: { role: 'teacher', room: this.classroomManager.toRoomView(room) },
          });
        } else {
          const student = Object.values(room.students).find((s) => s.sessionToken === sessionToken);
          if (student) {
            student.id = meta.playerId;
            student.disconnectedAt = undefined;
            if (student.status === 'DISCONNECTED') {
              student.status = student.isReady ? 'READY' : 'NOT_READY';
            }
            this.sendToClassroomSocket(socket, {
              type: 'RECONNECT_SUCCESS',
              payload: { role: 'student', studentId: student.id, room: this.classroomManager.toRoomView(room) },
            });

            const roomView = this.classroomManager.toRoomView(room);
            this.broadcastToClassroomRoom(room.code, {
              type: 'STUDENT_LIST_UPDATED',
              payload: {
                students: roomView.students,
                studentCount: roomView.studentCount,
                readyCount: roomView.readyCount,
              },
            });
          } else {
            this.sendToClassroomSocket(socket, {
              type: 'ERROR',
              payload: { code: 'STUDENT_NOT_FOUND', message: 'Session expired. Please join again.' },
            });
          }
        }
        break;
      }

      case 'PING': {
        this.sendToClassroomSocket(socket, {
          type: 'PONG',
          payload: { timestamp: Date.now() },
        });
        break;
      }
    }
  }

  private handleClassroomDisconnect(socket: UniversalWebSocket): void {
    const meta = this.classroomSockets.get(socket);
    if (!meta) return;

    if (meta.code) {
      this.unregisterClassroomSocketFromRoom(meta.code, socket);
      const room = this.classroomManager.getRoom(meta.code);
      if (room) {
        if (meta.role === 'teacher') {
          room.teacherDisconnectedAt = Date.now();
          this.broadcastToClassroomRoom(room.code, {
            type: 'TEACHER_DISCONNECTED',
            payload: { message: 'Teacher disconnected. Waiting for reconnection...' },
          });
        } else if (meta.role === 'student') {
          const student = room.students[meta.playerId];
          if (student) {
            student.status = 'DISCONNECTED';
            student.disconnectedAt = Date.now();
            const roomView = this.classroomManager.toRoomView(room);
            this.broadcastToClassroomRoom(room.code, {
              type: 'STUDENT_LIST_UPDATED',
              payload: {
                students: roomView.students,
                studentCount: roomView.studentCount,
                readyCount: roomView.readyCount,
              },
            });
          }
        }
      }
    }

    this.classroomSockets.delete(socket);
  }

  private handleClassroomSessionTimeout(roomCode: string): void {
    const room = this.classroomManager.getRoom(roomCode);
    if (!room || room.status !== 'ACTIVE') return;

    room.status = 'ENDED';
    const results = this.classroomManager.buildResults(room);
    this.broadcastToClassroomRoom(room.code, {
      type: 'SESSION_FINISHED',
      payload: { results },
    });
  }
}

export default {
  async fetch(request: Request, env: { ARENA: DurableObjectNamespace<MultiplayerArena> }) {
    const id = env.ARENA.idFromName('global-practice-ground');
    const stub = env.ARENA.get(id);
    return stub.fetch(request);
  },
};
