'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Bell, LogOut, Sun, Moon } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { 
    user, 
    notifications, 
    setShowNotificationDrawer, 
    setActiveView,
    logout,
    theme,
    setTheme
  } = useStreak();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between min-h-[52px] border-b" style={{ background: 'var(--surface-canvas)', borderColor: 'var(--hairline)' }}>
      {/* Left — Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#22C55E' }}>
          <Flame className="w-4 h-4 text-white fire-animated" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
            {user.name || 'Streakify'}
          </span>
          <span className="text-[10px] font-mono leading-tight" style={{ color: 'var(--muted-claude)' }}>
            {user.currentStreak > 0 ? <><span className="num-font">{user.currentStreak}</span>d streak</> : 'Start today'}
          </span>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1.5">
        {/* Streak pill badge */}
        <button 
          onClick={() => setShowNotificationDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 border bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-green-500/10 border-orange-500/30 text-orange-500 shadow-xs"
        >
          <Flame className="w-4 h-4 fire-animated text-orange-500 fill-orange-500/30" />
          <span className="text-xs font-extrabold num-font text-orange-600 dark:text-orange-400">{user.currentStreak}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'var(--surface-soft)', color: 'var(--muted-claude)' }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'transparent', color: 'var(--muted-claude)' }}
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={async () => { await logout(); }}
          title="Logout"
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ color: 'var(--muted-claude)' }}
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>

        {/* Avatar */}
        <div 
          onClick={() => setActiveView('profile')}
          className="cursor-pointer"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: '2px solid var(--hairline)' }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#22C55E', border: '2px solid var(--hairline)' }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
