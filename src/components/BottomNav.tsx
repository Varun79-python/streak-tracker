'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { LayoutDashboard, BarChart3, Calendar, MessageCircle, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setShowCheckInModal, theme } = useStreak();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'coach', label: 'Coach', icon: MessageCircle },
  ];

  const isDark = theme === 'dark';
  const barBg = isDark ? '#161B22' : '#111827';
  const activeColor = isDark ? '#39D353' : '#22C55E';
  const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';
  const activeBg = isDark ? 'rgba(57, 211, 83, 0.12)' : 'rgba(34, 197, 94, 0.12)';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 select-none">
      <div className="flex items-center justify-around rounded-2xl py-2 px-1" style={{ background: barBg, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer"
              style={{ 
                color: isActive ? activeColor : inactiveColor,
                background: isActive ? activeBg : 'transparent'
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
            className="rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer hover:scale-105"
            style={{ 
              background: activeColor, 
              color: isDark ? '#000000' : '#ffffff',
              boxShadow: `0 4px 16px ${activeColor}40`,
              width: '52px',
              height: '52px'
            }}
          >
            <Flame className="w-6 h-6 fire-animated" style={{ color: isDark ? '#000000' : '#ffffff' }} />
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
                color: isActive ? activeColor : inactiveColor,
                background: isActive ? activeBg : 'transparent'
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
