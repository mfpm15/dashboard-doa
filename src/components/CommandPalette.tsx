'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onNewItem?: () => void;
  onImportData?: () => void;
  onExportData?: () => void;
  onOpenSettings?: () => void;
  onItemsChange?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onNewItem,
  onImportData,
  onExportData,
  onOpenSettings,
  onItemsChange
}: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'commands'>('search');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setActiveTab('search');
    }
  }, [isOpen]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.arabic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const commands = [
    { id: 'new', label: 'Tambah doa baru', icon: 'plus' as const, handler: () => onNewItem?.() },
    { id: 'import', label: 'Import data', icon: 'upload' as const, handler: () => onImportData?.() },
    { id: 'export', label: 'Export data', icon: 'download' as const, handler: () => onExportData?.() },
    { id: 'settings', label: 'Pengaturan', icon: 'settings' as const, handler: () => onOpenSettings?.() },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
                  onClick={() => {
                    command.handler();
                    onClose();
                  }}
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