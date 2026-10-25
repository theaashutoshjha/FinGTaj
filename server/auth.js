import { auth } from 'express-openid-connect';

// Extract admin emails from environment
const getAdminEmails = () => {
  const envVal = process.env.ADMIN_EMAILS || 'admin@fingtaj.com,founder@fingtaj.com,investor@fingtaj.com,aashutosh@fingtaj.com';
  return envVal
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
};

// Check if a user is an administrator
export const isUserAdmin = (user) => {
  if (!user || !user.email) return false;
  const adminEmails = getAdminEmails();
  const emailMatch = adminEmails.includes(user.email.toLowerCase());
  
  // Also check if Auth0 claims provide an admin role
  const roles = user['https://fingtaj.com/roles'] || user.roles || [];
  const roleMatch = Array.isArray(roles) && roles.map(r => r.toLowerCase()).includes('admin');
  
  return emailMatch || roleMatch;
};

// Configure the Auth0 Express OpenID Connect Middleware
export const setupAuth0 = () => {
  const issuerBaseURL = process.env.ISSUER_BASE_URL || 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com';
  const clientID = process.env.CLIENT_ID || 'mdXD45c448jB42N1B1EXd1Wy32AkBZjr';
  const secret = process.env.SECRET || '726ce5b769e901aec0c8d76953b7d7156c5a364bbe31a5e6cf9caaa005a11ba8';
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  console.log(`[Auth0] Initializing OpenID Connect for Issuer: ${issuerBaseURL}`);
  console.log(`[Auth0] Client ID: ${clientID} | Base URL: ${baseURL}`);

  try {
    return auth({
      authRequired: false, // Don't require login globally; public can read articles
      auth0Logout: true,
      secret,
      baseURL,
      clientID,
      issuerBaseURL,
      routes: {
        login: false, // Handled with custom parameter forwarding in server/index.js
        logout: '/logout',
        callback: '/callback',
        postLogoutRedirect: '/'
      },
      session: {
        rolling: true,
        rollingDuration: 24 * 60 * 60, // 24 hours rolling session
        absoluteDuration: 7 * 24 * 60 * 60, // 7 days max session
        cookie: {
          httpOnly: true,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production' && Boolean(baseURL && baseURL.startsWith('https'))
        }
      }
    });
  } catch (err) {
    console.warn('[Auth0] OpenID Connect initialization error, using passthrough:', err?.message || err);
    return (req, res, next) => next();
  }
};

// Middleware: Require Authenticated User (Supports direct email session or Auth0)
export const requireAuth = (req, res, next) => {
  if (req.user || (req.oidc && req.oidc.isAuthenticated())) {
    return next();
  }

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(401).json({
      error: 'Authentication Required',
      message: 'You must be logged in to access this endpoint.',
      loginUrl: '/login'
    });
  }

  // Redirect browser to login
  if (req.oidc && typeof req.oidc.login === 'function') {
    res.oidc.login({ returnTo: req.originalUrl || '/' });
  } else {
    res.redirect('/login');
  }
};

// Middleware: Require Administrator Role
export const requireAdmin = (req, res, next) => {
  const user = getCurrentUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to access administrative controls.',
      loginUrl: '/login'
    });
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Administrator privileges are required for this action.',
      userEmail: user.email,
      role: 'user'
    });
  }

  next();
};

// Helper: Extract current user context safely
export const getCurrentUser = (req) => {
  if (req.user) {
    const admin = isUserAdmin(req.user);
    return {
      sub: req.user.sub || req.user.id || `usr-${req.user.email}`,
      name: req.user.name || req.user.email.split('@')[0],
      email: req.user.email,
      picture: req.user.picture || null,
      emailVerified: Boolean(req.user.emailVerified ?? true),
      isAdmin: admin,
      role: admin ? 'admin' : 'user',
      authMethod: req.user.authMethod || 'Direct Email Account',
      updatedAt: req.user.updatedAt || new Date().toISOString()
    };
  }

  if (!req.oidc || !req.oidc.isAuthenticated()) {
    return null;
  }
  const u = req.oidc.user;
  const admin = isUserAdmin(u);
  return {
    sub: u.sub,
    name: u.name || u.nickname || 'Investor',
    email: u.email,
    picture: u.picture,
    emailVerified: u.email_verified,
    isAdmin: admin,
    role: admin ? 'admin' : 'user',
    authMethod: 'Auth0 Verified Account',
    updatedAt: u.updated_at
  };
};
