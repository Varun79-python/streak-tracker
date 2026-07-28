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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-modal p-6 rounded-3xl border border-white/15 shadow-2xl space-y-5 relative"
      >
        <button
          onClick={() => setSelectedDayDetailsDate(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{selectedDayDetailsDate}</h3>
            <p className="text-xs text-emerald-400 font-mono">
              Completion: {entry?.completionPercentage || 0}% • +{entry?.xpEarned || 0} XP Earned
            </p>
          </div>
        </div>

        {/* Habits Completed / Missed Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Habit Breakdown</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {habits.map((habit) => {
              const isDone = completedIds.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
                      : 'bg-slate-900/40 border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{habit.icon}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  {isDone ? (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono flex items-center gap-1">
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
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {entry.journal.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20">{entry.journal.mood}</span>
            </div>
            <p className="text-xs text-slate-300 italic">{entry.journal.content}</p>
          </div>
        )}

        <button
          onClick={() => setSelectedDayDetailsDate(null)}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Close Details
        </button>
      </motion.div>
    </div>
  );
};
