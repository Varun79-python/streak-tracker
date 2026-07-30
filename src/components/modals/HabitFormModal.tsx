'use client';

import React, { useState, useEffect } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Plus, Save, Trash2, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export const HabitFormModal: React.FC = () => {
  const { 
    showAddHabitModal, 
    setShowAddHabitModal, 
    editingHabit, 
    setEditingHabit, 
    addNewHabit, 
    updateHabit, 
    deleteHabit 
  } = useStreak();

  const isEditing = !!editingHabit;
  const isOpen = showAddHabitModal || isEditing;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(true);
  const [icon, setIcon] = useState('⚡');
  const [color, setColor] = useState('#22C55E');
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || '');
      setRequired(editingHabit.required);
      setIcon(editingHabit.icon);
      setColor(editingHabit.color);
      setReminderTime(editingHabit.reminderTime || '20:00');
    } else {
      setName('');
      setDescription('');
      setRequired(true);
      setIcon('⚡');
      setColor('#22C55E');
      setReminderTime('20:00');
    }
  }, [editingHabit, showAddHabitModal]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowAddHabitModal(false);
    setEditingHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editingHabit) {
      updateHabit(editingHabit.id, {
        name,
        description,
        required,
        icon,
        color,
        reminderTime,
      });
    } else {
      addNewHabit({
        name,
        description,
        required,
        active: true,
        icon,
        color,
        reminderTime,
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingHabit) {
      deleteHabit(editingHabit.id);
      handleClose();
    }
  };

  const icons = ['🧠', '🔒', '💪', '📖', '🧘', '🚫', '🥗', '🌅', '💻', '🎯', '🚀', '⚡', '🏆', '💎', '🔥'];
  const colors = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/30 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg claude-glass-modal p-6 rounded-3xl shadow-2xl space-y-5 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--muted-soft)] hover:text-[var(--body)] claude-btn-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: 'var(--green)', borderRadius: '12px' }}
          >
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 
              className="font-bold text-[var(--ink)] text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {isEditing ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            <p className="text-xs text-[var(--muted-claude)] font-mono">Define daily routine parameters & streak requirements.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--muted-claude)]">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full claude-input rounded-xl px-4 py-2.5 text-sm text-[var(--body)] focus:border-[var(--green)]"
              placeholder="e.g. Read 20 Pages"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--muted-claude)]">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full claude-input rounded-xl px-4 py-2.5 text-sm text-[var(--body)] focus:border-[var(--green)]"
              placeholder="e.g. Focus on non-fiction books"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted-claude)]">Streak Requirement</label>
              <select
                value={required ? 'required' : 'optional'}
                onChange={(e) => setRequired(e.target.value === 'required')}
                className="w-full claude-input rounded-xl px-3 py-2.5 text-xs text-[var(--body)] focus:border-[var(--green)] font-mono"
              >
                <option value="required">Required for Streak 🔥</option>
                <option value="optional">Optional Bonus Habit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted-claude)]">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full claude-input rounded-xl px-3 py-2 text-xs text-[var(--body)] focus:border-[var(--green)] font-mono"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-claude)]">Choose Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-transform cursor-pointer ${
                    icon === ic
                      ? 'border-[var(--green)] scale-110'
                      : 'claude-card-soft hover:shadow-md'
                  }`}
                  style={icon === ic ? { background: 'var(--green)', borderRadius: '12px' } : undefined}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--hairline)]">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                style={{ background: 'var(--error)', borderRadius: '9999px' }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              style={{ background: 'var(--green)', borderRadius: '9999px' }}
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Habit Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
