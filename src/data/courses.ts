import { CourseModule } from '../types';

export const COURSES: CourseModule[] = [
  {
    id: 'course-foundations',
    title: 'Financial Literacy & Cashflow Systems',
    tag: 'Foundation',
    level: 'Beginner',
    lessonsCount: 12,
    duration: '3.5 Hours',
    desc: 'Master the basics of money velocity, cashflow accounting, 50/30/20 budgeting, and inflation-hedged emergency funds.',
    syllabus: [
      { title: 'Lesson 1: The Velocity of Money', desc: 'Understanding purchasing power degradation and sovereign fiat inflation mechanics.' },
      { title: 'Lesson 2: Automated 50/30/20 Architecture', desc: 'Partitioning income into non-overlapping pools without tracking manual expenses.' },
      { title: 'Lesson 3: The 6-Month Liquid Moat', desc: 'Calculating core survival burn rate and multi-tiered cash distribution.' },
      { title: 'Lesson 4: Bank Account Topology', desc: 'Income Hub, Living Vault, and Discretionary Sub-Accounts.' }
    ]
  },
  {
    id: 'course-valuation',
    title: 'Capital Markets & Equity Valuation',
    tag: 'Intermediate',
    level: 'Intermediate',
    lessonsCount: 18,
    duration: '5.2 Hours',
    desc: 'Understand market indexes, P/E multiples, balance sheet mechanics, and Discounted Cash Flow (DCF) intrinsic modeling.',
    syllabus: [
      { title: 'Lesson 1: Deconstructing Financial Statements', desc: 'Translating 10-K, Balance Sheet, and Statement of Cash Flows.' },
      { title: 'Lesson 2: Free Cash Flow vs Operating Profit', desc: 'Why cash flow cannot be engineered by accrual accounting.' },
      { title: 'Lesson 3: Multi-Stage DCF Modeling', desc: 'Calculating WACC, forecasting revenue curves, and terminal value.' },
      { title: 'Lesson 4: Margin of Safety Protocol', desc: 'How institutional value funds avoid permanent capital impairment.' }
    ]
  },
  {
    id: 'course-debt',
    title: 'Debt Elimination & Mortgage Mastery',
    tag: 'Advanced',
    level: 'Advanced',
    lessonsCount: 15,
    duration: '4.0 Hours',
    desc: 'Mathematical algorithms for debt elimination (Avalanche vs. Snowball), prepayment economics, and CIBIL 800+ credit scoring.',
    syllabus: [
      { title: 'Lesson 1: Front-Loaded Amortization Schedules', desc: 'Why the first 5 years of a mortgage are heavily weighted towards interest.' },
      { title: 'Lesson 2: The Extra-EMI Power Law', desc: 'Paying 1 extra installment annually compresses a 20-year loan to 15 years.' },
      { title: 'Lesson 3: 5% Annual Step-Up Prepayment', desc: 'Scaling loan repayment with salary increases.' },
      { title: 'Lesson 4: Engineering CIBIL 800+ Score', desc: 'Managing credit utilization, credit age, and report dispute protocols.' }
    ]
  }
];
