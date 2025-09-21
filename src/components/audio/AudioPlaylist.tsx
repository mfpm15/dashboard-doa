'use client';

import { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { AudioTrack } from '@/types';
import { EnhancedAudioPlayer } from './EnhancedAudioPlayer';

interface AudioPlaylistProps {
  tracks: AudioTrack[];
  autoPlay?: boolean;
  shuffle?: boolean;
  repeat?: 'none' | 'one' | 'all';
}

export function AudioPlaylist({
  tracks,
  autoPlay = false,
  shuffle = false,
  repeat = 'none'
}: AudioPlaylistProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(shuffle);
  const [repeatMode, setRepeatMode] = useState(repeat);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  useEffect(() => {
    if (shuffleEnabled) {
      const indices = tracks.map((_, index) => index);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    } else {
      setShuffledIndices(tracks.map((_, index) => index));
    }
  }, [shuffleEnabled, tracks]);

  const currentTrack = tracks[currentTrackIndex];

  const getNextTrackIndex = () => {
    const currentIndexInShuffle = shuffledIndices.indexOf(currentTrackIndex);

    if (currentIndexInShuffle < shuffledIndices.length - 1) {
      return shuffledIndices[currentIndexInShuffle + 1];
    } else if (repeatMode === 'all') {
      return shuffledIndices[0];
    }
    return currentTrackIndex;
  };

  const getPrevTrackIndex = () => {
    const currentIndexInShuffle = shuffledIndices.indexOf(currentTrackIndex);

    if (currentIndexInShuffle > 0) {
      return shuffledIndices[currentIndexInShuffle - 1];
    } else if (repeatMode === 'all') {
      return shuffledIndices[shuffledIndices.length - 1];
    }
    return currentTrackIndex;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = getNextTrackIndex();
    setCurrentTrackIndex(nextIndex);
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handlePrevious = () => {
    const prevIndex = getPrevTrackIndex();
    setCurrentTrackIndex(prevIndex);
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      const nextIndex = getNextTrackIndex();
      if (nextIndex !== currentTrackIndex || repeatMode === 'all') {
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const toggleShuffle = () => {
    setShuffleEnabled(!shuffleEnabled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Icon name="volume" className="w-12 h-12 mx-auto mb-4" />
        <p>Belum ada audio tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Track Player */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center">
            <Icon name="volume" className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Sedang Diputar
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTrackIndex + 1} dari {tracks.length} audio
            </p>
          </div>
        </div>

        <EnhancedAudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onEnded={handleTrackEnd}
        />

        {/* Playlist Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
              disabled={tracks.length <= 1}
            >
              <Icon name="skip-back" className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
              disabled={tracks.length <= 1}
            >
              <Icon name="skip-forward" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded transition-colors ${
                shuffleEnabled
                  ? 'text-primary-600 bg-primary-100 dark:bg-primary-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Shuffle"
            >
              <Icon name="grid" className="w-4 h-4" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded transition-colors ${
                repeatMode !== 'none'
                  ? 'text-primary-600 bg-primary-100 dark:bg-primary-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              <Icon name="refresh" className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Playlist Audio ({tracks.length})
          </h4>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {tracks.map((track, index) => (
            <button
              key={`${track.id}-${index}`}
              onClick={() => handleTrackSelect(index)}
              className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                index === currentTrackIndex
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {index === currentTrackIndex && isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-primary-600 rounded animate-pulse"></div>
                      <div className="w-1 h-4 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-4 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className={`font-medium truncate ${
                    index === currentTrackIndex
                      ? 'text-primary-900 dark:text-primary-100'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {track.title}
                  </h5>
                  <p className={`text-sm truncate ${
                    index === currentTrackIndex
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {track.reciter} • {track.language}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {track.duration || '--:--'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}