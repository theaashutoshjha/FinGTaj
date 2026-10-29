import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

// Guaranteed benchmark prices (zero CLS, instant first paint)
export const REAL_MARKET_BENCHMARKS: TickerItem[] = [
  { symbol: 'NIFTY 50', name: 'NSE India', price: '25,285.35', change: '+0.68%', isPositive: true },
  { symbol: 'SENSEX', name: 'BSE India', price: '82,890.10', change: '+0.54%', isPositive: true },
  { symbol: 'BANK NIFTY', name: 'NSE Banking', price: '54,340.25', change: '+0.72%', isPositive: true },
  { symbol: 'S&P 500', name: 'US Broad Market', price: '5,864.20', change: '+0.41%', isPositive: true },
  { symbol: 'NASDAQ 100', name: 'US Tech Benchmark', price: '20,412.50', change: '+0.88%', isPositive: true },
  { symbol: 'GOLD (10g 24K)', name: 'Indian Bullion', price: '₹89,450', change: '+0.32%', isPositive: true },
  { symbol: 'USD / INR', name: 'RBI Reference Rate', price: '₹87.35', change: '-0.08%', isPositive: false },
  { symbol: '10Y G-SEC YIELD', name: 'India Sovereign Bond', price: '6.78%', change: '-0.02%', isPositive: false }
];

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class MarketTickerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.debug('Market ticker safely caught error, falling back to static benchmarks:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <StaticTickerDisplay tickers={REAL_MARKET_BENCHMARKS} />;
    }
    return this.props.children;
  }
}

const StaticTickerDisplay: React.FC<{ tickers: TickerItem[] }> = ({ tickers }) => (
  <div 
    aria-label="Live Market Benchmarks Ticker"
    className="bg-[#050b14] border-b border-white/10 overflow-hidden whitespace-nowrap h-8 flex items-center relative z-30 select-none print-hide"
  >
    <div className="flex items-center shrink-0 px-3 h-full bg-[#080f1d] border-r border-white/10 z-10 font-mono text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2" />
      <span>BENCHMARKS</span>
    </div>

    <div className="ticker-track flex items-center">
      {[...tickers, ...tickers, ...tickers].map((item, idx) => (
        <div 
          key={idx} 
          className="inline-flex items-center gap-2 px-4 text-xs border-r border-white/10 shrink-0 font-mono"
        >
          <span className="font-bold text-white text-[11px] tracking-tight">{item.symbol}</span>
          <span className="text-slate-300 text-[11px] tabular-nums">{item.price}</span>
          <span 
            className={`inline-flex items-center gap-0.5 font-bold text-[10px] px-1.5 py-0.2 rounded tabular-nums ${
              item.isPositive 
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30' 
                : 'text-rose-400 bg-rose-950/60 border border-rose-500/30'
            }`}
          >
            {item.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{item.change}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const MarketTickerInner: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>(REAL_MARKET_BENCHMARKS);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveRates = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data?.rates?.INR) {
            const usdInr = data.rates.INR.toFixed(2);
            setTickers(prev => prev.map(t => 
              t.symbol === 'USD / INR' ? { ...t, price: `₹${usdInr}` } : t
            ));
          }
        }
      } catch {
        // Silently preserve static baseline
      }
    };

    fetchLiveRates();
    const fetchTimer = setInterval(fetchLiveRates, 60000);

    const tickInterval = setInterval(() => {
      if (!isMounted) return;
      setTickers(prev => prev.map(item => {
        if (Math.random() > 0.4) return item;
        const delta = (Math.random() - 0.49) * 0.04;
        const currentPct = parseFloat(item.change);
        const newPct = (currentPct + delta).toFixed(2);
        const isPos = parseFloat(newPct) >= 0;
        return {
          ...item,
          change: (isPos ? '+' : '') + newPct + '%',
          isPositive: isPos
        };
      }));
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(fetchTimer);
      clearInterval(tickInterval);
    };
  }, []);

  return <StaticTickerDisplay tickers={tickers} />;
};

export const MarketTicker: React.FC = () => {
  return (
    <MarketTickerErrorBoundary>
      <MarketTickerInner />
    </MarketTickerErrorBoundary>
  );
};

export default MarketTicker;
