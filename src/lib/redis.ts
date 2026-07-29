import { Redis } from '@upstash/redis';

// Upstash Redis client for session management
// Sessions persist until explicit logout
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Session TTL: 30 days (in seconds)
export const SESSION_TTL = 30 * 24 * 60 * 60;

// Session key prefix
export const SESSION_PREFIX = 'streakify:session:';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  loginAt: number;
  lastActivity: number;
}
