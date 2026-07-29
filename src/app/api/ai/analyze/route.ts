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
