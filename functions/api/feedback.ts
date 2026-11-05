/**
 * Cloudflare Pages Function: /api/feedback
 * Handles POST requests for user feedback and reviews (Feedback modal and Contact page).
 */
import {
  clientIp,
  corsHeaders,
  escapeHtml,
  isAllowedOrigin,
  jsonResponse,
  readJsonBody,
  takeRateLimit,
} from '../../server/apiSecurity';

interface FeedbackPayload {
  id?: unknown;
  userId?: unknown;
  feedbackType?: unknown;
  message?: unknown;
  useCase?: unknown;
  priority?: unknown;
  rating?: unknown;
  ratingComment?: unknown;
  email?: unknown;
  metadata?: unknown;
}

interface Env {
  RESEND_API_KEY?: string;
  /** Where feedback emails go. Set it in the Pages project settings. */
  FEEDBACK_TO_EMAIL?: string;
  SEND_EMAIL?: { send: (msg: unknown) => Promise<unknown> };
  EMAIL?: { send: (msg: unknown) => Promise<unknown> };
}

const FEEDBACK_TYPES = ['feature_request', 'bug_report', 'improvement', 'general'] as const;
const PRIORITIES = ['nice_to_have', 'really_help', 'need_this'] as const;
// Kept as the default so existing deployments keep delivering; override with FEEDBACK_TO_EMAIL.
const DEFAULT_RECIPIENT = 'rishabhrajmahato@gmail.com';
const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT = 5; // submissions per IP
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email);
}

export async function onRequestOptions(context: { request: Request }) {
  const origin = context.request.headers.get('Origin');
  return new Response(null, { status: isAllowedOrigin(origin) ? 204 : 403, headers: corsHeaders(origin) });
}

export async function onRequestPost(context: { request: Request; env?: Env }) {
  const { request } = context;
  const env = context.env || {};
  const origin = request.headers.get('Origin');
  const headers = corsHeaders(origin);

  if (!isAllowedOrigin(origin)) {
    return jsonResponse({ error: 'Forbidden.' }, 403, headers);
  }
  if (!takeRateLimit(`feedback:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return jsonResponse({ error: 'Too many submissions. Please try again later.' }, 429, { ...headers, 'Retry-After': '3600' });
  }

  const data = await readJsonBody<FeedbackPayload>(request, MAX_BODY_BYTES);
  if (!data || typeof data !== 'object') {
    return jsonResponse({ error: 'Invalid request.' }, 400, headers);
  }

  // 1. Validation: message is required and must be <= 1000 characters
  const rawMessage = typeof data.message === 'string' ? data.message.trim() : '';
  if (!rawMessage) {
    return jsonResponse({ error: 'Feedback message is required.' }, 400, headers);
  }
  if (rawMessage.length > 1000) {
    return jsonResponse({ error: 'Feedback message must be 1000 characters or fewer.' }, 400, headers);
  }

  // 2. Email validation if provided
  const email = str(data.email, 254);
  if (email && !isValidEmail(email)) {
    return jsonResponse({ error: 'Please provide a valid email address or leave it blank.' }, 400, headers);
  }

  // 3. Clean, typed record (only known values; everything else is dropped)
  const meta = data.metadata && typeof data.metadata === 'object' ? (data.metadata as Record<string, unknown>) : {};
  const rating = num(data.rating);
  const entry = {
    id: str(data.id, 64) || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: str(data.userId, 64) || 'anonymous',
    feedbackType: pick(data.feedbackType, FEEDBACK_TYPES, 'general'),
    priority: pick(data.priority, PRIORITIES, 'really_help'),
    message: rawMessage,
    useCase: Array.isArray(data.useCase) ? data.useCase.filter((u) => typeof u === 'string').slice(0, 10).map((u) => (u as string).slice(0, 60)) : [],
    rating: rating !== null && rating >= 1 && rating <= 5 ? Math.round(rating) : null,
    ratingComment: str(data.ratingComment, 500),
    email,
    createdAt: new Date().toISOString(),
    context: {
      name: str(meta.name, 80),
      category: str(meta.category, 80),
      source: str(meta.source, 40),
      currentWpm: num(meta.currentWpm) ?? 0,
      accuracy: num(meta.accuracy) ?? 0,
      currentStreak: num(meta.currentStreak) ?? 0,
      userLevel: str(meta.userLevel, 40) || (num(meta.userLevel) !== null ? String(meta.userLevel) : 'N/A'),
      totalSessions: num(meta.totalSessions) ?? 0,
    },
  };

  console.log('[Feedback Submission Received]:', JSON.stringify({ id: entry.id, type: entry.feedbackType, hasEmail: !!entry.email }));

  const ctx = entry.context;
  const emailSubject = `[TypingBull Feedback] ${entry.feedbackType.toUpperCase()}: ${entry.priority}`;
  const emailBody = `New TypingBull Feedback Received!

Feedback Type: ${entry.feedbackType}
Priority:      ${entry.priority}
From:          ${ctx.name || 'Not provided'}${ctx.category ? ` (${ctx.category})` : ''}
User Email:    ${entry.email || 'Anonymous learner (no email provided)'}
Rating:        ${entry.rating ? `${entry.rating} / 5 Stars` : 'Not rated'}
${entry.ratingComment ? `Rating Comment: ${entry.ratingComment}\n` : ''}
Use Cases / Exams: ${entry.useCase.length > 0 ? entry.useCase.join(', ') : 'None specified'}

Feedback Message:
------------------------------------
${entry.message}
------------------------------------

User Typing Context:
- Speed: ${ctx.currentWpm} WPM · Accuracy: ${ctx.accuracy}% · Streak: ${ctx.currentStreak} days
- Level: ${ctx.userLevel} · Sessions: ${ctx.totalSessions} · Source: ${ctx.source || 'feedback_modal'}
- Date: ${entry.createdAt}`;

  // Every user-supplied value is HTML-escaped before it goes into the email.
  const e = escapeHtml;
  const row = (label: string, value: string) =>
    `<p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">${label}:</strong> ${value}</p>`;
  const muted = (t: string) => `<em style="color: #64748b;">${t}</em>`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 16px; background-color: #0f172a; color: #f8fafc;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #a855f7; font-size: 20px; font-weight: 800;">TypingBull — New User Feedback</h2>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">A learner just submitted feedback on typingbull.com</p>
      </div>
      <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        ${row('Type', `<span style="background-color: #9333ea; color: white; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 12px;">${e(entry.feedbackType.toUpperCase())}</span>`)}
        ${row('Priority', e(entry.priority))}
        ${ctx.name || ctx.category ? row('From', `${e(ctx.name || 'Not provided')}${ctx.category ? ` · ${e(ctx.category)}` : ''}`) : ''}
        ${row('User Email', entry.email ? `<a href="mailto:${e(entry.email)}" style="color: #38bdf8;">${e(entry.email)}</a>` : muted('Not provided'))}
        ${row('Rating', entry.rating ? `⭐ ${entry.rating} / 5 Stars` : muted('Not rated'))}
        ${entry.ratingComment ? row('Rating Note', e(entry.ratingComment)) : ''}
        ${row('Use Cases / Exams', entry.useCase.length > 0 ? e(entry.useCase.join(', ')) : 'None specified')}
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">Message:</h3>
        <div style="background-color: rgba(255,255,255,0.08); border-left: 4px solid #a855f7; border-radius: 8px; padding: 14px; font-size: 15px; line-height: 1.5; color: #ffffff; white-space: pre-wrap;">${e(entry.message)}</div>
      </div>
      <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #94a3b8;">
        <strong style="color: #cbd5e1; display: block; margin-bottom: 6px;">Learner Typing Context:</strong>
        • Speed: <strong>${ctx.currentWpm} WPM</strong><br/>
        • Accuracy: <strong>${ctx.accuracy}%</strong><br/>
        • Daily Streak: <strong>${ctx.currentStreak} days</strong><br/>
        • Level: <strong>${e(ctx.userLevel)}</strong><br/>
        • Total Sessions: <strong>${ctx.totalSessions}</strong><br/>
        • Date: <strong>${e(entry.createdAt)}</strong>
      </div>
      <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-size: 11px; color: #64748b;">
        TypingBull Feedback Engine
      </div>
    </div>`;

  // 1. Dispatch via Cloudflare send_email binding (if configured)
  const emailService = env.SEND_EMAIL || env.EMAIL;
  if (emailService && typeof emailService.send === 'function') {
    try {
      await emailService.send({ to: 'feedback@typingbull.com', from: 'feedback@typingbull.com', subject: emailSubject, text: emailBody });
    } catch (cfEmailErr) {
      console.warn('[Cloudflare send_email Binding Error]:', cfEmailErr);
    }
  }

  // 2. Dispatch via Resend
  const resendApiKey = env.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);
  if (resendApiKey) {
    try {
      const recipient = env.FEEDBACK_TO_EMAIL || (typeof process !== 'undefined' ? process.env?.FEEDBACK_TO_EMAIL : undefined) || DEFAULT_RECIPIENT;
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: 'TypingBull Feedback <onboarding@resend.dev>',
          to: [recipient],
          subject: emailSubject,
          text: emailBody,
          html: htmlContent,
          reply_to: entry.email || undefined,
        }),
      });
      if (!resendRes.ok) console.warn('[Resend API Error]: status', resendRes.status);
    } catch (resendErr) {
      console.warn('[Resend API Error]:', resendErr);
    }
  }

  return jsonResponse({ success: true, message: 'Feedback submitted successfully.', id: entry.id }, 200, headers);
}
