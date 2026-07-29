'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Bell, Moon, Sun, Monitor, Menu } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { 
    user, 
    theme, 
    setTheme, 
    notifications, 
    setShowNotificationDrawer, 
    setActiveView,
    setShowCheckInModal 
  } = useStreak();

  const unreadCount = notifications.filter(n => !n.read).length;

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('amoled');
    else if (theme === 'amoled') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10 px-3 py-3 flex items-center justify-between min-h-[52px]">
      {/* Greeting Header */}
      <div className="truncate min-w-0">
        <h2 className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-emerald-400 fire-animated flex-shrink-0" />
          <span className="truncate">{user.name || 'Streakify'}</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-mono truncate">
          {user.currentStreak > 0 ? `${user.currentStreak} day streak 🔥` : 'Start your streak today'}
        </p>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Streak Counter Badge */}
        <div 
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-pointer hover:bg-emerald-500/20 transition-colors glow-green"
        >
          <Flame className="w-3.5 h-3.5 fire-animated text-emerald-400" />
          <span className="text-sm font-extrabold text-emerald-400 font-mono">{user.currentStreak}</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative p-2 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-mono text-[8px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme}`}
          className="p-2 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-emerald-400" />}
          {theme === 'amoled' && <Monitor className="w-3.5 h-3.5 text-indigo-400" />}
          {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setActiveView('profile')}
          className="cursor-pointer group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 group-hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </header>
  );
};
