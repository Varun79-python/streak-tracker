import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Streakify',
  description: 'Privacy Policy and data protection guidelines for Streakify Habit & Streak Tracker.',
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3D3D3D] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#9A9A9A] font-mono">Last updated: July 29, 2026</p>
        </div>

        <div className="neu-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-[#6B6B6B] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">1. Data Protection & Privacy First</h2>
            <p>
              Streakify is engineered with offline-first data protection. Your custom habits, daily check-in responses, journal reflections, and personal streak history remain stored locally inside your browser storage unless explicit cloud synchronization is enabled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">2. Information Usage</h2>
            <p>
              We do not track, sell, or collect personal journal entries, custom habit titles, or private reflections. Account provisioning data is strictly used for authenticating authorized users.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">3. Cookies & Local Storage</h2>
            <p>
              Streakify utilizes HTML5 LocalStorage to preserve user interface preferences (such as dark/amoled theme selection), login status, and offline streak achievements across browser sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#3D3D3D]">4. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding privacy practices or technical data handling, please refer to our documentation or contact the administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
