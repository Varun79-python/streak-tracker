import React from 'react';
import { Flame } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-green animate-pulse">
        <Flame className="w-7 h-7 fire-animated" />
      </div>
      <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">
        Loading Streakify...
      </p>
    </div>
  );
}
