import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E8E0D8] text-[#3D3D3D] select-none relative overflow-hidden">
      <div className="text-center space-y-6 max-w-md">
        <div className="clay-icon w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8 text-[#3D3D3D] fire-animated" />
        </div>

        <h1 className="text-6xl font-black text-[#3D3D3D] tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-[#3D3D3D]">Page not found</h2>
        <p className="text-sm text-[#6B6B6B] font-mono">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-coral text-white font-bold text-sm transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Back to Streakify</span>
        </Link>
      </div>
    </div>
  );
}
