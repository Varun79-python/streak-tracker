'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { HeatmapGraph } from '../HeatmapGraph';
import { MotivationCard } from '../MotivationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Trophy,
  Target,
  Calendar as CalendarIcon,
  Zap,
  TrendingUp,
  CheckCircle2, 
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    history, 
    habits, 
    setShowCheckInModal, 
    setSelectedDayDetailsDate,
    setActiveView,
    toggleHabitCompletion
  } = useStreak();

  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayCheckIn = history[todayStr];

  const activeHabits = habits.filter(h => h.active);
  const completedTodayCount = todayCheckIn?.completedHabits?.length || 0;
  const isTodayComplete = todayCheckIn?.completed || false;


  // Derive recent activity from actual history
  const recentActivity = useMemo(() => {
    const entries = Object.entries(history)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice(0, 5);

    if (entries.length === 0) return [];

    return entries.map(([date, checkIn]) => {
      const isToday = date === todayStr;
      const displayDate = isToday
        ? 'Today'
        : format(new Date(date + 'T00:00:00'), 'MMM d');

      const completedCount = checkIn.completedHabits?.length || 0;
      const pct = checkIn.completionPercentage || 0;

      if (checkIn.completed) {
        return {
          id: date,
          icon: <Flame className="w-4 h-4 text-[var(--green)]" />,
          label: `All habits done — ${completedCount}/${completedCount} completed`,
          time: displayDate,
        };
      }
      return {
        id: date,
        icon: <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />,
        label: `${completedCount} habits checked in (${pct}%)`,
        time: displayDate,
      };
    });
  }, [history, todayStr]);

  return (
    <div className="space-y-6 select-none">

      {/* Motivation Section */}
      <MotivationCard />

      {/* Main Heatmap Matrix Widget */}
      <div className="claude-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
              <span>Contribution Heatmap</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono text-white" style={{ borderRadius: '9999px', background: 'var(--green)' }}>
                365 Days
              </span>
            </h3>
            <p className="text-xs text-[var(--muted-claude)] font-mono">Every square represents a step toward mastery.</p>
          </div>

          <button
            onClick={() => setActiveView('heatmap')}
            className="px-4 py-2 text-xs text-[var(--muted-claude)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xl claude-btn-secondary"
          >
            <span>Full View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <HeatmapGraph
          history={history}
          onDayClick={(dateStr) => setSelectedDayDetailsDate(dateStr)}
        />
      </div>

      {/* Middle Grid: Today's Habits Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Habit Preview */}
        <div className="lg:col-span-7 claude-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">Today's Habits</h3>
              <p className="text-xs text-[var(--muted-claude)] font-mono">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>

            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderRadius: '9999px', background: 'var(--green)' }}
            >
              <span>{isTodayComplete ? 'Edit Check-in' : 'Check-in'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeHabits.length === 0 ? (
              <div className="p-8 rounded-2xl text-center space-y-3" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto" style={{ borderRadius: '12px', background: 'var(--green)' }}>
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">No habits yet</p>
                  <p className="text-xs text-[var(--muted-claude)] mt-1">Create your first habit to start tracking.</p>
                </div>
                <button
                  onClick={() => setActiveView('habits')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-xs transition-all cursor-pointer hover:scale-[1.02]"
                  style={{ borderRadius: '9999px', background: 'var(--green)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create a Habit</span>
                </button>
              </div>
            ) : (
              activeHabits.slice(0, 5).map((habit) => {
                const isDone = todayCheckIn?.completedHabits?.includes(habit.id);
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isDone
                        ? 'border-l-4 border-[var(--green)]'
                        : 'claude-card-soft hover:shadow-lg'
                    }`}
                    style={isDone ? { background: 'rgba(34, 197, 94, 0.08)' } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-[var(--ink)]">{habit.name}</p>
                        <p className="text-[10px] text-[var(--muted-soft)]">{habit.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHabitCompletion(habit.id);
                      }}
                      className={`text-[10px] font-mono px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                        isDone ? 'text-white font-bold' : 'text-[var(--muted-soft)]'
                      }`}
                      style={isDone 
                        ? { background: 'var(--green)' } 
                        : { background: 'rgba(34, 197, 94, 0.08)' }
                      }
                    >
                      {isDone ? '✓ Done' : 'Pending'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 claude-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ borderRadius: '12px', background: 'var(--green)' }}>
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span>Recent Activity</span>
            </h3>

            <button
              onClick={() => setActiveView('activity')}
              className="text-xs text-[var(--green)] hover:underline cursor-pointer font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {recentActivity.length === 0 ? (
              <div className="p-6 rounded-2xl text-center space-y-2" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                <Clock className="w-8 h-8 text-[var(--hairline)] mx-auto" />
                <p className="text-[var(--muted-soft)] text-xs">No activity yet</p>
                <p className="text-[var(--hairline)] text-[10px]">Complete your first check-in to see activity here.</p>
              </div>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 claude-card-soft flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {entry.icon}
                    <span className="text-[var(--body)] text-[11px]">{entry.label}</span>
                  </div>
                  <span className="text-[var(--muted-soft)] text-[10px]">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Bottom Card: How to Use Streakify */}
      <div className="claude-card border-l-4 border-[var(--green)] overflow-hidden transition-all">
        <button
          onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
          className="w-full p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-[var(--surface-soft)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ borderRadius: '12px', background: 'var(--green)' }}>
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <span>How to Use Streakify</span>
              </h3>
              <p className="text-xs text-[var(--muted-claude)] font-mono">
                {isHowToUseOpen ? 'Click to collapse guide' : 'Click down arrow to view step-by-step guide'}
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl border border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--ink)] flex items-center justify-center transition-transform duration-300 hover:scale-105">
            {isHowToUseOpen ? <ChevronUp className="w-5 h-5 text-[var(--green)]" /> : <ChevronDown className="w-5 h-5 text-[var(--green)]" />}
          </div>
        </button>

        <AnimatePresence>
          {isHowToUseOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="px-6 pb-6 pt-2 border-t border-[var(--hairline)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
                <div className="p-4 rounded-2xl claude-card-soft space-y-2 border border-[var(--hairline)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-xl text-white" style={{ background: 'var(--green)' }}>Step 1</span>
                    <span className="text-lg">🎯</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">Check-in Daily</h4>
                  <p className="text-xs text-[var(--muted-soft)] leading-relaxed">
                    Click <strong>Daily Check-in</strong> or click directly on any habit in <strong>Today's Habits</strong> list to toggle it <strong>✓ Done</strong> instantly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl claude-card-soft space-y-2 border border-[var(--hairline)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-xl text-white" style={{ background: 'var(--green)' }}>Step 2</span>
                    <span className="text-lg">🟩</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">Build Contribution Matrix</h4>
                  <p className="text-xs text-[var(--muted-soft)] leading-relaxed">
                    Every day you complete required habits fills a square in your <strong>Contribution Grid</strong> green — just like GitHub!
                  </p>
                </div>

                <div className="p-4 rounded-2xl claude-card-soft space-y-2 border border-[var(--hairline)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-xl text-white" style={{ background: 'var(--green)' }}>Step 3</span>
                    <span className="text-lg">❄️</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">Protect Streaks on Rest Days</h4>
                  <p className="text-xs text-[var(--muted-soft)] leading-relaxed">
                    Taking a planned break? Active <strong>Streak Freezes</strong> turn contribution tiles cyan so your streak is never broken.
                  </p>
                </div>

                <div className="p-4 rounded-2xl claude-card-soft space-y-2 border border-[var(--hairline)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-xl text-white" style={{ background: 'var(--green)' }}>Step 4</span>
                    <span className="text-lg">🏆</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">Track Level & Achievements</h4>
                  <p className="text-xs text-[var(--muted-soft)] leading-relaxed">
                    Visit <strong>My Profile</strong> to view your total XP, current level progression, and unlockable achievement badges.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
