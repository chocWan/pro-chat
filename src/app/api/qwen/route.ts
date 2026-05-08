import { NextResponse } from 'next/server';

type IncomingMessage = {
  role?: string;
  content?: unknown;
};

const DASH_SCOPE_ENDPOINT =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

function normalizeMessages(messages: IncomingMessage[]) {
  return messages
    .map((message) => {
      const content =
        typeof message.content === 'string'
          ? message.content
          : JSON.stringify(message.content ?? '');

      return {
        role:
          message.role === 'assistant' || message.role === 'system' || message.role === 'user'
            ? message.role
            : 'user',
        content,
      };
    })
    .filter((message) => message.content.trim().length > 0);
}

export async function POST(request: Request) {
  const { messages = [] }: { messages?: IncomingMessage[] } = await request.json();
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      output: {
        text: '请先在 .env.local 中配置 DASHSCOPE_API_KEY，然后重启 pnpm dev。',
      },
    });
  }

  try {
    const response = await fetch(DASH_SCOPE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            ...normalizeMessages(messages),
          ],
        },
        parameters: {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          output: {
            text: data.message || data.code || 'Qwen API request failed.',
          },
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        output: {
          text: error instanceof Error ? error.message : 'Qwen API request failed.',
        },
      },
      { status: 500 },
    );
  }
}
