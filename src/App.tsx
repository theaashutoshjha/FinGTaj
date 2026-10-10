import React, { useState, useEffect } from 'react';
import { Currency, User, CartItem, Product, Article, CourseModule, Order } from './types';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { Hero } from './components/Hero';
import { InteractiveChart } from './components/InteractiveChart';
import { CalculatorsSection } from './components/CalculatorsSection';
import { StoreSection } from './components/StoreSection';
import { ArticlesSection } from './components/ArticlesSection';
import { AcademySection } from './components/AcademySection';
import { MyHubSection } from './components/MyHubSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReaderModal } from './components/ReaderModal';
import { AuthModal } from './components/AuthModal';
import { AICopilotModal } from './components/AICopilotModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { PolicySection } from './components/PolicySection';
import { CookieBanner } from './components/CookieBanner';
import { ARTICLES } from './data/articles';
import { AUTH0_CONFIG, isEmailAdmin } from './constants/auth';

export const App: React.FC = () => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fingtaj_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Dynamic Live Articles from Database (seeded with ARTICLES)
  const [liveArticles, setLiveArticles] = useState<Article[]>(ARTICLES);

  // Cart & Commerce State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fingtaj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fingtaj_saved_articles');
      return saved ? JSON.parse(saved) : ['art-compounding', 'art-budgeting'];
    } catch (e) {
      return ['art-compounding', 'art-budgeting'];
    }
  });

  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fingtaj_purchases');
      return saved ? JSON.parse(saved) : ['prod_budget_master'];
    } catch (e) {
      return ['prod_budget_master'];
    }
  });

  // Modals Visibility
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const rateUSD = 0.012; // 1 INR ~ 0.012 USD

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fingtaj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fingtaj_saved_articles', JSON.stringify(savedArticleIds));
  }, [savedArticleIds]);

  useEffect(() => {
    localStorage.setItem('fingtaj_purchases', JSON.stringify(purchasedProductIds));
  }, [purchasedProductIds]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fingtaj_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fingtaj_user');
    }
  }, [user]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch real Auth0 session & live articles from server
  const fetchLiveArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLiveArticles(data);
        }
      }
    } catch (e) {
      console.warn('Using client cached articles:', e);
    }
  };

  useEffect(() => {
    // 0. Handle Auth0 return callback & real URL tokens
    const hash = window.location.hash.substring(1);
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(hash);

    // Check for Auth0 Error in query or fragment
    const authError = searchParams.get('error') || hashParams.get('error');
    if (authError) {
      const desc = searchParams.get('error_description') || hashParams.get('error_description') || authError;
      showToast(`Auth0 Error: ${desc}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for cryptographically signed Auth0 ID token (OIDC implicit / hybrid flow)
    const idToken = hashParams.get('id_token');
    if (idToken) {
      try {
        const payloadBase64 = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(decodeURIComponent(escape(atob(payloadBase64))));
        if (decoded && decoded.email) {
          const email = decoded.email.toLowerCase();
          const isAdmin = isEmailAdmin(email);
          const authenticatedUser: User = {
            sub: decoded.sub,
            name: decoded.name || decoded.nickname || email.split('@')[0],
            email,
            picture: decoded.picture,
            emailVerified: Boolean(decoded.email_verified),
            isAdmin,
            role: isAdmin ? 'admin' : 'user',
            authMethod: 'Auth0 Verified Account',
            loginTime: new Date().toISOString()
          };
          setUser(authenticatedUser);
          localStorage.setItem('fingtaj_user', JSON.stringify(authenticatedUser));
          showToast(`Welcome, ${authenticatedUser.name}!`);
          window.history.replaceState({}, document.title, '/');
        }
      } catch (err) {
        console.error('Failed to parse Auth0 id_token:', err);
      }
    } else if (window.location.pathname.includes('/callback') || searchParams.has('code')) {
      // Returned from code authorization flow: clean URL bar
      window.history.replaceState({}, document.title, '/');
    }

    // 1. Check server-side Auth0 OpenID Connect session (via secure HTTP-only cookie)
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
          localStorage.setItem('fingtaj_user', JSON.stringify(data.user));
        } else if (!idToken) {
          // If server says unauthenticated and local storage had an old fake or expired session, clean it
          const saved = localStorage.getItem('fingtaj_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.email && parsed.email.includes('aashutosh')) {
                localStorage.removeItem('fingtaj_user');
                setUser(null);
              }
            } catch (e) {}
          }
        }
      })
      .catch(() => {});

    // 2. Fetch live articles
    fetchLiveArticles();
  }, []);

  // Hash deep-linking handler
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      if (hash === 'about') {
        setActiveTab('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'contact') {
        setActiveTab('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'privacy' || hash === 'terms' || hash === 'policy') {
        setActiveTab('policy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'admin') {
        setAdminOpen(true);
      } else {
        const match = liveArticles.find(a => a.slug === hash || a.id === hash);
        if (match) setSelectedArticle(match);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [liveArticles]);

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Cart Management
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    showToast(`Added ${product.title} to cart`);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleBuyNow = (product: Product) => {
    const existing = cart.find(i => i.product.id === product.id);
    if (!existing) {
      setCart(prev => [...prev, { product, qty: 1 }]);
    }
    setCheckoutDiscount(0);
    setCheckoutCoupon('');
    setCheckoutOpen(true);
  };

  const handleOpenCheckout = (discount: number, coupon: string) => {
    setCheckoutDiscount(discount);
    setCheckoutCoupon(coupon);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    const purchasedIds = order.items.map(i => i.product.id);
    setPurchasedProductIds(prev => Array.from(new Set([...prev, ...purchasedIds])));
    setCart([]);
    showToast('Order confirmed! Access your templates in My Hub.');
  };

  const handleToggleBookmark = (articleId: string) => {
    setSavedArticleIds(prev => {
      const isSaved = prev.includes(articleId);
      const next = isSaved ? prev.filter(id => id !== articleId) : [...prev, articleId];
      showToast(isSaved ? 'Article removed from saved' : 'Article bookmarked in My Hub');
      return next;
    });
  };

  const handleDownloadFile = (filename: string, title: string) => {
    const sampleCsv = `Date,Category,Income,Expense,Notes\n2026-03-01,Salary,120000,0,Primary Paycheck\n2026-03-02,Index Fund SIP,0,25000,Nifty 50 Direct Plan\n2026-03-05,Emergency Fund,0,10000,High-Yield Liquid Deposit\n`;
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'fingtaj-financial-system.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded: ${title}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout', { credentials: 'include' });
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('fingtaj_user');
    showToast('Signed out successfully.');
    // Trigger Auth0 single logout to invalidate Auth0 SSO session
    const returnTo = encodeURIComponent(window.location.origin);
    window.location.href = `https://${AUTH0_CONFIG.domain}/v2/logout?client_id=${AUTH0_CONFIG.clientId}&returnTo=${returnTo}`;
  };

  const handleOpenArticle = (art: Article) => {
    if (!art.content) {
      const full = ARTICLES.find(a => a.id === art.id || a.slug === art.slug);
      if (full && full.content) {
        setSelectedArticle(full);
        return;
      }
    }
    setSelectedArticle(art);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Real-Time Institutional Market Ticker */}
      <MarketTicker />

      {/* Global Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        toggleCurrency={toggleCurrency}
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        openCart={() => setCartOpen(true)}
        openAuth={() => setAuthOpen(true)}
        openAI={() => setAiOpen(true)}
        openSearch={() => setSearchOpen(true)}
        openAdmin={() => setAdminOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Dynamic Content Routing based on activeTab */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {activeTab === 'home' && (
          <>
            <Hero 
              onExploreStore={() => { setActiveTab('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onLaunchCalculators={() => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onOpenAI={() => setAiOpen(true)}
            />

            {/* Interactive Wealth Compounding Chart Engine */}
            <div className="wrap" style={{ marginBottom: '60px' }}>
              <InteractiveChart currency={currency} rateUSD={rateUSD} />
            </div>

            {/* 8 Simulators Section */}
            <CalculatorsSection currency={currency} rateUSD={rateUSD} />

            {/* Store Showcase */}
            <StoreSection 
              currency={currency} 
              rateUSD={rateUSD} 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            {/* Editorial Library with Live Articles */}
            <ArticlesSection 
              articles={liveArticles}
              onOpenArticle={handleOpenArticle}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Academy Showcase */}
            <AcademySection 
              onSelectCourse={() => { setActiveTab('academy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </>
        )}

        {activeTab === 'trading' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="trading"
              articles={liveArticles}
              onOpenArticle={handleOpenArticle}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'finance' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="finance"
              articles={liveArticles}
              onOpenArticle={handleOpenArticle}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'loans' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="loans"
              articles={liveArticles}
              onOpenArticle={handleOpenArticle}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'tech' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="tech"
              articles={liveArticles}
              onOpenArticle={handleOpenArticle}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'store' && (
          <div style={{ padding: '30px 0' }}>
            <StoreSection 
              currency={currency} 
              rateUSD={rateUSD} 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        )}

        {activeTab === 'calculators' && (
          <div style={{ padding: '30px 0' }}>
            <div className="wrap" style={{ marginBottom: '40px' }}>
              <InteractiveChart currency={currency} rateUSD={rateUSD} />
            </div>
            <CalculatorsSection currency={currency} rateUSD={rateUSD} />
          </div>
        )}

        {activeTab === 'academy' && (
          <div style={{ padding: '30px 0' }}>
            <AcademySection 
              onSelectCourse={() => setAiOpen(true)}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}

        {activeTab === 'policy' && (
          <PolicySection />
        )}

        {activeTab === 'hub' && (
          <div style={{ padding: '30px 0' }}>
            <MyHubSection 
              user={user}
              currency={currency}
              rateUSD={rateUSD}
              savedArticleIds={savedArticleIds}
              purchasedProductIds={purchasedProductIds}
              onOpenArticle={(art) => setSelectedArticle(art)}
              onDownloadProduct={(prod) => handleDownloadFile(prod.downloadFile, prod.title)}
              onOpenAuth={() => setAuthOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for AI */}
      <button
        onClick={() => setAiOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          background: 'var(--gradient-brand)',
          color: '#03080f',
          padding: '12px 20px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 30px rgba(0, 245, 255, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '13px',
          cursor: 'pointer',
          border: 'none',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        <span>✦</span>
        <span>Ask FingTaj AI</span>
      </button>

      {/* Global Modals */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        currency={currency}
        rateUSD={rateUSD}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        currency={currency}
        rateUSD={rateUSD}
        discountINR={checkoutDiscount}
        couponCode={checkoutCoupon}
        user={user}
        onOrderSuccess={handleOrderSuccess}
        onDownloadFile={handleDownloadFile}
      />

      <ReaderModal 
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? savedArticleIds.includes(selectedArticle.id) : false}
        onToggleBookmark={() => selectedArticle && handleToggleBookmark(selectedArticle.id)}
      />

      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(u) => { setUser(u); showToast(`Welcome, ${u.name}!`); }}
      />

      <AICopilotModal 
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />

      <SearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onSelectProduct={(prod) => handleBuyNow(prod)}
        onSelectCalculator={(cId) => { setActiveTab('calculators'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />

      {/* Institutional Admin Dashboard Console */}
      {adminOpen && (
        <AdminDashboard 
          user={user} 
          onClose={() => setAdminOpen(false)} 
          onArticlePublished={fetchLiveArticles}
        />
      )}

      {/* Cookie & Cryptographic Privacy Consent Banner */}
      <CookieBanner onOpenPrivacy={() => { setActiveTab('policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* Toast Notification Container */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(10, 24, 42, 0.95)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 8px 30px rgba(0, 245, 255, 0.35)',
          fontSize: '13px',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMsg}
        </div>
      )}

      {/* Global Footer */}
      <Footer onNavigate={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
};

export default App;
