'use client';

import { useMemo } from 'react';
import { Item } from '@/types';

/**
 * Normalize Arabic text by removing diacritics (tashkeel/harakat)
 * This allows for more flexible Arabic text matching
 */
function normalizeArabic(text: string): string {
  if (!text) return '';
  // Remove Arabic diacritics: fatha, kasra, damma, sukun, shadda, tanwin, etc.
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '');
}

/**
 * Check if text contains Arabic characters
 */
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Simple fuzzy search algorithm for better search experience
 * Matches even if characters are not consecutive
 */
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  if (!text) return false;

  // Normalize both text and query for comparison
  let normalizedText = text.toLowerCase();
  let normalizedQuery = query.toLowerCase();

  // If either contains Arabic, also normalize Arabic diacritics
  if (containsArabic(text) || containsArabic(query)) {
    normalizedText = normalizeArabic(normalizedText);
    normalizedQuery = normalizeArabic(normalizedQuery);
  }

  // First try exact match
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // Then try fuzzy match (for non-Arabic or when exact match fails)
  let queryIndex = 0;
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === normalizedQuery.length;
}

/**
 * Calculate match score for ranking results
 */
function getMatchScore(item: Item, query: string): number {
  if (!query) return 0;

  const queryLower = query.toLowerCase();
  const queryNormalized = normalizeArabic(queryLower);
  let score = 0;

  // Higher score for title matches
  if (item.title?.toLowerCase().includes(queryLower)) {
    score += 10;
  } else if (fuzzyMatch(item.title || '', query)) {
    score += 5;
  }

  // Medium score for Arabic text matches (with normalization)
  const arabicNormalized = normalizeArabic(item.arabic?.toLowerCase() || '');
  if (arabicNormalized.includes(queryNormalized)) {
    score += 7;
  }

  // Medium score for translation matches
  if (item.translation_id?.toLowerCase().includes(queryLower)) {
    score += 6;
  }

  // Lower score for other field matches
  if (item.latin?.toLowerCase().includes(queryLower)) {
    score += 4;
  }

  if (item.category?.toLowerCase().includes(queryLower)) {
    score += 3;
  }

  if (item.source?.toLowerCase().includes(queryLower)) {
    score += 2;
  }

  if (item.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
    score += 2;
  }

  // Bonus for exact matches
  if (item.title?.toLowerCase() === queryLower) {
    score += 20;
  }

  // Bonus for favorites
  if (item.favorite) {
    score += 1;
  }

  return score;
}

/**
 * Hook for fuzzy search with ranking
 */
export function useFuzzySearch(
  items: Item[],
  searchTerm: string,
  category: string,
  showOnlyFavorite: boolean
): Item[] {
  return useMemo(() => {
    let filtered = items;

    // Filter by category
    if (category !== 'Semua') {
      filtered = filtered.filter(item => item.category === category);
    }

    // Filter by favorite
    if (showOnlyFavorite) {
      filtered = filtered.filter(item => item.favorite);
    }

    // If no search term, return filtered items
    if (!searchTerm.trim()) {
      return filtered;
    }

    // Perform fuzzy search
    const searchResults = filtered.filter(item => {
      const searchableText = [
        item.title,
        item.arabic,
        item.latin,
        item.translation_id,
        item.source,
        item.category,
        item.kaidah,
        ...(item.tags || [])
      ]
        .filter(Boolean)
        .join(' ');

      return fuzzyMatch(searchableText, searchTerm);
    });

    // Sort by relevance score
    searchResults.sort((a, b) => {
      const scoreA = getMatchScore(a, searchTerm);
      const scoreB = getMatchScore(b, searchTerm);
      return scoreB - scoreA;
    });

    return searchResults;
  }, [items, searchTerm, category, showOnlyFavorite]);
}