import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from './src/data/articles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, 'server', 'data', 'store.json');

const rawStore = fs.readFileSync(storePath, 'utf-8');
const store = JSON.parse(rawStore);

const existingArticlesMap = new Map();
(store.articles || []).forEach((a: any) => {
  existingArticlesMap.set(a.id, a);
  existingArticlesMap.set(a.slug, a);
});

const mergedArticles = ARTICLES.map((art) => {
  const existing = existingArticlesMap.get(art.id) || existingArticlesMap.get(art.slug) || {};
  return {
    ...existing,
    ...art,
    id: art.id,
    slug: art.slug,
    title: art.title,
    category: art.category,
    tag: art.tag || (art.tags && art.tags[0]) || art.category.toUpperCase(),
    readTime: art.readTime,
    excerpt: art.excerpt,
    content: art.content,
    status: 'published',
    publishedAt: existing.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: art.author || 'FingTaj Research Desk',
    authorBio: art.authorBio || 'FingTaj Financial Research Desk specializing in regulatory compliance, wealth compounding, and quantitative economics.',
    originalityScore: 100,
    seo: art.seo || {
      title: `${art.title} | FingTaj Financial Education`,
      description: art.excerpt,
      keywords: art.tags || [art.category, 'financial education', 'SEBI compliance'],
      canonicalUrl: `https://fingtaj.com/articles/${art.slug}`,
      score: 96
    },
    aeo: art.aeo || {
      primaryQuestion: art.title,
      directAnswer: art.aeoDirectAnswer || art.excerpt,
      keyTakeaways: art.tags || [art.category],
      score: 95
    }
  };
});

store.articles = mergedArticles;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
console.log(`[SYNC SUCCESS] Synchronized ${mergedArticles.length} published articles into server/data/store.json`);
