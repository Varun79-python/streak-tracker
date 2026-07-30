'use client';

import React from 'react';
import { Flame, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useStreak } from '@/lib/StreakContext';

export const LandingNavbar: React.FC = () => {
  const { setActiveView, setIsLoggedIn } = useStreak();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 transition-all"
      style={{ background: 'rgba(250, 249, 245, 0.7)', borderColor: '#e6dfd8' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden"
            style={{ background: '#cc785c', borderRadius: '12px' }}
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
          <span className="text-xl font-bold tracking-tight flex items-center gap-1" style={{ color: '#141413' }}>
            Streakify <span className="text-xs px-2 py-0.5 font-mono text-white" style={{ background: '#5db8a6', borderRadius: '9999px' }}>PRO</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#6c6a64' }}>
          <a href="#features" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = '#cc785c'} onMouseLeave={e => e.currentTarget.style.color = '#6c6a64'}>Features</a>
          <a href="#how-it-works" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = '#cc785c'} onMouseLeave={e => e.currentTarget.style.color = '#6c6a64'}>How it Works</a>
          <a href="#pricing" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = '#cc785c'} onMouseLeave={e => e.currentTarget.style.color = '#6c6a64'}>Pricing</a>
          <a href="#testimonials" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => e.currentTarget.style.color = '#cc785c'} onMouseLeave={e => e.currentTarget.style.color = '#6c6a64'}>Testimonials</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('login')}
            className="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
            style={{ color: '#6c6a64' }}
            onMouseEnter={e => e.currentTarget.style.color = '#141413'}
            onMouseLeave={e => e.currentTarget.style.color = '#6c6a64'}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>

          <button
            onClick={() => {
              setIsLoggedIn(true);
              setActiveView('dashboard');
            }}
            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2 group cursor-pointer hover:scale-[1.02]"
            style={{ background: '#cc785c', borderRadius: '9999px' }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
