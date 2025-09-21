/**
 * Voice Commands System for Islamic Prayer Dashboard
 * Supports hands-free navigation and prayer reading
 */

import { Item } from '@/types';

export interface VoiceCommand {
  patterns: string[];
  action: string;
  params?: { [key: string]: any };
  description: string;
  examples: string[];
}

export interface VoiceResponse {
  success: boolean;
  action: string;
  message: string;
  data?: any;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  autoListen: boolean;
  feedbackMode: 'voice' | 'text' | 'both';
  wakeWord: string;
  sensitivity: number;
}

class VoiceCommandSystem {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private items: Item[] = [];
  private settings: VoiceSettings = {
    enabled: false,
    language: 'id-ID',
    autoListen: false,
    feedbackMode: 'both',
    wakeWord: 'dashboard doa',
    sensitivity: 0.8
  };

  private commands: VoiceCommand[] = [
    // Navigation Commands
    {
      patterns: ['buka dashboard', 'tampilkan dashboard', 'halaman utama', 'home'],
      action: 'navigate',
      params: { route: '/' },
      description: 'Buka halaman dashboard utama',
      examples: ['Buka dashboard', 'Tampilkan halaman utama']
    },
    {
      patterns: ['aktifkan focus mode', 'focus mode', 'mode fokus', 'mulai fokus'],
      action: 'toggleFocusMode',
      description: 'Aktifkan atau nonaktifkan focus mode',
      examples: ['Aktifkan focus mode', 'Mulai mode fokus']
    },
    {
      patterns: ['buka ai assistant', 'tanya ai', 'bantuan ai', 'assistant'],
      action: 'openAI',
      description: 'Buka AI Assistant untuk bertanya',
      examples: ['Buka AI assistant', 'Tanya AI tentang doa']
    },

    // Search Commands
    {
      patterns: ['cari doa (.+)', 'temukan doa (.+)', 'carikan (.+)'],
      action: 'search',
      description: 'Mencari doa berdasarkan kata kunci',
      examples: ['Cari doa pagi', 'Temukan doa sebelum makan', 'Carikan doa syukur']
    },
    {
      patterns: ['tampilkan kategori (.+)', 'buka kategori (.+)', 'kategori (.+)'],
      action: 'filterCategory',
      description: 'Filter doa berdasarkan kategori',
      examples: ['Tampilkan kategori doa harian', 'Buka kategori zikir']
    },

    // Prayer Commands
    {
      patterns: ['baca doa (.+)', 'bacakan doa (.+)', 'buka doa (.+)'],
      action: 'readPrayer',
      description: 'Membaca doa tertentu',
      examples: ['Baca doa sebelum makan', 'Bacakan doa pagi', 'Buka doa istighfar']
    },
    {
      patterns: ['doa pagi', 'doa subuh', 'doa morning'],
      action: 'suggestPrayer',
      params: { situation: 'pagi' },
      description: 'Menampilkan doa-doa untuk pagi hari',
      examples: ['Doa pagi', 'Doa subuh']
    },
    {
      patterns: ['doa malam', 'doa sebelum tidur', 'doa night'],
      action: 'suggestPrayer',
      params: { situation: 'malam' },
      description: 'Menampilkan doa-doa untuk malam hari',
      examples: ['Doa malam', 'Doa sebelum tidur']
    },
    {
      patterns: ['doa makan', 'doa sebelum makan', 'doa sesudah makan'],
      action: 'suggestPrayer',
      params: { situation: 'makan' },
      description: 'Menampilkan doa-doa yang berkaitan dengan makan',
      examples: ['Doa makan', 'Doa sebelum makan']
    },
    {
      patterns: ['doa bepergian', 'doa perjalanan', 'doa safar'],
      action: 'suggestPrayer',
      params: { situation: 'bepergian' },
      description: 'Menampilkan doa-doa untuk perjalanan',
      examples: ['Doa bepergian', 'Doa perjalanan']
    },

    // Audio Commands
    {
      patterns: ['putar audio', 'mainkan audio', 'play audio'],
      action: 'playAudio',
      description: 'Memutar audio doa yang sedang dipilih',
      examples: ['Putar audio', 'Mainkan audio doa']
    },
    {
      patterns: ['stop audio', 'hentikan audio', 'pause audio'],
      action: 'stopAudio',
      description: 'Menghentikan audio yang sedang diputar',
      examples: ['Stop audio', 'Hentikan audio']
    },

    // Favorites Commands
    {
      patterns: ['tambah ke favorit', 'favoritkan', 'bookmark'],
      action: 'addFavorite',
      description: 'Menambahkan doa ke daftar favorit',
      examples: ['Tambah ke favorit', 'Favoritkan doa ini']
    },
    {
      patterns: ['tampilkan favorit', 'buka favorit', 'favorit saya'],
      action: 'showFavorites',
      description: 'Menampilkan daftar doa favorit',
      examples: ['Tampilkan favorit', 'Buka doa favorit saya']
    },

    // Settings Commands
    {
      patterns: ['buka pengaturan', 'settings', 'konfigurasi'],
      action: 'openSettings',
      description: 'Membuka halaman pengaturan',
      examples: ['Buka pengaturan', 'Konfigurasi aplikasi']
    },
    {
      patterns: ['ubah tema (.+)', 'ganti tema (.+)', 'theme (.+)'],
      action: 'changeTheme',
      description: 'Mengubah tema aplikasi',
      examples: ['Ubah tema gelap', 'Ganti tema terang']
    },

    // Help Commands
    {
      patterns: ['bantuan', 'help', 'apa yang bisa kamu lakukan', 'perintah suara'],
      action: 'showHelp',
      description: 'Menampilkan daftar perintah suara yang tersedia',
      examples: ['Bantuan', 'Apa yang bisa kamu lakukan?']
    },
    {
      patterns: ['stop listening', 'berhenti mendengar', 'matikan suara'],
      action: 'stopListening',
      description: 'Menghentikan pengenalan suara',
      examples: ['Stop listening', 'Berhenti mendengar']
    }
  ];

  private callbacks: { [action: string]: (params?: any) => void } = {};

  constructor() {
    this.initSpeechRecognition();
    this.initSpeechSynthesis();
    this.loadSettings();
  }

  private initSpeechRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = this.settings.language;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voice input:', transcript);
        this.processCommand(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          this.speak('Tidak ada suara yang terdeteksi. Coba lagi.');
        } else if (event.error === 'network') {
          this.speak('Tidak ada koneksi internet untuk pengenalan suara.');
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.settings.autoListen && this.settings.enabled) {
          setTimeout(() => this.startListening(), 1000);
        }
      };
    }
  }

  private initSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  setItems(items: Item[]): void {
    this.items = items;
  }

  registerCallback(action: string, callback: (params?: any) => void): void {
    this.callbacks[action] = callback;
  }

  startListening(): void {
    if (!this.recognition || !this.settings.enabled) return;

    if (this.isListening) {
      this.stopListening();
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      console.log('Voice recognition started');

      if (this.settings.feedbackMode !== 'text') {
        this.speak('Saya mendengarkan...');
      }
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Voice recognition stopped');
    }
  }

  private processCommand(transcript: string): void {
    // Check for wake word if required
    if (this.settings.wakeWord && !transcript.includes(this.settings.wakeWord.toLowerCase())) {
      return;
    }

    // Remove wake word from transcript
    const cleanTranscript = transcript.replace(this.settings.wakeWord.toLowerCase(), '').trim();

    // Find matching command
    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        const regex = new RegExp(pattern, 'i');
        const match = cleanTranscript.match(regex);

        if (match) {
          const params = { ...command.params };

          // Extract captured groups from regex
          if (match.length > 1) {
            params.captured = match[1];
          }

          this.executeCommand(command.action, params, cleanTranscript);
          return;
        }
      }
    }

    // No command found
    this.speak('Maaf, saya tidak mengerti perintah tersebut. Katakan "bantuan" untuk melihat daftar perintah.');
  }

  private executeCommand(action: string, params: any = {}, originalText: string): void {
    console.log('Executing command:', action, params);

    let response: VoiceResponse = {
      success: false,
      action,
      message: 'Perintah tidak dikenali'
    };

    switch (action) {
      case 'search':
        response = this.handleSearch(params.captured || originalText);
        break;
      case 'readPrayer':
        response = this.handleReadPrayer(params.captured);
        break;
      case 'suggestPrayer':
        response = this.handleSuggestPrayer(params.situation);
        break;
      case 'showHelp':
        response = this.handleShowHelp();
        break;
      case 'stopListening':
        this.stopListening();
        response = { success: true, action, message: 'Pengenalan suara dihentikan.' };
        break;
      default:
        // Try registered callback
        if (this.callbacks[action]) {
          this.callbacks[action](params);
          response = { success: true, action, message: `Menjalankan ${action}` };
        }
        break;
    }

    // Provide feedback
    if (this.settings.feedbackMode !== 'text') {
      this.speak(response.message);
    }

    console.log('Command response:', response);
  }

  private handleSearch(query: string): VoiceResponse {
    if (!query) {
      return { success: false, action: 'search', message: 'Silakan sebutkan kata kunci pencarian.' };
    }

    const results = this.items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );

    if (results.length === 0) {
      return {
        success: false,
        action: 'search',
        message: `Tidak ditemukan doa yang mengandung kata "${query}".`
      };
    }

    if (this.callbacks['search']) {
      this.callbacks['search']({ query, results });
    }

    return {
      success: true,
      action: 'search',
      message: `Ditemukan ${results.length} doa untuk "${query}".`,
      data: results
    };
  }

  private handleReadPrayer(prayerName: string): VoiceResponse {
    if (!prayerName) {
      return { success: false, action: 'readPrayer', message: 'Silakan sebutkan nama doa yang ingin dibaca.' };
    }

    const prayer = this.items.find(item =>
      item.title.toLowerCase().includes(prayerName.toLowerCase())
    );

    if (!prayer) {
      return {
        success: false,
        action: 'readPrayer',
        message: `Doa "${prayerName}" tidak ditemukan.`
      };
    }

    if (this.callbacks['readPrayer']) {
      this.callbacks['readPrayer'](prayer);
    }

    return {
      success: true,
      action: 'readPrayer',
      message: `Membuka doa ${prayer.title}.`,
      data: prayer
    };
  }

  private handleSuggestPrayer(situation: string): VoiceResponse {
    const situationKeywords: { [key: string]: string[] } = {
      pagi: ['pagi', 'subuh', 'bangun'],
      malam: ['malam', 'tidur', 'istirahat'],
      makan: ['makan', 'makanan', 'rezeki'],
      bepergian: ['perjalanan', 'bepergian', 'safar', 'keluar']
    };

    const keywords = situationKeywords[situation] || [situation];
    const suggestions = this.items.filter(item =>
      keywords.some(keyword =>
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    );

    if (suggestions.length === 0) {
      return {
        success: false,
        action: 'suggestPrayer',
        message: `Tidak ditemukan doa untuk situasi ${situation}.`
      };
    }

    if (this.callbacks['suggestPrayer']) {
      this.callbacks['suggestPrayer']({ situation, suggestions });
    }

    return {
      success: true,
      action: 'suggestPrayer',
      message: `Ditemukan ${suggestions.length} doa untuk ${situation}.`,
      data: suggestions
    };
  }

  private handleShowHelp(): VoiceResponse {
    const helpText = `Perintah suara yang tersedia:
    • "Cari doa [nama]" - Mencari doa
    • "Baca doa [nama]" - Membaca doa tertentu
    • "Doa pagi/malam/makan" - Saran doa situasional
    • "Aktifkan focus mode" - Mode fokus
    • "Buka AI assistant" - Bantuan AI
    • "Tampilkan favorit" - Doa favorit
    • "Stop listening" - Hentikan suara`;

    if (this.callbacks['showHelp']) {
      this.callbacks['showHelp']({ commands: this.commands });
    }

    return {
      success: true,
      action: 'showHelp',
      message: helpText
    };
  }

  speak(text: string): void {
    if (!this.synthesis || this.settings.feedbackMode === 'text') return;

    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.settings.language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    this.synthesis.speak(utterance);
  }

  updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    if (this.recognition) {
      this.recognition.lang = this.settings.language;
    }
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('voice_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Could not save voice settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('voice_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Could not load voice settings:', error);
    }
  }

  isSupported(): boolean {
    return !!(
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) &&
      window.speechSynthesis
    );
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }
}

// Export singleton instance
export const voiceCommands = new VoiceCommandSystem();