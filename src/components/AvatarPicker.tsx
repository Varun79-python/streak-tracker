'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Shuffle, Check, Sparkles, Image, RefreshCw, UserCheck } from 'lucide-react';

export const AVATAR_PRESETS = [
  // 3D Robots & Cyber
  { id: 'bot1', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9' },
  { id: 'bot2', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=ffdfbf,ffd5dc,d1d4f9' },
  { id: 'bot3', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Flame&backgroundColor=c0aede,b6e3f4' },
  { id: 'bot4', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber&backgroundColor=ffd5dc,ffdfbf' },
  { id: 'bot5', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zen&backgroundColor=b6e3f4' },
  { id: 'bot6', category: '3D Robots', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nitro&backgroundColor=c0aede' },

  // Adventurers & Characters
  { id: 'adv1', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4' },
  { id: 'adv2', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya&backgroundColor=ffd5dc' },
  { id: 'adv3', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=c0aede' },
  { id: 'adv4', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=ffdfbf' },
  { id: 'adv5', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=d1d4f9' },
  { id: 'adv6', category: 'Adventurers', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&backgroundColor=b6e3f4' },

  // Fun Emojis & Notionists
  { id: 'emo1', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=ffdfbf' },
  { id: 'emo2', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=b6e3f4' },
  { id: 'emo3', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fire&backgroundColor=ffd5dc' },
  { id: 'emo4', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jordan&backgroundColor=c0aede' },
  { id: 'emo5', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Taylor&backgroundColor=ffdfbf' },
  { id: 'emo6', category: 'Fun & Emojis', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Morgan&backgroundColor=b6e3f4' },

  // Retro Pixel Art
  { id: 'pix1', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1' },
  { id: 'pix2', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer' },
  { id: 'pix3', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hero' },
  { id: 'pix4', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Quest' },
  { id: 'pix5', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ninja' },
  { id: 'pix6', category: 'Pixel Art', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Wizard' },

  // Realistic & Curated Portraits
  { id: 'real1', category: 'Portraits', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'real2', category: 'Portraits', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'real3', category: 'Portraits', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'real4', category: 'Portraits', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'real5', category: 'Portraits', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'real6', category: 'Portraits', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
];

export const CATEGORIES = ['All', '3D Robots', 'Adventurers', 'Fun & Emojis', 'Pixel Art', 'Portraits'];

interface AvatarPickerProps {
  onSelect?: (url: string) => void;
  compact?: boolean;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ onSelect, compact = false }) => {
  const { user, updateUserProfile } = useStreak();
  const [activeCategory, setActiveCategory] = useState('All');
  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState(false);

  const selectAvatar = (url: string) => {
    updateUserProfile({ avatar: url });
    if (onSelect) onSelect(url);
  };

  const handleRandomize = () => {
    const styles = ['bottts', 'adventurer', 'fun-emoji', 'pixel-art', 'lorelei', 'notionists', 'big-smile', 'avataaars'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    const bgColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'c1f0c8'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const randomUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}&backgroundColor=${randomBg}`;
    selectAvatar(randomUrl);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    try {
      new URL(customUrl);
      selectAvatar(customUrl.trim());
      setCustomError(false);
    } catch {
      setCustomError(true);
    }
  };

  const filteredAvatars = activeCategory === 'All'
    ? AVATAR_PRESETS
    : AVATAR_PRESETS.filter(a => a.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl" style={{ background: 'var(--green)' }}>
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)]">Choose Profile Picture</h3>
            <p className="text-[11px] text-[var(--muted-claude)]">Select from random presets or generate a unique avatar</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="claude-btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition-all cursor-pointer"
          style={{ background: 'rgba(34, 197, 94, 0.12)' }}
        >
          <Shuffle className="w-3.5 h-3.5 animate-spin-slow" style={{ color: 'var(--green)' }} />
          <span>🎲 Randomize Avatar</span>
        </button>
      </div>

      {/* Category Pills */}
      {!compact && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'shadow-sm font-bold text-[var(--ink)]'
                  : 'claude-btn-secondary text-[var(--muted-claude)] hover:text-[var(--ink)]'
              }`}
              style={activeCategory === cat ? { background: 'var(--green)' } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Avatar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-1 pr-2 no-scrollbar">
        {filteredAvatars.map((item) => {
          const isSelected = user.avatar === item.url;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectAvatar(item.url)}
              className={`relative group p-1.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center ${
                isSelected
                  ? 'scale-105'
                  : 'claude-card hover:scale-105'
              }`}
              style={isSelected
                ? { background: 'rgba(34, 197, 94, 0.08)', color: 'var(--green)', boxShadow: '0 0 0 2px var(--green)' }
                : undefined
              }
            >
              <img
                src={item.url}
                alt={item.category}
                className="w-12 h-12 rounded-xl object-cover"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md" style={{ background: 'var(--green)' }}>
                  <Check className="w-3 h-3 text-[var(--ink)] stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom URL Option */}
      <form onSubmit={handleCustomSubmit} className="pt-2 border-t flex items-center gap-2" style={{ borderColor: 'rgba(34, 197, 94, 0.12)' }}>
        <div className="relative flex-1">
          <Image className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-soft)' }} />
          <input
            type="url"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setCustomError(false);
            }}
            placeholder="Paste custom image URL..."
            className={`w-full claude-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] ${
              customError ? 'border-red-400' : ''
            }`}
          />
        </div>
        <button
          type="submit"
          className="claude-btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--ink)] transition-colors cursor-pointer"
          style={{ color: 'var(--green)' }}
        >
          Apply
        </button>
      </form>
      {customError && <p className="text-[10px] text-red-500 font-mono">Please enter a valid HTTP/HTTPS image URL.</p>}
    </div>
  );
};
