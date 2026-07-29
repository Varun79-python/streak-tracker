import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, adminKey } = body || {};

    const EXPECTED_KEY = process.env.ADMIN_SECRET_KEY || '123456789987654321741852963369258147';

    if (adminKey !== EXPECTED_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Secret Key' }, { status: 401 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password.trim(), 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        username: email.toLowerCase().trim(),
        password_hash,
        display_name: name.trim(),
        role: 'user',
        status: 'active',
      })
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') { // unique violation
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      level: 1,
      xp: 0,
      current_streak: 0,
      longest_streak: 0,
    });

    if (profileError) {
      // Clean up user if profile creation fails
      await supabase.from('users').delete().eq('id', user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Create settings
    const { error: settingsError } = await supabase.from('settings').insert({
      user_id: user.id,
    });

    if (settingsError) {
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      return NextResponse.json({ error: settingsError.message }, { status: 500 });
    }

    // Create streaks
    const { error: streakError } = await supabase.from('streaks').insert({
      user_id: user.id,
    });

    if (streakError) {
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('settings').delete().eq('user_id', user.id);
      return NextResponse.json({ error: streakError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.display_name,
          email: user.username,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
  }
}