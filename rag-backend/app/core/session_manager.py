"""
会话管理器
管理用户会话状态，实现阅后即焚功能
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
from dataclasses import dataclass, asdict
from loguru import logger
import asyncio
from cachetools import TTLCache

from app.models import SessionInfo, ChatMessage, MessageRole
from app.config import settings

@dataclass
class SessionData:
    """会话数据"""
    session_id: str
    created_at: datetime
    last_active: datetime
    message_count: int
    language: str
    messages: List[ChatMessage]
    
    def to_session_info(self) -> SessionInfo:
        """转换为SessionInfo模型"""
        return SessionInfo(
            session_id=self.session_id,
            created_at=self.created_at,
            last_active=self.last_active,
            message_count=self.message_count,
            language=self.language
        )

class SessionManager:
    """会话管理器"""
    
    def __init__(self):
        # 使用TTL缓存实现会话过期
        cache_ttl = settings.SESSION_TIMEOUT_MINUTES * 60  # 转换为秒
        self.sessions: Dict[str, SessionData] = TTLCache(
            maxsize=1000,  # 最多缓存1000个会话
            ttl=cache_ttl
        )
        self._cleanup_task = None
        self._start_cleanup_task()
    
    def _start_cleanup_task(self):
        """启动清理任务"""
        async def cleanup_expired_sessions():
            while True:
                try:
                    # TTLCache会自动清理过期项，这里主要是记录日志
                    current_count = len(self.sessions)
                    if current_count > 0:
                        logger.debug(f"当前活跃会话数: {current_count}")
                    
                    # 每5分钟检查一次
                    await asyncio.sleep(300)
                    
                except Exception as e:
                    logger.error(f"会话清理任务异常: {e}")
                    await asyncio.sleep(60)  # 发生异常时等待1分钟后重试
                    
        self._cleanup_expired_sessions = cleanup_expired_sessions
        
        # 启动后台清理任务
        try:
            loop = asyncio.get_running_loop()
            self._cleanup_task = loop.create_task(cleanup_expired_sessions())
        except RuntimeError:
            # 如果没有运行的事件循环，将在第一个 API 调用时启动
            self._cleanup_task = None
    
    async def get_or_create_session(
        self, 
        session_id: str, 
        language: str = "zh"
    ) -> SessionInfo:
        """获取或创建会话"""
        try:
            # 延迟启动清理任务
            if self._cleanup_task is None:
                try:
                    loop = asyncio.get_running_loop()
                    self._cleanup_task = loop.create_task(self._cleanup_expired_sessions())
                except RuntimeError:
                    pass  # 如果仍无法获取事件循环，跳过
            
            current_time = datetime.now()
            
            if session_id in self.sessions:
                # 更新现有会话
                session = self.sessions[session_id]
                session.last_active = current_time
                
                logger.debug(f"更新会话: {session_id}")
                return session.to_session_info()
            else:
                # 创建新会话
                session = SessionData(
                    session_id=session_id,
                    created_at=current_time,
                    last_active=current_time,
                    message_count=0,
                    language=language,
                    messages=[]
                )
                
                self.sessions[session_id] = session
                
                logger.info(f"创建新会话: {session_id}, language={language}")
                return session.to_session_info()
                
        except Exception as e:
            logger.error(f"获取或创建会话失败: {e}")
            raise
    
    async def add_message(
        self, 
        session_id: str, 
        role: str, 
        content: str
    ):
        """添加消息到会话"""
        try:
            if session_id not in self.sessions:
                logger.warning(f"会话不存在: {session_id}")
                return
            
            session = self.sessions[session_id]
            
            # 创建消息
            message = ChatMessage(
                role=MessageRole(role),
                content=content,
                timestamp=datetime.now()
            )
            
            # 添加到会话
            session.messages.append(message)
            session.message_count = len([msg for msg in session.messages if msg.role == MessageRole.USER])
            session.last_active = datetime.now()
            
            # 限制消息历史长度，防止内存过度使用
            max_messages = 20  # 保留最近20条消息
            if len(session.messages) > max_messages:
                session.messages = session.messages[-max_messages:]
            
            logger.debug(f"添加消息到会话 {session_id}: role={role}, length={len(content)}")
            
        except Exception as e:
            logger.error(f"添加消息失败: {e}")
            raise
    
    async def get_session_info(self, session_id: str) -> Optional[SessionInfo]:
        """获取会话信息"""
        try:
            if session_id in self.sessions:
                session = self.sessions[session_id]
                return session.to_session_info()
            return None
            
        except Exception as e:
            logger.error(f"获取会话信息失败: {e}")
            return None
    
    async def get_session_messages(
        self, 
        session_id: str, 
        limit: Optional[int] = None
    ) -> List[ChatMessage]:
        """获取会话消息历史"""
        try:
            if session_id not in self.sessions:
                return []
            
            session = self.sessions[session_id]
            messages = session.messages
            
            if limit:
                messages = messages[-limit:]
            
            return messages
            
        except Exception as e:
            logger.error(f"获取会话消息失败: {e}")
            return []
    
    async def clear_session(self, session_id: str):
        """清除会话(阅后即焚)"""
        try:
            if session_id in self.sessions:
                del self.sessions[session_id]
                logger.info(f"会话已清除: {session_id}")
            else:
                logger.warning(f"尝试清除不存在的会话: {session_id}")
                
        except Exception as e:
            logger.error(f"清除会话失败: {e}")
            raise
    
    async def clear_all_sessions(self):
        """清除所有会话"""
        try:
            session_count = len(self.sessions)
            self.sessions.clear()
            logger.info(f"已清除所有会话: {session_count} 个")
            
        except Exception as e:
            logger.error(f"清除所有会话失败: {e}")
            raise
    
    def get_active_session_count(self) -> int:
        """获取活跃会话数量"""
        return len(self.sessions)
    
    def get_session_stats(self) -> Dict[str, any]:
        """获取会话统计信息"""
        try:
            active_sessions = len(self.sessions)
            
            # 统计语言分布
            language_dist = {}
            message_counts = []
            
            for session in self.sessions.values():
                lang = session.language
                language_dist[lang] = language_dist.get(lang, 0) + 1
                message_counts.append(session.message_count)
            
            avg_messages = sum(message_counts) / len(message_counts) if message_counts else 0
            
            return {
                "active_sessions": active_sessions,
                "language_distribution": language_dist,
                "average_messages_per_session": round(avg_messages, 2),
                "session_timeout_minutes": settings.SESSION_TIMEOUT_MINUTES,
                "max_rounds_per_session": settings.MAX_ROUNDS_PER_SESSION,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"获取会话统计失败: {e}")
            return {"error": str(e)}
    
    def check_session_limit(self, session_id: str) -> bool:
        """检查会话是否达到轮数限制"""
        if session_id not in self.sessions:
            return False
        
        session = self.sessions[session_id]
        return session.message_count >= settings.MAX_ROUNDS_PER_SESSION
    
    async def cleanup(self):
        """清理资源"""
        try:
            if self._cleanup_task:
                self._cleanup_task.cancel()
                try:
                    await self._cleanup_task
                except asyncio.CancelledError:
                    pass
            
            await self.clear_all_sessions()
            logger.info("会话管理器清理完成")
            
        except Exception as e:
            logger.error(f"会话管理器清理失败: {e}")

# 全局会话管理器实例
session_manager_instance = None

def get_session_manager() -> SessionManager:
    """获取会话管理器实例"""
    global session_manager_instance
    if session_manager_instance is None:
        session_manager_instance = SessionManager()
    return session_manager_instance