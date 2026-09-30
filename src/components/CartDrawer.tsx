import React, { useState } from 'react';
import { Currency, CartItem } from '../types';
import { X, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: Currency;
  rateUSD: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: (discountAmount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  rateUSD,
  onUpdateQty,
  onRemoveItem,
  onOpenCheckout
}) => {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatMoney = (inr: number) => {
    if (currency === 'USD') {
      const usd = Math.round(inr * rateUSD);
      return '$' + Math.max(1, usd).toLocaleString('en-US');
    }
    return '₹' + inr.toLocaleString('en-IN');
  };

  const subtotalINR = cart.reduce((sum, item) => sum + item.product.priceINR * item.qty, 0);

  let discountINR = 0;
  if (appliedCoupon === 'WELCOME20') {
    discountINR = Math.round(subtotalINR * 0.2);
  } else if (appliedCoupon === 'TAJ50') {
    discountINR = Math.round(subtotalINR * 0.5);
  } else if (appliedCoupon === 'FREEVIP') {
    discountINR = subtotalINR;
  }

  const finalTotalINR = Math.max(0, subtotalINR - discountINR);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'WELCOME20' || code === 'TAJ50' || code === 'FREEVIP') {
      setAppliedCoupon(code);
      setCoupon('');
    } else {
      alert('Invalid coupon code. Try WELCOME20 or TAJ50!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(2, 6, 12, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: 'var(--bg-surface-elevated)',
        borderLeft: '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px' }}>Your Shopping Cart</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {cart.reduce((s, i) => s + i.qty, 0)} Items Selected
              </span>
            </div>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🛒</div>
              <p style={{ fontSize: '15px' }}>Your cart is empty.</p>
              <button 
                className="btn btn-secondary" 
                onClick={onClose} 
                style={{ marginTop: '16px', fontSize: '13px' }}
              >
                Browse Digital Store &nbsp;→
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
              {cart.map(item => (
                <div 
                  key={item.product.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.3 }}>{item.product.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                      {formatMoney(item.product.priceINR)} each
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <button 
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                      >-</button>
                      <span style={{ padding: '0 8px', fontSize: '12px', fontWeight: 700 }}>{item.qty}</span>
                      <button 
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                      >+</button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.product.id)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            
            {/* Coupon Code Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Discount Code (e.g. TAJ50)"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="input-field"
                style={{ padding: '8px 12px', fontSize: '12px' }}
              />
              <button 
                className="btn btn-secondary" 
                onClick={applyCoupon}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                Apply
              </button>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span className="text-mono">{formatMoney(subtotalINR)}</span>
              </div>

              {discountINR > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                  <span>Coupon ({appliedCoupon}):</span>
                  <span className="text-mono">-{formatMoney(discountINR)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span>Total:</span>
                <span className="text-mono text-gradient">{formatMoney(finalTotalINR)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button 
              className="btn btn-primary" 
              onClick={() => onOpenCheckout(discountINR, appliedCoupon || '')}
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              Proceed to Secure Checkout &nbsp;→
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
              <ShieldCheck size={12} color="var(--accent-emerald)" />
              <span>Razorpay 256-Bit SSL Secured Checkout</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
