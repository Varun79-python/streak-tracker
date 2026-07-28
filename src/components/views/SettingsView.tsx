'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Settings, Moon, Sun, Monitor, Bell, Shield, Download, RefreshCw, Trash2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, setUser, theme, setTheme, resetAllData, history, habits } = useStreak();

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
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Application Settings</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">Manage account preferences, visual themes, notifications, and data backups.</p>
      </div>

      {/* Section 1: Appearance Theme */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-emerald-400" />
          <span>Appearance & Theme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Dark Mode */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-emerald-500/15 border-emerald-500 text-white glow-green'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-5 h-5 text-emerald-400" />
              {theme === 'dark' && <span className="text-[10px] font-mono text-emerald-400 font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-slate-100">Midnight Dark</h4>
            <p className="text-xs text-slate-400">Deep slate dark mode (#0B0F19)</p>
          </button>

          {/* AMOLED Black */}
          <button
            onClick={() => setTheme('amoled')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
              theme === 'amoled'
                ? 'bg-emerald-500/15 border-emerald-500 text-white glow-green'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Monitor className="w-5 h-5 text-indigo-400" />
              {theme === 'amoled' && <span className="text-[10px] font-mono text-indigo-400 font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-slate-100">AMOLED Pitch Black</h4>
            <p className="text-xs text-slate-400">Pure black background (#000000)</p>
          </button>

          {/* Light Mode */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-emerald-500/15 border-emerald-500 text-white glow-green'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-amber-400" />
              {theme === 'light' && <span className="text-[10px] font-mono text-amber-400 font-bold">Active</span>}
            </div>
            <h4 className="font-bold text-sm text-slate-100">Clean Light</h4>
            <p className="text-xs text-slate-400">High contrast bright theme</p>
          </button>
        </div>
      </div>

      {/* Section 2: General Profile Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">General Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Display Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Data & Export */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Data Privacy & Backup</span>
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Export All Activity Data</h4>
            <p className="text-xs text-slate-400">Download a JSON backup file containing your habits, streaks, and journal notes.</p>
          </div>

          <button
            onClick={exportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export JSON</span>
          </button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-rose-400">Reset Local Account Data</h4>
            <p className="text-xs text-slate-400">Wipe local storage and re-initialize seed history.</p>
          </div>

          <button
            onClick={resetAllData}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
