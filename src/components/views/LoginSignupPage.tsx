'use client';

import React, { useState } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Flame, Lock, Mail, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginSignupPage: React.FC = () => {
  const { setIsLoggedIn, setActiveView } = useStreak();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('vedant@example.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Glow animations */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/10 space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto glow-green">
            <Flame className="w-7 h-7 fire-animated" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isSignUp ? 'Start tracking your streak today' : 'Enter details to log in to Streakify'}
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
            </svg>
            Google
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Github className="w-4 h-4 text-slate-200" />
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex-1 h-px bg-white/10" />
          <span>OR EMAIL</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Password</label>
              {!isSignUp && (
                <a href="#forgot" className="text-emerald-400 hover:underline text-[11px]">Forgot?</a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all glow-green flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          {isSignUp ? (
            <span>Already have an account? <button onClick={() => setIsSignUp(false)} className="text-emerald-400 font-semibold hover:underline cursor-pointer">Sign In</button></span>
          ) : (
            <span>Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-emerald-400 font-semibold hover:underline cursor-pointer">Register Free</button></span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
