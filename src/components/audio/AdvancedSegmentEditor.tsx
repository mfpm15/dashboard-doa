'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface AudioSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  type: 'arabic' | 'latin' | 'translation';
  confidence?: number;
  waveformPeaks?: number[];
}

interface AdvancedSegmentEditorProps {
  item: Item;
  audioUrl?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  segments: AudioSegment[];
  onSegmentsChange: (segments: AudioSegment[]) => void;
}

export function AdvancedSegmentEditor({
  item,
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  onPlayPause,
  segments,
  onSegmentsChange
}: AdvancedSegmentEditorProps) {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [editingSegment, setEditingSegment] = useState<AudioSegment | null>(null);
  const [isAutoSegmenting, setIsAutoSegmenting] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [previewLoopEnabled, setPreviewLoopEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewportStart, setViewportStart] = useState(0);

  const timelineRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);

  // Calculate viewport end based on zoom
  const viewportEnd = Math.min(viewportStart + (duration / zoomLevel), duration);

  // Auto-segmentation using silence detection
  const performAutoSegmentation = useCallback(async () => {
    if (!audioUrl) return;

    setIsAutoSegmenting(true);
    try {
      // This would typically use Web Audio API to analyze audio
      // For now, we'll create demo segments based on text length
      const newSegments: AudioSegment[] = [];
      const texts = [
        { text: item.arabic, type: 'arabic' as const },
        { text: item.latin, type: 'latin' as const },
        { text: item.translation_id, type: 'translation' as const }
      ].filter(t => t.text);

      let currentTime = 0;
      const segmentDuration = duration / texts.length;

      texts.forEach((textItem, index) => {
        if (textItem.text) {
          newSegments.push({
            id: `auto_${Date.now()}_${index}`,
            text: textItem.text,
            startTime: currentTime,
            endTime: currentTime + segmentDuration,
            type: textItem.type,
            confidence: 0.8
          });
          currentTime += segmentDuration;
        }
      });

      onSegmentsChange(newSegments);
    } catch (error) {
      console.error('Auto-segmentation failed:', error);
    } finally {
      setIsAutoSegmenting(false);
    }
  }, [audioUrl, duration, item, onSegmentsChange]);

  // Draw waveform visualization
  useEffect(() => {
    const canvas = waveformRef.current;
    if (!canvas || !duration) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw waveform background
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, width, height);

    // Draw time grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    const timeStep = Math.max(1, Math.floor((viewportEnd - viewportStart) / 10));

    for (let t = viewportStart; t <= viewportEnd; t += timeStep) {
      const x = ((t - viewportStart) / (viewportEnd - viewportStart)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw segments
    segments.forEach(segment => {
      if (segment.startTime < viewportEnd && segment.endTime > viewportStart) {
        const startX = Math.max(0, ((segment.startTime - viewportStart) / (viewportEnd - viewportStart)) * width);
        const endX = Math.min(width, ((segment.endTime - viewportStart) / (viewportEnd - viewportStart)) * width);

        // Segment background
        ctx.fillStyle = selectedSegmentId === segment.id ? '#3b82f6' : '#10b981';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(startX, 0, endX - startX, height);

        // Segment borders
        ctx.globalAlpha = 1;
        ctx.strokeStyle = selectedSegmentId === segment.id ? '#1d4ed8' : '#059669';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, height);
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }
    });

    // Draw playhead
    if (currentTime >= viewportStart && currentTime <= viewportEnd) {
      const playheadX = ((currentTime - viewportStart) / (viewportEnd - viewportStart)) * width;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }
  }, [segments, selectedSegmentId, currentTime, viewportStart, viewportEnd, duration]);

  // Handle timeline click for seeking
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    const canvas = waveformRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = viewportStart + (x / canvas.width) * (viewportEnd - viewportStart);
    onSeek(clickTime);
  }, [viewportStart, viewportEnd, onSeek]);

  // Create new segment
  const createSegment = useCallback(() => {
    const newSegment: AudioSegment = {
      id: `segment_${Date.now()}`,
      text: '',
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
      type: 'arabic'
    };

    const updatedSegments = [...segments, newSegment].sort((a, b) => a.startTime - b.startTime);
    onSegmentsChange(updatedSegments);
    setSelectedSegmentId(newSegment.id);
    setEditingSegment(newSegment);
  }, [currentTime, duration, segments, onSegmentsChange]);

  // Delete segment
  const deleteSegment = useCallback((segmentId: string) => {
    const updatedSegments = segments.filter(s => s.id !== segmentId);
    onSegmentsChange(updatedSegments);
    if (selectedSegmentId === segmentId) {
      setSelectedSegmentId(null);
    }
  }, [segments, selectedSegmentId, onSegmentsChange]);

  // Update segment
  const updateSegment = useCallback((updatedSegment: AudioSegment) => {
    const updatedSegments = segments.map(s =>
      s.id === updatedSegment.id ? updatedSegment : s
    );
    onSegmentsChange(updatedSegments);
    setEditingSegment(null);
  }, [segments, onSegmentsChange]);

  // Preview segment
  const previewSegment = useCallback((segment: AudioSegment) => {
    onSeek(segment.startTime);
    if (!isPlaying) {
      onPlayPause();
    }
  }, [onSeek, isPlaying, onPlayPause]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Icon name="edit" size={20} />
          Advanced Segment Editor
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Create precise text-audio synchronization with advanced editing tools
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onPlayPause}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={16} />
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={createSegment}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="plus" size={16} />
            Add Segment
          </button>

          <button
            onClick={performAutoSegmentation}
            disabled={isAutoSegmenting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icon name={isAutoSegmenting ? 'loader' : 'zap'} size={16} />
            {isAutoSegmenting ? 'Processing...' : 'Auto Segment'}
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Speed:</label>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Zoom:</label>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">{zoomLevel}x</span>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Current Time: {formatTime(currentTime)} / {formatTime(duration)}
          {selectedSegmentId && (
            <span className="ml-4">
              Selected: {segments.find(s => s.id === selectedSegmentId)?.text || 'Segment'}
            </span>
          )}
        </div>
      </div>

      {/* Waveform Timeline */}
      <div className="mb-6">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {formatTime(viewportStart)}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Waveform Timeline
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {formatTime(viewportEnd)}
            </span>
          </div>
          <canvas
            ref={waveformRef}
            width={800}
            height={120}
            className="w-full h-30 border border-slate-200 dark:border-slate-600 rounded cursor-crosshair"
            onClick={handleTimelineClick}
          />
        </div>
      </div>

      {/* Segments List */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Icon name="list" size={16} />
          Segments ({segments.length})
        </h4>

        {segments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Icon name="clock" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No segments created yet</p>
            <p className="text-sm">Click "Add Segment" or "Auto Segment" to start</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className={`
                  p-3 rounded-lg border transition-all duration-200 cursor-pointer
                  ${selectedSegmentId === segment.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }
                `}
                onClick={() => setSelectedSegmentId(segment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        segment.type === 'arabic' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        segment.type === 'latin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {segment.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-900 dark:text-slate-100 truncate">
                      {segment.text || '(No text)'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewSegment(segment);
                      }}
                      className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                      title="Preview segment"
                    >
                      <Icon name="play" size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSegment(segment);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Edit segment"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSegment(segment.id);
                      }}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete segment"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Segment Modal */}
      {editingSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Edit Segment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Text
                </label>
                <textarea
                  value={editingSegment.text}
                  onChange={(e) => setEditingSegment({...editingSegment, text: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  rows={3}
                  placeholder="Enter segment text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="number"
                    value={editingSegment.startTime}
                    onChange={(e) => setEditingSegment({...editingSegment, startTime: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    step={0.1}
                    min={0}
                    max={duration}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="number"
                    value={editingSegment.endTime}
                    onChange={(e) => setEditingSegment({...editingSegment, endTime: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    step={0.1}
                    min={editingSegment.startTime}
                    max={duration}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={editingSegment.type}
                  onChange={(e) => setEditingSegment({...editingSegment, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="arabic">Arabic</option>
                  <option value="latin">Latin</option>
                  <option value="translation">Translation</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updateSegment(editingSegment)}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSegment(null)}
                className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}