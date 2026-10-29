import React, { useState, useEffect } from 'react';
import { Shield, FileText, AlertTriangle, BookOpen, Cookie, Copyright, ExternalLink } from 'lucide-react';

export type PolicyTabType = 'privacy' | 'terms' | 'disclaimer' | 'editorial' | 'cookies' | 'dmca';

interface PolicySectionProps {
  initialTab?: PolicyTabType;
}

export const PolicySection: React.FC<PolicySectionProps> = ({ initialTab = 'privacy' }) => {
  const [tab, setTab] = useState<PolicyTabType>(initialTab);

  useEffect(() => {
    if (initialTab && tab !== initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, tab]);

  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Regulatory Compliance &amp; Legal Transparency</span>
        <h1 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
          Policies &amp; Fiduciary Disclosures
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', lineHeight: 1.6 }}>
          Comprehensive legal, privacy, advertising, editorial, and statutory standards governing FingTaj (fingtaj.com). Reviewed &amp; current for 2026.
        </p>

        {/* Tab Selection Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '8px', 
          marginTop: '28px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button 
            className={`btn ${tab === 'privacy' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('privacy')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Shield size={14} />
            <span>Privacy Policy (AdSense &amp; GDPR)</span>
          </button>
          <button 
            className={`btn ${tab === 'terms' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('terms')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <FileText size={14} />
            <span>Terms of Service</span>
          </button>
          <button 
            className={`btn ${tab === 'disclaimer' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('disclaimer')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <AlertTriangle size={14} />
            <span>Financial &amp; SEBI Disclaimer</span>
          </button>
          <button 
            className={`btn ${tab === 'editorial' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('editorial')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <BookOpen size={14} />
            <span>Editorial &amp; Fact-Checking</span>
          </button>
          <button 
            className={`btn ${tab === 'cookies' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('cookies')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Cookie size={14} />
            <span>Cookie Policy</span>
          </button>
          <button 
            className={`btn ${tab === 'dmca' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('dmca')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Copyright size={14} />
            <span>DMCA &amp; Copyright</span>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '44px', maxWidth: '920px', margin: '0 auto', lineHeight: 1.85, fontSize: '14.5px' }}>
        
        {/* ========================================================================= */}
        {/* 1. PRIVACY POLICY (GOOGLE ADSENSE, GDPR & CCPA COMPLIANT) */}
        {/* ========================================================================= */}
        {tab === 'privacy' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">Google AdSense Certified</span>
              <span className="badge badge-emerald">GDPR &amp; CCPA Compliant</span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Privacy Policy
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
              Effective Date: January 1, 2026 • Last Reviewed: March 2026 • Official Domain: https://fingtaj.com
            </p>

            <p style={{ color: 'var(--text-secondary)' }}>
              Welcome to FingTaj ("we", "our", "us", or the "Platform"). We respect your privacy and are committed to protecting personal data collected through our financial research tools, calculators, and educational publications. This Privacy Policy details our data collection practices, our integration with third-party advertising networks including Google AdSense, and your statutory privacy rights under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA/CPRA).
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--text-primary)' }}>
              1. Information We Collect
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We adhere strictly to data minimization principles:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>Direct Account Credentials:</b> When you register or sign in via our email authentication system or Auth0 identity provider, we collect your verified email address, full name, encrypted password hash (salted using cryptographic PBKDF2), and session timestamps.</li>
              <li><b>Client-Side Simulation Telemetry:</b> Parameters entered into our financial simulators (SIP amounts, loan tenures, interest rates) are processed client-side within your browser. FingTaj does not store, link, or transmit your individual calculator simulations to third parties.</li>
              <li><b>Server Log Files &amp; Technical Telemetry:</b> Standard HTTP logs capturing IP address, browser user-agent, operating system, referring URL, and page timestamps for DDoS mitigation, load balancing, and diagnostic security.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--accent-cyan)' }}>
              2. Google AdSense &amp; Third-Party Advertising Policy (Mandatory Statutory Disclosures)
            </h3>
            <div style={{ padding: '18px 20px', background: 'rgba(0, 245, 255, 0.04)', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)', marginBottom: '18px' }}>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13.5px' }}>
                FingTaj partners with <b>Google LLC</b> and certified programmatic ad exchanges to display advertisements. To comply fully with Google AdSense Publisher Terms and Requirements, we disclose the following:
              </p>
            </div>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>Third-Party Vendor Cookies:</b> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to FingTaj or other websites across the Internet.</li>
              <li><b>Google Advertising Cookies:</b> Google's use of advertising cookies (such as DoubleClick DART cookies) enables it and its partners to serve ads to users based on their visits to FingTaj and other sites on the Internet.</li>
              <li><b>Opting Out of Personalized Advertising:</b> Users may opt out of personalized advertising by visiting Google's official <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Google Ads Settings <ExternalLink size={12} style={{ display: 'inline' }} /></a>. Alternatively, users can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>aboutads.info choices <ExternalLink size={12} style={{ display: 'inline' }} /></a> or the <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Your Online Choices (EU) <ExternalLink size={12} style={{ display: 'inline' }} /></a> portal.</li>
              <li><b>Non-Personalized Ads for EEA/UK Users:</b> For users in the European Economic Area (EEA) and United Kingdom, we respect consent choices made through our cookie banner and serve non-personalized ads when consent for targeting cookies is withheld.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--text-primary)' }}>
              3. European Union (GDPR) Data Subject Rights
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you reside within the European Economic Area or UK, you possess statutory rights under the GDPR:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>Right of Access:</b> You may request a verified machine-readable copy of any personal data stored by FingTaj.</li>
              <li><b>Right to Rectification:</b> You may request correction of inaccurate or incomplete personal information.</li>
              <li><b>Right to Erasure ("Right to be Forgotten"):</b> You may request the irreversible deletion of your account and associated session data.</li>
              <li><b>Right to Restrict or Object to Processing:</b> You may object to the processing of personal data for direct marketing or analytics.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)' }}>
              To exercise these rights, submit your request to our Data Protection Officer at: <b>privacy@fingtaj.com</b>. We respond to verified statutory requests within 30 days without fee.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--text-primary)' }}>
              4. California Consumer Privacy Act (CCPA / CPRA) Disclosures
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to notice of our data practices:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>No Sale of Personal Data:</b> FingTaj does not sell personal information or exchange consumer data for monetary or other valuable consideration.</li>
              <li><b>Non-Discrimination:</b> We do not discriminate against users who exercise statutory privacy rights. Calculator tools and educational publications remain 100% accessible to all users regardless of opt-out preferences.</li>
              <li><b>Authorized Agent:</b> You may designate an authorized agent to submit requests on your behalf by providing written power of attorney to <b>privacy@fingtaj.com</b>.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--text-primary)' }}>
              5. Data Security &amp; Encryption Standards
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              FingTaj enforces institutional cybersecurity standards:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li>End-to-end transport layer security (TLS 1.3 / SSL 256-bit encryption) on all routes.</li>
              <li>HTTP-only, Secure, SameSite=Lax session cookies preventing Cross-Site Scripting (XSS) extraction.</li>
              <li>HSTS (HTTP Strict Transport Security) preloaded headers and CSP (Content Security Policy) enforcement.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '26px 0 10px', color: 'var(--text-primary)' }}>
              6. Contact Data Protection Officer
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              For statutory privacy questions, data deletion, or verification requests, contact:
              <br/>
              <b>Data Protection Officer (DPO)</b><br/>
              FingTaj Technologies &amp; Educational Research<br/>
              Email: <a href="mailto:privacy@fingtaj.com" style={{ color: 'var(--accent-cyan)' }}>privacy@fingtaj.com</a> / <a href="mailto:admin@fingtaj.com" style={{ color: 'var(--accent-cyan)' }}>admin@fingtaj.com</a>
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TERMS OF SERVICE */}
        {/* ========================================================================= */}
        {tab === 'terms' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Terms of Service
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
              Effective Date: January 1, 2026 • Last Updated: March 2026
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              1. Acceptance of Binding Agreement
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              By accessing, browsing, or utilizing the web applications, mathematical calculators, and research publications provided at <b>https://fingtaj.com</b> (the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to all terms, you must immediately cease accessing the Platform.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              2. Educational &amp; Informational Scope
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              All software modules, compounding formulas, loan prepayment matrices, and editorial guides published on FingTaj are provided strictly for general financial literacy and academic simulation. Nothing on the Platform constitutes professional financial, tax, accounting, or legal advice.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              3. Proprietary Intellectual Property Rights
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              All algorithms, mathematical code implementations, original long-form guides, financial spreadsheet models, visual diagrams, and typography hosted on FingTaj are protected under Indian and international copyright, trademark, and trade secret laws. 
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>Permitted Use:</b> You are granted a revocable, non-exclusive license to use calculators and spreadsheets for personal or internal household financial planning.</li>
              <li><b>Prohibited Acts:</b> You may not systematically scrape, republish, decompile, sell, or create derivative commercial courses or apps using FingTaj intellectual property without prior written license.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              4. Disclaimer of Warranties &amp; Limitation of Liability
            </h3>
            <div style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', borderLeft: '4px solid #ef4444', marginBottom: '18px' }}>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINGTAJ DISCLAIMS ALL WARRANTIES, INCLUDING ACCURACY OF FINANCIAL PROJECTIONS, FREEDOM FROM PROGRAMMING ERRORS, OR FITNESS FOR A PARTICULAR PURPOSE.
              </p>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Under no statutory theory shall FingTaj, its founders, authors, or employees be liable for any direct, indirect, consequential, punitive, or capital loss arising from your investment decisions, loan agreements, or reliance on mathematical simulations provided on this website.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              5. Governing Law &amp; Jurisdiction
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any statutory disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent civil courts in India.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. FIDUCIARY & STATUTORY FINANCIAL DISCLAIMER (SEBI/SEC/RBI) */}
        {/* ========================================================================= */}
        {tab === 'disclaimer' && (
          <div>
            <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '5px solid #ef4444', borderRadius: '10px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={20} color="#ef4444" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ef4444', margin: 0 }}>
                  STATUTORY NOTICE: NOT FINANCIAL OR INVESTMENT ADVICE
                </h3>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '13.5px', margin: 0, lineHeight: 1.7 }}>
                FingTaj (fingtaj.com) is strictly an independent financial education portal and mathematical simulation workbench. FingTaj is <b>NOT</b> a SEBI registered Investment Advisor (RIA), Research Analyst, Portfolio Management Service (PMS), or broker-dealer. None of the content, formulas, or spreadsheets published on this website constitute personalized investment advice, a recommendation to buy or sell securities, or an offer of financial services.
              </p>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              1. Equity Markets &amp; Capital Risk Disclosure
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Investments in mutual funds, index funds, equity stocks, exchange-traded funds (ETFs), bonds, commodities, and digital assets are subject to substantial market volatility and potential risk of total loss of principal capital. Historical market CAGRs (e.g., 12% in the Nifty 50 or 10% in the S&amp;P 500) are empirical illustrations and do not provide any statutory guarantee of future performance.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              2. Mathematical Simulators &amp; Projections
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Calculators such as the SIP Compounding Simulator, Home Loan Prepayment Matrix, FIRE Retirement Target, and 50/30/20 Budgeting Blueprint execute theoretical formulas. They assume static rates of return, steady inflation, and constant monthly contributions. In the real world, macroeconomic conditions, market cycles, interest rate fluctuations, regulatory tax revisions, and individual life events will cause actual wealth outcomes to deviate materially from simulator outputs.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              3. Independent Professional Fiduciary Consultation
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every individual possesses unique financial circumstances, risk tolerances, liquidity needs, and tax liability horizons. Before executing any material financial transaction—including purchasing equity assets, taking home loans, terminating life insurance policies, or submitting tax returns—you should consult a fee-only SEBI-registered Investment Adviser, Chartered Accountant (CA), or certified tax professional.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              4. Zero Referral or Brokerage Commissions
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              FingTaj advocates low-cost Direct mutual funds and low-expense passive index investing. We do not receive distributor kickbacks, regular mutual fund trailer commissions, or private placement fees from asset management companies (AMCs) or commercial lending banks.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. EDITORIAL & FACT-CHECKING POLICY */}
        {/* ========================================================================= */}
        {tab === 'editorial' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">E-E-A-T Excellence</span>
              <span className="badge badge-amber">Empirical Verification</span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Editorial &amp; Fact-Checking Standards
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
              Demonstrating Rigorous Editorial Integrity for Financial Literature (YMYL Guidelines)
            </p>

            <p style={{ color: 'var(--text-secondary)' }}>
              Because financial literacy falls under Google's high-scrutiny <b>YMYL ("Your Money or Your Life")</b> category, FingTaj enforces uncompromising editorial governance. Our editorial methodology guarantees that readers receive empirically verified, mathematically accurate, and legally cited guides.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              1. The 5-Pillar Editorial Verification Process
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', margin: '20px 0' }}>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Pillar 1: Primary Sourcing</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>All statutory claims must cite official gazettes: RBI Master Directions, Income Tax Act 1961, SEBI Circulars, and S&amp;P SPIVA Indices.</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Pillar 2: Mathematical Proof</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Every financial claim must include reproducible compound interest equations, amortization tables, or empirical data sets.</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Pillar 3: Zero Hallucination</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>We forbid fabricated quotes, synthetic market returns, unverified testimonials, and hyped get-rich-quick narratives.</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Pillar 4: Answer Engine Clarity</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Articles must open with a direct answer summary optimized for transparent human comprehension and AI search indexing.</div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              2. Corrections &amp; Factual Updates Policy
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Tax slabs, repo rates, and securities regulations change. Our quantitative research team continuously reviews published guides following Union Budgets and RBI Monetary Policy Committee announcements. If an article requires factual adjustment:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li>The article's <code>updatedAt</code> timestamp is renewed.</li>
              <li>A clear revision note details the updated tax provision or regulatory rate.</li>
              <li>Readers may flag factual suggestions directly to our editorial team at: <b>editorial@fingtaj.com</b>.</li>
            </ul>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. COOKIE POLICY */}
        {/* ========================================================================= */}
        {tab === 'cookies' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Cookie Policy
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
              Detailed Classification of Browser Cookies &amp; Telemetry
            </p>

            <p style={{ color: 'var(--text-secondary)' }}>
              This Cookie Policy explains how FingTaj ("we", "us") utilizes cookies, web beacons, and local storage technologies when you visit https://fingtaj.com. It describes what these technologies are, why we use them, and your complete rights to control them.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              1. Cookie Categories Used on FingTaj
            </h3>

            <div style={{ overflowX: 'auto', margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--accent-cyan)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Examples</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Purpose</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Lifespan</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)' }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 14px' }}><b>Strictly Necessary</b></td>
                    <td style={{ padding: '10px 14px' }}><code>fingtaj_session</code>, <code>__Host-</code></td>
                    <td style={{ padding: '10px 14px' }}>Maintains secure cryptographic session and authentication state.</td>
                    <td style={{ padding: '10px 14px' }}>7 Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 14px' }}><b>Functional Storage</b></td>
                    <td style={{ padding: '10px 14px' }}><code>fingtaj_theme</code>, <code>fingtaj_currency</code></td>
                    <td style={{ padding: '10px 14px' }}>Remembers Dark/Light mode theme and INR/USD currency toggles.</td>
                    <td style={{ padding: '10px 14px' }}>Persistent (Local Storage)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 14px' }}><b>Advertising (Google AdSense)</b></td>
                    <td style={{ padding: '10px 14px' }}><code>__gads</code>, <code>DSID</code>, <code>IDE</code></td>
                    <td style={{ padding: '10px 14px' }}>Enables Google and certified partners to serve programmatic advertisements.</td>
                    <td style={{ padding: '10px 14px' }}>90 Days to 13 Months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              2. How to Manage and Disable Cookies in Your Browser
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Most modern web browsers allow you to control cookies through their configuration settings. You can delete existing cookies and block new ones:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li><b>Google Chrome:</b> Settings &gt; Privacy and Security &gt; Third-party cookies &gt; Block third-party cookies.</li>
              <li><b>Mozilla Firefox:</b> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection &gt; Strict.</li>
              <li><b>Apple Safari:</b> Preferences &gt; Privacy &gt; Prevent cross-site tracking.</li>
              <li><b>Microsoft Edge:</b> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
            </ul>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. DMCA & COPYRIGHT POLICY */}
        {/* ========================================================================= */}
        {tab === 'dmca' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              DMCA &amp; Copyright Compliance
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
              Digital Millennium Copyright Act Notice &amp; Takedown Procedure
            </p>

            <p style={{ color: 'var(--text-secondary)' }}>
              FingTaj respects the intellectual property rights of creators and researchers. In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512) and applicable copyright conventions, we promptly process notices of alleged copyright infringement.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              1. Submitting a Copyright Infringement Notice
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you believe in good faith that any content or financial guide hosted on FingTaj infringes upon your copyrighted work, submit a formal written notice to our Designated Copyright Agent containing:
            </p>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '22px' }}>
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material on FingTaj that is claimed to be infringing (including exact URL).</li>
              <li>Your contact information (name, postal address, telephone number, and official email address).</li>
              <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner.</li>
              <li>A statement that the information in the notification is accurate under penalty of perjury.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 8px', color: 'var(--text-primary)' }}>
              2. Designated Copyright Agent Contact
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Notices should be sent to:
              <br/>
              <b>Designated DMCA Agent</b><br/>
              FingTaj Technologies Legal Department<br/>
              Email: <a href="mailto:admin@fingtaj.com" style={{ color: 'var(--accent-cyan)' }}>admin@fingtaj.com</a> / <a href="mailto:legal@fingtaj.com" style={{ color: 'var(--accent-cyan)' }}>legal@fingtaj.com</a>
            </p>
          </div>
        )}

      </div>

    </section>
  );
};
