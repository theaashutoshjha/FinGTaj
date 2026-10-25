import React, { useEffect, useRef } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
  style?: React.CSSProperties;
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
  style = {}
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

  return (
    <aside
      aria-label="Sponsored Content"
      className={`adsense-wrapper w-full max-w-4xl mx-auto overflow-hidden print-hide ${className}`}
      style={style}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full text-center"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3594420471814241"
        data-ad-slot={slotId}
        data-ad-format={format === 'in-article' ? 'fluid' : format}
        data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default AdSenseSlot;
