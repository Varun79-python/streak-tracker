'use client';

import React, { useMemo } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Bell, LogOut, Sun, Moon } from 'lucide-react';

/** Compute consecutive days with a check-in, walking backwards from today (LeetCode-style). */
function computeHeatmapStreak(history: Record<string, { completed?: boolean }>): number {
  const today = new Date();
  let streak = 0;
  const d = new Date(today);

  for (let i = 0; i < 366; i++) {
    const key = d.toISOString().split('T')[0];
    const entry = history[key];
    if (entry && (entry.completed === true || Object.keys(entry).length > 0)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export const TopNav: React.FC = () => {
  const { 
    user, 
    history,
    notifications, 
    setShowNotificationDrawer, 
    setActiveView,
    logout,
    theme,
    setTheme
  } = useStreak();

  const unreadCount = notifications.filter(n => !n.read).length;
  const heatmapStreak = useMemo(() => computeHeatmapStreak(history), [history]);

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between min-h-[48px] sm:min-h-[52px] border-b" style={{ background: 'var(--surface-canvas)', borderColor: 'var(--hairline)' }}>
      {/* Left — Brand */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: '#22C55E' }}>
          <img 
            src="/logo.png" 
            alt="Streakify Logo" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }} 
          />
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fire-animated" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-bold leading-tight truncate" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
            {user.name || 'Streakify'}
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-[var(--muted-soft)] leading-tight truncate max-w-[100px] sm:max-w-[140px]">
            {heatmapStreak > 0 ? <>{heatmapStreak}d streak</> : 'Start today'}
          </span>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Streak Badge — compressed on mobile */}
        <div 
          onClick={() => setShowNotificationDrawer(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
          style={{ 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.22))', 
            border: '1px solid var(--green)',
            borderRadius: '9999px' 
          }}
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green)', borderRadius: '9999px' }}>
            <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold num-font" style={{ color: 'var(--ink)' }}>{heatmapStreak}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'var(--surface-soft)', color: 'var(--muted-claude)' }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotificationDrawer(true)}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'transparent', color: 'var(--muted-claude)' }}
        >
          <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
          )}
        </button>

        {/* Logout — hidden on very small screens */}
        <button
          onClick={async () => { await logout(); }}
          title="Logout"
          className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center cursor-pointer transition-colors"
          style={{ color: 'var(--muted-claude)' }}
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>

        {/* Avatar */}
        <div 
          onClick={() => setActiveView('profile')}
          className="cursor-pointer"
        >
          {user.avatar && user.avatar.trim() !== '' ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              style={{ border: '2px solid var(--hairline)' }}
            />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white" style={{ background: '#22C55E', border: '2px solid var(--hairline)' }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
