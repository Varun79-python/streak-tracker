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
          <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-2.5">
            <div className="p-2" style={{ background: '#5db8a6', borderRadius: '12px' }}>
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <span>Habits & Questions Management</span>
          </h2>
          <p className="text-xs text-[#8e8b82] font-mono">
            Customize your daily check-in questions, set required habits, and manage active routines.
          </p>
        </div>

        <button
          onClick={() => setShowAddHabitModal(true)}
          className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          style={{ background: '#cc785c' }}
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
            className="claude-card p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4 transition-colors"
          >
            {/* Icon & Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(204, 120, 92, 0.08)' }}>
                {habit.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#141413] text-base">{habit.name}</h3>
                  {habit.required ? (
                    <span className="text-[10px] px-2 py-0.5 font-mono text-white" style={{ borderRadius: '9999px', background: '#e8a55a' }}>
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 font-mono text-[#8e8b82]" style={{ borderRadius: '9999px', background: 'rgba(204, 120, 92, 0.08)' }}>
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8e8b82] max-w-md">{habit.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Actions & Toggles */}
            <div className="flex items-center gap-4">
              {/* Required Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { required: !habit.required })}
                className={`claude-btn-secondary text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                  habit.required ? 'text-white' : 'text-[#6c6a64]'
                }`}
                style={habit.required ? { background: '#e8a55a' } : {}}
              >
                <span>Required:</span>
                <span className={habit.required ? 'font-bold' : 'text-[#8e8b82]'}>
                  {habit.required ? 'YES' : 'NO'}
                </span>
              </button>

              {/* Active Toggle */}
              <button
                onClick={() => updateHabit(habit.id, { active: !habit.active })}
                className={`claude-btn-secondary text-xs font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                  habit.active ? 'text-white' : 'text-[#c64545]'
                }`}
                style={habit.active ? { background: '#5db8a6' } : {}}
              >
                <span>Active:</span>
                <span className={habit.active ? 'font-bold' : 'font-bold'}>
                  {habit.active ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Edit */}
              <button
                onClick={() => setEditingHabit(habit)}
                className="claude-btn-secondary p-2 rounded-xl text-[#8e8b82] hover:text-[#cc785c] transition-colors cursor-pointer"
                title="Edit Habit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteHabit(habit.id)}
                className="claude-btn-secondary p-2 rounded-xl text-[#8e8b82] hover:text-[#c64545] transition-colors cursor-pointer"
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
