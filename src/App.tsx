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

  const toggleCurrency = () => {
    const next = currency === 'INR' ? 'USD' : 'INR';
    setCurrency(next);
    showToast(`Currency switched to ${next}`);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next} mode`);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
    showToast(`Added "${product.title.slice(0, 24)}..." to cart!`);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setCheckoutDiscount(0);
    setCheckoutCoupon('');
    setCheckoutOpen(true);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => i.product.id === productId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleOpenCheckout = (discount: number, coupon: string) => {
    setCheckoutDiscount(discount);
    setCheckoutCoupon(coupon);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Real Digital Download Handler
  const handleDownloadFile = (fileName: string, title: string) => {
    let content = "";
    let mimeType = "text/csv;charset=utf-8;";

    if (fileName.endsWith('.txt')) {
      mimeType = "text/plain;charset=utf-8;";
      content = `========================================================\n`
        + `FINGTAJ VIP LIFETIME ALL-ACCESS VERIFIED LICENSE\n`
        + `========================================================\n`
        + `License Key: FT-VIP-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}\n`
        + `Holder: ${user?.name || "Verified Investor"}\n`
        + `Email: ${user?.email || "investor@fingtaj.com"}\n`
        + `Access Status: ACTIVE LIFETIME LICENSED\n`
        + `Portal: https://www.fingtaj.com/\n`
        + `Generated: ${new Date().toISOString()}\n`;
    } else {
      content = `FingTaj Financial Toolkit,${title}\n`
        + `Version,2026 Institutional Release\n`
        + `Format,Pre-Linked Excel/CSV Formulas\n`
        + `Year,Estimated Return,Cash Outlay,Discount Factor,Terminal Wealth\n`
        + `1,12%,120000,0.892,=C4*D4\n`
        + `2,12%,144000,0.797,=C5*D5\n`
        + `3,12%,172800,0.711,=C6*D6\n`
        + `4,12%,207360,0.635,=C7*D7\n`
        + `5,12%,248832,0.567,=C8*D8\n`
        + `10,12%,500000,0.321,=C9*D9\n`
        + `20,12%,1200000,0.103,=C10*D10\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded "${fileName}"`);
  };

  const handleOrderSuccess = (order: Order) => {
    const purchasedIds = order.items.map(i => i.product.id);
    setPurchasedProductIds(prev => Array.from(new Set([...prev, ...purchasedIds])));
    setCart([]);
    showToast('Payment successful! Your download is complete.');
  };

  const handleToggleBookmark = (articleId: string) => {
    setSavedArticleIds(prev => {
      if (prev.includes(articleId)) {
        showToast('Article removed from saved.');
        return prev.filter(id => id !== articleId);
      } else {
        showToast('Article saved to My Hub!');
        return [...prev, articleId];
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Signed out of session.');
  };

  return (
    <div className="app-container">
      {/* Dynamic Background Aurora Mesh */}
      <div className="bg-mesh-canvas">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>

      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Top Sticky Navigation */}
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

            {/* Editorial Library */}
            <ArticlesSection 
              onOpenArticle={(art) => setSelectedArticle(art)}
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
              onOpenArticle={(art) => setSelectedArticle(art)}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'finance' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="finance"
              onOpenArticle={(art) => setSelectedArticle(art)}
              savedArticleIds={savedArticleIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'loans' && (
          <div style={{ padding: '30px 0' }}>
            <ArticlesSection 
              initialCategory="loans"
              onOpenArticle={(art) => setSelectedArticle(art)}
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
