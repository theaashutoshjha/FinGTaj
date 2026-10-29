import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import { X, Search, ArrowRight, Terminal } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0d1524] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Command Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
          <Search size={18} className="text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search 50 statutory engines (e.g. SIP, Loan, Tax 115BAC, Gratuity, PPF)..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-mono"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 bg-white/10 rounded font-mono cursor-pointer"
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

        {/* Quick Tags Strip */}
        {!q && (
          <div className="px-5 py-2.5 border-b border-white/10 bg-[#090f1a] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-500 font-mono uppercase text-[10px] tracking-wider shrink-0">Popular:</span>
            {['SIP', 'Home Loan', 'Income Tax', 'EPF', 'Gratuity', 'PPF', 'Capital Gains', 'FIRE'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs font-mono whitespace-nowrap transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results Scroll Container */}
        <div className="max-h-[55vh] overflow-y-auto p-3 space-y-3">
          <div>
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>{q ? `Matching Engines (${matchedCalculators.length})` : 'Pinned & Recommended Engines'}</span>
              <span>Local Memory</span>
            </div>

            {matchedCalculators.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                No matching engine for "{query}". Try "tax", "emi", or "sip".
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {matchedCalculators.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCalc(c.slug)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        ₹
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {c.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5 font-mono">
                          <span className="text-cyan-400">{c.categoryLabel}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-slate-500 truncate">{c.statute}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 group-hover:text-cyan-400 shrink-0 font-mono text-xs">
                      <span className="hidden sm:inline">Launch</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matched Guides */}
          {matchedArticles.length > 0 && (
            <div className="border-t border-white/10 pt-2">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
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
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                        {a.tag} · {a.readTime}
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-500 group-hover:text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-black/40 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">ESC</span>
            <span>to dismiss</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <Terminal size={14} />
            <span>FingTaj Zero-Telemetry Terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
