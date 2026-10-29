import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SearchModal from './SearchModal';

interface NavItem {
  label: string;
  categoryKey: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: 'Studio Workbench', categoryKey: 'Studio' },
    { label: 'Loans & EMI', categoryKey: 'Loans' },
    { label: 'Wealth & SIP', categoryKey: 'Investing' },
    { label: 'Tax & Compliance', categoryKey: 'Tax' },
    { label: 'Retirement & EPF', categoryKey: 'Retirement' },
    { label: 'Financial Planning', categoryKey: 'Everyday' }
  ];

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (categoryKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (categoryKey === 'Studio') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (location.pathname === '/') {
      const url = new URL(window.location.href);
      url.searchParams.set('category', categoryKey);
      url.hash = 'catalog-matrix';
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new CustomEvent('fingtaj:filterCategory', { detail: { category: categoryKey } }));

      const target = document.getElementById('catalog-matrix');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/?category=${categoryKey}#catalog-matrix`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080d16]/95 backdrop-blur-md border-b border-white/10 transition-shadow">
        <div className="wrap flex items-center justify-between gap-6 h-17">
          
          {/* Zone 1: Brand Wordmark + Zero Telemetry Tag */}
          <div className="flex items-center gap-4 shrink-0">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-95 transition-opacity"
              aria-label="FingTaj Home"
            >
              <BrandLogo size="md" />
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Client-Side RAM</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium h-full">
            {navItems.map((item) => {
              const isCurrent = location.pathname === '/' && (
                item.categoryKey === 'Studio' ? !location.search : location.search.includes(`category=${item.categoryKey}`)
              );

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={(e) => handleNavClick(item.categoryKey, e)}
                  className={`h-full flex items-center transition-all whitespace-nowrap shrink-0 relative cursor-pointer border-b-2 pt-0.5 ${
                    isCurrent
                      ? 'text-cyan-400 font-bold border-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'border-transparent text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Institutional Dropdown */}
            <div className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1"
                aria-expanded={moreDropdownOpen}
              >
                <span>Institutional</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute top-14 right-0 w-56 bg-[#0e1626] rounded-xl shadow-2xl border border-white/15 py-1.5 z-50 text-xs font-normal backdrop-blur-xl"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <Link 
                    to="/about" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    About &amp; E-E-A-T Methodology
                  </Link>
                  <Link 
                    to="/indexing" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Search Console Indexing Hub
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Engineering &amp; Support Desk
                  </Link>
                  <Link 
                    to="/privacy-policy" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Zero-Telemetry Privacy Policy
                  </Link>
                  <Link 
                    to="/terms-of-service" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-white/5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Terms of Service &amp; Disclaimer
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Search Affordance */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-slate-200 transition-all border border-white/10 hover:border-cyan-500/40 w-36 sm:w-60 group cursor-pointer shadow-inner"
              aria-label="Search all 50 financial calculators"
            >
              <div className="flex items-center gap-2 truncate">
                <Search size={14} className="text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                <span className="truncate hidden sm:inline">Search 50 calculators...</span>
                <span className="truncate sm:hidden">Search...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-cyan-400 font-semibold">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#0c1322] px-4 py-4 space-y-1 shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={(e) => handleNavClick(item.categoryKey, e)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-cyan-400 transition-colors block cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2 space-y-1">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400"
              >
                About &amp; Methodology
              </Link>
              <Link
                to="/indexing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-cyan-400"
              >
                Search Console Indexing Hub
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400"
              >
                Contact &amp; Grievance Desk
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
