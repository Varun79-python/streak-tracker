'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { User, Flame, Trophy, Calendar, Award, Zap, Edit2, Check } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setUser, achievements } = useStreak();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [name, setName] = useState(user.name);

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  const handleSaveBio = () => {
    setUser({ ...user, bio, name });
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Header Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-6 flex-wrap">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/50 shadow-2xl glow-green"
          />

          <div className="space-y-2 flex-1 min-w-64">
            <div className="flex items-center justify-between">
              <div>
                {isEditingBio ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1 text-lg font-bold text-white"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span>{user.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                      Level {user.level}
                    </span>
                  </h2>
                )}
                <p className="text-xs text-slate-400 font-mono">Member since {user.joinedDate}</p>
              </div>

              <button
                onClick={() => (isEditingBio ? handleSaveBio() : setIsEditingBio(true))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isEditingBio ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5" />}
                <span>{isEditingBio ? 'Save Changes' : 'Edit Bio'}</span>
              </button>
            </div>

            {/* Bio */}
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200"
              />
            ) : (
              <p className="text-xs text-slate-300 italic">"{user.bio}"</p>
            )}

            {/* Level Progress Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">XP Progress</span>
                <span className="text-emerald-400 font-bold">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-emerald-500 glow-green"
                  style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <Flame className="w-6 h-6 text-emerald-400 mx-auto fire-animated" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{user.currentStreak}</h4>
          <p className="text-xs text-slate-400 font-mono">Current Streak</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{user.longestStreak}</h4>
          <p className="text-xs text-slate-400 font-mono">Best Streak</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <Calendar className="w-6 h-6 text-blue-400 mx-auto" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{user.totalDays}</h4>
          <p className="text-xs text-slate-400 font-mono">Total Check-ins</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-1">
          <Award className="w-6 h-6 text-purple-400 mx-auto" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{unlockedAchievementsCount}</h4>
          <p className="text-xs text-slate-400 font-mono">Achievements</p>
        </div>
      </div>
    </div>
  );
};
