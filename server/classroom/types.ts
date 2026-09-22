/**
 * Classroom Real-Time In-Memory Types & WebSocket Protocols
 * Phase 1: Pure in-memory state with zero persistent database.
 */

export type ClassroomStatus = 'WAITING' | 'STARTING' | 'ACTIVE' | 'FINISHED' | 'ENDED';

export type StudentStatus = 'NOT_READY' | 'READY' | 'TYPING' | 'FINISHED' | 'DISCONNECTED';

export interface ClassroomSettings {
  activityType: 'practice';
  passageId: string;
  passageTitle: string;
  targetText: string;
  durationSeconds: number; // e.g. 60, 180, 300
  minStudents: number;
  maxStudents: number;
}

export interface ClassroomStudent {
  id: string;
  sessionToken: string;
  name: string;
  avatarEmoji: string;
  isReady: boolean;
  status: StudentStatus;
  progress: number; // 0 to 1
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  finishedAt?: number;
  rank?: number;
  disconnectedAt?: number;
}

export interface StudentProgressUpdate {
  progress: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface StudentFinishPayload {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeSpentSec: number;
}

export interface ClassroomResultItem {
  playerId: string;
  name: string;
  avatarEmoji: string;
  rank: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  timeSpentSec: number;
}

export interface ClassroomResultsView {
  results: ClassroomResultItem[];
  classAverageWpm: number;
  classAverageAccuracy: number;
  totalStudents: number;
  completedCount: number;
  durationSeconds: number;
  passageTitle: string;
}

export interface ClassroomRoom {
  code: string; // 6-character room code (e.g. A7K9P2)
  roomId: string;
  teacherToken: string;
  teacherId: string;
  teacherName: string;
  status: ClassroomStatus;
  settings: ClassroomSettings;
  students: Record<string, ClassroomStudent>;
  countdownStartAt: number | null;
  sessionStartAt: number | null;
  sessionEndAt: number | null;
  createdAt: number;
  lastActivityAt: number;
  teacherDisconnectedAt?: number;
  results: ClassroomResultItem[];
}

/** Sanitized room view sent to clients (hides teacherToken) */
export interface ClassroomRoomView {
  code: string;
  teacherName: string;
  isTeacherConnected: boolean;
  status: ClassroomStatus;
  settings: ClassroomSettings;
  students: ClassroomStudentView[];
  studentCount: number;
  readyCount: number;
  countdownStartAt: number | null;
  sessionStartAt: number | null;
  sessionEndAt: number | null;
  createdAt: number;
}

export interface ClassroomStudentView {
  id: string;
  name: string;
  avatarEmoji: string;
  isReady: boolean;
  status: StudentStatus;
  progress: number;
  wpm: number;
  accuracy: number;
  rank?: number;
  finishedAt?: number;
}

// ─── WebSocket Client Messages (Client -> Server) ───
export type ClientMessage =
  | { type: 'CREATE_CLASSROOM'; payload: { teacherName?: string } }
  | { type: 'JOIN_CLASSROOM'; payload: { code: string; studentName: string; avatarEmoji?: string; sessionToken?: string } }
  | { type: 'STUDENT_READY'; payload: { isReady: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: { teacherToken: string; settings: Partial<ClassroomSettings> } }
  | { type: 'START_SESSION'; payload: { teacherToken: string } }
  | { type: 'STUDENT_PROGRESS'; payload: StudentProgressUpdate }
  | { type: 'STUDENT_FINISH'; payload: StudentFinishPayload }
  | { type: 'END_CLASSROOM'; payload: { teacherToken: string } }
  | { type: 'RECONNECT'; payload: { sessionToken: string; code: string; role: 'teacher' | 'student' } }
  | { type: 'LEAVE_CLASSROOM'; payload?: Record<string, never> }
  | { type: 'PING'; payload?: { timestamp?: number } };

// ─── WebSocket Server Messages (Server -> Client) ───
export type ServerMessage =
  | { type: 'CONNECTED'; payload: { sessionToken: string } }
  | { type: 'CLASSROOM_CREATED'; payload: { code: string; teacherToken: string; room: ClassroomRoomView } }
  | { type: 'CLASSROOM_JOINED'; payload: { studentId: string; sessionToken: string; room: ClassroomRoomView } }
  | { type: 'ROOM_UPDATED'; payload: { room: ClassroomRoomView } }
  | { type: 'STUDENT_LIST_UPDATED'; payload: { students: ClassroomStudentView[]; studentCount: number; readyCount: number } }
  | { type: 'SESSION_START_SCHEDULED'; payload: { countdownStartAt: number; sessionStartAt: number; sessionEndAt: number; settings: ClassroomSettings } }
  | { type: 'SESSION_STARTED'; payload: { sessionStartAt: number; sessionEndAt: number } }
  | { type: 'STUDENT_PROGRESS_BROADCAST'; payload: { studentId: string; progress: number; wpm: number; accuracy: number; finished: boolean } }
  | { type: 'STUDENT_FINISHED_BROADCAST'; payload: { studentId: string; studentName: string; rank: number; wpm: number; accuracy: number } }
  | { type: 'SESSION_FINISHED'; payload: { results: ClassroomResultsView } }
  | { type: 'CLASSROOM_ENDED'; payload: { reason: string } }
  | { type: 'RECONNECT_SUCCESS'; payload: { role: 'teacher' | 'student'; studentId?: string; room: ClassroomRoomView } }
  | { type: 'ERROR'; payload: { code: string; message: string } }
  | { type: 'PONG'; payload?: { timestamp?: number } };
