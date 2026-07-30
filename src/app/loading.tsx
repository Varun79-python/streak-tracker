import React from 'react';
import { Flame } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#3d3d3a] flex flex-col items-center justify-center space-y-4">
      <div style={{ borderRadius: '12px', background: '#cc785c' }} className="w-14 h-14 flex items-center justify-center animate-pulse">
        <Flame className="w-7 h-7 fire-animated text-white" />
      </div>
      <p className="text-xs text-[#8e8b82] font-mono tracking-wider animate-pulse">
        Loading Streakify...
      </p>
    </div>
  );
}
