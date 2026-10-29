import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import CalculatorPage from './pages/CalculatorPage';
import IndexingHub from './pages/IndexingHub';

// Scroll to top automatically on route transitions
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#080d16] text-slate-100 relative selection:bg-cyan-500 selection:text-black">
        <Navbar />

        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Dedicated Core Calculators */}
            <Route path="/emi-calculator" element={<CalculatorPage forcedSlug="emi-calculator" />} />
            <Route path="/home-loan-emi-calculator" element={<CalculatorPage forcedSlug="home-loan-emi-calculator" />} />
            <Route path="/car-loan-emi-calculator" element={<CalculatorPage forcedSlug="car-loan-emi-calculator" />} />
            <Route path="/personal-loan-emi-calculator" element={<CalculatorPage forcedSlug="personal-loan-emi-calculator" />} />
            <Route path="/loan-eligibility-calculator" element={<CalculatorPage forcedSlug="loan-eligibility-calculator" />} />
            <Route path="/loan-prepayment-calculator" element={<CalculatorPage forcedSlug="loan-prepayment-calculator" />} />
            <Route path="/loan-comparison-calculator" element={<CalculatorPage forcedSlug="loan-comparison-calculator" />} />
            <Route path="/education-loan-calculator" element={<CalculatorPage forcedSlug="education-loan-calculator" />} />

            <Route path="/sip-calculator" element={<CalculatorPage forcedSlug="sip-calculator" />} />
            <Route path="/step-up-sip-calculator" element={<CalculatorPage forcedSlug="step-up-sip-calculator" />} />
            <Route path="/lumpsum-calculator" element={<CalculatorPage forcedSlug="lumpsum-calculator" />} />
            <Route path="/swp-calculator" element={<CalculatorPage forcedSlug="swp-calculator" />} />
            <Route path="/cagr-calculator" element={<CalculatorPage forcedSlug="cagr-calculator" />} />
            <Route path="/xirr-calculator" element={<CalculatorPage forcedSlug="xirr-calculator" />} />
            <Route path="/mutual-fund-returns-calculator" element={<CalculatorPage forcedSlug="mutual-fund-returns-calculator" />} />
            <Route path="/goal-based-investment-calculator" element={<CalculatorPage forcedSlug="goal-based-investment-calculator" />} />
            <Route path="/rule-of-72-calculator" element={<CalculatorPage forcedSlug="rule-of-72-calculator" />} />
            <Route path="/stock-average-price-calculator" element={<CalculatorPage forcedSlug="stock-average-price-calculator" />} />

            <Route path="/fd-calculator" element={<CalculatorPage forcedSlug="fd-calculator" />} />
            <Route path="/rd-calculator" element={<CalculatorPage forcedSlug="rd-calculator" />} />
            <Route path="/ppf-calculator" element={<CalculatorPage forcedSlug="ppf-calculator" />} />
            <Route path="/nps-calculator" element={<CalculatorPage forcedSlug="nps-calculator" />} />
            <Route path="/sukanya-samriddhi-calculator" element={<CalculatorPage forcedSlug="sukanya-samriddhi-calculator" />} />
            <Route path="/compound-interest-calculator" element={<CalculatorPage forcedSlug="compound-interest-calculator" />} />
            <Route path="/simple-interest-calculator" element={<CalculatorPage forcedSlug="simple-interest-calculator" />} />

            <Route path="/retirement-corpus-calculator" element={<CalculatorPage forcedSlug="retirement-corpus-calculator" />} />
            <Route path="/epf-calculator" element={<CalculatorPage forcedSlug="epf-calculator" />} />
            <Route path="/gratuity-calculator" element={<CalculatorPage forcedSlug="gratuity-calculator" />} />
            <Route path="/inflation-calculator" element={<CalculatorPage forcedSlug="inflation-calculator" />} />
            <Route path="/emergency-fund-calculator" element={<CalculatorPage forcedSlug="emergency-fund-calculator" />} />
            <Route path="/fire-calculator" element={<CalculatorPage forcedSlug="fire-calculator" />} />

            <Route path="/income-tax-calculator" element={<CalculatorPage forcedSlug="income-tax-calculator" />} />
            <Route path="/hra-exemption-calculator" element={<CalculatorPage forcedSlug="hra-exemption-calculator" />} />
            <Route path="/capital-gains-tax-calculator" element={<CalculatorPage forcedSlug="capital-gains-tax-calculator" />} />
            <Route path="/gst-calculator" element={<CalculatorPage forcedSlug="gst-calculator" />} />
            <Route path="/tds-calculator" element={<CalculatorPage forcedSlug="tds-calculator" />} />
            <Route path="/advance-tax-calculator" element={<CalculatorPage forcedSlug="advance-tax-calculator" />} />

            <Route path="/salary-in-hand-calculator" element={<CalculatorPage forcedSlug="salary-in-hand-calculator" />} />
            <Route path="/ctc-to-take-home-calculator" element={<CalculatorPage forcedSlug="ctc-to-take-home-calculator" />} />
            <Route path="/profit-margin-calculator" element={<CalculatorPage forcedSlug="profit-margin-calculator" />} />
            <Route path="/break-even-calculator" element={<CalculatorPage forcedSlug="break-even-calculator" />} />
            <Route path="/roi-calculator" element={<CalculatorPage forcedSlug="roi-calculator" />} />
            <Route path="/discount-and-markup-calculator" element={<CalculatorPage forcedSlug="discount-and-markup-calculator" />} />

            <Route path="/currency-converter" element={<CalculatorPage forcedSlug="currency-converter" />} />
            <Route path="/credit-card-interest-calculator" element={<CalculatorPage forcedSlug="credit-card-interest-calculator" />} />
            <Route path="/credit-card-payoff-calculator" element={<CalculatorPage forcedSlug="credit-card-payoff-calculator" />} />
            <Route path="/rent-vs-buy-calculator" element={<CalculatorPage forcedSlug="rent-vs-buy-calculator" />} />
            <Route path="/net-worth-calculator" element={<CalculatorPage forcedSlug="net-worth-calculator" />} />
            <Route path="/budget-50-30-20-calculator" element={<CalculatorPage forcedSlug="budget-50-30-20-calculator" />} />
            <Route path="/term-insurance-calculator" element={<CalculatorPage forcedSlug="term-insurance-calculator" />} />

            {/* Legacy & Compatibility Aliases */}
            <Route path="/loan-emi-calculator" element={<CalculatorPage forcedSlug="emi-calculator" />} />
            <Route path="/hra-calculator" element={<CalculatorPage forcedSlug="hra-exemption-calculator" />} />
            <Route path="/inflation-adjusted-return-calculator" element={<CalculatorPage forcedSlug="inflation-calculator" />} />
            <Route path="/section-44ada-calculator" element={<CalculatorPage forcedSlug="income-tax-calculator" />} />
            <Route path="/calculators" element={<Home />} />

            {/* Institutional Content Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<TermsOfService />} />
            <Route path="/indexing" element={<IndexingHub />} />
            <Route path="/search-console" element={<IndexingHub />} />

            {/* Dynamic slug route fallback */}
            <Route path="/:slug" element={<CalculatorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
