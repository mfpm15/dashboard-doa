'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AudioSegment } from '@/types';
import { getTimeFromWaveformClick, getWaveformPositionFromTime } from '@/lib/audio/peaks';

interface WaveformCanvasProps {
  peaks: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  segments?: AudioSegment[];
  className?: string;
  height?: number;
}

export function WaveformCanvas({
  peaks,
  currentTime,
  duration,
  onSeek,
  segments = [],
  className = '',
  height = 64
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height });

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: Math.floor(width), height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [height]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = 'rgb(241, 245, 249)'; // slate-100
    if (document.documentElement.classList.contains('dark')) {
      ctx.fillStyle = 'rgb(30, 41, 59)'; // slate-800
    }
    ctx.fillRect(0, 0, width, height);

    // Draw segments background
    segments.forEach(segment => {
      const startX = getWaveformPositionFromTime(segment.start, duration, width);
      const endX = getWaveformPositionFromTime(segment.end, duration, width);

      ctx.fillStyle = 'rgba(20, 184, 166, 0.1)'; // primary-500 with opacity
      ctx.fillRect(startX, 0, endX - startX, height);

      // Draw segment labels
      if (segment.label) {
        ctx.fillStyle = 'rgb(100, 116, 139)'; // slate-500
        ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(segment.label, startX + 4, 16);
      }
    });

    // Calculate bar dimensions
    const barWidth = width / peaks.length;
    const maxHeight = height * 0.8;
    const centerY = height / 2;

    // Draw waveform bars
    peaks.forEach((peak, i) => {
      const x = i * barWidth;
      const barHeight = peak * maxHeight;
      const y = centerY - barHeight / 2;

      // Determine bar color based on progress
      const progress = duration > 0 ? currentTime / duration : 0;
      const isPlayed = i / peaks.length <= progress;

      ctx.fillStyle = isPlayed
        ? 'rgb(20, 184, 166)' // primary-500 (played)
        : 'rgb(148, 163, 184)'; // slate-400 (unplayed)

      if (document.documentElement.classList.contains('dark')) {
        ctx.fillStyle = isPlayed
          ? 'rgb(94, 234, 212)' // primary-300 (played)
          : 'rgb(100, 116, 139)'; // slate-500 (unplayed)
      }

      ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barHeight);
    });

    // Draw current time indicator
    if (duration > 0) {
      const progressX = getWaveformPositionFromTime(currentTime, duration, width);

      ctx.strokeStyle = 'rgb(239, 68, 68)'; // red-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();

      // Draw time tooltip
      const timeText = formatTime(currentTime);
      const textWidth = ctx.measureText(timeText).width;
      const tooltipX = Math.max(4, Math.min(width - textWidth - 8, progressX - textWidth / 2));

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(tooltipX - 4, 4, textWidth + 8, 20);

      ctx.fillStyle = 'white';
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(timeText, tooltipX, 17);
    }

  }, [peaks, currentTime, duration, canvasSize, segments]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!duration) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const time = getTimeFromWaveformClick(clickX, rect.width, duration);

    onSeek(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`waveform-container ${className}`}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="waveform cursor-pointer hover:opacity-80 transition-opacity"
        style={{ height: `${height}px` }}
      />

      {/* Waveform controls overlay */}
      <div className="flex justify-between items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>0:00</span>
        {segments.length > 0 && (
          <span>{segments.length} segments</span>
        )}
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}