import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Send, 
  FileCode, 
  Globe, 
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-400 text-xs print-hide">
      
      {/* Top Value Assurance Ribbon */}
      <div className="border-b border-white/5 bg-slate-900/40 py-3.5">
        <div className="wrap flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Lock size={15} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-slate-200 text-xs">
                100% Client-Side RAM Processing · Zero Server Telemetry
              </span>
              <span className="text-slate-500 text-[11px] hidden xl:inline">
                (Financial parameters are evaluated strictly in your browser memory)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/about"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            >
              E-E-A-T Methodology
            </Link>
            <Link
              to="/indexing"
              className="px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-semibold"
            >
              Indexing Hub
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Columns */}
      <div className="wrap py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          
          {/* Brand Info (2 cols) */}
          <div className="sm:col-span-2 space-y-4">
            <BrandLogo size="md" showBadge={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              FingTaj delivers high-precision statutory and personal finance calculation engines calibrated directly to the Income Tax Act 1961, Section 115BAC, and RBI Master Directions.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="https://www.linkedin.com/in/ashutosh-kumar-r/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/FinGTaj"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                X (@FinGTaj)
              </a>
              <a
                href="https://www.youtube.com/@fingtaj"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Column 1: Core Wealth Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Wealth &amp; Growth
            </h4>
            <ul className="space-y-2">
              <li><Link to="/sip-calculator" className="hover:text-indigo-400 transition-colors">SIP Calculator</Link></li>
              <li><Link to="/step-up-sip-calculator" className="hover:text-indigo-400 transition-colors">Step-Up SIP Calculator</Link></li>
              <li><Link to="/lumpsum-calculator" className="hover:text-indigo-400 transition-colors">Lumpsum Investment</Link></li>
              <li><Link to="/swp-calculator" className="hover:text-indigo-400 transition-colors">SWP Retirement Cashflow</Link></li>
              <li><Link to="/cagr-calculator" className="hover:text-indigo-400 transition-colors">CAGR Growth Calculator</Link></li>
              <li><Link to="/mutual-fund-returns-calculator" className="hover:text-indigo-400 transition-colors">Mutual Fund Returns</Link></li>
            </ul>
          </div>

          {/* Column 2: Loans & Taxation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Loans &amp; Taxation
            </h4>
            <ul className="space-y-2">
              <li><Link to="/home-loan-emi-calculator" className="hover:text-indigo-400 transition-colors">Home Loan EMI</Link></li>
              <li><Link to="/emi-calculator" className="hover:text-indigo-400 transition-colors">Reducing Balance EMI</Link></li>
              <li><Link to="/loan-prepayment-calculator" className="hover:text-indigo-400 transition-colors">Prepayment Savings</Link></li>
              <li><Link to="/income-tax-calculator" className="hover:text-indigo-400 transition-colors">Income Tax (Section 115BAC)</Link></li>
              <li><Link to="/capital-gains-tax-calculator" className="hover:text-indigo-400 transition-colors">Capital Gains (Budget 2024)</Link></li>
              <li><Link to="/hra-exemption-calculator" className="hover:text-indigo-400 transition-colors">HRA Exemption</Link></li>
            </ul>
          </div>

          {/* Column 3: Governance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Trust &amp; Governance
            </h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About &amp; E-E-A-T Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy (DPDP Act)</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Grievance Redressal Desk</Link></li>
              <li><Link to="/indexing" className="hover:text-indigo-400 transition-colors">Search Indexing Directory</Link></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">sitemap.xml</a></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 mt-10 border-t border-white/5 text-[11px] text-slate-500 leading-relaxed space-y-3">
          <p>
            Regulatory Notice: FingTaj provides mathematical modeling tools strictly for scenario simulation and personal education under the Income Tax Act 1961, Section 115BAC, and RBI Master Directions. FingTaj is not a SEBI-registered Investment Advisor or certified Chartered Accountancy firm. All calculations execute in volatile browser RAM with zero server telemetry.
          </p>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FingTaj. 50 Institutional Financial Calculators. 100% Free &amp; Private.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
