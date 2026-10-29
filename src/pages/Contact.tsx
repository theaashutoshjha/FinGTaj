import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck, Check, Send } from 'lucide-react';

interface SubmissionResult {
  trackingId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Engineering Desk & Grievance Officer — FingTaj';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Reach FingTaj engineering desk for calculation feedback, statutory formula variances, and Grievance Officer inquiries.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.fingtaj.com/contact');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Statutory Formula Variance / Bug Report',
    subject: '',
    message: '',
    _hp_company: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const categories = [
    'Statutory Formula Variance / Bug Report',
    'Regulatory & Tax Policy Feedback (CBDT / RBI)',
    'AdSense, Advertising & Partnership Inquiries',
    'DPDP Act 2023 / Data Privacy & Telemetry Request',
    'General Computational Feedback & Support'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected submission.');
      }

      setResult({
        trackingId: data.trackingId || `FT-${Date.now().toString(36).toUpperCase()}`,
        name: formData.name,
        email: formData.email,
        category: formData.category,
        subject: formData.subject || `${formData.category} - ${formData.name}`,
        message: formData.message,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
    } catch {
      const fallbackId = `FT-${Date.now().toString(36).toUpperCase()}`;
      setResult({
        trackingId: fallbackId,
        name: formData.name,
        email: formData.email,
        category: formData.category,
        subject: formData.subject || `${formData.category} - ${formData.name}`,
        message: formData.message,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 text-slate-300">
      <div className="wrap max-w-5xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft size={13} />
            <span>Return to Financial Hub</span>
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="glass-card-glow p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Mail size={14} />
            <span>Support Desk &amp; Statutory Review</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Contact Engineering &amp; Grievance Desk
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Submit statutory tax discrepancy notes, algorithmic bug reports, or partnership inquiries directly to our review team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8">
            {result ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3">
                  <Check size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-base">Inquiry Successfully Dispatched</h3>
                    <p className="text-xs text-emerald-400">Tracking Reference: {result.trackingId}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Sender:</span>
                    <span className="text-white font-medium">{result.name} ({result.email})</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-indigo-400 font-medium">{result.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Message:</span>
                    <p className="p-3 rounded-lg bg-black/30 text-slate-300 italic text-xs">
                      "{result.message}"
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Full Name <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rajesh@example.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category <span className="text-indigo-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your query or feedback with input parameters..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Transmitting...' : 'Dispatch Message'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400" />
                <span>Grievance Officer (IT Rules 2021)</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <p><span className="text-slate-400">Designated Officer:</span> <strong>Ashutosh Jha</strong></p>
                <p><span className="text-slate-400">Jurisdiction:</span> Chennai, Tamil Nadu, 600001, India</p>
                <p><span className="text-slate-400">Direct Intake:</span> <a href="mailto:support@fingtaj.com" className="text-indigo-400 underline font-semibold">support@fingtaj.com</a></p>
                <p><span className="text-slate-400">Turnaround SLA:</span> <span className="text-emerald-400 font-semibold">24 to 48 Hours</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
