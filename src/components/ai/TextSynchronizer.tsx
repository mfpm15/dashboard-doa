'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Item, AudioTrack, AudioSegment } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { updateItem } from '@/lib/storage';
import { toast } from '@/components/ui/Toast';

interface TextSynchronizerProps {
  item: Item;
  audioTrack: AudioTrack;
  onUpdate?: (track: AudioTrack) => void;
  className?: string;
}

interface WordSegment {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

interface TextSyncState {
  mode: 'arabic' | 'latin' | 'translation';
  isRecording: boolean;
  isPlaying: boolean;
  currentTime: number;
  segments: AudioSegment[];
  selectedWords: string[];
  editingSegment: AudioSegment | null;
}

export function TextSynchronizer({
  item,
  audioTrack,
  onUpdate,
  className = ''
}: TextSynchronizerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<TextSyncState>({
    mode: 'arabic',
    isRecording: false,
    isPlaying: false,
    currentTime: 0,
    segments: audioTrack.segments || [],
    selectedWords: [],
    editingSegment: null
  });

  // Load audio blob
  useEffect(() => {
    async function loadAudio() {
      try {
        const { getAudioBlob } = await import('@/lib/audio/audioDb');
        const blob = await getAudioBlob(audioTrack.blobId || '');
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    }

    loadAudio();
  }, [audioTrack.blobId]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setSyncState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handlePlay = () => {
      setSyncState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setSyncState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const getText = () => {
    switch (syncState.mode) {
      case 'arabic':
        return item.arabic || '';
      case 'latin':
        return item.latin || '';
      case 'translation':
        return item.translation_id || '';
      default:
        return '';
    }
  };

  const getWords = () => {
    const text = getText();
    return text.split(/\s+/).filter(word => word.trim());
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (syncState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const seekToTime = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  const createSegment = () => {
    if (syncState.selectedWords.length === 0) {
      toast.error('Pilih kata-kata terlebih dahulu');
      return;
    }

    const startTime = syncState.currentTime;
    const segmentText = syncState.selectedWords.join(' ');

    const newSegment: AudioSegment = {
      id: `segment_${Date.now()}`,
      start: startTime,
      end: startTime + 2, // Default 2 seconds
      label: segmentText,
      confidence: 1.0
    };

    setSyncState(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment],
      selectedWords: [],
      editingSegment: newSegment
    }));
  };

  const updateSegmentEnd = () => {
    if (!syncState.editingSegment) return;

    const updatedSegments = syncState.segments.map(segment =>
      segment.id === syncState.editingSegment!.id
        ? { ...segment, end: syncState.currentTime }
        : segment
    );

    setSyncState(prev => ({
      ...prev,
      segments: updatedSegments,
      editingSegment: null
    }));
  };

  const deleteSegment = (segmentId: string) => {
    setSyncState(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s.id !== segmentId),
      editingSegment: null
    }));
  };

  const toggleWordSelection = (word: string, index: number) => {
    setSyncState(prev => {
      const isSelected = prev.selectedWords.includes(word);
      if (isSelected) {
        return {
          ...prev,
          selectedWords: prev.selectedWords.filter(w => w !== word)
        };
      } else {
        return {
          ...prev,
          selectedWords: [...prev.selectedWords, word]
        };
      }
    });
  };

  const saveSegments = async () => {
    try {
      const updatedTrack = {
        ...audioTrack,
        segments: syncState.segments,
        updatedAt: Date.now()
      };

      const updatedAudio = item.audio?.map(track =>
        track.id === audioTrack.id ? updatedTrack : track
      ) || [updatedTrack];

      await updateItem(item.id, { audio: updatedAudio });
      onUpdate?.(updatedTrack);
      toast.success('Sinkronisasi teks berhasil disimpan');
    } catch (error) {
      console.error('Failed to save segments:', error);
      toast.error('Gagal menyimpan sinkronisasi');
    }
  };

  const autoSync = async () => {
    // Simulate AI-powered auto-synchronization
    toast.info('Fitur auto-sync sedang dalam pengembangan');

    // In a real implementation, this would:
    // 1. Send audio to speech recognition API
    // 2. Get word-level timestamps
    // 3. Match with text
    // 4. Create segments automatically
  };

  const getSegmentAtTime = (time: number) => {
    return syncState.segments.find(segment =>
      time >= segment.start && time <= segment.end
    );
  };

  const words = getWords();
  const currentSegment = getSegmentAtTime(syncState.currentTime);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {/* Audio Element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Text Synchronization
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sinkronkan audio dengan teks untuk pengalaman belajar yang lebih baik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={autoSync}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Icon name="zap" size={16} />
            Auto Sync
          </button>
          <button
            onClick={saveSegments}
            className="btn btn-primary flex items-center gap-2"
          >
            <Icon name="save" size={16} />
            Simpan
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'arabic', label: 'Teks Arab', available: !!item.arabic },
          { key: 'latin', label: 'Transliterasi', available: !!item.latin },
          { key: 'translation', label: 'Terjemahan', available: !!item.translation_id }
        ].map(mode => (
          <button
            key={mode.key}
            onClick={() => setSyncState(prev => ({ ...prev, mode: mode.key as any }))}
            disabled={!mode.available}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              syncState.mode === mode.key
                ? 'bg-primary-500 text-white'
                : mode.available
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Audio Controls */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={togglePlayPause}
            disabled={!audioUrl}
            className="btn btn-primary"
          >
            <Icon name={syncState.isPlaying ? 'pause' : 'play'} size={16} />
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={audioTrack.duration || 0}
              value={syncState.currentTime}
              onChange={(e) => seekToTime(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 min-w-20">
            {Math.floor(syncState.currentTime / 60)}:
            {Math.floor(syncState.currentTime % 60).toString().padStart(2, '0')} /
            {typeof audioTrack.duration === 'number'
              ? `${Math.floor(audioTrack.duration / 60)}:${Math.floor(audioTrack.duration % 60).toString().padStart(2, '0')}`
              : audioTrack.duration || '0:00'
            }
          </span>
        </div>

        {/* Segment Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={createSegment}
            disabled={syncState.selectedWords.length === 0}
            className="btn btn-secondary btn-sm"
          >
            <Icon name="plus" size={14} />
            Buat Segmen ({syncState.selectedWords.length})
          </button>
          {syncState.editingSegment && (
            <button
              onClick={updateSegmentEnd}
              className="btn btn-primary btn-sm"
            >
              <Icon name="check" size={14} />
              Selesai Edit
            </button>
          )}
          {currentSegment && (
            <div className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-sm">
              Segmen aktif: {currentSegment.label}
            </div>
          )}
        </div>
      </div>

      {/* Text with Word Selection */}
      <div className="mb-6">
        <div
          className={`text-lg leading-relaxed p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg ${
            syncState.mode === 'arabic' ? 'text-right' : 'text-left'
          }`}
          dir={syncState.mode === 'arabic' ? 'rtl' : 'ltr'}
        >
          {words.map((word, index) => {
            const isSelected = syncState.selectedWords.includes(word);
            const inCurrentSegment = currentSegment?.label?.includes(word);

            return (
              <span
                key={`${word}-${index}`}
                onClick={() => toggleWordSelection(word, index)}
                className={`cursor-pointer transition-colors inline-block mx-1 px-1 rounded ${
                  isSelected
                    ? 'bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100'
                    : inCurrentSegment
                    ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Klik kata-kata untuk memilih, lalu buat segmen audio yang sesuai
        </p>
      </div>

      {/* Segments List */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Segmen Audio ({syncState.segments.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {syncState.segments.map((segment) => (
            <div
              key={segment.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                syncState.editingSegment?.id === segment.id
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                  : currentSegment?.id === segment.id
                  ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {segment.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {segment.start.toFixed(1)}s - {segment.end.toFixed(1)}s
                  {segment.confidence && ` (${Math.round(segment.confidence * 100)}%)`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => seekToTime(segment.start)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  title="Putar dari awal segmen"
                >
                  <Icon name="play" size={14} />
                </button>
                <button
                  onClick={() => setSyncState(prev => ({ ...prev, editingSegment: segment }))}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  title="Edit segmen"
                >
                  <Icon name="edit" size={14} />
                </button>
                <button
                  onClick={() => deleteSegment(segment.id || '')}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="Hapus segmen"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))}
          {syncState.segments.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Icon name="layers" size={32} className="mx-auto mb-2 opacity-50" />
              <p>Belum ada segmen audio</p>
              <p className="text-sm">Pilih kata dan buat segmen untuk memulai sinkronisasi</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Tips Sinkronisasi:
        </h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Pilih kata-kata yang ingin disinkronkan</li>
          <li>• Posisikan audio di awal kata, lalu klik "Buat Segmen"</li>
          <li>• Putar audio dan klik "Selesai Edit" di akhir kata</li>
          <li>• Ulangi untuk semua bagian teks</li>
        </ul>
      </div>
    </div>
  );
}