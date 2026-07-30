'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Calendar, CheckCircle2, XCircle, Sparkles, BookOpen, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const DayDetailsModal: React.FC = () => {
  const { selectedDayDetailsDate, setSelectedDayDetailsDate, history, habits } = useStreak();

  if (!selectedDayDetailsDate) return null;

  const entry = history[selectedDayDetailsDate];
  const completedIds = entry?.completedHabits || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/30 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md claude-glass-modal p-6 rounded-3xl shadow-2xl space-y-5 relative"
      >
        <button
          onClick={() => setSelectedDayDetailsDate(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8e8b82] hover:text-[#3d3d3a] claude-btn-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#e6dfd8] pb-4">
          <div 
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: '#5db8a6', borderRadius: '12px' }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 
              className="font-bold text-[#141413] text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {selectedDayDetailsDate}
            </h3>
            <p className="text-xs text-[#cc785c] font-mono">
              Completion: {entry?.completionPercentage || 0}% • +{entry?.xpEarned || 0} XP Earned
            </p>
          </div>
        </div>

        {/* Habits Completed / Missed Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#6c6a64] font-mono uppercase tracking-wider">Habit Breakdown</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {habits.map((habit) => {
              const isDone = completedIds.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                    isDone
                      ? 'claude-card-soft border-l-4 border-[#cc785c]'
                      : 'text-[#8e8b82]'
                  }`}
                  style={!isDone ? { background: 'rgba(204, 120, 92, 0.08)' } : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span>{habit.icon}</span>
                    <span className="font-medium text-[#252523]">{habit.name}</span>
                  </div>
                  {isDone ? (
                    <span className="text-[#cc785c] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[#e6dfd8] font-mono flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Missed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Journal Reflection */}
        {entry?.journal && (
          <div 
            className="p-3.5 rounded-2xl space-y-1"
            style={{ background: 'rgba(204, 120, 92, 0.08)' }}
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#e8a55a]">
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {entry.journal.title}</span>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 text-white"
                style={{ background: '#cc785c', borderRadius: '9999px' }}
              >
                {entry.journal.mood}
              </span>
            </div>
            <p className="text-xs text-[#6c6a64] italic">{entry.journal.content}</p>
          </div>
        )}

        <button
          onClick={() => setSelectedDayDetailsDate(null)}
          className="w-full py-3 rounded-xl claude-btn-secondary text-[#3d3d3a] font-bold text-xs transition-colors cursor-pointer"
        >
          Close Details
        </button>
      </motion.div>
    </div>
  );
};
