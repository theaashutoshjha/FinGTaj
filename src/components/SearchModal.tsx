import React, { useState } from 'react';
import { ARTICLES } from '../data/articles';
import { PRODUCTS } from '../data/products';
import { Article, Product } from '../types';
import { X, Search, BookOpen, ShoppingBag, Calculator, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCalculator: (calcId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectProduct,
  onSelectCalculator
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedArticles = q 
    ? ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || (a.tag || '').toLowerCase().includes(q))
    : [];

  const matchedProducts = q
    ? PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    : [];

  const calculatorsList = [
    { id: 'sip', name: 'SIP Wealth Compounding Simulator', tag: 'Investment' },
    { id: 'emi', name: 'Loan EMI & Extra Prepayment Engine', tag: 'Loans' },
    { id: 'fire', name: 'FIRE Freedom Target Calculator', tag: 'Retirement' },
    { id: 'stepup', name: '10% Step-Up SIP Turbocharger', tag: 'Compounding' },
    { id: 'inflation', name: 'Purchasing Power Decay Calculator', tag: 'Economics' },
    { id: 'budget', name: '50/30/20 Cashflow Splitter', tag: 'Budgeting' }
  ];

  const matchedCalculators = q
    ? calculatorsList.filter(c => c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q))
    : [];

  const totalResults = matchedArticles.length + matchedProducts.length + matchedCalculators.length;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
        
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <Search size={20} color="var(--accent-cyan)" />
          <input
            type="text"
            placeholder="Search guides, calculators, and spreadsheets..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="input-field"
            style={{ fontSize: '16px', border: 'none', background: 'transparent', padding: '4px 0' }}
          />
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {!q ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
              <p style={{ fontSize: '13px' }}>Type keywords like "compounding", "loan", "tax", or "DCF".</p>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>No resources found matching "{query}".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Matched Calculators */}
              {matchedCalculators.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Calculators ({matchedCalculators.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {matchedCalculators.map(c => (
                      <div
                        key={c.id}
                        onClick={() => { onSelectCalculator(c.id); onClose(); }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                          <Calculator size={14} color="var(--accent-cyan)" />
                          <span>{c.name}</span>
                        </div>
                        <ArrowRight size={14} color="var(--accent-cyan)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Articles */}
              {matchedArticles.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Editorial Guides ({matchedArticles.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {matchedArticles.map(a => (
                      <div
                        key={a.id}
                        onClick={() => { onSelectArticle(a); onClose(); }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                          <BookOpen size={14} color="var(--accent-emerald)" />
                          <span>{a.title}</span>
                        </div>
                        <ArrowRight size={14} color="var(--accent-emerald)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Store Toolkits ({matchedProducts.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {matchedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { onSelectProduct(p); onClose(); }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                          <ShoppingBag size={14} color="var(--accent-amber)" />
                          <span>{p.title}</span>
                        </div>
                        <ArrowRight size={14} color="var(--accent-amber)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
