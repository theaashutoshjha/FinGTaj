import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Percent, 
  Home as HomeIcon,
  Users,
  Shield,
  Flame,
  Search,
  ArrowRight,
  Star,
  Sparkles,
  CheckCircle2,
  Lock,
  Calculator,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { CALCULATORS_DATA, formatINR, formatINRWords } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import AdSenseSlot from '../components/AdSenseSlot';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('category') || 'All';
    }
    return 'All';
  });

  // LocalStorage Pinned Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
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
    setFavorites(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('fingtaj_favorites', JSON.stringify(next));
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  // Sync category filter events from Navbar
  useEffect(() => {
    const handleCategoryEvent = (e: any) => {
      if (e.detail?.category) {
        setSelectedCategory(e.detail.category);
      }
    };
    window.addEventListener('fingtaj:filterCategory', handleCategoryEvent);
    return () => window.removeEventListener('fingtaj:filterCategory', handleCategoryEvent);
  }, []);

  // SEO synchronization
  useEffect(() => {
    document.title = 'FingTaj — 50 High-Precision Financial & Statutory Calculators for India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'India’s most advanced financial calculators. Compute SIP wealth, Home Loan EMIs, Income Tax (Section 115BAC), Gratuity, and Retirement with zero telemetry in local RAM.'
      );
    }
  }, []);

  // Interactive Live Studio State
  type EngineType = 'sip' | 'loan' | 'tax' | 'gratuity' | 'ppf' | 'fire';
  const [activeEngine, setActiveEngine] = useState<EngineType>('sip');

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

  // Engine Calculations
  const sipOutcome = useMemo(() => {
    const r = (sipReturn / 100) / 12;
    const n = sipYears * 12;
    const invested = sipAmount * n;
    const total = Math.round(sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const gains = total - invested;
    const wealthMultiple = invested > 0 ? (total / invested).toFixed(2) : '1.0';
    return { invested, total, gains, wealthMultiple };
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
    const totalTax = tax + cess;
    return { totalTax, taxable };
  }, [taxSalary]);

  const gratuityOutcome = useMemo(() => {
    const raw = Math.round((gratuityBasic * 15 * gratuityYears) / 26);
    const payable = Math.min(2000000, raw);
    return { payable, raw };
  }, [gratuityBasic, gratuityYears]);

  const ppfOutcome = useMemo(() => {
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

  const fireOutcome = useMemo(() => {
    const annualExpense = fireMonthlyExpense * 12;
    const corpusNeeded = annualExpense * 25; // 4% rule
    return { corpusNeeded, annualExpense };
  }, [fireMonthlyExpense]);

  // Catalog Filtering
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS_DATA.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesQuery = !q || 
        tool.title.toLowerCase().includes(q) || 
        tool.shortDesc.toLowerCase().includes(q) || 
        tool.statute.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen text-slate-100 pb-20">
      
      {/* 1. HERO & INTERACTIVE FINANCIAL WORKBENCH */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-white/5 overflow-hidden">
        <div className="wrap relative z-10">
          
          {/* Header Copy */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>50 Statutory Calculators · FY 2026–27 Calibrated</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Precision Financial Modeling,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                Zero Compromise.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Calculate SIP wealth creation, reducing-balance home loan EMIs, Income Tax Section 115BAC, and superannuation with 100% private, client-side memory execution.
            </p>
          </div>

          {/* Interactive Calculator Studio Card */}
          <div className="glass-card-glow p-6 sm:p-10 relative overflow-hidden">
            
            {/* Engine Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 border-b border-white/10 mb-8">
              {[
                { id: 'sip', name: 'SIP Wealth', icon: TrendingUp },
                { id: 'loan', name: 'Home Loan EMI', icon: HomeIcon },
                { id: 'tax', name: 'Income Tax 115BAC', icon: Percent },
                { id: 'gratuity', name: 'Gratuity (1972)', icon: Users },
                { id: 'ppf', name: 'PPF 15-Yr', icon: Shield },
                { id: 'fire', name: 'FIRE Corpus', icon: Flame },
              ].map(engine => {
                const Icon = engine.icon;
                const isSelected = activeEngine === engine.id;

                return (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => setActiveEngine(engine.id as EngineType)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)] scale-102'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{engine.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Studio Workspace: Left Controls, Right Outcome Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls Column (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* SIP ENGINE */}
                {activeEngine === 'sip' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Monthly Investment</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(sipAmount)} <span className="text-slate-400 text-xs">({formatINRWords(sipAmount)})</span>
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
                      <div className="flex gap-2 pt-1">
                        {[5000, 10000, 25000, 50000].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSipAmount(val)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                          >
                            ₹{val / 1000}k
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Investment Horizon</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {sipYears} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={35}
                        step={1}
                        value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Expected Annual Return</span>
                        <span className="font-tabular text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          {sipReturn}% p.a.
                        </span>
                      </div>
                      <input
                        type="range"
                        min={6}
                        max={24}
                        step={0.5}
                        value={sipReturn}
                        onChange={(e) => setSipReturn(Number(e.target.value))}
                      />
                    </div>
                  </>
                )}

                {/* HOME LOAN ENGINE */}
                {activeEngine === 'loan' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Loan Principal</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(loanPrincipal)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={20000000}
                        step={100000}
                        value={loanPrincipal}
                        onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Interest Rate</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {loanRate}% p.a.
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

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Tenure</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {loanTenure} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                      />
                    </div>
                  </>
                )}

                {/* TAX ENGINE */}
                {activeEngine === 'tax' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Gross Annual Salary (CTC)</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(taxSalary)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={300000}
                        max={10000000}
                        step={50000}
                        value={taxSalary}
                        onChange={(e) => setTaxSalary(Number(e.target.value))}
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                      Standard deduction of ₹75,000 and Section 87A rebate factored automatically per Union Budget 2024 revised slabs.
                    </div>
                  </>
                )}

                {/* GRATUITY ENGINE */}
                {activeEngine === 'gratuity' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Last Drawn Basic + DA</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(gratuityBasic)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={500000}
                        step={5000}
                        value={gratuityBasic}
                        onChange={(e) => setGratuityBasic(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Completed Service Years</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
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
                  </>
                )}

                {/* PPF ENGINE */}
                {activeEngine === 'ppf' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Annual Contribution</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(ppfAnnual)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500}
                        max={150000}
                        step={5000}
                        value={ppfAnnual}
                        onChange={(e) => setPpfAnnual(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Duration</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
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
                  </>
                )}

                {/* FIRE ENGINE */}
                {activeEngine === 'fire' && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-300">Current Monthly Living Expenses</span>
                        <span className="font-tabular text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                          {formatINR(fireMonthlyExpense)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={20000}
                        max={500000}
                        step={5000}
                        value={fireMonthlyExpense}
                        onChange={(e) => setFireMonthlyExpense(Number(e.target.value))}
                      />
                    </div>
                  </>
                )}

              </div>

              {/* Outcome Console (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 sm:p-7 space-y-6 shadow-xl">
                  
                  {/* Primary Output Display */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {activeEngine === 'sip' ? 'Estimated Total Wealth' :
                       activeEngine === 'loan' ? 'Monthly Equated Installment (EMI)' :
                       activeEngine === 'tax' ? 'Total Annual Tax Liability' :
                       activeEngine === 'gratuity' ? 'Eligible Gratuity Amount' :
                       activeEngine === 'ppf' ? 'Maturity Corpus (100% Tax Free)' :
                       'Target Financial Independence Corpus'}
                    </div>

                    <div className="text-3xl sm:text-4xl font-black font-tabular text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 tracking-tight">
                      {activeEngine === 'sip' ? formatINR(sipOutcome.total) :
                       activeEngine === 'loan' ? formatINR(loanOutcome.emi) :
                       activeEngine === 'tax' ? formatINR(taxOutcome.totalTax) :
                       activeEngine === 'gratuity' ? formatINR(gratuityOutcome.payable) :
                       activeEngine === 'ppf' ? formatINR(ppfOutcome.total) :
                       formatINR(fireOutcome.corpusNeeded)}
                    </div>
                  </div>

                  {/* Secondary Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {activeEngine === 'sip' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Capital Outlay</span>
                          <span className="font-tabular font-bold text-sm text-slate-200">{formatINR(sipOutcome.invested)}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[11px] text-emerald-300 block mb-0.5">Estimated Wealth Gain</span>
                          <span className="font-tabular font-bold text-sm text-emerald-400">+{formatINR(sipOutcome.gains)}</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'loan' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Total Interest</span>
                          <span className="font-tabular font-bold text-sm text-amber-400">{formatINR(loanOutcome.totalInterest)}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Total Repayment</span>
                          <span className="font-tabular font-bold text-sm text-slate-200">{formatINR(loanOutcome.totalPayable)}</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'tax' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Standard Deduction</span>
                          <span className="font-tabular font-bold text-sm text-emerald-400">₹75,000</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Taxable Salary</span>
                          <span className="font-tabular font-bold text-sm text-slate-200">{formatINR(taxOutcome.taxable)}</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'gratuity' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Statutory Formula</span>
                          <span className="font-mono text-xs text-indigo-300 font-bold">(15 × B × Y) / 26</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[11px] text-emerald-300 block mb-0.5">Tax Exemption</span>
                          <span className="text-xs font-bold text-emerald-400">Section 10(10)</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'ppf' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Sovereign Interest Rate</span>
                          <span className="font-tabular font-bold text-sm text-indigo-300">7.1% p.a.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[11px] text-emerald-300 block mb-0.5">Tax Status</span>
                          <span className="text-xs font-bold text-emerald-400">EEE (100% Tax Free)</span>
                        </div>
                      </>
                    )}

                    {activeEngine === 'fire' && (
                      <>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Annual Living Cost</span>
                          <span className="font-tabular font-bold text-sm text-slate-200">{formatINR(fireOutcome.annualExpense)}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <span className="text-[11px] text-indigo-300 block mb-0.5">Safe Withdrawal</span>
                          <span className="font-tabular font-bold text-sm text-indigo-400">4.0% Rule</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Launch Detailed Calculator CTA */}
                  <Link
                    to={
                      activeEngine === 'sip' ? `/sip-calculator?monthlyInvestment=${sipAmount}&years=${sipYears}&expectedReturn=${sipReturn}` :
                      activeEngine === 'loan' ? `/home-loan-emi-calculator?loanAmount=${loanPrincipal}&interestRate=${loanRate}&tenureYears=${loanTenure}` :
                      activeEngine === 'tax' ? `/income-tax-calculator?grossIncome=${taxSalary}` :
                      activeEngine === 'gratuity' ? `/gratuity-calculator?basicSalary=${gratuityBasic}&tenureYears=${gratuityYears}` :
                      activeEngine === 'ppf' ? `/ppf-calculator` :
                      `/fire-calculator`
                    }
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
                  >
                    <span>Open Full Detailed Calculator</span>
                    <ArrowRight size={16} />
                  </Link>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. AD PLACEMENT: LEADERBOARD SPONSOR */}
      <div className="wrap my-8">
        <AdSenseSlot slotId="home-leaderboard" format="leaderboard" label="Sponsored · Verified Tools" />
      </div>

      {/* 3. PINNED QUICK ACCESS (IF ANY PINNED) */}
      {favorites.length > 0 && (
        <section className="wrap mb-12">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span>Your Pinned Calculators</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {CALCULATORS_DATA.filter(c => favorites.includes(c.slug)).map(tool => (
              <Link
                key={tool.id}
                to={`/${tool.slug}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-xs font-medium text-slate-200 hover:text-white transition-all"
              >
                <span>{tool.title}</span>
                <ArrowUpRight size={13} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. THE 50 CALCULATORS DIRECTORY MATRIX */}
      <section className="wrap pt-6" id="catalog-matrix">
        
        {/* Section Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-white/5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Complete Computational Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedCategory === 'All' ? 'All 50 Statutory Engines' : `${selectedCategory} Suite`}
              <span className="text-slate-500 text-base font-normal ml-3">
                ({filteredTools.length} Available)
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, statute or formula..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculator Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map(tool => {
            const isFav = favorites.includes(tool.slug);

            return (
              <Link
                key={tool.id}
                to={`/${tool.slug}`}
                className="glass-card p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {tool.categoryLabel}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(tool.slug, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                      aria-label="Pin tool"
                    >
                      <Star size={14} className={isFav ? 'fill-amber-400' : ''} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                    {tool.statute}
                  </span>
                  <span className="font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Calculate</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* 5. IN-ARTICLE AD UNIT */}
      <div className="wrap my-12">
        <AdSenseSlot slotId="home-mid-content" format="in-article" label="Advertisement · Financial Services" />
      </div>

      {/* 6. RESEARCH & REGULATORY ARTICLES SECTION */}
      <section className="wrap my-10">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            Statutory Research &amp; Guides
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            E-E-A-T Verified Financial Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.slice(0, 3).map(article => (
            <div key={article.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="text-indigo-400 font-medium">{article.tag}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>By {article.author}</span>
                <span className="text-emerald-400 font-medium">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
