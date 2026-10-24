import React, { useState } from 'react';
import { Currency, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ShoppingBag, Star, Download, ShieldCheck, Check } from 'lucide-react';

interface StoreSectionProps {
  currency: Currency;
  rateUSD: number;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  currency,
  rateUSD,
  onAddToCart,
  onBuyNow
}) => {
  const [filter, setFilter] = useState<string>('all');

  const formatMoney = (inr: number) => {
    if (currency === 'USD') {
      const usd = Math.round(inr * rateUSD);
      return '$' + Math.max(1, usd).toLocaleString('en-US');
    }
    return '₹' + inr.toLocaleString('en-IN');
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section style={{ padding: '60px 0' }} id="store">
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-cyan">
              <ShoppingBag size={13} />
              Educational Research Templates
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
            Supplementary Worksheets &amp; <span className="text-gradient">Study Models</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            Open-formula financial spreadsheets and academic study models designed to accompany our educational research literature. Instant delivery, zero macros, open formulas.
          </p>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '28px'
          }}>
            {[
              { id: 'all', label: `All Toolkits (${PRODUCTS.length})` },
              { id: 'spreadsheet', label: 'Financial Spreadsheets (.xlsx)' },
              { id: 'blueprint', label: 'Actionable Blueprints' },
              { id: 'membership', label: 'VIP Lifetime Pass' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === tab.id ? 'none' : '1px solid var(--border-subtle)',
                  background: filter === tab.id ? 'var(--gradient-brand)' : 'rgba(255, 255, 255, 0.05)',
                  color: filter === tab.id ? '#03080f' : 'var(--text-secondary)',
                  boxShadow: filter === tab.id ? '0 0 15px rgba(0, 245, 255, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(p => (
            <div 
              key={p.id} 
              className="glass-card" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px'
              }}
            >
              <div>
                {/* Badge & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span className={`badge ${p.category === 'membership' ? 'badge-gold' : 'badge-cyan'}`}>
                    {p.badge}
                  </span>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {p.category === 'spreadsheet' ? '📊' : (p.category === 'membership' ? '👑' : '📘')}
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 style={{ fontSize: '18px', marginBottom: '10px', lineHeight: 1.4 }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '18px' }}>
                  {p.desc}
                </p>

                {/* Specs Pill */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: 'var(--accent-cyan)',
                  marginBottom: '20px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {p.specs}
                </div>
              </div>

              {/* Price & Actions */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }} className="text-mono">
                    {formatMoney(p.priceINR)}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }} className="text-mono">
                    {formatMoney(p.origPriceINR)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => onBuyNow(p)}
                    style={{ padding: '10px', fontSize: '13px' }}
                  >
                    Buy Now
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onAddToCart(p)}
                    style={{ padding: '10px', fontSize: '13px' }}
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
