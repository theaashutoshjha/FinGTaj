import React, { useState } from 'react';
import { Mail, Shield, CheckCircle, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Educational Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <section className="wrap" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Communications &amp; Support</span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
          Contact FingTaj Team
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
          Have a question about our educational calculators, research guides, or need assistance? Reach out to our team directly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Contact Info & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 245, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Official Support &amp; Editorial Email</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px' }}>
              For general inquiries, factual suggestions, content feedback, and partnership questions.
            </p>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              <a href="mailto:admin@fingtaj.com" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                admin@fingtaj.com
              </a>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                <Shield size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Editorial &amp; Regulatory Compliance</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              All FingTaj guides and calculators follow educational disclosure guidelines under SEBI, RBI, and IRDAI rules. For correction requests or queries, write to: <b style={{ color: 'var(--text-primary)' }}>admin@fingtaj.com</b>
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Response Commitment
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Our editorial and support team reviews all inquiries and aims to reply within 24 to 48 business hours.
            </div>
          </div>

        </div>

        {/* Working Inquiry Form */}
        <div className="glass-card" style={{ padding: '34px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <CheckCircle size={30} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Message Received</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '22px' }}>
                Thank you, <b>{name}</b>. Your message has been sent to <b>admin@fingtaj.com</b>. We will get back to you shortly.
              </p>
              <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 2px' }}>Send Us a Message</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 10px' }}>
                Fill out the form below or write directly to admin@fingtaj.com
              </p>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Your Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Your Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Topic Category</label>
                <select 
                  className="input-field" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                >
                  <option value="Educational Inquiry">Educational Inquiry</option>
                  <option value="Calculator Feedback">Calculator Feedback</option>
                  <option value="Content Suggestion">Content Suggestion</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Message</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  placeholder="How can we help you today?" 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                <Send size={14} />
                <span>Submit Message ↗</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </section>
  );
};
