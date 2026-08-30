import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../api';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Direct simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid electronic email address.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus({ type: 'success', message: res.message || 'Subscribed successfully to our corporate bulletin!' });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Newsletter registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="newsletter-segment" 
      className="py-20 relative border-t border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-4xl px-6">
        <div 
          className="rounded-2xl p-8 sm:p-12 border relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-between premium-card-hover"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-app)' 
          }}
        >
          
          <div className="space-y-3 text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
              Subscribe to SaroHub Bulletin
            </h3>
            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: 'var(--text-body)' }}>
              Receive premium engineering reports, database schema analyses, and direct technical updates from our SaroHub headquarters. No spam.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 min-w-[280px] sm:min-w-[340px]">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3.5 pr-12 text-sm placeholder-slate-500 focus:border-blue-500 focus:bg-white/[0.02] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  style={{ 
                    backgroundColor: 'var(--bg-app)', 
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-main)'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-sm shadow-blue-500/10"
                  aria-label="Subscribe"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>

              {status && (
                <div className={`flex items-center gap-2 text-xs font-semibold ${
                  status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
