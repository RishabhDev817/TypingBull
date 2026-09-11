/**
 * Cloudflare Pages Function: /api/feedback
 * Handles POST requests for user feedback and reviews.
 */

interface FeedbackPayload {
  id?: string;
  userId?: string;
  feedbackType: 'feature_request' | 'bug_report' | 'improvement' | 'general';
  message: string;
  useCase?: string[];
  priority?: 'nice_to_have' | 'really_help' | 'need_this';
  rating?: number | null;
  ratingComment?: string;
  email?: string;
  metadata?: Record<string, unknown>;
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

function sanitizeText(str: string): string {
  return str
    .replace(/[<>]/g, '') // strip HTML tag brackets
    .trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost(context: { request: Request }) {
  try {
    const data: FeedbackPayload = await context.request.json();

    // 1. Validation: Message is required and must be <= 1000 characters
    if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Feedback message is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    if (data.message.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Feedback message must be 1000 characters or fewer.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // 2. Email validation if provided
    if (data.email && data.email.trim().length > 0 && !isValidEmail(data.email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address or leave it blank.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // 3. Construct clean structured record
    const id = data.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sanitizedMessage = sanitizeText(data.message);
    const sanitizedEmail = data.email ? sanitizeText(data.email) : undefined;
    const sanitizedRatingComment = data.ratingComment ? sanitizeText(data.ratingComment) : undefined;

    const feedbackEntry = {
      id,
      userId: data.userId || 'anonymous',
      feedbackType: data.feedbackType || 'feature_request',
      message: sanitizedMessage,
      useCase: Array.isArray(data.useCase) ? data.useCase : [],
      priority: data.priority || 'really_help',
      rating: typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5 ? data.rating : null,
      ratingComment: sanitizedRatingComment,
      email: sanitizedEmail,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      votes: 0,
      metadata: data.metadata || {},
    };

    // Log feedback entry to Cloudflare logs for monitoring & admin aggregation
    console.log('[Feedback Submission Received]:', JSON.stringify(feedbackEntry));

    // Construct formatted email body
    const emailSubject = `[TypingBull Feedback] ${feedbackEntry.feedbackType.toUpperCase()}: ${feedbackEntry.priority}`;
    const emailBody = `New TypingBull Feedback Received!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPINGBULL USER FEEDBACK & REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feedback Type: ${feedbackEntry.feedbackType}
Priority:      ${feedbackEntry.priority}
User Email:    ${feedbackEntry.email || 'Anonymous learner (no email provided)'}
Rating:        ${feedbackEntry.rating ? `${feedbackEntry.rating} / 5 Stars` : 'Not rated'}
${feedbackEntry.ratingComment ? `Rating Comment: ${feedbackEntry.ratingComment}\n` : ''}
Use Cases / Exams:
${feedbackEntry.useCase.length > 0 ? feedbackEntry.useCase.join(', ') : 'None specified'}

Feedback Message:
------------------------------------
${feedbackEntry.message}
------------------------------------

User Typing Context:
- Speed:      ${(feedbackEntry.metadata as any)?.currentWpm ?? 0} WPM
- Accuracy:   ${(feedbackEntry.metadata as any)?.accuracy ?? 0}%
- Streak:     ${(feedbackEntry.metadata as any)?.currentStreak ?? 0} days
- Level:      ${(feedbackEntry.metadata as any)?.userLevel ?? 'N/A'}
- Sessions:   ${(feedbackEntry.metadata as any)?.totalSessions ?? 0}
- Date:       ${feedbackEntry.createdAt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // 1. Dispatch via Cloudflare send_email binding (if configured)
    const emailService = (context as any).env?.SEND_EMAIL || (context as any).env?.EMAIL;
    if (emailService && typeof emailService.send === 'function') {
      try {
        await emailService.send({
          to: 'feedback@typingbull.com',
          from: 'feedback@typingbull.com',
          subject: emailSubject,
          text: emailBody,
        });
        console.log('[Feedback Dispatch]: Successfully dispatched via Cloudflare send_email to feedback@typingbull.com');
      } catch (cfEmailErr) {
        console.warn('[Cloudflare send_email Binding Error]:', cfEmailErr);
      }
    }

    // 2. Dispatch via Resend API directly to Rishabh's inbox
    const resendApiKey =
      (context as any).env?.RESEND_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);

    if (resendApiKey) {
      try {
        const toList = ['rishabhrajmahato@gmail.com'];

        const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 16px; background-color: #0f172a; color: #f8fafc;">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #a855f7; font-size: 20px; font-weight: 800;">TypingBull — New User Feedback</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">A learner just submitted feedback on typingbull.com</p>
          </div>

          <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">Type:</strong> <span style="background-color: #9333ea; color: white; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 12px;">${feedbackEntry.feedbackType.toUpperCase()}</span></p>
            <p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">Priority:</strong> ${feedbackEntry.priority}</p>
            <p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">User Email:</strong> ${feedbackEntry.email ? `<a href="mailto:${feedbackEntry.email}" style="color: #38bdf8;">${feedbackEntry.email}</a>` : '<em style="color: #64748b;">Not provided</em>'}</p>
            <p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">Rating:</strong> ${feedbackEntry.rating ? `⭐ ${feedbackEntry.rating} / 5 Stars` : '<em style="color: #64748b;">Not rated</em>'}</p>
            ${feedbackEntry.ratingComment ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong style="color: #cbd5e1;">Rating Note:</strong> ${feedbackEntry.ratingComment}</p>` : ''}
            <p style="margin: 0; font-size: 14px;"><strong style="color: #cbd5e1;">Use Cases / Exams:</strong> ${feedbackEntry.useCase.length > 0 ? feedbackEntry.useCase.join(', ') : 'None specified'}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">Message:</h3>
            <div style="background-color: rgba(255,255,255,0.08); border-left: 4px solid #a855f7; border-radius: 8px; padding: 14px; font-size: 15px; line-height: 1.5; color: #ffffff; white-space: pre-wrap;">${feedbackEntry.message}</div>
          </div>

          <div style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #94a3b8;">
            <strong style="color: #cbd5e1; display: block; margin-bottom: 6px;">Learner Typing Context:</strong>
            • Speed: <strong>${(feedbackEntry.metadata as any)?.currentWpm ?? 0} WPM</strong><br/>
            • Accuracy: <strong>${(feedbackEntry.metadata as any)?.accuracy ?? 0}%</strong><br/>
            • Daily Streak: <strong>${(feedbackEntry.metadata as any)?.currentStreak ?? 0} days</strong><br/>
            • Level: <strong>${(feedbackEntry.metadata as any)?.userLevel ?? 'N/A'}</strong><br/>
            • Total Sessions: <strong>${(feedbackEntry.metadata as any)?.totalSessions ?? 0}</strong><br/>
            • Date: <strong>${feedbackEntry.createdAt}</strong>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-size: 11px; color: #64748b;">
            TypingBull Feedback Engine • Delivered directly to Rishabh
          </div>
        </div>
        `;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'TypingBull Feedback <onboarding@resend.dev>',
            to: toList,
            subject: emailSubject,
            text: emailBody,
            html: htmlContent,
            reply_to: feedbackEntry.email || undefined,
          }),
        });

        const resendData = await resendRes.json();
        console.log('[Feedback Dispatch]: Resend API response:', JSON.stringify(resendData));
      } catch (resendErr) {
        console.warn('[Resend API Error]:', resendErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully.',
        id: feedbackEntry.id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Cloudflare Feedback Error]:', errorMsg);
    return new Response(
      JSON.stringify({
        error: 'Failed to process feedback submission.',
        details: errorMsg,
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
