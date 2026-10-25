import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { setupAuth0, requireAdmin, getCurrentUser, isUserAdmin } from './auth.js';
import { db } from './db.js';
import { aiEngine } from './aiEngine.js';
import { researchEngine } from './researchEngine.js';
import { seoAeoEngine } from './seoAeoEngine.js';
import { scheduler } from './scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// 301 Canonical Host & Protocol Redirect
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  const isLocalOrPreview = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0') || host.includes('.run.app');
  if (isLocalOrPreview) return next();

  const isApex = host === 'fingtaj.com';
  const proto = req.headers['x-forwarded-proto'];
  const isHttp = proto === 'http';

  if (isApex || (isHttp && process.env.NODE_ENV === 'production')) {
    const targetHost = isApex ? 'www.fingtaj.com' : host;
    const cleanUrl = `https://${targetHost}${req.originalUrl}`;
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

// Session extraction middleware
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

// Auth0 Universal Login Route
app.get('/login', (req, res) => {
  const authorizationParams = {};
  if (req.query.login_hint) {
    authorizationParams.login_hint = String(req.query.login_hint);
  }
  if (req.query.screen_hint) {
    authorizationParams.screen_hint = String(req.query.screen_hint);
  }
  const returnTo = (typeof req.query.returnTo === 'string' && req.query.returnTo) || '/';
  if (res.oidc && typeof res.oidc.login === 'function') {
    return res.oidc.login({
      returnTo,
      authorizationParams
    });
  }
  res.redirect('/?auth=login');
});

// Auth0 Universal Signup Route
app.get('/signup', (req, res) => {
  const authorizationParams = { screen_hint: 'signup' };
  if (req.query.login_hint) {
    authorizationParams.login_hint = String(req.query.login_hint);
  }
  const returnTo = (typeof req.query.returnTo === 'string' && req.query.returnTo) || '/';
  if (res.oidc && typeof res.oidc.login === 'function') {
    return res.oidc.login({
      returnTo,
      authorizationParams
    });
  }
  res.redirect('/?auth=register');
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

// Real Direct Email & Password Sign In
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

// Real User Direct Registration
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

    const user = db.createUser({
      email: cleanEmail,
      password,
      name: cleanName,
      auth0Id
    });

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

// Public Articles List
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

// Canonical XML Sitemap with all 50 financial calculators
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    return res.sendFile(sitemapPath);
  }
  const baseUrl = process.env.BASE_URL || 'https://fingtaj.com';
  const xml = seoAeoEngine.generateSitemap(baseUrl);
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Search Console & Bing Instant Indexing Plaintext URL List
app.get('/urllist.txt', (req, res) => {
  const urlListPath = path.join(__dirname, '..', 'public', 'urllist.txt');
  if (fs.existsSync(urlListPath)) {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    return res.sendFile(urlListPath);
  }
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send('https://www.fingtaj.com/\n');
});

// Google AdSense Publisher Authorization (ads.txt)
app.get('/ads.txt', (req, res) => {
  const adsTxt = `google.com, pub-3594420471814241, DIRECT, f08c47fec0942fa0\n`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(adsTxt);
});

// Search Engine Crawlers & AI Bots Directive (robots.txt)
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    return res.sendFile(robotsPath);
  }
  const defaultRobots = `User-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: *\nAllow: /\nDisallow: /api/admin\n\nSitemap: https://www.fingtaj.com/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(defaultRobots);
});

// ==============================================================================
// PUBLIC INQUIRY & CONTACT DISPATCH ENDPOINT
// ==============================================================================

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, category, subject, message, _hp_company } = req.body || {};

    if (_hp_company) {
      return res.json({
        success: true,
        trackingId: 'FT-BOT-' + Date.now().toString(36).toUpperCase(),
        message: 'Your inquiry has been received.'
      });
    }

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCategory = String(category || 'General Inquiry').trim();
    const cleanSubject = String(subject || '').trim() || `${cleanCategory} - ${cleanName}`;
    const cleanMessage = String(message || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid, reachable email address.' });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ error: 'Please provide detailed message context (minimum 10 characters).' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'client';
    const userAgent = req.headers['user-agent'] || '';

    const saved = db.saveContactMessage({
      name: cleanName,
      email: cleanEmail,
      category: cleanCategory,
      subject: cleanSubject,
      message: cleanMessage,
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : 'client',
      userAgent
    });

    db.logAction('CONTACT_FORM_SUBMISSION', cleanEmail, {
      trackingId: saved.id,
      category: cleanCategory
    });

    res.json({
      success: true,
      trackingId: saved.id,
      createdAt: saved.createdAt,
      message: `Inquiry registered successfully under Reference ID ${saved.id}. Our technical and statutory review desk will respond within 24 to 48 business hours.`
    });
  } catch (err) {
    console.error('[Contact] Error processing inquiry:', err);
    res.status(500).json({ error: 'Failed to record inquiry. Please reach out directly to support@fingtaj.com.' });
  }
});

// Admin View Contact Inquiries
app.get('/api/admin/contact-inquiries', requireAdmin, (req, res) => {
  res.json(db.getContactMessages());
});

// ==============================================================================
// PROTECTED ADMINISTRATIVE ENDPOINTS
// ==============================================================================

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

app.get('/api/admin/articles', requireAdmin, (req, res) => {
  res.json(db.getAllArticles());
});

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

app.get('/api/admin/topics', requireAdmin, (req, res) => {
  res.json(db.getTopics());
});

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

app.post('/api/admin/articles/:id/unpublish', requireAdmin, (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  article.status = 'draft';
  db.saveArticle(article);

  const user = getCurrentUser(req);
  db.logAction('UNPUBLISH_ARTICLE', user?.email, { articleId: article.id });

  res.json({ success: true, article });
});

app.put('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const updated = db.saveArticle({
    ...article,
    ...req.body,
    id: article.id
  });

  updated.seo.score = seoAeoEngine.auditSEO(updated).score;
  updated.aeo.score = seoAeoEngine.auditAEO(updated).score;
  db.saveArticle(updated);

  const user = getCurrentUser(req);
  db.logAction('EDIT_ARTICLE', user?.email, { articleId: updated.id });

  res.json({ success: true, article: updated });
});

app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
  const removed = db.deleteArticle(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Article not found' });

  const user = getCurrentUser(req);
  db.logAction('DELETE_ARTICLE', user?.email, { articleId: req.params.id, title: removed.title });

  res.json({ success: true, removed });
});

app.post('/api/admin/kill-switch', requireAdmin, (req, res) => {
  const current = db.getSettings().killSwitch;
  const newStatus = !current;
  db.updateSettings({ killSwitch: newStatus });

  const user = getCurrentUser(req);
  db.logAction(newStatus ? 'KILL_SWITCH_ENGAGED' : 'KILL_SWITCH_DISENGAGED', user?.email);

  res.json({ success: true, killSwitch: newStatus });
});

app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  const user = getCurrentUser(req);
  db.logAction('UPDATE_SETTINGS', user?.email, req.body);
  res.json({ success: true, settings: updated });
});

app.get('/api/admin/logs', requireAdmin, (req, res) => {
  res.json({
    auditLogs: db.getAuditLogs(),
    jobs: db.getJobs()
  });
});
