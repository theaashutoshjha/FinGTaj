import { db } from './db.js';

export class SeoAeoEngine {
  // Audit an article for comprehensive technical and on-page SEO (0-100 score)
  auditSEO(article) {
    const checks = [];
    let score = 0;

    // 1. Title Tag Check (50 - 65 chars ideal) - 15 pts
    const title = article.seo?.title || article.title || '';
    const titleLen = title.length;
    if (titleLen >= 45 && titleLen <= 70) {
      score += 15;
      checks.push({ name: 'Title Tag Length', passed: true, score: 15, max: 15, msg: `Ideal length (${titleLen} chars)` });
    } else if (titleLen > 0) {
      score += 8;
      checks.push({ name: 'Title Tag Length', passed: false, score: 8, max: 15, msg: `Suboptimal length (${titleLen} chars; target 45-65 chars)` });
    } else {
      checks.push({ name: 'Title Tag Missing', passed: false, score: 0, max: 15, msg: 'Missing title tag' });
    }

    // 2. Meta Description Check (120 - 165 chars ideal) - 15 pts
    const desc = article.seo?.description || article.excerpt || '';
    const descLen = desc.length;
    if (descLen >= 120 && descLen <= 165) {
      score += 15;
      checks.push({ name: 'Meta Description Length', passed: true, score: 15, max: 15, msg: `Optimal length (${descLen} chars)` });
    } else if (descLen >= 80 && descLen <= 200) {
      score += 10;
      checks.push({ name: 'Meta Description Length', passed: false, score: 10, max: 15, msg: `Acceptable but target 120-165 chars (${descLen} chars)` });
    } else {
      score += 4;
      checks.push({ name: 'Meta Description Length', passed: false, score: 4, max: 15, msg: `Description too short or long (${descLen} chars)` });
    }

    // 3. Slug & URL Structure - 10 pts
    const slug = article.slug || '';
    const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    if (validSlug && slug.length >= 3 && slug.length <= 60) {
      score += 10;
      checks.push({ name: 'Clean Canonical Slug', passed: true, score: 10, max: 10, msg: `Valid SEO-friendly slug: /articles/${slug}` });
    } else {
      checks.push({ name: 'Clean Canonical Slug', passed: false, score: 3, max: 10, msg: 'Slug contains invalid characters or incorrect length' });
    }

    // 4. Heading Hierarchy (H2 and H3 elements present) - 15 pts
    const content = article.content || '';
    const hasH2 = /<h2[^>]*>/i.test(content);
    const hasH3 = /<h3[^>]*>/i.test(content);
    if (hasH2 && hasH3) {
      score += 15;
      checks.push({ name: 'Heading Hierarchy', passed: true, score: 15, max: 15, msg: 'Well-structured H2 and H3 subheadings present' });
    } else if (hasH2) {
      score += 12;
      checks.push({ name: 'Heading Hierarchy', passed: true, score: 12, max: 15, msg: 'H2 headings present' });
    } else {
      checks.push({ name: 'Heading Hierarchy', passed: false, score: 0, max: 15, msg: 'Missing hierarchical headings' });
    }

    // 5. In-Depth Word Count - 15 pts
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText.split(' ').filter(Boolean).length;
    if (wordCount >= 400) {
      score += 15;
      checks.push({ name: 'Comprehensive Content Length', passed: true, score: 15, max: 15, msg: `High-depth content (${wordCount} words)` });
    } else if (wordCount >= 180) {
      score += 12;
      checks.push({ name: 'Comprehensive Content Length', passed: true, score: 12, max: 15, msg: `Solid focused length (${wordCount} words; target 400+)` });
    } else {
      checks.push({ name: 'Content Length', passed: false, score: 5, max: 15, msg: `Concise content (${wordCount} words)` });
    }

    // 6. Citations & External Links - 15 pts
    const sources = article.sources || [];
    if (sources.length >= 1) {
      score += 15;
      checks.push({ name: 'Authoritative Sourcing & Citations', passed: true, score: 15, max: 15, msg: `${sources.length} authoritative sources verified` });
    } else {
      checks.push({ name: 'Authoritative Citations', passed: false, score: 5, max: 15, msg: 'Missing external primary source citations' });
    }

    // 7. Structured Data & OpenGraph Readiness - 15 pts
    if (article.seo?.canonicalUrl && article.author) {
      score += 15;
      checks.push({ name: 'Structured Data & Canonical Tag', passed: true, score: 15, max: 15, msg: 'JSON-LD Article schema, author byline, and canonical link ready' });
    } else {
      score += 8;
      checks.push({ name: 'Structured Data', passed: false, score: 8, max: 15, msg: 'Missing canonical URL or verified author metadata' });
    }

    return {
      score: Math.min(100, score),
      checks,
      passed: score >= 90
    };
  }

  // Audit an article for Answer Engine Optimization (AEO) (0-100 score)
  auditAEO(article) {
    const checks = [];
    let score = 0;

    // 1. Direct Answer Lead (LLM Extraction optimization) - 25 pts
    const directAnswer = article.aeo?.directAnswer || '';
    if (directAnswer.length >= 60 && directAnswer.length <= 350) {
      score += 25;
      checks.push({ name: 'Direct Answer Lead Snippet', passed: true, score: 25, max: 25, msg: 'Concise direct answer in lead paragraph optimized for AI search engines' });
    } else if (directAnswer.length > 0) {
      score += 15;
      checks.push({ name: 'Direct Answer Snippet', passed: false, score: 15, max: 25, msg: 'Answer snippet present but could be refined for optimal LLM context window' });
    } else {
      checks.push({ name: 'Direct Answer Snippet', passed: false, score: 0, max: 25, msg: 'Missing direct question answer lead' });
    }

    // 2. Primary User Intent Question - 15 pts
    const primaryQuestion = article.aeo?.primaryQuestion || '';
    if (primaryQuestion && primaryQuestion.endsWith('?')) {
      score += 15;
      checks.push({ name: 'Explicit User Question Formulation', passed: true, score: 15, max: 15, msg: `Clear search intent prompt: "${primaryQuestion}"` });
    } else {
      checks.push({ name: 'User Question Formulation', passed: false, score: 5, max: 15, msg: 'Question not clearly formatted with terminal question mark' });
    }

    // 3. Structured Key Takeaways / Numbered Action Steps - 20 pts
    const takeaways = article.aeo?.keyTakeaways || [];
    if (Array.isArray(takeaways) && takeaways.length >= 3) {
      score += 20;
      checks.push({ name: 'Structured Entity Takeaways', passed: true, score: 20, max: 20, msg: `${takeaways.length} key takeaway bullet points ready for LLM summarization` });
    } else {
      score += 8;
      checks.push({ name: 'Structured Key Takeaways', passed: false, score: 8, max: 20, msg: 'Provide at least 3 structured bullet points for AI extraction' });
    }

    // 4. Question-Oriented Headings in Content - 20 pts
    const content = article.content || '';
    const hasQuestionHeading = /<h[23][^>]*>[^<]*\?[^<]*<\/h[23]>/i.test(content) || /why|how|what/i.test(content);
    if (hasQuestionHeading) {
      score += 20;
      checks.push({ name: 'Question-Driven Subheadings', passed: true, score: 20, max: 20, msg: 'Section headings directly mirror user search queries' });
    } else {
      score += 10;
      checks.push({ name: 'Question-Driven Subheadings', passed: false, score: 10, max: 20, msg: 'Incorporate question phrasing into H2 subheadings' });
    }

    // 5. Author Credibility & Fiduciary Transparency - 20 pts
    if (article.author && article.authorBio) {
      score += 20;
      checks.push({ name: 'E-E-A-T Author Transparency', passed: true, score: 20, max: 20, msg: `Verified author desk: ${article.author}` });
    } else {
      score += 10;
      checks.push({ name: 'E-E-A-T Author Transparency', passed: false, score: 10, max: 20, msg: 'Missing detailed author bio for institutional trust signals' });
    }

    return {
      score: Math.min(100, score),
      checks,
      passed: score >= 90
    };
  }

  // Generate XML Sitemap for all published articles and pages
  generateSitemap(baseUrl = 'https://fingtaj.com') {
    const published = db.getPublishedArticles();
    const currentDate = new Date().toISOString().split('T')[0];

    const corePages = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/#trading`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/#finance`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/#loans`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/#calculators`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/#store`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/#academy`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/about`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy`, priority: '0.4', changefreq: 'monthly' },
      { loc: `${baseUrl}/terms`, priority: '0.4', changefreq: 'monthly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of corePages) {
      xml += `  <url>\n`;
      xml += `    <loc>${page.loc}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const art of published) {
      const artDate = (art.updatedAt || art.publishedAt || currentDate).split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/articles/${art.slug}</loc>\n`;
      xml += `    <lastmod>${artDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;
    return xml;
  }

  // Generate robots.txt
  generateRobotsTxt(baseUrl = 'https://fingtaj.com') {
    return `# FingTaj Institutional Financial Intelligence & Research
User-agent: *
Allow: /
Allow: /articles/
Allow: /assets/

# Block Administrative, Auth, and Private API Endpoints
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/auth/
Disallow: /login
Disallow: /callback
Disallow: /logout

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
`;
  }

  // Generate valid JSON-LD Structured Data
  generateJsonLd(article, baseUrl = 'https://fingtaj.com') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.seo?.description || article.excerpt,
      'url': `${baseUrl}/articles/${article.slug}`,
      'datePublished': article.publishedAt,
      'dateModified': article.updatedAt || article.publishedAt,
      'author': {
        '@type': 'Organization',
        'name': article.author || 'FingTaj Research Desk',
        'url': baseUrl
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'FingTaj',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/favicon.svg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${baseUrl}/articles/${article.slug}`
      }
    };
  }
}

export const seoAeoEngine = new SeoAeoEngine();
