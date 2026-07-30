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
          <h2 className="text-2xl font-bold text-[#252523] flex items-center gap-2.5">
            <Grid3X3 className="w-6 h-6 text-[#cc785c]" />
            <span>365-Day Contribution Matrix</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">
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
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: '#5db8a6' }}>
            <Flame className="w-6 h-6 text-[#252523] fire-animated" />
          </div>
          <div>
            <p className="text-xs text-[#8e8b82] font-mono">Current Streak</p>
            <h4 className="text-2xl font-extrabold text-[#252523] font-mono">{user.currentStreak} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: '#e8a55a' }}>
            <Trophy className="w-6 h-6 text-[#252523]" />
          </div>
          <div>
            <p className="text-xs text-[#8e8b82] font-mono">Longest Streak</p>
            <h4 className="text-2xl font-extrabold text-[#252523] font-mono">{user.longestStreak} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: '#5db872' }}>
            <Calendar className="w-6 h-6 text-[#252523]" />
          </div>
          <div>
            <p className="text-xs text-[#8e8b82] font-mono">Total Tracked Days</p>
            <h4 className="text-2xl font-extrabold text-[#252523] font-mono">{user.totalDays} Days</h4>
          </div>
        </div>

        <div className="claude-card p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: '#cc785c' }}>
            <Activity className="w-6 h-6 text-[#252523]" />
          </div>
          <div>
            <p className="text-xs text-[#8e8b82] font-mono">Success Rate</p>
            <h4 className="text-2xl font-extrabold text-[#252523] font-mono">{user.successRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
