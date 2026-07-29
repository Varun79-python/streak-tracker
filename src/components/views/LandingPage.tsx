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
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] flex flex-col overflow-hidden select-none">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Subtle warm background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A8C4B8]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#C4A8D4]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="clay-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full gradient-teal border border-[#7C9EB2]/30 text-[#3D3D3D] text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Habit & Streak Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#3D3D3D] leading-[1.1]">
              Build discipline. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C9EB2] via-[#A8C4B8] to-[#7C9EB2]">
                Track progress.
              </span> <br />
              Never break the chain.
            </h1>

            <p className="text-[#6B6B6B] text-base sm:text-lg max-w-xl leading-relaxed">
              Answer your daily habits, maintain your streak matrix, earn XP, and transform your daily life into a gamified journey of relentless growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveView('dashboard');
                }}
                className="px-7 py-3.5 rounded-xl gradient-coral text-white font-bold text-base transition-all flex items-center gap-2.5 shadow-xl group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="neu-btn px-6 py-3.5 rounded-xl text-[#3D3D3D] font-semibold text-base transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#7C9EB2] fill-[#7C9EB2]" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#9A9A9A] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7C9EB2]" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7C9EB2]" /> 100% Clean Design
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
            <div className="neu-card p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#9A9A9A]/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="clay-icon w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[#3D3D3D] fire-animated" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3D3D3D] text-lg">Your Streak</h3>
                    <p className="text-xs text-[#9A9A9A] font-mono">Every green box is a step forward.</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-[#7C9EB2] font-mono flex items-center justify-end gap-1">
                    <span>231</span> <span className="text-xs text-[#9A9A9A] font-normal">days</span>
                  </div>
                  <p className="text-[11px] text-[#D4A574] font-mono font-semibold">Active Streak 🔥</p>
                </div>
              </div>

              {/* Matrix Heatmap Preview */}
              <div className="neu-pressed p-4 rounded-xl mb-4">
                <HeatmapGraph history={history} interactive={false} />
              </div>

              {/* Today's completion mini preview */}
              <div className="flex items-center justify-between gradient-teal border border-[#7C9EB2]/30 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-[#3D3D3D] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Today&apos;s Check-in Complete! (+25 XP)</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded clay-badge gradient-teal text-[#3D3D3D]">100% Perfect</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By & Statistics Section */}
      <section className="py-12 border-y border-[#9A9A9A]/20 neu-card-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-[#7C9EB2] font-mono">100K+</h4>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider font-semibold">Active Habit Trackers</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-[#7C9EB2] font-mono">2M+</h4>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider font-semibold">Daily Check-ins Logged</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-[#D4A574] font-mono">95%</h4>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider font-semibold">Habit Retention Rate</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-extrabold text-[#C4A8D4] font-mono">4.9 ★</h4>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider font-semibold">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-[#3D3D3D]">Engineered for Unstoppable Consistency</h2>
          <p className="text-[#9A9A9A] text-sm">Combining GitHub heatmaps, LeetCode streaks, Duolingo gamification, and Notion&apos;s clean design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neu-card p-6 rounded-2xl space-y-4 hover:border-[#7C9EB2]/40 transition-colors">
            <div className="clay-icon w-12 h-12 rounded-xl gradient-teal flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <h3 className="text-lg font-bold text-[#3D3D3D]">GitHub-Style Heatmap</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Visualize 365 days of performance with vibrant green intensity matrix cells. Track every single victory.
            </p>
          </div>

          <div className="neu-card p-6 rounded-2xl space-y-4 hover:border-[#D4A574]/40 transition-colors">
            <div className="clay-icon w-12 h-12 rounded-xl gradient-lavender flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <h3 className="text-lg font-bold text-[#3D3D3D]">Streak Rules & Gamification</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Complete required daily habits to increment your active streak. Unlock shiny achievements & level up.
            </p>
          </div>

          <div className="neu-card p-6 rounded-2xl space-y-4 hover:border-[#7C9EB2]/40 transition-colors">
            <div className="clay-icon w-12 h-12 rounded-xl gradient-mint flex items-center justify-center">
              <Target className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <h3 className="text-lg font-bold text-[#3D3D3D]">Analytics & Calendar</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Detailed charts, weekly consistency reports, monthly calendar views, and daily journaling options.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#9A9A9A]/20 text-center text-xs text-[#9A9A9A] font-mono">
        <p>© 2026 Streakify. Designed for relentless high performers.</p>
      </footer>
    </div>
  );
};
