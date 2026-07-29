import { Habit, DayCheckIn, Achievement, Badge, LeaderboardUser, NotificationItem, UserProfile } from './types';

// All seed data cleared. App starts fresh.
export const INITIAL_HABITS: Habit[] = [];
export const INITIAL_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  currentStreak: 0,
  longestStreak: 0,
  totalDays: 0,
  successRate: 0,
  bio: '',
  joinedDate: ''
};
export function generateSeedHistory(): Record<string, DayCheckIn> { return {}; }
export const INITIAL_ACHIEVEMENTS: Achievement[] = [];
export const INITIAL_BADGES: Badge[] = [];
export const INITIAL_LEADERBOARD: LeaderboardUser[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
