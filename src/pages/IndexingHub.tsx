import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  FileCode, 
  Send
} from 'lucide-react';
import { CALCULATORS_DATA } from '../data/calculatorsData';

export default function IndexingHub() {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const BASE_URL = 'https://www.fingtaj.com';

  const corePages = [
    { title: 'Home Page — 50 Statutory Financial Calculators', path: '/', category: 'Core' },
    { title: 'About & Authorship (E-E-A-T Disclosure)', path: '/about', category: 'Core' },
    { title: 'Privacy Policy & Zero Telemetry Guarantee', path: '/privacy-policy', category: 'Legal' },
    { title: 'Terms of Service & Statutory Disclaimers', path: '/terms-of-service', category: 'Legal' },
    { title: 'Technical Inquiries & Editorial Contact', path: '/contact', category: 'Core' }
  ];

  const allItems = useMemo(() => {
    const list = [
      ...corePages.map(p => ({
        title: p.title,
        url: `${BASE_URL}${p.path}`,
        path: p.path,
        category: p.category,
        statute: 'Institutional Baseline'
      })),
      ...CALCULATORS_DATA.map(c => ({
        title: c.title,
        url: `${BASE_URL}/${c.slug}`,
        path: `/${c.slug}`,
        category: c.category,
        statute: c.statute
      }))
    ];
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    return allItems.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery = !q || 
        item.title.toLowerCase().includes(q) || 
        item.path.toLowerCase().includes(q) ||
        item.statute.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [allItems, filterQuery, selectedCategory]);

  useEffect(() => {
    document.title = 'Google Search Console Instant Indexing Hub — All 55 URLs | FingTaj';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Direct URL submission matrix and Google Search Console indexing hub for all 50 FingTaj financial calculators and institutional pages.');
    }
    window.scrollTo(0, 0);
  }, []);

  const handleCopyAll = () => {
    const allUrls = allItems.map(i => i.url).join('\n');
    navigator.clipboard.writeText(allUrls);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingle = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const categories = ['All', 'Core', 'Legal', 'Loans', 'Investing', 'Savings', 'Retirement', 'Tax', 'Salary', 'Everyday'];

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="wrap max-w-5xl">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-200 font-medium">Search Console Indexing Hub</span>
        </div>

        {/* Header Block */}
        <div className="mb-10 border-b border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">Webmaster &amp; SEO Center</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">55 Canonical URLs</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Google Search Console Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Search Console &amp; Instant Indexing Hub
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Every calculator and page on FingTaj is published on its own distinct, permanent URL. Use this central hub to submit all URLs to Google Search Console, Bing Webmaster, or IndexNow for rapid indexing.
          </p>
        </div>

        {/* 3 Step Instant Indexing Action Box */}
        <div className="fin-card p-6 sm:p-8 mb-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-emerald-500/30">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Send size={18} className="text-emerald-400" />
            How to Submit for Instant Indexing in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">1</span>
                <span>Submit XML Sitemap</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                In Google Search Console, go to <strong>Indexing → Sitemaps</strong> and submit:
              </p>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-emerald-400 bg-slate-900 p-2 rounded block border border-slate-800 hover:border-emerald-500/50 transition-colors truncate"
              >
                https://www.fingtaj.com/sitemap.xml
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">2</span>
                <span>URL Inspection (Instant)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Paste any high-priority URL (like <code className="text-emerald-400">/sip-calculator</code>) into the top search bar in Search Console and click <strong>"Request Indexing"</strong> for same-day priority crawl.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">3</span>
                <span>Batch Indexing List</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                Use the newline-separated plaintext URL list for batch indexing tools or Bing IndexNow:
              </p>
              <a
                href="/urllist.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-cyan-400 bg-slate-900 p-2 rounded block border border-slate-800 hover:border-cyan-500/50 transition-colors truncate"
              >
                https://www.fingtaj.com/urllist.txt
              </a>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Total Valid Canonical Endpoints: <span className="font-bold text-white font-mono">{allItems.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/10"
              >
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedAll ? 'All 55 URLs Copied!' : 'Copy All 55 URLs'}</span>
              </button>
              <a
                href="/urllist.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                <FileCode size={14} />
                <span>Raw urllist.txt</span>
              </a>
            </div>
          </div>
        </div>

        {/* Directory Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by page name, category, or slug..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Counter */}
            <div className="text-xs text-slate-400 shrink-0 self-center">
              Displaying <span className="font-bold text-white font-mono">{filteredItems.length}</span> of {allItems.length} URLs
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master URL Table */}
        <div className="fin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3 px-4">Index</th>
                  <th className="py-3 px-4">Page / Calculator Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dedicated URL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredItems.map((item, idx) => (
                  <tr key={item.path} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="py-3 px-4 font-sans font-bold text-white">
                      <Link to={item.path} className="hover:text-emerald-400 transition-colors">
                        {item.title}
                      </Link>
                      <div className="text-[11px] text-slate-500 font-sans font-normal truncate max-w-xs">
                        {item.statute}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">
                      <span className="text-[11px] text-emerald-400/90 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
                        {item.path}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopySingle(item.url)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Copy Full URL"
                        >
                          {copiedUrl === item.url ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                        <Link
                          to={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
