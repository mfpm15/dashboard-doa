import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, tools, stream = true, extraBody } = body;

    // Updated fallback models with more reliable options
    const fallbackModels = [
      'deepseek/deepseek-chat',
      'microsoft/wizardlm-2-8x22b',
      'google/gemini-flash-1.5',
      'anthropic/claude-3-haiku',
      'meta-llama/llama-3.1-8b-instruct:free'
    ];

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
      'X-Title': process.env.OPENROUTER_SITE_NAME || ''
    };

    // Function to try multiple models
    async function tryWithFallback(models: string[], requestData: any): Promise<Response> {
      for (let i = 0; i < models.length; i++) {
        const currentModel = models[i];
        console.log(`Trying model: ${currentModel}`);

        const requestBody = {
          ...requestData,
          model: currentModel
        };

        try {
          const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
          });

          if (response.ok) {
            console.log(`Success with model: ${currentModel}`);
            return response;
          } else {
            const errorText = await response.text();
            console.warn(`Model ${currentModel} failed:`, errorText);

            // If it's the last model, return the error
            if (i === models.length - 1) {
              throw new Error(`All models failed. Last error: ${errorText}`);
            }
            // Otherwise, continue to next model
          }
        } catch (error) {
          console.warn(`Model ${currentModel} error:`, error);
          if (i === models.length - 1) {
            throw error;
          }
        }
      }

      throw new Error('All fallback models failed');
    }

    const requestBody = {
      messages,
      tools,
      stream,
      ...(extraBody || {})
    };

    if (stream) {
      const response = await tryWithFallback(fallbackModels, requestBody);

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
      const response = await tryWithFallback(fallbackModels, requestBody);
      const responseText = await response.text();

      return new NextResponse(responseText, {
        status: 200,
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