import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function About() {
  useEffect(() => {
    document.title = 'About FingTaj — High-Precision Financial Engine & E-E-A-T Authorship';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Learn about FingTaj, our zero-telemetry computational philosophy, and founder Ashutosh Jha in Chennai, Tamil Nadu.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/about');
  }, []);

  return (
    <div className="min-h-screen py-10 sm:py-16 text-slate-300">
      <div className="wrap max-w-4xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft size={13} />
            <span>Return to Financial Hub</span>
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="glass-card-glow p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <ShieldCheck size={14} />
            <span>Institutional Governance · E-E-A-T Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            About FingTaj Financial Engine
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            FingTaj is an independent computational utility engineered to deliver transparent, institutional-grade, zero-telemetry statutory calculation engines for Indian taxpayers, salaried professionals, and long-term investors.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Section 1: Purpose */}
          <section className="glass-card p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Why FingTaj Exists
            </h2>
            <p>
              For decades, digital personal finance in India has been dominated by predatory lead-generation portals masquerading as "free calculators." When an unsuspecting employee inputs their gross salary, home loan principal, or retirement goals into common search-result widgets, their financial parameters are routinely logged, packaged, and auctioned to third-party telemarketing firms and lenders.
            </p>
            <p>
              Simultaneously, traditional financial calculators employ opaque, outdated mathematical formulas that frequently omit statutory provisions such as marginal tax relief under Section 115BAC(4) or the exact 15/26 working-day wage fraction stipulated by Section 4(2) of the Payment of Gratuity Act 1972.
            </p>
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs font-medium">
              FingTaj was engineered as a pure, privacy-first technical utility to restore algorithmic transparency and digital dignity to Indian financial computation.
            </div>
          </section>

          {/* Section 2: Zero Telemetry */}
          <section className="glass-card p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">02.</span> The Zero-Telemetry Guarantee
            </h2>
            <p>
              Every single calculation tool on FingTaj—from the multi-slab Section 115BAC Income Tax simulator to the reducing-balance loan amortization matrix—is architected strictly around a <strong>Zero-Telemetry Client-Side Execution Model</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="bg-slate-900/80 border border-white/5 p-5 rounded-2xl">
                <h3 className="font-bold text-indigo-400 mb-1">Volatile RAM Execution</h3>
                <p className="text-xs text-slate-400">
                  Inputs (salary, deductions, principal, tenure) are evaluated exclusively within your browser's local JavaScript heap.
                </p>
              </div>
              <div className="bg-slate-900/80 border border-white/5 p-5 rounded-2xl">
                <h3 className="font-bold text-emerald-400 mb-1">Zero Database Retention</h3>
                <p className="text-xs text-slate-400">
                  No financial parameters or computational payloads are ever transmitted to or stored on our web application servers.
                </p>
              </div>
              <div className="bg-slate-900/80 border border-white/5 p-5 rounded-2xl">
                <h3 className="font-bold text-cyan-400 mb-1">Zero Lead Selling</h3>
                <p className="text-xs text-slate-400">
                  We collect zero phone numbers, zero PAN records, and zero bank account identifiers. Your calculations remain 100% private.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Authorship */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400">03.</span> Human Authorship &amp; Governance
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Primary Architect &amp; Maintainer: Ashutosh Jha · Chennai, Tamil Nadu, India
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-semibold rounded-full text-xs border border-emerald-500/20">
                E-E-A-T Verified
              </span>
            </div>

            <p>
              FingTaj is conceived, authored, and maintained by <strong>Ashutosh Jha</strong>, a software engineer and quantitative financial developer based in Chennai, Tamil Nadu. The platform was built in direct response to recurring calculation discrepancies observed across retail banking portals during annual Income Tax return filing cycles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-400 text-sm">Regulatory Sources Grounding</h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Central Board of Direct Taxes (CBDT) Gazettes</li>
                  <li>Income Tax Act 1961 (Sections 10, 80C, 111A, 112A, 115BAC)</li>
                  <li>Reserve Bank of India (RBI) Master Directions</li>
                  <li>Payment of Gratuity Act 1972 &amp; EPF Scheme 1952</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-400 text-sm">Editorial &amp; Review Standards</h4>
                <p className="text-xs text-slate-400">
                  Formulas and code implementations are audited following every Union Budget release and RBI bi-monthly Monetary Policy Committee (MPC) statement to guarantee mathematical accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Disclaimer */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider">
              Statutory Independence Disclaimer
            </h3>
            <p>
              FingTaj is an independent software tool provider and mathematical modeling platform. FingTaj and Ashutosh Jha are not registered as Investment Advisers (RIA) or Research Analysts (RA) under SEBI Regulations 2013, nor are we licensed tax return preparers under the Income Tax Rules 1962.
            </p>
            <p>
              All projections and outputs generated by FingTaj calculators are intended solely for educational, scenario-planning, and comparative analysis. Users are advised to consult a qualified Chartered Accountant (CA) or certified financial planner before making binding financial commitments.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
