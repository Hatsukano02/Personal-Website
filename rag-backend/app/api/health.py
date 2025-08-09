"""
健康检查API端点 - 基础版本
"""

from fastapi import APIRouter, HTTPException
from loguru import logger
import httpx
from datetime import datetime

from app.models import HealthResponse, ErrorResponse
from app.config import settings

router = APIRouter()

@router.get(
    "/health", 
    response_model=HealthResponse,
    responses={
        200: {"description": "服务健康"},
        503: {"model": ErrorResponse, "description": "服务不可用"}
    },
    summary="健康检查",
    description="检查AI聊天机器人服务和依赖服务的健康状态"
)
async def health_check():
    """健康检查端点"""
    try:
        # 检查OpenAI API
        openai_status = "healthy"
        try:
            # 简单的API连通性检查
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
                )
                if response.status_code != 200:
                    openai_status = "unhealthy"
        except Exception as e:
            logger.warning(f"OpenAI API健康检查失败: {e}")
            openai_status = "unhealthy"
        
        # 确定整体状态
        overall_status = "healthy" if openai_status == "healthy" else "degraded"
        
        return HealthResponse(
            status=overall_status,
            version="1.0.0",
            dependencies={
                "openai": openai_status
            }
        )
        
    except Exception as e:
        logger.error(f"健康检查失败: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "HealthCheckFailed",
                "message": "服务健康检查失败",
                "details": {"exception": str(e)},
                "timestamp": datetime.now().isoformat()
            }
        )

@router.get(
    "/health/detailed",
    response_model=dict,
    summary="详细健康检查", 
    description="获取服务的详细健康状态信息"
)
async def detailed_health_check():
    """详细健康检查"""
    try:
        # 基础健康检查
        basic_health = await health_check()
        
        # 额外的详细信息
        details = {
            "basic": basic_health.model_dump(),
            "configuration": {
                "api_host": settings.API_HOST,
                "api_port": settings.API_PORT,
                "log_level": settings.LOG_LEVEL,
                "rate_limit": settings.RATE_LIMIT_PER_MINUTE,
                "chunk_size": settings.CHUNK_SIZE,
                "top_k_results": settings.TOP_K_RESULTS
            },
            "vector_store": {},
            "system_info": {
                "timestamp": datetime.now().isoformat(),
                "uptime": "计算中..."  # TODO: 实现实际的运行时间计算
            }
        }
        
        # 基础版本无需额外的存储统计信息
        details["storage"] = {"status": "基础版本，无向量存储"}
        
        return details
        
    except Exception as e:
        logger.error(f"详细健康检查失败: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "DetailedHealthCheckFailed",
                "message": "详细健康检查失败",
                "timestamp": datetime.now().isoformat()
            }
        )