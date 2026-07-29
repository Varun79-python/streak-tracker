import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      date, 
      completedHabitIds, 
      completionPercentage, 
      xpEarned, 
      isCompleted, 
      journalEntry, 
      mood 
    } = body;

    if (!userId || !date) {
      return NextResponse.json({ error: 'userId and date required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Get total active questions for accurate total_questions
    const { count: totalQuestions } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true);

    const completedCount = completedHabitIds?.length || 0;
    const totalCount = totalQuestions || completedCount;

    // Upsert daily_completion
    const { data: completion, error: completionError } = await supabase
      .from('daily_completion')
      .upsert({
        user_id: userId,
        completion_date: date,
        is_completed: isCompleted,
        completion_percentage: completionPercentage,
        total_questions: totalCount,
        completed_questions: completedCount,
        xp_earned: xpEarned,
        journal_entry: journalEntry,
        mood,
      }, { onConflict: 'user_id,completion_date' })
      .select()
      .single();

    if (completionError) throw new Error(completionError.message);

    // Upsert daily_answers for each habit
    if (completedHabitIds && completedHabitIds.length > 0) {
      const answers = completedHabitIds.map((question_id: string) => ({
        user_id: userId,
        question_id,
        answer: true,
        answer_date: date,
      }));

      const { error: answersError } = await supabase
        .from('daily_answers')
        .upsert(answers, { onConflict: 'user_id,question_id,answer_date' });

      if (answersError) throw new Error(answersError.message);
    }

    // Update streak if completed
    if (isCompleted) {
      const { data: streak } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (streak) {
        const newStreak = streak.current_streak + 1;
        const newLongest = Math.max(streak.longest_streak, newStreak);
        
        await supabase
          .from('streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_checkin_date: date,
            streak_start_date: streak.streak_start_date || date,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      }

      // Add XP history
      await supabase
        .from('xp_history')
        .insert({
          user_id: userId,
          xp_amount: xpEarned,
          source: 'daily_checkin',
          description: `Completed all required habits for ${date}`,
        });

      // Update profile XP and level
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (profile) {
        const newXp = profile.xp + xpEarned;
        const newLevel = Math.floor(newXp / 100) + 1;
        
        await supabase
          .from('profiles')
          .update({
            xp: newXp,
            level: newLevel,
            current_streak: (streak?.current_streak || 0) + 1,
            longest_streak: Math.max(streak?.longest_streak || 0, (streak?.current_streak || 0) + 1),
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ success: true, completion });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to submit check-in' }, { status: 500 });
  }
}