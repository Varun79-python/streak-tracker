import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Streakify',
  description: 'Privacy Policy and data protection guidelines for Streakify Habit & Streak Tracker.',
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#141413] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#8e8b82] font-mono">Last updated: July 29, 2026</p>
        </div>

        <div className="claude-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-[#6c6a64] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">1. Data Protection & Privacy First</h2>
            <p>
              Streakify is engineered with offline-first data protection. Your custom habits, daily check-in responses, journal reflections, and personal streak history remain stored locally inside your browser storage unless explicit cloud synchronization is enabled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">2. Information Usage</h2>
            <p>
              We do not track, sell, or collect personal journal entries, custom habit titles, or private reflections. Account provisioning data is strictly used for authenticating authorized users.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">3. Cookies & Local Storage</h2>
            <p>
              Streakify utilizes HTML5 LocalStorage to preserve user interface preferences (such as dark/amoled theme selection), login status, and offline streak achievements across browser sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#141413]">4. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding privacy practices or technical data handling, please refer to our documentation or contact the administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
