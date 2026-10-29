import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Radio, 
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
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
    { label: 'Workbench', categoryKey: 'Studio' },
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname, location.search]);

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
        <div className="wrap flex items-center justify-between gap-4 h-16 sm:h-18">
          
          {/* Brand Wordmark + Zero Telemetry Tag */}
          <div className="flex items-center gap-3.5 shrink-0">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-95 transition-opacity"
              aria-label="FingTaj Home"
            >
              <BrandLogo size="md" />
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zero-Telemetry RAM</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium h-full">
            {navItems.map((item) => {
              const isCurrent = location.pathname === '/' && (
                item.categoryKey === 'Studio' ? !location.search : location.search.includes(`category=${item.categoryKey}`)
              );

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={(e) => handleNavClick(item.categoryKey, e)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
                    isCurrent
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Institutional Compliance Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border ${
                  moreDropdownOpen ? 'border-white/20 bg-white/5 text-white' : 'border-transparent'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>Trust &amp; Legal</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute top-11 right-0 w-64 bg-[#0d1627] rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] border border-white/15 py-2 z-50 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <div className="px-4 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-white/5 mb-1">
                    E-E-A-T Governance &amp; Compliance
                  </div>
                  <Link 
                    to="/about" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-slate-200 hover:text-cyan-300 transition-colors"
                  >
                    <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                    <span>About Us &amp; Methodology</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-slate-200 hover:text-cyan-300 transition-colors"
                  >
                    <HelpCircle size={14} className="text-emerald-400 shrink-0" />
                    <span>Contact &amp; Grievance Desk</span>
                  </Link>
                  <Link 
                    to="/privacy-policy" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-slate-200 hover:text-cyan-300 transition-colors"
                  >
                    <FileText size={14} className="text-purple-400 shrink-0" />
                    <span>Privacy Policy (DPDP Act)</span>
                  </Link>
                  <Link 
                    to="/terms-of-service" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-slate-200 hover:text-cyan-300 transition-colors"
                  >
                    <Layers size={14} className="text-amber-400 shrink-0" />
                    <span>Terms &amp; Statutory Disclaimer</span>
                  </Link>
                  <Link 
                    to="/indexing" 
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-slate-200 hover:text-cyan-300 transition-colors border-t border-white/5 mt-1 pt-2"
                  >
                    <Send size={14} className="text-cyan-400 shrink-0" />
                    <span>Search Indexing Directory</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Affordance: Search Button + Mobile Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-all border border-white/10 hover:border-cyan-500/40 w-32 sm:w-56 group cursor-pointer shadow-inner"
              aria-label="Search all 50 financial calculators"
            >
              <div className="flex items-center gap-2 truncate">
                <Search size={14} className="text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                <span className="truncate hidden sm:inline text-slate-400 group-hover:text-slate-200">Search calculators...</span>
                <span className="truncate sm:hidden text-slate-400">Search...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-[10px] font-mono text-cyan-400 font-semibold shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#0b1322] px-4 py-5 space-y-1 shadow-2xl animate-in fade-in duration-200">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 pb-1">
              Calculator Suites (50 Total)
            </div>
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

            <div className="pt-3 border-t border-white/10 mt-3 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 pb-1">
                Institutional &amp; Compliance
              </div>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
              >
                About Us &amp; E-E-A-T Methodology
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
              >
                Contact &amp; Grievance Officer
              </Link>
              <Link
                to="/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
              >
                Privacy Policy &amp; Cookie Consent
              </Link>
              <Link
                to="/terms-of-service"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
              >
                Terms of Service &amp; Statutory Disclaimer
              </Link>
              <Link
                to="/indexing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-white/5 rounded-lg"
              >
                Search Console Indexing Directory
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
