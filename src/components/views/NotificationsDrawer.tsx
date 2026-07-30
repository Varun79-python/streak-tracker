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
    <div className="fixed inset-0 z-50 flex justify-end select-none" style={{ background: 'rgba(20, 20, 19, 0.3)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="claude-glass-modal w-full max-w-sm h-full p-6 space-y-6 flex flex-col justify-between"
        style={{ borderLeft: '1px solid var(--hairline)' }}
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2" style={{ background: 'var(--green)', borderRadius: '12px' }}>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[var(--ink)] text-lg">Notifications</h3>
            </div>
            <button
              onClick={() => setShowNotificationDrawer(false)}
              className="claude-btn-icon cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(230, 223, 216, 0.4)' }}>
            <span className="text-xs text-[var(--muted-soft)] font-mono">
              {notifications.filter(n => !n.read).length} Unread Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs hover:underline font-semibold cursor-pointer flex items-center gap-1" style={{ color: 'var(--green)' }}
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
                    ? 'opacity-70'
                    : 'claude-card-soft'
                }`}
                style={!item.read ? { borderLeft: '4px solid var(--green)' } : { background: 'rgba(34, 197, 94, 0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[var(--muted-soft)] font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs leading-snug" style={{ color: 'var(--muted-claude)' }}>{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(230, 223, 216, 0.4)' }}>
          <p className="text-[11px] text-[var(--muted-soft)] font-mono">Notifications synced with daily streak engine.</p>
        </div>
      </motion.div>
    </div>
  );
};
