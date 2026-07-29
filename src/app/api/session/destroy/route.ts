import { NextResponse } from 'next/server';
import { redis, SESSION_PREFIX } from '@/lib/redis';

// Destroy session (logout)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userId } = body;

    if (sessionId) {
      // Delete the session
      await redis.del(`${SESSION_PREFIX}${sessionId}`);
    }

    if (userId) {
      // Delete the reverse lookup
      await redis.del(`streakify:user_session:${userId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session destroy error:', error);
    return NextResponse.json({ error: 'Failed to destroy session' }, { status: 500 });
  }
}
