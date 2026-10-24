import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  const popularTools = [
    { name: 'SIP Wealth Calculator', path: '/sip-calculator' },
    { name: 'Home Loan EMI Calculator', path: '/loan-emi-calculator' },
    { name: 'Income Tax Calculator (115BAC)', path: '/income-tax-calculator' },
    { name: 'PPF Scheme Calculator', path: '/ppf-calculator' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
        HTTP 404 • Resource Not Found
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
        Page Not Found
      </h1>
      
      <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
        The computational module or document you are looking for has been relocated or does not exist under this exact URL.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
        >
          <Home size={16} />
          Return to Financial Hub
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition border border-slate-700"
        >
          <HelpCircle size={16} />
          Report Missing Resource
        </Link>
      </div>

      <div className="border-t border-slate-800 pt-8 max-w-md mx-auto">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Explore Popular Statutory Calculators:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {popularTools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
