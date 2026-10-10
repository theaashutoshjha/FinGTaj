import React from 'react';
import { ShieldCheck, Award, BookOpen, Users, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      {/* Hero Badge & Heading */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Institutional Transparency</span>
        <h1 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
          About FingTaj Institutional Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
          Bridging mathematical rigor, automated cashflow operating systems, and verifiable financial research for long-term investors.
        </p>
      </div>

      {/* Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 245, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-cyan)' }}>
            <Cpu size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>Mathematical Ground Truth</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            We reject financial punditry and emotional market speculation. Every research guide and simulator on FingTaj is anchored in verifiable formulas—such as geometric compounding curves, Free Cash Flow to Firm (FCFF), and amortization schedules.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(138, 43, 226, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-purple)' }}>
            <BookOpen size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>Primary Source Verification</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Our editorial desk cross-checks all quantitative claims against official regulatory filings, Central Bank statistical releases (RBI, Federal Reserve), S&amp;P SPIVA scorecards, and statutory tax codes.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-emerald)' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>Fiduciary Editorial Integrity</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            FingTaj does not accept paid promotional articles or sponsored product endorsements that compromise analytical integrity. Our research is strictly independent, objective, and reader-first.
          </p>
        </div>

      </div>

      {/* Editorial Methodology & Disclaimer */}
      <div className="glass-card" style={{ padding: '40px', maxWidth: '880px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Editorial Methodology &amp; Quality Control</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
          Every piece of content published on FingTaj undergoes a multi-stage review process:
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
          <li><b>Empirical Research:</b> Topic validation with verifiable primary sources and academic financial literature.</li>
          <li><b>Mathematical Modeling:</b> Double-verification of all compounding equations, interest prepayment formulas, and tax brackets.</li>
          <li><b>Originality &amp; Plagiarism Gate:</b> Rigorous n-gram shingle overlap analysis preventing duplicative or thin content.</li>
          <li><b>Answer Engine Optimization (AEO):</b> Structuring clear direct answers and actionable takeaways for modern AI search engines.</li>
        </ul>

        <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Fiduciary Disclaimer</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            FingTaj provides educational simulations, research frameworks, and software tools. None of the content constitutes individual investment, tax, or legal advice. Investors should consult registered fiduciary advisors before capital deployment.
          </p>
        </div>
      </div>

    </section>
  );
};
