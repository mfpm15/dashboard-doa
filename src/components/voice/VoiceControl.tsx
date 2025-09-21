'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { voiceCommands, VoiceCommand, VoiceSettings } from '@/lib/voice/voiceCommands';
import { Item } from '@/types';

interface VoiceControlProps {
  items: Item[];
  onSearch?: (query: string, results: Item[]) => void;
  onItemSelect?: (item: Item) => void;
  onToggleFocusMode?: () => void;
  onOpenAI?: () => void;
  onShowFavorites?: () => void;
  className?: string;
}

export function VoiceControl({
  items,
  onSearch,
  onItemSelect,
  onToggleFocusMode,
  onOpenAI,
  onShowFavorites,
  className = ""
}: VoiceControlProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string>('');

  useEffect(() => {
    // Check if voice commands are supported
    setIsSupported(voiceCommands.isSupported());

    // Load settings
    setSettings(voiceCommands.getSettings());

    // Set items for voice commands
    voiceCommands.setItems(items);

    // Register callbacks
    registerCallbacks();

    // Check listening state periodically
    const interval = setInterval(() => {
      setIsListening(voiceCommands.getIsListening());
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const registerCallbacks = () => {
    // Register search callback
    voiceCommands.registerCallback('search', ({ query, results }) => {
      setCommandFeedback(`Mencari: "${query}" - ${results.length} hasil`);
      onSearch?.(query, results);
      clearFeedback();
    });

    // Register read prayer callback
    voiceCommands.registerCallback('readPrayer', (prayer: Item) => {
      setCommandFeedback(`Membuka: ${prayer.title}`);
      onItemSelect?.(prayer);
      clearFeedback();
    });

    // Register suggest prayer callback
    voiceCommands.registerCallback('suggestPrayer', ({ situation, suggestions }) => {
      setCommandFeedback(`Doa untuk ${situation}: ${suggestions.length} ditemukan`);
      if (suggestions.length > 0) {
        onSearch?.(situation, suggestions);
      }
      clearFeedback();
    });

    // Register navigation callbacks
    voiceCommands.registerCallback('toggleFocusMode', () => {
      setCommandFeedback('Mengaktifkan Focus Mode');
      onToggleFocusMode?.();
      clearFeedback();
    });

    voiceCommands.registerCallback('openAI', () => {
      setCommandFeedback('Membuka AI Assistant');
      onOpenAI?.();
      clearFeedback();
    });

    voiceCommands.registerCallback('showFavorites', () => {
      setCommandFeedback('Menampilkan doa favorit');
      onShowFavorites?.();
      clearFeedback();
    });

    voiceCommands.registerCallback('showHelp', () => {
      setCommandFeedback('Menampilkan bantuan perintah suara');
      setShowCommands(true);
      clearFeedback();
    });
  };

  const clearFeedback = () => {
    setTimeout(() => setCommandFeedback(''), 3000);
  };

  const toggleListening = () => {
    if (isListening) {
      voiceCommands.stopListening();
      setCommandFeedback('Pengenalan suara dihentikan');
    } else {
      voiceCommands.startListening();
      setCommandFeedback('Mulai mendengarkan...');
    }
    clearFeedback();
  };

  const handleSettingsUpdate = (newSettings: Partial<VoiceSettings>) => {
    if (!settings) return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    voiceCommands.updateSettings(newSettings);
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 text-slate-500 dark:text-slate-400 ${className}`}>
        <Icon name="mic-off" size={16} />
        <span className="text-sm">Voice commands not supported</span>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Voice Control Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                : settings?.enabled
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice commands'}
            disabled={!settings?.enabled}
          >
            <Icon
              name={isListening ? 'mic' : 'mic-off'}
              size={16}
              className={isListening ? 'animate-pulse' : ''}
            />
            <span className="hidden sm:inline text-sm">
              {isListening ? 'Listening...' : 'Voice'}
            </span>

            {isListening && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            title="Voice settings"
          >
            <Icon name="settings" size={16} />
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowCommands(true)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            title="Voice commands help"
          >
            <Icon name="help-circle" size={16} />
          </button>
        </div>

        {/* Command Feedback */}
        {commandFeedback && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-lg border border-primary-200 dark:border-primary-800 z-10">
            {commandFeedback}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && settings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Voice Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Enable Voice Commands
                </label>
                <button
                  onClick={() => handleSettingsUpdate({ enabled: !settings.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingsUpdate({ language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="id-ID">Bahasa Indonesia</option>
                  <option value="en-US">English (US)</option>
                  <option value="ar-SA">العربية</option>
                </select>
              </div>

              {/* Feedback Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Feedback Mode
                </label>
                <select
                  value={settings.feedbackMode}
                  onChange={(e) => handleSettingsUpdate({ feedbackMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="both">Voice + Text</option>
                  <option value="voice">Voice Only</option>
                  <option value="text">Text Only</option>
                </select>
              </div>

              {/* Auto Listen */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Auto Listen
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Continue listening after each command
                  </p>
                </div>
                <button
                  onClick={() => handleSettingsUpdate({ autoListen: !settings.autoListen })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoListen ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoListen ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Wake Word */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Wake Word
                </label>
                <input
                  type="text"
                  value={settings.wakeWord}
                  onChange={(e) => handleSettingsUpdate({ wakeWord: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  placeholder="e.g., 'dashboard doa'"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Say this phrase before commands (leave empty to disable)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commands Help Modal */}
      {showCommands && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Voice Commands
              </h3>
              <button
                onClick={() => setShowCommands(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Quick Start */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Quick Start
                  </h4>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                    <p className="text-sm text-primary-800 dark:text-primary-200">
                      1. Click the microphone button to start listening<br/>
                      2. Say your command clearly<br/>
                      3. Wait for confirmation feedback
                    </p>
                  </div>
                </div>

                {/* Command Categories */}
                {[
                  {
                    title: 'Navigation',
                    commands: voiceCommands.getCommands().filter(cmd =>
                      ['navigate', 'toggleFocusMode', 'openAI', 'openSettings'].includes(cmd.action)
                    )
                  },
                  {
                    title: 'Search & Prayer',
                    commands: voiceCommands.getCommands().filter(cmd =>
                      ['search', 'readPrayer', 'suggestPrayer', 'filterCategory'].includes(cmd.action)
                    )
                  },
                  {
                    title: 'Audio & Favorites',
                    commands: voiceCommands.getCommands().filter(cmd =>
                      ['playAudio', 'stopAudio', 'addFavorite', 'showFavorites'].includes(cmd.action)
                    )
                  },
                  {
                    title: 'Help & Settings',
                    commands: voiceCommands.getCommands().filter(cmd =>
                      ['showHelp', 'stopListening', 'changeTheme'].includes(cmd.action)
                    )
                  }
                ].map(category => (
                  <div key={category.title}>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {category.title}
                    </h4>
                    <div className="space-y-2">
                      {category.commands.map((command, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                          <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                            {command.description}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Examples: {command.examples.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowCommands(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}