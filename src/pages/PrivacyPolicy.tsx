import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, Cookie, Scale, ArrowLeft, Mail, ExternalLink } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy & DART Cookie Governance — FingTaj';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'FingTaj Privacy Policy: Google AdSense DART cookies, zero-telemetry RAM processing, and Indian DPDP Act 2023 compliance.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/privacy-policy');
  }, []);

  return (
    <div className="bg-[#080d16] text-slate-100 min-h-screen py-10 bg-terminal-grid bg-radial-ambient">
      <div className="max-w-4xl mx-auto px-4 text-slate-300">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft size={13} />
            <span>Return to Financial Terminal</span>
          </Link>
        </div>

        {/* Title & Metadata Banner */}
        <div className="mb-8 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 font-mono flex items-center gap-1.5">
            <Lock size={14} />
            <span>DPDP Act 2023 · Google AdSense &amp; GDPR Compliant</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Privacy Policy &amp; Data Governance
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Effective Date: October 24, 2026 | Last Comprehensive Legal &amp; Technical Audit: October 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Section 1: Preamble & Zero-Telemetry Architecture */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">01.</span> Preamble &amp; Zero-Telemetry Architecture
            </h2>
            <p className="text-slate-300">
              At <strong>FingTaj</strong> (<a href="https://www.fingtaj.com" className="text-cyan-400 underline hover:text-cyan-300 font-semibold">https://www.fingtaj.com</a>), your privacy is our foundational engineering constraint. We operate under a strict, mathematically verifiable <strong>Zero-Telemetry Computational Architecture</strong>.
            </p>
            <p className="text-slate-300">
              Unlike conventional fintech portals that harvest user financial inputs to build marketing dossiers and sell predatory leads, FingTaj executes all mathematical computations—including gross salary inputs, tax deduction breakdowns under Section 80C/80D/115BAC, home loan principals, interest rates, and gratuity calculations—<strong>solely and exclusively within your local web browser's volatile JavaScript memory</strong>.
            </p>
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Zero Server Telemetry Guarantee</span>
              </div>
              <p>
                No salary numbers, loan amounts, tax records, or computational parameters entered into FingTaj tools are ever dispatched across the network, transmitted to external APIs, or persisted in our backend databases.
              </p>
            </div>
          </section>

          {/* Section 2: Google AdSense & Third-Party Advertising Cookies */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">02.</span> Google AdSense &amp; Third-Party Advertising Cookies
            </h2>
            <p className="text-slate-300">
              FingTaj partners with <strong>Google AdSense</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) and approved advertising networks to serve relevant advertisements across our pages.
            </p>
            <p className="text-slate-300">
              Third-party vendors, including Google, use cookies, web beacons, and unique identifiers to serve ads based on your prior visits to FingTaj and other sites on the internet.
            </p>
            
            <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-2.5">
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <Cookie size={16} className="text-amber-400" />
                <span>Google DoubleClick DART Cookie Disclosure</span>
              </h3>
              <p className="text-slate-300 text-xs">
                Google uses the <strong>DoubleClick DART cookie</strong> in ads served on publisher websites displaying Google AdSense advertisements. When visitors browse an AdSense-monetized website, a cookie may be placed in the user's browser.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                <li>Google's use of advertising cookies enables it and its partners to serve contextual and interest-based ads based on visits across the web.</li>
                <li>DART cookies do NOT track personal identifying credentials such as your name, email address, physical home address, or telephone number.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-white text-base">Your Advertising Opt-Out Rights</h3>
              <p className="text-slate-300 text-xs">
                You have the right to disable personalized interest-based advertising at any time using any of the following industry opt-out portals:
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition border border-white/10"
                >
                  <span>AboutAds.info Opt-Out</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition border border-white/10"
                >
                  <span>Network Advertising Initiative (NAI)</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

          {/* Section 3: Browser Storage Audit */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">03.</span> Browser Storage Audit (LocalStorage &amp; SessionStorage)
            </h2>
            <p className="text-slate-300">
              FingTaj does not use invasive tracking pixels. We utilize browser <code>localStorage</code> strictly for functional client-side ergonomics:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300 bg-white/5">
                    <th className="p-3">Storage Key</th>
                    <th className="p-3">Technical Purpose</th>
                    <th className="p-3">Data Contained</th>
                    <th className="p-3">Persistence Horizon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  <tr>
                    <td className="p-3 text-cyan-400">fingtaj_cookie_consent</td>
                    <td className="p-3">Stores user privacy cookie preference</td>
                    <td className="p-3">"accepted" | "essential_only"</td>
                    <td className="p-3">Persistent in browser</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-cyan-400">fingtaj_favorites</td>
                    <td className="p-3">Stores pinned favorite calculators</td>
                    <td className="p-3">Array of tool slugs</td>
                    <td className="p-3">Persistent in browser</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-cyan-400">fingtaj_draft_state</td>
                    <td className="p-3">Caches last slider values for user convenience</td>
                    <td className="p-3">Local numerical parameters (RAM only)</td>
                    <td className="p-3">Cleared on tab close</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Web Server Logs */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">04.</span> Edge Infrastructure &amp; Server Transmission Metadata
            </h2>
            <p className="text-slate-300">
              When accessing FingTaj, edge reverse-proxy servers automatically process standard transmission headers strictly for security and delivery:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs font-mono">
              <li>Internet Protocol (IP) address (truncated/anonymized at edge)</li>
              <li>User-agent string (browser type, OS platform)</li>
              <li>HTTP request timestamp, referring domain, and response status code</li>
            </ul>
            <p className="text-xs text-slate-400">
              Server access logs are retained strictly for DDoS prevention, rate limiting, and anomaly detection. Logs are purged within 30 days and are never correlated with calculation sessions.
            </p>
          </section>

          {/* Section 5: Indian DPDP Act 2023 & GDPR Compliance */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">05.</span> User Rights Under India's DPDP Act 2023 &amp; GDPR
            </h2>
            <p className="text-slate-300">
              In accordance with the <strong>Digital Personal Data Protection Act 2023</strong> (India) and the <strong>General Data Protection Regulation (GDPR)</strong>, users possess explicit rights regarding any communication submitted to FingTaj:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h4 className="font-bold text-cyan-400 mb-1 font-mono">Right to Information &amp; Access</h4>
                <p className="text-slate-400">Request confirmation and summary of personal communication submitted via our contact forms.</p>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h4 className="font-bold text-emerald-400 mb-1 font-mono">Right to Correction &amp; Erasure</h4>
                <p className="text-slate-400">Mandate correction of inaccurate information or permanent deletion of past correspondence.</p>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h4 className="font-bold text-purple-400 mb-1 font-mono">Right of Grievance Redressal</h4>
                <p className="text-slate-400">Guaranteed access to our designated Grievance Officer with 24-hour statutory acknowledgement.</p>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                <h4 className="font-bold text-amber-400 mb-1 font-mono">Right to Nominate &amp; Opt-Out</h4>
                <p className="text-slate-400">Designate legal representatives or withdraw consent for non-essential cookies at any time.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Grievance Redressal Officer */}
          <section className="terminal-card bg-[#0d1524] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span className="text-cyan-400">06.</span> Statutory Grievance Redressal Officer
            </h2>
            <p className="text-slate-300">
              In accordance with Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021</strong>, the designated Grievance Redressal Officer for FingTaj is:
            </p>
            <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-5 text-xs font-mono space-y-2 text-slate-300">
              <p><span className="text-slate-500 uppercase">Designated Officer:</span> <strong className="text-white">Ashutosh Jha</strong></p>
              <p><span className="text-slate-500 uppercase">Principal Jurisdiction:</span> <span className="text-slate-300">Chennai, Tamil Nadu, 600001, India</span></p>
              <p><span className="text-slate-500 uppercase">Direct Email:</span> <a href="mailto:support@fingtaj.com?subject=Grievance%20Officer" className="text-cyan-400 underline font-semibold">support@fingtaj.com</a></p>
              <p><span className="text-slate-500 uppercase">Statutory Response SLA:</span> <span className="text-emerald-400 font-semibold">Acknowledgement within 24 hours; disposal within 15 days</span></p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
