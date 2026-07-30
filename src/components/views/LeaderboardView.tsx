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
          <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <div className="p-2" style={{ background: '#cc785c', borderRadius: '12px' }}>
              <Medal className="w-5 h-5 text-white" />
            </div>
            <span>Global Leaderboard</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">
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
                  : 'text-[#8e8b82] hover:text-[#3d3d3a]'
              }`}
              style={tab === t ? { background: 'rgba(204, 120, 92, 0.08)', color: '#cc785c', borderColor: '#cc785c' } : {}}
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
          <div className="claude-card p-6 rounded-3xl text-center space-y-3 order-2 md:order-1 relative" style={{ borderTop: '4px solid #cc785c' }}>
            <div className="text-[#6c6a64] font-bold text-xs mx-auto px-3 py-1" style={{ borderRadius: '9999px', background: '#f5f0e8', border: '1px solid #e6dfd8' }}>
              🥈 2nd
            </div>
            <img src={topThree[1].avatar} alt={topThree[1].name} className="w-16 h-16 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #e6dfd8' }} />
            <div>
              <h3 className="font-bold text-[#252523] text-base">{topThree[1].name}</h3>
              <p className="text-xs text-[#8e8b82] font-mono">Level <span className="num-font">{topThree[1].level}</span> • <span className="num-font">{topThree[1].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold text-white" style={{ background: '#5db8a6' }}>
              <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{topThree[1].currentStreak}</span> days
            </div>
          </div>
        )}

        {/* 1st Place Gold */}
        {topThree[0] && (
          <div className="claude-card p-8 rounded-3xl text-center space-y-3 order-1 md:order-2 relative scale-105" style={{ borderTop: '4px solid #e8a55a' }}>
            <Crown className="w-8 h-8 mx-auto fire-animated" style={{ color: '#e8a55a' }} />
            <img src={topThree[0].avatar} alt={topThree[0].name} className="w-20 h-20 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid #e8a55a' }} />
            <div>
              <h3 className="font-extrabold text-[#252523] text-lg">{topThree[0].name}</h3>
              <p className="text-xs font-mono font-bold" style={{ color: '#e8a55a' }}>Level <span className="num-font">{topThree[0].level}</span> • <span className="num-font">{topThree[0].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs font-extrabold shadow-lg text-white" style={{ background: '#cc785c' }}>
              <Flame className="w-4 h-4 fire-animated" /> <span className="num-font">{topThree[0].currentStreak}</span> days streak
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {topThree[2] && (
          <div className="claude-card p-6 rounded-3xl text-center space-y-3 order-3 md:order-3 relative" style={{ borderTop: '4px solid #e8a55a' }}>
            <div className="font-bold text-xs mx-auto px-3 py-1" style={{ borderRadius: '9999px', background: '#f5f0e8', border: '1px solid #e6dfd8', color: '#e8a55a' }}>
              🥉 3rd
            </div>
            <img src={topThree[2].avatar} alt={topThree[2].name} className="w-16 h-16 mx-auto" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #e6dfd8' }} />
            <div>
              <h3 className="font-bold text-[#252523] text-base">{topThree[2].name}</h3>
              <p className="text-xs text-[#8e8b82] font-mono">Level <span className="num-font">{topThree[2].level}</span> • <span className="num-font">{topThree[2].xp}</span> XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold text-white" style={{ background: '#e8a55a' }}>
              <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{topThree[2].currentStreak}</span> days
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="claude-card rounded-3xl overflow-hidden">
        <div className="p-4 grid grid-cols-12 text-xs font-bold font-mono uppercase tracking-wider" style={{ background: 'rgba(204, 120, 92, 0.08)', color: '#8e8b82' }}>
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
              style={item.isCurrentUser ? { borderLeft: '4px solid #cc785c' } : {}}
            >
              <span className="col-span-1 font-bold num-font" style={{ color: '#6c6a64' }}>#{item.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-8 h-8" style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #e6dfd8' }} />
                <span className="text-[#252523] font-semibold truncate">{item.name}</span>
              </div>
              <span className="col-span-2 text-[#8e8b82]">Lvl <span className="num-font">{item.level}</span></span>
              <span className="col-span-2 font-bold num-font" style={{ color: '#cc785c' }}>{item.xp} XP</span>
              <span className="col-span-2 text-right font-bold flex items-center justify-end gap-1" style={{ color: '#e8a55a' }}>
                <Flame className="w-3.5 h-3.5 fire-animated" /> <span className="num-font">{item.currentStreak}</span>d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
