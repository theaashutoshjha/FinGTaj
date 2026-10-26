import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'All Calculators', path: '/#all-calculators' },
    { label: 'Loans & EMI', path: '/#loans' },
    { label: 'Wealth & Investments', path: '/#investing' },
    { label: 'Tax & Compliance', path: '/#tax' },
    { label: 'Retirement & EPF', path: '/#retirement' },
    { label: 'Financial Planning', path: '/#everyday' },
    { label: 'Utilities', path: '/#salary' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="wrap flex items-center justify-between gap-6 h-18">
          
          {/* Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center hover:opacity-95 transition-opacity">
            <BrandLogo size="md" showSubtitle={false} />
          </Link>

          {/* Navigation Links (Matches Reference Image Exactly) */}
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-slate-600 h-full">
            {navLinks.map((link) => {
              const isCurrent = link.path === '/#all-calculators' && (location.pathname === '/' && !location.hash);
              return (
                <a
                  key={link.label}
                  href={link.path}
                  className={`h-full flex items-center transition-colors whitespace-nowrap shrink-0 relative ${
                    isCurrent
                      ? 'text-blue-600 font-bold border-b-2 border-blue-600 pt-0.5'
                      : 'hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* "More ▾" Dropdown */}
            <div className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <span>More</span>
                <ChevronDown size={14} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute top-14 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-normal"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <Link 
                    to="/about" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600"
                  >
                    About &amp; Methodology
                  </Link>
                  <Link 
                    to="/indexing" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600"
                  >
                    Search Console Indexing
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600"
                  >
                    Contact Support
                  </Link>
                  <Link 
                    to="/privacy-policy" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Pill Search Bar (Matches Reference Image Exactly) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100/90 hover:bg-slate-100 text-xs sm:text-sm text-slate-400 hover:text-slate-600 transition-all w-48 sm:w-64 border border-slate-200/60"
            >
              <Search size={15} className="text-slate-400" />
              <span className="truncate">Search calculators...</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
              >
                About &amp; Methodology
              </Link>
              <Link
                to="/indexing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-blue-600 font-semibold"
              >
                Search Console Indexing Hub
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
