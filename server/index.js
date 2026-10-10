import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

import { setupAuth0, requireAuth, requireAdmin, getCurrentUser } from './auth.js';
import { db } from './db.js';
import { aiEngine } from './aiEngine.js';
import { researchEngine } from './researchEngine.js';
import { articleGenerator } from './articleGenerator.js';
import { seoAeoEngine } from './seoAeoEngine.js';
import { scheduler } from './scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Mount Auth0 OpenID Connect
app.use(setupAuth0());

// Auth0 Signup convenience route (Universal Login with screen_hint)
app.get('/signup', (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: { screen_hint: 'signup' }
  });
});

// ==============================================================================
// PUBLIC ENDPOINTS
// ==============================================================================

// Current Auth Profile
app.get('/api/auth/me', (req, res) => {
  const user = getCurrentUser(req);
  res.json({
    isAuthenticated: Boolean(user),
    user
  });
});

// Public Articles List (Only Published!)
app.get('/api/articles', (req, res) => {
  const published = db.getPublishedArticles().map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    tag: a.tag,
    readTime: a.readTime,
    excerpt: a.excerpt,
    content: a.content,
    publishedAt: a.publishedAt,
    author: a.author
  }));
  res.json(published);
});

// Public Single Article by Slug
app.get('/api/articles/:slug', (req, res) => {
  const article = db.getArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Prevent accessing unpublished drafts through public endpoint
  if (article.status !== 'published') {
    const user = getCurrentUser(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Draft content is not publicly accessible.' });
    }
  }

  const jsonLd = seoAeoEngine.generateJsonLd(article, process.env.BASE_URL || 'https://fingtaj.com');
  res.json({
    ...article,
    jsonLd
  });
});

// Dynamic XML Sitemap
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://fingtaj.com';
  const xml = seoAeoEngine.generateSitemap(baseUrl);
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic Robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://fingtaj.com';
  const txt = seoAeoEngine.generateRobotsTxt(baseUrl);
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// ==============================================================================
// PROTECTED ADMINISTRATIVE ENDPOINTS (requireAdmin)
// ==============================================================================

// Admin Dashboard Overview Stats
app.get('/api/admin/overview', requireAdmin, (req, res) => {
  const allArticles = db.getAllArticles();
  const published = allArticles.filter(a => a.status === 'published');
  const drafts = allArticles.filter(a => a.status === 'draft');
  const topics = db.getTopics();
  const jobs = db.getJobs();
  const settings = db.getSettings();
  const providerStatus = aiEngine.getProviderStatus();

  res.json({
    counts: {
      totalArticles: allArticles.length,
      publishedCount: published.length,
      draftsCount: drafts.length,
      topicsCount: topics.length,
      jobsCount: jobs.length
    },
    settings,
    providerStatus,
    recentJobs: jobs.slice(0, 5)
  });
});

// Admin All Articles (Drafts, Published, etc.)
app.get('/api/admin/articles', requireAdmin, (req, res) => {
  res.json(db.getAllArticles());
});

// Admin Topic Discovery
app.post('/api/admin/topics/discover', requireAdmin, async (req, res) => {
  try {
    const discovered = await researchEngine.discoverTopics();
    const user = getCurrentUser(req);
    db.logAction('DISCOVER_TOPICS', user?.email, { count: discovered.length });
    res.json({ success: true, count: discovered.length, topics: db.getTopics() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Topics List
app.get('/api/admin/topics', requireAdmin, (req, res) => {
  res.json(db.getTopics());
});

// Admin Trigger Article Generation Job
app.post('/api/admin/generate', requireAdmin, async (req, res) => {
  const { topicId, customTopic } = req.body;
  const user = getCurrentUser(req);

  let targetTopicId = topicId;
  if (customTopic) {
    const created = db.addTopic({
      title: customTopic.title,
      category: customTopic.category || 'finance',
      sourceName: 'Editorial Mandate',
      sourceUrl: 'https://fingtaj.com',
      summary: customTopic.summary || 'Custom administrative generation mandate.',
      relevanceScore: 99
    });
    targetTopicId = created.id;
  }

  const result = await scheduler.runPipelineJob({
    topicId: targetTopicId,
    triggeredBy: user?.email || 'admin'
  });

  res.json(result);
});

// Admin Publish Draft
app.post('/api/admin/articles/:id/publish', requireAdmin, (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  article.status = 'published';
  article.publishedAt = article.publishedAt || new Date().toISOString();
  db.saveArticle(article);

  const user = getCurrentUser(req);
  db.logAction('PUBLISH_ARTICLE', user?.email, { articleId: article.id, title: article.title });

  res.json({ success: true, article });
});

// Admin Unpublish / Revert to Draft
app.post('/api/admin/articles/:id/unpublish', requireAdmin, (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  article.status = 'draft';
  db.saveArticle(article);

  const user = getCurrentUser(req);
  db.logAction('UNPUBLISH_ARTICLE', user?.email, { articleId: article.id });

  res.json({ success: true, article });
});

// Admin Edit Article
app.put('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const updated = db.saveArticle({
    ...article,
    ...req.body,
    id: article.id
  });

  // Re-run audits on edit
  updated.seo.score = seoAeoEngine.auditSEO(updated).score;
  updated.aeo.score = seoAeoEngine.auditAEO(updated).score;
  db.saveArticle(updated);

  const user = getCurrentUser(req);
  db.logAction('EDIT_ARTICLE', user?.email, { articleId: updated.id });

  res.json({ success: true, article: updated });
});

// Admin Delete Article
app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const removed = db.deleteArticle(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Article not found' });

  const user = getCurrentUser(req);
  db.logAction('DELETE_ARTICLE', user?.email, { articleId: req.params.id, title: removed.title });

  res.json({ success: true, removed });
});

// Admin Toggle Emergency Kill Switch
app.post('/api/admin/kill-switch', requireAdmin, (req, res) => {
  const current = db.getSettings().killSwitch;
  const newStatus = !current;
  db.updateSettings({ killSwitch: newStatus });

  const user = getCurrentUser(req);
  db.logAction(newStatus ? 'KILL_SWITCH_ENGAGED' : 'KILL_SWITCH_DISENGAGED', user?.email);

  res.json({ success: true, killSwitch: newStatus });
});

// Admin Update Settings
app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  const user = getCurrentUser(req);
  db.logAction('UPDATE_SETTINGS', user?.email, req.body);
  res.json({ success: true, settings: updated });
});

// Admin Audit Logs & Jobs
app.get('/api/admin/logs', requireAdmin, (req, res) => {
  res.json({
    auditLogs: db.getAuditLogs(),
    jobs: db.getJobs()
  });
});

// ==============================================================================
// STATIC ASSET SERVING & SPA FALLBACK
// ==============================================================================

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('/{*splat}', (req, res) => {
    // If not handled by api/sitemap/robots/auth, serve SPA
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('FingTaj Backend Server running. Please run "npm run build" to compile frontend.');
  });
}

// Start Server & Background Scheduler
app.listen(port, () => {
  console.log(`========================================================`);
  console.log(`  FingTaj Pro Server running on port ${port}`);
  console.log(`  Auth0 Issuer: ${process.env.ISSUER_BASE_URL || 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com'}`);
  console.log(`  Public URL: ${process.env.BASE_URL || `http://localhost:${port}`}`);
  console.log(`========================================================`);
  scheduler.start();
});
