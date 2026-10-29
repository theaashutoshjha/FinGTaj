import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight,
  Clock, 
  FileText,
  RotateCcw,
  Minus,
  Plus,
  Sliders,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Download,
  Star
} from 'lucide-react';
import { 
  CALCULATORS_DATA, 
  CALCULATORS_BY_SLUG, 
  formatINRWords, 
  CalculatorItem 
} from '../data/calculatorsData';
import AdSenseSlot from '../components/AdSenseSlot';

interface CalculatorPageProps {
  forcedSlug?: string;
}

// Interactive SVG Donut Chart with dark neon palette
function DonutChart({ 
  slices, 
  totalLabel, 
  totalValue 
}: { 
  slices: { label: string; value: number; formatted: string; color: string }[];
  totalLabel: string;
  totalValue: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = useMemo(() => {
    return slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  }, [slices]);

  const radius = 68;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const sliceArcs = useMemo(() => {
    const pcts = slices.map((slice, i) => total > 0 ? Math.max(0, slice.value) / total : (i === 0 ? 1 : 0));
    return slices.map((slice, i) => {
      const pct = pcts[i];
      const offset = pcts.slice(0, i).reduce((sum, p) => sum + p * circumference, 0);
      return {
        ...slice,
        pct: pct * 100,
        strokeDasharray: `${pct * circumference} ${circumference}`,
        strokeDashoffset: -offset,
      };
    });
  }, [slices, total, circumference]);

  const activeItem = hoveredIdx !== null ? sliceArcs[hoveredIdx] : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52 flex items-center justify-center my-2">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90 transform">
          {/* Base Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Donut Arcs */}
          {sliceArcs.map((arc, i) => (
            <circle
              key={i}
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke={arc.color}
              strokeWidth={hoveredIdx === i ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={arc.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              style={{
                filter: hoveredIdx === i ? `drop-shadow(0 0 10px ${arc.color})` : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.3 : 1
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
            {activeItem ? activeItem.label : totalLabel}
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-white tracking-tight leading-tight mt-0.5 tabular-nums">
            {activeItem ? activeItem.formatted : totalValue}
          </span>
          {activeItem && (
            <span className="text-[11px] font-mono font-bold text-cyan-400 mt-0.5 tabular-nums">
              {activeItem.pct.toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/10">
        {sliceArcs.map((slice, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-2 p-2 rounded-lg text-left transition-colors cursor-pointer ${
              hoveredIdx === idx ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 transition-transform" 
              style={{ 
                backgroundColor: slice.color,
                boxShadow: `0 0 8px ${slice.color}`,
                transform: hoveredIdx === idx ? 'scale(1.2)' : 'scale(1)'
              }} 
            />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 truncate leading-tight font-sans">{slice.label}</div>
              <div className="text-xs font-mono font-bold text-white tracking-tight mt-0.5 tabular-nums">
                {slice.formatted} <span className="text-[10px] text-slate-500 font-normal">({slice.pct.toFixed(1)}%)</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalculatorPage({ forcedSlug }: CalculatorPageProps) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const slug = forcedSlug || routeSlug || 'sip-calculator';

  const calc: CalculatorItem = CALCULATORS_BY_SLUG.get(slug) || CALCULATORS_DATA[0];

  // Initialize input state with defaults OR query parameters for direct bookmarking
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    calc.inputs.forEach(field => {
      const qVal = searchParams.get(field.id);
      if (qVal !== null && !isNaN(parseFloat(qVal))) {
        initial[field.id] = parseFloat(qVal);
      } else {
        initial[field.id] = field.default;
      }
    });
    return initial;
  });

  // Re-initialize state when slug changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    calc.inputs.forEach(field => {
      const qVal = searchParams.get(field.id);
      if (qVal !== null && !isNaN(parseFloat(qVal))) {
        initial[field.id] = parseFloat(qVal);
      } else {
        initial[field.id] = field.default;
      }
    });
    setInputs(initial);

    // Dynamic Search Console SEO & Social Metadata
    const pageUrl = `https://www.fingtaj.com/${calc.slug}`;
    document.title = `${calc.title} — Free High-Precision Indian Financial Calculator | FingTaj`;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = selector.replace(/[[\]"]/g, '').split('=');
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', `${calc.shortDesc} Compute instantly with zero telemetry on FingTaj.`);
    setMeta('meta[property="og:title"]', 'content', `${calc.title} — Statutory Indian Financial Calculator`);
    setMeta('meta[property="og:description"]', 'content', calc.shortDesc);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[name="twitter:title"]', 'content', `${calc.title} | FingTaj`);
    setMeta('meta[name="twitter:description"]', 'content', calc.shortDesc);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', pageUrl);

    // Inject Search Console Schema.org JSON-LD (WebApplication + FAQPage)
    let jsonLdEl = document.getElementById('calc-jsonld');
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script');
      jsonLdEl.setAttribute('id', 'calc-jsonld');
      jsonLdEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdEl);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${pageUrl}#webapp`,
          "name": calc.title,
          "url": pageUrl,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "description": calc.shortDesc,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        },
        {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          "mainEntity": (calc.editorialGuide.faqs || []).map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        }
      ]
    };
    jsonLdEl.textContent = JSON.stringify(schemaData);

    window.scrollTo(0, 0);
  }, [slug, calc, searchParams]);

  // Compute live result
  const result = calc.calculate(inputs);

  // Bookmarking / Pinning state
  const [isFavorited, setIsFavorited] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('fingtaj_favorites');
      if (stored) {
        const list: string[] = JSON.parse(stored);
        return list.includes(calc.slug);
      }
    } catch {
      // safe fallback
    }
    return false;
  });

  const toggleFavorite = () => {
    setIsFavorited(prev => {
      const next = !prev;
      try {
        const stored = localStorage.getItem('fingtaj_favorites');
        const list: string[] = stored ? JSON.parse(stored) : [];
        const updated = next 
          ? Array.from(new Set([...list, calc.slug])) 
          : list.filter(s => s !== calc.slug);
        localStorage.setItem('fingtaj_favorites', JSON.stringify(updated));
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  const handleInputChange = (id: string, value: number) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleStepNudge = (id: string, step: number, isIncrement: boolean, min: number, max: number) => {
    setInputs(prev => {
      const current = prev[id] ?? 0;
      const next = isIncrement ? current + step : current - step;
      const clamped = Math.max(min, Math.min(max, Math.round(next / step) * step));
      return { ...prev, [id]: clamped };
    });
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    calc.inputs.forEach(field => {
      initial[field.id] = field.default;
    });
    setInputs(initial);
  };

  // Quick Copy breakdown
  const [copiedSummary, setCopiedSummary] = useState(false);
  const handleCopySummary = () => {
    const text = `${calc.title} Calculation Memo:\n${result.primaryLabel}: ${result.primaryValue}\n` +
      result.secondaryMetrics.map(m => `${m.label}: ${m.value}`).join('\n') +
      `\nEvaluated on FingTaj Zero-Telemetry Terminal (https://www.fingtaj.com/${calc.slug})`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Share calculation with URL query params
  const [copiedLink, setCopiedLink] = useState(false);
  const handleShareLink = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([k, v]) => {
      params.set(k, String(v));
    });
    const url = `${window.location.origin}/${calc.slug}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Export calculation as CSV file
  const handleExportCSV = () => {
    const rows: string[][] = [
      ['FingTaj Terminal Calculation Export', calc.title],
      ['Statutory Baseline', calc.statute],
      [],
      ['INPUT PARAMETERS', 'VALUE'],
      ...calc.inputs.map(i => [i.label, String(inputs[i.id] ?? i.default)]),
      [],
      ['PRIMARY OUTCOME', result.primaryValue],
      ['Metric', result.primaryLabel],
      [],
      ['SECONDARY METRICS', 'VALUE'],
      ...result.secondaryMetrics.map(m => [m.label, m.value])
    ];

    if (result.schedule && result.schedule.length > 0) {
      rows.push([]);
      rows.push(['PROGRESSION SCHEDULE']);
      rows.push([
        result.scheduleHeaders?.[0] || 'Period',
        result.scheduleHeaders?.[1] || 'Metric 1',
        result.scheduleHeaders?.[2] || 'Metric 2',
        result.scheduleHeaders?.[3] || 'Metric 3'
      ]);
      result.schedule.forEach(row => {
        rows.push([row.period, row.col1, row.col2, row.col3]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${calc.slug}-fingtaj-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Formula
  const [copiedFormula, setCopiedFormula] = useState(false);
  const handleCopyFormula = () => {
    navigator.clipboard.writeText(calc.formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  // Related calculators
  const relatedCalcs = CALCULATORS_DATA
    .filter(c => c.category === calc.category && c.id !== calc.id)
    .slice(0, 4);

  // Quick preset chips
  const getPresetValues = (field: any) => {
    if (field.type === 'currency') {
      const step = field.step;
      const min = field.min;
      const def = field.default;
      return [
        Math.max(min, Math.round(def * 0.5 / step) * step),
        def,
        Math.min(field.max, Math.round(def * 1.5 / step) * step),
        Math.min(field.max, Math.round(def * 2.5 / step) * step)
      ];
    }
    return [];
  };

  return (
    <div className="pt-6 pb-16 bg-[#080d16] text-slate-100 min-h-screen bg-terminal-grid bg-radial-ambient">
      <div className="wrap">
        
        {/* Navigation Breadcrumb & Compliance Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-5 print-hide">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Link to="/" className="hover:text-cyan-400 transition-colors">TERMINAL</Link>
            <span aria-hidden="true" className="text-white/20">/</span>
            <Link to={`/?category=${calc.category}#catalog-matrix`} className="hover:text-cyan-400 transition-colors uppercase">
              {calc.categoryLabel}
            </Link>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="text-white font-bold">{calc.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono transition-colors cursor-pointer ${
                isFavorited 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Star size={13} className={isFavorited ? 'fill-amber-400 text-amber-400' : 'text-slate-500'} />
              <span>{isFavorited ? 'Pinned' : 'Pin Tool'}</span>
            </button>

            <span className="font-mono text-[11px] text-cyan-400 font-semibold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              CBDT / RBI COMPLIANT FY 2026–27
            </span>
          </div>
        </div>

        {/* Executive Header Block */}
        <div className="mb-8 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">{calc.categoryLabel}</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="text-slate-300">{calc.statute}</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="text-slate-500">Updated: {calc.lastUpdated}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {calc.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDesc}
          </p>
        </div>

        {/* 2-Column Computational Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left Column: Parameter Deck (7 cols) */}
          <div className="lg:col-span-7 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Input Parameters
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono cursor-pointer"
                title="Reset to default statutory parameters"
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-6">
              {calc.inputs.map(field => {
                const curVal = inputs[field.id] ?? field.default;
                const presets = getPresetValues(field);

                return (
                  <div key={field.id} className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label htmlFor={field.id} className="text-xs sm:text-sm font-semibold text-slate-200 block">
                          {field.label}
                        </label>
                        {field.type === 'currency' && (
                          <span className="text-[11px] font-mono font-medium text-cyan-400">
                            {formatINRWords(curVal)}
                          </span>
                        )}
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center border border-white/15 rounded-lg bg-black/40 overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-colors">
                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, false, field.min, field.max)}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label={`Decrease ${field.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <div className="flex items-center px-2 py-1 bg-transparent">
                          {field.type === 'currency' && (
                            <span className="text-cyan-400 font-mono text-xs mr-1 font-bold">₹</span>
                          )}
                          <input
                            id={field.id}
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={curVal}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              handleInputChange(field.id, isNaN(val) ? 0 : val);
                            }}
                            className="w-24 sm:w-28 bg-transparent text-white font-mono text-xs sm:text-sm font-bold text-right outline-none tabular-nums"
                          />
                          {field.type === 'percent' && (
                            <span className="text-slate-400 font-mono text-xs ml-1">%</span>
                          )}
                          {field.type === 'years' && (
                            <span className="text-slate-400 font-mono text-xs ml-1">Yr</span>
                          )}
                          {field.type === 'months' && (
                            <span className="text-slate-400 font-mono text-xs ml-1">Mo</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, true, field.min, field.max)}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label={`Increase ${field.label}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <div className="pt-1">
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={curVal}
                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>

                    {/* Presets */}
                    {presets.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Presets:</span>
                        {presets.map((val, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleInputChange(field.id, val)}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer tabular-nums ${
                              curVal === val 
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold' 
                                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {formatINRWords(val)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Output Console & Analytics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Outcome Card */}
            <div id="results-card" className="terminal-card bg-[#0a0f18] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-black to-slate-950 border border-cyan-500/30 mb-5">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-mono">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {result.primaryLabel}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-semibold">
                    Real-Time
                  </span>
                </div>

                <div className="text-3xl sm:text-5xl font-black font-mono text-cyan-400 tracking-tight tabular-nums drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  {result.primaryValue}
                </div>
              </div>

              {/* Secondary Metrics Matrix */}
              <div className="space-y-3 pt-2 font-mono">
                {result.secondaryMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-white/10 last:border-0">
                    <span className="text-slate-400 font-sans">{metric.label}:</span>
                    <span className={`font-bold tabular-nums ${
                      metric.highlight === 'emerald' ? 'text-emerald-400' :
                      metric.highlight === 'amber' ? 'text-amber-400' :
                      metric.highlight === 'blue' ? 'text-cyan-400' :
                      metric.highlight === 'rose' ? 'text-rose-400' : 'text-white'
                    }`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10 print-hide">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="col-span-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer border border-white/10"
                  title="Copy calculation memo"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="col-span-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer border border-white/10"
                  title="Share link with active inputs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="col-span-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer border border-white/10"
                  title="Download calculation as CSV"
                >
                  <Download size={14} />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="col-span-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer border border-white/10"
                  title="Print / Save PDF"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>

              {copiedLink && (
                <div className="mt-2 text-xs font-mono text-emerald-400 text-center font-medium">
                  ✓ Link with your active parameters copied to clipboard!
                </div>
              )}
            </div>

            {/* Interactive Donut Breakdown */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-2 font-mono">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Proportional Breakdown
                  </h3>
                  <span className="text-[10px] text-cyan-400">Interactive</span>
                </div>

                <DonutChart
                  slices={result.chartData}
                  totalLabel={result.primaryLabel}
                  totalValue={result.primaryValue}
                />
              </div>
            )}

            {/* Clean AdSlot */}
            <div className="print-hide">
              <AdSenseSlot slotId="calc-sidebar-unit" />
            </div>

          </div>
        </div>

        {/* Milestone Progression Schedule */}
        {result.schedule && result.schedule.length > 0 && (
          <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
                <Clock size={18} className="text-cyan-400" />
                <span>Milestone Projections &amp; Progression</span>
              </h3>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-950/70 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-cyan-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">{result.scheduleHeaders?.[0] || 'Period'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[1] || 'Metric 1'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[2] || 'Metric 2'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[3] || 'Metric 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono tabular-nums">
                  {result.schedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{row.period}</td>
                      <td className="py-3 px-4 text-slate-300">{row.col1}</td>
                      <td className="py-3 px-4 text-slate-300">{row.col2}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">{row.col3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* In-Depth Statutory Editorial Guide & Formulas */}
        <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="max-w-4xl space-y-8 text-slate-300 text-sm leading-relaxed">
            
            {/* Guide Introduction */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-3 flex items-center gap-2">
                <FileText size={20} className="text-cyan-400" />
                <span>Statutory Authority &amp; Mechanics</span>
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {calc.editorialGuide.summary}
              </p>
            </div>

            {/* Formula Card */}
            <div className="bg-black/40 border border-white/15 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Governing Mathematical Equation
                </h3>
                <button
                  type="button"
                  onClick={handleCopyFormula}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {copiedFormula ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedFormula ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-cyan-400 bg-white/5 p-3 rounded-lg border border-white/10 mb-3 overflow-x-auto">
                {calc.formula}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {calc.formulaExplanation}
              </p>
            </div>

            {/* Key Statutory Rules */}
            {calc.editorialGuide.keyBenefits && calc.editorialGuide.keyBenefits.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3 font-mono">
                  Key Regulatory Provisions &amp; Benefits
                </h3>
                <ul className="space-y-2">
                  {calc.editorialGuide.keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-xs sm:text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concrete Numerical Example */}
            {calc.editorialGuide.workedExample && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-2">
                  Practical Scenario: {calc.editorialGuide.workedExample.scenario}
                </h3>
                <ul className="space-y-1.5 mt-2 font-mono text-xs sm:text-sm">
                  {calc.editorialGuide.workedExample.breakdown.map((step, idx) => (
                    <li key={idx} className="text-slate-200 flex items-start gap-2">
                      <span className="text-emerald-400">▸</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {calc.editorialGuide.faqs && calc.editorialGuide.faqs.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono">
                  <HelpCircle size={18} className="text-cyan-400" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {calc.editorialGuide.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-white/5 rounded-xl border border-white/10 p-4 transition-all open:bg-white/10">
                      <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.q}</span>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-2.5">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Calculators */}
        {relatedCalcs.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono">
              <TrendingUp size={18} className="text-cyan-400" />
              <span>Related {calc.categoryLabel} Engines</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCalcs.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="terminal-card bg-[#0d1524] border border-white/10 hover:border-cyan-500/40 p-4 rounded-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-mono font-semibold">
                    <span>Launch</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
