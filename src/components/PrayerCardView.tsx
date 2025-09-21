'use client';

import React, { useState, useEffect } from 'react';
import { Item, Prefs } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { trackPrayerRead, analytics } from '@/lib/analytics';

interface PrayerCardViewProps {
  items: Item[];
  prefs: Prefs;
  onEdit: (item: Item) => void;
  onItemsChange?: () => void;
  onOpenAIAssist?: (item: Item) => void;
  onOpenReadingMode?: (item: Item) => void;
  onOpenAudioPlayer?: (item: Item, track?: any) => void;
}

export function PrayerCardView({
  items,
  prefs,
  onEdit,
  onItemsChange,
  onOpenAIAssist,
  onOpenReadingMode,
  onOpenAudioPlayer
}: PrayerCardViewProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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
    setExpandedItem(prev => prev === itemId ? null : itemId);

    // Scroll to the expanded item after a short delay to allow rendering
    setTimeout(() => {
      const element = document.querySelector(`[data-item-id="${itemId}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const isExpanded = (itemId: string) => expandedItem === itemId;

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
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200 ${
              isExpanded(item.id)
                ? 'rounded-lg shadow-lg border-primary-200 dark:border-primary-700'
                : 'rounded-lg shadow-sm hover:shadow-md'
            }`}
            data-item-id={item.id}
          >
            {/* Accordion Header - Always Visible */}
            <div
              className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    {item.favorite && (
                      <Icon name="star" className="text-yellow-500" size={16} />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                    <span>{formatDate(item.updatedAt)}</span>
                    {item.audio && item.audio.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon name="volume" size={12} />
                        <span>{item.audio.length} audio</span>
                      </div>
                    )}
                  </div>

                  {/* Preview - Only when collapsed */}
                  {!isExpanded(item.id) && (
                    <div className="mt-2 text-slate-600 dark:text-slate-400 text-sm line-clamp-1">
                      {item.translation_id || item.arabic}
                    </div>
                  )}
                </div>

                {/* Action Buttons & Expand Arrow */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
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
                    {item.audio && item.audio.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAudioPlayer?.(item, item.audio[0]);
                        }}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Audio Player"
                      >
                        <Icon name="play" size={16} />
                      </button>
                    )}
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

                  <Icon
                    name={isExpanded(item.id) ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    className="text-slate-400 transition-transform duration-200"
                  />
                </div>
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

                {/* Audio Status - Minimalist */}
                {item.audio && item.audio.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      Audio
                    </h4>
                    <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Icon name="volume" size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.audio.length} file audio tersedia
                      </span>
                    </div>
                  </div>
                )}

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