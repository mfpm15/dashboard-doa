'use client';

import React, { useState } from 'react';
import { Item, Prefs, AudioTrack } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { AudioGenerator } from '@/components/audio/AudioGenerator';
import { loadItems } from '@/lib/storage';

interface DataTableProps {
  items: Item[];
  prefs: Prefs;
  onEdit: (item: Item) => void;
  onPrefsChange: (prefs: Partial<Prefs>) => void;
  onItemsChange?: () => void;
  onOpenAIAssist?: (item: Item) => void;
  onOpenReadingMode?: (item: Item) => void;
}

export function DataTable({ items, prefs, onEdit, onPrefsChange, onItemsChange, onOpenAIAssist, onOpenReadingMode }: DataTableProps) {
  const [expandedAudio, setExpandedAudio] = useState<Record<string, boolean>>({});
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<Record<string, AudioTrack | undefined>>({});

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleAudioExpanded = (itemId: string) => {
    setExpandedAudio(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAudioGenerated = (itemId: string, track: AudioTrack) => {
    // Refresh items data
    onItemsChange?.();

    // Select the newly generated track
    setSelectedAudioTrack(prev => ({
      ...prev,
      [itemId]: track
    }));
  };

  const handleTrackSelect = (itemId: string, track: AudioTrack) => {
    setSelectedAudioTrack(prev => ({
      ...prev,
      [itemId]: track
    }));
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
                  onClick={() => onOpenAIAssist?.(item)}
                  className="btn-ghost p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  title="Tanya AI tentang doa ini"
                >
                  <Icon name="sparkles" size={16} />
                </button>
                <button
                  onClick={() => onOpenReadingMode?.(item)}
                  className="btn-ghost p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Buka Reading Mode"
                >
                  <Icon name="book-open" size={16} />
                </button>
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

            {/* Audio Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Icon name="volume" size={14} />
                  Audio
                  {item.audio && item.audio.length > 0 && (
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full text-xs">
                      {item.audio.length}
                    </span>
                  )}
                </h4>
                <button
                  onClick={() => toggleAudioExpanded(item.id)}
                  className="btn-ghost p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <Icon
                    name={expandedAudio[item.id] ? "chevron-up" : "chevron-down"}
                    size={16}
                  />
                </button>
              </div>

              {/* Audio Track Selection */}
              {item.audio && item.audio.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {item.audio.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleTrackSelect(item.id, track)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedAudioTrack[item.id]?.id === track.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        <Icon name="volume" size={12} />
                        <span className="truncate max-w-32">{track.title}</span>
                        {track.duration && (
                          <span className="text-xs opacity-75">
                            {typeof track.duration === 'number'
                              ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60).toString().padStart(2, '0')}`
                              : track.duration
                            }
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {selectedAudioTrack[item.id] && (
                <div className="mb-4">
                  <AudioPlayer
                    track={selectedAudioTrack[item.id]}
                    className="bg-slate-50 dark:bg-slate-700/50"
                  />
                </div>
              )}

              {/* Expanded Audio Controls */}
              {expandedAudio[item.id] && (
                <div className="space-y-4">
                  {/* Audio Generator */}
                  <AudioGenerator
                    item={item}
                    onAudioGenerated={(track) => handleAudioGenerated(item.id, track)}
                    className="bg-slate-50 dark:bg-slate-700/50"
                  />
                </div>
              )}

              {/* Quick Generate Buttons (when collapsed) */}
              {!expandedAudio[item.id] && (
                <div className="flex gap-2">
                  {item.arabic && (
                    <button
                      onClick={() => {
                        setExpandedAudio(prev => ({ ...prev, [item.id]: true }));
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Icon name="sparkles" size={12} />
                      Generate Arabic
                    </button>
                  )}
                  {item.translation_id && (
                    <button
                      onClick={() => {
                        setExpandedAudio(prev => ({ ...prev, [item.id]: true }));
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Icon name="sparkles" size={12} />
                      Generate Indonesian
                    </button>
                  )}
                </div>
              )}
            </div>

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