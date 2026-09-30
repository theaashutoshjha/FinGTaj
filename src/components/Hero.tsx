import React from 'react';
import { ArrowRight, Calculator, ShoppingBag, Sparkles, Shield, Cpu, Flame } from 'lucide-react';

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
      padding: '70px 0 40px',
      overflow: 'hidden'
    }}>
      <div className="wrap" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        
        {/* Kicker Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 245, 255, 0.08)',
          border: '1px solid rgba(0, 245, 255, 0.25)',
          marginBottom: '24px',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            boxShadow: '0 0 10px var(--accent-cyan)'
          }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)'
          }}>
            INSTITUTIONAL GRADE WEALTH OPERATING SYSTEM
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 68px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '960px',
          margin: '0 auto 20px'
        }}>
          Engineering Your Path to <br />
          <span className="text-gradient">Financial Sovereignty</span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 1.8vw, 19px)',
          color: 'var(--text-secondary)',
          maxWidth: '740px',
          margin: '0 auto 36px',
          lineHeight: 1.65
        }}>
          Ditch linear intuition. Deploy institutional-grade compounding simulators, automated cashflow spreadsheets, and verified algorithmic wealth blueprints built for the 2026 economy.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '56px'
        }}>
          <button 
            className="btn btn-primary" 
            onClick={onLaunchCalculators}
            style={{ padding: '14px 28px', fontSize: '15px' }}
          >
            <Calculator size={18} />
            Launch Financial Simulators
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onExploreStore}
            style={{ padding: '14px 28px', fontSize: '15px' }}
          >
            <ShoppingBag size={18} />
            Explore Digital Store
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onOpenAI}
            style={{ 
              padding: '14px 24px', 
              fontSize: '15px',
              borderColor: 'rgba(0, 245, 255, 0.3)',
              color: 'var(--accent-cyan)'
            }}
          >
            <Sparkles size={18} />
            FingTaj AI Copilot
          </button>
        </div>

        {/* Feature Micro-Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 245, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>8 Precision Simulators</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time compound mathematics</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Institutional Security</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SHA-256 &amp; Google OAuth 2.0</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Flame size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Formula-Driven Sheets</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Zero macro risk, lifetime access</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
