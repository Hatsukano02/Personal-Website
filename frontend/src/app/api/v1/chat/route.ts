import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';

// 允许流式响应最多30秒
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // 添加CORS头
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: '你是一个友善的AI助手，请用中文回答问题。',
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }), 
      { 
        status: 500,
        headers
      }
    );
  }
}

// 处理预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// 清除会话的端点
export async function DELETE() {
  try {
    // 这里可以添加清除会话的逻辑
    // 目前只是返回成功响应
    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Clear session error:', error);
    return new Response(
      JSON.stringify({ error: '清除会话失败' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}