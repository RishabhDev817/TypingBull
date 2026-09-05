import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { handleGeminiChat, type ChatRequestBody } from './server/geminiChat.ts'

function geminiDevApiPlugin(): Plugin {
  return {
    name: 'gemini-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let rawBody = '';
          req.on('data', (chunk: Buffer) => {
            rawBody += chunk.toString();
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const body: ChatRequestBody = JSON.parse(rawBody || '{}');
              const env = loadEnv(server.config.mode, process.cwd(), '');
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
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geminiDevApiPlugin(),
  ],
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
