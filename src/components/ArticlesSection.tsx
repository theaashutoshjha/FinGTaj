import React, { useState } from 'react';
import { Article } from '../types';
import { ARTICLES } from '../data/articles';
import { BookOpen, Bookmark, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface ArticlesSectionProps {
  onOpenArticle: (article: Article) => void;
  savedArticleIds: string[];
  onToggleBookmark: (articleId: string) => void;
  initialCategory?: 'all' | 'trading' | 'finance' | 'loans' | 'tech';
  articles?: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  onOpenArticle,
  savedArticleIds,
  onToggleBookmark,
  initialCategory = 'all',
  articles
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const articleList = articles && articles.length > 0 ? articles : ARTICLES;
  const filtered = articleList.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const displayedArticles = filtered.slice(0, visibleCount);

  return (
    <section style={{ padding: '60px 0' }} id="articles">
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-cyan">
              <BookOpen size={13} />
              Educational Financial Library
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
            Comprehensive Financial <span className="text-gradient">Education</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>
            In-depth guides on index investing, corporate valuations, tax optimization, debt management, and digital banking security. Provided strictly for educational awareness in compliance with SEBI, RBI, and IRDAI standards.
          </p>

          {/* Category Filter Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '28px'
          }}>
            {[
              { id: 'all', label: `All Disciplines (${articleList.length})` },
              { id: 'trading', label: `Trading & Equity (${articleList.filter(a => a.category === 'trading').length})` },
              { id: 'finance', label: `Personal Finance & Tax (${articleList.filter(a => a.category === 'finance').length})` },
              { id: 'loans', label: `Loans & Amortization (${articleList.filter(a => a.category === 'loans').length})` },
              { id: 'tech', label: `Fintech & Security (${articleList.filter(a => a.category === 'tech').length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setVisibleCount(12);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedCategory === tab.id ? 'none' : '1px solid var(--border-subtle)',
                  background: selectedCategory === tab.id ? 'var(--gradient-brand)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === tab.id ? '#03080f' : 'var(--text-secondary)',
                  boxShadow: selectedCategory === tab.id ? '0 0 15px rgba(0, 245, 255, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Regulatory Disclosure Banner */}
        <div style={{
          background: 'rgba(0, 245, 255, 0.03)',
          border: '1px solid rgba(0, 245, 255, 0.12)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldCheck size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Educational Notice:</strong> FingTaj is an independent educational portal, not a SEBI registered investment advisor or broker. All case studies, calculations, and content are provided solely for financial literacy and conceptual research.
          </span>
        </div>

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {displayedArticles.map(art => {
            const isBookmarked = savedArticleIds.includes(art.id);
            const tagColor = art.category === 'trading' 
              ? 'var(--accent-cyan)' 
              : art.category === 'finance' 
                ? 'var(--accent-emerald)' 
                : art.category === 'loans' 
                  ? 'var(--accent-amber)' 
                  : '#a78bfa';

            return (
              <article
                key={art.id}
                className="glass-card"
                onClick={() => onOpenArticle(art)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  {/* Category Tag & Bookmark */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: tagColor
                    }}>
                      {art.tag || (art.tags && art.tags[0]) || art.category.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(art.id);
                      }}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      title={isBookmarked ? "Remove Bookmark" : "Save to My Hub"}
                    >
                      <Bookmark 
                        size={14} 
                        fill={isBookmarked ? 'var(--accent-cyan)' : 'none'} 
                        color={isBookmarked ? 'var(--accent-cyan)' : 'var(--text-secondary)'} 
                      />
                    </button>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 style={{ fontSize: '18px', lineHeight: 1.4, marginBottom: '10px' }}>
                    {art.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                    {art.excerpt}
                  </p>
                </div>

                {/* Meta info & Read CTA */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Guide <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="btn btn-secondary"
              style={{
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)'
              }}
            >
              Load More Guides ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
