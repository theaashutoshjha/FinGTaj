import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      {/* Precision Geometric Monogram Badge */}
      <div className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#0e1726] to-[#121c2e] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]`}>
        <svg viewBox="0 0 36 36" className="w-full h-full p-1" fill="none">
          <circle cx="18" cy="18" r="17" fill="none" />
          {/* Cyan T-Symbol */}
          <path d="M9 11H27V15H20V27H16V15H9V11Z" fill="#00f5ff" />
          {/* Emerald Growth Curve */}
          <path d="M12 25C16 26 22 24 26 16" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className={`font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
        <span className="text-white font-black">Fing</span>
        <span className="text-[#00f5ff] font-black drop-shadow-[0_0_12px_rgba(0,245,255,0.35)]">Taj</span>
      </div>
    </div>
  );
};

export default BrandLogo;
