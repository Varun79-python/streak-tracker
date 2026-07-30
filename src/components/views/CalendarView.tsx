'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameDay, 
  isFuture 
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { history, setSelectedDayDetailsDate } = useStreak();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayPadding = getDay(monthStart);

  const getDayStatus = (date: Date) => {
    if (isFuture(date)) return { color: 'claude-card-soft text-[#8e8b82]', label: 'Future' };

    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = history[dateStr];

    if (!entry || entry.completionPercentage === 0) {
      return { color: 'claude-card-soft border-[#c64545]/30 text-[#c64545]', label: 'Missed' };
    }
    if (entry.completionPercentage < 100) {
      return { color: 'claude-card-soft border-[#e8a55a]/30 text-[#e8a55a]', label: 'Partial' };
    }
    return { color: 'claude-card-soft border-[#cc785c]/40 text-[#cc785c] font-bold', label: 'Completed' };
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#252523] flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-[#cc785c]" />
            <span>Monthly Calendar Overview</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">View daily performance statuses. Click any date to view detailed breakdown & reflections.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-[#6c6a64] hover:text-[#252523] transition-colors cursor-pointer claude-btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-[#252523] font-mono min-w-36 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-[#6c6a64] hover:text-[#252523] transition-colors cursor-pointer claude-btn-secondary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="claude-card p-4 rounded-2xl flex items-center justify-around flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: '#5db8a6', border: '1px solid #cc785c' }} />
          <span className="text-[#6c6a64]">Green = Completed (100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: '#e8a55a', border: '1px solid #e8a55a' }} />
          <span className="text-[#6c6a64]">Yellow = Partial (&lt;100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: '#cc785c', border: '1px solid #c64545' }} />
          <span className="text-[#6c6a64]">Red = Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: 'rgba(204, 120, 92, 0.08)' }} />
          <span className="text-[#8e8b82]">Gray = Future</span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="claude-card p-6 rounded-3xl space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold font-mono text-[#8e8b82] border-b border-[#8e8b82]/20 pb-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDayPadding }).map((_, idx) => (
            <div key={`pad-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-transparent" />
          ))}

          {daysInMonth.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = getDayStatus(day);
            const entry = history[dateStr];
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDayDetailsDate(dateStr)}
                className={`h-20 sm:h-24 p-2 rounded-2xl flex flex-col justify-between transition-all hover:scale-105 cursor-pointer relative ${status.color} ${
                  isToday ? 'ring-2 ring-[#cc785c]' : ''
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-mono text-xs sm:text-sm font-extrabold">{format(day, 'd')}</span>
                  {isToday && (
                    <span className="text-[9px] px-1 rounded text-[#252523] font-bold uppercase" style={{ borderRadius: '9999px', background: '#5db8a6' }}>
                      Today
                    </span>
                  )}
                </div>

                {entry && entry.completionPercentage > 0 && (
                  <div className="text-[10px] font-mono text-right w-full space-y-0.5">
                    <p className="font-bold">{entry.completionPercentage}%</p>
                    <p className="text-[#cc785c]">+{entry.xpEarned} XP</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
