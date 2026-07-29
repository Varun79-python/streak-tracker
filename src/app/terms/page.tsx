import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Streakify',
  description: 'Terms of Service and conditions for using Streakify Habit & Streak Tracker.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] relative overflow-hidden font-sans select-none">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors text-xs font-mono font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Streakify</span>
        </Link>

        <div className="space-y-3">
          <div className="clay-badge inline-flex items-center gap-2 px-3 py-1 rounded-full gradient-teal border border-[#7C9EB2]/30 text-[#3D3D3D] text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" /> Terms & Conditions
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3D3D3D] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#9A9A9A] font-mono">Last updated: July 29, 2026</p>
        </div>

        <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-[#6B6B6B] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">1. Acceptance of Terms</h2>
            <p>
              By accessing, installing, or using Streakify, you agree to comply with these terms of service. Streakify provides a gamified habit tracking and consistency platform designed for self-improvement and personal productivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">2. User Account Access</h2>
            <p>
              Access to Streakify features is granted to authorized provisioned credentials managed via the system administrator portal. Users are responsible for maintaining confidentiality of login credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">3. Platform Availability & PWA Support</h2>
            <p>
              Streakify functions as both a web application and an installable Progressive Web App (PWA) with offline capabilities. Continuous updates are automatically synchronized to ensure optimal performance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
