import { handleGeminiChat, type ChatRequestBody } from '../../server/geminiChat';
import {
  clientIp,
  corsHeaders,
  isAllowedOrigin,
  jsonResponse,
  readJsonBody,
  takeRateLimit,
} from '../../server/apiSecurity';

interface Env {
  GEMINI_API_KEY?: string;
}

const FRIENDLY_ERROR = "Oops, my circuits crossed. Let's try that again!";
const MAX_BODY_BYTES = 40_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2_000;
const RATE_LIMIT = 20; // requests per IP
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

export async function onRequestOptions(context: { request: Request }) {
  const origin = context.request.headers.get('Origin');
  return new Response(null, { status: isAllowedOrigin(origin) ? 204 : 403, headers: corsHeaders(origin) });
}

/** Keep only well-formed, size-limited turns so the request can't be used to burn the Gemini quota. */
function sanitizeBody(body: ChatRequestBody | null): ChatRequestBody | null {
  if (!body || !Array.isArray(body.chatHistory)) return null;
  const chatHistory = body.chatHistory
    .slice(-MAX_MESSAGES)
    .filter((m) => m && (m.role === 'user' || m.role === 'model') && Array.isArray(m.parts))
    .map((m) => ({
      role: m.role,
      parts: [{ text: m.parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('\n').slice(0, MAX_MESSAGE_CHARS) }],
    }));
  if (chatHistory.length === 0) return null;
  return { chatHistory, userData: typeof body.userData === 'object' ? body.userData : undefined };
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request } = context;
  const origin = request.headers.get('Origin');
  const headers = corsHeaders(origin);

  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ error: 'Forbidden', message: FRIENDLY_ERROR }, 403, headers);
  }
  if (!takeRateLimit(`chat:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return jsonResponse(
      { error: 'Too many requests', message: "BullBot needs a short breather. Try again in a few minutes! 🐂" },
      429,
      { ...headers, 'Retry-After': '600' }
    );
  }

  const body = sanitizeBody(await readJsonBody<ChatRequestBody>(request, MAX_BODY_BYTES));
  if (!body) {
    return jsonResponse({ error: 'Invalid request', message: FRIENDLY_ERROR }, 400, headers);
  }

  const apiKey =
    context.env?.GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
  if (!apiKey) {
    console.warn('[Cloudflare Pages BullBot] GEMINI_API_KEY is not configured.');
    return jsonResponse({ error: 'Service unavailable', message: FRIENDLY_ERROR }, 503, headers);
  }

  try {
    const result = await handleGeminiChat(body, apiKey);
    return jsonResponse({ reply: result.text }, 200, headers);
  } catch (err: unknown) {
    // Log the details for us; never send internal error text to the browser.
    console.error('[Cloudflare Pages BullBot Error]:', err instanceof Error ? err.message : String(err));
    return jsonResponse({ error: 'Chat failed', message: FRIENDLY_ERROR }, 500, headers);
  }
}
