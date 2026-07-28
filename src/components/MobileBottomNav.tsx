'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { LayoutDashboard, CheckSquare, BarChart3, Calendar, User, Flame } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setShowCheckInModal, user } = useStreak();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-2 flex items-center justify-around select-none">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      {/* Center Floating Action Button (FAB) for Check-in */}
      <div className="-mt-6">
        <button
          onClick={() => setShowCheckInModal(true)}
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg glow-green transition-transform active:scale-95 cursor-pointer border-2 border-slate-900"
        >
          <Flame className="w-7 h-7 fire-animated text-slate-950" />
        </button>
      </div>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
