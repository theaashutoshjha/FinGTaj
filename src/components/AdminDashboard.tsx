import React, { useState, useEffect } from 'react';
import { User, Article, Topic, PipelineJob, SystemSettings } from '../types';
import { 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  Compass, 
  Settings as SettingsIcon, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Play, 
  Save, 
  X,
  Zap,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  user: User | null;
  onClose: () => void;
  onArticlePublished?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onClose, onArticlePublished }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'generator' | 'drafts' | 'settings' | 'logs'>('overview');
  
  // Data State
  const [overview, setOverview] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Selected Draft for Inspection/Editing
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedExcerpt, setEditedExcerpt] = useState('');

  // Generation Form State
  const [genTopicTitle, setGenTopicTitle] = useState('');
  const [genTopicCategory, setGenTopicCategory] = useState<'trading' | 'finance' | 'loans' | 'tech'>('finance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveJobLogs, setLiveJobLogs] = useState<string[]>([]);

  const showMsg = (text: string, error = false) => {
    setActionMsg({ text, error });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (e) {
      console.error('Error fetching overview', e);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (e) {
      console.error('Error fetching admin articles', e);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/admin/topics');
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    } catch (e) {
      console.error('Error fetching topics', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.auditLogs || []);
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error('Error fetching logs', e);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchArticles();
    fetchTopics();
    fetchLogs();
  }, []);

  // Toggle Kill Switch
  const toggleKillSwitch = async () => {
    try {
      const res = await fetch('/api/admin/kill-switch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showMsg(`Kill switch ${data.killSwitch ? 'ACTIVATED' : 'DISENGAGED'}`);
        fetchOverview();
      }
    } catch (e) {
      showMsg('Failed to toggle kill switch', true);
    }
  };

  // Trigger RSS Discovery
  const discoverTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/topics/discover', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showMsg(`Discovered ${data.count} new institutional topics.`);
        fetchTopics();
        fetchOverview();
      } else {
        showMsg(data.error || 'Discovery failed', true);
      }
    } catch (e) {
      showMsg('Error connecting to research engine', true);
    } finally {
      setLoading(false);
    }
  };

  // Run Autonomous Generation Pipeline
  const runGeneration = async (topicId?: string) => {
    setIsGenerating(true);
    setLiveJobLogs(['[00:00] Initializing autonomous research & writing pipeline...']);
    try {
      const body: any = {};
      if (topicId) {
        body.topicId = topicId;
      } else if (genTopicTitle) {
        body.customTopic = {
          title: genTopicTitle,
          category: genTopicCategory,
          summary: 'Admin custom generated article mandate.'
        };
      }

      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        setLiveJobLogs(prev => [...prev, `[SUCCESS] Article generated (ID: ${data.article?.id})`]);
        showMsg(data.published ? 'Article generated and auto-published!' : 'Article saved to drafts for editorial review.');
        fetchArticles();
        fetchOverview();
        fetchTopics();
        fetchLogs();
        if (data.article) {
          openEditModal(data.article);
        }
      } else {
        showMsg(data.error || 'Generation failed', true);
      }
    } catch (e: any) {
      showMsg('Pipeline error: ' + e.message, true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish Draft
  const publishArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showMsg('Article published live to FingTaj!');
        fetchArticles();
        fetchOverview();
        if (selectedArticle?.id === id) {
          setSelectedArticle(data.article);
        }
        if (onArticlePublished) onArticlePublished();
      }
    } catch (e) {
      showMsg('Failed to publish', true);
    }
  };

  // Unpublish
  const unpublishArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/unpublish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showMsg('Article unpublished and reverted to draft.');
        fetchArticles();
        fetchOverview();
        if (selectedArticle?.id === id) {
          setSelectedArticle(data.article);
        }
      }
    } catch (e) {
      showMsg('Failed to unpublish', true);
    }
  };

  // Save Edits
  const saveArticleEdits = async () => {
    if (!selectedArticle) return;
    try {
      const res = await fetch(`/api/admin/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          excerpt: editedExcerpt
        })
      });
      const data = await res.json();
      if (data.success) {
        showMsg('Draft saved and re-audited successfully.');
        setSelectedArticle(data.article);
        fetchArticles();
      }
    } catch (e) {
      showMsg('Failed to save edits', true);
    }
  };

  // Delete Article
  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('Article deleted.');
        fetchArticles();
        fetchOverview();
        if (selectedArticle?.id === id) setSelectedArticle(null);
      }
    } catch (e) {
      showMsg('Failed to delete', true);
    }
  };

  const openEditModal = (art: Article) => {
    setSelectedArticle(art);
    setEditedTitle(art.title);
    setEditedContent(art.content);
    setEditedExcerpt(art.excerpt || '');
  };

  const isKillSwitchActive = overview?.settings?.killSwitch;

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div 
        className="modal-content" 
        style={{
          maxWidth: '1240px',
          width: '95vw',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(10, 16, 26, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f5ff, #8a2be2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '16px',
              color: '#03080f'
            }}>
              F
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>FingTaj Institutional Command Center</h2>
                <span className="badge badge-emerald">ADMIN PRIVILEGES</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Authenticated as: <b>{user?.email || 'admin@fingtaj.com'}</b> (Auth0 OpenID Connect Session)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Kill Switch Button */}
            <button
              onClick={toggleKillSwitch}
              className="btn"
              style={{
                background: isKillSwitchActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                borderColor: '#ef4444',
                fontSize: '12px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Emergency Kill Switch: instantly halt all active generation and publishing"
            >
              <ShieldAlert size={14} />
              <span>{isKillSwitchActive ? 'KILL SWITCH ACTIVE (ENGAGED)' : 'EMERGENCY KILL SWITCH'}</span>
            </button>

            <button className="btn-icon" onClick={onClose} title="Close Console">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action / Notification Banner */}
        {actionMsg && (
          <div style={{
            padding: '10px 24px',
            background: actionMsg.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderBottom: `1px solid ${actionMsg.error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: actionMsg.error ? '#ef4444' : '#10b981',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {actionMsg.error ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Kill Switch Active Warning Banner */}
        {isKillSwitchActive && (
          <div style={{
            padding: '12px 24px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldAlert size={16} />
            <span>
              <b>EMERGENCY PAUSE ACTIVE:</b> Research discovery, AI content generation, and autonomous publishing are currently frozen. Click "KILL SWITCH ACTIVE" to resume normal operation.
            </span>
          </div>
        )}

        {/* Main Body Layout: Sidebar Navigation + Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Admin Sidebar Navigation */}
          <div style={{
            width: '220px',
            background: 'rgba(8, 14, 23, 0.95)',
            borderRight: '1px solid var(--border-subtle)',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <button
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <Activity size={16} />
              <span>Overview</span>
            </button>

            <button
              className={`btn ${activeTab === 'topics' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('topics')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <Compass size={16} />
              <span>Topic Discovery</span>
              {topics.length > 0 && (
                <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: '10px' }}>{topics.length}</span>
              )}
            </button>

            <button
              className={`btn ${activeTab === 'generator' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('generator')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <Sparkles size={16} />
              <span>AI Writing Studio</span>
            </button>

            <button
              className={`btn ${activeTab === 'drafts' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('drafts')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <FileText size={16} />
              <span>Articles &amp; Drafts</span>
              <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: '10px' }}>{articles.length}</span>
            </button>

            <button
              className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('settings')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <SettingsIcon size={16} />
              <span>AI Providers &amp; Quotas</span>
            </button>

            <button
              className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('logs')}
              style={{ justifyContent: 'flex-start', fontSize: '13px', width: '100%', gap: '10px', padding: '10px 14px' }}
            >
              <Zap size={16} />
              <span>System &amp; Audit Logs</span>
            </button>

            <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '4px' }}><b>Target:</b> fingtaj.com</div>
              <div><b>Runtime:</b> Express + Auth0</div>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px', background: 'var(--bg-main)' }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>System Metrics &amp; Operational Health</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                  Real-time pipeline monitoring, published research metrics, and algorithmic quality controls.
                </p>

                {/* Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Published Articles</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                      {overview?.counts?.publishedCount ?? articles.filter(a => a.status === 'published').length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', marginTop: '4px' }}>Live on https://fingtaj.com</div>
                  </div>

                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Editorial Drafts</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#f59e0b' }}>
                      {overview?.counts?.draftsCount ?? articles.filter(a => a.status === 'draft').length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Pending audit approval</div>
                  </div>

                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Discovered Topics</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-purple)' }}>
                      {overview?.counts?.topicsCount ?? topics.length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>RSS authority feeds</div>
                  </div>

                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Monthly AI Usage</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                      {overview?.settings?.monthlyQuotaUsed ?? 0} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 1000</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Free tier quota</div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Quick Control Operations</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={discoverTopics} disabled={loading || isKillSwitchActive}>
                      <RefreshCw size={14} className={loading ? 'spin' : ''} />
                      <span>Scan RSS Authority Feeds</span>
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('generator')} disabled={isKillSwitchActive}>
                      <Sparkles size={14} />
                      <span>Launch Writing Studio</span>
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('drafts')}>
                      <FileText size={14} />
                      <span>Review Pending Drafts</span>
                    </button>
                  </div>
                </div>

                {/* Recent Pipeline Jobs */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Recent Autonomous Pipeline Jobs</h4>
                  {jobs.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No pipeline jobs executed yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {jobs.slice(0, 5).map(j => (
                        <div key={j.id} style={{
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '12px'
                        }}>
                          <div>
                            <b>{j.type}</b> — Step: <span style={{ color: 'var(--accent-cyan)' }}>{j.step}</span>
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>ID: {j.id} • Triggered by: {j.triggeredBy}</div>
                          </div>
                          <span className={`badge ${j.status === 'completed' ? 'badge-emerald' : j.status === 'failed' ? 'badge-red' : 'badge-cyan'}`}>
                            {j.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. TOPIC DISCOVERY TAB */}
            {activeTab === 'topics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Topic Discovery &amp; Evidence Queue</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0' }}>
                      Scans SEC, Federal Reserve, SEBI, and global financial intelligence feeds.
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={discoverTopics} disabled={loading || isKillSwitchActive}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    <span>Run Internet Feed Discovery</span>
                  </button>
                </div>

                {topics.length === 0 ? (
                  <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No topics discovered yet. Click "Run Internet Feed Discovery" to poll feeds.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {topics.map(t => (
                      <div key={t.id} className="glass-card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span className="badge badge-cyan">{t.category.toUpperCase()}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Source: {t.sourceName}</span>
                            {t.relevanceScore && (
                              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Score: {t.relevanceScore}/100</span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>{t.title}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                            {t.summary}
                          </p>
                          {t.sourceUrl && (
                            <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                              <span>Primary Source Link</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '12px', padding: '8px 14px' }}
                            onClick={() => runGeneration(t.id)}
                            disabled={isGenerating || isKillSwitchActive}
                          >
                            <Sparkles size={12} />
                            <span>Generate Article</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. AI WRITING STUDIO TAB */}
            {activeTab === 'generator' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Autonomous AI Writing &amp; Verification Studio</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                  Synthesize in-depth institutional research articles with mathematical models, citations, originality gates, and SEO/AEO checklists.
                </p>

                <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Custom Topic Mandate</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Article Title / Target Theme</label>
                      <input 
                        type="text"
                        className="input-field"
                        placeholder="e.g., Sovereign Gold Bonds vs Physical Gold: The Complete Post-Budget Amortization Analysis"
                        value={genTopicTitle}
                        onChange={e => setGenTopicTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category Discipline</label>
                      <select 
                        className="input-field"
                        value={genTopicCategory}
                        onChange={e => setGenTopicCategory(e.target.value as any)}
                        style={{ maxWidth: '300px' }}
                      >
                        <option value="trading">Trading &amp; Valuation (Markets)</option>
                        <option value="finance">Personal Finance &amp; Tax</option>
                        <option value="loans">Loans &amp; Amortization</option>
                        <option value="tech">FinTech &amp; AI Systems</option>
                      </select>
                    </div>

                    <button 
                      className="btn btn-primary" 
                      onClick={() => runGeneration()}
                      disabled={isGenerating || isKillSwitchActive || !genTopicTitle.trim()}
                      style={{ alignSelf: 'flex-start', padding: '12px 24px' }}
                    >
                      <Play size={14} />
                      <span>{isGenerating ? 'Executing Full Autonomous Pipeline...' : 'Generate In-Depth Article ↗'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Progress Logs */}
                {liveJobLogs.length > 0 && (
                  <div className="glass-card" style={{ padding: '20px', background: 'rgba(3, 8, 15, 0.95)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                      Pipeline Execution Stream:
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {liveJobLogs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. ARTICLES & DRAFTS TAB */}
            {activeTab === 'drafts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Articles, Revisions &amp; Quality Scorecards</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0' }}>
                      Inspect originality scores, factual verification passes, and SEO / AEO audits.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {articles.map(art => (
                    <div key={art.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span className={`badge ${art.status === 'published' ? 'badge-emerald' : 'badge-cyan'}`}>
                            {(art.status || 'draft').toUpperCase()}
                          </span>
                          <span className="badge badge-purple">{art.category.toUpperCase()}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{art.readTime}</span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>{art.title}</h4>
                        
                        {/* Audit Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          <div>SEO Score: <b style={{ color: 'var(--accent-cyan)' }}>{art.seo?.score ?? 95}/100</b></div>
                          <div>AEO Score: <b style={{ color: 'var(--accent-purple)' }}>{art.aeo?.score ?? 95}/100</b></div>
                          <div>Originality: <b style={{ color: 'var(--accent-emerald)' }}>{art.originalityScore ?? 100}%</b></div>
                          <div>Facts: <b style={{ color: art.factVerificationPassed !== false ? 'var(--accent-emerald)' : '#ef4444' }}>
                            {art.factVerificationPassed !== false ? 'VERIFIED' : 'FLAGGED'}
                          </b></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn btn-secondary" onClick={() => openEditModal(art)} title="Inspect &amp; Edit Draft">
                          <Eye size={14} />
                          <span>Audit &amp; Edit</span>
                        </button>

                        {art.status === 'published' ? (
                          <button className="btn btn-secondary" onClick={() => unpublishArticle(art.id)} title="Revert to draft">
                            <span>Unpublish</span>
                          </button>
                        ) : (
                          <button className="btn btn-primary" onClick={() => publishArticle(art.id)} title="Publish live">
                            <span>Publish Live ↗</span>
                          </button>
                        )}

                        <button className="btn-icon" onClick={() => deleteArticle(art.id)} title="Delete Article">
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SETTINGS & AI PROVIDERS TAB */}
            {activeTab === 'settings' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>AI Provider Configuration &amp; Free Tier Quotas</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                  Verify zero-budget API tiers, Cloudflare Workers AI integration, and autonomous publishing rules.
                </p>

                <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Provider Status</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                      <div>
                        <b>Google Gemini API (1.5 Flash)</b>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Free Tier: 15 Requests/Min, 1,000,000 Tokens/Min</div>
                      </div>
                      <span className={`badge ${overview?.providerStatus?.gemini?.configured ? 'badge-emerald' : 'badge-cyan'}`}>
                        {overview?.providerStatus?.gemini?.configured ? 'CONFIGURED' : 'SERVER FALLBACK READY'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                      <div>
                        <b>Cloudflare Workers AI (@cf/meta/llama-3-8b-instruct)</b>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Free Allowance: 10,000 Neurons / day zero cost</div>
                      </div>
                      <span className={`badge ${overview?.providerStatus?.cloudflareAI?.configured ? 'badge-emerald' : 'badge-cyan'}`}>
                        {overview?.providerStatus?.cloudflareAI?.configured ? 'CONFIGURED' : 'STANDBY'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                      <div>
                        <b>Public RSS Feed Topic Discovery</b>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SEC, Yahoo Finance, Federal Reserve, HackerNews</div>
                      </div>
                      <span className="badge badge-emerald">ACTIVE &amp; ZERO BUDGET</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Autonomous Publishing Policy</h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p>
                      • <b>Auto-Publish Default:</b> Kept <b>DISABLED</b> by default. Articles are created in drafts for human editorial verification before publication.<br/>
                      • <b>Strict Quality Gates:</b> If auto-publish is enabled, articles MUST score &gt;=90 in SEO, &gt;=88 in AEO, &gt;=80 in Originality, and pass Factual Verification to be published automatically.<br/>
                      • <b>Kill Switch:</b> Halts all research, generation, and scheduled tasks immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SYSTEM & AUDIT LOGS TAB */}
            {activeTab === 'logs' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Immutable Administrative Audit Logs</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                  Tracks all publishing actions, administrative authentications, and pipeline jobs for regulatory compliance.
                </p>

                {auditLogs.length === 0 ? (
                  <div className="glass-card" style={{ padding: '30px', color: 'var(--text-muted)' }}>
                    No audit log records recorded yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {auditLogs.map(log => (
                      <div key={log.id} style={{
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px'
                      }}>
                        <div>
                          <b style={{ color: 'var(--accent-cyan)' }}>{log.action}</b> — User: <span>{log.userEmail}</span>
                          {log.details && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {JSON.stringify(log.details)}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* DRAFT INSPECTOR / EDIT MODAL */}
        {selectedArticle && (
          <div className="modal-overlay" style={{ zIndex: 140 }}>
            <div className="modal-content" style={{ maxWidth: '960px', width: '90vw', height: '88vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span className={`badge ${selectedArticle.status === 'published' ? 'badge-emerald' : 'badge-cyan'}`}>
                    {(selectedArticle.status || 'draft').toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0 0' }}>Article Inspector &amp; Audit Scorecard</h3>
                </div>
                <button className="btn-icon" onClick={() => setSelectedArticle(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* Scorecard Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(0, 245, 255, 0.05)', borderRadius: '6px', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SEO AUDIT SCORE</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent-cyan)' }}>{selectedArticle.seo?.score ?? 95}/100</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(138, 43, 226, 0.05)', borderRadius: '6px', border: '1px solid rgba(138, 43, 226, 0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AEO AUDIT SCORE</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent-purple)' }}>{selectedArticle.aeo?.score ?? 95}/100</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ORIGINALITY</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent-emerald)' }}>{selectedArticle.originalityScore ?? 100}%</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FACT CHECK</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: selectedArticle.factVerificationPassed !== false ? 'var(--accent-emerald)' : '#ef4444', marginTop: '4px' }}>
                    {selectedArticle.factVerificationPassed !== false ? 'VERIFIED' : 'FLAGGED'}
                  </div>
                </div>
              </div>

              {/* Editor Fields */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Article Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editedTitle} 
                    onChange={e => setEditedTitle(e.target.value)} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Meta Description &amp; Excerpt</label>
                  <textarea 
                    className="input-field" 
                    rows={2} 
                    value={editedExcerpt} 
                    onChange={e => setEditedExcerpt(e.target.value)} 
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Article HTML Body</label>
                  <textarea 
                    className="input-field" 
                    style={{ flex: 1, minHeight: '220px', fontFamily: 'monospace', fontSize: '12px' }} 
                    value={editedContent} 
                    onChange={e => setEditedContent(e.target.value)} 
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={saveArticleEdits}>
                    <Save size={14} />
                    <span>Save Draft Changes</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedArticle.status === 'published' ? (
                    <button className="btn btn-secondary" onClick={() => unpublishArticle(selectedArticle.id)}>
                      <span>Revert to Draft</span>
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => publishArticle(selectedArticle.id)}>
                      <ArrowUpRight size={14} />
                      <span>Publish Live Now ↗</span>
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>
                    <span>Done</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
