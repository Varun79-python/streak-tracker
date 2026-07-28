'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { X, Bell, Flame, Trophy, AlertTriangle, Calendar, BookOpen, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationsDrawer: React.FC = () => {
  const { 
    showNotificationDrawer, 
    setShowNotificationDrawer, 
    notifications, 
    markAllNotificationsRead 
  } = useStreak();

  if (!showNotificationDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-sm h-full glass-panel border-l border-white/10 p-6 space-y-6 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-lg">Notifications</h3>
            </div>
            <button
              onClick={() => setShowNotificationDrawer(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs text-slate-400 font-mono">
              {notifications.filter(n => !n.read).length} Unread Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          {/* Notifications Timeline List */}
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border space-y-1 transition-all ${
                  item.read
                    ? 'bg-slate-900/40 border-white/5 opacity-70'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500 font-mono">Notifications synced with daily streak engine.</p>
        </div>
      </motion.div>
    </div>
  );
};
