'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, ArrowLeft, Layers, Layout, Smartphone, ShieldCheck, Database, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] select-none relative overflow-hidden font-sans">
      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="clay-icon w-8 h-8 rounded-xl gradient-teal flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#3D3D3D] fire-animated" />
          </div>
          <span>Back to App</span>
        </Link>

        <a
          href="/about.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-teal border border-[#7C9EB2]/30 text-[#3D3D3D] text-xs font-mono font-bold transition-all"
        >
          <span>Open Full Interactive Blueprint (about.html)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-20 pt-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="clay-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-teal border border-[#7C9EB2]/30 text-[#3D3D3D] text-xs font-mono">
            <Flame className="w-3.5 h-3.5" /> Streakify Architecture & Page Blueprint
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#3D3D3D] tracking-tight">
            About <span className="text-[#7C9EB2]">Streakify</span>
          </h1>
          <p className="text-[#9A9A9A] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-mono">
            Comprehensive documentation of all 15+ views, 5 global modals, 3 dedicated app routes, and database architecture.
          </p>
        </div>

        {/* Quick Access Card */}
        <div className="neu-card p-6 sm:p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#3D3D3D] mb-2">Standalone Blueprint Page Available</h3>
            <p className="text-[#9A9A9A] text-xs sm:text-sm max-w-xl">
              We have generated a dedicated <code className="text-[#7C9EB2]">about.html</code> static documentation page with interactive category filters, tech specs, and comprehensive card views for every single component.
            </p>
          </div>
          <a
            href="/about.html"
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl gradient-coral text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>View HTML Showcase</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="neu-card p-6 rounded-2xl space-y-3">
            <div className="clay-icon w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <Layout className="w-5 h-5 text-[#3D3D3D]" />
            </div>
            <h4 className="text-base font-bold text-[#3D3D3D]">15 Interactive Views</h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Dashboard, GitHub Heatmap, Analytics & Charts, Calendar, Achievements, Badges, Leaderboard, Habits Studio, Profile, Activity Log, System Settings, Admin Panel, Auth Portal, and Landing Page.
            </p>
          </div>

          <div className="neu-card p-6 rounded-2xl space-y-3">
            <div className="clay-icon w-10 h-10 rounded-xl gradient-lavender flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#3D3D3D]" />
            </div>
            <h4 className="text-base font-bold text-[#3D3D3D]">5 Global Modals</h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Daily Check-In & Journal Modal, Day Details Inspection Modal, Habit Form & Creator Modal, Watch Demo Video Lightbox, and Notification Slide-over Drawer.
            </p>
          </div>

          <div className="neu-card p-6 rounded-2xl space-y-3">
            <div className="clay-icon w-10 h-10 rounded-xl gradient-mint flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#3D3D3D]" />
            </div>
            <h4 className="text-base font-bold text-[#3D3D3D]">Android PWA & Routes</h4>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Dedicated download hub (<code className="text-[#D4A574]">/download</code>), standalone admin dashboard (<code className="text-[#D4A574]">/admin</code>), offline service worker caching, and native install banners.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
