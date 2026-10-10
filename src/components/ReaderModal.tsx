import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { X, Bookmark, Share2, Clock, Check, ShieldCheck, ExternalLink, UserCheck, Calendar } from 'lucide-react';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (e: any) => {
      const el = e.target;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const container = document.getElementById('reader-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [article]);

  if (!article) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/#${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 110 }}>
      <div 
        className="modal-content" 
        style={{
          maxWidth: '880px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Reading Progress Line */}
        <div style={{
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
          transition: 'width 0.1s linear'
        }} />

        {/* Reader Topbar */}
        <div style={{
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(8, 14, 23, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">{article.tag || article.category.toUpperCase()}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {article.readTime}
            </span>
            {article.publishedAt && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn-icon" 
              onClick={onToggleBookmark}
              title={isBookmarked ? "Remove Bookmark" : "Save Guide"}
            >
              <Bookmark 
                size={16} 
                fill={isBookmarked ? 'var(--accent-cyan)' : 'none'} 
                color={isBookmarked ? 'var(--accent-cyan)' : 'var(--text-secondary)'} 
              />
            </button>

            <button 
              className="btn-icon" 
              onClick={handleShare}
              title="Copy Guide Link"
            >
              {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Share2 size={16} />}
            </button>

            <button className="btn-icon" onClick={onClose} title="Close Reader">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div 
          id="reader-scroll-container" 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 40px',
            background: 'var(--bg-main)'
          }}
        >
          {/* Article Header */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            {article.title}
          </h1>

          {/* Author Byline & Institutional Trust Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 245, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <UserCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {article.author || 'FingTaj Quantitative Research Team'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {article.authorBio || 'Institutional Quantitative Research Desk specializing in compounding mathematics.'}
                </div>
              </div>
            </div>

            {/* Quality Score Badges */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-cyan" title="Audited for Technical SEO">
                SEO {article.seo?.score ?? 98}/100
              </span>
              <span className="badge badge-purple" title="Answer Engine Optimization Score">
                AEO {article.aeo?.score ?? 96}/100
              </span>
            </div>
          </div>

          {/* AEO DIRECT ANSWER HIGHLIGHT BOX (LLM Optimized) */}
          {article.aeo?.directAnswer && (
            <div className="glass-card" style={{
              padding: '24px',
              borderLeft: '4px solid var(--accent-cyan)',
              marginBottom: '32px',
              background: 'rgba(0, 245, 255, 0.03)'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-cyan)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={14} />
                <span>Executive Answer &amp; Key Takeaway</span>
              </div>
              <p style={{
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                margin: '0 0 14px'
              }}>
                {article.aeo.directAnswer}
              </p>

              {article.aeo.keyTakeaways && article.aeo.keyTakeaways.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>
                    CORE PRINCIPLES:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {article.aeo.keyTakeaways.map((point, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Article HTML Content */}
          <div 
            className="article-reader-content"
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-secondary)'
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Citations & Primary Sources Section */}
          {article.sources && article.sources.length > 0 && (
            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
                Authoritative Primary Sources &amp; Citations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {article.sources.map((src, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    • <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      <b>{src.title}</b>
                    </a>
                    {src.publishedDate && <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}> ({src.publishedDate})</span>}
                    {src.snippet && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', paddingLeft: '12px' }}>"{src.snippet}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Fiduciary Notice */}
          <div style={{
            marginTop: '36px',
            padding: '18px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: 1.6
          }}>
            <b>Fiduciary Notice:</b> FingTaj publishes educational research and institutional simulation models. This guide does not constitute personal financial, tax, or legal advice. Please consult a SEBI / RIA registered advisor prior to capital allocation.
          </div>

        </div>

      </div>
    </div>
  );
};
