import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cookie, ArrowLeft, ExternalLink } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy & DART Cookie Governance — FingTaj';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'FingTaj Privacy Policy: Google AdSense DART cookies, zero-telemetry RAM processing, and Indian DPDP Act 2023 compliance.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/privacy-policy');
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
            <Lock size={14} />
            <span>DPDP Act 2023 · Google AdSense &amp; GDPR Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Privacy Policy &amp; Data Governance
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: October 24, 2026 | Last Comprehensive Legal Audit: October 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Section 1: Preamble */}
          <section className="glass-card p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Zero-Telemetry Computational Architecture
            </h2>
            <p>
              At <strong>FingTaj</strong> (<a href="https://www.fingtaj.com" className="text-indigo-400 underline hover:text-indigo-300 font-semibold">https://www.fingtaj.com</a>), your privacy is our foundational engineering constraint. We operate under a verifiable <strong>Zero-Telemetry Architecture</strong>.
            </p>
            <p>
              Unlike conventional fintech portals that harvest user financial numbers to build telemarketing dossiers, FingTaj executes all mathematical computations—including gross salary inputs, tax deduction breakdowns under Section 80C/80D/115BAC, home loan principals, interest rates, and gratuity calculations—<strong>solely and exclusively within your local web browser's volatile JavaScript memory</strong>.
            </p>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>Zero salary records, loan amounts, or tax records are ever transmitted across the network or stored in databases.</span>
            </div>
          </section>

          {/* Section 2: Google AdSense */}
          <section className="glass-card p-6 sm:p-8 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">02.</span> Google AdSense &amp; Third-Party Cookies
            </h2>
            <p>
              FingTaj partners with <strong>Google AdSense</strong> (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) and approved advertising networks to serve relevant contextual advertisements across our pages.
            </p>
            <p>
              Third-party vendors, including Google, use cookies, web beacons, and unique identifiers to serve ads based on your visits to FingTaj and other sites on the internet.
            </p>
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Cookie size={16} className="text-amber-400" />
                <span>Google DoubleClick DART Cookie Disclosure</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google uses the DoubleClick DART cookie in ads served on publisher websites displaying Google AdSense advertisements. When visitors browse an AdSense-monetized website, a cookie may be placed in the user's browser.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pt-1">
                <li>Google's use of advertising cookies enables it and its partners to serve ads based on visits across the web.</li>
                <li>DART cookies do NOT track personal identifying credentials such as your name, email address, physical address, or phone number.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <h3 className="font-semibold text-white text-sm">Your Advertising Opt-Out Rights</h3>
              <p className="text-xs text-slate-400">
                You have the right to disable personalized interest-based advertising at any time using any of the following industry opt-out portals:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-xl text-xs transition border border-white/10"
                >
                  <span>AboutAds.info Opt-Out</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

          {/* Section 3: Grievance Redressal Officer */}
          <section className="glass-card p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">03.</span> Statutory Grievance Redressal Officer
            </h2>
            <p>
              In accordance with Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021</strong>, the designated Grievance Redressal Officer for FingTaj is:
            </p>
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 text-xs space-y-2 text-slate-300">
              <p><span className="text-slate-500 uppercase">Designated Officer:</span> <strong className="text-white">Ashutosh Jha</strong></p>
              <p><span className="text-slate-500 uppercase">Principal Office:</span> <span>Chennai, Tamil Nadu, 600001, India</span></p>
              <p><span className="text-slate-500 uppercase">Direct Email:</span> <a href="mailto:support@fingtaj.com" className="text-indigo-400 underline font-semibold">support@fingtaj.com</a></p>
              <p><span className="text-slate-500 uppercase">Response SLA:</span> <span className="text-emerald-400 font-semibold">Acknowledgement within 24 hours; disposal within 15 days</span></p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
