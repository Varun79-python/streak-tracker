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
    <div className="min-h-screen bg-[#faf9f5] text-[#3d3d3a] flex items-center justify-center p-4">
      <div className="max-w-md w-full claude-card p-8 rounded-3xl text-center space-y-6">
        <div style={{ borderRadius: '12px', background: '#c64545' }} className="w-16 h-16 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#141413]">Something went wrong</h2>
          <p className="text-xs text-[#8e8b82] font-mono">
            {error.message || 'An unexpected application error occurred.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderRadius: '9999px', background: '#cc785c' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl claude-btn-secondary text-[#6c6a64] font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
