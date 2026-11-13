'use client';

import { useEffect } from 'react';

/** Register one versioned worker on production HTTPS, avoiding stale navigation responses. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // Offline is optional; browser reading still works if SW registration fails.
    });
  }, []);
  return null;
}
