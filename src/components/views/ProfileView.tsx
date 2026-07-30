'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { User, Flame, Trophy, Calendar, Award, Edit2, Check, Camera, Sparkles } from 'lucide-react';
import { AvatarPicker } from '../AvatarPicker';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, achievements } = useStreak();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [name, setName] = useState(user.name);

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  const handleSaveBio = async () => {
    await updateUserProfile({ bio, name });
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Header Profile Card */}
      <div className="claude-card p-8 rounded-3xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(93, 184, 166, 0.1)' }} />

        <div className="flex items-center gap-6 flex-wrap">
          {/* Avatar Container with Edit Camera Badge */}
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
            <div style={{ borderRadius: '50%' }}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center" style={{ background: '#cc785c' }}>
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 flex-1 min-w-64">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                {isEditingBio ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="claude-input rounded-xl px-3 py-1 text-lg font-bold text-[#3d3d3a]"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-3">
                    <span>{user.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono text-[#141413]" style={{ background: '#5db8a6' }}>
                      Level {user.level}
                    </span>
                  </h2>
                )}
                <p className="text-xs text-[#8e8b82] font-mono">Member since {user.joinedDate || '2025'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="claude-btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold text-[#3d3d3a] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#cc785c]" />
                  <span>{showAvatarPicker ? 'Hide Avatars' : 'Choose Photo'}</span>
                </button>

                <button
                  onClick={() => (isEditingBio ? handleSaveBio() : setIsEditingBio(true))}
                  className="claude-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#6c6a64] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isEditingBio ? <Check className="w-4 h-4 text-[#5db872]" /> : <Edit2 className="w-3.5 h-3.5" />}
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
                className="claude-input w-full rounded-xl p-2.5 text-xs text-[#6c6a64]"
              />
            ) : (
              <p className="text-xs text-[#6c6a64] italic">"{user.bio || 'Keep building daily habits!'}"</p>
            )}

            {/* Level Progress Bar */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8e8b82]">XP Progress</span>
                <span className="text-[#cc785c] font-bold">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(204, 120, 92, 0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ background: '#5db8a6', width: `${Math.min(100, (user.xp / (user.nextLevelXp || 100)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Avatar Picker Section */}
        {showAvatarPicker && (
          <div className="mt-6 pt-6 border-t border-[#e6dfd8]/50 animate-fadeIn">
            <AvatarPicker onSelect={() => setShowAvatarPicker(false)} />
          </div>
        )}
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="claude-card p-5 rounded-2xl text-center space-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: '#cc785c', borderRadius: '12px' }}>
            <Flame className="w-6 h-6 text-[#3d3d3a] fire-animated" />
          </div>
          <h4 className="text-2xl font-extrabold text-[#141413] font-mono">{user.currentStreak}</h4>
          <p className="text-xs text-[#8e8b82] font-mono">Current Streak</p>
        </div>

        <div className="claude-card p-5 rounded-2xl text-center space-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: '#e8a55a', borderRadius: '12px' }}>
            <Trophy className="w-6 h-6 text-[#3d3d3a]" />
          </div>
          <h4 className="text-2xl font-extrabold text-[#141413] font-mono">{user.longestStreak}</h4>
          <p className="text-xs text-[#8e8b82] font-mono">Best Streak</p>
        </div>

        <div className="claude-card p-5 rounded-2xl text-center space-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: '#5db8a6', borderRadius: '12px' }}>
            <Calendar className="w-6 h-6 text-[#3d3d3a]" />
          </div>
          <h4 className="text-2xl font-extrabold text-[#141413] font-mono">{user.totalDays}</h4>
          <p className="text-xs text-[#8e8b82] font-mono">Total Check-ins</p>
        </div>

        <div className="claude-card p-5 rounded-2xl text-center space-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: '#e8a55a', borderRadius: '12px' }}>
            <Award className="w-6 h-6 text-[#3d3d3a]" />
          </div>
          <h4 className="text-2xl font-extrabold text-[#141413] font-mono">{unlockedAchievementsCount}</h4>
          <p className="text-xs text-[#8e8b82] font-mono">Achievements</p>
        </div>
      </div>
    </div>
  );
};
