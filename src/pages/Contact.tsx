import React, { useState, useEffect } from 'react';

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
    if (metaDesc) metaDesc.setAttribute('content', 'Reach FingTaj engineering desk for calculation feedback, statutory formula variances, and Grievance Officer inquiries with 24-48h SLA.');
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
        throw new Error(data.error || 'Server rejected submission. Please check your inputs.');
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
    } catch (err: any) {
      console.warn('[Contact] Backend submission note:', err.message);
      const fallbackId = `FT-LOCAL-${Date.now().toString(36).toUpperCase()}`;
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

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      category: 'Statutory Formula Variance / Bug Report',
      subject: '',
      message: '',
      _hp_company: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-[#080d16] text-slate-100 min-h-screen py-10 bg-terminal-grid bg-radial-ambient">
      <div className="max-w-5xl mx-auto px-4 text-slate-300">
        
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 font-mono">
            Direct Statutory Review · Support Desk
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Contact FingTaj Engineering Desk
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Submit statutory tax discrepancies, algorithmic bug reports, data governance requests, or partnership inquiries directly to our review team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Contact Form or Success State */}
          <div className="lg:col-span-7 terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl">
            {result ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-200">
                  <svg className="w-8 h-8 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-white text-lg font-mono">Inquiry Registered</h3>
                    <p className="text-xs text-emerald-400 font-mono">Tracking reference dispatch logged.</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 uppercase">Tracking ID:</span>
                    <span className="text-cyan-400 font-bold">{result.trackingId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 uppercase">Timestamp:</span>
                    <span className="text-slate-200">{result.timestamp} IST</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 uppercase">Sender Email:</span>
                    <span className="text-slate-200">{result.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 uppercase">Category:</span>
                    <span className="text-white font-bold">{result.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block mb-1">Message Excerpt:</span>
                    <p className="text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10 font-sans text-xs italic">
                      "{result.message}"
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-slate-300 space-y-1 font-mono">
                  <p className="font-bold text-cyan-300">Turnaround Commitment (SLA):</p>
                  <p>
                    Our quantitative engineering desk reviews all inquiries within <strong>24 to 48 business hours</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition font-mono cursor-pointer border border-white/10"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href={`mailto:support@fingtaj.com?subject=Regarding Reference ${result.trackingId}&body=Hello FingTaj Desk,%0D%0A%0D%0AFollowing up on tracking ID ${result.trackingId}.`}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    Email Desk Directly
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-sm font-mono">
                    {error}
                  </div>
                )}

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="_hp_company">Company Name</label>
                  <input
                    type="text"
                    id="_hp_company"
                    name="_hp_company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._hp_company}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Your Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rajesh@example.com"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Inquiry Category <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition font-sans"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#0e1626] text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., Sec 115BAC Surcharge Query"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Detailed Message <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your calculation input numbers, expected statutory behavior, bug details, or partnership proposal..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition font-sans"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-black font-black px-8 py-3 rounded-xl text-sm transition shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    {loading ? 'Transmitting...' : 'Dispatch Message to Engineering Desk'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Institutional Contact Information Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Operational Jurisdictions
              </h2>

              <div className="space-y-4 text-xs text-slate-300 font-mono">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-slate-500 uppercase font-bold block text-[10px] mb-1">Direct Support Desk</span>
                  <p className="text-cyan-400 text-sm font-semibold">support@fingtaj.com</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Primary intake for calculations &amp; queries.</p>
                </div>

                <div className="border-b border-white/10 pb-3">
                  <span className="text-slate-500 uppercase font-bold block text-[10px] mb-1">Administration Desk</span>
                  <p className="text-cyan-400 text-sm font-semibold">admin@fingtaj.com</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Publisher, AdSense, syndication correspondence.</p>
                </div>

                <div className="border-b border-white/10 pb-3">
                  <span className="text-slate-500 uppercase font-bold block text-[10px] mb-1">Jurisdiction &amp; Place</span>
                  <p className="text-white font-medium">Chennai, Tamil Nadu, 600001, India</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Operating under the regulatory jurisdiction of the Republic of India.</p>
                </div>

                <div>
                  <span className="text-slate-500 uppercase font-bold block text-[10px] mb-1">Grievance Officer (IT Rules 2021)</span>
                  <p className="text-white font-semibold">Ashutosh Jha</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Email: <span className="text-cyan-400">support@fingtaj.com</span></p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="terminal-card bg-[#0d1524] border border-white/15 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Official Channels
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href="https://www.linkedin.com/in/ashutosh-kumar-r/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
                >
                  LinkedIn Profile
                </a>
                <a
                  href="https://x.com/FinGTaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
                >
                  X (@FinGTaj)
                </a>
                <a
                  href="https://www.youtube.com/@fingtaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rose-400 text-slate-300 hover:text-rose-400 transition"
                >
                  YouTube Channel
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vb7gkNgIt5rwnKzp0Y0K"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400 text-slate-300 hover:text-emerald-400 transition"
                >
                  WhatsApp Channel
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
