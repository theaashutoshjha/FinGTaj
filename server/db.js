import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed articles preserving all existing FingTaj publication content
const INITIAL_ARTICLES = [
  {
    id: 'art-compounding',
    slug: 'compounding',
    tag: 'Wealth Compounding • Masterclass',
    category: 'trading',
    title: 'The Mathematics of Compounding: How ₹10,000/Month Turns Into ₹3.5 Crore',
    readTime: '8 Min Read',
    author: 'FingTaj Quantitative Research Team',
    authorBio: 'Institutional Quantitative Research Desk specializing in compounding mathematics and asset allocation.',
    publishedAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Discover why time horizon outpaces market timing, why expense ratios erode 30% of wealth over 25 years, and how to harness index funds.',
    content: `
      <h2>1. The Non-Linear Mathematics of Geometric Compounding</h2>
      <p>Human intuition is inherently linear. When an individual earns ₹1,00,000 monthly, they anticipate that saving ₹10,000 per month will accumulate ₹1,20,000 after one year and ₹12,00,000 after a decade. While this additive arithmetic applies to stagnant cash, it fundamentally misunderstands exponential geometric compounding.</p>

      <p>The standard compounding equation is:</p>
      <div class="glass-card" style="margin: 20px 0; border-left: 4px solid var(--accent-cyan); padding: 18px; font-family: monospace;">
        <strong>A = P × [((1 + r/n)^(n×t) - 1) / (r/n)] × (1 + r/n)</strong>
      </div>

      <h2>2. 30-Year Compounding Milestone Breakdown</h2>
      <p>Here is how a systematic ₹10,000 monthly SIP at a historical 12% CAGR scales over three decades:</p>
      <div style="overflow-x: auto; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: rgba(255,255,255,0.02); border-radius: 8px;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--accent-cyan);">
              <th style="padding: 10px; text-align: left;">Horizon</th>
              <th style="padding: 10px; text-align: left;">Invested Capital</th>
              <th style="padding: 10px; text-align: left;">Portfolio Value</th>
              <th style="padding: 10px; text-align: left;">Gain Share</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px;">Year 5</td>
              <td style="padding: 10px;">₹6,00,000</td>
              <td style="padding: 10px;">₹8,24,864</td>
              <td style="padding: 10px;">27.2%</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px;">Year 15</td>
              <td style="padding: 10px;">₹18,00,000</td>
              <td style="padding: 10px;">₹50,45,760</td>
              <td style="padding: 10px;">64.3%</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px;">Year 30</td>
              <td style="padding: 10px;">₹36,00,000</td>
              <td style="padding: 10px;">₹3,52,99,138</td>
              <td style="padding: 10px;"><b>89.8%</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Fee Minimization & Expense Ratios</h2>
      <p>A 1.75% active fund expense ratio consumes over 31% of total final corpus compared to a 0.15% direct index fund. On a ₹1.8 Crore terminal portfolio, that fee gap destroys over ₹57 Lakhs in compound wealth.</p>

      <h2>4. Frequently Asked Questions (FAQ)</h2>
      <h3>How does compounding differ from simple interest?</h3>
      <p>Simple interest earns returns strictly on the principal; compound interest earns returns on both principal and accumulated past returns, producing exponential growth.</p>

      <h3>Why is time in the market more critical than timing the market?</h3>
      <p>Over 80% of wealth compounds in the final decade. Exiting the market interrupts the geometric curve and resets the exponential flywheel.</p>
    `,
    seo: {
      title: 'Mathematics of Compounding: Turn ₹10k/Month into ₹3.5 Crore | FingTaj',
      description: 'Understand geometric compounding curves, why expense ratios erode 32% of long-term wealth, and actionable rules for building exponential equity portfolios.',
      keywords: ['compounding', 'SIP calculator', 'expense ratio', 'index funds', 'wealth building'],
      canonicalUrl: 'https://fingtaj.com/articles/compounding',
      score: 98
    },
    aeo: {
      primaryQuestion: 'How does monthly SIP compounding turn ₹10,000 into ₹3.5 Crore?',
      directAnswer: 'Investing ₹10,000 monthly at a 12% annualized return reaches ₹8.25 Lakh in 5 years, crosses ₹1 Crore in 20 years, and accelerates to ₹3.53 Crore at 30 years because compound interest grows geometrically rather than linearly.',
      keyTakeaways: [
        'Geometric acceleration generates over 90% of final terminal wealth in the final decade.',
        'An active expense ratio of 1.8% destroys over 32% of total wealth compared to direct passive index funds.',
        'Stepping up your SIP by 10% annually doubles the terminal corpus over 25 years.'
      ],
      score: 96
    },
    sources: [
      {
        title: 'SPIVA India Scorecard Mid-Year Analysis',
        url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/',
        publishedDate: '2024-09-30',
        snippet: 'Active equity funds in emerging markets underperform standard broad benchmarks over 10+ year investment horizons.'
      }
    ],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-index-funds',
    slug: 'index-funds',
    tag: 'Index Investing • Institutional',
    category: 'trading',
    title: 'The Zero-Emotion Index Strategy: Why 92% of Active Fund Managers Underperform',
    readTime: '7 Min Read',
    author: 'FingTaj Quantitative Research Team',
    authorBio: 'Institutional Quantitative Research Desk specializing in compounding mathematics and asset allocation.',
    publishedAt: '2025-01-20T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Learn the institutional data behind passive indexing, SPIVA scorecards, and why eliminating fees beats stock-picking over multi-decade horizons.',
    content: `
      <h2>1. The SPIVA Scorecard Reality</h2>
      <p>Decades of S&P Indices Versus Active (SPIVA) research confirm an uncomfortable truth for the financial industry: over 10 to 15-year holding horizons, over <b>90% of actively managed equity mutual funds fail to beat their benchmark indices</b> (such as the Nifty 50 or S&P 500) after accounting for management fees and portfolio churn.</p>
      <h2>2. Friction Kills Compounding</h2>
      <p>Every portfolio trade incurs brokerage, exchange turnover levies, stamp duty, bid-ask spread slippage, and short-term capital gains tax. An index fund eliminates discretionary turnover, replicating the market index with a tracking error typically below 0.05%.</p>
      <h2>3. The FingTaj 3-Fund Core Portfolio</h2>
      <p>• <b>60% Broad Market Index:</b> Nifty 50 or S&P 500 Total Return Index<br/>
      • <b>20% Mid-Cap / Growth Index:</b> Nifty Midcap 150 or Russell 2000 for upside torque<br/>
      • <b>20% Sovereign Debt / Arbitrage:</b> High-grade liquid debt for portfolio rebalancing and volatility reduction.</p>
    `,
    seo: {
      title: 'Zero-Emotion Index Strategy: Passive Investing Truths | FingTaj',
      description: 'Discover empirical SPIVA data showing why 92% of active fund managers underperform passive benchmarks and how to structure a low-cost 3-fund core portfolio.',
      keywords: ['passive investing', 'index funds', 'SPIVA', 'expense ratio', 'portfolio construction'],
      canonicalUrl: 'https://fingtaj.com/articles/index-funds',
      score: 97
    },
    aeo: {
      primaryQuestion: 'Why do passive index funds outperform 92% of actively managed funds?',
      directAnswer: 'Passive index funds outperform active managers over 10 to 15-year horizons because active funds incur 1.5% to 2.5% in ongoing expense ratios, transaction taxes, and trading slippage that mathematically compound against net performance.',
      keyTakeaways: [
        'Over 90% of actively managed large-cap funds lag the index after fees over 10 years.',
        'Eliminating portfolio turnover reduces taxation and transaction friction.',
        'A 3-fund portfolio across broad market, mid-cap, and sovereign debt provides optimal risk-adjusted returns.'
      ],
      score: 95
    },
    sources: [
      {
        title: 'S&P Dow Jones Indices SPIVA Institutional Scorecard',
        url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/',
        publishedDate: '2024-06-30',
        snippet: 'Consistent multi-decade underperformance of active equity funds across major global jurisdictions.'
      }
    ],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-valuation',
    slug: 'valuation',
    tag: 'Equity Research • Valuation',
    category: 'trading',
    title: 'Discounted Cash Flow (DCF) Explained: How Institutions Value Equity Intrinsic Worth',
    readTime: '10 Min Read',
    author: 'FingTaj Equity Strategy Desk',
    authorBio: 'Specialists in institutional financial modeling, corporate valuation, and capital allocation.',
    publishedAt: '2025-02-01T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Deconstruct financial statements, calculate Free Cash Flow to Firm (FCFF), determine Weighted Average Cost of Capital (WACC), and build a safety margin.',
    content: `
      <h2>1. Cash Flow is the Ground Truth</h2>
      <p>Accounting net earnings can be engineered through accrual accounting, aggressive depreciation schedules, and non-operating revenue recognitions. Free Cash Flow to Firm (FCFF)—the real cash left over after operating expenses, working capital expansion, and capital expenditures—cannot be faked.</p>
      <h2>2. Deconstructing the Discount Rate (WACC)</h2>
      <p>The Weighted Average Cost of Capital (WACC) reflects the minimum rate of return demanded by both equity and debt providers:</p>
      <p><code style="background:rgba(0,245,255,0.1); padding:4px 8px; border-radius:4px; font-family:var(--font-mono);">WACC = (E/V × Re) + (D/V × Rd × (1 - Tax))</code></p>
      <h2>3. The Margin of Safety Rule</h2>
      <p>Institutional value investors never buy a company at intrinsic fair value. An analytical investor requires a 25% to 35% margin of safety to absorb forecasting errors, macroeconomic headwinds, and unforeseen competitive disruption.</p>
    `,
    seo: {
      title: 'Discounted Cash Flow (DCF) Valuation Guide for Equities | FingTaj',
      description: 'Master institutional DCF equity modeling: calculate Free Cash Flow to Firm (FCFF), determine WACC discount rates, and apply margin-of-safety principles.',
      keywords: ['DCF valuation', 'FCFF', 'WACC', 'intrinsic value', 'fundamental equity analysis'],
      canonicalUrl: 'https://fingtaj.com/articles/valuation',
      score: 96
    },
    aeo: {
      primaryQuestion: 'What is a Discounted Cash Flow (DCF) model and how does it calculate equity value?',
      directAnswer: 'A Discounted Cash Flow (DCF) model calculates the intrinsic fair value of a company by forecasting future Free Cash Flows to the Firm (FCFF) and discounting them back to today at the Weighted Average Cost of Capital (WACC).',
      keyTakeaways: [
        'FCFF provides an unmanipulated metric of true operational surplus after capital expenditures.',
        'WACC weights cost of equity and after-tax cost of debt to discount future cash flows.',
        'A 25-35% margin of safety protects investors from macroeconomic valuation shocks.'
      ],
      score: 94
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-budgeting',
    slug: 'budgeting',
    tag: 'Personal Finance • Cashflow',
    category: 'finance',
    title: 'The 50/30/20 Cashflow Blueprint: Never Run Out of Money Again',
    readTime: '6 Min Read',
    author: 'FingTaj Personal Finance Desk',
    authorBio: 'Advising individuals on automated cashflow architecture and financial independence engineering.',
    publishedAt: '2025-02-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'A rigorous, friction-free framework to divide your monthly take-home income into Needs, Discretionary Wants, and Non-Negotiable Wealth Assets.',
    content: `
      <h2>1. The Architecture of Automated Budgeting</h2>
      <p>Traditional line-item budgeting fails because it requires exhausting manual entry of every cup of coffee. The 50/30/20 framework simplifies your cashflow into three non-overlapping pools:</p>
      <p>• <b>50% Needs:</b> Non-negotiable survival obligations (Rent, Utilities, Basic Groceries, Insurance)<br/>
      • <b>30% Wants:</b> Lifestyle & entertainment (Dining, Vacations, Gadgets)<br/>
      • <b>20% Wealth:</b> Assets that generate future cashflow (Index Funds, Emergency Fund)</p>
      <h2>2. Automating the Paycheck Flow</h2>
      <p>The cardinal rule of wealth accumulation is to pay yourself first. On the 1st of every month, your 20% wealth allocation should be automatically debited into index funds before you have the chance to spend it.</p>
    `,
    seo: {
      title: '50/30/20 Cashflow Blueprint & Automation Guide | FingTaj',
      description: 'Eliminate financial stress with the automated 50/30/20 budget framework: 50% needs, 30% wants, and 20% automatic wealth generation.',
      keywords: ['50/30/20 rule', 'automated budgeting', 'cashflow system', 'personal finance'],
      canonicalUrl: 'https://fingtaj.com/articles/budgeting',
      score: 97
    },
    aeo: {
      primaryQuestion: 'How does the 50/30/20 cashflow rule work?',
      directAnswer: 'The 50/30/20 rule allocates 50% of after-tax monthly income to essential living needs, 30% to discretionary lifestyle wants, and 20% directly into wealth-generating investment assets via automated pay-yourself-first debit mandates.',
      keyTakeaways: [
        'Separates money into 3 automated friction-free pools.',
        'Prevents lifestyle inflation while guaranteeing ongoing wealth creation.',
        'Enforces paying yourself first on payday.'
      ],
      score: 98
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-emergency-fund',
    slug: 'emergency-fund',
    tag: 'Cash Reserves • Risk Management',
    category: 'finance',
    title: 'The 6-Month Liquidity Moat: Structuring Your High-Yield Emergency Reserve',
    readTime: '5 Min Read',
    author: 'FingTaj Personal Finance Desk',
    authorBio: 'Advising individuals on automated cashflow architecture and financial independence engineering.',
    publishedAt: '2025-02-18T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'How to mathematically calculate your core survival burn rate and divide your emergency buffer across instant bank deposits and overnight liquid mutual funds.',
    content: `
      <h2>1. Calculating Your True Burn Rate</h2>
      <p>Your emergency fund is not 6 months of gross salary; it is 6 months of non-negotiable living expenses (Rent + EMIs + Minimum Groceries + Insurance Premiums + Medicine). If your bare-bones monthly survival burn rate is ₹40,000, your target liquidity moat is <b>₹2,40,000</b>.</p>
      <h2>2. The 3-Tier Allocation Strategy</h2>
      <p>• <b>Tier 1 (Instant Access - 20%):</b> High-yield savings bank account linked with immediate UPI/ATM access.<br/>
      • <b>Tier 2 (T+1 Liquidity - 50%):</b> Overnight & Liquid Mutual Funds with instant redemption.<br/>
      • <b>Tier 3 (Capital Preservation - 30%):</b> Multi-deposit sweep-in fixed deposits or short-term arbitrage funds.</p>
    `,
    seo: {
      title: '6-Month Emergency Fund Guide & Allocation Strategy | FingTaj',
      description: 'Calculate your true survival burn rate and architect a 3-tier liquidity moat across savings accounts, liquid mutual funds, and sweep-in deposits.',
      keywords: ['emergency fund', 'liquidity moat', 'liquid funds', 'cash reserves'],
      canonicalUrl: 'https://fingtaj.com/articles/emergency-fund',
      score: 96
    },
    aeo: {
      primaryQuestion: 'How should an emergency fund be structured and sized?',
      directAnswer: 'An emergency fund should equal exactly 6 months of non-negotiable survival expenses (not gross income) structured in three tiers: 20% in an instant savings account, 50% in overnight/liquid funds, and 30% in high-yield sweep fixed deposits.',
      keyTakeaways: [
        'Base size on non-negotiable expense burn rate rather than gross earnings.',
        'Tiered architecture prevents yield leakage while ensuring instant liquidity.',
        'Guarantees you never have to liquidate equity holdings during market downturns.'
      ],
      score: 95
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-tax-mastery',
    slug: 'tax-mastery',
    tag: 'Tax Strategy • 2026 Optimization',
    category: 'finance',
    title: '2026 Tax Optimization Blueprint: Choosing Old vs New Tax Regime with Zero Regret',
    readTime: '8 Min Read',
    author: 'FingTaj Tax Strategy Desk',
    authorBio: 'Tax efficiency analysis, capital gains planning, and regulatory compliance.',
    publishedAt: '2025-02-25T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Mathematical inflection thresholds, Section 80CCD(2) corporate NPS perks, and capital gains tax tax-harvesting techniques to legally reduce tax leakage.',
    content: `
      <h2>1. The Mathematical Breakeven Threshold</h2>
      <p>Under the revised 2025-2026 tax brackets, the New Tax Regime offers substantially wider slabs and a ₹75,000 standard deduction. For salaried professionals earning up to ₹15 Lakhs, the New Regime is mathematically superior unless total eligible deductions exceed <b>₹3,75,000 to ₹4,25,000</b>.</p>
      <h2>2. Capital Gains Tax Harvesting</h2>
      <p>Take full advantage of the annual ₹1.25 Lakh tax-exempt Long-Term Capital Gains (LTCG) threshold on listed equities. Sell and immediately repurchase eligible index fund units each financial year to step up your cost acquisition basis.</p>
    `,
    seo: {
      title: '2026 Tax Optimization Guide: Old vs New Regime Comparison | FingTaj',
      description: 'Mathematical breakeven analysis for Old vs New tax regimes, Section 80CCD(2) employer NPS perks, and annual LTCG tax harvesting strategies.',
      keywords: ['income tax 2026', 'old vs new regime', 'tax harvesting', 'Section 80CCD(2)', 'LTCG exemption'],
      canonicalUrl: 'https://fingtaj.com/articles/tax-mastery',
      score: 98
    },
    aeo: {
      primaryQuestion: 'How do you choose between the Old and New Tax Regime in 2026?',
      directAnswer: 'The New Tax Regime is mathematically optimal for most earners unless total available deductions (HRA, 80C, 80D, home loan interest) exceed ₹3,75,000 to ₹4,25,000 due to widened slab thresholds and the enhanced ₹75,000 standard deduction.',
      keyTakeaways: [
        'Breakeven threshold requires >₹3.75 Lakhs in verifiable deductions for Old Regime benefit.',
        'Corporate NPS under 80CCD(2) provides up to 14% tax-deductible salary restructuring in New Regime.',
        'Harvesting up to ₹1.25 Lakhs in annual LTCG resets capital gains cost basis legally.'
      ],
      score: 97
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-loan-emi',
    slug: 'loan-emi',
    tag: 'Loans & Mortgages • Amortization',
    category: 'loans',
    title: 'Decoding Loan EMIs: How Paying Just 1 Extra EMI Cuts 7 Years Off Your Loan',
    readTime: '7 Min Read',
    author: 'FingTaj Credit & Lending Intelligence Desk',
    authorBio: 'Specialists in retail borrowing economics, mortgage interest reduction, and credit scoring.',
    publishedAt: '2025-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Amortization math unmasked: learn how early prepayments hit the principal directly, collapsing overall interest charges by over 40%.',
    content: `
      <h2>1. Understanding the Amortization Curve</h2>
      <p>When you borrow ₹35 Lakhs for 20 years at an 8.5% interest rate, your monthly EMI is ₹30,374. Over 240 months, you will repay a staggering <b>₹72.9 Lakhs</b>—meaning you pay more in interest (₹37.9 Lakhs) than the original property price!</p>
      <h2>2. The Prepayment Power Law</h2>
      <p>Paying just 1 additional EMI every calendar year reduces the tenure from 20 years down to <b>15 years and 4 months</b>, saving over ₹8 Lakhs in interest.</p>
    `,
    seo: {
      title: 'Home Loan Amortization Secrets: Cut 7 Years Off Your EMI | FingTaj',
      description: 'Discover how paying 1 extra EMI annually hits loan principal directly, shaving years off your loan tenure and saving hundreds of thousands in interest.',
      keywords: ['loan EMI calculator', 'home loan prepayment', 'amortization schedule', 'mortgage interest reduction'],
      canonicalUrl: 'https://fingtaj.com/articles/loan-emi',
      score: 97
    },
    aeo: {
      primaryQuestion: 'How does paying 1 extra EMI per year reduce home loan interest and tenure?',
      directAnswer: 'Paying 1 extra EMI each year bypasses normal interest amortization and directly repays the outstanding principal balance, reducing a standard 20-year mortgage by nearly 5 to 7 years and cutting total interest obligations by 35% to 45%.',
      keyTakeaways: [
        'Standard EMIs front-load bank interest in the first 5 to 7 years.',
        'Direct principal prepayments permanently deflate the compound interest accrual base.',
        'Increasing EMIs by 5% each year alongside salary increments produces even higher lifetime savings.'
      ],
      score: 96
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-credit-health',
    slug: 'credit-health',
    tag: 'Credit Health • CIBIL & FICO',
    category: 'loans',
    title: 'Engineering an 800+ CIBIL & FICO Credit Score: 5 Golden Rules',
    readTime: '6 Min Read',
    author: 'FingTaj Credit & Lending Intelligence Desk',
    authorBio: 'Specialists in retail borrowing economics, mortgage interest reduction, and credit scoring.',
    publishedAt: '2025-03-05T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Maintain an optimal credit utilization ratio under 30%, preserve oldest credit age, optimize your credit mix, and dispute bureau reporting errors.',
    content: `
      <h2>1. Anatomy of the Credit Scoring Algorithm</h2>
      <p>A credit score is your passport to preferential lending rates. Borrowers with scores above 780 routinely unlock 50 to 75 basis points lower interest rates on home loans, saving millions over a mortgage lifecycle.</p>
      <h2>2. The 30% Utilization Threshold</h2>
      <p>Never exceed 30% utilization of your total credit limit on any card, even if you pay the balance in full on the statement due date. Credit bureaus record the mid-cycle statement snapshot.</p>
    `,
    seo: {
      title: 'How to Build an 800+ Credit Score: 5 Algorithmic Rules | FingTaj',
      description: 'Master credit scoring mechanics: keep utilization under 30%, protect vintage credit lines, maintain balanced secured/unsecured mix, and fix bureau errors.',
      keywords: ['credit score', 'CIBIL 800', 'credit utilization', 'FICO', 'lower loan rates'],
      canonicalUrl: 'https://fingtaj.com/articles/credit-health',
      score: 96
    },
    aeo: {
      primaryQuestion: 'What are the fastest ways to increase your credit score above 800?',
      directAnswer: 'To reach an 800+ credit score, maintain total credit card utilization below 30% on statement generation dates, make 100% on-time payments, never close your oldest credit cards, and maintain a diversified mix of secured and unsecured credit.',
      keyTakeaways: [
        'Mid-cycle utilization snapshots determine reporting to CIBIL and Experian.',
        'Credit account vintage contributes significantly to algorithmic reliability.',
        'A score of 780+ lowers mortgage interest by 50 to 75 basis points.'
      ],
      score: 95
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  },
  {
    id: 'art-debt-elimination',
    slug: 'debt-elimination',
    tag: 'Debt Elimination • Algorithms',
    category: 'loans',
    title: 'Debt Avalanche vs Snowball: The Exact Mathematical Strategy to Kill High-Interest Debt',
    readTime: '8 Min Read',
    author: 'FingTaj Personal Finance Desk',
    authorBio: 'Advising individuals on automated cashflow architecture and financial independence engineering.',
    publishedAt: '2025-03-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    status: 'published',
    excerpt: 'Comparing pure interest-saving algorithms against psychological momentum. Why eliminating 40% APR credit card balances is an instant guaranteed 40% return.',
    content: `
      <h2>1. The Two Titans of Debt Elimination</h2>
      <p>High-interest consumer debt (credit card balances running at 36% to 42% APR and personal loans at 14% to 18%) constitutes financial emergency code red.</p>
      <p>• <b>Debt Avalanche:</b> Allocate excess cash to the highest APR liability. Mathematically optimal.<br/>
      • <b>Debt Snowball:</b> Eliminate smallest balances first for psychological momentum.</p>
      <h2>2. Why Credit Card Debt is an Emergency</h2>
      <p>Paying off a 40% APR credit card balance provides a risk-free, tax-free return of 40% per annum. No financial asset in the global markets can match this guaranteed hurdle rate.</p>
    `,
    seo: {
      title: 'Debt Avalanche vs Snowball: Mathematical Debt Payoff | FingTaj',
      description: 'Compare Debt Avalanche and Debt Snowball algorithms. Understand why clearing 42% APR debt yields a risk-free, tax-free 42% return.',
      keywords: ['debt avalanche', 'debt snowball', 'pay off credit card', 'debt elimination', 'interest savings'],
      canonicalUrl: 'https://fingtaj.com/articles/debt-elimination',
      score: 97
    },
    aeo: {
      primaryQuestion: 'What is the difference between the Debt Avalanche and Debt Snowball methods?',
      directAnswer: 'The Debt Avalanche method prioritizes debts by highest interest rate (APR) to minimize total interest paid mathematically, while the Debt Snowball method targets the smallest balance first to build behavioral and psychological momentum.',
      keyTakeaways: [
        'Debt Avalanche saves the greatest total cash in accumulated interest.',
        'Paying down a 40% credit card is mathematically equivalent to a risk-free 40% annual investment return.',
        'Debt Snowball is superior for borrowers needing early psychological validation.'
      ],
      score: 96
    },
    sources: [],
    originalityScore: 100,
    factVerificationPassed: true
  }
];

class Database {
  constructor() {
    this.data = {
      articles: [],
      topics: [],
      sources: [],
      jobs: [],
      settings: {
        autoPublish: false,
        killSwitch: false,
        dailyGenerationLimit: 5,
        geminiModel: 'gemini-1.5-flash',
        cfModel: '@cf/meta/llama-3-8b-instruct',
        monthlyQuotaUsed: 0,
        monthlyQuotaMax: 1000
      },
      auditLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure any new fields exist
        if (!this.data.articles || this.data.articles.length === 0) {
          this.data.articles = INITIAL_ARTICLES;
        }
        if (!this.data.settings) {
          this.data.settings = {
            autoPublish: false,
            killSwitch: false,
            dailyGenerationLimit: 5,
            geminiModel: 'gemini-1.5-flash',
            cfModel: '@cf/meta/llama-3-8b-instruct',
            monthlyQuotaUsed: 0,
            monthlyQuotaMax: 1000
          };
        }
        if (!this.data.topics) this.data.topics = [];
        if (!this.data.sources) this.data.sources = [];
        if (!this.data.jobs) this.data.jobs = [];
        if (!this.data.auditLogs) this.data.auditLogs = [];
        if (!this.data.users) this.data.users = [];
        if (!this.data.sessions) this.data.sessions = [];
        if (!this.data.contactMessages) this.data.contactMessages = [];
      } else {
        this.data.articles = INITIAL_ARTICLES;
        this.save();
      }
    } catch (err) {
      console.error('[DB] Error loading DB, initializing default state:', err);
      this.data.articles = INITIAL_ARTICLES;
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Atomic save failed:', err);
    }
  }

  // Articles
  getPublishedArticles() {
    return this.data.articles.filter(a => a.status === 'published');
  }

  getAllArticles() {
    return this.data.articles;
  }

  getArticleBySlug(slug) {
    return this.data.articles.find(a => a.slug === slug);
  }

  getArticleById(id) {
    return this.data.articles.find(a => a.id === id);
  }

  saveArticle(article) {
    const idx = this.data.articles.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      this.data.articles[idx] = { ...this.data.articles[idx], ...article, updatedAt: new Date().toISOString() };
    } else {
      this.data.articles.unshift({
        ...article,
        createdAt: article.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    this.save();
    return this.getArticleById(article.id);
  }

  deleteArticle(id) {
    const idx = this.data.articles.findIndex(a => a.id === id);
    if (idx >= 0) {
      const removed = this.data.articles.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Topics
  getTopics() {
    return this.data.topics || [];
  }

  addTopic(topic) {
    if (!this.data.topics) this.data.topics = [];
    const newTopic = {
      id: 'top-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      status: 'discovered',
      discoveredAt: new Date().toISOString(),
      ...topic
    };
    this.data.topics.unshift(newTopic);
    this.save();
    return newTopic;
  }

  updateTopic(id, updates) {
    const topic = this.data.topics.find(t => t.id === id);
    if (topic) {
      Object.assign(topic, updates);
      this.save();
    }
    return topic;
  }

  // Jobs
  getJobs() {
    return this.data.jobs || [];
  }

  addJob(job) {
    if (!this.data.jobs) this.data.jobs = [];
    const newJob = {
      id: 'job-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...job
    };
    this.data.jobs.unshift(newJob);
    // Keep max 100 jobs
    if (this.data.jobs.length > 100) this.data.jobs.pop();
    this.save();
    return newJob;
  }

  updateJob(id, updates) {
    const job = this.data.jobs.find(j => j.id === id);
    if (job) {
      Object.assign(job, updates, { updatedAt: new Date().toISOString() });
      this.save();
    }
    return job;
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // Audit Logs
  logAction(action, userEmail, details = {}) {
    if (!this.data.auditLogs) this.data.auditLogs = [];
    const entry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      userEmail: userEmail || 'system',
      details
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 200) this.data.auditLogs.pop();
    this.save();
    return entry;
  }

  getAuditLogs() {
    return this.data.auditLogs || [];
  }

  // ==========================================
  // DIRECT USER & SESSION AUTHENTICATION
  // ==========================================
  findUserByEmail(email) {
    if (!this.data.users) this.data.users = [];
    const normalized = String(email || '').trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === normalized) || null;
  }

  createUser({ email, password, name, auth0Id }) {
    if (!this.data.users) this.data.users = [];
    const cleanEmail = String(email).trim().toLowerCase();
    
    // Check if user already exists
    const existing = this.findUserByEmail(cleanEmail);
    if (existing) {
      if (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        existing.salt = salt;
        existing.hash = hash;
      }
      if (name) existing.name = name;
      if (auth0Id) existing.auth0Id = auth0Id;
      existing.updatedAt = new Date().toISOString();
      this.save();
      return existing;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = password ? crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') : null;
    
    const newUser = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      auth0Id: auth0Id || null,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      salt,
      hash,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  verifyUserPassword(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    if (!user.salt || !user.hash) {
      // If user was created without password hash, allow setting password or return null
      return null;
    }
    const checkHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    if (checkHash === user.hash) {
      return user;
    }
    return null;
  }

  createSession(user) {
    if (!this.data.sessions) this.data.sessions = [];
    const token = crypto.randomBytes(32).toString('hex');
    const session = {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    this.data.sessions.push(session);
    if (this.data.sessions.length > 500) this.data.sessions.shift();
    this.save();
    return token;
  }

  getSession(token) {
    if (!token || !this.data.sessions) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      this.destroySession(token);
      return null;
    }
    const user = this.data.users?.find(u => u.id === session.userId) || {
      id: session.userId,
      email: session.email,
      name: session.name
    };
    return user;
  }

  destroySession(token) {
    if (!token || !this.data.sessions) return;
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  saveContactMessage({ name, email, category, subject, message, ip, userAgent }) {
    if (!this.data.contactMessages) this.data.contactMessages = [];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const trackingId = `FT-${dateStr}-${randomSuffix}`;

    const record = {
      id: trackingId,
      name: String(name || '').trim().slice(0, 100),
      email: String(email || '').trim().toLowerCase().slice(0, 120),
      category: String(category || 'General Inquiry').trim(),
      subject: String(subject || 'General Inquiry').trim().slice(0, 150),
      message: String(message || '').trim().slice(0, 5000),
      ip: ip || 'client-side',
      userAgent: userAgent || 'browser',
      status: 'received',
      createdAt: new Date().toISOString()
    };

    this.data.contactMessages.unshift(record);
    // Keep last 1000 inquiries
    if (this.data.contactMessages.length > 1000) {
      this.data.contactMessages.pop();
    }
    this.save();
    return record;
  }

  getContactMessages() {
    return this.data.contactMessages || [];
  }
}

export const db = new Database();
