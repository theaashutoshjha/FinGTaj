import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Calculator, ShieldCheck, BookOpen } from 'lucide-react';

export interface VariableDefinition {
  symbol: string;
  name: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorLayoutProps {
  title: string;
  subtitle: string;
  badge?: string;
  calculatorGui: React.ReactNode;
  formula: string;
  variables: VariableDefinition[];
  statutoryNotes: {
    actTitle: string;
    points: string[];
  };
  faqs: FAQItem[];
  copySummaryText?: string;
}

export default function CalculatorLayout({
  title,
  subtitle,
  badge = 'Statutory Verified',
  calculatorGui,
  formula,
  variables,
  statutoryNotes,
  faqs,
  copySummaryText
}: CalculatorLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopy = () => {
    if (!copySummaryText) return;
    navigator.clipboard.writeText(copySummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header & Primary H1 */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 mb-3">
          <ShieldCheck size={13} />
          <span>{badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Interactive Calculator GUI Block */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-8 mb-12 shadow-2xl backdrop-blur-sm">
        {calculatorGui}

        {copySummaryText && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700/60"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Calculation Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        )}
      </section>

      {/* Safety Spacing for AdSense & Accidental Click Prevention (>= 150px spacing buffer) */}
      <div className="h-6" aria-hidden="true" />

      {/* Section 1: Mathematical Methodology & Formula */}
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-2">
          <Calculator size={16} />
          <span>Section 1: Mathematical Formulation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Core Computational Formula
        </h2>
        
        {/* Semantic Formula Card */}
        <div className="p-4 sm:p-5 bg-slate-950 border border-cyan-900/40 rounded-lg text-cyan-300 font-mono text-sm sm:text-base overflow-x-auto mb-6">
          <code>{formula}</code>
        </div>

        {/* Variables Breakdown Table */}
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Variable Breakdown & Methodology
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Variable Name</th>
                <th className="py-2.5 px-3">Statutory & Practical Definition</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((v, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{v.symbol}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{v.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{v.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Statutory Framework & Regulatory Notes */}
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">
          <BookOpen size={16} />
          <span>Section 2: Legal & Statutory Framework</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          {statutoryNotes.actTitle}
        </h2>
        <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          {statutoryNotes.points.map((pt, i) => (
            <p key={i} className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>{pt}</span>
            </p>
          ))}
        </div>
      </section>

      {/* Section 3: Frequently Asked Questions (Accordion) */}
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-lg overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-slate-950/60 hover:bg-slate-900/80 transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} className="text-cyan-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-5 bg-slate-950/30 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Contextual Mini-Disclaimer */}
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-500 leading-relaxed">
        <strong>Statutory Education Notice:</strong> This calculator is engineered strictly for educational, illustrative modeling and self-planning purposes. Computations follow standard statutory guidelines under the Income Tax Act 1961, Reserve Bank of India Master Directions, and relevant financial acts. Results do not represent guaranteed returns, banking offers, or certified chartered advisory.
      </div>
    </div>
  );
}
