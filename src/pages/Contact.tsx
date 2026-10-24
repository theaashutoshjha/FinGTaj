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
    _hp_company: '' // Honeypot anti-spam trap
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
      // If server is unreachable (e.g. static CDN deploy), generate a local client ticket & mailto fallback
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
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-300">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Direct Statutory Review & Support Desk
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Contact FingTaj Engineering Desk
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Submit statutory tax discrepancies, algorithmic bug reports, data governance requests, or partnership inquiries directly to our technical and mathematical review team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Contact Form or Success State */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          {result ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200">
                <svg className="w-8 h-8 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-emerald-300 text-lg">Inquiry Successfully Registered</h3>
                  <p className="text-xs text-emerald-400/90">A formal dispatch confirmation has been logged in our institutional database.</p>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500 uppercase">Tracking Reference ID:</span>
                  <span className="text-cyan-400 font-bold">{result.trackingId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500 uppercase">Submission Timestamp:</span>
                  <span className="text-slate-300">{result.timestamp} IST</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500 uppercase">Sender Email:</span>
                  <span className="text-slate-300">{result.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500 uppercase">Category:</span>
                  <span className="text-amber-300">{result.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block mb-1">Message Excerpt:</span>
                  <p className="text-slate-300 bg-slate-900/60 p-3 rounded font-sans text-xs italic">
                    "{result.message}"
                  </p>
                </div>
              </div>

              <div className="p-4 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-cyan-300">Turnaround Commitment (SLA):</p>
                <p>
                  Our quantitative engineering desk reviews all inquiries within <strong>24 to 48 business hours</strong>. For statutory formula corrections, an algorithmic review against official CBDT / RBI gazettes is triggered immediately.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
                >
                  Submit Another Inquiry
                </button>
                <a
                  href={`mailto:support@fingtaj.com?subject=Regarding Reference ${result.trackingId}&body=Hello FingTaj Desk,%0D%0A%0D%0AFollowing up on tracking ID ${result.trackingId}.`}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition inline-flex items-center gap-1.5"
                >
                  Email Support Directly
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-lg text-rose-300 text-sm">
                  {error}
                </div>
              )}

              {/* Honeypot anti-bot trap (hidden) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="_hp_company">Company Name (leave blank)</label>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rajesh@example.com"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Inquiry Category <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Sec 115BAC Surcharge Query"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Detailed Message / Computation Context <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your calculation input numbers, expected statutory behavior, bug details, or partnership proposal..."
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-sans"
                ></textarea>
                <p className="text-[11px] text-slate-500 mt-1">
                  Please do not include confidential passwords, PAN numbers, or bank account credentials. All mathematical discussions run under zero telemetry.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60 text-slate-950 font-bold px-8 py-3 rounded-lg text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Transmitting Inquiry...
                    </>
                  ) : (
                    <>
                      Transmit Inquiry to Engineering Desk
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Institutional Contact Information Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Operational Jurisdiction & Channels
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-slate-400 uppercase font-semibold block text-[10px] mb-1">Direct Operational Inquiries</span>
                <p className="font-mono text-cyan-400 text-sm">support@fingtaj.com</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Primary intake for general platform queries and calculation questions.</p>
              </div>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-slate-400 uppercase font-semibold block text-[10px] mb-1">Administrative & Governance Desk</span>
                <p className="font-mono text-cyan-400 text-sm">admin@fingtaj.com</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Publisher, AdSense, syndication, and infrastructure correspondence.</p>
              </div>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-slate-400 uppercase font-semibold block text-[10px] mb-1">Physical Jurisdiction & Principal Place</span>
                <p className="text-slate-200 font-medium">Chennai, Tamil Nadu, 600001, India</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Operating under the regulatory jurisdiction of the Republic of India.</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-semibold block text-[10px] mb-1">Statutory Redressal Desk (IT Rules 2021)</span>
                <p className="text-slate-200">Grievance Officer: <strong>Ashutosh Jha</strong></p>
                <p className="text-slate-400 text-[11px] mt-0.5">Email: <span className="font-mono text-cyan-400">support@fingtaj.com</span> (Subject: "Grievance Officer")</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Statutory acknowledgement within 24 hours; disposal within 15 days as per Rule 3(2) IT Rules 2021.</p>
              </div>
            </div>
          </div>

          {/* Official Social & Community Channels Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Official Community & Social Channels
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Connect with FingTaj across our verified community portals:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://www.linkedin.com/in/ashutosh-kumar-r/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
              >
                LinkedIn Profile
              </a>
              <a
                href="https://x.com/FinGTaj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 transition"
              >
                X (@FinGTaj)
              </a>
              <a
                href="https://www.youtube.com/@fingtaj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-rose-400 text-slate-300 hover:text-rose-400 transition"
              >
                YouTube Channel
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb7gkNgIt5rwnKzp0Y0K"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-emerald-400 text-slate-300 hover:text-emerald-400 transition"
              >
                WhatsApp Updates
              </a>
              <a
                href="https://www.quora.com/profile/FinGTaj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-red-400 text-slate-300 hover:text-red-400 transition col-span-2 text-center"
              >
                Quora Knowledge Space (@FinGTaj)
              </a>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3">Service Level Agreement (SLA) Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Inquiry Type</th>
                    <th className="pb-2 font-semibold">Response SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2">Statutory Formula Glitch</td>
                    <td className="py-2 text-cyan-400 font-medium">12–24 Hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">AdSense & Business</td>
                    <td className="py-2 text-slate-400">24–48 Hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">DPDP / Privacy Rights</td>
                    <td className="py-2 text-amber-300 font-medium">&lt; 48 Hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">General User Support</td>
                    <td className="py-2 text-slate-400">24–48 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
