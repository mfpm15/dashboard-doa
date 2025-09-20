// Audio peaks computation for waveform visualization
export interface PeaksResult {
  peaks: number[];
  duration: number;
}

export async function computePeaksFromBlob(blob: Blob, buckets = 2000): Promise<PeaksResult> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const step = Math.max(1, Math.floor(channelData.length / buckets));
    const peaks = new Array(buckets);

    for (let i = 0; i < buckets; i++) {
      const start = i * step;
      const end = Math.min(channelData.length, start + step);
      let max = 0;

      for (let j = start; j < end; j++) {
        const value = Math.abs(channelData[j]);
        if (value > max) max = value;
      }

      peaks[i] = Number(max.toFixed(3));
    }

    return {
      peaks,
      duration: audioBuffer.duration
    };
  } finally {
    audioContext.close();
  }
}

export function createWaveformPath(peaks: number[], width: number, height: number): string {
  if (!peaks.length) return '';

  const barWidth = width / peaks.length;
  const heightScale = height * 0.8; // Leave some padding

  let path = '';
  peaks.forEach((peak, i) => {
    const x = i * barWidth;
    const barHeight = peak * heightScale;
    const y = (height - barHeight) / 2;

    if (i === 0) {
      path += `M ${x} ${y + barHeight}`;
    }
    path += ` L ${x} ${y} L ${x + barWidth} ${y} L ${x + barWidth} ${y + barHeight}`;
  });

  return path;
}

export function getTimeFromWaveformClick(
  clickX: number,
  waveformWidth: number,
  duration: number
): number {
  const progress = Math.max(0, Math.min(1, clickX / waveformWidth));
  return progress * duration;
}

export function getWaveformPositionFromTime(
  time: number,
  duration: number,
  waveformWidth: number
): number {
  if (!duration) return 0;
  const progress = Math.max(0, Math.min(1, time / duration));
  return progress * waveformWidth;
}