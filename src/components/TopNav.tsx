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
    <header className="sticky top-0 z-30 bg-[#E8E0D8]/90 backdrop-blur-xl border-b border-[#D5CCC4] px-4 py-3 flex items-center justify-between min-h-[56px]">
      {/* Greeting Header */}
      <div className="truncate min-w-0">
        <h2 className="text-sm font-bold text-[#3D3D3D] truncate flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl gradient-coral flex items-center justify-center clay-icon">
            <Flame className="w-4 h-4 text-white fire-animated flex-shrink-0" />
          </div>
          <span className="truncate">{user.name || 'Streakify'}</span>
        </h2>
        <p className="text-[10px] text-[#6B6B6B] font-mono truncate pl-9">
          {user.currentStreak > 0 ? `${user.currentStreak} day streak 🔥` : 'Start your streak today'}
        </p>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Streak Counter Badge */}
        <div 
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 clay-badge gradient-coral cursor-pointer hover:scale-105 transition-transform"
        >
          <Flame className="w-3.5 h-3.5 fire-animated text-white" />
          <span className="text-sm font-extrabold text-white font-mono">{user.currentStreak}</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative p-2.5 neu-btn text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-lavender text-white font-mono text-[8px] flex items-center justify-center font-bold clay-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme}`}
          className="p-2.5 neu-btn text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors cursor-pointer"
        >
          {theme === 'dark' && <Moon className="w-4 h-4 text-[#7C9EB2]" />}
          {theme === 'amoled' && <Monitor className="w-4 h-4 text-[#C4A8D4]" />}
          {theme === 'light' && <Sun className="w-4 h-4 text-[#D4A574]" />}
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setActiveView('profile')}
          className="cursor-pointer group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover clay-avatar group-hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </header>
  );
};
