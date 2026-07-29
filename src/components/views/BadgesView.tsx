'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Award, Shield, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const BadgesView: React.FC = () => {
  const { badges } = useStreak();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <div className="clay-icon gradient-lavender p-2">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span>Badges & Trophies Showcase</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            Earn prestigious badges for extreme dedication, consistency, and early rising.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['all', 'unlocked', 'locked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'neu-btn font-bold text-[#C4A8D4]'
                  : 'neu-btn text-[#9A9A9A] hover:text-[#3D3D3D]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, y: -4 }}
            className={`p-6 rounded-3xl text-center space-y-3 transition-all relative overflow-hidden group ${
              badge.unlocked
                ? 'neu-card border border-[#C4A8D4]'
                : 'neu-pressed opacity-50 grayscale'
            }`}
          >
            {/* Rarity Tag */}
            <span className="clay-badge text-[10px] px-2 py-0.5 text-[#9A9A9A] font-mono inline-block">
              {badge.rarity}
            </span>

            {/* Icon hexagon card */}
            {badge.unlocked ? (
              <div className="clay-icon gradient-lavender w-16 h-16 mx-auto flex items-center justify-center text-3xl transition-transform group-hover:rotate-6">
                <span>{badge.icon}</span>
              </div>
            ) : (
              <div className="neu-pressed w-16 h-16 mx-auto flex items-center justify-center text-3xl transition-transform group-hover:rotate-6">
                <span>{badge.icon}</span>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#3D3D3D] tracking-tight">{badge.title}</h3>
              <p className="text-[11px] text-[#9A9A9A] leading-snug">{badge.description}</p>
            </div>

            {badge.unlockedDate && (
              <p className="text-[10px] text-[#C4A8D4] font-mono pt-1">
                Earned: {badge.unlockedDate}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
