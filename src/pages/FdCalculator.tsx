import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function FdCalculator() {
  const [deposit, setDeposit] = useState<number>(500000);
  const [rate, setRate] = useState<number>(7.25);
  const [years, setYears] = useState<number>(5);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const effectiveRate = isSeniorCitizen ? rate + 0.5 : rate;
  // Indian scheduled banks compound FD interest quarterly (n = 4)
  const n = 4;
  const t = years;
  const r = effectiveRate / 100;
  const maturityValue = Math.round(deposit * Math.pow(1 + r / n, n * t));
  const totalInterest = maturityValue - deposit;

  const copyText = `Bank Fixed Deposit (FD) Summary:
Deposit Principal: ₹${deposit.toLocaleString('en-IN')}
Interest Rate: ${effectiveRate}% p.a. (Quarterly Compounding${isSeniorCitizen ? ', Senior Citizen Rate' : ''})
Tenure: ${years} Years
Total Interest Accrued: ₹${totalInterest.toLocaleString('en-IN')}
Total Maturity Value: ₹${maturityValue.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/fd-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="fd-deposit" className="text-slate-300">Deposit Amount (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{deposit.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="fd-deposit"
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="fd-rate" className="text-slate-300">Annual Interest Rate (% p.a.)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">{effectiveRate}%</span>
          </div>
          <input
            id="fd-rate"
            type="range"
            min="4.0"
            max="10.0"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="fd-years" className="text-slate-300">Tenure (Years)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{years} Years</span>
          </div>
          <input
            id="fd-years"
            type="range"
            min="1"
            max="10"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <input
            id="senior-toggle"
            type="checkbox"
            checked={isSeniorCitizen}
            onChange={(e) => setIsSeniorCitizen(e.target.checked)}
            className="w-4 h-4 text-cyan-400 bg-slate-900 border-slate-700 rounded focus:ring-cyan-500"
          />
          <label htmlFor="senior-toggle" className="text-xs sm:text-sm text-slate-300 cursor-pointer">
            Senior Citizen Citizen Benefit (+0.50% statutory spread u/s 80TTB)
          </label>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Maturity Proceeds
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-4">
            ₹{maturityValue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Principal Deposited:</span>
            <span className="font-mono font-semibold text-slate-200">₹{deposit.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Interest Accrued:</span>
            <span className="font-mono font-semibold text-emerald-400">₹{totalInterest.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Compounding Standard:</span>
            <span className="font-mono text-slate-400">Quarterly (4 cycles/year)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Fixed Deposit (FD) Quarterly Compounding Calculator"
      subtitle="Compute bank cumulative fixed deposit maturity values with standard quarterly compounding conventions under Reserve Bank of India retail deposit schedules."
      badge="Indian Banking Quarterly Compounding Standard"
      calculatorGui={gui}
      formula="A = P × [1 + (r / 4)]^(4 × t)"
      variables={[
        { symbol: 'A', name: 'Maturity Proceed Amount', description: 'Total accumulated sum disbursed by the bank upon term completion.' },
        { symbol: 'P', name: 'Principal Deposit', description: 'The lump-sum capital placed into term deposit facility.' },
        { symbol: 'r', name: 'Annual Contracted Interest Rate', description: 'Annual percentage interest contracted with the scheduled commercial bank.' },
        { symbol: 't', name: 'Deposit Tenure in Years', description: 'Duration of the deposit in calendar years.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Taxation & TDS Rules under Income Tax Act 1961',
        points: [
          'Under Section 194A of the Income Tax Act 1961, banks deduct 10% TDS on fixed deposit interest exceeding ₹40,000 per financial year for individuals (₹50,000 for senior citizens).',
          'FD interest is taxed at the individual applicable income tax slab rates under the head "Income from Other Sources".',
          'Senior citizens can claim deductions up to ₹50,000 on bank interest income under Section 80TTB under the Old Tax Regime.'
        ]
      }}
      faqs={[
        {
          question: 'How frequently do Indian banks compound fixed deposit interest?',
          answer: 'By convention governed by RBI guidelines, Indian scheduled commercial banks compound cumulative fixed deposit interest quarterly (every three months).'
        },
        {
          question: 'How can I prevent TDS deduction on my fixed deposit?',
          answer: 'If your total taxable income is below the taxable exemption threshold, you can submit Form 15G (for individuals below 60) or Form 15H (for senior citizens) at the beginning of each financial year.'
        },
        {
          question: 'Are 5-year tax-saving fixed deposits liquid before maturity?',
          answer: 'No. 5-year tax-saving FDs eligible for deduction under Section 80C have a mandatory 5-year statutory lock-in and cannot be prematurely closed or pledged as collateral for loans.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
