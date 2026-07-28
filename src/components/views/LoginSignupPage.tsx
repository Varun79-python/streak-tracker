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

  // Secret Admin Key modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginWithCredentials(email, password);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isUnlocked = verifyAndUnlockAdmin(adminKeyInput);
    if (isUnlocked) {
      setShowAdminModal(false);
      setAdminKeyInput('');
    } else {
      setAdminKeyError('Invalid Admin Key. Please enter the correct master access key.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] text-[#f8fafc] select-none relative overflow-hidden">
      {/* Dynamic Ambient Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-modal p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 relative"
      >
        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-white cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-green group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 fire-animated" />
            </div>
            <span>Streak<span className="text-emerald-400">ify</span></span>
          </div>

          <h2 className="text-xl font-bold text-white pt-2">Authorized Login Access</h2>
          <p className="text-xs text-slate-400 font-mono">
            Enter your Admin-provisioned email & password to access your dashboard.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Access is strictly restricted to Admin-provisioned user credentials.</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address / User ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. vedant@example.com"
              required
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 font-mono"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Secret Access Key Button */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin Master Panel Key Access</span>
          </button>
        </div>
      </motion.div>

      {/* Secret Admin Key Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-modal p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" /> Admin Secret Unlock
              </h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Enter your master key to open the Admin User Management panel.
            </p>

            <form onSubmit={handleAdminKeySubmit} className="space-y-3">
              <input
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Enter secret key..."
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 font-mono"
              />

              {adminKeyError && (
                <p className="text-[11px] text-rose-400 font-mono">{adminKeyError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green cursor-pointer"
              >
                Unlock Admin Panel
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
