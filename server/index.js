import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

import { setupAuth0, requireAuth, requireAdmin, getCurrentUser, isUserAdmin } from './auth.js';
import { db } from './db.js';
import { aiEngine } from './aiEngine.js';
import { researchEngine } from './researchEngine.js';
import { articleGenerator } from './articleGenerator.js';
import { seoAeoEngine } from './seoAeoEngine.js';
import { scheduler } from './scheduler.js';
import { renderCrawlerHtml } from './ssrRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const app = express();
const port = process.env.PORT || 5000;

// 301 Canonical Host & Protocol Redirect (http -> https, www. -> apex domain)
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  const isWww = host.startsWith('www.');
  const proto = req.headers['x-forwarded-proto'];
  const isHttp = proto === 'http';

  if (isWww || (isHttp && process.env.NODE_ENV === 'production')) {
    const cleanHost = host.replace(/^www\./, '');
    const cleanUrl = `https://${cleanHost}${req.originalUrl}`;
    return res.redirect(301, cleanUrl);
  }
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true
}));

// Security & AdSense Crawler Authorization Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Session extraction middleware (for direct email accounts and persistent tokens)
app.use((req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/fingtaj_session=([^;]+)/);
    if (match) token = match[1];
  }
  if (token) {
    const sessionUser = db.getSession(token);
    if (sessionUser) {
      req.user = sessionUser;
      req.sessionToken = token;
    }
  }
  next();
});

// Mount Auth0 OpenID Connect
app.use(setupAuth0());

// Auth0 Universal Login Route (supports ?login_hint=... and ?returnTo=...)
app.get('/login', (req, res) => {
  const authorizationParams = {};
  if (req.query.login_hint) {
    authorizationParams.login_hint = String(req.query.login_hint);
  }
  if (req.query.screen_hint) {
    authorizationParams.screen_hint = String(req.query.screen_hint);
  }
  const returnTo = (typeof req.query.returnTo === 'string' && req.query.returnTo) || '/';
  res.oidc.login({
    returnTo,
    authorizationParams
  });
});

// Auth0 Universal Signup Route (pre-sets screen_hint: 'signup')
app.get('/signup', (req, res) => {
  const authorizationParams = { screen_hint: 'signup' };
  if (req.query.login_hint) {
    authorizationParams.login_hint = String(req.query.login_hint);
  }
  const returnTo = (typeof req.query.returnTo === 'string' && req.query.returnTo) || '/';
  res.oidc.login({
    returnTo,
    authorizationParams
  });
});

// ==============================================================================
// PUBLIC AUTH & REGISTRATION ENDPOINTS (DIRECT EMAIL + AUTH0)
// ==============================================================================

// Public Auth0 Tenant Configuration
app.get('/api/auth/config', (req, res) => {
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@fingtaj.com,founder@fingtaj.com,investor@fingtaj.com,aashutosh@fingtaj.com')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  res.json({
    issuerBaseUrl: process.env.ISSUER_BASE_URL || 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com',
    clientId: process.env.CLIENT_ID || 'mdXD45c448jB42N1B1EXd1Wy32AkBZjr',
    adminEmails
  });
});

// Real Direct Email & Password Sign In (In-App Authentication)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Try local verified database authentication
    let user = db.verifyUserPassword(cleanEmail, password);

    // 2. If not found in local db, attempt Auth0 direct token password grant
    if (!user) {
      const issuerBaseURL = process.env.ISSUER_BASE_URL || 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com';
      const clientID = process.env.CLIENT_ID || 'mdXD45c448jB42N1B1EXd1Wy32AkBZjr';
      try {
        const tokenRes = await fetch(`${issuerBaseURL.replace(/\/$/, '')}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'password',
            username: cleanEmail,
            password,
            client_id: clientID,
            client_secret: process.env.SECRET,
            scope: 'openid profile email',
            realm: 'Username-Password-Authentication'
          })
        });
        const tokenData = await tokenRes.json();
        if (tokenRes.ok && tokenData.id_token) {
          user = db.createUser({
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            password
          });
        }
      } catch (auth0Err) {
        // Fallback
      }
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials. Please verify your email and password, or create a free account.'
      });
    }

    // Create session and set HTTP-only cookie
    const token = db.createSession(user);
    const admin = isUserAdmin(user);

    res.setHeader('Set-Cookie', `fingtaj_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    db.logAction('USER_LOGIN', cleanEmail, { method: 'direct_email' });

    res.json({
      success: true,
      message: 'Signed in successfully!',
      token,
      user: {
        sub: user.id,
        name: user.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        isAdmin: admin,
        role: admin ? 'admin' : 'user',
        authMethod: 'Direct Email Account'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Authentication error' });
  }
});

// Real User Direct Registration (Auth0 Database Connection API + Local Session)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = name ? String(name).trim() : cleanEmail.split('@')[0];
    const issuerBaseURL = process.env.ISSUER_BASE_URL || 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com';
    const clientID = process.env.CLIENT_ID || 'mdXD45c448jB42N1B1EXd1Wy32AkBZjr';

    // 1. Register with Auth0 Database Connection API
    let auth0Id = null;
    try {
      const signupUrl = `${issuerBaseURL.replace(/\/$/, '')}/dbconnections/signup`;
      const auth0Res = await fetch(signupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientID,
          email: cleanEmail,
          password,
          connection: 'Username-Password-Authentication',
          name: cleanName
        })
      });
      const data = await auth0Res.json();
      if (auth0Res.ok && data._id) {
        auth0Id = data._id;
      }
    } catch (auth0Err) {
      console.warn('[Auth0] Registration warning:', auth0Err.message);
    }

    // 2. Register in local verified database
    const user = db.createUser({
      email: cleanEmail,
      password,
      name: cleanName,
      auth0Id
    });

    // 3. Immediately log the user in by creating an active session
    const token = db.createSession(user);
    const admin = isUserAdmin(user);

    res.setHeader('Set-Cookie', `fingtaj_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    db.logAction('USER_REGISTERED', cleanEmail, { auth0Id, method: 'direct_email' });

    res.json({
      success: true,
      message: 'Account successfully registered! You are now logged in.',
      token,
      user: {
        sub: user.id,
        name: cleanName,
        email: cleanEmail,
        isAdmin: admin,
        role: admin ? 'admin' : 'user',
        authMethod: 'Direct Email Account'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal registration error' });
  }
});

// Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
  if (req.sessionToken) {
    db.destroySession(req.sessionToken);
  }
  res.setHeader('Set-Cookie', `fingtaj_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  res.json({ success: true, message: 'Logged out successfully.' });
});

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

// Google AdSense Publisher Authorization (ads.txt)
app.get('/ads.txt', (req, res) => {
  const adsTxt = `google.com, pub-3594420471814241, DIRECT, f08c47fec0942fa0\n`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(adsTxt);
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

  const indexPath = path.join(DIST_DIR, 'index.html');

  app.get('/{*splat}', (req, res) => {
    const rawPath = req.path || '';
    const baseUrl = process.env.BASE_URL || 'https://fingtaj.com';

    let baseHtml = '';
    try {
      baseHtml = fs.readFileSync(indexPath, 'utf-8');
    } catch {
      return res.sendFile(indexPath);
    }

    try {
      const renderedHtml = renderCrawlerHtml(rawPath, baseHtml, baseUrl);
      return res.send(renderedHtml);
    } catch (err) {
      console.error('[SSR] Error rendering crawler HTML, falling back:', err);
      return res.send(baseHtml);
    }
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
