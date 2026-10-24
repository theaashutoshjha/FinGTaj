import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function GratuityCalculator() {
  const [lastSalary, setLastSalary] = useState<number>(80000); // Basic + DA
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [isCoveredByAct, setIsCoveredByAct] = useState<boolean>(true);

  // Payment of Gratuity Act 1972:
  // For covered employees: (15 * Last Drawn Basic+DA * Tenure) / 26
  // For non-covered: (15 * Average 10 Months Salary * Tenure) / 30
  const gratuityRaw = isCoveredByAct
    ? (15 * lastSalary * tenureYears) / 26
    : (15 * lastSalary * tenureYears) / 30;

  const gratuityAmount = Math.round(gratuityRaw);
  // Statutory tax exemption ceiling under Section 10(10) is ₹20,00,000
  const statutoryExemptionLimit = 2000000;
  const exemptGratuity = Math.min(gratuityAmount, statutoryExemptionLimit);
  const taxableGratuity = Math.max(0, gratuityAmount - exemptGratuity);

  const copyText = `Payment of Gratuity Summary:
Last Drawn Salary (Basic + DA): ₹${lastSalary.toLocaleString('en-IN')}
Total Continuous Tenure: ${tenureYears} Years
Statutory Act Coverage: ${isCoveredByAct ? 'Covered under Gratuity Act 1972' : 'Non-Covered Establishment'}
Computed Gratuity Payable: ₹${gratuityAmount.toLocaleString('en-IN')}
Statutory Tax Exemption (Sec 10(10)): ₹${exemptGratuity.toLocaleString('en-IN')}
Taxable Gratuity Portion: ₹${taxableGratuity.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/gratuity-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="grat-salary" className="text-slate-300">Last Drawn Monthly Salary (Basic + DA) (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{lastSalary.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="grat-salary"
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={lastSalary}
            onChange={(e) => setLastSalary(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="grat-tenure" className="text-slate-300">Continuous Service Completed (Years)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{tenureYears} Years</span>
          </div>
          <input
            id="grat-tenure"
            type="range"
            min="5"
            max="40"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
          <p className="text-xs text-slate-500 mt-1">Minimum 5 continuous years required under statutory mandate.</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <input
            id="covered-toggle"
            type="checkbox"
            checked={isCoveredByAct}
            onChange={(e) => setIsCoveredByAct(e.target.checked)}
            className="w-4 h-4 text-cyan-400 bg-slate-900 border-slate-700 rounded focus:ring-cyan-500"
          />
          <label htmlFor="covered-toggle" className="text-xs sm:text-sm text-slate-300 cursor-pointer">
            Covered under Payment of Gratuity Act 1972 (Denominator = 26 working days)
          </label>
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Gratuity Entitlement
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-4">
            ₹{gratuityAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tax-Exempt Portion (Sec 10(10)):</span>
            <span className="font-mono font-semibold text-emerald-400">₹{exemptGratuity.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Taxable Balance:</span>
            <span className="font-mono font-semibold text-slate-300">₹{taxableGratuity.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Statutory Cap:</span>
            <span className="font-mono text-slate-400">₹20 Lakhs maximum lifetime exemption</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Gratuity Calculator (Payment of Gratuity Act 1972)"
      subtitle="Compute statutory gratuity payouts, working day factor formulas (15/26), and lifetime tax exemption limits under Section 10(10) of the Income Tax Act."
      badge="Payment of Gratuity Act 1972 Statutory Schedule"
      calculatorGui={gui}
      formula="Gratuity = (15 × Last Drawn Basic Salary × Years of Service) / 26"
      variables={[
        { symbol: '15/26', name: 'Statutory Working Day Ratio', description: '15 days of salary calculated on a 26-working-day monthly divisor convention.' },
        { symbol: 'Basic + DA', name: 'Last Drawn Emoluments', description: 'Monthly Basic Salary plus Dearness Allowance without performance incentives.' },
        { symbol: 'Tenure', name: 'Completed Continuous Years', description: 'Total years of service (fractions over 6 months rounded up to the nearest year).' },
        { symbol: '₹20 Lakhs', name: 'Statutory Exemption Ceiling', description: 'Maximum tax-exempt gratuity limit applicable to private sector employees u/s 10(10).' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Provisions under Payment of Gratuity Act 1972',
        points: [
          'Under Section 4(1) of the Payment of Gratuity Act 1972, gratuity is payable to an employee on separation after rendering continuous service for not less than 5 years in an establishment.',
          'The 5-year requirement is waived in cases of termination due to death or permanent disablement under Section 4(1)(b).',
          'Under CBDT Notification and Section 10(10)(ii), the maximum lifetime tax exemption ceiling for gratuity received by private-sector employees stands at ₹20,00,000.'
        ]
      }}
      faqs={[
        {
          question: 'Is gratuity calculated on gross salary or basic salary?',
          answer: 'Statutory gratuity is strictly computed on the last drawn Basic Salary plus Dearness Allowance (DA). Special allowances, HRA, and discretionary bonuses are excluded from the calculation.'
        },
        {
          question: 'What happens if an employee works for 7 years and 7 months?',
          answer: 'Under the Payment of Gratuity Act, service exceeding 6 months in the final year is rounded up to the next full year. Thus, 7 years and 7 months is calculated as 8 years.'
        },
        {
          question: 'Can an employer pay more than the ₹20 Lakh statutory gratuity?',
          answer: 'Yes. An employer may pay an amount higher than the statutory calculation as an ex-gratia benefit; however, any amount exceeding the ₹20,00,000 threshold is taxable at individual slab rates.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
