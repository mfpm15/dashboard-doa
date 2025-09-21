'use client';

import React, { useState, useEffect } from 'react';
import { Item, Prefs, AudioTrack } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { AudioPlayerWidget } from '@/components/audio/AudioPlayerWidget';
import { trackPrayerRead, analytics } from '@/lib/analytics';

interface PrayerCardViewProps {
  items: Item[];
  prefs: Prefs;
  onEdit: (item: Item) => void;
  onItemsChange?: () => void;
  onOpenAIAssist?: (item: Item) => void;
  onOpenReadingMode?: (item: Item) => void;
}

export function PrayerCardView({
  items,
  prefs,
  onEdit,
  onItemsChange,
  onOpenAIAssist,
  onOpenReadingMode
}: PrayerCardViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());

  // Initialize analytics
  useEffect(() => {
    analytics.initialize();
  }, []);

  // Track when items are viewed/read
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId && !viewedItems.has(itemId)) {
              const item = items.find(i => i.id === itemId);
              if (item) {
                trackPrayerRead(item);
                setViewedItems(prev => new Set([...prev, itemId]));
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all item cards
    const itemCards = document.querySelectorAll('[data-item-id]');
    itemCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [items, viewedItems]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isExpanded = (itemId: string) => expandedItems.has(itemId);

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
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group"
            data-item-id={item.id}
          >
            {/* Card Header - Always Visible */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                    {item.favorite && (
                      <Icon name="star" className="text-yellow-500" size={14} />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAIAssist?.(item);
                    }}
                    className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    title="Tanya AI"
                  >
                    <Icon name="sparkles" size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenReadingMode?.(item);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Reading Mode"
                  >
                    <Icon name="book-open" size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-2 text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="space-y-2">
                {item.arabic && (
                  <div className="text-right">
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 arabic" lang="ar" dir="rtl">
                      {item.arabic}
                    </p>
                  </div>
                )}

                {item.translation_id && (
                  <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-2">
                    {item.translation_id}
                  </p>
                )}
              </div>

              {/* Tags Preview */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md"
                    >
                      <Icon name="tag" size={8} />
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatDate(item.updatedAt)}</span>
                  {item.audio && item.audio.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Icon name="volume" size={12} />
                      <span>{item.audio.length} audio</span>
                    </div>
                  )}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                >
                  <span>{isExpanded(item.id) ? 'Tutup' : 'Baca'}</span>
                  <Icon
                    name={isExpanded(item.id) ? 'chevron-up' : 'chevron-down'}
                    size={14}
                  />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded(item.id) && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-6 bg-slate-50 dark:bg-slate-800/50">
                {/* Full Arabic Text */}
                {item.arabic && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      نص عربي
                    </h4>
                    <div
                      className="arabic text-slate-900 dark:text-slate-100 leading-relaxed"
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

                {/* Transliteration */}
                {item.latin && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      Transliterasi
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                      {item.latin}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {item.translation_id && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      Terjemahan
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.translation_id}
                    </p>
                  </div>
                )}

                {/* All Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                        >
                          <Icon name="tag" size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio Player */}
                <div>
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    Audio Player
                  </h4>
                  <AudioPlayerWidget
                    item={item}
                    onItemUpdate={(updatedItem) => {
                      onItemsChange?.();
                    }}
                    className="bg-white dark:bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Source */}
                {item.source && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                      <Icon name="book-open" size={14} className="inline mr-2" />
                      Sumber: {item.source}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}