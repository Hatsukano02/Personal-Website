"""
服务管理器
统一管理全局服务实例
"""

from typing import Optional
from loguru import logger

from app.core.rag_service import RAGService
from app.core.session_manager import SessionManager


class ServiceManager:
    """服务管理器单例"""
    
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.rag_service: Optional[RAGService] = None
            self.session_manager: Optional[SessionManager] = None
            ServiceManager._initialized = True
    
    async def initialize_services(self):
        """初始化所有服务"""
        try:
            logger.info("初始化RAG服务...")
            self.rag_service = RAGService()
            await self.rag_service.initialize()
            
            logger.info("初始化会话管理器...")
            self.session_manager = SessionManager()
            
            logger.info("所有服务初始化完成")
            
        except Exception as e:
            logger.error(f"服务初始化失败: {e}")
            raise
    
    async def shutdown_services(self):
        """关闭所有服务"""
        try:
            if self.session_manager:
                logger.info("关闭会话管理器...")
                await self.session_manager.cleanup()
                self.session_manager = None
            
            if self.rag_service:
                logger.info("关闭RAG服务...")
                # RAG服务的向量存储会在main.py中关闭
                self.rag_service = None
            
            logger.info("所有服务已关闭")
            
        except Exception as e:
            logger.error(f"服务关闭失败: {e}")
    
    def get_rag_service(self) -> RAGService:
        """获取RAG服务实例"""
        if not self.rag_service:
            raise RuntimeError("RAG服务未初始化")
        return self.rag_service
    
    def get_session_manager(self) -> SessionManager:
        """获取会话管理器实例"""
        if not self.session_manager:
            raise RuntimeError("会话管理器未初始化")
        return self.session_manager


# 全局服务管理器实例
service_manager = ServiceManager()


def get_service_manager() -> ServiceManager:
    """获取服务管理器实例"""
    return service_manager