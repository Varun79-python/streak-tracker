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
import { BarChart3, TrendingUp, Award, CheckCircle2, AlertTriangle, Target, Sparkles } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', completion: 100 },
  { day: 'Tue', completion: 85 },
  { day: 'Wed', completion: 90 },
  { day: 'Thu', completion: 100 },
  { day: 'Fri', completion: 75 },
  { day: 'Sat', completion: 100 },
  { day: 'Sun', completion: 95 },
];

const monthlyData = [
  { month: 'Jan', streak: 12, rate: 78 },
  { month: 'Feb', streak: 18, rate: 82 },
  { month: 'Mar', streak: 25, rate: 88 },
  { month: 'Apr', streak: 30, rate: 91 },
  { month: 'May', streak: 45, rate: 94 },
  { month: 'Jun', streak: 67, rate: 96 },
];

export const StatisticsView: React.FC = () => {
  const { user, habits, history } = useStreak();
  const [analyticsQuery, setAnalyticsQuery] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const activeHabits = habits.filter(h => h.active);
  const totalHistoryDays = Object.keys(history).length;

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
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <div className="clay-icon p-2 rounded-xl">
              <BarChart3 className="w-5 h-5 text-[#7C9EB2]" />
            </div>
            <span>Statistics & Consistency Analytics</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">Deep insights into habit performance, completion trends, and streak milestones.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#7C9EB2]" />
            </div>
            <p className="text-xs text-[#9A9A9A] font-mono">Overall Completion %</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#7C9EB2] font-mono">{user.successRate}%</h3>
          <p className="text-[11px] text-[#9A9A9A]">Total days tracked: {user.totalDays}</p>
        </div>

        <div className="neu-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-[#7C9EB2]" />
            </div>
            <p className="text-xs text-[#9A9A9A] font-mono">Perfect Days Logged</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#7C9EB2] font-mono">{user.totalDays}</h3>
          <p className="text-[11px] text-[#9A9A9A]">Days with 100% completion</p>
        </div>

        <div className="neu-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-[#D4A574]" />
            </div>
            <p className="text-xs text-[#9A9A9A] font-mono">Longest Streak</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#D4A574] font-mono">{user.longestStreak} Days</h3>
          <p className="text-[11px] text-[#9A9A9A]">All-time record</p>
        </div>

        <div className="neu-card p-5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#C4A8D4]" />
            </div>
            <p className="text-xs text-[#9A9A9A] font-mono">Current Streak</p>
          </div>
          <h3 className="text-3xl font-extrabold text-[#C4A8D4] font-mono">{user.currentStreak} Days</h3>
          <p className="text-[11px] text-[#9A9A9A]">Active consistency streak</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Progress Bar Chart */}
        <div className="lg:col-span-6 neu-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#3D3D3D] flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#7C9EB2]" />
            </div>
            <span>Weekly Completion %</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#9A9A9A" fontSize={12} tickLine={false} />
                <YAxis stroke="#9A9A9A" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(0,0,0,0.08)', borderRadius: '0.75rem', color: '#3D3D3D' }}
                />
                <Bar dataKey="completion" fill="#7C9EB2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Progress Line Chart */}
        <div className="lg:col-span-6 neu-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#3D3D3D] flex items-center gap-2">
            <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#D4A574]" />
            </div>
            <span>Monthly Growth Trend</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" stroke="#9A9A9A" fontSize={12} />
                <YAxis stroke="#9A9A9A" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F5F0EB', borderColor: 'rgba(0,0,0,0.08)', borderRadius: '0.75rem', color: '#3D3D3D' }}
                />
                <Line type="monotone" dataKey="streak" stroke="#D4A574" strokeWidth={3} dot={{ fill: '#D4A574', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Habit Performance & Highlights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Performance Bars */}
        <div className="lg:col-span-8 neu-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-[#3D3D3D] flex items-center justify-between">
            <span>Habit Performance Breakdown</span>
            <span className="text-xs text-[#9A9A9A] font-mono">Active Habits ({dynamicHabitStats.length})</span>
          </h3>

          <div className="space-y-4">
            {dynamicHabitStats.length === 0 ? (
              <p className="text-xs text-[#9A9A9A]">No active habits found. Create habits to see performance analytics.</p>
            ) : (
              dynamicHabitStats.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#6B6B6B] font-semibold">
                    <span>{item.name}</span>
                    <span className="font-mono text-[#7C9EB2]">{item.rate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full neu-pressed overflow-hidden">
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
          <div className="neu-card p-5 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-[#A8C4B8] text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>MOST SUCCESSFUL HABIT</span>
            </div>
            <h4 className="text-lg font-bold text-[#3D3D3D]">{mostSuccessful ? mostSuccessful.name : 'No habits track record'}</h4>
            <p className="text-xs text-[#9A9A9A]">
              {mostSuccessful ? `${mostSuccessful.rate}% completion rate across ${totalHistoryDays} logged days.` : 'Start checking in to calculate habit stats.'}
            </p>
          </div>

          {mostMissed && (
            <div className="neu-card p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-[#C47C7C] text-xs font-bold font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>HABIT NEEDING FOCUS</span>
              </div>
              <h4 className="text-lg font-bold text-[#3D3D3D]">{mostMissed.name}</h4>
              <p className="text-xs text-[#9A9A9A]">{mostMissed.rate}% completion rate. Needs focused discipline!</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analytics */}
      <div className="neu-card p-6 rounded-3xl mt-6">
        <h3 className="text-lg font-bold text-[#3D3D3D] flex items-center gap-2 mb-4">
          <div className="clay-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#D4A574]" />
          </div>
          Ask AI About Your Stats
        </h3>
        <div className="flex gap-2">
          <input
            value={analyticsQuery}
            onChange={e => setAnalyticsQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAnalyticsQuery()}
            placeholder="e.g., How was my week? What habit do I miss most?"
            className="neu-input flex-1 rounded-xl px-4 py-2.5 text-sm text-[#3D3D3D] placeholder-[#9A9A9A] outline-none transition-colors"
          />
          <button
            onClick={runAnalyticsQuery}
            disabled={analyticsLoading || !analyticsQuery.trim()}
            className="px-4 py-2.5 rounded-xl gradient-coral text-[#3D3D3D] font-medium text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask
          </button>
        </div>
        {analyticsLoading && <p className="text-sm text-[#9A9A9A] mt-3 animate-pulse">Analyzing your data...</p>}
        {analyticsResult && !analyticsLoading && (
          <div className="mt-3 p-4 rounded-xl gradient-teal/20">
            <p className="text-sm text-[#3D3D3D]">{analyticsResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
