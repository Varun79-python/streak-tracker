'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Sliders, Plus, Edit2, Trash2, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

export const HabitsManagementView: React.FC = () => {
  const { habits, updateHabit, deleteHabit, setShowAddHabitModal, setEditingHabit } = useStreak();

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-emerald-400" />
            <span>Habits & Questions Management</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Customize your daily check-in questions, set required habits, and manage active routines.
          </p>
        </div>

        <button
          onClick={() => setShowAddHabitModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between flex-wrap gap-4 hover:border-white/20 transition-colors"
          >
            {/* Icon & Info */}
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                {habit.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{habit.name}</h3>
                  {habit.required ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-white/10">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 max-w-md">{habit.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Actions & Toggles */}
            <div className="flex items-center gap-4">
              {/* Required Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { required: !habit.required })}
                className="text-xs font-mono px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Required:</span>
                <span className={habit.required ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {habit.required ? 'YES' : 'NO'}
                </span>
              </button>

              {/* Active Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { active: !habit.active })}
                className="text-xs font-mono px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Active:</span>
                <span className={habit.active ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {habit.active ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Edit */}
              <button
                onClick={() => setEditingHabit(habit)}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                title="Edit Habit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteHabit(habit.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete Habit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
