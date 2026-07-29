'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  const [dailyQuote, setDailyQuote] = useState<{ text: string } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, type: 'quote' }),
        });
        const data = await res.json();
        setDailyQuote(data.insight);
      } catch { /* ignore */ }
      finally { setQuoteLoading(false) }
    };
    if (user.id) fetchQuote();
  }, [user.id]);

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
          icon: <Flame className="w-4 h-4 text-[#D4A574]" />,
          label: `All habits done — ${completedCount}/${completedCount} completed`,
          time: displayDate,
        };
      }
      return {
        id: date,
        icon: <CheckCircle2 className="w-4 h-4 text-[#7C9EB2]" />,
        label: `${completedCount} habits checked in (${pct}%)`,
        time: displayDate,
      };
    });
  }, [history, todayStr]);

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stat 1: Current Streak */}
        <div className="neu-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <p className="text-[10px] text-[#6B6B6B] font-mono uppercase tracking-wider">Current Streak</p>
            <h3 className="text-3xl font-extrabold text-[#3D3D3D] font-mono flex items-baseline gap-1">
              <span>{user.currentStreak}</span>
              <span className="text-xs text-[#D4A574] font-normal">days</span>
            </h3>
            <p className="text-[10px] text-[#D4A574] font-medium">🔥 Active streak</p>
          </div>
          <div className="w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center clay-icon group-hover:scale-110 transition-transform">
            <Flame className="w-7 h-7 fire-animated text-white" />
          </div>
        </div>

        {/* Stat 2: Longest Streak */}
        <div className="neu-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[#6B6B6B] font-mono uppercase tracking-wider">Longest Streak</p>
            <h3 className="text-3xl font-extrabold text-[#3D3D3D] font-mono flex items-baseline gap-1">
              <span>{user.longestStreak}</span>
              <span className="text-xs text-[#C4A8D4] font-normal">days</span>
            </h3>
            <p className="text-[10px] text-[#C4A8D4] font-medium">🏆 Personal record</p>
          </div>
          <div className="w-12 h-12 rounded-2xl gradient-lavender flex items-center justify-center clay-icon">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stat 3: Consistency Rate */}
        <div className="neu-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[#6B6B6B] font-mono uppercase tracking-wider">Consistency</p>
            <h3 className="text-3xl font-extrabold text-[#3D3D3D] font-mono">
              {user.successRate}%
            </h3>
            <p className="text-[10px] text-[#7C9EB2] font-medium">🎯 Performance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl gradient-teal flex items-center justify-center clay-icon">
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stat 4: Total XP & Level */}
        <div className="neu-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[#6B6B6B] font-mono uppercase tracking-wider">Level {user.level}</p>
            <h3 className="text-2xl font-extrabold text-[#3D3D3D] font-mono">
              {user.xp} <span className="text-xs text-[#9A9A9A]">/ 2,000 XP</span>
            </h3>
            <div className="w-full h-2 neu-pressed rounded-full overflow-hidden mt-1">
              <div
                className="h-full gradient-teal rounded-full"
                style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl gradient-mint flex items-center justify-center clay-icon">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="neu-card p-5 border-l-4 border-[#7C9EB2]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-teal flex items-center justify-center clay-icon flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#7C9EB2] font-mono mb-1 uppercase tracking-wider">Daily Insight</p>
            {quoteLoading ? (
              <p className="text-sm text-[#9A9A9A] animate-pulse">Finding your spark...</p>
            ) : (
              <p className="text-sm text-[#3D3D3D] leading-relaxed">{dailyQuote?.text || 'Small steps lead to big changes. Keep showing up! 🔥'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Heatmap Matrix Widget */}
      <div className="neu-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#3D3D3D] flex items-center gap-2">
              <span>Contribution Heatmap</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full gradient-teal text-white font-mono clay-badge">
                365 Days
              </span>
            </h3>
            <p className="text-xs text-[#6B6B6B] font-mono">Every square represents a step toward mastery.</p>
          </div>

          <button
            onClick={() => setActiveView('heatmap')}
            className="px-4 py-2 neu-btn text-xs text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xl"
          >
            <span>Full View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="neu-pressed p-4 rounded-2xl">
          <HeatmapGraph
            history={history}
            onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
          />
        </div>
      </div>

      {/* Middle Grid: Today's Habits Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Habit Preview */}
        <div className="lg:col-span-7 neu-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#3D3D3D]">Today's Habits</h3>
              <p className="text-xs text-[#6B6B6B] font-mono">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>

            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 rounded-xl gradient-coral text-white font-bold text-xs transition-all clay-badge flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isTodayComplete ? 'Edit Check-in' : 'Check-in'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeHabits.length === 0 ? (
              <div className="p-8 neu-pressed rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl gradient-teal flex items-center justify-center clay-icon mx-auto">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3D3D3D]">No habits yet</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">Create your first habit to start tracking.</p>
                </div>
                <button
                  onClick={() => setActiveView('habits')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-coral text-white font-bold text-xs transition-all clay-badge cursor-pointer hover:scale-[1.02]"
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
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isDone
                        ? 'neu-pressed border-l-4 border-[#7C9EB2]'
                        : 'neu-card-sm hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-[#3D3D3D]">{habit.name}</p>
                        <p className="text-[10px] text-[#9A9A9A]">{habit.description}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-xl clay-badge ${
                      isDone ? 'gradient-teal text-white' : 'neu-pressed text-[#9A9A9A]'
                    }`}>
                      {isDone ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 neu-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#3D3D3D] flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl gradient-lavender flex items-center justify-center clay-icon">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span>Recent Activity</span>
            </h3>

            <button
              onClick={() => setActiveView('activity')}
              className="text-xs text-[#7C9EB2] hover:underline cursor-pointer font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {recentActivity.length === 0 ? (
              <div className="p-6 neu-pressed rounded-2xl text-center space-y-2">
                <Clock className="w-8 h-8 text-[#C5BDB5] mx-auto" />
                <p className="text-[#9A9A9A] text-xs">No activity yet</p>
                <p className="text-[#C5BDB5] text-[10px]">Complete your first check-in to see activity here.</p>
              </div>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 neu-card-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {entry.icon}
                    <span className="text-[#3D3D3D] text-[11px]">{entry.label}</span>
                  </div>
                  <span className="text-[#9A9A9A] text-[10px]">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
