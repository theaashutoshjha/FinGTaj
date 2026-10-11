import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, ShieldCheck, UserCheck, AlertCircle, ArrowRight, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { isEmailAdmin } from '../constants/auth';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleTabChange = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    resetForm();
  };

  // Direct In-App Authentication with Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      if (tab === 'signup') {
        if (password.length < 8) {
          setErrorMsg('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }

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
          throw new Error(data.error || 'Registration failed. Please try again.');
        }

        setSuccessMsg('Account created successfully! Welcome to FingTaj.');
        const authenticatedUser: User = {
          sub: data.user.sub || `usr-${cleanEmail}`,
          name: data.user.name || name.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          isAdmin: Boolean(data.user.isAdmin || isEmailAdmin(cleanEmail)),
          role: (data.user.isAdmin || isEmailAdmin(cleanEmail)) ? 'admin' : 'user',
          authMethod: 'Direct Email Account',
          loginTime: new Date().toISOString()
        };

        if (data.token) {
          localStorage.setItem('fingtaj_token', data.token);
        }
        localStorage.setItem('fingtaj_user', JSON.stringify(authenticatedUser));

        setTimeout(() => {
          onAuthSuccess(authenticatedUser);
          onClose();
        }, 600);

      } else {
        // Sign In Mode: Call direct /api/auth/login endpoint
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid email or password.');
        }

        setSuccessMsg('Authentication successful! Welcome back.');
        const authenticatedUser: User = {
          sub: data.user.sub || `usr-${cleanEmail}`,
          name: data.user.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          isAdmin: Boolean(data.user.isAdmin || isEmailAdmin(cleanEmail)),
          role: (data.user.isAdmin || isEmailAdmin(cleanEmail)) ? 'admin' : 'user',
          authMethod: 'Direct Email Account',
          loginTime: new Date().toISOString()
        };

        if (data.token) {
          localStorage.setItem('fingtaj_token', data.token);
        }
        localStorage.setItem('fingtaj_user', JSON.stringify(authenticatedUser));

        setTimeout(() => {
          onAuthSuccess(authenticatedUser);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Optional External Auth0 Universal Login for SSO
  const handleAuth0UniversalRedirect = () => {
    const targetUrl = tab === 'signup' ? '/signup' : '/login';
    const params = new URLSearchParams();
    if (email.trim()) {
      params.set('login_hint', email.trim().toLowerCase());
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    window.location.href = `${targetUrl}${query}`;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span className="badge badge-cyan">Direct Email Access</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-Time Authentication</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
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
            Sign In with Email
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

        {/* Real Direct Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'signup' && (
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px', display: 'block', fontWeight: 600 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Aashutosh Jha" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '36px' }}
                />
                <UserCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px', display: 'block', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="name@fingtaj.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="input-field" 
                style={{ width: '100%', paddingLeft: '36px' }}
                required 
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Password
              </label>
              {tab === 'signin' && (
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', cursor: 'pointer' }} onClick={() => setErrorMsg('For direct password assistance, write to admin@fingtaj.com')}>
                  Forgot?
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={tab === 'signup' ? 'Minimum 8 characters' : 'Enter account password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="input-field" 
                style={{ width: '100%', paddingLeft: '36px', paddingRight: '36px' }}
                required 
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {tab === 'signin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ cursor: 'pointer' }}>Keep me logged in on this device</label>
            </div>
          )}

          {/* Primary Action Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              marginTop: '6px',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
              color: '#03080f',
              boxShadow: '0 4px 15px rgba(0, 245, 255, 0.25)'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : tab === 'signin' ? (
              <>
                <span>Sign In Directly</span>
                <ArrowRight size={15} />
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Create Account Directly</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {tab === 'signin' ? (
            <span>New to FingTaj? <a href="#signup" onClick={(e) => { e.preventDefault(); handleTabChange('signup'); }} style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Create free account</a></span>
          ) : (
            <span>Already have an account? <a href="#signin" onClick={(e) => { e.preventDefault(); handleTabChange('signin'); }} style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Sign in</a></span>
          )}
        </div>

        {/* Discrete SSO / Auth0 Universal Link (Secondary, Not Forced) */}
        <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <button 
            type="button" 
            onClick={handleAuth0UniversalRedirect}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '11.5px', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Shield size={12} />
            <span>Or continue with Auth0 Universal Login / Social SSO ↗</span>
          </button>
        </div>

      </div>
    </div>
  );
};
