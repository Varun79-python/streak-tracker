'use client';

import React, { useState } from 'react';
import { useStreak, ADMIN_SECRET_KEY } from '@/lib/StreakContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Lock, 
  CheckCircle2,
  Users,
  Pencil,
  X,
  Save,
  Trash2,
  Terminal,
  Server,
  Activity,
  UserCog
} from 'lucide-react';

const ADMIN_ACCENT = '#06b6d4';

export const AdminView: React.FC = () => {
  const { 
    credentials, 
    isAdminUnlocked, 
    verifyAndUnlockAdmin,
    setCredentials,
    user
  } = useStreak();

  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creationSuccess, setCreationSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const handleAdminUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAndUnlockAdmin(inputKey);
    if (!success) {
      setKeyError('Invalid Secret Key. Access Denied.');
    } else {
      setKeyError('');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
          password: newPassword.trim(),
          adminKey: ADMIN_SECRET_KEY,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      await refreshCredentials();
      
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setCreationSuccess('User account created successfully!');
      setTimeout(() => setCreationSuccess(''), 4000);
    } catch (err) {
      setCreationSuccess(`Error: ${err instanceof Error ? err.message : 'Failed to create user'}`);
      setTimeout(() => setCreationSuccess(''), 4000);
    } finally {
      setCreating(false);
    }
  };

  const handlePasswordEdit = async (userId: string) => {
    if (!editPassword.trim()) return;
    try {
      const res = await fetch('/api/auth/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ id: userId, updates: { password: editPassword.trim() } }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordMessage('Password updated successfully!');
      setEditingUserId(null);
      setEditPassword('');
      await refreshCredentials();
    } catch (err) {
      setPasswordMessage(`Error: ${err instanceof Error ? err.message : 'Failed to update password'}`);
    }
    setTimeout(() => setPasswordMessage(''), 4000);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      setDeletingUserId(null);
      setDeleteConfirmName('');
      await refreshCredentials();
    } catch (err) {
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const refreshCredentials = async () => {
    try {
      const res = await fetch('/api/auth/admin/users', {
        headers: { 'Authorization': `Bearer ${ADMIN_SECRET_KEY}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCredentials(data.users || []);
      }
    } catch {
      // Ignore errors
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="max-w-lg mx-auto my-16 select-none">
        <div className="neu-card rounded-2xl overflow-hidden">
          <div className="gradient-teal px-6 py-4 flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#3D3D3D]" />
            <span className="text-[#3D3D3D] font-mono text-xs font-bold tracking-widest uppercase">Secure Admin Terminal</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C47C7C]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4A574]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#A8C4B8]" />
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="clay-icon w-16 h-16 rounded-2xl flex items-center justify-center text-[#7C9EB2] mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-[#3D3D3D] font-mono tracking-wide">Admin Authentication</h2>
              <p className="text-xs text-[#9A9A9A] font-mono">
                Enter the master key to access the administration panel.
              </p>
            </div>

            <form onSubmit={handleAdminUnlockSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#9A9A9A] font-mono tracking-wider uppercase">Master Key</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#C5BDB5]" />
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter secret key..."
                    required
                    className="neu-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono tracking-wider"
                  />
                </div>
              </div>

              {keyError && (
                <p className="text-xs text-[#C47C7C] font-mono gradient-coral/20 p-3 rounded-xl flex items-center gap-2">
                  <X className="w-3.5 h-3.5 text-[#C47C7C]" />
                  {keyError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-coral text-[#3D3D3D] font-bold text-xs transition-all cursor-pointer font-mono tracking-wider uppercase"
              >
                Unlock Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="select-none max-w-5xl mx-auto">
      <div className="neu-card rounded-2xl overflow-hidden">
        <div className="gradient-teal px-6 py-3 flex items-center gap-3">
          <Server className="w-5 h-5 text-[#3D3D3D]" />
          <span className="text-[#3D3D3D] font-mono text-xs font-bold tracking-widest uppercase">Admin Panel</span>
          <div className="ml-3 px-2 py-0.5 rounded bg-[#3D3D3D]/10 text-[#3D3D3D] text-[10px] font-mono">
            v1.0.0
          </div>
          <div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-[#C5BDB5]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#A8C4B8]" />
              <span className="text-[#A8C4B8]">Online</span>
            </span>
            <span className="text-[#C5BDB5]">|</span>
            <span>{user.name || 'Admin'}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#3D3D3D] flex items-center gap-2.5 font-mono tracking-tight">
                <UserCog className="w-6 h-6 text-[#7C9EB2]" />
                <span>User Management</span>
              </h2>
              <p className="text-[11px] text-[#9A9A9A] font-mono">
                Create and manage user accounts. Passwords are bcrypt-hashed at rest.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl gradient-teal text-[#3D3D3D] text-xs font-mono flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-bold">{credentials.length}</span>
              <span className="text-[#3D3D3D]/70">Registered</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 neu-pressed rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#C5BDB5]/30">
                <UserPlus className="w-4 h-4 text-[#7C9EB2]" />
                <h3 className="text-sm font-bold text-[#3D3D3D] font-mono">Create Account</h3>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9A9A9A] font-mono uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    required
                    className="neu-input w-full rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9A9A9A] font-mono uppercase tracking-wider">Email / Login</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. alex@company.com"
                    required
                    className="neu-input w-full rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9A9A9A] font-mono uppercase tracking-wider">Password</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Assign a password..."
                    required
                    className="neu-input w-full rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                {creationSuccess && (
                  <p className="text-[11px] text-[#7C9EB2] gradient-teal/20 p-2.5 rounded-lg font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C9EB2]" />
                    <span>{creationSuccess}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 rounded-lg gradient-coral text-[#3D3D3D] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{creating ? 'Creating...' : 'Create Account'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 neu-pressed rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-[#C5BDB5]/30">
                <Users className="w-4 h-4 text-[#7C9EB2]" />
                <h3 className="text-sm font-bold text-[#3D3D3D] font-mono">Registered Accounts</h3>
              </div>

              <div className="space-y-1.5">
                {passwordMessage && (
                  <p className="text-[11px] text-[#7C9EB2] gradient-teal/20 p-2.5 rounded-lg font-mono">
                    {passwordMessage}
                  </p>
                )}
                {credentials.length === 0 ? (
                  <p className="text-[#9A9A9A] text-center py-8 text-xs font-mono">No accounts registered.</p>
                ) : (
                  credentials.map((user) => (
                    <div key={user.id}>
                      {editingUserId === user.id ? (
                        <div className="p-3 rounded-lg neu-card space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#3D3D3D] text-sm">{user.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              user.role === 'admin'
                                ? 'gradient-coral text-[#3D3D3D]'
                                : 'gradient-teal text-[#3D3D3D]'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[#9A9A9A] text-xs font-mono">{user.email}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              placeholder="New password..."
                              className="neu-input flex-1 rounded-lg px-3 py-1.5 text-xs font-mono"
                            />
                            <button
                              onClick={() => handlePasswordEdit(user.id)}
                              disabled={!editPassword.trim()}
                              className="px-3 py-1.5 rounded-lg gradient-coral text-[#3D3D3D] font-bold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setEditingUserId(null); setEditPassword(''); }}
                              className="px-3 py-1.5 rounded-lg neu-btn text-[#9A9A9A] text-xs transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : deletingUserId === user.id ? (
                        <div className="p-3 rounded-lg neu-card border border-[#C47C7C]/30 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#3D3D3D] text-sm">{user.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono gradient-coral text-[#3D3D3D]">
                              DELETE CONFIRM
                            </span>
                          </div>
                          <p className="text-[#9A9A9A] text-xs font-mono">{user.email}</p>
                          <p className="text-[11px] text-[#C47C7C] font-mono">
                            Type <strong>{user.name}</strong> below to confirm deletion:
                          </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={deleteConfirmName}
                              onChange={(e) => setDeleteConfirmName(e.target.value)}
                              placeholder={`Type "${user.name}" to confirm...`}
                              className="neu-input flex-1 rounded-lg px-3 py-1.5 text-xs font-mono"
                            />
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleteConfirmName !== user.name}
                              className="px-3 py-1.5 rounded-lg bg-[#C47C7C] hover:bg-[#C47C7C]/80 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setDeletingUserId(null); setDeleteConfirmName(''); }}
                              className="px-3 py-1.5 rounded-lg neu-btn text-[#9A9A9A] text-xs transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg neu-card-sm flex items-center justify-between group transition-colors">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#3D3D3D] text-sm">{user.name}</span>
                            <p className="text-[#9A9A9A] text-xs font-mono">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              user.role === 'admin'
                                ? 'gradient-coral text-[#3D3D3D]'
                                : 'gradient-teal text-[#3D3D3D]'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                            {user.role !== 'admin' && (
                              <>
                                <button
                                  onClick={() => { setEditingUserId(user.id); setEditPassword(''); setPasswordMessage(''); }}
                                  className="p-1.5 rounded-lg neu-btn text-[#9A9A9A] hover:text-[#7C9EB2] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                  title="Change password"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { setDeletingUserId(user.id); setDeleteConfirmName(''); setEditingUserId(null); }}
                                  className="p-1.5 rounded-lg neu-btn text-[#9A9A9A] hover:text-[#C47C7C] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
