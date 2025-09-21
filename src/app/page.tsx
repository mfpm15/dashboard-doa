'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Item, Prefs, QueryOptions } from '@/types';
import { loadItems, loadPrefs, savePrefs, query, setupStorageSync } from '@/lib/storage';
import { importLegacyData } from '@/lib/importLegacyData';
import { AppShell } from '@/components/AppShell';
import { PrayerCardView } from '@/components/PrayerCardView';
import { FormModal } from '@/components/FormModal';
import { EnhancedCommandPalette } from '@/components/EnhancedCommandPalette';
import { StreamingAIChat } from '@/components/ai/StreamingAIChat';
import { MasterAudioPlayer } from '@/components/audio/MasterAudioPlayer';
import { ToastContainer } from '@/components/ui/Toast';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { NotificationSettings } from '@/components/NotificationSettings';
import { ReadingMode } from '@/components/ReadingMode';
import { FocusMode } from '@/components/FocusMode';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportImportModal } from '@/components/ExportImportModal';
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
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Enhanced features states
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<any>(null);
  const [showMasterAudioPlayer, setShowMasterAudioPlayer] = useState(false);
  const [audioPlayerItem, setAudioPlayerItem] = useState<Item | null>(null);

  // Load data on mount
  useEffect(() => {
    // Check if we need to force reload (for development)
    const forceReload = typeof window !== 'undefined' && window.location.search.includes('reset=true');

    if (forceReload) {
      console.log('Force reload detected, clearing storage...');
      localStorage.removeItem('app:items:v1');
      localStorage.removeItem('app:prefs:v1');
      localStorage.removeItem('app:trash:v1');
      localStorage.removeItem('app:draft:v1');
    }

    const storedItems = loadItems();
    const storedPrefs = loadPrefs();

    console.log(`Found ${storedItems.length} stored items`);

    // TEMPORARY: Direct set items for testing
    console.log('Setting items directly from initial prayer data for testing...');
    console.log(`Initial prayer data contains ${initialPrayerData.length} items`);

    // Convert partial items to full items
    const fullItems: Item[] = initialPrayerData.map((item, index) => ({
      id: item.id || `item_${index + 1}`,
      title: item.title || 'Untitled',
      arabic: item.arabic,
      latin: item.latin,
      translation_id: item.translation_id,
      category: item.category || 'Lainnya',
      tags: item.tags || [],
      source: item.source,
      favorite: item.favorite || false,
      createdAt: Date.now() - (index * 1000), // Stagger creation times
      updatedAt: Date.now() - (index * 1000)
    }));

    console.log(`Converted to ${fullItems.length} full items`);
    setItems(fullItems);

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

  // Enhanced audio handlers
  const handleOpenAudioPlayer = (item: Item, track?: any) => {
    setAudioPlayerItem(item);
    setSelectedAudioTrack(track);
    setShowMasterAudioPlayer(true);
  };

  const handleCloseAudioPlayer = () => {
    setShowMasterAudioPlayer(false);
    setAudioPlayerItem(null);
    setSelectedAudioTrack(null);
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
      setIsExportImportOpen(true);
    },
    onImport: () => {
      setIsExportImportOpen(true);
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
        <PrayerCardView
          items={filteredItems}
          prefs={prefs}
          onEdit={handleEditItem}
          onItemsChange={() => setItems(loadItems())}
          onOpenAIAssist={handleOpenAIAssist}
          onOpenReadingMode={handleOpenReadingMode}
          onOpenAudioPlayer={handleOpenAudioPlayer}
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

      <EnhancedCommandPalette
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
          setIsExportImportOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onExportData={() => {
          setIsExportImportOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onOpenSettings={() => {
          // TODO: Implement settings functionality
          setIsCommandPaletteOpen(false);
        }}
        onItemsChange={() => setItems(loadItems())}
        onOpenAI={() => {
          setIsAIAssistOpen(true);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* AI Chat Modal */}
      {isAIAssistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[80vh] mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <StreamingAIChat
              item={selectedItemForAI}
              onItemUpdate={(item) => {
                setItems(loadItems());
              }}
              onItemsChange={() => setItems(loadItems())}
              className="h-full"
            />
            <button
              onClick={() => setIsAIAssistOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Master Audio Player Modal */}
      {showMasterAudioPlayer && audioPlayerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-5xl mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Audio Player - {audioPlayerItem.title}
              </h3>
              <button
                onClick={handleCloseAudioPlayer}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MasterAudioPlayer
                item={audioPlayerItem}
                selectedTrack={selectedAudioTrack}
                onItemUpdate={(item) => {
                  setItems(loadItems());
                  setAudioPlayerItem(item);
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

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
        items={filteredItems}
        selectedItem={selectedItemForReading}
        onItemSelect={(item) => setSelectedItemForReading(item)}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        items={items}
        onImportComplete={() => setItems(loadItems())}
      />
    </div>
  );
}