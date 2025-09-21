'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioTrack, Item } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { WaveformCanvas } from './WaveformCanvas';
import { attachAudioProcessing, ABLoop, setPlaybackSpeed, VoiceRecorder } from '@/lib/audio/processing';
import { audioStorage, createObjectURL, revokeObjectURL } from '@/lib/audio/audioStorage';

interface MasterAudioPlayerProps {
  item: Item;
  selectedTrack?: AudioTrack;
  onTrackUpdate?: (track: AudioTrack) => void;
  onItemUpdate?: (item: Item) => void;
  className?: string;
}

export function MasterAudioPlayer({
  item,
  selectedTrack,
  onTrackUpdate,
  onItemUpdate,
  className = ''
}: MasterAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const processingRef = useRef<{ cleanup: () => void } | null>(null);
  const abLoopRef = useRef<ABLoop | null>(null);
  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio Processing State
  const [isProcessingEnabled, setIsProcessingEnabled] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // A-B Loop State
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // UI State
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showVoiceFeatures, setShowVoiceFeatures] = useState(false);

  // Load audio from IndexedDB
  useEffect(() => {
    if (!selectedTrack?.blobId) {
      setAudioUrl(null);
      setWaveformData([]);
      return;
    }

    let cleanup: (() => void) | null = null;

    async function loadAudio() {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize audio storage
        await audioStorage.initialize();

        // Get audio file from IndexedDB
        const audioFile = await audioStorage.getAudioFile(selectedTrack.blobId);

        if (!audioFile) {
          throw new Error('Audio file not found');
        }

        // Create object URL
        const url = await createObjectURL(audioFile);
        setAudioUrl(url);

        // Generate waveform data if not available
        if (!selectedTrack.waveformData || selectedTrack.waveformData.length === 0) {
          const waveform = await generateWaveformData(audioFile.blob);
          setWaveformData(waveform);

          // Update track with waveform data
          if (onTrackUpdate) {
            onTrackUpdate({ ...selectedTrack, waveformData: waveform });
          }
        } else {
          setWaveformData(selectedTrack.waveformData);
        }

        cleanup = () => revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to load audio:', error);
        setError(error instanceof Error ? error.message : 'Failed to load audio');
      } finally {
        setIsLoading(false);
      }
    }

    loadAudio();

    return () => cleanup?.();
  }, [selectedTrack?.blobId, onTrackUpdate]);

  // Setup audio processing
  useEffect(() => {
    if (!audioRef.current || !audioUrl || !isProcessingEnabled) return;

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

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Audio playback error');
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  // Generate waveform data from audio blob
  const generateWaveformData = useCallback(async (blob: Blob): Promise<number[]> => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const samples = 200; // Number of waveform samples
      const blockSize = Math.floor(audioBuffer.length / samples);
      const waveform: number[] = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          const sample = audioBuffer.getChannelData(0)[i * blockSize + j] || 0;
          sum += Math.abs(sample);
        }
        waveform.push(sum / blockSize);
      }

      await audioContext.close();
      return waveform;
    } catch (error) {
      console.error('Failed to generate waveform:', error);
      return [];
    }
  }, []);

  // Player controls
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      setPlaybackSpeed(audioRef.current, newSpeed);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // A-B Loop controls
  const setLoopPoint = (point: 'A' | 'B') => {
    if (!abLoopRef.current) return;

    abLoopRef.current.setLoopPoint(point);
    const points = abLoopRef.current.getLoopPoints();
    setLoopStart(points.A);
    setLoopEnd(points.B);
  };

  const toggleLoop = () => {
    if (!abLoopRef.current) return;

    const enabled = abLoopRef.current.toggleLoop();
    setIsLoopEnabled(enabled);
  };

  const clearLoop = () => {
    if (!abLoopRef.current) return;

    abLoopRef.current.clearLoop();
    setLoopStart(null);
    setLoopEnd(null);
    setIsLoopEnabled(false);
  };

  // Voice recording
  const startRecording = async () => {
    try {
      voiceRecorderRef.current = new VoiceRecorder();
      await voiceRecorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Microphone access denied');
    }
  };

  const stopRecording = async () => {
    if (!voiceRecorderRef.current) return;

    try {
      const blob = await voiceRecorderRef.current.stopRecording();
      setRecordedBlob(blob);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setError('Recording failed');
    }
  };

  const saveRecording = async () => {
    if (!recordedBlob) return;

    try {
      await audioStorage.initialize();

      const audioFileId = await audioStorage.storeAudioFile({
        itemId: item.id,
        type: 'recitation',
        format: 'wav',
        blob: recordedBlob,
        size: recordedBlob.size,
      });

      const newTrack: AudioTrack = {
        id: `voice_${Date.now()}`,
        itemId: item.id,
        type: 'voice_recording',
        blobId: audioFileId,
        duration: 0, // Will be set when loaded
        createdAt: Date.now(),
      };

      // Add to item
      const updatedItem = {
        ...item,
        audio: [...(item.audio || []), newTrack]
      };

      onItemUpdate?.(updatedItem);
      setRecordedBlob(null);
    } catch (error) {
      console.error('Failed to save recording:', error);
      setError('Failed to save recording');
    }
  };

  // Format time display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={`master-audio-player ${className}`}>
        <div className="flex items-center justify-center p-8">
          <Icon name="loader" className="animate-spin text-primary-500" />
          <span className="ml-2 text-slate-600 dark:text-slate-400">Loading audio...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`master-audio-player ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <Icon name="alert-circle" className="text-red-500" />
            <span className="ml-2 text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTrack || !audioUrl) {
    return (
      <div className={`master-audio-player ${className}`}>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 text-center">
          <Icon name="volume-x" size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No audio track selected
          </p>
          {showVoiceFeatures && (
            <div className="space-y-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn btn-primary"
                >
                  <Icon name="mic" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="btn btn-destructive"
                >
                  <Icon name="square" />
                  Stop Recording
                </button>
              )}

              {recordedBlob && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={saveRecording}
                    className="btn btn-primary btn-sm"
                  >
                    <Icon name="save" size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setRecordedBlob(null)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Icon name="trash-2" size={16} />
                    Discard
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setShowVoiceFeatures(!showVoiceFeatures)}
            className="btn btn-ghost btn-sm mt-2"
          >
            <Icon name="mic" size={16} />
            {showVoiceFeatures ? 'Hide' : 'Show'} Voice Features
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`master-audio-player bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} />

      {/* Waveform */}
      {waveformData.length > 0 && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <WaveformCanvas
            data={waveformData}
            currentTime={currentTime}
            duration={duration}
            loopStart={loopStart}
            loopEnd={loopEnd}
            onSeek={seekTo}
            onSetLoopStart={() => setLoopPoint('A')}
            onSetLoopEnd={() => setLoopPoint('B')}
            className="cursor-pointer"
            height={80}
          />
        </div>
      )}

      {/* Main Controls */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
          >
            <Icon name={isPlaying ? "pause" : "play"} size={20} />
          </button>

          {/* Time Display */}
          <div className="flex-shrink-0 text-sm font-mono text-slate-600 dark:text-slate-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Icon name="volume-2" size={16} className="text-slate-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Advanced Controls Toggle */}
          <button
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Advanced Controls"
          >
            <Icon name="settings" size={16} />
          </button>
        </div>

        {/* Advanced Controls */}
        {showAdvancedControls && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            {/* Speed Control */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 w-16">
                Speed:
              </label>
              <input
                type="range"
                min="0.5"
                max="1.75"
                step="0.25"
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm font-mono text-slate-600 dark:text-slate-400 w-12">
                {speed}x
              </span>
            </div>

            {/* A-B Loop Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                A-B Loop:
              </span>
              <button
                onClick={() => setLoopPoint('A')}
                className={`btn btn-sm ${loopStart !== null ? 'btn-primary' : 'btn-ghost'}`}
              >
                Set A {loopStart !== null && `(${formatTime(loopStart)})`}
              </button>
              <button
                onClick={() => setLoopPoint('B')}
                className={`btn btn-sm ${loopEnd !== null ? 'btn-primary' : 'btn-ghost'}`}
              >
                Set B {loopEnd !== null && `(${formatTime(loopEnd)})`}
              </button>
              <button
                onClick={toggleLoop}
                disabled={loopStart === null || loopEnd === null}
                className={`btn btn-sm ${isLoopEnabled ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Icon name="repeat" size={16} />
                {isLoopEnabled ? 'On' : 'Off'}
              </button>
              <button
                onClick={clearLoop}
                className="btn btn-ghost btn-sm"
              >
                <Icon name="x" size={16} />
                Clear
              </button>
            </div>

            {/* Audio Processing Toggle */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isProcessingEnabled}
                  onChange={(e) => setIsProcessingEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Enhanced Audio Processing
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}