'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { searchEngine } from '@/lib/search/searchEngine';
import { aiComplete } from '@/lib/ai/client';
import { executeAITool, TOOLS } from '@/lib/ai/tools';

interface EnhancedCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onNewItem?: () => void;
  onImportData?: () => void;
  onExportData?: () => void;
  onOpenSettings?: () => void;
  onItemsChange?: () => void;
  onOpenAI?: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  handler: () => void;
  category: 'action' | 'ai' | 'navigation' | 'data';
  shortcut?: string;
}

interface AISearchResult {
  item: Item;
  score: number;
  reason: string;
}

export function EnhancedCommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onNewItem,
  onImportData,
  onExportData,
  onOpenSettings,
  onItemsChange,
  onOpenAI
}: EnhancedCommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'commands' | 'ai'>('search');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiResults, setAIResults] = useState<AISearchResult[]>([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize search engine
  useEffect(() => {
    searchEngine.setItems(items);
  }, [items]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setActiveTab('search');
      setSelectedIndex(0);
      setSearchResults([]);
      setAIResults([]);
      setIsAISearching(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setAIResults([]);
      return;
    }

    if (activeTab === 'search') {
      // Regular search
      const results = searchEngine.search({ query: searchTerm, limit: 10 });
      setSearchResults(results);
      setSelectedIndex(0);
    } else if (activeTab === 'ai') {
      // AI-powered search
      performAISearch(searchTerm);
    }
  }, [searchTerm, activeTab]);

  // AI Search
  const performAISearch = useCallback(async (query: string) => {
    if (!query.trim() || isAISearching) return;

    setIsAISearching(true);
    setAIResults([]);

    try {
      // First, get regular search results
      const regularResults = searchEngine.search({ query, limit: 20 });

      if (regularResults.length === 0) {
        setAIResults([]);
        return;
      }

      // Use AI to re-rank and explain results
      const prompt = `
Analyze the following search query and prayer items, then provide an intelligent ranking with explanations.

Query: "${query}"

Prayer Items:
${regularResults.map((result, index) =>
  `${index + 1}. Title: "${result.item.title}"
   Category: ${result.item.category}
   Tags: ${result.item.tags?.join(', ') || 'none'}
   Translation: ${result.item.translation_id?.substring(0, 100) || 'none'}...`
).join('\n\n')}

For each relevant item (max 5), provide:
1. Relevance score (1-10)
2. Brief explanation of why it matches the query
3. The item index from the list above

Format as JSON:
{
  "results": [
    {
      "index": 0,
      "score": 8,
      "reason": "Direct match because..."
    }
  ]
}`;

      const response = await aiComplete({
        messages: [
          { role: 'system', content: 'You are a helpful assistant for analyzing Islamic prayer relevance.' },
          { role: 'user', content: prompt }
        ]
      });

      try {
        const parsed = JSON.parse(response);
        const aiResults: AISearchResult[] = parsed.results
          .filter((r: any) => r.index < regularResults.length)
          .map((r: any) => ({
            item: regularResults[r.index].item,
            score: r.score,
            reason: r.reason
          }))
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 5);

        setAIResults(aiResults);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        // Fallback to regular results
        setAIResults(
          regularResults.slice(0, 5).map(result => ({
            item: result.item,
            score: Math.round(result.score * 10) / 10,
            reason: 'Standard search match'
          }))
        );
      }
    } catch (error) {
      console.error('AI search error:', error);
      setAIResults([]);
    } finally {
      setIsAISearching(false);
    }
  }, [isAISearching]);

  // Commands
  const commands: Command[] = [
    {
      id: 'new',
      label: 'Tambah doa baru',
      description: 'Buat item doa baru',
      icon: 'plus',
      handler: () => onNewItem?.(),
      category: 'action',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'ai-chat',
      label: 'Buka AI Assistant',
      description: 'Chat dengan AI untuk bantuan doa',
      icon: 'sparkles',
      handler: () => onOpenAI?.(),
      category: 'ai',
      shortcut: 'Ctrl+A'
    },
    {
      id: 'ai-parse',
      label: 'Parse teks dengan AI',
      description: 'Ekstrak doa dari teks menggunakan AI',
      icon: 'brain',
      handler: () => executeAICommand('parse_text'),
      category: 'ai'
    },
    {
      id: 'ai-suggest',
      label: 'AI Suggestions',
      description: 'Dapatkan saran kategori dan tag dari AI',
      icon: 'lightbulb',
      handler: () => executeAICommand('suggest_improvements'),
      category: 'ai'
    },
    {
      id: 'ai-quality',
      label: 'Quality Check',
      description: 'Periksa kualitas semua doa dengan AI',
      icon: 'check-circle',
      handler: () => executeAICommand('quality_check_all'),
      category: 'ai'
    },
    {
      id: 'import',
      label: 'Import data',
      description: 'Import doa dari file',
      icon: 'upload',
      handler: () => onImportData?.(),
      category: 'data',
      shortcut: 'Ctrl+I'
    },
    {
      id: 'export',
      label: 'Export data',
      description: 'Export semua doa ke file',
      icon: 'download',
      handler: () => onExportData?.(),
      category: 'data',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      description: 'Buka pengaturan aplikasi',
      icon: 'settings',
      handler: () => onOpenSettings?.(),
      category: 'navigation',
      shortcut: 'Ctrl+,'
    }
  ];

  // Execute AI commands
  const executeAICommand = async (command: string) => {
    setIsExecutingCommand(true);

    try {
      switch (command) {
        case 'parse_text':
          const textInput = prompt('Masukkan teks doa yang ingin diparse:');
          if (textInput) {
            await executeAITool('analyze_text', { text: textInput }, { onItemsChange });
          }
          break;

        case 'suggest_improvements':
          // Find items that need improvement
          const itemsNeedingImprovement = items.filter(item =>
            !item.translation_id || !item.arabic || item.tags.length === 0
          ).slice(0, 5);

          for (const item of itemsNeedingImprovement) {
            await executeAITool('suggest_categories_tags', {
              title: item.title,
              arabic: item.arabic,
              latin: item.latin,
              translation_id: item.translation_id
            }, { onItemsChange });
          }
          break;

        case 'quality_check_all':
          // Check quality of first 10 items
          const itemsToCheck = items.slice(0, 10);
          for (const item of itemsToCheck) {
            await executeAITool('quality_check', { item }, { onItemsChange });
          }
          break;
      }
    } catch (error) {
      console.error('AI command error:', error);
    } finally {
      setIsExecutingCommand(false);
      onClose();
    }
  };

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const maxIndex = activeTab === 'search'
      ? searchResults.length - 1
      : activeTab === 'ai'
      ? aiResults.length - 1
      : filteredCommands.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        handleSelection();
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setActiveTab(prev =>
            prev === 'search' ? 'ai' : prev === 'ai' ? 'commands' : 'search'
          );
        } else {
          setActiveTab(prev =>
            prev === 'search' ? 'commands' : prev === 'commands' ? 'ai' : 'search'
          );
        }
        setSelectedIndex(0);
        break;
    }
  };

  // Handle selection
  const handleSelection = () => {
    if (activeTab === 'search' && searchResults[selectedIndex]) {
      onSelectItem(searchResults[selectedIndex].item);
      onClose();
    } else if (activeTab === 'ai' && aiResults[selectedIndex]) {
      onSelectItem(aiResults[selectedIndex].item);
      onClose();
    } else if (activeTab === 'commands' && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].handler();
      if (!filteredCommands[selectedIndex].id.startsWith('ai-')) {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setActiveTab('search');
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon name="search" size={14} className="inline mr-1" />
              Search
            </button>
            <button
              onClick={() => {
                setActiveTab('commands');
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'commands'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon name="command" size={14} className="inline mr-1" />
              Commands
            </button>
            <button
              onClick={() => {
                setActiveTab('ai');
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon name="sparkles" size={14} className="inline mr-1" />
              AI Search
            </button>
          </div>

          <div className="relative">
            <Icon
              name={activeTab === 'ai' ? 'sparkles' : 'search'}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={
                activeTab === 'search'
                  ? 'Cari doa...'
                  : activeTab === 'ai'
                  ? 'AI-powered search...'
                  : 'Ketik perintah...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
            />
            {(isAISearching || isExecutingCommand) && (
              <Icon
                name="loader"
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 animate-spin"
              />
            )}
          </div>

          {/* Quick tips */}
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>↑↓ navigate • Enter select • Tab switch mode • Esc close</span>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {activeTab === 'search' && (
            <div className="p-2">
              {searchResults.length === 0 && searchTerm && (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  <Icon name="search" size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No prayers found for "{searchTerm}"</p>
                  <p className="text-sm mt-1">Try AI Search for better results</p>
                </div>
              )}
              {searchResults.map((result, index) => (
                <div
                  key={result.item.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    onSelectItem(result.item);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon name="book-open" size={16} className="text-slate-400 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {result.item.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {result.item.translation_id}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {result.item.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Score: {result.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-2">
              {isAISearching && (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  <Icon name="sparkles" size={24} className="mx-auto mb-2 animate-pulse" />
                  <p>AI is analyzing prayers...</p>
                </div>
              )}
              {!isAISearching && aiResults.length === 0 && searchTerm && (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  <Icon name="brain" size={24} className="mx-auto mb-2 opacity-50" />
                  <p>AI found no relevant prayers for "{searchTerm}"</p>
                </div>
              )}
              {aiResults.map((result, index) => (
                <div
                  key={result.item.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    onSelectItem(result.item);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon name="sparkles" size={16} className="text-purple-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {result.item.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {result.item.translation_id}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        🤖 {result.reason}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {result.item.category}
                        </span>
                        <span className="text-xs text-purple-500">
                          AI Score: {result.score}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="p-2">
              {filteredCommands.length === 0 && searchTerm && (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  <Icon name="command" size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No commands found for "{searchTerm}"</p>
                </div>
              )}
              {filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    command.handler();
                    if (!command.id.startsWith('ai-')) {
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      name={command.icon as any}
                      size={16}
                      className={`mt-1 ${
                        command.category === 'ai'
                          ? 'text-purple-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {command.label}
                        </h4>
                        {command.shortcut && (
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono">
                            {command.shortcut}
                          </span>
                        )}
                      </div>
                      {command.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {command.description}
                        </p>
                      )}
                      <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                        command.category === 'ai'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : command.category === 'action'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : command.category === 'data'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {command.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}