'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Item } from '@/types';
import { loadItems, saveItems, loadPrefs, savePrefs, setupStorageSync } from '@/lib/storage';
import { initialPrayerData } from '@/data/initialPrayers';
import { PrayerCardView } from '@/components/PrayerCardView';
import { Icon } from '@/components/ui/Icon';
import { WordChoiceGuide } from '@/components/WordChoiceGuide';

const DISPLAY_PREF_KEY = 'app:display-prefs:v1';
const DATA_VERSION_KEY = 'app:data-version';
const DATA_VERSION = 'curated-order-v7';

const LEGACY_ORDER = Array.from({ length: 57 }, (_, index) => String(index + 1));

const CURATED_ORDER: readonly string[] = [
  '1',
  '2',
  '3',
  '4',
  '23',
  '6',
  '5',
  '7',
  '8',
  '9',
  ...Array.from({ length: 77 }, (_, index) => String(index + 1)).filter(id => !['1', '2', '3', '4', '5', '6', '7', '8', '9', '23'].includes(id))
] as const;

const orderMap = new Map<string, number>();
LEGACY_ORDER.forEach((id, index) => orderMap.set(id, index));
CURATED_ORDER.forEach((id, index) => orderMap.set(id, index));

const legacyToNewId = new Map<string, string>();
Array.from({ length: 77 }, (_, index) => String(index + 1)).forEach(id => {
  legacyToNewId.set(id, id);
});

function sortItemsToCurated(items: Item[]): Item[] {
  if (items.length === 0) return items;

  const fallbackIndex = new Map<string, number>();
  items.forEach((item, idx) => fallbackIndex.set(item.id, idx));

  return [...items].sort((a, b) => {
    const indexA = orderMap.has(a.id)
      ? orderMap.get(a.id)!
      : Number.MAX_SAFE_INTEGER + (fallbackIndex.get(a.id) ?? 0);
    const indexB = orderMap.has(b.id)
      ? orderMap.get(b.id)!
      : Number.MAX_SAFE_INTEGER + (fallbackIndex.get(b.id) ?? 0);

    return indexA - indexB;
  });
}

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

function loadDisplayPrefs(): DisplayPreferences {
  if (typeof window === 'undefined') {
    return defaultDisplayPrefs;
  }

  try {
    const stored = window.localStorage.getItem(DISPLAY_PREF_KEY);
    if (!stored) return defaultDisplayPrefs;
    const parsed = JSON.parse(stored);
    return {
      ...defaultDisplayPrefs,
      ...parsed
    };
  } catch {
    return defaultDisplayPrefs;
  }
}

function saveDisplayPrefs(prefs: DisplayPreferences) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DISPLAY_PREF_KEY, JSON.stringify(prefs));
}

function normalizeInitialData(): Item[] {
  const timestamp = Date.now();

  const baseItems = initialPrayerData.map((raw, index) => {
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

  return sortItemsToCurated(baseItems);
}

function deriveCategories(items: Item[]): string[] {
  const unique = new Set<string>();
  items.forEach(item => {
    if (item.category) unique.add(item.category);
  });
  return ['Semua', ...Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'))];
}

function filterItems(items: Item[], searchTerm: string, category: string): Item[] {
  const term = searchTerm.trim().toLowerCase();

  return items.filter(item => {
    const matchesCategory = category === 'Semua' || item.category === category;

    if (!matchesCategory) return false;
    if (!term) return true;

    const haystack = [
      item.title,
      item.arabic,
      item.latin,
      item.translation_id,
      item.source,
      item.category,
      item.tags.join(' ')
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>(defaultDisplayPrefs);
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [prefsTheme, setPrefsTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showWordGuide, setShowWordGuide] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const rawStoredItems = loadItems();
    const storedItems = rawStoredItems.filter(item => !item.id?.startsWith('manual_'));
    if (storedItems.length !== rawStoredItems.length) {
      saveItems(storedItems);
    }
    const storedVersion = typeof window !== 'undefined'
      ? window.localStorage.getItem(DATA_VERSION_KEY)
      : null;

    if (storedItems.length === 0) {
      const seeded = normalizeInitialData();
      saveItems(seeded);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      }
      setItems(seeded);
    } else if (storedVersion !== DATA_VERSION) {
      const reordered = sortItemsToCurated(storedItems);
      const migrated = reordered.map(item => {
        const nextId = legacyToNewId.get(item.id);
        return nextId && nextId !== item.id ? { ...item, id: nextId } : item;
      });
      setItems(migrated);
      saveItems(migrated);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      }
    } else {
      setItems(storedItems);
    }

    const storedPrefs = loadPrefs();
    setArabicFontSize(storedPrefs.arabicFontSize ?? 28);
    setPrefsTheme(storedPrefs.theme ?? 'system');

    const dp = loadDisplayPrefs();
    setDisplayPrefs(dp);

    const cleanup = setupStorageSync(() => {
      setItems(loadItems());
    });

    return cleanup;
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    try {
      const root = document.documentElement;
      root.style.setProperty('--arabic-font-size', `${arabicFontSize} px`);

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
  }, [arabicFontSize, prefsTheme, isClient]);

  const categories = useMemo(() => deriveCategories(items), [items]);
  const filteredItems = useMemo(
    () => {
      const base = filterItems(items, searchTerm, activeCategory);
      if (!showOnlyFavorite) return base;
      return base.filter(item => item.favorite);
    },
    [items, searchTerm, activeCategory, showOnlyFavorite]
  );

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const currentIndex = prev.findIndex(item => item.id === id);
      if (currentIndex === -1) return prev;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      saveItems(updated);
      return updated;
    });
  };

  const handleResetOrder = () => {
    const seeded = normalizeInitialData();
    setItems(seeded);
    saveItems(seeded);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    }
  };

  const handleThemeCycle = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(prefsTheme);
    const nextTheme = order[(currentIndex + 1) % order.length];

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
      saveDisplayPrefs(updated);
      return updated;
    });
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                <Icon name="sparkles" size={16} />
                Koleksi Doa Autentik
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Dashboard Doa
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                Kumpulan doa pilihan dengan tampilan nyaman dibaca. Atur urutan sesuai kebutuhan,
                perbesar teks Arab, dan fokus pada doa-doa yang ingin diamalkan.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start lg:self-auto">
              <button
                onClick={handleThemeCycle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition"
              >
                <Icon name={prefsTheme === 'dark' ? 'moon' : prefsTheme === 'light' ? 'sun' : 'monitor'} size={16} />
                Mode: {prefsTheme === 'system' ? 'Sistem' : prefsTheme === 'light' ? 'Terang' : 'Gelap'}
              </button>
              <button
                onClick={handleResetOrder}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
              >
                <Icon name="refresh" size={16} />
                Reset Urutan
              </button>
              <button
                onClick={() => setShowWordGuide(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition"
              >
                <Icon name="message-circle" size={16} />
                Seni Berdoa
              </button>
            </div>
          </div>

          <WordChoiceGuide
            isOpen={showWordGuide}
            onClose={() => setShowWordGuide(false)}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="lg:col-span-2 relative">
              <span className="sr-only">Cari doa</span>
              <Icon
                name="search"
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari judul, teks Arab, latin, terjemahan, atau tag..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-700 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20 transition"
              />
            </label>
            <div className="h-14 flex items-center justify-between rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Ukuran Arab</span>
              <input
                type="range"
                min={22}
                max={40}
                value={arabicFontSize}
                onChange={(event) => handleFontSizeChange(Number(event.target.value))}
                className="w-40 accent-emerald-500"
              />
              <span className="text-sm text-slate-500 dark:text-slate-300 w-10 text-right">{arabicFontSize}px</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px - 4 py - 2 rounded - full text - sm font - medium transition ${isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300'
                    } `}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setShowOnlyFavorite(prev => !prev)}
              className={`inline - flex items - center gap - 2 px - 3 py - 2 rounded - xl border text - sm font - medium transition ${showOnlyFavorite
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30'
                : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 hover:text-amber-600'
                } `}
              aria-pressed={showOnlyFavorite}
            >
              <Icon
                name="star"
                size={16}
                className={showOnlyFavorite ? 'fill-current' : 'text-amber-400'}
              />
              {showOnlyFavorite ? 'Hanya favorit' : 'Tampilkan favorit saja'}
            </button>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={displayPrefs.showLatin}
                onChange={(event) => handleDisplayPrefsChange({ showLatin: event.target.checked })}
                className="accent-emerald-500"
              />
              Tampil transliterasi
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={displayPrefs.showTranslation}
                onChange={(event) => handleDisplayPrefsChange({ showTranslation: event.target.checked })}
                className="accent-emerald-500"
              />
              Tampil terjemahan
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={displayPrefs.showSource}
                onChange={(event) => handleDisplayPrefsChange({ showSource: event.target.checked })}
                className="accent-emerald-500"
              />
              Tampil sumber doa
            </label>
            <span className="ml-auto text-slate-500 dark:text-slate-400">
              {filteredItems.length} doa ditampilkan
            </span>
          </div>
        </header>

        <PrayerCardView
          items={filteredItems}
          searchTerm={searchTerm}
          showLatin={displayPrefs.showLatin}
          showTranslation={displayPrefs.showTranslation}
          showSource={displayPrefs.showSource}
          arabicFontSize={arabicFontSize}
          onMoveItem={handleReorder}
        />
      </div>
    </div>
  );
}
