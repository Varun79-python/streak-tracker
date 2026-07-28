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
    <header className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Greeting Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          Good evening, {user.name}! 👋
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Stay consistent, the results will follow.
        </p>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Streak Counter Badge */}
        <div 
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-pointer hover:bg-emerald-500/20 transition-colors glow-green"
        >
          <Flame className="w-5 h-5 fire-animated text-emerald-400" />
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-lg font-extrabold text-emerald-400">{user.currentStreak}</span>
            <span className="text-xs text-emerald-300">days</span>
          </div>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative p-2.5 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme}`}
          className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          {theme === 'dark' && <Moon className="w-4 h-4 text-emerald-400" />}
          {theme === 'amoled' && <Monitor className="w-4 h-4 text-indigo-400" />}
          {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
          <span className="capitalize text-[11px] hidden sm:inline">{theme}</span>
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/50 group-hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </header>
  );
};
