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
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] select-none relative overflow-hidden">
      {/* Ambient Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav Bar */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-bold">Streakify</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-20">
        {/* Hero */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Get the <span className="text-emerald-400">Android App</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm max-w-lg mx-auto leading-relaxed">
            Install Streakify as a native Android app. Works offline, loads faster,
            feels just like a real app.
          </p>
        </div>

        {/* App Card */}
        <div className="glass-modal p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl max-w-sm mx-auto mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-green flex-shrink-0">
              <Flame className="w-8 h-8 fire-animated" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Streakify</h2>
              <p className="text-xs text-slate-400 font-mono">v1.0.0 &bull; 2.8 MB</p>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-emerald-300">App is installed</p>
              <p className="text-xs text-slate-400 font-mono">
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
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 glow-green'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{deferredPrompt ? 'Install App' : 'Open in Browser'}</span>
              </button>

              <Link
                href={deferredPrompt ? '#' : '/'}
                onClick={deferredPrompt ? handleInstall : undefined}
                className="block w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors text-center font-mono cursor-pointer"
              >
                Or download APK directly
              </Link>
            </div>
          )}

          <p className="text-[10px] text-slate-500 font-mono text-center mt-4">
            By downloading, you agree to our{' '}
            <Link href="/terms" className="text-emerald-400 hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            {
              icon: <Zap className="w-5 h-5 text-emerald-400" />,
              title: 'Instant loading',
              desc: 'No browser tabs, no address bar — opens straight to Streakify.',
            },
            {
              icon: <Smartphone className="w-5 h-5 text-blue-400" />,
              title: 'Native feel',
              desc: 'Bottom navigation, smooth transitions, edge-to-edge display.',
            },
            {
              icon: <Wifi className="w-5 h-5 text-amber-400" />,
              title: 'Offline support',
              desc: 'View your streaks and habits even without internet.',
            },
            {
              icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
              title: 'Auto-updates',
              desc: 'Always the latest version — no manual updates needed.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-5 rounded-2xl border border-white/10 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{feature.title}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>&copy; {new Date().getFullYear()} Streakify. All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <Link href="/download" className="hover:text-slate-300 transition-colors">Android App</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
