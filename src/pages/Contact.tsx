import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
      <p className="text-slate-400 mb-8">Have a query or calculation feedback? Reach out directly below.</p>

      {submitted ? (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-lg text-emerald-300">
          Thank you for your message. We aim to respond within 24–48 business hours.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Name</label>
            <input required type="text" className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Email Address</label>
            <input required type="email" className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-200">Message</label>
            <textarea required rows={4} className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500"></textarea>
          </div>
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-2 rounded transition">
            Send Message
          </button>
        </form>
      )}

      <div className="mt-12 pt-6 border-t border-slate-800 text-sm text-slate-400">
        <p><strong>Direct Inquiries:</strong> support@fingtaj.com</p>
        <p><strong>Physical Jurisdiction:</strong> Chennai, Tamil Nadu, India</p>
        <p><strong>Response Time:</strong> 24 to 48 business hours</p>
      </div>
    </div>
  );
}
