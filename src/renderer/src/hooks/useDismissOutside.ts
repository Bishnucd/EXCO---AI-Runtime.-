import { useEffect, useRef, RefObject } from 'react';

/**
 * Dismisses an active popup, menu, or popover whenever a pointer press (click/touch)
 * occurs anywhere outside its container, or when Escape is pressed.
 */
export function useDismissOutside(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  options?: { ignoreSelector?: string; closeOnEscape?: boolean }
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const ignoreSelector = options?.ignoreSelector ?? '[data-exco-infotip-portal="true"]';

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (containerRef.current && containerRef.current.contains(target)) return;
      if (ignoreSelector && target.closest(ignoreSelector)) return;
      onCloseRef.current();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((options?.closeOnEscape ?? true) && e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef, options?.ignoreSelector, options?.closeOnEscape]);
}
