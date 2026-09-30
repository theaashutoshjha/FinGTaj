import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { X, Bookmark, Share2, Clock, Check } from 'lucide-react';

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
    navigator.clipboard.writeText(window.location.origin + '#' + article.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content" 
        style={{
          maxWidth: '820px',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Reading Progress Line */}
        <div style={{
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'var(--gradient-brand)',
          transition: 'width 0.1s linear'
        }} />

        {/* Reader Topbar */}
        <div style={{
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">{article.tag}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {article.readTime}
            </span>
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

            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div 
          id="reader-scroll-container"
          style={{
            padding: '36px 40px',
            overflowY: 'auto',
            flex: 1,
            lineHeight: 1.8
          }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: '20px', lineHeight: 1.3 }}>
            {article.title}
          </h1>

          <div 
            className="article-reader-content"
            dangerouslySetInnerHTML={{ __html: article.content }} 
            style={{ fontSize: '16px', color: 'var(--text-secondary)' }}
          />
        </div>

        <style>{`
          .article-reader-content h2 {
            font-size: 22px;
            color: var(--text-primary);
            margin: 28px 0 12px;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 8px;
          }
          .article-reader-content p {
            margin-bottom: 16px;
          }
          .article-reader-content b, .article-reader-content strong {
            color: var(--text-primary);
          }
        `}</style>
      </div>
    </div>
  );
};
