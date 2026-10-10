import { Article } from '../types';
import { TRADING_ARTICLES } from './articles/trading';
import { FINANCE_ARTICLES } from './articles/finance';
import { LOANS_ARTICLES } from './articles/loans';
import { TECH_ARTICLES } from './articles/tech';

const RAW_ARTICLES: Article[] = [
  ...TRADING_ARTICLES,
  ...FINANCE_ARTICLES,
  ...LOANS_ARTICLES,
  ...TECH_ARTICLES
];

// Normalize all articles to have guaranteed tags, SEO, and AEO metadata
export const ARTICLES: Article[] = RAW_ARTICLES.map(art => {
  const categoryTag = art.tag || (art.tags && art.tags.length > 0 ? art.tags[0] : art.category.toUpperCase());
  
  return {
    ...art,
    tag: categoryTag,
    tags: art.tags || [categoryTag],
    seo: art.seo || {
      title: `${art.title} | FingTaj Financial Education`,
      description: art.excerpt,
      keywords: art.tags || [art.category, 'financial education', 'investing', 'SEBI compliance'],
      score: 95
    },
    aeo: art.aeo || {
      primaryQuestion: art.title,
      directAnswer: art.aeoDirectAnswer || art.excerpt,
      keyTakeaways: art.tags || [art.category, 'education'],
      score: 94
    }
  };
});
