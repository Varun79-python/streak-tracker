import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Fetch daily completion records
    const { data: completions, error: compError } = await supabase
      .from('daily_completion')
      .select('*')
      .eq('user_id', userId)
      .order('completion_date', { ascending: false });

    if (compError) throw new Error(compError.message);

    // Fetch all daily_answers to reconstruct completed habit IDs per day
    let answers: any[] | null = null;
    try {
      const result = await supabase
        .from('daily_answers')
        .select('question_id, answer_date, answer')
        .eq('user_id', userId)
        .eq('answer', true);
      if (result.error) throw result.error;
      answers = result.data;
    } catch {
      // user_id column may not exist — try without filter
      try {
        const result = await supabase
          .from('daily_answers')
          .select('question_id, answer_date, answer, user_id')
          .eq('answer', true);
        if (!result.error && result.data) {
          // Filter client-side for this user
          answers = result.data.filter((a: any) => a.user_id === userId);
        }
      } catch {
        console.warn('daily_answers not available');
      }
    }

    // Build a map: date -> [question_id, ...]
    const answersByDate: Record<string, string[]> = {};
    if (answers) {
      for (const a of answers) {
        const date = a.answer_date;
        if (!answersByDate[date]) answersByDate[date] = [];
        answersByDate[date].push(a.question_id);
      }
    }

    // Merge completed_question_ids into each completion record
    const result = (completions || []).map((c: any) => ({
      ...c,
      completed_question_ids: answersByDate[c.completion_date] || c.completed_question_ids || [],
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('History GET failed:', error?.message);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
