'use client';

import React, { useState } from 'react';
import { Item } from '@/types';
import { NewEnhancedAudioPlayer } from './NewEnhancedAudioPlayer';
import { AudioFile } from '@/lib/audio/audioStorage';

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
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(item.audio || []);

  const handleAudioFilesChange = (files: AudioFile[]) => {
    setAudioFiles(files);
    if (onItemUpdate) {
      onItemUpdate({
        ...item,
        audio: files
      });
    }
  };

  return (
    <div className={`audio-player-widget ${className}`}>
      <NewEnhancedAudioPlayer
        itemId={item.id}
        title={item.title}
        audioFiles={audioFiles}
        onAudioFilesChange={handleAudioFilesChange}
        className="mb-4"
      />
    </div>
  );
}