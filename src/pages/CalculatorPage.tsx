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
  Star,
  ShieldCheck,
  Zap,
  ChevronDown
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

// Modern Interactive Donut Chart
function ModernDonutChart({ 
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

  const radius = 64;
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
      <div className="relative w-48 h-48 flex items-center justify-center my-3">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90 transform">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
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
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1,
                filter: hoveredIdx === i ? `drop-shadow(0 0 12px ${arc.color})` : 'none'
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
            {activeItem ? activeItem.label : totalLabel}
          </span>
          <span className="text-base sm:text-lg font-black font-tabular text-white tracking-tight leading-tight mt-0.5">
            {activeItem ? activeItem.formatted : totalValue}
          </span>
          {activeItem && (
            <span className="text-[11px] font-bold text-indigo-400 mt-0.5 font-tabular">
              {activeItem.pct.toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/5">
        {sliceArcs.map((slice, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-2 p-2 rounded-xl transition-all cursor-pointer ${
              hoveredIdx === idx ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" 
              style={{ backgroundColor: slice.color, boxShadow: `0 0 8px ${slice.color}` }} 
            />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 truncate">{slice.label}</div>
              <div className="text-xs font-bold text-white font-tabular">
                {slice.formatted} <span className="text-[10px] text-slate-400 font-normal">({slice.pct.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
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

  // Initialize inputs from URL params or defaults
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

  // Re-sync on slug change
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

    // Update dynamic SEO tags
    const pageUrl = `https://www.fingtaj.com/${calc.slug}`;
    document.title = `${calc.title} — Free High-Precision Calculator | FingTaj`;

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

    setMeta('meta[name="description"]', 'content', `${calc.shortDesc} Evaluated client-side with zero telemetry on FingTaj.`);
    setMeta('meta[property="og:title"]', 'content', `${calc.title} | FingTaj`);
    setMeta('meta[property="og:description"]', 'content', calc.shortDesc);
    setMeta('meta[property="og:url"]', 'content', pageUrl);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', pageUrl);
    }

    window.scrollTo(0, 0);
  }, [slug, calc, searchParams]);

  // Compute live calculation
  const result = calc.calculate(inputs);

  // Pinned favorites
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

  // Actions
  const [copiedSummary, setCopiedSummary] = useState(false);
  const handleCopySummary = () => {
    const text = `${calc.title} Result:\n${result.primaryLabel}: ${result.primaryValue}\n` +
      result.secondaryMetrics.map(m => `${m.label}: ${m.value}`).join('\n') +
      `\nComputed on FingTaj (https://www.fingtaj.com/${calc.slug})`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

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

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['FingTaj Calculation Export', calc.title],
      ['Statutory Reference', calc.statute],
      [],
      ['INPUTS', 'VALUE'],
      ...calc.inputs.map(i => [i.label, String(inputs[i.id] ?? i.default)]),
      [],
      ['PRIMARY RESULT', result.primaryValue],
      ['Metric', result.primaryLabel],
      [],
      ['BREAKDOWN', 'VALUE'],
      ...result.secondaryMetrics.map(m => [m.label, m.value])
    ];

    if (result.schedule && result.schedule.length > 0) {
      rows.push([]);
      rows.push(['PROGRESSION TIMELINE']);
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
    link.setAttribute('download', `${calc.slug}-fingtaj.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const relatedEngines = CALCULATORS_DATA
    .filter(c => c.category === calc.category && c.id !== calc.id)
    .slice(0, 3);

  return (
    <div className="py-8 sm:py-12 text-slate-100">
      <div className="wrap">
        
        {/* Navigation Breadcrumbs & Pin Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/?category=${calc.category}#catalog-matrix`} className="hover:text-white transition-colors">
              {calc.categoryLabel}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{calc.title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isFavorited 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Star size={13} className={isFavorited ? 'fill-amber-400' : ''} />
              <span>{isFavorited ? 'Pinned' : 'Pin to Home'}</span>
            </button>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {calc.statute}
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            {calc.title}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDesc}
          </p>
        </div>

        {/* Top Leaderboard Ad Unit */}
        <div className="mb-10 print-hide">
          <AdSenseSlot slotId="calc-top-slot" format="leaderboard" label="Sponsored · Financial Utilities" />
        </div>

        {/* 2-Column Computational Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Interactive Inputs (7 cols) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sliders size={16} className="text-indigo-400" />
                <span>Adjust Parameters</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-6">
              {calc.inputs.map(field => {
                const curVal = inputs[field.id] ?? field.default;

                return (
                  <div key={field.id} className="space-y-3">
                    <div className="flex justify-between items-center gap-3">
                      <div>
                        <label htmlFor={field.id} className="text-xs sm:text-sm font-semibold text-slate-200 block">
                          {field.label}
                        </label>
                        {field.type === 'currency' && (
                          <span className="text-[11px] font-tabular text-indigo-400">
                            {formatINRWords(curVal)}
                          </span>
                        )}
                      </div>

                      {/* Stepper with Direct Input */}
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, false, field.min, field.max)}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label={`Decrease ${field.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <div className="flex items-center px-2 py-1">
                          {field.type === 'currency' && <span className="text-slate-400 text-xs mr-0.5">₹</span>}
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
                            className="w-24 sm:w-28 bg-transparent text-white font-tabular text-xs sm:text-sm font-bold text-right outline-none"
                          />
                          {field.type === 'percent' && <span className="text-slate-400 text-xs ml-0.5">%</span>}
                          {field.type === 'years' && <span className="text-slate-400 text-xs ml-0.5">Yr</span>}
                          {field.type === 'months' && <span className="text-slate-400 text-xs ml-0.5">Mo</span>}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, true, field.min, field.max)}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label={`Increase ${field.label}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={curVal}
                      onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Outcomes & Visualization (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Result Highlight Card */}
            <div className="glass-card-glow p-6 sm:p-7 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {result.primaryLabel}
                </span>
                <div className="text-3xl sm:text-5xl font-black font-tabular text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 tracking-tight">
                  {result.primaryValue}
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                {result.secondaryMetrics.map((metric, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <span className="text-[11px] text-slate-400 block mb-0.5">{metric.label}</span>
                    <span className={`font-bold font-tabular text-sm ${
                      metric.highlight === 'emerald' ? 'text-emerald-400' :
                      metric.highlight === 'amber' ? 'text-amber-400' :
                      metric.highlight === 'rose' ? 'text-rose-400' : 'text-slate-100'
                    }`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10 print-hide">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>

              {copiedLink && (
                <div className="text-xs text-center text-emerald-400 font-medium">
                  ✓ Shareable link copied to clipboard!
                </div>
              )}
            </div>

            {/* Donut Chart if available */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Proportional Breakdown
                </h3>
                <ModernDonutChart
                  slices={result.chartData}
                  totalLabel={result.primaryLabel}
                  totalValue={result.primaryValue}
                />
              </div>
            )}

            {/* Sidebar Ad Unit */}
            <div className="print-hide">
              <AdSenseSlot slotId="calc-sidebar" format="rectangle" label="Advertisement · Financial Services" />
            </div>

          </div>
        </div>

        {/* Milestone Progression Schedule */}
        {result.schedule && result.schedule.length > 0 && (
          <div className="glass-card p-6 sm:p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-indigo-400" />
                <span>Progression Schedule &amp; Milestones</span>
              </h3>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Download Schedule</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{result.scheduleHeaders?.[0] || 'Period'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[1] || 'Metric 1'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[2] || 'Metric 2'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[3] || 'Metric 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-tabular">
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

        {/* In-Article Sponsor Slot */}
        <div className="mb-12 print-hide">
          <AdSenseSlot slotId="calc-in-article" format="in-article" label="Advertisement · Financial Research" />
        </div>

        {/* Editorial Guide & Statutory Equations */}
        <div className="glass-card p-6 sm:p-10 space-y-8 mb-12">
          
          {/* AI Instant Summary Snippet (AEO & GEO) */}
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Zap size={15} />
              <span>AI Instant Summary &amp; Key Statutory Takeaway</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {calc.title} calculates <strong className="text-indigo-300">{calc.shortDesc}</strong> calibrated to {calc.statute}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-white/10">
              <div className="p-2 rounded-lg bg-black/20">
                <span className="text-slate-400 text-[10px] uppercase block">Equation</span>
                <span className="font-mono text-indigo-300 font-semibold truncate block">{calc.formula}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <span className="text-slate-400 text-[10px] uppercase block">Governing Law</span>
                <span className="text-emerald-400 font-semibold truncate block">{calc.statute}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <span className="text-slate-400 text-[10px] uppercase block">Privacy Model</span>
                <span className="text-white font-semibold block">100% Client-Side RAM</span>
              </div>
            </div>
          </div>

          {/* Detailed Editorial Intro */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <FileText size={20} className="text-indigo-400" />
              <span>Statutory Framework &amp; Mechanics</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {calc.editorialGuide.summary}
            </p>
          </div>

          {/* Formula Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mathematical Formulation
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-indigo-300 bg-black/40 p-3 rounded-xl border border-white/5 overflow-x-auto">
              {calc.formula}
            </div>
            <p className="text-xs text-slate-400">
              {calc.formulaExplanation}
            </p>
          </div>

          {/* Key Benefits */}
          {calc.editorialGuide.keyBenefits && calc.editorialGuide.keyBenefits.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white mb-3">
                Key Regulatory Provisions &amp; Advantages
              </h3>
              <ul className="space-y-2.5">
                {calc.editorialGuide.keyBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Numerical Scenario */}
          {calc.editorialGuide.workedExample && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Concrete Scenario: {calc.editorialGuide.workedExample.scenario}
              </h3>
              <ul className="space-y-1.5 font-tabular text-xs sm:text-sm text-slate-200">
                {calc.editorialGuide.workedExample.breakdown.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">▸</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs Accordion */}
          {calc.editorialGuide.faqs && calc.editorialGuide.faqs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle size={18} className="text-indigo-400" />
                <span>Frequently Asked Questions</span>
              </h3>
              <div className="space-y-3">
                {calc.editorialGuide.faqs.map((faq, idx) => (
                  <details key={idx} className="group glass-card p-4 transition-all">
                    <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* E-E-A-T Author & Regulatory Verification Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Audited for FY 2026–27 Statutory Accuracy</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">Verified</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered and calibrated by <strong>Ashutosh Jha</strong>. Grounded in {calc.statute}. Last audited: {calc.lastUpdated}.
                </p>
              </div>
            </div>
            <Link to="/about" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap">
              E-E-A-T Disclosure →
            </Link>
          </div>

        </div>

        {/* Bottom Horizontal Sponsor Slot */}
        <div className="mb-12 print-hide">
          <AdSenseSlot slotId="calc-bottom-slot" format="horizontal" label="Advertisement · Financial Services" />
        </div>

        {/* Related Engines */}
        {relatedEngines.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Related {calc.categoryLabel} Calculators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedEngines.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="glass-card p-6 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 block mb-1">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                    <span>Calculate</span>
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
