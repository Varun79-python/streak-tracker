# Streakify AI Integration with OmniRoute

## Overview
Integrate OmniRoute AI gateway into the existing Streakify streak tracker app to add AI-powered features: AI coach, motivational insights, smart analytics, and streak rescue tips.

## Architecture

```
Browser → Next.js API Routes (/api/ai/*) → OmniRoute (localhost:20128/v1) → Free AI Providers
```

- All AI calls go through server-side Next.js API routes
- OmniRoute URL configurable via `OMNIROUTE_URL` env var (default: `http://localhost:20128/v1`)
- AI features are optional — core streak tracking works without OmniRoute
- Responses are cached in `ai_insights` table to avoid redundant API calls

## New Database Table

```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('quote', 'weekly', 'streak_alert', 'coach_message')),
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_insights_user_type ON ai_insights(user_id, insight_type);
```

## New API Routes

### `POST /api/ai/chat` — AI Coach
- Body: `{ message: string }`
- Sends user's habit data + message to OmniRoute
- Returns AI response as stream
- Context includes: current streak, recent check-ins, active habits

### `POST /api/ai/insights` — Motivational Insights
- Body: `{ type: 'quote' | 'weekly' | 'streak_alert' }`
- Checks cache first, generates if expired/missing
- Returns AI-generated content

### `POST /api/ai/analyze` — Smart Analytics
- Body: `{ query: string }`
- Sends user's history + query to OmniRoute
- Returns AI analysis with optional structured data

### `POST /api/ai/rescue` — Streak Rescue
- Body: `{ missedDays: number }`
- Generates recovery tips based on missed days

## New Components

### `views/AICoachView.tsx`
- Full chat interface with message bubbles
- System prompt includes user's habit data as context
- Message history stored in component state

### `components/InsightCard.tsx`
- Displays motivational quote on Dashboard
- Shows weekly summary card
- Streak alert with rescue tip

### `components/StreakRescueTip.tsx`
- Inline card showing recovery tips
- Links to Coach for deeper help

## Env Variables
```
OMNIROUTE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=
OMNIROUTE_AI_MODEL=auto
```

## Data Flow
1. User triggers AI feature (loads dashboard, opens coach, asks question)
2. Frontend calls relevant `/api/ai/*` endpoint
3. API route prepares context (user habits, streaks, history)
4. API route calls OmniRoute with prepared prompt
5. OmniRoute routes to best available free AI model
6. Response returned to frontend, cached if appropriate

## Error Handling
- If OmniRoute is unreachable, features degrade gracefully (show fallback messages, hide AI sections)
- Cache ensures insights still show even if OmniRoute is temporarily down
- Timeout after 15s for AI requests
