# 李翔的个人网站

[![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black?logo=next.js)](https://nextjs.org)
[![Strapi](https://img.shields.io/badge/Strapi-5.19.0-blue?logo=strapi)](https://strapi.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

> 一个现代化的个人作品集网站，展示技术项目、摄影作品、博客文章、音乐和电影收藏。

## ✨ 特性

- 🎨 **现代化设计** - 基于 Next.js 15 和 Tailwind CSS 4 的响应式设计
- ⚡ **高性能** - 图片优化、代码分割、懒加载等性能优化
- 🎬 **动画效果** - GSAP + Framer Motion 实现流畅的交互动画
- 📱 **移动友好** - 移动端优先的响应式设计
- 🔐 **安全可靠** - 完整的安全配置和 CORS 设置
- 📊 **内容管理** - 基于 Strapi CMS 的灵活内容管理
- 🚀 **生产就绪** - 完整的部署配置和监控

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: GSAP + Framer Motion
- **状态管理**: Zustand + React Query
- **图标**: 自定义 SVG 图标

### 后端
- **CMS**: Strapi 5.19.0
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **文件存储**: 本地文件系统 + 图片优化
- **API**: RESTful + GraphQL

### 部署
- **服务器**: 搬瓦工 VPS (Rocky Linux 9)
- **Web服务**: Nginx 反向代理
- **进程管理**: PM2
- **SSL**: Let's Encrypt (计划中)

## 📁 项目结构

```
PersonalWebsite/
├── frontend/                    # Next.js 前端应用
│   ├── src/
│   │   ├── app/                # App Router 页面
│   │   ├── components/         # React 组件
│   │   │   ├── ui/            # 基础 UI 组件
│   │   │   ├── sections/      # 页面区块组件
│   │   │   └── layouts/       # 布局组件
│   │   ├── lib/               # 工具库
│   │   │   ├── api/          # API 客户端
│   │   │   └── utils/        # 工具函数
│   │   └── types/            # TypeScript 类型定义
├── backend/                     # Strapi 后端应用
│   ├── src/                    # Strapi 源码
│   ├── config/                # 配置文件
│   └── public/uploads/        # 文件上传目录
├── docs/                       # 项目文档
│   ├── production-environment.md  # 生产环境配置
│   ├── session-handoff.md     # 开发状态快照
│   └── todo.md                # 任务管理
└── Project_Management_Doc/     # 架构设计文档
```

## 🚀 快速开始

### 环境要求

- Node.js 22.17.1
- npm 10.9.2+
- PostgreSQL 15+ (生产环境)

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/Hatsukano02/Personal-Website.git
   cd Personal-Website
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   cd frontend
   npm install

   # 安装后端依赖
   cd ../backend
   npm install
   ```

3. **配置环境变量**
   ```bash
   # 后端环境配置
   cd backend
   cp env.example .env
   # 编辑 .env 文件，配置数据库等信息
   ```

4. **启动开发服务**
   ```bash
   # 启动后端 (端口 1337)
   cd backend
   npm run develop

   # 启动前端 (端口 3000)
   cd frontend
   npm run dev
   ```

5. **访问应用**
   - 前端应用: http://localhost:3000
   - Strapi 管理后台: http://localhost:1337/admin

## 📚 主要功能

### 🏠 主页分段
- **Hero Section** - 开场动画和欢迎信息
- **About** - 个人简介和技能展示
- **Projects** - 技术项目作品集
- **Photography** - 摄影作品展示
- **Blog** - 最新文章预览
- **Music** - 音乐专辑收藏
- **Movies** - 影视作品推荐
- **Media** - 视频音频作品
- **Links** - 社交媒体链接
- **Contact** - 联系方式

### 📝 内容管理
- **博客系统** - 支持 Markdown 的文章发布
- **项目展示** - 技术栈、截图、链接管理
- **摄影作品** - EXIF 数据、标签分类
- **媒体收藏** - 音乐、电影评分和评论
- **文件管理** - 图片优化和多格式支持

## 🔧 开发命令

### 前端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 后端命令
```bash
npm run develop      # 启动开发模式
npm run build        # 构建管理后台
npm run start        # 启动生产模式
strapi console       # Strapi 控制台
```

## 📖 文档

- [生产环境配置](docs/production-environment.md) - 完整的环境配置指南
- [开发指南](CLAUDE.md) - Claude Code 开发指导
- [架构设计](Project_Management_Doc/) - 详细的架构设计文档
- [任务管理](docs/todo.md) - 开发进度追踪

## 🚧 开发状态

### ✅ 已完成
- [x] 项目架构设计和文档
- [x] 前后端基础配置
- [x] TypeScript 类型系统
- [x] API 客户端封装
- [x] 开发环境搭建
- [x] 生产环境配置

### 🔄 进行中
- [ ] Strapi 内容类型创建
- [ ] 主页布局实现
- [ ] 基础组件开发

### 📋 计划中
- [ ] 动画效果实现
- [ ] 博客系统开发
- [ ] 摄影作品展示
- [ ] 性能优化
- [ ] SEO 配置
- [ ] 部署上线

## 🤝 贡献

这是一个个人项目，欢迎提出建议和反馈！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- **GitHub**: [@Hatsukano02](https://github.com/Hatsukano02)
- **Email**: 你的邮箱地址

---

**注意**: 本项目正在积极开发中，部分功能可能尚未完成。
