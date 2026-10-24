import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  TrendingUp, 
  Home as HomeIcon, 
  FileText, 
  ShieldCheck, 
  Percent, 
  Clock, 
  DollarSign, 
  Search,
  ArrowRight,
  Lock,
  Cpu,
  Scale
} from 'lucide-react';

interface ToolCard {
  id: string;
  title: string;
  category: 'Investments' | 'Loans' | 'Taxation' | 'Retirement';
  path: string;
  desc: string;
  formulaHint: string;
  statute: string;
  icon: React.ReactNode;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    document.title = 'FingTaj — Institutional-Grade Statutory Financial Calculators for India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'High-precision client-side Indian financial calculators. Compute SIP wealth, Home Loan EMI, Income Tax (Section 115BAC), Gratuity, and Capital Gains with zero data collection.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/');
  }, []);

  const tools: ToolCard[] = [
    {
      id: 'sip',
      title: 'SIP Compounding Calculator',
      category: 'Investments',
      path: '/sip-calculator',
      desc: 'Model geometric capital compounding, rupee-cost averaging, and multi-decade wealth accumulation in equity mutual funds.',
      formulaHint: 'M = P × [((1+i)ⁿ - 1)/i] × (1+i)',
      statute: 'CBDT Section 112A LTCG',
      icon: <TrendingUp className="text-cyan-400" size={20} />
    },
    {
      id: 'emi',
      title: 'Loan EMI Amortization Calculator',
      category: 'Loans',
      path: '/loan-emi-calculator',
      desc: 'Calculate exact reducing-balance equated monthly installments, total interest liabilities, and early prepayment savings.',
      formulaHint: 'EMI = [P·r(1+r)ⁿ] / [(1+r)ⁿ - 1]',
      statute: 'RBI External Benchmark (EBLR)',
      icon: <HomeIcon className="text-amber-400" size={20} />
    },
    {
      id: 'tax',
      title: 'Income Tax Calculator (New vs. Old)',
      category: 'Taxation',
      path: '/income-tax-calculator',
      desc: 'Compare statutory liabilities under Section 115BAC (New Regime) and the Old Regime with standard deduction & Chapter VI-A.',
      formulaHint: 'Tax = Slab Rates + 4% Cess - 87A Rebate',
      statute: 'Income Tax Act Section 115BAC',
      icon: <FileText className="text-emerald-400" size={20} />
    },
    {
      id: 'ppf',
      title: 'PPF Scheme Calculator',
      category: 'Retirement',
      path: '/ppf-calculator',
      desc: 'Compute sovereign annual compounding yields, 15-year statutory lock-in accumulation, and tax-free interest under EEE status.',
      formulaHint: 'F = P × [((1+i)ⁿ - 1)/i] × (1+i)',
      statute: 'PPF Scheme 2019 • Section 10(11)',
      icon: <ShieldCheck className="text-cyan-400" size={20} />
    },
    {
      id: 'inflation',
      title: 'Inflation-Adjusted Real Return Calculator',
      category: 'Investments',
      path: '/inflation-adjusted-return-calculator',
      desc: 'Determine real purchasing power growth by discounting nominal yields against Consumer Price Index (CPI) inflation.',
      formulaHint: 'R_real = [(1 + R_nom)/(1 + i)] - 1',
      statute: 'Fisher Economic Equation Standard',
      icon: <Clock className="text-rose-400" size={20} />
    },
    {
      id: 'fd',
      title: 'Fixed Deposit (FD) Calculator',
      category: 'Investments',
      path: '/fd-calculator',
      desc: 'Calculate bank cumulative fixed deposit maturity proceeds with standard quarterly compounding conventions and senior citizen rates.',
      formulaHint: 'A = P × [1 + (r / 4)]^(4 × t)',
      statute: 'Quarterly Compounding • Sec 194A TDS',
      icon: <Percent className="text-emerald-400" size={20} />
    },
    {
      id: 'hra',
      title: 'HRA Exemption Calculator',
      category: 'Taxation',
      path: '/hra-calculator',
      desc: 'Determine statutory tax-free House Rent Allowance under Section 10(13A) and Rule 2A based on basic salary, actual rent, and city tier.',
      formulaHint: 'Min(Actual HRA, Rent - 10% Basic, 50%/40%)',
      statute: 'Income Tax Rules Rule 2A',
      icon: <DollarSign className="text-amber-400" size={20} />
    },
    {
      id: 'gratuity',
      title: 'Gratuity Calculator',
      category: 'Retirement',
      path: '/gratuity-calculator',
      desc: 'Calculate statutory end-of-service gratuity entitlements based on 15/26 working days ratio and the ₹20 Lakh lifetime exemption limit.',
      formulaHint: 'Gratuity = (15 × Last Basic × Tenure) / 26',
      statute: 'Payment of Gratuity Act 1972',
      icon: <Scale className="text-cyan-400" size={20} />
    },
    {
      id: 'capital-gains',
      title: 'Capital Gains Tax Calculator',
      category: 'Taxation',
      path: '/capital-gains-tax-calculator',
      desc: 'Compute Long-Term (12.5% u/s 112A) and Short-Term (20% u/s 111A) Capital Gains taxes on equities, mutual funds, and real estate.',
      formulaHint: 'Tax = (Net Gain - ₹1.25L Exemption) × Rate',
      statute: 'Sections 112A, 111A & 112',
      icon: <TrendingUp className="text-purple-400" size={20} />
    },
    {
      id: '44ada',
      title: 'Section 44ADA Presumptive Tax Calculator',
      category: 'Taxation',
      path: '/section-44ada-calculator',
      desc: 'Compute presumptive business profits (50% minimum) and tax liabilities for software freelancers, doctors, lawyers, and consultants.',
      formulaHint: 'Deemed Profit = Gross Receipts × 50%',
      statute: 'Section 44ADA (Up to ₹75 Lakhs)',
      icon: <FileText className="text-emerald-400" size={20} />
    }
  ];

  const categories = ['All', 'Investments', 'Loans', 'Taxation', 'Retirement'];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.statute.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-5">
          <ShieldCheck size={14} />
          <span>Institutional Statutory Calculations for India</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
          High-Precision Financial Engine with <span className="text-cyan-400">Zero Telemetry</span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
          Compute SIP wealth growth, home loan amortization, income tax under Section 115BAC, and statutory gratuity. Evaluated strictly inside your local device browser memory with zero server data collection.
        </p>

        {/* Search Bar & Category Filters */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search calculators by name, statute (e.g. 115BAC, Gratuity, EMI, HRA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Independent Calculator Pages (Direct <Link to="...">) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-6 transition duration-200 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 group-hover:border-cyan-500/30 transition">
                  {tool.icon}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {tool.category}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition mb-2">
                {tool.title}
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                {tool.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/60 mt-2">
              <div className="text-[11px] font-mono text-cyan-400/90 truncate mb-1">
                {tool.formulaHint}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">{tool.statute}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-0.5 transition flex-shrink-0">
                  Open Tool <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Architectural Principles Section */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
          Engineered for Transparency, Privacy & Accuracy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <Lock className="text-cyan-400 mb-3" size={24} />
            <h3 className="text-base font-semibold text-white mb-2">Zero-Telemetry Privacy</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Calculations are computed 100% in local browser RAM using client-side JavaScript. No salary, loan, or investment data is ever transmitted across the network.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <Scale className="text-emerald-400 mb-3" size={24} />
            <h3 className="text-base font-semibold text-white mb-2">Statutory Schedules</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Formulas are rigorously aligned with the Income Tax Act 1961, Section 115BAC amendments, Payment of Gratuity Act 1972, and RBI external benchmark directions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <Cpu className="text-amber-400 mb-3" size={24} />
            <h3 className="text-base font-semibold text-white mb-2">Zero Layout Shift</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              All tools enforce strict minimum display heights, mobile touch targets ($\ge$ 44px), and numeric input guards to maintain peak Core Web Vitals performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
