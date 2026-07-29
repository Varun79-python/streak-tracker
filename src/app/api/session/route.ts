import { NextResponse } from 'next/server';
import { redis, SESSION_TTL, SESSION_PREFIX, SessionData } from '@/lib/redis';

// Create a new session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, name, role } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email required' }, { status: 400 });
    }

    const sessionId = crypto.randomUUID();
    const now = Date.now();

    const sessionData: SessionData = {
      userId,
      email,
      name: name || email,
      role: role || 'user',
      loginAt: now,
      lastActivity: now,
    };

    // Store session in Redis with TTL
    await redis.setex(
      `${SESSION_PREFIX}${sessionId}`,
      SESSION_TTL,
      JSON.stringify(sessionData)
    );

    // Also store a reverse lookup: userId -> sessionId (for single session per user)
    await redis.setex(
      `streakify:user_session:${userId}`,
      SESSION_TTL,
      sessionId
    );

    return NextResponse.json({
      success: true,
      sessionId,
      session: sessionData,
    });
  } catch (error) {
    console.error('Session create error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
