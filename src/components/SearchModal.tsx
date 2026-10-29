import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTools = q
    ? CALCULATORS_DATA.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) ||
        c.statute.toLowerCase().includes(q)
      )
    : CALCULATORS_DATA.slice(0, 7);

  const matchingArticles = q
    ? ARTICLES.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) || 
        (a.tag || '').toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/${slug}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-950/60">
          <Search size={18} className="text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all 50 financial calculators (e.g. SIP, Home Loan, Section 115BAC, Gratuity)..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-sans font-medium"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 bg-white/10 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Popular Tags */}
        {!q && (
          <div className="px-5 py-2.5 border-b border-white/5 bg-slate-950/30 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">Popular:</span>
            {['SIP Wealth', 'Home Loan EMI', 'Income Tax 115BAC', 'EPF', 'Gratuity', 'PPF', 'FIRE'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto p-3 space-y-2">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {q ? `Matching Engines (${matchingTools.length})` : 'Recommended Calculators'}
          </div>

          {matchingTools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No calculator found for "{query}". Try "tax", "sip", "loan", or "gratuity".
            </div>
          ) : (
            matchingTools.map(tool => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool.slug)}
                className="w-full text-left p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate mr-3">
                  <div className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {tool.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                    <span className="text-indigo-400 font-medium">{tool.categoryLabel}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-slate-500 truncate">{tool.shortDesc}</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))
          )}

          {/* Matched Guides */}
          {matchingArticles.length > 0 && (
            <div className="border-t border-white/5 pt-2 mt-2">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Statutory Guides
              </div>
              {matchingArticles.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate mr-2">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate">
                      {a.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {a.tag} · {a.readTime}
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-slate-950/80 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium text-xs">
            <Sparkles size={13} />
            <span>50 Free Client-Side Calculators</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchModal;
