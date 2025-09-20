// Audio processing utilities
export interface AudioProcessor {
  cleanup: () => void;
}

export function attachAudioProcessing(audioElement: HTMLAudioElement): AudioProcessor {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContext();

  try {
    const source = audioContext.createMediaElementSource(audioElement);

    // Low shelf filter for bass enhancement
    const lowShelf = audioContext.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 150;
    lowShelf.gain.value = 1.2;

    // Compressor for dynamic range control
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 30;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Connect the audio graph
    source.connect(lowShelf);
    lowShelf.connect(compressor);
    compressor.connect(audioContext.destination);

    // Enable pitch preservation for speed changes
    audioElement.preservesPitch = true;
    (audioElement as any).mozPreservesPitch = true;
    (audioElement as any).webkitPreservesPitch = true;

    return {
      cleanup: () => audioContext.close()
    };
  } catch (error) {
    audioContext.close();
    throw error;
  }
}

// A-B Loop functionality
export class ABLoop {
  private audioElement: HTMLAudioElement;
  private loopA: number | null = null;
  private loopB: number | null = null;
  private isEnabled = false;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
  }

  setLoopPoint(point: 'A' | 'B'): void {
    const currentTime = this.audioElement.currentTime;

    if (point === 'A') {
      this.loopA = currentTime;
      // If B is already set and is before A, clear it
      if (this.loopB !== null && this.loopB <= currentTime) {
        this.loopB = null;
      }
    } else {
      if (this.loopA === null) {
        // If A is not set, set it to 0
        this.loopA = 0;
      }
      this.loopB = Math.max(currentTime, this.loopA);
    }
  }

  clearLoop(): void {
    this.loopA = null;
    this.loopB = null;
    this.isEnabled = false;
    this.removeEventListener();
  }

  toggleLoop(): boolean {
    if (this.loopA !== null && this.loopB !== null) {
      this.isEnabled = !this.isEnabled;
      if (this.isEnabled) {
        this.addEventListener();
      } else {
        this.removeEventListener();
      }
    }
    return this.isEnabled;
  }

  private addEventListener(): void {
    this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate);
  }

  private removeEventListener(): void {
    this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
  }

  private handleTimeUpdate(): void {
    if (this.isEnabled && this.loopA !== null && this.loopB !== null) {
      if (this.audioElement.currentTime >= this.loopB) {
        this.audioElement.currentTime = this.loopA;
      }
    }
  }

  getLoopPoints(): { A: number | null; B: number | null } {
    return { A: this.loopA, B: this.loopB };
  }

  isLoopEnabled(): boolean {
    return this.isEnabled;
  }
}

// Speed control with pitch preservation
export function setPlaybackSpeed(audioElement: HTMLAudioElement, speed: number): void {
  // Clamp speed between 0.5 and 1.75
  const clampedSpeed = Math.max(0.5, Math.min(1.75, speed));
  audioElement.playbackRate = clampedSpeed;
}

// Voice features
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.chunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      });

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Microphone access denied or not available');
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        resolve(blob);
      });

      this.mediaRecorder.stop();

      // Stop all tracks to release microphone
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Voice search (experimental)
export class VoiceSearch {
  private recognition: any;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'id-ID';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }
}