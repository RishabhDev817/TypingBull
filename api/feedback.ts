/**
 * Backend API Route for TypingBull Feedback & Review
 * Supports Next.js / Vercel Serverless and Node environments.
 */

function sanitizeText(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Feedback message is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (data.message.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Feedback message must be 1000 characters or fewer.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (data.email && data.email.trim().length > 0 && !isValidEmail(data.email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address or leave it blank.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = data.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const feedbackEntry = {
      id,
      userId: data.userId || 'anonymous',
      feedbackType: data.feedbackType || 'feature_request',
      message: sanitizeText(data.message),
      useCase: Array.isArray(data.useCase) ? data.useCase : [],
      priority: data.priority || 'really_help',
      rating: typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5 ? data.rating : null,
      ratingComment: data.ratingComment ? sanitizeText(data.ratingComment) : undefined,
      email: data.email ? sanitizeText(data.email) : undefined,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      votes: 0,
      metadata: data.metadata || {},
    };

    console.log('[Serverless Feedback Received]:', JSON.stringify(feedbackEntry));

    return new Response(
      JSON.stringify({ success: true, id: feedbackEntry.id, message: 'Feedback submitted successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Fallback for Node.js Express / Pages Router
export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const standardReq = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  });
  const response = await POST(standardReq);
  const result = await response.json();
  return res.status(response.status).json(result);
}
