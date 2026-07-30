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
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

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
    <div className="min-h-screen bg-[#faf9f5] text-[#3d3d3a] select-none relative overflow-hidden">
      {/* Nav Bar */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#6c6a64] hover:text-[#3d3d3a] transition-colors text-sm"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <div style={{ borderRadius: '12px', background: '#5db8a6' }} className="w-7 h-7 flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#3d3d3a]" />
          </div>
          <span className="font-bold">Streakify</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-20">
        {/* Hero */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#141413]">
            Get the <span className="text-[#cc785c]">Android App</span>
          </h1>
          <p className="text-[#8e8b82] font-mono text-sm max-w-lg mx-auto leading-relaxed">
            Install Streakify as a native Android app. Works offline, loads faster,
            feels just like a real app.
          </p>
        </div>

        {/* App Card */}
        <div className="claude-card p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm mx-auto mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div style={{ borderRadius: '12px', background: '#5db8a6' }} className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <Flame className="w-8 h-8 text-[#3d3d3a] fire-animated" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#141413]">Streakify</h2>
              <p className="text-xs text-[#8e8b82] font-mono">v1.0.0 &bull; 2.8 MB</p>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-4 rounded-2xl border border-[#cc785c]/30 text-center space-y-1" style={{ background: '#5db8a6' }}>
              <ShieldCheck className="w-6 h-6 text-[#3d3d3a] mx-auto" />
              <p className="text-sm font-semibold text-[#3d3d3a]">App is installed</p>
              <p className="text-xs text-[#8e8b82] font-mono">
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
                    ? 'text-white'
                    : 'claude-btn-secondary text-[#8e8b82] cursor-not-allowed'
                }`}
                style={deferredPrompt ? { background: '#cc785c' } : undefined}
              >
                <Download className="w-4 h-4" />
                <span>{deferredPrompt ? 'Install App' : 'Open in Browser'}</span>
              </button>

              <Link
                href={deferredPrompt ? '#' : '/'}
                onClick={deferredPrompt ? handleInstall : undefined}
                className="block w-full py-3 rounded-2xl claude-btn-secondary text-xs text-[#6c6a64] hover:text-[#3d3d3a] transition-colors text-center font-mono cursor-pointer"
              >
                Or download APK directly
              </Link>
            </div>
          )}

          <p className="text-[10px] text-[#8e8b82] font-mono text-center mt-4">
            By downloading, you agree to our{' '}
            <Link href="/terms" className="text-[#cc785c] hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-[#cc785c] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            {
              icon: <Zap className="w-5 h-5 text-[#cc785c]" />,
              title: 'Instant loading',
              desc: 'No browser tabs, no address bar — opens straight to Streakify.',
            },
            {
              icon: <Smartphone className="w-5 h-5 text-[#cc785c]" />,
              title: 'Native feel',
              desc: 'Bottom navigation, smooth transitions, edge-to-edge display.',
            },
            {
              icon: <Wifi className="w-5 h-5 text-[#e8a55a]" />,
              title: 'Offline support',
              desc: 'View your streaks and habits even without internet.',
            },
            {
              icon: <RefreshCw className="w-5 h-5 text-[#e8a55a]" />,
              title: 'Auto-updates',
              desc: 'Always the latest version — no manual updates needed.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="claude-card p-5 rounded-2xl space-y-3"
            >
              <div style={{ borderRadius: '12px', background: '#5db8a6' }} className="w-10 h-10 flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#141413]">{feature.title}</p>
                <p className="text-xs text-[#8e8b82] font-mono mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e6dfd8] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8b82] font-mono">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#cc785c]" />
            <span>&copy; {new Date().getFullYear()} Streakify. All rights reserved.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#6c6a64] transition-colors">Home</Link>
            <Link href="/download" className="hover:text-[#6c6a64] transition-colors">Android App</Link>
            <Link href="/privacy" className="hover:text-[#6c6a64] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#6c6a64] transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
