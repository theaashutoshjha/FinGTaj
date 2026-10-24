import React, { useEffect, useRef, useState } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
  style?: React.CSSProperties;
  testMode?: boolean;
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
  testMode = false
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Only execute client-side
    if (typeof window === 'undefined') return;

    try {
      // Trigger AdSense ad rendering
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      console.debug('AdSense unit standby/waiting for activation:', e);
      setAdError(true);
    }
  }, []);

  const getMinHeight = () => {
    switch (format) {
      case 'horizontal':
        return '90px';
      case 'rectangle':
        return '250px';
      case 'in-article':
        return '120px';
      default:
        return '100px';
    }
  };

  return (
    <div 
      ref={adRef}
      className={`adsense-wrapper ${className}`}
      style={{
        margin: '28px auto',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style
      }}
    >
      {/* Google AdSense Mandatory Policy Label (prevents accidental/deceptive clicks) */}
      <div 
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          marginBottom: '6px',
          userSelect: 'none'
        }}
      >
        Advertisement
      </div>

      {/* Ad Container */}
      <div 
        style={{
          width: '100%',
          minHeight: getMinHeight(),
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '8px'
        }}
      >
        {/* Actual Google AdSense Tag */}
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%',
            textAlign: 'center'
          }}
          data-ad-client="ca-pub-3594420471814241"
          data-ad-slot={slotId}
          data-ad-format={format === 'in-article' ? 'fluid' : format}
          data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
          data-full-width-responsive="true"
        />

        {/* Fallback / Verification Area visible during review or before live fill */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            pointerEvents: 'none',
            opacity: 0.85
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '11.5px', fontWeight: 600 }}>
            <span>✦</span>
            <span>Google AdSense Verified Ad Unit</span>
          </div>
          <div style={{ fontSize: '10.5px' }}>
            ID: ca-pub-3594420471814241 • Slot: {slotId}
          </div>
        </div>
      </div>
    </div>
  );
};
