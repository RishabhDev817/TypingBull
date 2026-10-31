/**
 * Frontend Classroom Types
 */

export type ClassroomStatus = 'WAITING' | 'STARTING' | 'ACTIVE' | 'FINISHED' | 'ENDED';
export type StudentStatus = 'NOT_READY' | 'READY' | 'TYPING' | 'FINISHED' | 'DISCONNECTED';
export type SocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'ERROR';
export type ClassroomRole = 'teacher' | 'student';

export type ClassroomActivityType = 'practice' | 'lesson' | 'game';
export type ClassroomSessionType = 'passage' | 'curriculum' | 'game';

export interface ClassroomSettings {
  activityType: ClassroomActivityType;
  session_type?: ClassroomSessionType;
  lesson_id?: number | string;
  activeAssignmentId?: string;
  passageId: string;
  passageTitle: string;
  targetText: string;
  durationSeconds: number;
  minStudents: number;
  maxStudents: number;
  lessonId?: string;
  gameId?: 'lilypad-leap' | 'neon-velocity';
  assignmentCategory?: string;
  targetKeys?: string[];
  assignmentId?: string;
  assignedAt?: number;
  teacherNote?: string;
  previousAssignments?: Array<{
    assignmentId: string;
    lessonId: number | string;
    title: string;
    assignedAt: number;
  }>;
  assignments?: ClassroomAssignment[];
}

export interface ClassroomAssignment {
  assignmentId: string;
  lessonId: number;
  title: string;
  chapterTitle?: string;
  chapterId?: string;
  description?: string;
  order: number;
  assignedAt: number;
  targetKeys?: string[];
  passingAccuracy?: number;
  targetText?: string;
  durationSeconds?: number;
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
  currentAssignmentIndex?: number;
  completedLessonIds?: number[];
  assignmentProgress?: Record<string, {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    progress: number;
    wpm: number;
    accuracy: number;
    completedAt?: number;
  }>;
}

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

export interface StudentProgressUpdate {
  progress: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  lessonId?: number;
  assignmentId?: string;
}

export interface StudentFinishPayload {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeSpentSec: number;
  lessonId?: number;
  assignmentId?: string;
  isCompleted?: boolean;
}

export type ClientMessage =
  | { type: 'CREATE_CLASSROOM'; payload: { teacherName?: string; initialAssignments?: ClassroomAssignment[]; initialSettings?: Partial<ClassroomSettings> } }
  | { type: 'JOIN_CLASSROOM'; payload: { code: string; studentName: string; avatarEmoji?: string; sessionToken?: string } }
  | { type: 'STUDENT_READY'; payload: { isReady: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: { teacherToken: string; settings: Partial<ClassroomSettings> } }
  | { type: 'START_SESSION'; payload: { teacherToken: string } }
  | { type: 'STUDENT_PROGRESS'; payload: StudentProgressUpdate & { lessonId?: number; assignmentId?: string } }
  | { type: 'STUDENT_FINISH'; payload: StudentFinishPayload & { lessonId?: number; assignmentId?: string } }
  | { type: 'END_CLASSROOM'; payload: { teacherToken: string } }
  | { type: 'RECONNECT'; payload: { sessionToken: string; code: string; role: 'teacher' | 'student' } }
  | { type: 'LEAVE_CLASSROOM'; payload?: Record<string, never> }
  | { type: 'PING'; payload?: { timestamp?: number } };

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
