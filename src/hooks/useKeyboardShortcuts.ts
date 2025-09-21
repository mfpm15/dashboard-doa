'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  disabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (shortcut.disabled) continue;

      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for global dashboard shortcuts
export function useDashboardShortcuts({
  onNewItem,
  onToggleCommandPalette,
  onToggleTheme,
  onToggleAI,
  onSearch,
  onToggleFavorites,
  onExport,
  onImport
}: {
  onNewItem?: () => void;
  onToggleCommandPalette?: () => void;
  onToggleTheme?: () => void;
  onToggleAI?: () => void;
  onSearch?: () => void;
  onToggleFavorites?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    // Navigation & Search
    {
      key: 'k',
      ctrlKey: true,
      action: () => onToggleCommandPalette?.(),
      description: 'Buka Command Palette'
    },
    {
      key: '/',
      action: () => onSearch?.(),
      description: 'Fokus ke pencarian'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => onSearch?.(),
      description: 'Fokus ke pencarian'
    },

    // Actions
    {
      key: 'n',
      ctrlKey: true,
      action: () => onNewItem?.(),
      description: 'Tambah doa baru'
    },
    {
      key: 's',
      ctrlKey: true,
      shiftKey: true,
      action: () => onToggleFavorites?.(),
      description: 'Toggle favorit'
    },

    // UI Controls
    {
      key: 't',
      ctrlKey: true,
      action: () => onToggleTheme?.(),
      description: 'Toggle tema'
    },
    {
      key: 'a',
      ctrlKey: true,
      shiftKey: true,
      action: () => onToggleAI?.(),
      description: 'Toggle AI Assistant'
    },

    // Data Management
    {
      key: 'e',
      ctrlKey: true,
      action: () => onExport?.(),
      description: 'Export data'
    },
    {
      key: 'i',
      ctrlKey: true,
      action: () => onImport?.(),
      description: 'Import data'
    },

    // Help
    {
      key: '?',
      action: () => showShortcutsHelp(),
      description: 'Tampilkan bantuan keyboard'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

// Hook for reading mode shortcuts
export function useReadingModeShortcuts({
  onClose,
  onToggleFullscreen,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onToggleFont
}: {
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  onToggleFont?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => onClose?.(),
      description: 'Tutup reading mode'
    },
    {
      key: 'f',
      action: () => onToggleFullscreen?.(),
      description: 'Toggle fullscreen'
    },
    {
      key: '+',
      action: () => onIncreaseFontSize?.(),
      description: 'Perbesar font'
    },
    {
      key: '=',
      ctrlKey: true,
      action: () => onIncreaseFontSize?.(),
      description: 'Perbesar font'
    },
    {
      key: '-',
      action: () => onDecreaseFontSize?.(),
      description: 'Perkecil font'
    },
    {
      key: '-',
      ctrlKey: true,
      action: () => onDecreaseFontSize?.(),
      description: 'Perkecil font'
    },
    {
      key: 'g',
      action: () => onToggleFont?.(),
      description: 'Toggle serif font'
    }
  ];

  useKeyboardShortcuts(shortcuts);
}

// Function to show shortcuts help modal
function showShortcutsHelp() {
  // Create and show shortcuts help modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onclick="this.closest('.fixed').remove()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Command Palette</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Pencarian</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">/</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Doa Baru</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+N</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Toggle Tema</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+T</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">AI Assistant</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+A</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Export Data</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+E</kbd>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-300">Bantuan</span>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Auto close on Escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}