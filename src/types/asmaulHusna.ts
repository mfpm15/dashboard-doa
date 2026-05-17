// Asmaul Husna Collection Types
// Based on PRD Section 10 Data Model

export type EvidenceType = 'quran' | 'hadith' | 'atsar' | 'scholar' | 'custom';
export type VerificationStatus = 'sahih' | 'hasan' | 'needs_review' | 'custom_dua';

export interface Evidence {
  type: EvidenceType;
  reference: string;
  arabic?: string;
  transliteration?: string;
  translationId?: string;
  verificationStatus: VerificationStatus;
  note?: string;
}

export interface DuaText {
  arabic?: string;
  transliteration?: string;
  translationId: string;
}

export interface AsmaulHusnaItem {
  number: number;
  slug: string;
  nameArabic: string;
  transliteration: string;
  meaningId: string;
  theme: string[];
  explanation: string;
  dua: DuaText;
  evidence: Evidence[];
  personalPlaceholders?: string[];
}

export interface CollectionPart {
  id: string;
  partNumber: number;
  title: string;
  phaseTitle: string;
  asmaRange: [number, number];
  introduction: string;
  quranEvidence?: Evidence[];
  hadithEvidence?: Evidence[];
  items: AsmaulHusnaItem[];
  matsurDuas?: MatsurDua[];
  closingDua?: DuaText;
  closingParagraph?: string;
  estimatedReadMinutes: number;
}

export interface MatsurDua {
  id: string;
  title: string;
  source: string;
  dua: DuaText;
  virtue?: string;
}

export interface CollectionPartMetadata {
  id: string;
  partNumber: number;
  title: string;
  phaseTitle: string;
  asmaRange: [number, number];
  estimatedReadMinutes: number;
  tags: string[];
  status: 'full' | 'stub';
}

export interface PersonalHajat {
  rizqGoal: string;
  careerField: string;
  preferredLocation: string;
  familyNames: string;
  hajjUmrahTarget: string;
  customDua: string;
}

export const DEFAULT_HAJAT: PersonalHajat = {
  rizqGoal: 'rezeki yang halal, luas, dan penuh berkah',
  careerField: 'pekerjaan dan karier yang berkah',
  preferredLocation: 'tempat yang terbaik menurut Allah',
  familyNames: 'keluargaku dan kaum muslimin',
  hajjUmrahTarget: 'pada waktu terbaik menurut Allah',
  customDua: 'hajat terbaik dunia dan akhirat',
};

export interface ReadingProgress {
  lastPartRead: number;
  completedParts: number[];
  lastReadAt: number;
  bookmarks: Bookmark[];
}

export interface Bookmark {
  partNumber: number;
  itemNumber?: number;
  label: string;
  createdAt: number;
}

export interface ReaderDisplayOptions {
  showArabic: boolean;
  showLatin: boolean;
  showTranslation: boolean;
  showExplanation: boolean;
  showEvidence: boolean;
  arabicFontSize: number;
}

export const DEFAULT_READER_OPTIONS: ReaderDisplayOptions = {
  showArabic: true,
  showLatin: true,
  showTranslation: true,
  showExplanation: true,
  showEvidence: true,
  arabicFontSize: 32,
};
