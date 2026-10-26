import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found — FingTaj';
  }, []);

  const popularTools = [
    { name: 'SIP Wealth Calculator', path: '/sip-calculator' },
    { name: 'Home Loan EMI Calculator', path: '/home-loan-emi-calculator' },
    { name: 'Income Tax Calculator (115BAC)', path: '/income-tax-calculator' },
    { name: 'PPF Scheme Calculator', path: '/ppf-calculator' }
  ];

  return (
    <div className="bg-[#f4f7fb] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full text-center bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2 font-mono">
          HTTP 404 · Resource Not Found
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Page Not Found
        </h1>
        
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          The computational tool or document you are looking for has been relocated or does not exist under this exact URL.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition shadow-xs"
          >
            <Home size={15} />
            Return to All Calculators
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition"
          >
            <HelpCircle size={15} />
            Contact Support
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-5 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
            Popular Calculators:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {popularTools.map(tool => (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 text-slate-700 hover:text-blue-600 font-medium transition"
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
