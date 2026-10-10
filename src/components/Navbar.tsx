import React, { useState } from 'react';
import { Currency, User } from '../types';
import { 
  Sparkles, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  toggleCurrency: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  cartCount: number;
  openCart: () => void;
  openAuth: () => void;
  openAI: () => void;
  openSearch: () => void;
  openAdmin?: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  toggleCurrency,
  theme,
  toggleTheme,
  cartCount,
  openCart,
  openAuth,
  openAI,
  openSearch,
  openAdmin,
  user,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'trading', label: 'Investing' },
    { id: 'finance', label: 'Personal Finance' },
    { id: 'loans', label: 'Loans & EMIs' },
    { id: 'calculators', label: 'Calculators' },
    { id: 'store', label: 'Worksheets' },
    { id: 'academy', label: 'Academy' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'hub', label: 'My Hub' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(3, 8, 15, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.2s ease'
    }}>
      <div className="wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 245, 255, 0.35)',
            color: '#03080f',
            fontWeight: 900,
            fontSize: '18px'
          }}>
            F
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              lineHeight: 1.2
            }}>
              <span>FingTaj</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Financial Education
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  background: isActive ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* AI Copilot Button */}
          <button 
            className="btn btn-secondary" 
            onClick={openAI}
            style={{
              padding: '7px 14px',
              fontSize: '12px',
              gap: '6px',
              borderColor: 'rgba(0, 245, 255, 0.3)'
            }}
          >
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--accent-cyan)' }}>FingTaj AI</span>
          </button>

          {/* Admin Command Center for Administrators */}
          {user?.isAdmin && openAdmin && (
            <button 
              className="btn" 
              onClick={openAdmin}
              style={{
                padding: '7px 14px',
                fontSize: '12px',
                gap: '6px',
                background: 'rgba(0, 245, 255, 0.12)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan)',
                fontWeight: 700
              }}
              title="Open Institutional Admin Dashboard"
            >
              <span>Admin Console ↗</span>
            </button>
          )}

          {/* Currency Switcher */}
          <button 
            className="btn-icon" 
            onClick={toggleCurrency} 
            title={`Switch Currency (Current: ${currency})`}
            style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-cyan)' }}
          >
            {currency === 'INR' ? '₹' : '$'}
          </button>

          {/* Search Trigger */}
          <button 
            className="btn-icon" 
            onClick={openSearch} 
            title="Search FingTaj Articles & Tools"
          >
            <Search size={16} />
          </button>

          {/* Shopping Cart Button */}
          <button 
            className="btn-icon" 
            onClick={openCart} 
            title="Open Shopping Cart"
          >
            <ShoppingCart size={17} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-cyan)',
                color: '#03080f',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0, 245, 255, 0.6)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme} 
            title="Toggle Dark / Light Mode"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth Button / Profile Avatar */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    style={{ width: '28px', height: '28px', borderRadius: '50%' }} 
                  />
                ) : (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#03080f',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    {user.name.charAt(0)}
                  </div>
                )}
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </div>

              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '210px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200
                }}>
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{user.name}</span>
                      {user.isAdmin && <span className="badge badge-emerald" style={{ fontSize: '9px' }}>ADMIN</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>
                  {user.isAdmin && openAdmin && (
                    <button
                      onClick={() => { openAdmin(); setProfileDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(0, 245, 255, 0.08)',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        textAlign: 'left',
                        fontSize: '13px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}
                    >
                      Admin Console ↗
                    </button>
                  )}
                  <button
                    onClick={() => { setActiveTab('hub'); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      fontSize: '13px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    My Wealth Hub
                  </button>
                  <button
                    onClick={() => { onLogout(); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      textAlign: 'left',
                      fontSize: '13px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={openAuth}
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Sign In ↗
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="btn-icon mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: activeTab === link.id ? 'rgba(0, 245, 255, 0.12)' : 'transparent',
                color: activeTab === link.id ? 'var(--accent-cyan)' : 'var(--text-primary)',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
