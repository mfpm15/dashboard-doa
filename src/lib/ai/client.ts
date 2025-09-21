import { AIMessage, AITool } from '@/types';

export interface StreamOptions {
  messages: AIMessage[];
  tools?: AITool[];
  model?: string;
  onDelta?: (delta: string, json: any) => void;
  onToolCalls?: (toolCalls: any[], json: any) => void;
}

export async function aiStream(options: StreamOptions): Promise<void> {
  const { messages, tools, model = 'deepseek/deepseek-chat', onDelta, onToolCalls } = options;

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

        // Ensure we have a valid response structure
        if (!json.choices || !Array.isArray(json.choices) || json.choices.length === 0) {
          console.warn('Invalid response structure:', json);
          continue;
        }

        const choice = json.choices[0];
        const delta = choice?.delta;
        const message = choice?.message;

        // Handle content delta
        if (delta?.content && typeof delta.content === 'string') {
          onDelta?.(delta.content, json);
        }

        // Handle tool calls
        const toolCalls = delta?.tool_calls || message?.tool_calls;
        if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
          onToolCalls?.(toolCalls, json);
        }
      } catch (error) {
        console.warn('Failed to parse streaming data:', data, error);
        // Continue processing even if one chunk fails
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