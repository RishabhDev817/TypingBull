/**
 * Real-Time Multiplayer Types and Protocols for Practice Ground
 */

export type PlayerStatus =
  | 'CONNECTED'
  | 'NOT_READY'
  | 'READY'
  | 'RACING'
  | 'FINISHED'
  | 'DISCONNECTED';

export type RoomStatus =
  | 'LOBBY'
  | 'COUNTDOWN'
  | 'RACING'
  | 'FINISHED';

export interface Player {
  id: string;              // Unique socket session ID
  userId?: string;        // Optional persistent user ID if authenticated
  sessionToken: string;   // Token for reconnecting across disconnects
  name: string;           // Sanitized display name
  avatarEmoji: string;    // Fun mascot/avatar icon
  isHost: boolean;
  status: PlayerStatus;
  ready: boolean;
  progress: number;       // 0 to 100 percentage
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  wpm: number;
  accuracy: number;       // 0 to 100 percentage
  rank?: number;          // 1, 2, 3...
  finishedAt?: number;    // Timestamp when completed
  disconnectedAt?: number;
  isBot?: boolean;
  targetWpm?: number;
}

export interface RoomSettings {
  maxPlayers: number;
  durationSeconds: number;
  language: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Room {
  id: string;               // 5-letter alphanumeric code (e.g. ABX7K)
  hostId: string;
  status: RoomStatus;
  players: Record<string, Player>;
  settings: RoomSettings;
  text: string;             // Authoritative race text
  textTitle: string;
  createdAt: number;
  countdownStartAt?: number;// Server time when countdown starts
  raceStartAt?: number;     // Canonical server timestamp when race begins
  raceEndAt?: number;       // Scheduled or actual race end timestamp
  isQuickMatch?: boolean;   // Quick match vs private room
  rematchVotes?: string[];  // Player IDs who voted for rematch
}

export interface RaceRankingItem {
  playerId: string;
  name: string;
  avatarEmoji: string;
  rank: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  durationSeconds: number;
}

// ─── CLIENT -> SERVER EVENTS ───

export type ClientMessage =
  | { type: 'CREATE_ROOM'; payload: { name: string; avatarEmoji?: string; settings?: Partial<RoomSettings> } }
  | { type: 'JOIN_ROOM'; payload: { roomCode: string; name: string; avatarEmoji?: string; sessionToken?: string } }
  | { type: 'LEAVE_ROOM'; payload?: Record<string, never> }
  | { type: 'FIND_MATCH'; payload: { name: string; avatarEmoji?: string; language?: string } }
  | { type: 'CANCEL_MATCH'; payload?: Record<string, never> }
  | { type: 'TOGGLE_READY'; payload?: { ready?: boolean } }
  | { type: 'START_RACE'; payload?: Record<string, never> }
  | {
      type: 'PROGRESS_UPDATE';
      payload: {
        correctChars: number;
        incorrectChars: number;
        totalChars: number;
        wpm: number;
        accuracy: number;
        completed: boolean;
      };
    }
  | { type: 'REQUEST_REMATCH'; payload?: Record<string, never> }
  | { type: 'PING'; payload?: { timestamp: number } };

// ─── SERVER -> CLIENT EVENTS ───

export type ServerMessage =
  | { type: 'CONNECTED'; payload: { sessionToken: string; playerId: string } }
  | { type: 'ROOM_CREATED'; payload: { room: Room; myPlayerId: string } }
  | { type: 'ROOM_JOINED'; payload: { room: Room; myPlayerId: string } }
  | { type: 'ROOM_UPDATED'; payload: { room: Room } }
  | { type: 'MATCH_SEARCHING'; payload: { message: string } }
  | { type: 'MATCH_FOUND'; payload: { roomCode: string; room?: Room } }
  | { type: 'RACE_COUNTDOWN'; payload: { startAt: number; text: string; textTitle: string } }
  | { type: 'RACE_STARTED'; payload: { startAt: number; durationSeconds: number } }
  | {
      type: 'PLAYER_PROGRESS';
      payload: {
        playerId: string;
        progress: number;
        correctChars: number;
        wpm: number;
        accuracy: number;
      };
    }
  | {
      type: 'PLAYER_FINISHED';
      payload: {
        playerId: string;
        name: string;
        rank: number;
        wpm: number;
        accuracy: number;
        timeTakenSeconds: number;
      };
    }
  | { type: 'RACE_FINISHED'; payload: { rankings: RaceRankingItem[]; reason: 'completed' | 'timeout' } }
  | { type: 'REMATCH_ACCEPTED'; payload: { room: Room } }
  | { type: 'HOST_CHANGED'; payload: { newHostId: string; newHostName: string } }
  | { type: 'PLAYER_DISCONNECTED'; payload: { playerId: string; name: string; graceRemainingSeconds: number } }
  | { type: 'PLAYER_RECONNECTED'; payload: { playerId: string; name: string } }
  | { type: 'ERROR'; payload: { code: string; message: string } }
  | { type: 'PONG'; payload: { timestamp: number } };

export const MULTIPLAYER_CONSTANTS = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS_TO_START: 2,
  DEFAULT_RACE_DURATION_SECONDS: 60,
  COUNTDOWN_DURATION_MS: 3600,
  DISCONNECT_GRACE_PERIOD_MS: 25000,
  ROOM_CLEANUP_INTERVAL_MS: 30000,
  MAX_WPM_LIMIT: 260,
  MATCHMAKING_TIMEOUT_MS: 60000,
} as const;
