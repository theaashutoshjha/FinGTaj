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
  Sliders
} from 'lucide-react';
import { CALCULATORS_DATA, CALCULATORS_BY_SLUG, formatINR, CalculatorItem } from '../data/calculatorsData';
import AdSenseSlot from '../components/AdSenseSlot';

interface CalculatorPageProps {
  forcedSlug?: string;
}

// Interactive SVG Donut Chart with high-contrast glowing arcs
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
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedLength = 0;
  const sliceArcs = slices.map((slice, i) => {
    const val = Math.max(0, slice.value);
    const pct = total > 0 ? val / total : (i === 0 ? 1 : 0);
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedLength;
    accumulatedLength += pct * circumference;

    return {
      ...slice,
      pct: pct * 100,
      strokeDasharray,
      strokeDashoffset,
    };
  });

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
            stroke="#111c33"
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
              strokeWidth={hoveredIdx === i ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={arc.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              style={{
                filter: hoveredIdx === i ? `drop-shadow(0 0 10px ${arc.color})` : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Dynamic Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
            {activeItem ? activeItem.label : totalLabel}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-white tracking-tight leading-tight mt-0.5">
            {activeItem ? activeItem.formatted : totalValue}
          </span>
          {activeItem && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 mt-0.5">
              {activeItem.pct.toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.08]">
        {sliceArcs.map((slice, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
              hoveredIdx === idx ? 'bg-slate-800/80 border border-white/[0.08]' : 'hover:bg-slate-900/60'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 transition-transform" 
              style={{ 
                backgroundColor: slice.color,
                boxShadow: hoveredIdx === idx ? `0 0 8px ${slice.color}` : 'none',
                transform: hoveredIdx === idx ? 'scale(1.25)' : 'scale(1)'
              }} 
            />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 truncate leading-tight">{slice.label}</div>
              <div className="text-xs font-mono font-bold text-white tracking-tight mt-0.5">
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
        const [k, v] = selector.replace(/[\[\]"]/g, '').split('=');
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
  }, [slug, calc]);

  // Compute live result
  const result = calc.calculate(inputs);

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
    const text = `${calc.title} Calculation:\n${result.primaryLabel}: ${result.primaryValue}\n` +
      result.secondaryMetrics.map(m => `${m.label}: ${m.value}`).join('\n') +
      `\nComputed on FingTaj (https://www.fingtaj.com/${calc.slug})`;
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

  // Related calculators in the same category
  const relatedCalcs = CALCULATORS_DATA
    .filter(c => c.category === calc.category && c.id !== calc.id)
    .slice(0, 4);

  // Quick preset chips for currency inputs
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
    <div className="pt-6 pb-12">
      <div className="wrap">
        
        {/* Navigation Breadcrumb & Compliance Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-5 print-hide">
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <Link to={`/#${calc.category.toLowerCase()}`} className="hover:text-emerald-400 transition-colors">{calc.categoryLabel}</Link>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">{calc.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              CBDT / RBI COMPLIANT FY 2025–26
            </span>
          </div>
        </div>

        {/* Executive Header Block */}
        <div className="mb-8 border-b border-white/[0.08] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
            <span className="text-emerald-400 font-mono font-semibold uppercase">{calc.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-mono">{calc.statute}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Updated: {calc.lastUpdated}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2.5">
            {calc.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDesc}
          </p>
        </div>

        {/* 2-Column Executive Terminal Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left Column: Precision Parameter Deck (7 cols) */}
          <div className="lg:col-span-7 fin-card p-6 sm:p-7 border-white/[0.1]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-emerald-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Parameters &amp; Variables
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-mono"
                title="Reset to default statutory values"
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
                      <label htmlFor={field.id} className="text-xs sm:text-sm font-semibold text-slate-200">
                        {field.label}
                      </label>

                      {/* Stepper Nudge Controls */}
                      <div className="flex items-center border border-white/[0.1] rounded-lg bg-slate-900 overflow-hidden focus-within:border-emerald-500/80 transition-colors">
                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, false, field.min, field.max)}
                          className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label={`Decrease ${field.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <div className="flex items-center px-2 py-1 bg-transparent">
                          {field.type === 'currency' && (
                            <span className="text-emerald-400 font-mono text-xs mr-1 font-bold">₹</span>
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
                            className="w-24 sm:w-28 bg-transparent text-white font-mono text-xs sm:text-sm font-bold text-right outline-none"
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
                          className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label={`Increase ${field.label}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Precision Slider Bar */}
                    <div className="pt-1">
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={curVal}
                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Presets Chips if applicable */}
                    {presets.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Presets:</span>
                        {presets.map((val, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleInputChange(field.id, val)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                              curVal === val 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {formatINR(val)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Executive Financial Ledger & Visualizer HUD (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Ledger Card */}
            <div id="results-card" className="fin-card p-6 sm:p-7 border-emerald-500/30 bg-gradient-to-b from-[#0b1426] to-[#070d19] shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {result.primaryLabel}
                </span>
                <span className="badge-subtle">
                  Instant Output
                </span>
              </div>

              {/* Luminous Primary Output Figure */}
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-emerald-400 tracking-tight mb-6">
                {result.primaryValue}
              </div>

              {/* Secondary Metrics Matrix */}
              <div className="space-y-3 border-t border-white/[0.08] pt-5">
                {result.secondaryMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400">{metric.label}:</span>
                    <span className={`font-mono font-bold ${
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
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/[0.08] print-hide">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied' : 'Copy Memo'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                  title="Share link with active inputs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                  title="Print / PDF Memo"
                >
                  <Printer size={16} />
                </button>
              </div>

              {copiedLink && (
                <div className="mt-2 text-[11px] text-emerald-400 text-center font-mono">
                  Link with your exact parameters copied to clipboard!
                </div>
              )}
            </div>

            {/* Interactive Donut Breakdown Visualizer */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="fin-card p-6 border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Proportional Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Interactive</span>
                </div>

                <DonutChart
                  slices={result.chartData}
                  totalLabel={result.primaryLabel}
                  totalValue={result.primaryValue}
                />
              </div>
            )}

            {/* Clean Collapsible AdSlot */}
            <div className="print-hide">
              <AdSenseSlot slotId="calc-sidebar-unit" />
            </div>

          </div>
        </div>

        {/* Milestone Progression Schedule (if applicable) */}
        {result.schedule && result.schedule.length > 0 && (
          <div className="fin-card p-6 sm:p-8 mb-10 border-white/[0.08]">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" />
              <span>Milestone Projections &amp; Progression</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-xs text-emerald-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">{result.scheduleHeaders?.[0] || 'Period'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[1] || 'Metric 1'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[2] || 'Metric 2'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[3] || 'Balance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-xs">
                  {result.schedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-300">{row.period}</td>
                      <td className="py-2.5 px-4 text-slate-200">{row.col1}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-semibold">{row.col2}</td>
                      <td className="py-2.5 px-4 text-slate-400">{row.col3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* In-Depth Written Statutory Guide */}
        <div className="fin-card p-6 sm:p-9 mb-10 border-white/[0.08]">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2 font-mono uppercase">
              <FileText size={14} />
              <span>Statutory Guide &amp; Formula Methodology</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-5">
              Understanding the Mechanics of {calc.title}
            </h2>

            <div className="editorial-prose text-slate-300 space-y-6 text-sm leading-relaxed">
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                {calc.editorialGuide.summary}
              </p>

              {/* Mathematical Formula Card */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] my-6">
                <span className="text-[11px] uppercase font-bold text-emerald-400 font-mono tracking-wider block mb-2">
                  Governing Mathematical Formula
                </span>
                <code className="text-xs sm:text-sm font-mono font-bold text-white block bg-slate-950 p-3 rounded-lg border border-white/[0.06] overflow-x-auto">
                  {calc.formula}
                </code>
                <p className="text-xs text-slate-400 mt-3">
                  {calc.formulaExplanation}
                </p>
              </div>

              <h3 className="text-base font-bold text-white">Statutory Considerations</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                {calc.editorialGuide.keyBenefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <h3 className="text-base font-bold text-white pt-2">Worked Mathematical Scenario</h3>
              <p className="font-medium text-slate-200">{calc.editorialGuide.workedExample.scenario}</p>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/[0.06] space-y-2 text-xs sm:text-sm">
                {calc.editorialGuide.workedExample.breakdown.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* FAQ Accordion */}
              <h3 className="text-base font-bold text-white pt-4">Frequently Asked Questions</h3>
              <div className="space-y-3 pt-2">
                {calc.editorialGuide.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                    <div className="font-semibold text-white text-xs sm:text-sm mb-1.5">
                      {faq.q}
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense In-Content Banner */}
        <div className="mb-6 print-hide">
          <AdSenseSlot slotId="calc-incontent-bottom" />
        </div>

        {/* Related Calculators in the same Category */}
        {relatedCalcs.length > 0 && (
          <div className="border-t border-white/[0.08] pt-6 pb-2 print-hide">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">
              More {calc.categoryLabel} Calculators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCalcs.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="fin-card p-4.5 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 mb-1 block">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-4">
                    <span>Calculate</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Sticky Executive Bottom Bar (15% height compliant) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#030712]/95 backdrop-blur-md border-t border-white/[0.08] py-2.5 px-4 flex items-center justify-between shadow-2xl print-hide">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {result.primaryLabel}
          </span>
          <span className="text-base font-black font-mono text-emerald-400 tracking-tight">
            {result.primaryValue}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('results-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          View Ledger
        </button>
      </div>

    </div>
  );
}
