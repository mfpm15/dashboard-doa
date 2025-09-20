'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '@/types';
import { addItem, updateItem } from '@/lib/storage';
import { Icon } from '@/components/ui/Icon';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Item | null;
  categories: string[];
  onSave: () => void;
}

export function FormModal({ isOpen, onClose, item, categories, onSave }: FormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    arabic: '',
    latin: '',
    translation_id: '',
    category: '',
    tags: [] as string[],
    source: '',
    favorite: false
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        arabic: item.arabic || '',
        latin: item.latin || '',
        translation_id: item.translation_id || '',
        category: item.category || '',
        tags: item.tags || [],
        source: item.source || '',
        favorite: item.favorite || false
      });
    } else {
      setFormData({
        title: '',
        arabic: '',
        latin: '',
        translation_id: '',
        category: categories[0] || '',
        tags: [],
        source: '',
        favorite: false
      });
    }
  }, [item, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (item) {
        updateItem(item.id, formData);
      } else {
        addItem(formData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {item ? 'Edit Doa' : 'Tambah Doa Baru'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Icon name="x" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Judul *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Teks Arab
            </label>
            <textarea
              value={formData.arabic}
              onChange={(e) => setFormData(prev => ({ ...prev, arabic: e.target.value }))}
              className="textarea arabic"
              lang="ar"
              dir="rtl"
              placeholder="أدخل النص العربي هنا..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Transliterasi Latin
            </label>
            <textarea
              value={formData.latin}
              onChange={(e) => setFormData(prev => ({ ...prev, latin: e.target.value }))}
              className="textarea"
              placeholder="Masukkan transliterasi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Terjemahan Indonesia
            </label>
            <textarea
              value={formData.translation_id}
              onChange={(e) => setFormData(prev => ({ ...prev, translation_id: e.target.value }))}
              className="textarea"
              placeholder="Masukkan terjemahan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Kategori *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="input"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-red-500"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ketik tag dan tekan Enter"
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sumber
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              className="input"
              placeholder="HR Muslim, QS Al-Baqarah: 255, dll."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.favorite}
              onChange={(e) => setFormData(prev => ({ ...prev, favorite: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded focus-ring"
            />
            <label htmlFor="favorite" className="text-sm text-slate-600 dark:text-slate-400">
              Tandai sebagai favorit
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {item ? 'Simpan Perubahan' : 'Tambah Doa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}