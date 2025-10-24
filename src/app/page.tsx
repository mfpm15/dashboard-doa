'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Item } from '@/types';
import { loadItems, saveItems, loadPrefs, savePrefs, setupStorageSync } from '@/lib/storage';
import { initialPrayerData } from '@/data/initialPrayers';
import { PrayerCardView } from '@/components/PrayerCardView';
import { Icon } from '@/components/ui/Icon';
import { StreamingAIChat } from '@/components/ai/StreamingAIChat';

const DISPLAY_PREF_KEY = 'app:display-prefs:v1';
const DATA_VERSION_KEY = 'app:data-version';
const DATA_VERSION = 'curated-order-v3';

const LEGACY_ORDER = Array.from({ length: 57 }, (_, index) => String(index + 1));

const CURATED_ORDER: readonly string[] = [
  'manual_taawudz',
  '1',
  '2',
  '3',
  '4',
  '7',
  '6',
  'manual_ismul_azam',
  'manual_doa_jami',
  ...Array.from({ length: 57 }, (_, index) => String(index + 1)).filter(id => !['1', '2', '3', '4', '6', '7'].includes(id))
] as const;

const orderMap = new Map<string, number>();
LEGACY_ORDER.forEach((id, index) => orderMap.set(id, index));
CURATED_ORDER.forEach((id, index) => orderMap.set(id, index));

const legacyToNewId = new Map<string, string>();
LEGACY_ORDER.forEach((legacyId, index) => {
  legacyToNewId.set(legacyId, CURATED_ORDER[index] ?? String(index + 1));
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

function isSameOrder(a: Item[], b: Item[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) return false;
  }
  return true;
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

  const extractByTitle = (title: string): Item | null => {
    const index = baseItems.findIndex(item => item.title === title);
    if (index === -1) {
      return null;
    }
    return baseItems.splice(index, 1)[0];
  };

  const manualItems: Item[] = [
    {
      id: 'manual_taawudz',
      title: "Ta'awudz (Memohon Perlindungan)",
      category: 'Pembukaan & Penutup Doa',
      kaidah: "Bacaan pembuka sebelum dzikir dan doa agar terjaga dari godaan setan.",
      arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      latin: "A'ūdzu billāhis-samī'il-'alīm minas-syaitānir-rajīm.",
      translation_id: 'Aku berlindung kepada Allah Yang Maha Mendengar lagi Maha Mengetahui dari setan yang terkutuk.',
      source: 'QS An-Nahl: 98; HR Abu Dawud.',
      tags: ["taawudz", "perlindungan", "pembuka"],
      favorite: false,
      audio: [],
      createdAt: timestamp + 1,
      updatedAt: timestamp + 1
    },
    {
      id: 'manual_ismul_azam',
      title: "Doa dengan Ismul A'ẓam (Nama Allah Teragung)",
      category: 'Doa Mustajab',
      kaidah: "Dua redaksi doa ma'tsur yang mengandung Ismul A'ẓam; dianjurkan dibaca sebelum permohonan penting.",
      arabic: "النَّصُّ ١:\\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ، لَا إِلَهَ إِلَّا أَنْتَ، الْمَنَّانُ، بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ.\\n\\nالنَّصُّ ٢:\\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ، الْأَحَدُ الصَّمَدُ، الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.",
      latin: "Redaksi 1: Allāhumma innī as'aluka bi-anna lakal-ḥamd, lā ilāha illā ant, al-Mannān, badī'us-samāwāti wal-arḍ, yā dzal-jalāli wal-ikrām, yā Ḥayyu yā Qayyūm.\\n\\nRedaksi 2: Allāhumma innī as'aluka bi-annī asyhadu annaka Antallāh, lā ilāha illā anta, al-Aḥaduṣ-Ṣamad, alladzī lam yalid wa lam yūlad, wa lam yakun lahu kufuwan aḥad.",
      translation_id: 'Redaksi 1: Ya Allah, aku memohon kepada-Mu dengan pujian; Engkaulah al-Mannān, Pencipta langit dan bumi, Wahai yang memiliki keagungan dan kemuliaan, wahai Yang Maha Hidup lagi Maha Berdiri sendiri. Redaksi 2: Ya Allah, aku memohon kepada-Mu dengan bersaksi bahwa Engkaulah Allah, tiada sesembahan selain Engkau, Yang Maha Esa lagi Mahasempurna, tidak beranak dan tidak diperanakkan, dan tidak ada sesuatu pun yang serupa dengan-Mu.',
      source: "HR Abu Dawud, an-Nasa'i, dan Tirmidzi.",
      tags: ['ismul-azam', 'nama-allah', 'mustajab'],
      favorite: true,
      audio: [],
      createdAt: timestamp + 2,
      updatedAt: timestamp + 2
    },
    {
      id: 'manual_doa_jami',
      title: "Doa Jami' Meminta Seluruh Kebaikan",
      category: 'Doa Mustajab',
      kaidah: 'Doa komprehensif Rasulullah ﷺ untuk memohon seluruh kebaikan dan berlindung dari segala keburukan.',
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا",
      latin: "Allāhumma innī as'aluka minal-khairi kullihi 'ājilihi wa ājilihi, mā 'alimtu minhu wa mā lam a'lam, wa a'ūdzubika minasy-syarri kullihi 'ājilihi wa ājilihi mā 'alimtu minhu wa mā lam a'lam. Allāhumma innī as'aluka min khairi mā sa'alaka 'abduka wa nabiyyuk, wa a'ūdzubika min syarri mā 'ādza bihi 'abduka wa nabiyyuk. Allāhumma innī as'alukal-jannata wa mā qarraba ilaihā min qaulin aw 'amalin, wa a'ūdzubika minan-nāri wa mā qarraba ilaihā min qaulin aw 'amalin, wa as'aluka an taj'ala kulla qaḍā'in qaḍaitahu lī khayrā.",
      translation_id: 'Ya Allah, aku memohon kepada-Mu seluruh kebaikan, yang segera maupun yang tertunda, yang aku ketahui maupun tidak aku ketahui. Aku berlindung kepada-Mu dari seluruh keburukan, yang segera maupun yang tertunda, yang aku ketahui maupun tidak aku ketahui. Ya Allah, aku memohon kebaikan yang diminta oleh hamba dan Nabi-Mu, dan berlindung kepada-Mu dari keburukan yang diminta perlindungan oleh hamba dan Nabi-Mu. Ya Allah, aku memohon surga dan segala ucapan maupun amalan yang mendekatkannya, dan berlindung dari neraka serta segala ucapan maupun amalan yang mendekatkannya. Aku memohon agar setiap ketetapan yang Engkau tetapkan bagiku menjadi kebaikan.',
      source: 'HR Ahmad dan Ibnu Majah; disahihkan al-Albani.',
      tags: ['doa-jami', 'kebaikan', 'perlindungan'],
      favorite: true,
      audio: [],
      createdAt: timestamp + 3,
      updatedAt: timestamp + 3
    }
  ];

  const ordered: Item[] = [manualItems[0]];

  const priorityTitles = [
    "Istighfar & Doa Keselamatan (Pembuka Zikir)",
    "Tasbih, Tahmid, Takbir (33x) & Tahlil",
    "Ayat Kursi",
    "Al-Mu'awwidzāt (Al-Ikhlāṣ, Al-Falaq, An-Nās)",
    "Sayyidul Istighfar (Raja Istighfar)",
    "Shalawat Ibrahimiyyah (Pembuka/Penutup Doa)"
  ];

  priorityTitles.forEach(title => {
    const item = extractByTitle(title);
    if (item) {
      ordered.push(item);
    }
  });

  ordered.push(manualItems[1], manualItems[2]);
  ordered.push(...baseItems);
  return ordered;
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
  const [isClient, setIsClient] = useState(false);
  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>(defaultDisplayPrefs);
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [prefsTheme, setPrefsTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [selectedItemForAI, setSelectedItemForAI] = useState<Item | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedItems = loadItems();
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
      root.style.setProperty('--arabic-font-size', `${arabicFontSize}px`);

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
    () => filterItems(items, searchTerm, activeCategory),
    [items, searchTerm, activeCategory]
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

  const handleOpenAIForItem = (item: Item) => {
    setSelectedItemForAI(item);
    setIsAIAssistOpen(true);
  };

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
                onClick={() => { setSelectedItemForAI(null); setIsAIAssistOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition"
              >
                <Icon name="sparkles" size={16} />
                Tanya AI
              </button>
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
            </div>
          </div>

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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
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
          onAskAI={handleOpenAIForItem}
        />

        {isAIAssistOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-3xl h-[80vh] rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <StreamingAIChat
                item={selectedItemForAI ?? undefined}
                className="h-full"
                onItemsChange={() => setItems(loadItems())}
              />
              <button
                type="button"
                onClick={() => {
                  setIsAIAssistOpen(false);
                  setSelectedItemForAI(null);
                }}
                className="absolute top-4 right-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 hover:text-red-500 transition"
                aria-label="Tutup Tanya AI"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
