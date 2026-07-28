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
    if (isFuture(date)) return { color: 'bg-slate-900/40 border-white/5 text-slate-600', label: 'Future' };

    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = history[dateStr];

    if (!entry || entry.completionPercentage === 0) {
      return { color: 'bg-rose-950/40 border-rose-800/30 text-rose-300', label: 'Missed' };
    }
    if (entry.completionPercentage < 100) {
      return { color: 'bg-amber-950/40 border-amber-800/30 text-amber-300', label: 'Partial' };
    }
    return { color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 glow-green font-bold', label: 'Completed' };
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Monthly Calendar Overview</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">View daily performance statuses. Click any date to view detailed breakdown & reflections.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-white font-mono min-w-36 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-around flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-500 glow-green" />
          <span className="text-slate-300">Green = Completed (100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-amber-500/40 border border-amber-500" />
          <span className="text-slate-300">Yellow = Partial (&lt;100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-rose-500/40 border border-rose-500" />
          <span className="text-slate-300">Red = Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-white/10" />
          <span className="text-slate-500">Gray = Future</span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold font-mono text-slate-400 border-b border-white/10 pb-3">
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
                className={`h-20 sm:h-24 p-2 rounded-2xl border flex flex-col justify-between transition-all hover:scale-105 cursor-pointer relative ${status.color} ${
                  isToday ? 'ring-2 ring-emerald-400' : ''
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-mono text-xs sm:text-sm font-extrabold">{format(day, 'd')}</span>
                  {isToday && (
                    <span className="text-[9px] px-1 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                      Today
                    </span>
                  )}
                </div>

                {entry && entry.completionPercentage > 0 && (
                  <div className="text-[10px] font-mono text-right w-full space-y-0.5">
                    <p className="font-bold">{entry.completionPercentage}%</p>
                    <p className="text-emerald-400">+{entry.xpEarned} XP</p>
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
