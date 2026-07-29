# OmniRoute AI Integration — Streakify Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Integrate OmniRoute AI gateway into Streakify to add AI coach chat, motivational insights, smart analytics, and streak rescue tips — making the app production-ready with zero bugs.

**Architecture:** Next.js API routes act as proxy between frontend and OmniRoute (`localhost:20128/v1`). AI responses cached in `ai_insights` Supabase table. All AI features degrade gracefully if OmniRoute is unavailable.

**Tech Stack:** Next.js 16, Supabase, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide icons, date-fns

## Global Constraints
- All new files follow existing project patterns (client components, same import style, same styling approach)
- OmniRoute URL configurable via `OMNIROUTE_URL` env var
- AI features must never crash the app — wrap all AI calls in try/catch with graceful fallbacks
- Follow existing naming conventions (camelCase, same file structure)
- Use `createAdminClient()` from `@/lib/supabase/server` for API routes

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/omniroute.ts` | Create | OmniRoute API client — shared function to call OmniRoute with context |
| `src/lib/supabase/service.ts` | Modify | Add `aiInsightService` with CRUD for `ai_insights` table |
| `src/app/api/ai/chat/route.ts` | Create | AI Coach chat endpoint — streams response from OmniRoute |
| `src/app/api/ai/insights/route.ts` | Create | Motivational insights endpoint — cached per type per day |
| `src/app/api/ai/analyze/route.ts` | Create | Smart analytics endpoint — natural language queries on user data |
| `src/app/api/ai/rescue/route.ts` | Create | Streak rescue tips endpoint |
| `src/components/views/AICoachView.tsx` | Create | Full chat interface for AI Coach |
| `src/components/views/DashboardView.tsx` | Modify | Add InsightCard section below stats |
| `src/components/views/StatisticsView.tsx` | Modify | Add AnalyticsChat overlay |
| `src/components/BottomNav.tsx` | Modify | Replace Profile with Coach in bottom nav |
| `src/lib/StreakContext.tsx` | Modify | Add AI-related state (coach messages, insights, showCoach) |
| `src/lib/types.ts` | Modify | Add AI message/insight types |
| `src/app/page.tsx` | Modify | Add AICoachView to renderActiveView |
| `.env.local` | Modify | Add OMNIROUTE_URL and OMNIROUTE_API_KEY |
| `supabase/migrations/00002_ai_insights.sql` | Create | Migration for ai_insights table |

---

### Task 1: Add AI types to types.ts

**Files:**
- Modify: `src/lib/types.ts`

**Interfaces:**
- Produces: `AIMessage`, `AIInsight`, `AIErrorResponse` types

- [ ] **Step 1: Add AI types after existing types**

Append to `src/lib/types.ts`:

```typescript
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  insightType: 'quote' | 'weekly' | 'streak_alert';
  content: { text: string; emoji?: string; actionable?: string };
  generatedAt: string;
  expiresAt?: string;
}

export interface AIErrorResponse {
  error: string;
  fallback: boolean;
}
```

- [ ] **Step 2: Verify the file**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add AI types for OmniRoute integration"
```

---

### Task 2: Create OmniRoute client library

**Files:**
- Create: `src/lib/omniroute.ts`

**Interfaces:**
- Consumes: `AIMessage` from Task 1
- Produces: `callOmniRoute()`, `buildSystemPrompt()`

- [ ] **Step 1: Create the client**

Write `src/lib/omniroute.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/omniroute.ts
git commit -m "feat: create OmniRoute AI client library"
```

---

### Task 3: Add ai_insightService to Supabase service layer

**Files:**
- Modify: `src/lib/supabase/service.ts`

- [ ] **Step 1: Add aiInsightService at end of service.ts**

```typescript
export const aiInsightService = {
  async getInsight(userId: string, insightType: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('insight_type', insightType)
      .gte('expires_at', new Date().toISOString())
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();
    return data;
  },

  async saveInsight(userId: string, insightType: string, content: any) {
    const supabase = await createAdminClient();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        insight_type: insightType,
        content,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/service.ts
git commit -m "feat: add aiInsightService for caching AI responses"
```

---

### Task 4: Create SQL migration for ai_insights table

**Files:**
- Create: `supabase/migrations/00002_ai_insights.sql`

- [ ] **Step 1: Write migration**

```sql
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('quote', 'weekly', 'streak_alert', 'coach_message')),
  content JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_user_type ON ai_insights(user_id, insight_type);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/00002_ai_insights.sql
git commit -m "feat: add ai_insights table migration"
```

---

### Task 5: Create AI Chat API route

**Files:**
- Create: `src/app/api/ai/chat/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { callOmniRoute, buildSystemPrompt } from '@/lib/omniroute';

export async function POST(request: Request) {
  try {
    const { userId, message, history } = await request.json();
    if (!userId || !message) {
      return NextResponse.json({ error: 'userId and message required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: habits } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId);

    const systemPrompt = buildSystemPrompt({
      name: profile.display_name || 'User',
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      successRate: profile.completion_percentage || 0,
      level: profile.level || 1,
      xp: profile.xp || 0,
      totalDays: profile.current_streak || 0,
      habitsCount: habits?.length || 0,
    });

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message },
    ];

    const reply = await callOmniRoute({ messages, maxTokens: 800, temperature: 0.8 });

    // Save coach message to insights
    const { aiInsightService } = await import('@/lib/supabase/service');
    await aiInsightService.saveInsight(userId, 'coach_message', {
      userMessage: message,
      aiReply: reply,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.message?.includes('timed out')) {
      return NextResponse.json({ reply: "I'm here when you're ready! Take a deep breath — every day is a fresh start. 🌱", fallback: true });
    }
    return NextResponse.json({ reply: 'Stay strong! Your consistency speaks volumes. Keep going! 🔥', fallback: true });
  }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/ai/chat/route.ts
git commit -m "feat: add AI chat API route"
```

---

### Task 6: Create AI Insights API route

**Files:**
- Create: `src/app/api/ai/insights/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { callOmniRoute, buildSystemPrompt } from '@/lib/omniroute';
import { aiInsightService } from '@/lib/supabase/service';

export async function POST(request: Request) {
  try {
    const { userId, type } = await request.json();
    if (!userId || !type) {
      return NextResponse.json({ error: 'userId and type required' }, { status: 400 });
    }

    // Check cache first
    const cached = await aiInsightService.getInsight(userId, type);
    if (cached) {
      return NextResponse.json({ insight: cached.content, cached: true });
    }

    const supabase = await createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt({
      name: profile.display_name || 'User',
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      successRate: profile.completion_percentage || 0,
      level: profile.level || 1,
      xp: profile.xp || 0,
      totalDays: profile.current_streak || 0,
      habitsCount: 0,
    });

    let userPrompt = '';
    switch (type) {
      case 'quote':
        userPrompt = 'Generate a short motivational quote for someone maintaining their habit streak. Include an emoji. Max 2 sentences.';
        break;
      case 'weekly':
        userPrompt = `Summarize this week's performance. Current streak: ${profile.current_streak}. Consistency: ${profile.completion_percentage}%. Be encouraging. Max 3 sentences.`;
        break;
      case 'streak_alert':
        userPrompt = `The user's streak is at ${profile.current_streak} days. Generate a gentle encouraging message to help them not break it. Max 2 sentences.`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid insight type' }, { status: 400 });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const text = await callOmniRoute({ messages, maxTokens: 200, temperature: 0.9 });

    const content = { text, type };
    await aiInsightService.saveInsight(userId, type, content);

    return NextResponse.json({ insight: content, cached: false });
  } catch (err: any) {
    const fallbacks: Record<string, { text: string }> = {
      quote: { text: 'Small steps lead to big changes. Keep showing up! 🔥' },
      weekly: { text: 'Every day you show up is a win. Keep building! 📈' },
      streak_alert: { text: "You've got this! One day at a time. 💪" },
    };
    const type = (await request.json())?.type || 'quote';
    return NextResponse.json({
      insight: fallbacks[type] || fallbacks.quote,
      fallback: true,
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/ai/insights/route.ts
git commit -m "feat: add AI insights API route with caching"
```

---

### Task 7: Create AI Analyze and AI Rescue API routes

**Files:**
- Create: `src/app/api/ai/analyze/route.ts`
- Create: `src/app/api/ai/rescue/route.ts`

- [ ] **Step 1: Create analyze route**

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { callOmniRoute, buildSystemPrompt } from '@/lib/omniroute';

export async function POST(request: Request) {
  try {
    const { userId, query } = await request.json();
    if (!userId || !query) {
      return NextResponse.json({ error: 'userId and query required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const [profileResult, habitsResult, historyResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('questions').select('*').eq('user_id', userId),
      supabase.from('daily_completion').select('*').eq('user_id', userId).order('completion_date', { ascending: false }).limit(30),
    ]);

    const profile = profileResult.data;
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recentHistory = (historyResult.data || []).map((d: any) => ({
      date: d.completion_date,
      completed: d.is_completed,
      percentage: d.completion_percentage,
      xp: d.xp_earned,
    }));

    const systemPrompt = buildSystemPrompt({
      name: profile.display_name || 'User',
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      successRate: profile.completion_percentage || 0,
      level: profile.level || 1,
      xp: profile.xp || 0,
      totalDays: profile.current_streak || 0,
      habitsCount: habitsResult.data?.length || 0,
    });

    const messages = [
      { role: 'system', content: systemPrompt + `\n\nRecent 30-day history: ${JSON.stringify(recentHistory)}\nHabits: ${JSON.stringify(habitsResult.data || [])}` },
      { role: 'user', content: query },
    ];

    const reply = await callOmniRoute({ messages, maxTokens: 600, temperature: 0.7 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Based on your data, you are doing great! Keep up the consistency! 📊', fallback: true });
  }
}
```

- [ ] **Step 2: Create rescue route**

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { callOmniRoute, buildSystemPrompt } from '@/lib/omniroute';

export async function POST(request: Request) {
  try {
    const { userId, missedDays } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt({
      name: profile.display_name || 'User',
      currentStreak: profile.current_streak || 0,
      longestStreak: profile.longest_streak || 0,
      successRate: profile.completion_percentage || 0,
      level: profile.level || 1,
      xp: profile.xp || 0,
      totalDays: profile.current_streak || 0,
      habitsCount: 0,
    });

    const userPrompt = `The user missed ${missedDays || 1} day(s) and their streak is at risk. Current streak: ${profile.current_streak} days. Give 3 quick actionable tips to get back on track. Be encouraging.`;

    const reply = await callOmniRoute({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      maxTokens: 400,
      temperature: 0.8,
    });

    return NextResponse.json({ tips: reply });
  } catch {
    return NextResponse.json({
      tips: '1. Start small — do just one habit today. 2. Set a daily reminder. 3. Remember why you started! 🔥',
      fallback: true,
    });
  }
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai/analyze/route.ts src/app/api/ai/rescue/route.ts
git commit -m "feat: add AI analyze and rescue API routes"
```

---

### Task 8: Create AICoachView component

**Files:**
- Create: `src/components/views/AICoachView.tsx`

**Interfaces:**
- Consumes: `AIMessage` from Task 1, `callOmniRoute` from Task 2
- Produces: Full chat UI component

- [ ] **Step 1: Create the AI Coach view**

Write `src/components/views/AICoachView.tsx`:

```tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { AIMessage } from '@/lib/types';
import { MessageCircle, Send, Sparkles, Bot, User, ArrowLeft } from 'lucide-react';

const WELCOME_MESSAGE: AIMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your AI habit coach. Ask me anything about your streaks, get motivation, or tips to stay consistent! 🔥",
  timestamp: new Date().toISOString(),
};

export const AICoachView: React.FC = () => {
  const { user, setActiveView } = useStreak();
  const [messages, setMessages] = useState<AIMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: userMsg.content, history }),
      });

      const data = await res.json();
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm here when you need me! 🌟",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sometimes the best advice is simple: keep showing up! You're doing great. 🌟",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setActiveView('dashboard')} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Coach
          </h2>
          <p className="text-xs text-slate-400">Your personal habit motivation assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-white'
                : 'bg-slate-800/60 border border-white/10 text-slate-200'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="bg-slate-800/60 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-sm text-slate-400 animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 items-end bg-slate-900/80 border border-white/10 rounded-2xl p-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none px-3 py-2 max-h-24"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/views/AICoachView.tsx
git commit -m "feat: add AI Coach chat view"
```

---

### Task 9: Add InsightCard to DashboardView

**Files:**
- Modify: `src/components/views/DashboardView.tsx`

- [ ] **Step 1: Add insight state and fetch to DashboardView**

After `const isTodayComplete = todayCheckIn?.completed || false;` (line 36), add:

```typescript
const [dailyQuote, setDailyQuote] = useState<{ text: string } | null>(null);
const [quoteLoading, setQuoteLoading] = useState(true);

useEffect(() => {
  const fetchQuote = async () => {
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type: 'quote' }),
      });
      const data = await res.json();
      setDailyQuote(data.insight);
    } catch { /* ignore */ }
    finally { setQuoteLoading(false) }
  };
  if (user.id) fetchQuote();
}, [user.id]);
```

Add import at top:
```typescript
import { useState, useEffect } from 'react';
```

- [ ] **Step 2: Add InsightCard below the stats row**

After the `</div>` closing the stats grid (after line 138), add:

```tsx
{/* AI Insight Card */}
<div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
      <Sparkles className="w-5 h-5 text-emerald-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-emerald-400 font-mono mb-1">✨ DAILY INSIGHT</p>
      {quoteLoading ? (
        <p className="text-sm text-slate-400 animate-pulse">Finding your spark...</p>
      ) : (
        <p className="text-sm text-white/90 leading-relaxed">{dailyQuote?.text || 'Small steps lead to big changes. Keep showing up! 🔥'}</p>
      )}
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add Sparkles to imports**

```typescript
import { ..., Sparkles } from 'lucide-react';
```

- [ ] **Step 4: Commit**

```bash
git add src/components/views/DashboardView.tsx
git commit -m "feat: add AI daily insight card to Dashboard"
```

---

### Task 10: Add Analytics Chat to StatisticsView

**Files:**
- Modify: `src/components/views/StatisticsView.tsx`

- [ ] **Step 1: Add analytics chat state and UI at end of StatisticsView**

Before the closing `</div>` of the view, add:

```tsx
{/* AI Analytics */}
<div className="glass-panel p-6 rounded-3xl border border-white/10 mt-6">
  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
    <Sparkles className="w-5 h-5 text-emerald-400" />
    Ask AI About Your Stats
  </h3>
  <div className="flex gap-2">
    <input
      value={analyticsQuery}
      onChange={e => setAnalyticsQuery(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && runAnalyticsQuery()}
      placeholder="e.g., How was my week? What habit do I miss most?"
      className="flex-1 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
    />
    <button
      onClick={runAnalyticsQuery}
      disabled={analyticsLoading || !analyticsQuery.trim()}
      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
    >
      Ask
    </button>
  </div>
  {analyticsLoading && <p className="text-sm text-slate-400 mt-3 animate-pulse">Analyzing your data...</p>}
  {analyticsResult && !analyticsLoading && (
    <div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
      <p className="text-sm text-white/90">{analyticsResult}</p>
    </div>
  )}
</div>
```

- [ ] **Step 2: Add state and handler inside the component function**

Add these lines after the existing useMemo hooks:

```typescript
const [analyticsQuery, setAnalyticsQuery] = useState('');
const [analyticsResult, setAnalyticsResult] = useState('');
const [analyticsLoading, setAnalyticsLoading] = useState(false);

const runAnalyticsQuery = async () => {
  if (!analyticsQuery.trim() || analyticsLoading) return;
  setAnalyticsLoading(true);
  setAnalyticsResult('');
  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, query: analyticsQuery }),
    });
    const data = await res.json();
    setAnalyticsResult(data.reply || 'No insights available right now.');
  } catch {
    setAnalyticsResult('Based on your data, you are building great habits! Keep going! 📊');
  } finally {
    setAnalyticsLoading(false);
  }
};
```

- [ ] **Step 3: Add imports**

Add to the existing imports:
```typescript
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
```

- [ ] **Step 4: Commit**

```bash
git add src/components/views/StatisticsView.tsx
git commit -m "feat: add AI analytics chat to Statistics view"
```

---

### Task 11: Update BottomNav — add Coach, update StreakContext and page.tsx

**Files:**
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/lib/StreakContext.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update BottomNav — replace Profile with Coach**

Change navItems in `BottomNav.tsx`:
```typescript
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'statistics', label: 'Stats', icon: BarChart3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'coach', label: 'Coach', icon: MessageCircle },
];
```

Add `MessageCircle` to imports:
```typescript
import { LayoutDashboard, BarChart3, Calendar, MessageCircle, Flame } from 'lucide-react';
```

- [ ] **Step 2: Update StreakContext — add activeView type**

Ensure 'coach' is handled in the activeView flow (it's already string-typed, so it works by default).

- [ ] **Step 3: Update page.tsx — add AICoachView to renderActiveView**

In `src/app/page.tsx`, add import:
```typescript
import { AICoachView } from '@/components/views/AICoachView';
```

Add case in `renderActiveView`:
```typescript
case 'coach':
  return <AICoachView />;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomNav.tsx src/app/page.tsx
git commit -m "feat: add Coach navigation and route"
```

---

### Task 12: Update .env.local with OmniRoute variables

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Append OmniRoute env vars**

```env
# OmniRoute AI Gateway
OMNIROUTE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=
OMNIROUTE_AI_MODEL=auto
```

- [ ] **Step 2: Commit**

```bash
git add .env.local
git commit -m "chore: add OmniRoute environment variables"
```

---

### Task 13: Final verification and build test

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No errors. If errors appear, fix them.

- [ ] **Step 2: Run the dev server**

```bash
npm run dev
```
Expected: Server starts on localhost:3000 without errors.

- [ ] **Step 3: Verify AI features work**

```bash
# Test insights endpoint
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-id","type":"quote"}'
```
Expected: Returns JSON with insight or fallback message.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```
