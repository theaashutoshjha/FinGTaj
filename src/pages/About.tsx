import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-6">About FingTaj</h1>
      
      <section className="space-y-6">
        <p className="text-lg text-slate-200">
          FingTaj provides private, high-speed statutory financial calculators for Indian salaried employees, independent professionals, and investors.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Engineering Mission: Zero Telemetry</h2>
          <p>
            Many digital calculators collect user salaries and loan parameters to build marketing profiles. FingTaj processes all mathematics strictly in local client memory. No financial input is ever transmitted over the network.
          </p>
        </div>

        <div className="border border-slate-800 bg-slate-900/60 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-2">Author & Technical Governance (E-E-A-T)</h2>
          <p className="text-slate-300">
            FingTaj is built and maintained by <strong>Ashutosh Jha</strong>, a Full-Stack Systems Engineer based in <strong>Chennai, Tamil Nadu, India</strong>.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-cyan-400">
            <span>Direct Email: support@fingtaj.com</span>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
            <span>•</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          </div>
        </div>
      </section>
    </div>
  );
}
