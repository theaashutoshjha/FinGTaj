import React from 'react';
import { ShieldCheck, BookOpen, Calculator, Award, Mail } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      {/* Hero Badge & Heading */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Independent Financial Education</span>
        <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
          About FingTaj Financial Education
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.65 }}>
          FingTaj is a free educational financial literacy portal created to help Indian citizens, savers, and young professionals understand personal finance, loan economics, tax optimization, and wealth compounding.
        </p>
      </div>

      {/* Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '50px' }}>
        
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 245, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: 'var(--accent-cyan)' }}>
            <Calculator size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Mathematical Understanding</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Rather than relying on vague opinions, our tools demonstrate the pure mathematics of finance: how compounding curves work, how extra EMI payments reduce loan tenures, and how expense ratios impact long-term corpus.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: 'var(--accent-emerald)' }}>
            <BookOpen size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>SEBI &amp; RBI Compliance</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            In adherence to the Securities and Exchange Board of India (SEBI) and Reserve Bank of India (RBI) educational guidelines, we maintain strict editorial boundaries. We do not provide individualized stock tips, buy/sell advice, or investment management.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: 'var(--accent-amber)' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Independent Editorial Standards</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Our articles and guides are independently researched, citing primary sources like the Income Tax Act 1961, RBI Master Directions, SEBI Investor Education literature, and S&amp;P SPIVA indices.
          </p>
        </div>

      </div>

      {/* Editorial Methodology & Disclaimer */}
      <div className="glass-card" style={{ padding: '38px', maxWidth: '880px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>Our Educational Mission &amp; Standards</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '14px' }}>
          Financial literacy in India remains under 27% according to regulatory surveys. Our mission is to bridge this gap by providing high-quality, transparent, and easy-to-understand educational tools that empower individuals to take control of their financial destiny.
        </p>

        <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
          <li><b>Illustrative Learning:</b> All numbers, returns, and tax computations are illustrative models for educational study.</li>
          <li><b>No Commercial Bias:</b> We do not push commissioned products or opaque financial instruments.</li>
          <li><b>Reader Privacy:</b> Calculator simulations execute privately in your browser without tracking personal financial data.</li>
          <li><b>Official Contact:</b> For any editorial feedback, write to our team at <b>admin@fingtaj.com</b>.</li>
        </ul>

        <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Important Regulatory Disclaimer</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            FingTaj is an educational website and does not offer financial advisory or broker services. Content is not intended to be a substitute for professional financial advice. Please consult a SEBI registered investment adviser before making any investment decisions.
          </p>
        </div>
      </div>

    </section>
  );
};
