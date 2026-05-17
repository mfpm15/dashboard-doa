import {
  PersonalHajat,
  DEFAULT_HAJAT,
  ReadingProgress,
  ReaderDisplayOptions,
  DEFAULT_READER_OPTIONS,
} from '@/types/asmaulHusna';

const KEYS = {
  HAJAT: 'asmaul-husna:hajat:v1',
  PROGRESS: 'asmaul-husna:progress:v1',
  READER_OPTIONS: 'asmaul-husna:reader-options:v1',
} as const;

function safeParse<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

// Personal Hajat
export function loadHajat(): PersonalHajat {
  return safeParse(KEYS.HAJAT, DEFAULT_HAJAT);
}

export function saveHajat(hajat: PersonalHajat): void {
  localStorage.setItem(KEYS.HAJAT, JSON.stringify(hajat));
}

export function resetHajat(): void {
  localStorage.setItem(KEYS.HAJAT, JSON.stringify(DEFAULT_HAJAT));
}

// Reading Progress
export function loadProgress(): ReadingProgress {
  return safeParse(KEYS.PROGRESS, {
    lastPartRead: 0,
    completedParts: [],
    lastReadAt: 0,
    bookmarks: [],
  });
}

export function saveProgress(progress: ReadingProgress): void {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export function markPartRead(partNumber: number): void {
  const progress = loadProgress();
  progress.lastPartRead = partNumber;
  progress.lastReadAt = Date.now();
  if (!progress.completedParts.includes(partNumber)) {
    progress.completedParts.push(partNumber);
  }
  saveProgress(progress);
}

export function addBookmark(partNumber: number, label: string, itemNumber?: number): void {
  const progress = loadProgress();
  progress.bookmarks.push({
    partNumber,
    itemNumber,
    label,
    createdAt: Date.now(),
  });
  saveProgress(progress);
}

export function removeBookmark(createdAt: number): void {
  const progress = loadProgress();
  progress.bookmarks = progress.bookmarks.filter(b => b.createdAt !== createdAt);
  saveProgress(progress);
}

// Reader Display Options
export function loadReaderOptions(): ReaderDisplayOptions {
  return safeParse(KEYS.READER_OPTIONS, DEFAULT_READER_OPTIONS);
}

export function saveReaderOptions(options: ReaderDisplayOptions): void {
  localStorage.setItem(KEYS.READER_OPTIONS, JSON.stringify(options));
}

// Placeholder substitution engine
export function substitutePlaceholders(text: string, hajat: PersonalHajat): string {
  return text
    .replace(/\{\{rizq_goal\}\}/g, hajat.rizqGoal)
    .replace(/\{\{career_field\}\}/g, hajat.careerField)
    .replace(/\{\{preferred_location\}\}/g, hajat.preferredLocation)
    .replace(/\{\{family_names\}\}/g, hajat.familyNames)
    .replace(/\{\{hajj_umrah_target\}\}/g, hajat.hajjUmrahTarget)
    .replace(/\{\{custom_dua\}\}/g, hajat.customDua);
}
