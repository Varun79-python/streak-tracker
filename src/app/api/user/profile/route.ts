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
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError.message);
      throw new Error(profileError.message);
    }

    // Fetch streak data from streaks table (authoritative streak source)
    let streakData: any = null;
    try {
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();
      streakData = data;
    } catch {
      // streaks table may not have data yet
    }

    // Merge streak data into profile response
    const merged = {
      ...profile,
      current_streak: streakData?.current_streak ?? profile.current_streak ?? 0,
      longest_streak: streakData?.longest_streak ?? profile.longest_streak ?? 0,
    };

    return NextResponse.json(merged);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, avatar, name, bio } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const updateData: any = {};
    if (avatar !== undefined) updateData.avatar_url = avatar;
    if (name !== undefined) updateData.display_name = name;
    if (bio !== undefined) updateData.bio = bio;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
