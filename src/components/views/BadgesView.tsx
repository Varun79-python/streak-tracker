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
          <h2 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
            <div className="p-2" style={{ background: 'var(--green)', borderRadius: '12px' }}>
              <Award className="w-5 h-5 text-white" />
            </div>
            <span>Badges & Trophies Showcase</span>
          </h2>
          <p className="text-xs text-[var(--muted-soft)] font-mono">
            Earn prestigious badges for extreme dedication, consistency, and early rising.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['all', 'unlocked', 'locked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer claude-btn-secondary ${
                filter === tab
                  ? 'font-bold'
                  : 'text-[var(--muted-soft)] hover:text-[var(--body)]'
              }`}
              style={filter === tab ? { background: 'rgba(34, 197, 94, 0.08)', color: 'var(--green)', borderColor: 'var(--green)' } : {}}
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
                ? 'claude-card'
                : 'opacity-50 grayscale'
            }`}
            style={!badge.unlocked ? { background: 'rgba(34, 197, 94, 0.08)' } : {}}
          >
            {/* Rarity Tag */}
            <span className="text-[10px] px-2 py-0.5 text-[var(--muted-soft)] font-mono inline-block" style={{ borderRadius: '9999px', background: 'var(--surface-soft)', border: '1px solid var(--hairline)' }}>
              {badge.rarity}
            </span>

            {/* Icon hexagon card */}
            {badge.unlocked ? (
              <div className="w-16 h-16 mx-auto flex items-center justify-center text-3xl transition-transform group-hover:rotate-6" style={{ background: 'var(--green)', borderRadius: '12px' }}>
                <span>{badge.icon}</span>
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto flex items-center justify-center text-3xl transition-transform group-hover:rotate-6" style={{ background: 'rgba(34, 197, 94, 0.08)', borderRadius: '12px' }}>
                <span>{badge.icon}</span>
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[var(--ink)] tracking-tight">{badge.title}</h3>
              <p className="text-[11px] text-[var(--muted-soft)] leading-snug">{badge.description}</p>
            </div>

            {badge.unlockedDate && (
              <p className="text-[10px] text-[var(--green)] font-mono pt-1">
                Earned: {badge.unlockedDate}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
