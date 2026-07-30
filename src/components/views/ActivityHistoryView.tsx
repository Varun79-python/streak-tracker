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
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <div className="p-2" style={{ borderRadius: '12px' }}>
              <Clock className="w-5 h-5" style={{ color: 'var(--green)' }} />
            </div>
            <span>Activity History</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">Complete chronological record of all daily check-ins, journal notes, and streaks.</p>
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
                  : 'claude-btn-secondary text-[var(--muted-soft)] hover:text-[var(--muted-claude)]'
              }`}
              style={filter === tab ? { background: 'var(--green)' } : {}}
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
            style={!item.completed && item.completionPercentage > 0 ? { borderColor: 'rgba(232, 165, 90, 0.3)' } : !item.completed && item.completionPercentage === 0 ? { background: 'rgba(34, 197, 94, 0.08)' } : {}}
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--green)' }}>
                  <CheckCircle2 className="w-4 h-4 text-[var(--ink)]" />
                </div>
              ) : item.completionPercentage > 0 ? (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--green)' }}>
                  <Clock className="w-4 h-4 text-[var(--ink)]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--green)' }}>
                  <XCircle className="w-4 h-4 text-[var(--ink)]" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-[var(--ink)] text-sm">
                  {item.completed ? 'Completed all required habits' : item.completionPercentage > 0 ? 'Partial check-in logged' : 'Missed day'}
                </h4>
                <p className="text-[var(--muted-soft)] text-[11px]">{item.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.journal && (
                <span className="px-2 py-0.5 rounded text-[11px]" style={{ color: 'var(--green)', background: 'rgba(232, 165, 90, 0.2)' }}>
                  📖 Journal
                </span>
              )}
              <span className="font-bold text-xs" style={{ color: 'var(--green)' }}>
                +{item.xpEarned} XP
              </span>
              <span className="font-bold text-xs" style={{ color: 'var(--muted-claude)' }}>
                {item.completionPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
