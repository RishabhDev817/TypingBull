import { defineConfig, loadEnv, type Plugin, type ViteDevServer, type PreviewServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { handleGeminiChat, type ChatRequestBody } from './server/geminiChat.ts'
import { MultiplayerServer } from './server/multiplayer/multiplayerServer.ts'
import { ClassroomServer } from './server/classroom/ClassroomServer.ts'

function multiplayerDevPlugin(): Plugin {
  let mpServer: MultiplayerServer | null = null;
  const attachServer = (httpServer: any) => {
    if (httpServer && !mpServer) {
      mpServer = new MultiplayerServer({
        server: httpServer,
        path: '/practice-ground-ws',
      });
    }
  };
  return {
    name: 'multiplayer-dev-server',
    configureServer(server: ViteDevServer) {
      attachServer(server.httpServer);
    },
    configurePreviewServer(server: PreviewServer) {
      attachServer(server.httpServer);
    },
  };
}

function classroomDevPlugin(): Plugin {
  let classroomServer: ClassroomServer | null = null;
  const attachServer = (httpServer: any) => {
    if (httpServer && !classroomServer) {
      classroomServer = new ClassroomServer({
        server: httpServer,
        path: '/classroom-ws',
      });
    }
  };
  return {
    name: 'classroom-dev-server',
    configureServer(server: ViteDevServer) {
      attachServer(server.httpServer);
    },
    configurePreviewServer(server: PreviewServer) {
      attachServer(server.httpServer);
    },
  };
}

function geminiDevApiPlugin(): Plugin {
  const attachApi = (middlewares: any, mode: string) => {
    middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        let rawBody = '';
        req.on('data', (chunk: Buffer) => {
          rawBody += chunk.toString();
        });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body: ChatRequestBody = JSON.parse(rawBody || '{}');
            const env = loadEnv(mode, process.cwd(), '');
            const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

            if (!apiKey) {
              console.warn('[Vite Dev API] GEMINI_API_KEY is not set in .env');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: 'MISSING_API_KEY',
                  message: "Oops, my circuits crossed. Let's try that again!",
                })
              );
              return;
            }

            const result = await handleGeminiChat(body, apiKey);
            res.statusCode = 200;
            res.end(JSON.stringify({ reply: result.text }));
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error('[Vite Dev API Error]:', errMsg);
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: errMsg,
                message: "Oops, my circuits crossed. Let's try that again!",
              })
            );
          }
        });
        return;
      }

      if (req.url === '/api/feedback' && req.method === 'POST') {
        let rawBody = '';
        req.on('data', (chunk: Buffer) => {
          rawBody += chunk.toString();
        });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body = JSON.parse(rawBody || '{}');
            if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Message is required.' }));
              return;
            }
            const feedbackId = `dev_${Date.now()}`;
            console.log('[Vite Dev Feedback API Received]:', body);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, id: feedbackId }));
          } catch (err: unknown) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'gemini-dev-api',
    configureServer(server: ViteDevServer) {
      attachApi(server.middlewares, server.config.mode);
    },
    configurePreviewServer(server: PreviewServer) {
      attachApi(server.middlewares, server.config.mode);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geminiDevApiPlugin(),
    multiplayerDevPlugin(),
    classroomDevPlugin(),
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        about: resolve(process.cwd(), 'about/index.html'),
        privacy: resolve(process.cwd(), 'privacy/index.html'),
        terms: resolve(process.cwd(), 'terms/index.html'),
        contact: resolve(process.cwd(), 'contact/index.html'),
      },
    },
  },
})
