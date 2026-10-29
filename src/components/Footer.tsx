import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070b14] pt-14 pb-8 print-hide text-xs text-slate-400">
      <div className="wrap">
        
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Left Column: Brand & Security Guarantee */}
          <div className="space-y-3.5 max-w-sm">
            <Link to="/" className="inline-block transition-opacity hover:opacity-90">
              <BrandLogo size="lg" showBadge={true} />
            </Link>
            <p className="text-slate-400 text-xs font-medium">
              100% Client-Side RAM Processing · Zero Server Telemetry
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              High-precision statutory financial modeling calibrated to Income Tax Act 1961, Section 115BAC, and RBI Master Directions.
            </p>
          </div>

          {/* Right Columns: 3 Category Blocks matching Reference Image */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Column 1: Wealth & Growth */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                WEALTH &amp; GROWTH
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/sip-calculator" className="hover:text-indigo-400 transition-colors">SIP Calculator</Link></li>
                <li><Link to="/step-up-sip-calculator" className="hover:text-indigo-400 transition-colors">Step-Up SIP</Link></li>
                <li><Link to="/lumpsum-calculator" className="hover:text-indigo-400 transition-colors">Lumpsum Wealth</Link></li>
                <li><Link to="/swp-calculator" className="hover:text-indigo-400 transition-colors">SWP Cashflow</Link></li>
                <li><Link to="/cagr-calculator" className="hover:text-indigo-400 transition-colors">CAGR Returns</Link></li>
              </ul>
            </div>

            {/* Column 2: Loans & Taxation */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                LOANS &amp; TAXATION
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/home-loan-emi-calculator" className="hover:text-indigo-400 transition-colors">Home Loan EMI</Link></li>
                <li><Link to="/emi-calculator" className="hover:text-indigo-400 transition-colors">Reducing Balance EMI</Link></li>
                <li><Link to="/income-tax-calculator" className="hover:text-indigo-400 transition-colors">Tax (Section 115BAC)</Link></li>
                <li><Link to="/capital-gains-tax-calculator" className="hover:text-indigo-400 transition-colors">Capital Gains (2024)</Link></li>
                <li><Link to="/hra-exemption-calculator" className="hover:text-indigo-400 transition-colors">HRA Exemption</Link></li>
              </ul>
            </div>

            {/* Column 3: Trust & Governance */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                TRUST &amp; GOVERNANCE
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy &amp; Governance</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About &amp; Methodology</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support Desk</Link></li>
                <li><Link to="/indexing" className="hover:text-indigo-400 transition-colors">Search Indexing</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FingTaj. 50 Institutional Financial Calculators. 100% Free &amp; Private.
        </div>

      </div>
    </footer>
  );
}
