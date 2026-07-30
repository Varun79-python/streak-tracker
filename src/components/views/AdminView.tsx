'use client';

import React, { useState } from 'react';
import { useStreak, ADMIN_SECRET_KEY } from '@/lib/StreakContext';
import {
  ShieldCheck,
  UserPlus,
  Lock,
  CheckCircle2,
  Users,
  Pencil,
  X,
  Save,
  Trash2,
  Server,
  Activity,
  UserCog,
  Settings,
  Database,
  LogOut
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    credentials,
    isAdminUnlocked,
    verifyAndUnlockAdmin,
    setCredentials,
    user,
    logout
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

  // Login gate
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-lg mx-auto my-16 select-none px-4">
        <div style={{ background: '#0B0F0C', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {/* Dark terminal header */}
          <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F87171' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#39D353' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#39D353' }} />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#a09d96' }}>Secure Terminal</span>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(57, 211, 83, 0.15)' }}>
                <ShieldCheck className="w-8 h-8" style={{ color: '#39D353' }} />
              </div>
              <h2 className="text-lg font-bold font-mono tracking-wide" style={{ color: '#0B0F0C', fontFamily: 'var(--font-heading)' }}>Admin Authentication</h2>
              <p className="text-xs font-mono" style={{ color: '#a09d96' }}>
                Enter the master key to access the administration panel.
              </p>
            </div>

            <form onSubmit={handleAdminUnlockSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold font-mono tracking-wider uppercase" style={{ color: '#a09d96' }}>Master Key</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3" style={{ color: '#9CA3AF' }} />
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter secret key..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-mono tracking-wider rounded-lg outline-none"
                    style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                  />
                </div>
              </div>

              {keyError && (
                <p className="text-xs font-mono p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(198, 69, 69, 0.15)', color: '#F87171' }}>
                  <X className="w-3.5 h-3.5" />
                  {keyError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-xs transition-all cursor-pointer font-mono tracking-wider uppercase"
                style={{ background: '#39D353', color: '#ffffff' }}
              >
                Unlock Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="select-none max-w-6xl mx-auto px-4 pb-24">
      {/* Dark Admin Header */}
      <div className="rounded-t-2xl overflow-hidden" style={{ background: '#0B0F0C', border: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none' }}>
        {/* Window chrome */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F87171' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#39D353' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#39D353' }} />
          </div>
          <Server className="w-3.5 h-3.5" style={{ color: '#a09d96' }} />
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#a09d96' }}>Admin Panel</span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#a09d96' }}>v1.0.0</span>
          <div className="ml-auto flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3" style={{ color: '#39D353' }} />
              <span style={{ color: '#39D353' }}>Online</span>
            </span>
            <span style={{ color: '#9CA3AF' }}>|</span>
            <span style={{ color: '#a09d96' }}>{user.name || 'Admin'}</span>
          </div>
        </div>

        {/* Admin nav tabs */}
        <div className="px-5 py-3 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(57, 211, 83, 0.15)' }}>
            <UserCog className="w-3.5 h-3.5" style={{ color: '#39D353' }} />
            <span className="text-xs font-semibold font-mono" style={{ color: '#39D353' }}>Users</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Database className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
            <span className="text-xs font-mono" style={{ color: '#9CA3AF' }}>Database</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Settings className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
            <span className="text-xs font-mono" style={{ color: '#9CA3AF' }}>Settings</span>
          </div>
          <div className="ml-auto">
            <button
              onClick={async () => { await logout(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              style={{ background: 'rgba(198, 69, 69, 0.1)' }}
            >
              <LogOut className="w-3.5 h-3.5" style={{ color: '#F87171' }} />
              <span className="text-xs font-mono" style={{ color: '#F87171' }}>Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Content — dark background */}
      <div className="rounded-b-2xl p-6 space-y-6" style={{ background: '#0B0F0C', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}>
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" style={{ color: '#39D353' }} />
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>Total Users</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0B0F0C' }}>{credentials.length}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4" style={{ color: '#39D353' }} />
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>Admins</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0B0F0C' }}>{credentials.filter(c => c.role === 'admin').length}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" style={{ color: '#39D353' }} />
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>Active</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0B0F0C' }}>{credentials.filter(c => c.status === 'active').length}</p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Create Account Form */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <UserPlus className="w-4 h-4" style={{ color: '#39D353' }} />
              <h3 className="text-sm font-bold font-mono" style={{ color: '#0B0F0C' }}>Create Account</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    required
                    className="w-full rounded-lg px-3 py-2.5 text-xs font-mono outline-none"
                    style={{ background: '#1C2128', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>User ID</label>
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. alexjohnson"
                    required
                    className="w-full rounded-lg px-3 py-2.5 text-xs font-mono outline-none"
                    style={{ background: '#1C2128', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold font-mono uppercase tracking-wider" style={{ color: '#a09d96' }}>Password</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Assign a password..."
                    required
                    className="w-full rounded-lg px-3 py-2.5 text-xs font-mono outline-none"
                    style={{ background: '#1C2128', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                  />
                </div>

                {creationSuccess && (
                  <p className="text-[11px] font-mono p-2.5 rounded-lg flex items-center gap-2"
                    style={{ 
                      background: creationSuccess.startsWith('Error') ? 'rgba(198, 69, 69, 0.15)' : 'rgba(93, 184, 114, 0.15)',
                      color: creationSuccess.startsWith('Error') ? '#F87171' : '#39D353'
                    }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{creationSuccess}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                  style={{ background: '#39D353', color: '#ffffff' }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{creating ? 'Creating...' : 'Create Account'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Registered Accounts */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: '#39D353' }} />
                <h3 className="text-sm font-bold font-mono" style={{ color: '#0B0F0C' }}>Registered Accounts</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ background: 'rgba(57, 211, 83, 0.15)', color: '#39D353' }}>
                {credentials.length} total
              </span>
            </div>
            <div className="p-4 space-y-2">
              {passwordMessage && (
                <p className="text-[11px] font-mono p-2.5 rounded-lg" style={{ background: 'rgba(93, 184, 114, 0.15)', color: '#39D353' }}>
                  {passwordMessage}
                </p>
              )}
              {credentials.length === 0 ? (
                <p className="text-center py-8 text-xs font-mono" style={{ color: '#9CA3AF' }}>No accounts registered.</p>
              ) : (
                credentials.map((cred) => (
                  <div key={cred.id}>
                    {editingUserId === cred.id ? (
                      <div className="p-4 rounded-lg space-y-2.5" style={{ background: '#1C2128', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm" style={{ color: '#0B0F0C' }}>{cred.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: cred.role === 'admin' ? '#39D353' : '#39D353', color: '#ffffff' }}>
                            {cred.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs font-mono" style={{ color: '#a09d96' }}>{cred.email}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="New password..."
                            className="flex-1 rounded-lg px-3 py-1.5 text-xs font-mono outline-none"
                            style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                          />
                          <button
                            onClick={() => handlePasswordEdit(cred.id)}
                            disabled={!editPassword.trim()}
                            className="px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: '#39D353', color: '#ffffff' }}
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setEditingUserId(null); setEditPassword(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#a09d96' }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : deletingUserId === cred.id ? (
                      <div className="p-4 rounded-lg space-y-2.5" style={{ background: '#1C2128', border: '1px solid rgba(198, 69, 69, 0.3)' }}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm" style={{ color: '#0B0F0C' }}>{cred.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: '#F87171', color: '#ffffff' }}>
                            DELETE
                          </span>
                        </div>
                        <p className="text-xs font-mono" style={{ color: '#a09d96' }}>{cred.email}</p>
                        <p className="text-[11px] font-mono" style={{ color: '#F87171' }}>
                          Type <strong>{cred.name}</strong> below to confirm:
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={deleteConfirmName}
                            onChange={(e) => setDeleteConfirmName(e.target.value)}
                            placeholder={`Type "${cred.name}" to confirm...`}
                            className="flex-1 rounded-lg px-3 py-1.5 text-xs font-mono outline-none"
                            style={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', color: '#0B0F0C' }}
                          />
                          <button
                            onClick={() => handleDeleteUser(cred.id)}
                            disabled={deleteConfirmName !== cred.name}
                            className="px-3 py-1.5 rounded-lg text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: '#F87171' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setDeletingUserId(null); setDeleteConfirmName(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#a09d96' }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg flex items-center justify-between group transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: cred.role === 'admin' ? 'rgba(57, 211, 83, 0.15)' : 'rgba(93, 184, 166, 0.15)' }}>
                            <UserCog className="w-4 h-4" style={{ color: cred.role === 'admin' ? '#39D353' : '#39D353' }} />
                          </div>
                          <div>
                            <span className="font-bold text-sm" style={{ color: '#0B0F0C' }}>{cred.name}</span>
                            <p className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{cred.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: cred.role === 'admin' ? '#39D353' : '#39D353', color: '#ffffff' }}>
                            {cred.role.toUpperCase()}
                          </span>
                          {cred.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => { setEditingUserId(cred.id); setEditPassword(''); setPasswordMessage(''); }}
                                className="p-1.5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                style={{ background: 'rgba(255,255,255,0.06)' }}
                                title="Change password"
                              >
                                <Pencil className="w-3.5 h-3.5" style={{ color: '#a09d96' }} />
                              </button>
                              <button
                                onClick={() => { setDeletingUserId(cred.id); setDeleteConfirmName(''); setEditingUserId(null); }}
                                className="p-1.5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                style={{ background: 'rgba(198, 69, 69, 0.1)' }}
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" style={{ color: '#F87171' }} />
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
  );
};
