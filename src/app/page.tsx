'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Item, Prefs, QueryOptions } from '@/types';
import { loadItems, loadPrefs, savePrefs, query, setupStorageSync } from '@/lib/storage';
import { AppShell } from '@/components/AppShell';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { CommandPalette } from '@/components/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

// Initial prayer data from the original file
const initialData: Partial<Item>[] = [
  {
    title: "Istighfar & Doa Keselamatan (Pembuka Zikir)",
    category: "Zikir Setelah Shalat",
    arabic: "أَسْتَغْفِرُ اللَّهَ (٣x)\n\nاللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
    latin: "Astaghfirullāh (3x). Allāhumma anta as-salām, wa minka as-salām, tabārakta yā dzal-jalāli wal-ikrām.",
    translation_id: "\"Aku memohon ampun kepada Allah\" (3x). \"Ya Allah, Engkau Mahasejahtera, dan dari-Mu segala kesejahteraan. Mahaberkah Engkau, wahai Pemilik keagungan dan kemuliaan.\"",
    source: "HR Muslim.",
    tags: ["istighfar", "salam", "zikir", "setelah-shalat"],
    favorite: true
  },
  {
    title: "Tasbih, Tahmid, Takbir (33x) & Tahlil",
    category: "Zikir Setelah Shalat",
    arabic: "سُبْحَانَ اللَّهِ (٣٣x) اَلْحَمْدُ لِلَّهِ (٣٣x) اللَّهُ أَكْبَرُ (٣٣x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Subḥānallāh (33x), al-ḥamdu lillāh (33x), Allāhu akbar (33x). Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syay'in qadīr (1x).",
    translation_id: "Mahasuci Allah (33x), segala puji bagi Allah (33x), Allah Mahabesar (33x). Tiada sesembahan selain Allah Yang Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.",
    source: "HR Muslim.",
    tags: ["tasbih", "tahmid", "takbir", "tahlil", "zikir"],
    favorite: false
  }
];

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

  // Load data on mount
  useEffect(() => {
    const storedItems = loadItems();
    const storedPrefs = loadPrefs();

    // Initialize with sample data if empty
    if (storedItems.length === 0) {
      // We'll populate this later when the storage functions are available
      setItems([]);
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
      >
        <DataTable
          items={filteredItems}
          prefs={prefs}
          onEdit={handleEditItem}
          onPrefsChange={handlePrefsChange}
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
      />

      <ToastContainer />
    </div>
  );
}