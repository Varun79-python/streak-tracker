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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Medal className="w-6 h-6 text-amber-400" />
            <span>Global Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Compete with top disciplined high performers worldwide. Updated daily.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['Global', 'Friends', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                tab === t
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
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
          <div className="glass-panel p-6 rounded-3xl border border-slate-300/30 text-center space-y-3 order-2 md:order-1 relative">
            <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 flex items-center justify-center font-bold text-xs mx-auto">
              🥈 2nd
            </div>
            <img src={topThree[1].avatar} alt={topThree[1].name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 mx-auto" />
            <div>
              <h3 className="font-bold text-white text-base">{topThree[1].name}</h3>
              <p className="text-xs text-slate-400 font-mono">Level {topThree[1].level} • {topThree[1].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fire-animated" /> {topThree[1].currentStreak} days
            </div>
          </div>
        )}

        {/* 1st Place Gold */}
        {topThree[0] && (
          <div className="glass-panel p-8 rounded-3xl border border-amber-400/50 bg-amber-500/10 text-center space-y-3 order-1 md:order-2 relative shadow-2xl scale-105 glow-orange">
            <Crown className="w-8 h-8 text-amber-400 mx-auto fire-animated" />
            <img src={topThree[0].avatar} alt={topThree[0].name} className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 mx-auto" />
            <div>
              <h3 className="font-extrabold text-white text-lg">{topThree[0].name}</h3>
              <p className="text-xs text-amber-300 font-mono font-bold">Level {topThree[0].level} • {topThree[0].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-extrabold shadow-lg">
              <Flame className="w-4 h-4 fire-animated" /> {topThree[0].currentStreak} days streak
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {topThree[2] && (
          <div className="glass-panel p-6 rounded-3xl border border-amber-700/30 text-center space-y-3 order-3 md:order-3 relative">
            <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-400 border border-amber-700/40 flex items-center justify-center font-bold text-xs mx-auto">
              🥉 3rd
            </div>
            <img src={topThree[2].avatar} alt={topThree[2].name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-600 mx-auto" />
            <div>
              <h3 className="font-bold text-white text-base">{topThree[2].name}</h3>
              <p className="text-xs text-slate-400 font-mono">Level {topThree[2].level} • {topThree[2].xp} XP</p>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fire-animated" /> {topThree[2].currentStreak} days
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 grid grid-cols-12 text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          <span className="col-span-1">Rank</span>
          <span className="col-span-5">User</span>
          <span className="col-span-2">Level</span>
          <span className="col-span-2">Total XP</span>
          <span className="col-span-2 text-right">Streak</span>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              className={`p-4 grid grid-cols-12 items-center transition-colors ${
                item.isCurrentUser ? 'bg-emerald-500/15 border-l-4 border-emerald-400 font-bold' : 'hover:bg-white/5'
              }`}
            >
              <span className="col-span-1 text-slate-300 font-bold">#{item.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                <span className="text-slate-100 font-semibold truncate">{item.name}</span>
              </div>
              <span className="col-span-2 text-slate-400">Lvl {item.level}</span>
              <span className="col-span-2 text-emerald-400 font-bold">{item.xp} XP</span>
              <span className="col-span-2 text-right text-amber-400 font-bold flex items-center justify-end gap-1">
                <Flame className="w-3.5 h-3.5 fire-animated" /> {item.currentStreak}d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
