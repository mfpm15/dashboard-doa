'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
}

export function CommandPalette({ isOpen, onClose, items, onSelectItem }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'commands'>('search');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.arabic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const commands = [
    { id: 'new', label: 'Tambah doa baru', icon: 'plus' as const },
    { id: 'import', label: 'Import data', icon: 'upload' as const },
    { id: 'export', label: 'Export data', icon: 'download' as const },
    { id: 'settings', label: 'Pengaturan', icon: 'settings' as const },
  ];

  if (!isOpen) return null;

  return (
    <div className="command-palette" onClick={onClose}>
      <div className="command-palette-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Cari
            </button>
            <button
              onClick={() => setActiveTab('commands')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'commands'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Perintah
            </button>
          </div>

          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={activeTab === 'search' ? 'Cari doa...' : 'Ketik perintah...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {activeTab === 'search' ? (
            <div className="p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {item.title}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {item.category}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  {searchTerm ? 'Tidak ada hasil ditemukan' : 'Mulai mengetik untuk mencari...'}
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              {commands.map((command) => (
                <button
                  key={command.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Icon name={command.icon} className="text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {command.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}