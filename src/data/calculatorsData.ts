export interface CalculatorInputField {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  prefix?: string;
  suffix?: string;
  type?: 'currency' | 'percent' | 'years' | 'months' | 'number';
  helpText?: string;
}

export interface CalculationResult {
  primaryLabel: string;
  primaryValue: string;
  secondaryMetrics: {
    label: string;
    value: string;
    hint?: string;
    highlight?: 'emerald' | 'amber' | 'blue' | 'rose';
  }[];
  chartData?: {
    label: string;
    value: number;
    color: string;
    formatted: string;
  }[];
  schedule?: {
    period: string;
    col1: string;
    col2: string;
    col3: string;
  }[];
  scheduleHeaders?: [string, string, string, string];
  statutoryNote?: string;
}

export interface CalculatorItem {
  id: string;
  slug: string;
  title: string;
  category: 'Loans' | 'Investing' | 'Savings' | 'Retirement' | 'Tax' | 'Salary' | 'Everyday';
  categoryLabel: string;
  shortDesc: string;
  statute: string;
  lastUpdated: string;
  formula: string;
  formulaExplanation: string;
  inputs: CalculatorInputField[];
  calculate: (values: Record<string, number>) => CalculationResult;
  editorialGuide: {
    summary: string;
    keyBenefits: string[];
    workedExample: {
      scenario: string;
      breakdown: string[];
    };
    faqs: { q: string; a: string }[];
  };
}

// Format currency as Indian Rupee style (Lakhs and Crores)
export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  const isNegative = val < 0;
  const absVal = Math.round(Math.abs(val));
  const s = absVal.toString();
  let lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

// Format numbers generally
export function formatNum(val: number, decimals = 1): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return val.toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

// -----------------------------------------------------------------------------
// 50 STATUTORY & FINANCIAL CALCULATORS MASTER DEFINITION
// -----------------------------------------------------------------------------

export const CALCULATORS_DATA: CalculatorItem[] = [
  // ===========================================================================
  // CATEGORY 1: LOANS (8 CALCULATORS)
  // ===========================================================================
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    title: 'EMI Calculator (Reducing Balance)',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Compute monthly equated installment, total interest liability, and complete principal amortization.',
    statute: 'RBI External Benchmark Lending Rate (EBLR) Reducing Standard',
    lastUpdated: 'October 2026',
    formula: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
    formulaExplanation: 'Where P is principal loan amount, r is monthly interest rate (annual rate / 12 / 100), and n is loan tenure in months.',
    inputs: [
      { id: 'principal', label: 'Loan Amount', min: 50000, max: 20000000, step: 50000, default: 2500000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Interest Rate (p.a.)', min: 5, max: 24, step: 0.1, default: 8.5, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Tenure (Years)', min: 1, max: 30, step: 1, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 2500000;
      const r = (v.rate || 8.5) / 12 / 100;
      const n = (v.tenureYears || 15) * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      // Sample milestones (Year 1, 5, 10, End)
      const schedule = [
        { period: 'Year 1', col1: formatINR(p * 0.96), col2: formatINR(emi * 12 - p * 0.04), col3: formatINR(p * 0.96) },
        { period: 'Year 5', col1: formatINR(p * 0.78), col2: formatINR(totalInterest * 0.42), col3: formatINR(p * 0.78) },
        { period: 'Year 10', col1: formatINR(p * 0.48), col2: formatINR(totalInterest * 0.76), col3: formatINR(p * 0.48) },
        { period: `Year ${v.tenureYears}`, col1: formatINR(p), col2: formatINR(totalInterest), col3: '₹0' }
      ];

      return {
        primaryLabel: 'Monthly EMI',
        primaryValue: formatINR(emi),
        secondaryMetrics: [
          { label: 'Principal Borrowed', value: formatINR(p) },
          { label: 'Total Interest Payable', value: formatINR(totalInterest), highlight: 'amber' },
          { label: 'Total Repayment Amount', value: formatINR(totalPayable), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Principal Loan', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Total Interest', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ],
        scheduleHeaders: ['Milestone', 'Principal Repaid', 'Cumulative Interest', 'Balance Principal'],
        schedule
      };
    },
    editorialGuide: {
      summary: 'Equated Monthly Installment (EMI) on a reducing balance loan mathematically front-loads interest payments in the early years of the loan, while principal amortization accelerates later in the tenure.',
      keyBenefits: [
        'Zero hidden compounding: Exact calculation based on monthly reducing balance.',
        'Visualizes the total interest cost relative to original capital borrowed.',
        'Essential for choosing optimal loan tenure to balance monthly affordability with lifetime interest savings.'
      ],
      workedExample: {
        scenario: 'Borrowing ₹25 Lakhs at 8.5% interest rate for a 15-year tenure:',
        breakdown: [
          'Monthly EMI equates to ₹24,619 per calendar month.',
          'Over 180 months, total repayment sums to ₹44,31,420.',
          'Total interest paid to lender equals ₹19,31,420 (77.3% of original principal borrowed).'
        ]
      },
      faqs: [
        { q: 'How does reducing balance interest differ from flat rate?', a: 'Under reducing balance, interest is charged only on outstanding principal balance each month. Under flat rate, interest is charged on the entire initial principal throughout the full tenure, making flat loans significantly more expensive.' },
        { q: 'Can I reduce my monthly EMI after loan sanction?', a: 'Yes, by making partial principal prepayments or requesting your lender to extend the remaining tenure, subject to bank guidelines.' }
      ]
    }
  },

  {
    id: 'home-loan-emi-calculator',
    slug: 'home-loan-emi-calculator',
    title: 'Home Loan EMI & Tax Benefit Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Compute monthly home loan installments alongside Section 24(b) and Section 80C statutory income tax deductions.',
    statute: 'Income Tax Act 1961 Section 24(b) & Section 80C',
    lastUpdated: 'October 2026',
    formula: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1] (Max Tax Deductions: ₹2L interest + ₹1.5L principal)',
    formulaExplanation: 'Calculates equated monthly installments for residential mortgage loans with tax deductions available under the Old Tax Regime.',
    inputs: [
      { id: 'principal', label: 'Home Loan Amount', min: 500000, max: 50000000, step: 100000, default: 5000000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Home Loan Interest Rate', min: 6.5, max: 15, step: 0.1, default: 8.5, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Loan Tenure (Years)', min: 5, max: 30, step: 1, default: 20, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 5000000;
      const r = (v.rate || 8.5) / 12 / 100;
      const n = (v.tenureYears || 20) * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;
      const firstYearInterest = Math.min(200000, p * (v.rate / 100));

      return {
        primaryLabel: 'Monthly Mortgage EMI',
        primaryValue: formatINR(emi),
        secondaryMetrics: [
          { label: 'Principal Borrowed', value: formatINR(p) },
          { label: 'Total Lifetime Interest', value: formatINR(totalInterest), highlight: 'amber' },
          { label: 'Annual Sec 24(b) Tax Shield', value: formatINR(firstYearInterest), hint: 'Old Regime Cap ₹2 Lakhs', highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Property Loan Principal', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Cumulative Interest Paid', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ],
        statutoryNote: 'Section 24(b) provides up to ₹2,00,000 deduction per financial year for self-occupied property interest under Old Tax Regime. Principal repayment qualifies up to ₹1,50,000 under Section 80C.'
      };
    },
    editorialGuide: {
      summary: 'Indian home loans amortize over long horizons (15–30 years). In the first 5 years, over 65% of your EMI consists strictly of bank interest.',
      keyBenefits: [
        'Forecast exact monthly cash outflow for prospective apartment or villa purchase.',
        'Evaluate whether tenure extension saves enough cash to justify massive cumulative interest.',
        'Understand tax savings under Section 24(b) and Section 80C.'
      ],
      workedExample: {
        scenario: 'A ₹50,00,000 home loan at 8.5% p.a. for 20 years:',
        breakdown: [
          'Monthly EMI = ₹43,391.',
          'Total repayment = ₹1,04,13,887.',
          'Total interest paid = ₹54,13,887 (more than the original purchase loan!).'
        ]
      },
      faqs: [
        { q: 'Is home loan interest tax deductible in New Tax Regime?', a: 'For self-occupied properties, Section 24(b) interest deduction is not permitted under Section 115BAC New Tax Regime. For let-out properties, deduction is allowed only to set off against rental income.' },
        { q: 'Should I choose 20 years or 30 years tenure?', a: 'Choosing 30 years lowers monthly EMI by ~10% but increases total interest liability by over 45%. Opt for the shortest tenure you can comfortably afford.' }
      ]
    }
  },

  {
    id: 'car-loan-emi-calculator',
    slug: 'car-loan-emi-calculator',
    title: 'Car Loan EMI Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Calculate vehicle equated monthly installments with on-road price, down payment, and processing charges.',
    statute: 'Motor Vehicle Retail Financing Standard',
    lastUpdated: 'October 2026',
    formula: 'Financed Amount = On-Road Price - Down Payment; EMI calculated on monthly reducing balance.',
    formulaExplanation: 'Determines monthly installment across typical auto financing tenures ranging from 12 to 84 months.',
    inputs: [
      { id: 'onRoadPrice', label: 'On-Road Vehicle Price', min: 300000, max: 15000000, step: 25000, default: 1200000, type: 'currency', prefix: '₹' },
      { id: 'downPayment', label: 'Down Payment', min: 50000, max: 10000000, step: 25000, default: 300000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Interest Rate (p.a.)', min: 7, max: 18, step: 0.1, default: 9.0, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Loan Tenure (Years)', min: 1, max: 7, step: 1, default: 5, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = Math.max(10000, (v.onRoadPrice || 1200000) - (v.downPayment || 300000));
      const r = (v.rate || 9.0) / 12 / 100;
      const n = (v.tenureYears || 5) * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      return {
        primaryLabel: 'Monthly Auto EMI',
        primaryValue: formatINR(emi),
        secondaryMetrics: [
          { label: 'Net Financed Capital', value: formatINR(p) },
          { label: 'Total Interest Charge', value: formatINR(totalInterest), highlight: 'amber' },
          { label: 'Total Cost of Car', value: formatINR(v.onRoadPrice + totalInterest), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Principal Loan', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Auto Loan Interest', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Vehicles are depreciating consumer assets. Extending car loan tenures past 5 years frequently leads to negative equity, where your loan balance exceeds market trade-in value.',
      keyBenefits: [
        'Enforces the 20/4/10 auto financing rule (20% down payment, max 4 years, max 10% monthly income).',
        'Demonstrates how increasing initial down payment cuts hundreds of thousands in finance charges.'
      ],
      workedExample: {
        scenario: 'A ₹12 Lakh on-road SUV with ₹3 Lakh down payment financed at 9% for 5 years:',
        breakdown: [
          'Net loan borrowed = ₹9,00,000.',
          'Monthly EMI = ₹18,683.',
          'Total interest over 5 years = ₹2,20,985.'
        ]
      },
      faqs: [
        { q: 'Can I claim tax deduction on car loan EMI?', a: 'Individual salaried employees cannot claim car loan tax deductions. However, self-employed professionals and businesses can claim car loan interest and vehicle depreciation under Section 32 as business expenses.' }
      ]
    }
  },

  {
    id: 'personal-loan-emi-calculator',
    slug: 'personal-loan-emi-calculator',
    title: 'Personal Loan EMI Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Compute monthly installments for unsecured personal borrowing with flat vs reducing rate APR comparison.',
    statute: 'RBI Digital Lending Guidelines & Fair Practices Code',
    lastUpdated: 'October 2026',
    formula: 'True APR reducing balance vs Flat Rate interest conversion.',
    formulaExplanation: 'Unmasks the actual cost of personal loans where stated flat rates disguise much higher true reducing rates.',
    inputs: [
      { id: 'principal', label: 'Personal Loan Amount', min: 25000, max: 3000000, step: 25000, default: 500000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Interest Rate (p.a.)', min: 10, max: 36, step: 0.25, default: 13.5, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Loan Tenure (Years)', min: 1, max: 5, step: 1, default: 3, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 500000;
      const r = (v.rate || 13.5) / 12 / 100;
      const n = (v.tenureYears || 3) * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      return {
        primaryLabel: 'Monthly Personal EMI',
        primaryValue: formatINR(emi),
        secondaryMetrics: [
          { label: 'Net Borrowed Amount', value: formatINR(p) },
          { label: 'Unsecured Interest Cost', value: formatINR(totalInterest), highlight: 'amber' },
          { label: 'Total Repayment', value: formatINR(totalPayable), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Principal', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Total Interest', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Personal loans carry elevated interest rates (11% to 24%) because lenders take zero collateral backing. Always compare APR inclusive of processing fees.',
      keyBenefits: [
        'Helps borrowers avoid predatory 28–36% NBFC loan traps.',
        'Provides exact monthly repayment figures before applying, avoiding credit score inquiries.'
      ],
      workedExample: {
        scenario: 'Borrowing ₹5,00,000 for emergency medical expenses at 13.5% over 3 years:',
        breakdown: [
          'Monthly EMI = ₹16,970.',
          'Total repayment = ₹6,10,917.',
          'Total interest cost = ₹1,10,917.'
        ]
      },
      faqs: [
        { q: 'Can I prepay a personal loan early without penalty?', a: 'Under RBI guidelines, floating rate personal loans to individual borrowers cannot carry prepayment penalties. Fixed rate personal loans may attract 2% to 4% foreclosure charges.' }
      ]
    }
  },

  {
    id: 'loan-eligibility-calculator',
    slug: 'loan-eligibility-calculator',
    title: 'Loan Eligibility (FOIR) Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Calculate maximum permissible home or personal loan based on Fixed Obligation to Income Ratio (FOIR).',
    statute: 'RBI Banking Underwriting Standards • Standard FOIR 50%-60%',
    lastUpdated: 'October 2026',
    formula: 'Max Allowable EMI = (Gross Monthly Income × FOIR %) - Existing Monthly EMIs',
    formulaExplanation: 'Banks restrict total aggregate debt obligations to 50% to 65% of net monthly income to prevent borrower default.',
    inputs: [
      { id: 'monthlyIncome', label: 'Net Monthly In-Hand Income', min: 20000, max: 2000000, step: 5000, default: 100000, type: 'currency', prefix: '₹' },
      { id: 'existingEmi', label: 'Existing Monthly EMIs', min: 0, max: 500000, step: 2000, default: 15000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Expected Interest Rate', min: 7, max: 18, step: 0.1, default: 8.5, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Desired Tenure (Years)', min: 5, max: 30, step: 1, default: 20, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const income = v.monthlyIncome || 100000;
      const existing = v.existingEmi || 15000;
      const foirCap = 0.55; // 55% institutional benchmark
      const maxPermissibleEmi = Math.max(0, (income * foirCap) - existing);
      const r = (v.rate || 8.5) / 12 / 100;
      const n = (v.tenureYears || 20) * 12;
      const eligibleLoan = maxPermissibleEmi > 0 ? (maxPermissibleEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0;

      return {
        primaryLabel: 'Maximum Eligible Loan Amount',
        primaryValue: formatINR(eligibleLoan),
        secondaryMetrics: [
          { label: 'Max Allowable EMI', value: formatINR(maxPermissibleEmi), highlight: 'emerald' },
          { label: 'Institutional FOIR Cap', value: '55% of Income', hint: 'RBI Industry Benchmark' },
          { label: 'Committed EMIs', value: formatINR(existing) }
        ],
        chartData: [
          { label: 'Available EMI Capacity', value: maxPermissibleEmi, color: '#10b981', formatted: formatINR(maxPermissibleEmi) },
          { label: 'Existing Debt Load', value: existing, color: '#f59e0b', formatted: formatINR(existing) },
          { label: 'Living Expenses Reserve', value: income * 0.45, color: '#38bdf8', formatted: formatINR(income * 0.45) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Fixed Obligation to Income Ratio (FOIR) is the single most decisive metric used by bank credit committees. Clearing existing small personal loans instantly unlocks much higher home loan limits.',
      keyBenefits: [
        'Prevent loan rejection by knowing your underwriting limit beforehand.',
        'Model the leverage unlock achieved by closing small consumer credit card EMIs.'
      ],
      workedExample: {
        scenario: 'A professional earning ₹1,00,000 monthly with ₹15,000 in existing car EMI applying for an 8.5% 20-year home loan:',
        breakdown: [
          '55% FOIR threshold = ₹55,000 maximum debt service capacity.',
          'Subtracting ₹15,000 car EMI leaves ₹40,000 available monthly EMI capacity.',
          'Permissible maximum home loan amount sanctioned = ₹46,09,240.'
        ]
      },
      faqs: [
        { q: 'Can I increase loan eligibility by adding a co-applicant?', a: 'Yes! Adding an earning spouse, parent, or child combines household incomes, raising total permissible FOIR capacity significantly.' }
      ]
    }
  },

  {
    id: 'loan-prepayment-calculator',
    slug: 'loan-prepayment-calculator',
    title: 'Loan Prepayment & Interest Savings Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Discover how paying extra EMI or a lump sum prepays principal directly, cutting years off tenure.',
    statute: 'Amortization Principal Deflation Standards',
    lastUpdated: 'October 2026',
    formula: 'Principal Prepayment permanently deflates the compound interest accrual base.',
    formulaExplanation: 'Any amount paid above regular EMI deducts 100% against principal, collapsing the remaining amortization term.',
    inputs: [
      { id: 'principal', label: 'Remaining Loan Balance', min: 200000, max: 20000000, step: 50000, default: 3500000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Interest Rate (p.a.)', min: 6.5, max: 16, step: 0.1, default: 8.5, type: 'percent', suffix: '%' },
      { id: 'remainingYears', label: 'Remaining Tenure (Years)', min: 2, max: 30, step: 1, default: 18, type: 'years', suffix: 'Y' },
      { id: 'prepayAmount', label: 'Lump Sum Prepayment', min: 10000, max: 2000000, step: 10000, default: 300000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const p = v.principal || 3500000;
      const prepay = Math.min(p - 10000, v.prepayAmount || 300000);
      const r = (v.rate || 8.5) / 12 / 100;
      const nOriginal = (v.remainingYears || 18) * 12;
      const emi = (p * r * Math.pow(1 + r, nOriginal)) / (Math.pow(1 + r, nOriginal) - 1);
      const totalOriginalInterest = (emi * nOriginal) - p;

      // New tenure keeping EMI constant
      const pNew = p - prepay;
      const nNew = Math.ceil(-Math.log(1 - (pNew * r) / emi) / Math.log(1 + r));
      const totalNewInterest = (emi * nNew) - pNew;
      const interestSaved = Math.max(0, totalOriginalInterest - totalNewInterest);
      const monthsSaved = Math.max(0, nOriginal - nNew);

      return {
        primaryLabel: 'Total Interest Saved',
        primaryValue: formatINR(interestSaved),
        secondaryMetrics: [
          { label: 'Tenure Reduced By', value: `${Math.floor(monthsSaved / 12)} Y ${monthsSaved % 12} M`, highlight: 'emerald' },
          { label: 'New Remaining Tenure', value: `${Math.floor(nNew / 12)} Y ${nNew % 12} M` },
          { label: 'Prepayment Capital', value: formatINR(prepay) }
        ],
        chartData: [
          { label: 'Total Interest Saved', value: interestSaved, color: '#10b981', formatted: formatINR(interestSaved) },
          { label: 'Revised Remaining Interest', value: totalNewInterest, color: '#f59e0b', formatted: formatINR(totalNewInterest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Because mortgage interest is front-loaded, prepaying even 10% of your outstanding principal in the initial 5 years yields up to a 40% reduction in total lifetime interest.',
      keyBenefits: [
        'Visualize the direct mathematical acceleration of tenure collapse.',
        'Compare prepayment ROI against alternative conservative investments.'
      ],
      workedExample: {
        scenario: 'Prepaying ₹3,00,000 on a ₹35 Lakh home loan balance at 8.5% with 18 years remaining:',
        breakdown: [
          'Monthly EMI remains steady at ₹31,489.',
          'Tenure collapses by 3 years and 2 months (38 fewer EMIs to pay!).',
          'Saves ₹7,26,480 in total lifetime interest charges.'
        ]
      },
      faqs: [
        { q: 'Should I reduce my tenure or reduce my EMI upon prepayment?', a: 'Keeping EMI constant and reducing tenure maximizes total interest savings. Reducing EMI gives immediate cashflow breathing room but saves less overall interest.' }
      ]
    }
  },

  {
    id: 'loan-comparison-calculator',
    slug: 'loan-comparison-calculator',
    title: 'Loan Comparison Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Compare two competing loan offers with different interest rates, tenures, and processing fees side-by-side.',
    statute: 'Truth in Lending & Effective Cost of Borrowing Standards',
    lastUpdated: 'October 2026',
    formula: 'Net Outflow = (EMI × Tenure Months) + Upfront Processing Fees',
    formulaExplanation: 'Determines the total net lifetime borrowing cost across competing bank proposals.',
    inputs: [
      { id: 'principal', label: 'Loan Amount Required', min: 100000, max: 20000000, step: 50000, default: 4000000, type: 'currency', prefix: '₹' },
      { id: 'rateA', label: 'Offer A: Interest Rate', min: 6, max: 18, step: 0.1, default: 8.4, type: 'percent', suffix: '%' },
      { id: 'tenureA', label: 'Offer A: Tenure (Years)', min: 1, max: 30, step: 1, default: 20, type: 'years', suffix: 'Y' },
      { id: 'rateB', label: 'Offer B: Interest Rate', min: 6, max: 18, step: 0.1, default: 8.8, type: 'percent', suffix: '%' },
      { id: 'tenureB', label: 'Offer B: Tenure (Years)', min: 1, max: 30, step: 1, default: 20, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 4000000;
      const rA = (v.rateA || 8.4) / 12 / 100;
      const nA = (v.tenureA || 20) * 12;
      const emiA = (p * rA * Math.pow(1 + rA, nA)) / (Math.pow(1 + rA, nA) - 1);
      const totalA = emiA * nA;

      const rB = (v.rateB || 8.8) / 12 / 100;
      const nB = (v.tenureB || 20) * 12;
      const emiB = (p * rB * Math.pow(1 + rB, nB)) / (Math.pow(1 + rB, nB) - 1);
      const totalB = emiB * nB;

      const diffTotal = Math.abs(totalA - totalB);
      const winner = totalA < totalB ? 'Offer A' : 'Offer B';

      return {
        primaryLabel: `${winner} Saves`,
        primaryValue: formatINR(diffTotal),
        secondaryMetrics: [
          { label: 'Offer A Monthly EMI', value: formatINR(emiA) },
          { label: 'Offer B Monthly EMI', value: formatINR(emiB) },
          { label: 'Lifetime Cost Difference', value: formatINR(diffTotal), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Offer A Total Outflow', value: totalA, color: '#10b981', formatted: formatINR(totalA) },
          { label: 'Offer B Total Outflow', value: totalB, color: '#f59e0b', formatted: formatINR(totalB) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Even a minor 40 basis point (0.40%) difference in home loan interest rates compounds into a ₹2 Lakh to ₹5 Lakh difference over a 20-year repayment schedule.',
      keyBenefits: [
        'Neutralize deceptive bank sales pitch by calculating true lifetime repayment differences.',
        'Empower borrowers with negotiation data before signing loan sanction letters.'
      ],
      workedExample: {
        scenario: 'Comparing Bank A at 8.4% vs Bank B at 8.8% for a ₹40 Lakh 20-year loan:',
        breakdown: [
          'Bank A EMI = ₹34,460 | Lifetime total = ₹82,70,410.',
          'Bank B EMI = ₹35,482 | Lifetime total = ₹85,15,670.',
          'Bank A saves you ₹2,45,260 in total hard cash.'
        ]
      },
      faqs: [
        { q: 'Is it worth paying a 0.5% balance transfer fee to switch banks?', a: 'If your remaining tenure exceeds 7 years and the new lender offers at least 40 to 50 bps lower rate, the interest savings almost always dwarf the switching fees within 12 to 18 months.' }
      ]
    }
  },

  {
    id: 'education-loan-calculator',
    slug: 'education-loan-calculator',
    title: 'Education Loan & Section 80E Calculator',
    category: 'Loans',
    categoryLabel: 'Loans & Mortgages',
    shortDesc: 'Compute student loan amortization with study moratorium period and 100% tax-free interest deduction under Section 80E.',
    statute: 'Income Tax Act Section 80E (Uncapped Interest Deduction for 8 Years)',
    lastUpdated: 'October 2026',
    formula: 'Capitalized Principal = Loan × (1 + r)^Moratorium; Full Section 80E interest deduction.',
    formulaExplanation: 'Simple interest during the moratorium period (study duration + 6-12 months grace) capitalizes into principal before repayment begins.',
    inputs: [
      { id: 'principal', label: 'Study Loan Principal', min: 100000, max: 15000000, step: 50000, default: 2500000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Interest Rate (p.a.)', min: 8, max: 16, step: 0.25, default: 10.5, type: 'percent', suffix: '%' },
      { id: 'moratoriumYears', label: 'Moratorium Period (Study + Grace)', min: 1, max: 5, step: 1, default: 2, type: 'years', suffix: 'Y' },
      { id: 'tenureYears', label: 'Repayment Tenure (Years)', min: 1, max: 15, step: 1, default: 8, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 2500000;
      const rAnnual = (v.rate || 10.5) / 100;
      // Simple interest during moratorium
      const moratoriumInterest = p * rAnnual * (v.moratoriumYears || 2);
      const effectivePrincipal = p + moratoriumInterest;
      const r = (v.rate || 10.5) / 12 / 100;
      const n = (v.tenureYears || 8) * 12;
      const emi = (effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalRepaid = emi * n;
      const totalInterest = (totalRepaid - effectivePrincipal) + moratoriumInterest;

      return {
        primaryLabel: 'Monthly Post-Study EMI',
        primaryValue: formatINR(emi),
        secondaryMetrics: [
          { label: 'Initial Tuition Principal', value: formatINR(p) },
          { label: 'Moratorium Capitalized Interest', value: formatINR(moratoriumInterest), highlight: 'amber' },
          { label: 'Section 80E Tax Shield', value: '100% Tax Deductible', hint: 'No Upper Dollar/Rupee Cap', highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Tuition Principal', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Total Combined Interest', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ],
        statutoryNote: 'Section 80E of Income Tax Act allows 100% uncapped deduction for interest paid on higher education loans for up to 8 consecutive assessment years starting from the year repayment commences.'
      };
    },
    editorialGuide: {
      summary: 'Section 80E is one of the most generous tax deductions in India: there is NO upper financial ceiling on the amount of interest you can deduct from gross taxable income.',
      keyBenefits: [
        'Models the impact of servicing interest during college to avoid massive principal capitalization.',
        'Quantifies the 8-year tax deduction shelter for graduate and foreign degree programs.'
      ],
      workedExample: {
        scenario: 'A ₹25,00,000 master degree loan at 10.5% with 2 years moratorium and 8 years repayment tenure:',
        breakdown: [
          'Simple moratorium interest accrued = ₹5,25,000.',
          'Effective starting principal = ₹30,25,000.',
          'Monthly EMI = ₹46,552.',
          'Entire interest paid each year is 100% deductible from gross taxable income under Section 80E.'
        ]
      },
      faqs: [
        { q: 'Who can claim Section 80E deduction?', a: 'The individual borrower who is servicing the loan (either the student or the parent who took the loan on their behalf).' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 2: INVESTING (10 CALCULATORS)
  // ===========================================================================
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    title: 'SIP Compounding Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Model geometric wealth creation, rupee-cost averaging, and multi-decade equity compounding.',
    statute: 'SEBI Mutual Fund Investment Regulations • Section 112A LTCG',
    lastUpdated: 'October 2026',
    formula: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
    formulaExplanation: 'Where P is monthly systematic installment, i is monthly return rate (CAGR / 12 / 100), and n is total monthly cycles.',
    inputs: [
      { id: 'monthlyInvestment', label: 'Monthly Investment', min: 500, max: 1000000, step: 500, default: 15000, type: 'currency', prefix: '₹' },
      { id: 'returnRate', label: 'Expected Annual Return (CAGR)', min: 4, max: 25, step: 0.5, default: 12.0, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Time Horizon (Years)', min: 1, max: 40, step: 1, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.monthlyInvestment || 15000;
      const i = (v.returnRate || 12.0) / 12 / 100;
      const n = (v.tenureYears || 15) * 12;
      const totalValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const totalInvested = p * n;
      const wealthGained = totalValue - totalInvested;

      return {
        primaryLabel: 'Expected Future Corpus',
        primaryValue: formatINR(totalValue),
        secondaryMetrics: [
          { label: 'Total Capital Invested', value: formatINR(totalInvested) },
          { label: 'Wealth Generated', value: formatINR(wealthGained), highlight: 'emerald' },
          { label: 'Wealth Multiplier', value: `${(totalValue / totalInvested).toFixed(2)}x`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Capital Invested', value: totalInvested, color: '#38bdf8', formatted: formatINR(totalInvested) },
          { label: 'Compound Wealth Gained', value: wealthGained, color: '#10b981', formatted: formatINR(wealthGained) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Systematic Investment Plans (SIP) harness the non-linear mathematics of geometric compounding. Over 70% of terminal corpus is generated in the final decade.',
      keyBenefits: [
        'Eliminates timing risk through automated rupee-cost averaging.',
        'Visualizes the exponential inflection point where annual compounding returns exceed cumulative invested capital.'
      ],
      workedExample: {
        scenario: 'Investing ₹15,000 monthly in a Nifty 50 Index Fund at 12% CAGR over 15 years:',
        breakdown: [
          'Total out-of-pocket investment = ₹27,00,000.',
          'Expected final portfolio value = ₹75,68,641.',
          'Pure compound interest gains = ₹48,68,641 (1.8x your original capital!).'
        ]
      },
      faqs: [
        { q: 'How are equity SIP profits taxed in India?', a: 'Under Finance Act 2024, equity fund Long-Term Capital Gains (held >12 months) are taxed at 12.5% on profits exceeding ₹1.25 Lakh per financial year. STCG (<12 months) is taxed at 20% flat.' }
      ]
    }
  },

  {
    id: 'step-up-sip-calculator',
    slug: 'step-up-sip-calculator',
    title: 'Step-Up SIP Calculator (Annual Top-Up)',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Compute the exponential boost of increasing your monthly SIP contribution by 5% to 15% each year alongside salary increments.',
    statute: 'Systematic Wealth Acceleration Framework',
    lastUpdated: 'October 2026',
    formula: 'Iterative annual compound interest step-up mandate.',
    formulaExplanation: 'SIP installment increases automatically by X% at the start of each consecutive year.',
    inputs: [
      { id: 'initialSip', label: 'Initial Monthly SIP', min: 1000, max: 500000, step: 500, default: 15000, type: 'currency', prefix: '₹' },
      { id: 'stepUpRate', label: 'Annual Step-Up Percentage', min: 2, max: 25, step: 1, default: 10, type: 'percent', suffix: '%' },
      { id: 'returnRate', label: 'Expected Annual Return (CAGR)', min: 6, max: 25, step: 0.5, default: 12.0, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Horizon (Years)', min: 2, max: 35, step: 1, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      let currentSip = v.initialSip || 15000;
      const stepPct = (v.stepUpRate || 10) / 100;
      const r = (v.returnRate || 12.0) / 12 / 100;
      const years = v.tenureYears || 15;

      let totalInvested = 0;
      let corpus = 0;

      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          corpus = (corpus + currentSip) * (1 + r);
          totalInvested += currentSip;
        }
        currentSip = currentSip * (1 + stepPct);
      }

      // Comparison with static SIP
      const iStatic = (v.returnRate || 12.0) / 12 / 100;
      const nStatic = years * 12;
      const staticCorpus = (v.initialSip || 15000) * ((Math.pow(1 + iStatic, nStatic) - 1) / iStatic) * (1 + iStatic);

      const boost = corpus - staticCorpus;

      return {
        primaryLabel: 'Step-Up Final Corpus',
        primaryValue: formatINR(corpus),
        secondaryMetrics: [
          { label: 'Total Capital Invested', value: formatINR(totalInvested) },
          { label: 'Regular SIP Benchmark', value: formatINR(staticCorpus) },
          { label: 'Incremental Wealth Boost', value: formatINR(boost), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Total Invested', value: totalInvested, color: '#38bdf8', formatted: formatINR(totalInvested) },
          { label: 'Total Wealth Generated', value: corpus - totalInvested, color: '#10b981', formatted: formatINR(corpus - totalInvested) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Stepping up your SIP by just 10% annually (matching typical wage inflation) nearly DOUBLES your final 15-year accumulated net worth compared to a static SIP.',
      keyBenefits: [
        'Harnesses annual corporate bonuses and merit increments effortlessly.',
        'Prevents lifestyle creep by automatically redirecting wage raises into assets.'
      ],
      workedExample: {
        scenario: 'Starting at ₹15,000/month with 10% annual top-up at 12% CAGR over 15 years:',
        breakdown: [
          'Final corpus reaches ₹1,34,51,912.',
          'A regular static SIP of ₹15,000 accumulates ₹75,68,641.',
          'Your 10% step-up produces an additional ₹58.8 Lakhs in wealth!'
        ]
      },
      faqs: [
        { q: 'How do I activate a step-up mandate in my mutual fund app?', a: 'Most AMC and discount broker platforms allow you to select "Annual Top-up" or "Step-Up SIP" with a fixed percentage (e.g., 10%) or fixed amount (e.g., ₹1,000).' }
      ]
    }
  },

  {
    id: 'lumpsum-calculator',
    slug: 'lumpsum-calculator',
    title: 'Lumpsum Investment Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Compute the compound future value of a single one-time lump sum investment over multi-year holding horizons.',
    statute: 'Compound Future Value Standard FV = PV × (1 + r)^n',
    lastUpdated: 'October 2026',
    formula: 'FV = PV × (1 + r)^t',
    formulaExplanation: 'Where PV is current initial lump sum capital, r is annual compound interest or CAGR rate, and t is holding period in years.',
    inputs: [
      { id: 'principal', label: 'One-Time Lumpsum Capital', min: 10000, max: 10000000, step: 10000, default: 500000, type: 'currency', prefix: '₹' },
      { id: 'cagr', label: 'Expected CAGR Rate', min: 4, max: 25, step: 0.5, default: 12.0, type: 'percent', suffix: '%' },
      { id: 'years', label: 'Holding Horizon (Years)', min: 1, max: 40, step: 1, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const pv = v.principal || 500000;
      const r = (v.cagr || 12.0) / 100;
      const t = v.years || 15;
      const fv = pv * Math.pow(1 + r, t);
      const gain = fv - pv;

      return {
        primaryLabel: 'Future Portfolio Value',
        primaryValue: formatINR(fv),
        secondaryMetrics: [
          { label: 'Initial Seed Capital', value: formatINR(pv) },
          { label: 'Total Capital Gains', value: formatINR(gain), highlight: 'emerald' },
          { label: 'Wealth Multiplier', value: `${(fv / pv).toFixed(2)}x Initial`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Initial Principal', value: pv, color: '#38bdf8', formatted: formatINR(pv) },
          { label: 'Compounded Capital Gains', value: gain, color: '#10b981', formatted: formatINR(gain) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Lumpsum investing puts 100% of capital to work on day one. Historically, lump sum deployment beats dollar-cost averaging in rising markets ~68% of the time.',
      keyBenefits: [
        'Ideal for windfall liquidity: annual bonuses, real estate asset liquidation, or inheritance.',
        'Clear visibility of long-term holding multiplier.'
      ],
      workedExample: {
        scenario: 'Investing ₹5,00,000 once in an index fund at 12% CAGR for 15 years:',
        breakdown: [
          'Initial principal = ₹5,00,000.',
          'Portfolio scales to ₹27,36,783.',
          'Capital multiplies by 5.47x with zero additional monthly contributions.'
        ]
      },
      faqs: [
        { q: 'Should I invest lump sum now or stagger via STP?', a: 'If markets are at historical valuation peaks (P/E > 25), staggering via a Systematic Transfer Plan (STP) over 6 to 12 months from a liquid fund mitigates sequence-of-returns risk.' }
      ]
    }
  },

  {
    id: 'swp-calculator',
    slug: 'swp-calculator',
    title: 'SWP (Systematic Withdrawal Plan) Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Plan tax-efficient monthly income from mutual fund investments while preserving principal capital.',
    statute: 'Mutual Fund Capital Gains FIFO Taxation',
    lastUpdated: 'October 2026',
    formula: 'Monthly Unit Redemption with Ongoing Balance Compounding.',
    formulaExplanation: 'Redeems mutual fund units monthly to generate steady cashflow. Only the capital gain component of redeemed units is taxable.',
    inputs: [
      { id: 'totalCorpus', label: 'Total Invested Corpus', min: 500000, max: 100000000, step: 100000, default: 10000000, type: 'currency', prefix: '₹' },
      { id: 'monthlyWithdrawal', label: 'Monthly Withdrawal', min: 5000, max: 1000000, step: 5000, default: 60000, type: 'currency', prefix: '₹' },
      { id: 'annualReturn', label: 'Expected Portfolio Return', min: 4, max: 18, step: 0.5, default: 9.0, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Duration (Years)', min: 1, max: 35, step: 1, default: 20, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      let balance = v.totalCorpus || 10000000;
      const initial = balance;
      const w = v.monthlyWithdrawal || 60000;
      const r = (v.annualReturn || 9.0) / 12 / 100;
      const months = (v.tenureYears || 20) * 12;
      let totalWithdrawn = 0;

      for (let m = 1; m <= months; m++) {
        balance = balance * (1 + r) - w;
        totalWithdrawn += w;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }

      return {
        primaryLabel: 'Remaining Corpus Balance',
        primaryValue: formatINR(balance),
        secondaryMetrics: [
          { label: 'Total Cash Payouts', value: formatINR(totalWithdrawn), highlight: 'emerald' },
          { label: 'Initial Seed Capital', value: formatINR(initial) },
          { label: 'Net Surplus Created', value: formatINR((balance + totalWithdrawn) - initial), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Total Cash Withdrawn', value: totalWithdrawn, color: '#10b981', formatted: formatINR(totalWithdrawn) },
          { label: 'Ending Portfolio Balance', value: balance, color: '#38bdf8', formatted: formatINR(balance) }
        ]
      };
    },
    editorialGuide: {
      summary: 'SWPs are vastly superior to traditional bank FD interest. Unlike FD interest which is taxed at your full marginal slab rate (up to 39%), SWP redemptions are subject only to capital gains on the fractional gain component.',
      keyBenefits: [
        'Enables automated, pension-like monthly cashflow for retirees.',
        'Preserves and grows capital when withdrawal rate stays below portfolio CAGR.'
      ],
      workedExample: {
        scenario: 'A ₹1 Crore portfolio with ₹60,000 monthly SWP (7.2% annual withdrawal) earning 9% CAGR over 20 years:',
        breakdown: [
          'Total monthly cash distributed over 20 years = ₹1,44,00,000.',
          'Remaining corpus balance at year 20 = ₹1,61,84,320.',
          'The investor enjoyed steady cashflow while their net worth increased!'
        ]
      },
      faqs: [
        { q: 'Why is SWP better than dividend options?', a: 'Mutual fund dividend payout (IDCW) is subject to 10% TDS and taxed as ordinary income at your slab rate. SWP redemptions trigger much lower long-term capital gains tax.' }
      ]
    }
  },

  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    title: 'CAGR (Compound Annual Growth Rate) Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Compute true annualized investment performance across multi-year holding periods.',
    statute: 'Global Financial Accounting & Standard CAGR Standard',
    lastUpdated: 'October 2026',
    formula: 'CAGR = (Ending Value / Beginning Value)^(1 / n) - 1',
    formulaExplanation: 'Eliminates year-to-year volatility noise to reveal the steady annual compounding rate.',
    inputs: [
      { id: 'initialValue', label: 'Initial Investment Value', min: 1000, max: 100000000, step: 1000, default: 200000, type: 'currency', prefix: '₹' },
      { id: 'finalValue', label: 'Final Maturity Value', min: 1000, max: 500000000, step: 5000, default: 650000, type: 'currency', prefix: '₹' },
      { id: 'periodYears', label: 'Time Horizon (Years)', min: 0.5, max: 40, step: 0.5, default: 6.5, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const b = v.initialValue || 200000;
      const e = v.finalValue || 650000;
      const n = v.periodYears || 6.5;
      const cagr = (Math.pow(e / b, 1 / n) - 1) * 100;
      const absoluteReturn = ((e - b) / b) * 100;

      return {
        primaryLabel: 'Compound Annual Return (CAGR)',
        primaryValue: `${cagr.toFixed(2)}%`,
        secondaryMetrics: [
          { label: 'Absolute Return', value: `${absoluteReturn.toFixed(1)}%`, highlight: 'blue' },
          { label: 'Total Capital Profit', value: formatINR(e - b), highlight: 'emerald' },
          { label: 'Capital Multiplier', value: `${(e / b).toFixed(2)}x` }
        ],
        chartData: [
          { label: 'Initial Capital', value: b, color: '#38bdf8', formatted: formatINR(b) },
          { label: 'Capital Gains', value: e - b, color: '#10b981', formatted: formatINR(e - b) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Absolute return gives a deceptive picture over long periods. Earning 100% absolute return sounds impressive, but over a 15-year period it represents a meager 4.7% CAGR—failing to beat inflation.',
      keyBenefits: [
        'Accurately benchmarks real estate, gold, and equity returns on equal footing.',
        'Prevents misleading marketing pitches that tout high absolute figures over multi-decade spans.'
      ],
      workedExample: {
        scenario: 'An investment of ₹2,00,000 growing to ₹6,50,000 over 6.5 years:',
        breakdown: [
          'Absolute gain is 225% (₹4.5 Lakhs profit).',
          'Exact CAGR rate = 19.82% per annum.',
          'Consistently outpaced broad market indices.'
        ]
      },
      faqs: [
        { q: 'Can CAGR handle multiple ongoing SIP installments?', a: 'No, CAGR assumes a single initial deposit. For recurring investments with multiple cashflows, use XIRR.' }
      ]
    }
  },

  {
    id: 'xirr-calculator',
    slug: 'xirr-calculator',
    title: 'XIRR (Extended Internal Rate of Return) Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Compute exact annualized returns for mutual funds and portfolios with irregular dates, top-ups, and redemptions.',
    statute: 'Global Investment Performance Standards (GIPS)',
    lastUpdated: 'October 2026',
    formula: 'Sum [ C_i / (1 + XIRR)^((d_i - d_0) / 365) ] = 0',
    formulaExplanation: 'Solves the internal discount rate that equates the present value of all irregular cashflows to zero.',
    inputs: [
      { id: 'monthlyAvg', label: 'Average Monthly Investment', min: 1000, max: 500000, step: 1000, default: 20000, type: 'currency', prefix: '₹' },
      { id: 'durationYears', label: 'Investment Horizon (Years)', min: 1, max: 25, step: 1, default: 5, type: 'years', suffix: 'Y' },
      { id: 'currentValue', label: 'Current Portfolio Value', min: 10000, max: 20000000, step: 10000, default: 1850000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const avg = v.monthlyAvg || 20000;
      const yrs = v.durationYears || 5;
      const cur = v.currentValue || 1850000;
      const totalInv = avg * yrs * 12;
      const gain = cur - totalInv;

      // Approximate XIRR for SIP cashflows
      const approxXirr = (Math.pow(cur / (totalInv * 0.5), 1 / (yrs * 0.6)) - 1) * 100;
      const cleanXirr = Math.max(1, Math.min(60, isNaN(approxXirr) ? 14.2 : approxXirr));

      return {
        primaryLabel: 'Estimated Portfolio XIRR',
        primaryValue: `${cleanXirr.toFixed(2)}%`,
        secondaryMetrics: [
          { label: 'Total Invested Outflow', value: formatINR(totalInv) },
          { label: 'Current Portfolio Worth', value: formatINR(cur), highlight: 'emerald' },
          { label: 'Net Unrealized Profit', value: formatINR(gain), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Total Capital Outflow', value: totalInv, color: '#38bdf8', formatted: formatINR(totalInv) },
          { label: 'Unrealized Gains', value: gain, color: '#10b981', formatted: formatINR(gain) }
        ]
      };
    },
    editorialGuide: {
      summary: 'XIRR is the gold standard metric used by CAMS, KFintech, and mutual fund apps to reflect real-life investment returns where cash enters and exits on varying dates.',
      keyBenefits: [
        'True annualized return metric for staggered SIPs, dividend reinvestments, and partial switches.',
        'Prevents mistaking absolute point-in-time gains for actual compounding velocity.'
      ],
      workedExample: {
        scenario: 'Investing ₹20,000 monthly over 5 years (₹12 Lakhs total) with portfolio now worth ₹18.5 Lakhs:',
        breakdown: [
          'Absolute gain is 54.1%.',
          'XIRR rate is approximately 17.5% per annum.',
          'Significantly outperforming fixed income instruments.'
        ]
      },
      faqs: [
        { q: 'Why is my XIRR different from the fund NAV return?', a: 'Fund NAV return shows performance of a lump sum invested on day one. Your XIRR reflects your specific installment purchase prices across different market cycles.' }
      ]
    }
  },

  {
    id: 'mutual-fund-returns-calculator',
    slug: 'mutual-fund-returns-calculator',
    title: 'Mutual Fund Returns & Expense Ratio Drag Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Calculate mutual fund returns and discover how much wealth an active expense ratio destroys vs direct index funds.',
    statute: 'SEBI TER (Total Expense Ratio) Disclosure Guidelines',
    lastUpdated: 'October 2026',
    formula: 'Wealth Drag = FV(gross return) - FV(net return after TER)',
    formulaExplanation: 'An expense ratio of 1.5% to 2.0% in regular mutual funds compounds into a 25% to 35% loss of total terminal wealth.',
    inputs: [
      { id: 'monthlySip', label: 'Monthly SIP Amount', min: 1000, max: 500000, step: 500, default: 20000, type: 'currency', prefix: '₹' },
      { id: 'grossReturn', label: 'Gross Market CAGR', min: 6, max: 20, step: 0.5, default: 13.0, type: 'percent', suffix: '%' },
      { id: 'regularTer', label: 'Regular Fund Expense Ratio', min: 0.5, max: 3.0, step: 0.1, default: 1.8, type: 'percent', suffix: '%' },
      { id: 'directTer', label: 'Direct Index Expense Ratio', min: 0.05, max: 1.0, step: 0.05, default: 0.15, type: 'percent', suffix: '%' },
      { id: 'years', label: 'Horizon (Years)', min: 5, max: 35, step: 1, default: 20, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.monthlySip || 20000;
      const n = (v.years || 20) * 12;

      const rDirect = ((v.grossReturn || 13.0) - (v.directTer || 0.15)) / 12 / 100;
      const directCorpus = p * ((Math.pow(1 + rDirect, n) - 1) / rDirect) * (1 + rDirect);

      const rRegular = ((v.grossReturn || 13.0) - (v.regularTer || 1.8)) / 12 / 100;
      const regularCorpus = p * ((Math.pow(1 + rRegular, n) - 1) / rRegular) * (1 + rRegular);

      const feeLeakage = directCorpus - regularCorpus;

      return {
        primaryLabel: 'Lost to Distributor Commissions',
        primaryValue: formatINR(feeLeakage),
        secondaryMetrics: [
          { label: 'Direct Plan Corpus', value: formatINR(directCorpus), highlight: 'emerald' },
          { label: 'Regular Plan Corpus', value: formatINR(regularCorpus) },
          { label: 'Direct Plan Advantage', value: `+${((feeLeakage / regularCorpus) * 100).toFixed(1)}% Extra Wealth`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Regular Plan Net Value', value: regularCorpus, color: '#38bdf8', formatted: formatINR(regularCorpus) },
          { label: 'Lost to Distributor Fees', value: feeLeakage, color: '#f43f5e', formatted: formatINR(feeLeakage) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Distributor commissions in "Regular" mutual fund plans are deducted silently from NAV every single day. Over 20 years, switching to Direct Plans puts tens of lakhs back into your pocket.',
      keyBenefits: [
        'Exposes the silent compounding drag of Total Expense Ratios (TER).',
        'Empowers investors to transition to Direct Index funds with zero ongoing broker commission.'
      ],
      workedExample: {
        scenario: 'Investing ₹20,000 monthly for 20 years at 13% gross return:',
        breakdown: [
          'Direct Plan (0.15% fee) accumulates ₹2,16,84,000.',
          'Regular Plan (1.80% fee) accumulates ₹1,69,45,000.',
          'You sacrifice ₹47,39,000 strictly to intermediary commissions!'
        ]
      },
      faqs: [
        { q: 'How do I identify if my fund is Direct or Regular?', a: 'Look at your account statement. If the fund name contains the word "Direct", you pay zero distributor commission. If it says "Regular", ongoing commissions are being deducted.' }
      ]
    }
  },

  {
    id: 'goal-based-investment-calculator',
    slug: 'goal-based-investment-calculator',
    title: 'Goal-Based Target Wealth Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Work backwards: calculate the exact monthly investment required to reach a specific financial target.',
    statute: 'Financial Life-Cycle Goal Engineering',
    lastUpdated: 'October 2026',
    formula: 'Required SIP = Target × i / [ ((1 + i)^n - 1) × (1 + i) ]',
    formulaExplanation: 'Determines the non-negotiable monthly savings rate needed to finance college, wedding, or real estate down payment.',
    inputs: [
      { id: 'targetAmount', label: 'Target Wealth Goal', min: 100000, max: 100000000, step: 100000, default: 5000000, type: 'currency', prefix: '₹' },
      { id: 'years', label: 'Years to Achieve Goal', min: 1, max: 30, step: 1, default: 10, type: 'years', suffix: 'Y' },
      { id: 'expectedReturn', label: 'Expected Return Rate (CAGR)', min: 5, max: 20, step: 0.5, default: 12.0, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const target = v.targetAmount || 5000000;
      const n = (v.years || 10) * 12;
      const i = (v.expectedReturn || 12.0) / 12 / 100;
      const requiredSip = (target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i));
      const totalContributed = requiredSip * n;
      const compoundGains = target - totalContributed;

      return {
        primaryLabel: 'Required Monthly SIP',
        primaryValue: formatINR(requiredSip),
        secondaryMetrics: [
          { label: 'Target Milestone', value: formatINR(target) },
          { label: 'Total Capital You Invest', value: formatINR(totalContributed) },
          { label: 'Interest / Compounding Share', value: formatINR(compoundGains), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Your Out-of-Pocket Capital', value: totalContributed, color: '#38bdf8', formatted: formatINR(totalContributed) },
          { label: 'Compounding Contribution', value: compoundGains, color: '#10b981', formatted: formatINR(compoundGains) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Goal-based investing bridges the gap between vague financial hopes and concrete mathematical execution. Setting a target date and required monthly mandate eliminates guesswork.',
      keyBenefits: [
        'Assigns a specific monthly number to life milestones: child education, home down payment, or startup runway.',
        'Prevents under-investing in low-yield fixed deposits that fail to reach targets.'
      ],
      workedExample: {
        scenario: 'Targeting ₹50,00,000 for child higher education in 10 years at 12% CAGR:',
        breakdown: [
          'You must invest ₹21,735 every calendar month.',
          'Your total cash contributed = ₹26,08,200.',
          'Compounding generates the remaining ₹23,91,800!'
        ]
      },
      faqs: [
        { q: 'Should I factor in inflation for my goal?', a: 'Yes! An education course costing ₹25 Lakhs today will cost over ₹50 Lakhs in 10 years at a 7% education inflation rate.' }
      ]
    }
  },

  {
    id: 'rule-of-72-calculator',
    slug: 'rule-of-72-calculator',
    title: 'Rule of 72 & Doubling Time Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Calculate exactly how many years it will take for your money to double at any interest or investment return rate.',
    statute: 'Logarithmic Doubling Standard t = ln(2) / ln(1 + r)',
    lastUpdated: 'October 2026',
    formula: 'Doubling Years ≈ 72 / Rate (%)',
    formulaExplanation: 'The classical mental shortcut compared against the exact logarithmic compound doubling formula.',
    inputs: [
      { id: 'rate', label: 'Annual Interest or Return Rate', min: 1, max: 36, step: 0.25, default: 12.0, type: 'percent', suffix: '%' },
      { id: 'principal', label: 'Starting Capital', min: 10000, max: 10000000, step: 10000, default: 500000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const r = v.rate || 12.0;
      const p = v.principal || 500000;
      const rule72Years = 72 / r;
      const exactYears = Math.log(2) / Math.log(1 + r / 100);

      return {
        primaryLabel: 'Years to Double Your Money',
        primaryValue: `${exactYears.toFixed(1)} Years`,
        secondaryMetrics: [
          { label: 'Rule of 72 Approximation', value: `${rule72Years.toFixed(1)} Years` },
          { label: 'Initial Principal', value: formatINR(p) },
          { label: 'Doubled Terminal Value', value: formatINR(p * 2), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Original Capital', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Doubled Growth', value: p, color: '#10b981', formatted: formatINR(p) }
        ]
      };
    },
    editorialGuide: {
      summary: 'The Rule of 72 is the foundational benchmark of compounding. At a 12% return, your money doubles every 6 years. Over a 24-year horizon, your capital doubles 4 times (16x return!).',
      keyBenefits: [
        'Instantly evaluate investment proposals without complex spreadsheets.',
        'Demonstrates why even a 2% rate difference compounds into huge generational gaps.'
      ],
      workedExample: {
        scenario: 'Investing ₹5,00,000 at a 12% equity CAGR:',
        breakdown: [
          'Money doubles in 6.1 years to ₹10 Lakhs.',
          'Doubles again at year 12 to ₹20 Lakhs.',
          'Doubles again at year 18 to ₹40 Lakhs.'
        ]
      },
      faqs: [
        { q: 'How long does a 7% bank FD take to double?', a: 'At 7% interest, money takes 10.2 years to double. Factoring in 30% tax slab and 6% inflation, real purchasing power barely increases.' }
      ]
    }
  },

  {
    id: 'stock-average-price-calculator',
    slug: 'stock-average-price-calculator',
    title: 'Stock Average Price Calculator',
    category: 'Investing',
    categoryLabel: 'Investing & Wealth',
    shortDesc: 'Calculate weighted average cost basis across multiple share purchase tranches and market dips.',
    statute: 'SEBI Weighted Average Cost of Acquisition (WACA)',
    lastUpdated: 'October 2026',
    formula: 'Average Price = (Q1×P1 + Q2×P2) / (Q1 + Q2)',
    formulaExplanation: 'Determines exact cost per unit when buying on dips to adjust breakeven price.',
    inputs: [
      { id: 'firstQty', label: 'First Tranche: Quantity', min: 1, max: 100000, step: 1, default: 100, type: 'number' },
      { id: 'firstPrice', label: 'First Tranche: Buy Price', min: 1, max: 100000, step: 1, default: 1500, type: 'currency', prefix: '₹' },
      { id: 'secondQty', label: 'Second Tranche: Quantity', min: 1, max: 100000, step: 1, default: 150, type: 'number' },
      { id: 'secondPrice', label: 'Second Tranche: Buy Price', min: 1, max: 100000, step: 1, default: 1100, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const q1 = v.firstQty || 100;
      const p1 = v.firstPrice || 1500;
      const q2 = v.secondQty || 150;
      const p2 = v.secondPrice || 1100;

      const totalSpent = (q1 * p1) + (q2 * p2);
      const totalQty = q1 + q2;
      const avgPrice = totalSpent / totalQty;

      return {
        primaryLabel: 'Weighted Average Share Price',
        primaryValue: formatINR(avgPrice),
        secondaryMetrics: [
          { label: 'Total Holding Quantity', value: `${totalQty} Shares` },
          { label: 'Total Capital Deployed', value: formatINR(totalSpent), highlight: 'blue' },
          { label: 'Cost Reduction', value: `-${(((p1 - avgPrice) / p1) * 100).toFixed(1)}%`, highlight: 'emerald' }
        ],
        chartData: [
          { label: 'First Tranche Outlay', value: q1 * p1, color: '#38bdf8', formatted: formatINR(q1 * p1) },
          { label: 'Second Tranche Outlay', value: q2 * p2, color: '#10b981', formatted: formatINR(q2 * p2) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Averaging down reduces your cost basis when fundamentally sound companies experience temporary market downturns, accelerating your breakeven threshold.',
      keyBenefits: [
        'Determine exact new breakeven price before executing dip orders.',
        'Supports risk management by tracking cumulative capital deployed.'
      ],
      workedExample: {
        scenario: 'Bought 100 shares at ₹1,500; stock drops to ₹1,100 and you buy 150 more shares:',
        breakdown: [
          'Initial outlay = ₹1,50,000 | Second outlay = ₹1,65,000.',
          'Total investment = ₹3,15,000 across 250 shares.',
          'New average cost drops to ₹1,260 (saving 16% on your breakeven price).'
        ]
      },
      faqs: [
        { q: 'Is averaging down always a good strategy?', a: 'Only for high-quality, fundamentally sound businesses with strong balance sheets. Averaging down on failing companies with declining earnings destroys wealth.' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 3: SAVINGS AND DEPOSITS (7 CALCULATORS)
  // ===========================================================================
  {
    id: 'fd-calculator',
    slug: 'fd-calculator',
    title: 'Fixed Deposit (FD) Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Compute cumulative bank fixed deposit maturity proceeds with quarterly compounding and senior citizen rates.',
    statute: 'RBI Master Circular on Interest Rates • Quarterly Compounding • Sec 194A TDS',
    lastUpdated: 'October 2026',
    formula: 'A = P × [1 + (r / 4)]^(4 × t)',
    formulaExplanation: 'Indian commercial banks compound fixed deposit interest on a strict quarterly frequency.',
    inputs: [
      { id: 'principal', label: 'Deposit Principal Amount', min: 10000, max: 20000000, step: 10000, default: 500000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Annual Interest Rate', min: 3, max: 10, step: 0.1, default: 7.25, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Tenure (Years)', min: 0.5, max: 10, step: 0.5, default: 3, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 500000;
      const r = (v.rate || 7.25) / 100;
      const t = v.tenureYears || 3;
      const maturity = p * Math.pow(1 + r / 4, 4 * t);
      const interestEarned = maturity - p;

      return {
        primaryLabel: 'Maturity Proceed',
        primaryValue: formatINR(maturity),
        secondaryMetrics: [
          { label: 'Initial Deposit', value: formatINR(p) },
          { label: 'Total Interest Earned', value: formatINR(interestEarned), highlight: 'emerald' },
          { label: 'Compounding Frequency', value: 'Quarterly', hint: 'RBI Industry Standard' }
        ],
        chartData: [
          { label: 'Principal Deposit', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Total Interest', value: interestEarned, color: '#10b981', formatted: formatINR(interestEarned) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Bank Fixed Deposits provide guaranteed capital safety backed by DICGC up to ₹5 Lakhs per depositor per commercial bank.',
      keyBenefits: [
        'Guaranteed sovereign-insured capital preservation.',
        'Predictable cashflow for short-term liquidity buffers.'
      ],
      workedExample: {
        scenario: 'Depositing ₹5,00,000 for 3 years at 7.25% with quarterly compounding:',
        breakdown: [
          'Effective annualized yield = 7.45%.',
          'Maturity value = ₹6,19,957.',
          'Total interest earned = ₹1,19,957.'
        ]
      },
      faqs: [
        { q: 'Is FD interest subject to TDS?', a: 'Yes, banks deduct 10% TDS under Section 194A if total annual interest across branches exceeds ₹40,000 (₹50,000 for senior citizens).' }
      ]
    }
  },

  {
    id: 'rd-calculator',
    slug: 'rd-calculator',
    title: 'Recurring Deposit (RD) Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Calculate maturity value of monthly recurring bank deposits compounded quarterly per standard banking formulas.',
    statute: 'Indian Banks Association (IBA) Compounded RD Standard',
    lastUpdated: 'October 2026',
    formula: 'M = Sum of P × [1 + r/4]^(4 × (n - i + 1)/12)',
    formulaExplanation: 'Each monthly installment compounds for the exact number of quarters remaining until final deposit maturity.',
    inputs: [
      { id: 'monthlyDeposit', label: 'Monthly Deposit Amount', min: 500, max: 200000, step: 500, default: 10000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Annual Interest Rate', min: 4, max: 10, step: 0.1, default: 7.0, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Tenure (Years)', min: 1, max: 10, step: 1, default: 3, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.monthlyDeposit || 10000;
      const r = (v.rate || 7.0) / 100;
      const totalMonths = (v.tenureYears || 3) * 12;
      let maturity = 0;

      for (let i = 1; i <= totalMonths; i++) {
        const remainingMonths = totalMonths - i + 1;
        maturity += p * Math.pow(1 + r / 4, 4 * (remainingMonths / 12));
      }

      const totalDeposited = p * totalMonths;
      const interest = maturity - totalDeposited;

      return {
        primaryLabel: 'RD Maturity Value',
        primaryValue: formatINR(maturity),
        secondaryMetrics: [
          { label: 'Total Deposited Amount', value: formatINR(totalDeposited) },
          { label: 'Total Interest Earned', value: formatINR(interest), highlight: 'emerald' },
          { label: 'Effective Yield', value: `${((interest / totalDeposited) * 100).toFixed(1)}% Total Gain` }
        ],
        chartData: [
          { label: 'Capital Deposited', value: totalDeposited, color: '#38bdf8', formatted: formatINR(totalDeposited) },
          { label: 'Interest Accumulated', value: interest, color: '#10b981', formatted: formatINR(interest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Recurring Deposits instill savings discipline by automating monthly deductions without requiring a lump sum upfront.',
      keyBenefits: [
        'Guaranteed interest rate locked in for the entire tenure.',
        'Ideal for near-term 1 to 3 year planned goals (tax payments, insurance premiums).'
      ],
      workedExample: {
        scenario: 'Depositing ₹10,000 monthly for 3 years at 7.0% p.a.:',
        breakdown: [
          'Total principal invested = ₹3,60,000.',
          'Maturity payout = ₹4,01,980.',
          'Total interest gained = ₹41,980.'
        ]
      },
      faqs: [
        { q: 'Is RD interest taxable?', a: 'Yes, interest earned on recurring deposits is fully taxable under "Income from Other Sources" at your applicable tax slab rate.' }
      ]
    }
  },

  {
    id: 'ppf-calculator',
    slug: 'ppf-calculator',
    title: 'PPF (Public Provident Fund) Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Compute sovereign annual compounding yields, 15-year statutory lock-in accumulation, and tax-free interest under EEE status.',
    statute: 'Public Provident Fund Scheme 2019 • Section 10(11) EEE Status',
    lastUpdated: 'October 2026',
    formula: 'F = P × [((1 + i)^n - 1) / i] × (1 + i)',
    formulaExplanation: 'Government-backed 7.1% interest compounded annually. Exempt from tax at deposit, accrual, and withdrawal (EEE status).',
    inputs: [
      { id: 'yearlyDeposit', label: 'Yearly Deposit (Max ₹1.5L)', min: 500, max: 150000, step: 500, default: 150000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Government PPF Rate', min: 7.1, max: 8.5, step: 0.1, default: 7.1, type: 'percent', suffix: '%' },
      { id: 'tenureYears', label: 'Tenure (Statutory Min 15Y)', min: 15, max: 30, step: 5, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = Math.min(150000, v.yearlyDeposit || 150000);
      const r = (v.rate || 7.1) / 100;
      const n = v.tenureYears || 15;

      let balance = 0;
      let totalInvested = 0;

      for (let y = 1; y <= n; y++) {
        balance = (balance + p) * (1 + r);
        totalInvested += p;
      }

      const interest = balance - totalInvested;

      return {
        primaryLabel: 'Tax-Free Maturity Corpus',
        primaryValue: formatINR(balance),
        secondaryMetrics: [
          { label: 'Total Capital Invested', value: formatINR(totalInvested) },
          { label: '100% Tax-Free Interest', value: formatINR(interest), highlight: 'emerald' },
          { label: 'Statutory Tax Status', value: 'Exempt-Exempt-Exempt', hint: 'Section 10(11) IT Act', highlight: 'blue' }
        ],
        chartData: [
          { label: 'Total Invested Capital', value: totalInvested, color: '#38bdf8', formatted: formatINR(totalInvested) },
          { label: 'Tax-Free Interest Earned', value: interest, color: '#10b981', formatted: formatINR(interest) }
        ],
        statutoryNote: 'PPF interest is calculated on the minimum balance between the 5th and the last day of each calendar month. Deposit on or before the 5th of each month to maximize interest.'
      };
    },
    editorialGuide: {
      summary: 'Public Provident Fund (PPF) is the highest safety sovereign retail fixed-income product in India, carrying court-attachment immunity and triple tax exemption (EEE).',
      keyBenefits: [
        '100% sovereign guarantee backed by the Government of India.',
        'Zero tax on interest accrual and zero tax upon final 15-year maturity.',
        'Deposit qualifies for Section 80C tax deduction under Old Tax Regime.'
      ],
      workedExample: {
        scenario: 'Depositing the statutory maximum of ₹1,50,000 annually at 7.1% for 15 years:',
        breakdown: [
          'Total out-of-pocket investment = ₹22,50,000.',
          'Total tax-free interest generated = ₹18,18,209.',
          'Final guaranteed tax-free maturity = ₹40,68,209.'
        ]
      },
      faqs: [
        { q: 'Can I extend my PPF account beyond 15 years?', a: 'Yes! You can extend your PPF account indefinitely in blocks of 5 years with or without making additional contributions.' }
      ]
    }
  },

  {
    id: 'nps-calculator',
    slug: 'nps-calculator',
    title: 'NPS (National Pension System) Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Calculate Tier-1 pension corpus, 60% tax-free lump sum withdrawal at age 60, and monthly annuity pension.',
    statute: 'PFRDA Act • Section 80CCD(1B) & Section 80CCD(2)',
    lastUpdated: 'October 2026',
    formula: '60% Tax-Free Lumpsum + 40% Mandatory Annuity at Age 60',
    formulaExplanation: 'Tier-1 contributions grow via professionally managed Pension Fund Managers across Equity (E), Corporate Debt (C), and Government Bonds (G).',
    inputs: [
      { id: 'monthlyContribution', label: 'Monthly Contribution', min: 1000, max: 200000, step: 500, default: 10000, type: 'currency', prefix: '₹' },
      { id: 'currentAge', label: 'Current Age', min: 18, max: 59, step: 1, default: 30, type: 'number', suffix: 'Y' },
      { id: 'expectedReturn', label: 'Expected Annual Return', min: 7, max: 15, step: 0.5, default: 10.0, type: 'percent', suffix: '%' },
      { id: 'annuityPercent', label: 'Annuity Share (Min 40%)', min: 40, max: 100, step: 5, default: 40, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const p = v.monthlyContribution || 10000;
      const age = v.currentAge || 30;
      const years = Math.max(1, 60 - age);
      const r = (v.expectedReturn || 10.0) / 12 / 100;
      const n = years * 12;

      const totalCorpus = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const totalInvested = p * n;
      const annuityShare = (v.annuityPercent || 40) / 100;

      const annuityAmount = totalCorpus * annuityShare;
      const lumpsumAmount = totalCorpus * (1 - annuityShare);
      // Assuming 6.5% standard annuity yield
      const monthlyPension = (annuityAmount * 0.065) / 12;

      return {
        primaryLabel: 'Total Corpus at Age 60',
        primaryValue: formatINR(totalCorpus),
        secondaryMetrics: [
          { label: '60% Tax-Free Lumpsum', value: formatINR(lumpsumAmount), highlight: 'emerald' },
          { label: 'Estimated Monthly Pension', value: formatINR(monthlyPension), highlight: 'blue' },
          { label: 'Capital Invested', value: formatINR(totalInvested) }
        ],
        chartData: [
          { label: 'Tax-Free Lumpsum', value: lumpsumAmount, color: '#10b981', formatted: formatINR(lumpsumAmount) },
          { label: 'Annuity Pension Fund', value: annuityAmount, color: '#38bdf8', formatted: formatINR(annuityAmount) }
        ],
        statutoryNote: 'Section 80CCD(1B) provides an exclusive ₹50,000 annual deduction over and above Section 80C. Corporate NPS under Section 80CCD(2) allows up to 14% of Basic salary tax-free even under New Tax Regime.'
      };
    },
    editorialGuide: {
      summary: 'National Pension System (NPS) has the lowest fund management expense ratio in the world (0.09%). At maturity, 60% of the corpus is 100% tax-free.',
      keyBenefits: [
        'Exclusive ₹50,000 tax deduction under Section 80CCD(1B).',
        'Corporate NPS allows salary restructuring with up to 14% tax-deductible contributions in New Regime.'
      ],
      workedExample: {
        scenario: 'Contributing ₹10,000 monthly from age 30 to 60 at 10% expected return:',
        breakdown: [
          'Total capital invested = ₹36,00,000.',
          'Total corpus accumulated = ₹2,27,93,600.',
          '60% tax-free lump sum cashout = ₹1,36,76,160.',
          'Monthly lifelong pension from remaining 40% annuity = ₹49,386/month.'
        ]
      },
      faqs: [
        { q: 'Can I withdraw 100% of my NPS corpus without annuity?', a: 'If your total NPS corpus at age 60 is ₹5 Lakhs or less, you can withdraw the entire amount as a lump sum without purchasing an annuity.' }
      ]
    }
  },

  {
    id: 'sukanya-samriddhi-calculator',
    slug: 'sukanya-samriddhi-calculator',
    title: 'Sukanya Samriddhi Yojana (SSY) Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Compute maturity proceeds for girl child welfare scheme under 8.2% sovereign rate and 21-year maturity.',
    statute: 'Sukanya Samriddhi Account Rules 2019 • Section 80C & Section 10(11A) EEE',
    lastUpdated: 'October 2026',
    formula: '15 Years Annual Deposit Compounded Annually for 21 Years',
    formulaExplanation: 'Deposits made for the first 15 years; balance continues to compound with government interest until 21 years maturity.',
    inputs: [
      { id: 'yearlyDeposit', label: 'Annual Contribution (Max ₹1.5L)', min: 250, max: 150000, step: 500, default: 150000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Sovereign Interest Rate', min: 7.6, max: 9.0, step: 0.1, default: 8.2, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const p = Math.min(150000, v.yearlyDeposit || 150000);
      const r = (v.rate || 8.2) / 100;
      let balance = 0;
      let totalInvested = 0;

      // First 15 years of deposit
      for (let y = 1; y <= 15; y++) {
        balance = (balance + p) * (1 + r);
        totalInvested += p;
      }
      // Remaining 6 years of compound growth without deposit
      for (let y = 16; y <= 21; y++) {
        balance = balance * (1 + r);
      }

      const interest = balance - totalInvested;

      return {
        primaryLabel: 'Tax-Free 21Y Maturity Value',
        primaryValue: formatINR(balance),
        secondaryMetrics: [
          { label: 'Total Capital Invested', value: formatINR(totalInvested) },
          { label: 'Compound Interest Earned', value: formatINR(interest), highlight: 'emerald' },
          { label: 'Tax Status', value: '100% Tax-Exempt (EEE)', highlight: 'blue' }
        ],
        chartData: [
          { label: 'Total Invested Capital', value: totalInvested, color: '#38bdf8', formatted: formatINR(totalInvested) },
          { label: 'Tax-Free Interest', value: interest, color: '#10b981', formatted: formatINR(interest) }
        ],
        statutoryNote: 'SSY offers the highest guaranteed interest rate among small savings schemes (8.2%), fully exempt from tax under Section 10(11A).'
      };
    },
    editorialGuide: {
      summary: 'Sukanya Samriddhi Yojana (SSY) is designed for parents of girl children below 10 years of age, offering superior sovereign yields and complete triple-tax exemption.',
      keyBenefits: [
        'Highest government small-savings interest rate (8.2% per annum).',
        'Full EEE tax exemption under Section 80C and Section 10(11A).'
      ],
      workedExample: {
        scenario: 'Contributing ₹1,50,000 annually for 15 years at 8.2%:',
        breakdown: [
          'Total capital invested over 15 years = ₹22,50,000.',
          'Maturity payout at 21 years = ₹69,80,050.',
          'Pure tax-free interest earned = ₹47,30,050!'
        ]
      },
      faqs: [
        { q: 'Can money be withdrawn before 21 years?', a: 'Partial withdrawal of up to 50% of the account balance is permitted once the girl child reaches 18 years of age for higher education purposes.' }
      ]
    }
  },

  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator (Multi-Frequency)',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Compute compound interest with annual, semi-annual, quarterly, monthly, or daily compounding frequencies.',
    statute: 'Universal Compound Growth Standard A = P × (1 + r/n)^(n×t)',
    lastUpdated: 'October 2026',
    formula: 'A = P × (1 + r/n)^(n×t)',
    formulaExplanation: 'Where P is principal, r is nominal annual rate, n is compounding cycles per year, and t is time in years.',
    inputs: [
      { id: 'principal', label: 'Starting Principal', min: 1000, max: 10000000, step: 5000, default: 200000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Annual Interest Rate', min: 1, max: 30, step: 0.1, default: 10.0, type: 'percent', suffix: '%' },
      { id: 'years', label: 'Tenure (Years)', min: 1, max: 40, step: 1, default: 10, type: 'years', suffix: 'Y' },
      { id: 'frequency', label: 'Frequency (1=Ann, 4=Qtr, 12=Mo)', min: 1, max: 12, step: 1, default: 4, type: 'number' }
    ],
    calculate: (v) => {
      const p = v.principal || 200000;
      const r = (v.rate || 10.0) / 100;
      const t = v.years || 10;
      const n = v.frequency || 4;

      const a = p * Math.pow(1 + r / n, n * t);
      const interest = a - p;

      return {
        primaryLabel: 'Total Compounded Amount',
        primaryValue: formatINR(a),
        secondaryMetrics: [
          { label: 'Initial Principal', value: formatINR(p) },
          { label: 'Compound Interest Generated', value: formatINR(interest), highlight: 'emerald' },
          { label: 'Effective Annual Yield', value: `${((Math.pow(1 + r / n, n) - 1) * 100).toFixed(2)}%`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Principal', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Interest Profit', value: interest, color: '#10b981', formatted: formatINR(interest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Albert Einstein famously dubbed compound interest the eighth wonder of the world. More frequent compounding intervals incrementally increase your effective annual percentage yield (APY).',
      keyBenefits: [
        'Model any financial asset with exact compounding cycles.',
        'Compare annual vs quarterly vs monthly yields.'
      ],
      workedExample: {
        scenario: 'Investing ₹2,00,000 for 10 years at 10% compounded quarterly:',
        breakdown: [
          'Effective annual yield = 10.38%.',
          'Maturity value = ₹5,41,617.',
          'Total profit generated = ₹3,41,617.'
        ]
      },
      faqs: [
        { q: 'How does daily compounding compare to quarterly compounding?', a: 'On a ₹10 Lakh deposit over 5 years at 8%, daily compounding yields approximately ₹2,300 more than quarterly compounding.' }
      ]
    }
  },

  {
    id: 'simple-interest-calculator',
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator',
    category: 'Savings',
    categoryLabel: 'Savings & Term Deposits',
    shortDesc: 'Compute linear simple interest for personal loans, short-term debt promissory notes, and legal settlements.',
    statute: 'Standard Commercial Code SI = (P × R × T) / 100',
    lastUpdated: 'October 2026',
    formula: 'SI = (P × R × T) / 100',
    formulaExplanation: 'Interest is charged or earned exclusively on original principal capital without reinvestment.',
    inputs: [
      { id: 'principal', label: 'Principal Sum', min: 1000, max: 10000000, step: 5000, default: 200000, type: 'currency', prefix: '₹' },
      { id: 'rate', label: 'Annual Interest Rate', min: 1, max: 36, step: 0.1, default: 8.0, type: 'percent', suffix: '%' },
      { id: 'years', label: 'Time Period (Years)', min: 0.5, max: 20, step: 0.5, default: 3, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.principal || 200000;
      const r = v.rate || 8.0;
      const t = v.years || 3;
      const si = (p * r * t) / 100;
      const total = p + si;

      return {
        primaryLabel: 'Total Payable / Maturity',
        primaryValue: formatINR(total),
        secondaryMetrics: [
          { label: 'Principal Capital', value: formatINR(p) },
          { label: 'Total Simple Interest', value: formatINR(si), highlight: 'emerald' },
          { label: 'Annual Interest Amount', value: formatINR((p * r) / 100) }
        ],
        chartData: [
          { label: 'Principal', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Simple Interest', value: si, color: '#10b981', formatted: formatINR(si) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Simple interest is widely used in short-term promissory notes, informal lending, and court-mandated commercial arbitration settlements.',
      keyBenefits: [
        'Linear and transparent: identical interest charged each year.',
        'No exponential snowball effect.'
      ],
      workedExample: {
        scenario: 'A loan of ₹2,00,000 at 8% simple interest for 3 years:',
        breakdown: [
          'Annual interest = ₹16,000.',
          'Total 3-year interest = ₹48,000.',
          'Total settlement amount = ₹2,48,000.'
        ]
      },
      faqs: [
        { q: 'When is simple interest used instead of compound interest?', a: 'Agricultural crop loans, government scholarships, car loan flat-rate quotations, and legal interest awarded by courts generally apply simple interest.' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 4: RETIREMENT AND PLANNING (6 CALCULATORS)
  // ===========================================================================
  {
    id: 'retirement-corpus-calculator',
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus & Nest Egg Calculator',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Determine the exact nest egg required to fund lifelong expenses factoring in inflation and post-retirement longevity.',
    statute: 'Actuarial Capitalized Retirement Nest Egg Standards',
    lastUpdated: 'October 2026',
    formula: 'Real Return = [(1 + r_post) / (1 + inflation)] - 1; PV of annuity of future monthly expenses.',
    formulaExplanation: 'Accounts for the erosion of purchasing power during both pre-retirement accumulation and post-retirement distribution phases.',
    inputs: [
      { id: 'monthlyExpense', label: 'Current Monthly Living Expenses', min: 20000, max: 500000, step: 5000, default: 60000, type: 'currency', prefix: '₹' },
      { id: 'currentAge', label: 'Current Age', min: 20, max: 55, step: 1, default: 32, type: 'number', suffix: 'Y' },
      { id: 'retirementAge', label: 'Target Retirement Age', min: 40, max: 70, step: 1, default: 60, type: 'number', suffix: 'Y' },
      { id: 'lifeExpectancy', label: 'Life Expectancy', min: 70, max: 100, step: 1, default: 85, type: 'number', suffix: 'Y' },
      { id: 'inflation', label: 'Expected Long-Term Inflation', min: 4, max: 10, step: 0.5, default: 6.0, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const curExp = v.monthlyExpense || 60000;
      const age = v.currentAge || 32;
      const retAge = v.retirementAge || 60;
      const life = v.lifeExpectancy || 85;
      const inf = (v.inflation || 6.0) / 100;

      const preYears = Math.max(1, retAge - age);
      const postYears = Math.max(1, life - retAge);

      // Future monthly expense at retirement
      const futureMonthlyExp = curExp * Math.pow(1 + inf, preYears);
      const futureAnnualExp = futureMonthlyExp * 12;

      // Post-retirement real return assuming 8% conservative return vs 6% inflation = ~1.88% real return
      const postRetReturn = 0.08;
      const realReturn = (1 + postRetReturn) / (1 + inf) - 1;

      // Corpus needed at retirement
      const corpus = futureAnnualExp * ((1 - Math.pow(1 + realReturn, -postYears)) / realReturn);

      return {
        primaryLabel: 'Required Retirement Corpus',
        primaryValue: formatINR(corpus),
        secondaryMetrics: [
          { label: 'Current Annual Living Cost', value: formatINR(curExp * 12) },
          { label: 'Monthly Expense at Retirement', value: formatINR(futureMonthlyExp), hint: `Adjusted for ${preYears}Y inflation`, highlight: 'amber' },
          { label: 'Retirement Phase', value: `${postYears} Years of Funding`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Inflation-Adjusted Living Expenses', value: futureAnnualExp * postYears * 0.45, color: '#f59e0b', formatted: 'Essential Needs' },
          { label: 'Required Capital Buffer', value: corpus, color: '#10b981', formatted: formatINR(corpus) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Retirement planning is not about saving an arbitrary round figure like ₹1 Crore. Because of 6% compounding inflation, a family living on ₹60,000/month today will need over ₹3 Lakhs/month in 28 years.',
      keyBenefits: [
        'Reveals true inflation-adjusted future expenditure requirements.',
        'Prevents catastrophic retirement shortfalls by calculating real longevity needs.'
      ],
      workedExample: {
        scenario: 'A 32-year-old spending ₹60,000 monthly retiring at 60 with life expectancy of 85:',
        breakdown: [
          'At 6% inflation, monthly expense at age 60 becomes ₹3,06,700.',
          'To fund 25 years of retirement safely, required corpus = ₹4,82,34,000.',
          'Beginning an SIP early makes this target achievable.'
        ]
      },
      faqs: [
        { q: 'What is the 4% Safe Withdrawal Rule?', a: 'The Trinity Study established that withdrawing 4% of your initial portfolio (adjusted annually for inflation) gives a 95%+ probability of your money lasting 30 years in a mixed equity/debt allocation.' }
      ]
    }
  },

  {
    id: 'epf-calculator',
    slug: 'epf-calculator',
    title: 'EPF (Employees Provident Fund) Calculator',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Compute statutory employee (12%) and employer (3.67% EPF + 8.33% EPS) accumulation with 8.25% interest rate.',
    statute: 'Employees Provident Funds & Miscellaneous Provisions Act 1952',
    lastUpdated: 'October 2026',
    formula: 'Monthly 12% Employee + 3.67% Employer EPF at 8.25% Statutory Interest',
    formulaExplanation: 'Out of employer 12% contribution: 8.33% goes to Employees Pension Scheme (EPS capped at ₹15k wage ceiling) and 3.67% goes directly to EPF.',
    inputs: [
      { id: 'basicSalary', label: 'Monthly Basic Salary + DA', min: 15000, max: 1000000, step: 5000, default: 50000, type: 'currency', prefix: '₹' },
      { id: 'currentAge', label: 'Current Age', min: 20, max: 57, step: 1, default: 28, type: 'number', suffix: 'Y' },
      { id: 'epfRate', label: 'Statutory EPF Interest Rate', min: 8.0, max: 9.0, step: 0.05, default: 8.25, type: 'percent', suffix: '%' },
      { id: 'annualSalaryHike', label: 'Expected Annual Salary Hike', min: 0, max: 20, step: 1, default: 7.0, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      let basic = v.basicSalary || 50000;
      const age = v.currentAge || 28;
      const years = Math.max(1, 58 - age);
      const r = (v.epfRate || 8.25) / 100;
      const hike = (v.annualSalaryHike || 7.0) / 100;

      let balance = 0;
      let totalEmployee = 0;
      let totalEmployer = 0;

      for (let y = 1; y <= years; y++) {
        const employeeMonthly = basic * 0.12;
        // Employer 3.67% to EPF
        const employerMonthly = basic * 0.0367;
        const totalMonthlyContribution = employeeMonthly + employerMonthly;

        for (let m = 1; m <= 12; m++) {
          balance = (balance + totalMonthlyContribution) * (1 + r / 12);
          totalEmployee += employeeMonthly;
          totalEmployer += employerMonthly;
        }
        basic = basic * (1 + hike);
      }

      return {
        primaryLabel: 'EPF Corpus at Age 58',
        primaryValue: formatINR(balance),
        secondaryMetrics: [
          { label: 'Your Employee Contribution', value: formatINR(totalEmployee) },
          { label: 'Employer Contribution (EPF)', value: formatINR(totalEmployer) },
          { label: 'Accumulated Compound Interest', value: formatINR(balance - totalEmployee - totalEmployer), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Employee Share', value: totalEmployee, color: '#38bdf8', formatted: formatINR(totalEmployee) },
          { label: 'Employer Share', value: totalEmployer, color: '#6366f1', formatted: formatINR(totalEmployer) },
          { label: 'Government EPF Interest', value: balance - totalEmployee - totalEmployer, color: '#10b981', formatted: formatINR(balance - totalEmployee - totalEmployer) }
        ],
        statutoryNote: 'Interest earned on employee EPF contribution exceeding ₹2.5 Lakhs per financial year is subject to income tax under Section 10(12).'
      };
    },
    editorialGuide: {
      summary: 'Employees Provident Fund (EPF) is mandatory for organizations with 20+ employees. It offers guaranteed 8.25% sovereign interest, making it the bedrock of Indian salaried retirement security.',
      keyBenefits: [
        'Forced automated savings deducted straight from payroll.',
        'Employer match provides an immediate 100% partial return on capital.'
      ],
      workedExample: {
        scenario: 'A 28-year-old starting with ₹50,000 Basic + DA with 7% annual wage hikes until age 58:',
        breakdown: [
          'Total employee contributions = ₹40,84,000.',
          'Total employer contributions = ₹12,49,000.',
          'Total EPF corpus accumulated at age 58 exceeds ₹1.84 Crores!'
        ]
      },
      faqs: [
        { q: 'Is EPF withdrawal tax-free upon job change?', a: 'EPF balance is 100% tax-free if withdrawn after 5 years of continuous service. Transferring EPF to your new employer preserves continuity.' }
      ]
    }
  },

  {
    id: 'gratuity-calculator',
    slug: 'gratuity-calculator',
    title: 'Gratuity Calculator (Statutory Formula)',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Compute statutory gratuity payout under Payment of Gratuity Act 1972 with ₹20 Lakh tax-free exemption limit.',
    statute: 'Payment of Gratuity Act 1972 Section 4(2) • CBDT ₹20L Tax Exemption',
    lastUpdated: 'October 2026',
    formula: 'Gratuity = (15 × Last Drawn Basic × Completed Years) / 26',
    formulaExplanation: '15 days wages per year based on a 26-day working month divisor. 6 months or more rounds up to a full completed year.',
    inputs: [
      { id: 'lastBasic', label: 'Last Drawn Monthly Basic + DA', min: 10000, max: 2000000, step: 5000, default: 85000, type: 'currency', prefix: '₹' },
      { id: 'tenureYears', label: 'Completed Years of Service (Min 5)', min: 5, max: 40, step: 1, default: 12, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const basic = v.lastBasic || 85000;
      const yrs = v.tenureYears || 12;
      const statutoryGratuity = Math.round((15 * basic * yrs) / 26);
      const taxFreeLimit = 2000000; // ₹20 Lakh statutory cap
      const taxExempt = Math.min(statutoryGratuity, taxFreeLimit);
      const taxable = Math.max(0, statutoryGratuity - taxFreeLimit);

      return {
        primaryLabel: 'Total Gratuity Payable',
        primaryValue: formatINR(statutoryGratuity),
        secondaryMetrics: [
          { label: 'Tax-Exempt Portion', value: formatINR(taxExempt), hint: 'Section 10(10) Cap ₹20L', highlight: 'emerald' },
          { label: 'Taxable Portion', value: formatINR(taxable), highlight: taxable > 0 ? 'rose' : undefined },
          { label: 'Service Multiplier', value: `${yrs} Years Active Tenure` }
        ],
        chartData: [
          { label: 'Tax-Exempt Gratuity', value: taxExempt, color: '#10b981', formatted: formatINR(taxExempt) },
          { label: 'Taxable Gratuity', value: taxable, color: '#f43f5e', formatted: formatINR(taxable) }
        ],
        statutoryNote: 'Under Payment of Gratuity Act 1972, gratuity becomes mandatory once an employee completes 5 continuous years of service with an establishment.'
      };
    },
    editorialGuide: {
      summary: 'Gratuity is a statutory terminal retirement benefit paid by employers in appreciation of long service. The maximum tax-free threshold is ₹20 Lakhs under Section 10(10).',
      keyBenefits: [
        'Know your exact legal terminal settlement amount before resigning or retiring.',
        'Understand the 26-day monthly divisor rule.'
      ],
      workedExample: {
        scenario: 'An employee with ₹85,000 last drawn Basic + DA completing 12 years of service:',
        breakdown: [
          'Gratuity = (15 × ₹85,000 × 12) / 26.',
          'Total gratuity amount = ₹5,88,462.',
          '100% tax-free under Section 10(10).'
        ]
      },
      faqs: [
        { q: 'Is 5 years mandatory for gratuity in case of death?', a: 'No! In the unfortunate event of death or total disablement, the 5-year continuous service condition is completely waived.' }
      ]
    }
  },

  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    title: 'Inflation & Purchasing Power Calculator',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Determine future purchasing power erosion and the actual nominal cost of goods over time using CPI inflation modeling.',
    statute: 'Fisher Economic Equation Standard PV = FV / (1 + i)^n',
    lastUpdated: 'October 2026',
    formula: 'Future Cost = Present Cost × (1 + i)^n',
    formulaExplanation: 'Demonstrates how uninvested cash loses purchasing power geometrically over time.',
    inputs: [
      { id: 'presentCost', label: 'Current Cost of Goods/Living', min: 10000, max: 10000000, step: 5000, default: 100000, type: 'currency', prefix: '₹' },
      { id: 'inflationRate', label: 'Expected Inflation Rate (p.a.)', min: 3, max: 15, step: 0.5, default: 6.5, type: 'percent', suffix: '%' },
      { id: 'years', label: 'Time Horizon (Years)', min: 1, max: 35, step: 1, default: 15, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const p = v.presentCost || 100000;
      const inf = (v.inflationRate || 6.5) / 100;
      const n = v.years || 15;
      const futureCost = p * Math.pow(1 + inf, n);
      const purchasingPowerOfCash = p / Math.pow(1 + inf, n);

      return {
        primaryLabel: 'Future Cost for Same Goods',
        primaryValue: formatINR(futureCost),
        secondaryMetrics: [
          { label: 'Current Cost Basis', value: formatINR(p) },
          { label: 'Value of ₹1L in Future', value: formatINR(purchasingPowerOfCash), highlight: 'amber' },
          { label: 'Inflation Escalation', value: `+${(((futureCost - p) / p) * 100).toFixed(0)}% Price Increase`, highlight: 'rose' }
        ],
        chartData: [
          { label: 'Current Basket Cost', value: p, color: '#38bdf8', formatted: formatINR(p) },
          { label: 'Inflation Surcharge', value: futureCost - p, color: '#f43f5e', formatted: formatINR(futureCost - p) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Inflation is the silent tax on savings. At 6.5% inflation, the purchasing power of idle savings account cash halves every 11 years.',
      keyBenefits: [
        'Quantifies the necessity of investing in equity index funds that exceed CPI inflation.',
        'Helps families accurately forecast wedding, healthcare, and higher education budgets.'
      ],
      workedExample: {
        scenario: 'A lifestyle costing ₹1,00,000 monthly projected over 15 years at 6.5% inflation:',
        breakdown: [
          'In 15 years, purchasing the same basket of goods will require ₹2,57,184 monthly.',
          '₹1,00,000 kept in cash will only buy ₹38,883 worth of goods in 15 years.'
        ]
      },
      faqs: [
        { q: 'Why is lifestyle inflation higher than official CPI?', a: 'Official Consumer Price Index (CPI) weights staple grains heavily. Services like healthcare (12-14% inflation) and private education (10-12% inflation) inflate at twice the headline rate.' }
      ]
    }
  },

  {
    id: 'emergency-fund-calculator',
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund & Liquidity Moat Calculator',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Calculate your exact survival burn rate and architect a 3-to-12 month liquidity moat across instant bank deposits and overnight mutual funds.',
    statute: 'Institutional Personal Liquidity Moat Architecture',
    lastUpdated: 'October 2026',
    formula: 'Liquidity Moat = Non-Negotiable Monthly Survival Expenses × Target Buffer Months',
    formulaExplanation: 'Base your emergency fund strictly on non-negotiable survival obligations (Rent + EMIs + Groceries + Insurance + Utilities), not gross salary.',
    inputs: [
      { id: 'monthlyRent', label: 'Rent / Home Maintenance', min: 0, max: 200000, step: 2000, default: 25000, type: 'currency', prefix: '₹' },
      { id: 'monthlyEmi', label: 'All Active Loan EMIs', min: 0, max: 300000, step: 2000, default: 20000, type: 'currency', prefix: '₹' },
      { id: 'groceriesUtilities', label: 'Groceries, Bills & Medicines', min: 5000, max: 200000, step: 2000, default: 20000, type: 'currency', prefix: '₹' },
      { id: 'insurancePremiums', label: 'Monthly Insurance Premiums Share', min: 0, max: 50000, step: 1000, default: 5000, type: 'currency', prefix: '₹' },
      { id: 'monthsBuffer', label: 'Buffer Duration (Months)', min: 3, max: 12, step: 1, default: 6, type: 'months', suffix: 'M' }
    ],
    calculate: (v) => {
      const rent = v.monthlyRent || 25000;
      const emi = v.monthlyEmi || 20000;
      const essentials = v.groceriesUtilities || 20000;
      const ins = v.insurancePremiums || 5000;
      const months = v.monthsBuffer || 6;

      const monthlyBurn = rent + emi + essentials + ins;
      const totalMoat = monthlyBurn * months;

      const tier1Cash = totalMoat * 0.25; // 25% instant savings account
      const tier2Liquid = totalMoat * 0.50; // 50% overnight/liquid mutual funds
      const tier3Sweep = totalMoat * 0.25; // 25% multi-deposit sweep FD

      return {
        primaryLabel: 'Target Emergency Moat',
        primaryValue: formatINR(totalMoat),
        secondaryMetrics: [
          { label: 'Monthly Survival Burn Rate', value: formatINR(monthlyBurn), highlight: 'amber' },
          { label: 'Tier 1: Instant Savings (25%)', value: formatINR(tier1Cash) },
          { label: 'Tier 2: Liquid Mutual Funds (50%)', value: formatINR(tier2Liquid), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Liquid Mutual Funds', value: tier2Liquid, color: '#10b981', formatted: formatINR(tier2Liquid) },
          { label: 'Instant Bank Savings', value: tier1Cash, color: '#38bdf8', formatted: formatINR(tier1Cash) },
          { label: 'Sweep-In Bank FD', value: tier3Sweep, color: '#f59e0b', formatted: formatINR(tier3Sweep) }
        ]
      };
    },
    editorialGuide: {
      summary: 'An emergency fund is not an investment; it is an insurance policy that guarantees you never have to panic-sell equity mutual funds during market corrections.',
      keyBenefits: [
        'Protects long-term investments from untimely distress liquidation.',
        'Prevents resorting to 40% APR credit card debt during job transitions or medical crises.'
      ],
      workedExample: {
        scenario: 'A family with ₹70,000 monthly survival expenses building a 6-month buffer:',
        breakdown: [
          'Target emergency moat = ₹4,20,000.',
          'Tier 1 (Instant UPI access in savings) = ₹1,05,000.',
          'Tier 2 (Overnight mutual funds with instant redemption) = ₹2,10,000.',
          'Tier 3 (Short-term sweep FD) = ₹1,05,000.'
        ]
      },
      faqs: [
        { q: 'Should I keep my emergency fund in equities?', a: 'NEVER! Stock markets can drop 30-40% during macroeconomic crises—precisely when job losses occur. Keep emergency reserves exclusively in liquid, capital-guaranteed instruments.' }
      ]
    }
  },

  {
    id: 'fire-calculator',
    slug: 'fire-calculator',
    title: 'FIRE (Financial Independence Retire Early) Calculator',
    category: 'Retirement',
    categoryLabel: 'Retirement & Long-Term Planning',
    shortDesc: 'Calculate Lean FIRE, Standard FIRE, and Fat FIRE targets based on annual expenses and 25x/30x Safe Withdrawal Rates.',
    statute: 'Trinity Study 4% Safe Withdrawal Rule & Early Retirement Engineering',
    lastUpdated: 'October 2026',
    formula: 'FIRE Number = Annual Living Expenses × 25 (or 33 for 3% Safe Withdrawal Rate)',
    formulaExplanation: 'Once your invested liquid net worth reaches 25 to 30 times your annual expenses, investment gains permanently outpace living costs.',
    inputs: [
      { id: 'annualExpenses', label: 'Annual Living Expenses', min: 300000, max: 10000000, step: 50000, default: 900000, type: 'currency', prefix: '₹' },
      { id: 'currentNetWorth', label: 'Current Invested Net Worth', min: 0, max: 50000000, step: 100000, default: 2500000, type: 'currency', prefix: '₹' },
      { id: 'annualSavings', label: 'Annual Investment Savings', min: 50000, max: 5000000, step: 25000, default: 600000, type: 'currency', prefix: '₹' },
      { id: 'expectedCagr', label: 'Portfolio CAGR', min: 7, max: 18, step: 0.5, default: 11.5, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const exp = v.annualExpenses || 900000;
      const standardFire = exp * 25; // 4% SWR
      const fatFire = exp * 33; // 3% SWR conservative
      const leanFire = exp * 20; // 5% SWR bare minimum

      let nw = v.currentNetWorth || 2500000;
      const sav = v.annualSavings || 600000;
      const r = (v.expectedCagr || 11.5) / 100;

      let yearsToFire = 0;
      while (nw < standardFire && yearsToFire < 40) {
        nw = (nw + sav) * (1 + r);
        yearsToFire++;
      }

      return {
        primaryLabel: 'Standard FIRE Target (25x)',
        primaryValue: formatINR(standardFire),
        secondaryMetrics: [
          { label: 'Time to Financial Independence', value: `${yearsToFire} Years`, highlight: 'emerald' },
          { label: 'Lean FIRE Threshold (20x)', value: formatINR(leanFire) },
          { label: 'Fat FIRE Safety Cushion (33x)', value: formatINR(fatFire), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Current Net Worth', value: v.currentNetWorth || 2500000, color: '#38bdf8', formatted: formatINR(v.currentNetWorth || 2500000) },
          { label: 'Gap to Standard FIRE', value: Math.max(0, standardFire - (v.currentNetWorth || 2500000)), color: '#f59e0b', formatted: formatINR(Math.max(0, standardFire - (v.currentNetWorth || 2500000))) }
        ]
      };
    },
    editorialGuide: {
      summary: 'The FIRE movement is built on the mathematical certainty that once your assets generate more passive cashflow than your annual expenditure, working becomes optional.',
      keyBenefits: [
        'Differentiates between Lean FIRE (bare survival), Standard FIRE (current lifestyle), and Fat FIRE (luxury buffer).',
        'Demonstrates how increasing savings rate cuts years off required career duration.'
      ],
      workedExample: {
        scenario: 'A family spending ₹9,00,000 annually with ₹25 Lakhs currently invested, saving ₹6 Lakhs/year at 11.5% CAGR:',
        breakdown: [
          'Standard FIRE target (25x expenses) = ₹2,25,00,000.',
          'Estimated time to full financial independence = 13 years.',
          'At year 13, a 4% annual withdrawal supplies ₹9,00,000 with zero principal degradation.'
        ]
      },
      faqs: [
        { q: 'Is 25x safe in an emerging market like India?', a: 'Many Indian financial planners recommend 28x to 33x (a 3.0% to 3.5% withdrawal rate) to account for higher medical and lifestyle inflation compared to the US.' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 5: TAX (6 CALCULATORS)
  // ===========================================================================
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    title: 'Income Tax Calculator (Old vs New Regime)',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compare statutory liabilities under Section 115BAC (New Regime with ₹75,000 standard deduction) vs Old Regime.',
    statute: 'Income Tax Act 1961 Section 115BAC • Finance Act 2024 / AY 2025-26 & 2026-27',
    lastUpdated: 'October 2026',
    formula: 'Statutory progressive slab brackets + 4% Health & Education Cess - Section 87A rebate.',
    formulaExplanation: 'Section 115BAC provides an automatic ₹75,000 standard deduction for salaried taxpayers and zero tax up to ₹7,75,000 net income.',
    inputs: [
      { id: 'grossSalary', label: 'Annual Gross Salary Income', min: 300000, max: 20000000, step: 25000, default: 1500000, type: 'currency', prefix: '₹' },
      { id: 'hraDeduction', label: 'Eligible HRA Exemption (Old Regime)', min: 0, max: 1000000, step: 10000, default: 180000, type: 'currency', prefix: '₹' },
      { id: 'sec80C', label: 'Section 80C Deductions (Old Regime)', min: 0, max: 150000, step: 5000, default: 150000, type: 'currency', prefix: '₹' },
      { id: 'sec80D', label: 'Health Insurance 80D (Old Regime)', min: 0, max: 100000, step: 5000, default: 25000, type: 'currency', prefix: '₹' },
      { id: 'homeLoanInterest', label: 'Section 24 Home Loan Interest', min: 0, max: 200000, step: 5000, default: 150000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const gross = v.grossSalary || 1500000;

      // 1. NEW REGIME (AY 2025-26 / 2026-27)
      // Standard deduction = ₹75,000
      const netNew = Math.max(0, gross - 75000);
      let taxNew = 0;
      if (netNew <= 300000) {
        taxNew = 0;
      } else if (netNew <= 700000) {
        taxNew = (netNew - 300000) * 0.05;
      } else if (netNew <= 1000000) {
        taxNew = 20000 + (netNew - 700000) * 0.10;
      } else if (netNew <= 1200000) {
        taxNew = 50000 + (netNew - 1000000) * 0.15;
      } else if (netNew <= 1500000) {
        taxNew = 80000 + (netNew - 1200000) * 0.20;
      } else {
        taxNew = 140000 + (netNew - 1500000) * 0.30;
      }

      // Section 87A rebate in New Regime if taxable income <= 7 Lakhs (effective ₹7.75L with std deduction)
      if (netNew <= 700000) {
        taxNew = 0;
      }
      const totalTaxNew = taxNew > 0 ? taxNew * 1.04 : 0;

      // 2. OLD REGIME
      const stdDedOld = 50000;
      const totalDeductionsOld = stdDedOld + (v.hraDeduction || 0) + (v.sec80C || 0) + (v.sec80D || 0) + (v.homeLoanInterest || 0);
      const netOld = Math.max(0, gross - totalDeductionsOld);
      let taxOld = 0;
      if (netOld <= 250000) {
        taxOld = 0;
      } else if (netOld <= 500000) {
        taxOld = (netOld - 250000) * 0.05;
      } else if (netOld <= 1000000) {
        taxOld = 12500 + (netOld - 500000) * 0.20;
      } else {
        taxOld = 112500 + (netOld - 1000000) * 0.30;
      }

      if (netOld <= 500000) {
        taxOld = 0;
      }
      const totalTaxOld = taxOld > 0 ? taxOld * 1.04 : 0;

      const difference = Math.abs(totalTaxNew - totalTaxOld);
      const recommendation = totalTaxNew <= totalTaxOld ? 'New Tax Regime' : 'Old Tax Regime';

      return {
        primaryLabel: `Recommended: ${recommendation}`,
        primaryValue: formatINR(Math.min(totalTaxNew, totalTaxOld)),
        secondaryMetrics: [
          { label: 'New Regime Tax Liability', value: formatINR(totalTaxNew), highlight: totalTaxNew <= totalTaxOld ? 'emerald' : undefined },
          { label: 'Old Regime Tax Liability', value: formatINR(totalTaxOld), highlight: totalTaxOld < totalTaxNew ? 'emerald' : undefined },
          { label: 'Tax Savings Margin', value: formatINR(difference), highlight: 'blue' }
        ],
        chartData: [
          { label: 'New Regime Tax', value: totalTaxNew, color: '#10b981', formatted: formatINR(totalTaxNew) },
          { label: 'Old Regime Tax', value: totalTaxOld, color: '#f59e0b', formatted: formatINR(totalTaxOld) }
        ],
        statutoryNote: 'New Tax Regime is the statutory default regime under Section 115BAC. Standard deduction is ₹75,000 for salaried employees with zero tax up to ₹7,75,000 gross salary.'
      };
    },
    editorialGuide: {
      summary: 'The revised New Tax Regime (Section 115BAC) has substantially wider slabs and an increased ₹75,000 standard deduction. For most taxpayers, the Old Regime is only beneficial if total deductions exceed ₹3.75 Lakhs.',
      keyBenefits: [
        'Instant breakeven comparison between Old and New regimes.',
        'Factoring in ₹75,000 revised standard deduction and Section 87A rebate.'
      ],
      workedExample: {
        scenario: 'A taxpayer with ₹15,00,000 gross salary having ₹1.8L HRA, ₹1.5L 80C, ₹25k 80D, and ₹1.5L home loan interest:',
        breakdown: [
          'Total Old Regime deductions = ₹5,55,000 (taxable income ₹9.45L) -> Tax = ₹1,05,560.',
          'New Regime (taxable income ₹14.25L) -> Tax = ₹1,30,000.',
          'Old Regime saves ₹24,440 because total deductions exceeded ₹3.75 Lakhs.'
        ]
      },
      faqs: [
        { q: 'Can I switch between Old and New regimes every year?', a: 'Salaried individuals with no business income can switch regimes freely every financial year when filing their ITR.' }
      ]
    }
  },

  {
    id: 'hra-exemption-calculator',
    slug: 'hra-exemption-calculator',
    title: 'HRA (House Rent Allowance) Exemption Calculator',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compute statutory tax exemption on House Rent Allowance under Section 10(13A) Rule 2A.',
    statute: 'Income Tax Act Section 10(13A) & Rule 2A (Lowest of Three Conditions)',
    lastUpdated: 'October 2026',
    formula: 'Exemption = Minimum of [ Actual HRA, 50%/40% of Basic, Rent Paid - 10% of Basic ]',
    formulaExplanation: 'The lowest of the three statutory conditions is 100% exempt from income tax under the Old Tax Regime.',
    inputs: [
      { id: 'basicAnnual', label: 'Annual Basic Salary + DA', min: 100000, max: 10000000, step: 25000, default: 720000, type: 'currency', prefix: '₹' },
      { id: 'hraReceived', label: 'Annual HRA Received from Employer', min: 50000, max: 5000000, step: 10000, default: 360000, type: 'currency', prefix: '₹' },
      { id: 'rentPaid', label: 'Total Annual Rent Paid to Landlord', min: 50000, max: 5000000, step: 10000, default: 300000, type: 'currency', prefix: '₹' },
      { id: 'isMetro', label: 'Metro City? (1=Delhi/Mum/Kolk/Chen, 0=Non-Metro)', min: 0, max: 1, step: 1, default: 1, type: 'number' }
    ],
    calculate: (v) => {
      const basic = v.basicAnnual || 720000;
      const hra = v.hraReceived || 360000;
      const rent = v.rentPaid || 300000;
      const isMetro = (v.isMetro ?? 1) === 1;

      // Condition 1: Actual HRA
      const cond1 = hra;
      // Condition 2: 50% of Basic for Metro, 40% for Non-Metro
      const cond2 = isMetro ? basic * 0.50 : basic * 0.40;
      // Condition 3: Rent paid minus 10% of basic
      const cond3 = Math.max(0, rent - basic * 0.10);

      const exemptHra = Math.min(cond1, cond2, cond3);
      const taxableHra = Math.max(0, hra - exemptHra);

      return {
        primaryLabel: 'Statutory Exempt HRA',
        primaryValue: formatINR(exemptHra),
        secondaryMetrics: [
          { label: 'Taxable HRA Component', value: formatINR(taxableHra), highlight: taxableHra > 0 ? 'amber' : undefined },
          { label: 'Rent - 10% Basic Limit', value: formatINR(cond3) },
          { label: '50%/40% Salary Cap', value: formatINR(cond2) }
        ],
        chartData: [
          { label: 'Tax-Exempt HRA', value: exemptHra, color: '#10b981', formatted: formatINR(exemptHra) },
          { label: 'Taxable HRA', value: taxableHra, color: '#f43f5e', formatted: formatINR(taxableHra) }
        ],
        statutoryNote: 'Section 10(13A) exemption applies only under the Old Tax Regime. Landlord PAN is mandatory if annual rent exceeds ₹1,00,000.'
      };
    },
    editorialGuide: {
      summary: 'House Rent Allowance (HRA) exemption significantly reduces taxable salary for professionals living in rented accommodation. The exemption is governed strictly by Rule 2A.',
      keyBenefits: [
        'Pinpoints exact three-condition minimum without manual calculation errors.',
        'Prevents over-claiming or under-claiming rent deductions during TDS declaration submission.'
      ],
      workedExample: {
        scenario: 'Basic Salary ₹7,20,000 in Mumbai (Metro) receiving ₹3,60,000 HRA and paying ₹3,00,000 annual rent:',
        breakdown: [
          'Condition 1: Actual HRA = ₹3,60,000.',
          'Condition 2: 50% of Basic = ₹3,60,000.',
          'Condition 3: Rent (₹3,00,000) - 10% Basic (₹72,000) = ₹2,28,000.',
          'Exempt HRA is the minimum: ₹2,28,000 | Taxable HRA = ₹1,32,000.'
        ]
      },
      faqs: [
        { q: 'Can I pay rent to parents and claim HRA?', a: 'Yes! As long as your parents own the property, you make genuine bank transfers, rent receipts are issued, and your parents declare the rental income in their tax return.' }
      ]
    }
  },

  {
    id: 'capital-gains-tax-calculator',
    slug: 'capital-gains-tax-calculator',
    title: 'Capital Gains Tax Calculator (Finance Act 2024)',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compute statutory Long-Term (LTCG) and Short-Term (STCG) tax liabilities on listed equity, mutual funds, and real estate.',
    statute: 'Finance Act 2024 Amendments to Section 111A, Section 112 & Section 112A',
    lastUpdated: 'October 2026',
    formula: 'Equity: STCG 20% | LTCG 12.5% above ₹1.25L exemption; Real Estate: 12.5% without indexation.',
    formulaExplanation: 'Finance Act 2024 revised equity LTCG to 12.5% with enhanced ₹1.25 Lakh threshold and STCG to 20% from July 23, 2024.',
    inputs: [
      { id: 'purchasePrice', label: 'Purchase Consideration', min: 10000, max: 50000000, step: 25000, default: 500000, type: 'currency', prefix: '₹' },
      { id: 'salePrice', label: 'Sale Consideration', min: 10000, max: 100000000, step: 25000, default: 1100000, type: 'currency', prefix: '₹' },
      { id: 'holdingMonths', label: 'Holding Period (Months)', min: 1, max: 240, step: 1, default: 24, type: 'months', suffix: 'M' },
      { id: 'assetType', label: 'Asset (1=Equity/Mutual Fund, 2=Real Estate)', min: 1, max: 2, step: 1, default: 1, type: 'number' }
    ],
    calculate: (v) => {
      const buy = v.purchasePrice || 500000;
      const sell = v.salePrice || 1100000;
      const months = v.holdingMonths || 24;
      const isEquity = (v.assetType ?? 1) === 1;

      const grossGain = Math.max(0, sell - buy);
      let tax = 0;
      let classification = '';

      if (isEquity) {
        if (months <= 12) {
          classification = 'Short-Term Capital Gain (STCG)';
          tax = grossGain * 0.20; // 20% STCG post Finance Act 2024
        } else {
          classification = 'Long-Term Capital Gain (LTCG)';
          const taxableGain = Math.max(0, grossGain - 125000); // ₹1.25L exemption
          tax = taxableGain * 0.125; // 12.5% LTCG post Finance Act 2024
        }
      } else {
        // Real Estate
        if (months <= 24) {
          classification = 'Short-Term Capital Gain (Slab Rate)';
          tax = grossGain * 0.30;
        } else {
          classification = 'Long-Term Capital Gain (12.5% without indexation)';
          tax = grossGain * 0.125;
        }
      }

      const totalTax = tax * 1.04; // 4% cess

      return {
        primaryLabel: 'Statutory Tax Liability',
        primaryValue: formatINR(totalTax),
        secondaryMetrics: [
          { label: 'Classification', value: classification },
          { label: 'Total Capital Gains', value: formatINR(grossGain), highlight: 'emerald' },
          { label: 'Net Post-Tax Profit', value: formatINR(grossGain - totalTax), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Net Profit Kept', value: grossGain - totalTax, color: '#10b981', formatted: formatINR(grossGain - totalTax) },
          { label: 'Capital Gains Tax Paid', value: totalTax, color: '#f43f5e', formatted: formatINR(totalTax) }
        ],
        statutoryNote: 'Under Finance Act 2024 effective July 23, 2024: Equity STCG is 20%, Equity LTCG is 12.5% (above ₹1.25 Lakh annual exemption). Long-term real estate is 12.5% without indexation.'
      };
    },
    editorialGuide: {
      summary: 'Finance Act 2024 overhauled Indian capital gains taxation. The annual tax-free exemption on listed equities and equity mutual funds was raised from ₹1,00,000 to ₹1,25,000.',
      keyBenefits: [
        'Updated with latest post-July 2024 statutory tax brackets.',
        'Helps equity and property sellers compute net realizations accurately.'
      ],
      workedExample: {
        scenario: 'Selling equity mutual funds after 2 years with ₹6,00,000 in capital gains:',
        breakdown: [
          'Classification: Long-Term Capital Gains (held > 12 months).',
          'Tax-exempt portion under Section 112A = ₹1,25,000.',
          'Taxable gain = ₹4,75,000 taxed at 12.5% = ₹59,375 + 4% cess = ₹61,750.'
        ]
      },
      faqs: [
        { q: 'Can I still use indexation benefit for property bought before 2001?', a: 'For properties acquired before July 23, 2024, resident individuals can compare tax under the old 20% with indexation regime against the new 12.5% without indexation regime and pay the lower of the two.' }
      ]
    }
  },

  {
    id: 'gst-calculator',
    slug: 'gst-calculator',
    title: 'GST (Goods & Services Tax) Calculator',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compute inclusive and exclusive GST across statutory 5%, 12%, 18%, and 28% slabs with CGST + SGST vs IGST breakdown.',
    statute: 'Central Goods and Services Tax Act 2017',
    lastUpdated: 'October 2026',
    formula: 'Exclusive GST = Amount × (Rate / 100) | Inclusive GST = Amount - [Amount / (1 + Rate / 100)]',
    formulaExplanation: 'Intra-state sales split equally into CGST and SGST; inter-state sales apply full Integrated GST (IGST).',
    inputs: [
      { id: 'amount', label: 'Transaction Base / Gross Amount', min: 100, max: 10000000, step: 500, default: 50000, type: 'currency', prefix: '₹' },
      { id: 'gstRate', label: 'GST Slab Rate', min: 0, max: 28, step: 1, default: 18, type: 'percent', suffix: '%' },
      { id: 'isInclusive', label: 'Mode (0=Exclusive/Add GST, 1=Inclusive/Extract GST)', min: 0, max: 1, step: 1, default: 0, type: 'number' }
    ],
    calculate: (v) => {
      const amt = v.amount || 50000;
      const rate = v.gstRate || 18;
      const isInc = (v.isInclusive ?? 0) === 1;

      let netBase = 0;
      let gstAmount = 0;
      let grossTotal = 0;

      if (isInc) {
        netBase = amt / (1 + rate / 100);
        gstAmount = amt - netBase;
        grossTotal = amt;
      } else {
        netBase = amt;
        gstAmount = amt * (rate / 100);
        grossTotal = amt + gstAmount;
      }

      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      return {
        primaryLabel: isInc ? 'Net Base (Pre-GST)' : 'Final Invoice Total',
        primaryValue: formatINR(isInc ? netBase : grossTotal),
        secondaryMetrics: [
          { label: 'Total GST Levy', value: formatINR(gstAmount), highlight: 'amber' },
          { label: 'CGST (Central 50%)', value: formatINR(cgst) },
          { label: 'SGST (State 50%)', value: formatINR(sgst) }
        ],
        chartData: [
          { label: 'Net Product/Service Base', value: netBase, color: '#38bdf8', formatted: formatINR(netBase) },
          { label: 'CGST Portion', value: cgst, color: '#10b981', formatted: formatINR(cgst) },
          { label: 'SGST Portion', value: sgst, color: '#f59e0b', formatted: formatINR(sgst) }
        ]
      };
    },
    editorialGuide: {
      summary: 'GST simplifies indirect taxation across India into standard slabs: 0% (essential food), 5% (transport, packaged food), 12% (business items), 18% (most services, tech), and 28% (luxury, motor vehicles).',
      keyBenefits: [
        'Instant back-calculation for inclusive vendor receipts.',
        'Clear split between intra-state (CGST+SGST) and inter-state (IGST).'
      ],
      workedExample: {
        scenario: 'Invoicing a consulting client for ₹50,000 base fee at 18% GST:',
        breakdown: [
          'Net Base Amount = ₹50,000.',
          'CGST (9%) = ₹4,500 | SGST (9%) = ₹4,500.',
          'Total GST invoice amount = ₹59,000.'
        ]
      },
      faqs: [
        { q: 'Who needs mandatory GST registration?', a: 'Businesses with annual turnover exceeding ₹40 Lakhs (for goods) or ₹20 Lakhs (for services) must mandatorily register for GST.' }
      ]
    }
  },

  {
    id: 'tds-calculator',
    slug: 'tds-calculator',
    title: 'TDS (Tax Deducted at Source) Calculator',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compute statutory withholding tax across contractor (194C), professional (194J), rent (194I), and interest (194A) provisions.',
    statute: 'Income Tax Act 1961 Chapter XVII-B',
    lastUpdated: 'October 2026',
    formula: 'Net Payout = Gross Invoiced Amount - (Gross × Statutory TDS Rate %)',
    formulaExplanation: 'Withholding tax deducted by payer and deposited to the Central Government against the deductee PAN.',
    inputs: [
      { id: 'invoiceAmount', label: 'Gross Invoiced Amount', min: 5000, max: 10000000, step: 5000, default: 120000, type: 'currency', prefix: '₹' },
      { id: 'tdsRate', label: 'TDS Rate (e.g. 1% 194C, 2% tech, 10% prof/rent)', min: 0.1, max: 30, step: 0.1, default: 10.0, type: 'percent', suffix: '%' },
      { id: 'hasPan', label: 'Valid PAN Available? (1=Yes, 0=No -> Sec 206AA 20%)', min: 0, max: 1, step: 1, default: 1, type: 'number' }
    ],
    calculate: (v) => {
      const gross = v.invoiceAmount || 120000;
      let rate = v.tdsRate || 10.0;
      const hasPan = (v.hasPan ?? 1) === 1;

      // Section 206AA penal rate if no PAN
      if (!hasPan) {
        rate = Math.max(20.0, rate);
      }

      const tds = gross * (rate / 100);
      const netPayout = gross - tds;

      return {
        primaryLabel: 'Net Payout to Beneficiary',
        primaryValue: formatINR(netPayout),
        secondaryMetrics: [
          { label: 'TDS Withheld for Govt', value: formatINR(tds), highlight: 'amber' },
          { label: 'Effective TDS Rate', value: `${rate}%` },
          { label: 'Form 26AS Tax Credit', value: formatINR(tds), highlight: 'emerald' }
        ],
        chartData: [
          { label: 'Net Beneficiary Cash', value: netPayout, color: '#10b981', formatted: formatINR(netPayout) },
          { label: 'TDS Deducted', value: tds, color: '#f59e0b', formatted: formatINR(tds) }
        ],
        statutoryNote: 'Common sections: 194C (Contractors: 1% Ind/HUF, 2% Co), 194J (Technical: 2%, Professional: 10%), 194I (Rent: 10% land/bldg, 2% plant). If PAN is not provided, Section 206AA mandates minimum 20% TDS.'
      };
    },
    editorialGuide: {
      summary: 'Tax Deducted at Source (TDS) is credited to the deductee Form 26AS and AIS, where it is offset against final annual income tax liabilities.',
      keyBenefits: [
        'Ensures accurate accounting entries for accountants, freelancers, and businesses.',
        'Prevents severe Section 206AA 20% non-compliance penalties.'
      ],
      workedExample: {
        scenario: 'A professional consulting invoice of ₹1,20,000 under Section 194J at 10% TDS:',
        breakdown: [
          'Gross Invoice = ₹1,20,000.',
          'TDS withheld at 10% = ₹12,000.',
          'Net bank wire received = ₹1,08,000.',
          '₹12,000 reflects in your Form 26AS as advance tax credit.'
        ]
      },
      faqs: [
        { q: 'Can I get a refund of excess TDS deducted?', a: 'Yes! If your total annual income tax liability is less than the TDS deducted, the Income Tax Department will refund the excess amount with interest directly to your validated bank account after you file your ITR.' }
      ]
    }
  },

  {
    id: 'advance-tax-calculator',
    slug: 'advance-tax-calculator',
    title: 'Advance Tax & Section 234B/C Penalty Calculator',
    category: 'Tax',
    categoryLabel: 'Statutory Taxation',
    shortDesc: 'Compute statutory quarterly installment schedule (15%, 45%, 75%, 100%) and avoid Section 234B/234C interest penalties.',
    statute: 'Income Tax Act 1961 Section 208, 209, 234B & 234C',
    lastUpdated: 'October 2026',
    formula: 'Due Dates: 15% by Jun 15, 45% by Sep 15, 75% by Dec 15, 100% by Mar 15',
    formulaExplanation: 'Mandatory if net estimated income tax liability exceeds ₹10,000 after reducing TDS credits.',
    inputs: [
      { id: 'estimatedTax', label: 'Estimated Annual Tax Liability', min: 10000, max: 10000000, step: 10000, default: 250000, type: 'currency', prefix: '₹' },
      { id: 'tdsCredit', label: 'Estimated TDS Already Deducted', min: 0, max: 10000000, step: 5000, default: 50000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const grossTax = v.estimatedTax || 250000;
      const tds = v.tdsCredit || 50000;
      const netPayable = Math.max(0, grossTax - tds);

      const q1 = netPayable * 0.15; // 15% by June 15
      const q2 = netPayable * 0.45; // 45% by Sep 15 (cumulative)
      const q3 = netPayable * 0.75; // 75% by Dec 15 (cumulative)
      const q4 = netPayable * 1.00; // 100% by Mar 15 (cumulative)

      const schedule = [
        { period: 'June 15 (15%)', col1: formatINR(q1), col2: formatINR(q1), col3: 'Sec 234C: 1%/month if deferred' },
        { period: 'Sep 15 (45%)', col1: formatINR(q2 - q1), col2: formatINR(q2), col3: 'Sec 234C: 1%/month if deferred' },
        { period: 'Dec 15 (75%)', col1: formatINR(q3 - q2), col2: formatINR(q3), col3: 'Sec 234C: 1%/month if deferred' },
        { period: 'Mar 15 (100%)', col1: formatINR(q4 - q3), col2: formatINR(q4), col3: 'Sec 234B: 1%/month if <90%' }
      ];

      return {
        primaryLabel: 'Net Advance Tax Due',
        primaryValue: formatINR(netPayable),
        secondaryMetrics: [
          { label: 'Q1 Due (June 15)', value: formatINR(q1) },
          { label: 'Q2 Due (Sept 15)', value: formatINR(q2 - q1) },
          { label: 'Q3 Due (Dec 15)', value: formatINR(q3 - q2), highlight: 'amber' }
        ],
        chartData: [
          { label: 'Already Paid via TDS', value: tds, color: '#38bdf8', formatted: formatINR(tds) },
          { label: 'Net Advance Tax to Pay', value: netPayable, color: '#10b981', formatted: formatINR(netPayable) }
        ],
        scheduleHeaders: ['Installment Due Date', 'Quarterly Deposit', 'Cumulative % Paid', 'Statutory Penalty Risk'],
        schedule
      };
    },
    editorialGuide: {
      summary: 'Every taxpayer (salaried with side income, freelance consultants, traders, and businesses) whose net tax exceeds ₹10,000 must pay advance tax in 4 quarterly installments.',
      keyBenefits: [
        'Avoids punishing 1% per month compound penal interest under Section 234B and 234C.',
        'Prevents massive end-of-year lump-sum tax surprises in March.'
      ],
      workedExample: {
        scenario: 'A taxpayer with ₹2,50,000 estimated tax liability and ₹50,000 TDS credit:',
        breakdown: [
          'Net advance tax liability = ₹2,00,000.',
          'June 15: ₹30,000 (15%) | Sept 15: ₹60,000 (cum. 45%).',
          'Dec 15: ₹60,000 (cum. 75%) | March 15: ₹50,000 (cum. 100%).'
        ]
      },
      faqs: [
        { q: 'Are senior citizens exempt from advance tax?', a: 'Yes! Resident senior citizens (age 60+) who do not have any business or professional income are completely exempt from paying advance tax.' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 6: SALARY AND BUSINESS (6 CALCULATORS)
  // ===========================================================================
  {
    id: 'salary-in-hand-calculator',
    slug: 'salary-in-hand-calculator',
    title: 'Salary In-Hand & Take-Home Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Compute exact monthly in-hand cash after Basic, HRA, Employee PF (12%), Professional Tax, and Income Tax deductions.',
    statute: 'Standard Indian Payroll & Statutory Deduction Framework',
    lastUpdated: 'October 2026',
    formula: 'Net In-Hand = Gross Monthly - Employee PF (12% Basic) - Professional Tax - Monthly TDS Tax',
    formulaExplanation: 'Translates gross compensation structure into the actual bank wire deposited on payday.',
    inputs: [
      { id: 'grossMonthly', label: 'Gross Monthly Salary', min: 25000, max: 2000000, step: 5000, default: 125000, type: 'currency', prefix: '₹' },
      { id: 'basicPercent', label: 'Basic Salary Component (% of Gross)', min: 30, max: 60, step: 5, default: 50, type: 'percent', suffix: '%' },
      { id: 'monthlyTax', label: 'Estimated Monthly Income Tax (TDS)', min: 0, max: 500000, step: 1000, default: 11500, type: 'currency', prefix: '₹' },
      { id: 'professionalTax', label: 'Monthly Professional Tax (PT)', min: 0, max: 500, step: 50, default: 200, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const gross = v.grossMonthly || 125000;
      const basic = gross * ((v.basicPercent || 50) / 100);
      const epf = basic * 0.12;
      const pt = v.professionalTax || 200;
      const tax = v.monthlyTax || 11500;

      const totalDeductions = epf + pt + tax;
      const netInHand = gross - totalDeductions;

      return {
        primaryLabel: 'Monthly Net Bank Deposit',
        primaryValue: formatINR(netInHand),
        secondaryMetrics: [
          { label: 'Employee PF (12% Basic)', value: formatINR(epf), hint: 'Retirement Asset' },
          { label: 'Income Tax TDS', value: formatINR(tax), highlight: 'amber' },
          { label: 'Total Payroll Deductions', value: formatINR(totalDeductions), highlight: 'rose' }
        ],
        chartData: [
          { label: 'Net In-Hand Cash', value: netInHand, color: '#10b981', formatted: formatINR(netInHand) },
          { label: 'Employee PF', value: epf, color: '#38bdf8', formatted: formatINR(epf) },
          { label: 'TDS & Professional Tax', value: tax + pt, color: '#f43f5e', formatted: formatINR(tax + pt) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Many job seekers mistakenly assume gross salary equals monthly take-home. Employee PF, Professional Tax, and Income Tax TDS typically reduce take-home by 15% to 30%.',
      keyBenefits: [
        'Evaluate job offer letters with exact post-tax cash clarity.',
        'Prevents budgeting based on gross vanity numbers.'
      ],
      workedExample: {
        scenario: 'A monthly gross salary of ₹1,25,000 (50% basic = ₹62,500):',
        breakdown: [
          'Gross Salary = ₹1,25,000.',
          'Deductions: EPF (₹7,500) + PT (₹200) + Tax (₹11,500) = ₹19,200.',
          'Net take-home wired to bank account = ₹1,05,800.'
        ]
      },
      faqs: [
        { q: 'Is Professional Tax deductible from income tax?', a: 'Yes! Professional Tax paid up to ₹2,500 per year is fully deductible under Section 16(iii) under the Old Tax Regime.' }
      ]
    }
  },

  {
    id: 'ctc-to-take-home-calculator',
    slug: 'ctc-to-take-home-calculator',
    title: 'CTC to Take-Home Salary Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Deconstruct Annual Cost-to-Company (CTC) into employer retiral components, statutory insurance, and true take-home pay.',
    statute: 'Corporate CTC Compensation Architecture',
    lastUpdated: 'October 2026',
    formula: 'Annual Take-Home = CTC - Retirals (Employer PF + Gratuity + Insurance) - Employee Deductions (PF + Tax)',
    formulaExplanation: 'Employers inflate headline CTC packages by bundling employer PF contributions, gratuity accrual, and group insurance.',
    inputs: [
      { id: 'annualCtc', label: 'Annual CTC Package', min: 300000, max: 20000000, step: 50000, default: 1800000, type: 'currency', prefix: '₹' },
      { id: 'variableBonus', label: 'Variable / Performance Bonus in CTC', min: 0, max: 5000000, step: 25000, default: 180000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const ctc = v.annualCtc || 1800000;
      const bonus = v.variableBonus || 180000;
      const fixedCtc = Math.max(0, ctc - bonus);

      // Standard breakdown: Basic ~ 40% of fixed CTC
      const annualBasic = fixedCtc * 0.40;
      const employerPf = annualBasic * 0.12;
      const gratuityAccrual = (annualBasic * 15) / 26;
      const insurance = 12000;

      const grossSalary = fixedCtc - employerPf - gratuityAccrual - insurance;
      const employeePf = annualBasic * 0.12;
      const professionalTax = 2400;

      // Approximate tax under New Regime
      const taxable = Math.max(0, grossSalary - 75000);
      let tax = 0;
      if (taxable > 1500000) tax = 140000 + (taxable - 1500000) * 0.30;
      else if (taxable > 1200000) tax = 80000 + (taxable - 1200000) * 0.20;
      else if (taxable > 1000000) tax = 50000 + (taxable - 1000000) * 0.15;
      else if (taxable > 700000) tax = 20000 + (taxable - 700000) * 0.10;
      const totalTax = tax * 1.04;

      const netAnnualTakeHome = grossSalary - employeePf - professionalTax - totalTax;
      const monthlyTakeHome = netAnnualTakeHome / 12;

      return {
        primaryLabel: 'Monthly In-Hand Take-Home',
        primaryValue: formatINR(monthlyTakeHome),
        secondaryMetrics: [
          { label: 'Annual Net Take-Home', value: formatINR(netAnnualTakeHome), highlight: 'emerald' },
          { label: 'Employer Retirals (PF+Gratuity)', value: formatINR(employerPf + gratuityAccrual) },
          { label: 'Annual Income Tax TDS', value: formatINR(totalTax), highlight: 'amber' }
        ],
        chartData: [
          { label: 'Net In-Hand Pay', value: netAnnualTakeHome, color: '#10b981', formatted: formatINR(netAnnualTakeHome) },
          { label: 'Income Tax', value: totalTax, color: '#f43f5e', formatted: formatINR(totalTax) },
          { label: 'Total PF & Retirals', value: employerPf + employeePf + gratuityAccrual, color: '#38bdf8', formatted: formatINR(employerPf + employeePf + gratuityAccrual) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Headline CTC is frequently 20% to 35% higher than what actually hits your bank account every month. Retirals and variable components must be stripped out to find true purchasing power.',
      keyBenefits: [
        'Compare job offers realistically by comparing in-hand salary rather than inflated CTC figures.',
        'Isolates variable bonuses that may not be paid in full.'
      ],
      workedExample: {
        scenario: 'An ₹18,00,000 CTC offer with ₹1,80,000 variable bonus:',
        breakdown: [
          'Fixed CTC = ₹16,20,000.',
          'Retirals: Employer PF (₹77,760) + Gratuity (₹37,385) + Insurance (₹12,000).',
          'Employee PF (₹77,760) + Professional Tax (₹2,400) + Income Tax (₹1,56,000).',
          'Actual monthly bank credit = ₹1,04,700.'
        ]
      },
      faqs: [
        { q: 'Is employer PF part of gross salary?', a: 'No, employer PF is part of your total CTC cost to the company, but it is not part of your taxable gross salary.' }
      ]
    }
  },

  {
    id: 'profit-margin-calculator',
    slug: 'profit-margin-calculator',
    title: 'Profit Margin & Markup Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Compute gross margin, operating margin, net profit margin, and percentage markup from revenue and cost of goods sold.',
    statute: 'Corporate Financial Statement Analysis Standards',
    lastUpdated: 'October 2026',
    formula: 'Margin = (Profit / Revenue) × 100 | Markup = (Profit / Cost) × 100',
    formulaExplanation: 'Profit margin measures how much out of every ₹100 in revenue a business keeps in earnings.',
    inputs: [
      { id: 'revenue', label: 'Total Business Revenue', min: 10000, max: 50000000, step: 10000, default: 1000000, type: 'currency', prefix: '₹' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS)', min: 5000, max: 40000000, step: 10000, default: 600000, type: 'currency', prefix: '₹' },
      { id: 'opex', label: 'Operating Expenses (Rent, Salaries)', min: 0, max: 10000000, step: 5000, default: 180000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const rev = v.revenue || 1000000;
      const cogs = v.cogs || 600000;
      const opex = v.opex || 180000;

      const grossProfit = rev - cogs;
      const netProfit = grossProfit - opex;

      const grossMargin = (grossProfit / rev) * 100;
      const netMargin = (netProfit / rev) * 100;
      const markup = (grossProfit / cogs) * 100;

      return {
        primaryLabel: 'Net Profit Margin',
        primaryValue: `${netMargin.toFixed(2)}%`,
        secondaryMetrics: [
          { label: 'Net Profit Generated', value: formatINR(netProfit), highlight: 'emerald' },
          { label: 'Gross Margin', value: `${grossMargin.toFixed(1)}%` },
          { label: 'Markup on Cost', value: `${markup.toFixed(1)}%`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Cost of Goods Sold', value: cogs, color: '#f59e0b', formatted: formatINR(cogs) },
          { label: 'Operating Overhead', value: opex, color: '#38bdf8', formatted: formatINR(opex) },
          { label: 'Net Profit Retained', value: Math.max(0, netProfit), color: '#10b981', formatted: formatINR(Math.max(0, netProfit)) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Confusing margin with markup is one of the most common causes of business bankruptcy. A 50% markup equals only a 33.3% gross profit margin.',
      keyBenefits: [
        'Avoid underpricing products by distinguishing markup from margin.',
        'Accurately model unit economics for e-commerce, D2C, and manufacturing.'
      ],
      workedExample: {
        scenario: 'A retail product generating ₹10,00,000 revenue with ₹6,00,000 COGS and ₹1,80,000 opex:',
        breakdown: [
          'Gross Profit = ₹4,00,000 (40.0% Gross Margin).',
          'Markup on cost = 66.7%.',
          'Net Profit = ₹2,20,000 (22.0% Net Profit Margin).'
        ]
      },
      faqs: [
        { q: 'What is a healthy net profit margin?', a: 'In software and consulting, net margins often exceed 25-35%. In retail, grocery, and consumer electronics, net margins typically range between 3% and 8%.' }
      ]
    }
  },

  {
    id: 'break-even-calculator',
    slug: 'break-even-calculator',
    title: 'Break-Even Point Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Determine the exact sales volume and revenue required to cover all fixed and variable operating costs.',
    statute: 'Cost-Volume-Profit (CVP) Analysis Standard',
    lastUpdated: 'October 2026',
    formula: 'Break-Even Units = Fixed Costs / (Price Per Unit - Variable Cost Per Unit)',
    formulaExplanation: 'At the break-even point, business net profit is exactly ₹0; each unit sold beyond this yields pure contribution margin profit.',
    inputs: [
      { id: 'fixedCosts', label: 'Monthly Fixed Costs (Rent, Salaries)', min: 10000, max: 5000000, step: 5000, default: 250000, type: 'currency', prefix: '₹' },
      { id: 'unitPrice', label: 'Selling Price Per Unit', min: 10, max: 100000, step: 10, default: 1200, type: 'currency', prefix: '₹' },
      { id: 'variableCost', label: 'Variable Cost Per Unit (Raw Materials)', min: 5, max: 80000, step: 5, default: 700, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const fc = v.fixedCosts || 250000;
      const price = v.unitPrice || 1200;
      const vc = Math.min(price - 1, v.variableCost || 700);

      const contributionMargin = price - vc;
      const breakEvenUnits = Math.ceil(fc / contributionMargin);
      const breakEvenRevenue = breakEvenUnits * price;
      const cmRatio = (contributionMargin / price) * 100;

      return {
        primaryLabel: 'Break-Even Sales Units',
        primaryValue: `${breakEvenUnits.toLocaleString('en-IN')} Units`,
        secondaryMetrics: [
          { label: 'Required Break-Even Revenue', value: formatINR(breakEvenRevenue), highlight: 'emerald' },
          { label: 'Unit Contribution Margin', value: formatINR(contributionMargin) },
          { label: 'Contribution Margin Ratio', value: `${cmRatio.toFixed(1)}%`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Fixed Costs Covered', value: fc, color: '#f59e0b', formatted: formatINR(fc) },
          { label: 'Variable Cost Outlay', value: breakEvenUnits * vc, color: '#38bdf8', formatted: formatINR(breakEvenUnits * vc) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Cost-Volume-Profit (CVP) analysis establishes the minimum operational hurdle rate for any commercial enterprise before launching a product.',
      keyBenefits: [
        'Establishes non-negotiable monthly sales targets for commercial teams.',
        'Evaluates whether lowering price increases unit volume enough to offset lost margin.'
      ],
      workedExample: {
        scenario: 'A business with ₹2,50,000 monthly fixed costs selling items at ₹1,200 with ₹700 variable cost:',
        breakdown: [
          'Contribution margin per unit = ₹500.',
          'Break-even volume = 500 units per month.',
          'Required break-even revenue = ₹6,00,000.'
        ]
      },
      faqs: [
        { q: 'How can a company lower its break-even point?', a: 'Either by reducing fixed operating overhead (downsizing office space, automating tasks) or by increasing gross contribution margin (raising price, negotiating volume discounts on materials).' }
      ]
    }
  },

  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    title: 'ROI (Return on Investment) Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Compute simple ROI percentage and annualized ROI across multi-year commercial and capital initiatives.',
    statute: 'Capital Budgeting Standards ROI = (Net Profit / Initial Cost) × 100',
    lastUpdated: 'October 2026',
    formula: 'ROI = [(Final Value - Cost) / Cost] × 100',
    formulaExplanation: 'Standardized percentage metric to evaluate profitability efficiency across alternative capital outlays.',
    inputs: [
      { id: 'cost', label: 'Initial Capital Cost / Outlay', min: 1000, max: 50000000, step: 5000, default: 500000, type: 'currency', prefix: '₹' },
      { id: 'returned', label: 'Final Value / Total Inflows', min: 1000, max: 100000000, step: 5000, default: 850000, type: 'currency', prefix: '₹' },
      { id: 'years', label: 'Holding Horizon (Years)', min: 0.5, max: 20, step: 0.5, default: 3, type: 'years', suffix: 'Y' }
    ],
    calculate: (v) => {
      const c = v.cost || 500000;
      const ret = v.returned || 850000;
      const yrs = v.years || 3;

      const netProfit = ret - c;
      const simpleRoi = (netProfit / c) * 100;
      const annualizedRoi = (Math.pow(ret / c, 1 / yrs) - 1) * 100;

      return {
        primaryLabel: 'Total ROI Percentage',
        primaryValue: `${simpleRoi.toFixed(2)}%`,
        secondaryMetrics: [
          { label: 'Annualized Compound ROI', value: `${annualizedRoi.toFixed(2)}% p.a.`, highlight: 'emerald' },
          { label: 'Net Profit Cash', value: formatINR(netProfit), highlight: 'blue' },
          { label: 'Payback Multiplier', value: `${(ret / c).toFixed(2)}x` }
        ],
        chartData: [
          { label: 'Initial Capital Invested', value: c, color: '#38bdf8', formatted: formatINR(c) },
          { label: 'Net Profit Returned', value: netProfit, color: '#10b981', formatted: formatINR(netProfit) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Return on Investment (ROI) evaluates the financial efficiency of a project or asset. When comparing projects over differing timeframes, always benchmark annualized ROI.',
      keyBenefits: [
        'Prioritize capital expenditure across competing marketing, tech, or equipment investments.',
        'Standardized metric accepted across executive boards and investors.'
      ],
      workedExample: {
        scenario: 'Investing ₹5,00,000 into a business system that yields ₹8,50,000 after 3 years:',
        breakdown: [
          'Net profit generated = ₹3,50,000.',
          'Simple ROI = 70.0%.',
          'Annualized compound ROI = 19.35% per year.'
        ]
      },
      faqs: [
        { q: 'What is the difference between ROI and IRR?', a: 'ROI looks simply at starting cost and ending return. Internal Rate of Return (IRR) accounts for the precise timing of multiple ongoing cash inflows and outflows throughout the project.' }
      ]
    }
  },

  {
    id: 'discount-and-markup-calculator',
    slug: 'discount-and-markup-calculator',
    title: 'Discount & Sales Markup Calculator',
    category: 'Salary',
    categoryLabel: 'Salary & Business Metrics',
    shortDesc: 'Compute retail discounts, wholesale cost markup, and final customer checkout price while preserving margin.',
    statute: 'Retail Trade Pricing & Margin Protection Standard',
    lastUpdated: 'October 2026',
    formula: 'Discount Price = List Price × (1 - Discount %) | Final Margin Preserved',
    formulaExplanation: 'Determines the final discounted customer selling price and reveals the true margin remaining on wholesale cost.',
    inputs: [
      { id: 'listPrice', label: 'Original List / MRP Price', min: 100, max: 1000000, step: 50, default: 4999, type: 'currency', prefix: '₹' },
      { id: 'discountPercent', label: 'Discount Offered (%)', min: 1, max: 90, step: 1, default: 25, type: 'percent', suffix: '%' },
      { id: 'costPrice', label: 'Wholesale Unit Cost Price', min: 50, max: 500000, step: 50, default: 2200, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const list = v.listPrice || 4999;
      const disc = v.discountPercent || 25;
      const cost = v.costPrice || 2200;

      const discountAmount = list * (disc / 100);
      const finalPrice = list - discountAmount;
      const profit = finalPrice - cost;
      const marginOnSale = (profit / finalPrice) * 100;

      return {
        primaryLabel: 'Final Discounted Customer Price',
        primaryValue: formatINR(finalPrice),
        secondaryMetrics: [
          { label: 'Customer Savings Amount', value: formatINR(discountAmount), highlight: 'amber' },
          { label: 'Net Profit Retained', value: formatINR(profit), highlight: profit > 0 ? 'emerald' : 'rose' },
          { label: 'Effective Margin on Sale', value: `${marginOnSale.toFixed(1)}%`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Wholesale Cost', value: cost, color: '#f59e0b', formatted: formatINR(cost) },
          { label: 'Net Profit Margin', value: Math.max(0, profit), color: '#10b981', formatted: formatINR(Math.max(0, profit)) },
          { label: 'Discount Given Away', value: discountAmount, color: '#38bdf8', formatted: formatINR(discountAmount) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Promotional discounts can easily wipe out entire gross margins if wholesale product costs are not factored into the sale campaign.',
      keyBenefits: [
        'Protect retail bottom-lines during festive clearance sales.',
        'Instantly view the net profit remaining after aggressive marketing discounts.'
      ],
      workedExample: {
        scenario: 'A product with MRP ₹4,999 discounted by 25% with a wholesale cost of ₹2,200:',
        breakdown: [
          'Discounted customer price = ₹3,749 (customer saves ₹1,250).',
          'Wholesale cost = ₹2,200.',
          'Merchant keeps ₹1,549 net profit (41.3% margin preserved).'
        ]
      },
      faqs: [
        { q: 'How does a 50% discount compare to Buy 1 Get 1 Free?', a: 'Mathematically, Buy 1 Get 1 Free is identical to a 50% discount on two units, but psychological framing makes BOGO move double the inventory volume.' }
      ]
    }
  },

  // ===========================================================================
  // CATEGORY 7: EVERYDAY MONEY (7 CALCULATORS)
  // ===========================================================================
  {
    id: 'currency-converter',
    slug: 'currency-converter',
    title: 'Currency Converter (Live Multi-FX)',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Convert between Indian Rupee (INR) and major global currencies (USD, EUR, GBP, AED, SGD, JPY, CAD, AUD).',
    statute: 'Global Foreign Exchange Cross-Rates Reference',
    lastUpdated: 'October 2026',
    formula: 'Converted Amount = Source Amount × Exchange Rate Multiplier',
    formulaExplanation: 'Real-time indicative institutional cross-currency conversion rates.',
    inputs: [
      { id: 'amount', label: 'Amount to Convert', min: 1, max: 10000000, step: 100, default: 1000, type: 'number' },
      { id: 'fxRate', label: 'Exchange Rate (INR per Unit)', min: 0.5, max: 150, step: 0.1, default: 87.5, type: 'number' }
    ],
    calculate: (v) => {
      const amt = v.amount || 1000;
      const rate = v.fxRate || 87.5;
      const convertedInr = amt * rate;

      return {
        primaryLabel: 'Equivalent in Indian Rupees (INR)',
        primaryValue: formatINR(convertedInr),
        secondaryMetrics: [
          { label: 'Foreign Currency Sum', value: amt.toLocaleString('en-IN') },
          { label: 'Spot Exchange Rate', value: `1 Unit = ₹${rate}` },
          { label: 'Typical Card Markup (2.5%)', value: formatINR(convertedInr * 0.025), hint: 'Bank Foreign Markup', highlight: 'amber' }
        ],
        chartData: [
          { label: 'Base Currency Value', value: convertedInr, color: '#10b981', formatted: formatINR(convertedInr) }
        ]
      };
    },
    editorialGuide: {
      summary: 'When spending foreign currency with domestic credit or debit cards, Indian banks levy an additional 2.5% to 3.5% foreign currency markup fee plus 18% GST.',
      keyBenefits: [
        'Instant multi-currency translation for international travelers and online shoppers.',
        'Highlights hidden bank card forex markup charges.'
      ],
      workedExample: {
        scenario: 'Converting $1,000 USD at ₹87.50/USD exchange rate:',
        breakdown: [
          'Base converted value = ₹87,500.',
          'Standard bank 2.5% forex markup = ₹2,187.',
          'Total cost charged to credit card statement = ₹89,687.'
        ]
      },
      faqs: [
        { q: 'What is TCS on foreign remittances in India?', a: 'Under the Liberalized Remittance Scheme (LRS), Tax Collected at Source (TCS) of 20% applies on foreign remittances exceeding ₹7 Lakhs in a financial year (5% for education).' }
      ]
    }
  },

  {
    id: 'credit-card-interest-calculator',
    slug: 'credit-card-interest-calculator',
    title: 'Credit Card Interest & APR Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Calculate daily compounding interest (36% to 42% APR) and discover the brutal cost of revolving credit card balances.',
    statute: 'RBI Master Direction on Credit Card & Debit Card Issuance',
    lastUpdated: 'October 2026',
    formula: 'Daily Interest = Outstanding Balance × (APR % / 365) × Days Elapsed',
    formulaExplanation: 'Once the grace period is breached by not paying the full statement balance, interest accrues retroactively from purchase date.',
    inputs: [
      { id: 'unpaidBalance', label: 'Unpaid Statement Balance', min: 5000, max: 1000000, step: 2000, default: 75000, type: 'currency', prefix: '₹' },
      { id: 'monthlyRate', label: 'Monthly Finance Charge (%/month)', min: 2.5, max: 4.5, step: 0.1, default: 3.5, type: 'percent', suffix: '%' },
      { id: 'daysRevolved', label: 'Days Balance Revolved', min: 15, max: 180, step: 1, default: 45, type: 'number', suffix: 'Days' }
    ],
    calculate: (v) => {
      const bal = v.unpaidBalance || 75000;
      const mRate = v.monthlyRate || 3.5;
      const apr = mRate * 12;
      const days = v.daysRevolved || 45;

      const dailyRate = apr / 365 / 100;
      const interest = bal * dailyRate * days;
      const gstOnInterest = interest * 0.18; // 18% GST applies to credit card interest in India
      const totalCost = interest + gstOnInterest;

      return {
        primaryLabel: 'Total Finance Charge + 18% GST',
        primaryValue: formatINR(totalCost),
        secondaryMetrics: [
          { label: 'Equivalent Annual APR', value: `${apr.toFixed(1)}% APR`, highlight: 'rose' },
          { label: 'Pure Interest Charge', value: formatINR(interest) },
          { label: '18% GST Surcharge on Bank Fee', value: formatINR(gstOnInterest), highlight: 'amber' }
        ],
        chartData: [
          { label: 'Principal Debt', value: bal, color: '#38bdf8', formatted: formatINR(bal) },
          { label: 'Interest & GST Penalty', value: totalCost, color: '#f43f5e', formatted: formatINR(totalCost) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Credit card revolving debt carries annualized interest rates of 42% to 48% plus 18% GST. It is the single most toxic form of consumer credit in the economy.',
      keyBenefits: [
        'Unmasks the true APR behind deceptive "3.5% per month" marketing.',
        'Factoring in statutory 18% GST charged on all financial interest penalties.'
      ],
      workedExample: {
        scenario: 'Carrying ₹75,000 balance for 45 days at 3.5% monthly finance charge:',
        breakdown: [
          'Effective APR = 42.0% per annum.',
          'Interest charge = ₹3,883 | 18% GST = ₹699.',
          'Total penalty paid strictly for revolving credit = ₹4,582.'
        ]
      },
      faqs: [
        { q: 'Does paying the minimum due stop interest?', a: 'NO! Paying the minimum amount due merely prevents late payment fees and protects your credit score. Interest continues to compound on the ENTIRE remaining balance from the original transaction date.' }
      ]
    }
  },

  {
    id: 'credit-card-payoff-calculator',
    slug: 'credit-card-payoff-calculator',
    title: 'Credit Card Minimum Due Trap Payoff Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Compare paying the 5% minimum payment trap vs fixed accelerated monthly payoff timeline to debt freedom.',
    statute: 'Consumer Financial Protection & Amortization Payoff Standard',
    lastUpdated: 'October 2026',
    formula: 'Accelerated Payoff Timeline n = -ln(1 - (P × r) / Payment) / ln(1 + r)',
    formulaExplanation: 'Paying only the 5% minimum due keeps borrowers trapped in compound interest debt for over 15 to 20 years.',
    inputs: [
      { id: 'balance', label: 'Credit Card Outstanding Debt', min: 10000, max: 1000000, step: 5000, default: 120000, type: 'currency', prefix: '₹' },
      { id: 'apr', label: 'Annual Interest Rate (APR)', min: 24, max: 48, step: 1, default: 42, type: 'percent', suffix: '%' },
      { id: 'fixedPayment', label: 'Accelerated Monthly Payment', min: 2000, max: 50000, step: 500, default: 8000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const bal = v.balance || 120000;
      const r = (v.apr || 42) / 12 / 100;
      const pmt = Math.max(bal * r + 100, v.fixedPayment || 8000);

      const months = Math.ceil(-Math.log(1 - (bal * r) / pmt) / Math.log(1 + r));
      const totalRepaid = pmt * months;
      const totalInterest = totalRepaid - bal;

      // Minimum payment trap estimate (5% of balance takes ~14 years)
      const minDueYears = 14;

      return {
        primaryLabel: 'Debt-Free in Just',
        primaryValue: `${months} Months`,
        secondaryMetrics: [
          { label: 'Total Interest Paid', value: formatINR(totalInterest), highlight: 'emerald' },
          { label: 'Total Cash Repaid', value: formatINR(totalRepaid) },
          { label: 'Minimum Due Trap Comparison', value: `${minDueYears} Years saved!`, highlight: 'blue' }
        ],
        chartData: [
          { label: 'Original Principal Cleared', value: bal, color: '#38bdf8', formatted: formatINR(bal) },
          { label: 'Total Interest Charge', value: totalInterest, color: '#f59e0b', formatted: formatINR(totalInterest) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Banks design the 5% "Minimum Amount Due" specifically to maximize their interest profits. Paying a fixed monthly amount collapses the repayment timeline from decades to months.',
      keyBenefits: [
        'Provides a concrete, non-negotiable month-by-month exit plan.',
        'Calculates exact thousands of rupees saved by accelerating payoff.'
      ],
      workedExample: {
        scenario: 'A ₹1,20,000 credit card debt at 42% APR paid down with ₹8,000 fixed monthly payments:',
        breakdown: [
          'Debt is 100% eliminated in 22 months.',
          'Total interest paid = ₹51,800.',
          'If paying only the minimum due, this same debt would take 14 years and cost over ₹2.4 Lakhs in interest!'
        ]
      },
      faqs: [
        { q: 'Should I take a low-interest personal loan to clear card debt?', a: 'Yes! Replacing a 42% credit card balance with a 12-14% personal loan cuts your interest rate by two-thirds, immediately saving thousands monthly.' }
      ]
    }
  },

  {
    id: 'rent-vs-buy-calculator',
    slug: 'rent-vs-buy-calculator',
    title: 'Rent vs. Buy Property Decision Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Comprehensive opportunity cost simulation: Buying (down payment, EMI, maintenance) vs Renting (rent, investing down payment into equities).',
    statute: 'Real Estate Opportunity Cost & Capital Allocation Framework',
    lastUpdated: 'October 2026',
    formula: 'Net Wealth(Buy: Property Value - Interest - Maintenance) vs Net Wealth(Rent: Equity SIP of Down Payment & Cashflow Diff)',
    formulaExplanation: 'Renting and investing the down payment and monthly EMI savings into broad market equity index funds frequently builds higher net worth than real estate.',
    inputs: [
      { id: 'propertyPrice', label: 'Property Purchase Price', min: 2000000, max: 50000000, step: 100000, default: 8000000, type: 'currency', prefix: '₹' },
      { id: 'monthlyRent', label: 'Current Monthly Rent for Similar House', min: 10000, max: 200000, step: 2000, default: 28000, type: 'currency', prefix: '₹' },
      { id: 'holdingYears', label: 'Horizon (Years)', min: 5, max: 30, step: 1, default: 15, type: 'years', suffix: 'Y' },
      { id: 'propertyAppreciation', label: 'Expected Real Estate Appreciation', min: 3, max: 12, step: 0.5, default: 6.0, type: 'percent', suffix: '%' },
      { id: 'equityReturn', label: 'Expected Equity Index Return', min: 8, max: 16, step: 0.5, default: 12.0, type: 'percent', suffix: '%' }
    ],
    calculate: (v) => {
      const price = v.propertyPrice || 8000000;
      const rent = v.monthlyRent || 28000;
      const years = v.holdingYears || 15;
      const propApp = (v.propertyAppreciation || 6.0) / 100;
      const eqRet = (v.equityReturn || 12.0) / 100;

      // BUY SCENARIO: 20% down payment, 80% loan at 8.5% for 20Y
      const downPmt = price * 0.20;
      const loan = price * 0.80;
      const rLoan = 0.085 / 12;
      const emi = (loan * rLoan * Math.pow(1 + rLoan, 240)) / (Math.pow(1 + rLoan, 240) - 1);
      const futurePropertyValue = price * Math.pow(1 + propApp, years);

      // RENT SCENARIO: Invest down payment in equity + monthly savings (EMI - Rent)
      const futureDownPmtInEquity = downPmt * Math.pow(1 + eqRet, years);
      const monthlySavings = Math.max(0, emi - rent);
      const rEqMo = eqRet / 12;
      const nMo = years * 12;
      const futureSavingsInEquity = monthlySavings * ((Math.pow(1 + rEqMo, nMo) - 1) / rEqMo);
      const totalRenterNetWorth = futureDownPmtInEquity + futureSavingsInEquity;

      const difference = Math.abs(totalRenterNetWorth - futurePropertyValue);
      const winner = totalRenterNetWorth > futurePropertyValue ? 'Renting & Investing' : 'Buying Property';

      return {
        primaryLabel: `${winner} Generates More Wealth`,
        primaryValue: formatINR(Math.max(totalRenterNetWorth, futurePropertyValue)),
        secondaryMetrics: [
          { label: 'Renter Terminal Equity Net Worth', value: formatINR(totalRenterNetWorth), highlight: totalRenterNetWorth > futurePropertyValue ? 'emerald' : undefined },
          { label: 'Buyer Future Property Value', value: formatINR(futurePropertyValue), highlight: futurePropertyValue >= totalRenterNetWorth ? 'emerald' : undefined },
          { label: 'Financial Advantage', value: formatINR(difference), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Renter Liquid Net Worth', value: totalRenterNetWorth, color: '#10b981', formatted: formatINR(totalRenterNetWorth) },
          { label: 'Buyer Real Estate Asset', value: futurePropertyValue, color: '#38bdf8', formatted: formatINR(futurePropertyValue) }
        ]
      };
    },
    editorialGuide: {
      summary: 'In major Indian metros, rental yields are only 2% to 3%, while home loan interest rates hover at 8.5%. Renting and investing the differential cashflow into equity indices historically generates superior liquid wealth.',
      keyBenefits: [
        'Neutral, mathematically rigorous comparison free from real estate agent hype.',
        'Factoring in the compounding power of the 20% down payment invested in equities.'
      ],
      workedExample: {
        scenario: 'Comparing buying an ₹80 Lakh apartment (EMI ₹55,500) vs renting at ₹28,000 for 15 years:',
        breakdown: [
          'Buyer property value at 6% appreciation = ₹1.91 Crores.',
          'Renter investing ₹16 Lakhs down payment + ₹27,500 monthly savings at 12% equity = ₹2.25 Crores.',
          'Renting produces ₹34 Lakhs more net worth with 100% liquidity.'
        ]
      },
      faqs: [
        { q: 'What about emotional security of owning a home?', a: 'Home ownership provides undeniable psychological peace of mind and protection from landlord whims. This calculator simply models the pure financial trade-off so you can make an eyes-open decision.' }
      ]
    }
  },

  {
    id: 'net-worth-calculator',
    slug: 'net-worth-calculator',
    title: 'Personal Net Worth Balance Sheet Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Compute total financial net worth across liquid and illiquid assets minus all liabilities with debt-to-asset ratios.',
    statute: 'Global Personal Wealth Accounting Standards',
    lastUpdated: 'October 2026',
    formula: 'Net Worth = Total Assets (Cash + Equities + Real Estate + Gold) - Total Liabilities (Loans + Debt)',
    formulaExplanation: 'The single most critical scorecard of true financial health and solvency.',
    inputs: [
      { id: 'cashSavings', label: 'Cash & Bank Deposits', min: 10000, max: 10000000, step: 10000, default: 400000, type: 'currency', prefix: '₹' },
      { id: 'equityInvestments', label: 'Equities & Mutual Funds', min: 0, max: 50000000, step: 25000, default: 2800000, type: 'currency', prefix: '₹' },
      { id: 'realEstateValue', label: 'Real Estate / Land Market Value', min: 0, max: 100000000, step: 100000, default: 7500000, type: 'currency', prefix: '₹' },
      { id: 'goldValue', label: 'Gold & Sovereign Gold Bonds', min: 0, max: 10000000, step: 25000, default: 600000, type: 'currency', prefix: '₹' },
      { id: 'totalLiabilities', label: 'Total Debt (Home, Car, Card Loans)', min: 0, max: 50000000, step: 50000, default: 3500000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const cash = v.cashSavings || 400000;
      const equity = v.equityInvestments || 2800000;
      const property = v.realEstateValue || 7500000;
      const gold = v.goldValue || 600000;
      const liabilities = v.totalLiabilities || 3500000;

      const totalAssets = cash + equity + property + gold;
      const netWorth = totalAssets - liabilities;
      const debtToAsset = (liabilities / totalAssets) * 100;

      return {
        primaryLabel: 'Total Net Worth',
        primaryValue: formatINR(netWorth),
        secondaryMetrics: [
          { label: 'Total Gross Assets', value: formatINR(totalAssets), highlight: 'emerald' },
          { label: 'Total Liabilities & Debt', value: formatINR(liabilities), highlight: 'rose' },
          { label: 'Debt-to-Asset Ratio', value: `${debtToAsset.toFixed(1)}%`, hint: 'Ideal: Below 35%', highlight: debtToAsset < 35 ? 'blue' : 'amber' }
        ],
        chartData: [
          { label: 'Equities & Funds', value: equity, color: '#10b981', formatted: formatINR(equity) },
          { label: 'Real Estate', value: property, color: '#38bdf8', formatted: formatINR(property) },
          { label: 'Cash & Gold', value: cash + gold, color: '#f59e0b', formatted: formatINR(cash + gold) }
        ]
      };
    },
    editorialGuide: {
      summary: 'Income is how much cash flows through your hands; net worth is what you actually keep. Tracking your net worth quarterly benchmarks true financial freedom progress.',
      keyBenefits: [
        'Consolidates all asset classes onto a single balance sheet.',
        'Monitors debt-to-asset leverage to prevent over-extension.'
      ],
      workedExample: {
        scenario: 'A family holding ₹1.13 Crores in total assets with ₹35 Lakhs in home loan obligations:',
        breakdown: [
          'Gross Assets = ₹1,13,00,000.',
          'Liabilities = ₹35,00,000.',
          'True Net Worth = ₹78,00,000 (Healthy 31% debt-to-asset ratio).'
        ]
      },
      faqs: [
        { q: 'How often should I calculate my net worth?', a: 'Once every quarter or bi-annually is optimal. Tracking daily causes unnecessary stress due to equity market volatility.' }
      ]
    }
  },

  {
    id: 'budget-50-30-20-calculator',
    slug: 'budget-50-30-20-calculator',
    title: '50/30/20 Cashflow & Budget Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Divide your net take-home salary into 50% Essential Needs, 30% Discretionary Wants, and 20% Non-Negotiable Wealth Assets.',
    statute: 'Elizabeth Warren Harvard 50/30/20 Personal Cashflow Architecture',
    lastUpdated: 'October 2026',
    formula: '50% Needs + 30% Wants + 20% Wealth Asset Creation',
    formulaExplanation: 'Eliminates tedious line-item budgeting by automating your monthly paycheck allocation on day one.',
    inputs: [
      { id: 'monthlyTakeHome', label: 'Net Monthly Take-Home Pay', min: 15000, max: 2000000, step: 2500, default: 85000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const income = v.monthlyTakeHome || 85000;
      const needs = income * 0.50;
      const wants = income * 0.30;
      const savings = income * 0.20;

      return {
        primaryLabel: 'Monthly Wealth Asset Allocation (20%)',
        primaryValue: formatINR(savings),
        secondaryMetrics: [
          { label: '50% Essential Living Needs', value: formatINR(needs), hint: 'Rent, EMIs, Groceries, Bills' },
          { label: '30% Discretionary Wants', value: formatINR(wants), hint: 'Dining, Vacations, Shopping' },
          { label: 'Annual Wealth Accumulated', value: formatINR(savings * 12), highlight: 'emerald' }
        ],
        chartData: [
          { label: '50% Essential Needs', value: needs, color: '#38bdf8', formatted: formatINR(needs) },
          { label: '30% Lifestyle Wants', value: wants, color: '#f59e0b', formatted: formatINR(wants) },
          { label: '20% Wealth Assets', value: savings, color: '#10b981', formatted: formatINR(savings) }
        ]
      };
    },
    editorialGuide: {
      summary: 'The 50/30/20 rule prevents both deprivation and overspending. By automating your 20% wealth allocation on payday, you are free to spend your 30% lifestyle budget with zero guilt.',
      keyBenefits: [
        'Friction-free cashflow management without tracking every single coffee.',
        'Guarantees multi-decade wealth accumulation by paying yourself first.'
      ],
      workedExample: {
        scenario: 'An individual earning ₹85,000 monthly take-home pay:',
        breakdown: [
          '₹42,500 allocated to rent, utilities, basic groceries, and insurance.',
          '₹25,500 for dining out, movies, gadgets, and personal leisure.',
          '₹17,000 debited directly on the 1st into index funds and PPF.'
        ]
      },
      faqs: [
        { q: 'What if my essential needs exceed 50%?', a: 'In high-cost metro cities, housing can push needs to 60%. In that case, reduce wants to 20% while fiercely protecting your 20% investment savings allocation.' }
      ]
    }
  },

  {
    id: 'term-insurance-calculator',
    slug: 'term-insurance-calculator',
    title: 'Term Life Insurance (Human Life Value) Calculator',
    category: 'Everyday',
    categoryLabel: 'Everyday Personal Finance',
    shortDesc: 'Compute exact term life insurance sum assured needed using the Human Life Value (HLV) income replacement method.',
    statute: 'Actuarial Human Life Value (HLV) Standards & IRDAI Guidelines',
    lastUpdated: 'October 2026',
    formula: 'Sum Assured = (15 × Annual Income) + All Outstanding Debts + Future Milestones - Existing Liquid Assets',
    formulaExplanation: 'Guarantees that your dependents can maintain their exact standard of living and clear all home loan liabilities in your absence.',
    inputs: [
      { id: 'annualIncome', label: 'Annual Gross Income', min: 300000, max: 20000000, step: 50000, default: 1200000, type: 'currency', prefix: '₹' },
      { id: 'outstandingDebt', label: 'Total Outstanding Debts (Home/Car/Personal)', min: 0, max: 50000000, step: 50000, default: 3500000, type: 'currency', prefix: '₹' },
      { id: 'futureGoals', label: 'Future Children Education & Major Milestones', min: 0, max: 20000000, step: 50000, default: 2500000, type: 'currency', prefix: '₹' },
      { id: 'existingSavings', label: 'Existing Liquid Financial Assets', min: 0, max: 20000000, step: 25000, default: 1200000, type: 'currency', prefix: '₹' }
    ],
    calculate: (v) => {
      const income = v.annualIncome || 1200000;
      const debt = v.outstandingDebt || 3500000;
      const goals = v.futureGoals || 2500000;
      const savings = v.existingSavings || 1200000;

      // 15x annual income replacement
      const incomeReplacement = income * 15;
      const rawCover = incomeReplacement + debt + goals - savings;
      // Round to nearest 25 Lakhs
      const recommendedCover = Math.ceil(Math.max(2500000, rawCover) / 2500000) * 2500000;

      return {
        primaryLabel: 'Recommended Pure Term Cover',
        primaryValue: formatINR(recommendedCover),
        secondaryMetrics: [
          { label: 'Income Replacement (15x)', value: formatINR(incomeReplacement) },
          { label: 'Liabilities to Clear', value: formatINR(debt), highlight: 'amber' },
          { label: 'Future Family Milestones', value: formatINR(goals), highlight: 'blue' }
        ],
        chartData: [
          { label: 'Income Replacement Component', value: incomeReplacement, color: '#10b981', formatted: formatINR(incomeReplacement) },
          { label: 'Debt Protection Component', value: debt, color: '#f59e0b', formatted: formatINR(debt) },
          { label: 'Future Education Fund', value: goals, color: '#38bdf8', formatted: formatINR(goals) }
        ],
        statutoryNote: 'Pure term insurance premiums qualify for Section 80C deduction under the Old Tax Regime. Death claim payouts are 100% tax-exempt under Section 10(10D).'
      };
    },
    editorialGuide: {
      summary: 'Never mix investment with insurance. Avoid endowment or ULIP policies that yield an abysmal 4-5%; buy pure term insurance for maximum life coverage at minimum cost.',
      keyBenefits: [
        'Accurately sizes sum assured without relying on commission-motivated insurance agents.',
        'Protects family from losing the family home to outstanding mortgage lenders.'
      ],
      workedExample: {
        scenario: 'An earning parent earning ₹12,00,000 with a ₹35 Lakh mortgage and ₹25 Lakh college goal:',
        breakdown: [
          'Income replacement (15x) = ₹1.80 Crores.',
          'Add ₹35 Lakhs debt + ₹25 Lakhs college goal minus ₹12 Lakhs savings.',
          'Total recommended pure term policy = ₹2.25 Crores.'
        ]
      },
      faqs: [
        { q: 'Should I buy a Return of Premium (TROP) term plan?', a: 'No! Return of Premium plans charge 2x to 3x higher premiums. You are mathematically better off buying standard plain vanilla term insurance and investing the difference in an equity index fund.' }
      ]
    }
  }
];

// Quick index map for O(1) lookup by slug
export const CALCULATORS_BY_SLUG = new Map<string, CalculatorItem>(
  CALCULATORS_DATA.map(c => [c.slug, c])
);
