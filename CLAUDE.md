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

### 核心交互特性（2025-08-04更新）

- **浮动导航栏**: 
  - 鼠标位置响应的智能缩放（最大放大15%）
  - 椭圆形检测区域（350x150px）
  - 余弦函数字体缩放
  - 支持10个section，桌面端显示5个
  - 滚轮和键盘导航支持

- **主题切换开关**:
  - 与导航栏一致的鼠标位置响应（最大放大12%）
  - 椭圆形检测区域（200x120px）
  - 明/暗/自动三种模式
  - localStorage持久化

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

## 开发命令快速参考

### 调试和检查
- `npm run lint` - 运行ESLint检查
- `npx tsc --noEmit` - TypeScript类型检查
- `npm run build` - 生产构建测试

### 调试流程规范
- **不使用 `npm run dev`** - 用户会手动启动并提供日志反馈
- **最小化修改范围** - 避免连锁反应和依赖问题
- **影响评估警告** - 修改可能影响其他组件时必须发出警告
- **禁止简化规避** - 必须深入调查根本原因，不允许降级实现

## 核心开发原则

### 🚫 禁止简化或规避问题

**必须严格遵循配置文档，展开深入调查直到问题完全解决**

### 🔍 Debug原则 (2025-01-30更新)

**严禁假定式修改和碰运气式解决方案**

1. **系统性调查** - 在修改代码前必须先调查根本原因
2. **禁止假定** - 不允许基于假设进行修改来"试试看"
3. **逐步验证** - 每个调查步骤都要有明确的验证结果
4. **记录过程** - 调查过程和发现必须记录在文档中

1. **严格执行Phase配置** - 所有实现必须完全按照 `docs/phase_*_config.md` 规范
2. **禁止降级实现** - 不允许为规避技术难题而采用简化替代方案
3. **深入调查根因** - 遇到问题必须系统性调查，不允许临时workaround
4. **架构完整性** - 确保所有组件按设计文档的完整架构实现

### 🔍 问题解决流程

当遇到技术问题时，必须按以下步骤系统性解决：

#### 1. 问题识别和分类
- **错误类型分析**: TypeScript编译错误、ESLint规则、构建失败、运行时错误
- **影响范围评估**: 单一组件、系统架构、配置文件、依赖关系
- **紧急程度判断**: 阻断构建、功能异常、性能问题、代码质量

#### 2. 根因调查
- **查阅配置文档**: 确认当前实现是否符合Phase配置规范
- **检查技术栈兼容性**: Next.js 15、React 19、TypeScript 5、Tailwind 4等版本兼容
- **分析错误堆栈**: 定位具体的代码位置和调用链
- **验证环境配置**: tsconfig.json、next.config.ts、package.json设置

#### 3. 解决方案制定
- **技术方案选择**: 必须选择符合配置文档要求的标准实现方式
- **架构完整性维护**: 确保修复不破坏现有组件架构和设计模式
- **类型安全保证**: 所有修复必须保持严格的TypeScript类型检查通过
- **性能和可维护性**: 解决方案应该符合长期可维护性要求

#### 4. 实施和验证
- **逐步修复验证**: 每次修改后立即运行构建测试
- **回归测试**: 确保修复不引入新的问题
- **文档同步更新**: 如需要，更新相关技术文档

### 技术问题解决参考

具体的技术问题解决案例和实现细节记录在：
- `docs/session-handoff.md` - 当前会话的技术问题和解决方案
- `docs/phase_*_config.md` - 各阶段的详细技术规范
- 代码注释中的问题解决说明

### ✅ 质量标准

- **TypeScript严格模式** - 必须通过所有类型检查
- **ESLint零禁用** - 不允许禁用规则来规避问题  
- **构建零错误** - 生产构建必须完全成功
- **即时修复** - 发现问题立即深入解决，不允许临时workaround
- **架构一致性** - 统一的设计模式和代码风格
- **文档同步** - 代码实现与配置文档保持同步