'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Grid3X3, 
  BarChart3, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Trophy, 
  Award, 
  BookOpen, 
  Medal, 
  Sliders, 
  Settings, 
  User, 
  LogOut,
  Flame,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, logout, user, setShowCheckInModal } = useStreak();
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Heatmap Matrix', icon: Grid3X3 },
    { id: 'statistics', label: 'Statistics & Charts', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
    { id: 'checkin_trigger', label: 'Daily Check-in', icon: CheckSquare, isAction: true },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'badges', label: 'Badges & Trophies', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
    { id: 'habits', label: 'Habit Management', icon: Sliders },
    { id: 'activity', label: 'Activity History', icon: Clock },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About & Docs', icon: BookOpen, isRoute: true, href: '/about' },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, isRoute: true, href: '/admin' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--hairline)] h-screen sticky top-0 z-40 select-none" style={{ background: 'var(--surface-soft)' }}>
      {/* Brand Logo */}
      <div className="p-6 border-b border-[var(--hairline)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'var(--green)' }}>
          <img 
            src="/logo.png" 
            alt="Streakify Logo" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }} 
          />
          <Flame className="w-5 h-5 fire-animated text-white" />
        </div>
        <div>
          <h1 className="font-bold text-[var(--ink)] tracking-tight text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Streakify</h1>
          <p className="text-[11px] text-[var(--muted-claude)] font-mono">Build Discipline Daily</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => setShowCheckInModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-bold text-sm my-3 transition-all cursor-pointer hover:opacity-90"
                style={{ background: 'var(--green)' }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isRoute && item.href) {
                  router.push(item.href);
                } else {
                  setActiveView(item.id);
                  router.push('/');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{ 
                background: isActive ? 'rgba(57, 211, 83, 0.08)' : 'transparent',
                color: isActive ? 'var(--green)' : 'var(--muted-claude)',
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Motivational Quote Card */}
      <div className="p-4 border-t border-[var(--hairline)]">
        <div className="p-4 rounded-xl text-xs space-y-1.5" style={{ background: '#efe9de', border: '1px solid var(--hairline)' }}>
          <p className="font-medium text-[11px]" style={{ color: 'var(--green)' }}>"Discipline today, freedom tomorrow."</p>
          <p className="text-[10px] text-[var(--muted-claude)]">Level {user.level} · {user.xp} XP</p>
        </div>
      </div>

      {/* User Quick Profile & Logout */}
      <div className="p-4 border-t border-[var(--hairline)] flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('profile')}>
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'User')}`} 
            alt={user.name || 'User'} 
            className="w-10 h-10 rounded-full object-cover group-hover:opacity-80 transition-opacity" 
            style={{ border: '2px solid var(--hairline)' }}
          />
          <div className="truncate">
            <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.name}</p>
            <p className="text-[11px] font-mono" style={{ color: 'var(--green)' }}>Level {user.level}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          title="Logout"
          className="claude-btn-icon cursor-pointer"
          style={{ color: 'var(--muted-claude)' }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
