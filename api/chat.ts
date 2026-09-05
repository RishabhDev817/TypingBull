/**
 * Secure Backend API Route for BullBot Chat (Google Gemini API)
 * Supports:
 * - Next.js App Router (POST export)
 * - Next.js Pages Router & Node.js / Express (default handler export)
 *
 * Requirements:
 * - Environment variable: GEMINI_API_KEY
 */

import { handleGeminiChat, type ChatRequestBody } from '../server/geminiChat';

const FALLBACK_ERROR_MESSAGE = "Oops, my circuits crossed. Let's try that again!";

// ── Next.js App Router Handler (e.g. app/api/chat/route.ts) ──
export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('[BullBot API] GEMINI_API_KEY is not set in environment.');
      return new Response(
        JSON.stringify({
          error: 'Missing GEMINI_API_KEY',
          message: FALLBACK_ERROR_MESSAGE,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await handleGeminiChat(body, apiKey);
    return new Response(JSON.stringify({ reply: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[BullBot API Error]:', errorMsg);
    return new Response(
      JSON.stringify({
        error: errorMsg,
        message: FALLBACK_ERROR_MESSAGE,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ── Next.js Pages Router / Node HTTP / Express Compatible Handler ──
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body: ChatRequestBody =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('[BullBot API] GEMINI_API_KEY is not set in environment.');
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY',
        message: FALLBACK_ERROR_MESSAGE,
      });
    }

    const result = await handleGeminiChat(body, apiKey);
    return res.status(200).json({ reply: result.text });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[BullBot API Error]:', errorMsg);
    return res.status(500).json({
      error: errorMsg,
      message: FALLBACK_ERROR_MESSAGE,
    });
  }
}
