import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function PpfCalculator() {
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [rate, setRate] = useState<number>(7.1);
  const [tenureYears, setTenureYears] = useState<number>(15);

  // PPF Compound calculation
  const i = rate / 100;
  const n = tenureYears;
  const totalDeposited = annualDeposit * n;
  
  // Future value of annual annuity due (deposit made before 5th of April each year)
  let balance = 0;
  for (let year = 1; year <= n; year++) {
    balance = (balance + annualDeposit) * (1 + i);
  }
  const maturityValue = Math.round(balance);
  const totalInterest = maturityValue - totalDeposited;

  const copyText = `Public Provident Fund (PPF) Calculation:
Annual Contribution: ₹${annualDeposit.toLocaleString('en-IN')}
Sovereign Interest Rate: ${rate}% p.a. (Compounded Annually)
Tenure: ${tenureYears} Years
Total Principal Invested: ₹${totalDeposited.toLocaleString('en-IN')}
Total Sovereign Interest Earned: ₹${totalInterest.toLocaleString('en-IN')}
Total Maturity Corpus: ₹${maturityValue.toLocaleString('en-IN')} (100% Tax-Free under EEE)
Calculated on FingTaj (https://www.fingtaj.com/ppf-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="ppf-deposit" className="text-slate-300">Annual Deposit Amount (Max ₹1.5 Lakh)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{annualDeposit.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="ppf-deposit"
            type="range"
            min="500"
            max="150000"
            step="500"
            value={annualDeposit}
            onChange={(e) => setAnnualDeposit(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              min="500"
              max="150000"
              value={annualDeposit}
              onChange={(e) => setAnnualDeposit(Math.min(150000, Math.max(0, Number(e.target.value))))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="ppf-rate" className="text-slate-300">Government Notified Interest Rate (% p.a.)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">{rate}%</span>
          </div>
          <input
            id="ppf-rate"
            type="range"
            min="6.0"
            max="9.0"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="ppf-tenure" className="text-slate-300">Tenure (Statutory 15 Yrs + 5-Yr Block Extensions)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{tenureYears} Years</span>
          </div>
          <select
            id="ppf-tenure"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="15">15 Years (Statutory Minimum Lock-in)</option>
            <option value="20">20 Years (1 Block Extension)</option>
            <option value="25">25 Years (2 Block Extensions)</option>
            <option value="30">30 Years (3 Block Extensions)</option>
          </select>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Maturity Corpus (Tax-Free EEE)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-4">
            ₹{maturityValue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Deposits Made:</span>
            <span className="font-mono font-semibold text-slate-200">₹{totalDeposited.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Interest Earned:</span>
            <span className="font-mono font-semibold text-emerald-400">₹{totalInterest.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Tax Treatment:</span>
            <span className="font-semibold text-emerald-400">Exempt-Exempt-Exempt (EEE)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Public Provident Fund (PPF) Scheme Calculator"
      subtitle="Compute sovereign compound returns, 15-year statutory lock-in accumulation, and tax-free interest yields under the Ministry of Finance PPF Scheme Rules."
      badge="Ministry of Finance Sovereign Scheme"
      calculatorGui={gui}
      formula="F = P × [((1 + i)^n - 1) / i] × (1 + i)"
      variables={[
        { symbol: 'F', name: 'Maturity Corpus Value', description: 'The accumulated tax-free maturity proceeds at the end of the statutory tenure.' },
        { symbol: 'P', name: 'Annual Periodic Deposit', description: 'Statutory annual subscription deposit (Minimum ₹500, Maximum ₹1,50,000 per fiscal year).' },
        { symbol: 'i', name: 'Annual Sovereign Interest Rate', description: 'Quarterly notified interest rate established by the Ministry of Finance (currently 7.1% p.a.).' },
        { symbol: 'n', name: 'Duration of Account in Years', description: 'The 15-year initial statutory lock-in, extendable in 5-year blocks.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Rules under Public Provident Fund Scheme 2019',
        points: [
          'Under Section 10(11) of the Income Tax Act 1961, PPF enjoys sovereign Exempt-Exempt-Exempt (EEE) status: contributions are tax-deductible under 80C, annual accrued interest is completely tax-free, and final maturity withdrawals are non-taxable.',
          'Interest is calculated on the lowest balance between the close of the 5th day and the end of the month, and credited to the account on 31st March of each financial year.',
          'Under Section 15 of the Government Savings Promotion Act, PPF balances are sovereignly protected from court attachments against commercial liabilities or bankruptcy decrees.'
        ]
      }}
      faqs={[
        {
          question: 'What is the optimal date to deposit funds into a PPF account each month?',
          answer: 'Deposits should be made on or before the 5th day of the calendar month to maximize interest accrual for that specific month, as interest is computed on the minimum balance between the 5th and the last day.'
        },
        {
          question: 'Can the 15-year PPF tenure be extended after maturity?',
          answer: 'Yes. Account holders can extend their PPF in successive blocks of 5 years indefinitely, either with continued subscriptions or without fresh contributions.'
        },
        {
          question: 'What is the maximum statutory deposit permitted per financial year?',
          answer: 'Under Ministry of Finance rules, the maximum aggregate deposit permitted across all PPF accounts held by an individual (including accounts opened on behalf of minor children) is ₹1,50,000 per financial year.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
