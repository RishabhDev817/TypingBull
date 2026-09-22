/**
 * Standalone Production-Ready Classroom Server for TypingBull
 * Phase 1: Real-Time In-Memory Classroom Experience
 *
 * Can be run with:
 *   node --experimental-strip-types server/standaloneClassroom.ts
 */

import http from 'node:http';
import { ClassroomServer } from './classroom/ClassroomServer.ts';

const PORT = Number(process.env.PORT || process.env.CLASSROOM_PORT || 3002);

const httpServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'typingbull-classroom-server',
        uptime: process.uptime(),
      })
    );
    return;
  }

  if (req.url === '/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        activeRooms: classroomServer.manager.getRoomCount(),
      })
    );
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const classroomServer = new ClassroomServer({
  server: httpServer,
  path: '/classroom-ws',
});

httpServer.listen(PORT, () => {
  console.log(`[Classroom Standalone] HTTP & WebSocket Server listening on http://localhost:${PORT}`);
  console.log(`[Classroom Standalone] WebSocket path: ws://localhost:${PORT}/classroom-ws`);
});
