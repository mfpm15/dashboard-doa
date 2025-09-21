'use client';

import React, { useState } from 'react';
import { AudioTrack, Item } from '@/types';
import { Icon } from '@/components/ui/Icon';
import {
  generateArabicAudio,
  generateIndonesianAudio,
  checkTTSAvailability,
  TTSOptions
} from '@/lib/audio/aiGeneration';
import { updateItem } from '@/lib/storage';

interface AudioGeneratorProps {
  item: Item;
  onAudioGenerated?: (track: AudioTrack) => void;
  className?: string;
}

export function AudioGenerator({ item, onAudioGenerated, className = '' }: AudioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availability = checkTTSAvailability();

  const generateAudio = async (type: 'arabic' | 'indonesian', customOptions?: Partial<TTSOptions>) => {
    if (isGenerating) return;

    const text = type === 'arabic' ? item.arabic : item.translation_id;
    if (!text?.trim()) {
      setError(`No ${type} text available for this prayer`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress('Preparing audio generation...');

    try {
      setProgress('Generating audio with AI...');

      const result = type === 'arabic'
        ? await generateArabicAudio(text, customOptions)
        : await generateIndonesianAudio(text, customOptions);

      setProgress('Creating audio track...');

      const audioTrack: AudioTrack = {
        id: `track_${Date.now()}_${type}`,
        title: `${item.title} (${type === 'arabic' ? 'Arabic' : 'Indonesian'})`,
        url: URL.createObjectURL(result.audioBlob),
        blobId: result.blobId,
        duration: result.duration,
        peaks: result.peaks,
        segments: [],
        reciter: type === 'arabic' ? 'AI Generated (Arabic)' : 'AI Generated (Indonesian)',
        language: type === 'arabic' ? 'Arabic' : 'Indonesian',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      setProgress('Saving to database...');

      // Add audio track to item
      const updatedAudio = [...(item.audio || []), audioTrack];
      await updateItem(item.id, { audio: updatedAudio });

      setProgress('Audio generated successfully!');
      onAudioGenerated?.(audioTrack);

      // Clear progress after success
      setTimeout(() => {
        setProgress('');
      }, 2000);

    } catch (error) {
      console.error('Audio generation failed:', error);
      setError((error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!availability.available) {
    return (
      <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Icon name="alert" className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              Audio Generation Not Available
            </h3>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              {availability.recommendations.map((rec, i) => (
                <p key={i}>{rec}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
          Generate Audio with AI
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create high-quality audio pronunciation using AI text-to-speech
        </p>
      </div>

      {/* Progress/Error Display */}
      {(progress || error) && (
        <div className={`mb-4 p-3 rounded-lg ${
          error
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            ) : error ? (
              <Icon name="alert" size={16} className="text-red-600 dark:text-red-400" />
            ) : (
              <Icon name="check" size={16} className="text-green-600 dark:text-green-400" />
            )}
            <span className={`text-sm ${
              error
                ? 'text-red-700 dark:text-red-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {error || progress}
            </span>
          </div>
        </div>
      )}

      {/* Generation Options */}
      <div className="space-y-3">
        {/* Arabic Audio */}
        {item.arabic && (
          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-slate-900 dark:text-slate-100">
                Arabic Audio
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Generate pronunciation for Arabic text
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                {item.arabic.substring(0, 100)}...
              </div>
            </div>
            <button
              onClick={() => generateAudio('arabic')}
              disabled={isGenerating}
              className="btn btn-secondary ml-3"
            >
              <Icon name="sparkles" size={16} />
              Generate
            </button>
          </div>
        )}

        {/* Indonesian Audio */}
        {item.translation_id && (
          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-slate-900 dark:text-slate-100">
                Indonesian Audio
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Generate pronunciation for Indonesian translation
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                {item.translation_id.substring(0, 100)}...
              </div>
            </div>
            <button
              onClick={() => generateAudio('indonesian')}
              disabled={isGenerating}
              className="btn btn-secondary ml-3"
            >
              <Icon name="sparkles" size={16} />
              Generate
            </button>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <details className="mt-4">
        <summary className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
          Advanced Options
        </summary>
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Voice Speed
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              defaultValue="0.8"
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Voice Pitch
            </label>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.1"
              defaultValue="1.0"
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </details>

      {/* Current Audio Tracks */}
      {item.audio && item.audio.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            Existing Audio Tracks
          </h4>
          <div className="space-y-2">
            {item.audio.map(track => (
              <div
                key={track.id}
                className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded"
              >
                <Icon name="volume" size={14} className="text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {track.title}
                </span>
                {track.duration && (
                  <span className="text-xs text-slate-400">
                    {typeof track.duration === 'number'
                      ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60).toString().padStart(2, '0')}`
                      : track.duration
                    }
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TTS Info */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1 mb-1">
            <Icon name="info" size={12} />
            Available methods: {availability.methods.join(', ')}
          </div>
          <div>
            Audio generated using AI text-to-speech technology
          </div>
        </div>
      </div>
    </div>
  );
}