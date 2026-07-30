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
    <div className="min-h-screen bg-[#faf9f5] flex flex-col overflow-hidden select-none" style={{ color: '#3d3d3a' }}>
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Subtle warm background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none" style={{ background: '#5db872', opacity: 0.15 }} />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: '#e8a55a', opacity: 0.12 }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono" style={{ borderRadius: '9999px', background: '#5db8a6', border: '1px solid rgba(93, 184, 166, 0.3)', color: '#252523' }}>
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Habit & Streak Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]" style={{ color: '#141413' }}>
              Build discipline. <br />
              <span style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(to right, #cc785c, #5db8a6, #cc785c)' }}>
                Track progress.
              </span> <br />
              Never break the chain.
            </h1>

            <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: '#6c6a64' }}>
              Answer your daily habits, maintain your streak matrix, earn XP, and transform your daily life into a gamified journey of relentless growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveView('dashboard');
                }}
                className="px-7 py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center gap-2.5 shadow-xl group cursor-pointer"
                style={{ background: '#cc785c' }}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="claude-btn-secondary px-6 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center gap-2.5 cursor-pointer"
                style={{ color: '#252523' }}
              >
                <Play className="w-4 h-4 fill-current" style={{ color: '#cc785c' }} />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono" style={{ color: '#8e8b82' }}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#cc785c' }} /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#cc785c' }} /> 100% Clean Design
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
            <div className="claude-card p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid rgba(142, 139, 130, 0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#5db8a6', borderRadius: '12px' }}>
                    <Flame className="w-6 h-6 fire-animated" style={{ color: '#141413' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#141413' }}>Your Streak</h3>
                    <p className="text-xs font-mono" style={{ color: '#8e8b82' }}>Every green box is a step forward.</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold font-mono flex items-center justify-end gap-1" style={{ color: '#cc785c' }}>
                    <span>231</span> <span className="text-xs font-normal" style={{ color: '#8e8b82' }}>days</span>
                  </div>
                  <p className="text-[11px] font-mono font-semibold" style={{ color: '#e8a55a' }}>Active Streak 🔥</p>
                </div>
              </div>

              {/* Matrix Heatmap Preview */}
              <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(204, 120, 92, 0.08)' }}>
                <HeatmapGraph history={history} interactive={false} />
              </div>

              {/* Today's completion mini preview */}
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#5db8a6', border: '1px solid rgba(93, 184, 166, 0.3)' }}>
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#141413' }}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Today&apos;s Check-in Complete! (+25 XP)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 text-[#141413]" style={{ borderRadius: '9999px', background: 'rgba(255,255,255,0.3)' }}>100% Perfect</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By & Statistics Section */}
      <section className="py-12 claude-card-soft" style={{ borderTop: '1px solid rgba(142, 139, 130, 0.2)', borderBottom: '1px solid rgba(142, 139, 130, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold font-mono" style={{ color: '#cc785c' }}>100K+</h4>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8e8b82' }}>Active Habit Trackers</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold font-mono" style={{ color: '#cc785c' }}>2M+</h4>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8e8b82' }}>Daily Check-ins Logged</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold font-mono" style={{ color: '#e8a55a' }}>95%</h4>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8e8b82' }}>Habit Retention Rate</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold font-mono" style={{ color: '#5db8a6' }}>4.9 ★</h4>
            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8e8b82' }}>User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold" style={{ color: '#141413' }}>Engineered for Unstoppable Consistency</h2>
          <p className="text-sm" style={{ color: '#8e8b82' }}>Combining GitHub heatmaps, LeetCode streaks, Duolingo gamification, and Notion&apos;s clean design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="claude-card p-6 rounded-2xl space-y-4 transition-colors" style={{ borderColor: 'transparent' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#5db8a6', borderRadius: '12px' }}>
              <Activity className="w-6 h-6" style={{ color: '#141413' }} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#141413' }}>GitHub-Style Heatmap</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#8e8b82' }}>
              Visualize 365 days of performance with vibrant green intensity matrix cells. Track every single victory.
            </p>
          </div>

          <div className="claude-card p-6 rounded-2xl space-y-4 transition-colors" style={{ borderColor: 'transparent' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#e8a55a', borderRadius: '12px' }}>
              <Flame className="w-6 h-6" style={{ color: '#141413' }} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#141413' }}>Streak Rules & Gamification</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#8e8b82' }}>
              Complete required daily habits to increment your active streak. Unlock shiny achievements & level up.
            </p>
          </div>

          <div className="claude-card p-6 rounded-2xl space-y-4 transition-colors" style={{ borderColor: 'transparent' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#5db872', borderRadius: '12px' }}>
              <Target className="w-6 h-6" style={{ color: '#141413' }} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#141413' }}>Analytics & Calendar</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#8e8b82' }}>
              Detailed charts, weekly consistency reports, monthly calendar views, and daily journaling options.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs font-mono" style={{ borderTop: '1px solid rgba(142, 139, 130, 0.2)', color: '#8e8b82' }}>
        <p>© 2026 Streakify. Designed for relentless high performers.</p>
      </footer>
    </div>
  );
};
