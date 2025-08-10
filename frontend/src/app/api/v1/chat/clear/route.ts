export async function POST() {
  try {
    // 清除会话的逻辑
    // 这里可以添加更复杂的会话管理，比如从数据库中删除会话记录
    
    return new Response(
      JSON.stringify({ success: true, message: '会话已清除' }), 
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