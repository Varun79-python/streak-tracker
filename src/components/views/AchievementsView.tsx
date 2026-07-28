'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Trophy, CheckCircle2, Lock, Sparkles, Award } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements } = useStreak();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Achievements & Milestones</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Unlocked: {unlockedCount} / {achievements.length} Milestones
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          🏆 Total XP Rewards: {achievements.reduce((acc, curr) => acc + (curr.unlocked ? curr.rewardXp : 0), 0)} XP
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => {
          const pct = Math.min(100, Math.round((item.currentDays / item.targetDays) * 100));
          return (
            <div
              key={item.id}
              className={`glass-panel p-6 rounded-3xl border space-y-4 transition-all relative overflow-hidden ${
                item.unlocked
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-white/10 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                    item.unlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 glow-green'
                      : 'bg-slate-800 text-slate-400 border-white/10'
                  }`}
                >
                  {item.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs text-amber-400 font-mono">+{item.rewardXp} XP</span>
                </h3>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Progress</span>
                  <span className="text-slate-200 font-bold">
                    {item.currentDays} / {item.targetDays} Days ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.unlocked ? 'bg-emerald-500 glow-green' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
