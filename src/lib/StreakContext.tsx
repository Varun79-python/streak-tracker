'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, DayCheckIn, Achievement, Badge, LeaderboardUser, NotificationItem, UserProfile } from './types';
import { INITIAL_HABITS, INITIAL_USER, generateSeedHistory, INITIAL_ACHIEVEMENTS, INITIAL_BADGES, INITIAL_LEADERBOARD, INITIAL_NOTIFICATIONS } from './mockData';
import { format } from 'date-fns';

interface StreakContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  theme: 'dark' | 'amoled' | 'light';
  setTheme: (t: 'dark' | 'amoled' | 'light') => void;
  activeView: string;
  setActiveView: (view: string) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  habits: Habit[];
  history: Record<string, DayCheckIn>;
  achievements: Achievement[];
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  notifications: NotificationItem[];
  
  // Modals state
  showCheckInModal: boolean;
  setShowCheckInModal: (val: boolean) => void;
  showAddHabitModal: boolean;
  setShowAddHabitModal: (val: boolean) => void;
  editingHabit: Habit | null;
  setEditingHabit: (h: Habit | null) => void;
  selectedDayDetailsDate: string | null;
  setSelectedDayDetailsDate: (d: string | null) => void;
  showDemoModal: boolean;
  setShowDemoModal: (val: boolean) => void;
  showNotificationDrawer: boolean;
  setShowNotificationDrawer: (val: boolean) => void;

  // Key operations
  submitDailyCheckIn: (completedIds: string[], journalText?: string, journalTitle?: string, mood?: string) => void;
  addNewHabit: (habitData: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  saveJournalEntry: (date: string, title: string, content: string, mood: string) => void;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [theme, setThemeState] = useState<'dark' | 'amoled' | 'light'>('dark');
  const [activeView, setActiveView] = useState<string>('dashboard');

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [history, setHistory] = useState<Record<string, DayCheckIn>>({});
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDayDetailsDate, setSelectedDayDetailsDate] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Load state from localStorage or initialize seed
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('streakify_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        const seed = generateSeedHistory();
        setHistory(seed);
        localStorage.setItem('streakify_history', JSON.stringify(seed));
      }

      const savedHabits = localStorage.getItem('streakify_habits');
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedUser = localStorage.getItem('streakify_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      setHistory(generateSeedHistory());
    }
  }, []);

  // Sync theme to root HTML element
  const setTheme = (t: 'dark' | 'amoled' | 'light') => {
    setThemeState(t);
    const root = document.documentElement;
    root.classList.remove('theme-amoled', 'theme-light');
    if (t === 'amoled') root.classList.add('theme-amoled');
    if (t === 'light') root.classList.add('theme-light');
  };

  // Submit Daily Check-in logic
  const submitDailyCheckIn = (completedIds: string[], journalText?: string, journalTitle?: string, mood?: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const requiredHabits = habits.filter(h => h.required && h.active);
    const completedReqCount = requiredHabits.filter(h => completedIds.includes(h.id)).length;
    const isPerfect = completedReqCount === requiredHabits.length;

    const totalHabitsCount = habits.filter(h => h.active).length;
    const pct = totalHabitsCount > 0 ? Math.round((completedIds.length / totalHabitsCount) * 100) : 0;
    const xpGained = isPerfect ? 50 : Math.round((completedIds.length / totalHabitsCount) * 25);

    const updatedCheckIn: DayCheckIn = {
      date: todayStr,
      completedHabits: completedIds,
      completionPercentage: pct,
      xpEarned: xpGained,
      completed: isPerfect,
      journal: journalText ? {
        title: journalTitle || 'Daily Reflection',
        content: journalText,
        mood: mood || 'Productive'
      } : undefined
    };

    const newHistory = { ...history, [todayStr]: updatedCheckIn };
    setHistory(newHistory);
    localStorage.setItem('streakify_history', JSON.stringify(newHistory));

    // Update User Stats
    if (isPerfect) {
      setUser(prev => {
        const newStreak = prev.currentStreak + 1;
        const newLongest = Math.max(prev.longestStreak, newStreak);
        const newXp = prev.xp + xpGained;
        const newTotalDays = prev.totalDays + 1;
        const updatedUser = {
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongest,
          xp: newXp,
          totalDays: newTotalDays,
          level: Math.floor(newXp / 100) + 1
        };
        localStorage.setItem('streakify_user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      // Add Notification
      setNotifications(prev => [
        {
          id: `n_${Date.now()}`,
          title: '🔥 Streak Continued!',
          message: `Awesome work! You completed all required habits for today. +${xpGained} XP!`,
          type: 'streak',
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);
    }
  };

  const addNewHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h_${Date.now()}`
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    localStorage.setItem('streakify_habits', JSON.stringify(updated));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updated = habits.map(h => h.id === id ? { ...h, ...updates } : h);
    setHabits(updated);
    localStorage.setItem('streakify_habits', JSON.stringify(updated));
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem('streakify_habits', JSON.stringify(updated));
  };

  const saveJournalEntry = (date: string, title: string, content: string, mood: string) => {
    const existing = history[date] || {
      date,
      completedHabits: [],
      completionPercentage: 0,
      xpEarned: 0,
      completed: false
    };

    const updated: DayCheckIn = {
      ...existing,
      journal: { title, content, mood }
    };

    const newHistory = { ...history, [date]: updated };
    setHistory(newHistory);
    localStorage.setItem('streakify_history', JSON.stringify(newHistory));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    const seed = generateSeedHistory();
    setHistory(seed);
    setUser(INITIAL_USER);
    setHabits(INITIAL_HABITS);
    localStorage.removeItem('streakify_history');
    localStorage.removeItem('streakify_habits');
    localStorage.removeItem('streakify_user');
  };

  return (
    <StreakContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      theme, setTheme,
      activeView, setActiveView,
      user, setUser,
      habits, history,
      achievements, badges, leaderboard, notifications,
      showCheckInModal, setShowCheckInModal,
      showAddHabitModal, setShowAddHabitModal,
      editingHabit, setEditingHabit,
      selectedDayDetailsDate, setSelectedDayDetailsDate,
      showDemoModal, setShowDemoModal,
      showNotificationDrawer, setShowNotificationDrawer,
      submitDailyCheckIn,
      addNewHabit,
      updateHabit,
      deleteHabit,
      saveJournalEntry,
      markAllNotificationsRead,
      resetAllData
    }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) throw new Error('useStreak must be used within StreakProvider');
  return context;
};
