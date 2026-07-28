import { Habit, DayCheckIn, Achievement, Badge, LeaderboardUser, NotificationItem, UserProfile } from './types';
import { format, subDays } from 'date-fns';

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Studied Today', description: 'At least 2 hours of deep learning', icon: '🧠', required: true, active: true, color: '#3B82F6', reminderTime: '20:00' },
  { id: '2', name: 'Controlled Lust', description: 'Mastered mind & energy retention', icon: '🔒', required: true, active: true, color: '#8B5CF6', reminderTime: '22:00' },
  { id: '3', name: 'Exercise Done', description: 'Workout or 10,000 steps', icon: '💪', required: true, active: true, color: '#EF4444', reminderTime: '08:00' },
  { id: '4', name: 'Read Books', description: 'Read 15+ pages of non-fiction', icon: '📖', required: true, active: true, color: '#F59E0B', reminderTime: '21:00' },
  { id: '5', name: 'Meditation', description: '10 mins mindfulness or prayer', icon: '🧘', required: false, active: true, color: '#10B981', reminderTime: '07:00' },
  { id: '6', name: 'No Social Media', description: 'Zero doomscrolling or distracting feeds', icon: '🚫', required: false, active: true, color: '#EC4899', reminderTime: '18:00' },
  { id: '7', name: 'Healthy Food', description: 'Clean diet, zero junk food', icon: '🥗', required: false, active: true, color: '#84CC16', reminderTime: '19:30' },
  { id: '8', name: 'Wake Before 6 AM', description: 'Out of bed before sunrise', icon: '🌅', required: false, active: true, color: '#F97316', reminderTime: '06:00' },
  { id: '9', name: 'Coding Practice', description: 'Build project or solve 2 LeetCode problems', icon: '💻', required: true, active: true, color: '#06B6D4', reminderTime: '17:00' },
];

export const INITIAL_USER: UserProfile = {
  id: 'u_1',
  name: 'Vedant',
  email: 'vedant@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  level: 12,
  xp: 1250,
  nextLevelXp: 2000,
  currentStreak: 23,
  longestStreak: 67,
  totalDays: 156,
  successRate: 87,
  bio: 'Discipline today, freedom tomorrow. Building software & mastering daily habits.',
  joinedDate: 'May 2025'
};

export function generateSeedHistory(): Record<string, DayCheckIn> {
  const history: Record<string, DayCheckIn> = {};
  const today = new Date();

  // Create 365 days of realistic data
  for (let i = 365; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    
    // For today (i == 0), start incomplete so user can perform Daily Check-in Modal demo
    if (i === 0) {
      history[dateStr] = {
        date: dateStr,
        completedHabits: [],
        completionPercentage: 0,
        xpEarned: 0,
        completed: false
      };
      continue;
    }

    // For days 1 to 23 (last 23 days), make them 100% complete for active 23-day streak!
    if (i <= 23) {
      history[dateStr] = {
        date: dateStr,
        completedHabits: INITIAL_HABITS.map(h => h.id),
        completionPercentage: 100,
        xpEarned: 25 + Math.floor(Math.random() * 15),
        completed: true,
        journal: i % 4 === 0 ? {
          title: `Day ${365 - i} Reflections`,
          content: `Maintained high focus during morning session. Completed all study goals and felt energized!`,
          mood: ['Happy', 'Productive', 'Focused', 'Energetic'][i % 4]
        } : undefined
      };
    } else {
      // Historical random days with varying completion rates (some miss, some partial, some perfect)
      const rand = Math.random();
      if (rand > 0.3) {
        // High completion day
        const habits = INITIAL_HABITS.filter(() => Math.random() > 0.15).map(h => h.id);
        const reqHabits = INITIAL_HABITS.filter(h => h.required).map(h => h.id);
        const allReqDone = reqHabits.every(id => habits.includes(id));
        const pct = Math.round((habits.length / INITIAL_HABITS.length) * 100);

        history[dateStr] = {
          date: dateStr,
          completedHabits: habits,
          completionPercentage: pct,
          xpEarned: Math.floor((pct / 100) * 30),
          completed: allReqDone,
          journal: Math.random() > 0.6 ? {
            title: `Journal for ${dateStr}`,
            content: `Felt productive today. Worked on coding projects and stayed disciplined.`,
            mood: pct > 80 ? 'Productive' : 'Neutral'
          } : undefined
        };
      } else if (rand > 0.15) {
        // Partial day
        const habits = ['1', '3', '4'];
        history[dateStr] = {
          date: dateStr,
          completedHabits: habits,
          completionPercentage: 33,
          xpEarned: 10,
          completed: false
        };
      } else {
        // Missed day
        history[dateStr] = {
          date: dateStr,
          completedHabits: [],
          completionPercentage: 0,
          xpEarned: 0,
          completed: false
        };
      }
    }
  }

  return history;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: '3 Days Streak', description: 'Maintain discipline for 3 consecutive days', targetDays: 3, currentDays: 3, unlocked: true, unlockedAt: '2025-06-01', category: 'streak', rewardXp: 50, icon: '🔥' },
  { id: 'ach_2', title: '7 Days Streak', description: 'Keep the fire burning for a full week', targetDays: 7, currentDays: 7, unlocked: true, unlockedAt: '2025-06-05', category: 'streak', rewardXp: 100, icon: '⚡' },
  { id: 'ach_3', title: '15 Days Streak', description: '15 days of unwavering focus', targetDays: 15, currentDays: 15, unlocked: true, unlockedAt: '2025-06-13', category: 'streak', rewardXp: 200, icon: '🌟' },
  { id: 'ach_4', title: '30 Days Streak', description: 'Form a lifelong habit over 1 month', targetDays: 30, currentDays: 23, unlocked: false, category: 'streak', rewardXp: 500, icon: '🏆' },
  { id: 'ach_5', title: '50 Days Streak', description: 'Halfway to a hundred days of beast mode', targetDays: 50, currentDays: 23, unlocked: false, category: 'streak', rewardXp: 800, icon: '👑' },
  { id: 'ach_6', title: '100 Days Streak', description: 'Enter the hall of legendary consistency', targetDays: 100, currentDays: 23, unlocked: false, category: 'streak', rewardXp: 1500, icon: '💎' },
  { id: 'ach_7', title: '365 Days Streak', description: 'A complete year of total perfection', targetDays: 365, currentDays: 23, unlocked: false, category: 'streak', rewardXp: 5000, icon: '🌌' },
  { id: 'ach_8', title: 'Perfect Week', description: 'Complete 100% of habits for 7 straight days', targetDays: 7, currentDays: 7, unlocked: true, unlockedAt: '2025-06-20', category: 'perfection', rewardXp: 300, icon: '✨' },
  { id: 'ach_9', title: 'Perfect Month', description: 'Complete 100% of habits for 30 straight days', targetDays: 30, currentDays: 18, unlocked: false, category: 'perfection', rewardXp: 1000, icon: '🎯' },
  { id: 'ach_10', title: 'Perfect Year', description: 'No missed days for 365 days', targetDays: 365, currentDays: 23, unlocked: false, category: 'perfection', rewardXp: 10000, icon: '🚀' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Consistency King', title: 'Consistency King', description: 'Log check-ins for 20+ consecutive days', icon: '👑', rarity: 'Legendary', unlocked: true, unlockedDate: '2025-06-15', glowColor: '#F59E0B' },
  { id: 'b2', name: 'Discipline Master', title: 'Discipline Master', description: 'Complete all required habits 10 times', icon: '🛡️', rarity: 'Epic', unlocked: true, unlockedDate: '2025-06-10', glowColor: '#EF4444' },
  { id: 'b3', name: 'Early Bird', title: 'Early Bird', description: 'Check in before 7 AM for 5 days', icon: '🌅', rarity: 'Rare', unlocked: true, unlockedDate: '2025-06-08', glowColor: '#3B82F6' },
  { id: 'b4', name: 'Focus Legend', title: 'Focus Legend', description: 'Accumulate 1,000+ Total XP', icon: '⚡', rarity: 'Legendary', unlocked: true, unlockedDate: '2025-06-22', glowColor: '#22C55E' },
  { id: 'b5', name: 'Zen Master', title: 'Zen Master', description: 'Complete meditation 15 days in a row', icon: '🧘', rarity: 'Rare', unlocked: false, glowColor: '#10B981' },
  { id: 'b6', name: 'Study Beast', title: 'Study Beast', description: 'Log 50+ hours of study habit', icon: '📚', rarity: 'Epic', unlocked: false, glowColor: '#8B5CF6' },
  { id: 'b7', name: 'Habit Hero', title: 'Habit Hero', description: 'Create and stick to 8+ custom habits', icon: '🦸', rarity: 'Rare', unlocked: true, unlockedDate: '2025-06-02', glowColor: '#06B6D4' },
  { id: 'b8', name: 'Streak Beast', title: 'Streak Beast', description: 'Reach a top 3 spot on global leaderboard', icon: '🦁', rarity: 'Legendary', unlocked: true, unlockedDate: '2025-06-25', glowColor: '#EC4899' },
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Aryan Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', level: 16, xp: 1980, currentStreak: 45 },
  { rank: 2, name: 'Vedant (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', level: 15, xp: 1750, currentStreak: 23, isCurrentUser: true },
  { rank: 3, name: 'Riya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', level: 14, xp: 1620, currentStreak: 31 },
  { rank: 4, name: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150', level: 12, xp: 1410, currentStreak: 19 },
  { rank: 5, name: 'Ankit Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', level: 11, xp: 1270, currentStreak: 14 },
  { rank: 6, name: 'Neha Gupta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', level: 10, xp: 1100, currentStreak: 12 },
  { rank: 7, name: 'Vikram Joshi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', level: 9, xp: 950, currentStreak: 9 },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: '🔥 Streak Completed', message: 'Great job! You completed all required habits for today.', type: 'streak', timestamp: '2 mins ago', read: false },
  { id: 'n2', title: '🏆 Achievement Unlocked', message: '7 Days Streak milestone reached! +100 XP awarded.', type: 'achievement', timestamp: '1 hour ago', read: false },
  { id: 'n3', title: '⚠️ Streak At Risk', message: 'Remember to submit today\'s check-in before midnight!', type: 'warning', timestamp: '1 day ago', read: true },
  { id: 'n4', title: '📅 Weekly Summary', message: 'You achieved an 87% overall consistency this week.', type: 'summary', timestamp: '2 days ago', read: true },
  { id: 'n5', title: '📖 Journal Reminder', message: 'Write down your reflection for today in the journal.', type: 'journal', timestamp: '3 days ago', read: true },
];
