// Mobile device polyfills and compatibility fixes

export function initPolyfills() {
  if (typeof window === 'undefined') return;

  // Intersection Observer polyfill for older mobile browsers
  if (!('IntersectionObserver' in window)) {
    console.log('Loading IntersectionObserver polyfill...');
    // Simple fallback for old browsers
    (window as any).IntersectionObserver = class {
      private callback: any;
      constructor(callback: any) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // ResizeObserver polyfill
  if (!('ResizeObserver' in window)) {
    console.log('Loading ResizeObserver polyfill...');
    (window as any).ResizeObserver = class {
      private callback: any;
      constructor(callback: any) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // Web Audio API polyfill for mobile Safari
  if (typeof AudioContext === 'undefined' && typeof (window as any).webkitAudioContext !== 'undefined') {
    (window as any).AudioContext = (window as any).webkitAudioContext;
  }

  // Fix for mobile touch events
  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
  }

  // Performance.mark polyfill for older browsers
  if (!('mark' in window.performance)) {
    (window.performance as any).mark = function(name: string) {
      // Fallback implementation
    };
  }

  if (!('measure' in window.performance)) {
    (window.performance as any).measure = function(name: string, start?: string, end?: string) {
      // Fallback implementation
    };
  }

  // Fix for localStorage in private/incognito mode
  try {
    const testKey = '__test_localStorage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
  } catch (e) {
    console.warn('localStorage not available, using memory storage');

    // Create memory-based storage fallback
    const memoryStorage: { [key: string]: string } = {};

    (window as any).localStorage = {
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
      },
      getItem: (key: string) => {
        return memoryStorage[key] || null;
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
      },
      clear: () => {
        Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
      },
      get length() {
        return Object.keys(memoryStorage).length;
      },
      key: (index: number) => {
        return Object.keys(memoryStorage)[index] || null;
      }
    };
  }

  // Fix for requestAnimationFrame
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Fix viewport issues on mobile
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }

  // Prevent double-tap zoom on iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Fix for iOS Safari address bar height changes
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  console.log('Mobile polyfills initialized');
}