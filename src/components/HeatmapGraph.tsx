'use client';

import React, { useState } from 'react';
import { DayCheckIn } from '@/lib/types';
import { format, subDays, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface HeatmapGraphProps {
  history: Record<string, DayCheckIn>;
  onDayClick?: (dateStr: string) => void;
  interactive?: boolean;
}

export const HeatmapGraph: React.FC<HeatmapGraphProps> = ({
  history,
  onDayClick,
  interactive = true,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    completed: boolean;
    percentage: number;
    xp: number;
    journal?: string;
    completedCount: number;
  } | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate last 365 days
  const today = new Date();
  const startDate = subDays(today, 364);
  const allDays = eachDayOfInterval({ start: startDate, end: today });

  // Group into weeks (columns)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (day.getDay() === 6) { // Saturday
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Get Month Headers
  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, idx) => {
    const firstDayOfWeek = week[0];
    if (firstDayOfWeek) {
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: format(firstDayOfWeek, 'MMM'),
          colIndex: idx,
        });
        lastMonth = month;
      }
    }
  });

  const getIntensityClass = (pct: number, hasEntry: boolean) => {
    if (!hasEntry || pct === 0) return 'bg-[#1e293b]/60 border border-white/5 hover:border-white/20';
    if (pct < 50) return 'bg-emerald-950/80 border border-emerald-800/40 text-emerald-400';
    if (pct < 100) return 'bg-emerald-600/70 border border-emerald-500/50 text-emerald-200 glow-green';
    return 'bg-emerald-500 border border-emerald-400 glow-green text-emerald-950 font-bold';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative w-full overflow-x-auto select-none py-2" onMouseMove={handleMouseMove}>
      {/* Month Labels */}
      <div className="flex text-xs text-slate-400 mb-2 pl-8 space-x-1 font-mono">
        {weeks.map((_, colIdx) => {
          const mLabel = monthLabels.find((m) => m.colIndex === colIdx);
          return (
            <div key={colIdx} className="w-3.5 text-center flex-shrink-0">
              {mLabel ? <span className="absolute -mt-5 font-semibold text-slate-300">{mLabel.label}</span> : null}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Day of Week Labels */}
        <div className="flex flex-col justify-between text-[10px] text-slate-500 pr-2 pt-0.5 font-mono select-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const checkIn = history[dateStr];
                const pct = checkIn ? checkIn.completionPercentage : 0;
                const intensity = getIntensityClass(pct, !!checkIn);

                return (
                  <motion.button
                    key={dateStr}
                    whileHover={{ scale: 1.3, zIndex: 30 }}
                    onClick={() => interactive && onDayClick && onDayClick(dateStr)}
                    onMouseEnter={() => {
                      setHoveredDay({
                        date: format(day, 'EEEE, MMM d, yyyy'),
                        completed: checkIn?.completed || false,
                        percentage: pct,
                        xp: checkIn?.xpEarned || 0,
                        journal: checkIn?.journal?.title,
                        completedCount: checkIn?.completedHabits?.length || 0,
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 rounded-sm transition-colors duration-200 cursor-pointer ${intensity}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-400 pt-2 border-t border-white/5">
        <span className="font-mono text-[11px]">365 Days Activity Matrix</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#1e293b]/60 border border-white/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950/80 border border-emerald-800/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600/70" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 glow-green" />
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="absolute z-50 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 shadow-2xl space-y-1 w-48"
          style={{
            left: Math.min(mousePos.x + 15, 600),
            top: Math.max(mousePos.y - 70, 0),
          }}
        >
          <div className="font-semibold text-slate-100 border-b border-white/10 pb-1 flex justify-between">
            <span>{hoveredDay.date}</span>
            <span className="text-emerald-400 font-mono">+{hoveredDay.xp} XP</span>
          </div>
          <div className="flex justify-between text-slate-300 pt-1">
            <span>Completion:</span>
            <span className="font-mono font-bold text-emerald-400">{hoveredDay.percentage}%</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Habits Done:</span>
            <span className="font-mono text-slate-200">{hoveredDay.completedCount}</span>
          </div>
          {hoveredDay.journal && (
            <div className="text-[11px] italic text-amber-300/90 truncate pt-1">
              📖 {hoveredDay.journal}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
