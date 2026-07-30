'use client';

import React, { useState, useMemo } from 'react';
import { DayCheckIn } from '@/lib/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

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
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Generate last 365 days aligned Sunday -> Saturday
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 364);

    // Adjust start date to the preceding Sunday so columns align cleanly
    const startSunday = new Date(startDate);
    startSunday.setDate(startSunday.getDate() - startSunday.getDay());

    const allDays = eachDayOfInterval({ start: startSunday, end: today });

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

    // Determine month label positions
    const mLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weekCols.forEach((week, idx) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
          // Avoid overlapping month labels if columns are too close
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
  }, []);

  // Intensity style using vibrant Claude UI/UX theme colors (Rust, Amber, Teal mix)
  const getIntensityStyle = (pct: number, hasEntry: boolean): React.CSSProperties => {
    if (!hasEntry || pct === 0) {
      return {
        background: '#1c1b18',
        border: '1px solid #2b2824',
      };
    }
    if (pct <= 25) {
      return {
        background: '#4a2c20',
        border: '1px solid #6b3a2a',
        boxShadow: '0 0 4px rgba(74, 44, 32, 0.4)',
      };
    }
    if (pct <= 50) {
      return {
        background: '#cc785c',
        border: '1px solid #e08769',
        boxShadow: '0 0 6px rgba(204, 120, 92, 0.45)',
      };
    }
    if (pct <= 75) {
      return {
        background: '#e8a55a',
        border: '1px solid #f7b76d',
        boxShadow: '0 0 8px rgba(232, 165, 90, 0.55)',
      };
    }
    // 76%-100%: Peak completion — Mixed gradient of Claude Rust + Gold + Teal
    return {
      background: 'linear-gradient(135deg, #cc785c 0%, #e8a55a 50%, #5db8a6 100%)',
      border: '1px solid #5db8a6',
      boxShadow: '0 0 10px rgba(93, 184, 166, 0.65)',
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full select-none">
      {/* Outer Github-style dark container card */}
      <div 
        className="relative bg-[#161513] border border-[#2e2a25] rounded-xl p-4 sm:p-5 shadow-2xl text-[#e6dfd8] overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#3a3530] scrollbar-track-transparent">
          <div className="min-w-[720px]">
            {/* Month Labels Header Row */}
            <div className="flex gap-[3px] ml-8 sm:ml-9 mb-1.5 text-[11px] font-mono overflow-hidden h-4 text-[#8e8b82]">
              {weeks.map((_, colIdx) => {
                const mLabel = monthLabels.find((m) => m.colIndex === colIdx);
                return (
                  <div key={colIdx} className="w-3 sm:w-3.5 flex-shrink-0 relative">
                    {mLabel && (
                      <span className="absolute left-0 top-0 font-medium text-[#b0ab9f] text-[11px] whitespace-nowrap">
                        {mLabel.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Main Area (Day Labels + Grid) */}
            <div className="flex items-start gap-2">
              {/* Day of Week Labels Column (Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6) */}
              <div className="flex flex-col gap-[3px] text-[10px] font-mono text-[#8e8b82] w-6 sm:w-7 pt-[1px] flex-shrink-0 select-none">
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center">Mon</div>
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center">Wed</div>
                <div className="h-3 sm:h-3.5 leading-none" />
                <div className="h-3 sm:h-3.5 leading-none flex items-center">Fri</div>
                <div className="h-3 sm:h-3.5 leading-none" />
              </div>

              {/* Heatmap Grid Columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const checkIn = history[dateStr];
                      const pct = checkIn ? checkIn.completionPercentage : 0;
                      const intensityStyle = getIntensityStyle(pct, !!checkIn);

                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.35, zIndex: 30 }}
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
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-all duration-150 cursor-pointer flex-shrink-0"
                          style={intensityStyle}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer: Info link & Color scale legend */}
            <div className="flex items-center justify-between mt-4 text-[11px] pt-3 border-t border-[#2a2723] text-[#8e8b82] font-mono">
              <button
                onClick={() => setShowInfoModal(true)}
                className="hover:text-[#cc785c] transition-colors flex items-center gap-1.5 text-left cursor-pointer group"
              >
                <HelpCircle className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform text-[#cc785c]" />
                <span>Learn how we count contributions</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="mr-0.5">Less</span>
                {/* Level 0 */}
                <div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                  style={{ background: '#1c1b18', border: '1px solid #2b2824' }}
                  title="0% contributions"
                />
                {/* Level 1 */}
                <div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                  style={{ background: '#4a2c20', border: '1px solid #6b3a2a' }}
                  title="1-25% contributions"
                />
                {/* Level 2 */}
                <div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                  style={{ background: '#cc785c', border: '1px solid #e08769' }}
                  title="26-50% contributions"
                />
                {/* Level 3 */}
                <div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                  style={{ background: '#e8a55a', border: '1px solid #f7b76d' }}
                  title="51-75% contributions"
                />
                {/* Level 4 */}
                <div
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px]"
                  style={{ background: 'linear-gradient(135deg, #cc785c 0%, #e8a55a 50%, #5db8a6 100%)', border: '1px solid #5db8a6' }}
                  title="76-100% contributions"
                />
                <span className="ml-0.5">More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredDay && (
          <div
            className="absolute z-50 pointer-events-none bg-[#1e1c19]/95 backdrop-blur-md text-xs rounded-xl p-3 shadow-2xl border border-[#3a3530] space-y-1.5 min-w-[200px]"
            style={{
              left: Math.min(mousePos.x + 15, 520),
              top: Math.max(mousePos.y - 75, 10),
              color: '#e6dfd8',
            }}
          >
            <div className="font-semibold border-b border-[#2e2a25] pb-1 flex justify-between items-center text-xs">
              <span className="text-[#faf9f5]">{hoveredDay.date}</span>
              <span className="font-mono font-bold text-[#e8a55a]">+{hoveredDay.xp} XP</span>
            </div>
            <div className="flex justify-between items-center pt-0.5 text-[#b0ab9f]">
              <span>Completion:</span>
              <span className="font-mono font-bold text-[#5db8a6]">{hoveredDay.percentage}%</span>
            </div>
            <div className="flex justify-between items-center text-[#b0ab9f]">
              <span>Habits Done:</span>
              <span className="font-mono font-bold text-[#faf9f5]">{hoveredDay.completedCount}</span>
            </div>
            {hoveredDay.journal && (
              <div className="text-[11px] italic truncate pt-1 text-[#e8a55a] border-t border-[#2e2a25] mt-1">
                📖 {hoveredDay.journal}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Learn How We Count Contributions Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#181715] border border-[#34302c] rounded-2xl max-w-md w-full p-6 text-[#e6dfd8] shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-[#8e8b82] hover:text-white hover:bg-[#2e2a25] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#cc785c]/20 border border-[#cc785c]/40 flex items-center justify-center text-[#cc785c]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#faf9f5]">How Contributions Work</h3>
                  <p className="text-xs text-[#8e8b82] font-mono">Streakify Matrix Scoring System</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#b0ab9f] leading-relaxed">
                <div className="p-3 rounded-xl bg-[#201e1b] border border-[#2e2a25] space-y-1">
                  <div className="font-semibold text-[#faf9f5] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5db8a6]" />
                    <span>Daily Completion Percentage</span>
                  </div>
                  <p>
                    Every active habit you complete during a check-in increases your score for that day on a scale of 0% to 100%.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#201e1b] border border-[#2e2a25] space-y-1">
                  <div className="font-semibold text-[#faf9f5] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#e8a55a]" />
                    <span>Color Scale Intensity</span>
                  </div>
                  <p>
                    Heatmap boxes change color based on percentage:
                    <span className="block mt-1 space-y-1 font-mono text-[11px]">
                      <span className="block text-[#b0ab9f]">• 0%: Dark Empty Tile</span>
                      <span className="block text-[#6b3a2a]">• 1–25%: Deep Amber Tint</span>
                      <span className="block text-[#cc785c]">• 26–50%: Claude Terracotta</span>
                      <span className="block text-[#e8a55a]">• 51–75%: Vibrant Warm Gold</span>
                      <span className="block text-[#5db8a6]">• 76–100%: Peak Claude Gradient</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-[#cc785c] hover:bg-[#b5674c] transition-all cursor-pointer shadow-lg"
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

