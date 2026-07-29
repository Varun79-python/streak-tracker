const OMNIROUTE_URL = process.env.OMNIROUTE_URL || 'http://localhost:20128/v1';
const API_KEY = process.env.OMNIROUTE_API_KEY || '';
const MODEL = process.env.OMNIROUTE_AI_MODEL || 'auto';

interface OmniRouteOptions {
  messages: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export async function callOmniRoute(options: OmniRouteOptions) {
  const { messages, maxTokens = 500, temperature = 0.7, stream = false } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

  const res = await fetch(`${OMNIROUTE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`OmniRoute error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export function buildSystemPrompt(userData: {
  name: string;
  currentStreak: number;
  longestStreak: number;
  successRate: number;
  level: number;
  xp: number;
  totalDays: number;
  habitsCount: number;
}): string {
  return `You are StreakAI, a motivational habit coach for Streakify. The user's stats:
- Name: ${userData.name}
- Current streak: ${userData.currentStreak} days
- Longest streak: ${userData.longestStreak} days
- Consistency rate: ${userData.successRate}%
- Level: ${userData.level} (${userData.xp} XP)
- Total active days: ${userData.totalDays}
- Active habits: ${userData.habitsCount}

Be concise, encouraging, and personal. Use emojis occasionally. Max 3 sentences unless asked for detail.`;
}
