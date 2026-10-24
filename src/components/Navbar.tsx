import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  Menu, 
  X, 
  TrendingUp, 
  Home, 
  FileText, 
  ShieldCheck, 
  Percent, 
  Clock, 
  DollarSign
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'SIP Wealth', path: '/sip-calculator' },
    { label: 'Home Loan EMI', path: '/loan-emi-calculator' },
    { label: 'Income Tax', path: '/income-tax-calculator' },
    { label: 'PPF Scheme', path: '/ppf-calculator' },
    { label: 'Capital Gains', path: '/capital-gains-tax-calculator' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-cyan-400 font-extrabold text-sm">
                FT
              </div>
            </div>
            <span>FinG<span className="text-cyan-400">Taj</span></span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 ml-1">
              Zero-Telemetry
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Quick Community Link */}
            <a
              href="https://whatsapp.com/channel/0029Vb7gkNgIt5rwnKzp0Y0K"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join FingTaj WhatsApp Channel"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 transition hover:scale-105"
            >
              <span>Join Channel</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800/60">
            <Link
              to="/privacy-policy"
              onClick={closeMenu}
              className="block px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              onClick={closeMenu}
              className="block px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
