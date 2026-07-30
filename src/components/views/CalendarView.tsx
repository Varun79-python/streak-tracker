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
    if (isFuture(date)) return { color: 'claude-card-soft text-[var(--muted-soft)]', label: 'Future' };

    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = history[dateStr];

    if (!entry || entry.completionPercentage === 0) {
      return { color: 'claude-card-soft border-[var(--error)]/30 text-[var(--error)]', label: 'Missed' };
    }
    if (entry.completionPercentage < 100) {
      return { color: 'claude-card-soft border-[var(--green)]/30 text-[var(--green)]', label: 'Partial' };
    }
    return { color: 'claude-card-soft border-[var(--green)]/40 text-[var(--green)] font-bold', label: 'Completed' };
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-[var(--green)]" />
            <span>Monthly Calendar Overview</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">View daily performance statuses. Click any date to view detailed breakdown & reflections.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-[var(--muted-claude)] hover:text-[var(--ink)] transition-colors cursor-pointer claude-btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-[var(--ink)] font-mono min-w-36 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-[var(--muted-claude)] hover:text-[var(--ink)] transition-colors cursor-pointer claude-btn-secondary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="claude-card p-4 rounded-2xl flex items-center justify-around flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: 'var(--green)', border: '1px solid var(--green)' }} />
          <span className="text-[var(--muted-claude)]">Green = Completed (100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: 'var(--green)', border: '1px solid var(--green)' }} />
          <span className="text-[var(--muted-claude)]">Yellow = Partial (&lt;100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: 'var(--green)', border: '1px solid var(--error)' }} />
          <span className="text-[var(--muted-claude)]">Red = Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.08)' }} />
          <span className="text-[var(--muted-soft)]">Gray = Future</span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="claude-card p-4 sm:p-6 rounded-3xl space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold font-mono text-[var(--muted-soft)] border-b border-[var(--muted-soft)]/20 pb-3">
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
                  isToday ? 'ring-2 ring-[var(--green)]' : ''
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="num-font text-xs sm:text-sm font-extrabold">{format(day, 'd')}</span>
                  {isToday && (
                    <span className="text-[9px] px-1 rounded text-[var(--ink)] font-bold uppercase" style={{ borderRadius: '9999px', background: 'var(--green)' }}>
                      Today
                    </span>
                  )}
                </div>

                {entry && entry.completionPercentage > 0 && (
                  <div className="text-[10px] font-mono text-right w-full space-y-0.5">
                    <p className="font-bold num-font">{entry.completionPercentage}%</p>
                    <p className="text-[var(--green)] num-font">+{entry.xpEarned} XP</p>
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
