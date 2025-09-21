'use client';

import { useEffect } from 'react';
import { initPolyfills } from '@/lib/polyfills';

export default function MobilePolyfills() {
  useEffect(() => {
    // Initialize polyfills on client-side only
    initPolyfills();
  }, []);

  return null; // This component doesn't render anything
}