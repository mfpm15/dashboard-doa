'use client';

import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { showToast } from './ui/Toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showToastModal, setShowToastModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      showToast({
        message: 'Dashboard Doa berhasil diinstall!',
        type: 'success'
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        showToast({
          message: 'Menginstall aplikasi...',
          type: 'success'
        });
      } else {
        showToast({
          message: 'Install dibatalkan',
          type: 'info'
        });
      }

      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error during install:', error);
      showToast({
        message: 'Gagal menginstall aplikasi',
        type: 'error'
      });
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  // Don't show if user previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed === 'true') {
      setShowInstallButton(false);
    }
  }, []);

  if (!showInstallButton) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Icon name="download" className="w-6 h-6 text-primary-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Install Dashboard Doa
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Install aplikasi untuk akses offline dan pengalaman yang lebih baik
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-primary-600 text-white text-xs px-3 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="download" className="w-3 h-3" />
                  Install
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Nanti
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </>
  );
}