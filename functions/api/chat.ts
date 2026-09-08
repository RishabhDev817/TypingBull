import { handleGeminiChat, type ChatRequestBody } from '../../server/geminiChat';

interface Env {
  GEMINI_API_KEY?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: ChatRequestBody = await context.request.json();
    const apiKey =
      context.env?.GEMINI_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

    if (!apiKey) {
      console.warn('[Cloudflare Pages BullBot] GEMINI_API_KEY is not configured.');
      return new Response(
        JSON.stringify({
          error: 'Missing GEMINI_API_KEY',
          message: "Oops, my circuits crossed. Let's try that again!",
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );
    }

    const result = await handleGeminiChat(body, apiKey);
    return new Response(JSON.stringify({ reply: result.text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Cloudflare Pages BullBot Error]:', errorMsg);
    return new Response(
      JSON.stringify({
        error: errorMsg,
        message: "Oops, my circuits crossed. Let's try that again!",
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    );
  }
}

