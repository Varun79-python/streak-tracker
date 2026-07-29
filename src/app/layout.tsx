import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StreakProvider } from "@/lib/StreakContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://streakify.vercel.app"),
  title: {
    default: "Streakify — Build Discipline. Track Progress.",
    template: "%s — Streakify",
  },
  description:
    "A premium, modern dark-themed habit & streak tracking application with GitHub-style 365-day contribution matrix, gamification, and analytics.",
  keywords: ["Streak Tracker", "Habit Tracker", "Contribution Graph", "Discipline", "Gamification", "PWA"],
  authors: [{ name: "Streakify Team" }],
  creator: "Streakify",
  publisher: "Streakify",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Streakify — Build Discipline. Track Progress.",
    description:
      "Track your daily habits, build streaks, and never break the chain with Streakify's beautiful dark-themed tracker.",
    url: "https://streakify.vercel.app",
    siteName: "Streakify",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Streakify Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streakify — Build Discipline. Track Progress.",
    description:
      "Track your daily habits, build streaks, and never break the chain with Streakify's beautiful dark-themed tracker.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Streakify",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "description": "A premium, modern dark-themed habit & streak tracking application with GitHub-style 365-day contribution matrix and gamification.",
    "url": "https://streakify.vercel.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-[#f8fafc]">
        <StreakProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </StreakProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
