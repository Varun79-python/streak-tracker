'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { LayoutDashboard, BarChart3, Calendar, MessageCircle, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setShowCheckInModal, user } = useStreak();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'coach', label: 'Coach', icon: MessageCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#E8E0D8]/95 backdrop-blur-2xl border-t border-[#D5CCC4] px-4 py-3 flex items-center justify-around select-none" style={{ boxShadow: '0 -4px 20px rgba(197, 189, 181, 0.5)' }}>
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              isActive 
                ? 'neu-pressed text-[#7C9EB2] font-bold' 
                : 'neu-btn text-[#6B6B6B] hover:text-[#3D3D3D]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#7C9EB2]' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}

      {/* Center Floating Action Button (FAB) for Check-in */}
      <div className="-mt-8">
        <button
          onClick={() => setShowCheckInModal(true)}
          className="w-14 h-14 rounded-full gradient-coral flex items-center justify-center clay-badge transition-transform active:scale-95 cursor-pointer hover:scale-105"
          style={{ boxShadow: '0 6px 20px rgba(212, 165, 116, 0.5)' }}
        >
          <Flame className="w-7 h-7 fire-animated text-white" />
        </button>
      </div>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              isActive 
                ? 'neu-pressed text-[#7C9EB2] font-bold' 
                : 'neu-btn text-[#6B6B6B] hover:text-[#3D3D3D]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#7C9EB2]' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
