'use client';

import React from 'react';
import { Item, Prefs } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface DataTableProps {
  items: Item[];
  prefs: Prefs;
  onEdit: (item: Item) => void;
  onPrefsChange: (prefs: Partial<Prefs>) => void;
}

export function DataTable({ items, prefs, onEdit, onPrefsChange }: DataTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Icon name="book-open" size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Belum ada doa
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Mulai tambahkan doa dan zikir pertama Anda
          </p>
          <button className="btn btn-primary">
            <Icon name="plus" />
            Tambah Doa Pertama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span>{formatDate(item.updatedAt)}</span>
                  {item.favorite && (
                    <Icon name="star" className="text-yellow-500" size={14} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="btn-ghost p-2"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button className="btn-ghost p-2">
                  <Icon name="more-horizontal" size={16} />
                </button>
              </div>
            </div>

            {item.arabic && (
              <div className="mb-4">
                <div
                  className="arabic text-slate-900 dark:text-slate-100"
                  lang="ar"
                  dir="rtl"
                  style={{
                    fontSize: `${prefs.arabicFontSize}px`,
                    lineHeight: prefs.arabicLineHeight
                  }}
                >
                  {item.arabic}
                </div>
              </div>
            )}

            {item.latin && (
              <div className="mb-4">
                <p className="latin text-slate-600 dark:text-slate-400">
                  {item.latin}
                </p>
              </div>
            )}

            {item.translation_id && (
              <div className="mb-4">
                <p className="text-slate-700 dark:text-slate-300">
                  {item.translation_id}
                </p>
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                    >
                      <Icon name="tag" size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.source && (
              <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                Sumber: {item.source}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}