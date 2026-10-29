import React, { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    document.title = 'About FingTaj — Institutional Financial Engine & E-E-A-T Authorship';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Learn about FingTaj, our zero-telemetry computational philosophy, and founder Ashutosh Jha in Chennai, Tamil Nadu.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/about');
  }, []);

  return (
    <div className="bg-[#080d16] text-slate-100 min-h-screen py-10 bg-terminal-grid bg-radial-ambient">
      <div className="max-w-4xl mx-auto px-4 text-slate-300">
        
        {/* Title & Metadata Kicker */}
        <div className="mb-8 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 font-mono">
            Institutional Governance · E-E-A-T Disclosure
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            About FingTaj Financial Engine
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            FingTaj (<a href="https://www.fingtaj.com" className="text-cyan-400 font-semibold underline hover:text-cyan-300">https://www.fingtaj.com</a>) is an independent, non-partisan computational technology platform built to deliver transparent, institutional-grade, zero-telemetry financial and statutory calculation engines for Indian taxpayers, salaried professionals, and long-term investors.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Mission & Founding Purpose */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono">
              01. The Problem We Solve: Why FingTaj Exists
            </h2>
            <p className="text-slate-300">
              For decades, digital personal finance in India has been dominated by predatory lead-generation portals masquerading as "free calculators." When an unsuspecting salaried employee inputs their gross salary, home loan principal, or retirement goals into common search-result widgets, their financial parameters are routinely logged, packaged, and auctioned to third-party telemarketing firms, credit card brokers, and aggressive private lenders.
            </p>
            <p className="text-slate-300">
              Simultaneously, traditional financial calculators frequently employ opaque, outdated mathematical formulas. Many fail to account for complex statutory provisions such as marginal tax relief under Section 115BAC(4), updated post-Budget 2024 capital gains indexation removals under Sections 111A/112A, or the exact 15/26 working-day wage fraction stipulated by Section 4(2) of the Payment of Gratuity Act 1972.
            </p>
            <p className="font-semibold text-cyan-300 bg-cyan-950/40 p-4 rounded-xl border border-cyan-500/30 font-mono">
              FingTaj was engineered as a pure, privacy-first technical utility to restore algorithmic transparency and digital dignity to Indian financial computation.
            </p>
          </section>

          {/* Zero Telemetry Architecture */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono">
              02. The Core Engineering Guarantee: Zero Telemetry
            </h2>
            <p className="text-slate-300">
              Every single calculation tool on FingTaj—from the multi-slab Section 115BAC Income Tax simulator to the reducing-balance loan amortization matrix—is architected strictly around a <strong>Zero-Telemetry Client-Side Execution Model</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-cyan-400 mb-1 font-mono">Volatile RAM Execution</h3>
                <p className="text-xs text-slate-400">
                  Inputs (salary, deductions, principal, tenure) are evaluated exclusively within your browser's local JavaScript heap memory.
                </p>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-emerald-400 mb-1 font-mono">Zero Database Retention</h3>
                <p className="text-xs text-slate-400">
                  No financial parameters or computational payloads are ever transmitted to or stored on our web application servers.
                </p>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-purple-400 mb-1 font-mono">Zero Lead Selling</h3>
                <p className="text-xs text-slate-400">
                  We collect zero phone numbers, zero PAN records, and zero bank account identifiers. Your calculations remain 100% private.
                </p>
              </div>
            </div>
            <p className="text-slate-300 font-mono text-xs">
              You can verify this guarantee independently at any time by opening your browser's Developer Tools (Network Tab) while running any calculation: zero HTTP POST requests carrying your financial numbers are dispatched across the wire.
            </p>
          </section>

          {/* E-E-A-T Human Authorship & Governance */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-mono">
                  03. Authorship, Experience &amp; Governance
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Primary Architect &amp; Maintainer: Ashutosh Jha · Chennai, Tamil Nadu, India
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 font-mono font-bold rounded-full text-xs border border-emerald-500/40">
                Active E-E-A-T Verified
              </span>
            </div>

            <p className="text-slate-300">
              FingTaj is conceived, authored, and actively maintained by <strong>Ashutosh Jha</strong>, a software engineer and quantitative financial developer based in Chennai, Tamil Nadu. The platform was built in direct response to recurring calculation discrepancies observed across retail banking portals during annual Income Tax return filing (ITR-1 / ITR-2) cycles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm font-mono">Regulatory Sources Grounding</h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside font-mono">
                  <li>Central Board of Direct Taxes (CBDT) Gazettes</li>
                  <li>Income Tax Act 1961 (Sections 10, 80C, 111A, 112A, 115BAC)</li>
                  <li>Reserve Bank of India (RBI) Master Circulars on Interest Compounding</li>
                  <li>Payment of Gratuity Act 1972 &amp; EPF Scheme 1952</li>
                </ul>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm font-mono">Editorial &amp; Review Standards</h4>
                <p className="text-xs text-slate-400">
                  Formulas and code implementations are systematically audited following every Union Budget release and RBI bi-monthly Monetary Policy Committee (MPC) statement to guarantee mathematical accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Statutory Independence Disclaimer */}
          <section className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-6 text-xs text-amber-200/90 space-y-2 font-mono">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider">
              Statutory Independence Disclaimer
            </h3>
            <p>
              FingTaj is an independent software tool provider and mathematical modeling platform. FingTaj and Ashutosh Jha are not registered as Investment Advisers (RIA) or Research Analysts (RA) under the Securities and Exchange Board of India (SEBI) Regulations 2013, nor are we licensed tax return preparers under the Income Tax Rules 1962.
            </p>
            <p>
              All projections, outputs, schedules, and comparisons generated by FingTaj calculators are intended solely for educational, scenario-planning, and comparative analysis. Users are strongly advised to consult a qualified Chartered Accountant (CA) or SEBI-registered fee-only financial planner before making definitive legal or financial commitments.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
