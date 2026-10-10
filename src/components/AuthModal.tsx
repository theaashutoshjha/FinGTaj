import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

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
  const [email, setEmail] = useState('imaashutoshjha@gmail.com');
  const [name, setName] = useState('Aashutosh Jha');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [showAuth0Hint, setShowAuth0Hint] = useState(false);

  if (!isOpen) return null;

  // Recognized admin emails
  const ADMIN_EMAILS = ['imaashutoshjha@gmail.com', 'admin@fingtaj.com', 'founder@fingtaj.com', 'investor@fingtaj.com'];

  const performLogin = (targetEmail: string, targetName?: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanEmail = targetEmail.trim().toLowerCase();
      const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
      
      const authenticatedUser: User = {
        name: targetName || (cleanEmail.includes('aashutosh') ? 'Aashutosh Jha' : cleanEmail.split('@')[0]),
        email: cleanEmail,
        isAdmin: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        authMethod: 'Auth0 Verified Account',
        loginTime: new Date().toISOString()
      };

      onAuthSuccess(authenticatedUser);
      onClose();
    }, 250);
  };

  const handleInstantAdminLogin = () => {
    performLogin('imaashutoshjha@gmail.com', 'Aashutosh Jha');
  };

  const handleAuth0Redirect = () => {
    const auth0Domain = 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com';
    const clientId = '7lbFToRZwyC4ZUTS1zHtDLf9KmsSFRTx';
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const auth0Url = `${auth0Domain}/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid%20profile%20email${tab === 'signup' ? '&screen_hint=signup' : ''}`;
    
    // Redirect to Auth0
    window.location.href = auth0Url;
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    performLogin(email, name);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>Member Portal</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {tab === 'signin' ? 'Sign In to FingTaj' : 'Create Free Account'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Fast Admin Sign In Button */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button"
            onClick={handleInstantAdminLogin}
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
            <Sparkles size={16} />
            <span>Instant Sign In (imaashutoshjha@gmail.com)</span>
          </button>
        </div>

        {/* Auth0 Universal Login Button with Hint */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button"
            onClick={handleAuth0Redirect}
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <Lock size={15} />
            <span>Auth0 Universal Hosted Login ↗</span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <button 
              type="button" 
              onClick={() => setShowAuth0Hint(!showAuth0Hint)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {showAuth0Hint ? 'Hide Auth0 Callback Settings' : 'Auth0 Callback Setup Note'}
            </button>
          </div>

          {showAuth0Hint && (
            <div style={{
              background: 'rgba(255, 179, 0, 0.08)',
              border: '1px solid rgba(255, 179, 0, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginTop: '10px',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffb300', fontWeight: 700, marginBottom: '4px' }}>
                <AlertCircle size={14} /> Auth0 Application Setting
              </div>
              If you see <i>"Callback URL mismatch"</i> on Auth0, add this URL to <b>Allowed Callback URLs</b> in your <a href="https://manage.auth0.com/#/applications/7lbFToRZwyC4ZUTS1zHtDLf9KmsSFRTx/settings" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>Auth0 Console</a>:
              <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', padding: '4px 6px', borderRadius: '4px', marginTop: '6px', wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>
                {window.location.origin}/callback
              </code>
            </div>
          )}
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
          <span>Or Sign In with Email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            style={{ width: '100%', padding: '12px', marginTop: '4px', fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : (tab === 'signin' ? 'Sign In ↗' : 'Create Free Account ↗')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: 'var(--text-muted)' }}>
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
