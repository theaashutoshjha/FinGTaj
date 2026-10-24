import { CALCULATOR_GUIDES } from './data/calculatorGuidesData.js';
import { db } from './db.js';

// Simple markdown-to-HTML parser for crawler indexing
function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 20px; margin: 24px 0 12px; color: #00f5ff;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; margin: 28px 0 14px; color: #ffffff;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 32px; margin: 32px 0 16px; color: #ffffff;">$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid #00f5ff; padding-left: 16px; margin: 16px 0; color: #94a3b8;">$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #00f5ff;">$1</a>')
    .replace(/---/gim, '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />');

  // Convert paragraphs
  const lines = html.split('\n\n');
  return lines.map(line => {
    line = line.trim();
    if (!line) return '';
    if (line.startsWith('<h1') || line.startsWith('<h2') || line.startsWith('<h3') || 
        line.startsWith('<blockquote') || line.startsWith('<div') || line.startsWith('<table') ||
        line.startsWith('<hr') || line.startsWith('<ul') || line.startsWith('<ol')) {
      return line;
    }
    return `<p style="font-size: 16px; line-height: 1.8; color: #cbd5e1; margin-bottom: 16px;">${line}</p>`;
  }).join('\n');
}

export function renderCrawlerHtml(rawPath, baseHtml, baseUrl = 'https://fingtaj.com') {
  const cleanPath = rawPath.toLowerCase().replace(/\/$/, '') || '/';
  const publishedArticles = db.getPublishedArticles();

  let pageTitle = 'FingTaj | Financial Education, Wealth Compounding Calculators & Investment Guides';
  let metaDescription = 'Master wealth compounding, loan amortizations, and Indian tax strategies with FingTaj\'s interactive calculators, peer-reviewed financial guides, and institutional research.';
  let canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
  let jsonLd = null;
  let bodyContent = '';

  // ----------------------------------------------------------------------------
  // 1. CALCULATOR ROUTES (Dedicated URLs and /calculators/:id)
  // ----------------------------------------------------------------------------
  const dedicatedCalcMap = {
    '/sip-calculator': 'sip',
    '/loan-emi-calculator': 'emi',
    '/income-tax-calculator': 'income-tax',
    '/ppf-calculator': 'ppf',
    '/inflation-adjusted-return-calculator': 'inflation',
    '/fd-calculator': 'fd',
    '/hra-calculator': 'hra',
    '/gratuity-calculator': 'gratuity',
    '/capital-gains-tax-calculator': 'capital-gains',
    '/section-44ada-calculator': '44ada'
  };

  const isDedicatedCalc = dedicatedCalcMap[cleanPath];
  if (cleanPath.startsWith('/calculators') || isDedicatedCalc) {
    let calcKey = isDedicatedCalc || cleanPath.replace('/calculators', '').replace(/^\//, '');
    if (!calcKey) calcKey = 'sip';
    if (calcKey === 'stepup') calcKey = 'step-up';

    const guide = CALCULATOR_GUIDES[calcKey] || CALCULATOR_GUIDES['sip'];
    pageTitle = `${guide.title} | FingTaj`;
    metaDescription = guide.metaDescription;
    canonicalUrl = `${baseUrl}${cleanPath}`;

    // FAQPage JSON-LD schema
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    bodyContent = `
      <header style="padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: #080e17;">
        <a href="/" style="font-size: 24px; font-weight: 800; color: #00f5ff; text-decoration: none;">FinG<span style="color: #fff;">Taj</span></a>
        <nav style="display: flex; gap: 20px;">
          <a href="/trading" style="color: #cbd5e1; text-decoration: none;">Investing</a>
          <a href="/finance" style="color: #cbd5e1; text-decoration: none;">Personal Finance</a>
          <a href="/loans" style="color: #cbd5e1; text-decoration: none;">Loans & EMIs</a>
          <a href="/calculators" style="color: #00f5ff; text-decoration: none; font-weight: 600;">Calculators</a>
          <a href="/academy" style="color: #cbd5e1; text-decoration: none;">Academy</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        </nav>
      </header>

      <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px;">
        <nav style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">
          <a href="/" style="color: #00f5ff; text-decoration: none;">Home</a> / 
          <a href="/calculators" style="color: #00f5ff; text-decoration: none;">Calculators</a> / 
          <span>${guide.title}</span>
        </nav>

        <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 16px;">
          ${guide.title}
        </h1>
        <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px;">
          ${guide.subtitle}
        </p>

        <!-- SECTION A: Interactive Simulator Overview -->
        <section style="background: rgba(255,255,255,0.03); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; padding: 28px; margin-bottom: 40px;">
          <h2 style="font-size: 20px; color: #00f5ff; margin-bottom: 12px;">Interactive Financial Modeling Tool</h2>
          <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
            This interactive simulator runs client-side compounding and amortization calculations with real-time reactive charting. Switch between tools below or scroll for mathematical formulas and worked scenario analysis:
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
            <a href="/calculators/sip" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">SIP Compounding</a>
            <a href="/calculators/emi" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">Loan EMI & Prepayment</a>
            <a href="/calculators/fire" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">FIRE Target Corpus</a>
            <a href="/calculators/step-up" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">Step-Up SIP Accelerator</a>
            <a href="/calculators/budget" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">50/30/20 Budgeting</a>
            <a href="/calculators/inflation" style="padding: 8px 16px; background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.3); border-radius: 6px; color: #00f5ff; text-decoration: none; font-size: 13px;">Inflation Decay</a>
          </div>
        </section>

        <!-- SECTION B: Mathematical Methodology & Formula -->
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px; margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #ffffff; margin-bottom: 16px;">Section B: Mathematical Methodology & Equation</h2>
          <div style="background: #0d1117; padding: 18px 24px; border-radius: 8px; border-left: 4px solid #00f5ff; font-family: monospace; font-size: 16px; color: #00f5ff; margin-bottom: 24px;">
            ${guide.formula}
          </div>
          <h3 style="font-size: 16px; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px;">Variable Definitions</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; color: #94a3b8;">
                <th style="padding: 10px;">Symbol</th>
                <th style="padding: 10px;">Mathematical Meaning</th>
                <th style="padding: 10px;">Operational Definition</th>
              </tr>
            </thead>
            <tbody>
              ${guide.formulaVariables.map(v => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <td style="padding: 12px 10px; font-weight: 700; color: #00f5ff;">${v.symbol}</td>
                  <td style="padding: 12px 10px; font-weight: 600;">${v.meaning}</td>
                  <td style="padding: 12px 10px; color: #94a3b8;">${v.explanation}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <!-- SECTION C: 3 Worked Scenarios Comparison Table -->
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px; margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #ffffff; margin-bottom: 12px;">Section C: Worked Scenario Matrix (Conservative vs. Moderate vs. Aggressive)</h2>
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">${guide.scenarioNotes}</p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(0,245,255,0.3); text-align: left; color: #00f5ff;">
                  <th style="padding: 12px 10px;">Scenario Model</th>
                  <th style="padding: 12px 10px;">Rate / Metric</th>
                  <th style="padding: 12px 10px;">Principal Input</th>
                  <th style="padding: 12px 10px;">Time Horizon</th>
                  <th style="padding: 12px 10px;">Estimated Accrual</th>
                  <th style="padding: 12px 10px;">Net Maturity / Total</th>
                </tr>
              </thead>
              <tbody>
                ${guide.scenarios.map(s => `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <td style="padding: 14px 10px; font-weight: 700; color: #fff;">${s.name}</td>
                    <td style="padding: 14px 10px; color: #10b981;">${s.rateOrTenure}</td>
                    <td style="padding: 14px 10px;">${s.monthlyOrPrincipal}</td>
                    <td style="padding: 14px 10px;">${s.duration}</td>
                    <td style="padding: 14px 10px; color: #00f5ff;">${s.estimatedReturnOrInterest}</td>
                    <td style="padding: 14px 10px; font-weight: 700; color: #10b981;">${s.netMaturityOrTotal}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- SECTION D: Strategic Regulatory & Tax Insights -->
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px; margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #ffffff; margin-bottom: 20px;">Section D: Strategic Insights & Indian Regulatory Nuance</h2>
          ${guide.strategicAnalysis.map(block => `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 18px; color: #00f5ff; margin-bottom: 12px;">${block.heading}</h3>
              ${block.paragraphs.map(p => `<p style="font-size: 15px; line-height: 1.8; color: #cbd5e1; margin-bottom: 12px;">${p}</p>`).join('')}
            </div>
          `).join('')}
        </section>

        <!-- SECTION E: Frequently Asked Questions Accordion -->
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px; margin-bottom: 40px;">
          <h2 style="font-size: 22px; color: #ffffff; margin-bottom: 20px;">Section E: Frequently Asked Questions</h2>
          ${guide.faqs.map((faq, idx) => `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px 0;">
              <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">${idx + 1}. ${faq.question}</h3>
              <p style="font-size: 14px; line-height: 1.7; color: #94a3b8; margin: 0;">${faq.answer}</p>
            </div>
          `).join('')}
        </section>

        <!-- SECTION F: In-Page Educational Disclaimer -->
        <blockquote style="background: rgba(0, 245, 255, 0.03); border-left: 4px solid #10b981; padding: 18px 24px; border-radius: 8px; font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 40px;">
          <strong>Regulatory Educational Notice: </strong> ${guide.disclaimer}
        </blockquote>
      </main>

      <footer style="background: #080e17; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 20px; text-align: center; font-size: 13px; color: #94a3b8;">
        <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px;">
          <a href="/privacy-policy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-of-service" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
          <a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">SEBI Disclaimer</a>
          <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact Us</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About Mission</a>
          <a href="/author/aashutosh-jha" style="color: #cbd5e1; text-decoration: none;">Author Profile</a>
        </div>
        <div>© 2026 FinGTaj Financial Technologies. Educational Research Platform.</div>
      </footer>
    `;
  }

  // ----------------------------------------------------------------------------
  // 2. ARTICLE ROUTES (/articles/:slug)
  // ----------------------------------------------------------------------------
  else if (cleanPath.startsWith('/articles/')) {
    const slug = cleanPath.replace('/articles/', '').replace(/\/$/, '');
    const article = db.getArticleBySlug(slug);

    if (article) {
      pageTitle = `${article.title} | FingTaj Educational Research`;
      metaDescription = article.seo?.description || article.excerpt || article.title;
      canonicalUrl = `${baseUrl}/articles/${article.slug}`;

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        url: canonicalUrl,
        datePublished: article.publishedAt || article.date || '2026-01-15T09:00:00.000Z',
        dateModified: article.updatedAt || article.date || '2026-03-30T12:00:00.000Z',
        author: {
          '@type': 'Person',
          name: article.author || 'Aashutosh Jha',
          url: `${baseUrl}/author/aashutosh-jha`
        },
        publisher: {
          '@type': 'Organization',
          name: 'FingTaj',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      };

      bodyContent = `
        <header style="padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: #080e17;">
          <a href="/" style="font-size: 24px; font-weight: 800; color: #00f5ff; text-decoration: none;">FinG<span style="color: #fff;">Taj</span></a>
          <nav style="display: flex; gap: 20px;">
            <a href="/trading" style="color: #cbd5e1; text-decoration: none;">Investing</a>
            <a href="/finance" style="color: #cbd5e1; text-decoration: none;">Personal Finance</a>
            <a href="/loans" style="color: #cbd5e1; text-decoration: none;">Loans & EMIs</a>
            <a href="/calculators" style="color: #cbd5e1; text-decoration: none;">Calculators</a>
            <a href="/academy" style="color: #cbd5e1; text-decoration: none;">Academy</a>
            <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
          </nav>
        </header>

        <article style="max-width: 860px; margin: 40px auto; padding: 0 20px;">
          <nav style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">
            <a href="/" style="color: #00f5ff; text-decoration: none;">Home</a> / 
            <a href="/${article.category}" style="color: #00f5ff; text-decoration: none; text-transform: capitalize;">${article.category}</a> / 
            <span>${article.title}</span>
          </nav>

          <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 16px;">
            ${article.title}
          </h1>

          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 32px; font-size: 13px; color: #94a3b8;">
            <span>By <a href="/author/aashutosh-jha" style="color: #00f5ff; text-decoration: none; font-weight: 600;">${article.author || 'FingTaj Research Desk'}</a></span>
            <span>•</span>
            <span>Published: ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : (article.date || 'March 2026')}</span>
            <span>•</span>
            <span>Read Time: ${article.readTime || '8 min read'}</span>
            <span>•</span>
            <span style="color: #10b981; font-weight: 600;">Peer-Reviewed YMYL Research</span>
          </div>

          <!-- Executive Summary -->
          <div style="background: rgba(0, 245, 255, 0.04); border-left: 4px solid #00f5ff; padding: 20px 24px; border-radius: 8px; margin-bottom: 32px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #00f5ff; margin-bottom: 8px;">
              Executive Summary & Key Takeaway
            </div>
            <p style="font-size: 15px; line-height: 1.7; color: #cbd5e1; margin: 0;">
              ${article.aeoDirectAnswer || article.aeo?.directAnswer || article.excerpt}
            </p>
          </div>

          <!-- Full Article Markdown Rendered -->
          <div class="article-content" style="margin-bottom: 48px;">
            ${markdownToHtml(article.content)}
          </div>

          <!-- Author E-E-A-T Bio Box -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 40px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #00f5ff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: #000;">
              ${(article.author || 'F').charAt(0)}
            </div>
            <div style="flex: 1; min-width: 260px;">
              <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">
                Written & Fact-Checked by ${article.author || 'FingTaj Research Desk'}
              </div>
              <p style="font-size: 13px; color: #94a3b8; margin: 0 0 10px 0; line-height: 1.5;">
                ${article.authorBio || 'Certified financial analysts and quantitative researchers modeling Indian capital markets under strict SEBI and RBI guidelines.'}
              </p>
              <a href="/author/aashutosh-jha" style="font-size: 13px; color: #00f5ff; text-decoration: none; font-weight: 600;">View Full Author Profile & Credentials →</a>
            </div>
          </div>

          <!-- Regulatory Disclaimer -->
          <div style="background: rgba(0,245,255,0.02); border: 1px solid rgba(0,245,255,0.1); border-radius: 8px; padding: 18px 24px; font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 48px;">
            <strong>Regulatory Educational Notice: </strong> This article is published exclusively for financial literacy and general educational comprehension under SEBI and RBI investor awareness guidelines. FingTaj does not offer personalized financial or investment advice. Readers should consult a SEBI registered investment adviser before making investment commitments.
          </div>
        </article>

        <footer style="background: #080e17; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 20px; text-align: center; font-size: 13px; color: #94a3b8;">
          <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px;">
            <a href="/privacy-policy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a>
            <a href="/terms-of-service" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
            <a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">SEBI Disclaimer</a>
            <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact Us</a>
            <a href="/about" style="color: #cbd5e1; text-decoration: none;">About Mission</a>
          </div>
          <div>© 2026 FinGTaj Financial Technologies. Educational Research Platform.</div>
        </footer>
      `;
    }
  }

  // ----------------------------------------------------------------------------
  // 3. AUTHOR PROFILES (/author/:slug or /authors/:slug)
  // ----------------------------------------------------------------------------
  else if (cleanPath.startsWith('/author/') || cleanPath.startsWith('/authors/')) {
    pageTitle = 'Aashutosh Jha | Founder & Chief Financial Architect | FingTaj';
    metaDescription = 'Professional credentials, financial engineering background, and research publications of Aashutosh Jha, Founder of FingTaj.';
    canonicalUrl = `${baseUrl}/author/aashutosh-jha`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Aashutosh Jha',
      jobTitle: 'Founder & Chief Financial Architect',
      worksFor: {
        '@type': 'Organization',
        name: 'FinGTaj Financial Research',
        url: baseUrl
      },
      description: 'Aashutosh is a financial systems technologist, author, and researcher specializing in Indian capital markets and quantitative wealth distribution.',
      url: `${baseUrl}/author/aashutosh-jha`,
      email: 'admin@fingtaj.com'
    };

    const authorArticles = publishedArticles.slice(0, 12);

    bodyContent = `
      <header style="padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: #080e17;">
        <a href="/" style="font-size: 24px; font-weight: 800; color: #00f5ff; text-decoration: none;">FinG<span style="color: #fff;">Taj</span></a>
        <nav style="display: flex; gap: 20px;">
          <a href="/trading" style="color: #cbd5e1; text-decoration: none;">Investing</a>
          <a href="/finance" style="color: #cbd5e1; text-decoration: none;">Personal Finance</a>
          <a href="/loans" style="color: #cbd5e1; text-decoration: none;">Loans & EMIs</a>
          <a href="/calculators" style="color: #cbd5e1; text-decoration: none;">Calculators</a>
          <a href="/academy" style="color: #cbd5e1; text-decoration: none;">Academy</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        </nav>
      </header>

      <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px;">
        <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">Aashutosh Jha</h1>
        <div style="font-size: 16px; color: #00f5ff; font-weight: 600; margin-bottom: 20px;">Founder & Chief Financial Architect</div>
        <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1; margin-bottom: 24px;">
          Aashutosh is a financial systems technologist, author, and researcher specializing in Indian capital markets, algorithmic compounding models, and tax-optimized retirement mechanics. He founded FinGTaj to democratize institutional-grade financial literacy without commercial kickbacks or sponsored bias.
        </p>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 40px;">
          <h2 style="font-size: 18px; color: #fff; margin-bottom: 12px;">Verified Credentials & Certifications</h2>
          <ul style="color: #cbd5e1; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>NISM Certified Research Analyst (Series XV)</li>
            <li>Certified Financial Modeling & Valuation Analyst (FMVA)</li>
            <li>B.Tech in Computer Science & Financial Systems Architecture</li>
          </ul>
        </div>

        <h2 style="font-size: 24px; color: #fff; margin-bottom: 20px;">Published Educational Research & Guides</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 48px;">
          ${authorArticles.map(art => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px;">
              <div style="font-size: 11px; color: #00f5ff; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">${art.category}</div>
              <h3 style="font-size: 16px; margin: 0 0 10px 0;"><a href="/articles/${art.slug}" style="color: #fff; text-decoration: none;">${art.title}</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0 0 12px 0;">${art.excerpt.slice(0, 110)}...</p>
              <a href="/articles/${art.slug}" style="color: #00f5ff; font-size: 12px; text-decoration: none; font-weight: 600;">Read Guide →</a>
            </div>
          `).join('')}
        </div>
      </main>

      <footer style="background: #080e17; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 20px; text-align: center; font-size: 13px; color: #94a3b8;">
        <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px;">
          <a href="/privacy-policy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-of-service" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
          <a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">SEBI Disclaimer</a>
          <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact Us</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About Mission</a>
        </div>
        <div>© 2026 FinGTaj Financial Technologies. Educational Research Platform.</div>
      </footer>
    `;
  }

  // ----------------------------------------------------------------------------
  // 4. MANDATORY LEGAL PAGES
  // ----------------------------------------------------------------------------
  else if (['/privacy-policy', '/privacy', '/terms-of-service', '/terms', '/disclaimer', '/contact', '/about'].includes(cleanPath)) {
    const isPrivacy = cleanPath.includes('privacy');
    const isTerms = cleanPath.includes('terms');
    const isDisclaimer = cleanPath.includes('disclaimer');
    const isContact = cleanPath.includes('contact');
    const isAbout = cleanPath.includes('about');

    if (isPrivacy) {
      pageTitle = 'Privacy Policy & Google AdSense Disclosures | FingTaj';
      metaDescription = 'Mandatory Google AdSense disclosures, third-party advertising cookie policy, DoubleClick DART notices, and user data rights.';
    } else if (isTerms) {
      pageTitle = 'Terms of Service & Usage Governance | FingTaj';
      metaDescription = 'Terms of service, intellectual property guidelines, and non-commercial educational usage policies of FingTaj.';
    } else if (isDisclaimer) {
      pageTitle = 'SEBI Non-RIA Educational Disclaimer | FingTaj';
      metaDescription = 'Statutory disclaimer clarifying that FingTaj operates solely for educational literacy and is not a SEBI registered investment adviser.';
    } else if (isContact) {
      pageTitle = 'Contact Editorial Desk & Communications | FingTaj';
      metaDescription = 'Get in touch with the FingTaj editorial research desk with a stated turnaround of 24 to 48 business hours.';
    } else if (isAbout) {
      pageTitle = 'About Us, Research Methodology & Editorial Policy | FingTaj';
      metaDescription = 'Discover the mission, financial engineering principles, and fact-checking editorial policies governing FingTaj.';
    }

    bodyContent = `
      <header style="padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: #080e17;">
        <a href="/" style="font-size: 24px; font-weight: 800; color: #00f5ff; text-decoration: none;">FinG<span style="color: #fff;">Taj</span></a>
        <nav style="display: flex; gap: 20px;">
          <a href="/trading" style="color: #cbd5e1; text-decoration: none;">Investing</a>
          <a href="/finance" style="color: #cbd5e1; text-decoration: none;">Personal Finance</a>
          <a href="/loans" style="color: #cbd5e1; text-decoration: none;">Loans & EMIs</a>
          <a href="/calculators" style="color: #cbd5e1; text-decoration: none;">Calculators</a>
          <a href="/academy" style="color: #cbd5e1; text-decoration: none;">Academy</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        </nav>
      </header>

      <main style="max-width: 860px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #cbd5e1;">
        <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; margin-bottom: 24px;">${pageTitle.split('|')[0]}</h1>

        ${isPrivacy ? `
          <h2>1. Preamble & Zero-Telemetry Architecture</h2>
          <p>At FinGTaj (https://www.fingtaj.com), we operate under a strict, verifiable Zero-Telemetry Computational Architecture. All mathematical evaluations—including salaries, tax deductions under Section 115BAC, loan principals, and gratuity calculations—execute solely within your browser's local JavaScript heap. No computational data or user-entered numbers are ever transmitted or stored on our servers.</p>

          <h2>2. Google AdSense & Third-Party Advertising Cookies</h2>
          <p>We partner with Google AdSense and third-party advertising partners to serve contextual and personalized ads. Google uses cookies, including the DoubleClick DART cookie, to serve ads based on prior visits to our site and other internet portals.</p>
          <p>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" style="color: #00f5ff;">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" style="color: #00f5ff;">AboutAds.info</a>.</p>

          <h2>3. Digital Personal Data Protection Act 2023 (DPDP Act)</h2>
          <p>In compliance with India's DPDP Act 2023, data principals retain full rights to request summary, correction, or erasure of any communication data submitted via our contact portal.</p>

          <h2>4. Statutory Grievance Redressal Officer</h2>
          <p>Under Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules 2021, the designated Grievance Officer is Ashutosh Jha (Email: support@fingtaj.com, Location: Chennai, Tamil Nadu, India) with statutory acknowledgement within 24 hours.</p>
        ` : ''}

        ${isTerms ? `
          <blockquote style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; color: #fde68a;">
            <strong>Statutory Financial & Tax Disclaimer:</strong> All computation algorithms and tax estimates on FingTaj are provided strictly for educational and self-planning purposes. FingTaj is not a Chartered Accountancy practice, SEBI Registered Investment Advisor (RIA), or banking representative.
          </blockquote>

          <h2>1. Use License & Prohibited Conduct</h2>
          <p>Permission is granted to freely use the calculators for individual and educational purposes. Automated scraping, reverse-engineering, or unauthorized commercial redistribution is strictly prohibited.</p>

          <h2>2. Governing Law & Forum Selection</h2>
          <p>These terms are governed by the laws of the Republic of India. Any legal dispute is subject to the exclusive territorial jurisdiction of the competent courts in Chennai, Tamil Nadu, India.</p>
        ` : ''}

        ${isDisclaimer ? `
          <h2>1. SEBI Regulatory Compliance Notice</h2>
          <p>FinGTaj is strictly a financial education and quantitative computational modeling platform. Neither FinGTaj nor its authors/contributors are registered with the Securities and Exchange Board of India (SEBI) as a Registered Investment Adviser (RIA) or Research Analyst (RA) under SEBI (Investment Advisers) Regulations, 2013.</p>

          <h2>2. Non-Advisory Status</h2>
          <p>All content, tools, calculators, spreadsheets, and guides provided on this website are designed solely for educational research, mathematical illustration, and financial literacy purposes. Nothing published on this domain constitutes personalized financial, investment, legal, or tax advice.</p>

          <h2>3. Market Risk Acknowledgment</h2>
          <p>Investments in mutual funds, equities, debt securities, and commodities are subject to market risks. Readers must read all scheme-related documents carefully before investing and consult an authorized financial advisor.</p>
        ` : ''}

        ${isContact ? `
          <h2>Reach the FingTaj Engineering & Editorial Desk</h2>
          <p>We welcome statutory tax discrepancy reports, bug submissions, algorithmic audit inquiries, and partnership requests.</p>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; margin: 24px 0;">
            <p><strong>Primary Support & Formula Audits:</strong> <a href="mailto:support@fingtaj.com" style="color: #00f5ff;">support@fingtaj.com</a></p>
            <p><strong>Administrative & Publisher Desk:</strong> <a href="mailto:admin@fingtaj.com" style="color: #00f5ff;">admin@fingtaj.com</a></p>
            <p><strong>Stated Turnaround Time:</strong> 24 to 48 business hours for all correspondence.</p>
            <p><strong>Operational Jurisdiction:</strong> Chennai, Tamil Nadu, 600001, India.</p>
          </div>
        ` : ''}

        ${isAbout ? `
          <h2>Our Computational Engineering Mission</h2>
          <p>FingTaj was established by Ashutosh Jha in Chennai, Tamil Nadu, India, to provide private, high-speed, zero-telemetry statutory financial calculators for Indian taxpayers, salaried employees, and long-term investors.</p>
          
          <h2>Statutory Alignment</h2>
          <p>Our algorithms mirror official legislative conventions from the Indian Income Tax Act 1961 (Section 115BAC), RBI Master Directions on Amortization, and the Payment of Gratuity Act 1972.</p>

          <h2>Zero-Kickback & Non-Affiliate Guarantee</h2>
          <p>FingTaj operates with complete editorial neutrality: we accept zero commissions, kickbacks, or referral bounties from banks, NBFCs, or loan aggregators.</p>
        ` : ''}
      </main>

      <footer style="background: #080e17; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 20px; text-align: center; font-size: 13px; color: #94a3b8;">
        <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px;">
          <a href="/privacy-policy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-of-service" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
          <a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">SEBI Disclaimer</a>
          <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact Us</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About Mission</a>
        </div>
        <div>© 2026 FinGTaj Financial Technologies. Educational Research Platform.</div>
      </footer>
    `;
  }

  // ----------------------------------------------------------------------------
  // 5. DEFAULT HOMEPAGE (/) OR CATEGORY ARCHIVE PAGES
  // ----------------------------------------------------------------------------
  else {
    const recent6 = publishedArticles.slice(0, 6);

    // Global Organization & WebSite JSON-LD
    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'FinGTaj',
          url: baseUrl,
          logo: `${baseUrl}/favicon.svg`,
          description: 'Institutional financial education, compounding simulators, statutory tax computation, and zero-telemetry wealth engineering.',
          email: 'support@fingtaj.com',
          sameAs: [
            'https://www.linkedin.com/in/ashutosh-kumar-r/',
            'https://www.youtube.com/@fingtaj',
            'https://whatsapp.com/channel/0029Vb7gkNgIt5rwnKzp0Y0K',
            'https://www.quora.com/profile/FinGTaj',
            'https://x.com/FinGTaj',
            'https://github.com/theaashutoshjha'
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chennai',
            addressRegion: 'Tamil Nadu',
            postalCode: '600001',
            addressCountry: 'IN'
          },
          founder: {
            '@type': 'Person',
            name: 'Ashutosh Kumar R (Ashutosh Jha)',
            url: `${baseUrl}/about`,
            sameAs: [
              'https://www.linkedin.com/in/ashutosh-kumar-r/',
              'https://x.com/FinGTaj',
              'https://www.youtube.com/@fingtaj',
              'https://www.quora.com/profile/FinGTaj',
              'https://github.com/theaashutoshjha'
            ]
          }
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'FinGTaj Financial Intelligence',
          publisher: { '@id': `${baseUrl}/#organization` }
        }
      ]
    };

    bodyContent = `
      <header style="padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: #080e17;">
        <a href="/" style="font-size: 24px; font-weight: 800; color: #00f5ff; text-decoration: none;">FinG<span style="color: #fff;">Taj</span></a>
        <nav style="display: flex; gap: 20px;">
          <a href="/trading" style="color: #cbd5e1; text-decoration: none;">Investing</a>
          <a href="/finance" style="color: #cbd5e1; text-decoration: none;">Personal Finance</a>
          <a href="/loans" style="color: #cbd5e1; text-decoration: none;">Loans & EMIs</a>
          <a href="/calculators" style="color: #cbd5e1; text-decoration: none;">Calculators</a>
          <a href="/academy" style="color: #cbd5e1; text-decoration: none;">Academy</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        </nav>
      </header>

      <main style="max-width: 1140px; margin: 40px auto; padding: 0 20px;">
        <!-- Hero Section -->
        <section style="text-align: center; margin-bottom: 60px;">
          <span style="display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; background: rgba(0,245,255,0.1); color: #00f5ff; border: 1px solid rgba(0,245,255,0.3); margin-bottom: 20px;">
            INSTITUTIONAL FINANCIAL RESEARCH & COMPILATION
          </span>
          <h1 style="font-size: 44px; font-weight: 900; color: #ffffff; line-height: 1.2; margin: 0 0 20px 0;">
            Master Capital Compounding, Loan Mathematics & Wealth Engineering
          </h1>
          <p style="font-size: 18px; color: #94a3b8; max-width: 760px; margin: 0 auto 32px auto; line-height: 1.6;">
            Transparent financial education backed by mathematical equations, worked scenario matrices, and compliance with Indian regulatory frameworks (RBI, SEBI, CBDT Section 112A).
          </p>
          <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="/calculators/sip" style="padding: 12px 24px; background: #00f5ff; color: #000; font-weight: 700; border-radius: 8px; text-decoration: none;">Launch Financial Calculators</a>
            <a href="/trading" style="padding: 12px 24px; background: rgba(255,255,255,0.05); color: #fff; font-weight: 600; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); text-decoration: none;">Explore Educational Guides</a>
          </div>
        </section>

        <!-- SECTION 2: Latest Educational Guides (3-column responsive grid) -->
        <section style="margin-bottom: 64px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">
                Latest Market & Educational Guides
              </h2>
              <p style="font-size: 15px; color: #94a3b8; margin: 0;">
                Peer-reviewed research, taxation frameworks, and wealth compounding blueprints by certified quantitative analysts
              </p>
            </div>
            <a href="/trading" style="color: #00f5ff; text-decoration: none; font-size: 14px; font-weight: 600;">View All 80+ Guides →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            ${recent6.map(art => `
              <article style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 11px; font-weight: 700; color: #00f5ff; text-transform: uppercase;">${art.category}</span>
                    <span style="font-size: 12px; color: #94a3b8;">${art.readTime || '8 min read'}</span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; line-height: 1.4; margin: 0 0 10px 0;">
                    <a href="/articles/${art.slug}" style="color: #ffffff; text-decoration: none;">${art.title}</a>
                  </h3>
                  <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 16px 0;">
                    ${art.excerpt.slice(0, 140)}...
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px; font-size: 12px;">
                  <span style="color: #cbd5e1;">By <a href="/author/aashutosh-jha" style="color: #00f5ff; text-decoration: none;">${art.author || 'Aashutosh Jha'}</a></span>
                  <a href="/articles/${art.slug}" style="color: #00f5ff; font-weight: 600; text-decoration: none;">Read Guide →</a>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- SECTION 3: Interactive Financial Simulators Overview -->
        <section style="margin-bottom: 64px;">
          <h2 style="font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">
            Computational Simulators & Loan Amortization Engines
          </h2>
          <p style="font-size: 15px; color: #94a3b8; margin-bottom: 28px;">
            Every interactive tool is backed by full mathematical formulas, 3-scenario worked matrices, and Indian tax nuance.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/sip" style="color: #00f5ff; text-decoration: none;">SIP Compounding Engine</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Future value of annuity due, rupee-cost averaging, and Section 112A LTCG tax optimization.</p>
              <a href="/calculators/sip" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/emi" style="color: #00f5ff; text-decoration: none;">Loan EMI & Prepayment</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Reducing balance amortization, front-loaded interest drag, and extra EMI prepayment savings.</p>
              <a href="/calculators/emi" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/fire" style="color: #00f5ff; text-decoration: none;">FIRE Freedom Target</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Safe Withdrawal Rates (SWR) under Indian CPI inflation and 30x retirement multiples.</p>
              <a href="/calculators/fire" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/step-up" style="color: #00f5ff; text-decoration: none;">Step-Up SIP Accelerator</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Annual incremental compounding matching annual career wage hikes to double final wealth.</p>
              <a href="/calculators/step-up" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/budget" style="color: #00f5ff; text-decoration: none;">50/30/20 Budgeting Rule</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Cash flow governance allocating net salary into survival needs, lifestyle, and wealth building.</p>
              <a href="/calculators/budget" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,245,255,0.2); border-radius: 10px; padding: 20px;">
              <h3 style="font-size: 17px; color: #fff; margin: 0 0 8px 0;"><a href="/calculators/inflation" style="color: #00f5ff; text-decoration: none;">Inflation Decay Modeler</a></h3>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Calculates the purchasing power decay of stagnant cash under compound CPI inflation.</p>
              <a href="/calculators/inflation" style="font-size: 12px; color: #00f5ff; font-weight: 600; text-decoration: none;">Launch Calculator →</a>
            </div>
          </div>
        </section>

        <!-- SECTION 4: Supplementary Study Worksheets & Blueprints -->
        <section style="margin-bottom: 64px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 32px;">
          <h2 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
            Supplementary Study Worksheets & Research Blueprints
          </h2>
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 24px;">
            Academic financial templates and personal budget frameworks designed for deep computational study.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 18px;">
              <h3 style="font-size: 15px; color: #fff; margin: 0 0 6px 0;">50/30/20 Wealth Blueprint Model</h3>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Automated cash flow budgeter with debt snowball and emergency fund trackers.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 18px;">
              <h3 style="font-size: 15px; color: #fff; margin: 0 0 6px 0;">Debt Snowball & Mortgage Freedom Model</h3>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Multi-loan amortization calculator modeling prepayment interest arbitrage.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 18px;">
              <h3 style="font-size: 15px; color: #fff; margin: 0 0 6px 0;">FIRE Freedom Multiplier Sheet</h3>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Calculates retirement age across varying savings rates and investment returns.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style="background: #080e17; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 20px; text-align: center; font-size: 13px; color: #94a3b8;">
        <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 16px;">
          <a href="/privacy-policy" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-of-service" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
          <a href="/disclaimer" style="color: #cbd5e1; text-decoration: none;">SEBI Disclaimer</a>
          <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact Us</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About Mission</a>
          <a href="/author/aashutosh-jha" style="color: #cbd5e1; text-decoration: none;">Author Profile</a>
        </div>
        <div>© 2026 FinGTaj Financial Technologies. Educational Research Platform.</div>
      </footer>
    `;
  }

  // Inject dynamic SEO meta tags and structured data into baseHtml
  let renderedHtml = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${pageTitle}" />`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDescription.replace(/"/g, '&quot;')}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${pageTitle}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${metaDescription.replace(/"/g, '&quot;')}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${metaDescription.replace(/"/g, '&quot;')}" />`);

  if (jsonLd) {
    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n`;
    renderedHtml = renderedHtml.replace('</head>', `${jsonLdScript}</head>`);
  }

  // Inject the rich semantic pre-rendered content into <div id="root"></div>!
  // When crawlers without JS inspect the page, they see 100% crawlable content.
  // When browser clients run React, hydrate/createRoot mounts over it cleanly.
  renderedHtml = renderedHtml.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

  return renderedHtml;
}
