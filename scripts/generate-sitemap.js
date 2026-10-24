import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const articleFiles = [
  { name: 'trading.ts', category: 'trading' },
  { name: 'finance.ts', category: 'finance' },
  { name: 'loans.ts', category: 'loans' },
  { name: 'tech.ts', category: 'tech' }
];

const articles = [];

articleFiles.forEach(f => {
  const filePath = path.join(projectRoot, 'src', 'data', 'articles', f.name);
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/\{\s*id:\s*'/);
  blocks.slice(1).forEach(b => {
    const slugMatch = b.match(/slug:\s*'([^']+)'/);
    const titleMatch = b.match(/title:\s*'([^']+)'/);
    const dateMatch = b.match(/(?:date|publishedAt):\s*'([^']+)'/);
    if (slugMatch && titleMatch) {
      articles.push({
        slug: slugMatch[1],
        title: titleMatch[1],
        date: dateMatch ? dateMatch[1].split('T')[0] : '2026-03-30',
        category: f.category
      });
    }
  });
});

console.log(`Found ${articles.length} educational articles across all disciplines.`);

const corePages = [
  { loc: 'https://fingtaj.com/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/articles', priority: '0.95', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/trading', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/finance', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/loans', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/tech', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://fingtaj.com/calculators', priority: '0.95', changefreq: 'weekly' },
  { loc: 'https://fingtaj.com/academy', priority: '0.85', changefreq: 'weekly' },
  { loc: 'https://fingtaj.com/store', priority: '0.85', changefreq: 'weekly' },
  { loc: 'https://fingtaj.com/about', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/privacy', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/terms', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/disclaimer', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/editorial', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/cookies', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://fingtaj.com/dmca', priority: '0.7', changefreq: 'monthly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Core Navigation, Simulators & Regulatory Compliance Portals -->
`;

corePages.forEach(p => {
  xml += `  <url>
    <loc>${p.loc}</loc>
    <lastmod>2026-03-30</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
});

xml += `\n  <!-- Complete 80 Educational Financial, Investing & Loan Amortization Guides -->\n`;

articles.forEach(a => {
  xml += `  <url>
    <loc>https://fingtaj.com/articles/${a.slug}</loc>
    <lastmod>${a.date || '2026-03-30'}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

xml += `</urlset>\n`;

const targetSitemap = path.join(projectRoot, 'public', 'sitemap.xml');
fs.writeFileSync(targetSitemap, xml, 'utf8');

console.log(`[SUCCESS] Wrote ${corePages.length + articles.length} URLs to public/sitemap.xml`);
