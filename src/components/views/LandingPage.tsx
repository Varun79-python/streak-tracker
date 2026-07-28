'use client';

import React from 'react';
import { LandingNavbar } from '../Navbar';
import { useStreak } from '@/lib/StreakContext';
import { HeatmapGraph } from '../HeatmapGraph';
import { 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Trophy, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Users, 
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setActiveView, setIsLoggedIn, history, setShowDemoModal } = useStreak();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col overflow-hidden select-none">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono glow-green">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Habit & Streak Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Build discipline. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                Track progress.
              </span> <br />
              Never break the chain.
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Answer your daily habits, maintain your streak matrix, earn XP, and transform your daily life into a gamified journey of relentless growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveView('dashboard');
                }}
                className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all glow-green flex items-center gap-2.5 shadow-xl group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 font-semibold text-base transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Dark Theme
              </span>
            </div>
          </motion.div>

          {/* Hero Right Preview Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="glass-panel p-6 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-emerald-400 fire-animated" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Your Streak</h3>
                    <p className="text-xs text-slate-400 font-mono">Every green box is a step forward.</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono flex items-center justify-end gap-1">
                    <span>231</span> <span className="text-xs text-slate-400 font-normal">days</span>
                  </div>
                  <p className="text-[11px] text-amber-400 font-mono font-semibold">Active Streak 🔥</p>
                </div>
              </div>

              {/* Matrix Heatmap Preview */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 mb-4">
                <HeatmapGraph history={history} interactive={false} />
              </div>

              {/* Today's completion mini preview */}
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Today's Check-in Complete! (+25 XP)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">100% Perfect</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By & Statistics Section */}
      <section className="py-12 border-y border-white/10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-emerald-400 font-mono">100K+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Habit Trackers</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-blue-400 font-mono">2M+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Daily Check-ins Logged</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-amber-400 font-mono">95%</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Habit Retention Rate</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-purple-400 font-mono">4.9 ★</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white">Engineered for Unstoppable Consistency</h2>
          <p className="text-slate-400 text-sm">Combining GitHub heatmaps, LeetCode streaks, Duolingo gamification, and Notion's clean design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">GitHub-Style Heatmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualize 365 days of performance with vibrant green intensity matrix cells. Track every single victory.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Streak Rules & Gamification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Complete required daily habits to increment your active streak. Unlock shiny achievements & level up.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Analytics & Calendar</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detailed charts, weekly consistency reports, monthly calendar views, and daily journaling options.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Streakify. Designed for relentless high performers.</p>
      </footer>
    </div>
  );
};
