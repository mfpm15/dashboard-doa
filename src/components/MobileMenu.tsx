'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Prefs } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (show: boolean) => void;
  categories: string[];
  tags: string[];
  prefs: Prefs;
  onPrefsChange: (prefs: Partial<Prefs>) => void;
  onNewItem: () => void;
  onOpenCommandPalette: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  showFavorites,
  onShowFavoritesChange,
  categories,
  tags,
  prefs,
  onPrefsChange,
  onNewItem,
  onOpenCommandPalette
}: MobileMenuProps) {
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onPrefsChange({ theme });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Menu */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''} safe-area-top safe-area-left`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-lg flex items-center justify-center">
              <Icon name="book-open" className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Dashboard Doa
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kumpulan Doa & Zikir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari doa atau zikir..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => {
                onNewItem();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="plus" size={18} />
              Tambah Doa Baru
            </button>
            <button
              onClick={() => {
                onOpenCommandPalette();
                onClose();
              }}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="command" size={16} />
              Quick Search
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full"></div>
              Kategori Doa
            </h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category === 'Semua' ? null : category);
                    onClose();
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 text-left ${
                    (category === 'Semua' && !selectedCategory) || selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-900/30 dark:to-sky-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon
                    name="bookmark"
                    size={16}
                    className={
                      (category === 'Semua' && !selectedCategory) || selectedCategory === category
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : ''
                    }
                  />
                  <span className="font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="mb-6">
            <button
              onClick={() => {
                onShowFavoritesChange(!showFavorites);
                onClose();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 text-left ${
                showFavorites
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon
                name="star"
                size={16}
                className={showFavorites ? 'text-amber-500 fill-current' : ''}
              />
              <span className="font-medium">Doa Favorit</span>
              {showFavorites && <div className="w-2 h-2 bg-amber-400 rounded-full ml-auto animate-pulse"></div>}
            </button>
          </div>

          {/* Popular Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              Tag Populer
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      onTagsChange(selectedTags.filter(t => t !== tag));
                    } else {
                      onTagsChange([...selectedTags, tag]);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent'
                  }`}
                >
                  <Icon name="tag" size={10} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 safe-area-bottom">
          <div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Tema Tampilan</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  prefs.theme === 'light'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                }`}
                title="Light Mode"
              >
                <Icon name="sun" size={16} />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  prefs.theme === 'dark'
                    ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 border-2 border-slate-400 dark:border-slate-500'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                }`}
                title="Dark Mode"
              >
                <Icon name="moon" size={16} />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  prefs.theme === 'system'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                }`}
                title="System Theme"
              >
                <Icon name="monitor" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}