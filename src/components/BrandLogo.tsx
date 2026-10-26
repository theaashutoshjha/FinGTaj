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
    <div className="flex items-center gap-2.5 group">
      {/* Dark Circular Badge with Teal T (matches screenshot exactly) */}
      <div className={`${iconSizes[size]} shrink-0 rounded-full bg-[#0d1b2a] shadow-xs flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 36 36" className="w-full h-full p-1" fill="none">
          <circle cx="18" cy="18" r="17" fill="#0d1b2a" />
          <path d="M10 12H26V16H20V26H16V16H10V12Z" fill="#00b4d8" />
          <path d="M13 24C16 25 21 24 25 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text: Fing (Dark Slate) + Taj (Teal) */}
      <div className={`font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
        <span className="text-slate-900 font-black">Fing</span>
        <span className="text-[#00b4d8] font-black">Taj</span>
      </div>
    </div>
  );
};

export default BrandLogo;
