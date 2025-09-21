'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../ui/Icon';
import { WaveformCanvas } from './WaveformCanvas';
import { audioStorage, AudioFile, createObjectURL, revokeObjectURL } from '@/lib/audio/audioStorage';
import { toast } from '../ui/Toast';

interface EnhancedAudioPlayerProps {
  itemId: string;
  title: string;
  audioFiles?: AudioFile[];
  onAudioFilesChange?: (files: AudioFile[]) => void;
  className?: string;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLooping: boolean;
  loopStart?: number;
  loopEnd?: number;
}

export function NewEnhancedAudioPlayer({
  itemId,
  title,
  audioFiles = [],
  onAudioFilesChange,
  className = ''
}: EnhancedAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isLooping: false,
  });

  // Initialize audio storage
  useEffect(() => {
    audioStorage.initialize().catch(console.error);
  }, []);

  // Load audio files for this item
  useEffect(() => {
    loadAudioFiles();
  }, [itemId]);

  // Cleanup audio URL when component unmounts or audio changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const loadAudioFiles = async () => {
    try {
      const files = await audioStorage.getAudioFilesForItem(itemId);
      if (onAudioFilesChange) {
        onAudioFilesChange(files);
      }
      if (files.length > 0 && !selectedAudio) {
        selectAudio(files[0]);
      }
    } catch (error) {
      console.error('Failed to load audio files:', error);
    }
  };

  const selectAudio = async (audioFile: AudioFile) => {
    try {
      setIsLoading(true);

      // Cleanup previous URL
      if (audioUrl) {
        revokeObjectURL(audioUrl);
      }

      // Create new object URL
      const url = await createObjectURL(audioFile);
      setAudioUrl(url);
      setSelectedAudio(audioFile);

      // Generate waveform data
      await generateWaveform(audioFile.blob);

    } catch (error) {
      console.error('Failed to select audio:', error);
      toast.error('Gagal memuat audio');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWaveform = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const samples = 100; // Number of waveform bars
      const blockSize = Math.floor(channelData.length / samples);
      const waveform: number[] = [];

      for (let i = 0; i < samples; i++) {
        const start = i * blockSize;
        const end = start + blockSize;
        let sum = 0;

        for (let j = start; j < end; j++) {
          sum += Math.abs(channelData[j]);
        }

        waveform.push(sum / blockSize);
      }

      // Normalize to 0-1 range
      const max = Math.max(...waveform);
      const normalized = waveform.map(val => val / max);
      setWaveformData(normalized);

    } catch (error) {
      console.error('Failed to generate waveform:', error);
      // Fallback: generate random waveform
      setWaveformData(Array.from({ length: 100 }, () => Math.random()));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('File harus berformat audio');
        return;
      }

      // Store in IndexedDB
      const audioId = await audioStorage.storeAudioFile({
        itemId,
        type: 'recitation',
        format: file.type.includes('mp3') ? 'mp3' : 'wav',
        blob: file,
        size: file.size,
      });

      // Reload audio files
      await loadAudioFiles();

      toast.success('Audio berhasil disimpan');

    } catch (error) {
      console.error('Failed to upload audio:', error);
      toast.error('Gagal menyimpan audio');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (playbackState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const currentTime = audio.currentTime;

    setPlaybackState(prev => ({
      ...prev,
      currentTime,
      duration: audio.duration || 0
    }));

    // Handle A-B loop
    if (playbackState.isLooping && playbackState.loopEnd && currentTime >= playbackState.loopEnd) {
      audio.currentTime = playbackState.loopStart || 0;
    }
  }, [playbackState.isLooping, playbackState.loopStart, playbackState.loopEnd]);

  const handlePlayStateChange = useCallback(() => {
    if (!audioRef.current) return;

    setPlaybackState(prev => ({
      ...prev,
      isPlaying: !audioRef.current!.paused
    }));
  }, []);

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setPlaybackState(prev => ({ ...prev, volume }));
  };

  const setPlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackState(prev => ({ ...prev, playbackRate: rate }));
  };

  const deleteAudio = async (audioFile: AudioFile) => {
    try {
      await audioStorage.deleteAudioFile(audioFile.id);
      await loadAudioFiles();

      if (selectedAudio?.id === audioFile.id) {
        setSelectedAudio(null);
        setAudioUrl(null);
        setWaveformData([]);
      }

      toast.success('Audio berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete audio:', error);
      toast.error('Gagal menghapus audio');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Audio: {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {audioFiles.length} file tersimpan
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
        >
          <Icon name="upload" className="w-4 h-4" />
          Upload Audio
        </button>
      </div>

      {/* Audio File Selection */}
      {audioFiles.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Pilih Audio:
          </label>
          <div className="flex gap-2 flex-wrap">
            {audioFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => selectAudio(file)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  selectedAudio?.id === file.id
                    ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                {file.type} ({file.format})
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAudio(file);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Icon name="x" className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio Player */}
      {selectedAudio && audioUrl && (
        <div className="space-y-4">
          {/* Waveform */}
          <WaveformCanvas
            data={waveformData}
            currentTime={playbackState.currentTime}
            duration={playbackState.duration}
            loopStart={playbackState.loopStart}
            loopEnd={playbackState.loopEnd}
            onSeek={seekTo}
            onSetLoopStart={(time) => setPlaybackState(prev => ({ ...prev, loopStart: time }))}
            onSetLoopEnd={(time) => setPlaybackState(prev => ({ ...prev, loopEnd: time }))}
            className="h-24"
          />

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-full transition-colors"
            >
              <Icon name={playbackState.isPlaying ? 'pause' : 'play'} className="w-6 h-6" />
            </button>

            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                <span>{formatTime(playbackState.currentTime)}</span>
                <span>{formatTime(playbackState.duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={playbackState.duration || 0}
                value={playbackState.currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="flex items-center gap-4 text-sm">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <Icon name="volume-2" className="w-4 h-4 text-slate-500" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={playbackState.volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none"
              />
            </div>

            {/* Speed */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Speed:</span>
              <select
                value={playbackState.playbackRate}
                onChange={(e) => setPlaybackRate(Number(e.target.value))}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={1.75}>1.75x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlayStateChange}
            onPause={handlePlayStateChange}
            onLoadedMetadata={handlePlayStateChange}
            preload="metadata"
          />
        </div>
      )}

      {/* Empty State */}
      {audioFiles.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <Icon name="music" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada audio untuk doa ini</p>
          <p className="text-sm">Upload file audio untuk mulai mendengarkan</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}