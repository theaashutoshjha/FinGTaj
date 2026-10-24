import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function IncomeTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState<number>(1200000);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(100000);

  // New Tax Regime (Section 115BAC) Calculation
  const stdDeductionNew = 75000;
  const taxableNew = Math.max(0, grossSalary - stdDeductionNew);
  let taxNew = 0;
  if (taxableNew <= 300000) {
    taxNew = 0;
  } else if (taxableNew <= 700000) {
    taxNew = (taxableNew - 300000) * 0.05;
  } else if (taxableNew <= 1000000) {
    taxNew = 400000 * 0.05 + (taxableNew - 700000) * 0.10;
  } else if (taxableNew <= 1200000) {
    taxNew = 400000 * 0.05 + 300000 * 0.10 + (taxableNew - 1000000) * 0.15;
  } else if (taxableNew <= 1500000) {
    taxNew = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxableNew - 1200000) * 0.20;
  } else {
    taxNew = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxableNew - 1500000) * 0.30;
  }

  // Section 87A rebate for New Regime (Tax is zero if taxable income <= 7 lakh)
  if (taxableNew <= 700000) {
    taxNew = 0;
  }
  const cessNew = Math.round(taxNew * 0.04);
  const netTaxNew = Math.round(taxNew + cessNew);

  // Old Tax Regime Calculation
  const stdDeductionOld = 50000;
  const totalDeductionsOld = stdDeductionOld + Math.min(150000, deductions80C) + Math.min(100000, deductions80D) + hraExemption;
  const taxableOld = Math.max(0, grossSalary - totalDeductionsOld);
  let taxOld = 0;
  if (taxableOld <= 250000) {
    taxOld = 0;
  } else if (taxableOld <= 500000) {
    taxOld = (taxableOld - 250000) * 0.05;
  } else if (taxableOld <= 1000000) {
    taxOld = 250000 * 0.05 + (taxableOld - 500000) * 0.20;
  } else {
    taxOld = 250000 * 0.05 + 500000 * 0.20 + (taxableOld - 1000000) * 0.30;
  }
  if (taxableOld <= 500000) {
    taxOld = 0;
  }
  const cessOld = Math.round(taxOld * 0.04);
  const netTaxOld = Math.round(taxOld + cessOld);

  const recommendedRegime = netTaxNew <= netTaxOld ? 'New Tax Regime (Section 115BAC)' : 'Old Tax Regime';
  const taxSavings = Math.abs(netTaxOld - netTaxNew);

  const copyText = `Income Tax Comparison Summary:
Gross Annual Salary: ₹${grossSalary.toLocaleString('en-IN')}
New Regime Tax Liability: ₹${netTaxNew.toLocaleString('en-IN')}
Old Regime Tax Liability: ₹${netTaxOld.toLocaleString('en-IN')}
Recommended Regime: ${recommendedRegime}
Net Tax Saved: ₹${taxSavings.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/income-tax-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="tax-gross" className="text-slate-300">Gross Annual Salary (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{grossSalary.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="tax-gross"
            type="range"
            min="300000"
            max="5000000"
            step="50000"
            value={grossSalary}
            onChange={(e) => setGrossSalary(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <div className="mt-2">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="100000000"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Old Regime Deductions (Optional for Comparison)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Section 80C (Max 1.5L)</label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="150000"
                value={deductions80C}
                onChange={(e) => setDeductions80C(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Section 80D (Health)</label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="100000"
                value={deductions80D}
                onChange={(e) => setDeductions80D(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">HRA Exemption</label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="500000"
                value={hraExemption}
                onChange={(e) => setHraExemption(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Comparison Panel */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Recommended Statutory Regime
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight mb-2">
            {recommendedRegime}
          </div>
          <div className="text-xs text-slate-400 mb-4">
            Saves you <span className="font-mono font-bold text-white">₹{taxSavings.toLocaleString('en-IN')}</span> in annual tax liability
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">New Regime (115BAC)</div>
              <div className="text-[11px] text-slate-400">Std Ded: ₹75,000</div>
            </div>
            <div className="font-mono font-bold text-cyan-400 text-base">₹{netTaxNew.toLocaleString('en-IN')}</div>
          </div>

          <div className="flex justify-between items-center p-2 rounded bg-slate-900/40 border border-slate-800/60">
            <div>
              <div className="font-semibold text-slate-300">Old Regime</div>
              <div className="text-[11px] text-slate-400">With 80C/80D/HRA deductions</div>
            </div>
            <div className="font-mono font-bold text-slate-200 text-base">₹{netTaxOld.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Income Tax Calculator (New vs. Old Regime — Section 115BAC)"
      subtitle="Compare statutory income tax liabilities across the default New Tax Regime (Section 115BAC) and the Old Tax Regime with standard deductions, 80C, 80D, and HRA."
      badge="Finance Act Statutory Schedules"
      calculatorGui={gui}
      formula="Tax Liability = Base Tax on Slabs + 4% Health & Education Cess - Rebate u/s 87A"
      variables={[
        { symbol: 'Gross', name: 'Gross Annual Salary', description: 'Total annual remuneration prior to standard deductions and statutory chapter VI-A exemptions.' },
        { symbol: 'Std Ded', name: 'Standard Deduction', description: 'Statutory flat deduction of ₹75,000 under the New Regime and ₹50,000 under the Old Regime.' },
        { symbol: 'Sec 87A', name: 'Statutory Tax Rebate', description: 'Full tax rebate rendering income up to ₹7,00,000 tax-free under Section 115BAC.' },
        { symbol: 'Cess', name: 'Health & Education Cess', description: 'Mandatory 4% surcharge levied on the aggregated income tax liability.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Tax Provisions under Income Tax Act 1961',
        points: [
          'Under Section 115BAC of the Income Tax Act 1961, the New Tax Regime is the statutory default tax regime for individuals, Hindu Undivided Families (HUFs), and Association of Persons.',
          'Salaried employees can claim an enhanced standard deduction of ₹75,000 under the New Tax Regime (revised upwards from ₹50,000 under the Finance Act revisions).',
          'Under Section 87A, resident individual taxpayers whose taxable income does not exceed ₹7,00,000 are eligible for a 100% tax rebate under the New Tax Regime, resulting in zero net tax.'
        ]
      }}
      faqs={[
        {
          question: 'What is the standard deduction under the New Tax Regime?',
          answer: 'The standard deduction for salaried individuals and pensioners under the New Tax Regime is ₹75,000, which reduces taxable income without requiring bills or investment proofs.'
        },
        {
          question: 'Can I switch between the New and Old Tax Regimes every year?',
          answer: 'Salaried employees without business or professional income can switch between the Old and New Tax Regimes every financial year when filing their ITR under Section 139(1).'
        },
        {
          question: 'At what deduction level does the Old Tax Regime become superior?',
          answer: 'Generally, if total eligible deductions (80C, 80D, HRA, home loan interest u/s 24b) exceed ₹3,75,000 to ₹4,00,000, the Old Tax Regime may yield lower tax than Section 115BAC.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
