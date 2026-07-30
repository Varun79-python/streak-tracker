'use client';

import React, { useState, useMemo } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Trophy, Edit2, Check, Camera, Sparkles, Target, Zap } from 'lucide-react';
import { AvatarPicker } from '../AvatarPicker';

/** Compute consecutive days with a check-in, walking backwards from today (LeetCode-style). */
function computeHeatmapStreak(history: Record<string, any>): number {
  const today = new Date();
  let streak = 0;
  const d = new Date(today);
  for (let i = 0; i < 366; i++) {
    const key = d.toISOString().split('T')[0];
    const entry = history[key];
    if (entry && (entry.completed === true || (entry.completedHabits && entry.completedHabits.length > 0))) {
      streak++;
    } else if (i > 0) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, achievements, history } = useStreak();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [name, setName] = useState(user.name);

  // Sync local state when user database profile loads or updates
  React.useEffect(() => {
    setName(user.name);
    setBio(user.bio);
  }, [user.name, user.bio]);

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  // Compute real stats from history data
  const computedStats = useMemo(() => {
    const allDates = Object.keys(history).sort();
    const totalDays = allDates.length;
    const completedDays = allDates.filter(d => history[d].completed).length;
    const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    const heatmapStreak = computeHeatmapStreak(history);
    return { totalDays, successRate, heatmapStreak };
  }, [history]);

  const handleSaveBio = async () => {
    await updateUserProfile({ bio, name });
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 select-none">
      {/* Header Profile Card */}
      <div className="claude-card p-4 sm:p-8 rounded-3xl relative overflow-hidden space-y-4 sm:space-y-6">
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(34, 197, 94, 0.1)' }} />

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {/* Avatar Container with Edit Camera Badge */}
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
            <div style={{ borderRadius: '50%' }}>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                alt={user.name || 'User Avatar'}
                className="w-24 h-24 rounded-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center" style={{ background: 'var(--green)' }}>
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 flex-1 min-w-0 sm:min-w-64">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                {isEditingBio ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="claude-input rounded-xl px-3 py-1 text-lg font-bold text-[var(--body)]"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-3">
                    <span>{user.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono text-[var(--ink)]" style={{ background: 'var(--green)' }}>
                      Level {user.level}
                    </span>
                  </h2>
                )}
                <p className="text-xs text-[var(--muted-soft)] font-mono">
                  {user.email && <span className="mr-2 text-[var(--muted-claude)] font-sans">{user.email} •</span>}
                  Member since {user.joinedDate || '2025'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="claude-btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--body)] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />
                  <span>{showAvatarPicker ? 'Hide Avatars' : 'Choose Photo'}</span>
                </button>

                <button
                  onClick={() => (isEditingBio ? handleSaveBio() : setIsEditingBio(true))}
                  className="claude-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted-claude)] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isEditingBio ? <Check className="w-4 h-4 text-[var(--green)]" /> : <Edit2 className="w-3.5 h-3.5" />}
                  <span>{isEditingBio ? 'Save Changes' : 'Edit Bio'}</span>
                </button>
              </div>
            </div>

            {/* Bio */}
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="claude-input w-full rounded-xl p-2.5 text-xs text-[var(--muted-claude)]"
              />
            ) : (
              <p className="text-xs text-[var(--muted-claude)] italic">"{user.bio || 'Keep building daily habits!'}"</p>
            )}

            {/* Level Progress Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--muted-soft)]">XP Progress</span>
                <span className="text-[var(--green)] font-bold num-font">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ background: 'var(--green)', width: `${Math.min(100, (user.xp / (user.nextLevelXp || 100)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Avatar Picker Section */}
        {showAvatarPicker && (
          <div className="mt-6 pt-6 border-t border-[var(--hairline)]/50 animate-fadeIn">
            <AvatarPicker onSelect={() => setShowAvatarPicker(false)} />
          </div>
        )}
      </div>

      {/* 4 Stat Cards moved from Dashboard to Profile Page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Stat 1: Current Streak */}
        <div className="claude-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <p className="text-[10px] text-[var(--muted-claude)] font-mono uppercase tracking-wider">Current Streak</p>
            <h3 className="text-3xl font-extrabold text-[var(--ink)] num-font flex items-baseline gap-1">
              <span>{computedStats.heatmapStreak || user.currentStreak}</span>
              <span className="text-xs text-[var(--green)] font-normal font-sans">days</span>
            </h3>
            <p className="text-[10px] text-[var(--green)] font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/30 fire-animated" />
              <span>Active streak</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Flame className="w-7 h-7 fire-animated text-white" />
          </div>
        </div>

        {/* Stat 2: Longest Streak */}
        <div className="claude-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[var(--muted-claude)] font-mono uppercase tracking-wider">Longest Streak</p>
            <h3 className="text-3xl font-extrabold text-[var(--ink)] num-font flex items-baseline gap-1">
              <span>{user.longestStreak}</span>
              <span className="text-xs text-[var(--green)] font-normal font-sans">days</span>
            </h3>
            <p className="text-[10px] text-[var(--green)] font-medium">🏆 Personal record</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stat 3: Consistency Rate */}
        <div className="claude-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[var(--muted-claude)] font-mono uppercase tracking-wider">Consistency</p>
            <h3 className="text-3xl font-extrabold text-[var(--ink)] num-font">
              {computedStats.successRate || user.successRate}%
            </h3>
            <p className="text-[10px] text-[var(--green)] font-medium">🎯 Performance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stat 4: Total XP & Level */}
        <div className="claude-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-[var(--muted-claude)] font-mono uppercase tracking-wider">Level {user.level}</p>
            <h3 className="text-2xl font-extrabold text-[var(--ink)] num-font">
              {user.xp} <span className="text-xs text-[var(--muted-soft)] font-sans">/ 2,000 XP</span>
            </h3>
            <div className="w-full h-2 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(user.xp / (user.nextLevelXp || 2000)) * 100}%`, background: 'var(--green)' }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
