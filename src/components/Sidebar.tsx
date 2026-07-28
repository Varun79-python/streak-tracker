'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
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
  Clock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setIsLoggedIn, user, setShowCheckInModal } = useStreak();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Heatmap Matrix', icon: Grid3X3 },
    { id: 'statistics', label: 'Statistics & Charts', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
    { id: 'checkin_trigger', label: 'Daily Check-in', icon: CheckSquare, isAction: true },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'badges', label: 'Badges & Trophies', icon: Award },
    { id: 'journal', label: 'Journal & Notes', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Medal },
    { id: 'habits', label: 'Habit Management', icon: Sliders },
    { id: 'activity', label: 'Activity History', icon: Clock },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#0f172a]/80 backdrop-blur-xl h-screen sticky top-0 z-40 select-none">
      {/* Brand Logo */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-green">
          <Flame className="w-5 h-5 fire-animated" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-tight text-lg">Streakify</h1>
          <p className="text-[11px] text-slate-400 font-mono">Build Discipline Daily</p>
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
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm my-3 transition-all glow-green cursor-pointer"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold glow-green'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Motivational Quote Card */}
      <div className="p-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs space-y-1">
          <p className="text-amber-400 font-mono font-medium text-[11px]">"Discipline today, freedom tomorrow."</p>
          <p className="text-slate-400 text-[10px]">Level {user.level} • {user.xp} XP</p>
        </div>
      </div>

      {/* User Quick Profile & Logout */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('profile')}>
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-emerald-500/40" />
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
            <p className="text-[11px] text-emerald-400 font-mono">Level {user.level}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setActiveView('landing');
          }}
          title="Logout"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
