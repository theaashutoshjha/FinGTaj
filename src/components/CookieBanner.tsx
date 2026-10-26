import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fingtaj_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem('fingtaj_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('fingtaj_cookie_consent', 'essential_only');
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-2xl backdrop-blur-md text-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck size={18} className="text-[#2563eb] shrink-0" />
          <span>Zero-Telemetry &amp; Privacy Consent</span>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Close consent banner"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        FingTaj evaluates all mathematical calculations strictly in your browser's local memory with zero server telemetry. We and third-party partners (including Google AdSense) use standard cookies to analyze traffic and deliver contextual advertisements in accordance with our{' '}
        <Link to="/privacy-policy" className="text-blue-600 underline font-semibold hover:text-blue-700">
          Privacy Policy
        </Link>{' '}
        and Indian DPDP Act 2023 regulations.
      </p>

      <div className="flex items-center justify-end gap-2.5 text-xs font-semibold">
        <button
          onClick={handleDecline}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition shadow-xs"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
}
