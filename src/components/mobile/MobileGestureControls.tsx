'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Item } from '@/types';

interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress' | 'doubletap';
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  velocity?: number;
  scale?: number;
  clientX?: number;
  clientY?: number;
  target?: Element;
}

interface MobileGestureControlsProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number, centerX: number, centerY: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number, target: Element) => void;
  onTap?: (x: number, y: number, target: Element) => void;
  disabled?: boolean;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

interface TouchData {
  identifier: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

export function MobileGestureControls({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onDoubleTap,
  onLongPress,
  onTap,
  disabled = false,
  swipeThreshold = 50,
  pinchThreshold = 0.1,
  longPressDelay = 500,
  doubleTapDelay = 300
}: MobileGestureControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touches, setTouches] = useState<Map<number, TouchData>>(new Map());
  const [lastTapTime, setLastTapTime] = useState(0);
  const [lastTapPosition, setLastTapPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);

  // Calculate distance between two touches
  const getDistance = useCallback((touch1: TouchData, touch2: TouchData): number => {
    const dx = touch1.currentX - touch2.currentX;
    const dy = touch1.currentY - touch2.currentY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate center point between two touches
  const getCenter = useCallback((touch1: TouchData, touch2: TouchData) => {
    return {
      x: (touch1.currentX + touch2.currentX) / 2,
      y: (touch1.currentY + touch2.currentY) / 2
    };
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled) return;

    event.preventDefault();

    const newTouches = new Map(touches);

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchData: TouchData = {
        identifier: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: Date.now()
      };
      newTouches.set(touch.identifier, touchData);
    }

    setTouches(newTouches);

    // Handle single touch for long press
    if (newTouches.size === 1 && !isLongPressing) {
      const touchData = Array.from(newTouches.values())[0];

      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress?.(touchData.currentX, touchData.currentY, event.target as Element);
      }, longPressDelay);
    }

    // Handle pinch gesture setup
    if (newTouches.size === 2) {
      const touchArray = Array.from(newTouches.values());
      const distance = getDistance(touchArray[0], touchArray[1]);
      setInitialPinchDistance(distance);
      setCurrentScale(1);

      // Clear long press timer when second finger is added
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  }, [disabled, touches, isLongPressing, longPressDelay, onLongPress, getDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled || touches.size === 0) return;

    event.preventDefault();

    const newTouches = new Map(touches);

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchData = newTouches.get(touch.identifier);

      if (touchData) {
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
      }
    }

    setTouches(newTouches);

    // Handle pinch zoom
    if (newTouches.size === 2 && onPinchZoom) {
      const touchArray = Array.from(newTouches.values());
      const currentDistance = getDistance(touchArray[0], touchArray[1]);

      if (initialPinchDistance > 0) {
        const scale = currentDistance / initialPinchDistance;
        const center = getCenter(touchArray[0], touchArray[1]);

        if (Math.abs(scale - currentScale) > pinchThreshold) {
          setCurrentScale(scale);
          onPinchZoom(scale, center.x, center.y);
        }
      }
    }

    // Cancel long press if finger moves too much
    if (newTouches.size === 1 && longPressTimer.current) {
      const touchData = Array.from(newTouches.values())[0];
      const deltaX = Math.abs(touchData.currentX - touchData.startX);
      const deltaY = Math.abs(touchData.currentY - touchData.startY);

      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  }, [disabled, touches, initialPinchDistance, currentScale, pinchThreshold, onPinchZoom, getDistance, getCenter]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled) return;

    event.preventDefault();

    const newTouches = new Map(touches);
    const releasedTouches: TouchData[] = [];

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchData = newTouches.get(touch.identifier);

      if (touchData) {
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
        releasedTouches.push(touchData);
        newTouches.delete(touch.identifier);
      }
    }

    setTouches(newTouches);

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Reset long press state when all fingers are lifted
    if (newTouches.size === 0) {
      setIsLongPressing(false);
    }

    // Handle single touch gestures
    if (releasedTouches.length === 1 && !isLongPressing) {
      const touchData = releasedTouches[0];
      const deltaX = touchData.currentX - touchData.startX;
      const deltaY = touchData.currentY - touchData.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - touchData.startTime;
      const velocity = distance / duration;

      // Handle swipe gestures
      if (distance > swipeThreshold && velocity > 0.1) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY) {
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
      } else if (distance < 10 && duration < 300) {
        // Handle tap gestures
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime;
        const distanceFromLastTap = Math.sqrt(
          Math.pow(touchData.currentX - lastTapPosition.x, 2) +
          Math.pow(touchData.currentY - lastTapPosition.y, 2)
        );

        if (timeSinceLastTap < doubleTapDelay && distanceFromLastTap < 50) {
          // Double tap
          onDoubleTap?.(touchData.currentX, touchData.currentY);
          setLastTapTime(0); // Reset to prevent triple tap
        } else {
          // Single tap
          onTap?.(touchData.currentX, touchData.currentY, event.target as Element);
          setLastTapTime(now);
          setLastTapPosition({ x: touchData.currentX, y: touchData.currentY });
        }
      }
    }

    // Reset pinch state when touches end
    if (newTouches.size < 2) {
      setInitialPinchDistance(0);
      setCurrentScale(1);
    }
  }, [
    disabled, touches, isLongPressing, swipeThreshold, doubleTapDelay,
    lastTapTime, lastTapPosition, onSwipeLeft, onSwipeRight, onSwipeUp,
    onSwipeDown, onDoubleTap, onTap
  ]);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((event: Event) => {
    if (disabled) return;
    event.preventDefault();
  }, [disabled]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);
    container.addEventListener('touchcancel', handleTouchEnd, options);
    container.addEventListener('contextmenu', handleContextMenu, options);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleContextMenu]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="touch-manipulation"
      style={{
        touchAction: disabled ? 'auto' : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {children}
    </div>
  );
}

// Hook for using gesture controls in components
export function useGestureControls(
  elementRef: React.RefObject<HTMLElement>,
  options: Partial<MobileGestureControlsProps> = {}
) {
  const [gestureState, setGestureState] = useState({
    isGesturing: false,
    gestureType: null as GestureEvent['type'] | null,
    scale: 1,
    translation: { x: 0, y: 0 }
  });

  const gestureHandlers = {
    onSwipeLeft: useCallback(() => {
      setGestureState(prev => ({ ...prev, gestureType: 'swipe' }));
      options.onSwipeLeft?.();
    }, [options.onSwipeLeft]),

    onSwipeRight: useCallback(() => {
      setGestureState(prev => ({ ...prev, gestureType: 'swipe' }));
      options.onSwipeRight?.();
    }, [options.onSwipeRight]),

    onSwipeUp: useCallback(() => {
      setGestureState(prev => ({ ...prev, gestureType: 'swipe' }));
      options.onSwipeUp?.();
    }, [options.onSwipeUp]),

    onSwipeDown: useCallback(() => {
      setGestureState(prev => ({ ...prev, gestureType: 'swipe' }));
      options.onSwipeDown?.();
    }, [options.onSwipeDown]),

    onPinchZoom: useCallback((scale: number, centerX: number, centerY: number) => {
      setGestureState(prev => ({ ...prev, gestureType: 'pinch', scale }));
      options.onPinchZoom?.(scale, centerX, centerY);
    }, [options.onPinchZoom]),

    onDoubleTap: useCallback((x: number, y: number) => {
      setGestureState(prev => ({ ...prev, gestureType: 'doubletap' }));
      options.onDoubleTap?.(x, y);
    }, [options.onDoubleTap]),

    onLongPress: useCallback((x: number, y: number, target: Element) => {
      setGestureState(prev => ({ ...prev, gestureType: 'longpress' }));
      options.onLongPress?.(x, y, target);
    }, [options.onLongPress]),

    onTap: useCallback((x: number, y: number, target: Element) => {
      setGestureState(prev => ({ ...prev, gestureType: 'tap' }));
      options.onTap?.(x, y, target);
    }, [options.onTap])
  };

  return {
    gestureState,
    gestureHandlers,
    resetGestureState: useCallback(() => {
      setGestureState({
        isGesturing: false,
        gestureType: null,
        scale: 1,
        translation: { x: 0, y: 0 }
      });
    }, [])
  };
}

// Specialized hook for prayer card gestures
export function usePrayerCardGestures(
  item: Item,
  onMarkFavorite?: (item: Item) => void,
  onOpenDetails?: (item: Item) => void,
  onShare?: (item: Item) => void,
  onPlayAudio?: (item: Item) => void
) {
  return useGestureControls(React.createRef(), {
    onSwipeLeft: () => onMarkFavorite?.(item),
    onSwipeRight: () => onShare?.(item),
    onDoubleTap: () => onOpenDetails?.(item),
    onLongPress: () => onPlayAudio?.(item)
  });
}

// Performance optimized component for lists
export const MobileOptimizedList = React.memo(function MobileOptimizedList({
  children,
  onPullToRefresh,
  onReachEnd,
  ...gestureProps
}: MobileGestureControlsProps & {
  onPullToRefresh?: () => void;
  onReachEnd?: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const refreshThreshold = 80;

  const handleSwipeDown = useCallback(() => {
    if (!isRefreshing && onPullToRefresh) {
      setIsRefreshing(true);
      onPullToRefresh();

      // Reset after 2 seconds (you would typically wait for actual refresh to complete)
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 2000);
    }
  }, [isRefreshing, onPullToRefresh]);

  const handleSwipeUp = useCallback(() => {
    onReachEnd?.();
  }, [onReachEnd]);

  return (
    <MobileGestureControls
      {...gestureProps}
      onSwipeDown={handleSwipeDown}
      onSwipeUp={handleSwipeUp}
    >
      {isRefreshing && (
        <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
          <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-blue-600 dark:text-blue-400 text-sm">Refreshing...</span>
        </div>
      )}
      {children}
    </MobileGestureControls>
  );
});

// Accessibility improvements for gesture controls
export function GestureInstructions() {
  return (
    <div className="sr-only" aria-live="polite">
      <p>Gesture controls available:</p>
      <ul>
        <li>Swipe left: Mark as favorite</li>
        <li>Swipe right: Share prayer</li>
        <li>Double tap: Open details</li>
        <li>Long press: Play audio</li>
        <li>Pinch: Zoom text</li>
        <li>Pull down: Refresh content</li>
      </ul>
    </div>
  );
}