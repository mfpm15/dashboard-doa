/**
 * Advanced Search Engine for Islamic Prayer Dashboard
 * Features: Semantic search, fuzzy matching, AI suggestions, analytics
 */

import { Item } from '@/types';

export interface SearchResult {
  item: Item;
  score: number;
  matchedFields: string[];
  highlights: { [key: string]: string };
}

export interface SearchOptions {
  query: string;
  categories?: string[];
  tags?: string[];
  fuzzy?: boolean;
  semantic?: boolean;
  limit?: number;
  minScore?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'category' | 'tag' | 'prayer';
  score: number;
  metadata?: any;
}

export interface SearchAnalytics {
  query: string;
  timestamp: number;
  resultCount: number;
  clickedResult?: string;
  sessionId: string;
}

class SearchEngine {
  private items: Item[] = [];
  private searchIndex: Map<string, Set<number>> = new Map();
  private analytics: SearchAnalytics[] = [];
  private suggestions: Map<string, SearchSuggestion[]> = new Map();
  private sessionId: string = this.generateSessionId();

  // Islamic keywords for semantic search
  private islamicKeywords = {
    'doa': ['prayer', 'supplication', 'du\'a', 'dua'],
    'zikir': ['dhikr', 'remembrance', 'dzikir', 'zikr'],
    'pagi': ['morning', 'fajr', 'subuh', 'dawn'],
    'sore': ['evening', 'maghrib', 'sunset', 'dusk'],
    'malam': ['night', 'isha', 'isya', 'nighttime'],
    'makan': ['eat', 'eating', 'food', 'meal'],
    'tidur': ['sleep', 'sleeping', 'bedtime', 'rest'],
    'bepergian': ['travel', 'journey', 'trip', 'safar'],
    'syukur': ['gratitude', 'thankfulness', 'grateful', 'thanks'],
    'tobat': ['repentance', 'forgiveness', 'taubah', 'istighfar'],
    'perlindungan': ['protection', 'safety', 'shelter', 'refuge'],
    'kesehatan': ['health', 'healing', 'cure', 'wellness'],
    'rezeki': ['sustenance', 'provision', 'livelihood', 'rizq'],
    'ilmu': ['knowledge', 'learning', 'wisdom', 'education'],
    'keluarga': ['family', 'parents', 'children', 'spouse'],
    'masjid': ['mosque', 'prayer place', 'musalla', 'surau']
  };

  // Common prayer situations
  private prayerSituations = {
    'sebelum makan': ['before eating', 'pre-meal', 'food blessing'],
    'sesudah makan': ['after eating', 'post-meal', 'gratitude for food'],
    'sebelum tidur': ['before sleep', 'bedtime', 'night prayer'],
    'bangun tidur': ['wake up', 'morning', 'getting up'],
    'keluar rumah': ['leaving home', 'going out', 'departure'],
    'masuk rumah': ['entering home', 'arrival', 'returning'],
    'naik kendaraan': ['boarding vehicle', 'transportation', 'travel'],
    'masuk masjid': ['entering mosque', 'mosque entry', 'prayer place'],
    'keluar masjid': ['leaving mosque', 'mosque exit', 'after prayer'],
    'ketika hujan': ['during rain', 'rainy weather', 'storm'],
    'sakit': ['illness', 'sickness', 'pain', 'disease'],
    'sedih': ['sadness', 'grief', 'sorrow', 'depression'],
    'senang': ['happiness', 'joy', 'celebration', 'success'],
    'takut': ['fear', 'anxiety', 'worry', 'concern'],
    'belajar': ['studying', 'learning', 'education', 'knowledge']
  };

  setItems(items: Item[]): void {
    this.items = items;
    this.buildSearchIndex();
  }

  private buildSearchIndex(): void {
    this.searchIndex.clear();

    this.items.forEach((item, index) => {
      // Index all searchable fields
      const searchableText = [
        item.title,
        item.arabic,
        item.latin,
        item.translation_id,
        item.category,
        ...item.tags,
        item.source
      ].filter(Boolean).join(' ').toLowerCase();

      // Split into words and create index
      const words = searchableText.split(/\s+/);
      words.forEach(word => {
        const cleaned = this.cleanWord(word);
        if (cleaned.length > 2) { // Skip very short words
          if (!this.searchIndex.has(cleaned)) {
            this.searchIndex.set(cleaned, new Set());
          }
          this.searchIndex.get(cleaned)!.add(index);
        }
      });
    });
  }

  private cleanWord(word: string): string {
    return word.replace(/[^\w\u0600-\u06FF]/g, '').toLowerCase();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  search(options: SearchOptions): SearchResult[] {
    const { query, categories, tags, fuzzy = true, semantic = true, limit = 50, minScore = 0.1 } = options;

    if (!query.trim()) {
      return this.items
        .filter(item => this.filterByCategories(item, categories) && this.filterByTags(item, tags))
        .slice(0, limit)
        .map(item => ({
          item,
          score: 1,
          matchedFields: [],
          highlights: {}
        }));
    }

    // Record search analytics
    this.recordSearch(query);

    const queryWords = query.toLowerCase().split(/\s+/);
    const results = new Map<number, SearchResult>();

    // Direct word matching
    this.searchDirectMatches(queryWords, results);

    // Semantic search
    if (semantic) {
      this.searchSemantic(query, queryWords, results);
    }

    // Fuzzy matching
    if (fuzzy) {
      this.searchFuzzy(queryWords, results);
    }

    // Convert to array and sort by score
    const searchResults = Array.from(results.values())
      .filter(result =>
        result.score >= minScore &&
        this.filterByCategories(result.item, categories) &&
        this.filterByTags(result.item, tags)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Update analytics with result count
    if (this.analytics.length > 0) {
      this.analytics[this.analytics.length - 1].resultCount = searchResults.length;
    }

    return searchResults;
  }

  private searchDirectMatches(queryWords: string[], results: Map<number, SearchResult>): void {
    queryWords.forEach(word => {
      const cleaned = this.cleanWord(word);
      const indices = this.searchIndex.get(cleaned);

      if (indices) {
        indices.forEach(index => {
          const item = this.items[index];
          const existing = results.get(index);
          const baseScore = this.calculateFieldScore(item, word);

          if (existing) {
            existing.score += baseScore;
            existing.matchedFields = [...new Set([...existing.matchedFields, ...this.getMatchedFields(item, word)])];
          } else {
            results.set(index, {
              item,
              score: baseScore,
              matchedFields: this.getMatchedFields(item, word),
              highlights: this.generateHighlights(item, [word])
            });
          }
        });
      }
    });
  }

  private searchSemantic(query: string, queryWords: string[], results: Map<number, SearchResult>): void {
    const semanticMatches = this.findSemanticMatches(query);

    semanticMatches.forEach(({ word, score }) => {
      const indices = this.searchIndex.get(word);
      if (indices) {
        indices.forEach(index => {
          const item = this.items[index];
          const existing = results.get(index);
          const semanticScore = score * 0.7; // Semantic matches get lower score

          if (existing) {
            existing.score += semanticScore;
          } else {
            results.set(index, {
              item,
              score: semanticScore,
              matchedFields: ['semantic'],
              highlights: this.generateHighlights(item, queryWords)
            });
          }
        });
      }
    });
  }

  private searchFuzzy(queryWords: string[], results: Map<number, SearchResult>): void {
    queryWords.forEach(word => {
      if (word.length < 3) return; // Skip short words for fuzzy search

      this.searchIndex.forEach((indices, indexWord) => {
        const similarity = this.calculateSimilarity(word, indexWord);
        if (similarity > 0.7) { // Fuzzy threshold
          indices.forEach(index => {
            const item = this.items[index];
            const existing = results.get(index);
            const fuzzyScore = similarity * 0.5; // Fuzzy matches get lower score

            if (existing) {
              existing.score += fuzzyScore;
            } else {
              results.set(index, {
                item,
                score: fuzzyScore,
                matchedFields: ['fuzzy'],
                highlights: this.generateHighlights(item, [word])
              });
            }
          });
        }
      });
    });
  }

  private findSemanticMatches(query: string): { word: string; score: number }[] {
    const matches: { word: string; score: number }[] = [];
    const queryLower = query.toLowerCase();

    // Check Islamic keywords
    Object.entries(this.islamicKeywords).forEach(([key, synonyms]) => {
      if (queryLower.includes(key)) {
        synonyms.forEach(synonym => {
          matches.push({ word: synonym, score: 0.9 });
        });
      }

      synonyms.forEach(synonym => {
        if (queryLower.includes(synonym)) {
          matches.push({ word: key, score: 0.8 });
        }
      });
    });

    // Check prayer situations
    Object.entries(this.prayerSituations).forEach(([key, situations]) => {
      if (queryLower.includes(key)) {
        situations.forEach(situation => {
          matches.push({ word: situation, score: 0.85 });
        });
      }

      situations.forEach(situation => {
        if (queryLower.includes(situation)) {
          matches.push({ word: key, score: 0.8 });
        }
      });
    });

    return matches;
  }

  private calculateFieldScore(item: Item, word: string): number {
    const wordLower = word.toLowerCase();
    let score = 0;

    // Title match (highest priority)
    if (item.title.toLowerCase().includes(wordLower)) {
      score += 2.0;
    }

    // Category match
    if (item.category.toLowerCase().includes(wordLower)) {
      score += 1.5;
    }

    // Tags match
    if (item.tags.some(tag => tag.toLowerCase().includes(wordLower))) {
      score += 1.2;
    }

    // Arabic text match
    if (item.arabic?.toLowerCase().includes(wordLower)) {
      score += 1.0;
    }

    // Translation match
    if (item.translation_id?.toLowerCase().includes(wordLower)) {
      score += 0.8;
    }

    // Latin text match
    if (item.latin?.toLowerCase().includes(wordLower)) {
      score += 0.6;
    }

    // Source match
    if (item.source?.toLowerCase().includes(wordLower)) {
      score += 0.4;
    }

    return score;
  }

  private getMatchedFields(item: Item, word: string): string[] {
    const wordLower = word.toLowerCase();
    const fields: string[] = [];

    if (item.title.toLowerCase().includes(wordLower)) fields.push('title');
    if (item.category.toLowerCase().includes(wordLower)) fields.push('category');
    if (item.tags.some(tag => tag.toLowerCase().includes(wordLower))) fields.push('tags');
    if (item.arabic?.toLowerCase().includes(wordLower)) fields.push('arabic');
    if (item.translation_id?.toLowerCase().includes(wordLower)) fields.push('translation');
    if (item.latin?.toLowerCase().includes(wordLower)) fields.push('latin');
    if (item.source?.toLowerCase().includes(wordLower)) fields.push('source');

    return fields;
  }

  private generateHighlights(item: Item, words: string[]): { [key: string]: string } {
    const highlights: { [key: string]: string } = {};
    const wordPattern = new RegExp(`(${words.map(w => this.escapeRegex(w)).join('|')})`, 'gi');

    if (item.title) {
      highlights.title = item.title.replace(wordPattern, '<mark>$1</mark>');
    }

    if (item.translation_id) {
      highlights.translation = item.translation_id.replace(wordPattern, '<mark>$1</mark>');
    }

    return highlights;
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private calculateSimilarity(a: string, b: string): number {
    // Simple Levenshtein distance calculation
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = matrix[b.length][a.length];
    return 1 - distance / Math.max(a.length, b.length);
  }

  private filterByCategories(item: Item, categories?: string[]): boolean {
    if (!categories || categories.length === 0) return true;
    return categories.includes(item.category);
  }

  private filterByTags(item: Item, tags?: string[]): boolean {
    if (!tags || tags.length === 0) return true;
    return tags.some(tag => item.tags.includes(tag));
  }

  getSuggestions(query: string, limit: number = 5): SearchSuggestion[] {
    if (query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Prayer name suggestions
    this.items.forEach(item => {
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: item.title,
          type: 'prayer',
          score: this.calculateSuggestionScore(item.title, query),
          metadata: { id: item.id, category: item.category }
        });
      }
    });

    // Category suggestions
    const categories = [...new Set(this.items.map(item => item.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: category,
          type: 'category',
          score: this.calculateSuggestionScore(category, query)
        });
      }
    });

    // Islamic keyword suggestions
    Object.keys(this.islamicKeywords).forEach(keyword => {
      if (keyword.includes(queryLower)) {
        suggestions.push({
          text: keyword,
          type: 'query',
          score: this.calculateSuggestionScore(keyword, query)
        });
      }
    });

    // Situation suggestions
    Object.keys(this.prayerSituations).forEach(situation => {
      if (situation.includes(queryLower)) {
        suggestions.push({
          text: situation,
          type: 'query',
          score: this.calculateSuggestionScore(situation, query)
        });
      }
    });

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateSuggestionScore(text: string, query: string): number {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower.startsWith(queryLower)) return 1.0;
    if (textLower.includes(queryLower)) return 0.8;

    return this.calculateSimilarity(textLower, queryLower);
  }

  private recordSearch(query: string): void {
    const analytics: SearchAnalytics = {
      query,
      timestamp: Date.now(),
      resultCount: 0, // Will be updated after search
      sessionId: this.sessionId
    };

    this.analytics.push(analytics);

    // Keep only last 1000 searches
    if (this.analytics.length > 1000) {
      this.analytics = this.analytics.slice(-1000);
    }

    // Store in localStorage
    try {
      localStorage.setItem('search_analytics', JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Could not save search analytics:', error);
    }
  }

  recordClick(query: string, itemId: string): void {
    const recent = this.analytics.slice(-10).reverse();
    const searchEntry = recent.find(entry => entry.query === query);

    if (searchEntry) {
      searchEntry.clickedResult = itemId;

      try {
        localStorage.setItem('search_analytics', JSON.stringify(this.analytics));
      } catch (error) {
        console.warn('Could not save click analytics:', error);
      }
    }
  }

  getSearchAnalytics(): {
    totalSearches: number;
    popularQueries: { query: string; count: number }[];
    averageResults: number;
    clickThroughRate: number;
  } {
    const total = this.analytics.length;
    const queryCount = new Map<string, number>();
    let totalResults = 0;
    let totalClicks = 0;

    this.analytics.forEach(entry => {
      queryCount.set(entry.query, (queryCount.get(entry.query) || 0) + 1);
      totalResults += entry.resultCount;
      if (entry.clickedResult) totalClicks++;
    });

    const popularQueries = Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches: total,
      popularQueries,
      averageResults: total > 0 ? totalResults / total : 0,
      clickThroughRate: total > 0 ? totalClicks / total : 0
    };
  }

  clearAnalytics(): void {
    this.analytics = [];
    localStorage.removeItem('search_analytics');
  }

  // Load analytics from localStorage
  loadAnalytics(): void {
    try {
      const stored = localStorage.getItem('search_analytics');
      if (stored) {
        this.analytics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load search analytics:', error);
    }
  }
}

// Export singleton instance
export const searchEngine = new SearchEngine();