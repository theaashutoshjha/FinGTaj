import React, { useState } from 'react';
import { AuthorProfile } from '../data/authors';
import { Article } from '../types';
import { ARTICLES } from '../data/articles';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface AuthorSectionProps {
  author: AuthorProfile;
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({
  author,
  onSelectArticle,
  onBack
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Filter articles matching this author (or all if research desk)
  const authorArticles = ARTICLES.filter(art => {
    if (author.slug === 'aashutosh-jha') {
      return (
        art.featured || 
        art.category === 'trading' || 
        art.category === 'finance'
      );
    }
    return true; // Research desk is the collaborative collective
  });

  const tags = ['all', ...Array.from(new Set(authorArticles.map(a => a.category)))];

  const displayedArticles = selectedTag === 'all' 
    ? authorArticles 
    : authorArticles.filter(a => a.category === selectedTag);

  return (
    <section className="section-container" style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Schema.org Person JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.name,
            jobTitle: author.role,
            worksFor: {
              '@type': 'Organization',
              name: 'FinGTaj Financial Research',
              url: 'https://fingtaj.com'
            },
            description: author.bio,
            knowsAbout: author.expertise,
            url: `https://fingtaj.com/author/${author.slug}`,
            email: author.email
          })
        }}
      />

      {/* Navigation Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span>/</span>
        <span>Authors</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{author.name}</span>
      </div>

      {/* Author Bio Header Card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '40px', 
          borderRadius: '16px', 
          marginBottom: '48px',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95), rgba(18, 26, 38, 0.9))'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 245, 255, 0.25)'
              }}
            >
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  background: '#0d1117',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)'
                }}
              >
                {author.name.charAt(0)}
              </div>
            </div>
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--accent-emerald)',
                borderRadius: '50%',
                padding: '4px',
                color: '#000',
                display: 'flex'
              }}
              title="Verified Financial Author"
            >
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {author.name}
              </h1>
              <span 
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  letterSpacing: '0.05em',
                  background: 'rgba(0, 245, 255, 0.1)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 245, 255, 0.3)'
                }}
              >
                VERIFIED CONTRIBUTOR
              </span>
            </div>

            <div style={{ fontSize: '15px', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '14px' }}>
              {author.role}
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-emerald)" /> {author.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--accent-cyan)" /> {author.experienceYears}+ Years Capital Markets Research
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="var(--accent-amber)" /> {author.email}
              </span>
            </div>

            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {author.bio}
            </p>

            {/* Credentials / Qualifications Grid */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
                Verified Credentials & Certifications
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {author.credentials.map((cred, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Award size={14} color="var(--accent-amber)" />
                    {cred}
                  </div>
                ))}
              </div>
            </div>

            {/* Core Research Domains */}
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
                Core Research Specialties
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {author.expertise.map((exp, idx) => (
                  <span 
                    key={idx}
                    style={{ 
                      background: 'rgba(0, 245, 255, 0.05)',
                      border: '1px solid rgba(0, 245, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Integrity Pledge */}
        <div 
          style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            lineHeight: 1.6
          }}
        >
          <ShieldCheck size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Editorial Integrity & YMYL Guarantee: </strong>
            {author.editorialPledge}
          </div>
        </div>
      </div>

      {/* Published Works Archive Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Published Research & Educational Guides
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Peer-reviewed articles authored and verified by {author.name} ({displayedArticles.length} guides)
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: selectedTag === tag ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: selectedTag === tag ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedTag === tag ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {displayedArticles.map(art => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                border: '1px solid var(--border-subtle)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(0, 245, 255, 0.1)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    {art.category}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {art.title}
                </h3>

                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {art.excerpt.slice(0, 140)}...
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{art.date || '2026'}</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Read Guide <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
