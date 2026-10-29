import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Precision Geometric Monogram Badge */}
      <div 
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#0c1626] to-[#122038] border border-cyan-500/40 shadow-[0_0_18px_rgba(6,182,212,0.3)] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_24px_rgba(0,245,255,0.5)] group-hover:scale-105`}
      >
        <div className="absolute inset-0 bg-radial-ambient opacity-50" />
        <svg viewBox="0 0 36 36" className="w-full h-full p-1.5 relative z-10" fill="none">
          <circle cx="18" cy="18" r="16" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 2" />
          {/* Cyan T-Geometric Symbol */}
          <path d="M8 9H28V13.5H20.5V27H15.5V13.5H8V9Z" fill="url(#cyanGrad)" />
          {/* Emerald Growth Trendline */}
          <path d="M10 24.5C14 26 21 24 26 15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="15" r="2.2" fill="#34d399" />
          <defs>
            <linearGradient id="cyanGrad" x1="8" y1="9" x2="28" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00f5ff" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none ${textSizes[size]} flex items-center`}>
          <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Fing</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">Taj</span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
            Statutory Financial Engine
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
