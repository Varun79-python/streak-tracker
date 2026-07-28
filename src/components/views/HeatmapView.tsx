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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Grid3X3 className="w-6 h-6 text-emerald-400" />
            <span>365-Day Contribution Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Inspired by GitHub's contribution graph. Hover over any day for details or click to inspect.
          </p>
        </div>
      </div>

      {/* Main Heatmap Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 shadow-inner">
          <HeatmapGraph
            history={history}
            onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
          />
        </div>
      </div>

      {/* Analytics Summary Below Heatmap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-green">
            <Flame className="w-6 h-6 fire-animated" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">Current Streak</p>
            <h4 className="text-2xl font-extrabold text-white font-mono">{user.currentStreak} Days</h4>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">Longest Streak</p>
            <h4 className="text-2xl font-extrabold text-white font-mono">{user.longestStreak} Days</h4>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">Total Tracked Days</p>
            <h4 className="text-2xl font-extrabold text-white font-mono">{user.totalDays} Days</h4>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">Success Rate</p>
            <h4 className="text-2xl font-extrabold text-white font-mono">{user.successRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
