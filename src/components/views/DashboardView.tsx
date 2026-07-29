'use client';

import React, { useMemo } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { HeatmapGraph } from '../HeatmapGraph';
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar as CalendarIcon, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    history, 
    habits, 
    setShowCheckInModal, 
    setSelectedDayDetailsDate,
    setActiveView 
  } = useStreak();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayCheckIn = history[todayStr];

  const activeHabits = habits.filter(h => h.active);
  const completedTodayCount = todayCheckIn?.completedHabits?.length || 0;
  const isTodayComplete = todayCheckIn?.completed || false;

  // Derive recent activity from actual history
  const recentActivity = useMemo(() => {
    const entries = Object.entries(history)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice(0, 5);

    if (entries.length === 0) return [];

    return entries.map(([date, checkIn]) => {
      const isToday = date === todayStr;
      const displayDate = isToday
        ? 'Today'
        : format(new Date(date + 'T00:00:00'), 'MMM d');

      const completedCount = checkIn.completedHabits?.length || 0;
      const pct = checkIn.completionPercentage || 0;

      if (checkIn.completed) {
        return {
          id: date,
          icon: <Flame className="w-4 h-4 text-emerald-400" />,
          label: `All habits done — ${completedCount}/${completedCount} completed`,
          time: displayDate,
        };
      }
      return {
        id: date,
        icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
        label: `${completedCount} habits checked in (${pct}%)`,
        time: displayDate,
      };
    });
  }, [history, todayStr]);

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Current Streak */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-mono">Current Streak</p>
            <h3 className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
              <span>{user.currentStreak}</span>
              <span className="text-xs text-emerald-400 font-normal">days</span>
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">🔥 Active streak multiplier</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-green group-hover:scale-110 transition-transform">
            <Flame className="w-7 h-7 fire-animated" />
          </div>
        </div>

        {/* Stat 2: Longest Streak */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-mono">Longest Streak</p>
            <h3 className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
              <span>{user.longestStreak}</span>
              <span className="text-xs text-amber-400 font-normal">days</span>
            </h3>
            <p className="text-[11px] text-amber-400 font-medium">🏆 All-time personal record</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Consistency Rate */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-mono">Consistency Rate</p>
            <h3 className="text-3xl font-extrabold text-white font-mono">
              {user.successRate}%
            </h3>
            <p className="text-[11px] text-blue-400 font-medium">🎯 Last 90 days performance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Total XP & Level */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-mono">Level {user.level} Progress</p>
            <h3 className="text-2xl font-extrabold text-white font-mono">
              {user.xp} <span className="text-xs text-slate-400">/ 2,000 XP</span>
            </h3>
            <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden border border-white/5">
              <div
                className="h-full bg-emerald-400 glow-green"
                style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Heatmap Matrix Widget */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Your Contribution Heatmap</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                365 Days
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Every green square represents a step toward mastery.</p>
          </div>

          <button
            onClick={() => setActiveView('heatmap')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Full Heatmap View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5">
          <HeatmapGraph
            history={history}
            onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
          />
        </div>
      </div>

      {/* Middle Grid: Today's Habits Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Habit Preview */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Today's Habits Checklist</h3>
              <p className="text-xs text-slate-400 font-mono">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>

            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isTodayComplete ? 'Edit Check-in' : 'Open Check-in Modal'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeHabits.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">No habits yet</p>
                  <p className="text-xs text-slate-400 mt-1">Create your first habit to start tracking your daily progress.</p>
                </div>
                <button
                  onClick={() => setActiveView('habits')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create a Habit</span>
                </button>
              </div>
            ) : (
              activeHabits.slice(0, 5).map((habit) => {
                const isDone = todayCheckIn?.completedHabits?.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => setShowCheckInModal(true)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{habit.name}</p>
                        <p className="text-[10px] text-slate-400">{habit.description}</p>
                      </div>
                    </div>

                    <span className={`text-xs font-mono px-2 py-1 rounded-lg ${
                      isDone ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isDone ? '✓ Completed' : 'Pending'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity</span>
            </h3>

            <button
              onClick={() => setActiveView('activity')}
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {recentActivity.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-xs">No activity yet</p>
                <p className="text-slate-500 text-[10px]">Complete your first check-in to see activity here.</p>
              </div>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {entry.icon}
                    <span className="text-slate-200">{entry.label}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
