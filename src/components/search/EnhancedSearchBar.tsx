'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { searchEngine, SearchSuggestion, SearchResult } from '@/lib/search/searchEngine';
import { Item } from '@/types';

interface EnhancedSearchBarProps {
  items: Item[];
  onSearchResults: (results: SearchResult[]) => void;
  onItemSelect: (item: Item) => void;
  placeholder?: string;
  className?: string;
}

export function EnhancedSearchBar({
  items,
  onSearchResults,
  onItemSelect,
  placeholder = "Cari doa, zikir, atau situasi...",
  className = ""
}: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularQueries, setPopularQueries] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Initialize search engine
  useEffect(() => {
    searchEngine.setItems(items);
    searchEngine.loadAnalytics();
    loadRecentSearches();
    loadPopularQueries();
  }, [items]);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem('recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Could not load recent searches:', error);
    }
  };

  const loadPopularQueries = () => {
    const analytics = searchEngine.getSearchAnalytics();
    setPopularQueries(analytics.popularQueries.slice(0, 5).map(q => q.query));
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    try {
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.warn('Could not save recent search:', error);
    }
  };

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      onSearchResults([]);
      return;
    }

    setIsSearching(true);

    const results = searchEngine.search({
      query: searchQuery,
      fuzzy: true,
      semantic: true,
      limit: 50
    });

    onSearchResults(results);
    saveRecentSearch(searchQuery);
    setIsSearching(false);
  }, [onSearchResults]);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestion(-1);

    if (value.length >= 2) {
      const newSuggestions = searchEngine.getSuggestions(value, 8);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearchResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          selectSuggestion(suggestions[selectedSuggestion]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);

    if (suggestion.type === 'prayer' && suggestion.metadata?.id) {
      const item = items.find(i => i.id === suggestion.metadata.id);
      if (item) {
        onItemSelect(item);
        searchEngine.recordClick(suggestion.text, item.id);
      }
    } else {
      performSearch(suggestion.text);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearchResults([]);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'prayer': return 'book-open';
      case 'category': return 'tag';
      case 'query': return 'search';
      default: return 'search';
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'prayer': return 'Doa';
      case 'category': return 'Kategori';
      case 'query': return 'Pencarian';
      default: return '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon
            name="search"
            className={`text-slate-400 transition-colors ${isSearching ? 'animate-pulse text-primary-500' : ''}`}
            size={20}
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <Icon
              name="x"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              size={18}
            />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-96 overflow-y-auto"
        >
          {/* Quick Actions */}
          {!query && (
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Pencarian Cepat
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['doa pagi', 'doa malam', 'doa makan', 'doa bepergian', 'doa syukur', 'doa tobat'].map(quickSearch => (
                  <button
                    key={quickSearch}
                    onClick={() => {
                      setQuery(quickSearch);
                      performSearch(quickSearch);
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-sm text-left bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {quickSearch}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Pencarian Terakhir
              </h4>
              {recentSearches.slice(0, 5).map((recent, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(recent);
                    performSearch(recent);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Icon name="clock" size={14} className="text-slate-400" />
                  <span>{recent}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!query && popularQueries.length > 0 && (
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Pencarian Populer
              </h4>
              {popularQueries.map((popular, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(popular);
                    performSearch(popular);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Icon name="trending-up" size={14} className="text-slate-400" />
                  <span>{popular}</span>
                </button>
              ))}
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedSuggestion === index
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon
                    name={getSuggestionIcon(suggestion.type)}
                    size={16}
                    className={selectedSuggestion === index ? 'text-primary-500' : 'text-slate-400'}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{suggestion.text}</div>
                    {suggestion.metadata?.category && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {suggestion.metadata.category}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {getSuggestionLabel(suggestion.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query && suggestions.length === 0 && (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              <Icon name="search" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada saran untuk "{query}"</p>
              <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}