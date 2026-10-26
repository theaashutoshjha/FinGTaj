import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  ChevronDown,
  Layers,
  Zap,
  Home as HomeIcon,
  Umbrella,
  PieChart,
  Wrench,
  Users
} from 'lucide-react';
import { CALCULATORS_DATA, formatINR } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import AdSenseSlot from '../components/AdSenseSlot';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuite, setSelectedSuite] = useState<string>('All');

  // Interactive Live Calculator Preview Deck State
  const [activeEngine, setActiveEngine] = useState<'sip' | 'loan' | 'tax' | 'gratuity'>('sip');
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);

  // SIP inputs
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipYears, setSipYears] = useState(15);
  const [sipReturn, setSipReturn] = useState(12);

  // Loan inputs
  const [loanPrincipal, setLoanPrincipal] = useState(5000000); // 50 Lakhs
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Tax inputs
  const [taxSalary, setTaxSalary] = useState(1500000); // 15 Lakhs

  // Gratuity inputs
  const [gratuityBasic, setGratuityBasic] = useState(60000);
  const [gratuityYears, setGratuityYears] = useState(10);

  useEffect(() => {
    document.title = 'FingTaj — Smart Financial Calculators for Indian Taxpayers & Planners';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Accurate, rule-based calculators for home loans, EMIs, taxes, investments, retirement, wealth planning and more. Updated with latest Indian rules (RBI, CBDT, SEBI, PFRDA).');
    }
  }, []);

  // Compute Live SIP Result
  const sipResult = useMemo(() => {
    const r = (sipReturn / 100) / 12;
    const n = sipYears * 12;
    const invested = sipAmount * n;
    const total = Math.round(sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const gains = total - invested;
    return { invested, total, gains };
  }, [sipAmount, sipYears, sipReturn]);

  // Compute Live Loan Result
  const loanResult = useMemo(() => {
    const r = (loanRate / 100) / 12;
    const n = loanTenure * 12;
    const emi = Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanPrincipal;
    return { emi, totalInterest, totalPayable };
  }, [loanPrincipal, loanRate, loanTenure]);

  // Compute Live Tax Result (Section 115BAC)
  const taxResult = useMemo(() => {
    const standardDeduction = 75000;
    const taxable = Math.max(0, taxSalary - standardDeduction);
    let tax = 0;
    if (taxable <= 300000) tax = 0;
    else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
    else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
    else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
    else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
    else tax = 140000 + (taxable - 1500000) * 0.30;

    if (taxable <= 700000) tax = 0; // Section 87A rebate
    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;
    return { totalTax, taxableIncome: taxable };
  }, [taxSalary]);

  // Compute Live Gratuity Result
  const gratuityResult = useMemo(() => {
    const raw = Math.round((gratuityBasic * 15 * gratuityYears) / 26);
    const payable = Math.min(2000000, raw);
    return { payable, raw };
  }, [gratuityBasic, gratuityYears]);

  // Categories list matching reference design
  const categoryCards = [
    {
      id: 'Loans',
      title: 'Loans & EMI',
      count: '8 Calculators',
      bgClass: 'bg-[#eef6ff]',
      borderClass: 'border-blue-100',
      iconClass: 'text-[#2563eb]',
      btnBg: 'bg-white text-[#2563eb] shadow-xs group-hover:bg-[#2563eb] group-hover:text-white',
      icon: HomeIcon,
      targetSuite: 'Loans'
    },
    {
      id: 'Investing',
      title: 'Wealth & Investments',
      count: '9 Calculators',
      bgClass: 'bg-[#eafaf1]',
      borderClass: 'border-emerald-100',
      iconClass: 'text-[#10b981]',
      btnBg: 'bg-white text-[#10b981] shadow-xs group-hover:bg-[#10b981] group-hover:text-white',
      icon: TrendingUp,
      targetSuite: 'Investing'
    },
    {
      id: 'Tax',
      title: 'Tax & Compliance',
      count: '8 Calculators',
      bgClass: 'bg-[#fef0f0]',
      borderClass: 'border-rose-100',
      iconClass: 'text-[#f43f5e]',
      btnBg: 'bg-white text-[#f43f5e] shadow-xs group-hover:bg-[#f43f5e] group-hover:text-white',
      icon: Percent,
      targetSuite: 'Tax'
    },
    {
      id: 'Retirement',
      title: 'Retirement & EPF',
      count: '6 Calculators',
      bgClass: 'bg-[#fff7eb]',
      borderClass: 'border-amber-100',
      iconClass: 'text-[#f59e0b]',
      btnBg: 'bg-white text-[#f59e0b] shadow-xs group-hover:bg-[#f59e0b] group-hover:text-white',
      icon: Umbrella,
      targetSuite: 'Retirement'
    },
    {
      id: 'Everyday',
      title: 'Financial Planning',
      count: '6 Calculators',
      bgClass: 'bg-[#f6f1fd]',
      borderClass: 'border-purple-100',
      iconClass: 'text-[#8b5cf6]',
      btnBg: 'bg-white text-[#8b5cf6] shadow-xs group-hover:bg-[#8b5cf6] group-hover:text-white',
      icon: PieChart,
      targetSuite: 'Everyday'
    },
    {
      id: 'Salary',
      title: 'Utilities',
      count: '6 Calculators',
      bgClass: 'bg-[#fff1f2]',
      borderClass: 'border-rose-100',
      iconClass: 'text-[#f43f5e]',
      btnBg: 'bg-white text-[#f43f5e] shadow-xs group-hover:bg-[#f43f5e] group-hover:text-white',
      icon: Wrench,
      targetSuite: 'Salary'
    }
  ];

  // Popular calculators matching reference design
  const popularCalculators = [
    {
      slug: 'home-loan-emi-calculator',
      title: 'Home Loan EMI Calculator',
      description: 'Calculate your monthly EMI, total interest and amortization schedule.',
      tag: 'Most Used',
      tagColor: 'bg-blue-50 text-blue-600',
      icon: HomeIcon,
      iconColor: 'text-[#2563eb]',
      iconBg: 'bg-blue-50'
    },
    {
      slug: 'sip-calculator',
      title: 'SIP Calculator',
      description: 'Estimate future value of your SIP investments with step-up options.',
      tag: 'Popular',
      tagColor: 'bg-emerald-50 text-emerald-700',
      icon: TrendingUp,
      iconColor: 'text-[#10b981]',
      iconBg: 'bg-emerald-50'
    },
    {
      slug: 'income-tax-calculator',
      title: 'Income Tax Calculator',
      description: 'Calculate tax liability under new & old regime (AY 2026–27).',
      tag: 'Tax 2026',
      tagColor: 'bg-blue-50 text-blue-600',
      icon: Percent,
      iconColor: 'text-[#f43f5e]',
      iconBg: 'bg-rose-50'
    },
    {
      slug: 'gratuity-calculator',
      title: 'Gratuity Calculator',
      description: 'Calculate gratuity as per Payment of Gratuity Act, 1972.',
      tag: 'Important',
      tagColor: 'bg-rose-50 text-rose-600',
      icon: Users,
      iconColor: 'text-[#8b5cf6]',
      iconBg: 'bg-purple-50'
    }
  ];

  // Filtered calculators for the full directory
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog-matrix');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      
      {/* 1. HERO SECTION (1-TO-1 MATCH WITH REFERENCE IMAGE) */}
      <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-[#f8fafc] via-[#f0f4f9] to-[#f4f7fb] border-b border-slate-200/60 overflow-hidden">
        <div className="wrap">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Column: Hero Proposition + Search + 4 Badges */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Built for India Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
                  <span className="text-sm">🇮🇳</span>
                  <span>Built for India</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600">50+ Calculators</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-normal">Always Free</span>
                </div>

                {/* Display Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.14] [text-wrap:balance]">
                  Smart Financial Calculators <br className="hidden sm:inline" />
                  for <span className="text-[#2563eb]">Indian Taxpayers</span> &amp; Planners
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-[15px] text-slate-600 max-w-xl leading-relaxed">
                  Accurate, rule-based calculators for home loans, EMIs, taxes, investments, retirement, wealth planning and more. Updated with latest Indian rules (RBI, CBDT, SEBI, PFRDA) — simple, fast and reliable.
                </p>

                {/* Search Bar (Oversized White Pill with Blue Arrow Button) */}
                <form onSubmit={handleSearchSubmit} className="pt-2">
                  <div className="relative max-w-xl flex items-center bg-white rounded-full border border-slate-200/90 shadow-sm pl-5 pr-2 py-2 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Search size={18} className="text-slate-400 shrink-0 mr-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search calculators (e.g. SIP, Home Loan, Income Tax, FD, PPF, Gratuity...)"
                      className="w-full bg-transparent text-slate-800 text-xs sm:text-sm outline-none placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded mr-1"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="submit"
                      aria-label="Search calculators"
                      className="w-10 h-10 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* 4 Stat Badges (Mint, Purple, Amber, Rose) */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* 1: 50+ Calculators */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">50+</div>
                    <div className="text-[11px] font-semibold text-slate-700">Calculators</div>
                    <div className="text-[10px] text-slate-500">All in One Platform</div>
                  </div>
                </div>

                {/* 2: 0ms Server Latency */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center shrink-0">
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">0ms</div>
                    <div className="text-[11px] font-semibold text-slate-700">Server Latency</div>
                    <div className="text-[10px] text-slate-500">Blazing Fast</div>
                  </div>
                </div>

                {/* 3: 100% Rule-Based */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">100%</div>
                    <div className="text-[11px] font-semibold text-slate-700">Rule-Based</div>
                    <div className="text-[10px] text-slate-500">Trusted Formulas</div>
                  </div>
                </div>

                {/* 4: Free For Everyone */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight">Free</div>
                    <div className="text-[11px] font-semibold text-slate-700">For Everyone</div>
                    <div className="text-[10px] text-slate-500">No Login Required</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Calculator Preview Card + 3D Growth Art Side Card */}
            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Card 1: Interactive Live Calculator Preview */}
              <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Top Bar with Dropdown Switcher */}
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <TrendingUp size={14} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Live Calculator Preview
                      </span>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setEngineDropdownOpen(!engineDropdownOpen)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <span>
                          {activeEngine === 'sip' && 'SIP Calculator'}
                          {activeEngine === 'loan' && 'Home Loan EMI'}
                          {activeEngine === 'tax' && 'Income Tax (115BAC)'}
                          {activeEngine === 'gratuity' && 'Gratuity Calculator'}
                        </span>
                        <ChevronDown size={12} className="text-slate-400" />
                      </button>

                      {engineDropdownOpen && (
                        <div 
                          className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs"
                          onMouseLeave={() => setEngineDropdownOpen(false)}
                        >
                          <button
                            type="button"
                            onClick={() => { setActiveEngine('sip'); setEngineDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-medium ${activeEngine === 'sip' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            SIP Calculator
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveEngine('loan'); setEngineDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-medium ${activeEngine === 'loan' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            Home Loan EMI
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveEngine('tax'); setEngineDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-medium ${activeEngine === 'tax' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            Income Tax (115BAC)
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveEngine('gratuity'); setEngineDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-medium ${activeEngine === 'gratuity' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            Gratuity Calculator
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TAB 1: SIP CALCULATOR PREVIEW */}
                  {activeEngine === 'sip' && (
                    <div className="space-y-3.5">
                      {/* Monthly Investment */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Monthly Investment</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            ₹{sipAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1000}
                          max={100000}
                          step={1000}
                          value={sipAmount}
                          onChange={(e) => setSipAmount(Number(e.target.value))}
                        />
                      </div>

                      {/* Time Horizon */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Time Horizon</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            {sipYears} Years
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={1}
                          value={sipYears}
                          onChange={(e) => setSipYears(Number(e.target.value))}
                        />
                      </div>

                      {/* Expected Return */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Expected Return (p.a.)</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            {sipReturn}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={25}
                          step={0.5}
                          value={sipReturn}
                          onChange={(e) => setSipReturn(Number(e.target.value))}
                        />
                      </div>

                      {/* Output Callout Box (Mint Green) */}
                      <div className="bg-[#eafaf1] border border-[#a7f3d0] rounded-xl p-3.5 mt-2">
                        <div className="text-[11px] font-semibold text-[#047857] uppercase tracking-wide">
                          Estimated Future Value
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-[#059669] tracking-tight mt-0.5">
                          {formatINR(sipResult.total)}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-emerald-200/60 font-mono">
                          <span>Total Investment <strong className="text-slate-800">{formatINR(sipResult.invested)}</strong></span>
                          <span>|</span>
                          <span>Total Returns <strong className="text-slate-800">{formatINR(sipResult.gains)}</strong></span>
                        </div>
                      </div>

                      {/* Open Calculator Button */}
                      <Link
                        to={`/sip-calculator?monthlyInvestment=${sipAmount}&years=${sipYears}&expectedReturn=${sipReturn}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition-all shadow-md mt-3"
                      >
                        <span>Open SIP Calculator</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  {/* TAB 2: HOME LOAN EMI PREVIEW */}
                  {activeEngine === 'loan' && (
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Loan Amount</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            ₹{(loanPrincipal / 100000).toFixed(0)} Lakhs
                          </span>
                        </div>
                        <input
                          type="range"
                          min={500000}
                          max={20000000}
                          step={500000}
                          value={loanPrincipal}
                          onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Interest Rate (p.a.)</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            {loanRate}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={6.5}
                          max={15}
                          step={0.1}
                          value={loanRate}
                          onChange={(e) => setLoanRate(Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Tenure (Years)</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            {loanTenure} Years
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={30}
                          step={1}
                          value={loanTenure}
                          onChange={(e) => setLoanTenure(Number(e.target.value))}
                        />
                      </div>

                      <div className="bg-[#eef6ff] border border-[#bfdbfe] rounded-xl p-3.5 mt-2">
                        <div className="text-[11px] font-semibold text-[#1d4ed8] uppercase tracking-wide">
                          Monthly Loan EMI
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-[#2563eb] tracking-tight mt-0.5">
                          ₹{loanResult.emi.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-blue-200/60 font-mono">
                          <span>Principal <strong className="text-slate-800">{formatINR(loanPrincipal)}</strong></span>
                          <span>|</span>
                          <span>Total Interest <strong className="text-slate-800">{formatINR(loanResult.totalInterest)}</strong></span>
                        </div>
                      </div>

                      <Link
                        to={`/home-loan-emi-calculator?loanAmount=${loanPrincipal}&interestRate=${loanRate}&tenureYears=${loanTenure}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition-all shadow-md mt-3"
                      >
                        <span>Open Home Loan Calculator</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  {/* TAB 3: INCOME TAX PREVIEW */}
                  {activeEngine === 'tax' && (
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Annual Gross Salary</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            ₹{(taxSalary / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                        <input
                          type="range"
                          min={400000}
                          max={5000000}
                          step={50000}
                          value={taxSalary}
                          onChange={(e) => setTaxSalary(Number(e.target.value))}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        Default: FY 2025–26 Section 115BAC slabs with ₹75,000 Standard Deduction.
                      </div>

                      <div className="bg-[#fef0f0] border border-[#fecdd3] rounded-xl p-3.5 mt-2">
                        <div className="text-[11px] font-semibold text-[#be123c] uppercase tracking-wide">
                          Tax Liability (New Regime)
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-[#e11d48] tracking-tight mt-0.5">
                          ₹{taxResult.totalTax.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-rose-200/60 font-mono">
                          <span>Taxable Income <strong className="text-slate-800">{formatINR(taxResult.taxableIncome)}</strong></span>
                        </div>
                      </div>

                      <Link
                        to={`/income-tax-calculator?grossIncome=${taxSalary}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition-all shadow-md mt-3"
                      >
                        <span>Open Income Tax Calculator</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  {/* TAB 4: GRATUITY PREVIEW */}
                  {activeEngine === 'gratuity' && (
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Monthly Basic + DA</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            ₹{gratuityBasic.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={15000}
                          max={300000}
                          step={5000}
                          value={gratuityBasic}
                          onChange={(e) => setGratuityBasic(Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-600 font-medium">Years of Service</span>
                          <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono text-xs">
                            {gratuityYears} Years
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={40}
                          step={1}
                          value={gratuityYears}
                          onChange={(e) => setGratuityYears(Number(e.target.value))}
                        />
                      </div>

                      <div className="bg-[#f6f1fd] border border-[#e9d5ff] rounded-xl p-3.5 mt-2">
                        <div className="text-[11px] font-semibold text-[#6b21a8] uppercase tracking-wide">
                          Gratuity Payable
                        </div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-[#7e22ce] tracking-tight mt-0.5">
                          {formatINR(gratuityResult.payable)}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1.5 pt-1.5 border-t border-purple-200/60 font-mono">
                          Payment of Gratuity Act 1972 · Max ₹20 Lakh statutory cap
                        </div>
                      </div>

                      <Link
                        to={`/gratuity-calculator?basicSalary=${gratuityBasic}&tenureYears=${gratuityYears}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition-all shadow-md mt-3"
                      >
                        <span>Open Gratuity Calculator</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                </div>
              </div>

              {/* Card 2: 3D Visual "Plan Calculate Grow Your Tomorrow" Art Card */}
              <div className="md:col-span-4 rounded-2xl bg-gradient-to-b from-[#e0f2fe] via-[#ecfdf5] to-[#f0fdf4] border border-blue-100 p-5 flex flex-col justify-between shadow-xs relative overflow-hidden min-h-[360px]">
                {/* Background ambient lighting */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-300/30 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-300/30 blur-2xl pointer-events-none" />

                {/* Top Title Script */}
                <div className="relative z-10">
                  <div className="text-xl sm:text-2xl font-serif italic text-slate-800 leading-snug tracking-tight">
                    Plan <br />
                    Calculate <br />
                    Grow <br />
                    <span className="not-italic font-sans text-xs sm:text-sm font-bold text-slate-600 block mt-0.5">
                      Your Tomorrow
                    </span>
                  </div>
                </div>

                {/* Center SVG 3D Isometric Illustration */}
                <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                  <svg viewBox="0 0 200 160" className="w-full max-w-[170px] drop-shadow-md" fill="none">
                    {/* Floor Shadow */}
                    <ellipse cx="100" cy="135" rx="75" ry="18" fill="rgba(15, 23, 42, 0.08)" />

                    {/* Pillar 1: Lavender (Small) */}
                    <path d="M40 100 L60 90 L80 100 L60 110 Z" fill="#c084fc" opacity="0.9" />
                    <path d="M40 100 L60 110 L60 130 L40 120 Z" fill="#a855f7" />
                    <path d="M80 100 L60 110 L60 130 L80 120 Z" fill="#9333ea" />

                    {/* Pillar 2: Amber (Medium) */}
                    <path d="M75 75 L95 65 L115 75 L95 85 Z" fill="#fde047" opacity="0.9" />
                    <path d="M75 75 L95 85 L95 130 L75 120 Z" fill="#eab308" />
                    <path d="M115 75 L95 85 L95 130 L115 120 Z" fill="#ca8a04" />

                    {/* Pillar 3: Cyan/Blue (Tall) */}
                    <path d="M110 50 L130 40 L150 50 L130 60 Z" fill="#67e8f9" opacity="0.9" />
                    <path d="M110 50 L130 60 L130 130 L110 120 Z" fill="#06b6d4" />
                    <path d="M150 50 L130 60 L130 130 L150 120 Z" fill="#0891b2" />

                    {/* Curving 3D Green Arrow */}
                    <path 
                      d="M35 120 C 50 105, 80 85, 120 50 C 140 32, 155 25, 165 20" 
                      stroke="#10b981" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    <path 
                      d="M35 120 C 50 105, 80 85, 120 50 C 140 32, 155 25, 165 20" 
                      stroke="#34d399" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    {/* Arrowhead */}
                    <polygon points="172,12 148,22 165,36" fill="#059669" />
                    <polygon points="170,14 150,22 163,33" fill="#10b981" />

                    {/* Small Plant Pot */}
                    <ellipse cx="165" cy="125" rx="10" ry="4" fill="#64748b" />
                    <path d="M157 125 L160 135 L170 135 L173 125 Z" fill="#cbd5e1" />
                    {/* Plant Leaves */}
                    <path d="M165 124 C162 118, 158 116, 154 118 C158 122, 163 123, 165 124 Z" fill="#22c55e" />
                    <path d="M165 124 C168 116, 172 115, 175 117 C172 121, 167 122, 165 124 Z" fill="#16a34a" />
                    <path d="M165 124 C165 114, 163 110, 165 106 C167 110, 166 116, 165 124 Z" fill="#4ade80" />
                  </svg>
                </div>

                {/* Bottom Indian Flag Pill */}
                <div className="relative z-10">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-full py-1.5 px-3 shadow-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="text-sm">🇮🇳</span>
                      <span className="truncate text-[11px] leading-tight">
                        For a Stronger <br />Financial India
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. BROWSE CALCULATORS BY CATEGORY (6 PASTEL CARDS MATCHING REFERENCE) */}
      <section className="py-10 lg:py-14 bg-white border-b border-slate-200/60">
        <div className="wrap">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Browse Calculators by Category
            </h2>
            <button
              type="button"
              onClick={() => {
                setSelectedSuite('All');
                const el = document.getElementById('catalog-matrix');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 6 Pastel Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedSuite(cat.targetSuite);
                    const el = document.getElementById('catalog-matrix');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`${cat.bgClass} border ${cat.borderClass} rounded-2xl p-4 sm:p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between min-h-[140px]`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mb-3">
                    <Icon size={20} className={cat.iconClass} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {cat.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                      <span>{cat.count}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cat.btnBg} transition-colors`}>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. POPULAR CALCULATORS (4 WHITE CARDS MATCHING REFERENCE) */}
      <section className="py-10 lg:py-14 bg-[#f8fafc] border-b border-slate-200/60">
        <div className="wrap">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Most used tools by Indian taxpayers &amp; planners
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSuite('All');
                const el = document.getElementById('catalog-matrix');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularCalculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.slug}
                  to={`/${calc.slug}`}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Icon + Tag + Arrow */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${calc.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon size={20} className={calc.iconColor} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${calc.tagColor}`}>
                          {calc.tag}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                      {calc.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* Clean AdSense Slot */}
      <div className="wrap my-4">
        <AdSenseSlot slotId="home-mid-banner" />
      </div>

      {/* 4. ALL 50 CALCULATORS CATALOG DIRECTORY */}
      <section className="py-10 lg:py-16" id="catalog-matrix">
        <div className="wrap">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] font-mono block mb-1">
                Full Financial Engine Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {selectedSuite === 'All' ? 'All 50 Statutory Calculators' : `${selectedSuite} Calculators`}
              </h2>
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All', 'Loans', 'Investing', 'Tax', 'Retirement', 'Everyday', 'Salary'].map(suite => (
                <button
                  key={suite}
                  type="button"
                  onClick={() => setSelectedSuite(suite)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSuite === suite
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {suite === 'All' ? 'All (50)' : suite}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredCalculators.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-xs">
              <Calculator size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Calculators Found</h3>
              <p className="text-xs text-slate-500 mb-4">
                We couldn't find any tool matching "{searchQuery}". Try searching for general terms like "loan", "tax", "sip", or "salary".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedSuite('All'); }}
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8]"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCalculators.map((c, index) => (
                <Link
                  key={c.id}
                  to={`/${c.slug}`}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[11px] font-mono font-semibold text-blue-600">
                        {c.categoryLabel}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                      {c.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {c.shortDesc}
                    </p>
                  </div>

                  {/* Card Bottom: Statute & Launch Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 truncate max-w-[190px]">
                      {c.statute}
                    </span>
                    <span className="text-blue-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Open</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. EDITORIAL GUIDES & RESEARCH */}
      <section className="py-12 bg-white border-t border-slate-200/70">
        <div className="wrap">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Financial Guides &amp; Regulatory Methodology
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Formulas calibrated directly to Indian Central Board of Direct Taxes (CBDT) and Reserve Bank of India (RBI) directives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ARTICLES.slice(0, 3).map(article => (
              <div key={article.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="text-blue-600 font-bold">{article.tag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="text-xs text-slate-500 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span>By {article.author}</span>
                  <span className="text-emerald-700 font-medium">Peer Reviewed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom AdSense Unit */}
      <div className="wrap my-4">
        <AdSenseSlot slotId="home-bottom-banner" />
      </div>

    </div>
  );
}
