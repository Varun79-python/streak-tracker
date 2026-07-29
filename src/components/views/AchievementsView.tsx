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
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#D4A574]" />
            <span>Achievements & Milestones</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            Unlocked: {unlockedCount} / {achievements.length} Milestones
          </p>
        </div>

        <div className="clay-badge px-4 py-2 rounded-xl border border-[#D4A574]/50 text-[#D4A574] text-xs font-mono font-bold">
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
              className={`p-6 rounded-3xl border space-y-4 transition-all relative overflow-hidden ${
                item.unlocked
                  ? 'neu-card border-[#A8C4B8]'
                  : 'neu-card-sm opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  item.unlocked
                    ? 'gradient-teal'
                    : 'neu-pressed'
                }`}>
                  {item.icon}
                </div>

                <span
                  className={`clay-badge text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                    item.unlocked
                      ? 'gradient-teal text-[#3D3D3D] border-[#7C9EB2]/40'
                      : 'neu-pressed text-[#9A9A9A]'
                  }`}
                >
                  {item.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#3D3D3D] flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs text-[#D4A574] font-mono">+{item.rewardXp} XP</span>
                </h3>
                <p className="text-xs text-[#9A9A9A]">{item.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-[#9A9A9A]">
                  <span>Progress</span>
                  <span className="text-[#3D3D3D] font-bold">
                    {item.currentDays} / {item.targetDays} Days ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full neu-pressed overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.unlocked ? 'gradient-teal' : 'gradient-coral'
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
