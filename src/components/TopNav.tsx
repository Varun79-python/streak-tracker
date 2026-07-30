'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Bell, LogOut } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { 
    user, 
    notifications, 
    setShowNotificationDrawer, 
    setActiveView,
    logout
  } = useStreak();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between min-h-[52px]" style={{ background: 'rgba(250, 249, 245, 0.92)', backdropFilter: 'blur(16px)' }}>
      {/* Left — Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#cc785c' }}>
          <Flame className="w-4 h-4 text-white fire-animated" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight" style={{ color: '#141413', fontFamily: 'var(--font-heading)' }}>
            {user.name || 'Streakify'}
          </span>
          <span className="text-[10px] font-mono leading-tight" style={{ color: '#6c6a64' }}>
            {user.currentStreak > 0 ? `${user.currentStreak}d streak` : 'Start today'}
          </span>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1.5">
        {/* Streak pill */}
        <button 
          onClick={() => setShowNotificationDrawer(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: 'rgba(204, 120, 92, 0.1)' }}
        >
          <Flame className="w-3.5 h-3.5 fire-animated" style={{ color: '#cc785c' }} />
          <span className="text-xs font-bold font-mono" style={{ color: '#cc785c' }}>{user.currentStreak}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'transparent' }}
        >
          <Bell className="w-[18px] h-[18px]" style={{ color: '#6c6a64' }} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#cc785c' }} />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={async () => { await logout(); }}
          title="Logout"
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" style={{ color: '#6c6a64' }} />
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
              style={{ border: '2px solid #e6dfd8' }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#cc785c', color: '#ffffff', border: '2px solid #e6dfd8' }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
