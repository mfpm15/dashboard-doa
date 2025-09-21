'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface VoiceCommand {
  id: string;
  pattern: RegExp;
  action: string;
  description: string;
  category: 'navigation' | 'search' | 'playback' | 'interaction';
  examples: string[];
}

interface VoiceCommandNavProps {
  items: Item[];
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
  onPlayItem: (item: Item) => void;
  onTogglePlayback: () => void;
  onOpenItem: (item: Item) => void;
  onAddFavorite: (item: Item) => void;
  currentPage?: string;
  isPlaying?: boolean;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation commands
  {
    id: 'nav_home',
    pattern: /^(beranda|home|kembali ke beranda)/i,
    action: 'navigate_home',
    description: 'Navigate to home page',
    category: 'navigation',
    examples: ['Beranda', 'Home', 'Kembali ke beranda']
  },
  {
    id: 'nav_search',
    pattern: /^(cari|search|buka pencarian)/i,
    action: 'navigate_search',
    description: 'Open search',
    category: 'navigation',
    examples: ['Cari', 'Search', 'Buka pencarian']
  },
  {
    id: 'nav_favorites',
    pattern: /^(favorit|favorites|doa favorit)/i,
    action: 'navigate_favorites',
    description: 'Navigate to favorites',
    category: 'navigation',
    examples: ['Favorit', 'Favorites', 'Doa favorit']
  },

  // Search commands
  {
    id: 'search_prayer',
    pattern: /^(cari doa|find prayer) (.+)/i,
    action: 'search',
    description: 'Search for prayers',
    category: 'search',
    examples: ['Cari doa pagi', 'Find prayer morning', 'Cari doa sebelum makan']
  },
  {
    id: 'search_category',
    pattern: /^(tampilkan kategori|show category) (.+)/i,
    action: 'search_category',
    description: 'Search by category',
    category: 'search',
    examples: ['Tampilkan kategori harian', 'Show category morning', 'Tampilkan kategori makan']
  },

  // Playback commands
  {
    id: 'play_pause',
    pattern: /^(play|pause|putar|jeda|stop)/i,
    action: 'toggle_playback',
    description: 'Play or pause audio',
    category: 'playback',
    examples: ['Play', 'Pause', 'Putar', 'Jeda', 'Stop']
  },
  {
    id: 'play_specific',
    pattern: /^(putar|play) (.+)/i,
    action: 'play_item',
    description: 'Play specific prayer',
    category: 'playback',
    examples: ['Putar doa pagi', 'Play morning prayer', 'Putar bismillah']
  },

  // Interaction commands
  {
    id: 'open_item',
    pattern: /^(buka|open|tampilkan) (.+)/i,
    action: 'open_item',
    description: 'Open specific prayer',
    category: 'interaction',
    examples: ['Buka doa pagi', 'Open morning prayer', 'Tampilkan bismillah']
  },
  {
    id: 'add_favorite',
    pattern: /^(tambah favorit|add favorite) (.+)/i,
    action: 'add_favorite',
    description: 'Add prayer to favorites',
    category: 'interaction',
    examples: ['Tambah favorit doa pagi', 'Add favorite morning prayer']
  },

  // Help commands
  {
    id: 'help',
    pattern: /^(help|bantuan|perintah suara)/i,
    action: 'show_help',
    description: 'Show voice commands help',
    category: 'navigation',
    examples: ['Help', 'Bantuan', 'Perintah suara']
  }
];

export function VoiceCommandNav({
  items,
  onNavigate,
  onSearch,
  onPlayItem,
  onTogglePlayback,
  onOpenItem,
  onAddFavorite,
  currentPage = 'home',
  isPlaying = false
}: VoiceCommandNavProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [language, setLanguage] = useState<'id-ID' | 'en-US'>('id-ID');

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 3;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
          setConfidence(0);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
              setConfidence(result[0].confidence);
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language]);

  // Process voice command
  const processVoiceCommand = useCallback((command: string) => {
    console.log('Processing voice command:', command);
    setLastCommand(command);
    setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands

    for (const voiceCommand of VOICE_COMMANDS) {
      const match = command.match(voiceCommand.pattern);
      if (match) {
        console.log('Command matched:', voiceCommand.action);

        switch (voiceCommand.action) {
          case 'navigate_home':
            onNavigate('/');
            break;

          case 'navigate_search':
            onNavigate('/search');
            break;

          case 'navigate_favorites':
            onNavigate('/favorites');
            break;

          case 'search':
            if (match[2]) {
              onSearch(match[2]);
            }
            break;

          case 'search_category':
            if (match[2]) {
              onSearch(`category:${match[2]}`);
            }
            break;

          case 'toggle_playback':
            onTogglePlayback();
            break;

          case 'play_item':
            if (match[2]) {
              const searchTerm = match[2].toLowerCase();
              const item = items.find(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
              );
              if (item) {
                onPlayItem(item);
              }
            }
            break;

          case 'open_item':
            if (match[2]) {
              const searchTerm = match[2].toLowerCase();
              const item = items.find(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
              );
              if (item) {
                onOpenItem(item);
              }
            }
            break;

          case 'add_favorite':
            if (match[2]) {
              const searchTerm = match[2].toLowerCase();
              const item = items.find(item =>
                item.title.toLowerCase().includes(searchTerm)
              );
              if (item) {
                onAddFavorite(item);
              }
            }
            break;

          case 'show_help':
            setShowHelp(true);
            break;

          default:
            console.log('Unknown command action:', voiceCommand.action);
        }

        break; // Exit loop after first match
      }
    }
  }, [items, onNavigate, onSearch, onPlayItem, onTogglePlayback, onOpenItem, onAddFavorite]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      recognitionRef.current.start();

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 10000);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }, [isSupported]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Icon name="alert" className="text-yellow-600 dark:text-yellow-400" size={20} />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Voice Commands Not Supported
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Control Interface */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Icon name="mic" size={20} />
            Voice Commands
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'id-ID' | 'en-US')}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="id-ID">Bahasa Indonesia</option>
              <option value="en-US">English</option>
            </select>

            <button
              onClick={() => setShowHelp(true)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              title="Show help"
            >
              <Icon name="info" size={16} />
            </button>
          </div>
        </div>

        {/* Voice Control Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Icon name="mic" size={20} />
            {isListening ? 'Stop Listening' : 'Start Voice Command'}
          </button>

          {isListening && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening...
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Transcript:
              </span>
              {confidence > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Confidence: {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <p className="text-slate-900 dark:text-slate-100">{transcript}</p>
          </div>
        )}

        {/* Last Command */}
        {lastCommand && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Last Command:
            </span>
            <span className="text-green-900 dark:text-green-100 ml-2">
              {lastCommand}
            </span>
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
          Quick Commands
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {VOICE_COMMANDS.slice(0, 8).map((command) => (
            <button
              key={command.id}
              onClick={() => processVoiceCommand(command.examples[0])}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-left"
            >
              {command.examples[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
            Command History
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {commandHistory.map((command, index) => (
              <div
                key={index}
                className="text-sm text-slate-600 dark:text-slate-400 p-2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600"
              >
                {command}
              </div>
            ))}
          </div>
          <button
            onClick={() => setCommandHistory([])}
            className="mt-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            Clear History
          </button>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Voice Commands Help
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {['navigation', 'search', 'playback', 'interaction'].map((category) => (
                <div key={category}>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 capitalize">
                    {category} Commands
                  </h4>
                  <div className="space-y-2">
                    {VOICE_COMMANDS
                      .filter(cmd => cmd.category === category)
                      .map((command) => (
                        <div
                          key={command.id}
                          className="p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600"
                        >
                          <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                            {command.description}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Examples: {command.examples.join(', ')}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <Icon name="info" className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Tips for Better Recognition
                  </h5>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Speak clearly and at normal speed</li>
                    <li>• Use a quiet environment</li>
                    <li>• Allow microphone access when prompted</li>
                    <li>• Try both Indonesian and English commands</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}