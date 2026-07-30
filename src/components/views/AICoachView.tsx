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
        <button onClick={() => setActiveView('dashboard')} className="p-2 rounded-xl claude-btn-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted-soft)' }} />
        </button>
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <div className="p-2 rounded-xl" style={{ borderRadius: '12px' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--green)' }} />
            </div>
            AI Coach
          </h2>
          <p className="text-xs" style={{ color: 'var(--muted-soft)' }}>Your personal habit motivation assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green)', borderRadius: '50%' }}>
                <Bot className="w-4 h-4" style={{ color: 'var(--ink)' }} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' ? '' : 'claude-card-soft'
            }`}
              style={msg.role === 'user' ? { background: 'var(--green)', color: 'var(--ink)' } : { color: 'var(--ink)' }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green)', borderRadius: '50%' }}>
                <User className="w-4 h-4" style={{ color: 'var(--ink)' }} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--green)', borderRadius: '50%' }}>
              <Bot className="w-4 h-4" style={{ color: 'var(--ink)' }} />
            </div>
            <div className="claude-card-soft rounded-2xl px-4 py-3">
              <p className="text-sm animate-pulse" style={{ color: 'var(--muted-soft)' }}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 items-end rounded-2xl p-2" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm placeholder-[var(--muted-soft)] outline-none resize-none px-3 py-2 max-h-24"
          style={{ color: 'var(--ink)' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--green)', color: 'var(--ink)' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
