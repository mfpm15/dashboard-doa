/**
 * Application constants - Single source of truth for configurable values
 */

// Font size configuration for Arabic text
export const FONT_SIZES = {
  arabic: {
    min: 24,
    max: 48,
    default: 32,
    step: 2,
  },
  latin: {
    default: 16,
  },
} as const;

// Line height configuration
export const LINE_HEIGHTS = {
  arabic: 3.2,
  latin: 1.6,
  relaxed: 1.875,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  ITEMS: 'app:items:v1',
  PREFS: 'app:prefs:v1',
  TRASH: 'app:trash:v1',
  DRAFT: 'app:draft:v1',
  VERSION: 'app:version',
  DISPLAY_PREFS: 'app:display-prefs:v1',
  DATA_VERSION: 'app:data-version',
} as const;

// Data version for migration
export const DATA_VERSION = 'proper-v1';

// Cache configuration
export const CACHE = {
  DURATION: 5000, // 5 seconds
  WRITE_DELAY: 300, // 300ms debounce
} as const;

// Theme options
export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

// Page sizes
export const PAGE_SIZES = [20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

// Sort options
export const SORT_OPTIONS = {
  BY: ['updatedAt', 'title'] as const,
  DIR: ['asc', 'desc'] as const,
} as const;

// Display preferences defaults
export const DEFAULT_DISPLAY_PREFS = {
  showLatin: true,
  showTranslation: true,
  showSource: true,
} as const;

// Slider marks for font size
export const FONT_SIZE_MARKS = [
  { value: FONT_SIZES.arabic.min, label: 'Kecil' },
  { value: (FONT_SIZES.arabic.min + FONT_SIZES.arabic.max) / 2, label: 'Sedang' },
  { value: FONT_SIZES.arabic.max, label: 'Besar' },
] as const;
