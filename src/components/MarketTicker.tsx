import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export interface MarketBenchmark {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export const BENCHMARKS_DATA: MarketBenchmark[] = [
  { symbol: 'NIFTY 50', name: 'NSE India', price: '25,285.35', change: '+0.68%', isPositive: true },
  { symbol: 'SENSEX', name: 'BSE India', price: '82,890.10', change: '+0.54%', isPositive: true },
  { symbol: 'BANK NIFTY', name: 'NSE Banking', price: '54,340.25', change: '+0.72%', isPositive: true },
  { symbol: 'S&P 500', name: 'US Broad', price: '5,864.20', change: '+0.41%', isPositive: true },
  { symbol: 'NASDAQ 100', name: 'US Tech', price: '20,412.50', change: '+0.88%', isPositive: true },
  { symbol: 'GOLD (10g)', name: '24 Karat', price: '₹89,450', change: '+0.32%', isPositive: true },
  { symbol: 'USD/INR', name: 'RBI Reference', price: '₹87.35', change: '-0.08%', isPositive: false },
  { symbol: '10Y G-SEC', name: 'Sovereign Bond', price: '6.78%', change: '-0.02%', isPositive: false }
];

export const MarketTicker: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark[]>(BENCHMARKS_DATA);

  useEffect(() => {
    let isMounted = true;

    // Fetch live USD/INR exchange rate
    const updateFx = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data?.rates?.INR) {
            const inrRate = data.rates.INR.toFixed(2);
            setBenchmarks(prev => prev.map(item => 
              item.symbol === 'USD/INR' ? { ...item, price: `₹${inrRate}` } : item
            ));
          }
        }
      } catch {
        // preserve baseline safely
      }
    };

    updateFx();
    const interval = setInterval(updateFx, 120000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      aria-label="Live Market Benchmarks"
      className="bg-slate-950/80 border-b border-white/5 h-9 flex items-center overflow-hidden select-none relative z-30 backdrop-blur-md print-hide"
    >
      {/* Sleek Leading Tag */}
      <div className="flex items-center gap-2 px-4 h-full bg-slate-900/90 border-r border-white/5 shrink-0 z-10 text-[11px] font-semibold text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400 font-mono uppercase text-[10px] tracking-wider">Market Benchmarks</span>
        <span className="sm:hidden text-xs">Live</span>
      </div>

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center">
        {[...benchmarks, ...benchmarks, ...benchmarks].map((item, idx) => (
          <div 
            key={idx} 
            className="inline-flex items-center gap-2 px-5 text-xs border-r border-white/5 shrink-0"
          >
            <span className="font-semibold text-slate-200 text-xs">{item.symbol}</span>
            <span className="font-tabular text-slate-400 text-xs">{item.price}</span>
            <span 
              className={`inline-flex items-center gap-0.5 text-[11px] font-medium font-tabular px-1.5 py-0.5 rounded-md ${
                item.isPositive 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {item.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{item.change}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
