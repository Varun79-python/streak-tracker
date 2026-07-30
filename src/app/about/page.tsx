'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, ArrowLeft, Layers, Layout, Smartphone, ShieldCheck, Database, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#3d3d3a] select-none relative overflow-hidden font-sans">
      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6c6a64] hover:text-[#3d3d3a] transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <div style={{ borderRadius: '12px' }} className="w-8 h-8 flex items-center justify-center" >
            <div style={{ background: '#5db8a6', borderRadius: '12px' }} className="w-8 h-8 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#3d3d3a] fire-animated" />
            </div>
          </div>
          <span>Back to App</span>
        </Link>

        <a
          href="/about.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#cc785c]/30 text-[#3d3d3a] text-xs font-mono font-bold transition-all"
          style={{ background: '#5db8a6' }}
        >
          <span>Open Full Interactive Blueprint (about.html)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-20 pt-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div style={{ borderRadius: '9999px', background: '#5db8a6' }} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#cc785c]/30 text-[#3d3d3a] text-xs font-mono">
            <Flame className="w-3.5 h-3.5" /> Streakify Architecture & Page Blueprint
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#141413] tracking-tight">
            About <span className="text-[#cc785c]">Streakify</span>
          </h1>
          <p className="text-[#8e8b82] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-mono">
            Comprehensive documentation of all 15+ views, 5 global modals, 3 dedicated app routes, and database architecture.
          </p>
        </div>

        {/* Quick Access Card */}
        <div className="claude-card p-6 sm:p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#141413] mb-2">Standalone Blueprint Page Available</h3>
            <p className="text-[#8e8b82] text-xs sm:text-sm max-w-xl">
              We have generated a dedicated <code className="text-[#cc785c]">about.html</code> static documentation page with interactive category filters, tech specs, and comprehensive card views for every single component.
            </p>
          </div>
          <a
            href="/about.html"
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-2 flex-shrink-0"
            style={{ background: '#cc785c' }}
          >
            <span>View HTML Showcase</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="claude-card p-6 rounded-2xl space-y-3">
            <div style={{ borderRadius: '12px', background: '#5db8a6' }} className="w-10 h-10 flex items-center justify-center">
              <Layout className="w-5 h-5 text-[#3d3d3a]" />
            </div>
            <h4 className="text-base font-bold text-[#141413]">15 Interactive Views</h4>
            <p className="text-xs text-[#8e8b82] leading-relaxed">
              Dashboard, GitHub Heatmap, Analytics & Charts, Calendar, Achievements, Badges, Leaderboard, Habits Studio, Profile, Activity Log, System Settings, Admin Panel, Auth Portal, and Landing Page.
            </p>
          </div>

          <div className="claude-card p-6 rounded-2xl space-y-3">
            <div style={{ borderRadius: '12px', background: '#e8a55a' }} className="w-10 h-10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#3d3d3a]" />
            </div>
            <h4 className="text-base font-bold text-[#141413]">5 Global Modals</h4>
            <p className="text-xs text-[#8e8b82] leading-relaxed">
              Daily Check-In & Journal Modal, Day Details Inspection Modal, Habit Form & Creator Modal, Watch Demo Video Lightbox, and Notification Slide-over Drawer.
            </p>
          </div>

          <div className="claude-card p-6 rounded-2xl space-y-3">
            <div style={{ borderRadius: '12px', background: '#5db872' }} className="w-10 h-10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#3d3d3a]" />
            </div>
            <h4 className="text-base font-bold text-[#141413]">Android PWA & Routes</h4>
            <p className="text-xs text-[#8e8b82] leading-relaxed">
              Dedicated download hub (<code className="text-[#e8a55a]">/download</code>), standalone admin dashboard (<code className="text-[#e8a55a]">/admin</code>), offline service worker caching, and native install banners.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
