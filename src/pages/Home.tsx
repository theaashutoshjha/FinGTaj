import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Home as HomeIcon,
  Percent, 
  Users,
  Shield, 
  Flame, 
  Search, 
  ArrowRight, 
  Star, 
  SlidersHorizontal,
  FileText,
  Clock,
  Sparkles,
  PieChart,
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import { CALCULATORS_DATA, formatINR, formatINRWords } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fingtaj_favorites');
      return stored ? JSON.parse(stored) : ['home-loan-emi-calculator', 'sip-calculator', 'income-tax-calculator'];
    } catch {
      return ['home-loan-emi-calculator', 'sip-calculator', 'income-tax-calculator'];
    }
  });

  const toggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('fingtaj_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // SEO synchronization
  useEffect(() => {
    document.title = 'FingTaj — 50 Statutory & Financial Calculators for India';
  }, []);

  // Simulator state
  type EngineType = 'sip' | 'loan' | 'tax' | 'gratuity';
  const [activeEngine, setActiveEngine] = useState<EngineType>('sip');

  // SIP inputs
  const [sipAmount, setSipAmount] = useState(15000);
  const [sipYears, setSipYears] = useState(15);
  const [sipReturn, setSipReturn] = useState(12);

  // Loan inputs
  const [loanPrincipal, setLoanPrincipal] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Tax inputs
  const [taxSalary, setTaxSalary] = useState(1800000);

  // Gratuity inputs
  const [gratuityBasic, setGratuityBasic] = useState(75000);
  const [gratuityYears, setGratuityYears] = useState(12);

  // Calculations
  const sipOutcome = useMemo(() => {
    const r = (sipReturn / 100) / 12;
    const n = sipYears * 12;
    const invested = sipAmount * n;
    const total = Math.round(sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const gains = total - invested;
    return { invested, total, gains };
  }, [sipAmount, sipYears, sipReturn]);

  const loanOutcome = useMemo(() => {
    const r = (loanRate / 100) / 12;
    const n = loanTenure * 12;
    const emi = Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanPrincipal;
    return { emi, totalInterest, totalPayable };
  }, [loanPrincipal, loanRate, loanTenure]);

  const taxOutcome = useMemo(() => {
    const standardDeduction = 75000;
    const taxable = Math.max(0, taxSalary - standardDeduction);
    let tax = 0;
    if (taxable <= 300000) tax = 0;
    else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
    else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
    else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
    else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
    else tax = 140000 + (taxable - 1500000) * 0.30;
    if (taxable <= 700000) tax = 0;
    const cess = Math.round(tax * 0.04);
    return { totalTax: tax + cess, taxable };
  }, [taxSalary]);

  const gratuityOutcome = useMemo(() => {
    const raw = Math.round((gratuityBasic * 15 * gratuityYears) / 26);
    return { payable: Math.min(2000000, raw), raw };
  }, [gratuityBasic, gratuityYears]);

  // Catalog Filtering
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS_DATA.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesQuery = !q || 
        tool.title.toLowerCase().includes(q) || 
        tool.shortDesc.toLowerCase().includes(q) || 
        tool.statute.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Color helper for badges
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Loans':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Investing':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Tax':
        return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      case 'Retirement':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen text-slate-100 pb-16">
      
      {/* 1. HERO TITLE & QUICK LAUNCH BAR */}
      <section className="wrap pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          Precision Financial Modeling, Zero Compromise.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
          Client-side privacy for institutional precision and statutory financial calculation.
        </p>

        {/* Quick-Launch Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Quick-Launch</span>
          {[
            { id: 'sip', name: 'SIP Wealth' },
            { id: 'loan', name: 'Home Loan EMI' },
            { id: 'tax', name: 'Income Tax 115BAC' },
            { id: 'gratuity', name: 'Gratuity (1972)' },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveEngine(item.id as EngineType)}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                activeEngine === item.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.5)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      {/* 2. INTERACTIVE SIMULATOR CARD */}
      <section className="wrap mb-14">
        <div className="rounded-2xl bg-[#0c1222] border border-slate-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: 3 Input Columns side-by-side */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeEngine === 'sip' && 'Interactive SIP Simulator'}
                {activeEngine === 'loan' && 'Interactive Home Loan EMI Simulator'}
                {activeEngine === 'tax' && 'Interactive Section 115BAC Tax Simulator'}
                {activeEngine === 'gratuity' && 'Interactive Gratuity Simulator'}
              </h2>

              {/* SIP ENGINE 3 COLUMNS */}
              {activeEngine === 'sip' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Col 1: Monthly Investment */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Monthly Investment</span>
                    <div className="text-xl font-bold font-tabular text-white">{formatINR(sipAmount)}</div>
                    <input
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>₹1k</span>
                      <span>₹100k</span>
                    </div>
                  </div>

                  {/* Col 2: Horizon */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Investment Horizon</span>
                    <div className="text-xl font-bold font-tabular text-white">{sipYears} Years</div>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      step={1}
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>1 Yr</span>
                      <span>35 Yrs</span>
                    </div>
                  </div>

                  {/* Col 3: Return */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Expected Annual Return</span>
                    <div className="text-xl font-bold font-tabular text-white">{sipReturn}% p.a.</div>
                    <input
                      type="range"
                      min={6}
                      max={24}
                      step={0.5}
                      value={sipReturn}
                      onChange={(e) => setSipReturn(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>6%</span>
                      <span>24%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* LOAN ENGINE 3 COLUMNS */}
              {activeEngine === 'loan' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Loan Principal</span>
                    <div className="text-xl font-bold font-tabular text-white">{formatINR(loanPrincipal)}</div>
                    <input
                      type="range"
                      min={500000}
                      max={20000000}
                      step={100000}
                      value={loanPrincipal}
                      onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>₹5L</span>
                      <span>₹2Cr</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Interest Rate</span>
                    <div className="text-xl font-bold font-tabular text-white">{loanRate}% p.a.</div>
                    <input
                      type="range"
                      min={6.5}
                      max={15}
                      step={0.1}
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>6.5%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Tenure</span>
                    <div className="text-xl font-bold font-tabular text-white">{loanTenure} Years</div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>1 Yr</span>
                      <span>30 Yrs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAX ENGINE */}
              {activeEngine === 'tax' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Annual Gross CTC</span>
                    <div className="text-xl font-bold font-tabular text-white">{formatINR(taxSalary)}</div>
                    <input
                      type="range"
                      min={300000}
                      max={10000000}
                      step={50000}
                      value={taxSalary}
                      onChange={(e) => setTaxSalary(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex flex-col justify-center text-xs text-slate-400">
                    <span className="text-indigo-400 font-bold mb-1">Union Budget 2024 Slabs</span>
                    Standard deduction of ₹75,000 factored in. Nil tax up to ₹7,75,000 taxable salary.
                  </div>
                </div>
              )}

              {/* GRATUITY ENGINE */}
              {activeEngine === 'gratuity' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Last Drawn Basic + DA</span>
                    <div className="text-xl font-bold font-tabular text-white">{formatINR(gratuityBasic)}</div>
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={5000}
                      value={gratuityBasic}
                      onChange={(e) => setGratuityBasic(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">Service Completed</span>
                    <div className="text-xl font-bold font-tabular text-white">{gratuityYears} Years</div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      step={1}
                      value={gratuityYears}
                      onChange={(e) => setGratuityYears(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Result Card matching Reference Image */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/20 p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                
                {/* Header metrics */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {activeEngine === 'sip' && 'ESTIMATED TOTAL WEALTH'}
                    {activeEngine === 'loan' && 'MONTHLY EQUATED EMI'}
                    {activeEngine === 'tax' && 'TOTAL TAX LIABILITY'}
                    {activeEngine === 'gratuity' && 'ELIGIBLE GRATUITY'}
                  </span>
                  {activeEngine === 'sip' && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Est. Wealth Gain</span>
                      <span className="text-xs font-bold text-emerald-400">+{formatINR(sipOutcome.gains)}</span>
                    </div>
                  )}
                  {activeEngine === 'loan' && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total Interest</span>
                      <span className="text-xs font-bold text-amber-400">{formatINR(loanOutcome.totalInterest)}</span>
                    </div>
                  )}
                </div>

                {/* Main Large Display Number */}
                <div className="text-3xl sm:text-4xl font-black font-tabular text-emerald-400 mb-1">
                  {activeEngine === 'sip' && formatINR(sipOutcome.total)}
                  {activeEngine === 'loan' && formatINR(loanOutcome.emi)}
                  {activeEngine === 'tax' && formatINR(taxOutcome.totalTax)}
                  {activeEngine === 'gratuity' && formatINR(gratuityOutcome.payable)}
                </div>

                {/* Sub-label */}
                <div className="text-xs text-slate-400 mb-3">
                  {activeEngine === 'sip' && `Capital Outlay: ${formatINR(sipOutcome.invested)}`}
                  {activeEngine === 'loan' && `Total Repayment: ${formatINR(loanOutcome.totalPayable)}`}
                  {activeEngine === 'tax' && `Taxable Salary: ${formatINR(taxOutcome.taxable)}`}
                  {activeEngine === 'gratuity' && `Statutory formula: (15 × B × Y) / 26`}
                </div>

                {/* SVG Upward Curved Chart (Visual matches reference image) */}
                <div className="w-full h-24 relative overflow-hidden flex items-end">
                  <svg className="w-full h-20 overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 65 Q 140 60, 220 35 T 300 8 L 300 70 L 0 70 Z"
                      fill="url(#glowArea)"
                    />
                    <path
                      d="M 0 65 Q 140 60, 220 35 T 300 8"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="8" r="4" fill="#34d399" />
                  </svg>
                </div>

                {/* Launch full calculator button */}
                <Link
                  to={
                    activeEngine === 'sip' ? `/sip-calculator?monthlyInvestment=${sipAmount}&years=${sipYears}&expectedReturn=${sipReturn}` :
                    activeEngine === 'loan' ? `/home-loan-emi-calculator?loanAmount=${loanPrincipal}&interestRate=${loanRate}&tenureYears=${loanTenure}` :
                    activeEngine === 'tax' ? `/income-tax-calculator?grossIncome=${taxSalary}` :
                    `/gratuity-calculator?basicSalary=${gratuityBasic}&tenureYears=${gratuityYears}`
                  }
                  className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-center text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Calculation Model</span>
                  <ArrowRight size={13} />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. YOUR PINNED CALCULATORS SECTION */}
      <section className="wrap mb-14">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          YOUR PINNED CALCULATORS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Home Loan */}
          <Link
            to="/home-loan-emi-calculator"
            className="rounded-2xl border border-amber-500/30 bg-[#0f172a]/70 hover:border-amber-400/60 transition-all p-5 flex items-center justify-between group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <HomeIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Home Loan EMI &amp; Tax Benefit Calculator
                </h4>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Calculate</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Card 2: SIP Compounding */}
          <Link
            to="/sip-calculator"
            className="rounded-2xl border border-amber-500/30 bg-[#0f172a]/70 hover:border-amber-400/60 transition-all p-5 flex items-center justify-between group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <PieChart size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  SIP Compounding Calculator
                </h4>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Calculate</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Card 3: Income Tax */}
          <Link
            to="/income-tax-calculator"
            className="rounded-2xl border border-amber-500/30 bg-[#0f172a]/70 hover:border-amber-400/60 transition-all p-5 flex items-center justify-between group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Income Tax Calculator (Old vs New Regime)
                </h4>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Calculate</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. ALL 50 STATUTORY ENGINES (5-COLUMN GRID) */}
      <section className="wrap mb-16" id="catalog-matrix">
        
        {/* Title */}
        <h3 className="text-2xl font-black text-white tracking-tight mb-4">
          All 50 Statutory Engines
        </h3>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All', key: 'All' },
              { label: 'Loans', key: 'Loans' },
              { label: 'Investing', key: 'Investing' },
              { label: 'Tax', key: 'Tax' },
              { label: 'Retirement', key: 'Retirement' },
              { label: 'Everyday', key: 'Everyday' },
            ].map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input with Filter Icon */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search & Filter..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <SlidersHorizontal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTools.map(tool => {
            const isFav = favorites.includes(tool.slug);

            return (
              <Link
                key={tool.id}
                to={`/${tool.slug}`}
                className="rounded-xl bg-[#0b1120] border border-slate-800 hover:border-indigo-500/40 p-4 flex flex-col justify-between transition-all group shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Badge & Star */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(tool.category)}`}>
                      {tool.categoryLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(tool.slug, e)}
                      className={`p-1 transition-colors cursor-pointer ${
                        isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      aria-label="Pin tool"
                    >
                      <Star size={13} className={isFav ? 'fill-amber-400' : ''} />
                    </button>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2 leading-snug">
                    {tool.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {tool.shortDesc}
                  </p>
                </div>

                {/* Bottom Statute & Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 truncate max-w-[95px] font-mono">
                    {tool.statute}
                  </span>
                  <span className="font-semibold text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Calculate</span>
                    <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* 5. RESOURCE & GUIDE ARTICLES */}
      <section className="wrap mb-16">
        <h3 className="text-xl font-bold text-white mb-1">
          Resource &amp; Guide Articles
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          E-E-A-T Verified Financial Insights · Editorial
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.slice(0, 3).map(article => (
            <div 
              key={article.id} 
              className="rounded-2xl bg-[#0b1120] border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={13} />
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
