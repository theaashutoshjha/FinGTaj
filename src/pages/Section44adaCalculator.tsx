import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function Section44adaCalculator() {
  const [grossReceipts, setGrossReceipts] = useState<number>(3500000);
  const [presumptiveProfitPct, setPresumptiveProfitPct] = useState<number>(50); // Minimum 50%

  // Deemed profit calculation u/s 44ADA
  const deemedProfit = Math.round(grossReceipts * (presumptiveProfitPct / 100));

  // Compute tax under New Tax Regime Section 115BAC (Non-salaried, no standard deduction)
  const taxableIncome = deemedProfit;
  let tax = 0;
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 700000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 400000 * 0.05 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 400000 * 0.05 + 300000 * 0.10 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxableIncome - 1500000) * 0.30;
  }

  // Section 87A rebate if taxable income <= 7 lakh
  if (taxableIncome <= 700000) {
    tax = 0;
  }

  const cess = Math.round(tax * 0.04);
  const totalTax = tax + cess;
  const effectiveTaxRate = grossReceipts > 0 ? ((totalTax / grossReceipts) * 100).toFixed(2) : '0';

  const copyText = `Section 44ADA Presumptive Taxation Summary:
Gross Professional Receipts: ₹${grossReceipts.toLocaleString('en-IN')}
Declared Profit Rate: ${presumptiveProfitPct}% (Statutory minimum 50%)
Deemed Taxable Profit: ₹${deemedProfit.toLocaleString('en-IN')}
Total Estimated Income Tax: ₹${totalTax.toLocaleString('en-IN')}
Effective Tax Burden on Gross Turnover: ${effectiveTaxRate}%
Statutory Relief: Exemption from Books of Accounts u/s 44AA & Audit u/s 44AB
Calculated on FingTaj (https://www.fingtaj.com/section-44ada-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="ada-gross" className="text-slate-300">Gross Professional Receipts / Invoices (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{grossReceipts.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="ada-gross"
            type="range"
            min="500000"
            max="7500000"
            step="50000"
            value={grossReceipts}
            onChange={(e) => setGrossReceipts(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="10000000"
              value={grossReceipts}
              onChange={(e) => setGrossReceipts(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory threshold: Up to ₹75 Lakhs if cash receipts do not exceed 5% of turnover.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="ada-pct" className="text-slate-300">Declared Deemed Profit Percentage</label>
            <span className="text-emerald-400 font-mono text-base font-bold">{presumptiveProfitPct}%</span>
          </div>
          <input
            id="ada-pct"
            type="range"
            min="50"
            max="95"
            step="1"
            value={presumptiveProfitPct}
            onChange={(e) => setPresumptiveProfitPct(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
          <p className="text-xs text-slate-500 mt-1">Section 44ADA mandates a minimum deemed profit declaration of 50%.</p>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Estimated Tax Liability
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-2">
            ₹{totalTax.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mb-4">
            Effective Tax on Gross: <span className="font-mono font-bold text-emerald-400">{effectiveTaxRate}%</span>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Deemed Taxable Income (50%):</span>
            <span className="font-mono font-semibold text-slate-200">₹{deemedProfit.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Presumptive Business Expenses:</span>
            <span className="font-mono font-semibold text-emerald-400">₹{(grossReceipts - deemedProfit).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>Books of Account:</span>
            <span className="font-medium text-emerald-400">Statutory Exemption u/s 44AA</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Section 44ADA Presumptive Taxation Calculator"
      subtitle="Compute presumptive taxable income, tax liabilities, and audit exemptions for Indian freelancers, software consultants, doctors, and legal professionals."
      badge="Income Tax Act Section 44ADA"
      calculatorGui={gui}
      formula="Deemed Taxable Profit = Maximum of (Actual Profit, Gross Receipts × 50%)"
      variables={[
        { symbol: 'Gross Receipts', name: 'Total Professional Invoices', description: 'Total revenue collected across the financial year for specified professional services.' },
        { symbol: '50% Minimum', name: 'Statutory Deemed Profit Rate', description: 'Statutory deemed minimum profit margin prescribed under Section 44ADA.' },
        { symbol: '₹75 Lakhs', name: 'Enhanced Statutory Limit', description: 'Turnover ceiling if cash receipts constitute less than 5% of total receipts.' },
        { symbol: 'Sec 44AB', name: 'Tax Audit Exemption', description: 'Complete waiver of mandatory tax audits by Chartered Accountants under Section 44AB.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Presumptive Provisions under Section 44ADA & 44AA',
        points: [
          'Under Section 44ADA of the Income Tax Act 1961, eligible professionals whose gross receipts do not exceed ₹75,00,000 (with cash receipts <= 5%) can declare 50% or more of receipts as profit.',
          'Eligible specified professions under Section 44AA(1) include legal, medical, engineering, architectural, accountancy, technical consultancy, and interior decoration.',
          'Taxpayers opting for Section 44ADA are completely exempt from maintaining complex books of accounts under Section 44AA and undergoing statutory tax audits under Section 44AB.'
        ]
      }}
      faqs={[
        {
          question: 'Are software developers and tech consultants eligible for Section 44ADA?',
          answer: 'Yes. Technical consultancy and IT services rendered by independent contractors and freelancers are recognized as eligible specified professions under CBDT guidelines.'
        },
        {
          question: 'Can I declare more than 50% profit under Section 44ADA?',
          answer: 'Yes. The 50% threshold is the statutory minimum deemed rate. If your actual business profits are higher, you can declare the higher figure voluntarily.'
        },
        {
          question: 'Do I have to pay advance tax under Section 44ADA?',
          answer: 'Yes, but with simplified compliance. Taxpayers utilizing Section 44ADA are required to pay their entire advance tax liability in a single installment on or before March 15 of the financial year.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
