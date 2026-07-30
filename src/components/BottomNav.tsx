'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Home, ListChecks, Flame, BarChart3, Calendar } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setShowCheckInModal, theme } = useStreak();

  const isDark = theme === 'dark';
  const activeColor = isDark ? '#39D353' : '#22C55E';
  const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';
  const barBg = isDark ? '#161B22' : '#FFFFFF';
  const borderColor = isDark ? '#30363D' : '#E5E7EB';

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'habits', label: 'Habits', icon: ListChecks },
    { id: 'checkin', label: 'Check-in', icon: Flame, isCenter: true },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 select-none"
      style={{ 
        background: barBg,
        borderTop: `1px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setShowCheckInModal(true)}
                className="flex flex-col items-center gap-1 px-3 py-1 transition-all cursor-pointer"
                style={{ color: activeColor }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center -mt-4"
                  style={{ 
                    background: activeColor,
                    boxShadow: `0 4px 12px ${activeColor}40`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: isDark ? '#000000' : '#FFFFFF' }} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-all cursor-pointer"
              style={{ color: isActive ? activeColor : inactiveColor }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
