import { Item, Prefs, ID, TrashItem } from '@/types';

// UUID generator
function uuid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Safe JSON parsing
function safeParse<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

// Storage keys
const KEYS = {
  DB: 'app:items:v1',
  PREF: 'app:prefs:v1',
  TRASH: 'app:trash:v1',
  DRAFT: 'app:draft:v1',
  VERSION: 'app:version'
};

// Debounced write
let writeTimeout: NodeJS.Timeout | null = null;
const WRITE_DELAY = 300;

function saveItemsDebounced(items: Item[]): void {
  if (writeTimeout) clearTimeout(writeTimeout);
  writeTimeout = setTimeout(() => {
    try {
      localStorage.setItem(KEYS.DB, JSON.stringify(items));
    } catch (e) {
      // Handle quota exceeded
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      localStorage.setItem(`app:items:backup:${ts}`, JSON.stringify(items.slice(0, 200)));
      throw e;
    }
  }, WRITE_DELAY);
}

// CRUD operations
export function loadItems(): Item[] {
  return safeParse(KEYS.DB, []);
}

export function addItem(payload: Partial<Item>): Item {
  const now = Date.now();
  const item: Item = {
    id: uuid(),
    favorite: false,
    tags: [],
    ...payload,
    createdAt: now,
    updatedAt: now
  } as Item;

  const items = loadItems();
  items.unshift(item);
  saveItemsDebounced(items);
  return item;
}

export function updateItem(id: ID, patch: Partial<Item>): Item {
  const items = loadItems();
  const index = items.findIndex(item => item.id === id);
  if (index < 0) throw new Error('Item not found');

  items[index] = { ...items[index], ...patch, updatedAt: Date.now() };
  saveItemsDebounced(items);
  return items[index];
}

export function softDeleteItem(id: ID): void {
  const items = loadItems();
  const index = items.findIndex(item => item.id === id);
  if (index < 0) return;

  const [removed] = items.splice(index, 1);
  const trash = safeParse<TrashItem[]>(KEYS.TRASH, []);
  const trashItem: TrashItem = { ...removed, _deletedAt: Date.now() };
  trash.unshift(trashItem);
  localStorage.setItem(KEYS.TRASH, JSON.stringify(trash));
  saveItemsDebounced(items);
}

export function restoreItem(id: ID): void {
  const trash = safeParse<TrashItem[]>(KEYS.TRASH, []);
  const index = trash.findIndex((item) => item.id === id);
  if (index < 0) return;

  const [restored] = trash.splice(index, 1);
  const { _deletedAt, ...cleanItem } = restored;

  const items = loadItems();
  items.unshift(cleanItem);

  localStorage.setItem(KEYS.TRASH, JSON.stringify(trash));
  saveItemsDebounced(items);
}

export function permanentDeleteItem(id: ID): void {
  const trash = safeParse<TrashItem[]>(KEYS.TRASH, []);
  const filtered = trash.filter((item) => item.id !== id);
  localStorage.setItem(KEYS.TRASH, JSON.stringify(filtered));
}

export function loadTrash(): TrashItem[] {
  return safeParse<TrashItem[]>(KEYS.TRASH, []);
}

export function emptyTrash(): void {
  localStorage.setItem(KEYS.TRASH, JSON.stringify([]));
}

// Preferences
export function loadPrefs(): Prefs {
  return safeParse(KEYS.PREF, {
    theme: 'system' as const,
    pageSize: 20 as const,
    sortBy: 'updatedAt' as const,
    sortDir: 'desc' as const,
    visibleColumns: ['title', 'category', 'tags', 'updatedAt', 'favorite', 'actions'],
    arabicFontSize: 28,
    arabicLineHeight: 1.9
  });
}

export function savePrefs(prefs: Partial<Prefs>): void {
  const current = loadPrefs();
  const updated = { ...current, ...prefs };
  localStorage.setItem(KEYS.PREF, JSON.stringify(updated));
}

// Draft management
export function saveDraft(draft: Partial<Item>): void {
  localStorage.setItem(KEYS.DRAFT, JSON.stringify(draft));
}

export function loadDraft(): Partial<Item> | null {
  return safeParse(KEYS.DRAFT, null);
}

export function clearDraft(): void {
  localStorage.removeItem(KEYS.DRAFT);
}

// Cross-tab sync
export function setupStorageSync(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key?.startsWith('app:')) {
      callback();
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

// Query function
export function query(items: Item[], options: {
  term?: string;
  category?: string | null;
  tags?: string[];
  favorite?: boolean | null;
  sortBy?: 'updatedAt' | 'title';
  sortDir?: 'asc' | 'desc';
} = {}): Item[] {
  const {
    term = '',
    category = null,
    tags = [],
    favorite = null,
    sortBy = 'updatedAt',
    sortDir = 'desc'
  } = options;

  const searchTerm = term.trim().toLowerCase();

  let filtered = items.filter(item => {
    if (category && item.category !== category) return false;
    if (favorite !== null && item.favorite !== favorite) return false;
    if (tags.length && !tags.every(tag =>
      item.tags?.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    )) return false;

    if (!searchTerm) return true;

    const searchFields = [
      item.title,
      item.latin,
      item.translation_id,
      ...(item.tags || [])
    ].join(' ').toLowerCase();

    return searchFields.includes(searchTerm);
  });

  filtered.sort((a, b) => {
    const direction = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'updatedAt') {
      return (a.updatedAt - b.updatedAt) * direction;
    }
    return a.title.localeCompare(b.title, 'id') * direction;
  });

  return filtered;
}