import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    const { messages, tools, stream = true, extraBody } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Updated fallback models - hanya free models yang benar-benar available
    const fallbackModels = [
      'qwen/qwen-2-7b-instruct:free',
      'microsoft/phi-3-medium-128k-instruct:free',
      'google/gemma-7b-it:free',
      'huggingfaceh4/zephyr-7b-beta:free',
      'openchat/openchat-7b:free'
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

            // Parse error to provide better messaging
            try {
              const error = JSON.parse(errorText);
              if (error.error?.code === 402) {
                console.warn(`Model ${currentModel} requires credits`);
              } else if (error.error?.code === 404) {
                console.warn(`Model ${currentModel} not found or no endpoints`);
              }
            } catch (e) {
              // Ignore JSON parse errors
            }

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

      if (!response.body) {
        throw new Error('No response body received for streaming');
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

              try {
                controller.enqueue(decoder.decode(value, { stream: true }));
                return pump();
              } catch (error) {
                console.error('Stream processing error:', error);
                controller.error(error);
              }
            }).catch(error => {
              console.error('Stream reading error:', error);
              controller.error(error);
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

      if (!response.body) {
        throw new Error('No response body received');
      }

      const responseText = await response.text();

      // Validate that we got a proper JSON response
      try {
        JSON.parse(responseText);
      } catch (parseError) {
        console.error('Invalid JSON response from AI service:', responseText);
        throw new Error('Invalid response format from AI service');
      }

      return new NextResponse(responseText, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('AI API Error:', error);

    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      },
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