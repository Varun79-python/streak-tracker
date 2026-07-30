'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, ShieldCheck, Key, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginSignupPage: React.FC = () => {
  const { loginWithCredentials, verifyAndUnlockAdmin, setActiveView } = useStreak();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Admin Key state
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await loginWithCredentials(email, password);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminKeyError('');
    const isUnlocked = verifyAndUnlockAdmin(adminKeyInput);
    if (isUnlocked) {
      setAdminKeyInput('');
    } else {
      setAdminKeyError('Invalid Admin Key. Please enter the correct master access key.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface-canvas)] select-none relative overflow-hidden">
      {/* Decorative Background Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[var(--green)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[var(--green)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[var(--green)]/15 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md claude-card p-8 space-y-6 relative z-10"
      >
        {/* Logo Branding */}
        <div className="text-center space-y-3">
          <div
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--ink)] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--green)', borderRadius: '12px' }}>
              <Flame className="w-7 h-7 fire-animated text-white" />
            </div>
            <span>Streak<span style={{ color: 'var(--green)' }}>ify</span></span>
          </div>

          <h2 className="text-xl font-bold text-[var(--ink)] pt-2">Welcome Back</h2>
          <p className="text-xs text-[var(--muted-claude)] font-mono">
            Sign in with your admin-provisioned credentials.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-4 claude-card-soft flex items-center gap-3 text-xs font-mono" style={{ color: 'var(--green)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green)', borderRadius: '12px' }}>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span>Access restricted to provisioned accounts only.</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--ink)]">User ID</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your user ID"
              required
              className="w-full claude-input px-4 py-3 text-xs font-mono placeholder:text-[var(--muted-soft)]"
              style={{ color: 'var(--ink)' }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--ink)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full claude-input px-4 py-3 text-xs font-mono placeholder:text-[var(--muted-soft)]"
              style={{ color: 'var(--ink)' }}
            />
          </div>

          {errorMessage && (
            <div className="p-3 claude-card-soft flex items-center gap-2.5 text-xs font-mono" style={{ color: 'var(--error)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-white"
            style={{ background: 'var(--green)', borderRadius: '9999px' }}
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Key Section */}
        <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--hairline)' }}>
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--muted-soft)' }}>Admin Access</p>
          </div>

          <form onSubmit={handleAdminKeySubmit} className="space-y-2.5">
            <div className="relative">
              <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-soft)' }} />
              <input
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Enter Admin Master Panel Key..."
                className="w-full claude-input pl-11 pr-4 py-3 text-xs font-mono placeholder:text-[var(--muted-soft)]"
                style={{ color: 'var(--ink)' }}
              />
            </div>

            {adminKeyError && (
              <p className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
                <AlertCircle className="w-3 h-3" />
                {adminKeyError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-xs transition-all font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-white"
              style={{ background: 'var(--green)', borderRadius: '9999px' }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Open Admin Panel</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
