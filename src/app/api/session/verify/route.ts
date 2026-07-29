import { NextResponse } from 'next/server';
import { redis, SESSION_TTL, SESSION_PREFIX, SessionData } from '@/lib/redis';

// Verify and refresh session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return NextResponse.json({ valid: false, error: 'Session expired or not found' }, { status: 401 });
    }

    const session: SessionData = typeof sessionData === 'string' 
      ? JSON.parse(sessionData) 
      : sessionData as SessionData;

    // Update last activity time
    session.lastActivity = Date.now();

    // Refresh session TTL (sliding window)
    await redis.setex(sessionKey, SESSION_TTL, JSON.stringify(session));

    return NextResponse.json({
      valid: true,
      session,
    });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
