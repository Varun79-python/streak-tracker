'use client';

import React, { useMemo, useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { format, subDays, startOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { BarChart3, TrendingUp, Award, CheckCircle2, AlertTriangle, Target, Sparkles } from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { user, habits, history } = useStreak();
  const [analyticsQuery, setAnalyticsQuery] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const activeHabits = habits.filter(h => h.active);
  const totalHistoryDays = Object.keys(history).length;

  // Derive weekly data from last 7 days of history
  const weeklyData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = history[dateStr];
      return {
        day: dayNames[date.getDay()],
        completion: entry?.completionPercentage ?? 0,
      };
    });
  }, [history]);

  // Derive monthly data from last 6 months
  const monthlyData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const monthDate = subMonths(today, 5 - i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let totalCompletion = 0;
      let trackedDays = 0;
      let perfectDays = 0;

      daysInMonth.forEach((day) => {
        if (day > today) return;
        const dateStr = format(day, 'yyyy-MM-dd');
        const entry = history[dateStr];
        if (entry) {
          totalCompletion += entry.completionPercentage ?? 0;
          trackedDays++;
          if (entry.completed) perfectDays++;
        }
      });

      const avgRate = trackedDays > 0 ? Math.round(totalCompletion / trackedDays) : 0;

      return {
        month: format(monthDate, 'MMM'),
        streak: perfectDays,
        rate: avgRate,
      };
    });
  }, [history]);

  const runAnalyticsQuery = async () => {
    if (!analyticsQuery.trim() || analyticsLoading) return;
    setAnalyticsLoading(true);
    setAnalyticsResult('');
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, query: analyticsQuery }),
      });
      const data = await res.json();
      setAnalyticsResult(data.reply || 'No insights available right now.');
    } catch {
      setAnalyticsResult('Based on your data, you are building great habits! Keep going! 📊');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const dynamicHabitStats = useMemo(() => {
    if (activeHabits.length === 0) return [];

    return activeHabits.map((habit, index) => {
      let completedCount = 0;
      Object.values(history).forEach((checkIn) => {
        if (checkIn.completedHabits?.includes(habit.id)) {
          completedCount++;
        }
      });

      const rate = totalHistoryDays > 0
        ? Math.round((completedCount / totalHistoryDays) * 100)
        : 100;

      const defaultColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
      const color = habit.color || defaultColors[index % defaultColors.length];

      return {
        id: habit.id,
        name: `${habit.name} ${habit.icon}`,
        rate,
        completedCount,
        color,
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [activeHabits, history, totalHistoryDays]);

  const mostSuccessful = dynamicHabitStats[0];
  const mostMissed = dynamicHabitStats.length > 1 ? dynamicHabitStats[dynamicHabitStats.length - 1] : null;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#252523] flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ borderRadius: '12px' }}>
              <BarChart3 className="w-5 h-5 text-[#cc785c]" />
            </div>
            <span>Statistics & Consistency Analytics</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">Deep insights into habit performance, completion trends, and streak milestones.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="claude-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <CheckCircle2 className="w-4 h-4 text-[#cc785c]" />
            </div>
            <p className="text-xs text-[#8e8b82] font-mono">Overall Completion %</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#cc785c] num-font">{user.successRate}%</h3>
          <p className="text-[11px] text-[#8e8b82]">Total days tracked: {user.totalDays}</p>
        </div>

        <div className="claude-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <Target className="w-4 h-4 text-[#cc785c]" />
            </div>
            <p className="text-xs text-[#8e8b82] font-mono">Perfect Days Logged</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#cc785c] num-font">{user.totalDays}</h3>
          <p className="text-[11px] text-[#8e8b82]">Days with 100% completion</p>
        </div>

        <div className="claude-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <Award className="w-4 h-4 text-[#e8a55a]" />
            </div>
            <p className="text-xs text-[#8e8b82] font-mono">Longest Streak</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#e8a55a] num-font">{user.longestStreak} Days</h3>
          <p className="text-[11px] text-[#8e8b82]">All-time record</p>
        </div>

        <div className="claude-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <TrendingUp className="w-4 h-4 text-[#e8a55a]" />
            </div>
            <p className="text-xs text-[#8e8b82] font-mono">Current Streak</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#e8a55a] num-font">{user.currentStreak} Days</h3>
          <p className="text-[11px] text-[#8e8b82]">Active consistency streak</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Progress Bar Chart */}
        <div className="lg:col-span-6 claude-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#252523] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <BarChart3 className="w-4 h-4 text-[#cc785c]" />
            </div>
            <span>Last 7 Days Completion %</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#8e8b82" fontSize={12} tickLine={false} />
                <YAxis stroke="#8e8b82" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5f0e8', borderColor: '#e6dfd8', borderRadius: '0.75rem', color: '#3d3d3a' }}
                />
                <Bar dataKey="completion" fill="#cc785c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Progress Line Chart */}
        <div className="lg:col-span-6 claude-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#252523] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <TrendingUp className="w-4 h-4 text-[#e8a55a]" />
            </div>
            <span>Monthly Average Completion %</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" stroke="#8e8b82" fontSize={12} />
                <YAxis stroke="#8e8b82" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5f0e8', borderColor: '#e6dfd8', borderRadius: '0.75rem', color: '#3d3d3a' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#e8a55a" strokeWidth={3} dot={{ fill: '#e8a55a', r: 4 }} name="Avg Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Habit Performance & Highlights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Performance Bars */}
        <div className="lg:col-span-8 claude-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#252523] flex items-center justify-between">
            <span>Habit Performance Breakdown</span>
            <span className="text-xs text-[#8e8b82] font-mono">Active Habits ({dynamicHabitStats.length})</span>
          </h3>

          <div className="space-y-4">
            {dynamicHabitStats.length === 0 ? (
              <p className="text-xs text-[#8e8b82]">No active habits found. Create habits to see performance analytics.</p>
            ) : (
              dynamicHabitStats.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#6c6a64] font-semibold">
                    <span>{item.name}</span>
                    <span className="font-mono text-[#cc785c] num-font">{item.rate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(204, 120, 92, 0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Missed vs Most Successful */}
        <div className="lg:col-span-4 space-y-4">
          <div className="claude-card p-5 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-[#5db872] text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>MOST SUCCESSFUL HABIT</span>
            </div>
            <h4 className="text-lg font-bold text-[#252523]">{mostSuccessful ? mostSuccessful.name : 'No habits track record'}</h4>
            <p className="text-xs text-[#8e8b82]">
              {mostSuccessful ? `${mostSuccessful.rate}% completion rate across ${totalHistoryDays} logged days.` : 'Start checking in to calculate habit stats.'}
            </p>
          </div>

          {mostMissed && (
            <div className="claude-card p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-[#c64545] text-xs font-bold font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>HABIT NEEDING FOCUS</span>
              </div>
              <h4 className="text-lg font-bold text-[#252523]">{mostMissed.name}</h4>
              <p className="text-xs text-[#8e8b82]">{mostMissed.rate}% completion rate. Needs focused discipline!</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analytics */}
      <div className="claude-card p-6 rounded-3xl mt-6">
        <h3 className="text-lg font-bold text-[#252523] flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ borderRadius: '12px' }}>
            <Sparkles className="w-4 h-4 text-[#e8a55a]" />
          </div>
          Ask AI About Your Stats
        </h3>
        <div className="flex gap-2">
          <input
            value={analyticsQuery}
            onChange={e => setAnalyticsQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAnalyticsQuery()}
            placeholder="e.g., How was my week? What habit do I miss most?"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm text-[#3d3d3a] placeholder-[#8e8b82] outline-none transition-colors claude-input"
          />
          <button
            onClick={runAnalyticsQuery}
            disabled={analyticsLoading || !analyticsQuery.trim()}
            className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#cc785c', color: '#faf9f5' }}
          >
            Ask
          </button>
        </div>
        {analyticsLoading && <p className="text-sm text-[#8e8b82] mt-3 animate-pulse">Analyzing your data...</p>}
        {analyticsResult && !analyticsLoading && (
          <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(93, 184, 166, 0.2)' }}>
            <p className="text-sm text-[#3d3d3a]">{analyticsResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
