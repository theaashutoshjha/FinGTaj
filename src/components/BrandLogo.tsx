import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showBadge = false }) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      {/* Luxury Geometric Prism Emblem */}
      <div 
        className={`${iconDimensions[size]} shrink-0 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_25px_rgba(99,102,241,0.55)]`}
      >
        <div className="w-full h-full rounded-[10px] bg-[#090d16] flex items-center justify-center p-1.5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-400/20" />
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full relative z-10">
            {/* Architectural Diamond / Growth Vault */}
            <path 
              d="M12 2L21 7V17L12 22L3 17V7L12 2Z" 
              stroke="url(#logoGrad1)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Precision Multiplication Core */}
            <path 
              d="M12 7V17M7 12H17" 
              stroke="url(#logoGrad2)" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="logoGrad1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="logoGrad2" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-2">
        <span className={`font-black tracking-tight leading-none ${textStyles[size]}`}>
          <span className="text-white">Fing</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
            Taj
          </span>
        </span>

        {showBadge && (
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            PRO
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
