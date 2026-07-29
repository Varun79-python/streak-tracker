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
          <h2 className="text-2xl font-bold text-[#3D3D3D] flex items-center gap-2.5">
            <div className="clay-icon gradient-teal p-2">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <span>Habits & Questions Management</span>
          </h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            Customize your daily check-in questions, set required habits, and manage active routines.
          </p>
        </div>

        <button
          onClick={() => setShowAddHabitModal(true)}
          className="gradient-coral px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
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
            className="neu-card p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4 transition-colors"
          >
            {/* Icon & Info */}
            <div className="flex items-center gap-4">
              <div className="neu-pressed w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                {habit.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#3D3D3D] text-base">{habit.name}</h3>
                  {habit.required ? (
                    <span className="clay-badge text-[10px] px-2 py-0.5 gradient-lavender text-white font-mono">
                      Required
                    </span>
                  ) : (
                    <span className="clay-badge text-[10px] px-2 py-0.5 neu-pressed text-[#9A9A9A] font-mono">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9A9A9A] max-w-md">{habit.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Actions & Toggles */}
            <div className="flex items-center gap-4">
              {/* Required Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { required: !habit.required })}
                className={`neu-btn text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                  habit.required ? 'gradient-lavender text-white' : 'text-[#6B6B6B]'
                }`}
              >
                <span>Required:</span>
                <span className={habit.required ? 'font-bold' : 'text-[#9A9A9A]'}>
                  {habit.required ? 'YES' : 'NO'}
                </span>
              </button>

              {/* Active Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { active: !habit.active })}
                className={`neu-btn text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                  habit.active ? 'gradient-teal text-white' : 'text-[#C47C7C]'
                }`}
              >
                <span>Active:</span>
                <span className={habit.active ? 'font-bold' : 'font-bold'}>
                  {habit.active ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Edit */}
              <button
                onClick={() => setEditingHabit(habit)}
                className="neu-btn p-2 rounded-xl text-[#9A9A9A] hover:text-[#7C9EB2] transition-colors cursor-pointer"
                title="Edit Habit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteHabit(habit.id)}
                className="neu-btn p-2 rounded-xl text-[#9A9A9A] hover:text-[#C47C7C] transition-colors cursor-pointer"
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
