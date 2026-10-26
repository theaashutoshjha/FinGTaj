import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import { X, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedCalculators = q
    ? CALCULATORS_DATA.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) ||
        c.statute.toLowerCase().includes(q)
      )
    : CALCULATORS_DATA.slice(0, 8);

  const matchedArticles = q
    ? ARTICLES.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) || 
        (a.tag || '').toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const handleSelectCalc = (slug: string) => {
    onClose();
    navigate(`/${slug}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search size={18} className="text-[#2563eb] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search calculators (e.g. SIP, Home Loan, Income Tax, FD, PPF, Gratuity...)"
            className="w-full bg-transparent text-slate-900 text-sm outline-none placeholder:text-slate-400 font-sans"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-0.5 bg-slate-200/80 rounded"
            >
              Clear
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Filter Tag Recommendations if query is empty */}
        {!q && (
          <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-400 font-mono uppercase text-[10px] tracking-wider shrink-0">Popular:</span>
            {['SIP', 'Home Loan', 'Income Tax', 'EPF', 'Gratuity', 'PPF', 'Capital Gains'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/60 whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="max-h-[50vh] overflow-y-auto p-3 space-y-3">
          <div>
            <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{q ? `Matching Calculators (${matchedCalculators.length})` : 'Popular Calculators'}</span>
              <span>100% Free</span>
            </div>

            {matchedCalculators.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No calculator found for "{query}". Try "tax", "loan", or "sip".
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {matchedCalculators.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCalc(c.slug)}
                    className="w-full text-left p-3 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        ₹
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {c.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                          <span className="text-blue-600 font-bold">{c.categoryLabel}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-slate-400 truncate">{c.statute}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 shrink-0">
                      <span className="text-xs font-medium hidden sm:inline">Open</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matched Guides */}
          {matchedArticles.length > 0 && (
            <div className="border-t border-slate-100 pt-2">
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Research Guides
              </div>
              <div className="space-y-1 mt-1">
                {matchedArticles.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/');
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {a.tag} · {a.readTime}
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono text-[10px]">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck size={14} />
            <span>50 Calculators · 100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
