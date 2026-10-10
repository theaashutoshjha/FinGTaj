import React, { useState } from 'react';
import { Article } from '../types';
import { ARTICLES } from '../data/articles';
import { BookOpen, Bookmark, Clock, ArrowRight } from 'lucide-react';

interface ArticlesSectionProps {
  onOpenArticle: (article: Article) => void;
  savedArticleIds: string[];
  onToggleBookmark: (articleId: string) => void;
  initialCategory?: 'all' | 'trading' | 'finance' | 'loans';
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

  const articleList = articles && articles.length > 0 ? articles : ARTICLES;
  const filtered = articleList.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <section style={{ padding: '60px 0' }} id="articles">
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-cyan">
              <BookOpen size={13} />
              Institutional Editorial Library
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
            Rigorous Financial <span className="text-gradient">Intelligence</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            In-depth analytical breakdowns on indexing economics, valuation models, tax shelters, and loan amortization mathematics.
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
              { id: 'all', label: 'All Disciplines' },
              { id: 'trading', label: 'Trading & Equity Research' },
              { id: 'finance', label: 'Personal Finance & Tax' },
              { id: 'loans', label: 'Loans & Amortization' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
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

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map(art => {
            const isBookmarked = savedArticleIds.includes(art.id);
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
                  padding: '24px'
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
                      color: art.category === 'trading' ? 'var(--accent-cyan)' : (art.category === 'finance' ? 'var(--accent-emerald)' : 'var(--accent-amber)')
                    }}>
                      {art.tag}
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
                    {art.seo?.score && (
                      <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        SEO {art.seo.score}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Guide <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
