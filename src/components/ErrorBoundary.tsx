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
        <div className="min-h-screen flex items-center justify-center p-4 text-[#3d3d3a] select-none" style={{ background: '#faf9f5' }}>
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: '#cc785c', borderRadius: '12px' }}>
              <Flame className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#141413' }}>Something went wrong</h1>
            <p className="text-sm font-mono" style={{ color: '#8e8b82' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="text-left p-3 rounded-xl" style={{ background: 'rgba(204, 120, 92, 0.08)', color: '#cc785c' }}>
                <summary className="text-xs cursor-pointer font-mono" style={{ color: '#8e8b82' }}>
                  Error details
                </summary>
                <pre className="mt-2 text-xs font-mono whitespace-pre-wrap break-all" style={{ color: '#c64545' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all cursor-pointer hover:scale-[1.02]"
              style={{ background: '#cc785c', borderRadius: '9999px' }}
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
