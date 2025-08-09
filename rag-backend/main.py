"""
AI Chatbot FastAPI Application - 基础版本
个人网站AI聊天机器人后端服务（无RAG功能）
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
import sys
from pathlib import Path

from app.config import settings
from app.api import chat, health
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# 配置日志
logger.remove()
logger.add(sys.stderr, level=settings.LOG_LEVEL)
if settings.LOG_FILE:
    Path(settings.LOG_FILE).parent.mkdir(parents=True, exist_ok=True)
    logger.add(settings.LOG_FILE, rotation="10 MB", level=settings.LOG_LEVEL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("正在初始化AI聊天机器人服务...")
    
    try:
        # 验证配置
        from app.config import validate_config
        validate_config()
        
        logger.info("AI聊天机器人服务初始化完成")
        
    except Exception as e:
        logger.error(f"初始化失败: {e}")
        raise
    
    yield
    
    # 清理资源
    logger.info("正在关闭AI聊天机器人服务...")

# 创建FastAPI应用
app = FastAPI(
    title="AI Chatbot API",
    description="个人网站AI聊天机器人API - 基础版本",
    version="1.0.0",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加限流异常处理器
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 注册路由
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])
app.include_router(chat.router, prefix=settings.API_PREFIX, tags=["chat"])

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "AI Chatbot API - 基础版本",
        "version": "1.0.0",
        "docs": f"{settings.API_PREFIX}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True,
        log_level=settings.LOG_LEVEL.lower()
    )