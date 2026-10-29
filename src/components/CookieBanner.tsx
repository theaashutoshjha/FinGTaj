import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('fingtaj_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // safe fallback
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem('fingtaj_cookie_consent', 'accepted');
    } catch {
      // safe fallback
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('fingtaj_cookie_consent', 'essential_only');
    } catch {
      // safe fallback
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-5 left-5 right-5 max-w-xl mx-auto z-50 rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm tracking-tight">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Lock size={15} />
          </div>
          <span>Zero-Telemetry &amp; Privacy Consent</span>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Close consent banner"
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        FingTaj executes all financial computations exclusively inside your browser's local RAM with <strong className="text-white font-semibold">Zero Server Telemetry</strong>. Standard cookies are used by Google AdSense for fraud prevention and contextual advertisements per our{' '}
        <Link to="/privacy-policy" className="text-indigo-400 underline font-semibold hover:text-indigo-300">
          Privacy Policy
        </Link>{' '}
        and Indian DPDP Act 2023 regulations.
      </p>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>No PII Stored</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecline}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer font-medium"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md cursor-pointer"
          >
            <Check size={13} />
            <span>Accept All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
