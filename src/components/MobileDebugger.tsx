'use client';

import { useEffect, useState } from 'react';

export default function MobileDebugger() {
  const [errors, setErrors] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      const errorMsg = `Uncaught Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
      console.error('Global error caught:', errorMsg);
      setErrors(prev => [...prev, errorMsg].slice(-10)); // Keep last 10 errors
    };

    // Promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
      console.error('Global promise rejection:', errorMsg);
      setErrors(prev => [...prev, errorMsg].slice(-10));
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Show debug panel on mobile if there are errors
    const checkForMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && errors.length > 0) {
        setShowDebug(true);
      }
    };

    checkForMobile();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [errors]);

  // Only show in development or if there are errors
  if (process.env.NODE_ENV === 'production' && errors.length === 0) {
    return null;
  }

  if (!showDebug && errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 text-white p-2 rounded-full shadow-lg mb-2"
      >
        🐛 {errors.length}
      </button>

      {/* Debug panel */}
      {showDebug && (
        <div className="bg-black text-white p-4 rounded-lg shadow-xl max-w-sm max-h-60 overflow-auto text-xs">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Mobile Debug</h4>
            <button
              onClick={() => {
                setErrors([]);
                setShowDebug(false);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>

          <div className="space-y-1">
            <div><strong>UA:</strong> {navigator.userAgent.slice(0, 50)}...</div>
            <div><strong>Screen:</strong> {window.screen.width}x{window.screen.height}</div>
            <div><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</div>
            <div><strong>Touch:</strong> {'ontouchstart' in window ? 'Yes' : 'No'}</div>
            <div><strong>LocalStorage:</strong> {typeof localStorage !== 'undefined' ? 'Available' : 'Not available'}</div>
          </div>

          {errors.length > 0 && (
            <div className="mt-3">
              <strong>Recent Errors:</strong>
              <div className="space-y-1 mt-1">
                {errors.map((error, index) => (
                  <div key={index} className="text-red-300 break-words">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-400">
            Debug panel - Tap outside to close
          </div>
        </div>
      )}
    </div>
  );
}