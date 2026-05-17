/**
 * Multi-language support (i18n)
 * Supports: Indonesian (id), English (en), Arabic (ar)
 */

export type Locale = 'id' | 'en' | 'ar';

export interface Translations {
  // App
  appTitle: string;
  appDescription: string;

  // Navigation
  home: string;
  collection: string;
  settings: string;
  reminder: string;

  // Search & Filter
  searchPlaceholder: string;
  allCategories: string;
  favorites: string;
  noResults: string;

  // Prayer Card
  source: string;
  transliteration: string;
  translation: string;
  guideline: string;
  copyText: string;
  copied: string;
  addFavorite: string;
  removeFavorite: string;
  expand: string;
  collapse: string;

  // Theme
  lightMode: string;
  darkMode: string;
  systemMode: string;

  // Settings
  arabicFontSize: string;
  showLatin: string;
  showTranslation: string;
  showSource: string;
  displaySettings: string;
  language: string;

  // Collection
  collectionTitle: string;
  partOf: string;
  readNow: string;
  completed: string;
  progress: string;
  estimatedRead: string;
  minutes: string;

  // Reminder
  reminderTitle: string;
  enableReminder: string;
  reminderSchedule: string;
  reminderInfo: string;

  // Export/Import
  exportData: string;
  importData: string;

  // General
  loading: string;
  error: string;
  close: string;
  save: string;
  cancel: string;
  back: string;
  next: string;
  previous: string;
}

const id: Translations = {
  appTitle: 'Dashboard Doa',
  appDescription: 'Koleksi doa-doa autentik dari Al-Quran dan Hadis',

  home: 'Beranda',
  collection: 'Koleksi',
  settings: 'Pengaturan',
  reminder: 'Pengingat',

  searchPlaceholder: 'Cari doa...',
  allCategories: 'Semua Kategori',
  favorites: 'Favorit',
  noResults: 'Tidak ada doa yang ditemukan',

  source: 'Sumber',
  transliteration: 'Transliterasi',
  translation: 'Terjemahan',
  guideline: 'Kaidah',
  copyText: 'Salin',
  copied: 'Tersalin!',
  addFavorite: 'Tambah Favorit',
  removeFavorite: 'Hapus Favorit',
  expand: 'Perluas',
  collapse: 'Perkecil',

  lightMode: 'Mode Terang',
  darkMode: 'Mode Gelap',
  systemMode: 'Ikuti Sistem',

  arabicFontSize: 'Ukuran Font Arab',
  showLatin: 'Tampilkan Latin',
  showTranslation: 'Tampilkan Terjemahan',
  showSource: 'Tampilkan Sumber',
  displaySettings: 'Pengaturan Tampilan',
  language: 'Bahasa',

  collectionTitle: 'Koleksi Doa Komprehensif',
  partOf: 'Bagian',
  readNow: 'Baca Sekarang',
  completed: 'Selesai',
  progress: 'Progres',
  estimatedRead: 'Estimasi baca',
  minutes: 'menit',

  reminderTitle: 'Pengingat Doa',
  enableReminder: 'Aktifkan Pengingat',
  reminderSchedule: 'Jadwal Pengingat',
  reminderInfo: 'Pengingat akan aktif selama tab browser terbuka.',

  exportData: 'Ekspor Data',
  importData: 'Impor Data',

  loading: 'Memuat...',
  error: 'Terjadi kesalahan',
  close: 'Tutup',
  save: 'Simpan',
  cancel: 'Batal',
  back: 'Kembali',
  next: 'Selanjutnya',
  previous: 'Sebelumnya',
};

const en: Translations = {
  appTitle: 'Prayer Dashboard',
  appDescription: 'Collection of authentic prayers from the Quran and Hadith',

  home: 'Home',
  collection: 'Collection',
  settings: 'Settings',
  reminder: 'Reminder',

  searchPlaceholder: 'Search prayers...',
  allCategories: 'All Categories',
  favorites: 'Favorites',
  noResults: 'No prayers found',

  source: 'Source',
  transliteration: 'Transliteration',
  translation: 'Translation',
  guideline: 'Guideline',
  copyText: 'Copy',
  copied: 'Copied!',
  addFavorite: 'Add Favorite',
  removeFavorite: 'Remove Favorite',
  expand: 'Expand',
  collapse: 'Collapse',

  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  systemMode: 'System',

  arabicFontSize: 'Arabic Font Size',
  showLatin: 'Show Latin',
  showTranslation: 'Show Translation',
  showSource: 'Show Source',
  displaySettings: 'Display Settings',
  language: 'Language',

  collectionTitle: 'Comprehensive Prayer Collection',
  partOf: 'Part',
  readNow: 'Read Now',
  completed: 'Completed',
  progress: 'Progress',
  estimatedRead: 'Estimated read',
  minutes: 'minutes',

  reminderTitle: 'Prayer Reminder',
  enableReminder: 'Enable Reminder',
  reminderSchedule: 'Reminder Schedule',
  reminderInfo: 'Reminders are active while the browser tab is open.',

  exportData: 'Export Data',
  importData: 'Import Data',

  loading: 'Loading...',
  error: 'An error occurred',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
};

const ar: Translations = {
  appTitle: 'لوحة الأدعية',
  appDescription: 'مجموعة أدعية صحيحة من القرآن والحديث',

  home: 'الرئيسية',
  collection: 'المجموعة',
  settings: 'الإعدادات',
  reminder: 'التذكير',

  searchPlaceholder: 'ابحث عن دعاء...',
  allCategories: 'جميع الفئات',
  favorites: 'المفضلة',
  noResults: 'لم يتم العثور على أدعية',

  source: 'المصدر',
  transliteration: 'النطق',
  translation: 'الترجمة',
  guideline: 'القاعدة',
  copyText: 'نسخ',
  copied: 'تم النسخ!',
  addFavorite: 'إضافة للمفضلة',
  removeFavorite: 'إزالة من المفضلة',
  expand: 'توسيع',
  collapse: 'تصغير',

  lightMode: 'الوضع الفاتح',
  darkMode: 'الوضع الداكن',
  systemMode: 'وضع النظام',

  arabicFontSize: 'حجم الخط العربي',
  showLatin: 'إظهار اللاتينية',
  showTranslation: 'إظهار الترجمة',
  showSource: 'إظهار المصدر',
  displaySettings: 'إعدادات العرض',
  language: 'اللغة',

  collectionTitle: 'مجموعة الأدعية الشاملة',
  partOf: 'الجزء',
  readNow: 'اقرأ الآن',
  completed: 'مكتمل',
  progress: 'التقدم',
  estimatedRead: 'وقت القراءة المقدر',
  minutes: 'دقائق',

  reminderTitle: 'تذكير الدعاء',
  enableReminder: 'تفعيل التذكير',
  reminderSchedule: 'جدول التذكير',
  reminderInfo: 'التذكيرات تعمل أثناء فتح المتصفح.',

  exportData: 'تصدير البيانات',
  importData: 'استيراد البيانات',

  loading: 'جاري التحميل...',
  error: 'حدث خطأ',
  close: 'إغلاق',
  save: 'حفظ',
  cancel: 'إلغاء',
  back: 'رجوع',
  next: 'التالي',
  previous: 'السابق',
};

const translations: Record<Locale, Translations> = { id, en, ar };

const LOCALE_STORAGE_KEY = 'app:locale:v1';

// Get saved locale
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'id';
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && (saved === 'id' || saved === 'en' || saved === 'ar')) {
      return saved as Locale;
    }
  } catch {
    // ignore
  }
  return 'id';
}

// Save locale
export function setLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

// Get translations for a locale
export function getTranslations(locale?: Locale): Translations {
  const l = locale || getLocale();
  return translations[l] || translations.id;
}

// Get text direction for locale
export function getDirection(locale?: Locale): 'ltr' | 'rtl' {
  const l = locale || getLocale();
  return l === 'ar' ? 'rtl' : 'ltr';
}

// Available locales with labels
export const AVAILABLE_LOCALES: { value: Locale; label: string; nativeLabel: string }[] = [
  { value: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
];
