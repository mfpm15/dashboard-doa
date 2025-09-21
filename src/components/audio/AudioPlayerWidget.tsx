'use client';

import React, { useState, useEffect } from 'react';
import { Item, AudioTrack } from '@/types';
import { Play, Pause, Volume2 } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Auto-select first audio track if available
  useEffect(() => {
    if (item.audio && item.audio.length > 0 && !selectedTrack) {
      setSelectedTrack(item.audio[0]);
    }
  }, [item.audio, selectedTrack]);

  // Initialize audio element when track changes
  useEffect(() => {
    if (selectedTrack) {
      const audioElement = new Audio(selectedTrack.url);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [selectedTrack]);

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  if (!item.audio || item.audio.length === 0) {
    return (
      <div className={`audio-player-widget ${className}`}>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Belum ada audio untuk doa ini
          </p>
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
                <Volume2 className="w-4 h-4" />
                {track.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simple Audio Player */}
      {selectedTrack && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="flex-shrink-0 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {selectedTrack.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Audio Track
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}