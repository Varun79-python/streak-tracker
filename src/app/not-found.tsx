import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] text-[#f8fafc] select-none relative overflow-hidden">
      {/* Ambient Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-green mx-auto">
          <Flame className="w-8 h-8 fire-animated" />
        </div>

        <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page not found</h2>
        <p className="text-sm text-slate-400 font-mono">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all glow-green"
        >
          <Flame className="w-4 h-4" />
          <span>Back to Streakify</span>
        </Link>
      </div>
    </div>
  );
}
