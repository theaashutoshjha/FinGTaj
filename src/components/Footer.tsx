import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'rgba(3, 8, 15, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '60px 0 30px',
      marginTop: '60px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="wrap">
        
        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '48px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#03080f',
                fontWeight: 900,
                fontSize: '16px'
              }}>
                F
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>FingTaj PRO</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              Institutional wealth intelligence, automated cashflow operating systems, and formula-verified financial calculators.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={14} />
              <span>Verified 256-Bit Cryptographic Security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Disciplines
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><a href="#trading" onClick={(e) => { e.preventDefault(); onNavigate('trading'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Trading &amp; Valuation</a></li>
              <li><a href="#finance" onClick={(e) => { e.preventDefault(); onNavigate('finance'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Personal Finance &amp; Tax</a></li>
              <li><a href="#loans" onClick={(e) => { e.preventDefault(); onNavigate('loans'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Loans &amp; Amortization</a></li>
              <li><a href="#store" onClick={(e) => { e.preventDefault(); onNavigate('store'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Spreadsheet Store</a></li>
            </ul>
          </div>

          {/* Precision Tools */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Simulators
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>SIP Compounding Engine</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home Loan Prepayment Matrix</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FIRE Retirement Target</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>50/30/20 Cashflow Splitter</a></li>
            </ul>
          </div>

          {/* Regulatory & Institutional Notice */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Fiduciary Notice
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.6 }}>
              FingTaj provides educational simulations, research frameworks, and mathematical operating systems. Content is not individualized investment advice. Please consult a qualified SEBI / RIA registered fiduciary advisor before capital allocation.
            </p>
          </div>
        </div>

          {/* Bottom Legal Strip */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} FingTaj Technologies. All Rights Reserved. Deployed at <b>https://fingtaj.com/</b>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About FingTaj</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Desk</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('policy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('policy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>XML Sitemap</a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Robots.txt</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
