'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, ArrowLeft, Layers, Layout, Smartphone, ShieldCheck, Database, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] select-none relative overflow-hidden font-sans">
      {/* Ambient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Flame className="w-4 h-4 fire-animated" />
          </div>
          <span>Back to App</span>
        </Link>

        <a
          href="/about.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-bold transition-all"
        >
          <span>Open Full Interactive Blueprint (about.html)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-20 pt-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Flame className="w-3.5 h-3.5" /> Streakify Architecture & Page Blueprint
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About <span className="text-emerald-400">Streakify</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-mono">
            Comprehensive documentation of all 15+ views, 5 global modals, 3 dedicated app routes, and database architecture.
          </p>
        </div>

        {/* Quick Access Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Standalone Blueprint Page Available</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              We have generated a dedicated <code className="text-emerald-400">about.html</code> static documentation page with interactive category filters, tech specs, and comprehensive card views for every single component.
            </p>
          </div>
          <a
            href="/about.html"
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all text-center flex items-center justify-center gap-2 glow-green flex-shrink-0"
          >
            <span>View HTML Showcase</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">15 Interactive Views</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dashboard, GitHub Heatmap, Analytics & Charts, Calendar, Achievements, Badges, Leaderboard, Habits Studio, Profile, Activity Log, System Settings, Admin Panel, Auth Portal, and Landing Page.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">5 Global Modals</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily Check-In & Journal Modal, Day Details Inspection Modal, Habit Form & Creator Modal, Watch Demo Video Lightbox, and Notification Slide-over Drawer.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Android PWA & Routes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated download hub (<code className="text-amber-300">/download</code>), standalone admin dashboard (<code className="text-amber-300">/admin</code>), offline service worker caching, and native install banners.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
