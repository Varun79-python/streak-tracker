import { createAdminClient } from './server';

type AdminClient = Awaited<ReturnType<typeof createAdminClient>>;

export const userService = {
  async create(username: string, password: string, displayName?: string) {
    const supabase = await createAdminClient();
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        username: username.toLowerCase().trim(),
        password_hash,
        display_name: displayName || username,
        role: 'user',
        status: 'active',
      })
      .select()
      .single();

    if (userError) throw new Error(userError.message);
    if (!user) throw new Error('Failed to create user');

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      level: 1,
      xp: 0,
      current_streak: 0,
      longest_streak: 0,
    });

    if (profileError) throw new Error(profileError.message);

    const { error: settingsError } = await supabase.from('settings').insert({
      user_id: user.id,
    });

    if (settingsError) throw new Error(settingsError.message);

    const { error: streakError } = await supabase.from('streaks').insert({
      user_id: user.id,
    });

    if (streakError) throw new Error(streakError.message);

    return user;
  },

  async getByUsername(username: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .single();
    return data;
  },

  async getById(id: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('users')
      .select('*, profiles(*)')
      .eq('id', id)
      .single();
    return data;
  },

  async verifyPassword(username: string, password: string) {
    const supabase = await createAdminClient();
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (!user) return null;

    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };
  },

  async list() {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('users')
      .select('id, username, display_name, role, status, created_at')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async update(id: string, updates: { display_name?: string; status?: string }) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data;
  },

  async delete(id: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

export const habitService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    return data || [];
  },

  async create(userId: string, data: { title: string; description?: string; icon?: string }) {
    const supabase = await createAdminClient();
    const { data: maxOrder } = await supabase
      .from('questions')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

    const { data: habit, error } = await supabase
      .from('questions')
      .insert({
        user_id: userId,
        title: data.title,
        description: data.description,
        icon: data.icon || 'circle',
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return habit;
  },

  async update(id: string, updates: { title?: string; description?: string; icon?: string; is_active?: boolean }) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data;
  },

  async delete(id: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

export const dailyAnswerService = {
  async getByDate(userId: string, date: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('daily_answers')
      .select('*, questions(*)')
      .eq('user_id', userId)
      .eq('answer_date', date);
    return data || [];
  },

  async bulkCreate(userId: string, date: string, answers: { question_id: string; answer: boolean }[]) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('daily_answers')
      .upsert(
        answers.map((a) => ({
          user_id: userId,
          question_id: a.question_id,
          answer: a.answer,
          answer_date: date,
        })),
        { onConflict: 'user_id, question_id, answer_date' }
      )
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async getRange(userId: string, startDate: string, endDate: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('daily_answers')
      .select('*')
      .eq('user_id', userId)
      .gte('answer_date', startDate)
      .lte('answer_date', endDate);
    return data || [];
  },
};

export const dailyCompletionService = {
  async getByDate(userId: string, date: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('daily_completion')
      .select('*')
      .eq('user_id', userId)
      .eq('completion_date', date)
      .single();
    return data;
  },

  async upsert(userId: string, date: string, data: {
    is_completed: boolean;
    completion_percentage: number;
    total_questions: number;
    completed_questions: number;
    xp_earned: number;
    journal_entry?: string;
    mood?: string;
  }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('daily_completion')
      .upsert({
        user_id: userId,
        completion_date: date,
        ...data,
      }, { onConflict: 'user_id, completion_date' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  async getRange(userId: string, startDate: string, endDate: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('daily_completion')
      .select('*')
      .eq('user_id', userId)
      .gte('completion_date', startDate)
      .lte('completion_date', endDate);
    return data || [];
  },
};

export const streakService = {
  async get(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  },

  async update(userId: string, updates: {
    current_streak?: number;
    longest_streak?: number;
    last_checkin_date?: string;
    streak_start_date?: string;
    streak_frozen?: boolean;
    freeze_count?: number;
  }) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('streaks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    return data;
  },
};

export const achievementService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });
    return data || [];
  },

  async create(userId: string, data: { title: string; description?: string; icon?: string; category?: string }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },
};

export const badgeService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    return data || [];
  },

  async create(userId: string, data: { name: string; description?: string; icon?: string; category?: string }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('badges')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },
};

export const xpHistoryService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('xp_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async add(userId: string, data: { xp_amount: number; source: string; description?: string }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('xp_history')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },
};

export const notificationService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async create(userId: string, data: { title: string; body?: string; type?: string }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  async markRead(id: string) {
    const supabase = await createAdminClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },

  async markAllRead(userId: string) {
    const supabase = await createAdminClient();
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
  },
};

export const settingsService = {
  async get(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  },

  async update(userId: string, updates: Record<string, unknown>) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    return data;
  },
};

export const journalService = {
  async getByDate(userId: string, date: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('journal')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .single();
    return data;
  },

  async upsert(userId: string, date: string, data: {
    content?: string;
    mood?: string;
    lessons_learned?: string;
    wins?: string;
    failures?: string;
  }) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('journal')
      .upsert({
        user_id: userId,
        entry_date: date,
        ...data,
      }, { onConflict: 'user_id, entry_date' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },
};

export const analyticsService = {
  async get(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  },

  async upsert(userId: string, data: Record<string, unknown>) {
    const supabase = await createAdminClient();
    const { data: result, error } = await supabase
      .from('analytics')
      .upsert({ user_id: userId, ...data }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },
};

export const friendService = {
  async list(userId: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('friends')
      .select('*, profiles!friends_friend_id_fkey(*)')
      .eq('user_id', userId);
    return data || [];
  },

  async add(userId: string, friendId: string) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('friends')
      .insert({ user_id: userId, friend_id: friendId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateStatus(id: string, status: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('friends')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return data;
  },

  async remove(id: string) {
    const supabase = await createAdminClient();
    await supabase.from('friends').delete().eq('id', id);
  },
};

export const leaderboardService = {
  async getByPeriod(period: string) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('leaderboards')
      .select('*, profiles(*)')
      .eq('period', period)
      .order('score', { ascending: false });
    return data || [];
  },

  async upsert(userId: string, period: string, score: number) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('leaderboards')
      .upsert({
        user_id: userId,
        period,
        score,
      }, { onConflict: 'user_id, period' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};