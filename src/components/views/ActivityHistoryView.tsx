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
          <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <div className="p-2" style={{ borderRadius: '12px' }}>
              <Clock className="w-5 h-5" style={{ color: '#cc785c' }} />
            </div>
            <span>Activity History</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">Complete chronological record of all daily check-ins, journal notes, and streaks.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['All', 'Completed', 'Missed', 'Journal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filter === tab
                  ? 'font-bold text-white'
                  : 'claude-btn-secondary text-[#8e8b82] hover:text-[#6c6a64]'
              }`}
              style={filter === tab ? { background: '#5db8a6' } : {}}
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
            className={`p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 transition-colors ${
              item.completed
                ? 'claude-card'
                : item.completionPercentage > 0
                ? 'claude-card-soft'
                : 'opacity-60'
            }`}
            style={!item.completed && item.completionPercentage > 0 ? { borderColor: 'rgba(232, 165, 90, 0.3)' } : !item.completed && item.completionPercentage === 0 ? { background: 'rgba(204, 120, 92, 0.08)' } : {}}
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#5db872' }}>
                  <CheckCircle2 className="w-4 h-4 text-[#252523]" />
                </div>
              ) : item.completionPercentage > 0 ? (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e8a55a' }}>
                  <Clock className="w-4 h-4 text-[#252523]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#cc785c' }}>
                  <XCircle className="w-4 h-4 text-[#252523]" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-[#252523] text-sm">
                  {item.completed ? 'Completed all required habits' : item.completionPercentage > 0 ? 'Partial check-in logged' : 'Missed day'}
                </h4>
                <p className="text-[#8e8b82] text-[11px]">{item.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.journal && (
                <span className="px-2 py-0.5 rounded text-[11px]" style={{ color: '#e8a55a', background: 'rgba(232, 165, 90, 0.2)' }}>
                  📖 Journal
                </span>
              )}
              <span className="font-bold text-xs" style={{ color: '#cc785c' }}>
                +{item.xpEarned} XP
              </span>
              <span className="font-bold text-xs" style={{ color: '#6c6a64' }}>
                {item.completionPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
