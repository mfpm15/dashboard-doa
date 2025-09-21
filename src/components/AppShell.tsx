'use client';

import React, { useState } from 'react';
import { Prefs } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { NotificationSettings } from '@/components/NotificationSettings';
import { MobileMenu } from '@/components/MobileMenu';

interface AppShellProps {
  children: React.ReactNode;
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
  onToggleFocusMode?: () => void;
}

export function AppShell({
  children,
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
  onOpenCommandPalette,
  onToggleFocusMode
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onPrefsChange({ theme });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex-col shadow-xl">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-900/20 dark:to-sky-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="book-open" className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Dashboard Doa
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Kumpulan Doa & Zikir Islami
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Quick Actions */}
          <div className="space-y-3 mb-8">
            <button
              onClick={onNewItem}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Icon name="plus" className="group-hover:scale-110 transition-transform" />
              Tambah Doa Baru
            </button>
            <button
              onClick={onOpenCommandPalette}
              className="w-full bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Icon name="command" className="group-hover:scale-110 transition-transform" size={16} />
              <span>Quick Search</span>
              <kbd className="ml-auto text-xs bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full"></div>
              Kategori Doa
            </h3>
            <div className="space-y-1.5">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category === 'Semua' ? null : category)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 text-left group ${
                    (category === 'Semua' && !selectedCategory) || selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-900/30 dark:to-sky-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon
                    name="bookmark"
                    size={16}
                    className={`transition-transform group-hover:scale-110 ${
                      (category === 'Semua' && !selectedCategory) || selectedCategory === category
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : ''
                    }`}
                  />
                  <span className="font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Toggle */}
          <div className="mb-8">
            <button
              onClick={() => onShowFavoritesChange(!showFavorites)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 text-left group ${
                showFavorites
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                name="star"
                size={16}
                className={`transition-transform group-hover:scale-110 ${
                  showFavorites ? 'text-amber-500 fill-current' : ''
                }`}
              />
              <span className="font-medium">Doa Favorit</span>
              {showFavorites && <div className="w-2 h-2 bg-amber-400 rounded-full ml-auto animate-pulse"></div>}
            </button>
          </div>

          {/* Popular Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              Tag Populer
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 8).map(tag => (
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
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50 shadow-sm'
                      : 'bg-slate-100/50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-600/40 border border-transparent'
                  }`}
                >
                  <Icon name="tag" size={12} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Tema Tampilan</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    prefs.theme === 'light'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-600 shadow-lg'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600'
                  }`}
                  title="Light Mode"
                >
                  <Icon name="sun" size={16} />
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    prefs.theme === 'dark'
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 border-2 border-slate-400 dark:border-slate-500 shadow-lg'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600'
                  }`}
                  title="Dark Mode"
                >
                  <Icon name="moon" size={16} />
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    prefs.theme === 'system'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 shadow-lg'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600'
                  }`}
                  title="System Theme"
                >
                  <Icon name="monitor" size={16} />
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <NotificationSettings />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-3 rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
        >
          <Icon name="menu" size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
        showFavorites={showFavorites}
        onShowFavoritesChange={onShowFavoritesChange}
        categories={categories}
        tags={tags}
        prefs={prefs}
        onPrefsChange={onPrefsChange}
        onNewItem={onNewItem}
        onOpenCommandPalette={onOpenCommandPalette}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-4 lg:p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Title - Only visible on small screens */}
            <div className="lg:hidden flex-1">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Dashboard Doa</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <Icon name="search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari doa, zikir, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Button */}
              <button
                onClick={onOpenCommandPalette}
                className="lg:hidden bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 p-3 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200"
              >
                <Icon name="search" size={18} />
              </button>

              {/* Focus Mode Button */}
              {onToggleFocusMode && (
                <button
                  onClick={onToggleFocusMode}
                  className="hidden sm:flex bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 items-center gap-2 group"
                  title="Aktifkan Focus Mode"
                >
                  <Icon name="eye" className="group-hover:scale-110 transition-transform" size={16} />
                  <span className="hidden md:inline">Focus</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2">
                <button className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 flex items-center gap-2">
                  <Icon name="upload" size={16} />
                  <span className="hidden lg:inline">Import</span>
                </button>
                <button className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 flex items-center gap-2">
                  <Icon name="download" size={16} />
                  <span className="hidden lg:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - Visible when needed */}
          <div className="lg:hidden mt-4">
            <div className="relative">
              <Icon name="search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari doa, zikir, atau kategori..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}