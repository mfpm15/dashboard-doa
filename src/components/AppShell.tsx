'use client';

import React from 'react';
import { Prefs } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { NotificationSettings } from '@/components/NotificationSettings';

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
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onPrefsChange({ theme });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard Doa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kumpulan Doa & Zikir
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Quick Actions */}
          <div className="space-y-2 mb-6">
            <button
              onClick={onNewItem}
              className="w-full btn btn-primary"
            >
              <Icon name="plus" />
              Tambah Doa
            </button>
            <button
              onClick={onOpenCommandPalette}
              className="w-full btn btn-secondary"
            >
              <Icon name="command" />
              Command Palette
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Kategori
            </h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category === 'Semua' ? null : category)}
                  className={`sidebar-item w-full text-left ${
                    (category === 'Semua' && !selectedCategory) || selectedCategory === category
                      ? 'active' : ''
                  }`}
                >
                  <Icon name="bookmark" size={14} />
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Toggle */}
          <div className="mb-6">
            <button
              onClick={() => onShowFavoritesChange(!showFavorites)}
              className={`sidebar-item w-full text-left ${showFavorites ? 'active' : ''}`}
            >
              <Icon name="star" size={14} />
              Favorit
            </button>
          </div>

          {/* Popular Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Tag Populer
            </h3>
            <div className="space-y-1">
              {tags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      onTagsChange(selectedTags.filter(t => t !== tag));
                    } else {
                      onTagsChange([...selectedTags, tag]);
                    }
                  }}
                  className={`sidebar-item w-full text-left ${
                    selectedTags.includes(tag) ? 'active' : ''
                  }`}
                >
                  <Icon name="tag" size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleThemeChange('light')}
                className={`audio-control ${prefs.theme === 'light' ? 'active' : ''}`}
              >
                <Icon name="sun" size={14} />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`audio-control ${prefs.theme === 'dark' ? 'active' : ''}`}
              >
                <Icon name="moon" size={14} />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`audio-control ${prefs.theme === 'system' ? 'active' : ''}`}
              >
                <Icon name="monitor" size={14} />
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mt-4">
            <NotificationSettings />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari doa atau zikir..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Focus Mode Button */}
              {onToggleFocusMode && (
                <button
                  onClick={onToggleFocusMode}
                  className="btn btn-primary"
                  title="Aktifkan Focus Mode"
                >
                  <Icon name="eye" />
                  Focus
                </button>
              )}

              <button className="btn btn-secondary">
                <Icon name="upload" />
                Import
              </button>
              <button className="btn btn-secondary">
                <Icon name="download" />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}