import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function SipCalculator() {
  const [monthly, setMonthly] = useState<number>(10000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(15);

  // Calculation
  const i = rate / 100 / 12;
  const n = years * 12;
  const invested = monthly * n;
  const maturity = Math.round(monthly * (((Math.pow(1 + i, n) - 1) / i) * (1 + i)));
  const estimatedReturns = maturity - invested;

  const copyText = `SIP Calculation Summary:
Monthly Contribution: ₹${monthly.toLocaleString('en-IN')}
Expected Return: ${rate}% p.a.
Investment Tenure: ${years} Years
Total Invested: ₹${invested.toLocaleString('en-IN')}
Estimated Returns: ₹${estimatedReturns.toLocaleString('en-IN')}
Total Maturity Corpus: ₹${maturity.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/sip-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="sip-monthly" className="text-slate-300">Monthly Investment (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{monthly.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="sip-monthly"
            type="range"
            min="500"
            max="150000"
            step="500"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              min="500"
              max="1000000"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="sip-rate" className="text-slate-300">Expected Annual Return Rate (p.a.)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">{rate}%</span>
          </div>
          <input
            id="sip-rate"
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              min="1"
              max="35"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="sip-years" className="text-slate-300">Investment Horizon (Years)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{years} Years</span>
          </div>
          <input
            id="sip-years"
            type="range"
            min="1"
            max="40"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>
      </div>

      {/* Output Panel with strict min-height to prevent CLS */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Maturity Value
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-4">
            ₹{maturity.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Capital Invested:</span>
            <span className="font-mono font-semibold text-slate-200">₹{invested.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Estimated Wealth Gain:</span>
            <span className="font-mono font-semibold text-emerald-400">₹{estimatedReturns.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Gain Multiplier:</span>
            <span className="font-mono font-bold text-slate-300">{(maturity / (invested || 1)).toFixed(2)}x invested capital</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Systematic Investment Plan (SIP) Calculator"
      subtitle="Model compound interest wealth generation, rupee-cost averaging, and multi-decade geometric returns for Indian mutual fund portfolios."
      badge="SEBI Investor Awareness Framework"
      calculatorGui={gui}
      formula="M = P × [((1 + i)^n - 1) / i] × (1 + i)"
      variables={[
        { symbol: 'M', name: 'Terminal Maturity Amount', description: 'The accumulated wealth corpus including invested capital and accrued compound returns.' },
        { symbol: 'P', name: 'Monthly Investment Installment', description: 'The fixed capital sum debited systematically into mutual funds or index instruments each month.' },
        { symbol: 'i', name: 'Periodic Compounding Rate', description: 'Annualized nominal expected return divided by 12 months (Annual Return Rate / 12 / 100).' },
        { symbol: 'n', name: 'Total Number of Installments', description: 'Total compounding cycles across the investment tenure (Investment Years × 12).' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Taxation & Regulatory Framework (CBDT Section 112A)',
        points: [
          'Under the Finance Act, Long-Term Capital Gains (LTCG) on equity-oriented mutual funds held for greater than 12 months are taxed at 12.5% on profits exceeding ₹1.25 lakh per financial year under Section 112A.',
          'Short-Term Capital Gains (STCG) on equity mutual fund units redeemed before 365 days are taxed at a flat statutory rate of 20% under Section 111A.',
          'SIP investments in Equity Linked Savings Schemes (ELSS) are eligible for statutory deductions up to ₹1,50,000 under Section 80C under the Old Tax Regime, subject to a mandatory 3-year statutory lock-in.'
        ]
      }}
      faqs={[
        {
          question: 'How does rupee-cost averaging protect SIP investors?',
          answer: 'Rupee-cost averaging allows investors to acquire more fund units when market valuations decline and fewer units during market highs. Over multiple market cycles, this lowers the weighted average purchase cost per unit without requiring market timing.'
        },
        {
          question: 'What expected CAGR is realistic for Indian equities?',
          answer: 'Historically, broad Indian indices like the NIFTY 50 and S&P BSE Sensex have delivered 11% to 13% annualized CAGR over rolling 15-year periods. However, past performance does not guarantee future results and investments are subject to market volatility.'
        },
        {
          question: 'Does the calculation account for Total Expense Ratio (TER)?',
          answer: 'The computation calculates gross compounded growth. Direct mutual fund plans typically carry a Total Expense Ratio between 0.05% and 0.50%, whereas regular broker-sold plans range between 1.0% and 2.2%, significantly reducing 20-year net returns.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
