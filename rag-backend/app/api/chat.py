"""
聊天API端点 - 基础版本（无RAG功能）
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger
from datetime import datetime
import uuid
import asyncio

from app.models import ChatRequest, ChatResponse, ErrorResponse
from app.config import settings
from app.core.openai_client import get_openai_client
from app.core.session_manager import SessionManager

# 初始化限流器
limiter = Limiter(key_func=get_remote_address)

# 创建路由器
router = APIRouter()

# 初始化会话管理器
session_manager = SessionManager()

@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={
        200: {"description": "聊天成功"},
        400: {"model": ErrorResponse, "description": "请求无效"},
        429: {"model": ErrorResponse, "description": "请求过于频繁"},
        500: {"model": ErrorResponse, "description": "服务器错误"}
    },
    summary="发送聊天消息",
    description="向AI聊天机器人发送消息并获取回复"
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def chat(request: Request, chat_request: ChatRequest):
    """基础聊天端点 - 直接使用OpenAI API"""
    start_time = datetime.now()
    
    try:
        # 获取OpenAI客户端
        openai_client = get_openai_client()
        
        # 生成或验证会话ID
        session_id = chat_request.session_id or str(uuid.uuid4())
        
        # 会话管理
        session_info = await session_manager.get_or_create_session(
            session_id, 
            chat_request.language
        )
        
        # 检查会话轮数限制
        if session_info.message_count >= settings.MAX_ROUNDS_PER_SESSION:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "SessionLimitExceeded",
                    "message": f"会话轮数已达到限制({settings.MAX_ROUNDS_PER_SESSION}轮)",
                    "details": {"max_rounds": settings.MAX_ROUNDS_PER_SESSION},
                    "timestamp": datetime.now().isoformat()
                }
            )
        
        # 记录用户消息
        await session_manager.add_message(
            session_id,
            "user", 
            chat_request.message
        )
        
        logger.info(f"收到聊天请求: session_id={session_id}, message_length={len(chat_request.message)}")
        
        # 获取会话历史
        messages = await session_manager.get_session_messages(session_id)
        
        # 构建系统消息
        system_message = {
            "role": "system",
            "content": "你是一个友好的AI助手，专门为个人网站提供帮助。请用简洁、友好的语言回答用户的问题。"
        }
        
        # 构建对话历史
        conversation = [system_message] + [
            {"role": msg.role, "content": msg.content} 
            for msg in messages[-10:]  # 只保留最近10条消息
        ]
        
        # 调用OpenAI API
        result = await openai_client.chat_completion(
            messages=conversation[1:],  # 不包含系统消息，因为会在方法内添加
            temperature=0.7,
            max_tokens=1000,
            system_prompt=system_message["content"]
        )
        
        assistant_reply = result["reply"]
        token_usage = result["token_usage"]
        
        # 记录AI回复
        await session_manager.add_message(
            session_id,
            "assistant",
            assistant_reply
        )
        
        # 构建响应
        chat_response = ChatResponse(
            response=assistant_reply,
            session_id=session_id,
            language=chat_request.language,
            retrieval_results=[],  # 基础版本无检索结果
            token_usage=token_usage,
            timestamp=datetime.now()
        )
        
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.info(
            f"聊天完成: session_id={session_id}, "
            f"processing_time={processing_time:.2f}s, "
            f"tokens={token_usage.get('total_tokens', 0)}"
        )
        
        return chat_response
        
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        logger.error(f"聊天处理失败: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "ChatProcessingFailed",
                "message": "聊天处理过程中发生错误",
                "details": {"exception": str(e)},
                "timestamp": datetime.now().isoformat()
            }
        )

@router.delete(
    "/chat/{session_id}",
    response_model=dict,
    summary="清除会话",
    description="清除指定会话的所有历史记录(阅后即焚)"
)
async def clear_session(session_id: str):
    """清除会话记录"""
    try:
        await session_manager.clear_session(session_id)
        
        logger.info(f"会话已清除: session_id={session_id}")
        
        return {
            "message": "会话已清除",
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"清除会话失败: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "ClearSessionFailed",
                "message": "清除会话失败",
                "details": {"exception": str(e)},
                "timestamp": datetime.now().isoformat()
            }
        )

@router.get(
    "/chat/sessions/{session_id}",
    response_model=dict,
    summary="获取会话信息",
    description="获取指定会话的基本信息"
)
async def get_session_info(session_id: str):
    """获取会话信息"""
    try:
        session_info = await session_manager.get_session_info(session_id)
        
        if not session_info:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "SessionNotFound",
                    "message": "会话不存在",
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat()
                }
            )
        
        return {
            "session_info": session_info.model_dump(),
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取会话信息失败: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "GetSessionInfoFailed",
                "message": "获取会话信息失败",
                "timestamp": datetime.now().isoformat()
            }
        )

# 限流异常处理将在 main.py 中设置