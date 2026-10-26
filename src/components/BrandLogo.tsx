import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5 group">
      {/* Precision Geometric Monogram */}
      <div className={`${iconSizes[size]} shrink-0 relative rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] group-hover:border-emerald-500/60 transition-colors`}>
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <path d="M7 8H25V11H18V24H14V11H7V8Z" fill="#F8FAFC" />
          <path d="M10 22C14 22 18 18 24 10" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="10" r="2" fill="#F59E0B" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-black tracking-tight text-white ${textSizes[size]} leading-none flex items-center gap-0.5`}>
          <span>Fing</span>
          <span className="text-emerald-400">Taj</span>
          <span className="text-[10px] text-slate-500 font-mono font-medium ml-1.5 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
            IN
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mt-0.5">
            Statutory Financial Engine
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
