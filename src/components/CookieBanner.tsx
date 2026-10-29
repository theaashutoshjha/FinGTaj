import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('fingtaj_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1000);
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
      className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 rounded-2xl border border-cyan-500/30 bg-[#0d1627]/95 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
          <div className="p-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <ShieldCheck size={16} />
          </div>
          <span>Zero-Telemetry &amp; Privacy Consent</span>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Close consent banner"
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        FingTaj executes all financial computations exclusively in your browser's local RAM with <strong className="text-cyan-400 font-semibold">Zero-Telemetry</strong>. Google AdSense and analytics partners utilize standard cookies for fraud prevention and contextual advertisements per our{' '}
        <Link to="/privacy-policy" className="text-cyan-400 underline font-semibold hover:text-cyan-300">
          Privacy Policy
        </Link>{' '}
        and Indian DPDP Act 2023 regulations.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
          <Lock size={12} />
          <span>No PII Stored</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecline}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Check size={14} />
            <span>Accept All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
