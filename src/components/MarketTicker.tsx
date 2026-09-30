import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const INITIAL_TICKERS: TickerItem[] = [
  { symbol: 'NIFTY 50', name: 'India Benchmark', price: '25,384.20', change: '+0.84%', isPositive: true },
  { symbol: 'S&P 500', name: 'US Broad Market', price: '5,842.15', change: '+0.52%', isPositive: true },
  { symbol: 'BTC / USD', name: 'Bitcoin', price: '$65,420.00', change: '+2.14%', isPositive: true },
  { symbol: 'GOLD (10g)', name: '24K Spot', price: '₹76,450', change: '-0.18%', isPositive: false },
  { symbol: 'US 10Y YIELD', name: 'Treasury Benchmark', price: '3.892%', change: '-0.04%', isPositive: false },
  { symbol: 'NASDAQ 100', name: 'Tech Index', price: '20,120.40', change: '+1.05%', isPositive: true },
  { symbol: 'USD / INR', name: 'Forex Spot', price: '83.74', change: '-0.02%', isPositive: false }
];

export const MarketTicker: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  // Micro-fluctuations to give a true live market heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(item => {
        if (Math.random() > 0.4) return item; // update randomly
        const delta = (Math.random() - 0.48) * 0.05;
        const currentPct = parseFloat(item.change);
        const newPct = (currentPct + delta).toFixed(2);
        return {
          ...item,
          change: (parseFloat(newPct) >= 0 ? '+' : '') + newPct + '%',
          isPositive: parseFloat(newPct) >= 0
        };
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(5, 14, 25, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '8px 0',
      position: 'relative',
      zIndex: 90
    }}>
      <div className="ticker-track">
        {[...tickers, ...tickers].map((item, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 24px',
              fontSize: '12px',
              borderRight: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.symbol}</span>
            <span className="text-mono" style={{ color: 'var(--text-secondary)' }}>{item.price}</span>
            <span 
              className="text-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 700,
                color: item.isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                background: item.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.change}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: inline-flex;
          animation: tickerScroll 35s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
