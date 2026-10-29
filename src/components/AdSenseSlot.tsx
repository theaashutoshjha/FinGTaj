import React, { useEffect, useRef } from 'react';

export type AdFormat = 'auto' | 'horizontal' | 'leaderboard' | 'rectangle' | 'in-article' | 'sidebar';

interface AdSenseSlotProps {
  slotId?: string;
  format?: AdFormat;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotId = '9283748291',
  format = 'auto',
  className = '',
  style = {},
  label = 'Sponsored'
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || pushedRef.current) return;

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch {
      // safe fallback in dev or adblock
    }
  }, []);

  // Strict min-heights preventing Cumulative Layout Shift (CLS = 0)
  const getMinHeight = () => {
    switch (format) {
      case 'leaderboard':
        return 'min-h-[90px] sm:min-h-[100px]';
      case 'rectangle':
      case 'sidebar':
        return 'min-h-[250px] sm:min-h-[280px]';
      case 'in-article':
        return 'min-h-[160px] sm:min-h-[250px]';
      case 'horizontal':
        return 'min-h-[90px] sm:min-h-[100px]';
      default:
        return 'min-h-[90px]';
    }
  };

  const adFormatAttr = () => {
    if (format === 'in-article') return 'fluid';
    if (format === 'leaderboard' || format === 'horizontal') return 'horizontal';
    if (format === 'rectangle') return 'rectangle';
    return 'auto';
  };

  return (
    <aside
      aria-label="Sponsored Content"
      className={`adsense-wrapper w-full max-w-5xl mx-auto my-6 sm:my-8 overflow-hidden print-hide ${className}`}
      style={style}
    >
      <div className="rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md p-3 relative">
        {/* Subtle, policy-compliant sponsor disclosure */}
        <div className="flex items-center justify-between pb-2 px-1 text-[10px] uppercase font-semibold tracking-wider text-slate-500 border-b border-white/5 mb-2 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-slate-600 font-normal">Google AdSense Partner</span>
        </div>

        {/* Ad container with CLS barrier */}
        <div className={`flex items-center justify-center w-full ${getMinHeight()} overflow-hidden text-center`}>
          <ins
            ref={adRef}
            className="adsbygoogle block w-full text-center"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-3594420471814241"
            data-ad-slot={slotId}
            data-ad-format={adFormatAttr()}
            data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
};

export default AdSenseSlot;