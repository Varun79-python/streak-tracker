import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StreakProvider } from "@/lib/StreakContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streakify - Build Discipline. Track Progress. Never Break The Chain.",
  description: "A premium, modern dark-themed habit & streak tracking application with GitHub-style 365-day contribution matrix, gamification, and analytics.",
  keywords: ["Streak Tracker", "Habit Tracker", "Contribution Graph", "Discipline", "Gamification"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-[#f8fafc]">
        <StreakProvider>
          {children}
        </StreakProvider>
      </body>
    </html>
  );
}
