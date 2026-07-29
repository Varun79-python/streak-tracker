import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { redis, SESSION_TTL, SESSION_PREFIX, SessionData } from '@/lib/redis';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    if (!rawBody) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Find user by email (username in our schema)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', email.toLowerCase().trim())
      .single();

    if (userError || !user) {
      console.error('User lookup error:', userError?.message || 'User not found');
      return NextResponse.json(
        { error: 'Invalid credentials. Access restricted to provisioned accounts.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Account is suspended by Admin.' }, { status: 403 });
    }

    // Verify password using bcrypt
    const valid = bcrypt.compareSync(password.trim(), user.password_hash);

    if (!valid) {
      console.error('Password mismatch for user:', user.username);
      return NextResponse.json(
        { error: 'Invalid credentials. Access restricted to provisioned accounts.' },
        { status: 401 }
      );
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Create Redis session
    const sessionId = crypto.randomUUID();
    const now = Date.now();

    const sessionData: SessionData = {
      userId: user.id,
      email: user.username,
      name: user.display_name || user.username,
      role: user.role,
      loginAt: now,
      lastActivity: now,
    };

    // Store session in Redis with 30-day TTL
    await redis.setex(
      `${SESSION_PREFIX}${sessionId}`,
      SESSION_TTL,
      JSON.stringify(sessionData)
    );

    // Store reverse lookup: userId -> sessionId (single session per user)
    await redis.setex(
      `streakify:user_session:${user.id}`,
      SESSION_TTL,
      sessionId
    );

    return NextResponse.json({
      success: true,
      sessionId,
      user: {
        id: user.id,
        name: user.display_name || user.username,
        email: user.username,
        role: user.role,
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}