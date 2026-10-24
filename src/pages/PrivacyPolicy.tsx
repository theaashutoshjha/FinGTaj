import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      {/* Title & Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          DPDP Act 2023 • Google AdSense & GDPR Compliant
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Privacy Policy & Data Governance
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: October 24, 2026 | Last Comprehensive Legal Audit: October 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* Preamble */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            1. Preamble & Zero-Telemetry Architecture
          </h2>
          <p>
            At <strong>FingTaj</strong> (<a href="https://www.fingtaj.com" className="text-cyan-400 underline hover:text-cyan-300">https://www.fingtaj.com</a>), your privacy is our foundational engineering constraint. We operate under a strict, verifiable <strong>Zero-Telemetry Computational Architecture</strong>.
          </p>
          <p>
            Unlike conventional fintech websites that harvest user financial inputs to build marketing profiles, FingTaj executes all mathematical computations—including gross salary inputs, tax deduction breakdowns under Section 80C/80D, home loan principals, interest rates, and gratuity calculations—<strong>solely and exclusively within your local web browser's volatile JavaScript execution heap</strong>.
          </p>
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-200 text-xs font-medium">
            <strong>Key Guarantee:</strong> No salary numbers, loan amounts, tax records, or computational parameters entered into FingTaj tools are ever dispatched across the network, transmitted to external APIs, or persisted in our backend databases.
          </div>
        </section>

        {/* Google AdSense & Third-Party Cookies */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            2. Google AdSense & Third-Party Advertising Cookies
          </h2>
          <p>
            FingTaj partners with <strong>Google AdSense</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) and approved third-party advertising vendors to serve contextual and interest-based advertisements across our pages.
          </p>
          <p>
            Third-party advertising partners, including Google, employ cookies, web beacons, and persistent device identifiers to analyze site usage and serve advertisements based on your prior visits to FingTaj and other websites across the global internet.
          </p>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-white text-base">Google DART Cookie Disclosure</h3>
            <p className="text-slate-300 text-xs">
              Google uses the <strong>DoubleCLick DART cookie</strong> in ads served on publisher websites displaying Google AdSense advertisements. When visitors browse an AdSense-monetized website, a cookie may be dropped in the end user's browser.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
              <li>Google's use of advertising cookies enables it and its partners to serve ads based on user visits to our site and other internet portals.</li>
              <li>DART cookies do NOT track personally identifiable information such as your name, email address, physical address, or telephone number.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-white text-base">Your Advertising Opt-Out Rights</h3>
            <p className="text-slate-300 text-xs">
              You possess the unconditional right to disable personalized interest-based advertising at any time through the following industry mechanisms:
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
              >
                Google Ads Settings
              </a>
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
              >
                AboutAds.info Opt-Out
              </a>
              <a
                href="https://optout.networkadvertising.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
              >
                Network Advertising Initiative (NAI)
              </a>
            </div>
          </div>
        </section>

        {/* LocalStorage & Browser Storage Audit */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            3. Browser Storage Audit (LocalStorage & SessionStorage)
          </h2>
          <p>
            FingTaj does not use invasive tracking cookies. We utilize browser <code>localStorage</code> strictly for functional client-side ergonomics:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-slate-900/60 border border-slate-800 rounded-xl">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300 bg-slate-950/60">
                  <th className="p-3">Storage Key</th>
                  <th className="p-3">Technical Purpose</th>
                  <th className="p-3">Data Contained</th>
                  <th className="p-3">Persistence Horizon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-400">
                <tr>
                  <td className="p-3 font-mono text-cyan-400">theme_preference</td>
                  <td className="p-3">Persists user UI dark mode styling</td>
                  <td className="p-3">"dark" | "light"</td>
                  <td className="p-3">Persistent until cleared</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-cyan-400">fingtaj_draft_state</td>
                  <td className="p-3">Locally caches last used slider numbers for user convenience</td>
                  <td className="p-3">Raw numerical values (never sent to server)</td>
                  <td className="p-3">Local browser session only</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-cyan-400">fingtaj_session</td>
                  <td className="p-3">Secure HTTP-only authentication token for direct registered members</td>
                  <td className="p-3">Encrypted cryptographic hash</td>
                  <td className="p-3">7 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Server Log & Telemetry Policy */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            4. Web Server Logs & Edge Infrastructure
          </h2>
          <p>
            When you access FingTaj, our edge web servers (managed via Cloudflare and Express.js) automatically register routine technical transmission metadata:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
            <li>Internet Protocol (IP) address (anonymized at edge)</li>
            <li>Browser type, engine version, and operating system</li>
            <li>HTTP request timestamp, referring URL, and response status code</li>
          </ul>
          <p className="text-xs text-slate-400">
            <strong>Retention & Purpose:</strong> Server access logs are processed exclusively for DDoS mitigation, load balancing, bot blocking, and infrastructure diagnostic health. Logs are automatically purged within 30 days and are never correlated with individual users or calculation inputs.
          </p>
        </section>

        {/* Compliance with Indian DPDP Act 2023 */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            5. User Rights Under India's Digital Personal Data Protection Act (DPDP Act 2023)
          </h2>
          <p>
            In compliance with the <strong>Digital Personal Data Protection Act, 2023</strong> (Republic of India), data principals possess the following explicit legal rights regarding any personal information submitted via our Contact or Registration forms:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-cyan-400 mb-1">Right to Access Information</h4>
              <p className="text-slate-400">You may request a formal summary of any personal data (such as contact correspondence) held by FingTaj.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-cyan-400 mb-1">Right to Correction & Erasure</h4>
              <p className="text-slate-400">You may mandate the immediate correction of inaccurate data or complete erasure of past contact submissions.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-cyan-400 mb-1">Right of Grievance Redressal</h4>
              <p className="text-slate-400">You have access to our designated Grievance Officer with guaranteed acknowledgement within 24 hours.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-cyan-400 mb-1">Right to Nominate</h4>
              <p className="text-slate-400">You retain the right to designate a representative in accordance with Section 14 of the DPDP Act 2023.</p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            6. Children's Privacy (COPPA & DPDP Section 9)
          </h2>
          <p>
            FingTaj is a professional financial computation engine intended for adult taxpayers, salaried workers, and financial analysts. We do not knowingly solicit, collect, or process personal data from children under the age of 18 years. If we become aware that a minor has submitted personal information through our contact portal, we take immediate statutory steps to permanently delete such records from our database.
          </p>
        </section>

        {/* Statutory Grievance Redressal Officer */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            7. Statutory Grievance Redressal Officer
          </h2>
          <p>
            In accordance with Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the designated Statutory Grievance Redressal Officer for FingTaj is:
          </p>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-xs font-mono space-y-2">
            <p><span className="text-slate-500 uppercase">Designated Officer:</span> <strong className="text-white">Ashutosh Jha</strong></p>
            <p><span className="text-slate-500 uppercase">Principal Office:</span> <span className="text-slate-300">Chennai, Tamil Nadu, 600001, India</span></p>
            <p><span className="text-slate-500 uppercase">Statutory Email:</span> <a href="mailto:support@fingtaj.com?subject=Attention: Grievance Officer" className="text-cyan-400 underline">support@fingtaj.com</a></p>
            <p><span className="text-slate-500 uppercase">Statutory Response SLA:</span> <span className="text-emerald-400 font-semibold">Acknowledgement within 24 hours; disposal within 15 days</span></p>
          </div>
        </section>

        {/* Policy Revisions */}
        <section className="border-t border-slate-800 pt-6 text-xs text-slate-400 space-y-2">
          <p>
            <strong>Amendments to Policy:</strong> FingTaj reserves the right to update this Privacy Policy periodically to reflect statutory changes in the Indian Income Tax Act, Finance Acts, or digital data protection regulations. Revisions will be published on this URL with an updated effective date timestamp.
          </p>
          <p>
            For questions regarding our privacy architecture, email us at <a href="mailto:support@fingtaj.com" className="text-cyan-400">support@fingtaj.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
