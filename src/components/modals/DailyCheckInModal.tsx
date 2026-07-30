'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { format } from 'date-fns';
import { X, Check, HelpCircle, Sparkles, Flame, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Built-in Lightweight Particle Confetti Trigger
function fireConfetti() {
  if (typeof window === 'undefined') return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fixed z-50 pointer-events-none rounded-full';
    const colors = ['var(--green)', 'var(--green)', 'var(--green)', 'var(--green)', '#c64545'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.left = `${Math.random() * 80 + 10}vw`;
    el.style.top = '30vh';
    el.style.opacity = '1';
    el.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 400}px, ${Math.random() * 300 + 100}px) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    }, 20);

    setTimeout(() => {
      el.remove();
    }, 1300);
  }
}

export const DailyCheckInModal: React.FC = () => {
  const { 
    showCheckInModal, 
    setShowCheckInModal, 
    habits, 
    submitDailyCheckIn,
    history
  } = useStreak();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayCheckIn = history[todayStr];

  // Pre-fill completed habits if existing
  const [completedHabits, setCompletedHabits] = useState<string[]>(
    todayCheckIn?.completedHabits || []
  );
  const [journalText, setJournalText] = useState(todayCheckIn?.journal?.content || '');
  const [mood, setMood] = useState(todayCheckIn?.journal?.mood || 'Productive');

  if (!showCheckInModal) return null;

  const activeHabits = habits.filter(h => h.active);
  const requiredHabits = activeHabits.filter(h => h.required);
  
  const completedRequiredCount = requiredHabits.filter(h => completedHabits.includes(h.id)).length;
  const allRequiredDone = completedRequiredCount === requiredHabits.length;

  const toggleHabitState = (id: string) => {
    if (completedHabits.includes(id)) {
      setCompletedHabits(completedHabits.filter(item => item !== id));
    } else {
      setCompletedHabits([...completedHabits, id]);
    }
  };

  const handleSave = () => {
    submitDailyCheckIn(completedHabits, journalText, 'Daily Check-in', mood);
    if (allRequiredDone) {
      fireConfetti();
    }
    setShowCheckInModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/30 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg claude-glass-modal p-6 rounded-3xl shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowCheckInModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--muted-soft)] hover:text-[var(--body)] claude-btn-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Date */}
        <div className="text-center space-y-1.5 pt-2">
          <div 
            className="w-12 h-12 flex items-center justify-center mx-auto"
            style={{ background: 'var(--green)', borderRadius: '12px' }}
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h2 
            className="text-2xl font-bold text-[var(--ink)] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Daily Check-in
          </h2>
          <p className="text-xs text-[var(--muted-claude)] font-mono">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Motivational Quote Banner */}
        <div 
          className="p-3 rounded-xl text-center space-y-1"
          style={{ background: 'rgba(34, 197, 94, 0.08)' }}
        >
          <p className="text-xs text-[var(--green)] font-semibold italic">"Discipline today, freedom tomorrow."</p>
          <p className="text-[11px] text-[var(--muted-soft)] font-mono">Answer all required questions honestly to extend your streak.</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[var(--muted-claude)] font-mono">
            <span>Required Habits Progress</span>
            <span className="text-[var(--green)] font-bold">
              {completedRequiredCount} / {requiredHabits.length || activeHabits.length}
            </span>
          </div>
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(34, 197, 94, 0.08)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                background: 'var(--green)',
                width: `${
                  requiredHabits.length > 0
                    ? (completedRequiredCount / requiredHabits.length) * 100
                    : activeHabits.length > 0
                    ? (completedHabits.length / activeHabits.length) * 100
                    : 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Habits Checklist */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {activeHabits.map((habit) => {
            const isDone = completedHabits.includes(habit.id);
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabitState(habit.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                  isDone
                    ? 'claude-card-soft border-l-4 border-[var(--green)]'
                    : 'claude-card-soft hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--ink)]">{habit.name}</span>
                      {habit.required && (
                        <span 
                          className="text-[10px] px-1.5 py-0.2 text-white font-mono"
                          style={{ background: 'var(--green)', borderRadius: '9999px' }}
                        >
                          Required
                        </span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-xs text-[var(--muted-soft)] truncate max-w-xs">{habit.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabitState(habit.id);
                    }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isDone
                        ? 'text-white font-bold'
                        : 'claude-btn-secondary text-[var(--muted-soft)]'
                    }`}
                    style={isDone ? { background: 'var(--green)', borderRadius: '12px' } : undefined}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <X className="w-4 h-4 text-[var(--hairline)]" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Daily Reflection Journal */}
        <div className="space-y-2 pt-2 border-t border-[var(--hairline)]">
          <label className="text-xs font-semibold text-[var(--muted-claude)] flex justify-between">
            <span>Daily Reflection Note (Optional)</span>
            <span className="text-[var(--muted-soft)] font-mono">Mood: {mood}</span>
          </label>

          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            rows={2}
            className="w-full claude-input rounded-xl p-3 text-xs text-[var(--body)] focus:border-[var(--green)] transition-colors"
            placeholder="Write a brief journal note about your focus, thoughts, or wins today..."
          />
        </div>

        {/* Submit Button */}
        {(() => {
          const canSubmit = requiredHabits.length > 0 ? allRequiredDone : completedHabits.length > 0;
          return (
            <button
              onClick={handleSave}
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                canSubmit
                  ? 'text-white hover:scale-[1.02] active:scale-[0.98]'
                  : 'claude-btn-secondary text-[var(--hairline)] cursor-not-allowed opacity-60'
              }`}
              style={canSubmit ? { background: 'var(--green)', borderRadius: '9999px' } : undefined}
            >
              {canSubmit ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="flex items-center gap-1.5">
                    Save Answers & Update Streak
                    <Flame className="w-4 h-4 text-orange-400 fill-orange-400/40 fire-animated" />
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Complete all required questions to save ({completedRequiredCount}/{requiredHabits.length})</span>
                </>
              )}
            </button>
          );
        })()}
      </motion.div>
    </div>
  );
};
