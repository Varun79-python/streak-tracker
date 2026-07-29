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
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <Grid3X3 className="w-6 h-6 text-[#7C9EB2]" />
            <span>365-Day Contribution Matrix</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            Inspired by GitHub&apos;s contribution graph. Hover over any day for details or click to inspect.
          </p>
        </div>
      </div>

      {/* Main Heatmap Card */}
      <div className="neu-card p-6 rounded-3xl space-y-4">
        <div className="neu-pressed p-6 rounded-2xl">
          <HeatmapGraph
            history={history}
            onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
          />
        </div>
      </div>

      {/* Analytics Summary Below Heatmap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="clay-icon w-12 h-12 rounded-2xl gradient-teal flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#3D3D3D] fire-animated" />
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] font-mono">Current Streak</p>
            <h4 className="text-2xl font-extrabold text-[#3D3D3D] font-mono">{user.currentStreak} Days</h4>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="clay-icon w-12 h-12 rounded-2xl gradient-lavender flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#3D3D3D]" />
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] font-mono">Longest Streak</p>
            <h4 className="text-2xl font-extrabold text-[#3D3D3D] font-mono">{user.longestStreak} Days</h4>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="clay-icon w-12 h-12 rounded-2xl gradient-mint flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#3D3D3D]" />
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] font-mono">Total Tracked Days</p>
            <h4 className="text-2xl font-extrabold text-[#3D3D3D] font-mono">{user.totalDays} Days</h4>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="clay-icon w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#3D3D3D]" />
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] font-mono">Success Rate</p>
            <h4 className="text-2xl font-extrabold text-[#3D3D3D] font-mono">{user.successRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
