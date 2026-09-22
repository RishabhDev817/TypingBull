/**
 * In-Memory Classroom Room & Session Manager
 * Phase 1: Pure in-memory state. No persistent database.
 */

import {
  type ClassroomRoom,
  type ClassroomRoomView,
  type ClassroomStudent,
  type ClassroomStudentView,
  type ClassroomSettings,
  type StudentProgressUpdate,
  type StudentFinishPayload,
  type ClassroomResultItem,
  type ClassroomResultsView,
} from './types.ts';

// Standard curated TypingBull passages for Phase 1 Classroom
export const DEFAULT_CLASSROOM_PASSAGES = [
  {
    id: 'passage-fable-morning',
    title: 'Morning in the Valley',
    targetWPM: 30,
    text: 'The morning sun rose gently over the emerald hills, painting the river with strokes of liquid gold. In the meadow below, a young deer paused by the edge of the crystal spring, listening to the melodic songs of early robins. Every pine needle glistened with dew, and a quiet breeze carried the sweet scent of wild honeysuckle through the tranquil forest trail.',
  },
  {
    id: 'passage-orchard-path',
    title: 'The Orchard Path',
    targetWPM: 32,
    text: 'Along the winding stone wall of the old orchard, sweet apples hung heavy on mossy boughs. Thomas carried a willow basket in his left hand, whistling a cheerful melody as autumn leaves danced around his boots. The afternoon air was crisp and refreshing, promising warm cider and crackling hearth fires as twilight approached.',
  },
  {
    id: 'passage-clockmaker',
    title: 'The Clockmaker of Prague',
    targetWPM: 35,
    text: 'Deep within the cobbled alleys of the old city, Master Jan examined the intricate bronze escapement with a brass magnifying loupe. Each delicate tooth required millimeter precision, cut by hand with fine jeweler saws. The gentle ticking of forty antique pendulum clocks formed a soothing rhythm that had filled the vaulted workshop for over four decades.',
  },
  {
    id: 'passage-ocean-tides',
    title: 'Voyage Beyond the Reef',
    targetWPM: 40,
    text: 'As the caravel pushed past the outer breakwater, towering sapphire swells lifted the wooden hull with majestic power. Captain Alverez adjusted the brass sextant toward the northern star, plotting a course across uncharted waters. Sea spray misted the canvas sails, and soaring albatrosses heralded the vast and limitless ocean ahead.',
  },
];

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Unambiguous chars (omits 0, O, 1, I)

export class ClassroomManager {
  // Keyed by uppercase room code (e.g. "A7K9P2")
  private rooms = new Map<string, ClassroomRoom>();

  constructor() {
    console.log('[ClassroomManager] In-memory classroom state initialized (No Database)');
  }

  /** Generate a unique 6-character room code */
  private generateUniqueCode(): string {
    let attempts = 0;
    while (attempts < 1000) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
        code += CODE_ALPHABET[idx];
      }
      if (!this.rooms.has(code)) {
        return code;
      }
      attempts++;
    }
    // Fallback if very crowded
    return `TB${Date.now().toString(36).slice(-4).toUpperCase()}`;
  }

  /** Sanitize student display names to prevent XSS and layout issues */
  public sanitizeName(raw: string): string {
    if (!raw) return 'Student';
    // Remove HTML tags, special control chars, collapse spaces
    const clean = raw.replace(/<[^>]*>?/gm, '').replace(/[^\p{L}\p{N}\s_\-]/gu, '').trim();
    if (!clean || clean.length < 2) return 'Student';
    const truncated = clean.slice(0, 20);

    const normalized = truncated
      .toLowerCase()
      .replace(/[@4]/g, 'a')
      .replace(/[$5]/g, 's')
      .replace(/[1!|]/g, 'i')
      .replace(/[0]/g, 'o')
      .replace(/[3]/g, 'e')
      .replace(/[^a-z]/g, '')
      .replace(/(.)\1{2,}/g, '$1$1');

    const blockedWords = ['nigger', 'nigga', 'faggot', 'fag', 'kike', 'chink', 'spic', 'cunt', 'whore', 'slut', 'retard', 'hitler', 'nazi', 'pedophile', 'pedo', 'dickhead', 'motherfucker', 'asshole', 'bitch', 'fuck', 'shit', 'penis', 'vagina', 'dildo', 'cock', 'pussy'];
    if (blockedWords.some((word) => normalized.includes(word))) {
      return `Student-${Math.floor(100 + Math.random() * 900)}`;
    }

    return truncated;
  }

  /** Create a new classroom room with default settings */
  public createRoom(teacherId: string, teacherToken: string, teacherName?: string): ClassroomRoom {
    const code = this.generateUniqueCode();
    const defaultPassage = DEFAULT_CLASSROOM_PASSAGES[0];

    const defaultSettings: ClassroomSettings = {
      activityType: 'practice',
      passageId: defaultPassage.id,
      passageTitle: defaultPassage.title,
      targetText: defaultPassage.text,
      durationSeconds: 300, // 5 minutes default
      minStudents: 1, // Allow testing with 1 or full class
      maxStudents: 30, // Classroom computer lab capacity
    };

    const room: ClassroomRoom = {
      code,
      roomId: `cr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      teacherToken,
      teacherId,
      teacherName: this.sanitizeName(teacherName || 'Teacher'),
      status: 'WAITING',
      settings: defaultSettings,
      students: {},
      countdownStartAt: null,
      sessionStartAt: null,
      sessionEndAt: null,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      results: [],
    };

    this.rooms.set(code, room);
    console.log(`[ClassroomManager] Created classroom ${code} by teacher ${room.teacherName}`);
    return room;
  }

  /** Get room by code */
  public getRoom(code: string): ClassroomRoom | null {
    if (!code) return null;
    return this.rooms.get(code.toUpperCase().trim()) || null;
  }

  /** Validate and join a student to a classroom */
  public joinRoom(
    code: string,
    studentId: string,
    sessionToken: string,
    studentName: string,
    avatarEmoji = '🐂'
  ): { room: ClassroomRoom; student: ClassroomStudent } | { error: { code: string; message: string } } {
    const normalizedCode = (code || '').toUpperCase().trim();
    const room = this.rooms.get(normalizedCode);

    if (!room) {
      return { error: { code: 'INVALID_CODE', message: 'This classroom code is not valid.' } };
    }

    if (room.status === 'ENDED') {
      return { error: { code: 'ROOM_ENDED', message: 'This classroom has ended.' } };
    }

    // Check if this student is already in the room (e.g. reconnecting)
    const existingStudent = Object.values(room.students).find(
      (s) => s.sessionToken === sessionToken || s.id === studentId
    );

    if (existingStudent) {
      // Re-attach existing student
      existingStudent.id = studentId;
      existingStudent.disconnectedAt = undefined;
      if (existingStudent.status === 'DISCONNECTED') {
        existingStudent.status = existingStudent.isReady ? 'READY' : 'NOT_READY';
      }
      room.lastActivityAt = Date.now();
      return { room, student: existingStudent };
    }

    // If session is already active and new student tries to join
    if (room.status === 'ACTIVE' || room.status === 'STARTING') {
      return { error: { code: 'ALREADY_STARTED', message: 'This session has already started.' } };
    }

    // Capacity check
    const currentStudentCount = Object.keys(room.students).length;
    if (currentStudentCount >= room.settings.maxStudents) {
      return { error: { code: 'ROOM_FULL', message: 'This classroom is full (maximum 30 students).' } };
    }

    const sanitizedName = this.sanitizeName(studentName);

    const newStudent: ClassroomStudent = {
      id: studentId,
      sessionToken,
      name: sanitizedName,
      avatarEmoji: avatarEmoji || '🐂',
      isReady: false,
      status: 'NOT_READY',
      progress: 0,
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    };

    room.students[studentId] = newStudent;
    room.lastActivityAt = Date.now();

    console.log(`[ClassroomManager] Student ${sanitizedName} (${studentId}) joined room ${normalizedCode}`);
    return { room, student: newStudent };
  }

  /** Toggle student ready state */
  public setStudentReady(code: string, studentId: string, isReady: boolean): ClassroomRoom | null {
    const room = this.getRoom(code);
    if (!room) return null;
    const student = room.students[studentId];
    if (!student) return null;

    if (room.status !== 'WAITING') return room;

    student.isReady = isReady;
    student.status = isReady ? 'READY' : 'NOT_READY';
    room.lastActivityAt = Date.now();
    return room;
  }

  /** Teacher updates settings (passage or duration) */
  public updateSettings(
    code: string,
    teacherToken: string,
    newSettings: Partial<ClassroomSettings>
  ): ClassroomRoom | null {
    const room = this.getRoom(code);
    if (!room) return null;
    if (room.teacherToken !== teacherToken) return null;
    if (room.status !== 'WAITING') return null;

    if (newSettings.passageId) {
      const found = DEFAULT_CLASSROOM_PASSAGES.find((p) => p.id === newSettings.passageId);
      if (found) {
        room.settings.passageId = found.id;
        room.settings.passageTitle = found.title;
        room.settings.targetText = found.text;
      }
    }

    if (newSettings.durationSeconds && [60, 180, 300].includes(newSettings.durationSeconds)) {
      room.settings.durationSeconds = newSettings.durationSeconds;
    }

    room.lastActivityAt = Date.now();
    return room;
  }

  /** Teacher initiates synchronized session start */
  public startSession(
    code: string,
    teacherToken: string
  ):
    | { room: ClassroomRoom; countdownStartAt: number; sessionStartAt: number; sessionEndAt: number }
    | { error: { code: string; message: string } } {
    const room = this.getRoom(code);
    if (!room) {
      return { error: { code: 'NOT_FOUND', message: 'Room not found.' } };
    }
    if (room.teacherToken !== teacherToken) {
      return { error: { code: 'UNAUTHORIZED', message: 'Only the teacher can start the session.' } };
    }
    if (room.status !== 'WAITING') {
      return { error: { code: 'INVALID_STATE', message: 'Session cannot be started in current state.' } };
    }

    const studentCount = Object.keys(room.students).length;
    if (studentCount < room.settings.minStudents) {
      return { error: { code: 'NOT_ENOUGH_STUDENTS', message: 'Need at least 1 student to start.' } };
    }

    const now = Date.now();
    const countdownDuration = 4000; // 4 seconds for "3, 2, 1, GO!"
    const sessionStartAt = now + countdownDuration;
    const sessionEndAt = sessionStartAt + room.settings.durationSeconds * 1000;

    room.status = 'STARTING';
    room.countdownStartAt = now;
    room.sessionStartAt = sessionStartAt;
    room.sessionEndAt = sessionEndAt;
    room.results = [];

    // Reset student live stats for this race
    for (const student of Object.values(room.students)) {
      student.status = 'TYPING';
      student.progress = 0;
      student.wpm = 0;
      student.accuracy = 100;
      student.correctChars = 0;
      student.incorrectChars = 0;
      student.totalChars = 0;
      student.finishedAt = undefined;
      student.rank = undefined;
    }

    room.lastActivityAt = now;
    return { room, countdownStartAt: now, sessionStartAt, sessionEndAt };
  }

  /** Update student live typing progress */
  public updateStudentProgress(
    code: string,
    studentId: string,
    progress: StudentProgressUpdate
  ): { room: ClassroomRoom; student: ClassroomStudent } | null {
    const room = this.getRoom(code);
    if (!room) return null;
    const student = room.students[studentId];
    if (!student || student.status === 'FINISHED') return null;

    student.progress = Math.max(0, Math.min(1, progress.progress));
    student.wpm = Math.max(0, Math.round(progress.wpm));
    student.accuracy = Math.max(0, Math.min(100, Math.round(progress.accuracy * 10) / 10));
    student.correctChars = progress.correctChars;
    student.incorrectChars = progress.incorrectChars;
    student.totalChars = progress.totalChars;

    room.lastActivityAt = Date.now();
    return { room, student };
  }

  /** Student completed typing the assigned passage */
  public finishStudent(
    code: string,
    studentId: string,
    payload: StudentFinishPayload
  ): { room: ClassroomRoom; student: ClassroomStudent; allFinished: boolean; results?: ClassroomResultsView } | null {
    const room = this.getRoom(code);
    if (!room) return null;
    const student = room.students[studentId];
    if (!student || student.status === 'FINISHED') return null;

    student.status = 'FINISHED';
    student.progress = 1;
    student.wpm = Math.max(0, Math.round(payload.wpm));
    student.accuracy = Math.max(0, Math.min(100, Math.round(payload.accuracy * 10) / 10));
    student.correctChars = payload.correctChars;
    student.incorrectChars = payload.incorrectChars;
    student.totalChars = payload.totalChars;
    student.finishedAt = Date.now();

    // Assign rank based on finish order
    const finishedCount = Object.values(room.students).filter((s) => s.status === 'FINISHED').length;
    student.rank = finishedCount;

    // Check if all connected students have finished
    const connectedStudents = Object.values(room.students).filter((s) => s.status !== 'DISCONNECTED');
    const allFinished = connectedStudents.every((s) => s.status === 'FINISHED');

    let resultsView: ClassroomResultsView | undefined;
    if (allFinished) {
      resultsView = this.calculateResults(room);
      room.status = 'FINISHED';
    }

    room.lastActivityAt = Date.now();
    return { room, student, allFinished, results: resultsView };
  }

  /** Calculate complete classroom results view */
  public calculateResults(room: ClassroomRoom): ClassroomResultsView {
    const students = Object.values(room.students);

    // Sort: finished students first sorted by rank, then by progress/WPM
    const sorted = [...students].sort((a, b) => {
      if (a.status === 'FINISHED' && b.status === 'FINISHED') {
        return (a.rank || 99) - (b.rank || 99);
      }
      if (a.status === 'FINISHED') return -1;
      if (b.status === 'FINISHED') return 1;
      return b.progress - a.progress;
    });

    const resultItems: ClassroomResultItem[] = sorted.map((s, idx) => {
      const timeSpentSec = s.finishedAt && room.sessionStartAt
        ? Math.max(1, Math.round((s.finishedAt - room.sessionStartAt) / 1000))
        : room.settings.durationSeconds;

      return {
        playerId: s.id,
        name: s.name,
        avatarEmoji: s.avatarEmoji,
        rank: idx + 1,
        wpm: s.wpm,
        accuracy: s.accuracy,
        finished: s.status === 'FINISHED',
        timeSpentSec,
      };
    });

    room.results = resultItems;

    // Calculate class averages
    const totalWpm = resultItems.reduce((acc, curr) => acc + curr.wpm, 0);
    const totalAccuracy = resultItems.reduce((acc, curr) => acc + curr.accuracy, 0);
    const count = resultItems.length || 1;

    return {
      results: resultItems,
      classAverageWpm: Math.round(totalWpm / count),
      classAverageAccuracy: Math.round((totalAccuracy / count) * 10) / 10,
      totalStudents: resultItems.length,
      completedCount: resultItems.filter((r) => r.finished).length,
      durationSeconds: room.settings.durationSeconds,
      passageTitle: room.settings.passageTitle,
    };
  }

  /** End the room cleanly (Teacher action) */
  public endRoom(code: string, teacherToken: string): boolean {
    const room = this.getRoom(code);
    if (!room || room.teacherToken !== teacherToken) return false;
    room.status = 'ENDED';
    room.lastActivityAt = Date.now();
    return true;
  }

  /** Delete room from memory */
  public removeRoom(code: string): void {
    this.rooms.delete(code.toUpperCase().trim());
  }

  /** Convert internal room to sanitized client-safe view */
  public toRoomView(room: ClassroomRoom): ClassroomRoomView {
    const studentList = Object.values(room.students);
    const studentViews: ClassroomStudentView[] = studentList.map(this.toStudentView);
    const readyCount = studentList.filter((s) => s.isReady).length;

    return {
      code: room.code,
      teacherName: room.teacherName,
      isTeacherConnected: !room.teacherDisconnectedAt,
      status: room.status,
      settings: room.settings,
      students: studentViews,
      studentCount: studentList.length,
      readyCount,
      countdownStartAt: room.countdownStartAt,
      sessionStartAt: room.sessionStartAt,
      sessionEndAt: room.sessionEndAt,
      createdAt: room.createdAt,
    };
  }

  public toStudentView(student: ClassroomStudent): ClassroomStudentView {
    return {
      id: student.id,
      name: student.name,
      avatarEmoji: student.avatarEmoji,
      isReady: student.isReady,
      status: student.status,
      progress: student.progress,
      wpm: student.wpm,
      accuracy: student.accuracy,
      rank: student.rank,
      finishedAt: student.finishedAt,
    };
  }

  public getAllRooms(): ClassroomRoom[] {
    return Array.from(this.rooms.values());
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }
}
