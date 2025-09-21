'use client';

import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Hide message after 5 seconds when back online
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        showOfflineMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className={`mx-auto max-w-md rounded-lg shadow-lg border p-3 ${
        isOnline
          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
      }`}>
        <div className="flex items-center gap-2">
          <Icon
            name={isOnline ? "globe" : "x"}
            className={`w-4 h-4 ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
          />

          <span className="text-sm font-medium">
            {isOnline ? 'Koneksi kembali normal' : 'Mode Offline'}
          </span>

          {!isOnline && (
            <div className="ml-auto">
              <div className="flex items-center gap-1 text-xs">
                <Icon name="download" className="w-3 h-3" />
                <span>Data tersimpan</span>
              </div>
            </div>
          )}
        </div>

        {!isOnline && (
          <p className="text-xs mt-1 opacity-90">
            Semua doa dapat diakses tanpa koneksi internet
          </p>
        )}
      </div>
    </div>
  );
}