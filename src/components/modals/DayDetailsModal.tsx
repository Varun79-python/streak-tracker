'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Calendar, CheckCircle2, XCircle, Sparkles, BookOpen, Flame, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const DayDetailsModal: React.FC = () => {
  const { 
    selectedDayDetailsDate, 
    setSelectedDayDetailsDate, 
    history, 
    habits,
    setShowCheckInModal,
    theme 
  } = useStreak();

  if (!selectedDayDetailsDate) return null;

  const isLight = theme === 'light';
  const entry = history[selectedDayDetailsDate];
  const completedIds = entry?.completedHabits || [];
  const isCompleted = entry ? (entry.completed || entry.completionPercentage > 0) : false;

  // Format date nicely like GitHub/LeetCode: "Wednesday, July 30, 2026"
  let formattedDate = selectedDayDetailsDate;
  try {
    formattedDate = format(new Date(selectedDayDetailsDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy');
  } catch {
    // Fallback if parsing fails
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5 relative border ${
            isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedDayDetailsDate(null)}
            className={`absolute top-4 right-4 p-1.5 rounded-xl transition-colors cursor-pointer ${
              isLight ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header (GitHub / LeetCode Style) */}
          <div className={`flex items-start gap-3.5 border-b pb-4 ${isLight ? 'border-gray-100' : 'border-[#21262d]'}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              isCompleted 
                ? (isLight ? 'bg-green-50 border-green-200 text-green-600' : 'bg-[#1f3526] border-[#2ea043]/40 text-[#39d353]')
                : (isLight ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-[#21262d] border-[#30363d] text-gray-400')
            }`}>
              <Calendar className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                isLight ? 'text-gray-400' : 'text-[#8b949e]'
              }`}>
                Contributions on
              </span>
              <h3 className={`font-bold text-base sm:text-lg leading-tight truncate ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}>
                {formattedDate}
              </h3>
              
              {/* Contribution Status Badge */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                  isCompleted 
                    ? (isLight ? 'bg-green-100 text-green-700' : 'bg-[#1f3526] text-[#39d353] border border-[#2ea043]/30')
                    : (isLight ? 'bg-gray-100 text-gray-600' : 'bg-[#21262d] text-[#8b949e]')
                }`}>
                  {isCompleted ? '🟩 Completed' : '⬜ No contributions'}
                </span>

                {entry && entry.xpEarned > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                    <Sparkles className="w-3 h-3" /> +{entry.xpEarned} XP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Habits Breakdown Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${
                isLight ? 'text-gray-500' : 'text-[#8b949e]'
              }`}>
                Tracked Habits ({completedIds.length}/{habits.length})
              </h4>
              <span className={`text-[11px] font-mono ${
                isLight ? 'text-gray-400' : 'text-[#8b949e]'
              }`}>
                {entry?.completionPercentage || 0}% Done
              </span>
            </div>

            {habits.length === 0 ? (
              <p className={`text-xs italic py-2 text-center ${isLight ? 'text-gray-400' : 'text-[#8b949e]'}`}>
                No habits configured for this date.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {habits.map((habit) => {
                  const isDone = completedIds.includes(habit.id);
                  return (
                    <div
                      key={habit.id}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs border transition-colors ${
                        isDone
                          ? (isLight ? 'bg-green-50/60 border-green-200' : 'bg-[#1f3526]/50 border-[#2ea043]/30')
                          : (isLight ? 'bg-gray-50 border-gray-100' : 'bg-[#0d1117] border-[#21262d]')
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">{habit.icon}</span>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${
                            isDone 
                              ? (isLight ? 'text-green-900' : 'text-[#f0f6fc]') 
                              : (isLight ? 'text-gray-700' : 'text-[#8b949e]')
                          }`}>
                            {habit.name}
                          </p>
                          {habit.description && (
                            <p className={`text-[10px] truncate ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {isDone ? (
                        <span className={`font-mono text-[11px] font-bold flex items-center gap-1 ${
                          isLight ? 'text-green-600' : 'text-[#39d353]'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" /> Done
                        </span>
                      ) : (
                        <span className={`font-mono text-[11px] flex items-center gap-1 ${
                          isLight ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <XCircle className="w-4 h-4" /> Missed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Journal Reflection Section */}
          {entry?.journal && (
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-950/20 border-amber-800/30'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" /> {entry.journal.title}
                </span>
                {entry.journal.mood && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-white font-medium">
                    {entry.journal.mood}
                  </span>
                )}
              </div>
              <p className={`text-xs italic leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-200/80'}`}>
                "{entry.journal.content}"
              </p>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => {
                setSelectedDayDetailsDate(null);
                setShowCheckInModal(true);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                isLight 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-[#2ea043] hover:bg-[#39d353] text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Log Check-in</span>
            </button>

            <button
              onClick={() => setSelectedDayDetailsDate(null)}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer border ${
                isLight 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200' 
                  : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]'
              }`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

