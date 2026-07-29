import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Streakify',
  description: 'Terms of Service and conditions for using Streakify Habit & Streak Tracker.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] relative overflow-hidden font-sans select-none">
      {/* Ambient Blur */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-mono font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Streakify</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" /> Terms & Conditions
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400 font-mono">Last updated: July 29, 2026</p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing, installing, or using Streakify, you agree to comply with these terms of service. Streakify provides a gamified habit tracking and consistency platform designed for self-improvement and personal productivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. User Account Access</h2>
            <p>
              Access to Streakify features is granted to authorized provisioned credentials managed via the system administrator portal. Users are responsible for maintaining confidentiality of login credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Platform Availability & PWA Support</h2>
            <p>
              Streakify functions as both a web application and an installable Progressive Web App (PWA) with offline capabilities. Continuous updates are automatically synchronized to ensure optimal performance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
