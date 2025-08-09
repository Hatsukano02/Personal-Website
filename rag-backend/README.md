# AI Chatbot Backend - 基础版本

个人网站的AI聊天机器人后端服务（基础版本，无RAG功能）。

## 特性

- 🤖 基于OpenAI GPT-4o mini的智能对话
- ⚡ 异步FastAPI高性能架构
- 🔒 阅后即焚设计保护隐私
- 🛡️ 内置限流和会话管理
- 📊 完整的API文档和健康检查
- 🐳 Docker容器化部署

## 技术栈

- **API框架**: FastAPI 0.115.x
- **LLM**: OpenAI GPT-4o mini ($0.15/$0.60 per 1M tokens)
- **HTTP客户端**: httpx
- **限流**: slowapi
- **日志**: loguru
- **部署**: Docker + Docker Compose (可选)

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd rag-backend

# 复制环境变量配置
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件，设置必要的配置：

```bash
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# API配置
API_HOST=0.0.0.0
API_PORT=8000

# 其他配置见.env.example文件...
```

### 3. 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 运行基础功能测试
python test_basic.py
```

### 4. Docker部署

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## API文档

启动服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 核心端点

### 聊天接口
```
POST /api/v1/chat
```

请求示例：
```json
{
  "message": "你好，能介绍一下你的技能吗？",
  "session_id": "optional-session-id",
  "language": "zh"
}
```

### 健康检查
```
GET /api/v1/health
```

## 测试功能

项目包含完整的测试脚本：

```bash
# 运行基础功能测试
python test_basic.py
```

测试内容包括：
- 健康检查端点
- 聊天API功能
- 会话管理
- API文档可访问性

## 配置说明

### 核心配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `OPENAI_MODEL` | OpenAI模型 | gpt-4o-mini |
| `RATE_LIMIT_PER_MINUTE` | 每分钟请求限制 | 3 |
| `MAX_ROUNDS_PER_SESSION` | 每会话最大轮数 | 5 |
| `SESSION_TIMEOUT_MINUTES` | 会话超时时间 | 30 |

### 性能优化

- **模型选择**: GPT-4o mini高性价比，低延迟
- **会话管理**: 内存缓存实现自动过期清理
- **限流保护**: 防止API滥用和成本失控
- **异步架构**: FastAPI异步处理提升并发性能

## 部署到生产环境

### 1. VPS部署

```bash
# 在服务器上克隆代码
git clone <repository-url>
cd rag-backend

# 配置环境变量
cp .env.example .env
# 编辑.env文件设置生产环境配置

# 启动服务
docker-compose up -d
```

### 2. Nginx反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/rag/ {
        proxy_pass http://localhost:8000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 监控和日志

```bash
# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f rag-chatbot

# 检查健康状态
curl http://localhost:8000/api/v1/health
```

## 成本控制

### API调用计费

- GPT-4o mini: $0.15 input / $0.60 output per 1M tokens
- text-embedding-3-small: $0.02 per 1M tokens

### 成本优化策略

1. **限流**: 每用户每分钟最多3次请求
2. **会话限制**: 每会话最多5轮对话
3. **相似度过滤**: 只使用高相关性的检索结果
4. **上下文管理**: 智能截断长对话历史

## 开发指南

### 项目结构

```
rag-backend/
├── app/
│   ├── api/              # API路由
│   │   ├── chat.py       # 聊天端点
│   │   └── health.py     # 健康检查
│   ├── core/             # 核心业务逻辑
│   │   ├── openai_client.py    # OpenAI客户端
│   │   └── session_manager.py  # 会话管理
│   ├── config.py         # 配置管理
│   └── models.py         # 数据模型
├── main.py              # 应用入口
├── test_basic.py        # 基础功能测试
├── requirements.txt     # Python依赖
├── .env.example         # 环境变量示例
└── README.md           # 项目文档
```

### 添加新功能

1. 在相应模块中实现功能
2. 添加必要的测试
3. 更新API文档
4. 提交代码变更

### 测试

```bash
# 运行测试
pytest

# 测试覆盖率
pytest --cov=app
```

## 故障排除

### 常见问题

1. **OpenAI API错误**: 检查API密钥是否正确设置
2. **限流错误**: 检查请求频率是否超过限制（3次/分钟）
3. **会话超时**: 会话30分钟后自动过期，需重新开始对话
4. **端口占用**: 修改端口配置或停止冲突服务

### 日志查看

```bash
# 应用日志
tail -f logs/rag_chatbot.log

# 直接查看控制台输出（开发模式）
uvicorn main:app --reload --log-level debug
```

## 许可证

MIT License