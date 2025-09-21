'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toast';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface AIAssistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem?: Item | null;
  items: Item[];
  onItemUpdate?: (item: Item) => void;
  className?: string;
}

export function AIAssistPanel({
  isOpen,
  onClose,
  selectedItem,
  items,
  onItemUpdate,
  className = ''
}: AIAssistPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Selamat datang di AI Assistant! 🤖

Saya dapat membantu Anda dengan:
• Menjelaskan makna doa dan zikir
• Memberikan konteks historis dan dalil
• Menyarankan doa untuk situasi tertentu
• Menganalisis teks Arab dan terjemahan
• Mencari doa yang sesuai kebutuhan

${selectedItem ? `Saat ini Anda sedang melihat: "${selectedItem.title}"` : 'Silakan pilih doa untuk dianalisis atau tanyakan apa saja!'}`,
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, selectedItem, messages.length]);

  // Predefined prompts
  const quickPrompts = [
    {
      id: 'explain',
      label: 'Jelaskan makna doa ini',
      prompt: selectedItem ? `Jelaskan makna dan konteks dari doa "${selectedItem.title}". Berikan penjelasan tentang teks Arab, terjemahan, dan kapan sebaiknya dibaca.` : 'Jelaskan makna doa yang dipilih'
    },
    {
      id: 'similar',
      label: 'Cari doa serupa',
      prompt: selectedItem ? `Carikan doa-doa lain yang serupa dengan "${selectedItem.title}" dalam koleksi saya.` : 'Carikan doa serupa'
    },
    {
      id: 'when',
      label: 'Kapan membaca doa ini?',
      prompt: selectedItem ? `Kapan waktu yang tepat untuk membaca doa "${selectedItem.title}"? Jelaskan adab dan situasi yang sesuai.` : 'Kapan waktu yang tepat membaca doa ini?'
    },
    {
      id: 'benefits',
      label: 'Apa manfaat spiritual?',
      prompt: selectedItem ? `Apa manfaat spiritual dan hikmah dari membaca doa "${selectedItem.title}"?` : 'Apa manfaat spiritual dari doa ini?'
    }
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: AIMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Prepare context
      const context = {
        selectedItem,
        totalItems: items.length,
        categories: Array.from(new Set(items.map(item => item.category))),
        hasAudio: items.filter(item => item.audio?.length).length
      };

      // Create assistant message placeholder
      const assistantMessage: AIMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Call AI API with streaming
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Handle OpenRouter/DeepSeek response format
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
                const content = parsed.choices[0].message.content;
                if (content) {
                  accumulatedContent = content; // For complete responses

                  // Update the streaming message
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ));
                }
              }
              // Handle streaming delta format
              else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                const delta = parsed.choices[0].delta.content;
                if (delta) {
                  accumulatedContent += delta;

                  // Update the streaming message
                  setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ));
                }
              }
              // Handle simple content format
              else if (parsed.content) {
                accumulatedContent += parsed.content;

                // Update the streaming message
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', data, e);
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, isStreaming: false }
          : msg
      ));

      // Fallback: if no content received, try non-streaming
      if (!accumulatedContent.trim()) {
        console.log('No streaming content received, trying non-streaming fallback...');

        const fallbackResponse = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            stream: false
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.choices && fallbackData.choices[0]) {
            const content = fallbackData.choices[0].message.content;
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: content, isStreaming: false }
                : msg
            ));
          }
        }
      }

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Request was aborted
        setMessages(prev => prev.slice(0, -1)); // Remove the streaming message
      } else {
        console.error('AI request failed:', error);

        // Update the assistant message with error
        setMessages(prev => prev.map(msg =>
          msg.role === 'assistant' && msg.isStreaming
            ? {
                ...msg,
                content: 'Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi.',
                isStreaming: false
              }
            : msg
        ));

        toast.error('Gagal menghubungi AI Assistant');
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: AIMessage = {
      id: 'welcome_new',
      role: 'assistant',
      content: 'Chat telah dibersihkan. Silakan ajukan pertanyaan baru!',
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 z-40 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Icon name="sparkles" className="text-white" size={16} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isStreaming ? 'Sedang mengetik...' : 'Siap membantu'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Bersihkan chat"
          >
            <Icon name="trash" size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      </div>

      {/* Selected Item Info */}
      {selectedItem && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="book-open" size={14} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Sedang dibahas:
            </span>
          </div>
          <p className="text-sm text-primary-800 dark:text-primary-200 line-clamp-2">
            {selectedItem.title}
          </p>
        </div>
      )}

      {/* Quick Prompts */}
      {selectedItem && (
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => sendMessage(prompt.prompt)}
                disabled={isLoading}
                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 280px)' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.isStreaming && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="animate-pulse w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="animate-pulse w-2 h-2 bg-slate-400 rounded-full delay-100"></div>
                  <div className="animate-pulse w-2 h-2 bg-slate-400 rounded-full delay-200"></div>
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan tentang doa dan zikir..."
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none min-h-[40px] max-h-24"
              disabled={isLoading}
              rows={1}
            />
            {isLoading && (
              <button
                type="button"
                onClick={stopGeneration}
                className="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                title="Stop generation"
              >
                <Icon name="square" size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name={isLoading ? "refresh" : "send"} size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </form>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Tekan Enter untuk kirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}