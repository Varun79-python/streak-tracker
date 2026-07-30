'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Play, Flame, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WatchDemoModal: React.FC = () => {
  const { showDemoModal, setShowDemoModal, setIsLoggedIn, setActiveView } = useStreak();

  if (!showDemoModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/30 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl claude-glass-modal p-6 rounded-3xl shadow-2xl space-y-5 relative"
      >
        <button
          onClick={() => setShowDemoModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--muted-soft)] hover:text-[#3d3d3a] claude-btn-secondary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: 'var(--green)', borderRadius: '12px' }}
          >
            <Play className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <h3 
              className="font-bold text-[var(--ink)] text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Streakify Interactive Product Demo
            </h3>
            <p className="text-xs text-[var(--muted-claude)] font-mono">Experience how daily streak tracking boosts consistency.</p>
          </div>
        </div>

        {/* Video / Demo Showcase Card */}
        <div 
          className="aspect-video rounded-2xl relative overflow-hidden flex flex-col justify-between p-6"
          style={{ background: 'rgba(34, 197, 94, 0.08)' }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[var(--green)] font-bold">
              <Flame className="w-4 h-4 fire-animated" /> Live Interactive Demo Mode
            </span>
            <span className="text-[var(--muted-soft)]">02:45 / 03:00</span>
          </div>

          <div className="text-center space-y-3 my-auto">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse"
              style={{ background: 'var(--green)', borderRadius: '12px' }}
            >
              <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
            </div>
            <h4 
              className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              "Never break the chain."
            </h4>
            <p className="text-xs text-[var(--muted-claude)] max-w-md mx-auto">
              Check in daily, complete habits, grow your 365-day matrix green intensity, and rise up the global leaderboard.
            </p>
          </div>

          <div 
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(34, 197, 94, 0.08)' }}
          >
            <div className="w-3/4 h-full" style={{ background: 'var(--green)' }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[var(--muted-soft)] font-mono">Ready to try it yourself?</span>
          <button
            onClick={() => {
              setShowDemoModal(false);
              setIsLoggedIn(true);
              setActiveView('dashboard');
            }}
            className="px-5 py-2.5 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            style={{ background: 'var(--green)', borderRadius: '9999px' }}
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
