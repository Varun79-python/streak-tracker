'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { BookOpen, Search, Plus, Calendar, Tag, Smile, Frown, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const JournalView: React.FC = () => {
  const { history, saveJournalEntry } = useStreak();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');

  // Collect entries with journal notes
  const journalEntries = Object.values(history).filter(
    (item) => item.journal && item.journal.content
  );

  const moodBadges = ['All', 'Happy', 'Productive', 'Focused', 'Tired', 'Neutral', 'Energetic'];

  const filteredEntries = journalEntries.filter((item) => {
    const matchesSearch =
      item.journal?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.journal?.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMoodFilter === 'All' || item.journal?.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Daily Journal & Reflections</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">Record thoughts, mental clarity, and lessons learned on your habit journey.</p>
        </div>
      </div>

      {/* Search & Mood Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500"
          />
        </div>

        {/* Mood Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
          {moodBadges.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMoodFilter(mood)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                selectedMoodFilter === mood
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Timeline List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-white/10 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Journal Entries Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Write a reflection note during your daily check-in to build a timeline of your personal growth!
            </p>
          </div>
        ) : (
          filteredEntries.map((item) => (
            <div
              key={item.date}
              className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">{item.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                    {item.journal?.mood}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Daily Completion: <strong className="text-emerald-400">{item.completionPercentage}%</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{item.journal?.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.journal?.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
