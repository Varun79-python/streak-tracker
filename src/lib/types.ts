export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category?: string;
  required: boolean;
  active: boolean;
  color: string;
  reminderTime?: string;
}

export interface DayCheckIn {
  date: string; // YYYY-MM-DD
  completedHabits: string[]; // Habit IDs
  completionPercentage: number;
  xpEarned: number;
  completed: boolean; // True if all required habits completed
  journal?: {
    title: string;
    content: string;
    mood: string;
    attachments?: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentDays: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'perfection' | 'total';
  rewardXp: number;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlocked: boolean;
  unlockedDate?: string;
  glowColor: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'streak' | 'achievement' | 'warning' | 'summary' | 'journal';
  timestamp: string;
  read: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  currentStreak: number;
  isCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  successRate: number;
  bio: string;
  joinedDate: string;
}

export interface UserCredential {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'suspended';
}
