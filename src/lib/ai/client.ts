import { AIMessage, AITool } from '@/types';

export interface StreamOptions {
  messages: AIMessage[];
  tools?: AITool[];
  model?: string;
  onDelta?: (delta: string, json: any) => void;
  onToolCalls?: (toolCalls: any[], json: any) => void;
}

export async function aiStream(options: StreamOptions): Promise<void> {
  const { messages, tools, model = 'deepseek/deepseek-chat-v3.1:free', onDelta, onToolCalls } = options;

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      tools,
      model,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    while (true) {
      const lineEnd = buffer.indexOf('\n');
      if (lineEnd < 0) break;

      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);

      if (!line.startsWith('data:')) continue;

      const data = line.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta;

        if (delta?.content) {
          onDelta?.(delta.content, json);
        }

        const toolCalls = delta?.tool_calls || json.choices?.[0]?.message?.tool_calls;
        if (toolCalls?.length) {
          onToolCalls?.(toolCalls, json);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }
}

export async function aiComplete(options: Omit<StreamOptions, 'onDelta' | 'onToolCalls'>): Promise<string> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...options,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || '';
}