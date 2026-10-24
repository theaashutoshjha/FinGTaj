export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  credentials: string[];
  expertise: string[];
  location: string;
  experienceYears: number;
  editorialPledge: string;
  email: string;
}

export const AUTHORS: Record<string, AuthorProfile> = {
  'aashutosh-jha': {
    slug: 'aashutosh-jha',
    name: 'Aashutosh Jha',
    role: 'Founder & Chief Financial Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Aashutosh is a financial systems technologist, author, and researcher specializing in Indian capital markets, algorithmic compounding models, and tax-optimized retirement mechanics. He founded FinGTaj to democratize institutional-grade financial literacy without commercial kickbacks or sponsored bias.',
    credentials: [
      'NISM Certified Research Analyst (Series XV)',
      'Certified Financial Modeling & Valuation Analyst (FMVA)',
      'B.Tech in Computer Science & Financial Systems Architecture'
    ],
    expertise: [
      'Index Fund Compounding Mechanics',
      'Loan Amortization & Opportunity Cost Arbitrage',
      'Capital Gains Taxation (LTCG / STCG)',
      'SEBI Regulatory Compliance & Investor Protection'
    ],
    location: 'Bengaluru, India',
    experienceYears: 8,
    editorialPledge: 'Every calculation, scenario matrix, and tax analysis published on FinGTaj is verified against official RBI, SEBI, and CBDT master circulars. We operate on a zero-kickback, zero-sponsored-recommendation policy.',
    email: 'admin@fingtaj.com'
  },
  'fingtaj-research-team': {
    slug: 'fingtaj-research-team',
    name: 'FingTaj Research Desk',
    role: 'Capital Markets & YMYL Editorial Collective',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    bio: 'The FingTaj Research Collective is an interdisciplinary team of market analysts, chartered accountants, and quantitative developers. The desk audits mutual fund performance metrics, macro interest rate changes, and Indian tax law amendments to deliver fact-checked financial guidance.',
    credentials: [
      'Peer-Reviewed Financial Engineering Models',
      'CBDT Section 112A / 115BAC Regulatory Verification',
      'RBI Repo Rate Impact Audits'
    ],
    expertise: [
      'Personal Cash Flow Governance (50/30/20)',
      'Emergency Fund Staging & Liquidity Architecture',
      'Fixed Income & Sovereign Gold Bonds (SGB)',
      'Debt Snowball vs. Avalanche Optimization'
    ],
    location: 'India',
    experienceYears: 10,
    editorialPledge: 'We do not sell financial products or earn affiliate commissions from credit card companies or loan brokers. All guides are formulated solely for educational research.',
    email: 'editorial@fingtaj.com'
  }
};

export const getAuthorBySlug = (slug: string): AuthorProfile => {
  const normalized = slug.toLowerCase().trim();
  if (AUTHORS[normalized]) return AUTHORS[normalized];
  if (normalized.includes('aashutosh')) return AUTHORS['aashutosh-jha'];
  return AUTHORS['fingtaj-research-team'];
};
