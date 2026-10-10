import React, { useState } from 'react';
import { Mail, MessageSquare, Shield, CheckCircle, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Research Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Communications Desk</span>
        <h1 style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>
          Contact FingTaj Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
          Reach out to our quantitative research desk, editorial team, or report technical and security inquiries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Contact Info & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 245, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Mail size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Research &amp; Editorial Desk</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 10px' }}>
              For factual corrections, research citations, and editorial submissions.
            </p>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              editorial@fingtaj.com
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                <Shield size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Security &amp; Vulnerability Disclosure</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 10px' }}>
              Responsible disclosure of potential vulnerabilities or session security concerns.
            </p>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              security@fingtaj.com
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Institutional Office &amp; Verification
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              FingTaj Digital Technologies<br />
              Cloudflare Edge Architecture • Globally Distributed<br />
              Primary Domain: https://fingtaj.com/
            </div>
          </div>

        </div>

        {/* Working Inquiry Form */}
        <div className="glass-card" style={{ padding: '36px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>Message Dispatched</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Thank you, <b>{name}</b>. Your message has been routed to the FingTaj desk. Our response SLA is within 24 business hours.
              </p>
              <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Submit an Inquiry</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 12px' }}>
                All correspondence is treated under strict confidentiality.
              </p>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Jane Investor" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="investor@domain.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Subject Discipline</label>
                <select 
                  className="input-field" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                >
                  <option value="Research Inquiry">Research Inquiry</option>
                  <option value="Factual Correction">Factual Correction</option>
                  <option value="Partnership & Licensing">Institutional Licensing</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Message Details</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  placeholder="Please specify your query or citation question in detail..." 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '8px' }}>
                <Send size={14} />
                <span>Transmit Message ↗</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </section>
  );
};
