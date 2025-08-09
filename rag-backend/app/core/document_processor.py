"""
文档处理器
负责加载、分块、向量化和存储文档
"""

from pathlib import Path
from typing import List, Dict, Any, Optional
import hashlib
import re
from datetime import datetime
from loguru import logger
import asyncio

from app.config import settings
from app.core.vector_store import VectorStore
from app.core.openai_client import get_openai_client
from app.models import DocumentMetadata

class DocumentProcessor:
    """文档处理器"""
    
    def __init__(self):
        self.openai_client = get_openai_client()
        self.supported_extensions = {".md", ".txt"}
        
    async def load_documents(
        self, 
        knowledge_path: Path, 
        vector_store: VectorStore
    ):
        """加载知识库文档"""
        if not knowledge_path.exists():
            logger.warning(f"知识库路径不存在: {knowledge_path}")
            return
        
        logger.info(f"开始加载知识库: {knowledge_path}")
        
        # 查找所有支持的文档
        documents = []
        for ext in self.supported_extensions:
            documents.extend(knowledge_path.rglob(f"*{ext}"))
        
        if not documents:
            logger.warning("未找到任何支持的文档")
            return
        
        logger.info(f"找到 {len(documents)} 个文档")
        
        # 处理每个文档
        total_chunks = 0
        for doc_path in documents:
            try:
                chunks = await self.process_document(doc_path, vector_store)
                total_chunks += len(chunks)
                logger.info(f"已处理文档: {doc_path.name} ({len(chunks)} 个分块)")
                
            except Exception as e:
                logger.error(f"处理文档失败 {doc_path}: {e}")
        
        logger.info(f"知识库加载完成: 总共 {total_chunks} 个分块")
    
    async def process_document(
        self, 
        doc_path: Path, 
        vector_store: VectorStore
    ) -> List[Dict[str, Any]]:
        """处理单个文档"""
        try:
            # 读取文档内容
            content = self._read_document(doc_path)
            if not content.strip():
                logger.warning(f"文档内容为空: {doc_path}")
                return []
            
            # 文档分块
            chunks = self._chunk_document(content)
            
            # 准备向量数据库存储的数据
            documents = []
            metadatas = []
            ids = []
            
            for i, chunk in enumerate(chunks):
                # 生成唯一ID
                chunk_id = self._generate_chunk_id(doc_path, i, chunk)
                
                # 创建元数据
                metadata = DocumentMetadata(
                    filename=doc_path.name,
                    file_path=str(doc_path),
                    chunk_index=i,
                    total_chunks=len(chunks),
                    content_type=self._get_content_type(doc_path),
                    last_updated=datetime.now(),
                    tags=self._extract_tags(doc_path, chunk)
                )
                
                documents.append(chunk)
                metadatas.append(metadata.dict())
                ids.append(chunk_id)
            
            # 批量添加到向量数据库
            if documents:
                await vector_store.add_documents(documents, metadatas, ids)
            
            return chunks
            
        except Exception as e:
            logger.error(f"处理文档失败 {doc_path}: {e}")
            raise
    
    def _read_document(self, doc_path: Path) -> str:
        """读取文档内容"""
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 基本清理
            content = self._clean_content(content)
            return content
            
        except Exception as e:
            logger.error(f"读取文档失败 {doc_path}: {e}")
            raise
    
    def _clean_content(self, content: str) -> str:
        """清理文档内容"""
        # 移除多余的空白行
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        # 移除行尾空格
        content = re.sub(r' +\n', '\n', content)
        
        # 统一换行符
        content = content.replace('\r\n', '\n').replace('\r', '\n')
        
        return content.strip()
    
    def _chunk_document(self, content: str) -> List[str]:
        """文档分块"""
        # 按段落分割
        paragraphs = content.split('\n\n')
        
        chunks = []
        current_chunk = ""
        current_size = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            # 计算段落token数(估算)
            para_tokens = len(paragraph.split()) * 1.3  # 粗略估算
            
            # 如果当前分块加上这个段落会超过限制
            if current_size + para_tokens > settings.CHUNK_SIZE and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = paragraph
                current_size = para_tokens
            else:
                # 添加到当前分块
                if current_chunk:
                    current_chunk += "\n\n" + paragraph
                else:
                    current_chunk = paragraph
                current_size += para_tokens
        
        # 添加最后一个分块
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        # 处理过长的分块
        final_chunks = []
        for chunk in chunks:
            if len(chunk.split()) * 1.3 > settings.CHUNK_SIZE:
                # 进一步分割长分块
                sub_chunks = self._split_long_chunk(chunk)
                final_chunks.extend(sub_chunks)
            else:
                final_chunks.append(chunk)
        
        return final_chunks
    
    def _split_long_chunk(self, chunk: str) -> List[str]:
        """分割过长的分块"""
        sentences = re.split(r'[.!?。！？]\s+', chunk)
        
        sub_chunks = []
        current_chunk = ""
        current_size = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            sentence_tokens = len(sentence.split()) * 1.3
            
            if current_size + sentence_tokens > settings.CHUNK_SIZE and current_chunk:
                sub_chunks.append(current_chunk.strip())
                current_chunk = sentence
                current_size = sentence_tokens
            else:
                if current_chunk:
                    current_chunk += ". " + sentence
                else:
                    current_chunk = sentence
                current_size += sentence_tokens
        
        if current_chunk.strip():
            sub_chunks.append(current_chunk.strip())
        
        return sub_chunks
    
    def _generate_chunk_id(self, doc_path: Path, chunk_index: int, chunk: str) -> str:
        """生成分块的唯一ID"""
        # 使用文件路径、索引和内容哈希生成ID
        content_hash = hashlib.md5(chunk.encode('utf-8')).hexdigest()[:8]
        return f"{doc_path.stem}_{chunk_index}_{content_hash}"
    
    def _get_content_type(self, doc_path: Path) -> str:
        """获取内容类型"""
        filename = doc_path.name.lower()
        
        if "skill" in filename or "技能" in filename:
            return "skills"
        elif "project" in filename or "项目" in filename:
            return "projects"
        elif "experience" in filename or "经历" in filename:
            return "experience"
        elif "education" in filename or "教育" in filename:
            return "education"
        elif "about" in filename or "关于" in filename:
            return "about"
        elif "contact" in filename or "联系" in filename:
            return "contact"
        else:
            return "general"
    
    def _extract_tags(self, doc_path: Path, chunk: str) -> List[str]:
        """从文档路径和内容中提取标签"""
        tags = []
        
        # 从文件名提取标签
        filename = doc_path.name.lower()
        if "frontend" in filename or "前端" in filename:
            tags.append("frontend")
        if "backend" in filename or "后端" in filename:
            tags.append("backend")
        if "react" in filename:
            tags.append("react")
        if "python" in filename:
            tags.append("python")
        if "javascript" in filename:
            tags.append("javascript")
        
        # 从内容中提取技术关键词
        content_lower = chunk.lower()
        tech_keywords = [
            "react", "vue", "angular", "javascript", "typescript",
            "python", "java", "go", "rust", "node.js", "django",
            "fastapi", "docker", "kubernetes", "aws", "azure",
            "postgresql", "mongodb", "redis", "nginx"
        ]
        
        for keyword in tech_keywords:
            if keyword in content_lower:
                tags.append(keyword)
        
        return list(set(tags))  # 去重
    
    async def reindex_documents(self, knowledge_path: Path, vector_store: VectorStore):
        """重新索引文档(清空后重建)"""
        logger.info("开始重新索引文档...")
        
        # 删除现有集合
        await vector_store.delete_collection()
        
        # 重新初始化
        await vector_store.initialize()
        
        # 重新加载文档
        await self.load_documents(knowledge_path, vector_store)
        
        logger.info("文档重新索引完成")
    
    def validate_document(self, doc_path: Path) -> bool:
        """验证文档是否有效"""
        try:
            if not doc_path.exists():
                return False
            
            if doc_path.suffix.lower() not in self.supported_extensions:
                return False
            
            # 检查文件大小(避免过大文件)
            if doc_path.stat().st_size > 10 * 1024 * 1024:  # 10MB
                logger.warning(f"文档过大: {doc_path}")
                return False
            
            # 尝试读取内容
            content = self._read_document(doc_path)
            if not content.strip():
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"验证文档失败 {doc_path}: {e}")
            return False