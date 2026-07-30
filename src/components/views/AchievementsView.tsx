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
          <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <Trophy className="w-6 h-6" style={{ color: '#e8a55a' }} />
            <span>Achievements & Milestones</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">
            Unlocked: {unlockedCount} / {achievements.length} Milestones
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl text-xs font-mono font-bold" style={{ borderRadius: '9999px', background: '#f5f0e8', border: '1px solid #e6dfd8', color: '#e8a55a' }}>
          🏆 Total XP Rewards: <span className="num-font">{achievements.reduce((acc, curr) => acc + (curr.unlocked ? curr.rewardXp : 0), 0)}</span> XP
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
                  ? 'claude-card'
                  : 'claude-card-soft opacity-80'
              }`}
              style={item.unlocked ? { borderColor: '#5db872' } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={item.unlocked ? { background: '#5db872' } : { background: 'rgba(204, 120, 92, 0.08)' }}>
                  {item.icon}
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                    item.unlocked
                      ? 'text-[#252523]'
                      : 'text-[#8e8b82]'
                  }`}
                  style={item.unlocked ? { background: '#5db872', borderColor: 'rgba(93, 184, 166, 0.4)' } : { background: 'rgba(204, 120, 92, 0.08)', borderColor: '#e6dfd8' }}
                >
                  {item.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#252523] flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs font-mono num-font" style={{ color: '#e8a55a' }}>+{item.rewardXp} XP</span>
                </h3>
                <p className="text-xs text-[#8e8b82]">{item.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-[#8e8b82]">
                  <span>Progress</span>
                  <span className="text-[#252523] font-bold num-font">
                    {item.currentDays} / {item.targetDays} Days ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(204, 120, 92, 0.08)' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={item.unlocked ? { background: '#5db872', width: `${pct}%` } : { background: '#cc785c', width: `${pct}%` }}
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
