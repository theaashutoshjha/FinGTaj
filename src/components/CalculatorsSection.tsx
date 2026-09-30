import React, { useState } from 'react';
import { Currency } from '../types';
import { 
  Calculator, 
  TrendingUp, 
  Home, 
  Flame, 
  Clock, 
  Percent, 
  ShieldCheck, 
  ArrowUpRight,
  PieChart
} from 'lucide-react';

interface CalculatorsSectionProps {
  currency: Currency;
  rateUSD: number;
}

export const CalculatorsSection: React.FC<CalculatorsSectionProps> = ({ currency, rateUSD }) => {
  const [activeCalc, setActiveCalc] = useState<string>('sip');

  // Format money helper
  const formatMoney = (inr: number) => {
    if (currency === 'USD') {
      const usd = Math.round(inr * rateUSD);
      return '$' + usd.toLocaleString('en-US');
    }
    return '₹' + inr.toLocaleString('en-IN');
  };

  // Calculator 1: SIP
  const [sipMonthly, setSipMonthly] = useState<number>(10000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(15);

  const calculateSIP = () => {
    const r = sipRate / 100 / 12;
    const n = sipYears * 12;
    const invested = sipMonthly * n;
    const total = sipMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return { invested: Math.round(invested), total: Math.round(total), gain: Math.round(total - invested) };
  };

  // Calculator 2: EMI & Prepayment
  const [loanPrincipal, setLoanPrincipal] = useState<number>(3500000);
  const [loanRate, setLoanRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [extraEmiAnnually, setExtraEmiAnnually] = useState<number>(1);

  const calculateEMI = () => {
    const r = loanRate / 100 / 12;
    const n = loanTenureYears * 12;
    const emi = (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const standardTotal = emi * n;
    const standardInterest = standardTotal - loanPrincipal;

    // Simulation with extra EMI
    let balance = loanPrincipal;
    let monthsElapsed = 0;
    let totalPaidExtra = 0;
    while (balance > 0 && monthsElapsed < 600) {
      monthsElapsed++;
      const interestMonth = balance * r;
      let principalMonth = emi - interestMonth;
      if (monthsElapsed % 12 === 0) {
        principalMonth += emi * extraEmiAnnually; // extra prepayment
      }
      balance -= principalMonth;
      totalPaidExtra += emi + (monthsElapsed % 12 === 0 ? emi * extraEmiAnnually : 0);
    }
    const savedInterest = Math.max(0, standardTotal - totalPaidExtra);
    const monthsSaved = Math.max(0, n - monthsElapsed);

    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(standardInterest),
      totalRepayment: Math.round(standardTotal),
      savedInterest: Math.round(savedInterest),
      yearsSaved: (monthsSaved / 12).toFixed(1)
    };
  };

  // Calculator 3: FIRE
  const [monthlyExpense, setMonthlyExpense] = useState<number>(60000);
  const [swr, setSwr] = useState<number>(4); // Safe withdrawal rate 4%
  const [currentInvestments, setCurrentInvestments] = useState<number>(1500000);
  const [monthlySaving, setMonthlySaving] = useState<number>(40000);

  const calculateFIRE = () => {
    const annualExpense = monthlyExpense * 12;
    const fireNumber = annualExpense / (swr / 100);
    const shortfall = Math.max(0, fireNumber - currentInvestments);
    // Years to FIRE assuming 10% CAGR
    let corpus = currentInvestments;
    let months = 0;
    const r = 0.10 / 12;
    while (corpus < fireNumber && months < 600) {
      months++;
      corpus = corpus * (1 + r) + monthlySaving;
    }
    return {
      fireNumber: Math.round(fireNumber),
      shortfall: Math.round(shortfall),
      yearsToFire: (months / 12).toFixed(1)
    };
  };

  // Calculator 4: Inflation
  const [currentAmount, setCurrentAmount] = useState<number>(100000);
  const [inflationRate, setInflationRate] = useState<number>(6.5);
  const [inflationYears, setInflationYears] = useState<number>(15);

  const calculateInflation = () => {
    const futureCost = currentAmount * Math.pow(1 + inflationRate / 100, inflationYears);
    const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, inflationYears);
    return { futureCost: Math.round(futureCost), purchasingPower: Math.round(purchasingPower) };
  };

  // Calculator 5: Step-Up SIP
  const [stepUpBase, setStepUpBase] = useState<number>(10000);
  const [stepUpRate, setStepUpRate] = useState<number>(10); // 10% increase every year
  const [stepUpReturn, setStepUpReturn] = useState<number>(12);
  const [stepUpYears, setStepUpYears] = useState<number>(15);

  const calculateStepUp = () => {
    let corpus = 0;
    let totalInvested = 0;
    let currentSip = stepUpBase;
    const r = stepUpReturn / 100 / 12;

    for (let y = 1; y <= stepUpYears; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentSip;
        corpus = (corpus + currentSip) * (1 + r);
      }
      currentSip += currentSip * (stepUpRate / 100);
    }
    return { invested: Math.round(totalInvested), corpus: Math.round(corpus), gain: Math.round(corpus - totalInvested) };
  };

  // Calculator 6: 50/30/20 Budget
  const [takeHomePay, setTakeHomePay] = useState<number>(120000);
  const calculateBudget = () => {
    const needs = takeHomePay * 0.5;
    const wants = takeHomePay * 0.3;
    const wealth = takeHomePay * 0.2;
    return {
      needs: Math.round(needs),
      wants: Math.round(wants),
      wealth: Math.round(wealth)
    };
  };

  const calcsNav = [
    { id: 'sip', name: 'SIP Compounding', icon: TrendingUp },
    { id: 'emi', name: 'Loan EMI & Prepay', icon: Home },
    { id: 'fire', name: 'FIRE Freedom Target', icon: Flame },
    { id: 'stepup', name: 'Step-Up 10% SIP', icon: ArrowUpRight },
    { id: 'inflation', name: 'Inflation Decay', icon: Clock },
    { id: 'budget', name: '50/30/20 Cashflow', icon: PieChart }
  ];

  const sipRes = calculateSIP();
  const emiRes = calculateEMI();
  const fireRes = calculateFIRE();
  const infRes = calculateInflation();
  const stepRes = calculateStepUp();
  const budRes = calculateBudget();

  return (
    <section style={{ padding: '60px 0' }} id="simulators">
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-emerald">
              <Calculator size={13} />
              Mathematical Simulators
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
            Institutional <span className="text-gradient">Financial Engines</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            High-precision, real-time mathematical formulas to stress-test your loans, investments, and retirement roadmap.
          </p>
        </div>

        {/* Calculator Tabs Navigation */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '36px'
        }}>
          {calcsNav.map(c => {
            const Icon = c.icon;
            const isActive = activeCalc === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCalc(c.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--gradient-brand)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#03080f' : 'var(--text-secondary)',
                  border: isActive ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? '0 0 20px rgba(0, 245, 255, 0.4)' : 'none'
                }}
              >
                <Icon size={15} />
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Active Calculator Card */}
        <div className="glass-panel" style={{ padding: '36px', maxWidth: '960px', margin: '0 auto' }}>
          
          {/* 1. SIP CALCULATOR */}
          {activeCalc === 'sip' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>SIP Wealth Compounding</h3>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Monthly Investment:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(sipMonthly)}</span>
                  </div>
                  <input type="range" min="1000" max="150000" step="1000" value={sipMonthly} onChange={e => setSipMonthly(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Expected Annual Return:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-emerald)' }}>{sipRate}%</span>
                  </div>
                  <input type="range" min="6" max="24" step="0.5" value={sipRate} onChange={e => setSipRate(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Time Horizon:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-amber)' }}>{sipYears} Years</span>
                  </div>
                  <input type="range" min="3" max="35" step="1" value={sipYears} onChange={e => setSipYears(Number(e.target.value))} className="slider-range" />
                </div>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Expected Corpus</div>
                  <div style={{ fontSize: '32px', fontWeight: 800 }} className="text-gradient text-mono">
                    {formatMoney(sipRes.total)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Invested Amount</div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }} className="text-mono">{formatMoney(sipRes.invested)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Estimated Wealth Gain</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)' }} className="text-mono">+{formatMoney(sipRes.gain)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EMI & PREPAYMENT CALCULATOR */}
          {activeCalc === 'emi' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Loan EMI &amp; 1-Extra-EMI Prepayment</h3>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Loan Principal:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(loanPrincipal)}</span>
                  </div>
                  <input type="range" min="500000" max="15000000" step="100000" value={loanPrincipal} onChange={e => setLoanPrincipal(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Interest Rate:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-amber)' }}>{loanRate}%</span>
                  </div>
                  <input type="range" min="6.5" max="15" step="0.1" value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Loan Tenure:</span>
                    <span className="text-mono">{loanTenureYears} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={loanTenureYears} onChange={e => setLoanTenureYears(Number(e.target.value))} className="slider-range" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Extra EMI Prepayment:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-emerald)' }}>{extraEmiAnnually} Extra / Year</span>
                  </div>
                  <input type="range" min="0" max="3" step="1" value={extraEmiAnnually} onChange={e => setExtraEmiAnnually(Number(e.target.value))} className="slider-range" />
                </div>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly EMI Payment</div>
                  <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent-cyan)' }} className="text-mono">
                    {formatMoney(emiRes.monthlyEMI)} / mo
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Standard Interest</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }} className="text-mono">{formatMoney(emiRes.totalInterest)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Interest Saved</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-emerald)' }} className="text-mono">
                      {formatMoney(emiRes.savedInterest)}
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    ⚡ Loan Compressed by {emiRes.yearsSaved} Years!
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Paying just {extraEmiAnnually} extra EMI annually hits principal directly.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. FIRE CALCULATOR */}
          {activeCalc === 'fire' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>FIRE Target (Financial Independence)</h3>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Monthly Living Expenses:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(monthlyExpense)}</span>
                  </div>
                  <input type="range" min="20000" max="300000" step="5000" value={monthlyExpense} onChange={e => setMonthlyExpense(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Current Net Worth:</span>
                    <span className="text-mono">{formatMoney(currentInvestments)}</span>
                  </div>
                  <input type="range" min="0" max="20000000" step="100000" value={currentInvestments} onChange={e => setCurrentInvestments(Number(e.target.value))} className="slider-range" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Monthly New Savings:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-emerald)' }}>{formatMoney(monthlySaving)}</span>
                  </div>
                  <input type="range" min="5000" max="200000" step="5000" value={monthlySaving} onChange={e => setMonthlySaving(Number(e.target.value))} className="slider-range" />
                </div>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target FIRE Freedom Corpus (25x Rule)</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-amber)' }} className="text-mono">
                    {formatMoney(fireRes.fireNumber)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Corpus Shortfall</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }} className="text-mono">{formatMoney(fireRes.shortfall)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>Estimated Horizon</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-cyan)' }} className="text-mono">{fireRes.yearsToFire} Years</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. STEP-UP SIP */}
          {activeCalc === 'stepup' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>10% Annual Step-Up Compounding</h3>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Starting Monthly SIP:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(stepUpBase)}</span>
                  </div>
                  <input type="range" min="2000" max="100000" step="1000" value={stepUpBase} onChange={e => setStepUpBase(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Annual Step-Up Rate:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-emerald)' }}>{stepUpRate}% / Year</span>
                  </div>
                  <input type="range" min="5" max="25" step="1" value={stepUpRate} onChange={e => setStepUpRate(Number(e.target.value))} className="slider-range" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Tenure:</span>
                    <span className="text-mono">{stepUpYears} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={stepUpYears} onChange={e => setStepUpYears(Number(e.target.value))} className="slider-range" />
                </div>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step-Up Terminal Wealth</div>
                  <div style={{ fontSize: '32px', fontWeight: 800 }} className="text-gradient text-mono">
                    {formatMoney(stepRes.corpus)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Outlay</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }} className="text-mono">{formatMoney(stepRes.invested)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Compound Gain</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-emerald)' }} className="text-mono">+{formatMoney(stepRes.gain)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. INFLATION DECAY */}
          {activeCalc === 'inflation' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Purchasing Power Degradation</h3>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Current Value:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(currentAmount)}</span>
                  </div>
                  <input type="range" min="10000" max="1000000" step="10000" value={currentAmount} onChange={e => setCurrentAmount(Number(e.target.value))} className="slider-range" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Annual Inflation:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-rose)' }}>{inflationRate}%</span>
                  </div>
                  <input type="range" min="4" max="12" step="0.5" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="slider-range" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Horizon:</span>
                    <span className="text-mono">{inflationYears} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={inflationYears} onChange={e => setInflationYears(Number(e.target.value))} className="slider-range" />
                </div>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Equivalent Future Cost Needed</div>
                  <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--accent-rose)' }} className="text-mono">
                    {formatMoney(infRes.futureCost)}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Purchasing Power of {formatMoney(currentAmount)} in {inflationYears} Years</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-secondary)' }} className="text-mono">
                    Only {formatMoney(infRes.purchasingPower)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. 50/30/20 CASHFLOW */}
          {activeCalc === 'budget' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>50/30/20 Cashflow Partitioning</h3>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span>Monthly Take-Home Income:</span>
                    <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(takeHomePay)}</span>
                  </div>
                  <input type="range" min="20000" max="500000" step="5000" value={takeHomePay} onChange={e => setTakeHomePay(Number(e.target.value))} className="slider-range" />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Automate your bank transfers on salary day: 50% into living expenses, 30% for guilt-free lifestyle, and 20% non-negotiably debited into compounding index assets.
                </p>
              </div>

              {/* Output Panel */}
              <div style={{
                background: 'rgba(4, 12, 22, 0.75)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)' }}>50% Essential Needs</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rent, Utilities, Food, EMI</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }} className="text-mono">{formatMoney(budRes.needs)}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-amber)' }}>30% Discretionary Wants</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dining, Travel, Gadgets</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }} className="text-mono">{formatMoney(budRes.wants)}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-emerald)' }}>20% Compounding Wealth</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Index Funds, Emergency Fund</div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-emerald)' }} className="text-mono">
                    {formatMoney(budRes.wealth)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
