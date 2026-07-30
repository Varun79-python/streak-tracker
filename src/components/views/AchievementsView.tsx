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
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <Trophy className="w-6 h-6" style={{ color: 'var(--green)' }} />
            <span>Achievements & Milestones</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">
            Unlocked: {unlockedCount} / {achievements.length} Milestones
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl text-xs font-mono font-bold" style={{ borderRadius: '9999px', background: 'var(--surface-soft)', border: '1px solid var(--hairline)', color: 'var(--green)' }}>
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
              style={item.unlocked ? { borderColor: 'var(--green)' } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={item.unlocked ? { background: 'var(--green)' } : { background: 'rgba(34, 197, 94, 0.08)' }}>
                  {item.icon}
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                    item.unlocked
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--muted-soft)]'
                  }`}
                  style={item.unlocked ? { background: 'var(--green)', borderColor: 'rgba(34, 197, 94, 0.4)' } : { background: 'rgba(34, 197, 94, 0.08)', borderColor: 'var(--hairline)' }}
                >
                  {item.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--ink)] flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs font-mono num-font" style={{ color: 'var(--green)' }}>+{item.rewardXp} XP</span>
                </h3>
                <p className="text-xs text-[var(--muted-soft)]">{item.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-[var(--muted-soft)]">
                  <span>Progress</span>
                  <span className="text-[var(--ink)] font-bold num-font">
                    {item.currentDays} / {item.targetDays} Days ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={item.unlocked ? { background: 'var(--green)', width: `${pct}%` } : { background: 'var(--green)', width: `${pct}%` }}
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
