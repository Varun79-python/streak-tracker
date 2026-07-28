'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Clock, CheckCircle2, XCircle, Trophy, BookOpen, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const ActivityHistoryView: React.FC = () => {
  const { history, achievements } = useStreak();
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Missed' | 'Journal'>('All');

  // Convert history map into sorted list
  const historyList = Object.values(history).sort((a, b) => b.date.localeCompare(a.date));

  const filteredHistory = historyList.filter((item) => {
    if (filter === 'Completed') return item.completed;
    if (filter === 'Missed') return !item.completed && item.completionPercentage === 0;
    if (filter === 'Journal') return !!item.journal;
    return true;
  });

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-emerald-400" />
            <span>Activity History</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">Complete chronological record of all daily check-ins, journal notes, and streaks.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['All', 'Completed', 'Missed', 'Journal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredHistory.slice(0, 30).map((item) => (
          <div
            key={item.date}
            className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 transition-colors ${
              item.completed
                ? 'bg-slate-900/60 border-emerald-500/30'
                : item.completionPercentage > 0
                ? 'bg-slate-900/60 border-amber-500/30'
                : 'bg-slate-900/30 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : item.completionPercentage > 0 ? (
                <Clock className="w-5 h-5 text-amber-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}

              <div>
                <h4 className="font-bold text-white text-sm">
                  {item.completed ? 'Completed all required habits' : item.completionPercentage > 0 ? 'Partial check-in logged' : 'Missed day'}
                </h4>
                <p className="text-slate-400 text-[11px]">{item.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.journal && (
                <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px]">
                  📖 Journal
                </span>
              )}
              <span className="text-emerald-400 font-bold text-xs">
                +{item.xpEarned} XP
              </span>
              <span className="text-slate-300 font-bold text-xs">
                {item.completionPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
