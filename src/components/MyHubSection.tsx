import React, { useState } from 'react';
import { Currency, User, Article, Product } from '../types';
import { ARTICLES } from '../data/articles';
import { PRODUCTS } from '../data/products';
import { 
  User as UserIcon, 
  Bookmark, 
  Download, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  CheckCircle,
  FileText
} from 'lucide-react';

interface MyHubSectionProps {
  user: User | null;
  currency: Currency;
  rateUSD: number;
  savedArticleIds: string[];
  purchasedProductIds: string[];
  onOpenArticle: (article: Article) => void;
  onDownloadProduct: (product: Product) => void;
  onOpenAuth: () => void;
}

export const MyHubSection: React.FC<MyHubSectionProps> = ({
  user,
  currency,
  rateUSD,
  savedArticleIds,
  purchasedProductIds,
  onOpenArticle,
  onDownloadProduct,
  onOpenAuth
}) => {
  const [quizAnswers, setQuizAnswers] = useState<number[]>([3, 2, 3, 2]);

  const formatMoney = (inr: number) => {
    if (currency === 'USD') {
      const usd = Math.round(inr * rateUSD);
      return '$' + usd.toLocaleString('en-US');
    }
    return '₹' + inr.toLocaleString('en-IN');
  };

  const savedArticles = ARTICLES.filter(a => savedArticleIds.includes(a.id));
  const purchasedProducts = PRODUCTS.filter(p => purchasedProductIds.includes(p.id));

  // Compute Health Score from quiz answers (max 100)
  const score = Math.round((quizAnswers.reduce((a, b) => a + b, 0) / 12) * 100);

  const quizQuestions = [
    {
      q: "1. How many months of survival expenses do you hold in liquid reserves?",
      options: ["0 Months (0 pts)", "1-2 Months (8 pts)", "3-5 Months (16 pts)", "6+ Months Liquid (25 pts)"]
    },
    {
      q: "2. What portion of your monthly take-home income pays debts/EMIs?",
      options: ["Over 50% (0 pts)", "35% - 50% (8 pts)", "15% - 35% (16 pts)", "Under 15% / Zero (25 pts)"]
    },
    {
      q: "3. How consistent is your monthly index fund / equity investment?",
      options: ["Never invest (0 pts)", "Ad-hoc / Manual (8 pts)", "Regular manual (16 pts)", "Automated 1st-of-month SIP (25 pts)"]
    },
    {
      q: "4. Do you have independent term life and comprehensive health insurance?",
      options: ["None (0 pts)", "Only employer cover (8 pts)", "Only health cover (16 pts)", "Both adequate & active (25 pts)"]
    }
  ];

  return (
    <section style={{ padding: '60px 0' }} id="hub">
      <div className="wrap">
        
        {/* User Status Banner */}
        <div className="glass-panel" style={{
          padding: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '36px',
          borderLeft: '4px solid var(--accent-cyan)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user?.picture ? (
              <img src={user.picture} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#03080f',
                fontSize: '24px',
                fontWeight: 900
              }}>
                {user ? user.name.charAt(0) : <UserIcon size={32} />}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '24px' }}>
                  {user ? user.name : 'Institutional Investor'}
                </h2>
                <span className="badge badge-cyan">
                  {user ? 'VERIFIED' : 'GUEST SESSION'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                {user ? user.email : 'Sign in with Google OAuth to sync saved reading lists and purchased spreadsheets.'}
              </p>
            </div>
          </div>

          {!user && (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              Sign In with Google ↗
            </button>
          )}
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Diagnostic Health Score */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-emerald">
                <Activity size={13} />
                Diagnostic Health Index
              </span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: score > 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} className="text-mono">
                {score}/100
              </span>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Financial Resilience Score</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6, marginBottom: '20px' }}>
              {score > 75 
                ? 'Institutional Grade: Your emergency reserves, savings rate, and insurance moat are robust.'
                : 'Optimization Needed: Strengthen emergency buffers and eliminate high-interest revolving liabilities.'}
            </p>

            {/* Micro Quiz Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizQuestions.map((q, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600 }}>{q.q}</div>
                  <select
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    value={quizAnswers[idx]}
                    onChange={(e) => {
                      const newAns = [...quizAnswers];
                      newAns[idx] = Number(e.target.value);
                      setQuizAnswers(newAns);
                    }}
                  >
                    {q.options.map((opt, oIdx) => (
                      <option key={oIdx} value={oIdx}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Downloaded Digital Toolkits */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-gold">
                <Download size={13} />
                My Downloads ({purchasedProducts.length})
              </span>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Verified Digital Toolkits</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6, marginBottom: '20px' }}>
              Instant access to your purchased formulas, spreadsheets, and VIP cryptographic keys.
            </p>

            {purchasedProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-subtle)'
              }}>
                <FileText size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>No toolkits purchased yet</div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Purchase any spreadsheet or blueprint to access instant downloads here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {purchasedProducts.map(prod => (
                  <div 
                    key={prod.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{prod.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>{prod.specs}</div>
                    </div>
                    <button 
                      className="btn btn-emerald" 
                      onClick={() => onDownloadProduct(prod)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Download size={12} /> Get
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saved Articles Reading Shelf */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-cyan">
              <Bookmark size={13} />
              Private Reading Shelf
            </span>
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>
            Saved Research &amp; Guides ({savedArticles.length})
          </h3>

          {savedArticles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              You haven't bookmarked any guides yet. Click the bookmark icon on any guide in the Editorial Library to save it here!
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {savedArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => onOpenArticle(art)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    {art.tag}
                  </div>
                  <h4 style={{ fontSize: '14px', lineHeight: 1.4, marginBottom: '8px' }}>
                    {art.title}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{art.readTime}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
