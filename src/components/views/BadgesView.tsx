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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-purple-400" />
            <span>Badges & Trophies Showcase</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Earn prestigious badges for extreme dedication, consistency, and early rising.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['all', 'unlocked', 'locked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl border capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
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
            className={`glass-panel p-6 rounded-3xl border text-center space-y-3 transition-all relative overflow-hidden group ${
              badge.unlocked ? 'border-purple-500/30' : 'border-white/10 opacity-50 grayscale'
            }`}
          >
            {/* Rarity Tag */}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 font-mono inline-block">
              {badge.rarity}
            </span>

            {/* Icon hexagon card */}
            <div 
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:rotate-6"
              style={{
                backgroundColor: badge.unlocked ? `${badge.glowColor}20` : '#1e293b',
                border: `1px solid ${badge.unlocked ? badge.glowColor : 'rgba(255,255,255,0.1)'}`,
                boxShadow: badge.unlocked ? `0 0 20px ${badge.glowColor}40` : 'none'
              }}
            >
              <span>{badge.icon}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white tracking-tight">{badge.title}</h3>
              <p className="text-[11px] text-slate-400 leading-snug">{badge.description}</p>
            </div>

            {badge.unlockedDate && (
              <p className="text-[10px] text-purple-400 font-mono pt-1">
                Earned: {badge.unlockedDate}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
