'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Settings, Moon, Sun, Monitor, Shield, Download, Trash2, User } from 'lucide-react';
import { AvatarPicker } from '../AvatarPicker';

export const SettingsView: React.FC = () => {
  const { user, updateUserProfile, theme, setTheme, resetAllData, history, habits } = useStreak();

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, habits, history }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `streakify_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#141413] flex items-center gap-2.5">
          <div className="p-2" style={{ background: '#5db8a6', borderRadius: '12px' }}>
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span>Application Settings</span>
        </h2>
        <p className="text-xs text-[#8e8b82] font-mono">Manage account preferences, visual themes, notifications, and data backups.</p>
      </div>

      {/* Section 1: Appearance Theme */}
      <div className="claude-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#cc785c]" />
          <span>Appearance & Theme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Dark Mode */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl text-left space-y-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'claude-card border-2 border-[#e8a55a]'
                : 'claude-btn-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-5 h-5 text-[#cc785c]" />
              {theme === 'dark' && <span className="text-[10px] font-mono text-[#e8a55a] font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-[#141413]">Midnight Dark</h4>
            <p className="text-xs text-[#8e8b82]">Deep slate dark mode (#0B0F19)</p>
          </button>

          {/* AMOLED Black */}
          <button
            onClick={() => setTheme('amoled')}
            className={`p-4 rounded-2xl text-left space-y-2 transition-all cursor-pointer ${
              theme === 'amoled'
                ? 'claude-card border-2 border-[#e8a55a]'
                : 'claude-btn-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <Monitor className="w-5 h-5 text-[#e8a55a]" />
              {theme === 'amoled' && <span className="text-[10px] font-mono text-[#e8a55a] font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-[#141413]">AMOLED Pitch Black</h4>
            <p className="text-xs text-[#8e8b82]">Pure black background (#000000)</p>
          </button>

          {/* Light Mode */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl text-left space-y-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'claude-card border-2 border-[#e8a55a]'
                : 'claude-btn-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-[#e8a55a]" />
              {theme === 'light' && <span className="text-[10px] font-mono text-[#e8a55a] font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-[#141413]">Clean Light</h4>
            <p className="text-xs text-[#8e8b82]">High contrast bright theme</p>
          </button>
        </div>
      </div>

      {/* Section 2: General Profile Settings */}
      <div className="claude-card p-6 rounded-3xl space-y-6">
        <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
          <User className="w-4 h-4 text-[#cc785c]" />
          <span>General Profile Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#6c6a64]">Display Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUserProfile({ name: e.target.value })}
              className="w-full claude-input rounded-xl px-4 py-2.5 text-sm text-[#3d3d3a]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#6c6a64]">Email Address</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUserProfile({ email: e.target.value })}
              className="w-full claude-input rounded-xl px-4 py-2.5 text-sm text-[#3d3d3a]"
            />
          </div>
        </div>

        {/* Avatar Picker Component embedded directly in Settings */}
        <div className="pt-4 border-t border-[#e6dfd8]/40">
          <AvatarPicker />
        </div>
      </div>

      {/* Section 3: Data & Export */}
      <div className="claude-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#cc785c]" />
          <span>Data Privacy & Backup</span>
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div>
            <h4 className="text-sm font-semibold text-[#141413]">Export All Activity Data</h4>
            <p className="text-xs text-[#8e8b82]">Download a JSON backup file containing your habits, streaks, and journal notes.</p>
          </div>

          <button
            onClick={exportJSON}
            className="claude-btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-[#3d3d3a] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <div className="p-1" style={{ background: '#5db8a6', borderRadius: '12px' }}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <span>Export JSON</span>
          </button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#e6dfd8]/40">
          <div>
            <h4 className="text-sm font-semibold text-[#c64545]">Reset Local Account Data</h4>
            <p className="text-xs text-[#8e8b82]">Wipe local storage and re-initialize seed history.</p>
          </div>

          <button
            onClick={resetAllData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
            style={{ background: '#c64545' }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
