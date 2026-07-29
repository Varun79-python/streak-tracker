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
    { id: 'admin', label: 'Admin Panel 🔐', icon: ShieldCheck, isRoute: true, href: '/admin' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#D5CCC4] bg-[#E0D8D0]/80 backdrop-blur-xl h-screen sticky top-0 z-40 select-none">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#D5CCC4] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl gradient-coral flex items-center justify-center clay-icon overflow-hidden">
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
          <h1 className="font-bold text-[#3D3D3D] tracking-tight text-lg">Streakify</h1>
          <p className="text-[11px] text-[#6B6B6B] font-mono">Build Discipline Daily</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => setShowCheckInModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl gradient-coral text-white font-bold text-sm my-3 transition-all clay-badge cursor-pointer hover:scale-[1.02]"
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'neu-pressed text-[#7C9EB2] font-semibold'
                  : 'neu-btn text-[#6B6B6B] hover:text-[#3D3D3D]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C9EB2]' : 'text-[#6B6B6B]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Motivational Quote Card */}
      <div className="p-4 border-t border-[#D5CCC4]">
        <div className="p-4 neu-card-sm text-xs space-y-1.5">
          <p className="text-[#D4A574] font-mono font-medium text-[11px]">"Discipline today, freedom tomorrow."</p>
          <p className="text-[#6B6B6B] text-[10px]">Level {user.level} • {user.xp} XP</p>
        </div>
      </div>

      {/* User Quick Profile & Logout */}
      <div className="p-4 border-t border-[#D5CCC4] flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('profile')}>
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover clay-avatar group-hover:scale-105 transition-transform" />
          <div className="truncate">
            <p className="text-sm font-semibold text-[#3D3D3D] truncate">{user.name}</p>
            <p className="text-[11px] text-[#7C9EB2] font-mono">Level {user.level}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push('/');
          }}
          title="Logout"
          className="p-2.5 neu-btn text-[#6B6B6B] hover:text-[#C47C7C] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
