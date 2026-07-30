'use client';

import React from 'react';
import { Flame, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useStreak } from '@/lib/StreakContext';

export const LandingNavbar: React.FC = () => {
  const { setActiveView, setIsLoggedIn } = useStreak();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 transition-all"
      style={{ background: 'rgba(11, 15, 12, 0.7)', borderColor: 'var(--hairline)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden"
            style={{ background: 'var(--green)', borderRadius: '12px' }}
          >
            <img
              src="/logo.png"
              alt="Streakify Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Flame className="w-6 h-6 text-white fire-animated" />
          </div>
          <span className="text-xl font-bold tracking-tight flex items-center gap-1" style={{ color: 'var(--ink)' }}>
            Streakify <span className="text-xs px-2 py-0.5 font-mono text-white" style={{ background: 'var(--green)', borderRadius: '9999px' }}>PRO</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--muted-claude)' }}>
          <a href="#features" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-claude)'}>Features</a>
          <a href="#how-it-works" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-claude)'}>How it Works</a>
          <a href="#pricing" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-claude)'}>Pricing</a>
          <a href="#testimonials" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-claude)'}>Testimonials</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('login')}
            className="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
            style={{ color: 'var(--muted-claude)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-claude)'}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>

          <button
            onClick={() => {
              setIsLoggedIn(true);
              setActiveView('dashboard');
            }}
            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2 group cursor-pointer hover:scale-[1.02]"
            style={{ background: 'var(--green)', borderRadius: '9999px' }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
