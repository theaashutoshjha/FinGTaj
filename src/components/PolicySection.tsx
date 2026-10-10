import React, { useState } from 'react';
import { Shield, FileText, Lock, CheckCircle } from 'lucide-react';

interface PolicySectionProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const PolicySection: React.FC<PolicySectionProps> = ({ initialTab = 'privacy' }) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Legal &amp; Regulatory Framework</span>
        <h1 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
          Policies &amp; Regulatory Transparency
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Updated for 2026. FingTaj operates under strict privacy, security, and fiduciary transparency guidelines.
        </p>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px' }}>
          <button 
            className={`btn ${tab === 'privacy' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('privacy')}
          >
            Privacy Policy
          </button>
          <button 
            className={`btn ${tab === 'terms' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('terms')}
          >
            Terms of Service
          </button>
          <button 
            className={`btn ${tab === 'disclaimer' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('disclaimer')}
          >
            Fiduciary Disclaimers
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '40px', maxWidth: '860px', margin: '0 auto', lineHeight: 1.8 }}>
        
        {/* 1. PRIVACY POLICY */}
        {tab === 'privacy' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Privacy Policy</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Effective Date: January 1, 2026 • Last Reviewed: March 2026</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>1. Data Collection &amp; Purpose</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              FingTaj ("we", "our", or "the Platform") collects only essential telemetry and authentication data necessary to deliver our institutional services. When you authenticate via Auth0 OpenID Connect or Google Identity Services, we process your verified email address, display name, and authentication token solely to maintain your session.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>2. Cookies &amp; Local Storage</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              We use secure, HTTP-only session cookies to manage cryptographic authentication sessions. Local browser storage is utilized strictly for client-side preferences (such as Dark/Light mode theme and saved calculator parameters). We do not sell user data to third-party data brokers.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>3. Third-Party Integrations</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              • <b>Auth0 by Okta:</b> Enterprise OpenID Connect identity provider handling token verification.<br/>
              • <b>Cloudflare Edge:</b> Global CDN, DDoS mitigation, and SSL/TLS 1.3 encryption.<br/>
              • <b>Google Analytics / AdSense:</b> Standard anonymous analytics and programmatic advertising in compliance with Google publisher guidelines and user consent policies.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>4. Data Deletion &amp; Rights</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Under applicable data protection laws (including GDPR and CCPA), you hold the right to request access, rectification, or complete erasure of your profile. To execute a deletion request, contact <b>security@fingtaj.com</b>.
            </p>
          </div>
        )}

        {/* 2. TERMS OF SERVICE */}
        {tab === 'terms' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Terms of Service</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Effective Date: January 1, 2026</p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>1. Acceptance of Terms</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              By accessing or using FingTaj.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must refrain from accessing our software and content.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>2. Intellectual Property &amp; Originality</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              All articles, mathematical simulator code, financial spreadsheets, and proprietary algorithms hosted on FingTaj are the copyrighted property of FingTaj Technologies. Automated scraping, unauthorized redistribution, or bulk resale is strictly prohibited.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>3. Digital Store &amp; Spreadsheet Toolkits</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Spreadsheets and templates are provided for personal and internal professional use. Digital goods are delivered electronically immediately upon completed transaction.
            </p>
          </div>
        )}

        {/* 3. FIDUCIARY DISCLAIMER */}
        {tab === 'disclaimer' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Fiduciary &amp; Regulatory Disclaimers</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Important Statutory Notice</p>

            <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid #ef4444', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ef4444', margin: '0 0 8px' }}>NOT FINANCIAL OR INVESTMENT ADVICE</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                The articles, calculators, research models, and tools provided on FingTaj.com are published strictly for educational, informational, and research simulation purposes. FingTaj is not a SEBI-registered Investment Advisor (RIA) or broker-dealer.
              </p>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>1. No Guarantee of Future Returns</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Historical asset performance, SIP compounding simulations, and discounted cash flow models do not guarantee future returns. Equity investments are subject to market risks, including the potential loss of principal capital.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '20px 0 8px' }}>2. Independent Professional Consultation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Always seek the counsel of a certified financial planner, registered fiduciary advisor, or qualified tax consultant before making any material investment, borrowing, or tax decisions.
            </p>
          </div>
        )}

      </div>

    </section>
  );
};
