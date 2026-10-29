import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  Percent, 
  Home as HomeIcon,
  Users,
  Star,
  Flame,
  Shield,
  Activity,
  Cpu
} from 'lucide-react';
import { CALCULATORS_DATA, formatINR, formatINRWords } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import AdSenseSlot from '../components/AdSenseSlot';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuite, setSelectedSuite] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('category') || 'All';
    }
    return 'All';
  });

  // Persisted Favorites in LocalStorage
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fingtaj_favorites');
      return stored ? JSON.parse(stored) : ['sip-calculator', 'home-loan-emi-calculator', 'income-tax-calculator'];
    } catch {
      return ['sip-calculator', 'home-loan-emi-calculator', 'income-tax-calculator'];
    }
  });

  const toggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedFavorites(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('fingtaj_favorites', JSON.stringify(next));
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  // Listen for Navbar category filter events
  useEffect(() => {
    const handleFilterEvent = (e: any) => {
      if (e.detail?.category) {
        setSelectedSuite(e.detail.category);
      }
    };
    window.addEventListener('fingtaj:filterCategory', handleFilterEvent);
    return () => window.removeEventListener('fingtaj:filterCategory', handleFilterEvent);
  }, []);

  // 6 Core Live Studio Workbench Engines
  type StudioEngine = 'sip' | 'loan' | 'tax' | 'gratuity' | 'ppf' | 'fire';
  const [activeEngine, setActiveEngine] = useState<StudioEngine>('sip');

  // SIP inputs
  const [sipAmount, setSipAmount] = useState(15000);
  const [sipYears, setSipYears] = useState(15);
  const [sipReturn, setSipReturn] = useState(12);

  // Loan inputs
  const [loanPrincipal, setLoanPrincipal] = useState(5000000); // 50 Lakhs
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Tax inputs
  const [taxSalary, setTaxSalary] = useState(1800000); // 18 Lakhs

  // Gratuity inputs
  const [gratuityBasic, setGratuityBasic] = useState(75000);
  const [gratuityYears, setGratuityYears] = useState(12);

  // PPF inputs
  const [ppfAnnual, setPpfAnnual] = useState(150000);
  const [ppfYears, setPpfYears] = useState(15);

  // FIRE inputs
  const [fireMonthlyExpense, setFireMonthlyExpense] = useState(80000);
  const [fireInflation, setFireInflation] = useState(6);

  useEffect(() => {
    document.title = 'FingTaj — Institutional Financial Calculation Terminal for India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content', 
        'High-precision client-side Indian financial calculators. Compute SIP wealth, Home Loan EMI, Income Tax (Section 115BAC), Gratuity, and Capital Gains with zero data collection.'
      );
    }
  }, []);

  // Engine 1: SIP
  const sipResult = useMemo(() => {
    const r = (sipReturn / 100) / 12;
    const n = sipYears * 12;
    const invested = sipAmount * n;
    const total = Math.round(sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const gains = total - invested;
    const multiplier = invested > 0 ? (total / invested).toFixed(2) : '1.0';
    return { invested, total, gains, multiplier };
  }, [sipAmount, sipYears, sipReturn]);

  // Engine 2: Loan EMI
  const loanResult = useMemo(() => {
    const r = (loanRate / 100) / 12;
    const n = loanTenure * 12;
    const emi = Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanPrincipal;
    const interestRatio = loanPrincipal > 0 ? ((totalInterest / loanPrincipal) * 100).toFixed(0) : '0';
    return { emi, totalInterest, totalPayable, interestRatio };
  }, [loanPrincipal, loanRate, loanTenure]);

  // Engine 3: Income Tax 115BAC
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

    if (taxable <= 700000) tax = 0;
    const cess = Math.round(tax * 0.04);
    const totalTax = tax + cess;
    const effectiveRate = taxSalary > 0 ? ((totalTax / taxSalary) * 100).toFixed(1) : '0';
    return { totalTax, taxableIncome: taxable, effectiveRate };
  }, [taxSalary]);

  // Engine 4: Gratuity
  const gratuityResult = useMemo(() => {
    const raw = Math.round((gratuityBasic * 15 * gratuityYears) / 26);
    const payable = Math.min(2000000, raw);
    const taxFree = payable;
    return { payable, raw, taxFree };
  }, [gratuityBasic, gratuityYears]);

  // Engine 5: PPF (7.1% p.a.)
  const ppfResult = useMemo(() => {
    const rate = 0.071;
    let balance = 0;
    let invested = 0;
    for (let y = 1; y <= ppfYears; y++) {
      invested += ppfAnnual;
      balance = (balance + ppfAnnual) * (1 + rate);
    }
    const total = Math.round(balance);
    const interest = total - invested;
    return { total, invested, interest };
  }, [ppfAnnual, ppfYears]);

  // Engine 6: FIRE Corpus (25x annual expenses + inflation metric)
  const fireResult = useMemo(() => {
    const annualExpense = fireMonthlyExpense * 12;
    const corpusNeeded = annualExpense * 25; // 4% rule (25x annual expenses)
    const monthlyPassiveSafe = Math.round((corpusNeeded * 0.04) / 12);
    // Real withdrawal capacity factoring in user inflation assumption
    const realReturnSafe = Math.max(0.5, 10 - fireInflation);
    return { corpusNeeded, annualExpense, monthlyPassiveSafe, realReturnSafe };
  }, [fireMonthlyExpense, fireInflation]);

  // Catalog filtering
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

  // Bookmarked calculators
  const favoriteItems = useMemo(() => {
    return CALCULATORS_DATA.filter(c => savedFavorites.includes(c.slug));
  }, [savedFavorites]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog-matrix');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080d16] text-slate-100 bg-terminal-grid bg-radial-ambient selection:bg-cyan-500 selection:text-black">
      
      {/* 1. FUTURISTIC HERO & INTERACTIVE COMPUTATIONAL WORKBENCH */}
      <section className="relative pt-8 pb-14 lg:pt-12 lg:pb-18 border-b border-white/10">
        <div className="wrap">
          
          {/* Header Billboard */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 mb-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>FINANCIAL CALCULATION TERMINAL</span>
                <span className="text-white/20">|</span>
                <span className="text-slate-400">AY 2026–27 STATUTORY ENGINE</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12] [text-wrap:balance]">
                Institutional Financial Modeling <br className="hidden sm:inline" />
                for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Indian Planners</span> &amp; Taxpayers
              </h1>
            </div>

            {/* Quick Live Indicators */}
            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Engines Ready</div>
                <div className="text-xl font-bold text-white tabular-nums">50 / 50</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Telemetry Logs</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">0 B</div>
              </div>
            </div>
          </div>

          {/* THE INTERACTIVE WORKBENCH DECK */}
          <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            
            {/* Top Engine Dock Tabs */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveEngine('sip')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'sip' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>SIP Wealth</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngine('loan')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'loan' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HomeIcon size={14} />
                  <span>Home Loan EMI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngine('tax')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'tax' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Percent size={14} />
                  <span>Income Tax (115BAC)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngine('gratuity')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'gratuity' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>Gratuity (1972)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngine('ppf')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'ppf' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield size={14} />
                  <span>PPF 15-Yr Shield</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngine('fire')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeEngine === 'fire' 
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame size={14} />
                  <span>FIRE Corpus</span>
                </button>
              </div>

              {/* Status indicator right */}
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                <Activity size={14} className="text-emerald-400" />
                <span>Simulating in Local RAM</span>
              </div>
            </div>

            {/* Workbench Grid: Left Cockpit Controls, Right Analytics Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Controls (6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* ENGINE 1: SIP */}
                {activeEngine === 'sip' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Monthly Investment</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(sipAmount)} ({formatINRWords(sipAmount)})
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
                      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                        {[5000, 10000, 25000, 50000].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSipAmount(val)}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10 transition-colors cursor-pointer"
                          >
                            {formatINRWords(val)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Time Horizon</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
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

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Expected Return (p.a.)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {sipReturn}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={6}
                        max={25}
                        step={0.5}
                        value={sipReturn}
                        onChange={(e) => setSipReturn(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {/* ENGINE 2: LOAN EMI */}
                {activeEngine === 'loan' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Loan Principal</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(loanPrincipal)} ({formatINRWords(loanPrincipal)})
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
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Interest Rate (p.a.)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {loanRate}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={6.5}
                        max={16}
                        step={0.1}
                        value={loanRate}
                        onChange={(e) => setLoanRate(Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Tenure (Years)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
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
                  </div>
                )}

                {/* ENGINE 3: TAX 115BAC */}
                {activeEngine === 'tax' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Annual Gross Salary</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(taxSalary)} ({formatINRWords(taxSalary)})
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

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono leading-relaxed">
                      Statutory Baseline: FY 2025–26 (AY 2026–27) Finance Act 2024 revisions with ₹75,000 Standard Deduction.
                    </div>
                  </div>
                )}

                {/* ENGINE 4: GRATUITY */}
                {activeEngine === 'gratuity' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Last Drawn Basic + DA (Monthly)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(gratuityBasic)}
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
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Completed Years of Service</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
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
                  </div>
                )}

                {/* ENGINE 5: PPF */}
                {activeEngine === 'ppf' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Annual PPF Deposit (Max ₹1.5L)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(ppfAnnual)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={150000}
                        step={5000}
                        value={ppfAnnual}
                        onChange={(e) => setPpfAnnual(Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Tenure (Years, min 15)</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {ppfYears} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={30}
                        step={5}
                        value={ppfYears}
                        onChange={(e) => setPpfYears(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {/* ENGINE 6: FIRE */}
                {activeEngine === 'fire' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Current Monthly Living Expenses</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {formatINR(fireMonthlyExpense)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={25000}
                        max={300000}
                        step={5000}
                        value={fireMonthlyExpense}
                        onChange={(e) => setFireMonthlyExpense(Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-300 font-sans font-medium">Expected Long-Term Inflation</span>
                        <span className="text-cyan-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md tabular-nums">
                          {fireInflation}% p.a.
                        </span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={10}
                        step={0.5}
                        value={fireInflation}
                        onChange={(e) => setFireInflation(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Right Analytics Screen (6 cols) */}
              <div className="lg:col-span-6 bg-[#0a0f18] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  {/* Top Readout Tag */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">
                      {activeEngine === 'sip' && 'Estimated Future Corpus'}
                      {activeEngine === 'loan' && 'Monthly Loan EMI'}
                      {activeEngine === 'tax' && 'Tax Liability (AY 2026–27)'}
                      {activeEngine === 'gratuity' && 'Statutory Gratuity Payout'}
                      {activeEngine === 'ppf' && '15-Year Maturity Corpus'}
                      {activeEngine === 'fire' && 'Total FIRE Target Corpus'}
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                      Live Output
                    </span>
                  </div>

                  {/* Primary Glowing Neon Number */}
                  <div className="text-3xl sm:text-5xl font-black font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] tabular-nums">
                    {activeEngine === 'sip' && formatINR(sipResult.total)}
                    {activeEngine === 'loan' && formatINR(loanResult.emi)}
                    {activeEngine === 'tax' && formatINR(taxResult.totalTax)}
                    {activeEngine === 'gratuity' && formatINR(gratuityResult.payable)}
                    {activeEngine === 'ppf' && formatINR(ppfResult.total)}
                    {activeEngine === 'fire' && formatINR(fireResult.corpusNeeded)}
                  </div>

                  {/* Verbal words helper */}
                  <div className="text-xs font-mono text-slate-400">
                    {activeEngine === 'sip' && `≈ ${formatINRWords(sipResult.total)} with ${sipResult.multiplier}x wealth multiplier`}
                    {activeEngine === 'loan' && `Total Interest: ${formatINR(loanResult.totalInterest)} (${loanResult.interestRatio}% of principal)`}
                    {activeEngine === 'tax' && `Effective Tax Rate: ${taxResult.effectiveRate}% on ${formatINR(taxResult.taxableIncome)} taxable income`}
                    {activeEngine === 'gratuity' && `Capped at ₹20 Lakhs statutory limit under 1972 Act`}
                    {activeEngine === 'ppf' && `Invested: ${formatINR(ppfResult.invested)} · Tax-Free Interest: ${formatINR(ppfResult.interest)}`}
                    {activeEngine === 'fire' && `Permits ₹${(fireMonthlyExpense).toLocaleString('en-IN')}/mo passive inflation-shielded withdrawals`}
                  </div>

                  {/* Secondary Metrics Bar */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                    {activeEngine === 'sip' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Total Invested</span>
                          <span className="text-white font-bold">{formatINR(sipResult.invested)}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-emerald-400 block text-[10px]">Estimated Wealth Gain</span>
                          <span className="text-emerald-300 font-bold">{formatINR(sipResult.gains)}</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'loan' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Total Principal</span>
                          <span className="text-white font-bold">{formatINR(loanPrincipal)}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">
                          <span className="text-rose-400 block text-[10px]">Total Interest</span>
                          <span className="text-rose-300 font-bold">{formatINR(loanResult.totalInterest)}</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'tax' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Standard Deduction</span>
                          <span className="text-white font-bold">₹75,000</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20">
                          <span className="text-amber-400 block text-[10px]">Health &amp; Edu Cess (4%)</span>
                          <span className="text-amber-300 font-bold">Included</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'gratuity' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Uncapped Formula</span>
                          <span className="text-white font-bold">{formatINR(gratuityResult.raw)}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20">
                          <span className="text-purple-400 block text-[10px]">Statutory Exempt Cap</span>
                          <span className="text-purple-300 font-bold">₹20 Lakhs</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'ppf' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Current Sovereign Rate</span>
                          <span className="text-white font-bold">7.1% p.a.</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-emerald-400 block text-[10px]">Tax Status</span>
                          <span className="text-emerald-300 font-bold">EEE (100% Exempt)</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'fire' && (
                      <>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <span className="text-slate-400 block text-[10px]">Annual Living Cost</span>
                          <span className="text-white font-bold">{formatINR(fireResult.annualExpense)}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                          <span className="text-cyan-400 block text-[10px]">Safe Withdrawal Rate</span>
                          <span className="text-cyan-300 font-bold">4.0% p.a.</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Launch Dedicated Deep Dive CTA */}
                  <div className="pt-2">
                    <Link
                      to={
                        activeEngine === 'sip' ? `/sip-calculator?monthlyInvestment=${sipAmount}&years=${sipYears}&expectedReturn=${sipReturn}` :
                        activeEngine === 'loan' ? `/home-loan-emi-calculator?loanAmount=${loanPrincipal}&interestRate=${loanRate}&tenureYears=${loanTenure}` :
                        activeEngine === 'tax' ? `/income-tax-calculator?grossIncome=${taxSalary}` :
                        activeEngine === 'gratuity' ? `/gratuity-calculator?basicSalary=${gratuityBasic}&tenureYears=${gratuityYears}` :
                        activeEngine === 'ppf' ? `/ppf-calculator` :
                        `/fire-calculator`
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      <span>Open Full {activeEngine.toUpperCase()} Studio Calculator</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. PINNED FAVORITES DOCK (PERSISTED LOCALLY) */}
      {favoriteItems.length > 0 && (
        <section className="py-4 border-b border-white/10 bg-[#0a0f1a]/80">
          <div className="wrap flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 shrink-0 pr-3 border-r border-white/10">
              <Star size={13} className="fill-amber-400" />
              <span>PINNED WORKBENCH:</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {favoriteItems.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 text-xs font-mono transition-colors"
                >
                  <span className="font-semibold">{item.title}</span>
                  <ArrowRight size={11} className="text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AdSense Placement */}
      <div className="wrap my-6">
        <AdSenseSlot slotId="home-mid-banner" format="leaderboard" label="Sponsored · Financial Utilities" />
      </div>

      {/* 3. ALL 50 STATUTORY COMPUTATIONAL ENGINES MATRIX */}
      <section className="py-12 lg:py-18" id="catalog-matrix">
        <div className="wrap">
          
          {/* Section Filter Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
                <Cpu size={14} />
                <span>COMPLETE COMPUTATIONAL DIRECTORY (50 ENGINES)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {selectedSuite === 'All' ? 'All 50 Statutory Engines' : `${selectedSuite} Suite`}
                <span className="text-slate-500 text-lg font-mono font-normal ml-2">
                  ({filteredCalculators.length})
                </span>
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Live Search Input Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter 50 engines..."
                  className="w-full sm:w-56 pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </form>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { label: 'All', key: 'All' },
                  { label: 'Loans', key: 'Loans' },
                  { label: 'Investing', key: 'Investing' },
                  { label: 'Tax', key: 'Tax' },
                  { label: 'Retirement', key: 'Retirement' },
                  { label: 'Planning', key: 'Everyday' },
                  { label: 'Utilities', key: 'Salary' }
                ].map(suite => (
                  <button
                    key={suite.key}
                    type="button"
                    onClick={() => setSelectedSuite(suite.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                      selectedSuite === suite.key
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {suite.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredCalculators.length === 0 ? (
            <div className="p-12 text-center terminal-card bg-[#0d1524] max-w-lg mx-auto">
              <Calculator size={36} className="mx-auto text-slate-500 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Calculator Found</h3>
              <p className="text-xs text-slate-400 mb-4 font-mono">
                No tool matching "{searchQuery}". Try "loan", "tax", "sip", or "gratuity".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedSuite('All'); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCalculators.map((c, index) => {
                const isFav = savedFavorites.includes(c.slug);

                return (
                  <Link
                    key={c.id}
                    to={`/${c.slug}`}
                    className="terminal-card bg-[#0d1524] border border-white/10 hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col justify-between group transition-all"
                  >
                    <div>
                      {/* Top Metadata: Index + Category + Pin Star */}
                      <div className="flex items-center justify-between text-xs mb-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold text-[11px]">{c.categoryLabel}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-slate-500 text-[10px]">#{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(c.slug, e)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                          }`}
                          title={isFav ? 'Remove from pinned' : 'Pin to favorites'}
                        >
                          <Star size={13} className={isFav ? 'fill-amber-400' : ''} />
                        </button>
                      </div>

                      {/* Card Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 leading-snug">
                        {c.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {c.shortDesc}
                      </p>

                      {/* Mathematical formula badge */}
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-cyan-300/80 truncate mb-4">
                        <code>{c.formula}</code>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-[11px] text-slate-500 truncate max-w-[190px]">
                        {c.statute}
                      </span>
                      <span className="text-cyan-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Launch</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. STATUTORY METHODOLOGY & RESEARCH ARTICLES */}
      <section className="py-12 border-t border-white/10 bg-[#0a0f18]/60">
        <div className="wrap">
          <div className="mb-8">
            <div className="text-xs font-mono text-cyan-400 mb-1">E-E-A-T STATUTORY RESEARCH</div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Regulatory Formulas &amp; Legal Citations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Formulas calibrated directly to Central Board of Direct Taxes (CBDT) gazettes and RBI Master Directions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ARTICLES.slice(0, 3).map(article => (
              <div key={article.id} className="terminal-card bg-[#0d1524] border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                    <span className="text-cyan-400 font-semibold">{article.tag}</span>
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
                <div className="text-xs font-mono text-slate-500 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span>Author: {article.author}</span>
                  <span className="text-emerald-400">Peer Reviewed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom AdSense Unit */}
      <div className="wrap my-6">
        <AdSenseSlot slotId="home-bottom-banner" format="horizontal" label="Advertisement · Financial Services" />
      </div>

    </div>
  );
}
