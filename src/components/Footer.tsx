import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-10 text-center text-sm text-slate-400">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 mb-4 font-medium">
          <Link className="hover:text-cyan-400 transition" to="/about">About Us</Link>
          <Link className="hover:text-cyan-400 transition" to="/privacy-policy">Privacy Policy</Link>
          <Link className="hover:text-cyan-400 transition" to="/terms-of-service">Terms of Service</Link>
          <Link className="hover:text-cyan-400 transition" to="/contact">Contact Us</Link>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl mx-auto mb-2">
          Disclaimer: FingTaj is an independent financial technology utility. Calculations and estimates are provided strictly for educational and planning purposes and do not constitute formal investment, tax, or legal advice.
        </p>
        <p className="text-xs text-slate-600">
          © 2026 FingTaj. All statutory calculations run strictly client-side.
        </p>
      </div>
    </footer>
  );
}
