import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      {/* Title & Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Institutional Governance & E-E-A-T Disclosure
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          About FingTaj Financial Engine
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          FingTaj (<a href="https://www.fingtaj.com" className="text-cyan-400 underline hover:text-cyan-300">https://www.fingtaj.com</a>) is an independent, non-partisan computational technology platform built to deliver transparent, institutional-grade, zero-telemetry financial and statutory calculation engines for Indian taxpayers, salaried professionals, and long-term investors.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* Mission & Founding Purpose */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            1. The Problem We Solve: Why FingTaj Exists
          </h2>
          <p>
            For decades, digital personal finance in India has been dominated by predatory lead-generation portals masquerading as "free calculators." When an unsuspecting salaried employee inputs their gross salary, home loan principal, or retirement goals into common search-result widgets, their financial parameters are routinely logged, packaged, and auctioned to third-party telemarketing firms, credit card brokers, and aggressive private lenders.
          </p>
          <p>
            Simultaneously, traditional financial calculators frequently employ opaque, outdated mathematical formulas. Many fail to account for complex statutory provisions such as marginal tax relief under Section 115BAC(4), updated post-Budget 2024 capital gains indexation removals under Sections 111A/112A, or the exact 15/26 working-day wage fraction stipulated by Section 4(2) of the Payment of Gratuity Act 1972.
          </p>
          <p className="font-medium text-slate-200">
            FingTaj was engineered as a pure, privacy-first technical utility to restore algorithmic transparency and digital dignity to Indian financial computation.
          </p>
        </section>

        {/* Zero Telemetry Architecture */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            2. The Core Engineering Guarantee: Zero Telemetry
          </h2>
          <p>
            Every single calculation tool on FingTaj—from the multi-slab Section 115BAC Income Tax simulator to the reducing-balance loan amortization matrix—is architected strictly around a <strong>Zero-Telemetry Client-Side Execution Model</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400 mb-1">Volatile RAM Execution</h3>
              <p className="text-xs text-slate-400">
                Inputs (salary, deductions, principal, tenure) are evaluated exclusively within your browser's local JavaScript heap memory.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400 mb-1">Zero Database Retention</h3>
              <p className="text-xs text-slate-400">
                No financial parameters or computational payloads are ever transmitted to or stored on our web application servers.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400 mb-1">Zero Lead Selling</h3>
              <p className="text-xs text-slate-400">
                We collect zero phone numbers, zero PAN records, and zero bank account identifiers. Your calculations remain 100% private.
              </p>
            </div>
          </div>
          <p>
            You can verify this guarantee independently at any time by opening your browser's Developer Tools (Network Tab) while running any calculation: zero HTTP POST requests carrying your financial numbers are dispatched across the wire.
          </p>
        </section>

        {/* E-E-A-T Human Authorship & Governance */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                3. Author & Technical Governance (E-E-A-T)
              </h2>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">Author Experience, Expertise, Authoritativeness & Trustworthiness</p>
            </div>
            <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-full text-xs text-cyan-300 font-semibold">
              Principal Systems Architect
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-slate-200">
              FingTaj is conceived, engineered, and maintained by <strong>Ashutosh Jha</strong>, a Full-Stack Systems Engineer and computational finance researcher based in <strong>Chennai, Tamil Nadu, India</strong>.
            </p>
            <p>
              With an extensive engineering background in high-performance web applications, distributed systems, and quantitative modeling, Ashutosh established FingTaj to translate convoluted statutory circulars from the Central Board of Direct Taxes (CBDT), the Reserve Bank of India (RBI), and the Ministry of Finance into accessible, deterministic open-source algorithms.
            </p>
            
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Primary Credentials & Verification:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Systems architecture and mathematical modeling with a focus on Indian financial compliance algorithms.</li>
                <li>Comprehensive audit oversight of every calculation script against official Government of India Gazette notifications.</li>
                <li>Physical operating presence in Chennai, Tamil Nadu, adhering to Indian IT Acts and Digital Personal Data Protection standards.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <a
                href="mailto:support@fingtaj.com"
                className="text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
              >
                Direct Author Email: support@fingtaj.com
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://github.com/theaashutoshjha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                GitHub Profile (@theaashutoshjha)
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                LinkedIn Professional Network
              </a>
            </div>
          </div>
        </section>

        {/* Statutory Alignment Framework */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            4. Statutory & Regulatory Conventions Observed
          </h2>
          <p>
            FingTaj calculation models do not employ subjective approximations. Every algorithm is calibrated to mirror official legislative schedules:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-slate-900/60 border border-slate-800 rounded-xl">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300 bg-slate-950/60">
                  <th className="p-3">Engine / Tool</th>
                  <th className="p-3">Governing Indian Statute / Regulation</th>
                  <th className="p-3">Statutory Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-400">
                <tr>
                  <td className="p-3 font-medium text-white">Income Tax Engine</td>
                  <td className="p-3">Income Tax Act 1961 (Sec 115BAC & Finance Acts 2024–2025)</td>
                  <td className="p-3">Multi-slab marginal relief, 4% Health & Education cess, standard ₹75,000 deduction</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Loan EMI Matrix</td>
                  <td className="p-3">RBI Master Direction — Loans and Advances (2016/2023)</td>
                  <td className="p-3">Monthly reducing-balance amortization compounding equation</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Gratuity Calculator</td>
                  <td className="p-3">Payment of Gratuity Act 1972, Section 4(2)</td>
                  <td className="p-3">15 working days per completed year divided by 26 statutory days; ₹20L statutory ceiling</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">HRA Exemption</td>
                  <td className="p-3">Income Tax Act 1961, Section 10(13A) & Rule 2A</td>
                  <td className="p-3">Minimum of actual HRA, 50%/40% of basic wage, or rent paid minus 10% basic</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Presumptive Tax (44ADA)</td>
                  <td className="p-3">Income Tax Act 1961, Section 44ADA</td>
                  <td className="p-3">50% presumptive gross receipt floor; ₹50 Lakh / ₹75 Lakh turnover ceilings</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Capital Gains Engine</td>
                  <td className="p-3">Income Tax Act 1961, Sections 111A, 112A & Budget 2024</td>
                  <td className="p-3">12.5% LTCG with ₹1.25 Lakh exemption threshold; 20% STCG under Sec 111A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Editorial Independence & Commercial Transparency */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            5. Editorial Independence & Monetization Transparency
          </h2>
          <p>
            FingTaj operates with strict editorial and mathematical neutrality:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              <strong>No Banking or NBFC Affiliation:</strong> FingTaj does not receive commissions, kickbacks, referral bounties, or origin fees from commercial banks, housing finance corporations (HFCs), or loan aggregators.
            </li>
            <li>
              <strong>No Sponsored Recommendations:</strong> When our calculators evaluate amortization or compounding, no sponsored loans, mutual fund schemes, or financial instruments are artificially pushed to users.
            </li>
            <li>
              <strong>Transparent Contextual Advertising:</strong> To finance our web infrastructure, SSL certificates, edge CDN servers, and computational upkeep without charging user fees or walling calculations, FingTaj displays non-intrusive contextual banner advertisements via Google AdSense. Ads are clearly segregated from calculation results with rigorous click-prevention buffer zones.
            </li>
          </ul>
        </section>

        {/* Contact & Jurisdiction */}
        <section className="border-t border-slate-800 pt-6 text-xs text-slate-400 space-y-2">
          <p>
            <strong>Physical Jurisdiction & Principal Office:</strong> FingTaj operates from Chennai, Tamil Nadu, 600001, Republic of India.
          </p>
          <p>
            <strong>Statutory Feedback & Formula Audits:</strong> Inquiries regarding computational logic or statutory gazette variances may be addressed directly to our technical desk at <a href="mailto:support@fingtaj.com" className="text-cyan-400">support@fingtaj.com</a> or via our official <a href="/contact" className="text-cyan-400 underline">Contact Portal</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
