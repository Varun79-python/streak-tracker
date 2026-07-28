'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, DayCheckIn, Achievement, Badge, LeaderboardUser, NotificationItem, UserProfile, UserCredential } from './types';
import { INITIAL_HABITS, INITIAL_USER, generateSeedHistory, INITIAL_ACHIEVEMENTS, INITIAL_BADGES, INITIAL_LEADERBOARD, INITIAL_NOTIFICATIONS } from './mockData';
import { format } from 'date-fns';

export const ADMIN_SECRET_KEY = '123456789987654321741852963369258147';

export const INITIAL_CREDENTIALS: UserCredential[] = [
  {
    id: 'u_1',
    email: 'vedant@example.com',
    password: 'password123',
    name: 'Vedant',
    role: 'user',
    createdAt: '2025-05-01',
    status: 'active'
  },
  {
    id: 'u_admin',
    email: 'admin@streakify.com',
    password: 'adminpassword',
    name: 'System Admin',
    role: 'admin',
    createdAt: '2025-01-01',
    status: 'active'
  }
];

interface StreakContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentUserEmail: string | null;
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
  credentials: UserCredential[];
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (val: boolean) => void;
  
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
  showAdminKeyModal: boolean;
  setShowAdminKeyModal: (val: boolean) => void;

  // Key operations & Admin functions
  loginWithCredentials: (email: string, pass: string) => { success: boolean; message: string };
  verifyAndUnlockAdmin: (keyInput: string) => boolean;
  createManagedUser: (name: string, email: string, pass: string) => void;
  updateManagedUser: (id: string, updates: Partial<UserCredential>) => void;
  deleteManagedUser: (id: string) => void;
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
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>('vedant@example.com');
  const [theme, setThemeState] = useState<'dark' | 'amoled' | 'light'>('dark');
  const [activeView, setActiveView] = useState<string>('dashboard');

  const [user, setUser] = useState<UserProfile>({ ...INITIAL_USER, id: 'u_1' });
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [history, setHistory] = useState<Record<string, DayCheckIn>>({});
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [credentials, setCredentials] = useState<UserCredential[]>(INITIAL_CREDENTIALS);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  // Modals
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDayDetailsDate, setSelectedDayDetailsDate] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);

  // Load state from localStorage or initialize seed
  useEffect(() => {
    try {
      const savedCredentials = localStorage.getItem('streakify_credentials');
      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials));
      } else {
        localStorage.setItem('streakify_credentials', JSON.stringify(INITIAL_CREDENTIALS));
      }

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

  // Auth check against admin-managed credentials
  const loginWithCredentials = (emailInput: string, passwordInput: string) => {
    const matched = credentials.find(
      (c) => c.email.toLowerCase() === emailInput.trim().toLowerCase() && c.password === passwordInput.trim()
    );

    if (!matched) {
      return { success: false, message: 'Invalid Credentials. Access is restricted to Admin-provisioned accounts.' };
    }

    if (matched.status === 'suspended') {
      return { success: false, message: 'Account is suspended by Admin.' };
    }

    setCurrentUserEmail(matched.email);
    setUser(prev => ({ ...prev, name: matched.name, email: matched.email }));
    setIsLoggedIn(true);
    setActiveView('dashboard');
    return { success: true, message: 'Login successful' };
  };

  // Verify secret Admin Key
  const verifyAndUnlockAdmin = (keyInput: string) => {
    if (keyInput.trim() === ADMIN_SECRET_KEY) {
      setIsAdminUnlocked(true);
      setActiveView('admin');
      return true;
    }
    return false;
  };

  // Admin User Creation
  const createManagedUser = (name: string, email: string, pass: string) => {
    const newUser: UserCredential = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: pass.trim(),
      role: 'user',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      status: 'active'
    };

    const updated = [...credentials, newUser];
    setCredentials(updated);
    localStorage.setItem('streakify_credentials', JSON.stringify(updated));
  };

  // Admin User Credential Update (Immediate sync to DB/storage)
  const updateManagedUser = (id: string, updates: Partial<UserCredential>) => {
    const updated = credentials.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCredentials(updated);
    localStorage.setItem('streakify_credentials', JSON.stringify(updated));

    // If currently logged in user is updated, update active session user details
    const target = updated.find((c) => c.id === id);
    if (target && target.email === user.email) {
      setUser((prev) => ({ ...prev, name: target.name, email: target.email }));
    }
  };

  // Admin User Deletion
  const deleteManagedUser = (id: string) => {
    const updated = credentials.filter((c) => c.id !== id);
    setCredentials(updated);
    localStorage.setItem('streakify_credentials', JSON.stringify(updated));
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
    setCredentials(INITIAL_CREDENTIALS);
    localStorage.removeItem('streakify_history');
    localStorage.removeItem('streakify_habits');
    localStorage.removeItem('streakify_user');
    localStorage.removeItem('streakify_credentials');
  };

  return (
    <StreakContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      currentUserEmail,
      theme, setTheme,
      activeView, setActiveView,
      user, setUser,
      habits, history,
      achievements, badges, leaderboard, notifications,
      credentials,
      isAdminUnlocked, setIsAdminUnlocked,
      showCheckInModal, setShowCheckInModal,
      showAddHabitModal, setShowAddHabitModal,
      editingHabit, setEditingHabit,
      selectedDayDetailsDate, setSelectedDayDetailsDate,
      showDemoModal, setShowDemoModal,
      showNotificationDrawer, setShowNotificationDrawer,
      showAdminKeyModal, setShowAdminKeyModal,
      loginWithCredentials,
      verifyAndUnlockAdmin,
      createManagedUser,
      updateManagedUser,
      deleteManagedUser,
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
