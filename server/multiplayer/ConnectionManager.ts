/**
 * Connection & Reconnect Session Manager for Practice Ground
 * Handles session tokens, disconnect grace periods, and host transfers.
 */

import { WebSocket } from 'ws';
import { type Player, type Room, MULTIPLAYER_CONSTANTS } from './types.ts';
import { RoomManager } from './RoomManager.ts';

export interface ClientConnection {
  socket: WebSocket;
  sessionToken: string;
  playerId: string;
  currentRoomCode?: string;
  lastPing: number;
}

export class ConnectionManager {
  private connections: Map<WebSocket, ClientConnection> = new Map();
  private tokenToConnection: Map<string, ClientConnection> = new Map();
  private pendingDisconnects: Map<string, NodeJS.Timeout> = new Map();

  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  /**
   * Generates a secure random session token.
   */
  generateSessionToken(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }

  /**
   * Registers a newly opened WebSocket connection.
   */
  registerConnection(socket: WebSocket): ClientConnection {
    const sessionToken = this.generateSessionToken();
    const playerId = `ply_${Math.random().toString(36).slice(2, 9)}`;

    const clientConn: ClientConnection = {
      socket,
      sessionToken,
      playerId,
      lastPing: Date.now(),
    };

    this.connections.set(socket, clientConn);
    this.tokenToConnection.set(sessionToken, clientConn);
    return clientConn;
  }

  /**
   * Retrieves connection metadata for a socket.
   */
  getConnection(socket: WebSocket): ClientConnection | undefined {
    return this.connections.get(socket);
  }

  /**
   * Restores a connection across a disconnect if valid session token is provided.
   */
  restoreSession(
    socket: WebSocket,
    sessionToken: string
  ): { restored: boolean; clientConn?: ClientConnection; room?: Room; player?: Player } {
    const existing = this.tokenToConnection.get(sessionToken);
    if (!existing) {
      return { restored: false };
    }

    // Cancel pending disconnect timer
    const pendingTimer = this.pendingDisconnects.get(sessionToken);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      this.pendingDisconnects.delete(sessionToken);
    }

    // Update socket reference
    this.connections.delete(existing.socket);
    existing.socket = socket;
    existing.lastPing = Date.now();
    this.connections.set(socket, existing);

    let room: Room | undefined;
    let player: Player | undefined;

    if (existing.currentRoomCode) {
      room = this.roomManager.getRoom(existing.currentRoomCode);
      if (room && room.players[existing.playerId]) {
        player = room.players[existing.playerId];
        player.status = room.status === 'RACING' ? 'RACING' : 'CONNECTED';
        delete player.disconnectedAt;
      }
    }

    return { restored: true, clientConn: existing, room, player };
  }

  /**
   * Handles socket disconnect with a grace period.
   */
  handleDisconnect(
    socket: WebSocket,
    onGraceExpired: (roomCode: string, playerId: string) => void
  ): {
    room?: Room;
    player?: Player;
    graceStarted: boolean;
    newHost?: Player;
  } {
    const conn = this.connections.get(socket);
    if (!conn) {
      return { graceStarted: false };
    }

    this.connections.delete(socket);

    if (!conn.currentRoomCode) {
      this.tokenToConnection.delete(conn.sessionToken);
      return { graceStarted: false };
    }

    const room = this.roomManager.getRoom(conn.currentRoomCode);
    if (!room) {
      this.tokenToConnection.delete(conn.sessionToken);
      return { graceStarted: false };
    }

    const player = room.players[conn.playerId];
    if (!player) {
      this.tokenToConnection.delete(conn.sessionToken);
      return { graceStarted: false };
    }

    // Mark player as disconnected with timestamp
    player.status = 'DISCONNECTED';
    player.disconnectedAt = Date.now();

    let newHost: Player | undefined;

    // If the disconnecting player was the host, assign a new host immediately
    if (player.isHost) {
      const activeConnectedPlayers = Object.values(room.players).filter(
        (p) => p.id !== player.id && p.status !== 'DISCONNECTED'
      );

      if (activeConnectedPlayers.length > 0) {
        player.isHost = false;
        const nextHost = activeConnectedPlayers[0];
        nextHost.isHost = true;
        room.hostId = nextHost.id;
        newHost = nextHost;
      }
    }

    // Start grace period timer
    const timer = setTimeout(() => {
      this.pendingDisconnects.delete(conn.sessionToken);
      this.tokenToConnection.delete(conn.sessionToken);
      onGraceExpired(conn.currentRoomCode!, conn.playerId);
    }, MULTIPLAYER_CONSTANTS.DISCONNECT_GRACE_PERIOD_MS);

    this.pendingDisconnects.set(conn.sessionToken, timer);

    return {
      room,
      player,
      graceStarted: true,
      newHost,
    };
  }

  /**
   * Broadcasts a JSON message to all connected players in a room.
   */
  broadcastToRoom(room: Room, message: unknown, excludeSocket?: WebSocket): void {
    const payloadStr = JSON.stringify(message);
    for (const player of Object.values(room.players)) {
      if (player.status === 'DISCONNECTED') continue;
      const conn = Array.from(this.connections.values()).find(
        (c) => c.playerId === player.id
      );

      if (conn && conn.socket !== excludeSocket && conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(payloadStr);
      }
    }
  }

  /**
   * Broadcasts a JSON message to a single connection.
   */
  sendToSocket(socket: WebSocket, message: unknown): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  /**
   * Total active connections.
   */
  getConnectionCount(): number {
    return this.connections.size;
  }
}
