"""
数据模型定义
使用Pydantic定义API请求和响应模型
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    """消息角色枚举"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    """聊天消息模型"""
    role: MessageRole = Field(..., description="消息角色")
    content: str = Field(..., description="消息内容")
    timestamp: datetime = Field(default_factory=datetime.now, description="时间戳")

class ChatRequest(BaseModel):
    """聊天请求模型"""
    message: str = Field(..., min_length=1, max_length=2000, description="用户消息")
    session_id: Optional[str] = Field(None, description="会话ID")
    language: str = Field(default="zh", pattern="^(zh|en)$", description="语言偏好")
    context: Optional[List[ChatMessage]] = Field(default=[], description="上下文消息")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "你好，能介绍一下你的技能吗？",
                "session_id": "session_123",
                "language": "zh",
                "context": []
            }
        }

class RetrievalResult(BaseModel):
    """检索结果模型"""
    content: str = Field(..., description="文档内容")
    metadata: Dict[str, Any] = Field(..., description="元数据")
    similarity: float = Field(..., ge=0, le=1, description="相似度分数")
    source: str = Field(..., description="来源文件")

class ChatResponse(BaseModel):
    """聊天响应模型"""
    response: str = Field(..., description="AI回复")
    session_id: str = Field(..., description="会话ID")
    language: str = Field(..., description="响应语言")
    retrieval_results: List[RetrievalResult] = Field(..., description="检索结果")
    token_usage: Dict[str, int] = Field(..., description="Token使用统计")
    timestamp: datetime = Field(default_factory=datetime.now, description="响应时间戳")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "你好！我是一个全栈开发者，擅长React、Node.js和Python...",
                "session_id": "session_123",
                "language": "zh",
                "retrieval_results": [],
                "token_usage": {"prompt_tokens": 150, "completion_tokens": 50, "total_tokens": 200},
                "timestamp": "2025-08-09T10:30:00"
            }
        }

class HealthResponse(BaseModel):
    """健康检查响应模型"""
    status: str = Field(..., description="服务状态")
    timestamp: datetime = Field(default_factory=datetime.now, description="检查时间")
    version: str = Field(..., description="服务版本")
    dependencies: Dict[str, str] = Field(..., description="依赖服务状态")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2025-08-09T10:30:00",
                "version": "1.0.0",
                "dependencies": {
                    "chromadb": "healthy",
                    "openai": "healthy"
                }
            }
        }

class ErrorResponse(BaseModel):
    """错误响应模型"""
    error: str = Field(..., description="错误类型")
    message: str = Field(..., description="错误消息")
    details: Optional[Dict[str, Any]] = Field(None, description="错误详情")
    timestamp: datetime = Field(default_factory=datetime.now, description="错误时间")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "ValidationError",
                "message": "消息长度不能超过2000字符",
                "details": {"field": "message", "limit": 2000},
                "timestamp": "2025-08-09T10:30:00"
            }
        }

class SessionInfo(BaseModel):
    """会话信息模型"""
    session_id: str = Field(..., description="会话ID")
    created_at: datetime = Field(..., description="创建时间")
    last_active: datetime = Field(..., description="最后活跃时间")
    message_count: int = Field(..., description="消息数量")
    language: str = Field(..., description="语言偏好")

class DocumentMetadata(BaseModel):
    """文档元数据模型"""
    filename: str = Field(..., description="文件名")
    file_path: str = Field(..., description="文件路径")
    chunk_index: int = Field(..., description="分块索引")
    total_chunks: int = Field(..., description="总分块数")
    content_type: str = Field(..., description="内容类型")
    last_updated: datetime = Field(..., description="最后更新时间")
    tags: List[str] = Field(default=[], description="标签")

class VectorStoreStats(BaseModel):
    """向量数据库统计模型"""
    collection_name: str = Field(..., description="集合名称")
    document_count: int = Field(..., description="文档数量")
    last_updated: datetime = Field(..., description="最后更新时间")
    index_size_mb: float = Field(..., description="索引大小(MB)")

# 导出所有模型
__all__ = [
    "MessageRole", "ChatMessage", "ChatRequest", "RetrievalResult", 
    "ChatResponse", "HealthResponse", "ErrorResponse", "SessionInfo",
    "DocumentMetadata", "VectorStoreStats"
]