'use client';

import React from 'react';
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
import { BarChart3, TrendingUp, Award, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

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
  const { user, habits } = useStreak();

  const habitStats = [
    { name: 'Studied Today', rate: 96, color: '#3b82f6' },
    { name: 'Controlled Lust', rate: 88, color: '#8b5cf6' },
    { name: 'Coding Practice', rate: 85, color: '#06b6d4' },
    { name: 'Read Books', rate: 80, color: '#f59e0b' },
    { name: 'Exercise Done', rate: 74, color: '#ef4444' },
    { name: 'Meditation', rate: 68, color: '#10b981' },
    { name: 'No Social Media', rate: 58, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Statistics & Consistency Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">Deep insights into habit performance, completion trends, and streak milestones.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-slate-400 font-mono">Overall Completion %</p>
          <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">87%</h3>
          <p className="text-[11px] text-slate-400">+4% higher than last month</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-slate-400 font-mono">Perfect Days Logged</p>
          <h3 className="text-3xl font-extrabold text-blue-400 font-mono">118</h3>
          <p className="text-[11px] text-slate-400">Days with 100% completion</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-slate-400 font-mono">Average Streak</p>
          <h3 className="text-3xl font-extrabold text-amber-400 font-mono">18 Days</h3>
          <p className="text-[11px] text-slate-400">Mean duration before reset</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-slate-400 font-mono">Consistency Score</p>
          <h3 className="text-3xl font-extrabold text-purple-400 font-mono">9.4 / 10</h3>
          <p className="text-[11px] text-slate-400">Top 5% among all users</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Progress Bar Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Weekly Completion %</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="completion" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Progress Line Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Monthly Growth Trend</span>
          </h3>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Line type="monotone" dataKey="streak" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Habit Performance & Highlights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Performance Bars */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Habit Performance Breakdown</span>
            <span className="text-xs text-slate-400 font-mono">Last 90 Days</span>
          </h3>

          <div className="space-y-4">
            {habitStats.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>{item.name}</span>
                  <span className="font-mono text-emerald-400">{item.rate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Missed vs Most Successful */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>MOST SUCCESSFUL HABIT</span>
            </div>
            <h4 className="text-lg font-bold text-white">Studied Today 🧠</h4>
            <p className="text-xs text-slate-400">96% completion rate across 156 days.</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>MOST MISSED HABIT</span>
            </div>
            <h4 className="text-lg font-bold text-white">No Social Media 🚫</h4>
            <p className="text-xs text-slate-400">Missed 42 times. Needs focused discipline!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
