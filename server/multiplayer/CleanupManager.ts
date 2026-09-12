/**
 * Cleanup & Garbage Collection Manager for Practice Ground
 * Ensures in-memory state does not leak memory or grow unboundedly.
 */

import { MULTIPLAYER_CONSTANTS } from './types.ts';
import { RoomManager } from './RoomManager.ts';
import { MatchmakingManager } from './MatchmakingManager.ts';

export class CleanupManager {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private roomManager: RoomManager;
  private matchmakingManager: MatchmakingManager;

  constructor(
    roomManager: RoomManager,
    matchmakingManager: MatchmakingManager
  ) {
    this.roomManager = roomManager;
    this.matchmakingManager = matchmakingManager;
  }

  /**
   * Starts the recurring memory sweep interval.
   */
  start(): void {
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(() => {
      this.performSweep();
    }, MULTIPLAYER_CONSTANTS.ROOM_CLEANUP_INTERVAL_MS);
  }

  /**
   * Stops the cleanup interval (used during teardown).
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Runs a single cleanup sweep across rooms and matchmaking.
   */
  performSweep(): { purgedRooms: number; activeRooms: number } {
    const now = Date.now();
    let purgedRooms = 0;

    // 1. Clean matchmaking queue
    this.matchmakingManager.cleanupStaleQueue();

    // 2. Clean stale or empty rooms
    const allRooms = this.roomManager.getAllRooms();
    for (const room of allRooms) {
      const players = Object.values(room.players);
      const connectedCount = players.filter((p) => p.status !== 'DISCONNECTED').length;

      // Case A: Room is completely empty (0 players)
      if (players.length === 0) {
        this.roomManager.deleteRoom(room.id);
        purgedRooms++;
        continue;
      }

      // Case B: All players disconnected for > grace period
      if (connectedCount === 0) {
        const allDisconnectedOld = players.every(
          (p) => p.disconnectedAt && now - p.disconnectedAt > MULTIPLAYER_CONSTANTS.DISCONNECT_GRACE_PERIOD_MS
        );
        if (allDisconnectedOld) {
          this.roomManager.deleteRoom(room.id);
          purgedRooms++;
          continue;
        }
      }

      // Case C: Finished room inactive for > 15 minutes
      if (room.status === 'FINISHED' && room.raceEndAt && now - room.raceEndAt > 15 * 60 * 1000) {
        this.roomManager.deleteRoom(room.id);
        purgedRooms++;
        continue;
      }

      // Case D: Abandoned lobby inactive for > 30 minutes
      if (room.status === 'LOBBY' && now - room.createdAt > 30 * 60 * 1000) {
        this.roomManager.deleteRoom(room.id);
        purgedRooms++;
        continue;
      }
    }

    return {
      purgedRooms,
      activeRooms: this.roomManager.getRoomCount(),
    };
  }
}
