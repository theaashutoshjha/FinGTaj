import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Individual Calculator Pages
import SipCalculator from './pages/SipCalculator';
import LoanEmiCalculator from './pages/LoanEmiCalculator';
import IncomeTaxCalculator from './pages/IncomeTaxCalculator';
import PpfCalculator from './pages/PpfCalculator';
import InflationCalculator from './pages/InflationCalculator';
import FdCalculator from './pages/FdCalculator';
import HraCalculator from './pages/HraCalculator';
import GratuityCalculator from './pages/GratuityCalculator';
import CapitalGainsCalculator from './pages/CapitalGainsCalculator';
import Section44adaCalculator from './pages/Section44adaCalculator';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sip-calculator" element={<SipCalculator />} />
            <Route path="/loan-emi-calculator" element={<LoanEmiCalculator />} />
            <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
            <Route path="/ppf-calculator" element={<PpfCalculator />} />
            <Route path="/inflation-adjusted-return-calculator" element={<InflationCalculator />} />
            <Route path="/fd-calculator" element={<FdCalculator />} />
            <Route path="/hra-calculator" element={<HraCalculator />} />
            <Route path="/gratuity-calculator" element={<GratuityCalculator />} />
            <Route path="/capital-gains-tax-calculator" element={<CapitalGainsCalculator />} />
            <Route path="/section-44ada-calculator" element={<Section44adaCalculator />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            {/* Compatibility & SEO Aliases */}
            <Route path="/calculators" element={<Home />} />
            <Route path="/disclaimer" element={<TermsOfService />} />
            <Route path="/author/:slug" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
