"""
ChromaDB向量数据库封装
处理文档向量化存储和检索
"""

import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from pathlib import Path
from typing import List, Dict, Any, Optional
from loguru import logger
import asyncio
from datetime import datetime

from app.config import settings
from app.models import RetrievalResult, VectorStoreStats

class VectorStore:
    """向量数据库管理器"""
    
    def __init__(self):
        self.client = None
        self.collection = None
        self.embedding_function = None
        self._initialized = False
    
    async def initialize(self):
        """初始化ChromaDB客户端和集合"""
        if self._initialized:
            return
        
        try:
            # 创建持久化目录
            persist_dir = Path(settings.CHROMA_PERSIST_DIRECTORY)
            persist_dir.mkdir(parents=True, exist_ok=True)
            
            # 初始化ChromaDB客户端 - 使用官方推荐的简化配置
            self.client = chromadb.PersistentClient(
                path=str(persist_dir),
                settings=Settings(anonymized_telemetry=False)
            )
            
            # 配置OpenAI嵌入函数
            self.embedding_function = embedding_functions.OpenAIEmbeddingFunction(
                api_key=settings.OPENAI_API_KEY,
                model_name=settings.OPENAI_EMBEDDING_MODEL
            )
            
            # 获取或创建集合
            try:
                self.collection = self.client.get_collection(
                    name=settings.CHROMA_COLLECTION_NAME,
                    embedding_function=self.embedding_function
                )
                logger.info(f"已加载现有集合: {settings.CHROMA_COLLECTION_NAME}")
            except Exception:
                self.collection = self.client.create_collection(
                    name=settings.CHROMA_COLLECTION_NAME,
                    embedding_function=self.embedding_function,
                    metadata={"description": "Personal knowledge base for RAG chatbot"}
                )
                logger.info(f"已创建新集合: {settings.CHROMA_COLLECTION_NAME}")
            
            self._initialized = True
            logger.info("ChromaDB初始化完成")
            
        except Exception as e:
            logger.error(f"ChromaDB初始化失败: {e}")
            raise
    
    async def add_documents(
        self, 
        documents: List[str], 
        metadatas: List[Dict[str, Any]], 
        ids: List[str]
    ):
        """添加文档到向量数据库"""
        if not self._initialized:
            await self.initialize()
        
        try:
            # ChromaDB的add方法是同步的，在异步环境中运行
            await asyncio.get_event_loop().run_in_executor(
                None,
                self.collection.add,
                documents,
                metadatas,
                ids
            )
            
            logger.info(f"已添加 {len(documents)} 个文档到向量数据库")
            
        except Exception as e:
            logger.error(f"添加文档失败: {e}")
            raise
    
    async def search(
        self, 
        query: str, 
        n_results: Optional[int] = None,
        where: Optional[Dict[str, Any]] = None
    ) -> List[RetrievalResult]:
        """搜索相关文档"""
        if not self._initialized:
            await self.initialize()
        
        n_results = n_results or settings.TOP_K_RESULTS
        
        try:
            # 执行查询
            results = await asyncio.get_event_loop().run_in_executor(
                None,
                self.collection.query,
                [query],  # query_texts
                n_results,  # n_results
                where  # where clause
            )
            
            # 转换结果格式
            retrieval_results = []
            if results["documents"] and results["documents"][0]:
                documents = results["documents"][0]
                metadatas = results["metadatas"][0]
                distances = results["distances"][0]
                
                for i, doc in enumerate(documents):
                    # 计算相似度 (距离转换为相似度)
                    similarity = 1.0 - distances[i]
                    
                    # 只返回超过阈值的结果
                    if similarity >= settings.SIMILARITY_THRESHOLD:
                        retrieval_results.append(
                            RetrievalResult(
                                content=doc,
                                metadata=metadatas[i],
                                similarity=similarity,
                                source=metadatas[i].get("source", "unknown")
                            )
                        )
            
            logger.info(f"检索到 {len(retrieval_results)} 个相关文档")
            return retrieval_results
            
        except Exception as e:
            logger.error(f"文档检索失败: {e}")
            raise
    
    async def delete_collection(self):
        """删除集合(用于重置)"""
        if not self._initialized:
            return
        
        try:
            self.client.delete_collection(settings.CHROMA_COLLECTION_NAME)
            self.collection = None
            logger.info(f"已删除集合: {settings.CHROMA_COLLECTION_NAME}")
        except Exception as e:
            logger.error(f"删除集合失败: {e}")
            raise
    
    async def get_stats(self) -> Dict[str, Any]:
        """获取向量数据库统计信息"""
        if not self._initialized:
            await self.initialize()
        
        try:
            # 获取集合统计
            count = await asyncio.get_event_loop().run_in_executor(
                None,
                self.collection.count
            )
            
            # 计算索引大小(估算)
            persist_dir = Path(settings.CHROMA_PERSIST_DIRECTORY)
            index_size_mb = 0
            if persist_dir.exists():
                for file in persist_dir.rglob("*"):
                    if file.is_file():
                        index_size_mb += file.stat().st_size
                index_size_mb = index_size_mb / (1024 * 1024)  # 转换为MB
            
            stats = {
                "collection_name": settings.CHROMA_COLLECTION_NAME,
                "document_count": count,
                "last_updated": datetime.now().isoformat(),
                "index_size_mb": round(index_size_mb, 2),
                "embedding_model": settings.OPENAI_EMBEDDING_MODEL,
                "persist_directory": settings.CHROMA_PERSIST_DIRECTORY
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"获取统计信息失败: {e}")
            return {"error": str(e)}
    
    async def health_check(self):
        """健康检查"""
        if not self._initialized:
            await self.initialize()
        
        try:
            # 尝试执行简单查询
            await asyncio.get_event_loop().run_in_executor(
                None,
                self.collection.count
            )
            return True
        except Exception as e:
            logger.error(f"ChromaDB健康检查失败: {e}")
            raise
    
    async def close(self):
        """关闭连接"""
        if self.client:
            # ChromaDB不需要显式关闭连接
            self.client = None
            self.collection = None
            self._initialized = False
            logger.info("ChromaDB连接已关闭")

# 全局向量数据库实例
vector_store_instance = None

async def get_vector_store() -> VectorStore:
    """获取向量数据库实例"""
    global vector_store_instance
    if vector_store_instance is None:
        vector_store_instance = VectorStore()
        await vector_store_instance.initialize()
    return vector_store_instance