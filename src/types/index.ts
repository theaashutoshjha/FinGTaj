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
  name: string;
  email: string;
  picture?: string;
  authMethod: string;
  loginTime: string;
}

export interface Order {
  orderId: string;
  paymentId: string;
  method: string;
  items: CartItem[];
  totalINR: number;
  date: string;
}

export interface Article {
  id: string;
  slug: string;
  tag: string;
  category: 'trading' | 'finance' | 'loans';
  title: string;
  excerpt: string;
  readTime: string;
  content: string;
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
