'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Habit, DayCheckIn, Achievement, Badge, LeaderboardUser, NotificationItem, UserProfile, UserCredential } from './types';
import { INITIAL_HABITS, INITIAL_USER, INITIAL_ACHIEVEMENTS, INITIAL_BADGES, INITIAL_LEADERBOARD, INITIAL_NOTIFICATIONS } from './mockData';
import { format } from 'date-fns';

export const ADMIN_SECRET_KEY = '123456789987654321741852963369258147';

export const INITIAL_CREDENTIALS: UserCredential[] = [
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
  sessionId: string | null;
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
  setCredentials: React.Dispatch<React.SetStateAction<UserCredential[]>>;
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
  loginWithCredentials: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  verifyAndUnlockAdmin: (keyInput: string) => boolean;
  submitDailyCheckIn: (completedIds: string[], journalText?: string, journalTitle?: string, mood?: string) => Promise<void>;
  addNewHabit: (habitData: Omit<Habit, 'id'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
  refreshUserData: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

// Transform Supabase data to frontend types
const transformHabit = (q: any): Habit => ({
  id: q.id,
  name: q.title,
  description: q.description || '',
  icon: q.icon || 'circle',
  category: 'custom',
  required: q.is_required,
  active: q.is_active,
  color: '#10b981',
  reminderTime: undefined,
});

const transformCheckIn = (dc: any): DayCheckIn => ({
  date: dc.completion_date,
  completedHabits: dc.completed_question_ids || [],
  completionPercentage: Number(dc.completion_percentage) || 0,
  xpEarned: dc.xp_earned || 0,
  completed: dc.is_completed || false,
  journal: dc.journal_entry ? {
    title: 'Daily Reflection',
    content: dc.journal_entry,
    mood: dc.mood || 'Productive',
  } : undefined,
});

const transformProfile = (p: any): UserProfile => ({
  id: p.id,
  name: p.display_name || p.username || 'User',
  email: p.username || '',
  avatar: p.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(p.display_name || p.username || 'User')}`,
  level: p.level || 1,
  xp: p.xp || 0,
  nextLevelXp: (p.level || 1) * 100,
  currentStreak: p.current_streak || 0,
  longestStreak: p.longest_streak || 0,
  totalDays: p.total_completed_days || 0,
  successRate: Number(p.completion_percentage) || 0,
  bio: p.bio || '',
  joinedDate: p.created_at?.split('T')[0] || '',
});

const transformCredential = (u: any): UserCredential => ({
  id: u.id,
  email: u.username,
  password: '', // Not stored in frontend
  name: u.display_name || u.username,
  role: u.role,
  createdAt: u.created_at?.split('T')[0] || '',
  status: u.status,
});

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'dark' | 'amoled' | 'light'>('dark');
  const [activeView, setActiveView] = useState<string>('login');
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
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

  // Sync theme to root HTML element
  const setTheme = useCallback((t: 'dark' | 'amoled' | 'light') => {
    setThemeState(t);
    const root = document.documentElement;
    root.classList.remove('theme-amoled', 'theme-light');
    if (t === 'amoled') root.classList.add('theme-amoled');
    if (t === 'light') root.classList.add('theme-light');
  }, []);

  // Load user data from Supabase
  const loadUserData = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [habitsRes, historyRes, profileRes, achievementsRes, badgesRes, notificationsRes] = await Promise.all([
        fetch(`/api/user/habits?userId=${userId}`),
        fetch(`/api/user/history?userId=${userId}`),
        fetch(`/api/user/profile?userId=${userId}`),
        fetch(`/api/user/achievements?userId=${userId}`),
        fetch(`/api/user/badges?userId=${userId}`),
        fetch(`/api/user/notifications?userId=${userId}`),
      ]);

      if (habitsRes.ok) {
        const data = await habitsRes.json();
        setHabits(data.map(transformHabit));
      }
      
      if (historyRes.ok) {
        const data = await historyRes.json();
        const historyMap: Record<string, DayCheckIn> = {};
        data.forEach((item: any) => {
          historyMap[item.completion_date] = transformCheckIn(item);
        });
        setHistory(historyMap);
      }

      if (profileRes.ok) {
        const data = await profileRes.json();
        setUser(transformProfile(data));
      }

      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements(data);
      }

      if (badgesRes.ok) {
        const data = await badgesRes.json();
        setBadges(data);
      }

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load credentials for admin view
  const loadCredentials = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/admin/users', {
        headers: { 'Authorization': `Bearer ${ADMIN_SECRET_KEY}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setCredentials(data.users.map(transformCredential));
        }
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
    }
  }, []);

  // Initial load - check for existing session from Redis
  useEffect(() => {
    const init = async () => {
      const storedSessionId = localStorage.getItem('streakify_session_id');
      const storedEmail = localStorage.getItem('streakify_user_email');
      const storedUserId = localStorage.getItem('streakify_user_id');
      
      if (storedSessionId && storedEmail && storedUserId) {
        // Verify session with Redis
        try {
          const res = await fetch('/api/session/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: storedSessionId }),
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.valid) {
              setSessionId(storedSessionId);
              setCurrentUserEmail(storedEmail);
              setIsLoggedIn(true);
              setActiveView('dashboard');
              await loadUserData(storedUserId);
            } else {
              // Session expired, clear local storage
              localStorage.removeItem('streakify_session_id');
              localStorage.removeItem('streakify_user_email');
              localStorage.removeItem('streakify_user_id');
            }
          } else {
            // Session invalid, clear local storage
            localStorage.removeItem('streakify_session_id');
            localStorage.removeItem('streakify_user_email');
            localStorage.removeItem('streakify_user_id');
          }
        } catch (error) {
          // If Redis is unavailable, fallback to local session
          console.warn('Session verification failed, using local session:', error);
          setSessionId(storedSessionId);
          setCurrentUserEmail(storedEmail);
          setIsLoggedIn(true);
          setActiveView('dashboard');
          await loadUserData(storedUserId);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [loadUserData]);

  // Auth check against Supabase via API
  const loginWithCredentials = async (emailInput: string, passwordInput: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.error || 'Invalid credentials' };
      }

      setCurrentUserEmail(data.user.email);
      setSessionId(data.sessionId);
      setUser(prev => ({ ...prev, name: data.user.name, email: data.user.email }));
      setIsLoggedIn(true);
      setActiveView('dashboard');
      
      // Store session data in localStorage for persistence
      localStorage.setItem('streakify_session_id', data.sessionId);
      localStorage.setItem('streakify_user_email', data.user.email);
      localStorage.setItem('streakify_user_id', data.user.id);
      
      // Load user data
      await loadUserData(data.user.id);
      
      return { success: true, message: 'Login successful' };
    } catch {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Verify secret Admin Key
  const verifyAndUnlockAdmin = (keyInput: string) => {
    if (keyInput.trim() === ADMIN_SECRET_KEY) {
      setIsAdminUnlocked(true);
      setIsLoggedIn(true);
      setActiveView('admin');
      loadCredentials();
      return true;
    }
    return false;
  };

  // Logout function - destroys Redis session
  const logout = async () => {
    const userId = localStorage.getItem('streakify_user_id');
    const currentSessionId = localStorage.getItem('streakify_session_id');
    
    // Destroy session in Redis
    if (currentSessionId || userId) {
      try {
        await fetch('/api/session/destroy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId: currentSessionId, 
            userId 
          }),
        });
      } catch (error) {
        console.warn('Failed to destroy Redis session:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('streakify_session_id');
    localStorage.removeItem('streakify_user_email');
    localStorage.removeItem('streakify_user_id');
    
    // Reset state
    setSessionId(null);
    setCurrentUserEmail(null);
    setIsLoggedIn(false);
    setIsAdminUnlocked(false);
    setActiveView('login');
    setUser(INITIAL_USER);
    setHabits([]);
    setHistory({});
    setNotifications([]);
  };

  // Submit Daily Check-in
  const submitDailyCheckIn = async (completedIds: string[], journalText?: string, journalTitle?: string, mood?: string) => {
    const userId = localStorage.getItem('streakify_user_id');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const requiredHabits = habits.filter(h => h.required && h.active);
    const completedReqCount = requiredHabits.filter(h => completedIds.includes(h.id)).length;
    const isPerfect = requiredHabits.length > 0 ? completedReqCount === requiredHabits.length : completedIds.length > 0;

    const totalHabitsCount = habits.filter(h => h.active).length;
    const pct = totalHabitsCount > 0 ? Math.round((completedIds.length / totalHabitsCount) * 100) : 0;
    const xpGained = isPerfect ? 50 : Math.round((completedIds.length / (totalHabitsCount || 1)) * 25);

    // Prepare local update
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

    // Update local state first for instant responsiveness
    setHistory(prev => ({ ...prev, [todayStr]: updatedCheckIn }));

    if (isPerfect) {
      setUser(prev => {
        const newStreak = prev.currentStreak + 1;
        const newLongest = Math.max(prev.longestStreak, newStreak);
        const newXp = prev.xp + xpGained;
        const newTotalDays = prev.totalDays + 1;
        return {
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongest,
          xp: newXp,
          totalDays: newTotalDays,
          level: Math.floor(newXp / 100) + 1
        };
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

    // Sync to backend if logged in
    if (userId) {
      try {
        await fetch('/api/user/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            date: todayStr,
            completedHabitIds: completedIds,
            completionPercentage: pct,
            xpEarned: xpGained,
            isCompleted: isPerfect,
            journalEntry: journalText,
            journalTitle: journalTitle || 'Daily Reflection',
            mood: mood || 'Productive',
          }),
        });
      } catch (error) {
        console.warn('Backend check-in sync skipped or offline:', error);
      }
    }
  };

  const addNewHabit = async (habitData: Omit<Habit, 'id'>) => {
    const userId = localStorage.getItem('streakify_user_id');
    const localId = `h_${Date.now()}`;
    const newHabitObj: Habit = {
      id: localId,
      ...habitData,
    };

    // Local state update
    setHabits(prev => [...prev, newHabitObj]);

    if (userId) {
      try {
        const res = await fetch('/api/user/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...habitData }),
        });

        if (res.ok) {
          const created = await res.json();
          // Replace temporary local ID with server ID
          setHabits(prev => prev.map(h => h.id === localId ? transformHabit(created) : h));
        }
      } catch (error) {
        console.warn('Backend habit creation skipped or offline:', error);
      }
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const userId = localStorage.getItem('streakify_user_id');

    // Local state update
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

    if (userId) {
      try {
        await fetch(`/api/user/habits/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        });
      } catch (error) {
        console.warn('Backend habit update skipped or offline:', error);
      }
    }
  };

  const deleteHabit = async (id: string) => {
    const userId = localStorage.getItem('streakify_user_id');

    // Local state update
    setHabits(prev => prev.filter(h => h.id !== id));

    if (userId) {
      try {
        await fetch(`/api/user/habits/${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.warn('Backend habit delete skipped or offline:', error);
      }
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = async () => {
    // Destroy Redis session
    const userId = localStorage.getItem('streakify_user_id');
    const currentSessionId = localStorage.getItem('streakify_session_id');
    
    if (currentSessionId || userId) {
      try {
        await fetch('/api/session/destroy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: currentSessionId, userId }),
        });
      } catch (error) {
        console.warn('Failed to destroy Redis session:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('streakify_session_id');
    localStorage.removeItem('streakify_user_email');
    localStorage.removeItem('streakify_user_id');
    
    // Reset state
    setHistory({});
    setUser(INITIAL_USER);
    setHabits([]);
    setAchievements([]);
    setBadges([]);
    setLeaderboard([]);
    setNotifications([]);
    setCredentials(INITIAL_CREDENTIALS);
    setSessionId(null);
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    setActiveView('login');
  };

  const refreshUserData = async () => {
    const userId = localStorage.getItem('streakify_user_id');
    if (userId) {
      await loadUserData(userId);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const userId = localStorage.getItem('streakify_user_id');

    // Optimistic local update
    setUser(prev => ({ ...prev, ...updates }));

    if (userId) {
      try {
        await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            avatar: updates.avatar,
            name: updates.name,
            bio: updates.bio,
          }),
        });
      } catch (error) {
        console.warn('Failed to save profile to server:', error);
      }
    }
  };

  return (
    <StreakContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      currentUserEmail,
      sessionId,
      theme, setTheme,
      activeView, setActiveView,
      user, setUser,
      habits, history,
      achievements, badges, leaderboard, notifications,
      credentials, setCredentials,
      isAdminUnlocked, setIsAdminUnlocked,
      showCheckInModal, setShowCheckInModal,
      showAddHabitModal, setShowAddHabitModal,
      editingHabit, setEditingHabit,
      selectedDayDetailsDate, setSelectedDayDetailsDate,
      showDemoModal, setShowDemoModal,
      showNotificationDrawer, setShowNotificationDrawer,
      showAdminKeyModal, setShowAdminKeyModal,
      loginWithCredentials,
      logout,
      verifyAndUnlockAdmin,
      submitDailyCheckIn,
      addNewHabit,
      updateHabit,
      deleteHabit,
      markAllNotificationsRead,
      resetAllData,
      refreshUserData,
      updateUserProfile,
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