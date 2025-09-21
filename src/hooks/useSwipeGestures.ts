'use client';

import { useEffect, useRef } from 'react';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false
}: SwipeGestureConfig) {
  const startTouch = useRef<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      };

      if (preventScroll) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if this is a swipe gesture
      if (Math.max(absDeltaX, absDeltaY) < threshold) {
        startTouch.current = null;
        return;
      }

      // Determine swipe direction
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }

      startTouch.current = null;
    };

    // Add passive listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventScroll]);

  return elementRef;
}

// Hook for detecting pull-to-refresh gesture
export function usePullToRefresh(onRefresh: () => void, threshold = 100) {
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isPulling = useRef<boolean>(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY > 0) return;

      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || window.scrollY > 0) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        // Prevent default scroll behavior while pulling
        e.preventDefault();

        // Add visual feedback here if needed
        const pullDistance = Math.min(deltaY, threshold * 1.5);
        element.style.transform = `translateY(${pullDistance * 0.5}px)`;
        element.style.opacity = `${1 - pullDistance / (threshold * 2)}`;
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current) return;

      const deltaY = currentY.current - startY.current;

      // Reset visual state
      element.style.transform = '';
      element.style.opacity = '';

      if (deltaY > threshold) {
        onRefresh();
      }

      isPulling.current = false;
      startY.current = 0;
      currentY.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold]);

  return elementRef;
}