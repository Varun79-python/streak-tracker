'use client';

import React, { useState } from 'react';
import { useStreak, ADMIN_SECRET_KEY } from '@/lib/StreakContext';
import { UserCredential } from '@/lib/types';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminView: React.FC = () => {
  const { 
    credentials, 
    createManagedUser, 
    updateManagedUser, 
    deleteManagedUser, 
    isAdminUnlocked, 
    verifyAndUnlockAdmin 
  } = useStreak();

  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');

  // Create User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creationSuccess, setCreationSuccess] = useState('');

  // Editing User Credential State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const handleAdminUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAndUnlockAdmin(inputKey);
    if (!success) {
      setKeyError('Invalid Secret Key. Access Denied.');
    } else {
      setKeyError('');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    createManagedUser(newName, newEmail, newPassword);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setCreationSuccess('User account provisioned successfully! Credentials are ready for login.');
    setTimeout(() => setCreationSuccess(''), 4000);
  };

  const startEdit = (user: UserCredential) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword(user.password);
  };

  const saveEdit = (id: string) => {
    updateManagedUser(id, {
      name: editName,
      email: editEmail,
      password: editPassword,
    });
    setEditingUserId(null);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // If Admin Key is not unlocked yet, display Secret Key Entry Gate
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 select-none">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto glow-green">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Protected Admin Access</h2>
          <p className="text-xs text-slate-400 font-mono">
            Enter your secret master key to unlock user account provisioning and access control.
          </p>
        </div>

        <form onSubmit={handleAdminUnlockSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 font-mono">Master Key</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter secret key..."
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {keyError && (
            <p className="text-xs text-rose-400 font-mono bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {keyError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green cursor-pointer"
          >
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Admin User Provisioning & Credentials Control</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Only admin-created IDs & passwords can log into the application. Immediate updates are synced directly to database.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{credentials.length} Provisioned Accounts</span>
        </div>
      </div>

      {/* Admin Key Reminder Alert */}
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Active Secret Key:</span>
          <code className="text-emerald-300 font-bold bg-slate-950 px-2 py-1 rounded border border-white/10 select-all">
            {ADMIN_SECRET_KEY}
          </code>
        </div>
        <span className="text-slate-400 text-[11px]">🔐 Admin Authorization Verified</span>
      </div>

      {/* Grid: Create User Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create User Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Create New User Access</h3>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">User Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">User Email / Login ID</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. alex@company.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Assign secure password..."
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 font-mono"
              />
            </div>

            {creationSuccess && (
              <p className="text-xs text-emerald-300 bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/40 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{creationSuccess}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Generate & Grant User Credentials</span>
            </button>
          </form>
        </div>

        {/* Existing Users Table */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Manage User Credentials & Passwords</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Changes sync immediately</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {credentials.map((userCredential) => {
              const isEditing = editingUserId === userCredential.id;
              const showPass = showPasswordMap[userCredential.id];

              return (
                <div
                  key={userCredential.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEditing
                      ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400">Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400">Email / ID</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400">New Password</label>
                        <input
                          type="text"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(userCredential.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes Immediately
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-sans">{userCredential.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            userCredential.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {userCredential.role.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-slate-400 text-xs">Email/ID: <strong className="text-slate-200">{userCredential.email}</strong></p>

                        <div className="flex items-center gap-2 pt-1 text-slate-400 text-xs">
                          <span>Password:</span>
                          <span className="text-emerald-400 font-bold">
                            {showPass ? userCredential.password : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(userCredential.id)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit Credentials */}
                        <button
                          onClick={() => startEdit(userCredential)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                          title="Edit Credentials"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit
                        </button>

                        {/* Delete User */}
                        {userCredential.role !== 'admin' && (
                          <button
                            onClick={() => deleteManagedUser(userCredential.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
