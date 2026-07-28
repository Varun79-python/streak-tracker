'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';

// Views
import { LandingPage } from '@/components/views/LandingPage';
import { LoginSignupPage } from '@/components/views/LoginSignupPage';
import { DashboardView } from '@/components/views/DashboardView';
import { HeatmapView } from '@/components/views/HeatmapView';
import { StatisticsView } from '@/components/views/StatisticsView';
import { CalendarView } from '@/components/views/CalendarView';
import { JournalView } from '@/components/views/JournalView';
import { AchievementsView } from '@/components/views/AchievementsView';
import { BadgesView } from '@/components/views/BadgesView';
import { LeaderboardView } from '@/components/views/LeaderboardView';
import { HabitsManagementView } from '@/components/views/HabitsManagementView';
import { SettingsView } from '@/components/views/SettingsView';
import { NotificationsDrawer } from '@/components/views/NotificationsDrawer';
import { ProfileView } from '@/components/views/ProfileView';
import { ActivityHistoryView } from '@/components/views/ActivityHistoryView';

// Modals
import { DailyCheckInModal } from '@/components/modals/DailyCheckInModal';
import { DayDetailsModal } from '@/components/modals/DayDetailsModal';
import { HabitFormModal } from '@/components/modals/HabitFormModal';
import { WatchDemoModal } from '@/components/modals/WatchDemoModal';

export default function Home() {
  const { isLoggedIn, activeView } = useStreak();

  // Landing view
  if (activeView === 'landing') {
    return (
      <main className="min-h-screen flex flex-col">
        <LandingPage />
        <WatchDemoModal />
      </main>
    );
  }

  // Login / Signup View
  if (activeView === 'login' || !isLoggedIn) {
    return (
      <main className="min-h-screen flex flex-col">
        <LoginSignupPage />
      </main>
    );
  }

  // Application Layout (Dashboard & Features)
  const renderActiveView = () => {
    switch (activeView) {
      case 'heatmap':
        return <HeatmapView />;
      case 'statistics':
        return <StatisticsView />;
      case 'calendar':
        return <CalendarView />;
      case 'journal':
        return <JournalView />;
      case 'achievements':
        return <AchievementsView />;
      case 'badges':
        return <BadgesView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'habits':
        return <HabitsManagementView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      case 'activity':
        return <ActivityHistoryView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <TopNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <DailyCheckInModal />
      <DayDetailsModal />
      <HabitFormModal />
      <NotificationsDrawer />
      <WatchDemoModal />
    </div>
  );
}
