import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';

export default function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState<number>(1000000);
  const [nominalReturn, setNominalReturn] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6.0);
  const [years, setYears] = useState<number>(15);

  // Fisher Equation Real Return: (1 + r_nom) / (1 + i) - 1
  const rNom = nominalReturn / 100;
  const i = inflationRate / 100;
  const realRate = (1 + rNom) / (1 + i) - 1;
  const realRatePct = (realRate * 100).toFixed(2);

  // Nominal Future Value
  const nominalValue = Math.round(initialAmount * Math.pow(1 + rNom, years));

  // Purchasing Power Adjusted Future Value (Real Wealth in Today's Rupees)
  const realPurchasingPower = Math.round(nominalValue / Math.pow(1 + i, years));

  // Cost of equivalent lifestyle today in future rupees
  const futureInflatedCost = Math.round(initialAmount * Math.pow(1 + i, years));

  const copyText = `Inflation-Adjusted Real Return Analysis:
Present Capital: ₹${initialAmount.toLocaleString('en-IN')}
Nominal Investment Return: ${nominalReturn}% p.a.
CPI Inflation Drag: ${inflationRate}% p.a.
Real Effective Net CAGR: ${realRatePct}% p.a.
Nominal Portfolio in ${years} Years: ₹${nominalValue.toLocaleString('en-IN')}
Real Purchasing Power (in Today's Money): ₹${realPurchasingPower.toLocaleString('en-IN')}
Calculated on FingTaj (https://www.fingtaj.com/inflation-adjusted-return-calculator)`;

  const gui = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="inf-amount" className="text-slate-300">Initial Capital Investment (₹)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">₹{initialAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            id="inf-amount"
            type="range"
            min="10000"
            max="10000000"
            step="50000"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="inf-nom-return" className="text-slate-300">Nominal Annual Portfolio Return (% p.a.)</label>
            <span className="text-emerald-400 font-mono text-base font-bold">{nominalReturn}%</span>
          </div>
          <input
            id="inf-nom-return"
            type="range"
            min="1"
            max="25"
            step="0.5"
            value={nominalReturn}
            onChange={(e) => setNominalReturn(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="inf-cpi" className="text-slate-300">Expected Annual CPI Inflation (% p.a.)</label>
            <span className="text-rose-400 font-mono text-base font-bold">{inflationRate}%</span>
          </div>
          <input
            id="inf-cpi"
            type="range"
            min="2"
            max="12"
            step="0.1"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400 py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <label htmlFor="inf-years" className="text-slate-300">Time Horizon (Years)</label>
            <span className="text-cyan-400 font-mono text-base font-bold">{years} Years</span>
          </div>
          <input
            id="inf-years"
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

      <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Real Purchasing Power in Today's ₹
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight mb-2">
            ₹{realPurchasingPower.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mb-4">
            Effective Real CAGR: <span className="font-mono font-bold text-emerald-400">{realRatePct}%</span> after inflation
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Nominal Future Portfolio:</span>
            <span className="font-mono font-semibold text-slate-200">₹{nominalValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Equivalent Inflated Cost:</span>
            <span className="font-mono font-semibold text-rose-400">₹{futureInflatedCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <span>Inflation Impact:</span>
            <span className="font-mono text-amber-400">Erodes {((1 - realPurchasingPower / nominalValue) * 100).toFixed(1)}% of nominal value</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title="Inflation-Adjusted Real Return & Purchasing Power Calculator"
      subtitle="Compute true real purchasing power by discounting nominal asset returns against Consumer Price Index (CPI) inflation using the exact Fisher Equation."
      badge="Fisher Equation Economic Modeling"
      calculatorGui={gui}
      formula="R_real = [(1 + R_nominal) / (1 + Inflation_Rate)] - 1"
      variables={[
        { symbol: 'R_real', name: 'Real Rate of Return', description: 'The net purchasing power growth rate of capital after stripping out inflationary depreciation.' },
        { symbol: 'R_nominal', name: 'Nominal Asset Return', description: 'The annualized headline percentage gain reported by bank deposits or equity indices.' },
        { symbol: 'Inflation_Rate', name: 'Annual Headline Inflation', description: 'Consumer Price Index (CPI) urban/rural weighted price inflation.' },
        { symbol: 'n', name: 'Investment Horizon in Years', description: 'Elapsed duration over which compounding inflation erodes nominal value.' }
      ]}
      statutoryNotes={{
        actTitle: 'Macroeconomic Inflation & RBI Monetary Policy Framework',
        points: [
          'Under the Reserve Bank of India Act 1934 (amended in 2016), the Monetary Policy Committee (MPC) operates under a statutory mandate to target Consumer Price Index (CPI) inflation at 4% with a tolerance band of +/- 2%.',
          'Fixed deposits yielding 7% nominal returns deliver zero or negative real returns for individuals in the 30% tax bracket when inflation hovers at 5.5% to 6%.',
          'Asset classes that historically exceed domestic CPI over 10-year holding periods include equity mutual funds, sovereign gold bonds (SGBs), and commercial real estate.'
        ]
      }}
      faqs={[
        {
          question: 'Why is simple subtraction (Nominal Rate - Inflation Rate) inaccurate?',
          answer: 'Simple subtraction produces an approximation. The Fisher Equation [R_real = (1 + R_nominal)/(1 + i) - 1] accounts for the compounding interplay between the returns earned and the inflated price base.'
        },
        {
          question: 'What is the Rule of 72 in context of inflation?',
          answer: 'Dividing 72 by the annual inflation rate indicates the exact number of years it takes for your currency purchasing power to be cut in half. At 6% inflation, purchasing power halves every 12 years.'
        },
        {
          question: 'How does inflation affect post-tax returns?',
          answer: 'Taxes in India are levied on nominal gains rather than real returns. An investor earning 7% in an FD with 6% inflation pays tax on the full 7%, rendering the real post-tax yield negative.'
        }
      ]}
      copySummaryText={copyText}
    />
  );
}
