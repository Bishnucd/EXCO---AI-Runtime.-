/**
 * EXCO Visual Overlay Component
 * Renders customizable SVG grain noise and color filter tint overlays per segment or globally
 */

import React from 'react';

interface VisualOverlayProps {
  grain?: number;
  tintColor?: string;
  tintOpacity?: number;
  bgImage?: string;
  bgImageOpacity?: number;
  bgImageBlur?: number;
  bgImageFit?: 'cover' | 'contain' | 'tile' | 'center';
  className?: string;
}

const GRAIN_SVG_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export function VisualOverlay({
  grain = 0,
  tintColor = '',
  tintOpacity = 0,
  bgImage = '',
  bgImageOpacity = 0,
  bgImageBlur = 0,
  bgImageFit = 'cover',
  className = '',
}: VisualOverlayProps) {
  const hasImage = Boolean(bgImage) && (bgImageOpacity ?? 0) > 0.005;
  const hasGrain = grain > 0.005;
  const hasTint = Boolean(tintColor) && tintOpacity > 0.005;

  if (!hasImage && !hasGrain && !hasTint) return null;

  const isCssGradient = bgImage.startsWith('linear-gradient') || bgImage.startsWith('radial-gradient');
  const fitStyles: React.CSSProperties =
    bgImageFit === 'tile'
      ? { backgroundRepeat: 'repeat', backgroundSize: '320px auto', backgroundPosition: 'top left' }
      : bgImageFit === 'contain'
      ? { backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }
      : bgImageFit === 'center'
      ? { backgroundRepeat: 'no-repeat', backgroundSize: 'auto', backgroundPosition: 'center' }
      : { backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {hasImage && (
        isCssGradient || bgImageFit === 'tile' ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isCssGradient ? bgImage : `url("${bgImage}")`,
              opacity: Math.min(Math.max(bgImageOpacity ?? 0, 0), 1),
              filter: bgImageBlur > 0.005 ? `blur(${Math.round(bgImageBlur * 20)}px)` : undefined,
              transform: bgImageBlur > 0.005 ? 'scale(1.06)' : undefined,
              imageRendering: 'high-quality' as any,
              ...fitStyles,
            }}
          />
        ) : (
          <img
            src={bgImage}
            alt=""
            decoding="sync"
            draggable={false}
            className={`absolute inset-0 w-full h-full pointer-events-none select-none ${
              bgImageFit === 'contain' ? 'object-contain' : bgImageFit === 'center' ? 'object-none' : 'object-cover'
            }`}
            style={{
              opacity: Math.min(Math.max(bgImageOpacity ?? 0, 0), 1),
              filter: bgImageBlur > 0.005 ? `blur(${Math.round(bgImageBlur * 20)}px)` : undefined,
              transform: bgImageBlur > 0.005 ? 'scale(1.06)' : undefined,
              imageRendering: 'high-quality' as any,
            }}
          />
        )
      )}
      {hasTint && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: tintColor,
            opacity: Math.min(Math.max(tintOpacity, 0), 1) * 0.75,
            mixBlendMode: 'soft-light',
          }}
        />
      )}
      {hasGrain && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: GRAIN_SVG_DATA_URI,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            opacity: Math.min(Math.max(grain, 0), 1) * 0.42,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}
