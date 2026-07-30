'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { HeatmapGraph } from '../HeatmapGraph';
import { Grid3X3, Flame, Trophy, Calendar, Sparkles, Activity } from 'lucide-react';

export const HeatmapView: React.FC = () => {
  const { history, user, setSelectedDayDetailsDate } = useStreak();

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5">
            <Grid3X3 className="w-6 h-6 text-[var(--green)]" />
            <span>365-Day Contribution Matrix</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">
            Inspired by GitHub&apos;s contribution graph. Hover over any day for details or click to inspect.
          </p>
        </div>
      </div>

      {/* Main Heatmap Card */}
      <HeatmapGraph
        history={history}
        onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
      />

      {/* Analytics Summary Below Heatmap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Flame className="w-6 h-6 text-[var(--ink)] fire-animated" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-soft)] font-mono">Current Streak</p>
            <h4 className="text-2xl font-extrabold text-[var(--ink)] font-mono">{user.currentStreak} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Trophy className="w-6 h-6 text-[var(--ink)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-soft)] font-mono">Longest Streak</p>
            <h4 className="text-2xl font-extrabold text-[var(--ink)] font-mono">{user.longestStreak} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Calendar className="w-6 h-6 text-[var(--ink)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-soft)] font-mono">Total Tracked Days</p>
            <h4 className="text-2xl font-extrabold text-[var(--ink)] font-mono">{user.totalDays} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Activity className="w-6 h-6 text-[var(--ink)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--muted-soft)] font-mono">Success Rate</p>
            <h4 className="text-2xl font-extrabold text-[var(--ink)] font-mono">{user.successRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
