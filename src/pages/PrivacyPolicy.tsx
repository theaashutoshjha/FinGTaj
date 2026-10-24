import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-6">Last Updated: October 2026</p>
      
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Zero-Telemetry Client-Side Processing</h2>
          <p>
            FingTaj (<a href="https://www.fingtaj.com" className="text-cyan-400 underline">https://www.fingtaj.com</a>) is built with a zero-telemetry architecture. All calculations—including salaries, deductions, interest rates, and loan numbers—are evaluated solely within your device browser memory via JavaScript. No financial inputs are transmitted, logged, or stored on remote web servers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Google AdSense & Third-Party Advertising Cookies</h2>
          <p>
            We partner with Google AdSense to serve advertisements. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and other sites across the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your browsing patterns.
          </p>
          <p className="mt-2">
            You may opt out of personalized advertising at any time by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">AboutAds.info</a> or <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Google Ads Settings</a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. Local Storage</h2>
          <p>
            This site uses browser LocalStorage strictly for saving local interface preferences. No sensitive financial information or tracking identifiers are written to or read from LocalStorage.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy, contact us directly at <a href="mailto:support@fingtaj.com" className="text-cyan-400">support@fingtaj.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
