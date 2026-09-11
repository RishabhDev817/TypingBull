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
