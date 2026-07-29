'use client';

import React from 'react';
import { Flame, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useStreak } from '@/lib/StreakContext';

export const LandingNavbar: React.FC = () => {
  const { setActiveView, setIsLoggedIn } = useStreak();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#E8E0D8]/70 backdrop-blur-xl border-b border-[#D5CCC4] px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center clay-icon group-hover:scale-105 transition-transform overflow-hidden">
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
          <span className="text-xl font-bold tracking-tight text-[#3D3D3D] flex items-center gap-1">
            Streakify <span className="text-xs px-2 py-0.5 rounded-full gradient-teal text-white font-mono clay-badge">PRO</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6B6B]">
          <a href="#features" className="hover:text-[#7C9EB2] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#7C9EB2] transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-[#7C9EB2] transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-[#7C9EB2] transition-colors">Testimonials</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('login')}
            className="px-4 py-2 text-sm font-medium text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>

          <button
            onClick={() => {
              setIsLoggedIn(true);
              setActiveView('dashboard');
            }}
            className="px-5 py-2.5 rounded-xl gradient-coral text-white font-semibold text-sm transition-all flex items-center gap-2 group cursor-pointer clay-badge hover:scale-[1.02]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
