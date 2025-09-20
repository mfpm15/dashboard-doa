import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, tools, stream = true, model = 'deepseek/deepseek-chat-v3.1:free', extraBody } = body;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
      'X-Title': process.env.OPENROUTER_SITE_NAME || ''
    };

    const requestBody = {
      model,
      messages,
      tools,
      stream,
      ...(extraBody || {})
    };

    if (stream) {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new NextResponse(errorText, { status: response.status });
      }

      // Create a TransformStream to handle the streaming response
      const stream = new ReadableStream({
        start(controller) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();

          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              controller.enqueue(decoder.decode(value, { stream: true }));
              return pump();
            });
          }

          return pump();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Transfer-Encoding': 'chunked'
        }
      });
    } else {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      return new NextResponse(responseText, {
        status: response.ok ? 200 : response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}