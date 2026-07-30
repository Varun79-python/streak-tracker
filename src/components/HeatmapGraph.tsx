'use client';

import React, { useState, useMemo } from 'react';
import { DayCheckIn } from '@/lib/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { useStreak } from '@/lib/StreakContext';

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
  let theme = 'dark';
  let habits: Array<{ id: string; name: string; icon: string }> = [];
  try {
    const streakCtx = useStreak();
    if (streakCtx?.theme) theme = streakCtx.theme;
    if (streakCtx?.habits) habits = streakCtx.habits;
  } catch {
    // Fallback if used outside context provider
  }

  const isLight = theme === 'light';

  // Feature 1: Habit Filter State ('all' or specific habit ID)
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');

  // Feature 2: Timeframe / Year Selector ('past365', '2026', '2025')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'past365' | '2026' | '2025'>('past365');

  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    completed: boolean;
    isFreeze: boolean;
    percentage: number;
    xp: number;
    journal?: string;
    completedCount: number;
  } | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Compute weeks based on selectedTimeframe
  const { weeks, monthLabels } = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    const today = new Date();

    if (selectedTimeframe === '2026') {
      startDate = new Date(2026, 0, 1);
      endDate = new Date(2026, 11, 31);
    } else if (selectedTimeframe === '2025') {
      startDate = new Date(2025, 0, 1);
      endDate = new Date(2025, 11, 31);
    } else {
      // Past 365 Days
      endDate = today;
      startDate = subDays(today, 364);
    }

    const startSunday = new Date(startDate);
    startSunday.setDate(startSunday.getDate() - startSunday.getDay());

    const allDays = eachDayOfInterval({ start: startSunday, end: endDate });

    const weekCols: Date[][] = [];
    let currentWeek: Date[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);
      if (day.getDay() === 6) {
        weekCols.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      weekCols.push(currentWeek);
    }

    const mLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weekCols.forEach((week, idx) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
          if (mLabels.length === 0 || idx - mLabels[mLabels.length - 1].colIndex >= 3) {
            mLabels.push({
              label: format(firstDay, 'MMM'),
              colIndex: idx,
            });
            lastMonth = month;
          }
        }
      }
    });

    return { weeks: weekCols, monthLabels: mLabels };
  }, [selectedTimeframe]);

  // Feature 3: Binary + Streak Freeze Tile Styling (White, Green, or Cyan Freeze)
  const getTileStyle = (isCompleted: boolean, isFreeze: boolean): React.CSSProperties => {
    if (isFreeze) {
      return {
        background: '#38BDF8',
        border: '1px solid #0284C7',
        boxShadow: '0 0 4px rgba(56, 189, 248, 0.4)',
      };
    }
    if (isCompleted) {
      return {
        background: 'var(--green)',
        border: '1px solid var(--green)',
        boxShadow: '0 0 3px rgba(34, 197, 94, 0.35)',
      };
    }
    // Not Completed: White tile with subtle border
    return {
      background: 'var(--surface-soft)',
      border: isLight ? '1px solid #E5E7EB' : '1px solid #30363d',
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the right so Today's box (current week) is in focus on load
  React.useEffect(() => {
    const scrollToToday = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    };
    scrollToToday();
    const timer = setTimeout(scrollToToday, 50);
    return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  const getTooltipPosition = () => {
    if (!containerRef.current) return { left: Math.max(10, mousePos.x - 100), top: Math.max(10, mousePos.y - 75) };
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const tooltipWidth = 210;
    let left = mousePos.x + 12;

    if (left + tooltipWidth > containerWidth - 12) {
      left = mousePos.x - tooltipWidth - 12;
    }
    if (left < 12) left = 12;

    return {
      left,
      top: Math.max(10, mousePos.y - 75),
    };
  };

  return (
    <div className="w-full select-none space-y-3" ref={containerRef}>
      {/* Top Filter Controls Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        {/* Habit Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className={`font-mono text-[11px] ${isLight ? 'text-gray-500' : 'text-[#8b949e]'}`}>Filter Habit:</label>
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium border cursor-pointer outline-none transition-colors ${
              isLight
                ? 'bg-white border-gray-200 text-gray-800 focus:border-green-500'
                : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] focus:border-[#39d353]'
            }`}
          >
            <option value="all">🌟 All Habits Combined</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.icon} {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year / Timeframe Selector Pills */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isLight ? 'bg-gray-100/80 border-gray-200' : 'bg-[#161b22] border-[#30363d]'
        }`}>
          {(['past365', '2026', '2025'] as const).map((tf) => {
            const labels = { past365: 'Past 365 Days', '2026': '2026', '2025': '2025' };
            const isActive = selectedTimeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-0.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--green)] text-white font-bold shadow-xs'
                    : isLight ? 'text-gray-600 hover:text-gray-900' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                {labels[tf]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Borderless Heatmap Container */}
      <div 
        className="relative py-2 text-xs overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div ref={scrollRef} className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400/20 scrollbar-track-transparent pl-0.5">
          <div className="min-w-[720px]">
            {/* Month Header Row */}
            <div className={`flex gap-[3px] ml-8 sm:ml-9 mb-1.5 text-[11px] font-mono overflow-hidden h-4 ${
              isLight ? 'text-gray-500' : 'text-[#8b949e]'
            }`}>
              {weeks.map((_, colIdx) => {
                const mLabel = monthLabels.find((m) => m.colIndex === colIdx);
                return (
                  <div key={colIdx} className="w-3 sm:w-3.5 flex-shrink-0 relative">
                    {mLabel && (
                      <span className={`absolute left-0 top-0 font-medium text-[11px] whitespace-nowrap ${
                        isLight ? 'text-gray-600' : 'text-[#c9d1d9]'
                      }`}>
                        {mLabel.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Grid Area */}
            <div className="flex items-start gap-2">
              {/* Day Labels Column - Sticky on left */}
              <div className={`sticky left-0 z-10 flex flex-col gap-[3px] text-[10px] font-mono w-7 sm:w-8 pt-[1px] flex-shrink-0 select-none ${
                isLight ? 'text-gray-500 bg-white/95' : 'text-[#8b949e] bg-[#161b22]/95'
              }`}>
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center pr-1">Mon</div>
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center pr-1">Wed</div>
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center pr-1">Fri</div>
                <div className="h-3 sm:h-3.5 leading-none" />
              </div>

              {/* Grid Columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const checkIn = history[dateStr];
                      
                      // Calculate completion based on selectedHabitFilter
                      let isCompleted = false;
                      if (selectedHabitId === 'all') {
                        isCompleted = checkIn ? (checkIn.completed || checkIn.completionPercentage > 0) : false;
                      } else {
                        isCompleted = checkIn?.completedHabits?.includes(selectedHabitId) || false;
                      }

                      const isFreeze = !!(checkIn as any)?.streakFreezeUsed || !!(checkIn as any)?.isRestDay;
                      const tileStyle = getTileStyle(isCompleted, isFreeze);

                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.35, zIndex: 30 }}
                          onClick={() => interactive && onDayClick && onDayClick(dateStr)}
                          onMouseEnter={() => {
                            setHoveredDay({
                              date: format(day, 'EEEE, MMM d, yyyy'),
                              completed: isCompleted,
                              isFreeze,
                              percentage: checkIn?.completionPercentage || (isCompleted ? 100 : 0),
                              xp: checkIn?.xpEarned || 0,
                              journal: checkIn?.journal?.title,
                              completedCount: checkIn?.completedHabits?.length || 0,
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-all duration-150 cursor-pointer flex-shrink-0"
                          style={tileStyle}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer: Legend & Info Modal Trigger */}
            <div className={`flex items-center justify-between mt-3 text-[11px] pt-2.5 font-mono border-t ${
              isLight ? 'border-gray-200 text-gray-500' : 'border-[#21262d] text-[#8b949e]'
            }`}>
              <button
                onClick={() => setShowInfoModal(true)}
                className={`transition-colors flex items-center gap-1.5 text-left cursor-pointer group ${
                  isLight ? 'hover:text-green-600' : 'hover:text-[#39d353]'
                }`}
              >
                <HelpCircle className={`w-3.5 h-3.5 group-hover:rotate-12 transition-transform ${
                  isLight ? 'text-green-600' : 'text-[#39d353]'
                }`} />
                <span>Learn how we count contributions</span>
              </button>

              {/* 3-State Legend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                    style={getTileStyle(false, false)}
                  />
                  <span>Not Done</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                    style={getTileStyle(true, false)}
                  />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                    style={getTileStyle(false, true)}
                  />
                  <span>Freeze ❄️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredDay && (() => {
          const pos = getTooltipPosition();
          return (
            <div
              className={`absolute z-50 pointer-events-none text-xs rounded-xl p-3 shadow-2xl border space-y-1.5 max-w-[220px] w-[210px] backdrop-blur-md ${
                isLight 
                  ? 'bg-white/95 border-gray-200 text-gray-800 shadow-lg'
                  : 'bg-[#161b22]/95 border-[#30363d] text-[#c9d1d9]'
              }`}
              style={{
                left: pos.left,
                top: pos.top,
              }}
            >
              <div className={`font-semibold border-b pb-1 flex justify-between items-center text-xs ${
                isLight ? 'border-gray-100 text-gray-900' : 'border-[#21262d] text-[#f0f6fc]'
              }`}>
                <span className="truncate max-w-[120px]" title={hoveredDay.date}>{hoveredDay.date}</span>
                <span className={`font-mono font-bold text-[11px] ${
                  hoveredDay.isFreeze ? 'text-sky-500' : hoveredDay.completed ? (isLight ? 'text-green-600' : 'text-[#39d353]') : 'text-gray-400'
                }`}>
                  {hoveredDay.isFreeze ? '❄️ Freeze' : hoveredDay.completed ? '✓ Done' : 'Missed'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5 text-xs">
                <span className={isLight ? 'text-gray-500' : 'text-[#8b949e]'}>Status:</span>
                <span className={`font-mono font-bold ${
                  hoveredDay.isFreeze
                    ? 'text-sky-500'
                    : hoveredDay.completed 
                    ? (isLight ? 'text-green-600' : 'text-[#39d353]') 
                    : (isLight ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {hoveredDay.isFreeze ? 'Streak Freeze Used ❄️' : hoveredDay.completed ? 'Completed' : 'Not Completed'}
                </span>
              </div>
              {hoveredDay.xp > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className={isLight ? 'text-gray-500' : 'text-[#8b949e]'}>XP Earned:</span>
                  <span className="font-mono font-bold text-amber-500">+{hoveredDay.xp} XP</span>
                </div>
              )}
              {hoveredDay.journal && (
                <div className={`text-[11px] italic truncate pt-1 border-t mt-1 ${
                  isLight ? 'border-gray-100 text-amber-600' : 'border-[#21262d] text-amber-400'
                }`}>
                  📖 {hoveredDay.journal}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Learn How We Count Contributions Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative ${
                isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]'
              }`}
            >
              <button
                onClick={() => setShowInfoModal(false)}
                className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? 'bg-green-50 border-green-200 text-green-600' : 'bg-[#1f3526] border-[#2ea043]/40 text-[#39d353]'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>How Contributions Work</h3>
                  <p className={`text-xs font-mono ${isLight ? 'text-gray-500' : 'text-[#8b949e]'}`}>Binary Streak Tracking (Done / Not Done)</p>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1117] border-[#21262d]'
                }`}>
                  <div className={`font-semibold flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-green-600' : 'text-[#39d353]'}`} />
                    <span>Simple Binary Tracker</span>
                  </div>
                  <p className={isLight ? 'text-gray-600' : 'text-[#8b949e]'}>
                    Instead of multiple shades, each day is tracked clearly as completed or not completed.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border space-y-2 ${
                  isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#0d1117] border-[#21262d]'
                }`}>
                  <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Visual States</div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-[2px]" style={getTileStyle(false, false)} />
                      <span>Not Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-[2px]" style={getTileStyle(true, false)} />
                      <span className={isLight ? 'text-green-600 font-bold' : 'text-[#39d353] font-bold'}>Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white transition-all cursor-pointer shadow-md ${
                    isLight ? 'bg-green-600 hover:bg-green-700' : 'bg-[#2ea043] hover:bg-[#39d353]'
                  }`}
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


