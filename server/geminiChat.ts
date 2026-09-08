import { GoogleGenerativeAI } from '@google/generative-ai';

export interface UserStatsData {
  currentWPM?: number;
  targetWPM?: number;
  accuracy?: number;
  grade?: string;
  errorMap?: Record<string, number>;
  flaws?: Array<{
    id: string;
    label: string;
    keys: string[];
    errorRate: number;
    severity: string;
    recommendation: string;
  }>;
  stamina?: {
    dropOffPercent: number;
    verdict: string;
    message: string;
  };
}

export interface GeminiHistoryMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatRequestBody {
  chatHistory: GeminiHistoryMessage[];
  userData?: UserStatsData;
}

export function buildSystemInstruction(userData?: UserStatsData): string {
  let statsContext = 'No live typing stats available yet.';

  if (userData) {
    const weakKeys = userData.errorMap
      ? Object.entries(userData.errorMap)
          .filter(([_, rate]) => rate > 0.05)
          .sort((a, b) => b[1] - a[1])
          .map(([k, r]) => `${k.toUpperCase()} (${Math.round(r * 100)}% error rate)`)
          .join(', ')
      : 'None detected';

    const flawsList =
      userData.flaws && userData.flaws.length > 0
        ? userData.flaws
            .map(
              (f) =>
                `- ${f.label}: keys [${f.keys.join(', ').toUpperCase()}], error rate: ${Math.round(f.errorRate * 100)}% (${f.severity} severity). Recommendation: ${f.recommendation}`
            )
            .join('\n')
        : 'No major flaws detected.';

    const staminaInfo = userData.stamina
      ? `Verdict: ${userData.stamina.verdict}, Drop-off: ${userData.stamina.dropOffPercent}%. Note: ${userData.stamina.message}`
      : 'N/A';

    statsContext = `
- Current WPM: ${userData.currentWPM ?? 'N/A'}
- Target WPM: ${userData.targetWPM ?? 'N/A'}
- Accuracy: ${userData.accuracy !== undefined ? `${userData.accuracy}%` : 'N/A'}
- Overall Grade: ${userData.grade ?? 'N/A'}
- Weak Keys: ${weakKeys || 'None'}
- Identified Flaws & Weak Zones:
${flawsList}
- Typing Stamina: ${staminaInfo}
`;
  }

  return `You are "BullBot", an expert, enthusiastic, and encouraging AI typing coach for TypingBull.
Your mission is to help the user master touch typing, improve speed (WPM), boost accuracy, and conquer weak keys.

USER'S LIVE TYPING DATA & METRICS:
${statsContext}

COACHING GUIDELINES:
1. Persona: Energetic, supportive, insightful, and practical (use occasional emoji like 🐂, ⚡, 🎯, ✨).
2. Deep Context Awareness: Refer specifically to their real stats when relevant (e.g. mention their actual weak keys, stamina drops, or how close they are to their target WPM).
3. Actionable & Concise: Keep responses concise, direct, and conversational (typically 2 to 4 punchy sentences, or short bullet points if explaining hand drills/technique). Avoid rambling walls of text.
4. Ergonomics & Finger Positioning: When asked about technique, give precise anatomical advice (e.g., home row anchors, wrist hovering, pinky reach pivots, rhythm over sprint).
5. Always stay in character as BullBot!`;
}

/**
 * Handle a chat request with Google Gemini API
 */
export async function handleGeminiChat(
  body: ChatRequestBody,
  apiKey?: string
): Promise<{ text: string }> {
  const resolvedApiKey =
    apiKey ||
    (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined);

  if (!resolvedApiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const { chatHistory, userData } = body;

  if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
    throw new Error('INVALID_CHAT_HISTORY');
  }

  const genAI = new GoogleGenerativeAI(resolvedApiKey);
  const systemInstruction = buildSystemInstruction(userData);

  // Separate previous turns from the latest user message
  const lastMessageItem = chatHistory[chatHistory.length - 1];
  if (lastMessageItem.role !== 'user') {
    throw new Error('LAST_MESSAGE_MUST_BE_USER');
  }

  const latestText = lastMessageItem.parts.map((p) => p.text).join('\n');
  const priorHistory = chatHistory.slice(0, -1).map((msg) => ({
    role: msg.role === 'model' ? ('model' as const) : ('user' as const),
    parts: msg.parts.map((p) => ({ text: p.text })),
  }));

  // Gemini requires startChat({ history }) to begin with role: 'user'.
  // Strip any leading model turns (such as the initial greeting).
  let startIndex = 0;
  while (startIndex < priorHistory.length && priorHistory[startIndex].role !== 'user') {
    startIndex++;
  }
  const filteredHistory = priorHistory.slice(startIndex);

  // Strictly sanitize history so roles alternate: user -> model -> user -> model...
  const sanitizedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const item of filteredHistory) {
    const text = item.parts.map((p) => p.text).join('\n').trim();
    if (!text) continue;

    if (sanitizedHistory.length === 0) {
      if (item.role === 'user') {
        sanitizedHistory.push({ role: 'user', parts: [{ text }] });
      }
    } else {
      const prev = sanitizedHistory[sanitizedHistory.length - 1];
      if (prev.role === item.role) {
        prev.parts[0].text += `\n${text}`;
      } else {
        sanitizedHistory.push({ role: item.role, parts: [{ text }] });
      }
    }
  }

  // Since chat.sendMessage(latestText) appends a new user turn,
  // history must end with a model turn (or be empty). If it ends with user, merge it.
  let messageToSend = latestText;
  if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
    const trailingUser = sanitizedHistory.pop()!;
    messageToSend = `${trailingUser.parts[0].text}\n${messageToSend}`;
  }

  // Highly resilient candidate models hierarchy (modern, active flash models)
  const candidateModels = [
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
  ];

  let lastError: unknown;
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const chat = model.startChat({
        history: sanitizedHistory,
      });

      const result = await chat.sendMessage(messageToSend);
      const response = await result.response;
      const replyText = response.text();

      return { text: replyText };
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[BullBot] Attempt with ${modelName} failed (${errMsg}), trying next candidate...`);
    }
  }

  throw lastError || new Error('FAILED_ALL_MODELS');
}
