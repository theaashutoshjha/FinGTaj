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
  ShieldCheck
} from 'lucide-react';
import { CALCULATORS_DATA, CALCULATORS_BY_SLUG, formatINR, CalculatorItem } from '../data/calculatorsData';
import AdSenseSlot from '../components/AdSenseSlot';

interface CalculatorPageProps {
  forcedSlug?: string;
}

// Interactive SVG Donut Chart with clean light palette
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
            stroke="#f1f5f9"
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
                filter: hoveredIdx === i ? `drop-shadow(0 2px 6px ${arc.color}66)` : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Dynamic Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide line-clamp-1">
            {activeItem ? activeItem.label : totalLabel}
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-slate-900 tracking-tight leading-tight mt-0.5">
            {activeItem ? activeItem.formatted : totalValue}
          </span>
          {activeItem && (
            <span className="text-[11px] font-mono font-bold text-emerald-600 mt-0.5">
              {activeItem.pct.toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
        {sliceArcs.map((slice, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
              hoveredIdx === idx ? 'bg-slate-50 border border-slate-200' : 'hover:bg-slate-50/60'
            }`}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 transition-transform" 
              style={{ 
                backgroundColor: slice.color,
                transform: hoveredIdx === idx ? 'scale(1.2)' : 'scale(1)'
              }} 
            />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500 truncate leading-tight">{slice.label}</div>
              <div className="text-xs font-mono font-bold text-slate-800 tracking-tight mt-0.5">
                {slice.formatted} <span className="text-[10px] text-slate-400 font-normal">({slice.pct.toFixed(1)}%)</span>
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
    <div className="pt-6 pb-16 bg-[#f4f7fb] min-h-screen">
      <div className="wrap">
        
        {/* Navigation Breadcrumb & Compliance Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-5 print-hide">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <Link to={`/#${calc.category.toLowerCase()}`} className="hover:text-blue-600 transition-colors">{calc.categoryLabel}</Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">{calc.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-blue-700 font-semibold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
              CBDT / RBI COMPLIANT FY 2025–26
            </span>
          </div>
        </div>

        {/* Executive Header Block */}
        <div className="mb-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="text-blue-600 font-bold uppercase tracking-wide">{calc.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-700 font-medium">{calc.statute}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">Updated: {calc.lastUpdated}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {calc.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {calc.shortDesc}
          </p>
        </div>

        {/* 2-Column Executive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left Column: Precision Parameter Deck (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#2563eb]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Input Parameters
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
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
                      <label htmlFor={field.id} className="text-xs sm:text-sm font-semibold text-slate-800">
                        {field.label}
                      </label>

                      {/* Stepper Nudge Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden focus-within:border-blue-500 focus-within:bg-white transition-colors">
                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, false, field.min, field.max)}
                          className="px-2 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          aria-label={`Decrease ${field.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <div className="flex items-center px-2 py-1 bg-transparent">
                          {field.type === 'currency' && (
                            <span className="text-blue-600 font-mono text-xs mr-1 font-bold">₹</span>
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
                            className="w-24 sm:w-28 bg-transparent text-slate-900 font-mono text-xs sm:text-sm font-bold text-right outline-none"
                          />
                          {field.type === 'percent' && (
                            <span className="text-slate-500 font-mono text-xs ml-1">%</span>
                          )}
                          {field.type === 'years' && (
                            <span className="text-slate-500 font-mono text-xs ml-1">Yr</span>
                          )}
                          {field.type === 'months' && (
                            <span className="text-slate-500 font-mono text-xs ml-1">Mo</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, true, field.min, field.max)}
                          className="px-2 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
                        <span className="text-[10px] text-slate-400 font-mono uppercase mr-1">Presets:</span>
                        {presets.map((val, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleInputChange(field.id, val)}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                              curVal === val 
                                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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

          {/* Right Column: Output Summary & Visualizer (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Result Box (Mint Green Output Callout) */}
            <div id="results-card" className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="bg-[#eafaf1] border border-[#a7f3d0] rounded-xl p-5 mb-5">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">
                    {result.primaryLabel}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Real-Time
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono text-[#059669] tracking-tight">
                  {result.primaryValue}
                </div>
              </div>

              {/* Secondary Metrics Matrix */}
              <div className="space-y-3 pt-2">
                {result.secondaryMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600 font-medium">{metric.label}:</span>
                    <span className={`font-mono font-bold ${
                      metric.highlight === 'emerald' ? 'text-emerald-600' :
                      metric.highlight === 'amber' ? 'text-amber-600' :
                      metric.highlight === 'blue' ? 'text-blue-600' :
                      metric.highlight === 'rose' ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 print-hide">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied' : 'Copy Breakdown'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                  title="Share link with active inputs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Print / PDF Memo"
                >
                  <Printer size={16} />
                </button>
              </div>

              {copiedLink && (
                <div className="mt-2 text-xs text-emerald-600 text-center font-medium">
                  ✓ Link with your exact parameters copied to clipboard!
                </div>
              )}
            </div>

            {/* Interactive Donut Breakdown Visualizer */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Proportional Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Interactive</span>
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

        {/* Milestone Progression Schedule (if applicable) */}
        {result.schedule && result.schedule.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#2563eb]" />
              <span>Milestone Projections &amp; Progression</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-blue-600 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">{result.scheduleHeaders?.[0] || 'Period'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[1] || 'Metric 1'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[2] || 'Metric 2'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[3] || 'Metric 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {result.schedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{row.period}</td>
                      <td className="py-3 px-4 text-slate-600">{row.col1}</td>
                      <td className="py-3 px-4 text-slate-600">{row.col2}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{row.col3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* In-Depth Statutory Editorial Guide & Formulas */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
          <div className="max-w-4xl space-y-8 text-slate-700 text-sm leading-relaxed">
            
            {/* Guide Introduction */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
                <FileText size={20} className="text-[#2563eb]" />
                <span>Statutory Guide &amp; Mechanics</span>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {calc.editorialGuide.summary}
              </p>
            </div>

            {/* Formula Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono mb-2">
                Governing Mathematical Equation
              </h3>
              <div className="font-mono text-sm sm:text-base font-bold text-blue-600 bg-white p-3 rounded-lg border border-slate-200 mb-3 overflow-x-auto">
                {calc.formula}
              </div>
              <p className="text-xs text-slate-500">
                {calc.formulaExplanation}
              </p>
            </div>

            {/* Key Statutory Rules */}
            {calc.editorialGuide.keyBenefits && calc.editorialGuide.keyBenefits.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Key Regulatory Provisions &amp; Advantages
                </h3>
                <ul className="space-y-2">
                  {calc.editorialGuide.keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-xs sm:text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concrete Numerical Example */}
            {calc.editorialGuide.workedExample && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono mb-2">
                  Worked Practical Scenario: {calc.editorialGuide.workedExample.scenario}
                </h3>
                <ul className="space-y-1.5 mt-2">
                  {calc.editorialGuide.workedExample.breakdown.map((step, idx) => (
                    <li key={idx} className="text-slate-700 text-xs sm:text-sm font-mono flex items-start gap-2">
                      <span className="text-emerald-600">▸</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Frequently Asked Questions */}
            {calc.editorialGuide.faqs && calc.editorialGuide.faqs.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle size={18} className="text-[#2563eb]" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {calc.editorialGuide.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-slate-50 rounded-xl border border-slate-200 p-4 transition-all open:bg-white open:shadow-xs">
                      <summary className="font-semibold text-slate-800 text-xs sm:text-sm cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.q}</span>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
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
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#2563eb]" />
              <span>Related {calc.categoryLabel} Calculators</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCalcs.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 block mb-1">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
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
