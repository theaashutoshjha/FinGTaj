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
  label = 'Advertisement'
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
      // Dev, adblocker, or sandboxed preview mode
    }
  }, []);

  // Set predictable minimum heights to guarantee zero CLS (Cumulative Layout Shift)
  const getMinHeight = () => {
    switch (format) {
      case 'leaderboard':
        return 'min-h-[90px]';
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
      className={`adsense-wrapper w-full max-w-5xl mx-auto my-6 sm:my-8 px-2 overflow-hidden print-hide ${className}`}
      style={style}
    >
      <div className="rounded-xl border border-white/5 bg-[#0a101d]/60 backdrop-blur-xs p-2 sm:p-3 relative">
        {/* Policy-mandated clear Advertisement disclosure */}
        <div className="flex items-center justify-between pb-1.5 px-2 text-[10px] uppercase font-mono tracking-widest text-slate-500 border-b border-white/5 mb-2 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-500/60" />
            <span>{label}</span>
          </span>
          <span className="text-[9px] text-slate-600">Google AdSense · Verified Publisher</span>
        </div>

        {/* Ad Container with CLS protection */}
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
