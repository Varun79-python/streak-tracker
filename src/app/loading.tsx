import React from 'react';
import { Flame } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl gradient-coral flex items-center justify-center clay-icon animate-pulse">
        <Flame className="w-7 h-7 fire-animated text-white" />
      </div>
      <p className="text-xs text-[#9A9A9A] font-mono tracking-wider animate-pulse">
        Loading Streakify...
      </p>
    </div>
  );
}
