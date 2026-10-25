import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${iconSizes[size]} shrink-0 relative rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-sm overflow-hidden`}>
        <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
          <path d="M16 16H48V22H35V48H27V22H16V16Z" fill="#F8FAFC" />
          <path d="M20 44C26 44 32 38 46 20" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="46" cy="20" r="4" fill="#F59E0B" />
          <circle cx="20" cy="44" r="2.5" fill="#10B981" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className={`font-bold tracking-tight text-white ${textSizes[size]} leading-none`}>
          Fing<span className="text-emerald-400">Taj</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium mt-0.5">
            Statutory Calculators
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
