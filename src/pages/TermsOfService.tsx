import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-6">Effective Date: October 2026</p>

      <div className="space-y-6">
        <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-lg text-amber-200 text-sm">
          <strong>Statutory Financial Disclaimer:</strong> All computation algorithms, tax comparisons, and repayment schedules provided on FingTaj are strictly for educational and self-planning purposes. FingTaj does not offer certified Chartered Accountancy, legal, or investment advisory services. Consult a certified financial planner or tax advisor before making binding financial decisions.
        </div>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Use License</h2>
          <p>
            Permission is granted to freely use the computational tools available on FingTaj (<a href="https://www.fingtaj.com" className="text-cyan-400 underline">https://www.fingtaj.com</a>) for personal and professional calculation needs. Reverse engineering or scraping the core computational interfaces for automated redistribution without authorization is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Accuracy of Calculations</h2>
          <p>
            While our models follow standard Indian statutory conventions (Income Tax Act 1961, Finance Act revisions, and RBI guidelines), FingTaj does not guarantee 100% precision for individual, non-standard tax situations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Intellectual Property</h2>
          <p>
            The interface, UI styling, and compiled frontend code of FingTaj are protected under intellectual property and copyright laws.
          </p>
        </section>
      </div>
    </div>
  );
}
