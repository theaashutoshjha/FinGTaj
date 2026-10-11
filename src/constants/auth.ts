// Auth0 Security and Access Control Configuration

export const AUTH0_CONFIG = {
  domain: 'dev-1iofcqlcwa1lvzvv.us.auth0.com',
  clientId: 'mdXD45c448jB42N1B1EXd1Wy32AkBZjr',
  audience: 'https://dev-1iofcqlcwa1lvzvv.us.auth0.com/api/v2/'
};

// Institutional Administrator Access Control List
export const DEFAULT_ADMIN_EMAILS: readonly string[] = [
  'admin@fingtaj.com',
  'founder@fingtaj.com',
  'investor@fingtaj.com',
  'aashutosh@fingtaj.com'
];

/**
 * Validates whether an email address possesses administrative privileges
 */
export const isEmailAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return DEFAULT_ADMIN_EMAILS.includes(normalized);
};

/**
 * Builds the Auth0 Universal Login / Authorization URL
 */
export const buildAuth0AuthorizeUrl = (options: {
  screenHint?: 'signup' | 'login';
  loginHint?: string;
  redirectUri?: string;
  responseType?: 'code' | 'token id_token';
} = {}): string => {
  const {
    screenHint,
    loginHint,
    redirectUri = `${window.location.origin}/callback`,
    responseType = 'code'
  } = options;

  const url = new URL(`https://${AUTH0_CONFIG.domain}/authorize`);
  url.searchParams.set('client_id', AUTH0_CONFIG.clientId);
  url.searchParams.set('response_type', responseType);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'openid profile email');

  if (responseType.includes('id_token')) {
    url.searchParams.set('nonce', Math.random().toString(36).substring(2) + Date.now().toString(36));
  }

  if (screenHint) {
    url.searchParams.set('screen_hint', screenHint);
  }

  if (loginHint && loginHint.trim()) {
    url.searchParams.set('login_hint', loginHint.trim().toLowerCase());
  }

  return url.toString();
};
