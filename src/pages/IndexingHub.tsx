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

const BASE_URL = 'https://www.fingtaj.com';

const CORE_PAGES = [
  { title: 'Home Page — 50 Statutory Financial Calculators', path: '/', category: 'Core' },
  { title: 'About & Authorship (E-E-A-T Disclosure)', path: '/about', category: 'Core' },
  { title: 'Privacy Policy & Zero Telemetry Guarantee', path: '/privacy-policy', category: 'Legal' },
  { title: 'Terms of Service & Statutory Disclaimers', path: '/terms-of-service', category: 'Legal' },
  { title: 'Technical Inquiries & Editorial Contact', path: '/contact', category: 'Core' }
];

export default function IndexingHub() {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allItems = useMemo(() => {
    const list = [
      ...CORE_PAGES.map(p => ({
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
    <div className="bg-[#080d16] text-slate-100 min-h-screen py-10 lg:py-14 bg-terminal-grid bg-radial-ambient">
      <div className="wrap max-w-5xl text-slate-300">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link to="/" className="hover:text-cyan-400 transition-colors">TERMINAL</Link>
          <span aria-hidden="true" className="text-white/20">/</span>
          <span className="text-white font-bold">Search Console Indexing Hub</span>
        </div>

        {/* Header Block */}
        <div className="mb-8 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">Webmaster &amp; SEO Center</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="text-slate-300 font-semibold">55 Canonical URLs</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="text-slate-500">Google Search Console Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            Search Console &amp; Instant Indexing Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Every calculator and page on FingTaj is published on its own distinct, permanent URL. Use this central hub to submit all URLs to Google Search Console, Bing Webmaster, or IndexNow for rapid indexing.
          </p>
        </div>

        {/* 3 Step Instant Indexing Action Box */}
        <div className="p-6 sm:p-8 mb-8 terminal-card bg-[#0d1524] border border-cyan-500/30 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Send size={18} className="text-[#2563eb]" />
            How to Submit for Instant Indexing in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-bold">1</span>
                <span>Submit XML Sitemap</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-3 text-xs">
                In Google Search Console, go to <strong>Indexing → Sitemaps</strong> and submit:
              </p>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-blue-600 bg-white p-2 rounded-lg block border border-slate-200 hover:border-blue-400 transition-colors truncate font-semibold"
              >
                https://www.fingtaj.com/sitemap.xml
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-bold">2</span>
                <span>URL Inspection (Instant)</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-xs">
                Paste any high-priority URL (like <code className="text-blue-600 font-bold">/sip-calculator</code>) into the top search bar in Search Console and click <strong>"Request Indexing"</strong> for same-day priority crawl.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-xs font-bold">3</span>
                <span>Batch Plaintext List</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-3 text-xs">
                Use the newline-separated plaintext URL list for batch indexing tools or Bing IndexNow:
              </p>
              <a
                href="/urllist.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-blue-600 bg-white p-2 rounded-lg block border border-slate-200 hover:border-blue-400 transition-colors truncate font-semibold"
              >
                https://www.fingtaj.com/urllist.txt
              </a>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Total Valid Canonical Endpoints: <span className="font-bold text-slate-900 font-mono">{allItems.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-xs"
              >
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedAll ? 'All 55 URLs Copied!' : 'Copy All 55 URLs'}</span>
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <FileCode size={14} />
                <span>Open sitemap.xml</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive URL Search & Filter Directory */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter endpoints..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Title &amp; Canonical URL</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-blue-600 font-bold">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm">{item.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-md sm:max-w-xl mt-0.5">
                        {item.url}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopySingle(item.url)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition"
                          title="Copy URL"
                        >
                          {copiedUrl === item.url ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                        <Link
                          to={item.path}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition"
                          title="Open Page"
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
