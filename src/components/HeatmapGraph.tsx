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

  const getIntensityStyle = (pct: number, hasEntry: boolean): React.CSSProperties => {
    if (!hasEntry || pct === 0) return { background: 'rgba(230, 223, 216, 0.6)', border: '1px solid #e6dfd8' };
    if (pct < 50) return { background: 'rgba(93, 184, 166, 0.4)', border: '1px solid rgba(93, 184, 166, 0.6)', color: '#3d3d3a' };
    if (pct < 100) return { background: 'rgba(93, 184, 166, 0.7)', border: '1px solid rgba(93, 184, 166, 0.8)', color: '#faf9f5' };
    return { background: '#5db8a6', border: '1px solid #4a9e8e', color: '#faf9f5', fontWeight: 'bold' };
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
      <div className="flex text-xs mb-2 pl-8 space-x-1 font-mono" style={{ color: '#8e8b82' }}>
        {weeks.map((_, colIdx) => {
          const mLabel = monthLabels.find((m) => m.colIndex === colIdx);
          return (
            <div key={colIdx} className="w-3.5 text-center flex-shrink-0">
              {mLabel ? <span className="absolute -mt-5 font-semibold" style={{ color: '#6c6a64' }}>{mLabel.label}</span> : null}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Day of Week Labels */}
        <div className="flex flex-col justify-between text-[10px] pr-2 pt-0.5 font-mono select-none" style={{ color: '#e6dfd8' }}>
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
                const intensityStyle = getIntensityStyle(pct, !!checkIn);

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
                    className="w-3.5 h-3.5 rounded-sm transition-colors duration-200 cursor-pointer"
                    style={intensityStyle}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex items-center justify-between mt-4 text-xs pt-2 border-t" style={{ color: '#8e8b82', borderColor: '#e6dfd8' }}>
        <span className="font-mono text-[11px]">365 Days Activity Matrix</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(230, 223, 216, 0.6)', border: '1px solid #e6dfd8' }} />
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(93, 184, 166, 0.4)', border: '1px solid rgba(93, 184, 166, 0.6)' }} />
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(93, 184, 166, 0.7)' }} />
          <div className="w-3 h-3 rounded-sm" style={{ background: '#5db8a6' }} />
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="absolute z-50 pointer-events-none claude-glass-modal text-xs rounded-lg p-2.5 shadow-2xl space-y-1 w-48"
          style={{
            left: Math.min(mousePos.x + 15, 600),
            top: Math.max(mousePos.y - 70, 0),
            color: '#3d3d3a',
          }}
        >
          <div className="font-semibold border-b pb-1 flex justify-between" style={{ color: '#141413', borderColor: '#e6dfd8' }}>
            <span>{hoveredDay.date}</span>
            <span className="font-mono" style={{ color: '#cc785c' }}>+{hoveredDay.xp} XP</span>
          </div>
          <div className="flex justify-between pt-1" style={{ color: '#6c6a64' }}>
            <span>Completion:</span>
            <span className="font-mono font-bold" style={{ color: '#cc785c' }}>{hoveredDay.percentage}%</span>
          </div>
          <div className="flex justify-between" style={{ color: '#6c6a64' }}>
            <span>Habits Done:</span>
            <span className="font-mono" style={{ color: '#252523' }}>{hoveredDay.completedCount}</span>
          </div>
          {hoveredDay.journal && (
            <div className="text-[11px] italic truncate pt-1" style={{ color: '#e8a55a' }}>
              📖 {hoveredDay.journal}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
