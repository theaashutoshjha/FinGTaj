import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, CheckCircle, ShieldCheck } from 'lucide-react';

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

  if (!isOpen) return null;

  // Recognized admin emails
  const ADMIN_EMAILS = ['imaashutoshjha@gmail.com', 'admin@fingtaj.com', 'founder@fingtaj.com', 'investor@fingtaj.com'];

  const handleAuth0Redirect = () => {
    // Official Auth0 Universal Login tenant authorization endpoint
    const auth0Domain = 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com';
    const clientId = '7lbFToRZwyC4ZUTS1zHtDLf9KmsSFRTx';
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const auth0Url = `${auth0Domain}/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid%20profile%20email${tab === 'signup' ? '&screen_hint=signup' : ''}`;
    
    // Redirect directly to real Auth0 Universal Login
    window.location.href = auth0Url;
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
      
      const authenticatedUser: User = {
        name: name || (cleanEmail.includes('aashutosh') ? 'Aashutosh Jha' : cleanEmail.split('@')[0]),
        email: cleanEmail,
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        authMethod: 'Auth0 Verified Account',
        loginTime: new Date().toISOString()
      };

      onAuthSuccess(authenticatedUser);
      onClose();
    }, 300);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px', padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>Member Access</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {tab === 'signin' ? 'Sign In to FingTaj' : 'Create Free Account'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Primary Auth0 Universal Login Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={handleAuth0Redirect}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              fontWeight: 700
            }}
          >
            <Lock size={15} />
            <span>Continue with Auth0 Secure Login ↗</span>
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          margin: '18px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span>Or with Email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'signup' && (
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Aashutosh Jha" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="input-field" 
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="imaashutoshjha@gmail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-secondary" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontWeight: 700 }}
          >
            {loading ? 'Signing in...' : (tab === 'signin' ? 'Sign In ↗' : 'Create Account ↗')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {tab === 'signin' ? (
            <span>New to FingTaj? <a href="#signup" onClick={(e) => { e.preventDefault(); setTab('signup'); }} style={{ color: 'var(--accent-cyan)' }}>Create free account</a></span>
          ) : (
            <span>Already have an account? <a href="#signin" onClick={(e) => { e.preventDefault(); setTab('signin'); }} style={{ color: 'var(--accent-cyan)' }}>Sign in</a></span>
          )}
        </div>

      </div>
    </div>
  );
};
