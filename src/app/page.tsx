'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Moon, Sun, Monitor, Heart, X, RefreshCw, BookOpen, SlidersHorizontal, Bell, Sparkles } from 'lucide-react';
import { Item } from '@/types';
import { loadItems, saveItems, loadPrefs, savePrefs, setupStorageSync, flushPendingWrites } from '@/lib/storage';
import { initialPrayerData } from '@/data/initialPrayers';
import { useFuzzySearch } from '@/hooks/useFuzzySearch';
import PrayerCard from '@/components/PrayerCard';
import ReminderSettings from '@/components/ReminderSettings';
import LanguageSelector from '@/components/LanguageSelector';
import { useLocale } from '@/hooks/useLocale';
import { startReminderChecker, loadNotificationPrefs } from '@/lib/notifications';
import Link from 'next/link';

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
  showSource: true,
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
      updatedAt: updated,
    } as Item;
  });
}

function deriveCategories(items: Item[]): string[] {
  const unique = new Set<string>();
  items.forEach(item => { if (item.category) unique.add(item.category); });
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
  const [showReminder, setShowReminder] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedItems = loadItems();
    const storedVersion = typeof window !== 'undefined' ? window.localStorage.getItem(DATA_VERSION_KEY) : null;

    if (storedItems.length === 0 || storedVersion !== DATA_VERSION) {
      const seeded = normalizeInitialData();
      saveItems(seeded);
      if (typeof window !== 'undefined') window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
      setItems(seeded);
    } else {
      setItems(storedItems);
    }

    const storedPrefs = loadPrefs();
    setArabicFontSize(storedPrefs.arabicFontSize ?? 32);
    setPrefsTheme(storedPrefs.theme ?? 'system');

    const storedDisplayPrefs = localStorage.getItem(DISPLAY_PREF_KEY);
    if (storedDisplayPrefs) {
      try { setDisplayPrefs(JSON.parse(storedDisplayPrefs)); } catch {}
    }

    const cleanup = setupStorageSync(() => {
      setItems(loadItems());
      const dp = localStorage.getItem(DISPLAY_PREF_KEY);
      if (dp) { try { setDisplayPrefs(JSON.parse(dp)); } catch {} }
      const sp = loadPrefs();
      setArabicFontSize(sp.arabicFontSize ?? 32);
      setPrefsTheme(sp.theme ?? 'system');
    });

    const notifPrefs = loadNotificationPrefs();
    if (notifPrefs.enabled) startReminderChecker();

    const handleBeforeUnload = () => flushPendingWrites();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushPendingWrites();
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const root = document.documentElement;
      if (prefsTheme === 'dark') root.classList.add('dark');
      else if (prefsTheme === 'light') root.classList.remove('dark');
      else root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (error) {
      console.warn('Failed to apply theme:', error);
    }
  }, [prefsTheme, isClient]);

  const categories = useMemo(() => deriveCategories(items), [items]);
  const filteredItems = useFuzzySearch(items, searchTerm, activeCategory, showOnlyFavorite);

  const handleToggleFavorite = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item);
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
    if (typeof window !== 'undefined') window.localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
  };

  const handleThemeChange = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(prefsTheme) + 1) % themes.length];
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
  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => { if (item.category) counts[item.category] = (counts[item.category] || 0) + 1; });
    return counts;
  }, [items]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Memuat doa-doa...</p>
        </div>
      </div>
    );
  }

  const ThemeIcon = prefsTheme === 'light' ? Sun : prefsTheme === 'dark' ? Moon : Monitor;
  const themeLabel = prefsTheme === 'light' ? 'Terang' : prefsTheme === 'dark' ? 'Gelap' : 'Sistem';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white leading-none">Dashboard Doa</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{items.length} doa autentik</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <div className="hidden sm:block mr-1">
                <LanguageSelector locale={locale} onLocaleChange={setLocale} />
              </div>
              <button
                onClick={() => setShowReminder(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="Pengingat doa"
                title="Pengingat"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleThemeChange}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label={`Tema: ${themeLabel}`}
                title={`Tema: ${themeLabel}`}
              >
                <ThemeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="Pengaturan tampilan"
                title="Pengaturan"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">

        {/* Asmaul Husna Collection Banner */}
        <Link
          href="/koleksi"
          className="group block mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-5 text-white hover:shadow-xl transition-all duration-300 shadow-lg overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-200 mb-0.5">Koleksi Baru</p>
                <h3 className="font-bold text-base sm:text-lg">Doa Komprehensif 99 Asmaul Husna</h3>
                <p className="text-emerald-100 text-xs mt-0.5">13 bagian • 99 nama Allah • Dalil lengkap</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-white/80 group-hover:translate-x-1 transition-transform">
              <span className="text-xs font-medium">Buka</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari doa berdasarkan judul, teks Arab, Latin, atau terjemahan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category}
              {category !== 'Semua' && categoryCount[category] && (
                <span className={`ml-1.5 ${activeCategory === category ? 'text-emerald-200' : 'text-gray-400'}`}>
                  {categoryCount[category]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setShowOnlyFavorite(!showOnlyFavorite)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showOnlyFavorite
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorite ? 'fill-current' : ''}`} />
            {showOnlyFavorite ? 'Semua Doa' : `Favorit (${favoriteCount})`}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredItems.length}</span>
            {' '}dari{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{items.length}</span>
            {' '}doa
          </p>
        </div>

        {/* Prayer Cards */}
        <div className="space-y-4">
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
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Tidak ada doa ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
              Coba ubah kata kunci pencarian atau filter kategori.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('Semua'); setShowOnlyFavorite(false); }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>

      {/* Reminder Modal */}
      <ReminderSettings isOpen={showReminder} onClose={() => setShowReminder(false)} />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pengaturan Tampilan</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Arabic Font Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ukuran Teks Arab</label>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
                    {arabicFontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={48}
                  step={2}
                  value={arabicFontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>Kecil</span>
                  <span>Sedang</span>
                  <span>Besar</span>
                </div>
              </div>

              {/* Display Options */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Opsi Tampilan</p>
                <div className="space-y-2">
                  {[
                    { key: 'showLatin' as const, label: 'Tampilkan Cara Baca (Latin)', emoji: '📝' },
                    { key: 'showTranslation' as const, label: 'Tampilkan Terjemahan Indonesia', emoji: '🌐' },
                    { key: 'showSource' as const, label: 'Tampilkan Sumber Doa', emoji: '📖' },
                  ].map(({ key, label, emoji }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={displayPrefs[key]}
                        onChange={(e) => handleDisplayPrefsChange({ [key]: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{emoji} {label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language (mobile) */}
              <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 pt-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🌍 Bahasa</p>
                <LanguageSelector locale={locale} onLocaleChange={setLocale} />
              </div>

              {/* Reset */}
              <button
                onClick={() => { handleResetOrder(); setShowSettings(false); }}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Urutan Doa
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-5 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold text-sm shadow-sm"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
