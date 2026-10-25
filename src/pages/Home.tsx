import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Percent, 
  Briefcase, 
  Compass,
  Layers
} from 'lucide-react';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import AdSenseSlot from '../components/AdSenseSlot';

// High-demand calculators for quick-launch grid
const HIGH_DEMAND_SLUGS = [
  'emi-calculator',
  'home-loan-emi-calculator',
  'sip-calculator',
  'lumpsum-calculator',
  'fd-calculator',
  'rd-calculator',
  'ppf-calculator',
  'compound-interest-calculator',
  'cagr-calculator',
  'income-tax-calculator',
  'gst-calculator',
  'salary-in-hand-calculator'
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    document.title = 'FingTaj — 50 Statutory & Financial Calculators for India (100% Free)';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'High-precision client-side Indian financial calculators. Compute SIP wealth, Home Loan EMI, Income Tax (Section 115BAC), PPF, Gratuity, and Capital Gains with zero data collection.');
    }
  }, []);

  const categories = [
    { id: 'All', label: 'All 50 Tools', icon: Layers, count: 50 },
    { id: 'Loans', label: 'Loans', icon: Percent, count: 8 },
    { id: 'Investing', label: 'Investing', icon: TrendingUp, count: 10 },
    { id: 'Savings', label: 'Savings & Deposits', icon: ShieldCheck, count: 7 },
    { id: 'Retirement', label: 'Retirement & Pension', icon: Clock, count: 6 },
    { id: 'Tax', label: 'Taxation & Slabs', icon: FileText, count: 6 },
    { id: 'Salary', label: 'Salary & Business', icon: Briefcase, count: 6 },
    { id: 'Everyday', label: 'Everyday Planning', icon: Compass, count: 7 }
  ];

  const highDemandList = useMemo(() => {
    return CALCULATORS_DATA.filter(c => HIGH_DEMAND_SLUGS.includes(c.slug));
  }, []);

  // Filtered list based on category and search query
  const filteredCalculators = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS_DATA.filter(c => {
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesQuery = !q || 
        c.title.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.statute.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      
      {/* Institutional Hero Section */}
      <section className="relative pt-12 pb-14 lg:pt-18 lg:pb-20 border-b border-slate-800/80 overflow-hidden">
        <div className="wrap relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Anti-Slop Unboxed Kicker */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-emerald-400 mb-5 tracking-wide">
            <span>Statutory Financial Computation</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">FY 2025–26 &amp; FY 2026–27</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Zero Server Logging</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5 [text-wrap:balance]">
            Institutional Financial Calculators for <span className="text-emerald-400">Indian Taxpayers</span> &amp; Investors
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            All 50 statutory calculation engines for Home Loans, SIP wealth projection, Section 115BAC Income Tax, EPF corpus, and Gratuity. Every computation executes locally inside your browser with complete privacy.
          </p>

          {/* Quick Instant Search Bar */}
          <div className="relative max-w-xl mx-auto mb-10">
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus-within:border-emerald-500/80 rounded-xl px-4 py-3 shadow-lg transition-all">
              <Search size={18} className="text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, statutes, or keywords (e.g. SIP, EMI, 115BAC, Gratuity)..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Unified Institutional Stat Bar (Seamless Single Container) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80 text-left">
            <div className="p-4 sm:p-5">
              <div className="text-2xl font-bold font-mono text-white tracking-tight">50</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">Statutory Engines</div>
              <div className="text-[11px] text-slate-500 mt-1">RBI, CBDT &amp; SEBI Aligned</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">100%</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">Browser Execution</div>
              <div className="text-[11px] text-slate-500 mt-1">Zero Server Telemetry</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight">2026</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">Budget Updated</div>
              <div className="text-[11px] text-slate-500 mt-1">Section 115BAC &amp; Capital Gains</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight">₹0</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">Public Utility</div>
              <div className="text-[11px] text-slate-500 mt-1">Free Forever, No Sign-Up</div>
            </div>
          </div>

        </div>
      </section>

      {/* High-Demand Core Engines Grid */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="py-12 lg:py-16 border-b border-slate-800/80">
          <div className="wrap">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  High-Demand Core Engines
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Most Searched Indian Calculators
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md md:text-right leading-relaxed">
                Direct statutory computational tools with up-to-date FY 2025–26 rules, RBI amortization standards, and CBDT tax slabs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {highDemandList.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="fin-card p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">2026 Active</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 truncate max-w-[170px]">{item.statute}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Unobtrusive AdSense Placement */}
      <div className="wrap">
        <AdSenseSlot slotId="home-mid-banner" />
      </div>

      {/* Complete All-50 Directory Section */}
      <section className="py-12 lg:py-16" id="all-calculators">
        <div className="wrap">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Comprehensive Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                All 50 Financial &amp; Statutory Tools
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{filteredCalculators.length}</span> of 50 calculators
            </div>
          </div>

          {/* Segmented Category Filter Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map(cat => {
              const IconComponent = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80'
                  }`}
                >
                  <IconComponent size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Calculators Cards Grid */}
          {filteredCalculators.length === 0 ? (
            <div className="p-12 text-center fin-card max-w-lg mx-auto">
              <Calculator size={36} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Calculators Found</h3>
              <p className="text-xs text-slate-400 mb-4">
                We couldn't find any tool matching "{searchQuery}". Try searching for general terms like "loan", "tax", "sip", or "salary".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCalculators.map(c => (
                <Link
                  key={c.id}
                  to={`/${c.slug}`}
                  className="fin-card p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        {c.categoryLabel}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">FY 2025–26</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {c.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 truncate max-w-[190px]">
                      {c.statute}
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Calculate <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Institutional Editorial Research Section */}
      <section className="py-12 lg:py-16 border-t border-slate-800/80 bg-slate-950/60">
        <div className="wrap">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Editorial Library
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Research &amp; Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              In-depth research papers on compounding mathematics, tax harvesting strategies, and credit scoring algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map(article => (
              <div key={article.id} className="fin-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>{article.tag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-3 border-t border-slate-800">
                  <span>Written by {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Unobtrusive AdSense Placement */}
      <div className="wrap">
        <AdSenseSlot slotId="home-bottom-banner" />
      </div>

    </div>
  );
}
