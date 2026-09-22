/**
 * Classroom Memory Cleanup Manager
 * Automatically purges expired, abandoned, and inactive classrooms from server memory.
 * Guarantees zero memory leaks with in-memory state.
 */

import { ClassroomManager } from './ClassroomManager.ts';

const SWEEP_INTERVAL_MS = 30_000; // Sweep every 30s
const ABANDONED_TIMEOUT_MS = 20 * 60_000; // 20 minutes of total inactivity
const ENDED_ROOM_GRACE_MS = 5 * 60_000; // 5 minutes after ended
const DISCONNECTED_STUDENT_GRACE_MS = 3 * 60_000; // 3 minutes for disconnected student
const EMPTY_ROOM_GRACE_MS = 5 * 60_000; // 5 minutes for completely empty room

export class ClassroomCleanupManager {
  private timer: NodeJS.Timeout | null = null;
  private manager: ClassroomManager;

  constructor(manager: ClassroomManager) {
    this.manager = manager;
  }

  public start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.runCleanupSweep();
    }, SWEEP_INTERVAL_MS);
    console.log('[ClassroomCleanupManager] Scheduled automatic memory sweeps');
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public runCleanupSweep(): void {
    const now = Date.now();
    const rooms = this.manager.getAllRooms();

    for (const room of rooms) {
      // 1. Check if room is ended and beyond grace period
      if (room.status === 'ENDED') {
        if (now - room.lastActivityAt > ENDED_ROOM_GRACE_MS) {
          console.log(`[ClassroomCleanupManager] Purging ended room ${room.code}`);
          this.manager.removeRoom(room.code);
          continue;
        }
      }

      // 2. Check if room is abandoned (no activity for 20 minutes)
      if (now - room.lastActivityAt > ABANDONED_TIMEOUT_MS) {
        console.log(`[ClassroomCleanupManager] Purging inactive room ${room.code}`);
        this.manager.removeRoom(room.code);
        continue;
      }

      // 3. Check for empty rooms (0 students & teacher disconnected)
      const studentCount = Object.keys(room.students).length;
      if (studentCount === 0 && room.teacherDisconnectedAt) {
        if (now - room.teacherDisconnectedAt > EMPTY_ROOM_GRACE_MS) {
          console.log(`[ClassroomCleanupManager] Purging empty abandoned room ${room.code}`);
          this.manager.removeRoom(room.code);
          continue;
        }
      }

      // 4. Clean disconnected students after grace period
      for (const [studentId, student] of Object.entries(room.students)) {
        if (student.status === 'DISCONNECTED' && student.disconnectedAt) {
          if (now - student.disconnectedAt > DISCONNECTED_STUDENT_GRACE_MS) {
            delete room.students[studentId];
            console.log(`[ClassroomCleanupManager] Evicted stale disconnected student ${studentId} from ${room.code}`);
          }
        }
      }
    }
  }
}
