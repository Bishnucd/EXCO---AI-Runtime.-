import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { cn } from '@shared/utils';

interface InfoTipProps {
  title?: string;
  text: string;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

interface PopoverCoords {
  top: number;
  left: number;
  ready: boolean;
}

const POPOVER_WIDTH = 224;
const VIEWPORT_MARGIN = 10;

/**
 * Compact hoverable & clickable `i` info button.
 * Renders a small popover via React Portal at document.body so it stays above
 * all drawers, dropdowns, and scroll containers.
 */
export const InfoTip: React.FC<InfoTipProps> = ({
  title,
  text,
  className,
  align = 'right',
}) => {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;
  const [coords, setCoords] = useState<PopoverCoords>({ top: 0, left: 0, ready: false });
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const popHeight = popoverRef.current?.offsetHeight || 110;
    const popWidth = popoverRef.current?.offsetWidth || POPOVER_WIDTH;

    let left: number;
    if (align === 'left') {
      left = rect.left;
    } else if (align === 'center') {
      left = rect.left + rect.width / 2 - popWidth / 2;
    } else {
      left = rect.right - popWidth;
    }
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - popWidth - VIEWPORT_MARGIN));

    // Prefer opening above the icon; flip below if near the top of the viewport
    let top = rect.top - popHeight - 8;
    if (top < VIEWPORT_MARGIN) {
      top = rect.bottom + 8;
    }
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - popHeight - VIEWPORT_MARGIN));

    setCoords({ top, left, ready: true });
  };

  useLayoutEffect(() => {
    if (!open) {
      setCoords(prev => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(raf);
  }, [open, align, text, title]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setPinned(false);
      setHovered(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false);
        setHovered(false);
      }
    };
    const handleReposition = () => updatePosition();

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  if (!text) return null;

  return (
    <span
      ref={rootRef}
      className={cn('relative inline-flex items-center flex-shrink-0', className)}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
      onMouseEnter={() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        setHovered(true);
      }}
      onMouseLeave={() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHovered(false), 120);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setPinned(prev => !prev);
        }}
        className={cn(
          'w-4 h-4 rounded-full inline-flex items-center justify-center border transition-colors flex-shrink-0',
          open
            ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-accent-ink))]'
            : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-foreground-muted))]'
        )}
        aria-label={title ? `Info: ${title}` : 'More info'}
        aria-expanded={open}
      >
        <Info className="w-2.5 h-2.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            data-exco-infotip-portal="true"
            role="dialog"
            aria-label={title || 'Information'}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${POPOVER_WIDTH}px`,
              zIndex: 99999,
              visibility: coords.ready ? 'visible' : 'hidden',
            }}
            className="p-2.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-foreground))] shadow-2xl ring-1 ring-black/15 text-[11px] leading-snug font-normal whitespace-normal animate-scale-in"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
          >
            {title && <p className="font-semibold text-[rgb(var(--color-foreground))] mb-0.5">{title}</p>}
            <p className="text-[rgb(var(--color-foreground-muted))]">{text}</p>
          </div>,
          document.body
        )}
    </span>
  );
};
