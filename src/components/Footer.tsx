import React from 'react';
import { BookOpen, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'rgba(3, 8, 15, 0.98)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '50px 0 26px',
      marginTop: '60px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="wrap">
        
        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
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
              <span style={{ fontSize: '18px', fontWeight: 800 }}>FingTaj</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '14px' }}>
              Educational financial literacy platform providing compounding simulators, loan amortization guides, and budgeting learning tools.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-cyan)' }}>
              <Mail size={14} />
              <a href="mailto:admin@fingtaj.com" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                admin@fingtaj.com
              </a>
            </div>
          </div>

          {/* Educational Categories */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', color: 'var(--text-primary)' }}>
              Learning Disciplines
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', padding: 0 }}>
              <li><a href="#trading" onClick={(e) => { e.preventDefault(); onNavigate('trading'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Investing &amp; Equity Markets</a></li>
              <li><a href="#finance" onClick={(e) => { e.preventDefault(); onNavigate('finance'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Personal Finance &amp; Tax</a></li>
              <li><a href="#loans" onClick={(e) => { e.preventDefault(); onNavigate('loans'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Loans &amp; Debt Management</a></li>
              <li><a href="#academy" onClick={(e) => { e.preventDefault(); onNavigate('academy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Financial Learning Academy</a></li>
            </ul>
          </div>

          {/* Educational Simulators */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', color: 'var(--text-primary)' }}>
              Free Calculators
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', padding: 0 }}>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>SIP Compounding Simulator</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home Loan Prepayment Matrix</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FIRE Retirement Target</a></li>
              <li><a href="#simulators" onClick={(e) => { e.preventDefault(); onNavigate('calculators'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>50/30/20 Cashflow Blueprint</a></li>
            </ul>
          </div>

          {/* Statutory Fiduciary Notice */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', color: 'var(--text-primary)' }}>
              Regulatory Disclosure
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.6 }}>
              FingTaj provides educational simulations and research articles strictly for informational purposes. FingTaj is not a SEBI registered investment advisor, broker, or research analyst. Content does not constitute financial, investment, tax, or legal advice.
            </p>
          </div>
        </div>

        {/* Bottom Legal Strip */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} FingTaj Education. All Rights Reserved. Contact: <b>admin@fingtaj.com</b>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About FingTaj</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('policy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('policy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms &amp; Disclaimers</a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Sitemap XML</a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Robots.txt</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
