import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { ARTICLES } from '../data/articles';
import { X, Search, Calculator, BookOpen, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
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
    : CALCULATORS_DATA.slice(0, 8); // show popular default

  const matchedArticles = q
    ? ARTICLES.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) || 
        (a.tag || '').toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const handleSelectCalc = (slug: string) => {
    onClose();
    navigate(`/${slug}`);
  };

  const handleSelectArticle = (slug: string) => {
    onClose();
    navigate(`/`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl fin-card p-6 border-slate-700 shadow-2xl relative bg-slate-950"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <Search size={20} className="text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all 50 financial calculators, taxes, loans..."
            className="w-full bg-transparent text-white text-base outline-none placeholder:text-slate-500 font-sans"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded"
            >
              Clear
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {/* Calculators Results */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>{q ? `Calculators Matching "${query}"` : 'Popular High-Precision Calculators'}</span>
              <span>{matchedCalculators.length} found</span>
            </div>

            {matchedCalculators.length === 0 ? (
              <div className="text-sm text-slate-500 py-4 text-center">
                No calculators matching "{query}".
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchedCalculators.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCalc(c.slug)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <Calculator size={16} />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {c.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {c.categoryLabel} · {c.statute}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Articles Section if matched */}
          {matchedArticles.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Educational Research Guides
              </div>
              <div className="space-y-1.5">
                {matchedArticles.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSelectArticle(a.slug)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {a.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {a.tag} · {a.readTime}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-3 mt-3">
          <span>Press ESC to close</span>
          <span>100% Free &amp; Zero Data Collection</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
