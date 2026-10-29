import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle, Terminal } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Terminal Exception — Resource Not Found | FingTaj';
  }, []);

  const popularTools = [
    { name: 'SIP Wealth Calculator', path: '/sip-calculator' },
    { name: 'Home Loan EMI Calculator', path: '/home-loan-emi-calculator' },
    { name: 'Income Tax Calculator (115BAC)', path: '/income-tax-calculator' },
    { name: 'PPF Scheme Calculator', path: '/ppf-calculator' }
  ];

  return (
    <div className="bg-[#080d16] text-slate-100 min-h-[75vh] flex items-center justify-center py-16 px-4 bg-terminal-grid bg-radial-ambient">
      <div className="max-w-xl w-full text-center terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-8 sm:p-10 shadow-2xl">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 font-mono flex items-center justify-center gap-2">
          <Terminal size={14} />
          <span>HTTP 404 · TERMINAL EXCEPTION</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed font-mono">
          The requested financial engine or computational document does not exist under this routing path.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs sm:text-sm transition font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Home size={15} />
            Return to Terminal
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition font-mono border border-white/10"
          >
            <HelpCircle size={15} />
            Support Desk
          </Link>
        </div>

        <div className="border-t border-white/10 pt-5 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
            Direct Engine Links:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {popularTools.map(tool => (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 transition"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
