'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { LayoutDashboard, BarChart3, Calendar, MessageCircle, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setShowCheckInModal } = useStreak();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'coach', label: 'Coach', icon: MessageCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 select-none">
      <div className="flex items-center justify-around rounded-2xl py-2 px-1" style={{ background: '#252320', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer"
              style={{ 
                color: isActive ? '#faf9f5' : '#6c6a64',
                background: isActive ? 'rgba(250, 249, 245, 0.08)' : 'transparent'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Center FAB */}
        <div className="-mt-7">
          <button
            onClick={() => setShowCheckInModal(true)}
            className="w-13 h-13 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer hover:scale-105"
            style={{ 
              background: '#cc785c', 
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(204, 120, 92, 0.4)',
              width: '52px',
              height: '52px'
            }}
          >
            <Flame className="w-6 h-6 fire-animated text-white" />
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer"
              style={{ 
                color: isActive ? '#faf9f5' : '#6c6a64',
                background: isActive ? 'rgba(250, 249, 245, 0.08)' : 'transparent'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
