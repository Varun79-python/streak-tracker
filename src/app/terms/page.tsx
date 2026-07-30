import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Streakify',
  description: 'Terms of Service and conditions for using Streakify Habit & Streak Tracker.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#3d3d3a] relative overflow-hidden font-sans select-none">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6c6a64] hover:text-[#3d3d3a] transition-colors text-xs font-mono font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Streakify</span>
        </Link>

        <div className="space-y-3">
          <div style={{ borderRadius: '9999px', background: '#5db8a6' }} className="inline-flex items-center gap-2 px-3 py-1 border border-[#cc785c]/30 text-[#3d3d3a] text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" /> Terms & Conditions
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#8e8b82] font-mono">Last updated: July 29, 2026</p>
        </div>

        <div className="claude-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-[#6c6a64] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">1. Acceptance of Terms</h2>
            <p>
              By accessing, installing, or using Streakify, you agree to comply with these terms of service. Streakify provides a gamified habit tracking and consistency platform designed for self-improvement and personal productivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">2. User Account Access</h2>
            <p>
              Access to Streakify features is granted to authorized provisioned credentials managed via the system administrator portal. Users are responsible for maintaining confidentiality of login credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">3. Platform Availability & PWA Support</h2>
            <p>
              Streakify functions as both a web application and an installable Progressive Web App (PWA) with offline capabilities. Continuous updates are automatically synchronized to ensure optimal performance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
