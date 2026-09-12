/**
 * In-Memory Matchmaking Manager for Quick Match
 * Pairs searching players into rooms automatically.
 */

import { type Player, MULTIPLAYER_CONSTANTS } from './types.ts';
import { RoomManager } from './RoomManager.ts';

export interface QueuedPlayer {
  player: Player;
  queuedAt: number;
}

export class MatchmakingManager {
  private queue: QueuedPlayer[] = [];
  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  /**
   * Enqueues a player searching for a match.
   * If an opponent is found, creates a new 2-player room and returns the room code.
   */
  findMatch(player: Player): { status: 'QUEUED' | 'MATCHED'; roomCode?: string } {
    // Remove if already in queue
    this.removePlayer(player.id);

    // Look for a compatible waiting player
    const opponent = this.queue.shift();
    if (opponent && opponent.player.id !== player.id) {
      // Create a room with the opponent as initial host
      const room = this.roomManager.createRoom(
        opponent.player,
        { maxPlayers: MULTIPLAYER_CONSTANTS.MAX_PLAYERS },
        true
      );

      // Join the new player
      this.roomManager.joinRoom(room.id, player);

      return { status: 'MATCHED', roomCode: room.id };
    }

    // No opponent available yet, enqueue
    this.queue.push({
      player,
      queuedAt: Date.now(),
    });

    return { status: 'QUEUED' };
  }

  /**
   * Removes a player from the matchmaking queue.
   */
  removePlayer(playerId: string): boolean {
    const initialLen = this.queue.length;
    this.queue = this.queue.filter((q) => q.player.id !== playerId);
    return this.queue.length < initialLen;
  }

  /**
   * Cleans up stale queued players who have exceeded the matchmaking timeout.
   */
  cleanupStaleQueue(): void {
    const now = Date.now();
    this.queue = this.queue.filter(
      (q) => now - q.queuedAt < MULTIPLAYER_CONSTANTS.MATCHMAKING_TIMEOUT_MS
    );
  }

  /**
   * Returns current queue size.
   */
  getQueueSize(): number {
    return this.queue.length;
  }
}
