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
  Layers,
  Sliders
} from 'lucide-react';
import { CALCULATORS_DATA, formatINR } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import AdSenseSlot from '../components/AdSenseSlot';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuite, setSelectedSuite] = useState<string>('All');

  // Interactive Hero Simulator State
  const [heroTab, setHeroTab] = useState<'sip' | 'loan' | 'tax'>('sip');
  const [heroSipAmount, setHeroSipAmount] = useState(10000);
  const [heroSipYears, setHeroSipYears] = useState(15);
  const [heroLoanPrincipal, setHeroLoanPrincipal] = useState(5000000); // 50 Lakhs
  const [heroTaxSalary, setHeroTaxSalary] = useState(1500000); // 15 Lakhs

  useEffect(() => {
    document.title = 'FingTaj — 50 Statutory & Financial Calculators for India (100% Free)';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'High-precision client-side Indian financial calculators. Compute SIP wealth, Home Loan EMI, Income Tax (Section 115BAC), PPF, Gratuity, and Capital Gains with zero data collection.');
    }
  }, []);

  // Compute Hero SIP Result
  const heroSipResult = useMemo(() => {
    const r = 12 / 1200; // 12% annual
    const n = heroSipYears * 12;
    const invested = heroSipAmount * n;
    const total = heroSipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const gains = total - invested;
    return { invested, total, gains };
  }, [heroSipAmount, heroSipYears]);

  // Compute Hero Loan Result (8.5% for 20 years)
  const heroLoanResult = useMemo(() => {
    const rate = 8.5 / 1200;
    const n = 240; // 20 years
    const emi = Math.round((heroLoanPrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - heroLoanPrincipal;
    return { emi, totalInterest, totalPayable };
  }, [heroLoanPrincipal]);

  // Compute Hero Tax Result (Section 115BAC FY 2025-26)
  const heroTaxResult = useMemo(() => {
    const standardDeduction = 75000;
    const taxable = Math.max(0, heroTaxSalary - standardDeduction);
    let tax = 0;
    if (taxable <= 300000) tax = 0;
    else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
    else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
    else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
    else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
    else tax = 140000 + (taxable - 1500000) * 0.30;

    // Rebate u/s 87A if taxable <= 7 Lakhs
    if (taxable <= 700000) tax = 0;
    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;
    return { totalTax, effectiveRate: heroTaxSalary > 0 ? ((totalTax / heroTaxSalary) * 100).toFixed(1) : '0' };
  }, [heroTaxSalary]);

  const suites = [
    { id: 'All', label: 'All 50 Engines', icon: Layers, count: 50, desc: 'Full Statutory Directory' },
    { id: 'Loans', label: 'Loans & Mortgages', icon: Percent, count: 8, desc: 'RBI Reducing Balance Standards' },
    { id: 'Investing', label: 'Wealth & Equity', icon: TrendingUp, count: 10, desc: 'CAGR, XIRR & Systematic Wealth' },
    { id: 'Savings', label: 'Fixed Deposits & Postal', icon: ShieldCheck, count: 7, desc: 'Quarterly RBI Compounding' },
    { id: 'Retirement', label: 'Pensions & Gratuity', icon: Clock, count: 6, desc: 'Payment of Gratuity Act 1972' },
    { id: 'Tax', label: 'Direct Taxation 2026', icon: FileText, count: 6, desc: 'Section 115BAC & Finance Act' },
    { id: 'Salary', label: 'Compensation & Payroll', icon: Briefcase, count: 6, desc: 'In-Hand CTC & Corporate Margin' },
    { id: 'Everyday', label: 'Macro Planning', icon: Compass, count: 7, desc: 'Inflation, Currency & Net Worth' }
  ];

  const filteredCalculators = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS_DATA.filter(c => {
      const matchSuite = selectedSuite === 'All' || c.category === selectedSuite;
      const matchQuery = !q || 
        c.title.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.statute.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q);
      return matchSuite && matchQuery;
    });
  }, [selectedSuite, searchQuery]);

  return (
    <div className="relative">
      
      {/* SECTION 1: FINANCIAL COMMAND CENTER (HERO + INTERACTIVE SIMULATOR HUD) */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-white/[0.08] overflow-hidden">
        <div className="wrap">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Institutional Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Sovereign Compliance Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wide">
                <span className="font-mono text-[11px] text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  GOVERNMENT OF INDIA STATUTORY COMPLIANCE
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">FY 2025–26 &amp; 2026–27</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] [text-wrap:balance]">
                Deterministic Financial Algorithms for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Indian Taxpayers</span> &amp; Wealth Planners
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                All 50 statutory calculation engines for home loan amortization, systematic equity compounding, Section 115BAC income tax, and gratuity. Executed purely in client-side memory with zero server telemetry.
              </p>

              {/* Instant Search Bar with Shortcut hint */}
              <div className="relative max-w-xl pt-2">
                <div className="flex items-center gap-3 bg-[#0a1120] border border-white/[0.12] hover:border-emerald-500/50 focus-within:border-emerald-500 rounded-xl px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] transition-all">
                  <Search size={18} className="text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 50 tools, statutes, or sections (e.g. SIP, 115BAC, EMI)..."
                    className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded font-mono"
                    >
                      Clear
                    </button>
                  )}
                  <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 border border-white/[0.08] px-1.5 py-0.5 rounded bg-slate-900">
                    ⌘K
                  </span>
                </div>
              </div>

              {/* Institutional Assurance Strip */}
              <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-lg font-bold font-mono text-white">50 Tools</div>
                  <div className="text-[11px] text-slate-400">All Statutory Acts</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-emerald-400">0 Bytes</div>
                  <div className="text-[11px] text-slate-400">Zero Server Telemetry</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-cyan-400">100% Free</div>
                  <div className="text-[11px] text-slate-400">No Paywalls or Login</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-amber-400">2026 Ready</div>
                  <div className="text-[11px] text-slate-400">Budget 2024–26 Norms</div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Simulation HUD */}
            <div className="lg:col-span-5">
              <div className="fin-card p-6 sm:p-7 relative border-white/[0.12] shadow-2xl bg-gradient-to-b from-[#0b1426] to-[#070d19]">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Simulation HUD
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Instant Output
                  </span>
                </div>

                {/* HUD Tool Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-white/[0.06] mb-5">
                  <button
                    type="button"
                    onClick={() => setHeroTab('sip')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      heroTab === 'sip' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SIP Wealth
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('loan')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      heroTab === 'loan' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Home Loan
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('tax')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      heroTab === 'tax' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Income Tax
                  </button>
                </div>

                {/* TAB 1: SIP WEALTH SIMULATOR */}
                {heroTab === 'sip' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Monthly Investment</span>
                        <span className="text-emerald-400 font-mono font-bold text-sm">₹{heroSipAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min={1000}
                        max={100000}
                        step={1000}
                        value={heroSipAmount}
                        onChange={(e) => setHeroSipAmount(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Time Horizon</span>
                        <span className="text-white font-mono font-bold text-sm">{heroSipYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={heroSipYears}
                        onChange={(e) => setHeroSipYears(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* HUD Output Matrix */}
                    <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Invested Capital</div>
                        <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                          {formatINR(heroSipResult.invested)}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-[10px] uppercase font-bold text-emerald-400">Projected Value (12%)</div>
                        <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
                          {formatINR(heroSipResult.total)}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/sip-calculator?monthlyInvestment=${heroSipAmount}&years=${heroSipYears}&expectedReturn=12`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      <span>Open Full SIP Wealth Engine</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* TAB 2: HOME LOAN SIMULATOR */}
                {heroTab === 'loan' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Home Loan Principal</span>
                        <span className="text-cyan-400 font-mono font-bold text-sm">₹{(heroLoanPrincipal / 100000).toFixed(0)} Lakhs</span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={20000000}
                        step={500000}
                        value={heroLoanPrincipal}
                        onChange={(e) => setHeroLoanPrincipal(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono bg-slate-900/40 p-2 rounded-lg border border-white/[0.04]">
                      Benchmark: 8.5% interest · 20-year reducing balance amortization
                    </div>

                    {/* HUD Output Matrix */}
                    <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <div className="text-[10px] uppercase font-bold text-cyan-400">Monthly EMI</div>
                        <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                          ₹{heroLoanResult.emi.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Total Interest</div>
                        <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                          {formatINR(heroLoanResult.totalInterest)}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/home-loan-emi-calculator?loanAmount=${heroLoanPrincipal}&interestRate=8.5&tenureYears=20`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      <span>Open Full Home Loan Matrix</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* TAB 3: INCOME TAX SIMULATOR */}
                {heroTab === 'tax' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Annual Gross Salary</span>
                        <span className="text-amber-400 font-mono font-bold text-sm">₹{(heroTaxSalary / 100000).toFixed(1)} Lakhs</span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={5000000}
                        step={100000}
                        value={heroTaxSalary}
                        onChange={(e) => setHeroTaxSalary(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono bg-slate-900/40 p-2 rounded-lg border border-white/[0.04]">
                      Includes ₹75,000 Standard Deduction under Section 115BAC (Budget 2024–26)
                    </div>

                    {/* HUD Output Matrix */}
                    <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="text-[10px] uppercase font-bold text-amber-400">Tax Liability (115BAC)</div>
                        <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                          ₹{heroTaxResult.totalTax.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Effective Tax Rate</div>
                        <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                          {heroTaxResult.effectiveRate}%
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/income-tax-calculator?grossIncome=${heroTaxSalary}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      <span>Open Full Section 115BAC Engine</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: 7 STATUTORY FINANCIAL SUITES (INTERACTIVE MATRIX) */}
      <section className="py-12 lg:py-16 border-b border-white/[0.08]">
        <div className="wrap">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Institutional Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Statutory Financial Suites
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md md:text-right">
              Navigate across India's 7 statutory finance disciplines calibrated strictly to parliamentary acts and regulatory guidelines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
            {suites.map((suite) => {
              const IconComp = suite.icon;
              const isSelected = selectedSuite === suite.id;

              return (
                <button
                  key={suite.id}
                  type="button"
                  onClick={() => {
                    setSelectedSuite(suite.id);
                    const el = document.getElementById('catalog-matrix');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]'
                      : 'bg-[#080e1a]/80 hover:bg-slate-900 border-white/[0.07] hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                      <IconComp size={16} />
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}>
                      {suite.count}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white truncate mb-0.5">
                    {suite.label}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {suite.desc}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* AdSense Slot (Clean & Collapsible) */}
      <div className="wrap">
        <AdSenseSlot slotId="home-mid-banner" />
      </div>

      {/* SECTION 3: COMPLETE 50-CALCULATOR DIRECTORY (PRECISION ENGINE CARDS) */}
      <section className="py-12 lg:py-18" id="catalog-matrix">
        <div className="wrap">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Active Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedSuite === 'All' ? 'All 50 Computation Engines' : `${selectedSuite} Engines`}
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Displaying <span className="text-white font-bold">{filteredCalculators.length}</span> of 50 sovereign engines
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredCalculators.length === 0 ? (
            <div className="p-12 text-center fin-card max-w-lg mx-auto">
              <Calculator size={36} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Engines Found</h3>
              <p className="text-xs text-slate-400 mb-4">
                We couldn't find any tool matching "{searchQuery}". Try searching for general terms like "loan", "tax", "sip", or "salary".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedSuite('All'); }}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Reset Filter Matrix
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCalculators.map((c, index) => (
                <Link
                  key={c.id}
                  to={`/${c.slug}`}
                  className="fin-card fin-card-interactive p-5.5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Engine Identifier Bar */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 tracking-wider">
                        ENG-{String(index + 1).padStart(2, '0')} · {c.categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">FY 25–26</span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                      {c.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {c.shortDesc}
                    </p>
                  </div>

                  {/* Card Bottom: Statute & Action */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 truncate max-w-[190px]">
                      {c.statute}
                    </span>
                    <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Launch</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: STATUTORY RESEARCH & EDITORIAL METHODOLOGY */}
      <section className="py-12 lg:py-16 border-t border-white/[0.08] bg-[#02050e]">
        <div className="wrap">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Methodological Papers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Financial Research &amp; Regulatory Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Deterministic research briefs on compounding mathematical equations, Section 115BAC marginal tax relief, and gratuity ceiling mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map(article => (
              <div key={article.id} className="fin-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                    <span className="text-emerald-400 font-semibold">{article.tag}</span>
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
                <div className="text-xs text-slate-400 font-medium flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <span>By {article.author}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Peer Reviewed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Placement */}
      <div className="wrap">
        <AdSenseSlot slotId="home-bottom-banner" />
      </div>

    </div>
  );
}
