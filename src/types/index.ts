export type Currency = 'INR' | 'USD';

export interface Product {
  id: string;
  category: 'spreadsheet' | 'blueprint' | 'membership';
  badge: string;
  title: string;
  desc: string;
  priceINR: number;
  origPriceINR: number;
  specs: string;
  rating: string;
  downloadFile: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface User {
  sub?: string;
  name: string;
  email: string;
  picture?: string;
  authMethod?: string;
  loginTime?: string;
  isAdmin?: boolean;
  role?: 'admin' | 'user';
}

export interface Order {
  orderId: string;
  paymentId: string;
  method: string;
  items: CartItem[];
  totalINR: number;
  date: string;
}

export interface SourceCitation {
  title: string;
  url: string;
  publishedDate?: string;
  snippet?: string;
}

export interface SEOCheck {
  name: string;
  passed: boolean;
  score: number;
  max: number;
  msg: string;
}

export interface AEOCheck {
  name: string;
  passed: boolean;
  score: number;
  max: number;
  msg: string;
}

export interface Article {
  id: string;
  slug: string;
  tag?: string;
  tags?: string[];
  category: 'trading' | 'finance' | 'loans' | 'tech';
  title: string;
  excerpt: string;
  readTime: string;
  content: string;
  author?: string;
  authorBio?: string;
  publishedAt?: string | null;
  date?: string;
  views?: number;
  featured?: boolean;
  aeoDirectAnswer?: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'archived';
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
    canonicalUrl?: string;
    score: number;
    checks?: SEOCheck[];
  };
  aeo?: {
    primaryQuestion: string;
    directAnswer: string;
    keyTakeaways: string[];
    score: number;
    checks?: AEOCheck[];
  };
  sources?: SourceCitation[];
  originalityScore?: number;
  originalityReport?: {
    passed: boolean;
    originalityScore: number;
    maxInternalSimilarity: number;
    sourceOverlapPercent: number;
    duplicateTitleFound: boolean;
    wordCount: number;
    notes: string;
  };
  factVerificationPassed?: boolean;
  factVerificationReport?: {
    passed: boolean;
    sampleExtractedMetrics?: string[];
    evidenceCount?: number;
    status: string;
  };
  jsonLd?: any;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  sourceName?: string;
  sourceUrl?: string;
  pubDate?: string;
  summary: string;
  relevanceScore?: number;
  status: 'discovered' | 'researching' | 'researched' | 'completed';
  discoveredAt?: string;
}

export interface PipelineJob {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  step: string;
  triggeredBy: string;
  createdAt: string;
  updatedAt?: string;
  logs: string[];
  articleId?: string;
  error?: string;
}

export interface SystemSettings {
  autoPublish: boolean;
  killSwitch: boolean;
  dailyGenerationLimit: number;
  geminiModel: string;
  cfModel: string;
  monthlyQuotaUsed: number;
  monthlyQuotaMax: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  msg: string;
  date: string;
  read: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  tag: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  duration: string;
  desc: string;
  syllabus: { title: string; desc: string }[];
}

export interface CalculatorState {
  sipAmount: number;
  sipReturn: number;
  sipYears: number;
  
  loanAmount: number;
  loanRate: number;
  loanTenureYears: number;
  loanPrepayment: number;

  fireExpenses: number;
  fireCurrentNetWorth: number;
  fireAnnualSavings: number;
}
