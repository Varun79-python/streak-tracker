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
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <div className="clay-icon gradient-coral p-2">
              <Medal className="w-5 h-5 text-white" />
            </div>
            <span>Global Leaderboard</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            Compete with top disciplined high performers worldwide. Updated daily.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['Global', 'Friends', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                tab === t
                  ? 'neu-btn font-bold text-[#7C9EB2]'
                  : 'neu-btn text-[#9A9A9A] hover:text-[#3D3D3D]'
              }`}
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
          <div className="neu-card p-6 rounded-3xl border-t-4 border-[#7C9EB2] text-center space-y-3 order-2 md:order-1 relative">
            <div className="clay-badge text-[#6B6B6B] font-bold text-xs mx-auto px-3 py-1">
              🥈 2nd
            </div>
            <img src={topThree[1].avatar} alt={topThree[1].name} className="clay-avatar w-16 h-16 mx-auto" />
            <div>
              <h3 className="font-bold text-[#3D3D3D] text-base">{topThree[1].name}</h3>
              <p className="text-xs text-[#9A9A9A] font-mono">Level {topThree[1].level} • {topThree[1].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full gradient-teal text-white font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fire-animated" /> {topThree[1].currentStreak} days
            </div>
          </div>
        )}

        {/* 1st Place Gold */}
        {topThree[0] && (
          <div className="neu-card p-8 rounded-3xl border-t-4 border-[#D4A574] text-center space-y-3 order-1 md:order-2 relative scale-105">
            <Crown className="w-8 h-8 text-[#D4A574] mx-auto fire-animated" />
            <img src={topThree[0].avatar} alt={topThree[0].name} className="clay-avatar w-20 h-20 mx-auto border-4 border-[#D4A574]" />
            <div>
              <h3 className="font-extrabold text-[#3D3D3D] text-lg">{topThree[0].name}</h3>
              <p className="text-xs text-[#D4A574] font-mono font-bold">Level {topThree[0].level} • {topThree[0].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-coral text-white font-mono text-xs font-extrabold shadow-lg">
              <Flame className="w-4 h-4 fire-animated" /> {topThree[0].currentStreak} days streak
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {topThree[2] && (
          <div className="neu-card p-6 rounded-3xl border-t-4 border-[#C4A8D4] text-center space-y-3 order-3 md:order-3 relative">
            <div className="clay-badge text-[#D4A574] font-bold text-xs mx-auto px-3 py-1">
              🥉 3rd
            </div>
            <img src={topThree[2].avatar} alt={topThree[2].name} className="clay-avatar w-16 h-16 mx-auto" />
            <div>
              <h3 className="font-bold text-[#3D3D3D] text-base">{topThree[2].name}</h3>
              <p className="text-xs text-[#9A9A9A] font-mono">Level {topThree[2].level} • {topThree[2].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full gradient-lavender text-white font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fire-animated" /> {topThree[2].currentStreak} days
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="neu-card rounded-3xl overflow-hidden">
        <div className="neu-pressed p-4 grid grid-cols-12 text-xs font-bold font-mono text-[#9A9A9A] uppercase tracking-wider">
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
              className={`neu-card-sm p-4 grid grid-cols-12 items-center transition-colors ${
                item.isCurrentUser ? 'border-l-4 border-[#7C9EB2] font-bold' : ''
              }`}
            >
              <span className="col-span-1 text-[#6B6B6B] font-bold">#{item.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="clay-avatar w-8 h-8" />
                <span className="text-[#3D3D3D] font-semibold truncate">{item.name}</span>
              </div>
              <span className="col-span-2 text-[#9A9A9A]">Lvl {item.level}</span>
              <span className="col-span-2 text-[#7C9EB2] font-bold">{item.xp} XP</span>
              <span className="col-span-2 text-right text-[#D4A574] font-bold flex items-center justify-end gap-1">
                <Flame className="w-3.5 h-3.5 fire-animated" /> {item.currentStreak}d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
