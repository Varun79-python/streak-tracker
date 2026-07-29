'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Download,
  Smartphone,
  Zap,
  Wifi,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed (display-mode: standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event (PWA install banner)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect installation after prompt
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#E8E0D8] text-[#3D3D3D] select-none relative overflow-hidden">
      {/* Nav Bar */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors text-sm"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <div className="clay-icon w-7 h-7 rounded-lg gradient-teal flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#3D3D3D]" />
          </div>
          <span className="font-bold">Streakify</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-20">
        {/* Hero */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#3D3D3D]">
            Get the <span className="text-[#7C9EB2]">Android App</span>
          </h1>
          <p className="text-[#9A9A9A] font-mono text-sm max-w-lg mx-auto leading-relaxed">
            Install Streakify as a native Android app. Works offline, loads faster,
            feels just like a real app.
          </p>
        </div>

        {/* App Card */}
        <div className="neu-card p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm mx-auto mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="clay-icon w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center flex-shrink-0">
              <Flame className="w-8 h-8 text-[#3D3D3D] fire-animated" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D3D3D]">Streakify</h2>
              <p className="text-xs text-[#9A9A9A] font-mono">v1.0.0 &bull; 2.8 MB</p>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-4 rounded-2xl gradient-teal border border-[#7C9EB2]/30 text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-[#3D3D3D] mx-auto" />
              <p className="text-sm font-semibold text-[#3D3D3D]">App is installed</p>
              <p className="text-xs text-[#9A9A9A] font-mono">
                Streakify is already on your device.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleInstall}
                disabled={!deferredPrompt}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  deferredPrompt
                    ? 'gradient-coral text-white'
                    : 'neu-btn text-[#9A9A9A] cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{deferredPrompt ? 'Install App' : 'Open in Browser'}</span>
              </button>

              <Link
                href={deferredPrompt ? '#' : '/'}
                onClick={deferredPrompt ? handleInstall : undefined}
                className="block w-full py-3 rounded-2xl neu-btn text-xs text-[#6B6B6B] hover:text-[#3D3D3D] transition-colors text-center font-mono cursor-pointer"
              >
                Or download APK directly
              </Link>
            </div>
          )}

          <p className="text-[10px] text-[#9A9A9A] font-mono text-center mt-4">
            By downloading, you agree to our{' '}
            <Link href="/terms" className="text-[#7C9EB2] hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-[#7C9EB2] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            {
              icon: <Zap className="w-5 h-5 text-[#7C9EB2]" />,
              title: 'Instant loading',
              desc: 'No browser tabs, no address bar — opens straight to Streakify.',
            },
            {
              icon: <Smartphone className="w-5 h-5 text-[#7C9EB2]" />,
              title: 'Native feel',
              desc: 'Bottom navigation, smooth transitions, edge-to-edge display.',
            },
            {
              icon: <Wifi className="w-5 h-5 text-[#D4A574]" />,
              title: 'Offline support',
              desc: 'View your streaks and habits even without internet.',
            },
            {
              icon: <RefreshCw className="w-5 h-5 text-[#C4A8D4]" />,
              title: 'Auto-updates',
              desc: 'Always the latest version — no manual updates needed.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="neu-card p-5 rounded-2xl space-y-3"
            >
              <div className="clay-icon w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D3D3D]">{feature.title}</p>
                <p className="text-xs text-[#9A9A9A] font-mono mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#9A9A9A]/20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9A9A] font-mono">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#7C9EB2]" />
            <span>&copy; {new Date().getFullYear()} Streakify. All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#6B6B6B] transition-colors">Home</Link>
            <Link href="/download" className="hover:text-[#6B6B6B] transition-colors">Android App</Link>
            <Link href="/privacy" className="hover:text-[#6B6B6B] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#6B6B6B] transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
