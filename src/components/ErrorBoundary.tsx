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
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#E8E0D8] text-[#3D3D3D] select-none">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl gradient-coral flex items-center justify-center clay-icon mx-auto">
              <Flame className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-black text-[#3D3D3D] tracking-tight">Something went wrong</h1>
            <p className="text-sm text-[#9A9A9A] font-mono">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="text-left p-3 rounded-xl neu-pressed">
                <summary className="text-xs text-[#9A9A9A] cursor-pointer font-mono">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-[#C47C7C] font-mono whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-coral text-white font-bold text-sm transition-all cursor-pointer clay-badge hover:scale-[1.02]"
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
