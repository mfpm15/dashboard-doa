'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { WaveformCanvas } from './WaveformCanvas';
import { attachAudioProcessing, ABLoop, setPlaybackSpeed } from '@/lib/audio/processing';

interface AudioPlayerProps {
  track?: AudioTrack;
  onTrackUpdate?: (track: AudioTrack) => void;
  className?: string;
}

export function AudioPlayer({ track, onTrackUpdate, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const processingRef = useRef<{ cleanup: () => void } | null>(null);
  const abLoopRef = useRef<ABLoop | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isProcessingEnabled, setIsProcessingEnabled] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Load audio blob from IndexedDB when track changes
  useEffect(() => {
    if (!track?.blobId) {
      setAudioUrl(null);
      return;
    }

    let cleanup: (() => void) | null = null;

    async function loadAudio() {
      try {
        const { getAudioBlob } = await import('@/lib/audio/audioDb');
        const blob = await getAudioBlob(track?.blobId || '');
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          cleanup = () => URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
        setAudioUrl(null);
      }
    }

    loadAudio();

    return () => {
      cleanup?.();
    };
  }, [track?.blobId]);

  // Setup audio processing when audio element is loaded
  useEffect(() => {
    if (!audioRef.current || !isProcessingEnabled) return;

    try {
      processingRef.current = attachAudioProcessing(audioRef.current);
      abLoopRef.current = new ABLoop(audioRef.current);
    } catch (error) {
      console.error('Failed to setup audio processing:', error);
      setIsProcessingEnabled(false);
    }

    return () => {
      processingRef.current?.cleanup();
      abLoopRef.current = null;
    };
  }, [audioUrl, isProcessingEnabled]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let timeUpdateTimeout: NodeJS.Timeout;

    const updateTime = () => {
      clearTimeout(timeUpdateTimeout);
      timeUpdateTimeout = setTimeout(() => {
        setCurrentTime(audio.currentTime);
      }, 100); // Throttle updates to 10 FPS for smoother performance
    };

    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => console.log('Audio loading started');
    const handleCanPlay = () => console.log('Audio can start playing');
    const handleError = (e: any) => console.error('Audio error:', e);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      clearTimeout(timeUpdateTimeout);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error);
    }
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, time));
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (newSpeed: number) => {
    if (!audioRef.current) return;
    setPlaybackSpeed(audioRef.current, newSpeed);
    setSpeed(newSpeed);
  };

  const setLoopPoint = (point: 'A' | 'B') => {
    if (!abLoopRef.current) return;
    abLoopRef.current.setLoopPoint(point);
  };

  const toggleLoop = () => {
    if (!abLoopRef.current) return;
    const newLoopState = abLoopRef.current.toggleLoop();
    setIsLooping(newLoopState);
  };

  const clearLoop = () => {
    if (!abLoopRef.current) return;
    abLoopRef.current.clearLoop();
    setIsLooping(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <div className={`text-center py-8 text-slate-500 dark:text-slate-400 ${className}`}>
        <Icon name="volume" size={48} className="mx-auto mb-2 opacity-50" />
        <p>Tidak ada audio tersedia</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${className}`}>
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          crossOrigin="anonymous"
        />
      )}

      {/* Track Info */}
      <div className="mb-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          {track.title}
        </h3>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {duration > 0 && `${formatTime(duration)} • `}
          {track.peaks?.length || 0} peaks
        </div>
      </div>

      {/* Waveform */}
      {track.peaks && (
        <WaveformCanvas
          data={track.peaks}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          segments={track.segments}
          className="mb-4"
        />
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="btn btn-primary flex items-center gap-2"
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={16} />
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div className="flex-1">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            disabled={!audioUrl}
          />
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {/* Volume Control */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">
            Volume
          </label>
          <div className="flex items-center gap-2">
            <Icon name={volume > 0 ? 'volume' : 'volume-off'} size={14} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">
            Speed {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="1.75"
            step="0.1"
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* A-B Loop Controls */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">
            A-B Loop
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLoopPoint('A')}
              className="audio-control"
              title="Set point A"
            >
              A
            </button>
            <button
              onClick={() => setLoopPoint('B')}
              className="audio-control"
              title="Set point B"
            >
              B
            </button>
            <button
              onClick={toggleLoop}
              className={`audio-control ${isLooping ? 'active' : ''}`}
              title="Toggle loop"
            >
              <Icon name="refresh" size={12} />
            </button>
            <button
              onClick={clearLoop}
              className="audio-control"
              title="Clear loop"
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        </div>

        {/* Audio Processing Toggle */}
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">
            Enhancement
          </label>
          <button
            onClick={() => setIsProcessingEnabled(!isProcessingEnabled)}
            className={`audio-control ${isProcessingEnabled ? 'active' : ''}`}
            title="Toggle audio enhancement"
          >
            <Icon name="zap" size={14} />
            {isProcessingEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <details className="mt-4">
        <summary className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
          Keyboard Shortcuts
        </summary>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div><kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">Space</kbd> Play/Pause</div>
          <div><kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">←/→</kbd> Skip ±5s</div>
          <div><kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">[/]</kbd> Speed ±0.1x</div>
          <div><kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">L</kbd> Toggle Loop</div>
          <div><kbd className="bg-slate-100 dark:bg-slate-700 px-1 rounded">M</kbd> Add Marker</div>
        </div>
      </details>
    </div>
  );
}