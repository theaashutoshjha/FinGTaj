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
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import SearchModal from './SearchModal';

interface CategoryTab {
  name: string;
  key: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const categories: CategoryTab[] = [
    { name: 'All', key: 'All' },
    { name: 'Loans & EMI', key: 'Loans' },
    { name: 'Wealth & SIP', key: 'Investing' },
    { name: 'Tax 115BAC', key: 'Tax' },
    { name: 'Retirement', key: 'Retirement' },
    { name: 'Planning', key: 'Everyday' }
  ];

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLegalDropdownOpen(false);
  }, [location.pathname, location.search]);

  const handleCategoryClick = (categoryKey: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const url = new URL(window.location.href);
      if (categoryKey === 'All') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', categoryKey);
      }
      url.hash = 'catalog-matrix';
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new CustomEvent('fingtaj:filterCategory', { detail: { category: categoryKey } }));

      const section = document.getElementById('catalog-matrix');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(categoryKey === 'All' ? '/#catalog-matrix' : `/?category=${categoryKey}#catalog-matrix`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="wrap flex items-center justify-between gap-4 h-18">
          
          {/* Brand Logo & Subtle Security Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
              <BrandLogo size="md" showBadge={true} />
            </Link>
          </div>

          {/* Clean Modern Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-slate-900/70 p-1.5 rounded-full border border-white/10 shadow-inner">
            {categories.map((cat) => {
              const isActive = location.pathname === '/' && (
                cat.key === 'All' ? !location.search.includes('category=') : location.search.includes(`category=${cat.key}`)
              );

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Action Center: Search Command & Trust Links */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs cursor-pointer shadow-sm group"
            >
              <Search size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="hidden sm:inline font-medium">Search 50 tools...</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-indigo-400 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Trust & Legal Dropdown */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLegalDropdownOpen(!legalDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>Legal &amp; Trust</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${legalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {legalDropdownOpen && (
                <div 
                  className="absolute right-0 top-12 w-60 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setLegalDropdownOpen(false)}
                >
                  <Link
                    to="/about"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ShieldCheck size={15} className="text-indigo-400" />
                    <span>About &amp; Methodology</span>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FileText size={15} className="text-emerald-400" />
                    <span>Privacy Policy (DPDP Act)</span>
                  </Link>
                  <Link
                    to="/terms-of-service"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Layers size={15} className="text-cyan-400" />
                    <span>Terms &amp; Disclaimers</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <HelpCircle size={15} className="text-amber-400" />
                    <span>Contact Support Desk</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-slate-950/98 px-5 py-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Calculator Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat.key)}
                  className="w-full text-left p-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-indigo-400 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <Link to="/about" className="block py-2 text-slate-300 hover:text-indigo-400">About FingTaj</Link>
              <Link to="/privacy-policy" className="block py-2 text-slate-300 hover:text-indigo-400">Privacy Policy</Link>
              <Link to="/terms-of-service" className="block py-2 text-slate-300 hover:text-indigo-400">Terms of Service</Link>
              <Link to="/contact" className="block py-2 text-slate-300 hover:text-indigo-400">Contact &amp; Grievances</Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
