import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'All 50 Engines', path: '/#all-calculators' },
    { label: 'Loans & EMI', path: '/#loans' },
    { label: 'Wealth & SIP', path: '/#investing' },
    { label: 'Direct Tax 2026', path: '/#tax' },
    { label: 'Retirement & EPF', path: '/#retirement' },
    { label: 'Methodology', path: '/about' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#030712]/85 backdrop-blur-xl transition-all">
        <div className="wrap flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single Brand Wordmark */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-95 transition-opacity">
            <BrandLogo size="md" showSubtitle={false} />
          </Link>

          {/* Zone 2: Clean 5-Link Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
            {navLinks.map((link) => {
              const isCurrent = location.pathname === link.path;
              return (
                <a
                  key={link.label}
                  href={link.path}
                  className={`hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
                    isCurrent ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Search Terminal Trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-white/[0.08] hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all font-medium shadow-inner"
            >
              <Search size={14} className="text-emerald-400" />
              <span>Search 50 Engines...</span>
              <kbd className="text-[10px] font-mono bg-[#030712] px-1.5 py-0.5 rounded border border-white/[0.08] text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-300"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-[#030712] px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                to="/indexing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-slate-900 rounded-lg"
              >
                <span>Google Search Console Indexing</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
