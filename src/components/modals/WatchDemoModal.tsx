'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Play, Flame, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WatchDemoModal: React.FC = () => {
  const { showDemoModal, setShowDemoModal, setIsLoggedIn, setActiveView } = useStreak();

  if (!showDemoModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-modal p-6 rounded-3xl border border-white/15 shadow-2xl space-y-5 relative"
      >
        <button
          onClick={() => setShowDemoModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Play className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Streakify Interactive Product Demo</h3>
            <p className="text-xs text-slate-400 font-mono">Experience how daily streak tracking boosts consistency.</p>
          </div>
        </div>

        {/* Video / Demo Showcase Card */}
        <div className="aspect-video bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between p-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Flame className="w-4 h-4 fire-animated" /> Live Interactive Demo Mode
            </span>
            <span className="text-slate-400">02:45 / 03:00</span>
          </div>

          <div className="text-center space-y-3 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto glow-green animate-pulse">
              <Play className="w-8 h-8 fill-emerald-400 translate-x-0.5" />
            </div>
            <h4 className="text-lg font-bold text-white">"Never break the chain."</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Check in daily, complete habits, grow your 365-day matrix green intensity, and rise up the global leaderboard.
            </p>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="w-3/4 h-full bg-emerald-400 glow-green" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 font-mono">Ready to try it yourself?</span>
          <button
            onClick={() => {
              setShowDemoModal(false);
              setIsLoggedIn(true);
              setActiveView('dashboard');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all glow-green flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
