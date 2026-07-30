'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Medal, Trophy, Flame, Zap, Crown, User } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard } = useStreak();
  const [tab, setTab] = useState<'Global' | 'Friends' | 'Weekly' | 'Monthly'>('Global');

  const topThree = leaderboard.slice(0, 3);
  const restUsers = leaderboard.slice(3);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <div className="p-2" style={{ background: 'var(--green)', borderRadius: '12px' }}>
              <Medal className="w-5 h-5 text-white" />
            </div>
            <span>Global Leaderboard</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">
            Compete with top disciplined high performers worldwide. Updated daily.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['Global', 'Friends', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer claude-btn-secondary ${
                tab === t
                  ? 'font-bold'
                  : 'text-[var(--muted-soft)] hover:text-[var(--body)]'
              }`}
              style={tab === t ? { background: 'rgba(34, 197, 94, 0.08)', color: 'var(--green)', borderColor: 'var(--green)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
        {/* 2nd Place Silver */}
        {topThree[1] && (
          <div className="claude-card p-6 rounded-3xl text-center space-y-3 order-2 md:order-1 relative" style={{ borderTop: '4px solid var(--green)' }}>
            <div className="text-[var(--muted-claude)] font-bold text-xs mx-auto px-3 py-1" style={{ borderRadius: '9999px', background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}>
              🥈 2nd
            </div>
            <img src={topThree[1].avatar} alt={topThree[1].name} className="w-16 h-16 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--hairline)' }} />
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">{topThree[1].name}</h3>
              <p className="text-xs text-[var(--muted-soft)] font-mono">Level <span className="num-font">{topThree[1].level}</span> • <span className="num-font">{topThree[1].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold text-white" style={{ background: 'var(--green)' }}>
              <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{topThree[1].currentStreak}</span> days
            </div>
          </div>
        )}

        {/* 1st Place Gold */}
        {topThree[0] && (
          <div className="claude-card p-8 rounded-3xl text-center space-y-3 order-1 md:order-2 relative scale-105" style={{ borderTop: '4px solid var(--green)' }}>
            <Crown className="w-8 h-8 mx-auto fire-animated" style={{ color: 'var(--green)' }} />
            <img src={topThree[0].avatar} alt={topThree[0].name} className="w-20 h-20 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--green)' }} />
            <div>
              <h3 className="font-extrabold text-[var(--ink)] text-lg">{topThree[0].name}</h3>
              <p className="text-xs font-mono font-bold" style={{ color: 'var(--green)' }}>Level <span className="num-font">{topThree[0].level}</span> • <span className="num-font">{topThree[0].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs font-extrabold shadow-lg text-white" style={{ background: 'var(--green)' }}>
              <Flame className="w-4 h-4 fire-animated" /> <span className="num-font">{topThree[0].currentStreak}</span> days streak
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {topThree[2] && (
          <div className="claude-card p-6 rounded-3xl text-center space-y-3 order-3 md:order-3 relative" style={{ borderTop: '4px solid var(--green)' }}>
            <div className="font-bold text-xs mx-auto px-3 py-1" style={{ borderRadius: '9999px', background: 'var(--surface-soft)', border: '1px solid var(--hairline)', color: 'var(--green)' }}>
              🥉 3rd
            </div>
            <img src={topThree[2].avatar} alt={topThree[2].name} className="w-16 h-16 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--hairline)' }} />
            <div>
              <h3 className="font-bold text-[var(--ink)] text-base">{topThree[2].name}</h3>
              <p className="text-xs text-[var(--muted-soft)] font-mono">Level <span className="num-font">{topThree[2].level}</span> • <span className="num-font">{topThree[2].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold text-white" style={{ background: 'var(--green)' }}>
              <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{topThree[2].currentStreak}</span> days
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="claude-card rounded-3xl overflow-hidden">
        <div className="p-4 grid grid-cols-12 text-xs font-bold font-mono uppercase tracking-wider" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--muted-soft)' }}>
          <span className="col-span-1">Rank</span>
          <span className="col-span-5">User</span>
          <span className="col-span-2">Level</span>
          <span className="col-span-2">Total XP</span>
          <span className="col-span-2 text-right">Streak</span>
        </div>

        <div className="font-mono text-xs">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`claude-card-soft p-4 grid grid-cols-12 items-center transition-colors ${
                item.isCurrentUser ? 'font-bold' : ''
              }`}
              style={item.isCurrentUser ? { borderLeft: '4px solid var(--green)' } : {}}
            >
              <span className="col-span-1 font-bold num-font" style={{ color: 'var(--muted-claude)' }}>#{item.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-8 h-8" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--hairline)' }} />
                <span className="text-[var(--ink)] font-semibold truncate">{item.name}</span>
              </div>
              <span className="col-span-2 text-[var(--muted-soft)]">Lvl <span className="num-font">{item.level}</span></span>
              <span className="col-span-2 font-bold num-font" style={{ color: 'var(--green)' }}>{item.xp} XP</span>
              <span className="col-span-2 text-right font-bold flex items-center justify-end gap-1" style={{ color: 'var(--green)' }}>
                <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{item.currentStreak}</span>d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
