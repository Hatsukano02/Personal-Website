"""
配置管理
基于Pydantic Settings进行配置管理
"""

from pydantic import Field
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """应用配置"""
    
    # OpenAI API配置
    OPENAI_API_KEY: str = Field(..., description="OpenAI API密钥")
    OPENAI_MODEL: str = Field(default="gpt-4.1-mini", description="OpenAI模型名称")
    OPENAI_EMBEDDING_MODEL: str = Field(default="text-embedding-3-small", description="嵌入模型名称")
    
    # ChromaDB配置
    CHROMA_PERSIST_DIRECTORY: str = Field(default="./chroma_db", description="ChromaDB持久化目录")
    CHROMA_COLLECTION_NAME: str = Field(default="personal_knowledge", description="ChromaDB集合名称")
    
    # API配置
    API_HOST: str = Field(default="0.0.0.0", description="API服务器地址")
    API_PORT: int = Field(default=8000, description="API服务器端口")
    API_PREFIX: str = Field(default="/api/v1", description="API路径前缀")
    
    # 限流配置
    RATE_LIMIT_PER_MINUTE: int = Field(default=3, description="每分钟请求限制")
    MAX_ROUNDS_PER_SESSION: int = Field(default=5, description="每会话最大轮数")
    
    # 分块配置
    CHUNK_SIZE: int = Field(default=1500, description="文档分块大小")
    CHUNK_OVERLAP: int = Field(default=200, description="分块重叠大小")
    
    # 检索配置
    TOP_K_RESULTS: int = Field(default=5, description="检索返回数量")
    SIMILARITY_THRESHOLD: float = Field(default=0.7, description="相似度阈值")
    
    # 日志配置
    LOG_LEVEL: str = Field(default="INFO", description="日志级别")
    LOG_FILE: str = Field(default="./logs/rag_chatbot.log", description="日志文件路径")
    
    # CORS配置
    CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://localhost:3001"], 
        description="允许的CORS来源"
    )
    CORS_ALLOW_CREDENTIALS: bool = Field(default=True, description="允许携带凭证")
    
    # 会话配置
    SESSION_TIMEOUT_MINUTES: int = Field(default=30, description="会话超时时间(分钟)")
    MAX_CONTEXT_LENGTH: int = Field(default=100000, description="最大上下文长度")
    
    model_config = {
        'env_file': '.env',
        'env_file_encoding': 'utf-8',
        'case_sensitive': True
    }

# 创建全局设置实例
settings = Settings()

# 验证配置
def validate_config():
    """验证关键配置"""
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_openai_api_key_here":
        raise ValueError("请设置有效的OPENAI_API_KEY")
    
    if settings.CHUNK_SIZE <= 0:
        raise ValueError("CHUNK_SIZE必须大于0")
    
    if settings.TOP_K_RESULTS <= 0:
        raise ValueError("TOP_K_RESULTS必须大于0")
    
    if not (0 <= settings.SIMILARITY_THRESHOLD <= 1):
        raise ValueError("SIMILARITY_THRESHOLD必须在0-1之间")

# 导出配置验证函数
__all__ = ["settings", "validate_config"]