/**
 * Standalone Production-Ready Multiplayer Server for Practice Ground
 * Can be run independently on Node.js with:
 *   node --experimental-strip-types server/standaloneMultiplayer.ts
 */

import http from 'node:http';
import { MultiplayerServer } from './multiplayer/multiplayerServer.ts';

const PORT = Number(process.env.PORT || process.env.MULTIPLAYER_PORT || 3001);

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
    res.end(JSON.stringify({ status: 'ok', service: 'practice-ground-multiplayer', uptime: process.uptime() }));
    return;
  }

  if (req.url === '/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        rooms: multiplayerServer.roomManager.getRoomCount(),
        connections: multiplayerServer.connectionManager.getConnectionCount(),
        queueSize: multiplayerServer.matchmakingManager.getQueueSize(),
      })
    );
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const multiplayerServer = new MultiplayerServer({
  server: httpServer,
  path: '/practice-ground-ws',
});

httpServer.listen(PORT, () => {
  console.log(`[Practice Ground Standalone] HTTP & WebSocket Server listening on http://localhost:${PORT}`);
  console.log(`[Practice Ground Standalone] WebSocket path: ws://localhost:${PORT}/practice-ground-ws`);
});
