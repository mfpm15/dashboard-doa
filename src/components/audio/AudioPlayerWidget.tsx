'use client';

import React, { useState, useEffect } from 'react';
import { Item, AudioTrack } from '@/types';
import { AudioPlayer } from './AudioPlayer';
import { AudioGenerator } from './AudioGenerator';

interface AudioPlayerWidgetProps {
  item: Item;
  onItemUpdate?: (item: Item) => void;
  className?: string;
}

export function AudioPlayerWidget({
  item,
  onItemUpdate,
  className = ''
}: AudioPlayerWidgetProps) {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);

  // Auto-select first audio track if available
  useEffect(() => {
    if (item.audio && item.audio.length > 0 && !selectedTrack) {
      setSelectedTrack(item.audio[0]);
    }
  }, [item.audio, selectedTrack]);

  if (!item.audio || item.audio.length === 0) {
    return (
      <div className={`audio-player-widget ${className}`}>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
            Belum ada audio untuk doa ini
          </p>
          <AudioGenerator
            item={item}
            onAudioGenerated={(track) => {
              if (onItemUpdate) {
                onItemUpdate({
                  ...item,
                  audio: [...(item.audio || []), track]
                });
              }
              setSelectedTrack(track);
            }}
            className="bg-slate-100 dark:bg-slate-700"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`audio-player-widget ${className}`}>
      {/* Audio Track Selection */}
      {item.audio.length > 1 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {item.audio.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedTrack?.id === track.id
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                🎵 {track.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio Player */}
      {selectedTrack && (
        <AudioPlayer
          track={selectedTrack}
          className="bg-slate-50 dark:bg-slate-700/50 rounded-lg"
        />
      )}
    </div>
  );
}