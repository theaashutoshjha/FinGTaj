import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function HraCalculator() {
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [hraReceived, setHraReceived] = useState<number>(240000);
  const [rentPaid, setRentPaid] = useState<number>(300000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // Section 10(13A) Rule 2A calculation
  // 1. Actual HRA received
  const condition1 = hraReceived;
  // 2. Rent paid - 10% of basic salary
  const condition2 = Math.max(0, rentPaid - basicSalary * 0.10);
  // 3. 50% of basic salary (metro) or 40% (non-metro)
  const condition3 = isMetro ? basicSalary * 0.50 : basicSalary * 0.40;

  const exemptHra = Math.round(Math.min(condition1, condition2, condition3));
  const taxableHra = Math.max(0, hraReceived - exemptHra);

  const copyText = `House Rent Allowance (HRA) Exemption Summary:
Basic Salary (Annual): ₹${basicSalary.toLocaleString('en-IN')}
Actual HRA Received: ₹${hraReceived.toLocaleString('en-IN')}
Total Rent Paid (Annual): ₹${rentPaid.toLocaleString('en-IN')}
City Classification: ${isMetro ? 'Metro (50%)' : 'Non-Metro (40%)'}
Statutory HRA Exempt u/s 10(13A): ₹${exemptHra.toLocaleString('en-IN')}
Taxable HRA Added to Income: ₹${taxableHra.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/hra-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="hra-basic" className="text-slate-300">Annual Basic Salary + Dearness Allowance (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{basicSalary.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="hra-basic"
            type="range"
            min="100000"
            max="3000000"
            step="20000"
            value={basicSalary}
            onChange={(e) => setBasicSalary(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="hra-received" className="text-slate-300">Actual HRA Received from Employer (₹)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">₹{hraReceived.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="hra-received"
            type="range"
            min="10000"
            max="1500000"
            step="10000"
            value={hraReceived}
            onChange={(e) => setHraReceived(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="hra-rent" className="text-slate-300">Total Actual Rent Paid Annually (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{rentPaid.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="hra-rent"
            type="range"
            min="0"
            max="1800000"
            step="10000"
            value={rentPaid}
            onChange={(e) => setRentPaid(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="text-xs sm:text-sm font-semibold text-slate-300">City of Residence:</span>
          <label className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="metro"
              checked={isMetro}
              onChange={() => setIsMetro(true)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span>Metro (Delhi, Mumbai, Kolkata, Chennai)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="metro"
              checked={!isMetro}
              onChange={() => setIsMetro(false)}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <span>Non-Metro</span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Statutory Exempt HRA (Tax-Free)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight mb-4">
            ₹{exemptHra.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total HRA Received:</span>
            <span className="font-mono font-semibold text-slate-200">₹{hraReceived.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Taxable HRA Portioned:</span>
            <span className="font-mono font-semibold text-rose-400">₹{taxableHra.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Applicable Regime:</span>
            <span className="text-cyan-400 font-medium">Old Tax Regime Only</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="House Rent Allowance (HRA) Exemption Calculator"
      subtitle="Calculate tax-exempt House Rent Allowance under Section 10(13A) and Rule 2A of the Income Tax Act 1961 for salaried individuals in India."
      badge="Income Tax Act Section 10(13A) Rule 2A"
      calculatorGui={gui}
      formula="Exempt HRA = Minimum of (Actual HRA, Rent Paid - 10% of Basic, 50%/40% of Basic)"
      variables={[
        { symbol: 'Actual HRA', name: 'Allowance Received', description: 'Total House Rent Allowance credited by the employer across the financial year.' },
        { symbol: 'Basic + DA', name: 'Salary Base', description: 'Aggregated Basic Salary plus Dearness Allowance forming the statutory calculation base.' },
        { symbol: 'Rent Paid', name: 'Actual Accommodation Rent', description: 'Total rent paid toward residential premises occupied by the employee.' },
        { symbol: '50% / 40%', name: 'Metro Area Multiplier', description: '50% of Basic for Mumbai, Delhi, Kolkata, Chennai; 40% for all other locations.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Rules under Section 10(13A) and Income Tax Rules 1962',
        points: [
          'Under Section 10(13A) read with Rule 2A, the exempt portion of HRA is non-taxable under the Old Tax Regime. The New Tax Regime (Section 115BAC) disallows HRA exemptions.',
          'If annual rent paid exceeds ₹1,00,000, it is mandatory under CBDT guidelines to provide the Permanent Account Number (PAN) of the landlord to your employer.',
          'Employees cannot claim HRA exemption if they reside in residential accommodation owned by themselves or in which they have an ownership interest.'
        ]
      }}
      faqs={[
        {
          question: 'Is HRA exemption available under the New Tax Regime (Section 115BAC)?',
          answer: 'No. The New Tax Regime disallows standard salary exemptions including HRA under Section 10(13A), LTA under Section 10(5), and Chapter VI-A deductions.'
        },
        {
          question: 'Can I pay rent to my parents and claim HRA exemption?',
          answer: 'Yes, provided your parents own the property, you make genuine bank transfers, rent receipts are executed, and your parents declare this rental income in their respective income tax returns.'
        },
        {
          question: 'Can I claim both Home Loan tax benefits and HRA simultaneously?',
          answer: 'Yes, if your own home is in a different city or you live in rented premises due to employment distance while your purchased property is rented out or self-occupied by dependents.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
