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
    const body = await request.json().catch(() => ({ type: 'quote' }));
    return NextResponse.json({
      insight: fallbacks[body.type] || fallbacks.quote,
      fallback: true,
    });
  }
}
