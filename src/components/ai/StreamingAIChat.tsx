'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AIMessage, Item } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { aiStream } from '@/lib/ai/client';
import { TOOLS, executeAITool } from '@/lib/ai/tools';

interface StreamingAIChatProps {
  item?: Item;
  onItemUpdate?: (item: Item) => void;
  onItemsChange?: () => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: any[];
  toolResults?: any[];
  isStreaming?: boolean;
}

export function StreamingAIChat({
  item,
  onItemUpdate,
  onItemsChange,
  className = ''
}: StreamingAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: item
          ? `Assalamu'alaikum! Saya siap membantu Anda dengan doa "${item.title}". Apa yang ingin Anda ketahui atau lakukan?`
          : `Assalamu'alaikum! Saya adalah asisten AI untuk Dashboard Doa. Saya dapat membantu Anda:\n\n• Mencari doa berdasarkan situasi atau kategori\n• Menambahkan doa baru ke koleksi\n• Menjelaskan makna dan asal-usul doa\n• Memberikan saran kategori dan tag\n• Menganalisis teks doa\n\nSilakan tanya apa saja yang ingin Anda ketahui!`,
        timestamp: Date.now(),
      };
      setMessages([greeting]);
    }
  }, [item, messages.length]);

  // Build AI messages from chat history
  const buildAIMessages = useCallback((): AIMessage[] => {
    const systemMessage: AIMessage = {
      role: 'system',
      content: `Anda adalah asisten AI untuk Dashboard Doa Islam. Tugas Anda:

1. Membantu pengguna mengelola koleksi doa dan zikir Islami
2. Memberikan informasi akurat tentang doa-doa dalam Islam
3. Membantu pencarian dan kategorisasi doa
4. Menjelaskan makna dan konteks doa dengan rujukan yang valid
5. Selalu bersikap sopan dan menghormati nilai-nilai Islam

${item ? `Konteks saat ini: Pengguna sedang melihat doa "${item.title}"` : ''}

Gunakan tools yang tersedia untuk operasi CRUD dan pencarian. Selalu berikan jawaban dalam Bahasa Indonesia kecuali diminta sebaliknya.`
    };

    const chatMessages: AIMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      tool_calls: msg.toolCalls,
      tool_call_id: msg.toolResults ? msg.id : undefined
    }));

    return [systemMessage, ...chatMessages];
  }, [messages, item]);

  // Handle sending message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const assistantMessageId = `assistant_${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setStreamingMessageId(assistantMessageId);

    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const aiMessages = buildAIMessages();
      aiMessages.push({ role: 'user', content: userMessage.content });

      let toolCallsToExecute: any[] = [];

      try {
        await aiStream({
          messages: aiMessages,
          tools: TOOLS,
          model: 'tngtech/deepseek-r1t2-chimera:free',
          onDelta: (delta, json) => {
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + delta }
                : msg
            ));
          },
          onToolCalls: (toolCalls, json) => {
            toolCallsToExecute = toolCalls;
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, toolCalls }
                : msg
            ));
          }
        });
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        // Continue to tool execution or finish
      }

      // Execute tool calls if any
      if (toolCallsToExecute.length > 0) {
        const toolResults: any[] = [];

        for (const toolCall of toolCallsToExecute) {
          try {
            const result = await executeAITool(
              toolCall.function.name,
              JSON.parse(toolCall.function.arguments),
              { onItemUpdate, onItemsChange, contextItem: item }
            );

            toolResults.push({
              tool_call_id: toolCall.id,
              result: JSON.stringify(result)
            });
          } catch (error) {
            toolResults.push({
              tool_call_id: toolCall.id,
              result: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
            });
          }
        }

        // Update message with tool results
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, toolResults, isStreaming: false }
            : msg
        ));

        // Continue conversation with tool results
        const toolMessages: AIMessage[] = toolResults.map(result => ({
          role: 'tool',
          content: result.result,
          tool_call_id: result.tool_call_id
        }));

        // Get AI response to tool results
        const finalResponseId = `assistant_final_${Date.now()}`;
        const finalMessage: ChatMessage = {
          id: finalResponseId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        };

        setMessages(prev => [...prev, finalMessage]);
        setStreamingMessageId(finalResponseId);

        try {
          await Promise.race([
            aiStream({
              messages: [...aiMessages, { role: 'user', content: userMessage.content }, ...toolMessages],
              tools: TOOLS,
              onDelta: (delta, json) => {
                setMessages(prev => prev.map(msg =>
                  msg.id === finalResponseId
                    ? { ...msg, content: msg.content + delta }
                    : msg
                ));
              },
              onToolCalls: (additionalToolCalls, json) => {
                // Handle nested tool calls if any
                console.log('Additional tool calls after tool execution:', additionalToolCalls);
              }
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('AI response timeout')), 30000)
            )
          ]);
        } catch (finalStreamError) {
          console.error('Final stream error:', finalStreamError);
          // If final streaming fails, still show tool results
          setMessages(prev => prev.map(msg =>
            msg.id === finalResponseId
              ? { ...msg, content: msg.content || 'Tool execution completed successfully.', isStreaming: false }
              : msg
          ));
        }

        setMessages(prev => prev.map(msg =>
          msg.id === finalResponseId
            ? { ...msg, isStreaming: false }
            : msg
        ));
      } else {
        // No tool calls, just finish streaming
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ));
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      console.error('AI Chat Error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');

      // Remove streaming message on error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, buildAIMessages, onItemUpdate, onItemsChange]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Stop streaming
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setStreamingMessageId(null);

    // Remove streaming message
    setMessages(prev => prev.filter(msg => !msg.isStreaming));
  };

  // Render tool calls
  const renderToolCalls = (toolCalls: any[], toolResults?: any[]) => {
    if (!toolCalls?.length) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
          💭 Menganalisis...
        </div>
        {toolCalls.map((call, index) => (
          <div key={call.id || index} className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
              {call.function.name}({JSON.stringify(JSON.parse(call.function.arguments), null, 1)})
            </code>
            {toolResults?.[index] && (
              <div className="mt-1 text-green-600 dark:text-green-400">
                ✓ Completed
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Format message content
  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-700 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`streaming-ai-chat flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" className="text-purple-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            AI Assistant
          </h3>
          {item && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              • {item.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <button
              onClick={stopStreaming}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Stop streaming"
            >
              <Icon name="square" size={16} />
            </button>
          )}
          <button
            onClick={clearConversation}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div
                className={`${message.role === 'assistant' ? 'prose prose-sm dark:prose-invert max-w-none' : ''}`}
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(message.content)
                }}
              />

              {message.isStreaming && (
                <div className="flex items-center gap-2 mt-2">
                  <Icon name="search" size={12} className="animate-spin" />
                  <span className="text-xs opacity-70">AI is typing...</span>
                </div>
              )}

              {message.toolCalls && renderToolCalls(message.toolCalls, message.toolResults)}

              <div className="text-xs opacity-50 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon name="alert-circle" className="text-red-500" size={16} />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tanya AI tentang doa, zikir, atau apa saja..."
            className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Icon name="search" size={16} className="animate-spin" />
            ) : (
              <Icon name="send" size={16} />
            )}
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
