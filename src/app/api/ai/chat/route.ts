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
