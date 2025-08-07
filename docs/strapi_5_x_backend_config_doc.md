# Strapi 5.x后端完整搭建方案

## 问题诊断：REST API返回404的根本原因

根据最新的Strapi 5.x官方文档研究，您遇到的**Content Manager正常但API返回404**问题主要由以下原因造成：

**最关键的问题是Strapi 5.x的重大架构变更**：从Entity Service迁移到Document Service，导致API端点格式和权限系统发生根本性改变。具体来说，Strapi 5.x使用24字符的`documentId`替代了之前的数字`id`，同时默认关闭了所有API的公开访问权限。结合您提到的数据库配置问题（PostgreSQL与SQLite混用），这些因素共同导致了API路由无法正常工作。

## 一、正确的项目初始化流程

### 1.1 PostgreSQL数据库准备

在创建Strapi项目之前，确保PostgreSQL 15已正确配置：

```sql
-- 创建数据库用户
CREATE USER strapi_user WITH PASSWORD 'your_secure_password';

-- 创建数据库
CREATE DATABASE strapi_db;

-- 连接到数据库并授予权限
\c strapi_db
GRANT ALL ON SCHEMA public TO strapi_user;
```

### 1.2 项目初始化命令

使用以下命令创建支持PostgreSQL的Strapi 5.x项目：

```bash
# 使用交互式安装（推荐）
npx create-strapi@latest my-project

# 安装过程中选择：
# 1. Default database (SQLite): No
# 2. Database client: postgres
# 3. Database name: strapi_db
# 4. Host: 127.0.0.1
# 5. Port: 5432
# 6. Username: strapi_user
# 7. Password: your_secure_password
# 8. Enable SSL: No (开发环境)
# 9. Start with TypeScript: Yes (Strapi 5默认)

# 或直接指定参数
npx create-strapi@latest my-project \
  --dbclient=postgres \
  --dbhost=127.0.0.1 \
  --dbport=5432 \
  --dbname=strapi_db \
  --dbusername=strapi_user \
  --dbpassword=your_secure_password \
  --ts
```

## 二、数据库配置最佳实践

### 2.1 PostgreSQL配置文件

创建`config/database.ts`（TypeScript）或`config/database.js`（JavaScript）：

```typescript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi_db'),
      user: env('DATABASE_USERNAME', 'strapi_user'),
      password: env('DATABASE_PASSWORD', 'your_secure_password'),
      schema: env('DATABASE_SCHEMA', 'public'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
      acquireTimeoutMillis: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
    },
    debug: false,
  },
});
```

### 2.2 环境变量配置

创建`.env`文件：

```bash
# 数据库配置
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
DATABASE_SCHEMA=public

# 连接池设置
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000

# Strapi配置
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# 安全密钥（使用强密码）
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret
```

### 2.3 避免SQLite混用

确保所有环境都使用PostgreSQL，避免开发环境使用SQLite而生产环境使用PostgreSQL的情况。如果需要从SQLite迁移到PostgreSQL：

1. 导出现有数据
2. 更新database配置
3. 重新安装pg模块：`npm install pg`
4. 重建数据库架构
5. 导入数据

## 三、Content Types创建和API路由注册

### 3.1 正确的文件结构

对于您提到的每个Content Type（album, blog-post, media-work等），必须确保以下文件结构：

```
src/api/
├── album/
│   ├── content-types/
│   │   └── album/
│   │       └── schema.json
│   ├── controllers/
│   │   └── album.ts
│   ├── routes/
│   │   └── album.ts    # 关键文件！
│   └── services/
│       └── album.ts
├── blog-post/
│   ├── content-types/
│   │   └── blog-post/
│   │       └── schema.json
│   ├── controllers/
│   │   └── blog-post.ts
│   ├── routes/
│   │   └── blog-post.ts  # 必须存在
│   └── services/
│       └── blog-post.ts
└── ... (其他content types)
```

### 3.2 路由文件配置

每个Content Type的路由文件必须正确配置：

```typescript
// src/api/album/routes/album.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::album.album', {
  config: {
    find: {
      auth: false,  // 允许公开访问
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    create: {
      auth: true,  // 需要认证
    },
    update: {
      auth: true,
    },
    delete: {
      auth: true,
    },
  },
});
```

### 3.3 控制器扩展（可选）

```typescript
// src/api/album/controllers/album.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::album.album', ({ strapi }) => ({
  // 保留默认的CRUD操作
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
  
  // 添加自定义方法
  async customMethod(ctx) {
    // 自定义逻辑
    return { message: 'Custom response' };
  },
}));
```

## 四、修复404错误的步骤

### 4.1 权限配置（最常见原因）

1. **进入权限设置**：
   - 访问Admin Panel → Settings → Users & Permissions → Roles → Public

2. **启用API访问**：
   对每个Content Type启用以下权限：
   - ✅ find（查询列表）
   - ✅ findOne（查询单个）
   - ⬜ create（根据需求）
   - ⬜ update（根据需求）
   - ⬜ delete（根据需求）

3. **保存设置**

### 4.2 验证路由注册

运行以下命令查看所有注册的路由：

```bash
yarn strapi routes:list
```

预期输出应包含：
```
GET    /api/albums
GET    /api/albums/:documentId
POST   /api/albums
PUT    /api/albums/:documentId
DELETE /api/albums/:documentId
GET    /api/blog-posts
...
```

### 4.3 使用正确的documentId

**重要变更**：Strapi 5.x使用`documentId`而不是数字`id`：

```bash
# 错误方式（Strapi 4.x）
GET /api/albums/1

# 正确方式（Strapi 5.x）
GET /api/albums/j5ei9sn4i25cvlzzz5xo89gv
```

获取documentId的方法：
```bash
# 1. 获取列表
curl http://localhost:1337/api/albums

# 2. 从响应中提取documentId
# 响应示例：
{
  "data": [{
    "documentId": "j5ei9sn4i25cvlzzz5xo89gv",
    "title": "My Album",
    ...
  }]
}

# 3. 使用documentId访问单个记录
curl http://localhost:1337/api/albums/j5ei9sn4i25cvlzzz5xo89gv
```

### 4.4 中间件配置

确保`config/middlewares.ts`正确配置：

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 五、完整验证清单

### 5.1 基础验证

```bash
# 1. 验证数据库连接
psql -h 127.0.0.1 -p 5432 -U strapi_user -d strapi_db -c "SELECT version();"

# 2. 启动开发服务器
npm run develop

# 3. 检查健康状态
curl -I http://localhost:1337/_health
# 期望：HTTP/1.1 204 No Content

# 4. 列出所有路由
yarn strapi routes:list
```

### 5.2 API测试

```bash
# 测试每个Content Type
for endpoint in albums blog-posts media-works photos photo-albums projects social-links tags; do
  echo "Testing /api/$endpoint"
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:1337/api/$endpoint
done
# 期望：所有返回200
```

### 5.3 权限验证

```javascript
// 创建测试脚本 test-api.js
const endpoints = [
  'albums', 'blog-posts', 'media-works', 
  'photos', 'photo-albums', 'projects', 
  'social-links', 'tags'
];

endpoints.forEach(async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:1337/api/${endpoint}`);
    console.log(`${endpoint}: ${response.status}`);
  } catch (error) {
    console.error(`${endpoint}: ERROR`, error.message);
  }
});
```

## 六、生产环境部署（Rocky Linux 9）

### 6.1 环境准备

```bash
# 安装Node.js 22.x
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install nodejs -y

# 安装PostgreSQL 15
sudo dnf install postgresql15-server postgresql15 -y
sudo postgresql-15-setup --initdb
sudo systemctl enable --now postgresql-15

# 安装PM2
sudo npm install -g pm2
```

### 6.2 生产配置

创建`config/env/production/database.ts`：

```typescript
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
    debug: false,
  },
});
```

### 6.3 PM2配置

创建`ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'strapi',
    script: 'npm',
    args: 'run start',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://strapi_user:password@localhost:5432/strapi_db',
    },
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],
};
```

## 七、问题诊断决策树

如果API仍然返回404，按以下顺序检查：

1. **路由是否注册？**
   - 运行`yarn strapi routes:list`
   - 如果缺少路由 → 检查`src/api/*/routes/*.ts`文件

2. **权限是否配置？**
   - 检查Settings → Users & Permissions → Roles → Public
   - 如果未配置 → 启用find和findOne权限

3. **使用正确的ID格式？**
   - 确保使用documentId而不是数字id
   - 从列表API获取正确的documentId

4. **数据库连接正常？**
   - 检查`.env`中的DATABASE_*配置
   - 验证PostgreSQL服务运行状态

5. **内容是否发布？**
   - 确保内容状态为"Published"而非"Draft"

## 结论

Strapi 5.x的API路由问题主要源于架构变更和默认权限设置。通过正确配置路由文件、设置适当的权限、使用新的documentId系统，并确保PostgreSQL配置正确，您的API端点应该能够正常工作。建议按照上述验证清单逐项检查，特别注意权限配置和documentId的使用，这是最常见的问题来源。