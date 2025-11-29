'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Moon, Sun, Monitor, Heart, X, RefreshCw, BookOpen, SlidersHorizontal } from 'lucide-react';
import { Item } from '@/types';
import { loadItems, saveItems, loadPrefs, savePrefs, setupStorageSync } from '@/lib/storage';
import { initialPrayerData } from '@/data/initialPrayers';
import { useFuzzySearch } from '@/hooks/useFuzzySearch';
import PrayerCard from '@/components/PrayerCard';

const DISPLAY_PREF_KEY = 'app:display-prefs:v1';
const DATA_VERSION_KEY = 'app:data-version';
const DATA_VERSION = 'proper-v1';

interface DisplayPreferences {
  showLatin: boolean;
  showTranslation: boolean;
  showSource: boolean;
}

const defaultDisplayPrefs: DisplayPreferences = {
  showLatin: true,
  showTranslation: true,
  showSource: true
};

function normalizeInitialData(): Item[] {
  const timestamp = Date.now();
  return initialPrayerData.map((raw, index) => {
    const created = raw.createdAt ?? timestamp - index * 1000;
    const updated = raw.updatedAt ?? created;

    return {
      id: raw.id ?? `prayer_${index + 1}`,
      title: raw.title ?? 'Doa Tanpa Judul',
      arabic: raw.arabic ?? '',
      latin: raw.latin ?? '',
      translation_id: raw.translation_id ?? '',
      kaidah: raw.kaidah,
      category: raw.category ?? 'Lainnya',
      tags: raw.tags ?? [],
      source: raw.source ?? '',
      favorite: Boolean(raw.favorite),
      audio: raw.audio ?? [],
      createdAt: created,
      updatedAt: updated
    } as Item;
  });
}

function deriveCategories(items: Item[]): string[] {
  const unique = new Set<string>();
  items.forEach(item => {
    if (item.category) unique.add(item.category);
  });
  return ['Semua', ...Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'))];
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>(defaultDisplayPrefs);
  const [arabicFontSize, setArabicFontSize] = useState(32);
  const [prefsTheme, setPrefsTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedItems = loadItems();
    const storedVersion = typeof window !== 'undefined'
      ? window.localStorage.getItem(DATA_VERSION_KEY)
      : null;

    if (storedItems.length === 0 || storedVersion !== DATA_VERSION) {
      const seeded = normalizeInitialData();
      saveItems(seeded);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      }
      setItems(seeded);
    } else {
      setItems(storedItems);
    }

    const storedPrefs = loadPrefs();
    setArabicFontSize(storedPrefs.arabicFontSize ?? 32);
    setPrefsTheme(storedPrefs.theme ?? 'system');

    const storedDisplayPrefs = localStorage.getItem(DISPLAY_PREF_KEY);
    if (storedDisplayPrefs) {
      try {
        setDisplayPrefs(JSON.parse(storedDisplayPrefs));
      } catch {}
    }

    const cleanup = setupStorageSync(() => {
      setItems(loadItems());
    });

    return cleanup;
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    try {
      const root = document.documentElement;
      if (prefsTheme === 'dark') {
        root.classList.add('dark');
      } else if (prefsTheme === 'light') {
        root.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      }
    } catch (error) {
      console.warn('Failed to apply visual preferences:', error);
    }
  }, [prefsTheme, isClient]);

  const categories = useMemo(() => deriveCategories(items), [items]);
  const filteredItems = useFuzzySearch(items, searchTerm, activeCategory, showOnlyFavorite);

  const handleToggleFavorite = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      );
      saveItems(updated);
      return updated;
    });
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedCardId(prev => prev === id ? null : id);
  }, []);

  const handleResetOrder = () => {
    const seeded = normalizeInitialData();
    setItems(seeded);
    saveItems(seeded);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    }
  };

  const handleThemeChange = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(prefsTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setPrefsTheme(nextTheme);
    savePrefs({ theme: nextTheme });
  };

  const handleFontSizeChange = (value: number) => {
    setArabicFontSize(value);
    savePrefs({ arabicFontSize: value });
  };

  const handleDisplayPrefsChange = (patch: Partial<DisplayPreferences>) => {
    setDisplayPrefs(prev => {
      const updated = { ...prev, ...patch };
      localStorage.setItem(DISPLAY_PREF_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteCount = items.filter(item => item.favorite).length;

  // Count items per category
  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500 font-medium">Memuat doa-doa...</p>
        </div>
      </div>
    );
  }

  const ThemeIcon = prefsTheme === 'light' ? Sun : prefsTheme === 'dark' ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dashboard Doa
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  21 Doa Pilihan & Ma&apos;tsur
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleThemeChange}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Change theme"
              >
                <ThemeIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari doa berdasarkan judul, teks Arab, Latin, atau terjemahan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 text-base bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category}
                {category !== 'Semua' && categoryCount[category] && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {categoryCount[category]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowOnlyFavorite(!showOnlyFavorite)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                showOnlyFavorite
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${showOnlyFavorite ? 'fill-current' : ''}`} />
              {showOnlyFavorite ? 'Tampilkan Semua' : `Favorit (${favoriteCount})`}
            </button>

            <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>Menampilkan</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredItems.length}</span>
              <span>dari</span>
              <span className="font-bold text-gray-900 dark:text-white">{items.length}</span>
              <span>doa</span>
            </div>
          </div>
        </div>

        {/* Prayer Cards List */}
        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <PrayerCard
              key={item.id}
              item={item}
              index={index + 1}
              searchTerm={searchTerm}
              showLatin={displayPrefs.showLatin}
              showTranslation={displayPrefs.showTranslation}
              showSource={displayPrefs.showSource}
              arabicFontSize={arabicFontSize}
              onToggleFavorite={handleToggleFavorite}
              isExpanded={expandedCardId === item.id}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tidak ada doa ditemukan
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau filter kategori untuk menemukan doa yang Anda cari.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('Semua');
                setShowOnlyFavorite(false);
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Pengaturan Tampilan
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Arabic Font Size */}
              <div>
                <label className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <span>Ukuran Teks Arab</span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
                    {arabicFontSize}px
                  </span>
                </label>
                <input
                  type="range"
                  min={24}
                  max={48}
                  value={arabicFontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span>Kecil</span>
                  <span>Sedang</span>
                  <span>Besar</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Opsi Tampilan
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={displayPrefs.showLatin}
                      onChange={(e) => handleDisplayPrefsChange({ showLatin: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tampilkan Cara Baca (Latin)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={displayPrefs.showTranslation}
                      onChange={(e) => handleDisplayPrefsChange({ showTranslation: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tampilkan Terjemahan Indonesia
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={displayPrefs.showSource}
                      onChange={(e) => handleDisplayPrefsChange({ showSource: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tampilkan Sumber Doa
                    </span>
                  </label>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetOrder}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Urutan Doa
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold shadow-lg"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}