import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ashutosh-kumar-r/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@fingtaj',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp Channel',
      url: 'https://whatsapp.com/channel/0029Vb7gkNgIt5rwnKzp0Y0K',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      )
    },
    {
      name: 'Quora',
      url: 'https://www.quora.com/profile/FinGTaj',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c2.259 0 4.378-.636 6.188-1.737l3.225 1.737-1.077-3.418c2.274-2.27 3.664-5.26 3.664-8.582 0-6.627-5.373-12-12-12zm.844 18.062c-.752 0-1.428-.242-2.029-.727l-.372-.303-.541.385c-.947.674-2.072 1.03-3.256 1.03-3.088 0-5.6-2.512-5.6-5.6 0-3.087 2.512-5.6 5.6-5.6 3.087 0 5.6 2.513 5.6 5.6 0 .866-.197 1.699-.571 2.449l-.271.545.454.409c.28.252.61.38.972.38.868 0 1.574-.706 1.574-1.574v-1.125h1.8v1.125c0 1.86-1.506 3.366-3.366 3.366zm-5.044-8.212c-1.547 0-2.8 1.253-2.8 2.8 0 1.546 1.253 2.8 2.8 2.8 1.546 0 2.8-1.254 2.8-2.8 0-1.547-1.254-2.8-2.8-2.8z" />
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/FinGTaj',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ];

  const statutoryTools = [
    { name: 'SIP Wealth Calculator', path: '/sip-calculator' },
    { name: 'Loan EMI Amortization', path: '/loan-emi-calculator' },
    { name: 'Income Tax (Sec 115BAC)', path: '/income-tax-calculator' },
    { name: 'PPF Scheme Calculator', path: '/ppf-calculator' },
    { name: 'Inflation-Adjusted Returns', path: '/inflation-adjusted-return-calculator' },
    { name: 'Fixed Deposit (FD) TDS', path: '/fd-calculator' },
    { name: 'HRA Exemption (Sec 10(13A))', path: '/hra-calculator' },
    { name: 'Gratuity (Act 1972)', path: '/gratuity-calculator' },
    { name: 'Capital Gains Tax (111A/112A)', path: '/capital-gains-tax-calculator' },
    { name: 'Section 44ADA Presumptive', path: '/section-44ada-calculator' }
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 pt-12 pb-10 text-sm text-slate-400">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top: Brand & Social Handles */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="text-center md:text-left">
            <Link to="/" className="text-2xl font-black tracking-tight text-white inline-flex items-center gap-1.5">
              <span className="text-cyan-400">FinG</span>Taj
            </Link>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Institutional-grade statutory financial computation engine for India. Zero telemetry, volatile RAM execution.
            </p>
          </div>

          {/* Social Channels */}
          <div className="flex flex-col items-center md:items-end gap-2.5">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
              Connect With FingTaj Official
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`FingTaj on ${social.name}`}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Crawlable Internal Links (Calculators & Governance) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-slate-800">
          <div className="md:col-span-8">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Statutory Calculation Utilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {statutoryTools.map(tool => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="text-slate-400 hover:text-cyan-400 transition truncate"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Governance, Authorship & Policies
            </h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <Link to="/about" className="hover:text-cyan-400 transition">About FingTaj & Founder (E-E-A-T)</Link>
              <Link to="/privacy-policy" className="hover:text-cyan-400 transition">Privacy Policy & DART Cookie Governance</Link>
              <Link to="/terms-of-service" className="hover:text-cyan-400 transition">Terms of Service & YMYL Disclaimers</Link>
              <Link to="/contact" className="hover:text-cyan-400 transition">Engineering Desk & Grievance Officer</Link>
              <a
                href="https://www.linkedin.com/in/ashutosh-kumar-r/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition"
              >
                Author: Ashutosh Kumar R (LinkedIn)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="pt-6 text-center space-y-2">
          <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
            <strong>Mandatory YMYL Disclaimer:</strong> FingTaj is an independent computational utility and does not offer formal investment, chartered accountancy, banking, or legal advice. Calculations strictly follow published statutory provisions (Income Tax Act 1961, RBI Master Directions, Payment of Gratuity Act 1972) for illustrative self-planning purposes.
          </p>
          <div className="text-[11px] text-slate-400 flex flex-wrap justify-center gap-4 pt-1">
            <span>Operational Jurisdiction: Chennai, Tamil Nadu, 600001, India</span>
            <span>•</span>
            <span>Zero-Telemetry Architecture</span>
            <span>•</span>
            <span>© 2026 FingTaj. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
