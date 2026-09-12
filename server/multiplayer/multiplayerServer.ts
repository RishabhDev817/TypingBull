/**
 * Practice Ground Real-Time WebSocket Server
 * Core message dispatcher and connection handler.
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'node:http';
import {
  type ClientMessage,
  type Player,
  MULTIPLAYER_CONSTANTS,
} from './types.ts';
import { RoomManager } from './RoomManager.ts';
import { MatchmakingManager } from './MatchmakingManager.ts';
import { RaceManager } from './RaceManager.ts';
import { ConnectionManager } from './ConnectionManager.ts';
import { CleanupManager } from './CleanupManager.ts';
import { ResultValidator } from './ResultValidator.ts';

export interface MultiplayerServerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server?: HttpServer | any;
  port?: number;
  path?: string;
}

export class MultiplayerServer {
  private wss: WebSocketServer;
  public roomManager: RoomManager;
  public matchmakingManager: MatchmakingManager;
  public connectionManager: ConnectionManager;
  public cleanupManager: CleanupManager;
  private raceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(options: MultiplayerServerOptions = {}) {
    this.roomManager = new RoomManager();
    this.matchmakingManager = new MatchmakingManager(this.roomManager);
    this.connectionManager = new ConnectionManager(this.roomManager);
    this.cleanupManager = new CleanupManager(this.roomManager, this.matchmakingManager);

    if (options.server) {
      this.wss = new WebSocketServer({
        noServer: true,
      });

      const wsPath = options.path || '/practice-ground-ws';
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
          // Ignore non-matching or malformed upgrade requests to let Vite HMR handle its own upgrades
        }
      });
    } else {
      this.wss = new WebSocketServer({
        port: options.port || 3001,
        path: options.path || '/practice-ground-ws',
      });
    }

    this.setupListeners();
    this.cleanupManager.start();

    console.log('[Practice Ground WS] Real-time multiplayer server initialized');
  }

  private setupListeners(): void {
    this.wss.on('connection', (socket: WebSocket) => {
      const conn = this.connectionManager.registerConnection(socket);

      // Send initial connection handshake with session token
      this.connectionManager.sendToSocket(socket, {
        type: 'CONNECTED',
        payload: {
          sessionToken: conn.sessionToken,
          playerId: conn.playerId,
        },
      });

      socket.on('message', (data: Buffer | string) => {
        try {
          const raw = typeof data === 'string' ? data : data.toString();
          const message: ClientMessage = JSON.parse(raw);
          this.handleMessage(socket, message);
        } catch (err) {
          console.error('[Practice Ground WS] Malformed message received:', err);
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'INVALID_PAYLOAD', message: 'Malformed message received.' },
          });
        }
      });

      socket.on('close', () => {
        this.handleDisconnect(socket);
      });

      socket.on('error', (err) => {
        console.warn('[Practice Ground WS] Socket error:', err.message);
        this.handleDisconnect(socket);
      });
    });
  }

  private handleDisconnect(socket: WebSocket): void {
    const conn = this.connectionManager.getConnection(socket);
    if (!conn) return;

    // If searching for match, remove from queue
    this.matchmakingManager.removePlayer(conn.playerId);

    const { room, player, graceStarted, newHost } = this.connectionManager.handleDisconnect(
      socket,
      (roomCode, playerId) => {
        // Grace period expired callback
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

  private handleMessage(socket: WebSocket, message: ClientMessage): void {
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

        // Check if reconnecting using session token
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

        const matchResult = this.matchmakingManager.findMatch(player);

        if (matchResult.status === 'MATCHED' && matchResult.roomCode) {
          const room = this.roomManager.getRoom(matchResult.roomCode);
          if (room) {
            conn.currentRoomCode = room.id;
            this.connectionManager.sendToSocket(socket, {
              type: 'MATCH_FOUND',
              payload: { roomCode: room.id },
            });
            this.connectionManager.broadcastToRoom(room, {
              type: 'ROOM_UPDATED',
              payload: { room },
            });
          }
        } else {
          this.connectionManager.sendToSocket(socket, {
            type: 'MATCH_SEARCHING',
            payload: { message: 'Searching for an opponent...' },
          });
        }
        break;
      }

      case 'CANCEL_MATCH': {
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

        // Verify host authorization
        if (room.hostId !== conn.playerId) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'UNAUTHORIZED', message: 'Only the host can start the race.' },
          });
          return;
        }

        // Check player count (require at least 1, recommended >= 2 for match)
        const activePlayers = Object.values(room.players).filter((p) => p.status !== 'DISCONNECTED');
        if (activePlayers.length < 1) {
          this.connectionManager.sendToSocket(socket, {
            type: 'ERROR',
            payload: { code: 'NOT_ENOUGH_PLAYERS', message: 'Waiting for players to join.' },
          });
          return;
        }

        // Schedule canonical countdown
        const countdownData = RaceManager.scheduleCountdown(room);

        this.connectionManager.broadcastToRoom(room, {
          type: 'RACE_COUNTDOWN',
          payload: countdownData,
        });

        // Set timer for the moment countdown reaches 0 (GO!)
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

            // Set duration timeout timer
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

        // Broadcast throttled progress to opponents
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
          socket // exclude sender to minimize client processing
        );

        // If player just finished, broadcast their podium placement
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

        // If all racers are finished, finalize the race immediately!
        if (progressResult.allFinished) {
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

        // Reset room back to lobby for rematch
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

  /**
   * Closes server and stops cleanup timers.
   */
  close(): void {
    this.cleanupManager.stop();
    for (const timer of this.raceTimers.values()) {
      clearTimeout(timer);
    }
    this.raceTimers.clear();
    this.wss.close();
  }
}
