export type ID = string;

export interface Item {
  id: ID;
  title: string;
  arabic?: string;
  latin?: string;
  translation_id?: string;
  kaidah?: string;
  category: string;
  tags: string[];
  source?: string;
  favorite: boolean;
  audio?: AudioTrack[];
  createdAt: number;
  updatedAt: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  blobId?: string;
  duration?: number | string;
  peaks?: number[];
  segments?: AudioSegment[];
  reciter?: string;
  language?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AudioSegment {
  id?: string;
  start: number;
  end: number;
  label?: string;
  confidence?: number;
}

export interface Prefs {
  theme: 'light' | 'dark' | 'system';
  pageSize: 20 | 50 | 100;
  sortBy: 'updatedAt' | 'title';
  sortDir: 'asc' | 'desc';
  visibleColumns: string[];
  lastViewedItemId?: ID;
  arabicFontSize: number;
  arabicLineHeight: number;
  searchHistory?: string[];
  favoriteFirst?: boolean;
  compactView?: boolean;
}

export interface QueryOptions {
  term?: string;
  category?: string | null;
  tags?: string[];
  favorite?: boolean | null;
  sortBy?: 'updatedAt' | 'title';
  sortDir?: 'asc' | 'desc';
  limit?: number;
}

export interface TrashItem extends Item {
  _deletedAt: number;
}
