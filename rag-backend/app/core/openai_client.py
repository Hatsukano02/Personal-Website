"""
OpenAI API客户端封装
处理与OpenAI API的交互，包括聊天完成和嵌入
"""

from openai import AsyncOpenAI
from typing import List, Dict, Any, Optional
from loguru import logger
import tiktoken
from datetime import datetime

from app.config import settings
from app.models import ChatMessage, MessageRole

class OpenAIClient:
    """OpenAI API客户端"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.encoding = tiktoken.encoding_for_model("gpt-4.1-mini")
        self._model = settings.OPENAI_MODEL
        self._embedding_model = settings.OPENAI_EMBEDDING_MODEL
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        调用OpenAI聊天完成API
        
        Args:
            messages: 聊天消息列表
            temperature: 温度参数
            max_tokens: 最大token数
            system_prompt: 系统提示词
            
        Returns:
            包含回复和token使用情况的字典
        """
        try:
            # 准备消息
            api_messages = []
            
            # 添加系统提示
            if system_prompt:
                api_messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            # 添加对话消息
            api_messages.extend(messages)
            
            # 计算输入token数
            input_text = "\n".join([msg["content"] for msg in api_messages])
            input_tokens = len(self.encoding.encode(input_text))
            
            # 检查上下文长度
            if input_tokens > settings.MAX_CONTEXT_LENGTH:
                # 截断早期消息，保留系统提示和最近的消息
                logger.warning(f"输入token数({input_tokens})超过限制，进行截断")
                api_messages = self._truncate_messages(api_messages, settings.MAX_CONTEXT_LENGTH // 2)
            
            logger.info(f"发送聊天请求: model={self._model}, input_tokens={input_tokens}")
            
            # 调用OpenAI API
            response = await self.client.chat.completions.create(
                model=self._model,
                messages=api_messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            # 提取响应
            reply = response.choices[0].message.content
            token_usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
            
            logger.info(f"聊天完成: tokens={token_usage['total_tokens']}")
            
            return {
                "reply": reply,
                "token_usage": token_usage,
                "model": self._model
            }
            
        except Exception as e:
            logger.error(f"OpenAI聊天完成失败: {e}")
            raise
    
    async def create_embedding(self, text: str) -> List[float]:
        """
        创建文本嵌入
        
        Args:
            text: 输入文本
            
        Returns:
            嵌入向量
        """
        try:
            response = await self.client.embeddings.create(
                model=self._embedding_model,
                input=text
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            logger.error(f"创建嵌入失败: {e}")
            raise
    
    async def create_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        批量创建文本嵌入
        
        Args:
            texts: 输入文本列表
            
        Returns:
            嵌入向量列表
        """
        try:
            response = await self.client.embeddings.create(
                model=self._embedding_model,
                input=texts
            )
            
            return [item.embedding for item in response.data]
            
        except Exception as e:
            logger.error(f"批量创建嵌入失败: {e}")
            raise
    
    def count_tokens(self, text: str) -> int:
        """计算文本的token数量"""
        return len(self.encoding.encode(text))
    
    def _truncate_messages(
        self, 
        messages: List[Dict[str, str]], 
        max_tokens: int
    ) -> List[Dict[str, str]]:
        """截断消息以适应token限制"""
        system_msgs = [msg for msg in messages if msg["role"] == "system"]
        other_msgs = [msg for msg in messages if msg["role"] != "system"]
        
        # 保留系统消息和最后几条对话
        result = system_msgs.copy()
        
        # 从后往前添加消息，直到达到token限制
        current_tokens = sum(self.count_tokens(msg["content"]) for msg in system_msgs)
        
        for msg in reversed(other_msgs):
            msg_tokens = self.count_tokens(msg["content"])
            if current_tokens + msg_tokens <= max_tokens:
                result.insert(-len(system_msgs) if system_msgs else 0, msg)
                current_tokens += msg_tokens
            else:
                break
        
        return result
    
    def get_system_prompt(self, language: str = "zh") -> str:
        """获取系统提示词"""
        if language == "en":
            return """You are an AI assistant for a personal website, helping visitors learn about the website owner. 
            
Key guidelines:
- Respond in English unless asked otherwise
- Be friendly, professional, and helpful
- Use the provided context to answer questions accurately
- If you don't know something, say so honestly
- Keep responses concise but informative
- Focus on the person's skills, projects, and experiences
- Maintain a conversational tone

The context provided contains information about the website owner's background, skills, and projects. Use this information to provide helpful and accurate responses."""
        
        else:  # 默认中文
            return """你是个人网站的AI助手，帮助访客了解网站主人的信息。

核心原则：
- 优先使用中文回复，除非用户要求其他语言  
- 保持友好、专业和乐于助人的态度
- 基于提供的上下文准确回答问题
- 如果不了解某些信息，请诚实说明
- 回复要简洁但信息丰富
- 重点介绍个人技能、项目和经历
- 保持对话式的语气

提供的上下文包含网站主人的背景、技能和项目信息。请使用这些信息提供有帮助且准确的回复。"""

# 全局OpenAI客户端实例
openai_client_instance = None

def get_openai_client() -> OpenAIClient:
    """获取OpenAI客户端实例"""
    global openai_client_instance
    if openai_client_instance is None:
        openai_client_instance = OpenAIClient()
    return openai_client_instance