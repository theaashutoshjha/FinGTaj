import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { X, Bookmark, Share2, Clock, Check, ShieldCheck, UserCheck, Calendar, BookOpen } from 'lucide-react';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

// Markdown parser helper for long-form educational articles
function renderArticleContent(rawContent: string): string {
  if (!rawContent) return '';
  
  // If content already contains HTML block tags, return as-is
  if (rawContent.trim().startsWith('<h') || rawContent.trim().startsWith('<div') || rawContent.trim().startsWith('<p>')) {
    return rawContent;
  }

  // Parse markdown tables first
  let html = rawContent.replace(/((?:\|.+\|\n?)+)/g, (tableText) => {
    const rawLines = tableText.trim().split('\n').filter(r => r.trim().startsWith('|'));
    if (rawLines.length < 2) return tableText;

    const headerCells = rawLines[0].split('|').map(c => c.trim()).filter(Boolean);
    const dataLines = rawLines.slice(2); // Skip header and separator

    const headerHtml = headerCells.map(h => `<th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--accent-cyan); font-weight:700;">${h}</th>`).join('');

    const rowsHtml = dataLines.map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      const rowTds = cells.map(c => `<td style="padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.06); color:var(--text-secondary);">${c}</td>`).join('');
      return `<tr>${rowTds}</tr>`;
    }).join('');

    return `<div style="overflow-x:auto; margin:24px 0;"><table style="width:100%; border-collapse:collapse; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--border-subtle); font-size:14px;"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  });

  // Parse markdown typography
  html = html
    .replace(/^# (.*$)/gim, '<h2 style="font-size:24px; font-weight:800; margin:32px 0 16px; color:var(--text-primary);">$1</h2>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size:20px; font-weight:700; margin:28px 0 14px; color:var(--text-primary);">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="font-size:17px; font-weight:700; margin:22px 0 10px; color:var(--accent-cyan);">$1</h4>')
    .replace(/^\-\-\-$/gim, '<hr style="border:none; border-top:1px solid var(--border-subtle); margin:28px 0;" />')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:var(--text-primary); font-weight:700;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre style="background:rgba(0,0,0,0.5); padding:16px; border-radius:8px; overflow-x:auto; border:1px solid var(--border-subtle); margin:18px 0; font-family:var(--font-mono); font-size:13px; color:var(--accent-cyan);"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code style="background:rgba(0,245,255,0.08); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:13px; color:var(--accent-cyan);">$1</code>')
    .replace(/^\- (.*$)/gim, '<li style="margin-bottom:8px; color:var(--text-secondary); line-height:1.6;">$1</li>')
    .replace(/((?:<li.*<\/li>\s*)+)/gim, '<ul style="padding-left:24px; margin:16px 0;">$1</ul>')
    .replace(/\n\n+/gim, '</p><p style="margin-bottom:18px; line-height:1.75; color:var(--text-secondary); font-size:15px;">');

  return `<p style="margin-bottom:18px; line-height:1.75; color:var(--text-secondary); font-size:15px;">${html}</p>`;
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
            <span className="badge badge-cyan">{article.tag || (article.tags && article.tags[0]) || article.category.toUpperCase()}</span>
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

          {/* Author Byline Strip */}
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
                  {article.author || 'FingTaj Research Desk'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {article.authorBio || 'Financial Literacy & Computational Research Desk'}
                </div>
              </div>
            </div>

            {/* Clean Educational Badge (Zero internal scores) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-cyan">
                <BookOpen size={12} /> Financial Education
              </span>
            </div>
          </div>

          {/* Key Takeaway & Conceptual Summary Box */}
          {(article.aeo?.directAnswer || article.aeoDirectAnswer) && (
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
                <span>Executive Summary &amp; Key Takeaway</span>
              </div>
              <p style={{
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                margin: '0 0 14px'
              }}>
                {article.aeo?.directAnswer || article.aeoDirectAnswer}
              </p>

              {article.aeo?.keyTakeaways && article.aeo.keyTakeaways.length > 0 && (
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

          {/* Formatted Article Content */}
          <div 
            className="article-reader-content"
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-secondary)'
            }}
            dangerouslySetInnerHTML={{ __html: renderArticleContent(article.content) }}
          />

          {/* AdSense Responsive In-Article Placement */}
          <div style={{
            margin: '36px 0 20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            border: '1px dashed var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Advertisement
            </div>
            <div style={{ minHeight: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '100%' }}
                   data-ad-client="ca-pub-9283748291029384"
                   data-ad-slot="9283748291"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <span>Verified Educational Ad Placement Area</span>
            </div>
          </div>

          {/* Citations & Primary Sources Section */}
          {article.sources && article.sources.length > 0 && (
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Verified Primary Sources &amp; Citations:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {article.sources.map((src, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      {src.title}
                    </a>
                    {src.publishedDate && ` (${src.publishedDate})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Statutory Regulatory Disclaimer */}
          <div style={{
            marginTop: '36px',
            padding: '16px 20px',
            borderRadius: '8px',
            background: 'rgba(0, 245, 255, 0.02)',
            border: '1px solid rgba(0, 245, 255, 0.1)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: 1.6
          }}>
            <strong>Regulatory Educational Notice:</strong> This article is authored solely for financial literacy and general educational comprehension under SEBI, RBI, and IRDAI awareness guidelines. FingTaj does not offer personalized financial, investment, legal, or tax advisory services. Readers should consult a SEBI registered investment advisor or certified financial professional before making financial decisions. Questions or editorial queries: <a href="mailto:admin@fingtaj.com" style={{ color: 'var(--accent-cyan)' }}>admin@fingtaj.com</a>.
          </div>

        </div>
      </div>
    </div>
  );
};
