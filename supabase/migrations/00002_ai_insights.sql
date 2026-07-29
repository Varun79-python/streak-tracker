CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('quote', 'weekly', 'streak_alert', 'coach_message')),
  content JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_user_type ON ai_insights(user_id, insight_type);
