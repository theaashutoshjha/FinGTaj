import React from 'react';
import { ArrowRight, Calculator, BookOpen, Sparkles, Shield, BookCheck, Sparkle } from 'lucide-react';

interface HeroProps {
  onExploreStore: () => void;
  onLaunchCalculators: () => void;
  onOpenAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreStore,
  onLaunchCalculators,
  onOpenAI
}) => {
  return (
    <section style={{
      position: 'relative',
      padding: '60px 0 36px',
      overflow: 'hidden'
    }}>
      <div className="wrap" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        
        {/* Educational Purpose Kicker */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 245, 255, 0.08)',
          border: '1px solid rgba(0, 245, 255, 0.25)',
          marginBottom: '20px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-emerald)',
            boxShadow: '0 0 10px var(--accent-emerald)'
          }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)'
          }}>
            EDUCATIONAL FINANCIAL LITERACY &amp; WEALTH PLANNING PORTAL
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 62px)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          maxWidth: '920px',
          margin: '0 auto 18px'
        }}>
          Master Your Financial Future Through <br />
          <span className="text-gradient">Independent Education &amp; Calculators</span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(15px, 1.7vw, 18px)',
          color: 'var(--text-secondary)',
          maxWidth: '760px',
          margin: '0 auto 30px',
          lineHeight: 1.65
        }}>
          Explore interactive compounding simulators, loan prepayment calculators, budgeting worksheets, and comprehensive personal finance guides. Designed strictly for educational and illustrative purposes in compliance with SEBI and RBI guidelines.
        </p>

        {/* Statutory Regulatory Notice Banner */}
        <div style={{
          maxWidth: '780px',
          margin: '0 auto 36px',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          textAlign: 'center'
        }}>
          <b style={{ color: 'var(--text-primary)' }}>Regulatory Compliance Note:</b> FingTaj is an educational platform and does not provide financial advice, stock tips, or investment recommendations. Consult a SEBI-registered Investment Adviser (RIA) for personal financial planning.
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '48px'
        }}>
          <button 
            className="btn btn-primary" 
            onClick={onLaunchCalculators}
            style={{ padding: '13px 26px', fontSize: '14px' }}
          >
            <Calculator size={18} />
            Explore Financial Calculators
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onExploreStore}
            style={{ padding: '13px 24px', fontSize: '14px' }}
          >
            <BookOpen size={18} />
            Learning Templates &amp; Guides
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onOpenAI}
            style={{ 
              padding: '13px 22px', 
              fontSize: '14px',
              borderColor: 'rgba(0, 245, 255, 0.3)',
              color: 'var(--accent-cyan)'
            }}
          >
            <Sparkles size={16} />
            Ask Financial Co-Pilot
          </button>
        </div>

        {/* Feature Educational Cards (Forbidden jargon removed) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 245, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              flexShrink: 0
            }}>
              <Calculator size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Interactive Calculators</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SIP, EMI, Tax &amp; FIRE planning</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)',
              flexShrink: 0
            }}>
              <BookCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>SEBI &amp; RBI Compliant Guides</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100% educational research</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
              flexShrink: 0
            }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Free Planning Worksheets</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Budgeting &amp; cashflow templates</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
