# Strapi 5.x 完整后端搭建标准操作手册

本手册基于Strapi 5.x最新官方文档编写，提供从零开始搭建Strapi后端的完整指南。按照本文档操作，您将能够成功搭建并运行Strapi 5.x后端系统。

## 第一部分：安装前准备和环境配置

### 系统要求和前置条件

**必需软件环境**：
- **Node.js**：仅支持Active LTS或Maintenance LTS版本（v20或v22）
- **包管理器**：npm、Yarn（推荐）或pnpm
- **Python**：使用SQLite时必需
- **Git**：用于版本控制和部署

**支持的数据库版本**：

| 数据库 | 推荐版本 | 最低版本 |
|--------|----------|----------|
| PostgreSQL | 17.0 | 14.0 |
| MySQL | 8.4 | 8.0 |
| MariaDB | 11.4 | 10.3 |
| SQLite | 3 | 3 |

**重要提示**：Strapi不支持MongoDB或任何NoSQL数据库，也不支持云原生数据库如Amazon Aurora。

### PostgreSQL数据库准备

创建数据库和用户：
```sql
-- 创建数据库用户
CREATE USER strapi_user WITH PASSWORD 'your_secure_password';

-- 创建数据库
CREATE DATABASE strapi_db OWNER strapi_user;

-- 授予权限
\c strapi_db
GRANT ALL ON SCHEMA public TO strapi_user;
```

## 第二部分：Strapi项目创建和初始化

### 创建新项目

使用create-strapi-app创建项目（默认TypeScript）：

```bash
# 推荐方式
npx create-strapi@latest my-strapi-project

# 带参数的完整安装（PostgreSQL）
npx create-strapi@latest my-strapi-project \
  --dbclient postgres \
  --dbhost localhost \
  --dbport 5432 \
  --dbname strapi_db \
  --dbusername strapi_user \
  --dbpassword your_secure_password
```

### 项目结构说明

Strapi 5.x标准项目结构：

```
my-strapi-project/
├── config/                     # 核心配置文件
│   ├── admin.ts               # 管理面板配置
│   ├── api.ts                 # API配置
│   ├── database.ts            # 数据库配置
│   ├── middlewares.ts         # 中间件配置
│   ├── plugins.ts             # 插件配置
│   └── server.ts              # 服务器配置
├── database/
│   └── migrations/            # 数据库迁移文件
├── public/                    # 公共资源
│   └── uploads/              # 上传文件存储
├── src/
│   ├── admin/                # 管理面板自定义
│   ├── api/                  # API业务逻辑
│   │   └── [api-name]/
│   │       ├── content-types/
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
│   ├── components/           # 可复用组件
│   ├── middlewares/         # 全局中间件
│   └── index.ts             # 主入口文件
├── types/                    # TypeScript类型定义
├── .env                      # 环境变量
└── package.json
```

### 核心配置文件设置

#### 1. 数据库配置 (config/database.ts)

PostgreSQL完整配置：
```typescript
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
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
});
```

#### 2. 服务器配置 (config/server.ts)

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

#### 3. API配置 (config/api.ts)

```typescript
export default ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    prefix: '/api',  // API前缀，可自定义
  },
});
```

#### 4. 中间件配置 (config/middlewares.ts)

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 环境变量配置 (.env)

```bash
# 服务器配置
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# 安全密钥（生产环境必须更改）
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# PostgreSQL数据库
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
DATABASE_SCHEMA=public

# 数据库连接池
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

## 第三部分：Content-Type创建和配置

### 使用Content-Type Builder

**注意**：Content-Type Builder仅在开发模式下可用。

启动开发服务器：
```bash
npm run develop
```

访问管理面板：http://localhost:1337/admin

### 创建Content-Type的步骤

1. **进入Content-Type Builder**
   - 点击左侧菜单的"Content-Type Builder"

2. **创建Collection Type**
   - 点击"Create new collection type"
   - 输入Display name（如：Restaurant）
   - API ID会自动生成（单数：restaurant，复数：restaurants）

3. **添加字段**
   
   常用字段类型配置：
   - **Text**：标题、描述等文本内容
   - **Rich Text (Blocks)**：富文本编辑器
   - **Number**：数字类型（整数、小数、浮点数）
   - **Date**：日期时间选择器
   - **Boolean**：开关按钮
   - **Media**：文件上传（图片、文档）
   - **Relation**：内容关联（一对一、一对多、多对多等）
   - **UID**：唯一标识符（常用于slug）
   - **Enumeration**：下拉选择列表

4. **高级设置**
   - **Draft & Publish**：启用草稿/发布工作流
   - **Internationalization**：启用多语言支持

5. **保存Content-Type**
   - 点击"Save"按钮
   - 服务器会自动重启并生成API

### Content-Type的schema.json结构

创建后的Content-Type会生成如下结构：

```json
{
  "kind": "collectionType",
  "collectionName": "restaurants",
  "info": {
    "displayName": "Restaurant",
    "singularName": "restaurant",
    "pluralName": "restaurants"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "description": {
      "type": "blocks"
    },
    "categories": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::category.category"
    }
  }
}
```

## 第四部分：API配置和权限设置

### REST API自动生成规则

创建Content-Type后，Strapi自动生成以下API端点：

```
GET    /api/restaurants          # 获取列表
GET    /api/restaurants/:id      # 获取单个（使用documentId）
POST   /api/restaurants          # 创建
PUT    /api/restaurants/:id      # 更新
DELETE /api/restaurants/:id      # 删除
```

### 权限配置步骤（解决404问题的关键）

#### 1. 配置Public访问权限

```
设置 → Users & Permissions Plugin → Roles → Public
```

为Public角色启用以下权限：
- **Application**
  - Restaurant
    - ✅ find（获取列表）
    - ✅ findOne（获取单个）
    - ❌ create（创建）
    - ❌ update（更新）
    - ❌ delete（删除）

#### 2. 配置Authenticated用户权限

```
设置 → Users & Permissions Plugin → Roles → Authenticated
```

为认证用户启用完整CRUD权限。

#### 3. Users & Permissions插件配置

```javascript
// config/plugins.js
module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['firstName', 'lastName', 'phone'], // 明确指定允许的字段
      },
    },
  },
});
```

**重要**：Strapi 5中`allowedFields`默认为空数组，必须明确指定允许的注册字段。

### API Token配置

创建API Token用于程序化访问：

1. 进入`设置 → Global settings → API Tokens`
2. 点击"Create new API Token"
3. 配置Token类型：
   - **Read-only**：仅读取权限
   - **Full access**：完整权限
   - **Custom**：自定义权限

使用API Token：
```javascript
const response = await fetch('http://localhost:1337/api/restaurants', {
  headers: {
    'Authorization': 'Bearer your-api-token-here'
  }
});
```

## 第五部分：路由系统配置

### 自动路由注册机制

Strapi 5使用工厂函数自动创建路由：

```javascript
// src/api/restaurant/routes/restaurant.js
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::restaurant.restaurant', {
  config: {
    find: {
      auth: false,  // 公开访问
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
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

### 自定义路由配置

创建自定义路由文件：

```javascript
// src/api/restaurant/routes/01-custom-routes.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/restaurants/:slug',
      handler: 'restaurant.findBySlug',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/restaurants/:id/review',
      handler: 'restaurant.createReview',
    },
  ],
};
```

### 控制器配置

```javascript
// src/api/restaurant/controllers/restaurant.js
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::restaurant.restaurant', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    const entity = await strapi.documents('api::restaurant.restaurant').findMany({
      filters: { slug },
      status: 'published',
    });
    
    return this.transformResponse(entity);
  },
}));
```

## 第六部分：解决常见问题

### 问题1：Content Manager正常但REST API返回404

**根本原因分析**：
1. 权限未配置
2. 使用了错误的API端点
3. 内容未发布
4. 使用了id而非documentId

**完整解决方案**：

1. **检查并设置权限**：
```
设置 → Users & Permissions → Roles → Public
启用find和findOne权限
```

2. **验证API端点**：
```bash
# 正确（使用复数形式）
GET /api/restaurants

# 错误（单数形式）
GET /api/restaurant
```

3. **确保内容已发布**：
- 如果启用了Draft & Publish，确保内容状态为"Published"
- 或在API调用中指定status参数：
```javascript
GET /api/restaurants?status=draft
```

4. **使用documentId而非id**：
```javascript
// Strapi 5使用documentId
GET /api/restaurants/znrlzntu9ei5onjvwfaalu2v

// 不要使用数字id
GET /api/restaurants/1  // 错误
```

### 问题2：理解documentId系统

**documentId的特点**：
- 24个字符的字母数字字符串
- 跨版本持久（草稿和发布版本共享）
- 跨语言一致（所有语言版本使用相同documentId）
- 用于管理内容关系

**API响应格式变化**：

Strapi 5扁平化响应：
```json
{
  "data": {
    "documentId": "znrlzntu9ei5onjvwfaalu2v",
    "name": "Restaurant Name",
    "description": "...",
    "locale": "en",
    "publishedAt": "2024-03-05T15:52:05.600Z",
    "createdAt": "2024-02-27T10:19:04.953Z",
    "updatedAt": "2024-03-05T15:52:05.591Z"
  },
  "meta": {}
}
```

### 问题3：Strapi 5与4的重要差异

**主要变化**：

1. **响应格式**：移除了`data.attributes`嵌套结构
2. **标识符**：使用`documentId`替代`id`
3. **Entity Service**：被Document Service API替代
4. **构建工具**：Vite替代Webpack
5. **数据库支持**：MySQL必须v8+，SQLite仅支持better-sqlite3
6. **生命周期钩子**：迁移到Document Service中间件

**向后兼容模式**：
```javascript
// 临时使用v4响应格式
fetch('/api/restaurants', {
  headers: {
    'Strapi-Response-Format': 'v4'
  }
});
```

## 第七部分：开发和生产环境配置

### 开发环境命令

```bash
# 启动开发服务器（带自动重载）
npm run develop

# 访问点
# 管理面板：http://localhost:1337/admin
# API端点：http://localhost:1337/api/
```

### 生产环境配置

#### 1. 构建生产版本

```bash
# 构建管理面板和后端
NODE_ENV=production npm run build

# 启动生产服务器
NODE_ENV=production npm run start
```

#### 2. PM2进程管理配置

创建ecosystem.config.js：
```javascript
module.exports = {
  apps: [{
    name: 'strapi-production',
    cwd: '/var/www/strapi-project',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_NAME: 'strapi_production',
      DATABASE_USERNAME: 'strapi_user',
      DATABASE_PASSWORD: 'secure_password',
    },
  }],
};
```

启动PM2：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:1337;
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

### Docker部署配置

生产环境Dockerfile：
```dockerfile
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn global add node-gyp
RUN yarn config set network-timeout 600000 -g && yarn install --production

WORKDIR /opt/app
COPY . .
RUN yarn build

FROM node:22-alpine
RUN apk add --no-cache vips-dev

ENV NODE_ENV=production
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./
RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD ["yarn", "start"]
```

Docker Compose配置：
```yaml
version: "3"
services:
  strapi:
    build: .
    restart: unless-stopped
    env_file: .env
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
    volumes:
      - ./public/uploads:/opt/app/public/uploads
    ports:
      - "1337:1337"
    depends_on:
      - postgres

  postgres:
    image: postgres:16.0-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: ${DATABASE_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data/
    ports:
      - "5432:5432"

volumes:
  postgres-data:
```

## 第八部分：测试和验证

### API测试检查清单

1. **基础连接测试**：
```bash
# 测试服务器是否运行
curl http://localhost:1337

# 测试API端点
curl http://localhost:1337/api/restaurants
```

2. **权限验证**：
```bash
# 公开访问（应该成功）
curl http://localhost:1337/api/restaurants

# 需要认证的操作（应该返回401）
curl -X POST http://localhost:1337/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"data": {"name": "Test Restaurant"}}'
```

3. **认证测试**：
```bash
# 用户注册
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "Test1234"}'

# 用户登录
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com", "password": "Test1234"}'
```

4. **使用JWT进行认证请求**：
```bash
# 使用登录返回的JWT
curl http://localhost:1337/api/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 调试和日志配置

启用调试模式：
```javascript
// config/server.js
module.exports = {
  logger: {
    config: {
      level: 'debug',  // 设置日志级别
    }
  }
};
```

数据库查询调试：
```javascript
// config/database.js
module.exports = {
  connection: {
    // ... 其他配置
    debug: true,  // 启用SQL查询日志
  }
};
```

## 第九部分：故障排除指南

### 常见错误及解决方案

#### 错误1：构建内存不足
```bash
# 增加Node.js内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 错误2：数据库连接失败
检查：
- 数据库服务是否运行
- 连接参数是否正确
- 防火墙设置
- 用户权限

#### 错误3：插件兼容性问题
- 检查插件是否支持Strapi 5
- 更新到兼容版本
- 移除不兼容插件

#### 错误4：API响应格式问题
使用兼容模式过渡：
```javascript
headers: {
  'Strapi-Response-Format': 'v4'
}
```

### 性能优化建议

1. **数据库优化**：
   - 适当配置连接池大小
   - 添加必要的索引
   - 使用分页和字段选择

2. **API优化**：
   - 合理使用populate
   - 实施缓存策略
   - 启用压缩

3. **服务器优化**：
   - 使用PM2进行进程管理
   - 配置Nginx缓存
   - 启用CDN for静态资源

## 第十部分：最佳实践总结

### 安全最佳实践

1. **环境变量管理**：
   - 使用强密码和密钥
   - 不要提交.env文件到版本控制
   - 生产环境使用环境变量管理服务

2. **权限配置**：
   - 遵循最小权限原则
   - 定期审核权限设置
   - 使用API Token进行程序化访问

3. **数据库安全**：
   - 启用SSL连接
   - 定期备份
   - 限制数据库访问IP

### 开发流程建议

1. **版本控制**：
   - 提交schema.json文件
   - 使用迁移管理数据库变更
   - 维护清晰的变更日志

2. **测试策略**：
   - 编写API测试
   - 使用staging环境
   - 进行负载测试

3. **监控和日志**：
   - 配置适当的日志级别
   - 监控API性能
   - 设置错误告警

## 总结

本手册提供了Strapi 5.x后端搭建的完整流程，涵盖了从安装到生产部署的所有关键步骤。遵循本指南，您应该能够：

1. ✅ 成功安装和配置Strapi 5.x
2. ✅ 创建和管理Content-Type
3. ✅ 正确配置API权限避免404错误
4. ✅ 理解并使用documentId系统
5. ✅ 配置自定义路由和控制器
6. ✅ 部署到生产环境
7. ✅ 解决常见问题

记住关键要点：
- **Content Manager正常但API返回404通常是权限问题**
- **使用documentId而非数字id**
- **Strapi 5响应格式已扁平化**
- **开发模式用于结构修改，生产模式用于内容管理**

持续关注Strapi官方文档更新，加入社区获取支持，祝您使用Strapi 5.x构建成功的项目！