'use client';

import React from 'react';
import { useStreak } from '@/lib/StreakContext';
import { TopNav } from '@/components/TopNav';
import { BottomNav } from '@/components/BottomNav';

// Views
import { LandingPage } from '@/components/views/LandingPage';
import { LoginSignupPage } from '@/components/views/LoginSignupPage';
import { DashboardView } from '@/components/views/DashboardView';
import { HeatmapView } from '@/components/views/HeatmapView';
import { StatisticsView } from '@/components/views/StatisticsView';
import { CalendarView } from '@/components/views/CalendarView';
import { AchievementsView } from '@/components/views/AchievementsView';
import { BadgesView } from '@/components/views/BadgesView';
import { LeaderboardView } from '@/components/views/LeaderboardView';
import { HabitsManagementView } from '@/components/views/HabitsManagementView';
import { SettingsView } from '@/components/views/SettingsView';
import { NotificationsDrawer } from '@/components/views/NotificationsDrawer';
import { ProfileView } from '@/components/views/ProfileView';
import { ActivityHistoryView } from '@/components/views/ActivityHistoryView';
import { AdminView } from '@/components/views/AdminView';
import { AICoachView } from '@/components/views/AICoachView';

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

  // Login / Signup View (but allow admin panel access)
  if ((activeView === 'login' || !isLoggedIn) && activeView !== 'admin') {
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
      case 'coach':
        return <AICoachView />;
      case 'admin':
        return <AdminView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20">
        <TopNav />

        <main className="flex-1 px-3 py-4 w-full mx-auto max-w-lg">
          {renderActiveView()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <DailyCheckInModal />
      <DayDetailsModal />
      <HabitFormModal />
      <NotificationsDrawer />
      <WatchDemoModal />
    </div>
  );
}
