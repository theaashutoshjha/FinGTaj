import React, { useState, useEffect } from 'react';
import { CALCULATOR_GUIDES, CalculatorGuideData } from '../data/calculatorGuides';
import { BookOpen, Calculator, Table, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';

interface CalculatorGuideSectionProps {
  calcId: string;
}

export const CalculatorGuideSection: React.FC<CalculatorGuideSectionProps> = ({ calcId }) => {
  const guide: CalculatorGuideData = CALCULATOR_GUIDES[calcId] || CALCULATOR_GUIDES['sip'];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Inject FAQPage Schema into <head> for search engines and AdSense crawlers
  useEffect(() => {
    let script = document.getElementById('calculator-faqpage-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'calculator-faqpage-schema';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': guide.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    script.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById('calculator-faqpage-schema');
      if (el) el.remove();
    };
  }, [guide]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <article className="calculator-educational-guide" style={{ marginTop: '50px' }}>
      
      {/* Google AdSense Responsive Placement */}
      <AdSenseSlot format="in-article" slotId="9283748295" />

      {/* Guide Header */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
          <FileText size={12} />
          In-Depth Mathematical Research &amp; Regulatory Analysis
        </span>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, lineHeight: 1.3, marginBottom: '14px' }}>
          {guide.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65 }}>
          {guide.subtitle}
        </p>
      </div>

      {/* Section B: Mathematical Methodology & Formula */}
      <section className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 245, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Calculator size={18} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Mathematical Architecture &amp; Core Equation
          </h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
          The computational output rendered above is derived using standardized financial compounding algorithms and reducing-balance amortization mechanics:
        </p>

        {/* Clean Semantic Math Box */}
        <div style={{
          background: 'rgba(2, 6, 12, 0.95)',
          borderLeft: '4px solid var(--accent-cyan)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '20px',
          margin: '20px 0',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '17px',
          color: 'var(--accent-cyan)',
          textAlign: 'center',
          letterSpacing: '0.04em'
        }}>
          <strong>{guide.formula}</strong>
        </div>

        {/* Variable Definitions */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Variable Definitions &amp; Derivations:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {guide.formulaVariables.map((v, i) => (
              <div key={i} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <code style={{ background: 'rgba(0, 245, 255, 0.1)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '13px' }}>
                    {v.symbol}
                  </code>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{v.meaning}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {v.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section C: Worked Scenario Comparison Table */}
      <section className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <Table size={18} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Worked Comparative Scenarios (Three-Tier Modeling)
          </h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
          The following matrix demonstrates how small deviations in rates, tenure, or contribution scale impact the final financial milestone:
        </p>

        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.04)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-cyan)', fontWeight: 700 }}>Scenario Class</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-cyan)', fontWeight: 700 }}>Rate / Constraint</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-cyan)', fontWeight: 700 }}>Input Volume</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-cyan)', fontWeight: 700 }}>Horizon</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-cyan)', fontWeight: 700 }}>Interest / Returns</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--accent-emerald)', fontWeight: 800 }}>Net Outcome</th>
              </tr>
            </thead>
            <tbody>
              {guide.scenarios.map((sc, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{sc.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sc.rateOrTenure}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sc.monthlyOrPrincipal}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sc.duration}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-amber)', fontWeight: 600 }}>{sc.estimatedReturnOrInterest}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-emerald)', fontWeight: 800 }} className="text-mono">{sc.netMaturityOrTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '10px 0 0', fontStyle: 'italic' }}>
          {guide.scenarioNotes}
        </p>
      </section>

      {/* Section D: Strategic Regulatory & Practical Analysis (600-800 words) */}
      <section className="glass-card" style={{ padding: '36px', marginBottom: '32px', lineHeight: 1.8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
            <BookOpen size={18} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            Strategic Insights, Indian Regulatory Nuances &amp; Tax Impact
          </h3>
        </div>

        {guide.strategicAnalysis.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '26px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
              {sec.heading}
            </h4>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Section E: FAQ Accordion with JSON-LD Schema */}
      <section className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Frequently Asked Questions (Institutional FAQ)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {guide.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={16} color="var(--accent-cyan)" /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                    <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section F: In-Page Contextual Educational Mini-Disclaimer */}
      <div style={{
        background: 'rgba(0, 245, 255, 0.02)',
        border: '1px solid rgba(0, 245, 255, 0.1)',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12.5px',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }}>
        <AlertCircle size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Statutory Disclaimer:</strong> {guide.disclaimer}
        </span>
      </div>

      {/* Bottom AdSlot */}
      <AdSenseSlot format="horizontal" slotId="9283748296" />

    </article>
  );
};
