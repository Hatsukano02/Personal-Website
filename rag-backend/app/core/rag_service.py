"""
RAG检索增强生成服务
整合向量检索和LLM生成
"""

from typing import List, Dict, Any, Optional
from loguru import logger
from datetime import datetime

from app.core.vector_store import get_vector_store
from app.core.openai_client import get_openai_client
from app.models import ChatMessage, RetrievalResult
from app.config import settings

class RAGService:
    """RAG检索增强生成服务"""
    
    def __init__(self):
        self.vector_store = None
        self.openai_client = None
        self._initialized = False
    
    async def initialize(self):
        """初始化RAG服务"""
        if self._initialized:
            return
        
        try:
            self.vector_store = await get_vector_store()
            self.openai_client = get_openai_client()
            self._initialized = True
            logger.info("RAG服务初始化完成")
            
        except Exception as e:
            logger.error(f"RAG服务初始化失败: {e}")
            raise
    
    async def chat(
        self,
        message: str,
        session_id: str,
        language: str = "zh",
        context: Optional[List[ChatMessage]] = None
    ) -> Dict[str, Any]:
        """处理聊天请求"""
        if not self._initialized:
            await self.initialize()
        
        try:
            logger.info(f"处理聊天请求: session_id={session_id}, language={language}")
            
            # 1. 检索相关文档
            retrieval_results = await self._retrieve_relevant_docs(message)
            
            # 2. 构建增强提示
            enhanced_prompt = self._build_enhanced_prompt(
                message, retrieval_results, language
            )
            
            # 3. 准备对话上下文
            messages = self._prepare_messages(enhanced_prompt, context or [])
            
            # 4. 获取系统提示
            system_prompt = self.openai_client.get_system_prompt(language)
            
            # 5. 调用LLM生成回复
            llm_response = await self.openai_client.chat_completion(
                messages=messages,
                system_prompt=system_prompt,
                temperature=0.7
            )
            
            # 6. 处理并返回结果
            response = {
                "response": llm_response["reply"],
                "retrieval_results": [result.dict() for result in retrieval_results],
                "token_usage": llm_response["token_usage"],
                "model": llm_response["model"],
                "timestamp": datetime.now().isoformat()
            }
            
            logger.info(f"聊天完成: tokens={llm_response['token_usage']['total_tokens']}")
            return response
            
        except Exception as e:
            logger.error(f"聊天处理失败: {e}")
            raise
    
    async def _retrieve_relevant_docs(self, query: str) -> List[RetrievalResult]:
        """检索相关文档"""
        try:
            # 检索相关文档
            results = await self.vector_store.search(
                query=query,
                n_results=settings.TOP_K_RESULTS
            )
            
            logger.info(f"检索到 {len(results)} 个相关文档")
            return results
            
        except Exception as e:
            logger.error(f"文档检索失败: {e}")
            return []
    
    def _build_enhanced_prompt(
        self, 
        user_message: str, 
        retrieval_results: List[RetrievalResult],
        language: str
    ) -> str:
        """构建增强的提示词"""
        # 构建上下文信息
        context_parts = []
        
        if retrieval_results:
            if language == "en":
                context_parts.append("## Relevant Information:")
            else:
                context_parts.append("## 相关信息：")
            
            for i, result in enumerate(retrieval_results, 1):
                source_info = f"[来源: {result.source}]" if language == "zh" else f"[Source: {result.source}]"
                context_parts.append(f"### {i}. {source_info}")
                context_parts.append(result.content)
                context_parts.append("")  # 空行分隔
        
        # 构建完整提示
        if language == "en":
            if context_parts:
                prompt_template = f"""Based on the following relevant information, please answer the user's question:

{chr(10).join(context_parts)}

## User Question:
{user_message}

Please provide a helpful and accurate response based on the information above. If the provided information doesn't contain relevant details for the question, please say so honestly."""
            else:
                prompt_template = f"""User Question: {user_message}

Please provide a helpful response. If you need specific information that isn't available, please let the user know."""
        
        else:  # 中文
            if context_parts:
                prompt_template = f"""基于以下相关信息，请回答用户的问题：

{chr(10).join(context_parts)}

## 用户问题：
{user_message}

请基于上述信息提供有帮助且准确的回答。如果提供的信息中没有相关内容，请诚实说明。"""
            else:
                prompt_template = f"""用户问题：{user_message}

请提供有帮助的回答。如果需要特定信息但无法获取，请告知用户。"""
        
        return prompt_template
    
    def _prepare_messages(
        self, 
        enhanced_prompt: str, 
        context: List[ChatMessage]
    ) -> List[Dict[str, str]]:
        """准备对话消息"""
        messages = []
        
        # 添加历史上下文(限制数量以控制token使用)
        max_context_messages = 4  # 最多包含最近4轮对话
        recent_context = context[-max_context_messages:] if context else []
        
        for msg in recent_context:
            messages.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        # 添加当前增强提示
        messages.append({
            "role": "user",
            "content": enhanced_prompt
        })
        
        return messages
    
    def _calculate_relevance_score(
        self, 
        user_message: str, 
        retrieval_results: List[RetrievalResult]
    ) -> float:
        """计算检索结果的整体相关性分数"""
        if not retrieval_results:
            return 0.0
        
        # 简单的相关性计算：平均相似度分数
        total_similarity = sum(result.similarity for result in retrieval_results)
        avg_similarity = total_similarity / len(retrieval_results)
        
        return avg_similarity
    
    async def suggest_questions(
        self, 
        language: str = "zh", 
        limit: int = 3
    ) -> List[str]:
        """生成建议问题"""
        try:
            # 基于知识库内容生成建议问题
            if language == "en":
                suggestions = [
                    "What are your main technical skills?",
                    "Can you tell me about your recent projects?", 
                    "What's your background and experience?",
                    "How can I contact you?",
                    "What technologies do you specialize in?"
                ]
            else:
                suggestions = [
                    "你的主要技术技能是什么？",
                    "能介绍一下你最近的项目吗？",
                    "你的背景和经历如何？",
                    "如何联系你？",
                    "你专长哪些技术？"
                ]
            
            return suggestions[:limit]
            
        except Exception as e:
            logger.error(f"生成建议问题失败: {e}")
            return []
    
    async def get_service_stats(self) -> Dict[str, Any]:
        """获取服务统计信息"""
        try:
            vector_stats = await self.vector_store.get_stats()
            
            return {
                "service_status": "active",
                "vector_store": vector_stats,
                "configuration": {
                    "chunk_size": settings.CHUNK_SIZE,
                    "top_k_results": settings.TOP_K_RESULTS,
                    "similarity_threshold": settings.SIMILARITY_THRESHOLD,
                    "max_context_length": settings.MAX_CONTEXT_LENGTH
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"获取服务统计失败: {e}")
            return {"error": str(e)}

# 全局RAG服务实例
rag_service_instance = None

async def get_rag_service() -> RAGService:
    """获取RAG服务实例"""
    global rag_service_instance
    if rag_service_instance is None:
        rag_service_instance = RAGService()
        await rag_service_instance.initialize()
    return rag_service_instance