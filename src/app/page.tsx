'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Item, Prefs, QueryOptions } from '@/types';
import { loadItems, loadPrefs, savePrefs, query, setupStorageSync } from '@/lib/storage';
import { importLegacyData } from '@/lib/importLegacyData';
import { AppShell } from '@/components/AppShell';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { CommandPalette } from '@/components/CommandPalette';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { ToastContainer } from '@/components/ui/Toast';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { NotificationSettings } from '@/components/NotificationSettings';
import { ReadingMode } from '@/components/ReadingMode';
import { FocusMode } from '@/components/FocusMode';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDashboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { initialPrayerData } from '@/data/initialPrayers';

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [prefs, setPrefs] = useState<Prefs>({
    theme: 'system',
    pageSize: 20,
    sortBy: 'updatedAt',
    sortDir: 'desc',
    visibleColumns: ['title', 'category', 'tags', 'updatedAt', 'favorite', 'actions'],
    arabicFontSize: 28,
    arabicLineHeight: 1.9
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [selectedItemForAI, setSelectedItemForAI] = useState<Item | null>(null);

  // New UI/UX states
  const [isReadingModeOpen, setIsReadingModeOpen] = useState(false);
  const [selectedItemForReading, setSelectedItemForReading] = useState<Item | null>(null);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);

  // Load data on mount
  useEffect(() => {
    const storedItems = loadItems();
    const storedPrefs = loadPrefs();

    // Initialize with legacy data if empty
    if (storedItems.length === 0) {
      try {
        importLegacyData();
        const importedItems = loadItems(); // Reload after import

        // If still empty, add initial data from the comprehensive collection
        if (importedItems.length === 0) {
          console.log('Adding comprehensive prayer data collection...');
          initialPrayerData.forEach(itemData => {
            const { addItem } = require('@/lib/storage');
            addItem(itemData);
          });
        }

        setItems(loadItems()); // Final reload
      } catch (error) {
        console.error('Failed to import legacy data:', error);
        // Fallback to comprehensive prayer data collection
        initialPrayerData.forEach(itemData => {
          const { addItem } = require('@/lib/storage');
          addItem(itemData);
        });
        setItems(loadItems());
      }
    } else {
      setItems(storedItems);
    }

    setPrefs(storedPrefs);

    // Setup cross-tab sync
    const cleanup = setupStorageSync(() => {
      setItems(loadItems());
      setPrefs(loadPrefs());
    });

    return cleanup;
  }, []);

  // Update CSS variables when prefs change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--arabic-font-size', `${prefs.arabicFontSize}px`);
    root.style.setProperty('--arabic-line-height', `${prefs.arabicLineHeight}`);

    // Update theme
    if (prefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (prefs.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [prefs]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsFormModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Query options
  const queryOptions: QueryOptions = useMemo(() => ({
    term: searchTerm,
    category: selectedCategory,
    tags: selectedTags,
    favorite: showFavorites ? true : null,
    sortBy: prefs.sortBy,
    sortDir: prefs.sortDir
  }), [searchTerm, selectedCategory, selectedTags, showFavorites, prefs.sortBy, prefs.sortDir]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return query(items, queryOptions);
  }, [items, queryOptions]);

  // Categories and tags for filters
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return ['Semua', ...cats.sort()];
  }, [items]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [items]);

  const handlePrefsChange = (newPrefs: Partial<Prefs>) => {
    const updated = { ...prefs, ...newPrefs };
    setPrefs(updated);
    savePrefs(updated);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleOpenAIAssist = (item?: Item) => {
    setSelectedItemForAI(item || null);
    setIsAIAssistOpen(true);
  };

  // New UI/UX handlers
  const handleOpenReadingMode = (item: Item) => {
    setSelectedItemForReading(item);
    setIsReadingModeOpen(true);
  };

  const handleToggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(prefs.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    handlePrefsChange({ theme: nextTheme });
  };

  const handleSearchFocus = () => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  // Keyboard shortcuts
  useDashboardShortcuts({
    onNewItem: handleNewItem,
    onToggleCommandPalette: () => setIsCommandPaletteOpen(!isCommandPaletteOpen),
    onToggleTheme: handleToggleTheme,
    onToggleAI: () => setIsAIAssistOpen(!isAIAssistOpen),
    onSearch: handleSearchFocus,
    onToggleFavorites: () => setShowFavorites(!showFavorites),
    onExport: () => {
      // TODO: Implement export
      console.log('Export triggered');
    },
    onImport: () => {
      // TODO: Implement import
      console.log('Import triggered');
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AppShell
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        showFavorites={showFavorites}
        onShowFavoritesChange={setShowFavorites}
        categories={categories}
        tags={allTags}
        prefs={prefs}
        onPrefsChange={handlePrefsChange}
        onNewItem={handleNewItem}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleFocusMode={() => setIsFocusModeActive(!isFocusModeActive)}
      >
        <DataTable
          items={filteredItems}
          prefs={prefs}
          onEdit={handleEditItem}
          onPrefsChange={handlePrefsChange}
          onItemsChange={() => setItems(loadItems())}
          onOpenAIAssist={handleOpenAIAssist}
          onOpenReadingMode={handleOpenReadingMode}
        />
      </AppShell>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        item={editingItem}
        categories={categories.filter(c => c !== 'Semua')}
        onSave={() => {
          setItems(loadItems());
          setIsFormModalOpen(false);
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={items}
        onSelectItem={(item) => {
          setEditingItem(item);
          setIsFormModalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onNewItem={handleNewItem}
        onImportData={() => {
          // TODO: Implement import functionality
          setIsCommandPaletteOpen(false);
        }}
        onExportData={() => {
          // TODO: Implement export functionality
          setIsCommandPaletteOpen(false);
        }}
        onOpenSettings={() => {
          // TODO: Implement settings functionality
          setIsCommandPaletteOpen(false);
        }}
        onItemsChange={() => setItems(loadItems())}
      />

      <AIAssistPanel
        isOpen={isAIAssistOpen}
        onClose={() => setIsAIAssistOpen(false)}
        selectedItem={selectedItemForAI}
        items={items}
        onItemUpdate={(item) => {
          setItems(loadItems());
        }}
      />

      <ToastContainer />
      <InstallPrompt />
      <OfflineIndicator />

      {/* New UI/UX Components */}
      <ReadingMode
        item={selectedItemForReading}
        isOpen={isReadingModeOpen}
        onClose={() => setIsReadingModeOpen(false)}
      />

      <FocusMode
        isActive={isFocusModeActive}
        onToggle={() => setIsFocusModeActive(!isFocusModeActive)}
      />
    </div>
  );
}