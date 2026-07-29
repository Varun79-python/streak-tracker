'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { BottomNav } from '@/components/BottomNav';
import { AdminView } from '@/components/views/AdminView';
import { DailyCheckInModal } from '@/components/modals/DailyCheckInModal';
import { DayDetailsModal } from '@/components/modals/DayDetailsModal';
import { HabitFormModal } from '@/components/modals/HabitFormModal';
import { NotificationsDrawer } from '@/components/views/NotificationsDrawer';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <TopNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AdminView />
        </main>
      </div>

      {/* Mobile Navigation & Drawers */}
      <BottomNav />
      <DailyCheckInModal />
      <DayDetailsModal />
      <HabitFormModal />
      <NotificationsDrawer />
    </div>
  );
}
