'use client';

import { useMemo } from 'react';
import { Item } from '@/types';

/**
 * Simple fuzzy search algorithm for better search experience
 * Matches even if characters are not consecutive
 */
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  if (!text) return false;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // First try exact match
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Then try fuzzy match
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

/**
 * Calculate match score for ranking results
 */
function getMatchScore(item: Item, query: string): number {
  if (!query) return 0;

  const queryLower = query.toLowerCase();
  let score = 0;

  // Higher score for title matches
  if (item.title?.toLowerCase().includes(queryLower)) {
    score += 10;
  } else if (fuzzyMatch(item.title || '', query)) {
    score += 5;
  }

  // Medium score for Arabic text matches
  if (item.arabic?.toLowerCase().includes(queryLower)) {
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