'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface TextSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  type: 'arabic' | 'latin' | 'translation';
}

interface TextAudioSyncProps {
  item: Item;
  audioUrl?: string;
  isPlaying: boolean;
  currentTime: number;
  onSeek: (time: number) => void;
  segments?: TextSegment[];
  onSegmentsChange?: (segments: TextSegment[]) => void;
  editMode?: boolean;
}

export function TextAudioSync({
  item,
  audioUrl,
  isPlaying,
  currentTime,
  onSeek,
  segments = [],
  onSegmentsChange,
  editMode = false
}: TextAudioSyncProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [segmentStartTime, setSegmentStartTime] = useState<number | null>(null);
  const textRefs = useRef<{ [key: string]: HTMLElement }>({});

  // Find active segment based on current time
  useEffect(() => {
    const activeSegment = segments.find(
      segment => currentTime >= segment.startTime && currentTime <= segment.endTime
    );
    setActiveSegmentId(activeSegment?.id || null);
  }, [currentTime, segments]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentId && textRefs.current[activeSegmentId]) {
      textRefs.current[activeSegmentId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [activeSegmentId]);

  const handleTextSelection = useCallback(() => {
    if (!editMode) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setSegmentStartTime(currentTime);
      setIsCreatingSegment(true);
    }
  }, [editMode, currentTime]);

  const createSegment = useCallback((endTime: number) => {
    if (!selectedText || segmentStartTime === null) return;

    const newSegment: TextSegment = {
      id: `segment_${Date.now()}`,
      text: selectedText,
      startTime: segmentStartTime,
      endTime,
      type: 'arabic' // Default type, can be changed
    };

    const updatedSegments = [...segments, newSegment].sort((a, b) => a.startTime - b.startTime);
    onSegmentsChange?.(updatedSegments);

    // Reset creation state
    setIsCreatingSegment(false);
    setSelectedText('');
    setSegmentStartTime(null);
    window.getSelection()?.removeAllRanges();
  }, [selectedText, segmentStartTime, segments, onSegmentsChange]);

  const deleteSegment = useCallback((segmentId: string) => {
    const updatedSegments = segments.filter(s => s.id !== segmentId);
    onSegmentsChange?.(updatedSegments);
  }, [segments, onSegmentsChange]);

  const jumpToSegment = useCallback((segment: TextSegment) => {
    onSeek(segment.startTime);
  }, [onSeek]);

  const renderHighlightedText = (text: string, type: 'arabic' | 'latin' | 'translation') => {
    if (!text) return null;

    // Find segments for this text type
    const typeSegments = segments.filter(s => s.type === type);

    if (typeSegments.length === 0) {
      return (
        <span
          onMouseUp={handleTextSelection}
          className={editMode ? 'cursor-text select-text' : ''}
        >
          {text}
        </span>
      );
    }

    // Split text into segments and non-segments
    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    typeSegments.forEach((segment, index) => {
      const segmentIndex = text.indexOf(segment.text);

      if (segmentIndex >= lastIndex) {
        // Add text before segment
        if (segmentIndex > lastIndex) {
          result.push(
            <span key={`before-${index}`} onMouseUp={handleTextSelection}>
              {text.slice(lastIndex, segmentIndex)}
            </span>
          );
        }

        // Add highlighted segment
        result.push(
          <span
            key={segment.id}
            ref={el => {
              if (el) textRefs.current[segment.id] = el;
            }}
            className={`
              inline-block px-1 py-0.5 rounded cursor-pointer transition-all duration-200
              ${activeSegmentId === segment.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50'
              }
              ${editMode ? 'border border-dashed border-primary-300' : ''}
            `}
            onClick={() => jumpToSegment(segment)}
            onDoubleClick={editMode ? () => deleteSegment(segment.id) : undefined}
            title={editMode ? `${segment.startTime}s - ${segment.endTime}s (Double-click to delete)` : `Jump to ${segment.startTime}s`}
          >
            {segment.text}
          </span>
        );

        lastIndex = segmentIndex + segment.text.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key="remaining" onMouseUp={handleTextSelection}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      {editMode && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              Sync Editor
            </h4>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Icon name="info" size={14} />
              Select text and mark timestamps to create sync points
            </div>
          </div>

          {isCreatingSegment && (
            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded border border-primary-200 dark:border-primary-700">
              <p className="text-sm text-primary-700 dark:text-primary-300 mb-2">
                Creating segment: "{selectedText}"
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mb-3">
                Start: {segmentStartTime}s → End: {currentTime.toFixed(1)}s
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => createSegment(currentTime)}
                  className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
                >
                  Create Segment
                </button>
                <button
                  onClick={() => {
                    setIsCreatingSegment(false);
                    setSelectedText('');
                    setSegmentStartTime(null);
                  }}
                  className="px-3 py-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            {segments.length} sync points created
          </div>
        </div>
      )}

      {/* Synchronized Text Display */}
      <div className="space-y-6">
        {/* Arabic Text */}
        {item.arabic && (
          <div className="text-center">
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-center gap-2">
              <Icon name="type" size={14} />
              نص عربي
            </h4>
            <div
              className="arabic text-slate-900 dark:text-slate-100 leading-relaxed"
              lang="ar"
              dir="rtl"
              style={{
                fontSize: '28px',
                lineHeight: 2
              }}
            >
              {renderHighlightedText(item.arabic, 'arabic')}
            </div>
          </div>
        )}

        {/* Latin Transliteration */}
        {item.latin && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Icon name="type" size={14} />
              Transliterasi
            </h4>
            <div className="text-slate-600 dark:text-slate-400 italic leading-relaxed text-lg">
              {renderHighlightedText(item.latin, 'latin')}
            </div>
          </div>
        )}

        {/* Translation */}
        {item.translation_id && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Icon name="languages" size={14} />
              Terjemahan
            </h4>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              {renderHighlightedText(item.translation_id, 'translation')}
            </div>
          </div>
        )}
      </div>

      {/* Segments Timeline */}
      {segments.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Icon name="clock" size={14} />
            Sync Timeline
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={`
                  flex items-center justify-between p-2 rounded cursor-pointer transition-colors
                  ${activeSegmentId === segment.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                    : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }
                `}
                onClick={() => jumpToSegment(segment)}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {segment.text}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {segment.startTime}s - {segment.endTime}s
                  </div>
                </div>
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSegment(segment.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete segment"
                  >
                    <Icon name="trash" size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      {editMode && segments.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <Icon name="lightbulb" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                How to Create Text-Audio Sync
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Select text you want to sync with audio</li>
                <li>Mark the start time by selecting during playback</li>
                <li>Continue playing and mark the end time</li>
                <li>Click segments to jump to that time in audio</li>
                <li>Double-click segments to delete them</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}