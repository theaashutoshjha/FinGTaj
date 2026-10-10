import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fingtaj_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth page load UX
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem('fingtaj_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('fingtaj_cookie_consent', 'essential_only');
    setVisible(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      right: '24px',
      maxWidth: '620px',
      margin: '0 auto',
      background: 'rgba(8, 14, 23, 0.96)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 255, 0.1)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Cryptographic Privacy &amp; Cookie Consent
          </span>
        </div>
        <button className="btn-icon" onClick={handleDecline} style={{ padding: '4px' }}>
          <X size={14} />
        </button>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
        FingTaj uses strictly necessary session cookies for Auth0 OpenID Connect authentication and anonymous telemetry to maintain platform reliability. We never sell your personal data.{' '}
        <a 
          href="#privacy" 
          onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }} 
          style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
        >
          Review our Privacy Policy
        </a>.
      </p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={handleDecline} style={{ fontSize: '12px', padding: '6px 14px' }}>
          Essential Only
        </button>
        <button className="btn btn-primary" onClick={handleAccept} style={{ fontSize: '12px', padding: '6px 18px' }}>
          Accept All Cookies ↗
        </button>
      </div>
    </div>
  );
};
