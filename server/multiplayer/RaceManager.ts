/**
 * Race Manager for Practice Ground
 * Authoritative countdown synchronization, race lifecycles, and final rankings.
 */

import {
  type Room,
  type Player,
  type RaceRankingItem,
  MULTIPLAYER_CONSTANTS,
} from './types.ts';
import { ResultValidator } from './ResultValidator.ts';

export class RaceManager {
  /**
   * Initiates the synchronized countdown sequence for a room.
   */
  static scheduleCountdown(room: Room): { startAt: number; text: string; textTitle: string } {
    const now = Date.now();
    const startAt = now + MULTIPLAYER_CONSTANTS.COUNTDOWN_DURATION_MS;

    room.status = 'COUNTDOWN';
    room.countdownStartAt = now;
    room.raceStartAt = startAt;
    room.raceEndAt = startAt + room.settings.durationSeconds * 1000;

    // Transition all players to RACING state
    for (const player of Object.values(room.players)) {
      player.status = 'RACING';
      player.progress = 0;
      player.correctChars = 0;
      player.incorrectChars = 0;
      player.totalChars = 0;
      player.wpm = 0;
      player.accuracy = 100;
      delete player.rank;
      delete player.finishedAt;
    }

    return {
      startAt,
      text: room.text,
      textTitle: room.textTitle,
    };
  }

  /**
   * Transitions room to active RACING state once countdown finishes.
   */
  static startRace(room: Room): void {
    room.status = 'RACING';
  }

  /**
   * Updates a player's race progress with authoritative server validation.
   */
  static handlePlayerProgress(
    room: Room,
    playerId: string,
    data: {
      correctChars: number;
      incorrectChars: number;
      totalChars: number;
      wpm: number;
      accuracy: number;
      completed: boolean;
    }
  ): {
    player?: Player;
    justFinished: boolean;
    allFinished: boolean;
    rankingItem?: RaceRankingItem;
  } {
    const player = room.players[playerId];
    if (!player || player.status === 'FINISHED' || room.status !== 'RACING') {
      return { justFinished: false, allFinished: false };
    }

    const raceStartAt = room.raceStartAt || Date.now();
    const validation = ResultValidator.validateProgress(
      room.text,
      raceStartAt,
      data.correctChars,
      data.incorrectChars,
      data.totalChars,
      data.completed
    );

    player.progress = validation.validatedProgress;
    player.correctChars = data.correctChars;
    player.incorrectChars = data.incorrectChars;
    player.totalChars = data.totalChars;
    player.wpm = validation.validatedWpm;
    player.accuracy = validation.validatedAccuracy;

    let justFinished = false;
    let rankingItem: RaceRankingItem | undefined;

    if (validation.isCompleted) {
      player.status = 'FINISHED';
      player.finishedAt = Date.now();
      justFinished = true;

      // Determine rank among finished players
      const finishedCount = Object.values(room.players).filter(
        (p) => p.status === 'FINISHED'
      ).length;
      player.rank = finishedCount;

      const durationSeconds = Math.max(1, (player.finishedAt - raceStartAt) / 1000);

      rankingItem = {
        playerId: player.id,
        name: player.name,
        avatarEmoji: player.avatarEmoji,
        rank: player.rank,
        wpm: player.wpm,
        accuracy: player.accuracy,
        finished: true,
        durationSeconds: Math.round(durationSeconds * 10) / 10,
      };
    }

    // Check if all connected racers have finished
    const connectedPlayers = Object.values(room.players).filter(
      (p) => p.status !== 'DISCONNECTED'
    );
    const allFinished =
      connectedPlayers.length > 0 &&
      connectedPlayers.every((p) => p.status === 'FINISHED');

    if (allFinished) {
      room.status = 'FINISHED';
    }

    return {
      player,
      justFinished,
      allFinished,
      rankingItem,
    };
  }

  /**
   * Finalizes the race and compiles the authoritative final rankings.
   */
  static finalizeRace(room: Room): RaceRankingItem[] {
    room.status = 'FINISHED';
    const raceStartAt = room.raceStartAt || room.createdAt;
    const now = Date.now();

    const playersList = Object.values(room.players);

    // Sort: finished first (by rank/finishedAt), then unfinished by highest progress, then WPM
    playersList.sort((a, b) => {
      if (a.status === 'FINISHED' && b.status === 'FINISHED') {
        return (a.finishedAt || 0) - (b.finishedAt || 0);
      }
      if (a.status === 'FINISHED') return -1;
      if (b.status === 'FINISHED') return 1;
      if (b.progress !== a.progress) return b.progress - a.progress;
      return b.wpm - a.wpm;
    });

    const rankings: RaceRankingItem[] = playersList.map((p, index) => {
      const rank = index + 1;
      p.rank = rank;
      const duration = p.finishedAt
        ? (p.finishedAt - raceStartAt) / 1000
        : (now - raceStartAt) / 1000;

      return {
        playerId: p.id,
        name: p.name,
        avatarEmoji: p.avatarEmoji,
        rank,
        wpm: p.wpm,
        accuracy: p.accuracy,
        finished: p.status === 'FINISHED',
        durationSeconds: Math.round(duration * 10) / 10,
      };
    });

    return rankings;
  }
}
