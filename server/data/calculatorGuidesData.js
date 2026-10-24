export const CALCULATOR_GUIDES = {
  sip: {
    id: 'sip',
    title: 'Systematic Investment Plan (SIP) Compounding Guide & Mathematical Modeler',
    subtitle: 'Understand geometric capital compounding, rupee-cost averaging, expense ratio drag, and LTCG tax optimizations over multi-decade horizons.',
    metaDescription: 'Use our SIP Compounding Calculator with explicit geometric formulas, worked scenario comparison tables, LTCG tax rules under Section 112A, and portfolio compounding insights.',
    formula: 'M = P * [((1 + i)^n - 1) / i] * (1 + i)',
    formulaVariables: [
      { symbol: 'M', meaning: 'Terminal Maturity Corpus', explanation: 'The final accumulated wealth including both principal contributions and accrued compound returns.' },
      { symbol: 'P', meaning: 'Periodic Monthly Contribution', explanation: 'The fixed capital sum debited systematically into broad-market index funds each month.' },
      { symbol: 'i', meaning: 'Compounded Periodic Return', explanation: 'The nominal annualized expected CAGR divided by 12 (i = Annual Rate / 12 / 100).' },
      { symbol: 'n', meaning: 'Total Number of Installments', explanation: 'Total compounding cycles (n = Investment Horizon in Years * 12).' }
    ],
    scenarios: [
      {
        name: 'Conservative Growth (Debt/Large-Cap Blend)',
        rateOrTenure: '9.0% CAGR',
        monthlyOrPrincipal: '₹10,000 / mo',
        duration: '15 Years (180 mo)',
        estimatedReturnOrInterest: '₹19,85,711 gain',
        netMaturityOrTotal: '₹37,85,711'
      },
      {
        name: 'Moderate Index Growth (Nifty 50 TRI Historical)',
        rateOrTenure: '12.0% CAGR',
        monthlyOrPrincipal: '₹10,000 / mo',
        duration: '15 Years (180 mo)',
        estimatedReturnOrInterest: '₹32,45,760 gain',
        netMaturityOrTotal: '₹50,45,760'
      },
      {
        name: 'Aggressive Allocation (Mid/Small-Cap Tilt)',
        rateOrTenure: '14.5% CAGR',
        monthlyOrPrincipal: '₹10,000 / mo',
        duration: '15 Years (180 mo)',
        estimatedReturnOrInterest: '₹47,81,220 gain',
        netMaturityOrTotal: '₹65,81,220'
      }
    ],
    scenarioNotes: 'Assumes strict monthly reinvestment without dividend payout. Taxes under Section 112A and asset management fees (TER) are accounted for separately in portfolio analysis.',
    strategicAnalysis: [
      {
        heading: '1. The Mechanics of Rupee-Cost Averaging (RCA)',
        paragraphs: [
          'A Systematic Investment Plan mitigates timing risk by acquiring more mutual fund units when Net Asset Values (NAV) decline and fewer units during market peaks. Over multi-year economic cycles, this dollar-cost averaging lowers the mean purchase price relative to lump-sum deployments.',
          'Mathematical simulations indicate that over rolling 7-to-10-year windows in Indian equity benchmarks (such as the NIFTY 50 and S&P BSE Sensex), the probability of negative annualized returns from systematic investments drops to under 1%.'
        ]
      },
      {
        heading: '2. Indian Capital Gains Tax Framework (CBDT Section 112A & 111A)',
        paragraphs: [
          'Under Finance Act amendments, Long-Term Capital Gains (LTCG) on equity-oriented mutual funds held for longer than 12 months are taxed at 12.5% on profits exceeding ₹1.25 lakh in a fiscal year (previously 10% above ₹1 lakh under Section 112A).',
          'Short-Term Capital Gains (STCG) on equity funds redeemed before 365 days are taxed at a flat rate of 20% plus applicable surcharge and cess under Section 111A.',
          'Investors should factor in this tax liability when modeling terminal corpus goals. Regular withdrawals via Systematic Withdrawal Plans (SWP) can assist in utilizing the annual tax-exempt threshold effectively.'
        ]
      },
      {
        heading: '3. Real vs. Nominal Returns: Overcoming Inflation Drag',
        paragraphs: [
          'While a nominal CAGR of 12% compounds ₹10,000 per month into over ₹50 lakh in 15 years, real purchasing power must be discounted against the Consumer Price Index (CPI). With long-term urban inflation averaging 5.5% to 6.0%, the net real return approximates 6% to 6.5%.',
          'To offset inflation erosion, financial planners recommend pairing baseline SIPs with annual Step-Up increments matching salary increments (typically 10% per annum).'
        ]
      }
    ],
    faqs: [
      {
        question: 'How is SIP compounding calculated mathematically?',
        answer: 'SIP returns are calculated using the Future Value of an Annuity Due formula: M = P * [((1 + i)^n - 1) / i] * (1 + i), where P is the periodic payment, i is the periodic interest rate (annual return / 12), and n is the total number of monthly payments.'
      },
      {
        question: 'What is the current Long-Term Capital Gains (LTCG) tax on equity mutual funds?',
        answer: 'Long-Term Capital Gains exceeding ₹1,25,000 in a financial year are taxed at 12.5% without indexation benefits for equity funds held for more than 12 months under Section 112A.'
      },
      {
        question: 'Is SIP better than a lump-sum mutual fund investment?',
        answer: 'SIP is mathematically superior for volatile markets as it leverages Rupee-Cost Averaging, removing emotional market timing. Lump-sum investments can generate higher returns during strong secular bull runs but carry substantially higher downside drawdowns if invested at cyclical peaks.'
      },
      {
        question: 'Does the calculator account for Expense Ratio (TER)?',
        answer: 'Calculators project gross CAGR. Active mutual funds charge a Total Expense Ratio between 0.5% and 2.2% annually, whereas direct index funds generally charge between 0.05% and 0.20%. Direct index funds preserve significantly more capital over a 20-year horizon.'
      }
    ],
    disclaimer: 'Educational research and mathematical modeling tool only. Not registered under SEBI as an investment adviser. Calculations represent mathematical equations, not guaranteed market returns.'
  },
  emi: {
    id: 'emi',
    title: 'Loan EMI Amortization & Accelerated Prepayment Architecture',
    subtitle: 'Deconstruct reducing balance interest, front-loaded interest drag, and calculate interest saved via systematic principal prepayments.',
    metaDescription: 'Calculate equated monthly installments (EMI), amortization schedules, and evaluate prepayment strategies to save lakhs in interest on home loans.',
    formula: 'EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]',
    formulaVariables: [
      { symbol: 'EMI', meaning: 'Equated Monthly Installment', explanation: 'Fixed monthly sum paid towards amortizing principal and accrued reducing interest.' },
      { symbol: 'P', meaning: 'Principal Loan Amount', explanation: 'Total borrowed sum disbursed by the financial institution or housing finance company.' },
      { symbol: 'r', meaning: 'Monthly Interest Rate', explanation: 'Annualized percentage rate (APR) divided by 12 months and 100 (r = Annual Rate / 12 / 100).' },
      { symbol: 'n', meaning: 'Total Loan Tenure in Months', explanation: 'Total amortization periods across the facility (Years * 12).' }
    ],
    scenarios: [
      {
        name: 'Standard 20-Year Home Loan (Baseline)',
        rateOrTenure: '8.75% p.a.',
        monthlyOrPrincipal: '₹50,00,000 loan',
        duration: '240 Months (20 Yrs)',
        estimatedReturnOrInterest: '₹55,58,825 total interest',
        netMaturityOrTotal: '₹1,05,58,825 repaid'
      },
      {
        name: 'Accelerated 15-Year Home Loan',
        rateOrTenure: '8.75% p.a.',
        monthlyOrPrincipal: '₹50,00,000 loan',
        duration: '180 Months (15 Yrs)',
        estimatedReturnOrInterest: '₹39,97,556 total interest',
        netMaturityOrTotal: '₹89,97,556 repaid'
      },
      {
        name: 'Systematic 1 Extra EMI / Year Strategy',
        rateOrTenure: '8.75% p.a.',
        monthlyOrPrincipal: '₹50,00,000 loan',
        duration: '168 Months (~14 Yrs)',
        estimatedReturnOrInterest: '₹36,12,400 total interest',
        netMaturityOrTotal: '₹19,46,425 saved'
      }
    ],
    scenarioNotes: 'Based on reducing-balance amortization standard across Indian public and private scheduled commercial banks governed by RBI Repo Linked Lending Rate (RLLR).',
    strategicAnalysis: [
      {
        heading: '1. The Front-Loaded Amortization Trap',
        paragraphs: [
          'Under standard reducing-balance amortization schedules, interest charges are front-loaded. During the initial 5 to 7 years of a 20-year home loan, up to 75% of each monthly EMI goes towards servicing interest, while only 25% reduces principal.',
          'Making prepayments directly against the principal during this early window creates exponential interest savings because every rupee prepaid immediately lowers the base on which subsequent compound interest is calculated.'
        ]
      },
      {
        heading: '2. Prepayment vs. Equity SIP Arbitrage',
        paragraphs: [
          'Borrowers frequently debate whether to prepay a home loan carrying an 8.5%–9.0% interest rate or deploy surplus capital into equity mutual funds generating 12% CAGR.',
          'Prepaying debt delivers a guaranteed, risk-free, post-tax return equal to the loan interest rate. In contrast, equities carry volatility and capital gains tax liabilities. A balanced strategy is paying one extra EMI per year while maintaining a parallel equity SIP.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How is reducing balance EMI calculated?',
        answer: 'EMI is computed using the formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]. Each month, interest is calculated solely on the outstanding principal balance.'
      },
      {
        question: 'Are there prepayment penalties on home loans in India?',
        answer: 'Under RBI regulations, banks and Housing Finance Companies (HFCs) cannot charge prepayment penalties or foreclosure fees on floating-rate home loans sanctioned to individual borrowers.'
      },
      {
        question: 'What is the most effective loan prepayment strategy?',
        answer: 'Paying one extra EMI per year or increasing your monthly EMI by 5% annually can shorten a 20-year loan tenure by 5 to 7 years, saving up to 30% of total payable interest.'
      }
    ],
    disclaimer: 'Educational research and loan modeling tool only. Consult your lending institution for exact amortization schedules, processing fees, and prevailing interest rate benchmarks.'
  },
  fire: {
    id: 'fire',
    title: 'Financial Independence, Retire Early (FIRE) Target Engine',
    subtitle: 'Calculate your exact retirement corpus multiple, Safe Withdrawal Rate (SWR), and target asset allocation for perpetual financial freedom.',
    metaDescription: 'Determine your FIRE number, annual retirement cash flows, Safe Withdrawal Rate (SWR) under Indian inflation, and sustainable retirement assets.',
    formula: 'FIRE Corpus = Annual Living Expenses / SWR = Annual Expenses * 25 (or 33.3)',
    formulaVariables: [
      { symbol: 'Target Corpus', meaning: 'FIRE Target Wealth', explanation: 'Total invested liquid assets required to fund retirement living expenses indefinitely.' },
      { symbol: 'Expenses', meaning: 'Annual Household Spend', explanation: 'Annualized living expenses adjusted for post-retirement health, insurance, and lifestyle needs.' },
      { symbol: 'SWR', meaning: 'Safe Withdrawal Rate', explanation: 'Percentage withdrawn annually adjusted for inflation without depleting principal (commonly 3% to 4%).' }
    ],
    scenarios: [
      {
        name: 'Standard FIRE (4.0% SWR / 25x Multiplier)',
        rateOrTenure: '4.0% SWR',
        monthlyOrPrincipal: '₹1,00,000 / mo spend',
        duration: 'Perpetual',
        estimatedReturnOrInterest: '₹12,00,000 / yr withdrawal',
        netMaturityOrTotal: '₹3,00,00,000 target corpus'
      },
      {
        name: 'Conservative India FIRE (3.33% SWR / 30x Multiplier)',
        rateOrTenure: '3.33% SWR',
        monthlyOrPrincipal: '₹1,00,000 / mo spend',
        duration: 'Perpetual',
        estimatedReturnOrInterest: '₹12,00,000 / yr withdrawal',
        netMaturityOrTotal: '₹3,60,00,000 target corpus'
      },
      {
        name: 'Fat FIRE (2.85% SWR / 35x Multiplier for High Inflation)',
        rateOrTenure: '2.85% SWR',
        monthlyOrPrincipal: '₹1,50,000 / mo spend',
        duration: 'Perpetual',
        estimatedReturnOrInterest: '₹18,00,000 / yr withdrawal',
        netMaturityOrTotal: '₹6,30,00,000 target corpus'
      }
    ],
    scenarioNotes: 'In developing economies like India where healthcare and education inflation averages 8%-10%, financial planners recommend a 3.0%-3.3% SWR (30x-33x multiplier) rather than the Western 4% rule.',
    strategicAnalysis: [
      {
        heading: '1. Why the Western 4% Trinity Study Rule Needs Adjustment for India',
        paragraphs: [
          'The 4% rule originated from the US Trinity Study based on historical US market returns and 2%-3% inflation. In India, retail CPI inflation averages 5%-7%, while medical inflation can reach double digits.',
          'A Safe Withdrawal Rate of 3.0% to 3.3% (a 30x to 33x expense multiple) offers significantly greater survivability against sequence-of-returns risk.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the FIRE number and how is it calculated?',
        answer: 'The FIRE number is your annual living expenses divided by your Safe Withdrawal Rate (SWR). For a 3.33% SWR, multiply annual expenses by 30.'
      },
      {
        question: 'What is sequence-of-returns risk?',
        answer: 'Sequence-of-returns risk refers to experiencing negative market returns in the first few years of retirement. Liquidating portfolio units during market drawdowns permanently erodes capital longevity.'
      }
    ],
    disclaimer: 'Educational research model. Portfolio longevity depends on asset allocation, inflation volatility, and tax liabilities.'
  },
  'step-up': {
    id: 'step-up',
    title: 'Step-Up SIP Accelerator & Annual Increment Compounding',
    subtitle: 'Model the compounding impact of increasing your monthly mutual fund investments by 5% to 15% annually alongside career salary increments.',
    metaDescription: 'Step-Up SIP Calculator: Discover how annual investment increments dramatically accelerate wealth creation compared to fixed SIPs.',
    formula: 'Corpus = Sum over t=1..Y of [ P * (1 + g)^(t-1) * ((1 + i)^(12*(Y-t+1)) - 1) / i ]',
    formulaVariables: [
      { symbol: 'P', meaning: 'Initial Monthly Investment', explanation: 'Base monthly SIP amount in Year 1.' },
      { symbol: 'g', meaning: 'Annual Step-Up Rate', explanation: 'Annual percentage increase in monthly contribution (typically 5% to 15%).' },
      { symbol: 'i', meaning: 'Monthly Return Rate', explanation: 'Annualized expected CAGR divided by 12.' },
      { symbol: 'Y', meaning: 'Total Investment Years', explanation: 'Total time horizon of systematic contributions.' }
    ],
    scenarios: [
      {
        name: 'Fixed ₹15,000 SIP (0% Step-Up Baseline)',
        rateOrTenure: '12.0% CAGR',
        monthlyOrPrincipal: '₹15,000 / mo fixed',
        duration: '20 Years',
        estimatedReturnOrInterest: '₹1,13,87,273 gain',
        netMaturityOrTotal: '₹1,49,87,273'
      },
      {
        name: '10% Annual Step-Up SIP',
        rateOrTenure: '12.0% CAGR',
        monthlyOrPrincipal: '₹15,000 / mo + 10%/yr',
        duration: '20 Years',
        estimatedReturnOrInterest: '₹2,69,45,210 gain',
        netMaturityOrTotal: '₹3,72,55,210'
      },
      {
        name: '15% Aggressive Step-Up SIP',
        rateOrTenure: '12.0% CAGR',
        monthlyOrPrincipal: '₹15,000 / mo + 15%/yr',
        duration: '20 Years',
        estimatedReturnOrInterest: '₹4,32,18,900 gain',
        netMaturityOrTotal: '₹5,78,18,900'
      }
    ],
    scenarioNotes: 'A 10% annual step-up more than doubles the terminal wealth compared to a fixed monthly SIP over a 20-year horizon.',
    strategicAnalysis: [
      {
        heading: '1. Overcoming Lifestyle Inflation with Systematic Step-Ups',
        paragraphs: [
          'As professionals advance in their careers, salary increments often lead to lifestyle creep rather than increased savings. Implementing an automated 10% step-up ensures income growth translates directly into wealth accumulation.',
          'Over a 20-year horizon, an investor deploying a 10% annual step-up accumulates 2.5x more wealth than one maintaining a flat monthly commitment.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is a Step-Up SIP?',
        answer: 'A Step-Up (top-up) SIP is an automated feature where your monthly investment contribution increases by a predetermined percentage or fixed sum each year.'
      },
      {
        question: 'How much should I step up my SIP each year?',
        answer: 'Most financial advisors recommend matching your annual salary hike, typically 10% per year, which significantly outpaces inflation.'
      }
    ],
    disclaimer: 'Educational computational model. Actual market returns fluctuate over economic cycles.'
  },
  budget: {
    id: 'budget',
    title: '50/30/20 Budgeting Rule & Cash Flow Architecture',
    subtitle: 'Systematize net income into 50% essential needs, 30% lifestyle wants, and 20% compounding investments for sustained wealth building.',
    metaDescription: 'Calculate your personalized 50/30/20 budget framework. Divide net monthly income into needs, wants, and savings buckets.',
    formula: 'Needs = Net * 0.50 | Wants = Net * 0.30 | Wealth = Net * 0.20',
    formulaVariables: [
      { symbol: 'Net', meaning: 'In-Hand Monthly Income', explanation: 'Total take-home salary after statutory tax deductions (TDS, PF).' },
      { symbol: 'Needs (50%)', meaning: 'Inflexible Living Costs', explanation: 'Rent, groceries, utilities, loan EMIs, and essential insurance.' },
      { symbol: 'Wants (30%)', meaning: 'Discretionary Lifestyle', explanation: 'Dining, leisure, entertainment, vacations, and subscriptions.' },
      { symbol: 'Wealth (20%)', meaning: 'Compounding Assets', explanation: 'Equity index funds, emergency reserve, and debt acceleration.' }
    ],
    scenarios: [
      {
        name: 'Entry-Level Professional (₹40,000 Net)',
        rateOrTenure: '50/30/20 Split',
        monthlyOrPrincipal: '₹40,000 / month',
        duration: 'Monthly Cash Flow',
        estimatedReturnOrInterest: 'Needs: ₹20k | Wants: ₹12k',
        netMaturityOrTotal: '₹8,000 / mo to Wealth'
      },
      {
        name: 'Mid-Career Professional (₹1,00,000 Net)',
        rateOrTenure: '50/30/20 Split',
        monthlyOrPrincipal: '₹1,00,000 / month',
        duration: 'Monthly Cash Flow',
        estimatedReturnOrInterest: 'Needs: ₹50k | Wants: ₹30k',
        netMaturityOrTotal: '₹20,000 / mo to Wealth'
      },
      {
        name: 'High-Earner / FIRE Accelerator (₹2,50,000 Net)',
        rateOrTenure: '40/20/40 Aggressive Split',
        monthlyOrPrincipal: '₹2,50,000 / month',
        duration: 'Monthly Cash Flow',
        estimatedReturnOrInterest: 'Needs: ₹1,00,000 | Wants: ₹50k',
        netMaturityOrTotal: '₹1,00,000 / mo to Wealth'
      }
    ],
    scenarioNotes: 'High earners can adjust the 50/30/20 model into an aggressive 40/20/40 framework to accelerate retirement timelines.',
    strategicAnalysis: [
      {
        heading: '1. Implementing the Pay-Yourself-First Principle',
        paragraphs: [
          'The primary reason households fail to build investment assets is saving whatever remains at month-end. The 50/30/20 framework enforces routing 20% into investments on salary day before allocating for discretionary wants.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the 50/30/20 rule?',
        answer: 'It is a personal finance guideline that allocates 50% of after-tax income to survival needs, 30% to discretionary wants, and 20% to debt elimination and investments.'
      }
    ],
    disclaimer: 'Educational budgeting framework. Personal cash flow needs vary with family structure and dependents.'
  },
  inflation: {
    id: 'inflation',
    title: 'Purchasing Power Decay & Inflation Impact Modeler',
    subtitle: 'Measure how inflation erodes stagnant fiat cash and determine the compounding return required to preserve real wealth.',
    metaDescription: 'Calculate the future cost of goods and the purchasing power erosion of cash over time due to inflation compounding.',
    formula: 'Future Cost = Present * (1 + r)^t | Purchasing Power = Present / (1 + r)^t',
    formulaVariables: [
      { symbol: 'Future Cost', meaning: 'Inflated Price', explanation: 'The capital required in the future to purchase equivalent goods today.' },
      { symbol: 'Purchasing Power', meaning: 'Real Buying Power', explanation: 'The real value of fixed cash after inflation erosion.' },
      { symbol: 'r', meaning: 'Annual Inflation Rate', explanation: 'Annualized CPI rate (typically 5.5% to 7.0% in India).' },
      { symbol: 't', meaning: 'Time Horizon in Years', explanation: 'Elapsed duration in years.' }
    ],
    scenarios: [
      {
        name: '10-Year Horizon at 6.0% CPI Inflation',
        rateOrTenure: '6.0% Inflation',
        monthlyOrPrincipal: '₹1,00,000 base',
        duration: '10 Years',
        estimatedReturnOrInterest: 'Future cost: ₹1,79,085',
        netMaturityOrTotal: 'Purchasing power drops to ₹55,839'
      },
      {
        name: '20-Year Horizon at 6.0% CPI Inflation',
        rateOrTenure: '6.0% Inflation',
        monthlyOrPrincipal: '₹1,00,000 base',
        duration: '20 Years',
        estimatedReturnOrInterest: 'Future cost: ₹3,20,714',
        netMaturityOrTotal: 'Purchasing power drops to ₹31,180'
      },
      {
        name: '25-Year Horizon at 7.0% Higher Education / Health Inflation',
        rateOrTenure: '7.0% Inflation',
        monthlyOrPrincipal: '₹10,00,000 base',
        duration: '25 Years',
        estimatedReturnOrInterest: 'Future cost: ₹54,27,433',
        netMaturityOrTotal: 'Purchasing power drops to ₹18,425'
      }
    ],
    scenarioNotes: 'Fixed deposits yielding 7% generate nominal returns that often equate to near-zero or negative real returns after accounting for income tax and inflation.',
    strategicAnalysis: [
      {
        heading: '1. The Silent Tax: Why Cash Loses 50% of Value in 12 Years',
        paragraphs: [
          'Under the Rule of 72, an annual inflation rate of 6% halves the purchasing power of uninvested currency every 12 years. Holding substantial wealth in savings bank accounts guarantees purchasing power erosion.',
          'Beating inflation requires allocating growth assets to equity mutual funds, sovereign gold bonds, and indexed instruments yielding higher than headline CPI.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How does inflation reduce purchasing power?',
        answer: 'Inflation increases the general price level of goods and services, meaning each unit of currency buys fewer goods over time according to the formula: Purchasing Power = Present Amount / (1 + r)^t.'
      }
    ],
    disclaimer: 'Educational research model. Inflation rates vary across expenditure categories.'
  },
  'income-tax': {
    id: 'income-tax',
    title: 'Income Tax Calculator (Section 115BAC vs Old Regime)',
    subtitle: 'Compare statutory liabilities under the default New Tax Regime (Section 115BAC) and the Old Tax Regime with standard deduction & Chapter VI-A.',
    metaDescription: 'Calculate and compare your income tax under the New and Old Tax Regimes for FY 2025-26 / 2026-27 with ₹75,000 standard deduction.',
    formula: 'Tax = Slab Rates + 4% Health & Education Cess - Section 87A Rebate',
    formulaVariables: [
      { symbol: 'Gross', meaning: 'Gross Annual Remuneration', explanation: 'Total salary before statutory deductions and Chapter VI-A allowances.' },
      { symbol: 'Std Ded', meaning: 'Standard Deduction', explanation: '₹75,000 statutory deduction under Section 115BAC, ₹50,000 under Old Regime.' },
      { symbol: 'Rebate', meaning: 'Section 87A Tax Rebate', explanation: 'Full rebate rendering taxable income up to ₹7,00,000 tax-free under New Regime.' },
      { symbol: 'Cess', meaning: 'Health & Education Cess', explanation: 'Statutory 4% levy on aggregated income tax liability.' }
    ],
    scenarios: [
      {
        name: 'Entry Professional (₹7.5L Gross)',
        rateOrTenure: 'New Regime (115BAC)',
        monthlyOrPrincipal: '₹7,50,000 Gross',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Taxable: ₹6,75,000',
        netMaturityOrTotal: '₹0 Tax (87A Rebate)'
      },
      {
        name: 'Mid-Career Professional (₹15L Gross)',
        rateOrTenure: 'New Regime (115BAC)',
        monthlyOrPrincipal: '₹15,00,000 Gross',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Std Ded: ₹75,000',
        netMaturityOrTotal: '₹1,45,600 Tax'
      },
      {
        name: 'Senior Executive (₹25L Gross)',
        rateOrTenure: 'New Regime (115BAC)',
        monthlyOrPrincipal: '₹25,00,000 Gross',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Std Ded: ₹75,000',
        netMaturityOrTotal: '₹4,44,600 Tax'
      }
    ],
    scenarioNotes: 'Incorporates the enhanced ₹75,000 standard deduction and Section 87A rebate thresholds under the Finance Act.',
    strategicAnalysis: [
      {
        heading: '1. New vs. Old Tax Regime Breakeven Threshold',
        paragraphs: [
          'Under the Finance Act revisions, the New Tax Regime (Section 115BAC) features simplified lower slab rates and an enhanced ₹75,000 standard deduction. For most salaried professionals, unless total deductions (80C, 80D, HRA, home loan interest) exceed ₹3,75,000 to ₹4,00,000, Section 115BAC yields lower tax liability.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the standard deduction under Section 115BAC?',
        answer: 'The standard deduction under the New Tax Regime is ₹75,000 for salaried employees and pensioners.'
      },
      {
        question: 'Is HRA exemption available under the New Tax Regime?',
        answer: 'No. HRA exemptions under Section 10(13A) are available only when opting for the Old Tax Regime.'
      }
    ],
    disclaimer: 'Educational tax computation tool only. Verify individual assessments with a certified Chartered Accountant.'
  },
  ppf: {
    id: 'ppf',
    title: 'Public Provident Fund (PPF) Scheme Calculator',
    subtitle: 'Compute sovereign annual compounding returns, 15-year statutory lock-in yields, and tax-free interest under EEE status.',
    metaDescription: 'Calculate Public Provident Fund (PPF) maturity amounts, annual interest compounding at 7.1%, and tax-free EEE benefits.',
    formula: 'F = P * [((1 + i)^n - 1) / i] * (1 + i)',
    formulaVariables: [
      { symbol: 'F', meaning: 'Maturity Corpus', explanation: 'Total accumulated tax-free sum at the end of the 15-year tenure.' },
      { symbol: 'P', meaning: 'Annual Deposit', explanation: 'Statutory subscription (Min ₹500, Max ₹1,50,000 per financial year).' },
      { symbol: 'i', meaning: 'Sovereign Interest Rate', explanation: 'Government notified interest rate (currently 7.1% p.a.).' },
      { symbol: 'n', meaning: 'Tenure in Years', explanation: '15-year statutory minimum lock-in period.' }
    ],
    scenarios: [
      {
        name: 'Maximum Subscription (₹1.5L / Year)',
        rateOrTenure: '7.1% Sovereign Rate',
        monthlyOrPrincipal: '₹1,50,000 / year',
        duration: '15 Years',
        estimatedReturnOrInterest: '₹18,18,209 interest',
        netMaturityOrTotal: '₹40,68,209 Tax-Free'
      },
      {
        name: '20-Year Extended Block (₹1.5L / Year)',
        rateOrTenure: '7.1% Sovereign Rate',
        monthlyOrPrincipal: '₹1,50,000 / year',
        duration: '20 Years',
        estimatedReturnOrInterest: '₹36,58,288 interest',
        netMaturityOrTotal: '₹66,58,288 Tax-Free'
      },
      {
        name: 'Moderate Subscription (₹50,000 / Year)',
        rateOrTenure: '7.1% Sovereign Rate',
        monthlyOrPrincipal: '₹50,000 / year',
        duration: '15 Years',
        estimatedReturnOrInterest: '₹6,06,070 interest',
        netMaturityOrTotal: '₹13,56,070 Tax-Free'
      }
    ],
    scenarioNotes: 'Assumes deposits made on or before 5th of April each fiscal year to maximize annual compound interest.',
    strategicAnalysis: [
      {
        heading: '1. Sovereign Protection and EEE Status',
        paragraphs: [
          'PPF balances are backed by the sovereign guarantee of the Government of India and cannot be attached by court decrees under Section 15 of the Government Savings Promotion Act. All interest and maturity amounts are 100% tax-free under Section 10(11).'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the optimum date to deposit into PPF?',
        answer: 'Deposits should be credited on or before the 5th of each month, as interest is computed on the lowest balance between the 5th and month-end.'
      }
    ],
    disclaimer: 'Educational sovereign savings model. Rates are notified quarterly by the Ministry of Finance.'
  },
  fd: {
    id: 'fd',
    title: 'Fixed Deposit (FD) Calculator (Quarterly Compounding)',
    subtitle: 'Calculate bank cumulative fixed deposit maturity values with standard quarterly compounding conventions under RBI guidelines.',
    metaDescription: 'Calculate bank fixed deposit maturity proceeds with quarterly compounding and senior citizen interest benefits.',
    formula: 'A = P * [1 + (r / 4)]^(4 * t)',
    formulaVariables: [
      { symbol: 'A', meaning: 'Maturity Proceed', explanation: 'Total accumulated sum returned upon term completion.' },
      { symbol: 'P', meaning: 'Principal Deposit', explanation: 'Initial lump-sum placed in fixed deposit.' },
      { symbol: 'r', meaning: 'Annual Interest Rate', explanation: 'Contracted annual interest percentage.' },
      { symbol: 't', meaning: 'Tenure in Years', explanation: 'Duration in calendar years.' }
    ],
    scenarios: [
      {
        name: '5-Year Standard Term Deposit (₹5 Lakhs)',
        rateOrTenure: '7.25% p.a.',
        monthlyOrPrincipal: '₹5,00,000 principal',
        duration: '5 Years',
        estimatedReturnOrInterest: '₹2,16,079 interest',
        netMaturityOrTotal: '₹7,16,079'
      },
      {
        name: '5-Year Senior Citizen Deposit (₹5 Lakhs)',
        rateOrTenure: '7.75% p.a. (+0.5%)',
        monthlyOrPrincipal: '₹5,00,000 principal',
        duration: '5 Years',
        estimatedReturnOrInterest: '₹2,34,345 interest',
        netMaturityOrTotal: '₹7,34,345'
      },
      {
        name: '1-Year Short Term Deposit (₹10 Lakhs)',
        rateOrTenure: '6.80% p.a.',
        monthlyOrPrincipal: '₹10,00,000 principal',
        duration: '1 Year',
        estimatedReturnOrInterest: '₹69,753 interest',
        netMaturityOrTotal: '₹10,69,753'
      }
    ],
    scenarioNotes: 'Indian scheduled commercial banks compound fixed deposit interest quarterly under RBI directions.',
    strategicAnalysis: [
      {
        heading: '1. TDS and Taxability of FD Interest',
        paragraphs: [
          'Under Section 194A, banks deduct 10% TDS on annual interest exceeding ₹40,000 for regular individuals and ₹50,000 for senior citizens. FD interest is taxed at individual slab rates.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How is FD interest compounded in India?',
        answer: 'Interest is compounded on a quarterly basis (every 3 months) across public and private commercial banks.'
      }
    ],
    disclaimer: 'Educational banking model. Rates vary by lending institution and deposit duration.'
  },
  hra: {
    id: 'hra',
    title: 'House Rent Allowance (HRA) Exemption Calculator',
    subtitle: 'Determine statutory tax-exempt House Rent Allowance under Section 10(13A) and Rule 2A of the Income Tax Act 1961.',
    metaDescription: 'Calculate tax-free HRA under Section 10(13A) based on Basic salary, rent paid, and city classification.',
    formula: 'Exempt HRA = Minimum of (Actual HRA, Rent - 10% Basic, 50%/40% Basic)',
    formulaVariables: [
      { symbol: 'Actual HRA', meaning: 'Allowance Received', explanation: 'Total HRA paid by employer in the financial year.' },
      { symbol: 'Basic + DA', meaning: 'Salary Base', explanation: 'Basic salary plus Dearness Allowance.' },
      { symbol: 'Rent Paid', meaning: 'Rent Outflow', explanation: 'Total rent paid for residential accommodation.' },
      { symbol: '50% / 40%', meaning: 'Metro Multiplier', explanation: '50% for Delhi, Mumbai, Kolkata, Chennai; 40% for other locations.' }
    ],
    scenarios: [
      {
        name: 'Metro Salaried Professional (₹6L Basic)',
        rateOrTenure: '50% Metro Rule',
        monthlyOrPrincipal: '₹25,000/mo rent paid',
        duration: '1 Year',
        estimatedReturnOrInterest: 'HRA: ₹2,40,000',
        netMaturityOrTotal: '₹2,40,000 100% Tax-Exempt'
      },
      {
        name: 'Non-Metro Salaried Professional (₹6L Basic)',
        rateOrTenure: '40% Non-Metro Rule',
        monthlyOrPrincipal: '₹20,000/mo rent paid',
        duration: '1 Year',
        estimatedReturnOrInterest: 'HRA: ₹2,00,000',
        netMaturityOrTotal: '₹1,80,000 Tax-Exempt'
      },
      {
        name: 'High-Income Executive (₹18L Basic)',
        rateOrTenure: '50% Metro Rule',
        monthlyOrPrincipal: '₹60,000/mo rent paid',
        duration: '1 Year',
        estimatedReturnOrInterest: 'HRA: ₹6,00,000',
        netMaturityOrTotal: '₹5,40,000 Tax-Exempt'
      }
    ],
    scenarioNotes: 'Available under the Old Tax Regime. Landlord PAN is required if annual rent exceeds ₹1,00,000.',
    strategicAnalysis: [
      {
        heading: '1. Statutory Rule 2A Computation Framework',
        paragraphs: [
          'HRA exemption is strictly calculated as the lowest of: (a) actual HRA received, (b) rent paid minus 10% of basic salary, or (c) 50% of basic salary for metro cities (40% for non-metros).'
        ]
      }
    ],
    faqs: [
      {
        question: 'Is HRA available under the New Tax Regime?',
        answer: 'No. The New Tax Regime (Section 115BAC) disallows HRA exemptions.'
      }
    ],
    disclaimer: 'Educational tax framework model. Consult a Chartered Accountant for complex salary structures.'
  },
  gratuity: {
    id: 'gratuity',
    title: 'Gratuity Calculator (Payment of Gratuity Act 1972)',
    subtitle: 'Compute statutory gratuity entitlements, working day factor formulas (15/26), and lifetime ₹20 Lakh tax exemption limits.',
    metaDescription: 'Calculate statutory gratuity payout under Payment of Gratuity Act 1972 with Section 10(10) tax exemption limits.',
    formula: 'Gratuity = (15 * Last Drawn Basic * Tenure) / 26',
    formulaVariables: [
      { symbol: '15/26', meaning: 'Working Day Ratio', explanation: '15 days salary per year based on 26 monthly working days.' },
      { symbol: 'Basic + DA', meaning: 'Last Salary', explanation: 'Last drawn Basic Salary plus Dearness Allowance.' },
      { symbol: 'Tenure', meaning: 'Completed Service', explanation: 'Total years of continuous service (>= 5 years required).' },
      { symbol: '₹20L', meaning: 'Exemption Limit', explanation: 'Maximum lifetime tax-exempt ceiling u/s 10(10).' }
    ],
    scenarios: [
      {
        name: '10-Year Service (₹80,000 Basic)',
        rateOrTenure: 'Covered under Act',
        monthlyOrPrincipal: '₹80,000 Basic+DA',
        duration: '10 Years',
        estimatedReturnOrInterest: 'Factor: 15/26',
        netMaturityOrTotal: '₹4,61,538 Tax-Free'
      },
      {
        name: '20-Year Service (₹1,20,000 Basic)',
        rateOrTenure: 'Covered under Act',
        monthlyOrPrincipal: '₹1,20,000 Basic+DA',
        duration: '20 Years',
        estimatedReturnOrInterest: 'Factor: 15/26',
        netMaturityOrTotal: '₹13,84,615 Tax-Free'
      },
      {
        name: '30-Year Service (₹1,50,000 Basic)',
        rateOrTenure: 'Covered under Act',
        monthlyOrPrincipal: '₹1,50,000 Basic+DA',
        duration: '30 Years',
        estimatedReturnOrInterest: 'Exceeds ₹20L Limit',
        netMaturityOrTotal: '₹25,96,154 (₹20L Exempt, ₹5.96L Taxable)'
      }
    ],
    scenarioNotes: 'Service exceeding 6 months in the final year is rounded up to the nearest complete year.',
    strategicAnalysis: [
      {
        heading: '1. Eligibility & Statutory Exemption',
        paragraphs: [
          'Under Section 4 of the Payment of Gratuity Act, an employee must complete at least 5 years of continuous service. The statutory lifetime tax exemption limit under Section 10(10) is ₹20,00,000.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Is gratuity calculated on gross or basic salary?',
        answer: 'Statutory gratuity is strictly calculated on Basic Salary plus Dearness Allowance; special allowances and bonuses are excluded.'
      }
    ],
    disclaimer: 'Educational employment law model. Consult your HR establishment for company-specific gratuity trust rules.'
  },
  'capital-gains': {
    id: 'capital-gains',
    title: 'Capital Gains Tax Calculator (Section 112A & 111A)',
    subtitle: 'Compute Long-Term (12.5% u/s 112A) and Short-Term (20% u/s 111A) Capital Gains taxes on equities, mutual funds, and real estate.',
    metaDescription: 'Calculate capital gains tax under Sections 112A, 111A, and 112 with ₹1.25 Lakh annual equity exemptions.',
    formula: 'Capital Gains Tax = (Net Gain - Exemption) * Tax Rate + 4% Cess',
    formulaVariables: [
      { symbol: 'Net Gain', meaning: 'Capital Gain', explanation: 'Sale proceeds minus indexed/actual acquisition cost.' },
      { symbol: '12.5%', meaning: 'LTCG Tax Rate', explanation: 'Rate on equities (>12 mo) and real estate (>24 mo).' },
      { symbol: '20%', meaning: 'STCG Tax Rate', explanation: 'Rate on equity funds held for 12 months or less.' },
      { symbol: '₹1.25L', meaning: 'Annual Exemption', explanation: 'Annual tax-exempt threshold u/s 112A for equity gains.' }
    ],
    scenarios: [
      {
        name: 'Equity Long-Term Gain (₹3L Profit)',
        rateOrTenure: '12.5% u/s 112A',
        monthlyOrPrincipal: '₹3,00,000 Gain',
        duration: '> 12 Months',
        estimatedReturnOrInterest: 'Exemption: ₹1,25,000',
        netMaturityOrTotal: '₹22,750 Tax (inc. 4% Cess)'
      },
      {
        name: 'Equity Short-Term Gain (₹2L Profit)',
        rateOrTenure: '20% u/s 111A',
        monthlyOrPrincipal: '₹2,00,000 Gain',
        duration: '<= 12 Months',
        estimatedReturnOrInterest: 'Zero Exemption',
        netMaturityOrTotal: '₹41,600 Tax (inc. 4% Cess)'
      },
      {
        name: 'Real Estate Long-Term Gain (₹15L Profit)',
        rateOrTenure: '12.5% u/s 112',
        monthlyOrPrincipal: '₹15,00,000 Gain',
        duration: '> 24 Months',
        estimatedReturnOrInterest: 'Without Indexation',
        netMaturityOrTotal: '₹1,95,000 Tax (inc. 4% Cess)'
      }
    ],
    scenarioNotes: 'Reflects Finance Act amendments adjusting equity LTCG to 12.5% and STCG to 20%.',
    strategicAnalysis: [
      {
        heading: '1. Finance Act Capital Gains Revisions',
        paragraphs: [
          'The statutory holding period for listed equity is 12 months. Long-term capital gains exceeding ₹1.25 lakh per financial year are taxed at 12.5% under Section 112A.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is the revised exemption on equity LTCG?',
        answer: 'The annual tax-exempt threshold on equity long-term capital gains is ₹1,25,000 per financial year.'
      }
    ],
    disclaimer: 'Educational tax model. Capital gains liabilities depend on asset class and acquisition date.'
  },
  '44ada': {
    id: '44ada',
    title: 'Section 44ADA Presumptive Taxation Calculator',
    subtitle: 'Compute presumptive business profits (50% minimum) and tax liabilities for software freelancers, doctors, lawyers, and consultants.',
    metaDescription: 'Calculate Section 44ADA presumptive tax, deemed profits (50% minimum), and tax audit exemptions.',
    formula: 'Deemed Profit = Maximum of (Actual Profit, Gross Receipts * 50%)',
    formulaVariables: [
      { symbol: 'Receipts', meaning: 'Gross Receipts', explanation: 'Total professional turnover/invoices up to ₹75 Lakhs.' },
      { symbol: '50% Min', meaning: 'Deemed Profit', explanation: 'Statutory minimum deemed taxable profit rate.' },
      { symbol: 'Sec 44AA', meaning: 'Books Exemption', explanation: 'Waiver from maintaining detailed books of accounts.' },
      { symbol: 'Sec 44AB', meaning: 'Audit Exemption', explanation: 'Waiver from mandatory Chartered Accountant audit.' }
    ],
    scenarios: [
      {
        name: 'Freelance Software Consultant (₹35L Turnover)',
        rateOrTenure: '50% Deemed Profit',
        monthlyOrPrincipal: '₹35,00,000 Receipts',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Profit: ₹17,50,000',
        netMaturityOrTotal: '₹2,26,200 Tax (6.46% Effective)'
      },
      {
        name: 'Independent Doctor / Clinic (₹50L Turnover)',
        rateOrTenure: '50% Deemed Profit',
        monthlyOrPrincipal: '₹50,00,000 Receipts',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Profit: ₹25,00,000',
        netMaturityOrTotal: '₹4,60,200 Tax (9.20% Effective)'
      },
      {
        name: 'Creative Consultant (₹20L Turnover)',
        rateOrTenure: '50% Deemed Profit',
        monthlyOrPrincipal: '₹20,00,000 Receipts',
        duration: 'FY 2025-26',
        estimatedReturnOrInterest: 'Profit: ₹10,00,000',
        netMaturityOrTotal: '₹52,000 Tax (2.60% Effective)'
      }
    ],
    scenarioNotes: 'Applicable for eligible professionals with gross receipts up to ₹75 Lakhs (with cash receipts <= 5%).',
    strategicAnalysis: [
      {
        heading: '1. Simplified Compliance under Section 44ADA',
        paragraphs: [
          'Section 44ADA allows eligible professionals to declare 50% of gross receipts as profit, completely eliminating the requirement to maintain accounting books under Section 44AA or undergo tax audit under Section 44AB.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Are IT contractors and software engineers eligible for 44ADA?',
        answer: 'Yes, technical consultancy and IT development services are recognized specified professions under CBDT guidelines.'
      }
    ],
    disclaimer: 'Educational presumptive taxation model. Consult a Chartered Accountant for professional ITR-4 filing.'
  }
};
