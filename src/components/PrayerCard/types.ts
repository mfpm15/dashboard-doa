import type { Item } from '@/types';

export interface PrayerCardProps {
  item: Item;
  searchTerm?: string;
  showLatin?: boolean;
  showTranslation?: boolean;
  showSource?: boolean;
  arabicFontSize?: number;
  onToggleFavorite?: (id: string) => void;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export interface PrayerCardHeaderProps {
  item: Item;
  index: number;
  searchTerm?: string;
  onToggleFavorite?: (id: string) => void;
  highlightText: (text: string) => React.ReactNode;
}

export interface PrayerCardArabicProps {
  arabic?: string;
  fontSize: number;
  isExpanded: boolean;
}

export interface PrayerCardContentProps {
  item: Item;
  showLatin: boolean;
  showTranslation: boolean;
  showSource: boolean;
  renderFormattedText: (text: string) => React.ReactNode;
}

export interface PrayerCardFooterProps {
  item: Item;
  isExpanded: boolean;
  copied: boolean;
  showLatin: boolean;
  showTranslation: boolean;
  showSource: boolean;
  onToggleExpand: () => void;
  onCopy: () => void;
  onShare: () => void;
}
