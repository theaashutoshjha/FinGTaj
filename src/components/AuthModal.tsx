import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, ShieldCheck, UserCheck, AlertCircle, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { AUTH0_CONFIG, buildAuth0AuthorizeUrl, isEmailAdmin } from '../constants/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAuth0Hint, setShowAuth0Hint] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleTabChange = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    resetForm();
  };

  // Launch Auth0 Universal Login / Hosted Experience
  const handleAuth0HostedRedirect = () => {
    setErrorMsg(null);
    const targetUrl = tab === 'signup' ? '/signup' : '/login';
    const params = new URLSearchParams();
    if (email.trim()) {
      params.set('login_hint', email.trim().toLowerCase());
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    // Navigate through backend OIDC handler (proxied by Vite in dev or handled directly by Express)
    window.location.href = `${targetUrl}${query}`;
  };

  // Direct Auth0 Registration & Login Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (tab === 'signup') {
      if (!password || password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: name.trim() || undefined
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed at identity provider.');
        }

        setSuccessMsg('Account registered with Auth0! Redirecting to secure login...');
        
        // Short pause then redirect to Auth0 login with email pre-filled
        setTimeout(() => {
          window.location.href = `/login?login_hint=${encodeURIComponent(cleanEmail)}`;
        }, 1200);
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected authentication error occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      // In Sign In mode:
      // Redirect to Auth0 Universal Login with login_hint so the user signs in with Auth0
      setLoading(true);
      const params = new URLSearchParams();
      if (cleanEmail) {
        params.set('login_hint', cleanEmail);
      }
      window.location.href = `/login?${params.toString()}`;
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span className="badge badge-cyan">Auth0 Security</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enterprise Identity</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {tab === 'signin' ? 'Sign In to FingTaj' : 'Create Free Account'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close authentication modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: tab === 'signin' ? 'var(--accent-cyan)' : 'transparent',
              color: tab === 'signin' ? '#03080f' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: tab === 'signup' ? 'var(--accent-cyan)' : 'transparent',
              color: tab === 'signup' ? '#03080f' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#fda4af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth0 Universal Hosted Login / Sign Up Button */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button"
            onClick={handleAuth0HostedRedirect}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '13.5px',
              background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
              color: '#03080f',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(0, 245, 255, 0.25)'
            }}
          >
            <Lock size={16} />
            <span>
              {tab === 'signin' 
                ? 'Continue with Auth0 Universal Login ↗' 
                : 'Sign Up with Auth0 Hosted Portal ↗'}
            </span>
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          margin: '16px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span>Or Continue with Email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Real Email Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tab === 'signup' && (
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Your Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="input-field" 
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder={tab === 'signup' ? 'Min 8 chars with symbols' : 'Enter your password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input-field" 
              required={tab === 'signup'}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-secondary" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '4px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              'Authenticating with Auth0...'
            ) : tab === 'signin' ? (
              <>
                <span>Sign In via Auth0</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <ShieldCheck size={15} />
                <span>Create Verified Auth0 Account</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {tab === 'signin' ? (
            <span>New to FingTaj? <a href="#signup" onClick={(e) => { e.preventDefault(); handleTabChange('signup'); }} style={{ color: 'var(--accent-cyan)' }}>Create free account</a></span>
          ) : (
            <span>Already have an account? <a href="#signin" onClick={(e) => { e.preventDefault(); handleTabChange('signin'); }} style={{ color: 'var(--accent-cyan)' }}>Sign in</a></span>
          )}
        </div>

        {/* Auth0 Callback Setup Assistance */}
        <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <button 
            type="button" 
            onClick={() => setShowAuth0Hint(!showAuth0Hint)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showAuth0Hint ? 'Hide Auth0 Settings Note' : 'Auth0 Callback Setting Info'}
          </button>
        </div>

        {showAuth0Hint && (
          <div style={{
            background: 'rgba(0, 245, 255, 0.05)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginTop: '10px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
              <Shield size={13} /> Auth0 Allowed Callback URLs
            </div>
            When deploying on new domains or hosts, verify that the callback URL is registered in the Auth0 Application Settings:
            <code style={{ display: 'block', background: 'rgba(0,0,0,0.5)', padding: '4px 6px', borderRadius: '4px', marginTop: '6px', wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>
              {window.location.origin}/callback
            </code>
          </div>
        )}

      </div>
    </div>
  );
};
