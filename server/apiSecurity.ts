/**
 * Shared protections for the public API endpoints (/api/chat, /api/feedback).
 *
 * - Origin allowlist: browsers on other sites can't call the endpoints.
 * - Per-IP rate limit: best effort, per Cloudflare isolate (memory is not shared between
 *   isolates). Pair it with a Cloudflare WAF rate-limiting rule for a hard global limit.
 * - HTML escaping for anything placed into emails.
 */

const ALLOWED_ORIGINS = new Set(['https://typingbull.com', 'https://www.typingbull.com']);

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const { protocol, hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    // Cloudflare Pages preview deployments of this project
    return protocol === 'https:' && (hostname === 'typingbull-bxe.pages.dev' || hostname.endsWith('.typingbull-bxe.pages.dev'));
  } catch {
    return false;
  }
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    'unknown'
  );
}

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Returns true when the request is allowed; false when `key` has used up `limit` in the window. */
export function takeRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function jsonResponse(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/** Reads a JSON body, refusing anything larger than maxBytes. Returns null on oversize or bad JSON. */
export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T | null> {
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > maxBytes) return null;
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
