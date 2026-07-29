'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStreak } from '@/lib/StreakContext';
import { AIMessage } from '@/lib/types';
import { Send, Sparkles, Bot, User, ArrowLeft } from 'lucide-react';

const WELCOME_MESSAGE: AIMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your AI habit coach. Ask me anything about your streaks, get motivation, or tips to stay consistent! 🔥",
  timestamp: new Date().toISOString(),
};

export const AICoachView: React.FC = () => {
  const { user, setActiveView } = useStreak();
  const [messages, setMessages] = useState<AIMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: userMsg.content, history }),
      });

      const data = await res.json();
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm here when you need me! 🌟",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sometimes the best advice is simple: keep showing up! You're doing great. 🌟",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setActiveView('dashboard')} className="p-2 rounded-xl neu-btn transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#9A9A9A]" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-[#3D3D3D] flex items-center gap-2">
            <div className="clay-icon p-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-[#D4A574]" />
            </div>
            AI Coach
          </h2>
          <p className="text-xs text-[#9A9A9A]">Your personal habit motivation assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="clay-icon w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 gradient-teal">
                <Bot className="w-4 h-4 text-[#3D3D3D]" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'gradient-coral text-[#3D3D3D]'
                : 'neu-card-sm text-[#3D3D3D]'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="clay-icon w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 gradient-lavender">
                <User className="w-4 h-4 text-[#3D3D3D]" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="clay-icon w-8 h-8 rounded-full flex items-center justify-center gradient-teal">
              <Bot className="w-4 h-4 text-[#3D3D3D]" />
            </div>
            <div className="neu-card-sm rounded-2xl px-4 py-3">
              <p className="text-sm text-[#9A9A9A] animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 items-end neu-pressed rounded-2xl p-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#3D3D3D] placeholder-[#9A9A9A] outline-none resize-none px-3 py-2 max-h-24"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl gradient-coral text-[#3D3D3D] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
