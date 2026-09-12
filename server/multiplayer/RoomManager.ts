/**
 * In-Memory Room Manager for Practice Ground
 * Manages live active rooms with non-sequential codes and zero database dependence.
 */

import {
  type Room,
  type Player,
  type RoomSettings,
  MULTIPLAYER_CONSTANTS,
} from './types.ts';
import { getRandomRacePassage } from './multiplayerPassages.ts';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous 0, O, 1, I

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  /**
   * Generates a short, collision-free, non-sequential 5-character alphanumeric room code.
   */
  generateRoomCode(): string {
    let code: string;
    let attempts = 0;
    do {
      code = '';
      for (let i = 0; i < 5; i++) {
        const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
        code += CODE_ALPHABET[idx];
      }
      attempts++;
      if (attempts > 50) {
        code += Math.floor(Math.random() * 10);
      }
    } while (this.rooms.has(code));

    return code;
  }

  /**
   * Creates a new room in memory.
   */
  createRoom(
    hostPlayer: Player,
    customSettings?: Partial<RoomSettings>,
    isQuickMatch = false
  ): Room {
    const code = this.generateRoomCode();
    const settings: RoomSettings = {
      maxPlayers: customSettings?.maxPlayers || MULTIPLAYER_CONSTANTS.MAX_PLAYERS,
      durationSeconds: customSettings?.durationSeconds || MULTIPLAYER_CONSTANTS.DEFAULT_RACE_DURATION_SECONDS,
      language: customSettings?.language || 'en',
      difficulty: customSettings?.difficulty || 'medium',
    };

    const passage = getRandomRacePassage(settings.language);

    hostPlayer.isHost = true;
    hostPlayer.status = 'NOT_READY';
    hostPlayer.ready = false;

    const room: Room = {
      id: code,
      hostId: hostPlayer.id,
      status: 'LOBBY',
      players: {
        [hostPlayer.id]: hostPlayer,
      },
      settings,
      text: passage.text,
      textTitle: passage.title,
      createdAt: Date.now(),
      isQuickMatch,
      rematchVotes: [],
    };

    this.rooms.set(code, room);
    return room;
  }

  /**
   * Retrieves an existing room by its code.
   */
  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase().trim());
  }

  /**
   * Adds a player to an existing room.
   */
  joinRoom(code: string, player: Player): { success: boolean; error?: string; room?: Room } {
    const room = this.getRoom(code);
    if (!room) {
      return { success: false, error: 'This room could not be found.' };
    }

    if (room.status !== 'LOBBY') {
      return { success: false, error: 'This race has already started.' };
    }

    const playerCount = Object.keys(room.players).length;
    if (playerCount >= room.settings.maxPlayers) {
      return { success: false, error: 'This room is full.' };
    }

    player.isHost = false;
    player.status = 'NOT_READY';
    player.ready = false;
    player.progress = 0;
    player.correctChars = 0;
    player.incorrectChars = 0;
    player.totalChars = 0;
    player.wpm = 0;
    player.accuracy = 100;
    delete player.rank;
    delete player.finishedAt;

    room.players[player.id] = player;
    return { success: true, room };
  }

  /**
   * Removes a player from a room.
   */
  leaveRoom(code: string, playerId: string): { room?: Room; wasHost: boolean; isEmpty: boolean } {
    const room = this.getRoom(code);
    if (!room) {
      return { wasHost: false, isEmpty: true };
    }

    const wasHost = room.hostId === playerId;
    delete room.players[playerId];

    const remainingPlayerIds = Object.keys(room.players);
    const isEmpty = remainingPlayerIds.length === 0;

    if (isEmpty) {
      this.rooms.delete(code);
      return { wasHost, isEmpty: true };
    }

    // If the host left, transfer host authority to the oldest connected player
    if (wasHost && remainingPlayerIds.length > 0) {
      const nextHostId = remainingPlayerIds[0];
      room.hostId = nextHostId;
      if (room.players[nextHostId]) {
        room.players[nextHostId].isHost = true;
      }
    }

    return { room, wasHost, isEmpty: false };
  }

  /**
   * Resets an existing room for a rematch.
   */
  resetRoomForRematch(code: string): Room | undefined {
    const room = this.getRoom(code);
    if (!room) return undefined;

    const newPassage = getRandomRacePassage(room.settings?.language || 'en');
    room.status = 'LOBBY';
    room.text = newPassage.text;
    room.textTitle = newPassage.title;
    delete room.countdownStartAt;
    delete room.raceStartAt;
    delete room.raceEndAt;
    room.rematchVotes = [];

    // Reset all player race metrics
    for (const p of Object.values(room.players)) {
      p.status = 'NOT_READY';
      p.ready = false;
      p.progress = 0;
      p.correctChars = 0;
      p.incorrectChars = 0;
      p.totalChars = 0;
      p.wpm = 0;
      p.accuracy = 100;
      delete p.rank;
      delete p.finishedAt;
    }

    return room;
  }

  /**
   * Deletes a room from memory.
   */
  deleteRoom(code: string): boolean {
    return this.rooms.delete(code);
  }

  /**
   * Returns all active rooms.
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Total active room count.
   */
  getRoomCount(): number {
    return this.rooms.size;
  }
}
