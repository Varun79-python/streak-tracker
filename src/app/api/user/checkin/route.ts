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
    let totalCount = completedHabitIds?.length || 0;
    try {
      const { count, error: countErr } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);
      if (!countErr && count) totalCount = count;
    } catch {
      // user_id column may not exist — try without filter
      try {
        const { count } = await supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true);
        if (count) totalCount = count;
      } catch { /* ignore */ }
    }

    const completedCount = completedHabitIds?.length || 0;

    // Upsert daily_completion
    let completion: any = null;
    try {
      const result = await supabase
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
          completed_question_ids: completedHabitIds || [],
        }, { onConflict: 'user_id,completion_date' })
        .select()
        .single();
      
      if (result.error) throw result.error;
      completion = result.data;
    } catch (err: any) {
      console.error('daily_completion upsert error:', err?.message, err?.code);
      // If user_id column is the issue, try without it
      if (err?.message?.includes('user_id') || err?.code === '42703' || err?.code === '23505') {
        try {
          const result = await supabase
            .from('daily_completion')
            .upsert({
              completion_date: date,
              is_completed: isCompleted,
              completion_percentage: completionPercentage,
              total_questions: totalCount,
              completed_questions: completedCount,
              xp_earned: xpEarned,
              journal_entry: journalEntry,
              mood,
              completed_question_ids: completedHabitIds || [],
            }, { onConflict: 'completion_date' })
            .select()
            .single();
          completion = result.data;
        } catch (retryErr: any) {
          console.error('daily_completion retry error:', retryErr?.message);
          // Last resort: try a simple insert
          try {
            const result = await supabase
              .from('daily_completion')
              .insert({
                completion_date: date,
                is_completed: isCompleted,
                completion_percentage: completionPercentage,
                total_questions: totalCount,
                completed_questions: completedCount,
                xp_earned: xpEarned,
                journal_entry: journalEntry,
                mood,
                completed_question_ids: completedHabitIds || [],
              })
              .select()
              .single();
            completion = result.data;
          } catch { /* give up on completion */ }
        }
      }
    }

    // Upsert daily_answers for each habit
    if (completedHabitIds && completedHabitIds.length > 0) {
      try {
        const answers = completedHabitIds.map((question_id: string) => ({
          user_id: userId,
          question_id,
          answer: true,
          answer_date: date,
        }));

        const { error: answersError } = await supabase
          .from('daily_answers')
          .upsert(answers, { onConflict: 'user_id,question_id,answer_date' });

        if (answersError) {
          console.error('daily_answers upsert error:', answersError.message);
          // Retry without user_id
          if (answersError.message?.includes('user_id') || answersError.code === '42703') {
            const answersNoUser = completedHabitIds.map((question_id: string) => ({
              question_id,
              answer: true,
              answer_date: date,
            }));
            await supabase
              .from('daily_answers')
              .upsert(answersNoUser, { onConflict: 'question_id,answer_date' });
          }
        }
      } catch (e) {
        console.warn('daily_answers sync skipped:', e);
      }
    }

    // Update streak and profile if completed
    if (isCompleted) {
      try {
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
        try {
          await supabase.from('xp_history').insert({
            user_id: userId,
            xp_amount: xpEarned,
            source: 'daily_checkin',
            description: `Completed all required habits for ${date}`,
          });
        } catch { /* ignore xp_history errors */ }

        // Update profile XP and level
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp, level')
          .eq('id', userId)
          .single();

        if (profile) {
          const newXp = (profile.xp || 0) + xpEarned;
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
      } catch (e) {
        console.warn('Streak/profile update skipped:', e);
      }
    }

    return NextResponse.json({ success: true, completion });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to submit check-in' }, { status: 500 });
  }
}
