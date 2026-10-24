import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function CapitalGainsCalculator() {
  const [salePrice, setSalePrice] = useState<number>(800000);
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [assetType, setAssetType] = useState<'equity' | 'real_estate'>('equity');
  const [holdingMonths, setHoldingMonths] = useState<number>(18);

  const gain = Math.max(0, salePrice - purchasePrice);

  let isLongTerm = false;
  let taxRate = 0;
  let exemption = 0;
  let taxableGain = 0;
  let taxLiability = 0;

  if (assetType === 'equity') {
    isLongTerm = holdingMonths > 12;
    if (isLongTerm) {
      taxRate = 12.5; // Finance Act Section 112A
      exemption = 125000; // ₹1.25L statutory annual exemption
      taxableGain = Math.max(0, gain - exemption);
      taxLiability = Math.round(taxableGain * 0.125);
    } else {
      taxRate = 20.0; // Section 111A
      exemption = 0;
      taxableGain = gain;
      taxLiability = Math.round(taxableGain * 0.20);
    }
  } else {
    // Real Estate / Other Assets
    isLongTerm = holdingMonths > 24;
    if (isLongTerm) {
      taxRate = 12.5; // New flat rate without indexation under Section 112
      exemption = 0;
      taxableGain = gain;
      taxLiability = Math.round(taxableGain * 0.125);
    } else {
      taxRate = 30.0; // Slab rates (estimated standard)
      exemption = 0;
      taxableGain = gain;
      taxLiability = Math.round(taxableGain * 0.30);
    }
  }

  const cess = Math.round(taxLiability * 0.04);
  const totalTax = taxLiability + cess;

  const copyText = `Capital Gains Tax Computation:
Asset Classification: ${assetType === 'equity' ? 'Listed Equity / Equity Fund' : 'Real Estate'}
Acquisition Cost: ₹${purchasePrice.toLocaleString('en-IN')}
Disposal / Sale Consideration: ₹${salePrice.toLocaleString('en-IN')}
Net Capital Gain: ₹${gain.toLocaleString('en-IN')}
Holding Horizon: ${holdingMonths} Months (${isLongTerm ? 'Long-Term Capital Gain' : 'Short-Term Capital Gain'})
Applicable Statutory Tax Rate: ${taxRate}% + 4% Cess
Exemption u/s 112A: ₹${exemption.toLocaleString('en-IN')}
Total Capital Gains Tax Payable: ₹${totalTax.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/capital-gains-tax-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Asset Category</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="equity">Listed Equities / Mutual Funds</option>
              <option value="real_estate">Real Estate / Immovable Property</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Holding Period (Months)</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="240"
              value={holdingMonths}
              onChange={(e) => setHoldingMonths(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="cg-sale" className="text-slate-300">Sale Proceeds / Consideration (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{salePrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="cg-sale"
            type="range"
            min="10000"
            max="20000000"
            step="10000"
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="cg-buy" className="text-slate-300">Purchase / Acquisition Cost (₹)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">₹{purchasePrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="cg-buy"
            type="range"
            min="10000"
            max="15000000"
            step="10000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
        </div>
      </div>

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Total Tax Payable (inc. 4% Cess)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-2">
            ₹{totalTax.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mb-4">
            Classification: <span className="font-semibold text-emerald-400">{isLongTerm ? 'Long-Term (LTCG)' : 'Short-Term (STCG)'}</span> at {taxRate}%
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Net Gain:</span>
            <span className="font-mono font-semibold text-slate-200">₹{gain.toLocaleString('en-IN')}</span>
          </div>
          {exemption > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Section 112A Exemption:</span>
              <span className="font-mono font-semibold text-emerald-400">-₹{Math.min(gain, exemption).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>Statutory Schedule:</span>
            <span className="font-mono text-cyan-400">{isLongTerm ? 'Section 112A' : 'Section 111A'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Capital Gains Tax Calculator (Section 112A & 111A)"
      subtitle="Compute Long-Term and Short-Term Capital Gains tax on Indian equities, mutual funds, and real estate incorporating the latest statutory tax rates."
      badge="Finance Act Capital Gains Schedules"
      calculatorGui={gui}
      formula="Capital Gains Tax = (Net Gain - Statutory Exemption) × Applicable Tax Rate + 4% Cess"
      variables={[
        { symbol: 'Net Gain', name: 'Capital Gain', description: 'Full value of sale consideration minus acquisition cost and transfer expenses.' },
        { symbol: '12.5%', name: 'LTCG Statutory Rate', description: 'Applicable on equity gains held over 12 months and real estate held over 24 months.' },
        { symbol: '20%', name: 'STCG Equity Rate', description: 'Statutory tax rate for listed equity and equity funds held for 12 months or less u/s 111A.' },
        { symbol: '₹1,25,000', name: 'Annual LTCG Exemption', description: 'Statutory threshold exempt from taxation under Section 112A for equity capital gains.' }
      ]}
      statutoryNotes={{
        actTitle: 'Statutory Provisions under Finance Act Revisions (Sections 112A, 111A & 112)',
        points: [
          'Under Section 112A of the Income Tax Act 1961, LTCG on listed equities and equity-oriented mutual funds is taxed at 12.5% on profits exceeding ₹1,25,000 in a financial year.',
          'Under Section 111A, Short-Term Capital Gains (STCG) on equity instruments subjected to Securities Transaction Tax (STT) are taxed at 20%.',
          'For immovable real property held for more than 24 months, long-term capital gains are taxed at 12.5% without indexation under the amended Section 112.'
        ]
      }}
      faqs={[
        {
          question: 'What is the revised annual exemption under Section 112A?',
          answer: 'The annual tax exemption threshold on long-term capital gains from equity mutual funds and listed shares stands at ₹1,25,000 per financial year (increased from the earlier ₹1,00,000 limit).'
        },
        {
          question: 'What is the holding period threshold for listed shares versus real estate?',
          answer: 'Listed equities and equity mutual funds qualify for long-term treatment after 12 months. Real estate property qualifies for long-term status after 24 months of continuous ownership.'
        },
        {
          question: 'Can short-term capital losses be set off against long-term capital gains?',
          answer: 'Yes. Under Section 70, short-term capital losses can be set off against both short-term and long-term capital gains. However, long-term capital losses can only be set off against long-term gains.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
