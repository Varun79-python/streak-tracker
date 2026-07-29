'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Flame } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] text-[#f8fafc] select-none relative overflow-hidden">
          {/* Ambient Blur Orbs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Flame className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">Something went wrong</h1>
            <p className="text-sm text-slate-400 font-mono">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="text-left p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <summary className="text-xs text-slate-400 cursor-pointer font-mono">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-rose-400 font-mono whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all glow-green cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
