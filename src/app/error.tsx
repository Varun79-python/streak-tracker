'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] flex items-center justify-center p-4">
      <div className="max-w-md w-full neu-card p-8 rounded-3xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center clay-icon mx-auto">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#3D3D3D]">Something went wrong</h2>
          <p className="text-xs text-[#9A9A9A] font-mono">
            {error.message || 'An unexpected application error occurred.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl gradient-coral text-white font-bold text-xs transition-all flex items-center gap-2 clay-badge cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl neu-btn text-[#6B6B6B] font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
