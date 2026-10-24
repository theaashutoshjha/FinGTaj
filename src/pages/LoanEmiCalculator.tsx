import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState<number>(5000000);
  const [rate, setRate] = useState<number>(8.75);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // Amortization calculation
  const r = rate / 100 / 12;
  const n = tenureYears * 12;
  const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - principal;

  const copyText = `Loan EMI Amortization Summary:
Principal Loan Amount: ₹${principal.toLocaleString('en-IN')}
Interest Rate: ${rate}% p.a. (Reducing Balance)
Tenure: ${tenureYears} Years (${n} Months)
Monthly EMI: ₹${emi.toLocaleString('en-IN')}
Total Interest Payable: ₹${totalInterest.toLocaleString('en-IN')}
Total Amount Repaid: ₹${totalRepayment.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/loan-emi-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="emi-principal" className="text-slate-300">Loan Amount (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{principal.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="emi-principal"
            type="range"
            min="100000"
            max="20000000"
            step="50000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              min="10000"
              max="50000000"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="emi-rate" className="text-slate-300">Interest Rate (% p.a.)</label>
            <span className="text-amber-400 font-mono text-base font-bold">{rate}%</span>
          </div>
          <input
            id="emi-rate"
            type="range"
            min="5"
            max="20"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="emi-tenure" className="text-slate-300">Loan Tenure (Years)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{tenureYears} Years</span>
          </div>
          <input
            id="emi-tenure"
            type="range"
            min="1"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>
      </div>

      {/* Output Panel with strict min-height to prevent CLS */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Equated Monthly Installment (EMI)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-4">
            ₹{emi.toLocaleString('en-IN')}<span className="text-sm font-normal text-slate-400">/mo</span>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Principal Disbursed:</span>
            <span className="font-mono font-semibold text-slate-200">₹{principal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Interest Burden:</span>
            <span className="font-mono font-semibold text-amber-400">₹{totalInterest.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Total Outflow Repaid:</span>
            <span className="font-mono font-bold text-slate-300">₹{totalRepayment.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Loan EMI & Reducing Balance Amortization Calculator"
      subtitle="Calculate exact equated monthly installments, total interest liabilities, and amortization distribution for home, auto, and personal loans in India."
      badge="RBI Lending Directive Compliant"
      calculatorGui={gui}
      formula="EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]"
      variables={[
        { symbol: 'EMI', name: 'Equated Monthly Installment', description: 'The constant periodic monthly payment comprising principal reduction and reducing interest.' },
        { symbol: 'P', name: 'Principal Loan Amount', description: 'The net capital loan sum sanctioned and disbursed by the lending institution.' },
        { symbol: 'r', name: 'Periodic Monthly Interest Rate', description: 'The annual percentage rate (APR) divided by 12 months and 100 (Annual Rate / 12 / 100).' },
        { symbol: 'n', name: 'Amortization Period in Months', description: 'Total number of monthly payment cycles across the loan tenure (Years × 12).' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Amortization & RBI External Benchmark Lending Regulations',
        points: [
          'Under Reserve Bank of India (RBI) guidelines, all floating-rate retail loans sanctioned by commercial banks must be linked to an External Benchmark Lending Rate (EBLR), predominantly the RBI Repo Rate.',
          'RBI regulations strictly prohibit banks and Housing Finance Companies (HFCs) from charging foreclosure fees or prepayment penalties on floating-rate individual home loans.',
          'Under the Income Tax Act 1961, home loan borrowers under the Old Tax Regime may claim deductions up to ₹2,00,000 under Section 24(b) for interest and ₹1,50,000 under Section 80C for principal repayment.'
        ]
      }}
      faqs={[
        {
          question: 'What is reducing-balance amortization versus flat-rate interest?',
          answer: 'In reducing-balance amortization, interest for each month is calculated strictly on the outstanding principal balance. In contrast, flat-rate loans calculate interest on the original loan amount throughout the tenure, yielding significantly higher effective interest rates.'
        },
        {
          question: 'How does paying 1 extra EMI per year affect a 20-year home loan?',
          answer: 'Paying just one extra EMI annually directly reduces the principal balance, which can shorten a 20-year home loan by approximately 4 to 5 years and save up to 25% of total payable interest.'
        },
        {
          question: 'Can banks charge prepayment penalties if I close my floating home loan early?',
          answer: 'No. RBI directives clearly prohibit scheduled commercial banks and housing finance corporations from levying prepayment or foreclosure charges on floating-rate home loans issued to individual borrowers.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
