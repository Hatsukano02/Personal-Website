# 生产环境配置管理文档

## 📋 环境概述

本文档统一管理开发环境和生产服务器环境配置，确保双端完全同步以避免部署错误。

### 基础配置信息
- **服务器提供商**: 搬瓦工 (BandwagonHost)
- **配置等级**: KVM 2GB方案
- **操作系统**: Rocky Linux 9 x86_64
- **公网IP**: `172.96.193.211`
- **SSH端口**: `22`

## 🖥️ 技术栈标准配置

### 核心环境版本 (双端统一)

#### Node.js 环境
- **版本**: v22.17.1 ✅ (符合Strapi 5.x要求)
- **包管理器**: npm 10.9.2, yarn 1.22.22
- **进程管理**: PM2 6.0.8
- **安装方式**: nvm管理 (位置: `/home/deploy/.nvm/`)

```bash
# 环境验证命令
node --version  # v22.17.1
npm --version   # 10.9.2
```

#### 数据库环境
- **PostgreSQL**: 15.12 ✅ (生产级版本)
- **Redis**: 8.0.3 ✅ (缓存服务，可选，未启用)
- **数据库名**: personal_site
- **用户**: deploy
- **密码**: 20020213Lx

#### Web服务器
- **Nginx**: 1.20.1+
- **配置路径**: `/etc/nginx/`
- **SSL**: 待配置

### 前端技术栈 (完全兼容)
```json
{
  "next": "15.4.3",
  "react": "19.1.0",
  "typescript": "5+",
  "tailwindcss": "4.1.11",
  "gsap": "3.13.0",
  "framer-motion": "12.23.7",
  "zustand": "5.0.6",
  "@tanstack/react-query": "5.83.0"
}
```

### 后端技术栈 (Strapi 5.x)
```json
{
  "@strapi/strapi": "5.19.0",
  "@strapi/plugin-cloud": "5.19.0",
  "@strapi/plugin-users-permissions": "5.19.0",
  "better-sqlite3": "11.3.0",
  "pg": "8.16.3"
}
```

## 📁 标准目录结构

### 服务器端项目路径
```
/home/deploy/personal-site/
├── frontend/                    # Next.js前端应用
│   ├── src/app/                # App Router页面
│   ├── package.json            # 前端依赖配置
│   └── .next/                  # 构建输出
├── backend/                     # Strapi后端应用
│   ├── src/                    # Strapi源码
│   ├── config/                 # Strapi配置
│   ├── public/uploads/         # 文件上传目录
│   └── package.json            # 后端依赖配置
├── deployment/                  # 部署配置
│   ├── nginx/                  # Nginx配置备份
│   ├── pm2/                    # PM2配置
│   │   └── ecosystem.config.js
│   └── scripts/                # 部署脚本
├── docs/                       # 项目文档
│   ├── production-environment.md  # 本文档
│   ├── session-handoff.md      # 会话交接文档
│   └── todo.md                 # 任务管理
└── Project_Management_Doc/      # 架构设计文档
```

### 本地开发环境 (需同步)
```
PersonalWebsite/
├── frontend/          # 与服务器端结构完全一致
├── backend/           # 与服务器端结构完全一致
├── deployment/        # 部署配置(本地备份)
├── docs/             # 项目文档
└── Project_Management_Doc/  # 架构设计文档
```

## ⚙️ 关键配置文件

### PostgreSQL 数据库配置

#### 主配置文件 `/var/lib/pgsql/data/postgresql.conf`
```ini
# 关键配置项 (生产环境)
listen_addresses = 'localhost'     # 仅本地访问
port = 5432                       # 标准端口
max_connections = 100             # 连接数限制
shared_buffers = 128MB            # 缓冲区大小
```

#### 认证配置 `/var/lib/pgsql/data/pg_hba.conf`
```bash
# 认证方法 (安全配置)
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

#### 数据库连接信息
```sql
-- 生产数据库配置
数据库: personal_site
用户: deploy
密码: 20020213Lx (加密存储)
权限: 完整的数据库操作权限
```

### Nginx 反向代理配置 (待配置)

> **注意**: Nginx配置尚未创建，以下为计划配置

#### 主配置文件 `/etc/nginx/nginx.conf`
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # 包含站点配置
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

#### 站点配置 `/etc/nginx/sites-available/personal-site` (待创建)
```nginx
server {
    listen 80;
    server_name _;
    
    # 静态文件服务 (文件上传)
    location /uploads/ {
        alias /home/deploy/personal-site/backend/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri $uri/ =404;
    }
    
    # Strapi API 代理
    location /api/ {
        proxy_pass http://localhost:1337/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Next.js 前端代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 进程管理配置 (待优化)

#### 生产环境配置 `/home/deploy/personal-site/deployment/pm2/ecosystem.config.js`
```javascript
module.exports = {
  apps: [
    {
      name: 'strapi-backend',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/personal-site/backend',
      env: {
        NODE_ENV: 'production',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 5432,
        DATABASE_NAME: 'personal_site',
        DATABASE_USERNAME: 'deploy',
        DATABASE_PASSWORD: '20020213Lx',
        STRAPI_DISABLE_UPDATE_NOTIFICATION: 'true'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M'  // 优化内存限制，VPS仅2GB
    },
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/personal-site/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M'  // 优化内存限制，VPS仅2GB
    }
  ]
};
```

### 防火墙安全配置 (待配置)
```bash
# 计划开放端口列表 (最小权限原则)
services: ssh http https
ports: 1337/tcp 3000/tcp 8000/tcp  # 8000为RAG聊天机器人端口

# 验证命令
sudo firewall-cmd --list-all
```

## 🔧 标准化管理命令

### 数据库管理
```bash
# PostgreSQL 服务管理
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql
sudo systemctl status postgresql
sudo systemctl enable postgresql    # 开机自启

# 数据库连接测试
psql -h localhost -U deploy -d personal_site -c "SELECT version();"

# 数据库备份
pg_dump -h localhost -U deploy personal_site > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 应用服务管理
```bash
# 切换到部署用户
su - deploy

# PM2 应用管理
pm2 start ecosystem.config.js      # 启动所有应用
pm2 stop all                       # 停止所有应用
pm2 restart all                    # 重启所有应用
pm2 reload all                     # 优雅重启
pm2 status                         # 查看状态
pm2 logs                          # 查看日志
pm2 monit                         # 实时监控
```

### Web服务器管理
```bash
# Nginx 服务管理
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# 配置管理
sudo nginx -t                      # 测试配置
sudo nginx -s reload               # 重新加载配置
```

## 🚀 部署标准流程

### 1. 环境验证
```bash
# 验证Node.js版本
node --version  # 应该是 v22.17.1

# 验证数据库连接
psql -h localhost -U deploy -d personal_site -c "SELECT 1;"

# 验证端口可用性
sudo ss -tlnp | grep -E ':(3000|1337|5432)'
```

### 2. 代码部署
```bash
# 连接服务器
ssh deploy@172.96.193.211

# 进入项目目录
cd ~/personal-site

# 更新代码 (如果使用Git)
git pull origin main

# 安装依赖
cd backend && npm ci --only=production
cd ../frontend && npm ci && npm run build

# 重启应用
pm2 restart ecosystem.config.js
```

### 3. 部署验证
```bash
# 检查应用状态
pm2 status

# 验证前端访问
curl -I http://localhost:3000

# 验证后端API
curl -I http://localhost:1337/api/users

# 验证Nginx代理
curl -I http://172.96.193.211
```

## 🔍 监控和日志

### 系统监控
```bash
# 系统资源检查
free -h                            # 内存使用
df -h                             # 磁盘使用
top                               # 进程监控

# 网络状态检查
ss -tlnp | grep -E ':(22|80|443|1337|3000|5432)'
```

### 日志文件位置
```bash
# 应用日志
~/.pm2/logs/                      # PM2应用日志

# 系统服务日志
/var/log/nginx/access.log         # Nginx访问日志
/var/log/nginx/error.log          # Nginx错误日志
/var/lib/pgsql/data/log/          # PostgreSQL日志

# 系统日志
journalctl -u nginx               # Nginx服务日志
journalctl -u postgresql          # PostgreSQL服务日志
```

## 🔐 安全配置标准

### SSH安全配置
```bash
# SSH配置文件: /etc/ssh/sshd_config
Port 22
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

### 数据库安全
- 仅监听本地连接 (`listen_addresses = 'localhost'`)
- 使用强密码和md5认证
- 定期备份数据库
- 限制用户权限

### 防火墙规则
- 最小权限原则，仅开放必要端口
- 定期审查防火墙规则
- 监控异常访问

## 💾 备份和恢复策略

### 自动备份脚本
```bash
# 数据库备份脚本: ~/scripts/backup/db_backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U deploy personal_site > $BACKUP_DIR/personal_site_$DATE.sql
find $BACKUP_DIR -name "personal_site_*.sql" -mtime +7 -delete

echo "Database backup completed: personal_site_$DATE.sql"
```

### 定时任务配置
```bash
# 编辑crontab
crontab -e

# 每日凌晨2点备份数据库
0 2 * * * /home/deploy/scripts/backup/db_backup.sh

# 每日凌晨3点备份文件
0 3 * * * /home/deploy/scripts/backup/files_backup.sh
```

## ⚠️ 已知问题和解决方案

### 已解决的问题
- **Strapi 5.x API 404错误**: 通过Document Service API迁移完全解决
- **8个内容类型**: 全部创建并测试通过 (social-links, tags, blog-posts, photos, photo-albums, projects, albums, media-works)
- **权限配置**: Public和Authenticated角色权限配置完成

### 待完成配置
- **Nginx反向代理**: 配置文件尚未创建
- **SSL证书**: 待配置 (Cloudflare或Let's Encrypt)
- **PM2生产配置**: 内存限制需根据实际优化
- **Redis缓存**: 已安装但未启用
- **RAG聊天机器人**: FastAPI服务待部署(端口8000)

### 版本兼容性
- **Strapi 5.x**: Document Service API完全兼容
- **Node.js 22.17.1**: 满足Strapi 5.x要求
- **PostgreSQL 15.12**: 生产级稳定版本

## 🚨 故障排除指南

### 应用无法启动
```bash
# 1. 检查PM2状态
pm2 status
pm2 logs

# 2. 检查端口占用
sudo ss -tlnp | grep :3000
sudo ss -tlnp | grep :1337

# 3. 检查依赖
cd ~/personal-site/backend && npm list
cd ~/personal-site/frontend && npm list
```

### 数据库连接问题
```bash
# 1. 检查PostgreSQL状态
sudo systemctl status postgresql

# 2. 测试连接
psql -h localhost -U deploy -d personal_site -c "SELECT 1;"

# 3. 检查配置
sudo cat /var/lib/pgsql/data/pg_hba.conf | grep -E "^(local|host)"
```

### 网络访问问题
```bash
# 1. 检查Nginx状态
sudo systemctl status nginx
sudo nginx -t

# 2. 检查防火墙
sudo firewall-cmd --list-all

# 3. 检查端口监听
sudo ss -tlnp | grep :80
```

## 📋 环境同步检查清单

### 开发环境检查
- [ ] Node.js 版本: v22.17.1
- [ ] npm 版本: 10.9.2
- [ ] PostgreSQL 运行正常
- [ ] 前端构建无错误
- [ ] 后端启动无错误
- [ ] API 端点响应正常

### 生产环境检查
- [ ] 所有系统服务运行正常
- [ ] PM2 应用状态正常
- [ ] Nginx 代理配置正确
- [ ] 防火墙规则配置正确
- [ ] 备份脚本运行正常
- [ ] 日志文件正常轮转

## 📞 紧急联系和重要信息

### 服务器访问
- **公网IP**: 172.96.193.211
- **SSH端口**: 22
- **部署用户**: deploy
- **数据库密码**: 20020213Lx

### 重要文件位置
- **SSH私钥**: ~/.ssh/id_rsa (本地)
- **项目目录**: /home/deploy/personal-site
- **配置备份**: /home/deploy/personal-site/deployment
- **数据库备份**: /home/deploy/backups

---

## 📝 更新记录

| 日期 | 版本 | 更新内容 | 更新人 |
|------|------|----------|---------|
| 2025-08-09 | 1.1 | 核查并更新配置信息，标注待配置项，添加RAG系统端口 | Claude |
| 2025-01-23 | 1.0 | 合并兼容性报告和服务器管理文档，建立统一环境标准 | Claude |

---

**重要提示**: 本文档为双端环境同步的权威文档。任何环境变更都必须在此文档中记录，确保开发和生产环境完全一致。