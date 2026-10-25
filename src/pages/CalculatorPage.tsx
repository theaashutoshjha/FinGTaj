import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Calculator, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Clock, 
  FileText,
  RotateCcw,
  Minus,
  Plus,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CALCULATORS_DATA, CALCULATORS_BY_SLUG, formatINR, formatNum, CalculatorItem } from '../data/calculatorsData';
import AdSenseSlot from '../components/AdSenseSlot';

interface CalculatorPageProps {
  forcedSlug?: string;
}

// Interactive SVG Donut Chart with hover inspection and luminous arcs
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
  const strokeWidth = 18;
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
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            className="opacity-40"
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
                filter: hoveredIdx === i ? `drop-shadow(0 0 8px ${arc.color})` : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.45 : 1
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Dynamic Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider line-clamp-1">
            {activeItem ? activeItem.label : totalLabel}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-white tracking-tight leading-tight mt-0.5">
            {activeItem ? activeItem.formatted : totalValue}
          </span>
          {activeItem && (
            <span className="text-[10px] font-mono font-semibold text-emerald-400 mt-0.5">
              {activeItem.pct.toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
        {sliceArcs.map((slice, idx) => (
          <button
            key={idx}
            type="button"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
              hoveredIdx === idx ? 'bg-slate-800/80' : 'hover:bg-slate-900/60'
            }`}
          >
            <span 
              className="w-3 h-3 rounded-full shrink-0 mt-0.5 transition-transform" 
              style={{ 
                backgroundColor: slice.color,
                boxShadow: hoveredIdx === idx ? `0 0 8px ${slice.color}` : 'none',
                transform: hoveredIdx === idx ? 'scale(1.2)' : 'scale(1)'
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
  const [searchParams, setSearchParams] = useSearchParams();
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
      // Clamp between min and max
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
    <div className="pt-6 pb-8">
      <div className="wrap">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 print-hide">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/#${calc.category.toLowerCase()}`} className="hover:text-emerald-400 transition-colors">{calc.categoryLabel}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-200 font-medium">{calc.title}</span>
        </div>

        {/* Header Block */}
        <div className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">{calc.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{calc.statute}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Updated: {calc.lastUpdated}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            {calc.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDesc}
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Interactive Inputs (7 cols) */}
          <div className="lg:col-span-7 fin-card p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Calculator size={18} className="text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Parameters &amp; Variables
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
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
                const pct = Math.min(100, Math.max(0, ((curVal - field.min) / (field.max - field.min)) * 100));

                return (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-200">
                        {field.label}
                      </label>

                      {/* Number Input with Stepper Nudge Controls */}
                      <div className="flex items-center border border-slate-700/80 rounded-lg bg-slate-900 overflow-hidden focus-within:border-emerald-500 transition-colors">
                        <button
                          type="button"
                          onClick={() => handleStepNudge(field.id, field.step, false, field.min, field.max)}
                          className="px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label={`Decrease ${field.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <div className="flex items-center px-2 py-1 bg-transparent">
                          {field.prefix && <span className="text-slate-400 text-xs font-mono mr-0.5">{field.prefix}</span>}
                          <input
                            id={field.id}
                            type="number"
                            value={curVal}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
                            className="w-20 sm:w-24 bg-transparent text-right font-mono text-sm font-bold text-white outline-none"
                          />
                          {field.suffix && <span className="text-slate-400 text-xs font-mono ml-0.5">{field.suffix}</span>}
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

                    {/* Range Slider with Dynamic Filled Color Track */}
                    <div className="relative pt-1 pb-1">
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={curVal}
                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, #1e293b ${pct}%, #1e293b 100%)`
                        }}
                        className="w-full h-2 rounded-lg cursor-pointer"
                        aria-label={field.label}
                      />
                    </div>

                    {/* Quick Presets (if currency) */}
                    {presets.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {presets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleInputChange(field.id, preset)}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                              curVal === preset
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {formatINR(preset)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Statutory Compliance Note */}
            {result.statutoryNote && (
              <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>{result.statutoryNote}</div>
              </div>
            )}
          </div>

          {/* Right Column: Results & Visualization (5 cols, sticky on desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24" id="results-card">
            
            {/* Primary Result Box */}
            <div className="fin-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-emerald-500/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                {result.primaryLabel}
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white num-mono tracking-tight text-emerald-400 mb-6">
                {result.primaryValue}
              </div>

              {/* Secondary Metrics */}
              <div className="space-y-3 border-t border-slate-800 pt-5">
                {result.secondaryMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
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
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800 print-hide">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied Summary' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  title="Copy shareable link with current inputs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Print / Save Institutional PDF Memo"
                >
                  <Printer size={16} />
                </button>
              </div>

              {copiedLink && (
                <div className="mt-2 text-[11px] text-emerald-400 text-center font-mono">
                  Link with your exact inputs copied to clipboard!
                </div>
              )}
            </div>

            {/* Interactive Donut Chart Visualizer */}
            {result.chartData && result.chartData.length > 0 && (
              <div className="fin-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Proportional Breakdown
                  </h3>
                  <span className="text-[11px] text-slate-500">Interactive</span>
                </div>

                <DonutChart
                  slices={result.chartData}
                  totalLabel={result.primaryLabel}
                  totalValue={result.primaryValue}
                />
              </div>
            )}

            {/* AdSense Unit placement under primary output */}
            <div className="print-hide">
              <AdSenseSlot slotId="calc-sidebar-unit" />
            </div>

          </div>
        </div>

        {/* Milestone Amortization Schedule Table (if available) */}
        {result.schedule && result.schedule.length > 0 && (
          <div className="fin-card p-6 sm:p-8 mb-12">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" />
              Milestone Projections &amp; Progression
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-emerald-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{result.scheduleHeaders?.[0] || 'Period'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[1] || 'Metric 1'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[2] || 'Metric 2'}</th>
                    <th className="py-3 px-4">{result.scheduleHeaders?.[3] || 'Balance'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {result.schedule.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-slate-300">{row.period}</td>
                      <td className="py-3 px-4 text-slate-200">{row.col1}</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">{row.col2}</td>
                      <td className="py-3 px-4 text-slate-400">{row.col3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* In-Depth Written Statutory Guide Section (AdSense Core Value) */}
        <div className="fin-card p-6 sm:p-10 mb-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
              <FileText size={14} />
              <span>Comprehensive Statutory Guide</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
              Understanding the Mechanics of {calc.title}
            </h2>

            <div className="editorial-prose text-slate-300 space-y-6 leading-relaxed">
              <p className="text-base sm:text-lg leading-relaxed text-slate-200">
                {calc.editorialGuide.summary}
              </p>

              {/* Mathematical Formula Card */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 my-6">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block mb-2">
                  Governing Mathematical Formula
                </span>
                <code className="text-sm sm:text-base font-mono font-bold text-white block bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                  {calc.formula}
                </code>
                <p className="text-xs text-slate-400 mt-3">
                  {calc.formulaExplanation}
                </p>
              </div>

              <h3>Key Statutory &amp; Financial Considerations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {calc.editorialGuide.keyBenefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <h3>Worked Mathematical Example</h3>
              <p><strong>{calc.editorialGuide.workedExample.scenario}</strong></p>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                {calc.editorialGuide.workedExample.breakdown.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Frequently Asked Questions (FAQ) */}
              <h3 className="pt-4">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4 pt-2">
                {calc.editorialGuide.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-semibold text-white text-sm sm:text-base mb-2">
                      {faq.q}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
          <div className="border-t border-slate-800 pt-6 pb-2 print-hide">
            <h3 className="text-xl font-bold text-white mb-4">
              More {calc.categoryLabel} Calculators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCalcs.map(item => (
                <Link
                  key={item.id}
                  to={`/${item.slug}`}
                  className="fin-card p-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
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

      {/* Mobile Sticky Bottom Result Bar (15% height compliant) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-2.5 px-4 flex items-center justify-between shadow-2xl print-hide">
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
          View Breakdown
        </button>
      </div>

    </div>
  );
}
