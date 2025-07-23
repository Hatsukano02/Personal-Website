# CLAUDE.md

这个文件为Claude Code (claude.ai/code)在此代码库中工作时提供指导。

## 项目概述

这是一个个人网站项目，采用全栈架构：

- **前端**: Next.js 15 + TypeScript + Tailwind CSS + GSAP + Framer Motion
- **后端**: Strapi CMS + PostgreSQL 数据库
- **用途**: 个人作品集网站，展示技术项目、摄影作品、博客文章、音乐和电影收藏

## 开发命令

### 前端 (./frontend/)

- `npm run dev` - 启动开发服务器(带 Turbopack)
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint

### 后端 (./backend/)

- `npm run develop` - 开发模式启动 Strapi
- `npm run build` - 构建管理面板
- `npm run start` - 启动生产服务器
- `strapi console` - 访问 Strapi 控制台

## 架构设计

### 项目结构

```text
PersonalWebsite/
├── frontend/          # Next.js 15 应用 (App Router)
├── backend/           # Strapi CMS
├── deployment/        # 部署配置
├── docs/             # 技术文档和项目快照
└── Project_Management_Doc/  # 开发方案文档
```

### 前端架构

- **框架**: Next.js 15 with App Router
- **样式**: Tailwind CSS + CSS Modules(复杂组件)
- **状态管理**: Zustand(客户端状态) + React Query(服务端状态)
- **动画**: GSAP(滚动触发) + Framer Motion(交互动画)
- **主页分段**: Hero、About、Projects、Photography、Blog、Music、Movies、Media、Links、Contact

### 后端架构

- **CMS**: Strapi 4.x 自托管
- **数据库**: PostgreSQL
- **内容类型**: Blog Post、Project、Photo、Album、Movie、Media、Social Links
- **文件存储**: 本地文件系统 + 图片处理(Sharp)

### 核心技术

- 全栈 TypeScript
- PostgreSQL 数据持久化
- Next/Image + Sharp 图片优化
- 移动端优先的响应式设计
- 代码分割和懒加载性能优化

## 文档维护要求

### 开发方案文档 (Project_Management_Doc/)

当技术栈、开发方向、依赖或环境配置发生变动时，必须及时更新此文件夹中的文档：

- `backend-architecture.md` - 后端架构方案
- `frontend-architecture.md` - 前端架构方案
- `execution-roadmap.md` - 项目执行路线图
- `database-design.md` - 数据库设计方案
- `animation-solution.md` - 动画解决方案

### 项目快照文档 (docs/)

完成任何修改、重构、删除、新增操作时，必须维护以下文件：

#### session-handoff.md

- **目的**: 反映项目最新状态的快照文档
- **内容**: 记录关键修改和当前项目状态
- **更新原则**: 重在还原当前状态，不是机械增加记录
- **用途**: 每次 Claude 开启新会话时作为 context 预读取

#### todo.md

- **目的**: 规划后续工作并跨会话监控进度
- **内容**: 专注记录 todo list 的完成状态
- **与 handoff 关系**: handoff 是详细快照，todo 专注任务规划
- **用途**: 每次 Claude 开启新会话时作为 context 预读取

### CLAUDE.md 动态更新

根据项目需求积极更新此文件，确保：

- 开发命令的准确性
- 架构描述与实际代码同步
- 新增功能和技术栈的及时记录
- 开发流程的优化建议

## 内容管理

Strapi 后端管理的内容类型：

- 博客文章(带标签和分类)
- 技术项目(截图和技术栈)
- 摄影作品集(EXIF 数据)
- 音乐专辑收藏
- 电影/电视剧评价
- 媒体文件(视频、音频)
- 社交媒体链接

每种内容类型支持关系映射、元数据和文件附件，针对网络传输进行优化。

## 开发注意事项

- 项目采用 monorepo 结构，前后端分离
- 所有内容通过 Strapi CMS 管理
- 前端通过 Strapi 的 REST/GraphQL API 获取数据
- 动画性能优化采用硬件加速
- 图片处理包括 WebP/AVIF 生成和多尺寸适配
- 网站设计为 VPS 自托管，使用 Nginx + PM2