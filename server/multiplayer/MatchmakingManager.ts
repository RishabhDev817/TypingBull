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

const BOT_CHALLENGERS = [
  { name: 'CyberBull', emoji: '🐂', minWpm: 68, maxWpm: 76 },
  { name: 'SpeedyFalcon', emoji: '🦅', minWpm: 74, maxWpm: 82 },
  { name: 'TurboTiger', emoji: '🐯', minWpm: 62, maxWpm: 70 },
  { name: 'NeonCheetah', emoji: '🐆', minWpm: 76, maxWpm: 86 },
  { name: 'PixelPanda', emoji: '🐼', minWpm: 56, maxWpm: 65 },
];

export class MatchmakingManager {
  private queue: QueuedPlayer[] = [];
  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  /**
   * Creates an arena challenger bot with realistic speed and avatar.
   */
  createChallengerBot(targetWpm?: number): Player {
    const template = BOT_CHALLENGERS[Math.floor(Math.random() * BOT_CHALLENGERS.length)];
    const speed = targetWpm || Math.floor(Math.random() * (template.maxWpm - template.minWpm + 1)) + template.minWpm;
    const botId = `bot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    return {
      id: botId,
      sessionToken: `bot_sess_${botId}`,
      name: `${template.name} [Bot]`,
      avatarEmoji: template.emoji,
      isHost: false,
      status: 'READY',
      ready: true,
      progress: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      wpm: speed,
      targetWpm: speed,
      accuracy: 98,
      isBot: true,
    };
  }

  /**
   * Immediately matches a player with an arena challenger bot.
   */
  matchWithBot(player: Player): { roomCode: string; botPlayer: Player } {
    this.removePlayer(player.id);
    const botPlayer = this.createChallengerBot();

    // Create a 2-player quick match room with the human as host
    const room = this.roomManager.createRoom(
      player,
      { maxPlayers: 2 },
      true
    );

    // Join the bot
    this.roomManager.joinRoom(room.id, botPlayer);

    return { roomCode: room.id, botPlayer };
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
   * Checks if any queued player has waited past the threshold (e.g. 3500ms)
   * and matches them with an arena challenger bot.
   */
  matchQueuedPlayerWithBot(playerId: string): { roomCode: string; botPlayer: Player; player: Player } | null {
    const queueIdx = this.queue.findIndex((q) => q.player.id === playerId);
    if (queueIdx === -1) return null;

    const [queued] = this.queue.splice(queueIdx, 1);
    const { roomCode, botPlayer } = this.matchWithBot(queued.player);
    return { roomCode, botPlayer, player: queued.player };
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
