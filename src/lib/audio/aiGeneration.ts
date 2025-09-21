import { computePeaksFromBlob } from './peaks';
import { putAudioBlob } from './audioDb';

export interface TTSOptions {
  voice?: 'male' | 'female' | 'child';
  language?: 'ar' | 'id';
  speed?: number;
  pitch?: number;
}

export interface GenerateAudioResult {
  blobId: string;
  duration: number;
  peaks: number[];
  audioBlob: Blob;
}

// Free TTS APIs that we can use
const TTS_APIS = {
  // Web Speech API (built-in browser)
  webSpeech: {
    name: 'Web Speech API',
    available: () => 'speechSynthesis' in window,
    languages: ['ar-SA', 'id-ID', 'en-US']
  },

  // Google Translate TTS (unofficial, free)
  googleTranslate: {
    name: 'Google Translate TTS',
    available: () => true,
    languages: ['ar', 'id', 'en']
  },

  // ResponsiveVoice (free tier)
  responsiveVoice: {
    name: 'ResponsiveVoice',
    available: () => typeof window !== 'undefined',
    languages: ['Arabic Male', 'Indonesian Female', 'Indonesian Male']
  }
};

// Generate audio using Web Speech API (Browser built-in)
async function generateWithWebSpeechAPI(
  text: string,
  options: TTSOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      const voices = speechSynthesis.getVoices();

      if (options.language === 'ar') {
        const arabicVoice = voices.find(voice =>
          voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic')
        );
        if (arabicVoice) utterance.voice = arabicVoice;
        utterance.lang = 'ar-SA';
      } else if (options.language === 'id') {
        const indonesianVoice = voices.find(voice =>
          voice.lang.includes('id') || voice.name.toLowerCase().includes('indonesia')
        );
        if (indonesianVoice) utterance.voice = indonesianVoice;
        utterance.lang = 'id-ID';
      }

      utterance.rate = options.speed || 0.8; // Slightly slower for prayer
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = 1.0;

      // Create audio context to capture speech
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        resolve(blob);
      };

      // Start recording
      mediaRecorder.start();

      // Speak the text
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
          audioContext.close();
        }, 500); // Small delay to ensure audio is captured
      };

      utterance.onerror = (event) => {
        mediaRecorder.stop();
        audioContext.close();
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      speechSynthesis.speak(utterance);

    } catch (error) {
      reject(error);
    }
  });
}

// Generate audio using Google Translate TTS (Unofficial API)
async function generateWithGoogleTTS(
  text: string,
  options: TTSOptions = {}
): Promise<Blob> {
  const maxLength = 200; // Google TTS character limit per request
  const chunks: Blob[] = [];

  // Split long text into chunks
  const textChunks = text.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [text];

  for (const chunk of textChunks) {
    const lang = options.language === 'ar' ? 'ar' : 'id';
    const speed = options.speed || 0.8;

    // Construct Google Translate TTS URL
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk)}&ttsspeed=${speed}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      chunks.push(audioBlob);

      // Small delay between requests to avoid rate limiting
      if (textChunks.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`Failed to generate audio for chunk: ${chunk}`, error);
      // Continue with other chunks
    }
  }

  if (chunks.length === 0) {
    throw new Error('Failed to generate any audio chunks');
  }

  // Combine all audio chunks (simplified - in production, would need proper audio concatenation)
  return new Blob(chunks, { type: 'audio/mpeg' });
}

// Main function to generate audio with AI
export async function generateAudioWithAI(
  text: string,
  options: TTSOptions = {}
): Promise<GenerateAudioResult> {
  if (!text.trim()) {
    throw new Error('Text is required for audio generation');
  }

  let audioBlob: Blob;
  let method = 'Unknown';

  try {
    // Try Web Speech API first (most reliable)
    if (TTS_APIS.webSpeech.available()) {
      console.log('Generating audio with Web Speech API...');
      audioBlob = await generateWithWebSpeechAPI(text, options);
      method = 'Web Speech API';
    } else {
      // Fallback to Google TTS
      console.log('Generating audio with Google TTS...');
      audioBlob = await generateWithGoogleTTS(text, options);
      method = 'Google TTS';
    }

    console.log(`Audio generated successfully using ${method}`);

    // Generate peaks for waveform visualization
    const { peaks, duration } = await computePeaksFromBlob(audioBlob);

    // Store in IndexedDB
    const blobId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await putAudioBlob(blobId, audioBlob);

    return {
      blobId,
      duration,
      peaks,
      audioBlob
    };

  } catch (error) {
    console.error('Audio generation failed:', error);
    throw new Error(`Failed to generate audio: ${(error as Error).message}`);
  }
}

// Utility function to check TTS availability
export function checkTTSAvailability(): {
  available: boolean;
  methods: string[];
  recommendations: string[]
} {
  const availableMethods: string[] = [];
  const recommendations: string[] = [];

  if (TTS_APIS.webSpeech.available()) {
    availableMethods.push('Web Speech API');
    recommendations.push('Web Speech API is the most reliable option');
  } else {
    recommendations.push('Enable Web Speech API in browser settings for best quality');
  }

  availableMethods.push('Google TTS');

  if (availableMethods.length === 0) {
    recommendations.push('No TTS methods available. Try a different browser.');
  }

  return {
    available: availableMethods.length > 0,
    methods: availableMethods,
    recommendations
  };
}

// Generate audio for Arabic text specifically
export async function generateArabicAudio(
  arabicText: string,
  options: Partial<TTSOptions> = {}
): Promise<GenerateAudioResult> {
  return generateAudioWithAI(arabicText, {
    language: 'ar',
    voice: 'male',
    speed: 0.7, // Slower for better pronunciation
    pitch: 1.0,
    ...options
  });
}

// Generate audio for Indonesian translation
export async function generateIndonesianAudio(
  indonesianText: string,
  options: Partial<TTSOptions> = {}
): Promise<GenerateAudioResult> {
  return generateAudioWithAI(indonesianText, {
    language: 'id',
    voice: 'female',
    speed: 0.9,
    pitch: 1.1,
    ...options
  });
}