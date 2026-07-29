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
    const colors = ['#D4A574', '#7C9EB2', '#C4A8D4', '#A8C4B8', '#C47C7C'];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D3D3D]/30 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass-modal p-6 rounded-3xl shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowCheckInModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#9A9A9A] hover:text-[#3D3D3D] neu-btn transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Date */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 rounded-2xl gradient-coral flex items-center justify-center clay-icon mx-auto">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#3D3D3D] tracking-tight">Daily Check-in</h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Motivational Quote Banner */}
        <div className="p-3 rounded-xl neu-pressed text-center space-y-1">
          <p className="text-xs text-[#7C9EB2] font-semibold italic">"Discipline today, freedom tomorrow."</p>
          <p className="text-[11px] text-[#9A9A9A] font-mono">Answer all required questions honestly to extend your streak.</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#6B6B6B] font-mono">
            <span>Required Habits Progress</span>
            <span className="text-[#7C9EB2] font-bold">
              {completedRequiredCount} / {requiredHabits.length || activeHabits.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full neu-pressed overflow-hidden">
            <div
              className="h-full gradient-teal transition-all duration-300"
              style={{
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
                    ? 'neu-card-sm border-l-4 border-[#7C9EB2]'
                    : 'neu-card-sm hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#3D3D3D]">{habit.name}</span>
                      {habit.required && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded clay-badge gradient-lavender text-white font-mono">
                          Required
                        </span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-xs text-[#9A9A9A] truncate max-w-xs">{habit.description}</p>
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
                        ? 'gradient-coral text-white font-bold clay-icon'
                        : 'neu-btn text-[#9A9A9A]'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <X className="w-4 h-4 text-[#C5BDB5]" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Daily Reflection Journal */}
        <div className="space-y-2 pt-2 border-t border-[#D5CCC4]">
          <label className="text-xs font-semibold text-[#6B6B6B] flex justify-between">
            <span>Daily Reflection Note (Optional)</span>
            <span className="text-[#9A9A9A] font-mono">Mood: {mood}</span>
          </label>

          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            rows={2}
            className="w-full neu-input rounded-xl p-3 text-xs text-[#3D3D3D] focus:border-[#7C9EB2] transition-colors"
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
                  ? 'gradient-coral text-white clay-badge hover:scale-[1.02] active:scale-[0.98]'
                  : 'neu-btn text-[#C5BDB5] cursor-not-allowed opacity-60'
              }`}
            >
              {canSubmit ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Save Answers & Update Streak 🔥</span>
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
