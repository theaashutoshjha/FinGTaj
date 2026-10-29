import React, { useState, useRef, useEffect } from 'react';
import { Currency } from '../types';
import { Zap, Target, ShieldCheck } from 'lucide-react';

interface InteractiveChartProps {
  currency: Currency;
  rateUSD: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ currency, rateUSD }) => {
  const [monthlySIP, setMonthlySIP] = useState<number>(15000);
  const [expectedReturn, setExpectedReturn] = useState<number>(13);
  const [years, setYears] = useState<number>(20);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Format money helper
  const formatMoney = (inr: number) => {
    if (currency === 'USD') {
      const usd = Math.round(inr * rateUSD);
      return '$' + usd.toLocaleString('en-US');
    }
    return '₹' + inr.toLocaleString('en-IN');
  };

  // Calculate Compounding Timeline
  const calculateData = () => {
    const r = expectedReturn / 100 / 12;
    const timeline = [];
    let totalInvested = 0;
    let corpus = 0;

    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      totalInvested = monthlySIP * months;
      corpus = monthlySIP * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      timeline.push({
        year: y,
        invested: Math.round(totalInvested),
        corpus: Math.round(corpus),
        gain: Math.round(corpus - totalInvested)
      });
    }
    return timeline;
  };

  const data = calculateData();
  const terminalData = data[data.length - 1] || { invested: 0, corpus: 0, gain: 0 };
  const displayPoint = hoverYear !== null ? (data[hoverYear - 1] || terminalData) : terminalData;

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI retina display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 30, bottom: 40, left: 20 };

    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    const maxVal = terminalData.corpus * 1.08;
    const minVal = 0;

    const getX = (index: number) => {
      return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (val: number) => {
      return height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
    };

    // Draw Subtle Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * (height - padding.top - padding.bottom);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // 1. Draw Invested Line (Linear)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    data.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.invested);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Corpus Area & Curve (Exponential Glow)
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.35)');
    gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.1)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    ctx.beginPath();
    data.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.corpus);
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = getX(i - 1);
        const prevY = getY(data[i - 1].corpus);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });

    // Close path for gradient fill
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = height - padding.bottom;
    ctx.lineTo(lastX, bottomY);
    ctx.lineTo(firstX, bottomY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Main Glowing Line
    ctx.beginPath();
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(0, 245, 255, 0.7)';
    ctx.shadowBlur = 14;

    data.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.corpus);
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = getX(i - 1);
        const prevY = getY(data[i - 1].corpus);
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Draw Active Hover Pin
    if (hoverYear !== null && hoverYear <= data.length) {
      const idx = hoverYear - 1;
      const hx = getX(idx);
      const hy = getY(data[idx].corpus);

      // Vertical Crosshair
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.moveTo(hx, padding.top);
      ctx.lineTo(hx, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pin Outer
      ctx.beginPath();
      ctx.arc(hx, hy, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
      ctx.fill();

      // Pin Inner
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }, [monthlySIP, expectedReturn, years, hoverYear, data, terminalData.corpus]);

  // Handle Mouse Hover on Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 20;
    const paddingRight = 30;
    const availableWidth = rect.width - paddingLeft - paddingRight;
    const relativeX = Math.max(0, Math.min(x - paddingLeft, availableWidth));
    const yearFraction = (relativeX / availableWidth) * (years - 1) + 1;
    setHoverYear(Math.round(yearFraction));
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-cyan">
              <Zap size={12} />
              Interactive Wealth Engine
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Live Mathematical Compounding Curve
            </span>
          </div>
          <h2 style={{ fontSize: '28px' }}>
            Wealth Projection: <span className="text-gradient">{formatMoney(displayPoint.corpus)}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Hover across the graph to inspect wealth milestones at any year mark.
          </p>
        </div>

        {/* Milestone Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gap: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Horizon</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }} className="text-mono">
              Year {displayPoint.year}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capital Outlay</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }} className="text-mono">
              {formatMoney(displayPoint.invested)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>Compound Gain</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-emerald)' }} className="text-mono">
              +{formatMoney(displayPoint.gain)}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Chart Area */}
      <div style={{ position: 'relative', width: '100%', height: '320px', marginBottom: '32px' }}>
        <canvas 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverYear(null)}
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        />
      </div>

      {/* Interactive Controls & Sliders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Monthly Investment Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Monthly Commitment:</span>
            <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{formatMoney(monthlySIP)} / mo</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="200000" 
            step="1000" 
            value={monthlySIP} 
            onChange={e => setMonthlySIP(Number(e.target.value))}
            className="slider-range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{formatMoney(1000)}</span>
            <span>{formatMoney(100000)}</span>
            <span>{formatMoney(200000)}</span>
          </div>
        </div>

        {/* Expected CAGR Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Expected CAGR Return:</span>
            <span className="text-mono" style={{ color: 'var(--accent-emerald)' }}>{expectedReturn}% p.a.</span>
          </div>
          <input 
            type="range" 
            min="6" 
            max="24" 
            step="0.5" 
            value={expectedReturn} 
            onChange={e => setExpectedReturn(Number(e.target.value))}
            className="slider-range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>6% (Debt/Gold)</span>
            <span>12% (Nifty Index)</span>
            <span>24% (Alpha)</span>
          </div>
        </div>

        {/* Time Horizon Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
            <span>Time Horizon:</span>
            <span className="text-mono" style={{ color: 'var(--accent-amber)' }}>{years} Years</span>
          </div>
          <input 
            type="range" 
            min="3" 
            max="35" 
            step="1" 
            value={years} 
            onChange={e => setYears(Number(e.target.value))}
            className="slider-range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>3 Yrs</span>
            <span>20 Yrs</span>
            <span>35 Yrs</span>
          </div>
        </div>
      </div>

      {/* Preset Strategy Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
        <button 
          className="btn btn-secondary" 
          onClick={() => { setMonthlySIP(10000); setExpectedReturn(12); setYears(25); }}
          style={{ padding: '6px 12px', fontSize: '11px' }}
        >
          <Target size={12} /> Index Compounding (₹10k @ 12%, 25y)
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => { setMonthlySIP(25000); setExpectedReturn(15); setYears(15); }}
          style={{ padding: '6px 12px', fontSize: '11px' }}
        >
          <Zap size={12} /> Aggressive Growth (₹25k @ 15%, 15y)
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => { setMonthlySIP(50000); setExpectedReturn(14); setYears(12); }}
          style={{ padding: '6px 12px', fontSize: '11px' }}
        >
          <ShieldCheck size={12} /> FIRE Acceleration (₹50k @ 14%, 12y)
        </button>
      </div>
    </div>
  );
};
