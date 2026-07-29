import { createAdminClient } from './server';

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
