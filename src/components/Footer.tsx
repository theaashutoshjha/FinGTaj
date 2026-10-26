import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Send, 
  FileCode, 
  Globe, 
  Percent,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#02050e] text-slate-400 text-xs print-hide">
      
      {/* Top Banner: Sovereign Statutory Assurance */}
      <div className="border-b border-white/[0.06] bg-slate-950/70 py-3.5">
        <div className="wrap flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck size={14} />
            </div>
            <div>
              <span className="font-bold text-white text-xs mr-2">
                100% Free · Client-Side Execution · Zero Data Logging
              </span>
              <span className="text-slate-500 text-[11px] hidden md:inline">
                Calculations evaluate strictly inside volatile browser memory.
              </span>
            </div>
          </div>

          <Link
            to="/indexing"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/40 text-emerald-400 font-medium text-[11px] transition-colors shrink-0"
          >
            <Send size={12} />
            <span>Search Console Indexing Matrix</span>
          </Link>
        </div>
      </div>

      <div className="wrap pt-8 pb-6">
        
        {/* 4-Column Directory Grid (All 50 Calculators) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7 mb-8 items-start">
          
          {/* Column 1: Loans & Debt Architecture (8 Tools) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400 border-b border-white/[0.08] pb-2 font-mono">
              <Percent size={13} />
              <span>Loans &amp; Debt Architecture (8)</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link to="/emi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">EMI Calculator</Link></li>
              <li><Link to="/home-loan-emi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Home Loan EMI Calculator</Link></li>
              <li><Link to="/car-loan-emi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Car Loan EMI Calculator</Link></li>
              <li><Link to="/personal-loan-emi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Personal Loan Calculator</Link></li>
              <li><Link to="/loan-eligibility-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Loan Eligibility Calculator</Link></li>
              <li><Link to="/loan-prepayment-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Loan Prepayment Calculator</Link></li>
              <li><Link to="/loan-comparison-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Loan Comparison Calculator</Link></li>
              <li><Link to="/education-loan-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Education Loan Calculator</Link></li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider mb-1">Mortgages &amp; Credit</h5>
              <ul className="space-y-1 text-[11px]">
                <li><Link to="/credit-card-interest-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Credit Card Interest APR</Link></li>
                <li><Link to="/credit-card-payoff-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Credit Card Payoff</Link></li>
                <li><Link to="/rent-vs-buy-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Rent vs Buy Home</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 2: Wealth & Systematic Equity (10 Tools) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400 border-b border-white/[0.08] pb-2 font-mono">
              <TrendingUp size={13} />
              <span>Wealth &amp; Equity (10)</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link to="/sip-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">SIP Calculator</Link></li>
              <li><Link to="/step-up-sip-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Step-Up SIP Calculator</Link></li>
              <li><Link to="/lumpsum-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Lumpsum Wealth Calculator</Link></li>
              <li><Link to="/swp-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">SWP Withdrawal Calculator</Link></li>
              <li><Link to="/cagr-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">CAGR Calculator</Link></li>
              <li><Link to="/xirr-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">XIRR Return Calculator</Link></li>
              <li><Link to="/mutual-fund-returns-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Mutual Fund Returns</Link></li>
              <li><Link to="/goal-based-investment-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Goal-Based Investment</Link></li>
              <li><Link to="/rule-of-72-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Rule of 72 Doubling</Link></li>
              <li><Link to="/stock-average-price-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Stock Average Price</Link></li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider mb-1">Portfolio Diagnostics</h5>
              <ul className="space-y-1 text-[11px]">
                <li><Link to="/net-worth-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Net Worth Ledger</Link></li>
                <li><Link to="/roi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">ROI Calculator</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Fixed Income, Savings & Pensions (13 Tools) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400 border-b border-white/[0.08] pb-2 font-mono">
              <Clock size={13} />
              <span>Savings &amp; Pensions (13)</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link to="/fd-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Fixed Deposit (FD) Calculator</Link></li>
              <li><Link to="/rd-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Recurring Deposit (RD)</Link></li>
              <li><Link to="/ppf-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">PPF Scheme 2026</Link></li>
              <li><Link to="/nps-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">NPS Pension Calculator</Link></li>
              <li><Link to="/sukanya-samriddhi-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Sukanya Samriddhi (SSY)</Link></li>
              <li><Link to="/compound-interest-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Compound Interest</Link></li>
              <li><Link to="/simple-interest-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Simple Interest</Link></li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider mb-1">Superannuation</h5>
              <ul className="space-y-1 text-[11px]">
                <li><Link to="/retirement-corpus-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Retirement Corpus</Link></li>
                <li><Link to="/epf-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">EPF Provident Fund</Link></li>
                <li><Link to="/gratuity-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Gratuity (1972 Act)</Link></li>
                <li><Link to="/inflation-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Inflation Adjuster</Link></li>
                <li><Link to="/emergency-fund-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Emergency Fund</Link></li>
                <li><Link to="/fire-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">FIRE Independence</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Taxation, Payroll & Corporate (16 Tools) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400 border-b border-white/[0.08] pb-2 font-mono">
              <Briefcase size={13} />
              <span>Tax &amp; Payroll (16)</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link to="/income-tax-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Old vs New Tax Regime</Link></li>
              <li><Link to="/hra-exemption-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">HRA Exemption Calculator</Link></li>
              <li><Link to="/capital-gains-tax-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Capital Gains Tax (2024)</Link></li>
              <li><Link to="/gst-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">GST Tax Slabs</Link></li>
              <li><Link to="/tds-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">TDS Deductions Calculator</Link></li>
              <li><Link to="/advance-tax-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Advance Tax Schedule</Link></li>
            </ul>

            <div className="pt-2">
              <h5 className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider mb-1">Commerce &amp; Margins</h5>
              <ul className="space-y-1 text-[11px]">
                <li><Link to="/salary-in-hand-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">In-Hand Salary Calculator</Link></li>
                <li><Link to="/ctc-to-take-home-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">CTC to Take-Home</Link></li>
                <li><Link to="/profit-margin-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Profit Margin Calculator</Link></li>
                <li><Link to="/break-even-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Break-Even Point</Link></li>
                <li><Link to="/discount-and-markup-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Discount &amp; Markup</Link></li>
                <li><Link to="/currency-converter" className="hover:text-emerald-300 transition-colors block py-0.5">Currency Converter</Link></li>
                <li><Link to="/budget-50-30-20-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">50/30/20 Budget Rule</Link></li>
                <li><Link to="/term-insurance-calculator" className="hover:text-emerald-300 transition-colors block py-0.5">Term Life Cover Needed</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Brand & Webmaster Endpoints Strip */}
        <div className="border-t border-white/[0.08] pt-6 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <BrandLogo size="sm" />
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Institutional-grade statutory financial computation engines for Indian taxpayers and wealth planners. Engineered by Ashutosh Jha in Chennai, Tamil Nadu, India.
            </p>
          </div>

          {/* Webmaster Instant Indexing Links */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              to="/indexing"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors text-[11px]"
            >
              <Send size={12} className="text-emerald-400" />
              <span>Indexing Hub</span>
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-white/[0.08] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            >
              <FileCode size={12} className="text-emerald-400" />
              <span>sitemap.xml</span>
            </a>
            <a
              href="/urllist.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-white/[0.08] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            >
              <Globe size={12} className="text-emerald-400" />
              <span>urllist.txt</span>
            </a>
            <a
              href="/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded bg-slate-900 border border-white/[0.08] hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
            >
              ads.txt
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded bg-slate-900 border border-white/[0.08] hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
            >
              robots.txt
            </a>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="border-t border-white/[0.08] pt-4 pb-3 text-[11px] text-slate-500 leading-relaxed font-mono">
          <p>
            Regulatory Disclaimer: All 50 computational engines on FingTaj are built for scenario analysis under prevailing statutory rules (Income Tax Act 1961, Section 115BAC, RBI Master Directions, Gratuity Act 1972, and Finance Act 2024). FingTaj is an independent computational platform, not a SEBI-registered Investment Adviser (RIA). All calculations execute in local browser memory with zero user data stored.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} FingTaj. All 50 Financial Calculators are 100% Free for Public Use.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <Link to="/about" className="hover:text-slate-200 transition-colors">About &amp; Methodology</Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/terms-of-service" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">Technical Inquiries</Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/indexing" className="text-emerald-400 hover:text-emerald-300 transition-colors">Search Console</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
