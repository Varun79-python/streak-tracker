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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#3D3D3D]/30 backdrop-blur-sm select-none">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-sm h-full neu-card border-l border-[#C5BDB5] p-6 space-y-6 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="clay-icon gradient-teal p-2">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#3D3D3D] text-lg">Notifications</h3>
            </div>
            <button
              onClick={() => setShowNotificationDrawer(false)}
              className="neu-btn p-2 rounded-lg text-[#9A9A9A] hover:text-[#3D3D3D] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-[#C5BDB5]/40 pb-3">
            <span className="text-xs text-[#9A9A9A] font-mono">
              {notifications.filter(n => !n.read).length} Unread Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-[#7C9EB2] hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          {/* Notifications Timeline List */}
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl transition-all ${
                  item.read
                    ? 'neu-pressed opacity-70'
                    : 'neu-card-sm border-l-4 border-[#7C9EB2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3D3D3D] flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#9A9A9A] font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs text-[#6B6B6B] leading-snug">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#C5BDB5]/40 text-center">
          <p className="text-[11px] text-[#9A9A9A] font-mono">Notifications synced with daily streak engine.</p>
        </div>
      </motion.div>
    </div>
  );
};
