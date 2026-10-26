import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import { X, Search, ArrowRight, CornerDownLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
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
    : CALCULATORS_DATA.slice(0, 7);

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#070d19] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Command Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-slate-900/40">
          <Search size={18} className="text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Type any financial tool, statute, or section (e.g. SIP, 115BAC, Home Loan)..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-sans"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 bg-slate-800 rounded"
            >
              Clear
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Filter Tag Recommendations if query is empty */}
        {!q && (
          <div className="px-5 py-2.5 border-b border-white/[0.06] bg-slate-950/30 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-slate-500 font-mono uppercase text-[10px] tracking-wider shrink-0">Popular:</span>
            {['SIP', 'Home Loan', 'Income Tax', 'EPF', 'Gratuity', 'PPF', 'Capital Gains'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-white/[0.06] text-slate-300 hover:text-emerald-400 whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="max-h-[50vh] overflow-y-auto p-3 space-y-3">
          <div>
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center justify-between">
              <span>{q ? `Matching Tools (${matchedCalculators.length})` : 'Frequently Launched Engines'}</span>
              <span>Statutory Accurate</span>
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
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-emerald-500/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        ₹
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {c.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase">{c.categoryLabel}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-500 truncate">{c.statute}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 group-hover:text-emerald-400 shrink-0">
                      <span className="text-[11px] font-medium hidden sm:inline">Launch</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matched Guides */}
          {matchedArticles.length > 0 && (
            <div className="border-t border-white/[0.06] pt-2">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Statutory Research Guides
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
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {a.tag} · {a.readTime}
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-600 group-hover:text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-slate-950/70 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/[0.06] text-slate-400">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck size={12} />
            <span>Zero Telemetry · 100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
